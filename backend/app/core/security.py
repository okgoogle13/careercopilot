import logging
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Header, HTTPException, Request, status
from firebase_admin import auth
from google.auth.transport import requests
from google.oauth2 import id_token

logger = logging.getLogger(__name__)

# JWT Configuration
# Allow tests to run without JWT_SECRET_KEY by using a default test value
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    # Only raise error in production/staging, use test key in development/test
    env = os.getenv("ENV", os.getenv("ENVIRONMENT", "development"))
    if env in ["production", "staging"]:
        raise ValueError("JWT_SECRET_KEY environment variable must be set in production")
    SECRET_KEY = "insecure-default-test-key-do-not-use-in-production"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token expiration time in minutes


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


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token with the provided data.

    Args:
        data: Dictionary containing the data to encode in the token
        expires_delta: Optional timedelta for token expiration

    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# ============================================================================
# Firebase Authentication (Added for user authentication in job queue)
# ============================================================================


class AuthenticationError(HTTPException):
    """Custom exception for authentication failures."""

    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


async def verify_firebase_token(token: str) -> dict:
    """
    Verify a Firebase ID token and return the decoded claims.

    Args:
        token: Firebase ID token (JWT)

    Returns:
        dict: Decoded token claims including user_id (uid)

    Raises:
        AuthenticationError: If token is invalid or expired
    """
    try:
        # Verify the token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        logger.debug(f"Token verified for user: {decoded_token.get('uid')}")
        return decoded_token

    except auth.ExpiredIdTokenError as e:
        logger.warning(f"Expired Firebase token: {e}")
        raise AuthenticationError("Authentication token has expired")

    except auth.RevokedIdTokenError as e:
        logger.warning(f"Revoked Firebase token: {e}")
        raise AuthenticationError("Authentication token has been revoked")

    except auth.InvalidIdTokenError as e:
        logger.warning(f"Invalid Firebase token: {e}")
        raise AuthenticationError("Invalid authentication token")

    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise AuthenticationError("Authentication failed")


async def get_current_user_id(authorization: str | None = Header(None)) -> str:
    """
    Extract and verify the current user's ID from the Authorization header.

    This is a FastAPI dependency that can be used to protect endpoints.

    Args:
        authorization: Authorization header value (format: "Bearer <token>")

    Returns:
        str: User ID (Firebase UID)

    Raises:
        AuthenticationError: If authentication fails

    Usage:
        @router.get("/protected")
        async def protected_route(user_id: str = Depends(get_current_user_id)):
            return {"user_id": user_id}
    """
    if not authorization:
        logger.warning("Missing Authorization header")
        raise AuthenticationError("Missing authentication token")

    # Extract token from "Bearer <token>" format
    parts = authorization.split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        logger.warning(f"Invalid Authorization header format: {authorization[:20]}...")
        raise AuthenticationError("Invalid authorization header format")

    token = parts[1]

    # Verify token and extract user ID
    try:
        decoded_token = await verify_firebase_token(token)
        user_id = decoded_token.get("uid")

        if not user_id:
            logger.error("Token missing 'uid' claim")
            raise AuthenticationError("Invalid token claims")

        return user_id

    except AuthenticationError:
        raise  # Re-raise our custom exceptions

    except Exception as e:
        logger.error(f"Unexpected error during authentication: {e}")
        raise AuthenticationError("Authentication failed")


async def get_current_user_optional(authorization: str | None = Header(None)) -> str | None:
    """
    Extract user ID from Authorization header if present, otherwise return None.

    This is useful for endpoints that work for both authenticated and anonymous users.

    Args:
        authorization: Authorization header value (optional)

    Returns:
        Optional[str]: User ID if authenticated, None if not

    Usage:
        @router.get("/optional-auth")
        async def optional_route(user_id: Optional[str] = Depends(get_current_user_optional)):
            if user_id:
                return {"message": f"Hello user {user_id}"}
            return {"message": "Hello anonymous user"}
    """
    if not authorization:
        return None

    try:
        return await get_current_user_id(authorization)
    except AuthenticationError:
        # Don't fail, just return None for optional auth
        return None
