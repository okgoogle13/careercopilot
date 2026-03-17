import sys


def test_models_init_exports():
    if "app.models" in sys.modules:
        del sys.modules["app.models"]
    import app.models as models

    expected_exports = [
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

    for export in expected_exports:
        assert export in models.__all__
