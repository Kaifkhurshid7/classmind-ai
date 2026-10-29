"""Database access: SQLAlchemy engine, a small SQL helper, and Alembic migrations.

SQLite is the default (zero setup); set DATABASE_URL to use PostgreSQL. Queries are plain SQL with `?`
placeholders, kept portable between both databases. `Db` wraps a SQLAlchemy session so callers keep the
familiar execute/fetchone/fetchall/commit calls.
"""
import json
import re
import time
from pathlib import Path

from alembic import command
from alembic.config import Config as AlembicConfig
from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

from app.models import Base

MIGRATIONS = Path(__file__).resolve().parents[1] / "migrations"


def now() -> float:
    return time.time()


class Row(dict):
    """A result row: read by column name (r["title"]) or position (r[0]); dict(r) works."""

    def __getitem__(self, key):
        return list(self.values())[key] if isinstance(key, int) else super().__getitem__(key)


class Result:
    def __init__(self, result, lastrowid=None):
        self._result = result
        self.lastrowid = lastrowid

    def fetchone(self):
        m = self._result.mappings().first()
        return Row(m) if m is not None else None

    def fetchall(self):
        return [Row(m) for m in self._result.mappings().all()]

    def __iter__(self):
        return iter(self.fetchall())


class Db:
    """One request's worth of database access."""

    def __init__(self, engine: Engine):
        self._session = Session(engine)

    def execute(self, sql: str, params=()) -> Result:
        values: dict = {}

        def bind(_match):
            key = f"p{len(values)}"
            values[key] = params[len(values)]
            return ":" + key

        sql = re.sub(r"\?", bind, sql)
        inserting = sql.lstrip().upper().startswith("INSERT") and "RETURNING" not in sql.upper()
        if inserting:
            sql += " RETURNING id"  # works on SQLite 3.35+ and PostgreSQL
        result = self._session.execute(text(sql), values)
        return Result(result, result.scalar() if inserting else None)

    def commit(self) -> None:
        self._session.commit()

    def rollback(self) -> None:
        self._session.rollback()

    def close(self) -> None:
        self._session.close()


_engines: dict[str, Engine] = {}


def get_engine(url: str) -> Engine:
    if url not in _engines:
        _engines[url] = _make_engine(url)
    return _engines[url]


def dispose_engines() -> None:
    """Forget pooled connections without closing them. Call in a forked worker so it does not share the parent's sockets."""
    for engine in _engines.values():
        engine.dispose(close=False)
    _engines.clear()


def _make_engine(url: str) -> Engine:
    if url.startswith("sqlite"):
        # FastAPI may open a session in one worker thread and use it in another
        engine = create_engine(url, connect_args={"check_same_thread": False})

        @event.listens_for(engine, "connect")
        def _pragmas(conn, _record):
            cur = conn.cursor()
            cur.execute("PRAGMA foreign_keys = ON")
            cur.execute("PRAGMA journal_mode = WAL")  # readers no longer block the writer
            cur.close()

        return engine
    return create_engine(url, pool_pre_ping=True)


def connect(url: str) -> Db:
    return Db(get_engine(url))


def init_db(url: str) -> None:
    """Create or upgrade the schema with Alembic."""
    engine = get_engine(url)
    if not (MIGRATIONS / "env.py").is_file():
        # Slim deployments (for example serverless bundles) may ship without the migration files
        Base.metadata.create_all(engine)
        return
    cfg = AlembicConfig()
    cfg.set_main_option("script_location", str(MIGRATIONS))
    cfg.set_main_option("sqlalchemy.url", url.replace("%", "%%"))
    tables = set(inspect(engine).get_table_names())
    if "courses" in tables and "alembic_version" not in tables:
        # Database from before migrations existed: add the faculty columns older copies lack, then mark it current.
        cols = {c["name"] for c in inspect(engine).get_columns("courses")}
        with engine.begin() as conn:
            for col in ("instructor", "instructor_title"):
                if col not in cols:
                    conn.execute(text(f"ALTER TABLE courses ADD COLUMN {col} TEXT DEFAULT ''"))
        command.stamp(cfg, "head")
    else:
        command.upgrade(cfg, "head")


def jl(s, default):
    try:
        v = json.loads(s) if s else default
        return v if v is not None else default
    except Exception:
        return default


def jd(v) -> str:
    return json.dumps(v, ensure_ascii=False)
