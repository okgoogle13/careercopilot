from fastapi import FastAPI, APIRouter, Request
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter, _rate_limit_exceeded_handler
from app.api.v1 import profile, documents, users, jobs, integrations, opportunities, settings, ksc, analysis

app = FastAPI(title="Careercopilot API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
