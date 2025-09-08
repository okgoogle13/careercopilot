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
from app.monitoring.nlp_metrics_service import start_nlp_metrics_service, stop_nlp_metrics_service

# Import API routers
from fastapi import APIRouter

# Setup logging first
setup_logging(environment=os.getenv("ENV", "development"))


async def app_lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    await cache_lifespan(app).__aenter__()
    await start_system_monitoring()
    start_nlp_metrics_service()
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

    # Preload NLP models for optimized performance
    if os.getenv("ENABLE_NLP_PRELOAD", "true").lower() == "true":
        try:
            from app.core.nlp_model_manager import preload_models

            logger.info("Preloading NLP models for optimal performance...")
            preload_models()
            logger.info("NLP models preloaded successfully")
        except ImportError:
            logger.warning(
                "spaCy not installed. NLP model preloading skipped. "
                "To enable resume parsing optimization, install with: pip install spacy && "
                "python -m spacy download en_core_web_sm"
            )
        except Exception as e:
            logger.error(f"NLP model preloading failed: {e}")

    # Add monitoring middleware
    add_monitoring_middleware(app)

    # Add cache middleware
    add_cache_middleware(app)

    # Add rate limiting middleware
    app.state.limiter = limiter

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add exception handlers
    app.add_exception_handler(FirebaseAuthError, firebase_auth_exception_handler)

    # Add rate limiting exception handler
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Add request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        response = await call_next(request)
        request_id = request.headers.get("X-Request-ID", "none")
        logger.info(
            f"Request: {request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Request ID: {request_id}"
        )
        return response

    yield

    # Shutdown
    await cache_lifespan(app).__aexit__(None, None, None)
    stop_system_monitoring()
    stop_nlp_metrics_service()


app = FastAPI(title="Careercopilot API", lifespan=app_lifespan)

# Include API routers
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
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/health/cache")
async def cache_health():
    """Cache health check"""
    return await cache_health_check()


# Metrics endpoint (for Prometheus)
if os.getenv("ENABLE_METRICS", "false").lower() == "true":
    from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

    @app.get("/metrics")
    async def metrics():
        """Prometheus metrics endpoint"""
        import prometheus_client
        from prometheus_client import multiprocess

        registry = prometheus_client.CollectorRegistry()
        multiprocess.MultiProcessCollector(registry)

        data = generate_latest(registry)
        return Response(
            content=data, media_type=CONTENT_TYPE_LATEST, headers={"Content-Length": str(len(data))}
        )


@app.get("/nlp/health", tags=["Health"])
async def nlp_health():
    """Health check for NLP models"""
    if os.getenv("ENABLE_NLP_PRELOAD", "true").lower() != "true":
        return {"status": "disabled", "message": "NLP preloading is disabled"}

    try:
        from app.core.nlp_model_manager import health_check_models, nlp_model_manager

        health_status = health_check_models()
        memory_usage = nlp_model_manager.get_memory_usage()
        loaded_models = nlp_model_manager.list_loaded_models()

        return {
            "health": health_status,
            "memory_usage": memory_usage,
            "loaded_models": loaded_models,
        }

    except ImportError:
        return {
            "status": "error",
            "message": "spaCy not installed. Install with: pip install spacy && python -m spacy download en_core_web_sm",
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/health", tags=["Health"])
async def health_check():
    """Enhanced health check with database and service status"""
    from app.core.database import check_database_health

    try:
        db_health = check_database_health()
        cache_status = cache_health_check()
        genkit_health = check_genkit_health()

        # Check NLP models health if enabled
        nlp_health = {"status": "disabled"}
        if os.getenv("ENABLE_NLP_PRELOAD", "true").lower() == "true":
            try:
                from app.core.nlp_model_manager import health_check_models

                nlp_health = health_check_models()
            except ImportError:
                nlp_health = {"status": "not_installed", "message": "spaCy not installed"}
            except Exception as e:
                nlp_health = {"status": "error", "error": str(e)}

        return {
            "status": "healthy",
            "version": "2.0.0",
            "features": ["production-infrastructure", "advanced-intelligence", "genkit-ai-flows"],
            "database": db_health,
            "cache": cache_status,
            "genkit": genkit_health,
            "nlp_models": nlp_health,
            "services": {"api": "healthy", "ai_client": "healthy", "cache": "healthy"},
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e), "version": "2.0.0"}

    try:
        from app.core.nlp_model_manager import health_check_models, nlp_model_manager

        health_status = health_check_models()
        memory_usage = nlp_model_manager.get_memory_usage()
        loaded_models = nlp_model_manager.list_loaded_models()

        return {
            "health": health_status,
            "memory_usage": memory_usage,
            "loaded_models": loaded_models,
        }

    except ImportError:
        return {
            "status": "error",
            "message": "spaCy not installed. Install with: pip install spacy && python -m spacy download en_core_web_sm",
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
