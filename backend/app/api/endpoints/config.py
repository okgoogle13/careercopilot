"""
Configuration API endpoints.

Provides secure access to configuration values for the frontend build process.
"""

import logging
from typing import Dict

from fastapi import APIRouter, HTTPException

from app.core.secret_manager import get_firebase_frontend_config

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/firebase-config", response_model=Dict[str, str])
async def get_firebase_config():
    """
    Get Firebase configuration for frontend build.

    This endpoint provides Firebase configuration values that are safe
    to expose to the frontend. These are the same values that would be
    in VITE_FIREBASE_* environment variables.

    Returns:
        dict: Firebase configuration for frontend
    """
    try:
        config = get_firebase_frontend_config()

        # Validate that we have the essential configuration
        if not config.get("project_id") or not config.get("api_key"):
            logger.warning("Firebase configuration incomplete")
            raise HTTPException(
                status_code=503,
                detail="Firebase configuration not available"
            )

        return {
            "apiKey": config["api_key"],
            "authDomain": config["auth_domain"],
            "projectId": config["project_id"],
            "storageBucket": config["storage_bucket"],
            "messagingSenderId": config["messaging_sender_id"],
            "appId": config["app_id"],
        }

    except Exception as e:
        logger.error(f"Failed to get Firebase configuration: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve Firebase configuration"
        )