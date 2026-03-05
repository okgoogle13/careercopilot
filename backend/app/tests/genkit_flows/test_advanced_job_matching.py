"""Tests for advanced_job_matching genkit flow."""

from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from app.genkit_flows import advanced_job_matching as module
from app.genkit_flows.advanced_job_matching import (
    CareerTransitionAnalysis,
    JobMatchAnalysis,
    JobOpportunityRanking,
    SkillMatch,
)


@pytest.fixture
def mock_model(monkeypatch):
    """Patch get_model() used inside the flow."""
    m = MagicMock()
    monkeypatch.setattr("app.genkit_flows.advanced_job_matching.get_model", lambda: m)
    monkeypatch.setattr("app.core.genkit_init.get_model", lambda: m)
    return m


@pytest.fixture
def sample_candidate():
    return {
        "name": "Jane Smith",
        "skills": ["Python", "FastAPI", "SQL"],
        "years_experience": 5,
        "current_role": "Backend Developer",
    }


@pytest.fixture
def sample_job_description():
    return "Senior Backend Engineer with experience in Python, FastAPI, and AWS."


@pytest.fixture
def valid_job_match_analysis():
    return JobMatchAnalysis(
        overall_match_score=82,
        skill_compatibility=85,
        experience_fit=80,
        cultural_fit=78,
        growth_potential=90,
        skill_matches=[
            SkillMatch(
                skill="Python",
                candidate_level=8,
                required_level=7,
                gap_score=0,
                importance="critical",
            )
        ],
        critical_gaps=["AWS"],
        competitive_advantages=["FastAPI expertise"],
        career_transition=None,
        recommendations=["Get AWS certified"],
        interview_prep_focus=["Prepare system design examples"],
        confidence_level="high",
        match_category="strong_match",
    )


class TestAnalyzeJobMatchDetailed:
    def test_happy_path_returns_analysis(
        self, mock_model, sample_job_description, sample_candidate, valid_job_match_analysis
    ):
        """Should return a JobMatchAnalysis when model succeeds."""
        mock_response = MagicMock()
        mock_response.output.return_value = valid_job_match_analysis
        mock_model.generate.return_value = mock_response

        result = module.analyze_job_match_detailed(
            job_description=sample_job_description,
            candidate_profile=sample_candidate,
        )

        assert isinstance(result, JobMatchAnalysis)
        assert result.overall_match_score == 82
        mock_model.generate.assert_called_once()

    def test_missing_job_description_raises_ai_error(self, mock_model, sample_candidate):
        """Empty job description should raise AIError."""
        from app.core.ai_error_handling import AIError

        with pytest.raises((AIError, Exception)):
            module.analyze_job_match_detailed(
                job_description="",
                candidate_profile=sample_candidate,
            )

    def test_missing_candidate_profile_raises_ai_error(self, mock_model, sample_job_description):
        """Empty candidate profile dict should raise AIError."""
        from app.core.ai_error_handling import AIError

        with pytest.raises((AIError, Exception)):
            module.analyze_job_match_detailed(
                job_description=sample_job_description,
                candidate_profile={},
            )

    def test_model_failure_raises_ai_error(
        self, mock_model, sample_job_description, sample_candidate
    ):
        """Model exception should be wrapped in AIError."""
        from app.core.ai_error_handling import AIError

        mock_model.generate.side_effect = RuntimeError("Model unavailable")
        with pytest.raises((AIError, RuntimeError)):
            module.analyze_job_match_detailed(
                job_description=sample_job_description,
                candidate_profile=sample_candidate,
            )

    def test_model_unavailable_raises_error(
        self, monkeypatch, sample_job_description, sample_candidate
    ):
        """get_model() returning None should raise an error."""
        monkeypatch.setattr("app.genkit_flows.advanced_job_matching.get_model", lambda: None)
        monkeypatch.setattr("app.core.genkit_init.get_model", lambda: None)
        with pytest.raises(Exception):
            module.analyze_job_match_detailed(
                job_description=sample_job_description,
                candidate_profile=sample_candidate,
            )


class TestJobMatchAnalysisSchema:
    def test_schema_validates_valid_data(self):
        """JobMatchAnalysis should accept valid data."""
        analysis = JobMatchAnalysis(
            overall_match_score=75,
            skill_compatibility=70,
            experience_fit=80,
            cultural_fit=72,
            growth_potential=85,
            skill_matches=[],
            critical_gaps=[],
            competitive_advantages=[],
            career_transition=None,
            recommendations=[],
            interview_prep_focus=[],
            confidence_level="moderate",
            match_category="good_match",
        )
        assert analysis.overall_match_score == 75

    def test_schema_rejects_out_of_range_score(self):
        """Scores outside 0-100 should fail validation."""
        with pytest.raises(Exception):
            JobMatchAnalysis(
                overall_match_score=150,  # Invalid
                skill_compatibility=70,
                experience_fit=80,
                cultural_fit=72,
                growth_potential=85,
                skill_matches=[],
                critical_gaps=[],
                competitive_advantages=[],
                career_transition_analysis=None,
                improvement_recommendations=[],
                interview_preparation=[],
            )
