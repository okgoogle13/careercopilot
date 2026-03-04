"""Focused tests for the document analysis service."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.ai.document_analysis_service import (
    DocumentAnalysisService,
    JobDescriptionAnalysisResult,
    ResumeAnalysisResult,
)
from app.core.config import settings


class _FakeResponse:
    """Minimal Genkit-style response wrapper for tests."""

    def __init__(self, value):
        self._value = value

    def output(self):
        return self._value


@pytest.fixture
def document_analysis_service():
    """Create a service instance with a mock prompt service."""
    service = DocumentAnalysisService()
    service.prompt_service = MagicMock()
    service.prompt_service.get_system_prompt.return_value = "system prompt"
    return service


@pytest.mark.asyncio
async def test_analyze_resume_success(document_analysis_service):
    """Resume analysis should return the model output on success."""
    expected = ResumeAnalysisResult(
        skills=["Python", "SQL"],
        summary="Experienced engineer",
    )
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(return_value=_FakeResponse(expected))

    with (
        patch("app.ai.document_analysis_service.get_model", return_value=mock_model),
        patch(
            "app.ai.document_analysis_service.format_prompt",
            return_value="formatted prompt",
        ),
    ):
        result = await document_analysis_service.analyze_resume(
            "Experienced software engineer with Python and SQL skills.",
            "Technology",
        )

    assert result == expected
    mock_model.generate.assert_awaited_once()


@pytest.mark.asyncio
async def test_analyze_resume_without_target_industry(document_analysis_service):
    """Resume analysis should work when no target industry is provided."""
    expected = ResumeAnalysisResult(skills=["Communication"])
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(return_value=_FakeResponse(expected))

    with (
        patch("app.ai.document_analysis_service.get_model", return_value=mock_model),
        patch(
            "app.ai.document_analysis_service.format_prompt",
            return_value="formatted prompt",
        ),
    ):
        result = await document_analysis_service.analyze_resume(
            "Experienced software engineer with broad transferable skills."
        )

    assert result == expected


@pytest.mark.asyncio
async def test_analyze_resume_returns_default_result_on_ai_error(document_analysis_service):
    """Resume analysis should fall back to a default result on model errors."""
    with patch("app.ai.document_analysis_service.get_model", return_value=None):
        result = await document_analysis_service.analyze_resume(
            "Experienced software engineer with broad transferable skills."
        )

    assert isinstance(result, ResumeAnalysisResult)
    assert result.skills == []
    assert "error" in (result.raw_data or {})


@pytest.mark.asyncio
async def test_analyze_job_description_success(document_analysis_service):
    """Job description analysis should return the model output on success."""
    expected = JobDescriptionAnalysisResult(
        title="Software Engineer",
        company="Acme Corp",
        required_skills=["Python"],
    )
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(return_value=_FakeResponse(expected))

    with (
        patch("app.ai.document_analysis_service.get_model", return_value=mock_model),
        patch(
            "app.ai.document_analysis_service.format_prompt",
            return_value="formatted prompt",
        ),
    ):
        result = await document_analysis_service.analyze_job_description(
            "Software Engineer role at Acme Corp requiring Python and backend API experience."
        )

    assert result == expected


@pytest.mark.asyncio
async def test_analyze_job_description_returns_default_result_on_ai_error(
    document_analysis_service,
):
    """Job description analysis should fall back to a default result on model errors."""
    with patch("app.ai.document_analysis_service.get_model", return_value=None):
        result = await document_analysis_service.analyze_job_description(
            "Software Engineer role at Acme Corp requiring Python and backend API experience."
        )

    assert isinstance(result, JobDescriptionAnalysisResult)
    assert result.required_skills == []
    assert "error" in (result.raw_data or {})


def test_service_enabled_status(document_analysis_service):
    """The service should inherit the global enabled flag by default."""
    assert document_analysis_service.config["enabled"] == settings.enable_ai_features


def test_service_model_config_uses_current_settings_name(document_analysis_service):
    """The service should fall back to the current settings model field name."""
    expected_model = getattr(settings, "ai_model", settings.model_name)
    assert document_analysis_service.config["model"] == expected_model


def test_service_max_tokens_config(document_analysis_service):
    """The service should inherit the global max-token setting."""
    assert document_analysis_service.config["max_tokens"] == settings.ai_max_tokens


def test_service_temperature_config(document_analysis_service):
    """The service should inherit the global temperature setting."""
    assert document_analysis_service.config["temperature"] == settings.ai_temperature
