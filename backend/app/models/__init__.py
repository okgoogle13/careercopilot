"""
models package initializer.

This file makes the 'models' directory a Python package and exposes
the Pydantic schemas for easy importing throughout the application.

Example:
from app.models import UserProfile
"""

from .document_embedding import DocumentEmbedding
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
from .user import User as DBUser
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
