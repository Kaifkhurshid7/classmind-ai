"""Markdown and plain-text exports."""
from datetime import datetime


def _clock(sec) -> str:
    sec = int(sec or 0)
    h, rem = divmod(sec, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def to_markdown(lec: dict, mode: str = "full", chat=None, bookmarks=None) -> str:
    notes = lec.get("notes") or {}
    out = [f"# {notes.get('title') or lec.get('title') or 'Lecture'}", ""]
    meta = []
    if lec.get("course_name"):
        meta.append(lec["course_name"])
    meta.append(datetime.fromtimestamp(lec.get("created") or 0).strftime("%d %B %Y"))
    if lec.get("duration"):
        meta.append("Duration " + _clock(lec["duration"]))
    out += ["*" + " | ".join(meta) + "*", ""]

    if mode in ("full", "notes"):
        if notes.get("summary"):
            out += ["## Summary", "", notes["summary"], ""]
        if notes.get("key_points"):
            out += ["## Key points", ""] + [f"- {p}" for p in notes["key_points"]] + [""]
        if notes.get("concepts"):
            out += ["## Key concepts", ""] + [f"- **{c['term']}**: {c['definition']}" for c in notes["concepts"]] + [""]
        if notes.get("sections"):
            out += ["## Detailed notes", ""]
            for s in notes["sections"]:
                out += [f"### {s['heading']}", ""] + [f"- {p}" for p in s["points"]] + [""]
        if notes.get("practice_questions"):
            out += ["## Practice questions", ""]
            for i, q in enumerate(notes["practice_questions"], 1):
                out += [f"{i}. **{q['question']}**", f"   - Answer: {q['answer']}", ""]
        if bookmarks:
            out += ["## Bookmarked moments", ""]
            for b in bookmarks:
                stamp = f"[{_clock(b['t'])}] " if b.get("t") is not None else ""
                out.append(f"- {stamp}{b['text']}")
            out.append("")
        if chat:
            out += ["## Student Q&A", ""]
            for m in chat:
                out.append(("**Q:** " if m["role"] == "user" else "**A:** ") + m["content"])
                out.append("")

    if mode in ("full", "transcript"):
        out += ["## Transcript", ""]
        segs = lec.get("segments") or []
        if segs and any(s.get("t") is not None for s in segs):
            out += [f"**[{_clock(s['t'])}]** {s['text']}  " for s in segs]
        else:
            out.append(lec.get("transcript") or "")
        out.append("")
    return "\n".join(out)


def to_text(lec: dict, mode: str = "full", chat=None, bookmarks=None) -> str:
    md = to_markdown(lec, mode, chat, bookmarks)
    for token in ("**", "### ", "## ", "# "):
        md = md.replace(token, "")
    return md.replace("*", "")
