import uuid
from typing import List, Optional

from app.ai_operations.ksc_generator import ksc_generator
from app.core.ai_error_handling import AIError
from app.core.db import get_db
from app.core.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from google.api_core.exceptions import GoogleAPICallError, NotFound
from google.cloud.firestore import SERVER_TIMESTAMP
from pydantic import BaseModel, ValidationError

router = APIRouter()


class KscGenerateRequest(BaseModel):
    profile_variation_id: str
    ksc_statements: List[str]
    response_length: str = "comprehensive"
    focus_achievements: Optional[List[str]] = None


class SingleKscRequest(BaseModel):
    ksc_statement: str
    response_length: str = "comprehensive"
    focus_achievements: Optional[List[str]] = None


@router.post("/generate")
async def generate_ksc_responses(
    request: KscGenerateRequest, user: dict = Depends(get_current_user)
):
    """
    Generates structured STAR responses for a list of Key Selection Criteria,
    saves the compiled result as a new document in Firestore, and returns the
    document's data.
    """
    try:
        uid = user["uid"]
        # 1. Fetch the specified user profile variation
        profile_ref = (
            get_db().collection("users")
            .document(uid)
            .collection("profiles")
            .document(request.profile_variation_id)
        )
        profile_doc = await profile_ref.get()
        if not profile_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile variation not found.",
            )
        user_profile_data = profile_doc.to_dict()

        # 2. Generate multiple KSC responses efficiently
        ksc_results = await ksc_generator.generate_multiple_ksc_responses(
            user_id=uid,
            user_profile_data=user_profile_data,
            ksc_statements=request.ksc_statements,
            response_preferences={
                "response_length": request.response_length,
                "focus_achievements": request.focus_achievements,
            },
        )

        # 3. Format the generated responses into a clean text document
        formatted_text = ""
        for ksc_response in ksc_results["ksc_responses"]:
            statement = ksc_response["ksc_statement"]
            star = ksc_response["star_response"]

            formatted_text += f"**Key Selection Criterion:**\n{statement}\n\n"
            formatted_text += f"**Situation:**\n{star['situation']}\n\n"
            formatted_text += f"**Task:**\n{star['task']}\n\n"
            formatted_text += f"**Action:**\n{star['action']}\n\n"
            formatted_text += f"**Result:**\n{star['result']}\n\n"
            formatted_text += "---\n\n"

        # 4. Save the compiled text as a new document in Firestore
        doc_id = str(uuid.uuid4())
        doc_ref = get_db().collection("users").document(uid).collection("documents").document(doc_id)

        new_doc_data = {
            "id": doc_id,
            "type": "ksc",
            "content": formatted_text,
            "createdAt": SERVER_TIMESTAMP,
            "originalFilename": "ksc_response.txt",
            "generatedFrom": {
                "profileVariationId": request.profile_variation_id,
                "kscStatements": request.ksc_statements,
                "responseLength": request.response_length,
            },
            "analysisData": ksc_results,  # Store the full analysis for reference
        }

        await doc_ref.set(new_doc_data)

        # 5. Return the newly created document record with analysis
        return {"document": new_doc_data, "analysis": ksc_results}

    except AIError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except NotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile variation not found."
        )
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating KSC responses: {str(e)}",
        )


@router.post("/generate-single")
async def generate_single_ksc_response(
    request: SingleKscRequest, user: dict = Depends(get_current_user)
):
    """
    Generate a STAR response for a single KSC statement using the user's default profile.
    """
    try:
        uid = user["uid"]

        # Get user's profile data (use default/main profile)
        user_ref = get_db().collection("users").document(uid)
        user_doc = await user_ref.get()
        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found."
            )

        user_data = user_doc.to_dict()

        # Generate single KSC response
        ksc_result = await ksc_generator.generate_star_response(
            user_id=uid,
            user_profile_data=user_data,
            ksc_statement=request.ksc_statement,
            response_length=request.response_length,
            focus_achievements=request.focus_achievements,
        )

        return ksc_result

    except AIError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except NotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found.")
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating KSC response: {str(e)}",
        )
