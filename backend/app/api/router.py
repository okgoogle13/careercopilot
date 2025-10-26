"""
router.py

Main API router that includes all endpoint modules.
"""

from fastapi import APIRouter

# Import endpoint modules
from .endpoints import analysis, auth, config, workflows
from .routers import ingestion

api_router = APIRouter()

# Include all routers with their respective prefixes
routers = [
    (analysis.router, "/analysis", "Analysis"),
    (auth.router, "/auth", "Authentication"),
    (config.router, "/config", "Configuration"),
    (workflows.router, "/workflows", "Workflows"),
    (ingestion.router, "/ingestion", "Smart Ingestion"),
]

# Include all routers
for router, prefix, tag in routers:
    if router:
        api_router.include_router(router, prefix=prefix, tags=[tag])
