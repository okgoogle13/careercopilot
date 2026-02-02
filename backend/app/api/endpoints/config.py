
"""
Configuration API endpoints.

Provides secure access to configuration values for the frontend.
"""

import os
import logging
from typing import Dict
from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/supabase-config", response_model=Dict[str, str])
async def get_supabase_config():
    """
    Get Supabase configuration for frontend.

    Returns:
        dict: Supabase configuration for frontend
    """
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")

        if not supabase_url or not supabase_key:
            logger.warning("Supabase configuration incomplete")
            raise HTTPException(status_code=503, detail="Supabase configuration not available")

        return {
            "url": supabase_url,
            "anonKey": supabase_key,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get Supabase configuration: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve Supabase configuration")
