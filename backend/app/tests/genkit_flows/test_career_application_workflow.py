"""Tests for Career Application Workflow."""

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.career_application_workflow import (
    ApplicationPackageResult,
    KSCResponsesResult,
    TailoredResumeResult,
    generate_application_package,
)


@pytest.fixture(autouse=True)
def mock_genkit():
    """Mock Genkit components."""
    with patch("app.genkit_flows.career_application_workflow.async_genkit_flow") as mock_flow:
        mock_flow.side_effect = lambda output_schema: (lambda func: func)
        yield mock_flow


@pytest.fixture
def mock_sub_flows():
    """Mock sub-flows used by the orchestrator."""
    with (
        patch(
            "app.genkit_flows.career_application_workflow.generate_resume_intelligence_report",
            new_callable=AsyncMock,
        ) as mock_resume,
        patch(
            "app.genkit_flows.career_application_workflow.research_company_for_application",
            new_callable=AsyncMock,
        ) as mock_research,
        patch(
            "app.genkit_flows.career_application_workflow.generate_smart_cover_letter",
            new_callable=AsyncMock,
        ) as mock_cover_letter,
        patch(
            "app.genkit_flows.career_application_workflow.generateKscResponse",
            new_callable=AsyncMock,
        ) as mock_ksc,
    ):

        # Return mocks with necessary attributes for scoring
        res_analysis_mock = MagicMock()
        res_analysis_mock.overall_score = 80
        res_analysis_mock.dict.return_value = {"overall_score": 80}

        mock_resume.return_value = MagicMock(resume_analysis=res_analysis_mock)
        mock_resume.return_value.model_dump_json.return_value = "{}"

        mock_research.return_value = MagicMock()

        cv_analysis_mock = MagicMock()
        cv_analysis_mock.compelling_score = 85
        cv_analysis_mock.personalization_score = 90
        cv_analysis_mock.dict.return_value = {"compelling_score": 85, "personalization_score": 90}

        mock_cover_letter.return_value = MagicMock(analysis=cv_analysis_mock)

        mock_ksc.return_value = "Mocked STAR response"

        yield {
            "resume": mock_resume,
            "research": mock_research,
            "cover_letter": mock_cover_letter,
            "ksc": mock_ksc,
        }


@pytest.mark.asyncio
async def test_generate_application_package_success(mock_sub_flows):
    """Should successfully orchestrate all sub-flows."""
    job_desc = """
Company: Google
Role: Software Engineer
Key selection criteria:
1. Advanced experience with Python programming language and cloud systems
"""
    user_profile = {"resume_content": "Experience at AI startup", "target_industry": "Tech"}

    # Mock resume tailoring (internal method uses model.generate)
    with patch("app.genkit_flows.career_application_workflow._get_generation_model") as mock_model:
        mock_gen = MagicMock()
        mock_gen.generate = MagicMock()

        response_mock = MagicMock()
        response_mock.output.return_value = {
            "tailored_content": "Tailored content",
            "improvements_made": ["Enhanced keywords"],
            "keyword_matches": ["Python"],
            "competitive_advantages": ["AI experience"],
        }
        mock_gen.generate.return_value = response_mock
        mock_model.return_value = mock_gen

        result = await generate_application_package(job_desc, user_profile)

        assert result.success is True
        assert "resume_intelligence" in result.components_generated
        assert "tailored_resume" in result.components_generated
        assert "cover_letter" in result.components_generated
        assert result.job_match_score > 0


@pytest.mark.asyncio
async def test_generate_application_package_partial_success(mock_sub_flows):
    """Should succeed even if some components fail (at least 2 success)."""
    job_desc = "Just a role"
    user_profile = {"resume_content": "Data Scientist"}

    # Fail resume intelligence
    mock_sub_flows["resume"].side_effect = Exception("Resume analysis failed")
    # Fail company research (no company name)

    result = await generate_application_package(job_desc, user_profile)

    # Should still generate cover letter (and maybe others if they don't depend on resume intelligence)
    assert "cover_letter" in result.components_generated
    # But tailored_resume depends on resume_intelligence
    assert "tailored_resume" not in result.components_generated
    assert result.success is False  # Only 1 component (cover_letter) succeeded


@pytest.mark.asyncio
async def test_input_validation():
    """Should return success=False for invalid inputs."""
    # Note: Orchestrator catches InputValidationError and returns failed result
    result = await generate_application_package("", {})
    assert result.success is False
    assert any("Job description is required" in err for err in result.error_details)

    result = await generate_application_package("Desc", None)
    assert result.success is False
    assert any("User profile is required" in err for err in result.error_details)
