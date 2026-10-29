"""Demo content so the app is not empty on first run (disable with CLASSMIND_SEED=0)."""
from app import database as db
from app.services import ai_engine
from app.services import quiz as quiz_service

LECTURES = [
    (
        "Biology 101",
        "Foundations of life science: cells, energy and living systems.",
        "#0056d2",
        "Photosynthesis: How Plants Make Food",
        "Photosynthesis is the process by which green plants convert light energy into chemical energy. "
        "It takes place in the chloroplasts of plant cells. Chlorophyll is the green pigment that absorbs sunlight. "
        "During photosynthesis plants take in carbon dioxide from the air and water from the soil. "
        "The light reactions happen in the thylakoid membranes and produce ATP and oxygen. "
        "The Calvin cycle uses ATP and carbon dioxide to build glucose in the stroma. "
        "Glucose is stored as starch or used by the plant for energy. "
        "Oxygen is released into the atmosphere as a by product of photosynthesis. "
        "Factors such as light intensity, temperature and carbon dioxide concentration affect the rate of photosynthesis. "
        "Without photosynthesis there would be no oxygen for animals to breathe and no food chain.",
    ),
    (
        "Biology 101",
        None,
        None,
        "The Cell: Structure and Function",
        "The cell is the basic structural and functional unit of all living organisms. "
        "The nucleus is the control centre of the cell and contains the genetic material called DNA. "
        "Mitochondria are the organelles that release energy from food through cellular respiration. "
        "The cell membrane is a thin layer that controls which substances enter and leave the cell. "
        "Ribosomes are small structures where proteins are made. "
        "The endoplasmic reticulum transports proteins and lipids inside the cell. "
        "Plant cells also have a rigid cell wall and chloroplasts, which animal cells do not have. "
        "A large central vacuole stores water and nutrients in plant cells. "
        "All cells come from pre existing cells, and this idea is known as cell theory.",
    ),
    (
        "Physics Basics",
        "Motion, force and energy explained step by step.",
        "#0e7c66",
        "Newton's Laws of Motion",
        "Newton's first law states that an object stays at rest or moves with constant velocity unless a force acts on it. "
        "This tendency to resist changes in motion is called inertia. "
        "Newton's second law says that force equals mass multiplied by acceleration. "
        "A heavier object needs a larger force to get the same acceleration. "
        "Newton's third law states that for every action there is an equal and opposite reaction. "
        "When a rocket pushes gas downward, the gas pushes the rocket upward. "
        "Friction is a force that opposes the motion between two surfaces in contact. "
        "Weight is the force of gravity acting on the mass of an object. "
        "The unit of force is the newton, and one newton accelerates one kilogram at one metre per second squared.",
    ),
]


def make_segments(transcript: str):
    sents = ai_engine.split_sentences(transcript)
    t, segs = 0.0, []
    for s in sents:
        segs.append({"t": round(t, 1), "text": s})
        t += max(2.0, len(s.split()) / 2.6)
    return segs, int(t)


def seed_demo(db_path):
    conn = db.connect(db_path)
    try:
        if conn.execute("SELECT COUNT(*) FROM lectures").fetchone()[0] or conn.execute("SELECT COUNT(*) FROM courses").fetchone()[0]:
            return
        course_ids = {}
        for course, desc, color, title, text in LECTURES:
            if course not in course_ids:
                cur = conn.execute(
                    "INSERT INTO courses(name, description, color, created) VALUES (?,?,?,?)",
                    (course, desc or "", color or "#0056d2", db.now()),
                )
                course_ids[course] = cur.lastrowid
            segs, dur = make_segments(text)
            notes = ai_engine.local_analyze(text)
            quiz = quiz_service.generate_quiz(notes, text, use_ai=False)
            conn.execute(
                "INSERT INTO lectures(course_id,title,transcript,segments,notes,quiz,duration,lang,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (course_ids[course], title, text, db.jd(segs), db.jd(notes), db.jd(quiz), dur, "en-IN", db.now(), db.now()),
            )
        conn.commit()
    finally:
        conn.close()

