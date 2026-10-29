"""ClassMind AI - analysis engine.

Two engines behind one interface:
  * Claude (used when ANTHROPIC_API_KEY is set): high quality notes + tutor answers.
  * Local fallback (no key, no internet): extractive notes + retrieval Q&A, so the
    prototype always works, even offline during a demo.

Public functions:
    analyze_lecture(transcript, use_ai=True) -> dict (notes)
    answer_question(question, transcript, history, use_ai=True) -> dict
"""
import json
import math
import os
import re
from collections import Counter

MODEL = os.environ.get("CLASSMIND_MODEL", "claude-sonnet-5-5")
MAX_TRANSCRIPT_CHARS = 60000

STOP = set(
    """a an the and or but if then else when while of at by for with about against between into
    through during before after above below to from up down in out on off over under again further
    once here there all any both each few more most other some such no nor not only own same so than
    too very can will just don should now is are was were be been being have has had having do does
    did doing i you he she it we they them this that these those what which who whom whose my your
    his her its our their me him us as also like get got let say said one two would could may might
    must shall because however therefore thus okay ok yes right basically actually today
    class students student teacher lecture know see going want need look""".split()
)


# --------------------------------------------------------------------------- #
# Text helpers
# --------------------------------------------------------------------------- #
def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def _stem(w: str) -> str:
    w = w.lower()
    if len(w) > 5 and w.endswith("ing"):
        w = w[:-3]
    elif len(w) > 4 and w.endswith("ed"):
        w = w[:-2]
    elif len(w) > 4 and w.endswith("ies"):
        w = w[:-3] + "y"
    elif len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
        w = w[:-1]
    return w


def _words(s: str):
    return re.findall(r"[A-Za-z][A-Za-z\-']+", s)


def _content_words(s: str):
    return [w for w in _words(s) if w.lower() not in STOP and len(w) > 2]


def split_sentences(text: str):
    """Split a transcript into sentences. Browser speech recognition often returns
    text with no punctuation, so very long runs are chunked by word count."""
    text = _clean(text)
    if not text:
        return []
    raw = re.split(r"(?<=[.!?])\s+", text)
    out = []
    for r in raw:
        words = r.split()
        if len(words) < 3:
            continue
        if len(words) > 32:
            step = 22
            for i in range(0, len(words), step):
                chunk = words[i : i + step]
                if len(chunk) >= 4 or not out:
                    out.append(" ".join(chunk))
                else:
                    out[-1] += " " + " ".join(chunk)
        else:
            out.append(r)
    fixed = []
    for s in out:
        s = s.strip()
        if s and s[0].islower():
            s = s[0].upper() + s[1:]
        if s and s[-1] not in ".!?":
            s += "."
        fixed.append(s)
    return fixed


def _title_case(phrase: str) -> str:
    return " ".join(w.capitalize() if w.islower() else w for w in phrase.split())


# --------------------------------------------------------------------------- #
# Local (offline) engine
# --------------------------------------------------------------------------- #
def _keywords(sentences, top_n=8):
    uni = Counter()
    forms = {}
    bi = Counter()
    bi_forms = {}
    for s in sentences:
        toks = [w for w in _words(s)]
        prev = prev_raw = None
        for w in toks:
            lw = w.lower()
            if lw in STOP or len(lw) <= 2:
                prev = None
                continue
            st = _stem(lw)
            uni[st] += 1
            forms.setdefault(st, Counter())[lw] += 1
            if prev is not None:
                key = (prev, st)
                bi[key] += 1
                bi_forms.setdefault(key, Counter())[(prev_raw, lw)] += 1
            prev, prev_raw = st, lw
    cands = []
    for (a, b), c in bi.items():
        if c >= 2:
            cands.append((c * 1.8, " ".join(bi_forms[(a, b)].most_common(1)[0][0]), {a, b}))
    for st, c in uni.items():
        cands.append((float(c), forms[st].most_common(1)[0][0], {st}))
    cands.sort(key=lambda x: -x[0])
    chosen, used = [], set()
    for score, phrase, stems in cands:
        if stems & used:
            continue
        chosen.append((phrase, score))
        used |= stems
        if len(chosen) >= top_n:
            break
    return chosen


