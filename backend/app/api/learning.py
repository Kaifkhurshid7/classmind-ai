"""Student learning features: tutor chat, bookmarks, quizzes and revision plans."""
from fastapi import APIRouter, HTTPException

from app.api.deps import DB
from app.database import jd, jl, now
from app.responses import AskOut, AttemptResult, BookmarkCreated, Ok, QuizOut, RevisionPlan
from app.schemas import AskIn, AttemptIn, BookmarkIn, QuizIn
from app.services import ai_engine
from app.services import quiz as quiz_service
from app.services.lectures import chat_rows, get_lecture_row, weak_topics_for

router = APIRouter(prefix="/api", tags=["learning"])


@router.post("/lectures/{lid}/ask", response_model=AskOut)
def ask(lid: int, body: AskIn, d: DB):
    r = get_lecture_row(d, lid)
    question = body.question.strip()
    if not question:
        raise HTTPException(400, "Question is empty")
    history = [{"role": c["role"], "content": c["content"]} for c in chat_rows(d, lid)[-6:]]
    res = ai_engine.answer_question(question, r["transcript"], history, mode=body.mode or "")
    d.execute("INSERT INTO chats(lecture_id,role,content,created) VALUES (?,?,?,?)", (lid, "user", body.display or question, now()))
    d.execute("INSERT INTO chats(lecture_id,role,content,created) VALUES (?,?,?,?)", (lid, "assistant", res["answer"], now()))
    d.commit()
    return res


@router.delete("/lectures/{lid}/chat", response_model=Ok)
def clear_chat(lid: int, d: DB):
    get_lecture_row(d, lid)
    d.execute("DELETE FROM chats WHERE lecture_id=?", (lid,))
    d.commit()
    return {"ok": True}


@router.post("/lectures/{lid}/bookmarks", status_code=201, response_model=BookmarkCreated)
def add_bookmark(lid: int, body: BookmarkIn, d: DB):
    get_lecture_row(d, lid)
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "Bookmark text is empty")
    cur = d.execute("INSERT INTO bookmarks(lecture_id,t,text,created) VALUES (?,?,?,?)", (lid, body.t, text[:500], now()))
    d.commit()
    return {"id": cur.lastrowid, "t": body.t, "text": text[:500]}


@router.delete("/bookmarks/{bid}", response_model=Ok)
def delete_bookmark(bid: int, d: DB):
    d.execute("DELETE FROM bookmarks WHERE id=?", (bid,))
    d.commit()
    return {"ok": True}


@router.post("/lectures/{lid}/quiz", response_model=QuizOut)
def get_quiz(lid: int, d: DB, body: QuizIn | None = None):
    body = body or QuizIn()
    r = get_lecture_row(d, lid)
    quiz = jl(r["quiz"], [])
    if body.regenerate or not quiz:
        notes = jl(r["notes"], {}) or ai_engine.local_analyze(r["transcript"])
        quiz = quiz_service.generate_quiz(notes, r["transcript"], n=body.n or 6)
        d.execute("UPDATE lectures SET quiz=?, updated=? WHERE id=?", (jd(quiz), now(), lid))
        d.commit()
    # never leak answers up-front: the client gets them only after submitting
    return {"questions": [{"question": q["question"], "options": q["options"], "topic": q.get("topic", "")} for q in quiz]}


@router.post("/lectures/{lid}/attempts", response_model=AttemptResult)
def submit_attempt(lid: int, body: AttemptIn, d: DB):
    r = get_lecture_row(d, lid)
    quiz = jl(r["quiz"], [])
    if not quiz:
        raise HTTPException(400, "No quiz")
    answers = body.answers
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
    d.execute("INSERT INTO attempts(lecture_id,score,total,details,created) VALUES (?,?,?,?,?)", (lid, score, len(quiz), jd(details), now()))
    d.commit()
    return {"score": score, "total": len(quiz), "details": details}


@router.post("/lectures/{lid}/revision", response_model=RevisionPlan)
def revision(lid: int, d: DB):
    r = get_lecture_row(d, lid)
    notes = jl(r["notes"], {})
    weak = [w for w in weak_topics_for(d, lid, 6) if w["accuracy"] < 0.8]
    qs = [c["content"] for c in d.execute("SELECT content FROM chats WHERE lecture_id=? AND role='user' ORDER BY id DESC LIMIT 5", (lid,)).fetchall()]
    plan = quiz_service.revision_plan(notes, weak, qs)
    plan["weak_topics"] = weak
    return plan
