"""Demo content so the app is not empty on first run (disable with CLASSMIND_SEED=0).

Populates courses with faculty details, lectures with realistic transcripts and
curated notes, plus quiz attempts, tutor conversations and bookmarks spread over
the last few weeks so the dashboard and analytics have something to show.

    python -m app.seed --reset     # wipe and re-create the demo data
"""
import random
import sys
import zlib
from datetime import datetime

from app import database as db
from app.demo_data import COURSES, LECTURES
from app.services import ai_engine
from app.services import quiz as quiz_service

DAY = 86400
WORDS_PER_SECOND = 2.0  # about 120 words a minute: a natural lecturing pace with pauses


def make_segments(transcript: str):
    """Timestamp each sentence by its length, as if spoken at a natural pace."""
    t, segs = 0.0, []
    for s in ai_engine.split_sentences(transcript):
        segs.append({"t": round(t, 1), "text": s})
        t += max(2.0, len(s.split()) / WORDS_PER_SECOND)
    return segs, int(t)


def _attempt_details(quiz, rnd, skill, weak_topic):
    """Simulate a student's answers: weaker on one topic, stronger with more practice."""
    details, score = [], 0
    for q in quiz:
        p = skill - (0.35 if q.get("topic") == weak_topic else 0)
        correct = rnd.random() < p
        n = len(q["options"])
        chosen = q["answer_index"] if correct else rnd.choice([i for i in range(n) if i != q["answer_index"]])
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
    return details, score


def _recent(rnd, now, floor, days=28):
    """A random moment in the last `days` days (not before `floor`), busier on weekdays."""
    start = max(floor + 3600, now - days * DAY)
    t = rnd.uniform(start, now - 600)
    for _ in range(6):
        if datetime.fromtimestamp(t).weekday() < 5 or rnd.random() < 0.2:
            break
        t = rnd.uniform(start, now - 600)
    return t


def seed_demo(db_url, force=False):
    conn = db.connect(db_url)
    try:
        has_data = conn.execute("SELECT COUNT(*) FROM lectures").fetchone()[0] or conn.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
        if has_data and not force:
            return
        now = db.now()

        course_ids = {}
        for i, c in enumerate(COURSES):
            cur = conn.execute(
                "INSERT INTO courses(name,description,color,instructor,instructor_title,created) VALUES (?,?,?,?,?,?)",
                (c["name"], c["description"], c["color"], c["instructor"], c["instructor_title"], now - 40 * DAY + i),
            )
            course_ids[c["key"]] = cur.lastrowid

        for lec in LECTURES:
            rnd = random.Random(zlib.crc32(lec["title"].encode("utf-8")))
            text = lec["transcript"]
            segs, duration = make_segments(text)
            notes = {**lec["notes"], "engine": "demo", "engine_note": "Sample content for demonstration"}
            quiz = quiz_service.generate_quiz(notes, text, use_ai=False)
            created = now - lec["days_ago"] * DAY + rnd.uniform(0, 6 * 3600)

            cur = conn.execute(
                "INSERT INTO lectures(course_id,title,transcript,segments,notes,quiz,duration,lang,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (course_ids[lec["course"]], lec["title"], text, db.jd(segs), db.jd(notes), db.jd(quiz), duration, lec["lang"], created, created),
            )
            lid = cur.lastrowid

            # Bookmarks: two moments a student would want to revisit
            substantial = [x for x in segs[3:] if 10 <= len(x["text"].split()) <= 32]
            for seg in rnd.sample(substantial, k=min(2, len(substantial))):
                conn.execute(
                    "INSERT INTO bookmarks(lecture_id,t,text,created) VALUES (?,?,?,?)",
                    (lid, seg["t"], seg["text"], _recent(rnd, now, created)),
                )

            # Tutor conversations (answers come from the offline engine, grounded in the transcript).
            # Some questions are asked again by other students, so "most asked" has real counts.
            history = []
            asked = list(lec.get("chat", []))
            asked += [q for q in lec.get("chat", []) if rnd.random() < 0.55 for _ in range(rnd.randint(1, 3))]
            for question in asked:
                when = _recent(rnd, now, created)
                answer = ai_engine.answer_question(question, text, history, use_ai=False)["answer"]
                conn.execute("INSERT INTO chats(lecture_id,role,content,created) VALUES (?,?,?,?)", (lid, "user", question, when))
                conn.execute("INSERT INTO chats(lecture_id,role,content,created) VALUES (?,?,?,?)", (lid, "assistant", answer, when + 4))
                history = (history + [{"role": "user", "content": question}, {"role": "assistant", "content": answer}])[-6:]

            # Quiz attempts that improve over time, with one weaker topic per lecture
            topics = sorted({q.get("topic", "General") for q in quiz})
            weak = rnd.choice(topics) if topics else None
            attempts = lec.get("attempts", rnd.randint(4, 8))
            # Earlier attempts score lower; students improve with practice
            for n, when in enumerate(sorted(_recent(rnd, now, created) for _ in range(attempts))):
                details, score = _attempt_details(quiz, rnd, min(0.93, 0.55 + 0.07 * n), weak)
                conn.execute(
                    "INSERT INTO attempts(lecture_id,score,total,details,created) VALUES (?,?,?,?,?)",
                    (lid, score, len(quiz), db.jd(details), when),
                )
        conn.commit()
    finally:
        conn.close()


def reset_demo(db_url):
    """Delete all content and re-create the demo data."""
    conn = db.connect(db_url)
    try:
        if db_url.startswith("sqlite"):
            for table in ("attempts", "chats", "bookmarks", "lectures", "courses"):
                conn.execute(f"DELETE FROM {table}")
            conn.execute("DELETE FROM sqlite_sequence")  # restart ids at 1
        else:
            conn.execute("TRUNCATE attempts, chats, bookmarks, lectures, courses RESTART IDENTITY CASCADE")
        conn.commit()
    finally:
        conn.close()
    seed_demo(db_url, force=True)


if __name__ == "__main__":
    from app.config import Settings

    cfg = Settings()
    cfg.data_dir.mkdir(parents=True, exist_ok=True)
    cfg.audio_dir.mkdir(parents=True, exist_ok=True)
    db.init_db(cfg.db_url)
    where = cfg.db_url.rsplit("@", 1)[-1]  # never print credentials
    if "--reset" in sys.argv:
        reset_demo(cfg.db_url)
        print(f"Demo data re-created in {where}")
    else:
        seed_demo(cfg.db_url)
        print(f"Seeded {where} (existing data left untouched; use --reset to rebuild)")
