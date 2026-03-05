from pydantic import BaseModel


class ATSScoringInput(BaseModel):
    """Input schema for ATS scoring operations."""

    user_id: str
    resume_text: str
    job_description: str
    profile_keywords: list[str] | None = None
