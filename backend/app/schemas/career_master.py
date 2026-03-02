from enum import Enum
<<<<<<< HEAD
from typing import List, Optional, Dict
from pydantic import BaseModel, Field

=======

from pydantic import BaseModel, Field


>>>>>>> restoration-KR-Rage-Figma-v2.0
class EntryType(str, Enum):
    WORK_EXPERIENCE = "Work Experience"
    PROJECT = "Project"
    EDUCATION = "Education"
    CERTIFICATION = "Certification"
    VOLUNTEER = "Volunteer"

class WorkType(str, Enum):
    REMOTE = "Remote"
    HYBRID = "Hybrid"
    ONSITE = "On-site"
    ANY = "Any"

class SkillProficiency(str, Enum):
    NOVICE = "Novice"
    COMPETENT = "Competent"
    PROFICIENT = "Proficient"
    EXPERT = "Expert"
    MASTER = "Master"

class AchievementSuggestions(BaseModel):
<<<<<<< HEAD
    action_verb: Optional[str] = Field(None, alias="Action_Verb")
    noun_task: Optional[str] = Field(None, alias="Noun_Task")
    metric: Optional[str] = Field(None, alias="Metric")
    strategy: Optional[str] = Field(None, alias="Strategy")
    outcome: Optional[str] = Field(None, alias="Outcome")
=======
    action_verb: str | None = Field(None, alias="Action_Verb")
    noun_task: str | None = Field(None, alias="Noun_Task")
    metric: str | None = Field(None, alias="Metric")
    strategy: str | None = Field(None, alias="Strategy")
    outcome: str | None = Field(None, alias="Outcome")
>>>>>>> restoration-KR-Rage-Figma-v2.0

class StructuredAchievement(BaseModel):
    achievement_id: str = Field(..., alias="Achievement_ID")
    entry_id: str = Field(..., alias="Entry_ID")
    original_text: str = Field(..., alias="Original_Text")
    action_verb: str = Field(..., alias="Action_Verb")
    noun_task: str = Field(..., alias="Noun_Task")
    metric: str = Field(..., alias="Metric")
    strategy: str = Field(..., alias="Strategy")
    outcome: str = Field(..., alias="Outcome")
<<<<<<< HEAD
    skills_used: List[str] = Field(default_factory=list, alias="Skills_Used")
    tools_used: List[str] = Field(default_factory=list, alias="Tools_Used")
    subtype_tags: List[str] = Field(default_factory=list, alias="Subtype_Tags")
    needs_review_flag: bool = Field(..., alias="Needs_Review_Flag")
    improvement_suggestions: Optional[AchievementSuggestions] = Field(None, alias="Improvement_Suggestions")
    # Vector embedding for RAG
    embedding: Optional[List[float]] = None 
=======
    skills_used: list[str] = Field(default_factory=list, alias="Skills_Used")
    tools_used: list[str] = Field(default_factory=list, alias="Tools_Used")
    subtype_tags: list[str] = Field(default_factory=list, alias="Subtype_Tags")
    needs_review_flag: bool = Field(..., alias="Needs_Review_Flag")
    improvement_suggestions: AchievementSuggestions | None = Field(None, alias="Improvement_Suggestions")
    # Vector embedding for RAG
    embedding: list[float] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

class CareerEntry(BaseModel):
    entry_id: str = Field(..., alias="Entry_ID")
    entry_type: EntryType = Field(..., alias="Entry_Type")
    organization: str = Field(..., alias="Organization")
    role: str = Field(..., alias="Role")
    start_date: str = Field(..., alias="StartDate")
    end_date: str = Field(..., alias="EndDate")
    location: str = Field(..., alias="Location")
    core_responsibilities_scope: str = Field(..., alias="Core_Responsibilities_Scope")
<<<<<<< HEAD
    subtype_tags: List[str] = Field(default_factory=list, alias="Subtype_Tags")

class KSCImprovementSuggestions(BaseModel):
    situation: Optional[str] = Field(None, alias="Situation")
    task: Optional[str] = Field(None, alias="Task")
    action: Optional[str] = Field(None, alias="Action")
    result: Optional[str] = Field(None, alias="Result")
=======
    subtype_tags: list[str] = Field(default_factory=list, alias="Subtype_Tags")

class KSCImprovementSuggestions(BaseModel):
    situation: str | None = Field(None, alias="Situation")
    task: str | None = Field(None, alias="Task")
    action: str | None = Field(None, alias="Action")
    result: str | None = Field(None, alias="Result")
