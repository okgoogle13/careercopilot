"""Tests for Resume Intelligence Pipeline."""

import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.resume_intelligence_pipeline import (
    CareerProgressionAnalysis,
    ExperienceEntry,
    ResumeAnalysisResult,
    ResumeIntelligenceReport,
    SkillAssessment,
    SkillLevel,
    analyze_career_progression,
    analyze_resume_batch,
    analyze_resume_comprehensive,
    analyze_skills_gap_for_transition,
    generate_resume_intelligence_report,
)


@pytest.fixture(autouse=True)
def mock_genkit_flow():
    """Mock Genkit components."""
    with patch("app.genkit_flows.resume_intelligence_pipeline.async_genkit_flow") as mock_flow:
        mock_flow.side_effect = lambda **kwargs: (lambda func: func)
        yield mock_flow


@pytest.fixture
def mock_genkit_model():
    """Mock Genkit model for testing."""
    with patch("app.genkit_flows.resume_intelligence_pipeline.get_model") as mock_get_model:
        mock_model = MagicMock()
        mock_model.generate = AsyncMock()
        mock_get_model.return_value = mock_model
        yield mock_model


@pytest.mark.asyncio
async def test_analyze_resume_comprehensive(mock_genkit_model):
    """Should analyze resume and return structured results."""
    # Mock model response
    response_mock = MagicMock()
    response_mock.output.return_value = ResumeAnalysisResult(
        overall_score=85,
        ats_compatibility_score=90,
        human_readability_score=80,
        impact_score=88,
        section_scores={"summary": 9, "experience": 8, "skills": 9},
        experience_analysis=[
            ExperienceEntry(
                job_title="Dev",
                company="G",
                duration="2y",
                responsibilities=["Code"],
                achievements=["Fast"],
                impact_score=9,
                skills_demonstrated=["Python"],
            )
        ],
        skills_assessment=[
            SkillAssessment(
                skill="Python",
                level=SkillLevel.ADVANCED,
                evidence_count=5,
                market_demand="high",
                improvement_potential="medium",
                years_experience=3,
            )
        ],
        strengths=["Strong Python"],
        weaknesses=["Needs cloud"],
        missing_elements=[],
        immediate_improvements=["Add stats"],
        strategic_recommendations=["Certify"],
        industry_alignment="Strong",
        competitive_position="Above average",
        unique_differentiators=["AI experience"],
        market_positioning_advice=["Focus on ML"],
    )
    mock_genkit_model.generate.return_value = response_mock

    result = await analyze_resume_comprehensive("My resume content", "Technology")

    assert result.overall_score == 85
    assert result.ats_compatibility_score == 90
    assert len(result.experience_analysis) == 1
    assert result.experience_analysis[0].job_title == "Dev"


@pytest.mark.asyncio
async def test_analyze_career_progression(mock_genkit_model):
    """Should analyze career trajectory and return structured results."""
    # Mock model response
    response_mock = MagicMock()
    response_mock.output.return_value = CareerProgressionAnalysis(
        career_trajectory="upward",
        progression_score=90,
        title_progression=["Junior", "Senior"],
        skill_evolution={"Python": ["Basic", "Advanced"]},
        career_gaps=[],
        growth_patterns=["Consistent learning"],
        future_trajectory=["Lead Engineer"],
        positioning_for_advancement=["Learn leadership"],
    )
    mock_genkit_model.generate.return_value = response_mock

    result = await analyze_career_progression("Resume content", "Become CTO")

    assert result.career_trajectory == "upward"
    assert "Junior" in result.title_progression


@pytest.mark.asyncio
async def test_generate_resume_intelligence_report(mock_genkit_model):
    """Should orchestrate multiple analyses and synthesize results."""
    # Create mock result data
    analysis_mock = MagicMock(spec=ResumeAnalysisResult)
    analysis_mock.model_dump_json.return_value = "{}"
    analysis_mock.overall_score = 80

    progression_mock = MagicMock(spec=CareerProgressionAnalysis)
    progression_mock.model_dump_json.return_value = "{}"

    # Each sub-flow call will return these mocks
    with (
        patch(
            "app.genkit_flows.resume_intelligence_pipeline.analyze_resume_comprehensive",
            new_callable=AsyncMock,
        ) as mock_comp,
        patch(
            "app.genkit_flows.resume_intelligence_pipeline.analyze_career_progression",
            new_callable=AsyncMock,
        ) as mock_prog,
    ):

        mock_comp.return_value = analysis_mock
        mock_prog.return_value = progression_mock

        # Now mock the final synthesis call
        response_mock = MagicMock()
        response_mock.output.return_value = ResumeIntelligenceReport(
            analysis_timestamp="2024-01-01",
            resume_analysis=analysis_mock,
            career_progression=progression_mock,
            market_readiness=85,
            interview_readiness=80,
            salary_negotiation_strength=75,
            thirty_day_action_items=["Update LI"],
            ninety_day_strategic_plan=["Certify"],
            success_metrics=["Response rate"],
            industry_fit_analysis={"Tech": 90},
            role_recommendations=["DevOps"],
        )
        mock_genkit_model.generate.return_value = response_mock

        result = await generate_resume_intelligence_report("Resume")

        assert result.market_readiness == 85
        assert result.industry_fit_analysis["Tech"] == 90
        assert "DevOps" in result.role_recommendations


@pytest.mark.asyncio
async def test_analyze_resume_batch(mock_genkit_model):
    """Should handle batch analysis of multiple resumes."""
    with patch(
        "app.genkit_flows.resume_intelligence_pipeline.analyze_resume_comprehensive",
        new_callable=AsyncMock,
    ) as mock_analyze:
        mock_analyze.return_value = MagicMock(spec=ResumeAnalysisResult)
        mock_analyze.return_value.dict.return_value = {"overall_score": 80}

        results = await analyze_resume_batch(["Res1", "Res2"])

        assert len(results) == 2
        assert results[0]["status"] == "success"
        assert results[0]["analysis"]["overall_score"] == 80


@pytest.mark.asyncio
async def test_analyze_skills_gap(mock_genkit_model):
    """Should analyze gaps for transitions."""
    mock_genkit_model.generate.return_value.output.return_value = MagicMock()

    result = await analyze_skills_gap_for_transition(
        "Resume", "Job desc", "Industry A", "Industry B"
    )

    # Verify model was called with transition context
    mock_genkit_model.generate.assert_called_once()
    call_args = mock_genkit_model.generate.call_args
    # call_args[0] contains positional arguments, where prompt is the first one
    assert "TRANSITION CONTEXT" in call_args[0][0]
