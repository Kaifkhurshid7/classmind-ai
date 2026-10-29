"""Health/status and stateless live analysis."""
from fastapi import APIRouter

from app.responses import StatusOut
from app.schemas import AnalyzeIn
from app.services import ai_engine

router = APIRouter(prefix="/api", tags=["system"])


@router.get("/status", response_model=StatusOut)
def status():
    ok = ai_engine.ai_available()
    return {"ai": ok, "model": ai_engine.MODEL if ok else None}


@router.post("/analyze")
def analyze_live(data: AnalyzeIn):
    """Stateless analysis used for live notes while recording."""
    return ai_engine.analyze_lecture(data.transcript, use_ai=not data.live)
