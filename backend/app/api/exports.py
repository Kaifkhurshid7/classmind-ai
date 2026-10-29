"""Lecture export to PDF, Markdown and plain text."""
import io
import re

from flask import Blueprint, abort, request, send_file

from app.services import exporters
from app.services.lectures import bookmark_rows, chat_rows, get_lecture_row, lecture_full
from app.services.pdf_export import build_pdf

bp = Blueprint("exports", __name__)


@bp.get("/api/lectures/<int:lid>/export")
def export(lid):
    r = get_lecture_row(lid)
    fmt = request.args.get("format", "pdf")
    mode = request.args.get("mode", "full")
    if mode not in ("notes", "transcript", "full"):
        mode = "full"
    lec = lecture_full(r)
    chat = chat_rows(lid)
    marks = bookmark_rows(lid)
    safe = re.sub(r"[^A-Za-z0-9_-]+", "_", r["title"])[:40].strip("_") or "lecture"
    base = f"ClassMind_{safe}_{mode}"
    if fmt == "pdf":
        data = build_pdf(
            lec["notes"],
            lec["transcript"],
            chat,
            mode,
            meta={"course": lec.get("course_name"), "duration": lec.get("duration")},
            segments=lec["segments"],
            bookmarks=marks,
        )
        return send_file(io.BytesIO(data), mimetype="application/pdf", as_attachment=True, download_name=base + ".pdf")
    if fmt in ("md", "txt"):
        fn = exporters.to_markdown if fmt == "md" else exporters.to_text
        text = fn(lec, mode, chat, marks)
        return send_file(
            io.BytesIO(text.encode("utf-8")),
            mimetype="text/markdown" if fmt == "md" else "text/plain",
            as_attachment=True,
            download_name=f"{base}.{fmt}",
        )
    abort(400, "Unknown format")
