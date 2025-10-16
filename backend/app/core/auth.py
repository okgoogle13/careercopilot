"""
Authentication and authorization system for CareerCopilot.
Supports JWT tokens, user registration, and session management.
"""

import logging
import os
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from app.core.database import get_db
from app.models.database import User
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
)  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer token scheme
security = HTTPBearer()


class AuthManager:
    """Handles authentication operations"""

    def __init__(self):
        self.pwd_context = pwd_context

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against its hash"""
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Generate password hash"""
        return self.pwd_context.hash(password)

    def create_access_token(
        self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token"""
        to_encode = data.copy()

        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

        return encoded_jwt

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError as e:
            logger.warning(f"Token verification failed: {e}")
            return None

    def authenticate_user(
        self, db: Session, email: str, password: str
    ) -> Optional[User]:
        """Authenticate user with email and password"""
        user = db.query(User).filter(User.email == email).first()

        if not user:
            return None

        # For now, we don't have password field in User model
        # In production, you'd add password_hash field to User model
        # and verify: if not self.verify_password(password, user.password_hash):
        #     return None

        # Temporary: accept any password for existing users
        return user

    def create_user(
        self, db: Session, email: str, name: str, password: str, **kwargs
    ) -> User:
        """Create new user account"""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("User with this email already exists")

        # Create new user (password hashing would be added when we add password field)
        user = User(email=email, name=name, **kwargs)

        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info(f"Created new user: {email}")
        return user


# Global auth manager instance
auth_manager = AuthManager()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency to get current authenticated user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Extract token from Authorization header
        token = credentials.credentials

        # Verify token
        payload = auth_manager.verify_token(token)
        if payload is None:
            raise credentials_exception

        # Extract user ID from token
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise credentials_exception

        return user

    except Exception as e:
        logger.warning(f"Authentication failed: {e}")
        raise credentials_exception


async def get_current_user_optional(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[User]:
    """
    Optional authentication - returns User if valid token provided, None otherwise.
    """
    if not credentials:
        return None

    try:
        token = credentials.credentials
        payload = auth_manager.verify_token(token)

        if payload:
            user_id = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
                return user

    except Exception:
        pass  # Ignore authentication errors in optional auth

    return None


def create_user_token(user: User) -> str:
    """Create access token for a user"""
    token_data = {"sub": user.id, "email": user.email, "name": user.name}

    return auth_manager.create_access_token(data=token_data)


class SessionManager:
    """Manages user sessions and token refresh"""

    def __init__(self):
        self.active_sessions = {}  # In production, use Redis

    def create_session(self, user_id: str, token: str) -> Dict[str, Any]:
        """Create new user session"""
        session_data = {
            "user_id": user_id,
            "token": token,
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "is_active": True,
        }

        # Store session (in production, use Redis with TTL)
        self.active_sessions[token] = session_data

        return session_data

    def get_session(self, token: str) -> Optional[Dict[str, Any]]:
        """Get session data by token"""
        return self.active_sessions.get(token)

    def update_session_activity(self, token: str) -> bool:
        """Update last activity timestamp"""
        if token in self.active_sessions:
            self.active_sessions[token]["last_activity"] = datetime.utcnow()
            return True
        return False

    def invalidate_session(self, token: str) -> bool:
        """Invalidate a session"""
        if token in self.active_sessions:
            self.active_sessions[token]["is_active"] = False
            return True
        return False

    def cleanup_expired_sessions(self) -> int:
        """Remove expired sessions"""
        now = datetime.utcnow()
        expired_tokens = []

        for token, session in self.active_sessions.items():
            # Sessions expire after 24 hours of inactivity
            if now - session["last_activity"] > timedelta(hours=24):
                expired_tokens.append(token)

        for token in expired_tokens:
            del self.active_sessions[token]

        logger.info(f"Cleaned up {len(expired_tokens)} expired sessions")
        return len(expired_tokens)


# Global session manager
session_manager = SessionManager()


def require_auth(func):
    """Decorator to require authentication for functions"""

    async def wrapper(*args, **kwargs):
        # This would be used for non-FastAPI functions that need auth
        # Implementation depends on how you want to handle auth context
        return await func(*args, **kwargs)

    return wrapper


# Admin user check
async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Require admin privileges (extend User model to include roles in production).
    """
    # For now, all users are admin. In production, add role-based access control
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required"
        )

    return current_user


# Rate limiting helper (basic implementation)
class RateLimiter:
    """Simple rate limiter for API endpoints"""

    def __init__(self):
        self.requests = {}  # user_id -> [(timestamp, count), ...]

    def check_rate_limit(
        self, user_id: str, limit: int = 100, window: int = 3600
    ) -> bool:
        """
        Check if user has exceeded rate limit.

        Args:
            user_id: User identifier
            limit: Maximum requests per window
            window: Time window in seconds (default 1 hour)

        Returns:
            True if within limit, False if exceeded
        """
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=window)

        if user_id not in self.requests:
            self.requests[user_id] = []

        # Clean old requests
        self.requests[user_id] = [
            req for req in self.requests[user_id] if req[0] > window_start
        ]

        # Check current count
        current_count = sum(req[1] for req in self.requests[user_id])

        if current_count >= limit:
            return False

        # Add current request
        self.requests[user_id].append((now, 1))
        return True


# Global rate limiter
rate_limiter = RateLimiter()
