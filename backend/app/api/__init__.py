"""REST API blueprints."""
from flask import Flask


def register_blueprints(app: Flask) -> None:
    from app.api import analytics, courses, exports, learning, lectures, system

    for module in (system, analytics, courses, lectures, learning, exports):
        app.register_blueprint(module.bp)
