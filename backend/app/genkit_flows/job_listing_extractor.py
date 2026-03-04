"""
job_listing_extractor.py

This module defines the Genkit flows for the Job Listing Extractor feature.

It includes flows for:
- Scraping job listing content from a URL.
- Extracting structured job details from text using an AI model.
- Performing an advanced, user-driven analysis on the extracted details.
"""

import json
import logging
from pathlib import Path
from typing import Union

from app.core.genkit_init import genkit_flow, get_model
from app.models.schemas import JobListingDetails
from app.services.document_extractor import extract_documents_from_page
from app.services.playwright_service import scrape_url_sync

logger = logging.getLogger(__name__)

# Load prompts from the central template file
try:
    prompt_templates_path = (
        Path(__file__).resolve().parent.parent / "prompts" / "prompt_templates.json"
    )
    with prompt_templates_path.open(encoding="utf-8") as f:
        PROMPTS = json.load(f)
    JOB_EXTRACTOR_PROMPT = PROMPTS["job_listing_extractor"]["template"]
    ADVANCED_ANALYSIS_PROMPT = PROMPTS["job_listing_advanced_analysis"]["template"]
except (FileNotFoundError, KeyError, json.JSONDecodeError) as e:
    logger.warning(f"Falling back to inline job-listing prompts: {e}")
    JOB_EXTRACTOR_PROMPT = "Extract job details from: {job_listing_text}"
    ADVANCED_ANALYSIS_PROMPT = "Analyze job: {user_prompt}"


def _scrape_url_content(url: str) -> str:
    """
    Scrapes the text content from a given URL using Playwright.
    """
    try:
        content = scrape_url_sync(url)
        try:
            document_text = extract_documents_from_page(content, url)
            if document_text:
                content = content + "\n\n" + document_text
        except Exception as e:
            logger.warning(f"Document extraction failed (non-critical): {e}")
        return content
    except Exception as e:
        logger.error(f"Error scraping URL {url}: {e}")
        raise IOError(f"Failed to retrieve content from the URL: {url}") from e


@genkit_flow(output_schema=JobListingDetails)
async def extract_job_listing_details_flow(source: Union[str, dict]) -> JobListingDetails:
    """
    Orchestrates the extraction of structured job details.
    """
    if isinstance(source, dict) and "url" in source:
        text_content = _scrape_url_content(source["url"])
    elif isinstance(source, str):
        text_content = source
    else:
        raise TypeError("Input must be either a string or a dict with a 'url' key.")

    if not text_content:
        raise ValueError("Empty content from source.")

    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available")

    prompt = JOB_EXTRACTOR_PROMPT.format(job_listing_text=text_content)

    response = await model.generate(
        prompt=prompt,
        output_schema=JobListingDetails,
        config={"temperature": 0.1},
    )

    result = response.output()
    if hasattr(result, "full_description"):
        result.full_description = text_content

    return result


@genkit_flow(output_schema=str)
async def advanced_job_analysis_flow(job_details: JobListingDetails, user_prompt: str) -> str:
    """
    Performs an advanced analysis on structured job details.
    """
    prompt = ADVANCED_ANALYSIS_PROMPT.format(
        role_title=job_details.role_title,
        company_name=job_details.company_name,
        essential_criteria=", ".join(job_details.essential_criteria),
        desirable_criteria=", ".join(job_details.desirable_criteria),
        role_type=job_details.role_type,
        subsectors=", ".join(job_details.subsectors),
        user_prompt=user_prompt,
    )

    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available")

    response = await model.generate(prompt=prompt, config={"temperature": 0.7})

    return str(response.output())
