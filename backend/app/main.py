# backend/app/main.py (Production Ready)

import os
import sys

# Fix Python path for Cloud Run deployment
# Cloud Run may not respect PYTHONPATH environment variable correctly
if "/app" not in sys.path:
    sys.path.insert(0, "/app")
if "/app/app" not in sys.path:
    sys.path.insert(0, "/app/app")

# Ensure PORT environment variable is set correctly

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

from app.api.endpoints import ingest

from app.api.routes.career import router as career_router
from app.api.routes.ingestion import router as ingestion_router
from app.api.endpoints.job_scout import router as job_scout_router
from app.api.router import api_router
from app.core.cache_middleware import add_cache_middleware
from app.core.database import init_database
from app.core.genkit_init import check_genkit_health, startup_genkit
from app.core.loguru_config import configure_loguru, get_logger
from app.core.monitoring import setup_prometheus_monitoring
from app.core.secure_config import SecureSettings

# Initialize secure configuration
settings = SecureSettings()

# Configure structured logging
configure_loguru(environment=settings.ENV, log_dir="logs", service_name="careercopilot-api")

# Get application logger
logger = get_logger(__name__)

# Initialize Sentry
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[
            StarletteIntegration(transaction_style="endpoint"),
            FastApiIntegration(at_exit=True),
        ],
        send_default_pii=True,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment=os.getenv("ENV", "development"),
    )

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

# Add Cache Middleware
add_cache_middleware(app)

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

    # --- Genkit Initialization ---
    try:
        startup_genkit()
        logger.info("Genkit AI framework initialized successfully")
    except Exception as e:
        logger.error("Failed to initialize Genkit", error=str(e), exc_info=True)


# Include the main API router
app.include_router(api_router, prefix="/api")
app.include_router(career_router, prefix="/api/career", tags=["Career Database"])
app.include_router(ingestion_router, prefix="/api/v1", tags=["Career Ingestion"])
app.include_router(job_scout_router, prefix="/api/v1/job-scout", tags=["Job Scout"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["Ingestion"])


@app.get("/", tags=["Root"])
async def read_root():
    return {"status": "ok"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"api_status": "ok", "genkit_status": check_genkit_health()}


@app.get("/api/v1/debug-sentry", tags=["Debug"])
async def trigger_error():
    division_by_zero = 1 / 0
    return {"message": "You should not see this"}
