# backend/app/main.py (Production Ready)

import json
import os
import sys

# Fix Python path for Cloud Run deployment
# Cloud Run may not respect PYTHONPATH environment variable correctly
if "/app" not in sys.path:
    sys.path.insert(0, "/app")
if "/app/app" not in sys.path:
    sys.path.insert(0, "/app/app")

# Ensure PORT environment variable is set correctly



import firebase_admin
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials

from app.api.router import api_router
from app.core.genkit_init import check_genkit_health, startup_genkit
from app.core.loguru_config import configure_loguru, get_logger, log_security_event
from app.core.monitoring import setup_prometheus_monitoring
from app.core.secure_config import SecureSettings
from app.core.database import init_database

# Initialize secure configuration
settings = SecureSettings()

# Configure structured logging
configure_loguru(environment=settings.ENV, log_dir="logs", service_name="careercopilot-api")

# Get application logger
logger = get_logger(__name__)

# Create the FastAPI app instance
app = FastAPI(
    title="Careercopilot API",
    description="AI-powered backend for the Careercopilot application.",
    version="1.1.0",
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZIP compression middleware for response compression
# Compresses responses larger than 1000 bytes using gzip algorithm
# Reduces bandwidth usage and improves response times for large payloads
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Set up Prometheus monitoring
if settings.ENV != "test":
    setup_prometheus_monitoring(app, environment=settings.ENV)

@app.on_event("startup")
def on_startup():
    """Initialize services when the application starts."""
    logger.info("Starting CareerCopilot API application", environment=settings.ENV)
    
    # Initialize Database (Create Tables)
    try:
        init_database()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

    # ... rest of startup ...

    # --- Firebase Initialization Logic ---
    try:
        cred_json_str = settings.GOOGLE_APPLICATION_CREDENTIALS_JSON
        if cred_json_str:
            cred_dict = json.loads(cred_json_str)
            cred = credentials.Certificate(cred_dict)
            logger.info("Using Firebase credentials from Secret Manager")
        else:
            # Fallback for local dev using a file path
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if cred_path:
                cred = credentials.Certificate(cred_path)
                logger.info("Using Firebase credentials from file", path=cred_path)
            else:
                logger.warning("No Firebase credentials configured")
                return

        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")
    except Exception as e:
        logger.critical("Failed to initialize Firebase Admin SDK", error=str(e), exc_info=True)
        log_security_event("firebase_init_failure", error=str(e))
        # In production, consider failing fast if Firebase is essential
        if settings.ENV == "production":
            raise

    # --- Genkit Initialization ---
    try:
        startup_genkit()
        logger.info("Genkit AI framework initialized successfully")
    except Exception as e:
        logger.error("Failed to initialize Genkit", error=str(e), exc_info=True)


# Include the main API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Root"])
async def read_root():
    return {"status": "ok"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"api_status": "ok", "genkit_status": check_genkit_health()}
