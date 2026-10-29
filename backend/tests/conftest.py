import io

import pytest

from app import create_app
from app.config import TestConfig

TEXT = (
    "Photosynthesis is the process by which green plants convert light energy into chemical energy. "
    "It takes place in the chloroplasts of plant cells. Chlorophyll is the green pigment that absorbs sunlight. "
    "During photosynthesis plants take in carbon dioxide from the air and water from the soil. "
    "The light reactions happen in the thylakoid membranes and produce ATP and oxygen. "
    "The Calvin cycle uses ATP and carbon dioxide to build glucose in the stroma. "
    "Oxygen is released into the atmosphere as a by product of photosynthesis."
)


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)  # tests use the offline engine

    class Cfg(TestConfig):
        DATA_DIR = tmp_path

    return create_app(Cfg()).test_client()


@pytest.fixture()
def course(client):
    return client.post("/api/courses", json={"name": "Chemistry 101", "description": "Atoms"}).get_json()["id"]


@pytest.fixture()
def lecture(client, course):
    segs = [
        {"t": 0, "text": "Photosynthesis is the process by which plants make food."},
        {"t": 6.5, "text": "It takes place in chloroplasts."},
    ]
    r = client.post(
        "/api/lectures",
        json={"title": "Test lecture", "course_id": course, "transcript": TEXT, "segments": segs, "duration": 95},
    )
    return r.get_json()["id"]


@pytest.fixture()
def audio_file():
    return {"audio": (io.BytesIO(b"RIFFfakeaudio" * 50), "a.webm", "audio/webm")}
