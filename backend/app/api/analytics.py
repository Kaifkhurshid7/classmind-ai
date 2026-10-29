"""Dashboard overview and teacher analytics."""
import re
import time
from collections import Counter
from datetime import datetime

from flask import Blueprint, jsonify

from app.database import get_db
from app.services.lectures import LECTURE_SELECT, lecture_summary, weak_topics_for

bp = Blueprint("analytics", __name__)


@bp.get("/api/overview")
def overview():
    d = get_db()
    lectures = d.execute(LECTURE_SELECT + "ORDER BY l.created DESC").fetchall()
    summaries = [lecture_summary(d, r) for r in lectures]
    courses = []
    for c in d.execute("SELECT * FROM courses ORDER BY created").fetchall():
        ls = [s for s in summaries if s["course_id"] == c["id"]]
        done = [s for s in ls if s["attempts"]]
        avgs = [s["avg"] for s in ls if s["avg"] is not None]
        courses.append(
            {
                "id": c["id"],
                "name": c["name"],
                "description": c["description"],
                "color": c["color"],
                "lectures": len(ls),
                "progress": round(len(done) * 100 / len(ls)) if ls else 0,
                "avg": round(sum(avgs) / len(avgs)) if avgs else None,
            }
        )
    all_avgs = [s["avg"] for s in summaries if s["avg"] is not None]
    last_chat = d.execute("SELECT lecture_id FROM chats ORDER BY id DESC LIMIT 1").fetchone()
    last_attempt = d.execute("SELECT lecture_id FROM attempts ORDER BY id DESC LIMIT 1").fetchone()
    cont = None
    for row in (last_attempt, last_chat):
        if row:
            cont = next((s for s in summaries if s["id"] == row["lecture_id"]), None)
            if cont:
                break
    if not cont and summaries:
        cont = summaries[0]
    return jsonify(
        {
            "stats": {
                "lectures": len(summaries),
                "courses": len(courses),
                "hours": round(sum(s["duration"] or 0 for s in summaries) / 3600.0, 1),
                "minutes": round(sum(s["duration"] or 0 for s in summaries) / 60.0),
                "quizzes": sum(s["attempts"] for s in summaries),
                "avg": round(sum(all_avgs) / len(all_avgs)) if all_avgs else None,
            },
            "courses": courses,
            "lectures": summaries[:12],
            "continue": cont,
        }
    )


@bp.get("/api/analytics")
def analytics():
    d = get_db()
    lectures = d.execute(LECTURE_SELECT + "ORDER BY l.created DESC").fetchall()
    summaries = [lecture_summary(d, r) for r in lectures]
    per_lecture = [
        {"id": s["id"], "title": s["title"], "course": s["course_name"], "attempts": s["attempts"], "avg": s["avg"], "best": s["best"]}
        for s in summaries
    ]
    avgs = [s["avg"] for s in summaries if s["avg"] is not None]

    qs = d.execute(
        "SELECT c.content, c.lecture_id, c.created, l.title FROM chats c JOIN lectures l ON l.id=c.lecture_id WHERE c.role='user' ORDER BY c.id DESC"
    ).fetchall()
    norm = Counter(re.sub(r"\W+", " ", q["content"].lower()).strip() for q in qs)
    seen, top_questions = set(), []
    for q in qs:
        key = re.sub(r"\W+", " ", q["content"].lower()).strip()
        if key in seen:
            continue
        seen.add(key)
        top_questions.append({"question": q["content"], "count": norm[key], "lecture_id": q["lecture_id"], "lecture": q["title"], "created": q["created"]})
    top_questions.sort(key=lambda x: (-x["count"], -x["created"]))

    # activity over the last 14 days
    day = 86400
    start = int(time.time() // day) * day - 13 * day
    buckets = {start + i * day: 0 for i in range(14)}
    for table, col in (("lectures", "created"), ("attempts", "created"), ("chats", "created")):
        for r in d.execute(f"SELECT {col} AS t FROM {table} WHERE {col}>=?", (start,)).fetchall():
            key = int(r["t"] // day) * day
            if key in buckets:
                buckets[key] += 1
    activity = [{"day": datetime.fromtimestamp(k).strftime("%d %b"), "count": v} for k, v in sorted(buckets.items())]

    return jsonify(
        {
            "totals": {
                "lectures": len(summaries),
                "minutes": round(sum(s["duration"] or 0 for s in summaries) / 60),
                "words": sum(s["words"] for s in summaries),
                "questions": len(qs),
                "attempts": sum(s["attempts"] for s in summaries),
                "avg": round(sum(avgs) / len(avgs)) if avgs else None,
            },
            "per_lecture": per_lecture,
            "weak_topics": weak_topics_for(None, 8),
            "top_questions": top_questions[:8],
            "activity": activity,
        }
    )
