.PHONY: runserver frontend dev help 

PORT ?= 5000

all: install-frontend install-backend

install-frontend:
	@npm i

install-backend:
	@cd backend && if [ ! -d venv ]; then python -m venv venv; fi && bash -lc "source venv/bin/activate && pip install -r requirements.txt"


help:
	@echo "Makefile targets:"
	@echo "  runserver   - Start Django dev server (creates venv if missing)"
	@echo "  frontend    - Run frontend dev server (npm run dev)"
	@echo "  dev         - Run frontend and Django server in parallel"

runserver:
	@echo "Starting Django development server..."
	@if [ ! -d backend/venv ]; then \
		cd backend && python -m venv venv; \
	fi
	@cd backend && bash -lc "source venv/bin/activate && python manage.py runserver 127.0.0.1:$(PORT)"

frontend:
	@echo "Starting frontend (npm run dev) in project root..."
	@npm run dev

dev:
	@echo "Starting frontend and backend in parallel..."
	@echo "Running root npm dev (uses concurrently to start both services)"
	@npm run dev

makemigrations:
	@echo "Creating backend Django migrations..."
	@if [ ! -d backend/venv ]; then cd backend && python -m venv venv; fi
	@cd backend && bash -lc "source venv/bin/activate && python manage.py makemigrations --noinput"

migrate:
	@echo "Applying backend Django migrations..."
	@if [ ! -d backend/venv ]; then cd backend && python -m venv venv; fi
	@cd backend && bash -lc "source venv/bin/activate && python manage.py migrate"
