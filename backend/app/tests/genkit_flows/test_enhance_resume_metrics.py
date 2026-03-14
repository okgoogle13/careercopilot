"""
Unit tests for enhance_resume_with_metrics Genkit flow.

Follows the same mocking conventions as test_ats_scoring.py:
- AI model is mocked; no network calls are made.
- _compute_skills_gap is a pure function tested directly.
"""

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.extract_job_requirements import JobRequirements
from app.genkit_flows.extract_resume_entities import ResumeEntities
from app.genkit_flows.resume_optimizer import (
    EnhancedResumeResult,
    ImprovedBullet,
    SkillsGap,
    _compute_skills_gap,
    enhance_resume_with_metrics,
)

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def sample_job_reqs() -> JobRequirements:
    return JobRequirements(
        requiredSkills=["Python", "FastAPI", "Docker"],
        preferredSkills=["React", "Postgres"],
        experienceLevel="Mid-level",
    )


@pytest.fixture
def sample_resume_entities() -> ResumeEntities:
    return ResumeEntities(
        skills=["Python", "Django", "React", "AWS"],
        experience=[{"title": "Backend Engineer", "company": "Acme Corp", "duration": "3 years"}],
        education=[{"degree": "BSc Computer Science"}],
    )


@pytest.fixture
def sample_resume_text() -> str:
    return """
    Backend Engineer at Acme Corp (3 years)
    - Led development of REST APIs using Python and Django
    - Improved deployment pipeline reducing release time
    - Managed on-call rotation for production systems
    SKILLS: Python, Django, React, AWS
    """


@pytest.fixture
def sample_job_description() -> str:
    return """
    Mid-level Backend Engineer
    Required: Python, FastAPI, Docker
    Preferred: React, Postgres
    3+ years experience with REST APIs.
    """


@pytest.fixture
def mock_ai_bullets() -> dict:
    return {
        "improved_bullets": [
            {
                "original": "Led development of REST APIs",
                "improved": "Led development of 12 REST API endpoints serving 50K daily requests",
                "metric_type": "number",
                "rationale": "Concrete scale demonstrates the impact of the work.",
            },
            {
                "original": "Improved deployment pipeline reducing release time",
                "improved": "Improved deployment pipeline, reducing average release time by 40%",
                "metric_type": "percentage",
                "rationale": "Percentage reduction is a universally understood efficiency metric.",
            },
        ]
    }


# ---------------------------------------------------------------------------
# Pure-function tests — no mocking required
# ---------------------------------------------------------------------------


class TestComputeSkillsGap:
    """Tests for the pure _compute_skills_gap helper."""

    def test_matched_skills_are_identified(self, sample_job_reqs, sample_resume_entities):
        gap = _compute_skills_gap(sample_resume_entities, sample_job_reqs)
        # Python and React are in the resume
        assert "Python" in gap.matched
        assert "React" in gap.matched

    def test_missing_skills_are_identified(self, sample_job_reqs, sample_resume_entities):
        gap = _compute_skills_gap(sample_resume_entities, sample_job_reqs)
        # FastAPI and Docker are required but not in resume
        assert "FastAPI" in gap.missing
        assert "Docker" in gap.missing

    def test_match_score_calculation(self, sample_job_reqs, sample_resume_entities):
        gap = _compute_skills_gap(sample_resume_entities, sample_job_reqs)
        # Required: Python, FastAPI, Docker -> 1/3 matched = 33%
        assert gap.match_score == 33

    def test_empty_job_requirements(self, sample_resume_entities):
        empty_reqs = JobRequirements(requiredSkills=[], preferredSkills=[], experienceLevel="")
        gap = _compute_skills_gap(sample_resume_entities, empty_reqs)
        assert gap.match_score == 0
        assert gap.matched == []
        assert gap.missing == []

    def test_perfect_match(self):
        reqs = JobRequirements(
            requiredSkills=["Python", "React"], preferredSkills=[], experienceLevel=""
        )
        entities = ResumeEntities(skills=["Python", "React"], experience=[], education=[])
        gap = _compute_skills_gap(entities, reqs)
        assert gap.match_score == 100
        assert set(gap.matched) == {"Python", "React"}
        assert gap.missing == []

    def test_skills_gap_returns_correct_type(self, sample_job_reqs, sample_resume_entities):
        gap = _compute_skills_gap(sample_resume_entities, sample_job_reqs)
        assert isinstance(gap, SkillsGap)
        assert isinstance(gap.matched, list)
        assert isinstance(gap.missing, list)
        assert isinstance(gap.adjacent, list)
        assert 0 <= gap.match_score <= 100


# ---------------------------------------------------------------------------
# Integration-style tests for the async flow (AI mocked)
# ---------------------------------------------------------------------------


