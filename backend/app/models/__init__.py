"""
models package initializer.

This file makes the 'models' directory a Python package and exposes
the Pydantic schemas for easy importing throughout the application.

Example:
from app.models import UserProfile
"""

from .schemas import (
    AIRecommendationsResponse,
    ATSScoreResponse,
    CategoryScore,
    CreateProfileVariationRequest,
    EducationItem,
    ExperienceItem,
    JobOpportunity,
    KeywordAnalysisResponse,
    MasterProfile,
    PersonalInfo,
    ProfileVariation,
    Recommendation,
    User,
    UserPreferences,
    UserProfile,
    VoiceProfile,
    VoiceProfileResponse,
)

__all__ = [
    "AIRecommendationsResponse",
    "ATSScoreResponse",
    "CategoryScore",
    "EducationItem",
    "ExperienceItem",
    "JobOpportunity",
    "KeywordAnalysisResponse",
    "MasterProfile",
    "PersonalInfo",
    "Recommendation",
    "User",
    "UserPreferences",
    "UserProfile",
    "VoiceProfile",
    "ProfileVariation",
    "CreateProfileVariationRequest",
    "VoiceProfileResponse",
]
