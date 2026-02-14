"""
Firebase Authentication Middleware for FastAPI.

This module provides middleware to authenticate requests using Firebase ID tokens.
"""

import logging
from typing import Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings
from app.core.firebase import verify_id_token

logger = logging.getLogger(__name__)


class FirebaseAuthError(Exception):
    """Custom exception for Firebase authentication errors."""


class FirebaseAuthBackend(HTTPBearer):
    """Firebase Authentication Backend for FastAPI."""

    async def __call__(self, request: Request) -> dict[str, Any] | None:
        """Authenticate the request using Firebase ID token.

        Args:
            request: The incoming HTTP request.

        Returns:
            The decoded Firebase ID token if authentication is successful.

        Raises:
            HTTPException: If authentication fails.
        """
        # Skip authentication for development if explicitly disabled
        if settings.ENVIRONMENT == "development" and settings.DISABLE_AUTH:
            return {"uid": "dev-user", "email": "dev@example.com"}

        # Get the authorization header
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing authorization header",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not credentials.scheme == "Bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify the ID token
        token = credentials.credentials
        try:
            decoded_token = verify_id_token(token)
            if not decoded_token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Add the user info to the request state
            request.state.user = decoded_token
            return decoded_token

        except Exception as e:
            logger.error(f"Authentication error: {e!s}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )


# Create an instance of the auth backend
auth_backend = FirebaseAuthBackend()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(auth_backend),
) -> dict[str, Any]:
    """Dependency to get the current authenticated user.

    This can be used in FastAPI route dependencies to require authentication.
    """
    return credentials


def require_role(required_roles: list[str] = None):
    """Decorator to require specific roles for a route.

    Args:
        required_roles: List of role names that are allowed to access the route.
                       If None or empty, any authenticated user can access.
    """
    if required_roles is None:
        required_roles = []

    def role_checker(user: dict[str, Any] = Depends(get_current_user)):
        if not required_roles:
            return user

        user_roles = user.get("roles", [])
        if isinstance(user_roles, str):
            user_roles = [user_roles]

        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return user

    return role_checker
