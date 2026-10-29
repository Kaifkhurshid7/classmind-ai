.PHONY: install run test lint docker

install:
	pip install -r backend/requirements-dev.txt

run:
	cd backend && python wsgi.py

test:
	cd backend && python -m pytest

lint:
	cd backend && python -m ruff check .

docker:
	docker compose up --build
