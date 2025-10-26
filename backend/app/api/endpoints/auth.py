"""
Authentication endpoints for user registration, login, and session management.
"""

import logging
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.auth import auth_manager, create_user_token, get_current_user, session_manager
from app.core.database import get_db
from app.genkit_flows.onboarding_voice_workflow import (
    VoiceProfileInput,
    analyze_and_create_voice_profile,
)
from app.models.database import User

logger = logging.getLogger(__name__)

router = APIRouter()


class UserRegistrationRequest(BaseModel):
    """Request model for user registration"""

    email: EmailStr
    name: str
    password: str
    documents: Optional[List[str]] = None  # Optional documents for voice profile analysis


class UserRegistrationResponse(BaseModel):
    """Response model for user registration"""

    user_id: str
    email: str
    name: str
    access_token: str
    token_type: str = "bearer"
    voice_profile_created: bool = False
    message: str = "Registration successful"


class UserLoginRequest(BaseModel):
    """Request model for user login"""

    email: EmailStr
    password: str


class UserLoginResponse(BaseModel):
    """Response model for user login"""

    user_id: str
    email: str
    name: str
    access_token: str
    token_type: str = "bearer"
    message: str = "Login successful"


class TokenResponse(BaseModel):
    """Standard token response"""

    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=UserRegistrationResponse)
async def register_user(
    request: UserRegistrationRequest, db: Session = Depends(get_db)
) -> UserRegistrationResponse:
    """
    Register a new user and optionally create their voice profile.

    If documents are provided, runs voice profile analysis after successful registration.
    """
    try:
        # Create the new user account
        user = auth_manager.create_user(
            db=db, email=request.email, name=request.name, password=request.password
        )

        # Generate access token for the new user
        access_token = create_user_token(user)

        # Create user session
        session_manager.create_session(user.id, access_token)

        # Initialize response
        response = UserRegistrationResponse(
            user_id=user.id, email=user.email, name=user.name, access_token=access_token
        )

        # If documents are provided, run voice profile analysis
        voice_profile_created = False
        if request.documents and any(doc.strip() for doc in request.documents):
            try:
                logger.info(f"Running voice profile analysis for new user: {user.email}")

                # Create voice profile input
                voice_input = VoiceProfileInput(user_id=user.id, documents=request.documents)

                # Run the voice profile analysis flow
                await analyze_and_create_voice_profile(voice_input)

                voice_profile_created = True
                response.voice_profile_created = True
                response.message = "Registration successful with voice profile created"

                logger.info(f"Voice profile created successfully for user: {user.email}")

            except Exception as voice_error:
                # Don't fail registration if voice profile creation fails
                logger.warning(
                    f"Voice profile creation failed for user {user.email}: {voice_error}"
                )
                response.message = "Registration successful, but voice profile creation failed"

        logger.info(
            f"User registered successfully: {user.email}, voice_profile: {voice_profile_created}"
        )
        return response

    except ValueError as e:
        # User already exists or validation error
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Registration failed for {request.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed due to internal error",
        )


@router.post("/login", response_model=UserLoginResponse)
async def login_user(request: UserLoginRequest, db: Session = Depends(get_db)) -> UserLoginResponse:
    """
    Authenticate user and return access token.
    """
    try:
        # Authenticate the user
        user = auth_manager.authenticate_user(db=db, email=request.email, password=request.password)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate access token
        access_token = create_user_token(user)

        # Create/update user session
        session_manager.create_session(user.id, access_token)

        logger.info(f"User logged in successfully: {user.email}")

        return UserLoginResponse(
            user_id=user.id, email=user.email, name=user.name, access_token=access_token
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed for {request.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed due to internal error",
        )


@router.post("/logout")
async def logout_user(token: str) -> Dict[str, str]:
    """
    Logout user by invalidating their session.
    """
    try:
        success = session_manager.invalidate_session(token)

        if success:
            return {"message": "Logged out successfully"}
        else:
            return {"message": "Session not found or already expired"}

    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed due to internal error",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(current_token: str, db: Session = Depends(get_db)) -> TokenResponse:
    """
    Refresh user access token.
    """
    try:
        # Verify current token
        payload = auth_manager.verify_token(current_token)
        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        # Get user from database
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        # Generate new token
        new_access_token = create_user_token(user)

        # Update session
        session_manager.invalidate_session(current_token)
        session_manager.create_session(user.id, new_access_token)

        return TokenResponse(access_token=new_access_token)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed",
        )


@router.get("/me", response_model=Dict[str, str])
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """
    Get current authenticated user information.
    """
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "message": "User information retrieved successfully",
    }


@router.post("/voice-profile", response_model=Dict[str, str])
async def create_voice_profile(
    documents: List[str], current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Create or update voice profile for existing user.
    """
    try:
        if not documents or not any(doc.strip() for doc in documents):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one document with content is required",
            )

        logger.info(f"Creating voice profile for existing user: {current_user.email}")

        # Create voice profile input
        voice_input = VoiceProfileInput(user_id=current_user.id, documents=documents)

        # Run the voice profile analysis flow
        await analyze_and_create_voice_profile(voice_input)

        logger.info(f"Voice profile created successfully for user: {current_user.email}")

        return {
            "message": "Voice profile created successfully",
            "user_id": current_user.id,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice profile creation failed for user {current_user.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Voice profile creation failed",
        )
