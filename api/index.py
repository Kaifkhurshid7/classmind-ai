"""Vercel entry point: the FastAPI backend as one serverless function (demo deployment).

Vercel functions have no persistent disk, so the SQLite database lives in /tmp and is rebuilt from the demo
data on every cold start. Anything created in the app is temporary. See README, "Deploy a demo on Vercel".
"""
import os
import sys
from pathlib import Path

os.environ.setdefault("CLASSMIND_DATA", "/tmp/classmind")
os.environ.setdefault("CLASSMIND_SEED", "1")

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app import create_app  # noqa: E402

app = create_app()
