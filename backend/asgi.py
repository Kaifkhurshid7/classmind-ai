"""ASGI entry point: `uvicorn asgi:app --reload --port 5000` for development."""
import os

import uvicorn

if os.environ.get("VERCEL"):
    # Serverless functions have no persistent disk: keep the demo database in /tmp (rebuilt on each cold start)
    os.environ.setdefault("CLASSMIND_DATA", "/tmp/classmind")

from app import create_app  # noqa: E402

app = create_app()

if __name__ == "__main__":
    uvicorn.run("asgi:app", host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), reload=os.environ.get("RELOAD") == "1")
