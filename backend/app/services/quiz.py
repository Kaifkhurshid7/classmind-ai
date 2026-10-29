"""Quiz generation and personalised revision plans (Claude with offline fallback)."""
import random
import re
import zlib

from app.services import ai_engine as ae

# --------------------------------------------------------------------------- #
# Quiz
# --------------------------------------------------------------------------- #


def _short(s: str, n: int = 150) -> str:
    s = ae._clean(s)
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0]
    return cut.rstrip(",;:") + "…"


def _blank(sentence: str, term: str):
    pat = re.compile(re.escape(term), re.I)
    if not pat.search(sentence):
        return None
    return pat.sub("_____", sentence, count=1)


def local_quiz(notes: dict, transcript: str, n: int = 6) -> list:
    rnd = random.Random(zlib.crc32((transcript or "").encode("utf-8")))
    concepts = [c for c in (notes or {}).get("concepts", []) if c.get("term") and c.get("definition")]
    all_sents = []
    for s in (notes or {}).get("sections", []):
        all_sents += s.get("points", [])
    if not all_sents:
        all_sents = ae.split_sentences(transcript)

    questions, seen = [], set()

    def add(q):
        key = q["question"].lower()
        if key in seen or len(q["options"]) < 2:
            return
        seen.add(key)
        questions.append(q)

    def concept_mcq(i):
        c = concepts[i]
        correct = _short(c["definition"])
        tstems = {ae._stem(w.lower()) for w in c["term"].split()}

        def mentions(s):
            return tstems <= {ae._stem(w.lower()) for w in ae._words(s)}

        # distractors must not mention the term, otherwise they may also be true
        pool = [_short(x["definition"]) for j, x in enumerate(concepts) if j != i and x["definition"] != c["definition"] and not mentions(x["definition"])]
        pool += [_short(s) for s in all_sents if s != c["definition"] and not mentions(s)]
        pool = [p for p in dict.fromkeys(pool) if p != correct]
        rnd.shuffle(pool)
        opts = [correct] + pool[:3]
        rnd.shuffle(opts)
        return {
            "question": f"Which statement about \"{c['term']}\" matches the lecture?",
            "options": opts,
            "answer_index": opts.index(correct),
            "explanation": c["definition"],
            "topic": c["term"],
        }

    def blank_mcq(i):
        c = concepts[i]
        term = c["term"]
        tstem = ae._stem(term.split()[-1].lower())
        freq = sum(1 for s in all_sents if tstem in {ae._stem(w.lower()) for w in ae._words(s)})
        if freq > 4:  # too generic to be a fair blank
            return None
        for s in all_sents:
            b = _blank(s, term)
            if b and len(s.split()) >= 6:
                low = s.lower()
                others = [x["term"] for j, x in enumerate(concepts) if j != i and x["term"].lower() not in low]
                rnd.shuffle(others)
                opts = [term] + others[:3]
                rnd.shuffle(opts)
                return {
                    "question": f"Fill in the blank: {b}",
                    "options": opts,
                    "answer_index": opts.index(term),
                    "explanation": s,
                    "topic": term,
                }
        return None

    idx = list(range(len(concepts)))
    for i in idx:
        if len(questions) >= (n + 1) // 2:
            break
        add(concept_mcq(i))
    for i in idx:
        if len(questions) >= n:
            break
        if len(concepts) >= 3:
            q = blank_mcq(i)
            if q:
                add(q)
    for i in idx:
        if len(questions) >= n:
            break
        add(concept_mcq(i))

    # Remix the order a little so definition and blank questions are interleaved
    rnd.shuffle(questions)
    return questions[:n]


QUIZ_SYSTEM = """You write fair multiple-choice quizzes for students from a lecture transcript.
Only test what the lecture actually taught. Each question has exactly 4 options with one correct answer
and three plausible distractors. Return ONLY valid JSON, no markdown fences."""

QUIZ_SCHEMA = """Return JSON: {"questions":[{"question":"...","options":["A","B","C","D"],"answer_index":0,
"explanation":"one sentence citing the lecture","topic":"short concept name"}]}
Write exactly %d questions of varied difficulty. Vary the position of the correct answer."""


