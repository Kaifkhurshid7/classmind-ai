"""ASGI entry point: `uvicorn asgi:app --reload --port 5000` for development."""
import os

import uvicorn

from app import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("asgi:app", host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), reload=os.environ.get("RELOAD") == "1")
