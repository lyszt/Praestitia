 .PHONY: runserver frontend dev help 

all:
	@cd praestitia && npm i
	@cd backend && pip install -r requirements.txt


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
	@cd backend && bash -lc "source venv/bin/activate && python manage.py runserver 0.0.0.0:8000"

frontend:
	@echo "Starting frontend (npm run dev) in ./praestitia..."
	@cd praestitia && npm run dev

dev:
	@echo "Starting frontend and backend in parallel..."
	@echo "Running root npm dev (uses concurrently to start both services)"
	@npm run dev
