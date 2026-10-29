"""Database schema (SQLAlchemy 2.0). Migrations live in backend/migrations and are applied on startup."""
from sqlalchemy import Float, ForeignKey, Integer, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text, server_default="")
    color: Mapped[str | None] = mapped_column(Text, server_default="#0056d2")
    instructor: Mapped[str | None] = mapped_column(Text, server_default="")
    instructor_title: Mapped[str | None] = mapped_column(Text, server_default="")
    created: Mapped[float] = mapped_column(Float)


class Lecture(Base):
    __tablename__ = "lectures"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id", ondelete="SET NULL"), index=True)
    title: Mapped[str] = mapped_column(Text)
    transcript: Mapped[str | None] = mapped_column(Text, server_default="")
    segments: Mapped[str | None] = mapped_column(Text, server_default="[]")  # JSON text
    notes: Mapped[str | None] = mapped_column(Text, server_default="{}")  # JSON text
    quiz: Mapped[str | None] = mapped_column(Text, server_default="[]")  # JSON text
    duration: Mapped[int | None] = mapped_column(Integer, server_default="0")
    audio: Mapped[str | None] = mapped_column(Text, server_default="")
    lang: Mapped[str | None] = mapped_column(Text, server_default="en-IN")
    created: Mapped[float] = mapped_column(Float)
    updated: Mapped[float] = mapped_column(Float)


class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lecture_id: Mapped[int] = mapped_column(ForeignKey("lectures.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    created: Mapped[float] = mapped_column(Float)


class Attempt(Base):
    __tablename__ = "attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lecture_id: Mapped[int] = mapped_column(ForeignKey("lectures.id", ondelete="CASCADE"), index=True)
    score: Mapped[int] = mapped_column(Integer)
    total: Mapped[int] = mapped_column(Integer)
    details: Mapped[str | None] = mapped_column(Text, server_default="[]")  # JSON text
    created: Mapped[float] = mapped_column(Float)


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lecture_id: Mapped[int] = mapped_column(ForeignKey("lectures.id", ondelete="CASCADE"), index=True)
    t: Mapped[float | None] = mapped_column(Float)
    text: Mapped[str] = mapped_column(Text)
    created: Mapped[float] = mapped_column(Float)
