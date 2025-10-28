"""
job_listings.py

This module defines the FastAPI router for the Job Listing Extractor feature.

It exposes the Genkit flows for extracting job details from text and URLs,
and for performing advanced analysis on the extracted data.
"""

from fastapi import APIRouter, HTTPException
from genkit import run

from app.genkit_flows.job_listing_extractor import (
    advanced_job_analysis_flow,
    extract_job_listing_details_flow,
)
from app.models.schemas import (
    AdvancedAnalysisRequest,
    JobListingDetails,
    JobListingTextRequest,
    JobListingUrlRequest,
)

router = APIRouter()


@router.post(
    "/extract-from-text",
    response_model=JobListingDetails,
    summary="Extract Job Details from Raw Text",
)
async def extract_from_text(request: JobListingTextRequest):
    """
    Accepts raw job description text and returns structured job details.
    """
    try:
        details = await run(extract_job_listing_details_flow, request.text)
        return details
    except Exception as e:
        # Log the actual exception for debugging (add logging if not present)
        # logger.error(f"Failed to extract from text: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to extract job details from text")


@router.post(
    "/extract-from-url",
    response_model=JobListingDetails,
    summary="Extract Job Details from a URL",
)
async def extract_from_url(request: JobListingUrlRequest):
    """
    Accepts a URL, scrapes its content, and returns structured job details.
    """
    try:
        # Pass the source as a dictionary to the flow
        details = await run(extract_job_listing_details_flow, {"url": request.url})
        return details
    except IOError as e:
        # Catch scraping-specific errors
        raise HTTPException(status_code=422, detail="Failed to process the URL")
    except Exception as e:
        # Catch other potential errors from the flow
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@router.post(
    "/advanced-analysis",
    response_model=str,
    summary="Perform Advanced Analysis on Job Details",
)
async def advanced_analysis(request: AdvancedAnalysisRequest):
    """
    Accepts structured job details and a user prompt to perform a deeper,
    "Thinking Mode" analysis.
    """
    try:
        analysis_result = await run(
            advanced_job_analysis_flow,
            job_details=request.job_details,
            user_prompt=request.user_prompt,
        )
        return analysis_result
    except Exception as e:
        # logger.error(f"Advanced analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to perform advanced analysis")
