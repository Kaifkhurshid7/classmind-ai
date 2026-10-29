"""Settings, migrations and the legacy-database upgrade path."""
import sqlite3

import pytest
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from fastapi.testclient import TestClient

from app import create_app, database
from app.config import Settings
from app.models import Base


@pytest.mark.parametrize(
    "given,expected",
    [
        ("postgres://u:p@h:5432/db", "postgresql+psycopg://u:p@h:5432/db"),
        ("postgresql://u:p@h/db", "postgresql+psycopg://u:p@h/db"),
        ("postgresql+psycopg://u:p@h/db", "postgresql+psycopg://u:p@h/db"),
        ("sqlite:///x.db", "sqlite:///x.db"),
    ],
)
def test_database_url_is_normalised(given, expected):
    assert Settings(database_url=given).db_url == expected


def test_default_database_is_sqlite_in_data_dir(tmp_path):
    assert Settings(data_dir=tmp_path).db_url == f"sqlite:///{(tmp_path / 'classmind.db').as_posix()}"


def test_settings_read_environment(monkeypatch, tmp_path):
    monkeypatch.setenv("CLASSMIND_DATA", str(tmp_path))
    monkeypatch.setenv("CLASSMIND_SEED", "0")
    s = Settings()
    assert s.data_dir == tmp_path and s.seed_demo is False


def test_migrations_match_models(tmp_path):
    """If this fails, a model changed without a migration: `alembic revision --autogenerate`."""
    url = f"sqlite:///{(tmp_path / 'm.db').as_posix()}"
    database.init_db(url)
    with database.get_engine(url).connect() as conn:
        diff = compare_metadata(MigrationContext.configure(conn), Base.metadata)
    assert diff == []


def test_legacy_database_is_upgraded_in_place(tmp_path):
    """A database created before Alembic (and before the faculty columns) keeps its data."""
    path = tmp_path / "classmind.db"
    raw = sqlite3.connect(path)
    raw.executescript(
        """
        CREATE TABLE courses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT DEFAULT '',
                              color TEXT DEFAULT '#0056d2', created REAL NOT NULL);
        CREATE TABLE lectures (id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER, title TEXT NOT NULL,
                               transcript TEXT DEFAULT '', segments TEXT DEFAULT '[]', notes TEXT DEFAULT '{}',
                               quiz TEXT DEFAULT '[]', duration INTEGER DEFAULT 0, audio TEXT DEFAULT '',
                               lang TEXT DEFAULT 'en-IN', created REAL NOT NULL, updated REAL NOT NULL);
        CREATE TABLE chats (id INTEGER PRIMARY KEY AUTOINCREMENT, lecture_id INTEGER NOT NULL, role TEXT NOT NULL,
                            content TEXT NOT NULL, created REAL NOT NULL);
        CREATE TABLE attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, lecture_id INTEGER NOT NULL, score INTEGER NOT NULL,
                               total INTEGER NOT NULL, details TEXT DEFAULT '[]', created REAL NOT NULL);
        CREATE TABLE bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, lecture_id INTEGER NOT NULL, t REAL,
                                text TEXT NOT NULL, created REAL NOT NULL);
        INSERT INTO courses(name, created) VALUES ('Old course', 1.0);
        """
    )
    raw.commit()
    raw.close()

    dist = tmp_path / "dist"
    dist.mkdir()
    client = TestClient(create_app(Settings(data_dir=tmp_path, frontend_dir=dist, seed_demo=False)))
    courses = client.get("/api/courses").json()
    assert [c["name"] for c in courses] == ["Old course"]
    assert courses[0]["instructor"] == ""  # column added during the upgrade
    assert client.post("/api/courses", json={"name": "New", "instructor": "Dr. X"}).status_code == 201


def test_unknown_course_filter_is_a_clean_400(client):
    assert client.get("/api/lectures?course=abc").status_code == 400
    assert client.get("/api/lectures?course=none").status_code == 200


def test_search_is_case_insensitive(client, lecture):
    assert any(x["id"] == lecture for x in client.get("/api/lectures?q=CALVIN").json())
