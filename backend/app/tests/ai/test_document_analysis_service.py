"""Focused tests for the document analysis service."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from pydantic import BaseModel

from app.ai.document_analysis_service import (
    DocumentAnalysisService,
    JobDescriptionAnalysisResult,
    ResumeAnalysisResult,
    analyze_resume,
    analyze_job_description,
    get_document_analysis_service
)
from app.core.ai_error_handling import AIError, AIErrorType
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

@pytest.fixture(autouse=True)
def reset_global_service():
    """Reset the global service instance before each test."""
    import app.ai.document_analysis_service as das
    das._document_analysis_service = None
    yield

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
async def test_analyze_resume_invalid_input(document_analysis_service):
    with pytest.raises(ValueError, match="Resume text must be a non-empty string"):
        await document_analysis_service.analyze_resume("")

    with pytest.raises(ValueError, match="Resume text must be a non-empty string"):
        await document_analysis_service.analyze_resume(None)

    with pytest.raises(ValueError, match="Resume text is too short for meaningful analysis"):
        await document_analysis_service.analyze_resume("short")

@pytest.mark.asyncio
async def test_analyze_resume_disabled(document_analysis_service):
    document_analysis_service.config["enabled"] = False
    result = await document_analysis_service.analyze_resume("Valid long text content goes here for the test.")
    assert isinstance(result, ResumeAnalysisResult)
    assert result.raw_data == {"error": "Analysis not available"}

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
async def test_analyze_job_description_invalid_input(document_analysis_service):
    with pytest.raises(ValueError, match="Job description text must be a non-empty string"):
        await document_analysis_service.analyze_job_description("")

    with pytest.raises(ValueError, match="Job description text must be a non-empty string"):
        await document_analysis_service.analyze_job_description(None)

    with pytest.raises(ValueError, match="Job description text is too short for meaningful analysis"):
        await document_analysis_service.analyze_job_description("short")

@pytest.mark.asyncio
async def test_analyze_job_description_disabled(document_analysis_service):
    document_analysis_service.config["enabled"] = False
    result = await document_analysis_service.analyze_job_description("Valid long text content goes here for the test.")
    assert isinstance(result, JobDescriptionAnalysisResult)
    assert result.raw_data == {"error": "Analysis not available"}

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

class DummyModel(BaseModel):
    test_field: str

@pytest.mark.asyncio
async def test_analyze_document_generic_success(document_analysis_service):
    expected = DummyModel(test_field="success")
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(return_value=_FakeResponse(expected))

    with (
        patch("app.ai.document_analysis_service.get_model", return_value=mock_model),
        patch("app.ai.document_analysis_service.format_prompt", return_value="formatted prompt")
    ):
        result = await document_analysis_service.analyze_document_generic(
            document_text="Valid long document text goes here for generic testing.",
            template_id="dummy_template",
            response_model=DummyModel,
            param1="value1"
        )

    assert result == expected

@pytest.mark.asyncio
async def test_analyze_document_generic_invalid_input(document_analysis_service):
    with pytest.raises(ValueError, match="Document text must be a non-empty string"):
        await document_analysis_service.analyze_document_generic(None, "template", BaseModel)

    with pytest.raises(ValueError, match="Template ID must be provided"):
        await document_analysis_service.analyze_document_generic("doc text", "", BaseModel)

@pytest.mark.asyncio
async def test_analyze_document_generic_disabled(document_analysis_service):
    document_analysis_service.config["enabled"] = False
    with pytest.raises(AIError) as exc_info:
        await document_analysis_service.analyze_document_generic("Valid long text", "template", BaseModel)
    assert exc_info.value.error_type == AIErrorType.SERVICE_UNAVAILABLE

@pytest.mark.asyncio
async def test_analyze_document_generic_model_unavailable(document_analysis_service):
    with patch("app.ai.document_analysis_service.get_model", return_value=None):
        with pytest.raises(AIError) as exc_info:
            await document_analysis_service.analyze_document_generic("Valid long text", "template", BaseModel)
        assert exc_info.value.error_type == AIErrorType.MODEL_UNAVAILABLE

@pytest.mark.asyncio
async def test_analyze_document_generic_format_prompt_error(document_analysis_service):
    mock_model = MagicMock()
    with patch("app.ai.document_analysis_service.get_model", return_value=mock_model):
        with patch("app.ai.document_analysis_service.format_prompt", side_effect=Exception("Formatting Error")):
            with pytest.raises(AIError) as exc_info:
                await document_analysis_service.analyze_document_generic("Valid long text", "template", BaseModel)
            assert exc_info.value.error_type == AIErrorType.PROMPT_FORMATTING_ERROR

@pytest.mark.asyncio
async def test_analyze_document_generic_generation_error(document_analysis_service):
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(side_effect=Exception("Gen Error"))

    with patch("app.ai.document_analysis_service.get_model", return_value=mock_model):
        with patch("app.ai.document_analysis_service.format_prompt", return_value="prompt"):
            with pytest.raises(AIError) as exc_info:
                await document_analysis_service.analyze_document_generic("Valid long text", "template", BaseModel)
            assert exc_info.value.error_type == AIErrorType.GENERATION_ERROR

@pytest.mark.asyncio
async def test_analyze_document_generic_no_system_prompt(document_analysis_service):
    document_analysis_service.prompt_service.get_system_prompt.return_value = None
    expected = DummyModel(test_field="success")
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(return_value=_FakeResponse(expected))

    with (
        patch("app.ai.document_analysis_service.get_model", return_value=mock_model),
        patch("app.ai.document_analysis_service.format_prompt", return_value="formatted prompt")
    ):
        result = await document_analysis_service.analyze_document_generic(
            "Valid long text", "template", BaseModel
        )
    assert result == expected

@pytest.mark.asyncio
async def test_extract_skills_resume(document_analysis_service):
    expected_resume = ResumeAnalysisResult(skills=["A", "B"])
    # Bypass is_available check by mocking config
    document_analysis_service.config["enabled"] = True
    with patch.object(document_analysis_service, "is_available", return_value=True):
        with patch.object(document_analysis_service, "analyze_resume", new=AsyncMock(return_value=expected_resume)):
            skills = await document_analysis_service.extract_skills("resume text", "resume")
            assert skills == ["A", "B"]

@pytest.mark.asyncio
async def test_extract_skills_job_description(document_analysis_service):
    expected_job = JobDescriptionAnalysisResult(required_skills=["C"], preferred_skills=["D"])
    document_analysis_service.config["enabled"] = True
    with patch.object(document_analysis_service, "is_available", return_value=True):
        with patch.object(document_analysis_service, "analyze_job_description", new=AsyncMock(return_value=expected_job)):
            skills = await document_analysis_service.extract_skills("job text", "job_description")
            assert skills == ["C", "D"]

class MockGenericSkillsModel(BaseModel):
    skills: list[str]

@pytest.mark.asyncio
async def test_extract_skills_generic(document_analysis_service):
    expected_generic = MockGenericSkillsModel(skills=["E", "F"])
    document_analysis_service.config["enabled"] = True
    with patch.object(document_analysis_service, "is_available", return_value=True):
        with patch.object(document_analysis_service, "analyze_document_generic", new=AsyncMock(return_value=expected_generic)):
            skills = await document_analysis_service.extract_skills("generic text", "other")
            assert skills == ["E", "F"]

@pytest.mark.asyncio
async def test_extract_skills_not_available(document_analysis_service):
    with patch.object(document_analysis_service, "is_available", return_value=False):
        skills = await document_analysis_service.extract_skills("text")
        assert skills == []

@pytest.mark.asyncio
async def test_extract_skills_error(document_analysis_service):
    document_analysis_service.config["enabled"] = True
    with patch.object(document_analysis_service, "is_available", return_value=True):
        with patch.object(document_analysis_service, "analyze_resume", side_effect=Exception("Failed")):
            skills = await document_analysis_service.extract_skills("text", "resume")
            assert skills == []

@pytest.mark.asyncio
async def test_convenience_functions():
    expected_resume = ResumeAnalysisResult(skills=["Python"])
    expected_job = JobDescriptionAnalysisResult(required_skills=["Python"])

    mock_service = MagicMock()
    mock_service.analyze_resume = AsyncMock(return_value=expected_resume)
    mock_service.analyze_job_description = AsyncMock(return_value=expected_job)

    with patch("app.ai.document_analysis_service.get_document_analysis_service", return_value=mock_service):
        r1 = await analyze_resume("test")
        assert r1 == expected_resume

        r2 = await analyze_job_description("test")
        assert r2 == expected_job


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

def test_singleton_get_document_analysis_service():
    service1 = get_document_analysis_service()
    service2 = get_document_analysis_service()
    assert service1 is service2
