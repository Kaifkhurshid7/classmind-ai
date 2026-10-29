"""Lecture CRUD, AI (re)analysis and audio upload/streaming."""
import os
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse

from app.api.deps import DB
from app.database import jd, jl, now
from app.responses import AnalyzeOut, Created, LectureDetail, LectureSummary, Ok
from app.schemas import LectureIn, LectureUpdateIn, ReanalyzeIn
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

router = APIRouter(prefix="/api/lectures", tags=["lectures"])

AUDIO_TYPES = {"webm": "audio/webm", "ogg": "audio/ogg", "m4a": "audio/mp4", "wav": "audio/wav"}


@router.get("", response_model=list[LectureSummary], response_model_exclude_unset=True)
def list_lectures(d: DB, q: str = "", course: str | None = None):
    q = q.strip()
    sql, args, where = LECTURE_SELECT, [], []
    if q:
        where.append("(lower(l.title) LIKE ? OR lower(l.transcript) LIKE ? OR lower(l.notes) LIKE ?)")  # lower(): same on SQLite and Postgres
        args += [f"%{q.lower()}%"] * 3
    if course:
        where.append("l.course_id = ?" if course != "none" else "l.course_id IS NULL")
        if course != "none":
            try:
                args.append(int(course))
            except ValueError:
                raise HTTPException(400, "Invalid course") from None
    if where:
        sql += "WHERE " + " AND ".join(where) + " "
    sql += "ORDER BY l.created DESC"
    return [lecture_summary(d, r, q or None) for r in d.execute(sql, args).fetchall()]


@router.post("", status_code=201, response_model=Created)
def create_lecture(body: LectureIn, d: DB):
    transcript = (body.transcript or "").strip()
    if not transcript:
        raise HTTPException(400, "Transcript is empty")
    segments = [
        {"t": s.get("t"), "text": str(s.get("text", ""))} for s in (body.segments or []) if isinstance(s, dict) and s.get("text")
    ]
    title = (body.title or "").strip() or "Untitled lecture " + datetime.now().strftime("%d %b %Y")
    cur = d.execute(
        "INSERT INTO lectures(course_id,title,transcript,segments,duration,lang,created,updated) VALUES (?,?,?,?,?,?,?,?)",
        (body.course_id or None, title[:200], transcript, jd(segments), int(body.duration or 0), body.lang or "en-IN", now(), now()),
    )
    lid = cur.lastrowid
    # quick offline notes immediately, so the lecture is never empty even if AI is slow
    d.execute("UPDATE lectures SET notes=? WHERE id=?", (jd(ai_engine.local_analyze(transcript)), lid))
    d.commit()
    return {"id": lid}


@router.get("/{lid}", response_model=LectureDetail, response_model_exclude_unset=True)
def get_lecture(lid: int, d: DB):
    r = get_lecture_row(d, lid)
    siblings = []
    if r["course_id"]:
        sib = d.execute(LECTURE_SELECT + "WHERE l.course_id=? ORDER BY l.created", (r["course_id"],)).fetchall()
        siblings = [lecture_summary(d, s) for s in sib]
    attempts = [
        {"id": a["id"], "score": a["score"], "total": a["total"], "created": a["created"]}
        for a in d.execute("SELECT * FROM attempts WHERE lecture_id=? ORDER BY id DESC LIMIT 10", (lid,)).fetchall()
    ]
    return {
        "lecture": lecture_full(d, r),
        "bookmarks": bookmark_rows(d, lid),
        "chat": chat_rows(d, lid),
        "attempts": attempts,
        "siblings": siblings,
        "quiz_size": len(jl(r["quiz"], [])),
        "weak_topics": weak_topics_for(d, lid, 5),
    }


@router.put("/{lid}", response_model=Ok)
def update_lecture(lid: int, body: LectureUpdateIn, d: DB):
    r = get_lecture_row(d, lid)
    data = body.model_dump(exclude_unset=True)
    title = (data.get("title") or r["title"]).strip()[:200] or r["title"]
    course_id = data["course_id"] if "course_id" in data else r["course_id"]
    notes = data["notes"] if isinstance(data.get("notes"), dict) else jl(r["notes"], {})
    transcript, segments = r["transcript"], r["segments"]
    new_text = (data.get("transcript") or "").strip()
    if new_text and new_text != (r["transcript"] or "").strip():
        transcript, segments = new_text, "[]"
    d.execute(
        "UPDATE lectures SET title=?, course_id=?, notes=?, transcript=?, segments=?, updated=? WHERE id=?",
        (title, course_id, jd(notes), transcript, segments, now(), lid),
    )
    d.commit()
    return {"ok": True}


@router.delete("/{lid}", response_model=Ok)
def delete_lecture(lid: int, d: DB, request: Request):
    r = get_lecture_row(d, lid)
    if r["audio"]:
        try:
            os.remove(request.app.state.config.audio_dir / r["audio"])
        except OSError:
            pass
    d.execute("DELETE FROM lectures WHERE id=?", (lid,))
    d.commit()
    return {"ok": True}


@router.post("/{lid}/analyze", response_model=AnalyzeOut)
def analyze_lecture(lid: int, d: DB, body: ReanalyzeIn | None = None):
    r = get_lecture_row(d, lid)
    use_ai = not (body and body.offline)
    notes = ai_engine.analyze_lecture(r["transcript"], use_ai=use_ai)
    quiz = quiz_service.generate_quiz(notes, r["transcript"], use_ai=use_ai)
    d.execute("UPDATE lectures SET notes=?, quiz=?, updated=? WHERE id=?", (jd(notes), jd(quiz), now(), lid))
    d.commit()
    return {"notes": notes, "quiz_size": len(quiz)}


@router.post("/{lid}/audio", response_model=Ok)
def upload_audio(lid: int, audio: UploadFile, d: DB, request: Request):
    get_lecture_row(d, lid)
    cfg = request.app.state.config
    ct = (audio.content_type or "").lower()
    ext = "webm"
    if "ogg" in ct:
        ext = "ogg"
    elif "mp4" in ct or "m4a" in ct or "aac" in ct:
        ext = "m4a"
    elif "wav" in ct:
        ext = "wav"
    name = f"{lid}.{ext}"
    path = cfg.audio_dir / name
    size = 0
    with open(path, "wb") as out:
        while chunk := audio.file.read(1024 * 1024):
            size += len(chunk)
            if size > cfg.max_upload_bytes:
                out.close()
                os.remove(path)
                raise HTTPException(413, "Upload too large")
            out.write(chunk)
    d.execute("UPDATE lectures SET audio=? WHERE id=?", (name, lid))
    d.commit()
    return {"ok": True}


@router.get("/{lid}/audio")
def get_audio(lid: int, d: DB, request: Request):
    r = get_lecture_row(d, lid)
    path = request.app.state.config.audio_dir / (r["audio"] or "x")
    if not r["audio"] or not path.exists():
        raise HTTPException(404, "Not found")
    # FileResponse handles Range requests, so the browser can seek inside the recording
    return FileResponse(path, media_type=AUDIO_TYPES.get(r["audio"].rsplit(".", 1)[-1], "application/octet-stream"))
