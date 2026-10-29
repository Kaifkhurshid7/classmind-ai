"""Lecture/query helpers shared by several API blueprints."""
from collections import defaultdict

from flask import abort

from app.database import get_db, jl
from app.services import ai_engine

LECTURE_SELECT = (
    "SELECT l.*, c.name AS course_name, c.color AS course_color, "
    "c.instructor AS instructor, c.instructor_title AS instructor_title "
    "FROM lectures l LEFT JOIN courses c ON c.id = l.course_id "
)


def make_segments(transcript: str):
    sents = ai_engine.split_sentences(transcript)
    return [{"t": None, "text": " ".join(sents[i : i + 3])} for i in range(0, len(sents), 3)]


def attempt_stats(db_, lecture_id):
    rows = db_.execute("SELECT score,total FROM attempts WHERE lecture_id=?", (lecture_id,)).fetchall()
    pcts = [r["score"] * 100.0 / r["total"] for r in rows if r["total"]]
    return {
        "attempts": len(rows),
        "best": round(max(pcts)) if pcts else None,
        "avg": round(sum(pcts) / len(pcts)) if pcts else None,
    }


def lecture_summary(db_, r, snippet_q=None):
    notes = jl(r["notes"], {})
    d = {
        "id": r["id"],
        "course_id": r["course_id"],
        "course_name": r["course_name"] if "course_name" in r.keys() else None,
        "course_color": r["course_color"] if "course_color" in r.keys() else None,
        "instructor": (r["instructor"] if "instructor" in r.keys() else None) or None,
        "instructor_title": (r["instructor_title"] if "instructor_title" in r.keys() else None) or None,
        "title": r["title"],
        "duration": r["duration"],
        "created": r["created"],
        "updated": r["updated"],
        "lang": r["lang"],
        "has_audio": bool(r["audio"]),
        "words": len((r["transcript"] or "").split()),
        "summary": notes.get("summary", ""),
        "concepts": len(notes.get("concepts", [])),
        **attempt_stats(db_, r["id"]),
    }
    if snippet_q:
        text = r["transcript"] or ""
        i = text.lower().find(snippet_q.lower())
        if i >= 0:
            a, b = max(0, i - 70), min(len(text), i + len(snippet_q) + 90)
            d["snippet"] = ("…" if a else "") + text[a:b] + ("…" if b < len(text) else "")
    return d


def get_lecture_row(lid):
    r = get_db().execute(LECTURE_SELECT + "WHERE l.id=?", (lid,)).fetchone()
    if not r:
        abort(404)
    return r


def lecture_full(r):
    d = lecture_summary(get_db(), r)
    segs = jl(r["segments"], [])
    d.update(
        {
            "transcript": r["transcript"] or "",
            "segments": segs or make_segments(r["transcript"] or ""),
            "notes": jl(r["notes"], {}),
        }
    )
    return d


def chat_rows(lid, limit=200):
    rows = get_db().execute("SELECT id,role,content,created FROM chats WHERE lecture_id=? ORDER BY id LIMIT ?", (lid, limit)).fetchall()
    return [dict(x) for x in rows]


def bookmark_rows(lid):
    rows = get_db().execute("SELECT id,t,text,created FROM bookmarks WHERE lecture_id=? ORDER BY COALESCE(t,0), id", (lid,)).fetchall()
    return [dict(x) for x in rows]


def weak_topics_for(lid=None, limit=8):
    q = "SELECT details FROM attempts" + (" WHERE lecture_id=?" if lid else "")
    rows = get_db().execute(q, (lid,) if lid else ()).fetchall()
    agg = defaultdict(lambda: [0, 0])
    for r in rows:
        for d in jl(r["details"], []):
            t = d.get("topic") or "General"
            agg[t][1] += 1
            agg[t][0] += 1 if d.get("correct") else 0
    out = [{"topic": t, "correct": c, "total": n, "accuracy": c / n} for t, (c, n) in agg.items() if n]
    out.sort(key=lambda x: (x["accuracy"], -x["total"]))
    return out[:limit]