>>>>>>> restoration-KR-Rage-Figma-v2.0

class KSCResponse(BaseModel):
    ksc_id: str = Field(..., alias="KSC_ID")
    ksc_prompt: str = Field(..., alias="KSC_Prompt")
    situation: str = Field(..., alias="Situation")
    task: str = Field(..., alias="Task")
    action: str = Field(..., alias="Action")
    result: str = Field(..., alias="Result")
<<<<<<< HEAD
    skills_used: List[str] = Field(default_factory=list, alias="Skills_Used")
    subtype_tags: List[str] = Field(default_factory=list, alias="Subtype_Tags")
    original_text: str = Field(..., alias="Original_Text")
    needs_review_flag: bool = Field(..., alias="Needs_Review_Flag")
    star_feedback: str = Field(..., alias="STAR_Feedback")
    linked_entry_id: Optional[str] = Field(None, alias="Linked_Entry_ID")
    improvement_suggestions: Optional[KSCImprovementSuggestions] = Field(None, alias="Improvement_Suggestions")
    embedding: Optional[List[float]] = None
=======
    skills_used: list[str] = Field(default_factory=list, alias="Skills_Used")
    subtype_tags: list[str] = Field(default_factory=list, alias="Subtype_Tags")
    original_text: str = Field(..., alias="Original_Text")
    needs_review_flag: bool = Field(..., alias="Needs_Review_Flag")
    star_feedback: str = Field(..., alias="STAR_Feedback")
    linked_entry_id: str | None = Field(None, alias="Linked_Entry_ID")
    improvement_suggestions: KSCImprovementSuggestions | None = Field(None, alias="Improvement_Suggestions")
    embedding: list[float] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

class PersonalInformation(BaseModel):
    full_name: str = Field(..., alias="FullName")
    phone: str = Field(..., alias="Phone")
    email: str = Field(..., alias="Email")
    location: str = Field(..., alias="Location")
<<<<<<< HEAD
    portfolio_urls: List[str] = Field(default_factory=list, alias="Portfolio_Website_URLs")

class CareerProfile(BaseModel):
    target_titles: List[str] = Field(default_factory=list, alias="Target_Titles")
    master_summary_points: List[str] = Field(default_factory=list, alias="Master_Summary_Points")
=======
    portfolio_urls: list[str] = Field(default_factory=list, alias="Portfolio_Website_URLs")

class CareerProfile(BaseModel):
    target_titles: list[str] = Field(default_factory=list, alias="Target_Titles")
    master_summary_points: list[str] = Field(default_factory=list, alias="Master_Summary_Points")
>>>>>>> restoration-KR-Rage-Figma-v2.0

class MasterSkill(BaseModel):
    skill_name: str = Field(..., alias="Skill_Name")
    category: str = Field(..., alias="Category")
<<<<<<< HEAD
    subtype: List[str] = Field(default_factory=list, alias="Subtype")
    proficiency: Optional[SkillProficiency] = Field(None, alias="Proficiency")
    years_experience: Optional[float] = Field(None, alias="Years_Experience")
=======
    subtype: list[str] = Field(default_factory=list, alias="Subtype")
    proficiency: SkillProficiency | None = Field(None, alias="Proficiency")
    years_experience: float | None = Field(None, alias="Years_Experience")
>>>>>>> restoration-KR-Rage-Figma-v2.0

class CareerDatabase(BaseModel):
    personal_information: PersonalInformation = Field(..., alias="Personal_Information")
    career_profile: CareerProfile = Field(..., alias="Career_Profile")
<<<<<<< HEAD
    master_skills_inventory: List[MasterSkill] = Field(default_factory=list, alias="Master_Skills_Inventory")
    career_entries: List[CareerEntry] = Field(default_factory=list, alias="Career_Entries")
    structured_achievements: List[StructuredAchievement] = Field(default_factory=list, alias="Structured_Achievements")
    ksc_responses: List[KSCResponse] = Field(default_factory=list, alias="KSC_Responses")
=======
    master_skills_inventory: list[MasterSkill] = Field(default_factory=list, alias="Master_Skills_Inventory")
    career_entries: list[CareerEntry] = Field(default_factory=list, alias="Career_Entries")
    structured_achievements: list[StructuredAchievement] = Field(default_factory=list, alias="Structured_Achievements")
    ksc_responses: list[KSCResponse] = Field(default_factory=list, alias="KSC_Responses")
>>>>>>> restoration-KR-Rage-Figma-v2.0
