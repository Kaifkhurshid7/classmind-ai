"""ClassMind AI backend: FastAPI application factory."""
import os

from fastapi import FastAPI

from app import database, seed
from app.api import register_routers
from app.config import Settings
from app.errors import register_error_handlers


def create_app(config: Settings | None = None) -> FastAPI:
    config = config or Settings()
    app = FastAPI(title="ClassMind AI", version="0.3.0", docs_url="/api/docs", redoc_url=None, openapi_url="/api/openapi.json")
    app.state.config = config

    os.makedirs(config.audio_dir, exist_ok=True)
    database.init_db(config.db_url)
    if config.seed_demo:
        seed.seed_demo(config.db_url)

    register_routers(app)
    register_error_handlers(app)  # also mounts /static and the single-page fallback, so it must come last
    return app
