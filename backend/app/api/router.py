"""
router.py

Main API router that includes all endpoint modules.
"""

from fastapi import APIRouter

# Import endpoint modules
# Import endpoint modules
from .endpoints import (
    analysis,
    applications,
    chrome_extension,
    config,
    documents,
    genkit,
    opportunities,
    workflows,
)

# from .routers import ingestion

api_router = APIRouter()

# Include all routers with their respective prefixes
routers = [
    (analysis.router, "/analysis", "Analysis"),
    # (auth.router, "/auth", "Authentication"),
    (config.router, "/config", "Configuration"),
    (documents.router, "/documents", "Documents"),
    (workflows.router, "/workflows", "Workflows"),
    # (ingestion.router, "/ingestion", "Smart Ingestion"),
    (applications.router, "/applications", "Applications"),
    (opportunities.router, "/opportunities", "Opportunities"),
    (chrome_extension.router, "/chrome-extension", "Chrome Extension"),
    (genkit.router, "/genkit", "Genkit AI"),
]

# Include all routers
for router, prefix, tag in routers:
    if router:
        api_router.include_router(router, prefix=prefix, tags=[tag])
