# ---- Stage 1: build the React frontend ----
FROM node:22-alpine AS frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---- Stage 2: FastAPI serving the built frontend ----
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    CLASSMIND_DATA=/data CLASSMIND_FRONTEND=/srv/frontend

RUN apt-get update && apt-get install -y --no-install-recommends fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY --from=frontend /build/dist /srv/frontend

RUN useradd -r app && mkdir /data && chown app /data
USER app
VOLUME /data
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s     CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/api/status', timeout=4)"

# gunicorn supervises uvicorn workers; see backend/gunicorn.conf.py (1 worker on SQLite, more on PostgreSQL)
CMD ["gunicorn", "asgi:app"]
