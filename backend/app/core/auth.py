"""
Authentication system using Supabase JWTs.
"""

import logging
import os
from datetime import datetime, timedelta
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

try:
    from jose import JWTError, jwt
except ImportError:  # pragma: no cover - optional dependency in test/CI
    class JWTError(Exception):
        pass

    class _JwtStub:
        def decode(self, *args, **kwargs):
            raise JWTError("python-jose not installed")

    jwt = _JwtStub()
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.secure_config import settings
from app.models.database import User

logger = logging.getLogger(__name__)

# Security configuration
# In Supabase, this is the "JWT Secret" found in Project Settings -> API
SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.ALGORITHM

# JWT Bearer token scheme
security = HTTPBearer()

class AuthManager:
    """Handles authentication operations via Supabase JWTs"""

    def verify_token(self, token: str) -> dict[str, Any] | None:
        """Verify JWT token and return payload"""
        try:
            # Supabase tokens are signed with the project secret
            if not SECRET_KEY:
                logger.error("JWT_SECRET_KEY is not set!")
                return None

            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
                options={"verify_aud": False} # Supabase 'aud' can vary (authenticated, etc)
            )
            return payload
        except JWTError as e:
            logger.warning(f"Token verification failed: {e}")
            return None

# Global auth manager instance
auth_manager = AuthManager()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency to get current authenticated user from JWT token.
    Validates the Supabase Token and ensures the user exists in our local cache (users table).
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

        # Supabase stores the UUID in 'sub'
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        # Sync user with local database (Just-In-Time Provisioning)
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            # Extract metadata for JIT provisioning
            email = payload.get("email")
            # Supabase stores name in user_metadata
            user_metadata = payload.get("user_metadata", {})
            name = user_metadata.get("full_name") or user_metadata.get("name") or email.split("@")[0] if email else "Supabase User"
            
            if not email:
                logger.error(f"Token for {user_id} missing email, required for provisioning")
                raise credentials_exception

            logger.info(f"Provisioning new user record for {email} ({user_id})")
            user = User(
                id=user_id,
                email=email,
                name=name
            )
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
    Legacy helper - Supabase handles token generation.
    Leaving this stub or raising error if used.
    """
    raise NotImplementedError("Tokens are managed by Supabase Auth")

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
