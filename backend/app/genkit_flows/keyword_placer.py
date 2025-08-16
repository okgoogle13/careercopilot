import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List

# Load environment variables and initialize Genkit if needed
load_dotenv()
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])
gemini_pro = googleai.gemini_pro


# --- Pydantic Schemas for Structured Output ---
class KeywordPlacementSuggestion(BaseModel):
    """Defines the structure for a single keyword placement suggestion."""

    keyword: str = Field(description="The missing keyword.")
    suggested_location: str = Field(
        description="A short, specific description of the best place in the resume to add the keyword (e.g., 'In the summary section' or 'In the bullet points for the Sr. Accountant role')."
    )
    example_sentence: str = Field(
        description="A well-crafted example sentence that naturally incorporates the keyword into the suggested location."
    )


class KeywordPlacementResponse(BaseModel):
    """A list of keyword placement suggestions."""

    suggestions: List[KeywordPlacementSuggestion]


# --- Genkit Flow ---
@genkit.flow(output_schema=KeywordPlacementResponse)
def suggestKeywordPlacement(
    resumeText: str, list_of_missing_keywords: List[str]
) -> KeywordPlacementResponse:
    """
    Analyzes a resume and a list of missing keywords to suggest the most
    contextually appropriate placement for each keyword.
    """

    prompt = f"""
    Act as an expert resume editor. Your task is to analyze the provided resume text and suggest the best placement for a list of missing keywords.

    **Instructions:**
    1.  Review the Resume Text to understand its structure and content.
    2.  For each keyword in the Missing Keywords list, find the most logical and contextually appropriate location to insert it. This could be in the professional summary, a specific job's responsibilities, or a skills section.
    3.  Do not rewrite the resume. Your output must be a list of specific, actionable suggestions.
    4.  Provide a clear example sentence for each suggestion.

    **Resume Text:**
    ---
    {resumeText}
    ---

    **Missing Keywords:**
    ---
    {', '.join(list_of_missing_keywords)}
    ---

    Generate the suggestions now.
    """

    response = gemini_pro.generate(
        prompt=prompt,
        output_schema=KeywordPlacementResponse,
        config=googleai.GenerationConfig(response_mime_type="application/json"),
    )

    return response.output()
