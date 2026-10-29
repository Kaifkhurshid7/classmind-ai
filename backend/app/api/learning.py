"""Student learning features: tutor chat, bookmarks, quizzes and revision plans."""
from flask import Blueprint, abort, jsonify

from app.api.utils import body
from app.database import get_db, jd, jl, now
from app.services import ai_engine
from app.services import quiz as quiz_service
from app.services.lectures import chat_rows, get_lecture_row, weak_topics_for

bp = Blueprint("learning", __name__)


@bp.post("/api/lectures/<int:lid>/ask")
def ask(lid):
    r = get_lecture_row(lid)
    data = body()
    question = (data.get("question") or "").strip()
    if not question:
        abort(400, "Question is empty")
    d = get_db()
    history = [{"role": c["role"], "content": c["content"]} for c in chat_rows(lid)[-6:]]
    res = ai_engine.answer_question(question, r["transcript"], history, mode=data.get("mode") or "")
    d.execute("INSERT INTO chats(lecture_id,role,content,created) VALUES (?,?,?,?)", (lid, "user", data.get("display") or question, now()))
    d.execute("INSERT INTO chats(lecture_id,role,content,created) VALUES (?,?,?,?)", (lid, "assistant", res["answer"], now()))
    d.commit()
    return jsonify(res)


@bp.delete("/api/lectures/<int:lid>/chat")
def clear_chat(lid):
    get_lecture_row(lid)
    d = get_db()
    d.execute("DELETE FROM chats WHERE lecture_id=?", (lid,))
    d.commit()
    return jsonify({"ok": True})


@bp.post("/api/lectures/<int:lid>/bookmarks")
def add_bookmark(lid):
    get_lecture_row(lid)
    data = body()
    text = (data.get("text") or "").strip()
    if not text:
        abort(400, "Bookmark text is empty")
    d = get_db()
    cur = d.execute("INSERT INTO bookmarks(lecture_id,t,text,created) VALUES (?,?,?,?)", (lid, data.get("t"), text[:500], now()))
    d.commit()
    return jsonify({"id": cur.lastrowid, "t": data.get("t"), "text": text[:500]}), 201


@bp.delete("/api/bookmarks/<int:bid>")
def delete_bookmark(bid):
    d = get_db()
    d.execute("DELETE FROM bookmarks WHERE id=?", (bid,))
    d.commit()
    return jsonify({"ok": True})


@bp.post("/api/lectures/<int:lid>/quiz")
def get_quiz(lid):
    r = get_lecture_row(lid)
    data = body()
    quiz = jl(r["quiz"], [])
    if data.get("regenerate") or not quiz:
        notes = jl(r["notes"], {}) or ai_engine.local_analyze(r["transcript"])
        quiz = quiz_service.generate_quiz(notes, r["transcript"], n=int(data.get("n") or 6))
        d = get_db()
        d.execute("UPDATE lectures SET quiz=?, updated=? WHERE id=?", (jd(quiz), now(), lid))
        d.commit()
    # never leak answers up-front: the client gets them only after submitting
    safe = [{"question": q["question"], "options": q["options"], "topic": q.get("topic", "")} for q in quiz]
    return jsonify({"questions": safe})


@bp.post("/api/lectures/<int:lid>/attempts")
def submit_attempt(lid):
    r = get_lecture_row(lid)
    quiz = jl(r["quiz"], [])
    answers = body().get("answers") or []
    if not quiz:
        abort(400, "No quiz")
    details, score = [], 0
    for i, q in enumerate(quiz):
        chosen = answers[i] if i < len(answers) else None
        correct = chosen == q["answer_index"]
        score += 1 if correct else 0
        details.append(
            {
                "question": q["question"],
                "options": q["options"],
                "topic": q.get("topic", "General"),
                "chosen": chosen,
                "answer_index": q["answer_index"],
                "correct": correct,
                "explanation": q.get("explanation", ""),
            }
        )
    d = get_db()
    d.execute("INSERT INTO attempts(lecture_id,score,total,details,created) VALUES (?,?,?,?,?)", (lid, score, len(quiz), jd(details), now()))
    d.commit()
    return jsonify({"score": score, "total": len(quiz), "details": details})


# ---- revision plan ---------------------------------------------------------- #
@bp.post("/api/lectures/<int:lid>/revision")
def revision(lid):
    r = get_lecture_row(lid)
    notes = jl(r["notes"], {})
    weak = [w for w in weak_topics_for(lid, 6) if w["accuracy"] < 0.8]
    qs = [
        c["content"]
        for c in get_db().execute("SELECT content FROM chats WHERE lecture_id=? AND role='user' ORDER BY id DESC LIMIT 5", (lid,)).fetchall()
    ]
    plan = quiz_service.revision_plan(notes, weak, qs)
    plan["weak_topics"] = weak
    return jsonify(plan)
