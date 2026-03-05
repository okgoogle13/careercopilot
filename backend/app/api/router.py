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
    asset_review,
    auth,
    config,
    documents,
    genkit,
    job_listings,
    manifest_integration,
    opportunities,
    smart_ingestion,
    workflows,
)

api_router = APIRouter()

# Include all routers with their respective prefixes
routers = [
    (analysis.router, "/analysis", "Analysis"),
    (auth.router, "/auth", "Authentication"),
    (config.router, "/config", "Configuration"),
    (documents.router, "/documents", "Documents"),
    (workflows.router, "/workflows", "Workflows"),
    (smart_ingestion.router, "/smart-ingestion", "Smart Ingestion"),
    (applications.router, "/applications", "Applications"),
    (opportunities.router, "/opportunities", "Opportunities"),
    (genkit.router, "/genkit", "Genkit AI"),
    (job_listings.router, "/job-listings", "Job Listings"),
    (manifest_integration.router, "/manifest-integration", "Manifest Integration"),
    (asset_review.router, "/asset-review", "Asset Review"),
]

# Include all routers
for router, prefix, tag in routers:
    if router:
        api_router.include_router(router, prefix=prefix, tags=[tag])
