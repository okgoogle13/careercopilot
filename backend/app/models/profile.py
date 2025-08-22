from typing import List, Optional

from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    name: str | None = None
    location: str | None = None


class ProfileVariationCreate(BaseModel):
    name: str
    keywords: Optional[List[str]] = None
    skills: Optional[List[str]] = None
