"""
API Endpoints for Genkit AI Flows
"""

from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.genkit_flows.smart_cover_letter_system import (
    generate_smart_cover_letter,
    SmartCoverLetter,
)
from app.genkit_flows.ksc_generator import (
    generateKscResponse,
    STAR_Response,
)
from app.core.genkit_init import is_genkit_enabled

router = APIRouter()


class CoverLetterRequest(BaseModel):
    candidate_profile: Dict[str, Any]
    job_description: str
    company_info: Optional[Dict[str, Any]] = None
    style: str = "professional"
    format_type: str = "full_letter"
    special_instructions: Optional[str] = None


class KSCRequest(BaseModel):
    user_profile_data: Dict[str, Any]
    ksc_statement: str


@router.post(
    "/cover-letter/generate",
    response_model=SmartCoverLetter,
    summary="Generate Smart Cover Letter",
    description="Generates a personalized cover letter using Genkit AI.",
)
async def generate_cover_letter_endpoint(request: CoverLetterRequest) -> SmartCoverLetter:
    if not is_genkit_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Genkit flows are disabled.",
        )

    try:
        # Note: generate_smart_cover_letter is currently synchronous
        # If it becomes async or needs to run in a threadpool, adjust accordingly
        result = generate_smart_cover_letter(
            candidate_profile=request.candidate_profile,
            job_description=request.job_description,
            company_info=request.company_info,
            style=request.style,
            format_type=request.format_type,
            special_instructions=request.special_instructions,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cover letter generation failed: {str(e)}",
        )


@router.post(
    "/ksc/generate",
    response_model=STAR_Response,
    summary="Generate KSC Response",
    description="Generates a STAR-formatted KSC response using Genkit AI.",
)
async def generate_ksc_endpoint(request: KSCRequest) -> STAR_Response:
    if not is_genkit_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Genkit flows are disabled.",
        )

    try:
        # generateKscResponse is defined as async
        result = await generateKscResponse(
            user_profile_data=request.user_profile_data,
            ksc_statement=request.ksc_statement,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"KSC generation failed: {str(e)}",
        )
