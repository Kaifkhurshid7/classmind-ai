"""End-to-end API tests (no browser or API key needed; temporary database per test)."""
import pytest

from tests.conftest import TEXT


def test_status_and_seed(client):
    assert client.get("/api/status").status_code == 200
    ov = client.get("/api/overview").get_json()
    assert ov["stats"]["lectures"] >= 3
    assert len(ov["courses"]) >= 2


def test_live_analyze(client):
    r = client.post("/api/analyze", json={"transcript": TEXT, "live": True}).get_json()
    assert r["summary"] and r["sections"]


def test_frontend_and_json_404(client):
    assert client.get("/").status_code == 200
    assert client.get("/api/nope").get_json() == {"error": "Not found"}


def test_course_crud(client):
    r = client.post("/api/courses", json={"name": "Chemistry 101"})
    assert r.status_code == 201
    cid = r.get_json()["id"]
    assert client.post("/api/courses", json={"name": " "}).status_code == 400
    assert client.delete(f"/api/courses/{cid}").status_code == 200


def test_lecture_create_validation(client):
    assert client.post("/api/lectures", json={"transcript": ""}).status_code == 400


def test_audio_upload_and_range(client, lecture, audio_file):
    r = client.post(f"/api/lectures/{lecture}/audio", data=audio_file, content_type="multipart/form-data")
    assert r.status_code == 200
    r = client.get(f"/api/lectures/{lecture}/audio", headers={"Range": "bytes=0-9"})
    assert r.status_code in (200, 206)


def test_analyze_and_get_lecture(client, lecture):
    r = client.post(f"/api/lectures/{lecture}/analyze", json={}).get_json()
    assert r["notes"]["concepts"] and r["quiz_size"] > 0
    d = client.get(f"/api/lectures/{lecture}").get_json()
    assert d["lecture"]["segments"][0]["t"] == 0
    assert len(d["siblings"]) == 1


def test_bookmarks(client, lecture):
    r = client.post(f"/api/lectures/{lecture}/bookmarks", json={"t": 6.5, "text": "It takes place in chloroplasts."})
    assert r.status_code == 201
    assert len(client.get(f"/api/lectures/{lecture}").get_json()["bookmarks"]) == 1
    assert client.delete(f"/api/bookmarks/{r.get_json()['id']}").status_code == 200


def test_tutor_chat(client, lecture):
    r = client.post(f"/api/lectures/{lecture}/ask", json={"question": "Where does the Calvin cycle happen?"}).get_json()
    assert "stroma" in r["answer"].lower()
    client.post(f"/api/lectures/{lecture}/ask", json={"question": "Explain chlorophyll", "mode": "simple"})
    assert len(client.get(f"/api/lectures/{lecture}").get_json()["chat"]) == 4
    assert client.delete(f"/api/lectures/{lecture}/chat").status_code == 200


def test_quiz_does_not_leak_answers_and_scores(client, lecture):
    q = client.post(f"/api/lectures/{lecture}/quiz", json={}).get_json()["questions"]
    assert len(q) >= 3
    assert all("answer_index" not in x and len(x["options"]) >= 2 for x in q)
    r = client.post(f"/api/lectures/{lecture}/attempts", json={"answers": [0] * len(q)}).get_json()
    assert r["total"] == len(q) and 0 <= r["score"] <= r["total"]
    assert all("answer_index" in x for x in r["details"])
    assert client.post(f"/api/lectures/{lecture}/quiz", json={"regenerate": True}).status_code == 200


def test_revision_plan_and_analytics(client, lecture):
    q = client.post(f"/api/lectures/{lecture}/quiz", json={}).get_json()["questions"]
    client.post(f"/api/lectures/{lecture}/attempts", json={"answers": [0] * len(q)})
    client.post(f"/api/lectures/{lecture}/ask", json={"question": "What is ATP?"})
    plan = client.post(f"/api/lectures/{lecture}/revision", json={}).get_json()
    assert plan["steps"] and plan["summary"]
    a = client.get("/api/analytics").get_json()
    assert a["totals"]["attempts"] >= 1
    assert a["top_questions"]
    assert len(a["activity"]) == 14


def test_search_and_filter(client, lecture, course):
    res = client.get("/api/lectures?q=calvin").get_json()
    assert any(x["id"] == lecture and "snippet" in x for x in res)
    assert all(x["course_id"] == course for x in client.get(f"/api/lectures?course={course}").get_json())


def test_update_lecture(client, lecture):
    notes = client.get(f"/api/lectures/{lecture}").get_json()["lecture"]["notes"]
    notes["title"] = "Edited title"
    client.put(f"/api/lectures/{lecture}", json={"title": "Renamed", "notes": notes})
    d = client.get(f"/api/lectures/{lecture}").get_json()["lecture"]
    assert d["title"] == "Renamed" and d["notes"]["title"] == "Edited title"
    client.put(f"/api/lectures/{lecture}", json={"transcript": TEXT + " Extra sentence about starch storage."})
    d = client.get(f"/api/lectures/{lecture}").get_json()["lecture"]
    assert d["segments"][0]["t"] is None  # editing the transcript drops timestamps


@pytest.mark.parametrize("fmt,mode", [("pdf", "full"), ("pdf", "notes"), ("pdf", "transcript"), ("md", "full"), ("txt", "notes")])
def test_exports(client, lecture, fmt, mode):
    r = client.get(f"/api/lectures/{lecture}/export?format={fmt}&mode={mode}")
    assert r.status_code == 200
    assert r.data[:5] == b"%PDF-" if fmt == "pdf" else len(r.data) > 100


def test_bad_export_format(client, lecture):
    assert client.get(f"/api/lectures/{lecture}/export?format=zip").status_code == 400


def test_delete_lecture(client, lecture):
    assert client.delete(f"/api/lectures/{lecture}").status_code == 200
    assert client.get(f"/api/lectures/{lecture}").status_code == 404
