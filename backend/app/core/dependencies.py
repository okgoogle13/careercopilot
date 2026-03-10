"""
dependencies.py

FastAPI dependencies for authentication, authorization, and data access.
Now using Firebase-aligned auth.
"""

import logging

from fastapi import Depends, Request

from app.core.auth import get_current_user as auth_get_current_user
from app.core.auth import get_current_user_optional as auth_get_current_user_optional
from app.models.database import User

logger = logging.getLogger(__name__)


def get_current_user(user: User = Depends(auth_get_current_user)) -> User:
    """
    Dependency to get current authenticated user.
    Proxies to the Firebase auth implementation in app.core.auth.
    """
    return user


def get_current_user_optional(
    user: User | None = Depends(auth_get_current_user_optional),
) -> User | None:
    """
    Optional authentication dependency.
    """
    return user


def get_current_user_with_state(
    request: Request, current_user: User = Depends(get_current_user)
) -> User:
    """
    Enhanced dependency that validates the user AND sets
    the user UID in request.state for use by other dependencies.
    """
    request.state.user_uid = current_user.id
    return current_user