def _sentence_scores(sentences):
    tf = Counter(_stem(w.lower()) for s in sentences for w in _content_words(s))
    scores = []
    for s in sentences:
        toks = [_stem(w.lower()) for w in _content_words(s)]
        if not toks:
            scores.append(0.0)
            continue
        scores.append(sum(tf[t] for t in toks) / math.sqrt(len(toks)))
    return scores


_DEF_RAW = re.compile(r"^(.{3,60}?)\s+(is|are|means|refers to|is called|are called)\s+(.+)$", re.I)
_DEF_STARTERS = {"a", "an", "the", "called", "known", "defined", "when", "where", "how", "what", "one", "any", "all", "to"}


class _DefMatcher:
    """Matches genuine definition sentences ('X is the process ...'), not 'X is released ...'."""

    def match(self, s):
        m = _DEF_RAW.match(s)
        if not m:
            return None
        first = m.group(3).split()[0].lower().strip(",.") if m.group(3).split() else ""
        if m.group(2).lower() in ("means", "refers to") or first in _DEF_STARTERS:
            return m
        return None


DEF_RE = _DefMatcher()


def local_analyze(transcript: str) -> dict:
    sentences = split_sentences(transcript)
    n = len(sentences)
    if n == 0:
        return {
            "title": "Untitled lecture",
            "summary": "",
            "key_points": [],
            "concepts": [],
            "sections": [],
            "practice_questions": [],
            "engine": "local",
        }

    kws = _keywords(sentences, top_n=8)
    scores = _sentence_scores(sentences)

    # Title
    if kws:
        names = [_title_case(k[0]) for k in kws[:2]]
        title = "Lecture Notes: " + " & ".join(names)
    else:
        title = "Lecture Notes"

    # Summary + key points
    k = max(1, min(5, round(n / 4)))
    top_idx = sorted(sorted(range(n), key=lambda i: -scores[i])[:k])
    summary = " ".join(sentences[i] for i in top_idx[: min(3, len(top_idx))])
    key_points = [sentences[i] for i in top_idx]

    # Concepts
    concepts = []
    used_defs = set()
    for phrase, _ in kws:
        if len(concepts) >= 6:
            break
        pst = {_stem(w.lower()) for w in phrase.split()}
        best, best_score = None, -1
        for i, s in enumerate(sentences):
            if s in used_defs:
                continue
            sst = {_stem(w.lower()) for w in _words(s)}
            if pst <= sst:
                m = DEF_RE.match(s)
                # strongly prefer a sentence that defines this very term
                sc = scores[i] + (50 if m and _stem(m.group(1).split()[-1].lower()) in pst else 0)
                if sc > best_score:
                    best, best_score = s, sc
        if best:
            used_defs.add(best)
            concepts.append({"term": _title_case(phrase), "definition": best})

    # Sections
    group = 4
    n_sections = max(1, math.ceil(n / group))
    size = math.ceil(n / n_sections)
    sections = []
    global_rank = {_stem(k[0].split()[-1].lower()): k[1] for k in kws}
    for i in range(0, n, size):
        chunk = sentences[i : i + size]
        local = Counter()
        for s in chunk:
            for w in _content_words(s):
                st = _stem(w.lower())
                local[st] += 1 + global_rank.get(st, 0) * 0.2
        if local:
            top_st = local.most_common(1)[0][0]
            # pick readable form
            form = next(
                (w for s in chunk for w in _content_words(s) if _stem(w.lower()) == top_st),
                top_st,
            )
            heading = _title_case(form.lower())
        else:
            heading = f"Part {len(sections) + 1}"
        sections.append({"heading": f"{len(sections) + 1}. {heading}", "points": chunk})

    # Practice questions
    questions = []
    ranked = sorted(range(n), key=lambda i: -scores[i])
    seen_terms = set()
    for i in ranked:
        s = sentences[i]
        m = DEF_RE.match(s)
        if m:
            subj = m.group(1).strip().rstrip(",")
            if subj.lower() in seen_terms or len(subj.split()) > 6:
                continue
            seen_terms.add(subj.lower())
            verb = m.group(2).lower()
            q = f"What {verb} {subj}?" if verb in ("is", "are") else f"What is meant by {subj}?"
            questions.append({"question": q, "answer": s})
        if len(questions) >= 6:
            break
    for phrase, _ in kws:
        if len(questions) >= 6:
            break
        if phrase.lower() in seen_terms:
            continue
        pst = {_stem(w.lower()) for w in phrase.split()}
        best = next(
            (sentences[i] for i in ranked if pst <= {_stem(w.lower()) for w in _words(sentences[i])}),
            None,
        )
        if best:
            seen_terms.add(phrase.lower())
            questions.append(
                {"question": f"Explain the role of {phrase} as discussed in the lecture.", "answer": best}
            )

    return {
        "title": title,
        "summary": summary,
        "key_points": key_points,
        "concepts": concepts,
        "sections": sections,
        "practice_questions": questions,
        "engine": "local",
    }


