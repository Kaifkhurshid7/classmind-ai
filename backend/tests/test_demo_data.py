"""The sample data should look like a real, populated instance."""
from app.demo_data import COURSES, LECTURES


def test_seeded_courses_have_faculty(client):
    courses = client.get("/api/overview").get_json()["courses"]
    assert len(courses) == len(COURSES)
    assert all(c["instructor"] and c["instructor_title"] for c in courses)


def test_seeded_lectures_are_rich(client):
    lectures = client.get("/api/lectures").get_json()
    assert len(lectures) == len(LECTURES)
    detail = client.get(f"/api/lectures/{lectures[0]['id']}").get_json()
    lec = detail["lecture"]
    assert lec["words"] > 300
    assert lec["instructor"]
    assert lec["notes"]["concepts"] and lec["notes"]["sections"] and lec["notes"]["engine"] == "demo"
    assert detail["quiz_size"] >= 3


def test_seeded_activity_feeds_analytics(client):
    a = client.get("/api/analytics").get_json()
    assert a["totals"]["attempts"] > 10
    assert a["top_questions"] and a["weak_topics"]


def test_course_instructor_round_trip(client):
    r = client.post("/api/courses", json={"name": "Chemistry", "instructor": "Dr. Test", "instructor_title": "Professor"})
    assert r.get_json()["instructor"] == "Dr. Test"
    cid = r.get_json()["id"]
    client.put(f"/api/courses/{cid}", json={"instructor": "Prof. New"})
    got = client.get(f"/api/courses/{cid}").get_json()
    assert got["instructor"] == "Prof. New" and got["instructor_title"] == "Professor"
