from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
from typing import List
import uuid
from google.cloud.firestore import SERVER_TIMESTAMP
from google.api_core.exceptions import GoogleAPICallError, NotFound

from app.core.dependencies import get_current_user
from app.core.db import db
from app.genkit_flows.ksc_generator import generateKscResponse, STAR_Response

router = APIRouter()

class KscGenerateRequest(BaseModel):
    profile_variation_id: str
    ksc_statements: List[str]

@router.post("/generate")
async def generate_ksc_responses(
    request: KscGenerateRequest,
    user: dict = Depends(get_current_user)
):
    """
    Generates structured STAR responses for a list of Key Selection Criteria,
    saves the compiled result as a new document in Firestore, and returns the
    document's data.
    """
    try:
        uid = user["uid"]
        # 1. Fetch the specified user profile variation
        profile_ref = db.collection("users").document(uid).collection("profiles").document(request.profile_variation_id)
        profile_doc = await profile_ref.get()
        if not profile_doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile variation not found.")
        user_profile_data = profile_doc.to_dict()

        # 2. Loop through KSC statements and generate responses
        generated_responses = []
        for statement in request.ksc_statements:
            # Call the Genkit flow for each statement
            star_response: STAR_Response = await generateKscResponse.run(
                user_profile_data=user_profile_data,
                ksc_statement=statement
            )
            generated_responses.append({"ksc": statement, "response": star_response.model_dump()})

        # 3. Format the generated responses into a clean text document
        formatted_text = ""
        for item in generated_responses:
            statement = item['ksc']
            response = item['response']
            formatted_text += f"**Key Selection Criterion:**\n{statement}\n\n"
            formatted_text += f"**Situation:**\n{response['situation']}\n\n"
            formatted_text += f"**Task:**\n{response['task']}\n\n"
            formatted_text += f"**Action:**\n{response['action']}\n\n"
            formatted_text += f"**Result:**\n{response['result']}\n\n"
            formatted_text += "---\n\n"

        # 4. Save the compiled text as a new document in Firestore
        doc_id = str(uuid.uuid4())
        doc_ref = db.collection("users").document(uid).collection("documents").document(doc_id)
        
        new_doc_data = {
            "id": doc_id,
            "type": "ksc",
            "content": formatted_text,
            "createdAt": SERVER_TIMESTAMP,
            "originalFilename": "ksc_response.txt",
            "generatedFrom": {
                "profileVariationId": request.profile_variation_id,
                "kscStatements": request.ksc_statements
            }
        }
        
        await doc_ref.set(new_doc_data)

        # 5. Return the newly created document record
        return new_doc_data

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except NotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile variation not found.")
    except GoogleAPICallError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Google Cloud API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while generating KSC responses: {str(e)}")
