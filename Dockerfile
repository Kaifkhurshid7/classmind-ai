FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    CLASSMIND_DATA=/data CLASSMIND_FRONTEND=/srv/frontend

RUN apt-get update && apt-get install -y --no-install-recommends fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY frontend/ /srv/frontend/

RUN useradd -r app && mkdir /data && chown app /data
USER app
VOLUME /data
EXPOSE 5000

# SQLite + threads: a single worker with several threads keeps writes safe
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "8", "--timeout", "120", "wsgi:app"]