def generate_quiz(notes: dict, transcript: str, n: int = 6, use_ai: bool = True) -> list:
    client = ae._client() if use_ai else None
    transcript = ae._clean(transcript)[: ae.MAX_TRANSCRIPT_CHARS]
    if client and transcript:
        try:
            msg = client.messages.create(
                model=ae.MODEL,
                max_tokens=3000,
                system=QUIZ_SYSTEM,
                messages=[{"role": "user", "content": f"Lecture transcript:\n\n{transcript}\n\n{QUIZ_SCHEMA % n}"}],
            )
            text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text")
            data = ae._extract_json(text)
            out = []
            for q in data.get("questions", []):
                opts = [str(o) for o in q.get("options", [])]
                ai = int(q.get("answer_index", -1))
                if len(opts) >= 2 and 0 <= ai < len(opts) and q.get("question"):
                    out.append(
                        {
                            "question": str(q["question"]),
                            "options": opts,
                            "answer_index": ai,
                            "explanation": str(q.get("explanation", "")),
                            "topic": str(q.get("topic", "General")),
                        }
                    )
            if out:
                return out[:n]
        except Exception:
            pass
    return local_quiz(notes, transcript, n)


# --------------------------------------------------------------------------- #
# Personalised revision plan
# --------------------------------------------------------------------------- #


def local_plan(notes: dict, weak: list, questions: list) -> dict:
    concepts = {c["term"].lower(): c for c in (notes or {}).get("concepts", [])}
    steps = [
        {
            "title": "Re-read the lecture summary",
            "detail": (notes or {}).get("summary") or "Skim the summary and key points to refresh the big picture.",
            "minutes": 5,
        }
    ]
    for w in weak[:4]:
        topic = w["topic"]
        c = concepts.get(topic.lower())
        detail = f"You answered {int(w['accuracy'] * 100)}% of questions on this topic correctly. "
        detail += (c["definition"] + " ") if c else ""
        detail += "Re-read the matching notes section, then try its flashcards again."
        steps.append({"title": f"Revisit: {topic}", "detail": detail, "minutes": 8})
    if questions:
        steps.append(
            {
                "title": "Clear up your open questions",
                "detail": "Ask the AI tutor to explain these in simple words: " + "; ".join(questions[:3]),
                "minutes": 7,
            }
        )
    if not weak:
        steps.append({"title": "Test yourself with flashcards", "detail": "Go through every flashcard and mark the ones you still find hard.", "minutes": 10})
    steps.append({"title": "Retake the quiz", "detail": "Take the quiz again and aim to beat your previous score.", "minutes": 10})
    total = sum(s["minutes"] for s in steps)
    if weak:
        summary = f"Focus on {', '.join(w['topic'] for w in weak[:3])}. About {total} minutes."
    else:
        summary = f"A balanced revision session of about {total} minutes."
    return {"summary": summary, "steps": steps, "engine": "local"}


PLAN_SYSTEM = """You are a study coach. Using the lecture notes and the student's weak topics and open questions,
write a short, practical revision plan. Return ONLY valid JSON, no markdown fences:
{"summary":"one sentence","steps":[{"title":"...","detail":"1-2 sentences, concrete","minutes":8}]}
Use 4-6 steps, total time under 60 minutes."""


def revision_plan(notes: dict, weak: list, questions: list, use_ai: bool = True) -> dict:
    client = ae._client() if use_ai else None
    if client:
        try:
            import json

            ctx = {
                "title": notes.get("title"),
                "summary": notes.get("summary"),
                "concepts": notes.get("concepts"),
                "weak_topics": weak,
                "student_questions": questions[:5],
            }
            msg = client.messages.create(
                model=ae.MODEL,
                max_tokens=1200,
                system=PLAN_SYSTEM,
                messages=[{"role": "user", "content": json.dumps(ctx, ensure_ascii=False)}],
            )
            text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text")
            data = ae._extract_json(text)
            steps = [
                {"title": str(s.get("title", "")), "detail": str(s.get("detail", "")), "minutes": int(s.get("minutes", 5) or 5)}
                for s in data.get("steps", [])
                if isinstance(s, dict) and s.get("title")
            ]
            if steps:
                return {"summary": str(data.get("summary", "")), "steps": steps, "engine": "claude"}
        except Exception:
            pass
    return local_plan(notes, weak, questions)
