"""
dependencies.py

FastAPI dependencies for authentication, authorization, and data access.
Now using Supabase-aligned auth.
"""

import logging
from typing import Optional
from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user as supabase_get_current_user
from app.core.auth import get_current_user_optional as supabase_get_current_user_optional
from app.models.database import User
from app.services.cache_store import SQLAlchemyCacheStore

logger = logging.getLogger(__name__)

def get_current_user(user: User = Depends(supabase_get_current_user)) -> User:
    """
    Dependency to get current authenticated user.
    Proxies to the Supabase auth implementation in app.core.auth.
    """
    return user

def get_current_user_optional(user: Optional[User] = Depends(supabase_get_current_user_optional)) -> Optional[User]:
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

def get_cache(db: Session = Depends(get_db)) -> SQLAlchemyCacheStore:
    """
    Dependency to get the SQLAlchemy cache store.
    """
    return SQLAlchemyCacheStore(db)
