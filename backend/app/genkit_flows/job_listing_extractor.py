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
            "service": "vertexai",
            "models": [
                {"name": "gemini-1.5-flash"},
                {"name": "gemini-1.5-pro-preview"},
            ],
        },
    }
)

# Define the models to be used in the flows
optimizer_model = llm("gemini-optimizer")

# Load prompts from the central template file
with open("app/prompts/prompt_templates.json", "r") as f:
    PROMPTS = json.load(f)

JOB_EXTRACTOR_PROMPT = PROMPTS["job_listing_extractor"]["template"]
ADVANCED_ANALYSIS_PROMPT = PROMPTS["job_listing_advanced_analysis"]["template"]



import logging

logger = logging.getLogger(__name__)

# Maximum response size (10 MB)
MAX_RESPONSE_SIZE = 10 * 1024 * 1024

def _scrape_url_content(url: str) -> str:
    try:
        response = requests.get(url, timeout=10, stream=True)
        response.raise_for_status()
        
        # Check content type
        content_type = response.headers.get("content-type", "")
        if "text/html" not in content_type.lower():
            raise ValueError(f"URL does not return HTML content: {content_type}")
        
        # Check content length
        content_length = response.headers.get("content-length")
        if content_length and int(content_length) > MAX_RESPONSE_SIZE:
            raise ValueError(f"Response too large: {content_length} bytes")
        
        # Read with size limit
        content = response.raw.read(MAX_RESPONSE_SIZE + 1)
        if len(content) > MAX_RESPONSE_SIZE:
            raise ValueError("Response exceeds maximum size")
        
        soup = BeautifulSoup(content, "html.parser")
        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()
        # Get text and clean it up
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = "\n".join(chunk for chunk in chunks if chunk)
        return text
    except requests.exceptions.RequestException as e:
        logger.error(f"Error scraping URL {url}: {e}")
        # Re-raise as a more generic exception to be caught by the flow's error handling
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

    response = optimizer_model.generate(
        prompt,
        output_format=JobListingDetails,
        config={"temperature": 0.1, "preference": "cost"},
    )

    return response.output


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
    if not job_details:
        raise ValueError("job_details cannot be None or empty")
    
    if not user_prompt or not user_prompt.strip():
        raise ValueError("user_prompt cannot be None or empty")
    
    # Safely handle optional/null fields
    essential_criteria = ", ".join(str(c) for c in (job_details.essential_criteria or []))
    desirable_criteria = ", ".join(str(c) for c in (job_details.desirable_criteria or []))
    subsectors = ", ".join(str(s) for s in (job_details.subsectors or []))
    
    prompt = ADVANCED_ANALYSIS_PROMPT.format(
        role_title=job_details.role_title or "Not specified",
        company_name=job_details.company_name or "Not specified",
        essential_criteria=essential_criteria,
        desirable_criteria=desirable_criteria,
        role_type=job_details.role_type or "Not specified",
        subsectors=subsectors,
        user_prompt=user_prompt,
    )

    response = optimizer_model.generate(prompt, config={"temperature": 0.7})

    if response.output is None:
        raise ValueError("Model failed to generate analysis")
    
    return response.output
