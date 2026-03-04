import importlib
import sys


def test_models_init_exports():
    if "app.models" in sys.modules:
        del sys.modules["app.models"]
    import app.models as models

    expected_exports = [
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

    assert len(models.__all__) == len(expected_exports)
    for export in expected_exports:
        assert export in models.__all__
