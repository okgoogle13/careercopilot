"""
Documents API Endpoints

FastAPI endpoints for document generation including:
- Cover letter generation
- Resume optimization
- KSC response generation
"""

import json
import time
from typing import Dict, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Import Genkit flows
from app.genkit_flows.cover_letter_generator import generate_tailored_cover_letter
from app.genkit_flows.ksc_generator import generateKscResponse

router = APIRouter()


# ============================================================================
# Request/Response Models
# ============================================================================


class CoverLetterRequest(BaseModel):
    """Request model for cover letter generation"""

    job_description: str = Field(..., description="Complete job description", min_length=50)
    user_profile: Dict = Field(
        ..., description="User profile data including work experience", min_items=1
    )
    tone: Optional[str] = Field(
        default="professional",
        description="Tone for the cover letter (professional, conversational, formal)",
    )
    voice_profile: Optional[Dict] = Field(
        default=None, description="Optional voice profile for writing style matching"
    )


class CoverLetterResponse(BaseModel):
    """Response model for cover letter generation"""

    success: bool = Field(description="Whether generation was successful")
    coverLetter: Optional[str] = Field(description="Generated cover letter content")
    message: str = Field(description="Success or error message")
    processingTimeSeconds: float = Field(description="Total processing time")


class KSCRequest(BaseModel):
    """Request model for KSC response generation"""

    user_profile: Dict = Field(..., description="User profile data", min_items=1)
    ksc_statement: str = Field(
        ..., description="Key Selection Criteria statement to respond to", min_length=20
    )


class STARResponse(BaseModel):
    """STAR methodology response structure"""

    situation: str = Field(description="Context/situation")
    task: str = Field(description="Task/responsibility")
    action: str = Field(description="Action taken")
    result: str = Field(description="Result achieved")


class KSCResponse(BaseModel):
    """Response model for KSC generation"""

    success: bool = Field(description="Whether generation was successful")
    response: Optional[STARResponse] = Field(description="Generated STAR response")
    message: str = Field(description="Success or error message")
    processingTimeSeconds: float = Field(description="Total processing time")


# ============================================================================
# Endpoints
# ============================================================================


@router.post(
    "/generate-cover-letter",
    response_model=CoverLetterResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate tailored cover letter",
    description="""
    Generate a personalized cover letter tailored to a specific job description.

    Uses AI to analyze the job requirements and user profile, then creates
    a compelling cover letter that matches the user's writing voice.

    **Processing time:** Typically 10-20 seconds
    """,
)
async def generate_cover_letter(request: CoverLetterRequest) -> CoverLetterResponse:
    """
    Generate a tailored cover letter for a job opportunity.

    Args:
        request: Job description, user profile, and optional voice profile

    Returns:
        Generated cover letter and metadata

    Raises:
        HTTPException: If validation fails or generation encounters errors
    """
    start_time = time.time()

    try:
        # Input validation
        if not request.job_description or len(request.job_description.strip()) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job description must be at least 50 characters long",
            )

        if not request.user_profile or not isinstance(request.user_profile, dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile must be a non-empty dictionary",
            )

        # Prepare job analysis data from job description
        job_analysis_data = {
            "job_description": request.job_description,
            "tone": request.tone or "professional",
        }

        # Generate cover letter using Genkit flow
        cover_letter_text = await generate_tailored_cover_letter.run(
            base_profile_data=request.user_profile,
            job_analysis_data=job_analysis_data,
            voice_profile=request.voice_profile,
        )

        processing_time = time.time() - start_time

        return CoverLetterResponse(
            success=True,
            coverLetter=cover_letter_text,
            message="Cover letter generated successfully",
            processingTimeSeconds=processing_time,
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        processing_time = time.time() - start_time
        error_message = f"Failed to generate cover letter: {str(e)}"
        print(f"❌ Cover letter generation error: {error_message}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message,
        )


@router.post(
    "/generate-ksc-response",
    response_model=KSCResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate KSC response using STAR methodology",
    description="""
    Generate a Key Selection Criteria (KSC) response using the STAR methodology.

    STAR = Situation, Task, Action, Result

    This endpoint analyzes a KSC statement and the user's profile, then generates
    a structured response that follows the STAR methodology for Australian government
    job applications.

    **Processing time:** Typically 8-15 seconds
    """,
)
async def generate_ksc_response(request: KSCRequest) -> KSCResponse:
    """
    Generate a KSC response for a given statement.

    Args:
        request: User profile and KSC statement

    Returns:
        STAR-structured KSC response

    Raises:
        HTTPException: If validation fails or generation encounters errors
    """
    start_time = time.time()

    try:
        # Input validation
        if not request.ksc_statement or len(request.ksc_statement.strip()) < 20:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="KSC statement must be at least 20 characters long",
            )

        if not request.user_profile or not isinstance(request.user_profile, dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile must be a non-empty dictionary",
            )

        # Generate KSC response using Genkit flow
        star_response = await generateKscResponse.run(
            user_profile_data=request.user_profile,
            ksc_statement=request.ksc_statement,
        )

        processing_time = time.time() - start_time

        # Convert STAR response to dict
        response_dict = {
            "situation": star_response.situation,
            "task": star_response.task,
            "action": star_response.action,
            "result": star_response.result,
        }

        return KSCResponse(
            success=True,
            response=STARResponse(**response_dict),
            message="KSC response generated successfully",
            processingTimeSeconds=processing_time,
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        processing_time = time.time() - start_time
        error_message = f"Failed to generate KSC response: {str(e)}"
        print(f"❌ KSC response generation error: {error_message}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message,
        )
