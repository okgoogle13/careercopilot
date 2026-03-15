"""
unified_job_analyzer.py

Unified flow that combines URL scraping, job extraction, and company context
into a single, streamlined workflow. Handles both raw text and URL sources.
"""

import json
import logging
import requests
from typing import Union, Optional
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field

import genkit
from genkit import flow
from genkit.model import llm

from app.models.schemas import JobListingDetails
from app.services.playwright_service import scrape_url_sync
from app.services.document_extractor import extract_documents_from_page
from app.genkit_flows.company_context import generate_company_context, CompanyContext
from app.genkit_flows.flow_decorator import async_genkit_flow

logger = logging.getLogger(__name__)

# Initialize Genkit and configure the Gemini model
genkit.configure(
    {
        "llm": {
            "service": "googleai",
            "models": [
                {"name": "gemini-3.0-flash"},
                {"name": "gemini-3.0-pro"},
            ],
        },
    }
)

# Define the models to be used in the flows
flash_model = llm("gemini-3.0-flash")
pro_model = llm("gemini-3.0-pro")

# Load prompts
try:
    with open("app/prompts/prompt_templates.json", "r") as f:
        PROMPTS = json.load(f)
    JOB_EXTRACTOR_PROMPT = PROMPTS["job_listing_extractor"]["template"]
    ADVANCED_ANALYSIS_PROMPT = PROMPTS["job_listing_advanced_analysis"]["template"]
except Exception as e:
    logger.error(f"Failed to load prompts: {e}")
    JOB_EXTRACTOR_PROMPT = "Extract job details from: {job_listing_text}"
    ADVANCED_ANALYSIS_PROMPT = "Analyze job: {role_title} at {company_name}. User request: {user_prompt}"

class UnifiedJobAnalysis(BaseModel):
    """Complete job analysis results"""
    job_details: JobListingDetails = Field(description="Structured job details")
    company_context: Optional[CompanyContext] = Field(None, description="Company context insights")
    analysis_success: bool = Field(default=True, description="Success status")
    error_message: Optional[str] = Field(None, description="Detailed error if any")

def _scrape_url_content(url: str) -> str:
    """Scrapes text content from URL using Playwright."""
    try:
        content = scrape_url_sync(url)
        try:
            document_text = extract_documents_from_page(content, url)
            if document_text:
                content = content + "\n\n" + document_text
        except Exception as e:
            logger.warning(f"Document extraction failed: {e}")
        return content
    except Exception as e:
        logger.error(f"Scraping failed for {url}: {e}")
        raise IOError(f"Failed to retrieve content from {url}") from e

@flow(name="extract_job_listing_details_flow")
def extract_job_listing_details_flow(source: Union[str, dict]) -> JobListingDetails:
    """Legacy compatibility flow for extracting job details."""
    if isinstance(source, dict) and "url" in source:
        text_content = _scrape_url_content(source["url"])
    elif isinstance(source, str):
        text_content = source
    else:
        raise TypeError("Input must be string or dict with 'url'")

    if not text_content:
        raise ValueError("Source content is empty")

    prompt = JOB_EXTRACTOR_PROMPT.format(job_listing_text=text_content)
    response = flash_model.generate(
        prompt,
        output_format=JobListingDetails,
        config={"temperature": 0.1},
    )
    result = response.output
    result.full_description = text_content
    return result

@async_genkit_flow(
    name="analyze_job_from_url",
    output_schema=UnifiedJobAnalysis,
    require_model=False
)
async def analyze_job_from_url(url: str) -> UnifiedJobAnalysis:
    """Unified endpoint: URL -> Job Details + Company Context"""
    try:
        logger.info(f"Unified analysis starting for: {url}")
        job_details = extract_job_listing_details_flow({"url": url})

        company_context = None
        if job_details.company_name and job_details.full_description:
            try:
                company_context = await generate_company_context(
                    company_name=job_details.company_name,
                    job_description=job_details.full_description
                )
            except Exception as e:
                logger.warning(f"Non-critical company context failure: {e}")

        return UnifiedJobAnalysis(
            job_details=job_details,
            company_context=company_context,
            analysis_success=True
        )
    except Exception as e:
        logger.error(f"Unified job analysis failed: {e}")
        raise RuntimeError(f"Analysis failed: {str(e)}")

@flow(name="advanced_job_analysis_flow")
def advanced_job_analysis_flow(job_details: JobListingDetails, user_prompt: str) -> str:
    """Advanced interactive analysis flow."""
    prompt = ADVANCED_ANALYSIS_PROMPT.format(
        role_title=job_details.role_title,
        company_name=job_details.company_name,
        essential_criteria=", ".join(job_details.essential_criteria),
        desirable_criteria=", ".join(job_details.desirable_criteria),
        role_type=job_details.role_type,
        subsectors=", ".join(job_details.subsectors),
        user_prompt=user_prompt,
    )
    response = pro_model.generate(prompt, config={"temperature": 0.7})
    return response.output
