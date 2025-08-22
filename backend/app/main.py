from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter, _rate_limit_exceeded_handler, strict_limiter, _not_authenticated_handler, NotAuthenticatedException
from app.core.cache_middleware import add_cache_middleware, cache_lifespan, cache_health_check
from app.api.v1 import profile, documents, users, jobs, integrations, opportunities, settings, ksc, analysis
import os

app = FastAPI(
    title="Careercopilot API",
    lifespan=cache_lifespan
)

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


api_router = APIRouter()
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["opportunities"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(ksc.router, prefix="/ksc", tags=["ksc"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])


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
