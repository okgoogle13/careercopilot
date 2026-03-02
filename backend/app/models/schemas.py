"""
schemas.py

Pydantic models for API request and response validation.

This module defines the data contracts between the FastAPI backend and the
React frontend, ensuring type safety and clear data structures for all
AI-powered features in the Careercopilot application.
"""

from datetime import datetime  # Make sure datetime is imported
<<<<<<< HEAD
from typing import List, Literal, Optional
=======
from typing import Literal
>>>>>>> restoration-KR-Rage-Figma-v2.0

from pydantic import BaseModel, Field

# Add these new models to your existing schemas.py file


# ... (keep all existing models like User, ATSScoreResponse, etc.)


class ProfileVariation(BaseModel):
    """Represents a tailored variation of a user's master profile."""

    id: str
    name: str
    description: str
<<<<<<< HEAD
    target_roles: List[str]
    skills_emphasis: List[str]
=======
    target_roles: list[str]
    skills_emphasis: list[str]
>>>>>>> restoration-KR-Rage-Figma-v2.0
    experience_focus: str
    created_at: datetime  # Use datetime for better type handling
    is_default: bool = False


class CreateProfileVariationRequest(BaseModel):
    """Request model for creating a new profile variation."""

    name: str
    description: str
<<<<<<< HEAD
    target_roles: List[str]
    skills_emphasis: List[str]
=======
    target_roles: list[str]
    skills_emphasis: list[str]
>>>>>>> restoration-KR-Rage-Figma-v2.0
    experience_focus: str


class VoiceProfileResponse(BaseModel):
    """Response model for the voice profile generation flow."""

    tone: str
    style: str
    vocabulary_level: str
    # ... any other fields your voice profile flow returns


# =============================================================================
# KSC Generation Models
# =============================================================================


class KscCriterion(BaseModel):
    id: str
    text: str


class KscResponse(BaseModel):
    criterion_id: str
    response: str
    word_count: int


class GenerateKscRequest(BaseModel):
    job_description: str = Field(..., min_length=50)


class GenerateKscResponse(BaseModel):
<<<<<<< HEAD
    criteria: List[KscCriterion]
    responses: List[KscResponse]
    processing_time: Optional[float] = None
=======
    criteria: list[KscCriterion]
    responses: list[KscResponse]
    processing_time: float | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


# =============================================================================
# Cover Letter Generation Models
# =============================================================================


class CoverLetterRequest(BaseModel):
    job_description: str = Field(..., alias="jobDescription", min_length=50)
    tone: Literal["professional", "enthusiastic", "creative", "formal"] = Field(...)


class CoverLetterResponse(BaseModel):
    cover_letter: str
<<<<<<< HEAD
    subject_line: Optional[str] = None
=======
    subject_line: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


# =============================================================================
# Sub-Models for Nested Structures
# =============================================================================


class CategoryScore(BaseModel):
    """Represents the score for a specific category in an ATS analysis."""

    name: str = Field(..., description="The name of the category, e.g., 'Keyword Optimization'.")
    score: int = Field(..., description="The score for this category (0-100).")
    status: Literal["good", "warning", "poor"] = Field(
        ..., description="The qualitative status of the score."
    )
<<<<<<< HEAD
    suggestions: List[str] = Field(
=======
    suggestions: list[str] = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        ..., description="A list of AI-generated suggestions for this category."
    )


# Add this model to schemas.py


class User(BaseModel):
    """Pydantic model representing an authenticated user."""

    uid: str
<<<<<<< HEAD
    email: Optional[str] = None
    name: Optional[str] = None
=======
    email: str | None = None
    name: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


class Recommendation(BaseModel):
    """Represents a single actionable recommendation from the AI."""

    text: str = Field(..., description="The description of the recommendation.")
    action: Literal["apply", "navigate"] = Field(
        ..., description="The type of action the user can take."
    )


