"""
router.py

Main API router that includes all endpoint modules.
Migrated from v1 structure to organized endpoint modules.
"""
from fastapi import APIRouter

# Import endpoint modules (temporarily excluding problematic ones)
try:
    from .endpoints import analysis, profiles

    ENDPOINTS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import endpoints: {e}")
    ENDPOINTS_AVAILABLE = False
# Import all working v1 modules (Genkit issues fixed!)
from .v1 import documents  # Fixed Genkit issues
from .v1 import profile  # Fixed Genkit issues
from .v1 import (
    ai_powered_career_services,
    ai_services,
    auth,
    cover_letters,
    database,
    document_analysis,
    integrations,
    intelligence,
    jobs,
    ksc,
    monitoring,
    opportunities,
    settings,
    users,
    workflows,
)

api_router = APIRouter()

# Core endpoints (migrated to new structure)
if ENDPOINTS_AVAILABLE:
    api_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
    api_router.include_router(profiles.router, prefix="/profiles", tags=["User Profiles"])

# V1 endpoints (all modules now working!)
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(
    document_analysis.router, prefix="/document-analysis", tags=["Document Analysis"]
)
api_router.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["Intelligence"])
api_router.include_router(ai_services.router, prefix="/ai", tags=["AI Services"])
api_router.include_router(
    ai_powered_career_services.router, prefix="/ai-career", tags=["AI Career Services"]
)
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunities"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["Integrations"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["Monitoring"])
api_router.include_router(database.router, prefix="/database", tags=["Database"])
api_router.include_router(ksc.router, prefix="/ksc", tags=["KSC"])
api_router.include_router(cover_letters.router, prefix="/cover-letters", tags=["Cover Letters"])
