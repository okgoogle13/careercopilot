import json
from datetime import datetime
from typing import cast
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.core.ai_error_handling import AIError
from app.genkit_flows.application_preparation_workflow import (
    ApplicationPackage,
    KscDetectionResult,
    assess_application_readiness,
    detect_ksc_requirements,
    prepare_full_application,
)


@pytest.fixture
def mock_gen_model():
    model = MagicMock()
    model.model_name = "gemini-3.0-flash"
    return model


@pytest.fixture
def mock_ai_config(mock_gen_model):
    config = MagicMock()
    config.get_model_config.return_value = mock_gen_model
    return config


def test_detect_ksc_requirements_success(mock_ai_config, mock_gen_model):
    mock_response = MagicMock()
    mock_result = KscDetectionResult(
        has_ksc_requirements=True,
        detected_criteria=["Criterion 1"],
        confidence_score=90,
        extraction_notes=["Notes"],
    )
    mock_response.output.return_value = mock_result
    mock_gen_model.generate.return_value = mock_response

    with patch(
        "app.genkit_flows.application_preparation_workflow.get_ai_config",
        return_value=mock_ai_config,
    ):
        result = detect_ksc_requirements("Need someone with Python.")
        assert result.has_ksc_requirements is True
        assert result.detected_criteria == ["Criterion 1"]
        mock_gen_model.generate.assert_called_once()


def test_detect_ksc_requirements_failure(mock_ai_config, mock_gen_model):
    mock_gen_model.generate.side_effect = Exception("Generation failed")

    with patch(
        "app.genkit_flows.application_preparation_workflow.get_ai_config",
        return_value=mock_ai_config,
    ):
        with pytest.raises(AIError, match="KSC detection failed"):
            detect_ksc_requirements("Job description")


@pytest.mark.asyncio
async def test_prepare_full_application_success(mock_ai_config, mock_gen_model):
    # Mock specialized flows using MagicMock (not AsyncMock) for sync compatibility
    mock_ksc_detection = KscDetectionResult(
        has_ksc_requirements=True,
        detected_criteria=["Critical Criterion"],
        confidence_score=95,
        extraction_notes=[],
    )

    mock_resume_report = MagicMock()
    mock_resume_report.market_readiness = 85
    mock_resume_report.dict.return_value = {"market_readiness": 85}

    mock_cover_letter = MagicMock()
    mock_cover_letter.dict.return_value = {"content": "Dear Hiring Manager..."}

    mock_strategy_response = MagicMock()
    mock_strategy_response.output.return_value = json.dumps(
        {"submission_strategy": ["Apply early"]}
    )
    mock_gen_model.generate.return_value = mock_strategy_response

    # Force synchronous behavior for the flows by patching them with MagicMock
    with (
        patch(
            "app.genkit_flows.application_preparation_workflow.get_ai_config",
            return_value=mock_ai_config,
        ),
        patch(
            "app.genkit_flows.application_preparation_workflow.detect_ksc_requirements",
            MagicMock(return_value=mock_ksc_detection),
        ),
        patch(
            "app.genkit_flows.application_preparation_workflow.generate_resume_intelligence_report",
            MagicMock(return_value=mock_resume_report),
        ),
        patch(
            "app.genkit_flows.application_preparation_workflow.generate_smart_cover_letter",
            MagicMock(return_value=mock_cover_letter),
        ),
        patch(
            "app.genkit_flows.application_preparation_workflow.generateKscResponse",
            MagicMock(return_value="I am good at Python"),
        ),
    ):

        user_profile = {
            "resume_content": "Experience...",
            "career_goals": "Manager",
            "experience_level": "senior",
        }
        result = prepare_full_application(job_description="Standard Job", user_profile=user_profile)

        assert isinstance(result, ApplicationPackage)
        assert result.tailored_resume["market_readiness"] == 85
        assert result.cover_letter["content"] == "Dear Hiring Manager..."
        assert len(result.ksc_responses) == 1
        assert result.ksc_responses[0]["ksc_statement"] == "Critical Criterion"
        assert result.application_strategy["submission_strategy"] == ["Apply early"]


def test_assess_application_readiness_success(mock_ai_config, mock_gen_model):
    mock_response = MagicMock()
    mock_response.output.return_value = json.dumps(
        {"alignment_score": 88, "recommendations": ["Fix typos"]}
    )
    mock_gen_model.generate.return_value = mock_response

    with patch(
        "app.genkit_flows.application_preparation_workflow.get_ai_config",
        return_value=mock_ai_config,
    ):
        result = assess_application_readiness({"name": "User"}, "Job Desc")
        assert result["alignment_score"] == 88
        assert result["recommendations"] == ["Fix typos"]
