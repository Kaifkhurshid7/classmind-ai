"""Dashboard overview and teacher analytics."""

import re
import time
from collections import Counter
from datetime import datetime

from fastapi import APIRouter

from app.api.deps import DB
from app.responses import Analytics, Overview
from app.services.lectures import LECTURE_SELECT, lecture_summary, weak_topics_for

router = APIRouter(prefix="/api", tags=["analytics"])


@router.get("/overview", response_model=Overview, response_model_exclude_unset=True)
def overview(d: DB):
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
                "instructor": c["instructor"] or None,
                "instructor_title": c["instructor_title"] or None,
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
    return {
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


DAY = 86400


def _pct(score, total):
    return round(score * 100.0 / total) if total else 0


def _change(cur, prev):
    """Percentage change between two periods, or None when there is no baseline."""
    return None if not prev else round((cur - prev) * 100.0 / prev)


def _avg(values):
    return round(sum(values) / len(values)) if values else None


@router.get("/analytics", response_model=Analytics, response_model_exclude_unset=True)
def analytics(d: DB):
    now_ts = time.time()
    today = int(now_ts // DAY) * DAY
    lectures = d.execute(LECTURE_SELECT + "ORDER BY l.created DESC").fetchall()
    summaries = [lecture_summary(d, r) for r in lectures]
    per_lecture = [
        {
            "id": s["id"],
            "title": s["title"],
            "course": s["course_name"],
            "course_color": s["course_color"],
            "attempts": s["attempts"],
            "avg": s["avg"],
            "best": s["best"],
        }
        for s in summaries
    ]
    avgs = [s["avg"] for s in summaries if s["avg"] is not None]

    qs = d.execute(
        "SELECT c.content, c.lecture_id, c.created, l.title, l.course_id FROM chats c JOIN lectures l ON l.id=c.lecture_id WHERE c.role='user' ORDER BY c.id DESC"
    ).fetchall()
    norm = Counter(re.sub(r"\W+", " ", q["content"].lower()).strip() for q in qs)
    seen, top_questions = set(), []
    for q in qs:
        key = re.sub(r"\W+", " ", q["content"].lower()).strip()
        if key in seen:
            continue
        seen.add(key)
        top_questions.append(
            {"question": q["content"], "count": norm[key], "lecture_id": q["lecture_id"], "lecture": q["title"], "created": q["created"]}
        )
    top_questions.sort(key=lambda x: (-x["count"], -x["created"]))

    attempts = d.execute(
        "SELECT a.id, a.lecture_id, a.score, a.total, a.created, l.title, l.course_id FROM attempts a JOIN lectures l ON l.id=a.lecture_id ORDER BY a.created"
    ).fetchall()

    # ---- activity: lectures recorded, quizzes taken, questions asked per day (last 30 days) ----
    start30 = today - 29 * DAY
    days = {start30 + i * DAY: {"lectures": 0, "quizzes": 0, "questions": 0} for i in range(30)}

    def bump(ts, kind):
        key = int(ts // DAY) * DAY
        if key in days:
            days[key][kind] += 1

    for r in lectures:
        bump(r["created"], "lectures")
    for a in attempts:
        bump(a["created"], "quizzes")
    for q in qs:
        bump(q["created"], "questions")
    activity_30 = [
        {
            "day": datetime.fromtimestamp(k).strftime("%d %b"),
            "date": datetime.fromtimestamp(k).strftime("%a %d %b"),
            **v,
            "count": sum(v.values()),
        }
        for k, v in sorted(days.items())
    ]
    activity = activity_30[-14:]  # kept for the simple 14-day view

    # ---- score trend: average quiz score per day (None when nobody took a quiz) ----
    by_day = {}
    for a in attempts:
        key = int(a["created"] // DAY) * DAY
        if key >= start30:
            by_day.setdefault(key, []).append(_pct(a["score"], a["total"]))
    trend = [
        {"day": datetime.fromtimestamp(k).strftime("%d %b"), "avg": _avg(by_day.get(k, [])), "attempts": len(by_day.get(k, []))}
        for k in sorted(days)
    ]

    # ---- period comparisons for the KPI cards (this week vs the week before) ----
    wk = 7 * DAY
    this_w, prev_w = now_ts - wk, now_ts - 2 * wk
    att_this = [a for a in attempts if a["created"] >= this_w]
    att_prev = [a for a in attempts if prev_w <= a["created"] < this_w]
    q_this = sum(1 for q in qs if q["created"] >= this_w)
    q_prev = sum(1 for q in qs if prev_w <= q["created"] < this_w)
    avg_this = _avg([_pct(a["score"], a["total"]) for a in att_this])
    avg_prev = _avg([_pct(a["score"], a["total"]) for a in att_prev])
    practised = sum(1 for s in summaries if s["attempts"])

    kpis = {
        "attempts_week": len(att_this),
        "attempts_change": _change(len(att_this), len(att_prev)),
        "questions_week": q_this,
        "questions_change": _change(q_this, q_prev),
        "avg_week": avg_this,
        "avg_change": (avg_this - avg_prev) if avg_this is not None and avg_prev is not None else None,  # in points
        "practised_pct": round(practised * 100 / len(summaries)) if summaries else 0,
        "practised": practised,
    }

    # ---- distribution of attempt scores ----
    buckets = [("0 to 39%", 0, 39), ("40 to 59%", 40, 59), ("60 to 79%", 60, 79), ("80 to 100%", 80, 100)]
    pcts = [_pct(a["score"], a["total"]) for a in attempts]
    distribution = [{"label": label, "count": sum(1 for p in pcts if lo <= p <= hi)} for label, lo, hi in buckets]

    # ---- course comparison ----
    by_course = []
    for c in d.execute("SELECT * FROM courses ORDER BY created").fetchall():
        ls = [s for s in summaries if s["course_id"] == c["id"]]
        c_att = [a for a in attempts if a["course_id"] == c["id"]]
        by_course.append(
            {
                "id": c["id"],
                "name": c["name"],
                "color": c["color"],
                "instructor": c["instructor"] or None,
                "lectures": len(ls),
                "attempts": len(c_att),
                "questions": sum(1 for q in qs if q["course_id"] == c["id"]),
                "avg": _avg([_pct(a["score"], a["total"]) for a in c_att]),
                "practised": round(sum(1 for s in ls if s["attempts"]) * 100 / len(ls)) if ls else 0,
            }
        )

    # ---- recent activity feed ----
    events = []
    for r in lectures[:6]:
        events.append({"type": "lecture", "when": r["created"], "text": f"Lecture recorded: {r['title']}", "lecture_id": r["id"]})
    for a in attempts[-12:]:
        events.append(
            {
                "type": "quiz",
                "when": a["created"],
                "text": f"Quiz scored {_pct(a['score'], a['total'])}% on {a['title']}",
                "lecture_id": a["lecture_id"],
                "score": _pct(a["score"], a["total"]),
            }
        )
    for q in qs[:12]:
        events.append({"type": "question", "when": q["created"], "text": f"Asked the tutor: {q['content']}", "lecture_id": q["lecture_id"]})
    events.sort(key=lambda e: -e["when"])

    return {
        "totals": {
            "lectures": len(summaries),
            "minutes": round(sum(s["duration"] or 0 for s in summaries) / 60),
            "words": sum(s["words"] for s in summaries),
            "questions": len(qs),
            "attempts": sum(s["attempts"] for s in summaries),
            "avg": round(sum(avgs) / len(avgs)) if avgs else None,
        },
        "kpis": kpis,
        "per_lecture": per_lecture,
        "by_course": by_course,
        "weak_topics": weak_topics_for(d, None, 8),
        "top_questions": top_questions[:8],
        "activity": activity,
        "activity_30": activity_30,
        "trend": trend,
        "distribution": distribution,
        "recent": events[:10],
    }
