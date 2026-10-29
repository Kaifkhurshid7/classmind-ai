"""Frontend entry point, health/status and stateless live analysis."""
from flask import Blueprint, current_app, jsonify, send_from_directory

from app.api.utils import body
from app.services import ai_engine

bp = Blueprint("system", __name__)


@bp.get("/")
def index():
    return send_from_directory(current_app.config["FRONTEND_DIR"], "index.html")


@bp.get("/api/status")
def status():
    ok = ai_engine.ai_available()
    return jsonify({"ai": ok, "model": ai_engine.MODEL if ok else None})


@bp.post("/api/analyze")
def analyze_live():
    """Stateless analysis used for live notes while recording."""
    data = body()
    return jsonify(ai_engine.analyze_lecture(data.get("transcript", ""), use_ai=not data.get("live")))
