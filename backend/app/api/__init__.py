"""REST API routers."""
from fastapi import FastAPI


def register_routers(app: FastAPI) -> None:
    from app.api import analytics, courses, exports, learning, lectures, system

    for module in (system, analytics, courses, lectures, learning, exports):
        app.include_router(module.router)
