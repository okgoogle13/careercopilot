from typing import Any

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
    end_date: str | None = None
    current: bool = False
    description: str | None = None


class ResumeAnalysisResult(BaseModel):
    """Result of resume analysis.

    Attributes:
        skills: List of extracted skills
        experience: List of work experiences
        education: List of education entries
        summary: Generated professional summary
        raw_data: Raw analysis data from AI
    """

    skills: list[str] = Field(default_factory=list, description="List of extracted skills")
    experience: list[Experience] = Field(
        default_factory=list, description="Work experience entries"
    )
    education: list[Education] = Field(default_factory=list, description="Education history")
    summary: str = Field(default="", description="Professional summary")
    raw_data: dict[str, Any] | None = None