class ExperienceItem(BaseModel):
    """Data model for a single work experience entry in a user's profile."""

    title: str
    company: str
    duration: str
    description: str


class EducationItem(BaseModel):
    """Data model for a single education entry in a user's profile."""

    degree: str
    school: str
    year: str


class VoiceProfile(BaseModel):
    """Represents the AI-detected writing style of a user."""

    tone: str
    vocab_level: str


class UserPreferences(BaseModel):
    """Stores user-specific preferences."""

    themeId: str
<<<<<<< HEAD
    targetRoles: List[str]
=======
    targetRoles: list[str]
>>>>>>> restoration-KR-Rage-Figma-v2.0
    voiceProfile: VoiceProfile


class PersonalInfo(BaseModel):
    """Stores the user's personal contact information."""

    name: str
    phone: str
    location: str
<<<<<<< HEAD
    linkedIn: Optional[str] = None
=======
    linkedIn: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


class MasterProfile(BaseModel):
    """The core master profile containing all professional information."""

    summary: str
<<<<<<< HEAD
    skills: List[str]
    experience: List[ExperienceItem]
    education: List[EducationItem]
    certifications: List[str]
=======
    skills: list[str]
    experience: list[ExperienceItem]
    education: list[EducationItem]
    certifications: list[str]
>>>>>>> restoration-KR-Rage-Figma-v2.0


# =============================================================================
# Main API Response Models
# =============================================================================


class ATSScoreResponse(BaseModel):
    """
    Response model for a full ATS score analysis.
    Corresponds to Ref #22 in the UI Mapping.
    """

    overall_score: int = Field(..., alias="score", description="The composite ATS score (0-100).")
<<<<<<< HEAD
    categories: List[CategoryScore] = Field(..., alias="breakdown", description="A breakdown of scores by category.")
    matched_keywords: List[str] = Field(
        ..., alias="matchedKeywords", description="Keywords found in both the resume and job description."
    )
    missing_keywords: List[str] = Field(
=======
    categories: list[CategoryScore] = Field(..., alias="breakdown", description="A breakdown of scores by category.")
    matched_keywords: list[str] = Field(
        ..., alias="matchedKeywords", description="Keywords found in both the resume and job description."
    )
    missing_keywords: list[str] = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        ..., alias="missingKeywords", description="Keywords found in the job description but not the resume."
    )

    class Config:
        populate_by_name = True


class KeywordAnalysisResponse(BaseModel):
    """
    Response model for keyword analysis.
    Corresponds to Ref #25 in the UI Mapping.
    """

<<<<<<< HEAD
    matched: List[str] = Field(
        ..., description="Keywords found in both the resume and job description."
    )
    missing: List[str] = Field(
=======
    matched: list[str] = Field(
        ..., description="Keywords found in both the resume and job description."
    )
    missing: list[str] = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        ..., description="Keywords found in the job description but not the resume."
    )


class AIRecommendationsResponse(BaseModel):
    """
    Response model for AI-generated recommendations.
    Corresponds to Ref #27 in the UI Mapping.
    """

<<<<<<< HEAD
    recommendations: List[Recommendation] = Field(
=======
    recommendations: list[Recommendation] = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        ..., description="A list of actionable recommendations."
    )


class JobOpportunity(BaseModel):
    """
    Data model for a job opportunity detected by the system.
    Corresponds to Ref #30 in the UI Mapping and the Solution Design.
    """

    id: str
    userId: str
    source: Literal["gmail", "manual", "chrome_extension"]
    title: str
    company: str
    description: str
<<<<<<< HEAD
    deadline: Optional[datetime] = None
    applicationStatus: Literal["detected", "in_progress", "applied"]
    documents: List[str] = Field(
        ..., description="A list of generated document IDs related to this opportunity."
    )
    calendarEventId: Optional[str] = None
=======
    deadline: datetime | None = None
    applicationStatus: Literal["detected", "in_progress", "applied"]
    documents: list[str] = Field(
        ..., description="A list of generated document IDs related to this opportunity."
    )
    calendarEventId: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    created: datetime


