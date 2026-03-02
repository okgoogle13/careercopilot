"""
models package initializer.

This file makes the 'models' directory a Python package and exposes
the Pydantic schemas for easy importing throughout the application.

Example:
from app.models import UserProfile
"""

<<<<<<< HEAD
=======
from .document_embedding import DocumentEmbedding
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
from .document_embedding import DocumentEmbedding
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0

__all__ = [
    "AIRecommendationsResponse",
    "ATSScoreResponse",
    "CategoryScore",
<<<<<<< HEAD
=======
    "CreateProfileVariationRequest",
>>>>>>> restoration-KR-Rage-Figma-v2.0
    "EducationItem",
    "ExperienceItem",
    "JobOpportunity",
    "KeywordAnalysisResponse",
    "MasterProfile",
    "PersonalInfo",
<<<<<<< HEAD
=======
    "ProfileVariation",
>>>>>>> restoration-KR-Rage-Figma-v2.0
    "Recommendation",
    "User",
    "UserPreferences",
    "UserProfile",
    "VoiceProfile",
<<<<<<< HEAD
    "ProfileVariation",
    "CreateProfileVariationRequest",
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
    "VoiceProfileResponse",
]