class TestEnhanceResumeWithMetrics:
    """Tests for the enhance_resume_with_metrics async flow."""

    @pytest.mark.asyncio
    async def test_returns_enhanced_result_structure(
        self,
        sample_resume_text,
        sample_job_description,
        sample_job_reqs,
        sample_resume_entities,
        mock_ai_bullets,
    ):
        """Flow returns an EnhancedResumeResult with the expected shape."""
        mock_model_response = MagicMock()
        mock_model_response.text = json.dumps(mock_ai_bullets)

        mock_model = MagicMock()
        mock_model.generate.return_value = mock_model_response

        with (
            patch(
                "app.genkit_flows.resume_optimizer.extractJobRequirements",
                return_value=sample_job_reqs,
            ),
            patch(
                "app.genkit_flows.resume_optimizer.extractResumeEntities",
                return_value=sample_resume_entities,
            ),
            patch(
                "app.genkit_flows.resume_optimizer.get_model",
                return_value=mock_model,
            ),
        ):
            result = await enhance_resume_with_metrics(
                resume_text=sample_resume_text,
                job_description=sample_job_description,
            )

        assert isinstance(result, EnhancedResumeResult)
        assert isinstance(result.skills_gap, SkillsGap)
        assert isinstance(result.improved_bullets, list)

    @pytest.mark.asyncio
    async def test_improved_bullets_have_correct_fields(
        self,
        sample_resume_text,
        sample_job_description,
        sample_job_reqs,
        sample_resume_entities,
        mock_ai_bullets,
    ):
        """Each ImprovedBullet has all required fields."""
        mock_model_response = MagicMock(text=json.dumps(mock_ai_bullets))
        mock_model = MagicMock(generate=MagicMock(return_value=mock_model_response))

        with (
            patch(
                "app.genkit_flows.resume_optimizer.extractJobRequirements",
                return_value=sample_job_reqs,
            ),
            patch(
                "app.genkit_flows.resume_optimizer.extractResumeEntities",
                return_value=sample_resume_entities,
            ),
            patch("app.genkit_flows.resume_optimizer.get_model", return_value=mock_model),
        ):
            result = await enhance_resume_with_metrics(
                resume_text=sample_resume_text,
                job_description=sample_job_description,
            )

        assert len(result.improved_bullets) == 2
        for bullet in result.improved_bullets:
            assert isinstance(bullet, ImprovedBullet)
            assert bullet.original
            assert bullet.improved
            assert bullet.metric_type in {"number", "percentage", "timeframe", "scale"}
            assert bullet.rationale

    @pytest.mark.asyncio
    async def test_graceful_fallback_on_ai_error(
        self,
        sample_resume_text,
        sample_job_description,
        sample_job_reqs,
        sample_resume_entities,
    ):
        """When AI generation fails, returns empty bullets but still computes skills_gap."""
        mock_model = MagicMock()
        mock_model.generate.side_effect = RuntimeError("Simulated AI failure")

        with (
            patch(
                "app.genkit_flows.resume_optimizer.extractJobRequirements",
                return_value=sample_job_reqs,
            ),
            patch(
                "app.genkit_flows.resume_optimizer.extractResumeEntities",
                return_value=sample_resume_entities,
            ),
            patch("app.genkit_flows.resume_optimizer.get_model", return_value=mock_model),
        ):
            result = await enhance_resume_with_metrics(
                resume_text=sample_resume_text,
                job_description=sample_job_description,
            )

        # Bullets empty on error, but skills_gap still computed
        assert result.improved_bullets == []
        assert isinstance(result.skills_gap, SkillsGap)
        assert 0 <= result.skills_gap.match_score <= 100

    @pytest.mark.asyncio
    async def test_graceful_fallback_on_extraction_failure(
        self,
        sample_resume_text,
        sample_job_description,
        mock_ai_bullets,
    ):
        """When entity extraction fails, flow continues with empty fallbacks."""
        mock_model_response = MagicMock(text=json.dumps(mock_ai_bullets))
        mock_model = MagicMock(generate=MagicMock(return_value=mock_model_response))

        with (
            patch(
                "app.genkit_flows.resume_optimizer.extractJobRequirements",
                side_effect=RuntimeError("Extraction error"),
            ),
            patch(
                "app.genkit_flows.resume_optimizer.extractResumeEntities",
                side_effect=RuntimeError("Extraction error"),
            ),
            patch(
                "app.genkit_flows.resume_optimizer.get_model",
                return_value=mock_model,
            ),
        ):
            result = await enhance_resume_with_metrics(
                resume_text=sample_resume_text,
                job_description=sample_job_description,
            )

        # Should not raise; skills_gap has defaults
        assert isinstance(result, EnhancedResumeResult)
        assert result.skills_gap.match_score == 0
        assert result.skills_gap.matched == []
