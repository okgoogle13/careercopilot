<<<<<<< HEAD
from typing import List, Optional
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0

from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    name: str | None = None
    location: str | None = None


class ProfileVariationCreate(BaseModel):
    name: str
<<<<<<< HEAD
    keywords: Optional[List[str]] = None
    skills: Optional[List[str]] = None
=======
    keywords: list[str] | None = None
    skills: list[str] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
