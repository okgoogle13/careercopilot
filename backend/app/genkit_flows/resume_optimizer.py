try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - optional dependency in test/CI
    genai = None
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Optional
from app.genkit_flows.corporate_intelligence import CorporateProfile
import json

# Configure Gemini
load_dotenv()
if genai:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize Model
model_name = "gemini-1.5-pro"
model = genai.GenerativeModel(model_name) if genai else None

class OptimizedResume(BaseModel):
    """The full, optimized resume text."""
    resume_text: str = Field(description="The complete and updated resume text, with keywords naturally integrated.")

def optimizeResume(
    resume_text: str, 
    missing_keywords: List[str], 
    job_description: str,
    corporate_profile: Optional[CorporateProfile] = None
) -> OptimizedResume:
    """
    Analyzes a resume and a list of missing keywords, then rewrites the resume
    to naturally incorporate those keywords in the context of the job description.
    Optionally identifies and aligns with corporate culture if corporate_profile is provided.
    """

    keywords_str = ", ".join(missing_keywords)
    
    # Build Corporate Context string
    corp_context = ""
    if corporate_profile:
        corp_context = f"""
    **Target Company Intelligence:**
    - **Company Name:** {corporate_profile.name}
    - **Mission:** {corporate_profile.mission_statement}
    - **Core Values:** {', '.join(corporate_profile.core_values)}
    - **Strategic Focus:** {corporate_profile.strategic_focus}
    - **Communication Style:** {corporate_profile.communication_style}
    - **Known For:** {corporate_profile.known_for}
        """

    prompt = f"""
    You are an expert resume editor and career strategist. Your task is to revise the provided resume to:
    1. Seamlessly integrate the missing keywords.
    2. Align the tone and content with the target company's culture and strategy (matches the "Corporate Intelligence" below).
    
    The goal is to make the resume a stronger match for the target job description AND the specific employer.

    **Target Job Description:**
    ---
    {job_description}
    ---
    {corp_context}

    **Original Resume:**
    ---
    {resume_text}

    **Keywords to Integreate:**
    {keywords_str}

    **Output Format:**
    Return ONLY a valid JSON object with a single field "resume_text".
    The value should be the full optimized resume markdown text.
    Do not include markdown code fences (```json) in your response.
    """

    if not genai or not model:
        return OptimizedResume(resume_text=resume_text)

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=OptimizedResume
            )
        )
        
        # Parse result
        data = json.loads(response.text)
        return OptimizedResume(resume_text=data["resume_text"])

    except Exception as e:
        print(f"Error optimizing resume: {e}")
        # Fallback
        return OptimizedResume(resume_text=resume_text)
