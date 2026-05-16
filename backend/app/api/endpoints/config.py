"""
Configuration API endpoints.

Provides secure access to configuration values for the frontend.
"""

import logging

from fastapi import APIRouter, HTTPException

from app.api.endpoints._shared import run_endpoint

logger = logging.getLogger(__name__)

router = APIRouter()


from app.core.secret_manager import get_firebase_frontend_config


@router.get("/firebase-config", response_model=dict[str, str])
async def get_firebase_config():
    """
    Get Firebase configuration for frontend.
    """

    async def operation() -> dict[str, str]:
        # Use secret_manager which handles both env vars and GCP Secret Manager
        frontend_config = get_firebase_frontend_config()

        # Map to CamelCase keys expected by Firebase JS SDK
        config = {
            "apiKey": frontend_config["api_key"],
            "authDomain": frontend_config["auth_domain"],
            "projectId": frontend_config["project_id"],
            "storageBucket": frontend_config["storage_bucket"],
            "messagingSenderId": frontend_config["messaging_sender_id"],
            "appId": frontend_config["app_id"],
        }

        if not config["projectId"]:
            logger.warning("Firebase configuration incomplete: missing projectId")
            raise HTTPException(status_code=503, detail="Firebase configuration not available")

        return config

    return await run_endpoint(
        operation,
        "Failed to retrieve Firebase configuration",
        logger=logger,
    )
