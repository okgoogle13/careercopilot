from pydantic import BaseModel
from typing import List

class ApplicationStrategyRequest(BaseModel):
    job_url: str
    resume_text: str
    missing_keywords: List[str] = []