def local_answer(question: str, transcript: str) -> dict:
    sentences = split_sentences(transcript)
    if not sentences:
        return {"answer": "There is no lecture content yet. Record or paste a lecture first.", "engine": "local"}
    q_stems = {_stem(w.lower()) for w in _content_words(question)}
    if not q_stems:
        return {"answer": "Could you ask that with a few more specific words?", "engine": "local"}
    df = Counter()
    sent_stems = []
    for s in sentences:
        st = {_stem(w.lower()) for w in _words(s)}
        sent_stems.append(st)
        for t in st:
            df[t] += 1
    N = len(sentences)
    scored = []
    for i, st in enumerate(sent_stems):
        overlap = q_stems & st
        if not overlap:
            continue
        sc = sum(math.log(1 + N / df[t]) for t in overlap)
        scored.append((sc, i))
    if not scored:
        return {
            "answer": "That doesn't seem to be covered in this lecture. Try rephrasing, or ask your teacher.",
            "engine": "local",
        }
    scored.sort(reverse=True)
    top = sorted(i for _, i in scored[:3])
    body = " ".join(sentences[i] for i in top)
    return {"answer": "From the lecture: " + body, "engine": "local"}


# --------------------------------------------------------------------------- #
# Claude engine
# --------------------------------------------------------------------------- #
def _client():
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    try:
        import anthropic

        return anthropic.Anthropic(api_key=key)
    except Exception:
        return None


def ai_available() -> bool:
    return _client() is not None


ANALYZE_SYSTEM = """You are ClassMind AI, an assistant that turns raw, unpunctuated lecture transcripts
(produced by speech-to-text) into clean, well-structured study notes for students.
Fix obvious speech-recognition errors only when the intended word is clear. Do not invent facts that
are not supported by the transcript. Return ONLY valid JSON, no markdown fences."""

ANALYZE_SCHEMA = """Return JSON with exactly these keys:
{
  "title": "short descriptive lecture title",
  "summary": "3-4 sentence overview",
  "key_points": ["5-8 concise bullet points"],
  "concepts": [{"term": "...", "definition": "1-2 sentence definition from the lecture"}],
  "sections": [{"heading": "1. Heading", "points": ["clear note sentences"]}],
  "practice_questions": [{"question": "...", "answer": "..."}]
}
Aim for 4-8 concepts, logical sections following the lecture order, and 5-6 practice questions."""


def _extract_json(text: str):
    text = text.strip()
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.M).strip()
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("no JSON in model output")
    return json.loads(text[start : end + 1])


