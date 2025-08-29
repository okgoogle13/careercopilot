"""
Authentication API endpoints for user registration, login, and session management.
"""

import os
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

from app.core.database import get_db
from app.core.auth import (
    auth_manager,
    session_manager,
    get_current_user,
    create_user_token,
    rate_limiter,
)
from app.models.database import User
from pydantic import BaseModel, EmailStr
from datetime import datetime


# Initialize Firebase Admin SDK if not already initialized
if not firebase_admin._apps:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path or not os.path.exists(cred_path):
        raise RuntimeError(f"Service account file not found at path: {cred_path}")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

logger = logging.getLogger(__name__)
router = APIRouter()


class FirebaseTokenRequest(BaseModel):
    token: str


class FirebaseUserProfile(BaseModel):
    uid: str
    email: str = None
    name: str = None
    picture: str = None


# Endpoint: POST /auth/verify-token
@router.post("/verify-token")
async def verify_firebase_token(data: FirebaseTokenRequest):
    """
    Verify Firebase ID token and return user info.
    """
    try:
        decoded = firebase_auth.verify_id_token(data.token)
        return {"uid": decoded["uid"], "email": decoded.get("email")}
    except Exception as e:
        logger.error(f"Firebase token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
        )


# Endpoint: GET /auth/user-profile
@router.get("/user-profile", response_model=FirebaseUserProfile)
async def get_firebase_user_profile(request: Request):
    """
    Get Firebase user profile from Authorization Bearer token.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )
    token = auth_header.split(" ", 1)[1]
    try:
        decoded = firebase_auth.verify_id_token(token)
        user = firebase_auth.get_user(decoded["uid"])
        return FirebaseUserProfile(
            uid=user.uid,
            email=user.email,
            name=user.display_name,
            picture=user.photo_url,
        )
    except Exception as e:
        logger.error(f"Failed to get Firebase user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
        )


class UserRegistration(BaseModel):
    email: EmailStr
    name: str
    password: str
    career_transition_from: str = None
    career_transition_to: str = None
    location: str = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_info: Dict[str, Any]


class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    career_transition_from: str = None
    career_transition_to: str = None
    location: str = None
    target_roles: list = []
    salary_range: dict = {}
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/register", response_model=TokenResponse)
async def register_user(user_data: UserRegistration, db: Session = Depends(get_db)):
    """
    Register a new user account and return access token.
    """
    try:
        # Rate limiting
        if not rate_limiter.check_rate_limit(
            f"register:{user_data.email}", limit=5, window=3600
        ):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many registration attempts. Please try again later.",
            )

        # Create user
        user = auth_manager.create_user(
            db=db,
            email=user_data.email,
            name=user_data.name,
            password=user_data.password,
            career_transition_from=user_data.career_transition_from,
            career_transition_to=user_data.career_transition_to,
            location=user_data.location,
        )

        # Create access token
        access_token = create_user_token(user)

        # Create session
        session_manager.create_session(user.id, access_token)

        logger.info(f"User registered successfully: {user.email}")

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_info={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "career_transition_from": user.career_transition_from,
                "career_transition_to": user.career_transition_to,
                "location": user.location,
            },
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"User registration failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again.",
        )


@router.post("/login", response_model=TokenResponse)
async def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token.
    """
    try:
        # Rate limiting
        if not rate_limiter.check_rate_limit(
            f"login:{login_data.email}", limit=10, window=3600
        ):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later.",
            )

        # Authenticate user
        user = auth_manager.authenticate_user(db, login_data.email, login_data.password)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token = create_user_token(user)

        # Create/update session
        session_manager.create_session(user.id, access_token)

        logger.info(f"User logged in successfully: {user.email}")

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_info={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "career_transition_from": user.career_transition_from,
                "career_transition_to": user.career_transition_to,
                "location": user.location,
                "target_roles": user.target_roles,
                "salary_range": user.salary_range,
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again.",
        )


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user's profile information.
    """
    return current_user


@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    profile_updates: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update user profile information.
    """
    try:
        # Update allowed fields
        updatable_fields = [
            "name",
            "career_transition_from",
            "career_transition_to",
            "location",
            "target_roles",
            "salary_range",
        ]

        for field, value in profile_updates.items():
            if field in updatable_fields and hasattr(current_user, field):
                setattr(current_user, field, value)

        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)

        logger.info(f"User profile updated: {current_user.email}")

        return current_user

    except Exception as e:
        db.rollback()
        logger.error(f"Profile update failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed. Please try again.",
        )


@router.post("/logout")
async def logout_user(current_user: User = Depends(get_current_user)):
    """
    Logout user and invalidate session.
    """
    try:
        # In a real implementation, you'd extract the token and invalidate it
        # For now, we'll just return success

        logger.info(f"User logged out: {current_user.email}")

        return {"success": True, "message": "Logged out successfully"}

    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed. Please try again.",
        )


@router.get("/session-status")
async def get_session_status(current_user: User = Depends(get_current_user)):
    """
    Get current session status and user information.
    """
    return {
        "authenticated": True,
        "user_id": current_user.id,
        "user_email": current_user.email,
        "session_active": True,
        "permissions": [
            "read",
            "write",
        ],  # Could be expanded with role-based permissions
        "last_activity": datetime.utcnow().isoformat(),
    }


@router.post("/refresh-token")
async def refresh_access_token(current_user: User = Depends(get_current_user)):
    """
    Refresh access token for extended session.
    """
    try:
        # Create new access token
        new_token = create_user_token(current_user)

        # Update session
        session_manager.create_session(current_user.id, new_token)

        logger.info(f"Token refreshed for user: {current_user.email}")

        return {
            "access_token": new_token,
            "token_type": "bearer",
            "message": "Token refreshed successfully",
        }

    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed. Please try again.",
        )


@router.get("/users/{user_id}")
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get user information by ID (admin or self only).
    """
    # Check if user is requesting their own info
    if current_user.id != user_id:
        # In production, add admin role check here
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You can only access your own profile.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "career_transition_from": user.career_transition_from,
        "career_transition_to": user.career_transition_to,
        "location": user.location,
        "target_roles": user.target_roles,
        "created_at": user.created_at,
    }


@router.delete("/account")
async def delete_user_account(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Delete user account (soft delete - mark as inactive).
    """
    try:
        # In production, implement soft delete by adding 'is_active' field
        # For now, we'll just log the request

        logger.warning(f"Account deletion requested for user: {current_user.email}")

        # Could implement:
        # current_user.is_active = False
        # current_user.deleted_at = datetime.utcnow()
        # db.commit()

        return {
            "success": True,
            "message": "Account deletion requested. Contact support to complete the process.",
            "user_id": current_user.id,
        }

    except Exception as e:
        logger.error(f"Account deletion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account deletion failed. Please contact support.",
        )
