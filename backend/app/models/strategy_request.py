from pydantic import BaseModel


class ApplicationStrategyRequest(BaseModel):
    job_url: str
    resume_text: str
    missing_keywords: list[str] = []
