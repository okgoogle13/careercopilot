"""
job_listing_extractor.py

This module defines the Genkit flows for the Job Listing Extractor feature.

It includes flows for:
- Scraping job listing content from a URL.
- Extracting structured job details from text using an AI model.
- Performing an advanced, user-driven analysis on the extracted details.
"""

import json
from typing import Union

import genkit
import requests
from bs4 import BeautifulSoup
from genkit import flow
from genkit.model import llm

from app.models.schemas import JobListingDetails

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

# Load prompts from the central template file
with open("app/prompts/prompt_templates.json", "r") as f:
    PROMPTS = json.load(f)

JOB_EXTRACTOR_PROMPT = PROMPTS["job_listing_extractor"]["template"]
ADVANCED_ANALYSIS_PROMPT = PROMPTS["job_listing_advanced_analysis"]["template"]


from app.services.playwright_service import scrape_url_sync
from app.services.document_extractor import extract_documents_from_page

def _scrape_url_content(url: str) -> str:
    """
    Scrapes the text content from a given URL using Playwright (via MCP).
    Also detects and extracts text from any PDF or Word documents linked on the page.

    Args:
        url: The URL to scrape.

    Returns:
        The cleaned text/HTML content of the page, plus any extracted document content.

    Raises:
        IOError: If the scraping fails.
    """
    try:
        # Use the Playwright MCP Service to handle JS-rendered pages
        content = scrape_url_sync(url)

        # Try to extract any attached documents (PDF/Word)
        try:
            document_text = extract_documents_from_page(content, url)
            if document_text:
                print(f"✅ Extracted text from attached documents")
                content = content + "\n\n" + document_text
        except Exception as e:
            # Don't fail the whole scrape if document extraction fails
            print(f"⚠️ Document extraction failed (non-critical): {e}")

        return content
    except Exception as e:
        print(f"Error scraping URL {url} with Playwright: {e}")
        raise IOError(f"Failed to retrieve content from the URL: {url}") from e


@flow(name="extract_job_listing_details_flow")
def extract_job_listing_details_flow(source: Union[str, dict]) -> JobListingDetails:
    """
    Orchestrates the extraction of structured job details from either raw text or a URL.

    This single, consolidated flow handles both input types, scrapes if necessary,
    and makes one efficient AI call to get the complete JobListingDetails object.

    Args:
        source: A string containing raw text or a dictionary of the form {"url": "..."}.

    Returns:
        A Pydantic model instance of JobListingDetails.
    """
    if isinstance(source, dict) and "url" in source:
        try:
            text_content = _scrape_url_content(source["url"])
        except IOError as e:
            # Propagate failure to the API layer for proper error response
            raise e
    elif isinstance(source, str):
        text_content = source
    else:
        raise TypeError("Input must be either a string (text) or a dict with a 'url' key.")

    if not text_content:
        raise ValueError("The provided source (text or URL) resulted in empty content.")

    prompt = JOB_EXTRACTOR_PROMPT.format(job_listing_text=text_content)

    response = flash_model.generate(
        prompt,
        output_format=JobListingDetails,
        config={"temperature": 0.1},
    )

    # Preserve the full description for AI features
    result = response.output
    result.full_description = text_content

    return result



@flow(name="advanced_job_analysis_flow")
def advanced_job_analysis_flow(job_details: JobListingDetails, user_prompt: str) -> str:
    """
    Performs an advanced analysis on structured job details based on a user's query.

    Args:
        job_details: The structured job details object.
        user_prompt: The user's specific question or request for analysis.

    Returns:
        A string containing the AI's comprehensive, text-based response.
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

    response = pro_model.generate(prompt, config={"temperature": 0.7})

    return response.output
