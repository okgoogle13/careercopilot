"""
Security-related utilities, primarily for handling authentication and
authorization for service-to-service communication within Google Cloud.
"""
import os

from fastapi import HTTPException, Request, status
from google.auth.transport import requests
from google.oauth2 import id_token


async def verify_google_oidc_token(request: Request) -> dict:
    """
    Verifies a Google-issued OIDC token from an Authorization header.

    This function is designed to be used as a FastAPI dependency to secure
    endpoints that are intended to be called by other Google Cloud services,
    such as Cloud Scheduler, Cloud Tasks, or another Cloud Run service.

    It checks for a 'Bearer' token in the 'Authorization' header, then uses
    Google's authentication library to verify the token's signature, expiration,
    and, most importantly, its 'audience' claim. The expected audience must be
    set in the `APP_URL` environment variable.

    Args:
        request: The incoming FastAPI `Request` object.

    Returns:
        The decoded claims from the validated OIDC token as a dictionary.

    Raises:
        HTTPException(401): If the Authorization header is missing, malformed,
                            or if the token is invalid for any reason (e.g.,
                            bad signature, expired, wrong audience).
        HTTPException(500): If the `APP_URL` environment variable, which is
                            required for audience validation, is not set.
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header is missing or invalid.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = auth_header.split("Bearer ")[1]

        audience = os.getenv("APP_URL")
        if not audience:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Application audience (APP_URL) not configured.",
            )

        id_info = id_token.verify_oauth2_token(
            token, requests.Request(), audience=audience
        )

        return id_info

    except HTTPException:
        # Re-raise HTTPException to ensure FastAPI handles it correctly
        raise
    except Exception as e:
        # Catch-all for any other validation errors from the Google library
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid OIDC token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
