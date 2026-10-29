"""ClassMind AI backend: Flask application factory."""
import os

from flask import Flask

from app import database, seed
from app.api import register_blueprints
from app.config import Config
from app.errors import register_error_handlers


def create_app(config: Config | None = None) -> Flask:
    config = config or Config()
    app = Flask(
        __name__,
        static_folder=str(config.FRONTEND_DIR),
        static_url_path="/static",
    )
    app.config.from_object(config)

    os.makedirs(app.config["AUDIO_DIR"], exist_ok=True)
    app.teardown_appcontext(database.close_db)
    register_error_handlers(app)
    register_blueprints(app)

    database.init_db(app.config["DB_PATH"])
    if app.config["SEED_DEMO"]:
        seed.seed_demo(app.config["DB_PATH"])
    return app
