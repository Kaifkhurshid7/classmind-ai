"""Production server: gunicorn supervises uvicorn workers (Linux/macOS). Start with `gunicorn asgi:app`.

Workers default to 1 on SQLite (a single writer) and scale with CPU cores on PostgreSQL.
Override with WEB_CONCURRENCY.
"""
import multiprocessing
import os

from app.config import Settings

bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"
worker_class = "uvicorn_worker.UvicornWorker"
timeout = 120  # AI calls and PDF export can be slow
graceful_timeout = 30
keepalive = 5
accesslog = "-"

_sqlite = Settings().db_url.startswith("sqlite")
workers = int(os.environ.get("WEB_CONCURRENCY") or (1 if _sqlite else min(4, multiprocessing.cpu_count() * 2 + 1)))

# Create the app (migrations and demo seed) once in the master process, not once per worker.
preload_app = True


def post_fork(server, worker):
    # Each worker opens its own database connections instead of sharing the master's sockets.
    from app.database import dispose_engines

    dispose_engines()
