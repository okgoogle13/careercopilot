import json
from typing import List

from app.core.db import db
from app.core.genkit_init import get_model, is_genkit_enabled, register_flow_function
from pydantic import BaseModel

# Import the existing voice profiler logic
from .voice_profiler import generate_voice_profile

# Try to import Genkit for decorators, with fallback
try:
    import genkit

    GENKIT_AVAILABLE = True
except ImportError:
    genkit = None
    GENKIT_AVAILABLE = False


# Define the structured output model for voice profile
class VoiceProfile(BaseModel):
    tone: str
    common_phrases: List[str]
    professional_vocabulary: List[str]


class VoiceProfileInput(BaseModel):
    user_id: str
    documents: List[str]


async def _analyze_and_create_voice_profile_impl(
    input_data: VoiceProfileInput,
) -> VoiceProfile:
    """
    Analyzes a user's documents to establish an 'authentic voice' for all future AI-generated content.
    Uses the existing voice_profiler logic but with provided documents instead of fetching from Firestore.

    Args:
        input_data: Contains user_id and list of document texts

    Returns:
        VoiceProfile: The analyzed voice profile
    """
    try:
        user_id = input_data.user_id
        documents = input_data.documents

        # Validate input documents
        if not documents or not any(doc.strip() for doc in documents):
            raise ValueError("No valid document content provided for voice profile analysis")

        # Combine the text from all documents into a single string
        combined_text = "\n\n---\n\n".join(doc.strip() for doc in documents if doc.strip())

        # Create the prompt for voice analysis (same as voice_profiler.py)
        prompt = f"""
        Analyze the following text block, which contains multiple documents written by a single user.
        Your task is to create a JSON object that accurately describes their writing style.

        The JSON object must include the following fields:
        - "tone": A short description of the overall tone (e.g., "professional and direct",
          "casual and friendly", "academic and formal").
        - "common_phrases": A list of 5-10 recurring phrases or expressions the user
          frequently uses.
        - "professional_vocabulary": A list of 10-15 key technical, industry-specific,
          or advanced vocabulary terms they use.

        Here is the text block:
        ---
        {combined_text}
        ---
        """

        # Generate the voice profile using the centralized model
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available for voice profile analysis")

        response = model.generate(
            prompt=prompt,
            config={
                "response_mime_type": "application/json",
            },
        )

        # Parse the response into our VoiceProfile model
        voice_profile_data = json.loads(response.text)
        voice_profile = VoiceProfile(**voice_profile_data)

        # Save the voice profile to the user's profile document in Firestore
        user_ref = db.collection("users").document(user_id)
        user_ref.set({"voice_profile": voice_profile.model_dump()}, merge=True)

        return voice_profile

    except Exception as e:
        print(f"Error in voice profile analysis for user {input_data.user_id}: {e}")
        raise e


# Register the flow with conditional decorator
if GENKIT_AVAILABLE and is_genkit_enabled():
    analyze_and_create_voice_profile = genkit.flow(output_schema=VoiceProfile)(
        _analyze_and_create_voice_profile_impl
    )
else:
    analyze_and_create_voice_profile = _analyze_and_create_voice_profile_impl

# Register the flow for tracking
register_flow_function(analyze_and_create_voice_profile, "analyze_and_create_voice_profile")
