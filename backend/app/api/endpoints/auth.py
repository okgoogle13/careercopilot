"""
Authentication endpoints for user registration, login, and session management.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from app.api.endpoints._shared import run_endpoint_operation
from app.core.auth import get_current_user
from app.genkit_flows.smart_ingestion import voiceProfileExtractorFlow
from app.models.database import User

logger = logging.getLogger(__name__)

router = APIRouter()


class UserRegistrationRequest(BaseModel):
    """Request model for user registration"""

    email: EmailStr
    name: str
    password: str
    documents: list[str] | None = None  # Optional documents for voice profile analysis


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


@router.get("/me", response_model=dict[str, str])
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    """
    Get information for the current Supabase-authenticated user.
    """
    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "message": "User information retrieved from local cache",
    }


@router.post("/voice-profile", response_model=dict[str, str])
async def create_voice_profile(
    documents: list[str], current_user: User = Depends(get_current_user)
) -> dict[str, str]:
    """
    Create or update voice profile for existing user.
    """

    async def operation() -> dict[str, str]:
        if not documents or not any(doc.strip() for doc in documents):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one document with content is required",
            )

        logger.info(f"Creating voice profile for existing user: {current_user.email}")

        # Combine all documents into one writing sample
        combined_text = "\n\n---\n\n".join([doc for doc in documents if doc.strip()])

        # Run the real voice profile extraction flow
        await voiceProfileExtractorFlow(
            writingSample=combined_text,
            confirmedTags={"roleType": "General", "subsectors": []},
            user_id=current_user.id,
        )

        logger.info(f"Voice profile created successfully for user: {current_user.email}")

        return {
            "message": "Voice profile created successfully",
            "user_id": current_user.id,
        }

    try:
        return await run_endpoint_operation(
            operation,
            "Voice profile creation failed",
            logger=logger,
        )
    except HTTPException as exc:
        if exc.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Voice profile creation failed",
            ) from exc
        raise
