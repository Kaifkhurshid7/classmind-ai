"""Course CRUD."""
from flask import Blueprint, abort, jsonify

from app.api.utils import body
from app.database import get_db, now
from app.services.lectures import LECTURE_SELECT, lecture_summary

COLORS = ["#0056d2", "#0e7c66", "#7a3fc4", "#c2570c", "#b4234f", "#2b6cb0", "#4a5568"]

bp = Blueprint("courses", __name__)


@bp.get("/api/courses")
def list_courses():
    return jsonify([dict(r) for r in get_db().execute("SELECT * FROM courses ORDER BY created").fetchall()])


@bp.post("/api/courses")
def create_course():
    data = body()
    name = (data.get("name") or "").strip()
    if not name:
        abort(400, "Course name is required")
    d = get_db()
    count = d.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
    color = data.get("color") or COLORS[count % len(COLORS)]
    cur = d.execute(
        "INSERT INTO courses(name,description,color,created) VALUES (?,?,?,?)",
        (name[:120], (data.get("description") or "")[:500], color, now()),
    )
    d.commit()
    return jsonify(dict(d.execute("SELECT * FROM courses WHERE id=?", (cur.lastrowid,)).fetchone())), 201


@bp.get("/api/courses/<int:cid>")
def get_course(cid):
    d = get_db()
    c = d.execute("SELECT * FROM courses WHERE id=?", (cid,)).fetchone()
    if not c:
        abort(404)
    ls = d.execute(LECTURE_SELECT + "WHERE l.course_id=? ORDER BY l.created", (cid,)).fetchall()
    summaries = [lecture_summary(d, r) for r in ls]
    done = [s for s in summaries if s["attempts"]]
    avgs = [s["avg"] for s in summaries if s["avg"] is not None]
    return jsonify(
        {
            **dict(c),
            "lectures": summaries,
            "progress": round(len(done) * 100 / len(summaries)) if summaries else 0,
            "avg": round(sum(avgs) / len(avgs)) if avgs else None,
            "hours": round(sum(s["duration"] or 0 for s in summaries) / 3600.0, 1),
            "minutes": round(sum(s["duration"] or 0 for s in summaries) / 60.0),
        }
    )


@bp.put("/api/courses/<int:cid>")
def update_course(cid):
    data = body()
    d = get_db()
    c = d.execute("SELECT * FROM courses WHERE id=?", (cid,)).fetchone()
    if not c:
        abort(404)
    d.execute(
        "UPDATE courses SET name=?, description=?, color=? WHERE id=?",
        ((data.get("name") or c["name"]).strip()[:120], data.get("description", c["description"])[:500], data.get("color") or c["color"], cid),
    )
    d.commit()
    return jsonify(dict(d.execute("SELECT * FROM courses WHERE id=?", (cid,)).fetchone()))


@bp.delete("/api/courses/<int:cid>")
def delete_course(cid):
    d = get_db()
    d.execute("DELETE FROM courses WHERE id=?", (cid,))
    d.commit()
    return jsonify({"ok": True})
