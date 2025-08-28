from app.core.dependencies import get_current_user_with_state
from app.core.limiter import authenticated_limiter
from fastapi import APIRouter, Depends, HTTPException, Request

# from app.genkit_flows.voice_profiler import generateVoiceProfile

router = APIRouter()

# ... (existing GET and PUT endpoints for profile) ...


@router.post("/generate-voice-profile")
@authenticated_limiter.limit("5/minute")  # Lower limit for AI-intensive profile generation
async def generate_and_save_voice_profile(
    request: Request,
    user: dict = Depends(get_current_user_with_state)
):
    """
    Analyzes a user's documents to generate a voice profile and saves it
    to their main profile document in Firestore.
    """
    # Temporarily disabled for deployment - genkit flows unavailable
    raise HTTPException(
        status_code=503, detail="AI features temporarily unavailable during deployment"
    )


# ... (existing profile variation endpoints) ...
