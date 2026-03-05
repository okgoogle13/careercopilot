"""
models package initializer.

This file makes the 'models' directory a Python package and exposes
the Pydantic schemas for easy importing throughout the application.

Example:
from app.models import UserProfile
"""

from .database import User
from .master_profile_schema import MasterCareerProfile as MasterProfile
from .master_profile_schema import PersonalInfo
from .schemas import (
    AIRecommendationsResponse,
    ATSScoreResponse,
    CategoryScore,
    CreateProfileVariationRequest,
    EducationItem,
    ExperienceItem,
    JobOpportunity,
    KeywordAnalysisResponse,
    ProfileVariation,
    Recommendation,
    UserPreferences,
    UserProfile,
    VoiceProfile,
    VoiceProfileResponse,
)
from .theme_config_schemas import (
    AtsComplianceInfo,
    ColorConfig,
    CoverLetterThemeConfig,
    LayoutConfig,
    ResumeThemeConfig,
    TypographyConfig,
)
from .user_asset import UserAsset

__all__ = [
    "AIRecommendationsResponse",
    "ATSScoreResponse",
    "AtsComplianceInfo",
    "CategoryScore",
    "ColorConfig",
    "CoverLetterThemeConfig",
    "CreateProfileVariationRequest",
    "EducationItem",
    "ExperienceItem",
    "JobOpportunity",
    "KeywordAnalysisResponse",
    "LayoutConfig",
    "MasterProfile",
    "PersonalInfo",
    "ProfileVariation",
    "Recommendation",
    "ResumeThemeConfig",
    "TypographyConfig",
    "User",
    "UserPreferences",
    "UserProfile",
    "VoiceProfile",
    "VoiceProfileResponse",
]
