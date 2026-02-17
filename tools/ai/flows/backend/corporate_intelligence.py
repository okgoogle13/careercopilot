try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - optional dependency in test/CI
    genai = None
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.search_service import SearchService
import json

# Load environment variables
load_dotenv()
if genai:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3.0-pro") if genai else None

class CorporateProfile(BaseModel):
    """Structured intelligence about a company."""
    name: str = Field(description="The canonical name of the company.")
    mission_statement: str = Field(description="Inferred or explicit mission statement.")
    core_values: List[str] = Field(description="List of core values or cultural pillars.")
    strategic_focus: str = Field(description="Current strategic focus or key business objectives.")
    communication_style: str = Field(description="The tone and style of their communication (e.g., 'Formal', 'Disruptive', 'Academic').")
    known_for: str = Field(description="What the company is primarily known for in the market.")

def research_company(company_name: str) -> CorporateProfile:
    """
    Research a company to generate a corporate profile for application tailoring.
    Uses Perplexity API (via SearchService) to gather and synthesize context.
    """
    search_service = SearchService()

    # 1. Gather Deep Research from Perplexity
    # This returns a high-quality synthesis directly
    research_summary = search_service.research_company(company_name)

    if not research_summary:
        # Fallback if API fails or key missing
        return CorporateProfile(
            name=company_name,
            mission_statement="Information not available (Search failed)",
            core_values=["Professionalism"],
            strategic_focus="General Industry Growth",
            communication_style="Professional",
            known_for="Unknown"
        )

    if not genai or not model:
        return CorporateProfile(
            name=company_name,
            mission_statement=research_summary or "Information not available (Search failed)",
            core_values=["Professionalism"],
            strategic_focus="General Industry Growth",
            communication_style="Professional",
            known_for="Unknown",
        )

    # 2. Structure the data with Gemini
    # We take the unstructured Perplexity summary and coerce it into our strict schema
    prompt = f"""
    You are a Data Structuring Specialist.
    I have a detailed research summary about **{company_name}**.

    Your job is to extract specific fields from this summary into a JSON structure.

    **Research Summary:**
    ---
    {research_summary}
    ---

    **Required Fields:**
    - name: (string) The company name.
    - mission_statement: (string) short summary.
    - core_values: (list of strings).
    - strategic_focus: (string).
    - communication_style: (string) e.g. "Formal", "Innovative", "Corporate".
    - known_for: (string).

    **Output Instructions:**
    Return ONLY a valid JSON object matching the requested fields.
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=CorporateProfile
            )
        )
        data = json.loads(response.text)
        return CorporateProfile(**data)

    except Exception as e:
        print(f"Error structuring corporate profile: {e}")
        return CorporateProfile(
            name=company_name,
            mission_statement="Error parsing research data",
            core_values=["Error"],
            strategic_focus="Error",
            communication_style="Error",
            known_for="Error"
        )
