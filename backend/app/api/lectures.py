"""Lecture CRUD, AI (re)analysis and audio upload/streaming."""
import os
from datetime import datetime

from flask import Blueprint, abort, current_app, jsonify, request, send_file

from app.api.utils import body
from app.database import get_db, jd, jl, now
from app.services import ai_engine
from app.services import quiz as quiz_service
from app.services.lectures import (
    LECTURE_SELECT,
    bookmark_rows,
    chat_rows,
    get_lecture_row,
    lecture_full,
    lecture_summary,
    weak_topics_for,
)

bp = Blueprint("lectures", __name__)


@bp.get("/api/lectures")
def list_lectures():
    q = (request.args.get("q") or "").strip()
    course = request.args.get("course")
    sql, args, where = LECTURE_SELECT, [], []
    if q:
        where.append("(l.title LIKE ? OR l.transcript LIKE ? OR l.notes LIKE ?)")
        args += [f"%{q}%"] * 3
    if course:
        where.append("l.course_id = ?" if course != "none" else "l.course_id IS NULL")
        if course != "none":
            args.append(int(course))
    if where:
        sql += "WHERE " + " AND ".join(where) + " "
    sql += "ORDER BY l.created DESC"
    d = get_db()
    return jsonify([lecture_summary(d, r, q or None) for r in d.execute(sql, args).fetchall()])


@bp.post("/api/lectures")
def create_lecture():
    data = body()
    transcript = (data.get("transcript") or "").strip()
    if not transcript:
        abort(400, "Transcript is empty")
    segments = [
        {"t": s.get("t"), "text": str(s.get("text", ""))}
        for s in (data.get("segments") or [])
        if isinstance(s, dict) and s.get("text")
    ]
    title = (data.get("title") or "").strip() or "Untitled lecture " + datetime.now().strftime("%d %b %Y")
    course_id = data.get("course_id") or None
    d = get_db()
    cur = d.execute(
        "INSERT INTO lectures(course_id,title,transcript,segments,duration,lang,created,updated) VALUES (?,?,?,?,?,?,?,?)",
        (course_id, title[:200], transcript, jd(segments), int(data.get("duration") or 0), data.get("lang") or "en-IN", now(), now()),
    )
    lid = cur.lastrowid
    # quick offline notes immediately, so the lecture is never empty even if AI is slow
    notes = ai_engine.local_analyze(transcript)
    d.execute("UPDATE lectures SET notes=? WHERE id=?", (jd(notes), lid))
    d.commit()
    return jsonify({"id": lid}), 201


@bp.get("/api/lectures/<int:lid>")
def get_lecture(lid):
    r = get_lecture_row(lid)
    lec = lecture_full(r)
    d = get_db()
    siblings = []
    if r["course_id"]:
        sib = d.execute(LECTURE_SELECT + "WHERE l.course_id=? ORDER BY l.created", (r["course_id"],)).fetchall()
        siblings = [lecture_summary(d, s) for s in sib]
    attempts = [
        {"id": a["id"], "score": a["score"], "total": a["total"], "created": a["created"]}
        for a in d.execute("SELECT * FROM attempts WHERE lecture_id=? ORDER BY id DESC LIMIT 10", (lid,)).fetchall()
    ]
    quiz = jl(r["quiz"], [])
    return jsonify(
        {
            "lecture": lec,
            "bookmarks": bookmark_rows(lid),
            "chat": chat_rows(lid),
            "attempts": attempts,
            "siblings": siblings,
            "quiz_size": len(quiz),
            "weak_topics": weak_topics_for(lid, 5),
        }
    )


@bp.put("/api/lectures/<int:lid>")
def update_lecture(lid):
    r = get_lecture_row(lid)
    data = body()
    d = get_db()
    title = (data.get("title") or r["title"]).strip()[:200] or r["title"]
    course_id = data["course_id"] if "course_id" in data else r["course_id"]
    notes = data["notes"] if isinstance(data.get("notes"), dict) else jl(r["notes"], {})
    transcript, segments = r["transcript"], r["segments"]
    if isinstance(data.get("transcript"), str) and data["transcript"].strip() and data["transcript"].strip() != (r["transcript"] or "").strip():
        transcript, segments = data["transcript"].strip(), "[]"
    d.execute(
        "UPDATE lectures SET title=?, course_id=?, notes=?, transcript=?, segments=?, updated=? WHERE id=?",
        (title, course_id, jd(notes), transcript, segments, now(), lid),
    )
    d.commit()
    return jsonify({"ok": True})


@bp.delete("/api/lectures/<int:lid>")
def delete_lecture(lid):
    r = get_lecture_row(lid)
    if r["audio"]:
        try:
            os.remove(os.path.join(current_app.config["AUDIO_DIR"], r["audio"]))
        except OSError:
            pass
    d = get_db()
    d.execute("DELETE FROM lectures WHERE id=?", (lid,))
    d.commit()
    return jsonify({"ok": True})


@bp.post("/api/lectures/<int:lid>/analyze")
def analyze_lecture(lid):
    r = get_lecture_row(lid)
    data = body()
    notes = ai_engine.analyze_lecture(r["transcript"], use_ai=not data.get("offline"))
    quiz = quiz_service.generate_quiz(notes, r["transcript"], use_ai=not data.get("offline"))
    d = get_db()
    d.execute("UPDATE lectures SET notes=?, quiz=?, updated=? WHERE id=?", (jd(notes), jd(quiz), now(), lid))
    d.commit()
    return jsonify({"notes": notes, "quiz_size": len(quiz)})


@bp.post("/api/lectures/<int:lid>/audio")
def upload_audio(lid):
    get_lecture_row(lid)
    f = request.files.get("audio")
    if not f:
        abort(400, "No audio file")
    ext = "webm"
    ct = (f.mimetype or "").lower()
    if "ogg" in ct:
        ext = "ogg"
    elif "mp4" in ct or "m4a" in ct or "aac" in ct:
        ext = "m4a"
    elif "wav" in ct:
        ext = "wav"
    name = f"{lid}.{ext}"
    f.save(os.path.join(current_app.config["AUDIO_DIR"], name))
    d = get_db()
    d.execute("UPDATE lectures SET audio=? WHERE id=?", (name, lid))
    d.commit()
    return jsonify({"ok": True})


@bp.get("/api/lectures/<int:lid>/audio")
def get_audio(lid):
    r = get_lecture_row(lid)
    if not r["audio"]:
        abort(404)
    path = os.path.join(current_app.config["AUDIO_DIR"], r["audio"])
    if not os.path.exists(path):
        abort(404)
    ext = r["audio"].rsplit(".", 1)[-1]
    mt = {"webm": "audio/webm", "ogg": "audio/ogg", "m4a": "audio/mp4", "wav": "audio/wav"}.get(ext, "application/octet-stream")
    return send_file(path, mimetype=mt, conditional=True)
