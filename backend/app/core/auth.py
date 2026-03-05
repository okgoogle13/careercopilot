"""
Authentication system using Firebase ID tokens.
"""

import logging
import os
from datetime import datetime, timedelta
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.firebase import verify_id_token
from app.models import User

logger = logging.getLogger(__name__)

# JWT Bearer token scheme
security = HTTPBearer()


class AuthManager:
    """Handles authentication operations via Firebase ID tokens"""

    def verify_token(self, token: str) -> dict[str, Any] | None:
        """Verify Firebase ID token and return payload"""
        return verify_id_token(token)


# Global auth manager instance
auth_manager = AuthManager()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency to get current authenticated user from Firebase ID token.
    Validates the Firebase Token and ensures the user exists in our local cache (users table).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = auth_manager.verify_token(token)
        if payload is None:
            raise credentials_exception

        # Firebase stores the UUID in 'sub' or 'uid'
        user_id = payload.get("sub") or payload.get("uid")
        if not isinstance(user_id, str):
            raise credentials_exception

        # Sync user with local database (Just-In-Time Provisioning)
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            # Extract metadata for JIT provisioning
            email = payload.get("email")
            # Firebase stores name directly or in 'name'
            name = payload.get("name") or email.split("@")[0] if email else "Firebase User"

            if not email:
                logger.error(f"Token for {user_id} missing email, required for provisioning")
                raise credentials_exception

            logger.info(f"Provisioning new user record for {email} ({user_id})")
            user = User(id=user_id, email=email, name=name)
            db.add(user)
            try:
                db.commit()
                db.refresh(user)
            except Exception as e:
                db.rollback()
                logger.error(f"Failed to provision user {user_id}: {e}")
                # Possible race condition if multiple requests come in at once
                user = db.query(User).filter(User.id == user_id).first()
                if not user:
                    raise credentials_exception

        return user

    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Authentication failed: {e}")
        raise credentials_exception


async def get_current_user_optional(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> User | None:
    """Optional authentication"""
    if not credentials:
        return None

    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None


def create_user_token(user: User) -> str:
    """
    Legacy helper - Firebase handles token generation.
    """
    raise NotImplementedError("Tokens are managed by Firebase Auth")


# Simple rate limiter (unchanged)
class RateLimiter:
    def __init__(self):
        self.requests = {}

    def check_rate_limit(self, user_id: str, limit: int = 100, window: int = 3600) -> bool:
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=window)
        if user_id not in self.requests:
            self.requests[user_id] = []
        self.requests[user_id] = [req for req in self.requests[user_id] if req[0] > window_start]
        if sum(req[1] for req in self.requests[user_id]) >= limit:
            return False
        self.requests[user_id].append((now, 1))
        return True


rate_limiter = RateLimiter()
