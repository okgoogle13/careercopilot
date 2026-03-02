<<<<<<< HEAD
from pydantic import BaseModel
from typing import List
=======

from pydantic import BaseModel

>>>>>>> restoration-KR-Rage-Figma-v2.0

class ApplicationStrategyRequest(BaseModel):
    job_url: str
    resume_text: str
<<<<<<< HEAD
    missing_keywords: List[str] = []
=======
    missing_keywords: list[str] = []
>>>>>>> restoration-KR-Rage-Figma-v2.0
