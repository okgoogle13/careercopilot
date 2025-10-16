"""
schemas.py

Pydantic models for API request and response validation.

This module defines the data contracts between the FastAPI backend and the
React frontend, ensuring type safety and clear data structures for all
AI-powered features in the Careercopilot application.
"""

from datetime import datetime  # Make sure datetime is imported
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

# Add these new models to your existing schemas.py file


# ... (keep all existing models like User, ATSScoreResponse, etc.)


class ProfileVariation(BaseModel):
    """Represents a tailored variation of a user's master profile."""

    id: str
    name: str
    description: str
    target_roles: List[str]
    skills_emphasis: List[str]
    experience_focus: str
    created_at: datetime  # Use datetime for better type handling
    is_default: bool = False


class CreateProfileVariationRequest(BaseModel):
    """Request model for creating a new profile variation."""

    name: str
    description: str
    target_roles: List[str]
    skills_emphasis: List[str]
    experience_focus: str


class VoiceProfileResponse(BaseModel):
    """Response model for the voice profile generation flow."""

    tone: str
    style: str
    vocabulary_level: str
    # ... any other fields your voice profile flow returns


# ==============================================================================
# Sub-Models for Nested Structures
# ==============================================================================


class CategoryScore(BaseModel):
    """Represents the score for a specific category in an ATS analysis."""

    name: str = Field(
        ..., description="The name of the category, e.g., 'Keyword Optimization'."
    )
    score: int = Field(..., description="The score for this category (0-100).")
    status: Literal["good", "warning", "poor"] = Field(
        ..., description="The qualitative status of the score."
    )
    suggestions: List[str] = Field(
        ..., description="A list of AI-generated suggestions for this category."
    )


# Add this model to schemas.py


class User(BaseModel):
    """Pydantic model representing an authenticated user."""

    uid: str
    email: Optional[str] = None
    name: Optional[str] = None


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
    targetRoles: List[str]
    voiceProfile: VoiceProfile


class PersonalInfo(BaseModel):
    """Stores the user's personal contact information."""

    name: str
    phone: str
    location: str
    linkedIn: Optional[str] = None


class MasterProfile(BaseModel):
    """The core master profile containing all professional information."""

    summary: str
    skills: List[str]
    experience: List[ExperienceItem]
    education: List[EducationItem]
    certifications: List[str]


# ==============================================================================
# Main API Response Models
# ==============================================================================


class ATSScoreResponse(BaseModel):
    """
    Response model for a full ATS score analysis.
    Corresponds to Ref #22 in the UI Mapping.
    """

    overallScore: int = Field(..., description="The composite ATS score (0-100).")
    categories: List[CategoryScore] = Field(
        ..., description="A breakdown of scores by category."
    )
    matched_keywords: List[str] = Field(
        ..., description="Keywords found in both the resume and job description."
    )
    missing_keywords: List[str] = Field(
        ..., description="Keywords found in the job description but not the resume."
    )


class KeywordAnalysisResponse(BaseModel):
    """
    Response model for keyword analysis.
    Corresponds to Ref #25 in the UI Mapping.
    """

    matched: List[str] = Field(
        ..., description="Keywords found in both the resume and job description."
    )
    missing: List[str] = Field(
        ..., description="Keywords found in the job description but not the resume."
    )


class AIRecommendationsResponse(BaseModel):
    """
    Response model for AI-generated recommendations.
    Corresponds to Ref #27 in the UI Mapping.
    """

    recommendations: List[Recommendation] = Field(
        ..., description="A list of actionable recommendations."
    )


class JobOpportunity(BaseModel):
    """
    Data model for a job opportunity detected by the system.
    Corresponds to Ref #30 in the UI Mapping and the Solution Design.
    """

    id: str
    userId: str
    source: Literal["gmail", "manual"]
    title: str
    company: str
    description: str
    deadline: Optional[datetime] = None
    applicationStatus: Literal["detected", "in_progress", "applied"]
    documents: List[str] = Field(
        ..., description="A list of generated document IDs related to this opportunity."
    )
    calendarEventId: Optional[str] = None
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
