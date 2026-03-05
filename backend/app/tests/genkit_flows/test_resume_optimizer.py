"""Tests for resume_optimizer flows."""

import json
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.genkit_flows import resume_optimizer as module
from app.genkit_flows.extract_job_requirements import JobRequirements
from app.genkit_flows.extract_resume_entities import ResumeEntities
from app.genkit_flows.resume_optimizer import (
    EnhancedResumeResult,
    OptimizedResume,
    SkillsGap,
    _compute_skills_gap,
    enhance_resume_with_metrics,
    optimize_resume,
)


@pytest.fixture
def mock_model(monkeypatch):
    m = MagicMock()
    monkeypatch.setattr("app.genkit_flows.resume_optimizer.get_model", lambda: m)
    return m


@pytest.fixture
def sample_resume():
    return "Led a team to deliver software. Managed projects. Wrote Python code."


@pytest.fixture
def sample_job_description():
    return "Senior Engineer with Python, Project Management, and Agile experience."


class TestComputeSkillsGap:
    def test_identifies_matched_skills(self):
        resume = ResumeEntities(skills=["Python", "SQL"], experience=[], education=[])
        job = JobRequirements(
            requiredSkills=["Python", "Agile"], preferredSkills=["Docker"], experienceLevel="senior"
        )
        gap = _compute_skills_gap(resume, job)
        assert "Python" in gap.matched

    def test_identifies_missing_skills(self):
        resume = ResumeEntities(skills=["Python"], experience=[], education=[])
        job = JobRequirements(
            requiredSkills=["Python", "Agile", "AWS"], preferredSkills=[], experienceLevel=""
        )
        gap = _compute_skills_gap(resume, job)
        assert "Agile" in gap.missing
        assert "AWS" in gap.missing

    def test_identifies_adjacent_skills(self):
        resume = ResumeEntities(skills=["Project Planning"], experience=[], education=[])
        job = JobRequirements(
            requiredSkills=["Project Management"], preferredSkills=[], experienceLevel=""
        )
        gap = _compute_skills_gap(resume, job)
        assert any("Project" in s for s in gap.adjacent)

    def test_match_score_calculation(self):
        resume = ResumeEntities(skills=["Python", "SQL"], experience=[], education=[])
        job = JobRequirements(
            requiredSkills=["Python", "SQL", "AWS"], preferredSkills=[], experienceLevel=""
        )
        gap = _compute_skills_gap(resume, job)
        assert gap.match_score == 67  # 2/3 = 67%

    def test_empty_job_requirements_returns_zero_score(self):
        resume = ResumeEntities(skills=["Python"], experience=[], education=[])
        job = JobRequirements(requiredSkills=[], preferredSkills=[], experienceLevel="")
        gap = _compute_skills_gap(resume, job)
        assert gap.match_score == 0


@pytest.mark.asyncio
class TestOptimizeResume:
    async def test_no_keywords_returns_original(
        self, mock_model, sample_resume, sample_job_description
    ):
        """When no keywords are missing, original resume should be returned unchanged."""
        result = await optimize_resume(
            resume_text=sample_resume,
            missing_keywords=[],
            job_description=sample_job_description,
        )
        assert isinstance(result, OptimizedResume)
        assert result.resume_text == sample_resume
        assert result.keywords_integrated == []
        mock_model.generate.assert_not_called()

    async def test_happy_path_integrates_keywords(
        self, mock_model, sample_resume, sample_job_description
    ):
        """Model integrates keywords → should return populated OptimizedResume."""
        mock_response = MagicMock()
        mock_response.text = json.dumps(
            {
                "resume_text": "Led a team using Agile methodology. Managed projects with Project Management skills.",
                "keywords_integrated": ["Agile", "Project Management"],
            }
        )
        mock_model.generate.return_value = mock_response

        result = await optimize_resume(
            resume_text=sample_resume,
            missing_keywords=["Agile", "Project Management"],
            job_description=sample_job_description,
        )
        assert "Agile" in result.keywords_integrated
        assert (
            "Project Management" in result.resume_text
            or "Project Management" in result.keywords_integrated
        )

    async def test_model_unavailable_returns_original(
        self, monkeypatch, sample_resume, sample_job_description
    ):
        """When model is unavailable, should return the original resume as fallback."""
        monkeypatch.setattr("app.genkit_flows.resume_optimizer.get_model", lambda: None)
        result = await optimize_resume(
            resume_text=sample_resume,
            missing_keywords=["Agile"],
            job_description=sample_job_description,
        )
        assert isinstance(result, OptimizedResume)
        assert result.resume_text == sample_resume

    async def test_model_error_returns_original(
        self, mock_model, sample_resume, sample_job_description
    ):
        """Model error should gracefully return original resume (not crash)."""
        mock_model.generate.side_effect = RuntimeError("API Error")
        result = await optimize_resume(
            resume_text=sample_resume,
            missing_keywords=["Docker"],
            job_description=sample_job_description,
        )
        assert result.resume_text == sample_resume


@pytest.mark.asyncio
class TestEnhanceResumeWithMetrics:
    async def test_happy_path_returns_enhanced_result(
        self, mock_model, sample_resume, sample_job_description, monkeypatch
    ):
        """Should return EnhancedResumeResult with bullets and skills gap."""
        # Mock entity extractors
        monkeypatch.setattr(
            module,
            "extractJobRequirements",
            lambda _: JobRequirements(
                requiredSkills=["Python", "Agile"], preferredSkills=[], experienceLevel="senior"
            ),
        )
        monkeypatch.setattr(
            module,
            "extractResumeEntities",
            lambda _: ResumeEntities(skills=["Python"], experience=[], education=[]),
        )
        mock_response = MagicMock()
        mock_response.text = json.dumps(
            {
                "improved_bullets": [
                    {
                        "original": "Led a team",
                        "improved": "Led a team of 8 engineers",
                        "metric_type": "number",
                        "rationale": "Shows scale.",
                    }
                ]
            }
        )
        mock_model.generate.return_value = mock_response

        result = await enhance_resume_with_metrics(
            resume_text=sample_resume,
            job_description=sample_job_description,
        )
        assert isinstance(result, EnhancedResumeResult)
        assert len(result.improved_bullets) > 0
        assert isinstance(result.skills_gap, SkillsGap)

    async def test_bullet_enhancement_failure_returns_empty_bullets(
        self, mock_model, sample_resume, sample_job_description, monkeypatch
    ):
        """Even if bullet enhancement fails, skills_gap should still be returned."""
        monkeypatch.setattr(
            module,
            "extractJobRequirements",
            lambda _: JobRequirements(requiredSkills=[], preferredSkills=[], experienceLevel=""),
        )
        monkeypatch.setattr(
            module,
            "extractResumeEntities",
            lambda _: ResumeEntities(skills=[], experience=[], education=[]),
        )
        mock_model.generate.side_effect = RuntimeError("Model error")

        result = await enhance_resume_with_metrics(
            resume_text=sample_resume,
            job_description=sample_job_description,
        )
        assert isinstance(result, EnhancedResumeResult)
        assert result.improved_bullets == []