def _normalize(d: dict, engine: str) -> dict:
    d = d or {}
    return {
        "title": str(d.get("title") or "Lecture Notes"),
        "summary": str(d.get("summary") or ""),
        "key_points": [str(x) for x in (d.get("key_points") or [])],
        "concepts": [
            {"term": str(c.get("term", "")), "definition": str(c.get("definition", ""))}
            for c in (d.get("concepts") or [])
            if isinstance(c, dict)
        ],
        "sections": [
            {"heading": str(s.get("heading", "")), "points": [str(p) for p in (s.get("points") or [])]}
            for s in (d.get("sections") or [])
            if isinstance(s, dict)
        ],
        "practice_questions": [
            {"question": str(q.get("question", "")), "answer": str(q.get("answer", ""))}
            for q in (d.get("practice_questions") or [])
            if isinstance(q, dict)
        ],
        "engine": engine,
    }


def analyze_lecture(transcript: str, use_ai: bool = True) -> dict:
    transcript = _clean(transcript)[:MAX_TRANSCRIPT_CHARS]
    if not transcript:
        return local_analyze("")
    client = _client() if use_ai else None
    if client:
        try:
            msg = client.messages.create(
                model=MODEL,
                max_tokens=4000,
                system=ANALYZE_SYSTEM,
                messages=[
                    {
                        "role": "user",
                        "content": f"Lecture transcript:\n\n{transcript}\n\n{ANALYZE_SCHEMA}",
                    }
                ],
            )
            text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text")
            return _normalize(_extract_json(text), "claude")
        except Exception as e:  # fall back gracefully
            result = local_analyze(transcript)
            result["engine_note"] = f"AI unavailable ({type(e).__name__}); used offline engine."
            return result
    return local_analyze(transcript)


TUTOR_SYSTEM = """You are ClassMind AI, a friendly tutor. Answer the student's question using the lecture
transcript below as your primary source. Keep answers clear and concise. If the lecture does not cover
the question, say so, then optionally add a short helpful explanation clearly marked as
"Beyond the lecture:". Never claim the teacher said something that is not in the transcript.

LECTURE TRANSCRIPT:
{transcript}"""


MODE_HINTS = {
    "simple": "\n\nExplain in very simple language, as if to a 12 year old. Avoid jargon.",
    "example": "\n\nInclude one concrete, real-world example that illustrates the idea.",
    "summary": "\n\nAnswer as a short bullet-point summary.",
}


def answer_question(question: str, transcript: str, history=None, use_ai: bool = True, mode: str = "") -> dict:
    transcript = _clean(transcript)[:MAX_TRANSCRIPT_CHARS]
    question = _clean(question)
    if not question:
        return {"answer": "Please type a question.", "engine": "local"}
    client = _client() if use_ai else None
    if mode == "summary" and not client:
        summ = local_analyze(transcript)
        if summ["key_points"]:
            return {"answer": "Summary of the lecture:\n- " + "\n- ".join(summ["key_points"]), "engine": "local"}
    if client and transcript:
        try:
            msgs = []
            for h in (history or [])[-6:]:
                role = "assistant" if h.get("role") == "assistant" else "user"
                content = str(h.get("content", "")).strip()
                if content:
                    msgs.append({"role": role, "content": content})
            # messages must alternate and start with user
            cleaned = []
            for m in msgs:
                if cleaned and cleaned[-1]["role"] == m["role"]:
                    cleaned[-1]["content"] += "\n" + m["content"]
                else:
                    cleaned.append(m)
            while cleaned and cleaned[0]["role"] != "user":
                cleaned.pop(0)
            if cleaned and cleaned[-1]["role"] == "user":
                cleaned.pop()
            cleaned.append({"role": "user", "content": question})
            msg = client.messages.create(
                model=MODEL,
                max_tokens=900,
                system=TUTOR_SYSTEM.format(transcript=transcript) + MODE_HINTS.get(mode, ""),
                messages=cleaned,
            )
            text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text").strip()
            return {"answer": text, "engine": "claude"}
        except Exception as e:
            r = local_answer(question, transcript)
            r["engine_note"] = f"AI unavailable ({type(e).__name__}); used offline engine."
            return r
    return local_answer(question, transcript)
