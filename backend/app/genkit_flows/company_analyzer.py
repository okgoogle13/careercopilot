import os
from types import SimpleNamespace
from typing import List

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from pydantic import BaseModel, Field

try:
    import genkit
    from genkit.plugins import google_genai
except Exception:
    genkit = None
    google_genai = None

# Removed top-level gemini_pro initialization to avoid import-time bugs.
from app.core.genkit_init import get_model


def _noop_flow(*args, **kwargs):
    def _decorator(fn):
        return fn

    return _decorator


genkit_flow = getattr(genkit, "flow", _noop_flow) if genkit else _noop_flow


class CompanyAnalysis(BaseModel):
    """Structured analysis of a company's website."""

    company_keywords: List[str] = Field(
        description="Keywords related to the company's technologies, products, and values."
    )
    company_tone: str = Field(
        description="The overall tone and style of the company's communication (e.g., formal, casual, energetic)."
    )


@genkit_flow(output_schema=CompanyAnalysis)
def analyze_company_website(url: str) -> CompanyAnalysis:
    """
    Scrapes a company's website, analyzes its content, and extracts key insights.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.exceptions.RequestException as e:
        raise ConnectionError(f"Failed to fetch URL: {url}. Error: {e}")

    soup = BeautifulSoup(response.content, "html.parser")

    # Remove script and style elements
    for script_or_style in soup(["script", "style"]):
        script_or_style.decompose()

    text = soup.get_text()
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = "\n".join(chunk for chunk in chunks if chunk)

    if not text:
        raise ValueError("Could not extract any text from the website.")

    prompt = f"""
    Analyze the following text from a company's website. Based on the text, identify:
    1.  **Company Keywords:** A list of important keywords related to the company's technologies, products, services, and core values.
    2.  **Company Tone:** A short description of the company's communication tone and style (e.g., "formal and professional," "playful and casual," "energetic and innovative").

    **Website Text:**
    ---
    {text[:4000]}
    ---

    Please provide the analysis in a structured format.
    """

    model = get_model()
    if not model:
        raise ValueError("Genkit model not available")

    analysis_response = model.generate(
        prompt=prompt,
        config={
            "temperature": 0.2,
            "response_mime_type": "application/json",
        },
        output_schema=CompanyAnalysis,
    )

    company_analysis = analysis_response.output()
    if not company_analysis:
        raise ValueError("Failed to generate company analysis from the model.")

    return company_analysis
