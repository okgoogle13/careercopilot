<<<<<<< HEAD
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum

=======
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


>>>>>>> restoration-KR-Rage-Figma-v2.0
class EntryType(str, Enum):
    WORK = "Work Experience"
    PROJECT = "Project"
    EDUCATION = "Education"
    CERTIFICATION = "Certification"
    VOLUNTEER = "Volunteer"

class ImprovementSuggestions(BaseModel):
<<<<<<< HEAD
    action_verb: Optional[str] = Field(None, description="Stronger power verb suggestion")
    noun_task: Optional[str] = Field(None, description="Clarified task/responsibility")
    metric: Optional[str] = Field(None, description="Suggested metric placeholder (e.g. 'reduced by X%')")
    strategy: Optional[str] = Field(None, description="Methodology or tool to mention")
    outcome: Optional[str] = Field(None, description="Sharper outcome definition")
=======
    action_verb: str | None = Field(None, description="Stronger power verb suggestion")
    noun_task: str | None = Field(None, description="Clarified task/responsibility")
    metric: str | None = Field(None, description="Suggested metric placeholder (e.g. 'reduced by X%')")
    strategy: str | None = Field(None, description="Methodology or tool to mention")
    outcome: str | None = Field(None, description="Sharper outcome definition")
>>>>>>> restoration-KR-Rage-Figma-v2.0

class StructuredAchievement(BaseModel):
    achievement_id: str = Field(..., description="Unique ID, e.g., 'ach-1'")
    entry_id: str = Field(..., description="Foreign Key to CareerEntry")
    original_text: str
    action_verb: str
    noun_task: str
    metric: str = Field(..., description="Quantifiable result. Contains 'X' if missing.")
    strategy: str
    outcome: str
<<<<<<< HEAD
    skills_used: List[str] = []
    subtype_tags: List[str] = []
    needs_review_flag: bool = Field(False, description="True if metric is missing or language is vague")
    improvement_suggestions: Optional[ImprovementSuggestions] = None
=======
    skills_used: list[str] = []
    subtype_tags: list[str] = []
    needs_review_flag: bool = Field(False, description="True if metric is missing or language is vague")
    improvement_suggestions: ImprovementSuggestions | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

class CareerEntry(BaseModel):
    entry_id: str
    entry_type: EntryType
    organization: str
    role: str
    start_date: str
    end_date: str
    location: str = ""
    core_responsibilities: str
<<<<<<< HEAD
    subtype_tags: List[str] = []
=======
    subtype_tags: list[str] = []
>>>>>>> restoration-KR-Rage-Figma-v2.0

class PersonalInfo(BaseModel):
    full_name: str
    email: str
<<<<<<< HEAD
    phone: Optional[str] = None
    location: Optional[str] = None
    links: List[str] = []
=======
    phone: str | None = None
    location: str | None = None
    links: list[str] = []
>>>>>>> restoration-KR-Rage-Figma-v2.0

class CareerDatabase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    personal_info: PersonalInfo
<<<<<<< HEAD
    career_profile_summary: List[str] = []
    target_titles: List[str] = []
    entries: List[CareerEntry]
    achievements: List[StructuredAchievement]
=======
    career_profile_summary: list[str] = []
    target_titles: list[str] = []
    entries: list[CareerEntry]
    achievements: list[StructuredAchievement]
>>>>>>> restoration-KR-Rage-Figma-v2.0
