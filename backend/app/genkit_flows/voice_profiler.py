import genkit
from genkit.plugins import googleai
from app.core.db import db
import os
import json

# Initialize Genkit and the Gemini Pro model
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])
gemini_pro = googleai.gemini_pro

@genkit.flow()
def generate_voice_profile(user_id: str) -> dict:
    """
    Analyzes all of a user's documents to create a voice profile.
    """
    try:
        # 1. Fetch all of the user's documents from Firestore
        docs_ref = db.collection('users').document(user_id).collection('documents')
        docs = docs_ref.stream()
        
        all_text = ""
        doc_count = 0
        for doc in docs:
            text = doc.to_dict().get("extractedText")
            if text:
                all_text += text + "\\n\\n---\\n\\n"
                doc_count += 1
        
        if doc_count < 1 or not all_text.strip():
            raise ValueError("Not enough document content to generate a voice profile.")

        # 2. Create the prompt for the Gemini model
        prompt = f"""
        Analyze the following text block, which contains multiple documents written by a single user. 
        Your task is to create a JSON object that accurately describes their writing style.

        The JSON object must include the following fields:
        - "tone": A short description of the overall tone (e.g., "professional and direct", "casual and friendly", "academic and formal").
        - "common_phrases": A list of 5-10 recurring phrases or expressions the user frequently uses.
        - "professional_vocabulary": A list of 10-15 key technical, industry-specific, or advanced vocabulary terms they use.

        Here is the text block:
        ---
        {all_text}
        ---
        """

        # 3. Call the model and get the response
        response = gemini_pro.generate(prompt)
        voice_profile_data = json.loads(response.text())

        # 4. Save the profile to the user's main document
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'voice_profile': voice_profile_data
        }, merge=True)

        return voice_profile_data

    except Exception as e:
        print(f"An error occurred during voice profile generation for user {user_id}: {e}")
        # Re-raise the exception so the calling endpoint can handle it
        raise e
