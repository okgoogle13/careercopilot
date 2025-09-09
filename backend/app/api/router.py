"""
router.py

Main API router that includes all endpoint modules.
"""
from fastapi import APIRouter

# Import endpoint modules
from .endpoints import (
    ai_services,
    analysis,
    auth,
    cover_letters,
    database,
    document_analysis,
    documents,
    integrations,
    intelligence,
    jobs,
    ksc,
    monitoring,
    opportunities,
    profile,
    profiles,
    settings,
    users,
    workflows,
)

api_router = APIRouter()

# Include all routers with their respective prefixes
routers = [
    (analysis.router, "/analysis", "Analysis"),
    (profiles.router, "/profiles", "User Profiles"),
    (auth.router, "/auth", "Authentication"),
    (users.router, "/users", "Users"),
    (profile.router, "/profile", "Profile"),
    (documents.router, "/documents", "Documents"),
    (document_analysis.router, "/document-analysis", "Document Analysis"),
    (jobs.router, "/jobs", "Jobs"),
    (workflows.router, "/workflows", "Workflows"),
    (intelligence.router, "/intelligence", "Intelligence"),
    (ai_services.router, "/ai", "AI Services"),
    (opportunities.router, "/opportunities", "Opportunities"),
    (integrations.router, "/integrations", "Integrations"),
    (settings.router, "/settings", "Settings"),
    (monitoring.router, "/monitoring", "Monitoring"),
    (database.router, "/database", "Database"),
    (ksc.router, "/ksc", "KSC"),
    (cover_letters.router, "/cover-letters", "Cover Letters"),
]

# Include all routers
for router, prefix, tag in routers:
    if router:
        api_router.include_router(router, prefix=prefix, tags=[tag])
