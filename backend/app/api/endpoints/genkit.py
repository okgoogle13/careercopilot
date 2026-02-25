"""
API Endpoints for Genkit AI Flows
"""

from typing import Any

from app.genkit_flows.company_context import (
    CompanyContext,
    generate_company_context,
)
from app.genkit_flows.ksc_generator import (
    STAR_Response,
    generateKscResponse,
)
from app.genkit_flows.resume_optimizer import (
    OptimizedResume,
    optimize_resume,
)
from app.genkit_flows.smart_cover_letter_system import (
    SmartCoverLetter,
    generate_smart_cover_letter,
)
from app.genkit_flows.unified_job_analyzer import (
    UnifiedJobAnalysis,
    analyze_job_from_url,
)
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.genkit import is_genkit_enabled

router = APIRouter()


class CoverLetterRequest(BaseModel):
    candidate_profile: dict[str, Any]
    job_description: str
    company_info: dict[str, Any] | None = None
    style: str = "professional"
    format_type: str = "full_letter"
    special_instructions: str | None = None


class KSCRequest(BaseModel):
    user_profile_data: dict[str, Any]
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
            detail=f"Cover letter generation failed: {e!s}",
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
            detail=f"KSC generation failed: {e!s}",
        )


class OptimizeResumeRequest(BaseModel):
    resume_text: str
    missing_keywords: list[str]
    job_description: str


class CompanyContextRequest(BaseModel):
    company_name: str
    job_description: str


class AnalyzeJobUrlRequest(BaseModel):
    url: str


@router.post(
    "/job/analyze-url",
    response_model=UnifiedJobAnalysis,
    summary="Analyze Job from URL",
    description="One-stop analysis: scrapes URL, extracts job details, and generates company context.",
)
async def analyze_job_url_endpoint(request: AnalyzeJobUrlRequest) -> UnifiedJobAnalysis:
    if not is_genkit_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Genkit flows are disabled.",
        )

    try:
        result = await analyze_job_from_url(url=request.url)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job URL analysis failed: {e!s}",
        )


@router.post(
    "/resume/optimize",
    response_model=OptimizedResume,
    summary="Optimize Resume",
    description="Optimizes resume by integrating missing keywords from ATS analysis.",
)
async def optimize_resume_endpoint(request: OptimizeResumeRequest) -> OptimizedResume:
    if not is_genkit_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Genkit flows are disabled.",
        )

    try:
        result = await optimize_resume(
            resume_text=request.resume_text,
            missing_keywords=request.missing_keywords,
            job_description=request.job_description,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume optimization failed: {e!s}",
        )


@router.post(
    "/company/context",
    response_model=CompanyContext,
    summary="Get Company Context",
    description="Generates company context for applications and interview prep using AI knowledge.",
)
async def get_company_context_endpoint(request: CompanyContextRequest) -> CompanyContext:
    if not is_genkit_enabled():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Genkit flows are disabled.",
        )

    try:
        result = await generate_company_context(
            company_name=request.company_name,
            job_description=request.job_description,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Company context generation failed: {e!s}",
        )
