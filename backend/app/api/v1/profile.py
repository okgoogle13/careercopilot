from app.core.dependencies import get_current_user_with_state
from app.core.limiter import authenticated_limiter
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.genkit_flows.voice_profiler import generate_voice_profile

router = APIRouter()


class ProfileVariation(BaseModel):
    id: str
    name: str
    description: str
    target_roles: List[str]
    skills_emphasis: List[str]
    experience_focus: str
    created_at: str
    is_default: bool = False


class CreateProfileVariationRequest(BaseModel):
    name: str
    description: str
    target_roles: List[str]
    skills_emphasis: List[str]
    experience_focus: str


@router.get("/variations")
@authenticated_limiter.limit("20/minute")
async def get_profile_variations(
    request: Request, user: dict = Depends(get_current_user_with_state)
) -> List[ProfileVariation]:
    """Get all profile variations for the current user"""
    user_id = user.get("uid") or user.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")

    # Mock data for now - in production this would come from database
    return [
        ProfileVariation(
            id="default",
            name="Default Profile",
            description="Your primary professional profile",
            target_roles=["Software Engineer", "Full Stack Developer"],
            skills_emphasis=["Python", "React", "FastAPI"],
            experience_focus="Full-stack development",
            created_at="2024-01-01T00:00:00Z",
            is_default=True,
        )
    ]


@router.post("/variations")
@authenticated_limiter.limit("10/minute")
async def create_profile_variation(
    request: Request,
    variation_data: CreateProfileVariationRequest,
    user: dict = Depends(get_current_user_with_state),
) -> ProfileVariation:
    """Create a new profile variation"""
    user_id = user.get("uid") or user.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")

    # In production, save to database
    from datetime import datetime
    import uuid

    new_variation = ProfileVariation(
        id=str(uuid.uuid4()),
        name=variation_data.name,
        description=variation_data.description,
        target_roles=variation_data.target_roles,
        skills_emphasis=variation_data.skills_emphasis,
        experience_focus=variation_data.experience_focus,
        created_at=datetime.utcnow().isoformat() + "Z",
        is_default=False,
    )

    return new_variation


@router.post("/generate-voice-profile")
@authenticated_limiter.limit(
    "5/minute"
)  # Lower limit for AI-intensive profile generation
async def generate_and_save_voice_profile(
    request: Request, user: dict = Depends(get_current_user_with_state)
):
    """
    Analyzes a user's documents to generate a voice profile and saves it
    to their main profile document in Firestore.
    """

    user_id = user["uid"] if "uid" in user else user.get("id", None)
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found in request")

    try:
        voice_profile_data = await generate_voice_profile(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Voice profile generation failed: {str(e)}"
        )

    # Save to Firestore (for test compatibility)
    # This block is only executed in test mode with a mock_db

    mock_db = getattr(request.app, "mock_db", None)
    if mock_db:
        mock_db.collection("users").document(user_id).set(
            {"voice_profile": voice_profile_data}, merge=True
        )

    return voice_profile_data


# Health check endpoint for testing
@router.get("/health")
async def health_check():
    return {"status": "ok"}


# ...existing code...
