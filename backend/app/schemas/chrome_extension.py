<<<<<<< HEAD
from typing import Optional, List
from pydantic import BaseModel, Field

class JobPostingData(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: str
    url: str
    source: Optional[str] = "unknown"
    employmentType: Optional[str] = None
    datePosted: Optional[str] = None
    salary: Optional[str] = None
    resume_text: Optional[str] = None

class JobAnalysisOutput(BaseModel):
    overall_fit_score: int = Field(..., ge=0, le=100)
    matching_qualifications: List[str]
    gaps_and_development_areas: List[str]
    key_selling_points: List[str]
    application_strategy: str
    deadline: Optional[str] = None
=======

from pydantic import BaseModel, Field


class JobPostingData(BaseModel):
    title: str
    company: str | None = None
    location: str | None = None
    description: str
    url: str
    source: str | None = "unknown"
    employmentType: str | None = None
    datePosted: str | None = None
    salary: str | None = None
    resume_text: str | None = None

class JobAnalysisOutput(BaseModel):
    overall_fit_score: int = Field(..., ge=0, le=100)
    matching_qualifications: list[str]
    gaps_and_development_areas: list[str]
    key_selling_points: list[str]
    application_strategy: str
    deadline: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    is_remote: bool = False
    match_score: int = Field(..., ge=0, le=100)

class JobAnalysisResponse(BaseModel):
    success: bool
    markdown_analysis: str
<<<<<<< HEAD
    job_id: Optional[str] = None
    job_saved: bool = False
    deadline_found: Optional[str] = None
=======
    job_id: str | None = None
    job_saved: bool = False
    deadline_found: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
