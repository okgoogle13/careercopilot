"""
Tests for the resume analysis service.
"""

from unittest.mock import AsyncMock, patch

import pytest

from app.ai.resume_service import (
    Education,
    Experience,
    ResumeAnalysisResult,
    ResumeAnalysisService,
)
from app.core.config import settings
from app.models import User

pytestmark = pytest.mark.asyncio


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""

    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    monkeypatch.setattr("app.core.dependencies.get_current_user", mock_get_current_user)


@pytest.fixture
def resume_analysis_service(monkeypatch):
    """Fixture for the ResumeAnalysisService."""
    monkeypatch.setattr("app.ai.resume_service.get_ai_client", lambda: AsyncMock())
    return ResumeAnalysisService()


@pytest.fixture
def mock_process_document():
    """Mock the process_document function."""
    mock = AsyncMock()
    with patch("app.core.document_processing.process_document", new=mock):
        yield mock


async def test_analyze_resume_happy_path(
    resume_analysis_service: ResumeAnalysisService,
    mock_process_document: AsyncMock,
    mock_current_user,
):
    """Test successful resume analysis with valid input."""
    mock_process_document.return_value = ResumeAnalysisResult(
        skills=["Python", "Data Analysis"],
        experience=[
            Experience(
                title="Data Scientist",
                company="Acme Corp",
                start_date="2022-01-01",
                end_date="2023-12-31",
                description="Developed machine learning models.",
            )
        ],
        education=[
            Education(
                degree="Master",
                field="Computer Science",
                institution="Stanford University",
                year=2022,
            )
        ],
        summary="Highly skilled data scientist.",
    )

    resume_text = "This is a sample resume with relevant skills and experience."
    result = await resume_analysis_service.analyze_resume(resume_text)

    assert isinstance(result, ResumeAnalysisResult)
    assert result.skills == ["Python", "Data Analysis"]
    assert len(result.experience) == 1
    assert len(result.education) == 1
    assert result.summary == "Highly skilled data scientist."
    mock_process_document.assert_called_once()


async def test_analyze_resume_empty_input(resume_analysis_service: ResumeAnalysisService):
    """Test resume analysis with empty input."""
    with pytest.raises(ValueError) as excinfo:
        await resume_analysis_service.analyze_resume("")
    assert "Resume text must be a non-empty string" in str(excinfo.value)


async def test_analyze_resume_short_input(resume_analysis_service: ResumeAnalysisService):
    """Test resume analysis with short input."""
    with pytest.raises(ValueError) as excinfo:
        await resume_analysis_service.analyze_resume("short")
    assert "Resume text is too short for meaningful analysis" in str(excinfo.value)


async def test_analyze_resume_service_disabled(
    resume_analysis_service: ResumeAnalysisService, mock_process_document
):
    """Test resume analysis when the service is disabled."""
    resume_analysis_service.config["enabled"] = False
    resume_text = "This is a sample resume."
    result = await resume_analysis_service.analyze_resume(resume_text)
    assert isinstance(result, ResumeAnalysisResult)
    assert not result.skills
    assert not result.experience
    assert not result.education
    assert not result.summary
    mock_process_document.assert_not_called()


async def test_analyze_resume_sanitize_input(
    resume_analysis_service: ResumeAnalysisService, mock_process_document
):
    """Test that the resume text is sanitized before processing."""
    resume_text = "<script>alert('XSS')</script>This is a sample resume."
    mock_process_document.return_value = {"skills": ["Python"]}

    await resume_analysis_service.analyze_resume(resume_text)

    # Check that the sanitize_resume_text method was called and that it removed the script tag
    assert (
        mock_process_document.call_args.kwargs["file_content"]
        == "alert('XSS')This is a sample resume."
    )


def test_resume_analysis_service_init_with_config(monkeypatch):
    """Test ResumeAnalysisService initialization with custom config."""
    monkeypatch.setattr("app.ai.resume_service.get_ai_client", lambda: AsyncMock())
    config = {
        "model": "gpt-4",
        "max_tokens": 200,
        "temperature": 0.7,
        "enabled": False,
    }
    service = ResumeAnalysisService(config)
    assert service.config["model"] == "gpt-4"
    assert service.config["max_tokens"] == 200
    assert service.config["temperature"] == 0.7
    assert not service.config["enabled"]


def test_resume_analysis_service_init_without_config(monkeypatch):
    """Test ResumeAnalysisService initialization without config."""
    monkeypatch.setattr("app.ai.resume_service.get_ai_client", lambda: AsyncMock())
    service = ResumeAnalysisService()
    assert service.config["model"] == settings.model_name
    assert service.config["max_tokens"] == settings.ai_max_tokens
    assert service.config["temperature"] == settings.ai_temperature
    assert service.config["enabled"] == settings.enable_ai_features
