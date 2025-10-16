import os

from fastapi import HTTPException, Request, status
from google.auth.transport import requests
from google.oauth2 import id_token


async def verify_google_oidc_token(request: Request):
    """
    Verifies the OIDC token from a Google Cloud service.
    This is used to secure endpoints called by services like Cloud Scheduler.
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

        # The 'audience' should be the URL of your deployed Cloud Run service
        # or the URL you configured in your IAP.
        # It's crucial this is set in your environment variables.
        audience = os.getenv("APP_URL")
        if not audience:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Application audience (APP_URL) not configured.",
            )

        # Verify the token
        id_info = id_token.verify_oauth2_token(token, requests.Request(), audience=audience)

        # You can optionally add more checks here, e.g., on the issuer
        # or the email of the service account.
        # For example:
        # if id_info['iss'] != 'https://accounts.google.com':
        #     raise HTTPException(...)

        return id_info

    except HTTPException as e:
        # Re-raise HTTPException to ensure FastAPI handles it correctly
        raise e
    except Exception as e:
        # Catch-all for any other validation errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid OIDC token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
