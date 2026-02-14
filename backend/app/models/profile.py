
from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    name: str | None = None
    location: str | None = None


class ProfileVariationCreate(BaseModel):
    name: str
    keywords: list[str] | None = None
    skills: list[str] | None = None
