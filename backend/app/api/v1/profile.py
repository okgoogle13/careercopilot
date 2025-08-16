from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.core.db import db
from app.models.profile import ProfileUpdate, ProfileVariationCreate
from app.genkit_flows.voice_profiler import generateVoiceProfile
import math

router = APIRouter()


# ... (existing GET and PUT endpoints for profile) ...
@router.post("/generate-voice-profile")
async def generate_and_save_voice_profile(uid: str = Depends(get_current_user)):
    """
    Analyzes a user's documents to generate a voice profile and saves it
    to their main profile document in Firestore.
    """
    try:
        # 1. Call the existing Genkit flow, passing in the user's UID
        voice_profile_data = await generateVoiceProfile.run(uid)

        if not voice_profile_data:
            raise HTTPException(
                status_code=404,
                detail="Could not generate voice profile. Ensure you have uploaded at least one resume or document.",
            )

        # 2. Save the resulting JSON object to the user's profile
        user_doc_ref = db.collection("users").document(uid)
        user_doc_ref.set(
            {"voice_profile": voice_profile_data.dict()}, merge=True
        )  # Use .dict() if it's a Pydantic model

        # 3. Return the newly generated voice_profile data
        return voice_profile_data

    except Exception as e:
        # Custom error handling for specific flow exceptions can be added here
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during voice profile generation: {str(e)}",
        )


# ... (existing profile variation endpoints) ...
