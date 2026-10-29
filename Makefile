.PHONY: install build run dev-backend dev-frontend reseed test lint docker

install:
	pip install -r backend/requirements-dev.txt
	cd frontend && npm install

# Production-style: build the React app, FastAPI serves it on :5000
build:
	cd frontend && npm run build

run: build
	cd backend && python asgi.py

# Development: run both (two terminals). UI on :5173 proxies /api to FastAPI on :5000
dev-backend:
	cd backend && RELOAD=1 python asgi.py

dev-frontend:
	cd frontend && npm run dev

# Wipe the database and re-create the sample courses, faculty and lectures
reseed:
	cd backend && python -m app.seed --reset

test:
	cd backend && python -m pytest
	cd frontend && npm test

lint:
	cd backend && python -m ruff check .
	cd frontend && npm run typecheck

docker:
	docker compose up --build
