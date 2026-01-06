#!/bin/bash
echo "🚀 Starting CareerCopilot API for Chrome Extension..."
echo "📍 API will be available at http://localhost:8000"
echo "👉 Swagger Docs: http://localhost:8000/docs"

# Ensure virtual environment is activated if it exists
if [ -d ".venv" ]; then
    echo "Using virtual environment..."
    source .venv/bin/activate
fi

cd backend

# Export necessary env vars if not set
export PROJECT_ID=${PROJECT_ID:-careercopilot-dev}
export PYTHONPATH=$PYTHONPATH:.

python -m uvicorn app.main:app --reload --port 8000
