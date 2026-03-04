"""
job_listings.py

This module defines the FastAPI router for the Job Listing Extractor feature.

It exposes the Genkit flows for extracting job details from text and URLs,
and for performing advanced analysis on the extracted data.
"""

from fastapi import APIRouter, HTTPException

from app.api.endpoints._shared import run_endpoint_operation
from app.core.genkit_init import run_flow_async
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

    async def operation():
        return await run_flow_async(extract_job_listing_details_flow, request.text)

    return await run_endpoint_operation(
        operation,
        "An unexpected error occurred",
    )


@router.post(
    "/extract-from-url",
    response_model=JobListingDetails,
    summary="Extract Job Details from a URL",
)
async def extract_from_url(request: JobListingUrlRequest):
    """
    Accepts a URL, scrapes its content, and returns structured job details.
    """

    async def operation():
        # Pass the source as a dictionary to the flow
        try:
            return await run_flow_async(extract_job_listing_details_flow, {"url": request.url})
        except OSError as exc:
            raise HTTPException(
                status_code=422, detail=f"Failed to process the URL: {exc!s}"
            ) from exc

    return await run_endpoint_operation(
        operation,
        "An unexpected error occurred",
    )


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

    async def operation():
        return await run_flow_async(
            advanced_job_analysis_flow,
            job_details=request.job_details,
            user_prompt=request.user_prompt,
        )

    return await run_endpoint_operation(
        operation,
        "An unexpected error occurred during analysis",
    )
