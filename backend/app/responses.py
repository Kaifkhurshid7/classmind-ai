"""Response models: they document the API at /api/docs and guarantee the shape the frontend relies on."""
from typing import Any

from pydantic import BaseModel, Field


class Ok(BaseModel):
    ok: bool = True


class Created(BaseModel):
    id: int


class StatusOut(BaseModel):
    ai: bool
    model: str | None


class CourseOut(BaseModel):
    id: int
    name: str
    description: str | None
    color: str | None
    instructor: str | None
    instructor_title: str | None
    created: float


class LectureSummary(BaseModel):
    id: int
    course_id: int | None
    course_name: str | None
    course_color: str | None
    instructor: str | None
    instructor_title: str | None
    title: str
    duration: int | None
    created: float
    updated: float
    lang: str | None
    has_audio: bool
    words: int
    summary: str
    concepts: int
    attempts: int
    best: int | None
    avg: int | None
    snippet: str | None = None  # only present on search results


class LectureFull(LectureSummary):
    transcript: str
    segments: list[dict[str, Any]]
    notes: dict[str, Any]


class CourseDetail(CourseOut):
    lectures: list[LectureSummary]
    progress: int
    avg: int | None
    hours: float
    minutes: int


class BookmarkOut(BaseModel):
    id: int
    t: float | None
    text: str
    created: float


class BookmarkCreated(BaseModel):
    id: int
    t: float | None
    text: str


class ChatMessage(BaseModel):
    id: int
    role: str
    content: str
    created: float


class AttemptBrief(BaseModel):
    id: int
    score: int
    total: int
    created: float


class WeakTopic(BaseModel):
    topic: str
    correct: int
    total: int
    accuracy: float


class LectureDetail(BaseModel):
    lecture: LectureFull
    bookmarks: list[BookmarkOut]
    chat: list[ChatMessage]
    attempts: list[AttemptBrief]
    siblings: list[LectureSummary]
    quiz_size: int
    weak_topics: list[WeakTopic]


class AnalyzeOut(BaseModel):
    notes: dict[str, Any]
    quiz_size: int


class AskOut(BaseModel):
    answer: str
    engine: str | None = None


class QuizQuestionPublic(BaseModel):
    question: str
    options: list[str]
    topic: str


class QuizOut(BaseModel):
    questions: list[QuizQuestionPublic]


class AttemptDetail(BaseModel):
    question: str
    options: list[str]
    topic: str
    chosen: int | None
    answer_index: int
    correct: bool
    explanation: str


class AttemptResult(BaseModel):
    score: int
    total: int
    details: list[AttemptDetail]


class RevisionStep(BaseModel):
    title: str
    detail: str
    minutes: int


class RevisionPlan(BaseModel):
    summary: str
    steps: list[RevisionStep]
    engine: str | None = None
    weak_topics: list[WeakTopic]


class CourseCard(BaseModel):
    id: int
    name: str
    description: str | None
    color: str | None
    instructor: str | None
    instructor_title: str | None
    lectures: int
    progress: int
    avg: int | None


class OverviewStats(BaseModel):
    lectures: int
    courses: int
    hours: float
    minutes: int
    quizzes: int
    avg: int | None


class Overview(BaseModel):
    stats: OverviewStats
    courses: list[CourseCard]
    lectures: list[LectureSummary]
    continue_: LectureSummary | None = Field(alias="continue")


class AnalyticsTotals(BaseModel):
    lectures: int
    minutes: int
    words: int
    questions: int
    attempts: int
    avg: int | None


class Kpis(BaseModel):
    attempts_week: int
    attempts_change: int | None
    questions_week: int
    questions_change: int | None
    avg_week: int | None
    avg_change: int | None
    practised_pct: int
    practised: int


class PerLecture(BaseModel):
    id: int
    title: str
    course: str | None
    course_color: str | None
    attempts: int
    avg: int | None
    best: int | None


class ByCourse(BaseModel):
    id: int
    name: str
    color: str | None
    instructor: str | None
    lectures: int
    attempts: int
    questions: int
    avg: int | None
    practised: int


class TopQuestion(BaseModel):
    question: str
    count: int
    lecture_id: int
    lecture: str
    created: float


class ActivityDay(BaseModel):
    day: str
    date: str
    lectures: int
    quizzes: int
    questions: int
    count: int


class TrendPoint(BaseModel):
    day: str
    avg: int | None
    attempts: int


class DistributionBucket(BaseModel):
    label: str
    count: int


class RecentEvent(BaseModel):
    type: str
    when: float
    text: str
    lecture_id: int
    score: int | None = None


class Analytics(BaseModel):
    totals: AnalyticsTotals
    kpis: Kpis
    per_lecture: list[PerLecture]
    by_course: list[ByCourse]
    weak_topics: list[WeakTopic]
    top_questions: list[TopQuestion]
    activity: list[ActivityDay]
    activity_30: list[ActivityDay]
    trend: list[TrendPoint]
    distribution: list[DistributionBucket]
    recent: list[RecentEvent]
