from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class EntryType(str, Enum):
    WORK = "Work Experience"
    PROJECT = "Project"
    EDUCATION = "Education"
    CERTIFICATION = "Certification"
    VOLUNTEER = "Volunteer"


class ImprovementSuggestions(BaseModel):
    action_verb: str | None = Field(None, description="Stronger power verb suggestion")
    noun_task: str | None = Field(None, description="Clarified task/responsibility")
    metric: str | None = Field(
        None, description="Suggested metric placeholder (e.g. 'reduced by X%')"
    )
    strategy: str | None = Field(None, description="Methodology or tool to mention")
    outcome: str | None = Field(None, description="Sharper outcome definition")


class StructuredAchievement(BaseModel):
    achievement_id: str = Field(..., description="Unique ID, e.g., 'ach-1'")
    entry_id: str = Field(..., description="Foreign Key to CareerEntry")
    original_text: str
    action_verb: str
    noun_task: str
    metric: str = Field(..., description="Quantifiable result. Contains 'X' if missing.")
    strategy: str
    outcome: str
    skills_used: list[str] = []
    subtype_tags: list[str] = []
    needs_review_flag: bool = Field(
        False, description="True if metric is missing or language is vague"
    )
    improvement_suggestions: ImprovementSuggestions | None = None


class CareerEntry(BaseModel):
    entry_id: str
    entry_type: EntryType
    organization: str
    role: str
    start_date: str
    end_date: str
    location: str = ""
    core_responsibilities: str
    subtype_tags: list[str] = []


class PersonalInfo(BaseModel):
    full_name: str
    email: str
    phone: str | None = None
    location: str | None = None
    links: list[str] = []


class CareerDatabase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    personal_info: PersonalInfo
    career_profile_summary: list[str] = []
    target_titles: list[str] = []
    entries: list[CareerEntry]
    achievements: list[StructuredAchievement]
