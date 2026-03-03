"""
models package initializer.

This file makes the 'models' directory a Python package and exposes
the Pydantic schemas for easy importing throughout the application.

Example:
from app.models import UserProfile
"""


from .database import User
from .schemas import (
    AIRecommendationsResponse,
    ATSScoreResponse,
    CategoryScore,
    CreateProfileVariationRequest,
    EducationItem,
    ExperienceItem,
    JobOpportunity,
    KeywordAnalysisResponse,
    Recommendation,
    UserPreferences,
    UserProfile,
    VoiceProfile,
    VoiceProfileResponse,
    ProfileVariation,
)
from .master_profile_schema import MasterCareerProfile as MasterProfile, PersonalInfo
from .user_asset import UserAsset

__all__ = [
    "AIRecommendationsResponse",
    "ATSScoreResponse",
    "CategoryScore",
    "CreateProfileVariationRequest",
    "EducationItem",
    "ExperienceItem",
    "JobOpportunity",
    "KeywordAnalysisResponse",
    "MasterProfile",
    "PersonalInfo",
    "ProfileVariation",
    "Recommendation",
    "User",
    "UserPreferences",
    "UserProfile",
    "VoiceProfile",
    "VoiceProfileResponse",
]
