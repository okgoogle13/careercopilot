from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class Education(BaseModel):
    """Education information model."""

    degree: str
    field: str
    institution: str
    year: int


class Experience(BaseModel):
    """Work experience model."""

    title: str
    company: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: Optional[str] = None


class ResumeAnalysisResult(BaseModel):
    """Result of resume analysis.

    Attributes:
        skills: List of extracted skills
        experience: List of work experiences
        education: List of education entries
        summary: Generated professional summary
        raw_data: Raw analysis data from AI
    """

    skills: List[str] = Field(default_factory=list, description="List of extracted skills")
    experience: List[Experience] = Field(
        default_factory=list, description="Work experience entries"
    )
    education: List[Education] = Field(default_factory=list, description="Education history")
    summary: str = Field(default="", description="Professional summary")
    raw_data: Optional[Dict[str, Any]] = None
