
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
    is_remote: bool = False
    match_score: int = Field(..., ge=0, le=100)

class JobAnalysisResponse(BaseModel):
    success: bool
    markdown_analysis: str
    job_id: str | None = None
    job_saved: bool = False
    deadline_found: str | None = None
