"""Request bodies. Unset fields stay unset (model_dump(exclude_unset=True)) so PUT can mean "leave as is"."""
from typing import Any

from pydantic import BaseModel, ConfigDict


class Body(BaseModel):
    model_config = ConfigDict(extra="ignore")


class AnalyzeIn(Body):
    transcript: str = ""
    live: bool = False


class CourseIn(Body):
    name: str | None = None
    description: str | None = None
    color: str | None = None
    instructor: str | None = None
    instructor_title: str | None = None


class LectureIn(Body):
    title: str | None = None
    transcript: str | None = None
    segments: list[Any] | None = None
    course_id: int | None = None
    duration: int | float | None = None
    lang: str | None = None


class LectureUpdateIn(Body):
    title: str | None = None
    course_id: int | None = None
    notes: dict[str, Any] | None = None
    transcript: str | None = None


class ReanalyzeIn(Body):
    offline: bool = False


class AskIn(Body):
    question: str = ""
    mode: str | None = None
    display: str | None = None


class BookmarkIn(Body):
    t: float | None = None
    text: str = ""


class QuizIn(Body):
    regenerate: bool = False
    n: int | None = None


class AttemptIn(Body):
    answers: list[int | None] = []
