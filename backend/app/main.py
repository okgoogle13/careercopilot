# backend/app/main.py (Revised)

import json
import os

import firebase_admin
from app.api.router import api_router
from app.core.genkit_init import check_genkit_health, startup_genkit
from fastapi import FastAPI
from firebase_admin import credentials

# Create the FastAPI app instance
app = FastAPI(
    title="Careercopilot API",
    description="AI-powered backend for the Careercopilot application.",
    version="1.0.0",
)


@app.on_event("startup")
def on_startup():
    """Initialize services when the application starts."""

    # --- Firebase Initialization Logic ---
    # MOVED HERE: This now runs only once on startup.
    try:
        cred_json_str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        if cred_json_str:
            cred_dict = json.loads(cred_json_str)
            cred = credentials.Certificate(cred_dict)
        else:
            # Fallback for local dev using a file path
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            cred = credentials.Certificate(cred_path)

        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        print(f"CRITICAL: Failed to initialize Firebase Admin SDK: {e}")
        # In a production app, you might want to prevent startup if Firebase is essential.

    # --- Genkit Initialization ---
    startup_genkit()


# Include the main API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Root"])
async def read_root():
    return {"status": "ok"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"api_status": "ok", "genkit_status": check_genkit_health()}
