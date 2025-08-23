import os

from app.api.v1 import (
    ai_services,
    analysis,
    documents,
    integrations,
    jobs,
    ksc,
    monitoring,
    opportunities,
    profile,
    settings,
    users,
)
from app.core.cache_middleware import (
    add_cache_middleware,
    cache_health_check,
    cache_lifespan,
)
from app.core.limiter import (
    NotAuthenticatedException,
    _not_authenticated_handler,
    _rate_limit_exceeded_handler,
    limiter,
    strict_limiter,
)
from app.core.logging_config import setup_logging
from app.core.monitoring import start_system_monitoring, stop_system_monitoring
from app.core.monitoring_middleware import add_monitoring_middleware
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

# Setup logging first
setup_logging(environment=os.getenv("ENV", "development"))


async def app_lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    await cache_lifespan(app).__aenter__()
    await start_system_monitoring()

    # Initialize AI configuration
    from app.core.ai_client import setup_ai_client
    from app.core.ai_config import setup_ai_config

    ai_config = setup_ai_config()
    setup_ai_client(ai_config)

    yield

    # Shutdown
    await stop_system_monitoring()
    await cache_lifespan(app).__aexit__(None, None, None)


app = FastAPI(title="Careercopilot API", lifespan=app_lifespan)

# Add CORS middleware
origins = [
    "http://localhost:3000",
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
app.state.strict_limiter = strict_limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_exception_handler(NotAuthenticatedException, _not_authenticated_handler)

# Add cache middleware
add_cache_middleware(app)

# Add monitoring middleware
add_monitoring_middleware(app)


api_router = APIRouter()
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(
    integrations.router, prefix="/integrations", tags=["integrations"]
)
api_router.include_router(
    opportunities.router, prefix="/opportunities", tags=["opportunities"]
)
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(ksc.router, prefix="/ksc", tags=["ksc"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(ai_services.router, prefix="/ai", tags=["ai-services"])


app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}


@app.get("/cache/health", tags=["Health"])
async def cache_health():
    return await cache_health_check()


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
