# 🧠 PYTHON BACKEND & GENKIT FLOWS

## Architecture

The backend is a monolithic FastAPI application with embedded Genkit flows, deployed via Cloud Run/Firebase Functions.

## Core Directories

- **API Endpoints:** `backend/app/api/endpoints/` (FastAPI route handlers).
- **Core Utilities:** `backend/app/core/` (Contains `firestore_cache.py`, `secret_manager.py`, `genkit_init.py`).
- **Genkit Flows:** `backend/app/genkit_flows/` (Contains specialized workflows like KSC generation, resume analysis).

## Key Patterns

- **Caching:** Firebase Cloud Firestore is the primary cache (`backend/app/core/firestore_cache.py`).
- **Models:** Pydantic models in `backend/app/models/` define the API contracts and validation schemas.

## AI Services

Business logic for AI operations (KSC, analysis) is encapsulated in `backend/app/ai_operations/`.
