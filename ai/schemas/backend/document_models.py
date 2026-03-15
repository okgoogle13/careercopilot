from pydantic import BaseModel, Field
from typing import List

# We import the canonical MasterCareerProfile as CareerProfile
# from the core application models to unify both front and back end Genkit flows.
from app.schemas.career_master import CareerProfile, CareerDatabase

class TailoredResumeResult(BaseModel):
    """Result structure for tailored resume generation"""
    tailored_text: str = Field(description="Tailored resume content optimized for the job")
    original_score: int = Field(description="Original resume analysis score", ge=0, le=100)
    tailored_score: int = Field(description="Improved score after tailoring", ge=0, le=100)
    improvements_made: List[str] = Field(description="Specific improvements applied")
    keywords_integrated: List[str] = Field(description="Job keywords incorporated")
    competitive_advantages: List[str] = Field(description="Highlighted competitive strengths")
