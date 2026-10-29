"""Lecture export to PDF, Markdown and plain text."""
import re

from fastapi import APIRouter, HTTPException, Response

from app.api.deps import DB
from app.services import exporters
from app.services.lectures import bookmark_rows, chat_rows, get_lecture_row, lecture_full
from app.services.pdf_export import build_pdf

router = APIRouter(prefix="/api/lectures", tags=["exports"])


def _download(content: bytes, media_type: str, filename: str) -> Response:
    return Response(content, media_type=media_type, headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@router.get("/{lid}/export")
def export(lid: int, d: DB, format: str = "pdf", mode: str = "full"):
    r = get_lecture_row(d, lid)
    if mode not in ("notes", "transcript", "full"):
        mode = "full"
    lec = lecture_full(d, r)
    chat = chat_rows(d, lid)
    marks = bookmark_rows(d, lid)
    safe = re.sub(r"[^A-Za-z0-9_-]+", "_", r["title"])[:40].strip("_") or "lecture"
    base = f"ClassMind_{safe}_{mode}"
    if format == "pdf":
        data = build_pdf(
            lec["notes"],
            lec["transcript"],
            chat,
            mode,
            meta={"course": lec.get("course_name"), "duration": lec.get("duration")},
            segments=lec["segments"],
            bookmarks=marks,
        )
        return _download(data, "application/pdf", base + ".pdf")
    if format in ("md", "txt"):
        fn = exporters.to_markdown if format == "md" else exporters.to_text
        text = fn(lec, mode, chat, marks)
        return _download(text.encode("utf-8"), "text/markdown" if format == "md" else "text/plain", f"{base}.{format}")
    raise HTTPException(400, "Unknown format")
