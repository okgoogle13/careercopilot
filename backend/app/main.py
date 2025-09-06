import logging
import os

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

# Initialize logger
logger = logging.getLogger(__name__)

from app.api.endpoints import rag as rag_endpoints
from app.api.middleware.firebase_auth import FirebaseAuthError
from app.api.v1 import (
    ai_powered_career_services,
    ai_services,
    analysis,
    auth,
    database,
    documents,
    integrations,
    intelligence,
    jobs,
    ksc,
    monitoring,
    opportunities,
    profile,
    settings,
    users,
    workflows,
)
from app.core.cache_middleware import add_cache_middleware, cache_health_check, cache_lifespan
from app.core.firebase import initialize_firebase

from app.core.genkit_init import check_genkit_health, init_genkit
from app.core.limiter import _rate_limit_exceeded_handler, authenticated_limiter, limiter
from app.core.logging_config import setup_logging
from app.core.monitoring import start_system_monitoring, stop_system_monitoring
from app.core.monitoring_middleware import add_monitoring_middleware

# Import API routers
from fastapi import APIRouter

# Setup logging first
setup_logging(environment=os.getenv("ENV", "development"))


async def app_lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    await cache_lifespan(app).__aenter__()
    await start_system_monitoring()

    # Initialize Firebase
    try:
        firebase_app = initialize_firebase()
        if firebase_app:
            logger.info("Firebase initialized successfully")
        else:
            logger.warning("Firebase initialization failed or was skipped")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {str(e)}", exc_info=True)

    # Initialize database
    from app.core.database import init_database

    try:
        init_database()
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")

    # Initialize AI configuration
    from app.core.ai_client import setup_ai_client
    from app.core.ai_config import setup_ai_config

    ai_config = setup_ai_config()
    setup_ai_client(ai_config)

    # Initialize Genkit if enabled
    try:
        init_genkit()
    except Exception as e:
        logger.error(f"Genkit initialization failed: {e}")

    # Initialize RAG services if enabled
    if os.getenv("ENABLE_RAG", "true").lower() == "true":
        try:
            # This will initialize the RAG integration with default settings
            from app.core.vector_store import vector_store

            await vector_store.load_or_create_index()

            print("RAG services initialized successfully")
        except Exception as e:
            print(f"RAG services initialization failed: {e}")

    yield

    # Shutdown
    await stop_system_monitoring()


app = FastAPI(title="Careercopilot API", lifespan=app_lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add exception handlers
@app.exception_handler(FirebaseAuthError)
async def firebase_auth_exception_handler(request: Request, exc: FirebaseAuthError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
    )


# Add rate limiting exception handler
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
]

# Add the frontend URL from environment variables if it exists
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.state.authenticated_limiter = authenticated_limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add cache middleware
add_cache_middleware(app)

# Add monitoring middleware
add_monitoring_middleware(app)


api_router = APIRouter()

# Authentication & User Management
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(users.router, prefix="/user", tags=["user"])

# Database Management
api_router.include_router(database.router, prefix="/database", tags=["database"])

# Core Workflows (Phase 1+2 Implementation)
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])

# Legacy API endpoints
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["opportunities"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(ksc.router, prefix="/ksc", tags=["ksc"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(ai_services.router, prefix="/ai", tags=["ai-services"])

# Advanced AI-Powered Career Services
api_router.include_router(
    ai_powered_career_services.router, prefix="/ai-career", tags=["ai-career-services"]
)


# Placeholder for the document generation flow
async def document_generation_flow(
    template_id: str, user_profile: dict, job_description: str, ats_requirements: dict
):
    # In a real implementation, this would call the Genkit workflow
    return {
        "status": "success",
        "template_id": template_id,
        "message": "Document generated successfully",
    }


@app.post("/api/generate-document-with-template")
async def generate_document_with_template(
    template_id: str, user_profile: dict, job_description: str, ats_analysis: dict
):
    # Connect to your existing Genkit document generation workflow
    result = await document_generation_flow(
        template_id=template_id,
        user_profile=user_profile,
        job_description=job_description,
        ats_requirements=ats_analysis,
    )
    return result


# Include API routers
app.include_router(api_router, prefix="/api/v1")

# Include RAG endpoints if enabled
if os.getenv("ENABLE_RAG", "true").lower() == "true":
    app.include_router(
        rag_endpoints.router,
        prefix="/api/v1/rag",
        tags=["RAG"],
        responses={404: {"description": "Not found"}},
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Enhanced health check with database and service status"""
    from app.core.database import check_database_health

    try:
        db_health = check_database_health()
        cache_status = cache_health_check()
        # genkit_health = check_genkit_health()  # Temporarily disabled
        genkit_health = {"status": "disabled", "reason": "temporarily disabled"}

        return {
            "status": "healthy",
            "version": "2.0.0",
            "features": ["production-infrastructure", "advanced-intelligence", "genkit-ai-flows"],
            "database": db_health,
            "cache": cache_status,
            "genkit": genkit_health,
            "services": {"api": "healthy", "ai_client": "healthy", "cache": "healthy"},
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e), "version": "2.0.0"}


@app.get("/cache/health", tags=["Health"])
async def cache_health():
    return await cache_health_check()


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