class UserProfile(BaseModel):
    """
    The complete User Profile data model.
    Based on the 'User Profile' model in the Solution Design.
    """

    uid: str
    email: str
    personalInfo: PersonalInfo
    masterProfile: MasterProfile
    preferences: UserPreferences
    created: datetime
    updated: datetime


# =============================================================================
# Job Listing Extractor Models
# =============================================================================


class JobListingDetails(BaseModel):
    """
    Pydantic model for structured job listing details.
    Ported from the TypeScript JobDetails interface.
    """

<<<<<<< HEAD
    due_date: Optional[str] = Field(None, description="The application due date.")
    company_name: Optional[str] = Field(
        None, description="The name of the hiring organization or company."
    )
    role_title: Optional[str] = Field(None, description="The title of the role.")
    hiring_manager: Optional[str] = Field(None, description="The name of the hiring manager.")
    manager_contact: Optional[str] = Field(
        None, description="Contact details (email or phone) for the hiring manager."
    )
    essential_criteria: List[str] = Field(
        default_factory=list,
        description="A list of key selection criteria that are explicitly mentioned as essential, mandatory, or required.",
    )
    desirable_criteria: List[str] = Field(
        default_factory=list,
        description="A list of key selection criteria that are explicitly mentioned as desirable, preferred, or 'nice to have'.",
    )
    role_type: Optional[str] = Field(
        None,
        description="The classified role type: 'Frontline/Support', 'PM/Delivery', or 'Other'.",
    )
    subsectors: List[str] = Field(
        default_factory=list,
        description="A list of relevant community service subsectors this role operates in.",
    )
    location: Optional[str] = Field(None, description="The location, suburb, or region of the role.")
    key_responsibilities: List[str] = Field(
        default_factory=list,
        description="A list of key duties, tasks, or responsibilities associated with the role.",
    )
    full_description: Optional[str] = Field(
=======
    due_date: str | None = Field(None, description="The application due date.")
    company_name: str | None = Field(
        None, description="The name of the hiring organization or company."
    )
    role_title: str | None = Field(None, description="The title of the role.")
    hiring_manager: str | None = Field(None, description="The name of the hiring manager.")
    manager_contact: str | None = Field(
        None, description="Contact details (email or phone) for the hiring manager."
    )
    essential_criteria: list[str] = Field(
        default_factory=list,
        description="A list of key selection criteria that are explicitly mentioned as essential, mandatory, or required.",
    )
    desirable_criteria: list[str] = Field(
        default_factory=list,
        description="A list of key selection criteria that are explicitly mentioned as desirable, preferred, or 'nice to have'.",
    )
    role_type: str | None = Field(
        None,
        description="The classified role type: 'Frontline/Support', 'PM/Delivery', or 'Other'.",
    )
    subsectors: list[str] = Field(
        default_factory=list,
        description="A list of relevant community service subsectors this role operates in.",
    )
    location: str | None = Field(None, description="The location, suburb, or region of the role.")
    key_responsibilities: list[str] = Field(
        default_factory=list,
        description="A list of key duties, tasks, or responsibilities associated with the role.",
    )
    full_description: str | None = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        None,
        description="The complete, unprocessed job description text for use with AI features.",
    )



class JobListingTextRequest(BaseModel):
    """Request model for extracting job details from raw text."""

    text: str = Field(..., description="The raw text of the job description.")


class JobListingUrlRequest(BaseModel):
    """Request model for extracting job details from a URL."""

    url: str = Field(..., description="The URL of the job listing.")


class AdvancedAnalysisRequest(BaseModel):
    """Request model for the advanced analysis ('Thinking Mode') feature."""

    job_details: JobListingDetails = Field(
        ..., description="The structured job details extracted from a listing."
    )
    user_prompt: str = Field(..., description="The user's specific query for the analysis.")
