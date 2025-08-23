from app.core.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException

# from app.genkit_flows.voice_profiler import generateVoiceProfile

router = APIRouter()

# ... (existing GET and PUT endpoints for profile) ...


@router.post("/generate-voice-profile")
async def generate_and_save_voice_profile(uid: str = Depends(get_current_user)):
    """
    Analyzes a user's documents to generate a voice profile and saves it
    to their main profile document in Firestore.
    """
    # Temporarily disabled for deployment - genkit flows unavailable
    raise HTTPException(
        status_code=503, detail="AI features temporarily unavailable during deployment"
    )


# ... (existing profile variation endpoints) ...
