"""
unified_job_analyzer.py

Unified endpoint that combines URL scraping, job extraction, and company context
into a single, streamlined workflow.

This enables users to paste a job URL and get:
- Structured job details (title, company, criteria)
- Company context (achievements, values, culture)
- Ready for resume optimization and application
"""

import logging

from pydantic import BaseModel, Field

from app.core.genkit_init import async_genkit_flow
from app.genkit_flows.company_context import CompanyContext, generate_company_context
from app.genkit_flows.job_listing_extractor import extract_job_listing_details_flow
from app.models.schemas import JobListingDetails

logger = logging.getLogger(__name__)


class UnifiedJobAnalysis(BaseModel):
    """Complete job analysis from a single URL"""

    job_details: JobListingDetails = Field(
        description="Structured job listing details extracted from the URL"
    )
    company_context: CompanyContext | None = Field(
        None, description="Company insights for applications and interviews"
    )
    analysis_success: bool = Field(
        default=True, description="Whether the full analysis completed successfully"
    )
    error_message: str | None = Field(
        None, description="Error message if analysis partially failed"
    )


@async_genkit_flow(
    name="analyze_job_from_url",
    output_schema=UnifiedJobAnalysis,
    require_model=False,  # Job extractor handles its own model
)
async def analyze_job_from_url(url: str) -> UnifiedJobAnalysis:
    """
    One-stop analysis: URL → Job details + Company context

    This flow orchestrates:
    1. URL scraping (via Playwright MCP)
    2. Job details extraction (structured data)
    3. Company context generation (AI-based insights)

    Args:
        url: The job listing URL to analyze

    Returns:
        UnifiedJobAnalysis: Complete job and company analysis

    Example:
        result = await analyze_job_from_url("https://example.com/job/12345")
        # Access job details
        print(result.job_details.company_name)
        print(result.job_details.essential_criteria)
        # Access company context
        print(result.company_context.recent_achievements)
        print(result.company_context.interview_questions)
    """

    try:
        # Step 1: Extract job details from URL
        logger.info(f"Extracting job details from URL: {url}")
        job_details = await extract_job_listing_details_flow({"url": url})

        # Step 2: Generate company context if we have company name
        company_context = None
        if job_details.company_name and job_details.full_description:
            try:
                logger.info(f"Generating company context for: {job_details.company_name}")
                company_context = await generate_company_context(
                    company_name=job_details.company_name,
                    job_description=job_details.full_description,
                )
            except Exception as e:
                logger.warning(f"Company context generation failed: {e!s}")
                # Continue without company context - not critical

        return UnifiedJobAnalysis(
            job_details=job_details,
            company_context=company_context,
            analysis_success=True,
            error_message=None,
        )

    except Exception as e:
        logger.error(f"Job analysis failed: {e!s}", exc_info=True)
        # Return partial results if possible
        raise RuntimeError(f"Failed to analyze job from URL: {e!s}")
