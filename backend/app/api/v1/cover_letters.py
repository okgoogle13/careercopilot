import uuid
from typing import Any, Dict, List, Optional

from app.ai_operations.cover_letter_generator import cover_letter_generator
from app.core.ai_error_handling import AIError
from app.core.db import db
from app.core.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from google.api_core.exceptions import GoogleAPICallError, NotFound
from google.cloud.firestore import SERVER_TIMESTAMP
from pydantic import BaseModel, ValidationError

router = APIRouter()


class CoverLetterGenerateRequest(BaseModel):
    job_analysis_data: Dict[str, Any]
    voice_profile: Optional[Dict[str, Any]] = None
    customization_preferences: Optional[Dict[str, str]] = None


class CoverLetterOptimizeRequest(BaseModel):
    existing_cover_letter: str
    job_analysis_data: Dict[str, Any]
    optimization_goals: Optional[List[str]] = None


class TemplateGenerateRequest(BaseModel):
    industry: str
    experience_level: str
    template_count: int = 3


@router.post("/generate")
async def generate_cover_letter(
    request: CoverLetterGenerateRequest, user: dict = Depends(get_current_user)
):
    """
    Generate a tailored cover letter based on user profile and job analysis.
    """
    try:
        uid = user["uid"]

        # Get user's profile data
        user_ref = db.collection("users").document(uid)
        user_doc = await user_ref.get()
        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found."
            )

        base_profile_data = user_doc.to_dict()

        # Generate cover letter
        cover_letter_result = await cover_letter_generator.generate_tailored_cover_letter(
            user_id=uid,
            base_profile_data=base_profile_data,
            job_analysis_data=request.job_analysis_data,
            voice_profile=request.voice_profile,
            customization_preferences=request.customization_preferences,
        )

        # Save the cover letter as a document
        doc_id = str(uuid.uuid4())
        doc_ref = db.collection("users").document(uid).collection("documents").document(doc_id)

        cover_letter_content = cover_letter_result["cover_letter"]["full_letter"]

        new_doc_data = {
            "id": doc_id,
            "type": "cover_letter",
            "content": cover_letter_content,
            "createdAt": SERVER_TIMESTAMP,
            "originalFilename": "generated_cover_letter.txt",
            "generatedFrom": {
                "jobTitle": request.job_analysis_data.get("job_title", "Unknown Position"),
                "companyName": request.job_analysis_data.get("company_name", "Unknown Company"),
                "voiceProfileUsed": bool(request.voice_profile),
                "customizationApplied": bool(request.customization_preferences),
            },
            "analysisData": cover_letter_result,
        }

        await doc_ref.set(new_doc_data)

        return {"document": new_doc_data, "analysis": cover_letter_result}

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
            detail=f"An error occurred while generating cover letter: {str(e)}",
        )


@router.post("/optimize")
async def optimize_cover_letter(
    request: CoverLetterOptimizeRequest, user: dict = Depends(get_current_user)
):
    """
    Optimize an existing cover letter for better job alignment.
    """
    try:
        uid = user["uid"]

        # Optimize the cover letter
        optimization_result = await cover_letter_generator.optimize_existing_cover_letter(
            user_id=uid,
            existing_cover_letter=request.existing_cover_letter,
            job_analysis_data=request.job_analysis_data,
            optimization_goals=request.optimization_goals,
        )

        return optimization_result

    except AIError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while optimizing cover letter: {str(e)}",
        )


@router.post("/templates")
async def generate_cover_letter_templates(
    request: TemplateGenerateRequest, user: dict = Depends(get_current_user)
):
    """
    Generate customizable cover letter templates for an industry and experience level.
    """
    try:
        uid = user["uid"]

        # Generate templates
        templates_result = await cover_letter_generator.generate_cover_letter_templates(
            user_id=uid,
            industry=request.industry,
            experience_level=request.experience_level,
            template_count=request.template_count,
        )

        # Save templates for user reference
        templates_id = str(uuid.uuid4())
        templates_ref = (
            db.collection("users")
            .document(uid)
            .collection("cover_letter_templates")
            .document(templates_id)
        )
        templates_data = {
            "id": templates_id,
            "createdAt": SERVER_TIMESTAMP,
            "industry": request.industry,
            "experienceLevel": request.experience_level,
            "templateCount": request.template_count,
            "templates": templates_result,
        }
        await templates_ref.set(templates_data)

        return templates_result

    except AIError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating templates: {str(e)}",
        )
