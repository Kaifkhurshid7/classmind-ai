"""Course CRUD."""
from fastapi import APIRouter, HTTPException

from app.api.deps import DB
from app.database import now
from app.responses import CourseDetail, CourseOut, Ok
from app.schemas import CourseIn
from app.services.lectures import LECTURE_SELECT, lecture_summary

COLORS = ["#0056d2", "#0e7c66", "#7a3fc4", "#c2570c", "#b4234f", "#2b6cb0", "#4a5568"]

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("", response_model=list[CourseOut])
def list_courses(d: DB):
    return [dict(r) for r in d.execute("SELECT * FROM courses ORDER BY created").fetchall()]


@router.post("", status_code=201, response_model=CourseOut)
def create_course(body: CourseIn, d: DB):
    name = (body.name or "").strip()
    if not name:
        raise HTTPException(400, "Course name is required")
    count = d.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
    color = body.color or COLORS[count % len(COLORS)]
    cur = d.execute(
        "INSERT INTO courses(name,description,color,instructor,instructor_title,created) VALUES (?,?,?,?,?,?)",
        (
            name[:120],
            (body.description or "")[:500],
            color,
            (body.instructor or "").strip()[:120],
            (body.instructor_title or "").strip()[:160],
            now(),
        ),
    )
    d.commit()
    return dict(d.execute("SELECT * FROM courses WHERE id=?", (cur.lastrowid,)).fetchone())


@router.get("/{cid}", response_model=CourseDetail, response_model_exclude_unset=True)
def get_course(cid: int, d: DB):
    c = d.execute("SELECT * FROM courses WHERE id=?", (cid,)).fetchone()
    if not c:
        raise HTTPException(404, "Not found")
    ls = d.execute(LECTURE_SELECT + "WHERE l.course_id=? ORDER BY l.created", (cid,)).fetchall()
    summaries = [lecture_summary(d, r) for r in ls]
    done = [s for s in summaries if s["attempts"]]
    avgs = [s["avg"] for s in summaries if s["avg"] is not None]
    return {
        **dict(c),
        "lectures": summaries,
        "progress": round(len(done) * 100 / len(summaries)) if summaries else 0,
        "avg": round(sum(avgs) / len(avgs)) if avgs else None,
        "hours": round(sum(s["duration"] or 0 for s in summaries) / 3600.0, 1),
        "minutes": round(sum(s["duration"] or 0 for s in summaries) / 60.0),
    }


@router.put("/{cid}", response_model=CourseOut)
def update_course(cid: int, body: CourseIn, d: DB):
    data = body.model_dump(exclude_unset=True)
    c = d.execute("SELECT * FROM courses WHERE id=?", (cid,)).fetchone()
    if not c:
        raise HTTPException(404, "Not found")

    def keep(field: str) -> str:
        return (data[field] if field in data else c[field]) or ""

    d.execute(
        "UPDATE courses SET name=?, description=?, color=?, instructor=?, instructor_title=? WHERE id=?",
        (
            (data.get("name") or c["name"]).strip()[:120],
            keep("description")[:500],
            data.get("color") or c["color"],
            keep("instructor").strip()[:120],
            keep("instructor_title").strip()[:160],
            cid,
        ),
    )
    d.commit()
    return dict(d.execute("SELECT * FROM courses WHERE id=?", (cid,)).fetchone())


@router.delete("/{cid}", response_model=Ok)
def delete_course(cid: int, d: DB):
    d.execute("DELETE FROM courses WHERE id=?", (cid,))
    d.commit()
    return {"ok": True}
