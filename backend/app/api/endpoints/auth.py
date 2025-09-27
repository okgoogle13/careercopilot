"""
Authentication endpoints for user registration, login, and session management.

This module defines the API routes for handling all authentication-related
operations, including creating new users, authenticating existing users,
managing sessions (login, logout, refresh), and handling user-specific
features like voice profile creation.
"""
import logging
from typing import Dict, List, Optional

from app.core.auth import (
    auth_manager,
    create_user_token,
    get_current_user,
    session_manager,
)
from app.core.database import get_db
from app.genkit_flows.onboarding_voice_workflow import (
    VoiceProfileInput,
    analyze_and_create_voice_profile,
)
from app.models.database import User
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter()


class UserRegistrationRequest(BaseModel):
    """
    Request model for user registration.

    Attributes:
        email: The user's email address.
        name: The user's full name.
        password: The user's chosen password.
        documents: An optional list of text documents (e.g., from a resume or
                   cover letter) used to generate an initial voice profile.
    """
    email: EmailStr
    name: str
    password: str
    documents: Optional[List[str]] = None


class UserRegistrationResponse(BaseModel):
    """
    Response model for a successful user registration.

    Attributes:
        user_id: The unique identifier for the newly created user.
        email: The user's email address.
        name: The user's full name.
        access_token: A JWT access token for authenticating subsequent requests.
        token_type: The type of the token (always "bearer").
        voice_profile_created: A boolean indicating if the voice profile was
                               successfully created during registration.
        message: A summary message of the registration result.
    """
    user_id: str
    email: str
    name: str
    access_token: str
    token_type: str = "bearer"
    voice_profile_created: bool = False
    message: str = "Registration successful"


class UserLoginRequest(BaseModel):
    """
    Request model for user login.

    Attributes:
        email: The user's email address.
        password: The user's password.
    """
    email: EmailStr
    password: str


class UserLoginResponse(BaseModel):
    """
    Response model for a successful user login.

    Attributes:
        user_id: The user's unique identifier.
        email: The user's email address.
        name: The user's full name.
        access_token: A new JWT access token for the session.
        token_type: The type of the token (always "bearer").
        message: A confirmation message.
    """
    user_id: str
    email: str
    name: str
    access_token: str
    token_type: str = "bearer"
    message: str = "Login successful"


class TokenResponse(BaseModel):
    """
    Standard response model for endpoints that return a JWT token.

    Attributes:
        access_token: The JWT access token.
        token_type: The type of the token (always "bearer").
    """
    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=UserRegistrationResponse)
async def register_user(
    request: UserRegistrationRequest, db: Session = Depends(get_db)
) -> UserRegistrationResponse:
    """
    Registers a new user and optionally creates their voice profile.

    This endpoint handles the creation of a new user account in the database.
    If text documents are provided in the request, it triggers an asynchronous
    Genkit flow to analyze them and generate a personalized voice profile.

    Args:
        request: The user registration data.
        db: The database session dependency.

    Returns:
        A `UserRegistrationResponse` containing user details and an access token.

    Raises:
        HTTPException: 400 if the user already exists or data is invalid.
        HTTPException: 500 for any other internal errors during registration.
    """
    try:
        user = auth_manager.create_user(
            db=db, email=request.email, name=request.name, password=request.password
        )
        access_token = create_user_token(user)
        session_manager.create_session(user.id, access_token)

        response = UserRegistrationResponse(
            user_id=user.id, email=user.email, name=user.name, access_token=access_token
        )

        voice_profile_created = False
        if request.documents and any(doc.strip() for doc in request.documents):
            try:
                logger.info(f"Running voice profile analysis for new user: {user.email}")
                voice_input = VoiceProfileInput(user_id=user.id, documents=request.documents)
                await analyze_and_create_voice_profile(voice_input)
                voice_profile_created = True
                response.voice_profile_created = True
                response.message = "Registration successful with voice profile created"
                logger.info(f"Voice profile created successfully for user: {user.email}")
            except Exception as voice_error:
                logger.warning(f"Voice profile creation failed for user {user.email}: {voice_error}")
                response.message = "Registration successful, but voice profile creation failed"

        logger.info(f"User registered successfully: {user.email}, voice_profile: {voice_profile_created}")
        return response

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Registration failed for {request.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed due to internal error",
        )


@router.post("/login", response_model=UserLoginResponse)
async def login_user(
    request: UserLoginRequest, db: Session = Depends(get_db)
) -> UserLoginResponse:
    """
    Authenticates a user and returns an access token.

    Verifies the user's credentials against the database. If successful, it
    creates a new session and returns a JWT access token for the user.

    Args:
        request: The user's login credentials (email and password).
        db: The database session dependency.

    Returns:
        A `UserLoginResponse` containing user details and a new access token.

    Raises:
        HTTPException: 401 if the credentials are a invalid.
        HTTPException: 500 for any other internal errors.
    """
    try:
        user = auth_manager.authenticate_user(
            db=db, email=request.email, password=request.password
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_user_token(user)
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
    Logs out a user by invalidating their session.

    This endpoint invalidates the session associated with the provided token,
    effectively logging the user out.

    Args:
        token: The access token of the session to invalidate.

    Returns:
        A dictionary with a confirmation message.

    Raises:
        HTTPException: 500 for internal errors.
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
async def refresh_token(
    current_token: str, db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Refreshes a user's access token.

    Takes a valid (but potentially expired) token, verifies its signature,
    and issues a new access token for the same user, extending their session.

    Args:
        current_token: The user's current, possibly expired, access token.
        db: The database session dependency.

    Returns:
        A `TokenResponse` containing the new access token.

    Raises:
        HTTPException: 401 if the token is invalid or the user is not found.
        HTTPException: 500 for internal errors.
    """
    try:
        payload = auth_manager.verify_token(current_token)
        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        new_access_token = create_user_token(user)
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
    Retrieves information for the currently authenticated user.

    This is a protected endpoint that returns basic information about the user
    associated with the valid access token provided in the request.

    Args:
        current_user: The authenticated user object, injected by dependency.

    Returns:
        A dictionary containing the user's ID, email, and name.
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
    Creates or updates the voice profile for an existing user.

    This protected endpoint allows an authenticated user to submit text documents
    to generate or update their personalized voice profile using a Genkit flow.

    Args:
        documents: A list of text documents to analyze.
        current_user: The authenticated user object, injected by dependency.

    Returns:
        A dictionary with a confirmation message.

    Raises:
        HTTPException: 400 if no documents are provided.
        HTTPException: 500 for internal errors during profile creation.
    """
    try:
        if not documents or not any(doc.strip() for doc in documents):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one document with content is required",
            )

        logger.info(f"Creating voice profile for existing user: {current_user.email}")
        voice_input = VoiceProfileInput(user_id=current_user.id, documents=documents)
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
