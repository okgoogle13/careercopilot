"""
Tests for the document analysis service.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from typing import Any, Dict

from app.ai.document_analysis_service import (
    DocumentAnalysisService,
    ResumeAnalysisResult,
    JobDescriptionAnalysisResult,
    Education,
    Experience,
    SalaryRange,
)
from app.core.config import settings
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.prompt_service import PromptService
from app.core.genkit import get_model

# Mock Pydantic models for testing
class MockBaseModel:
    def __init__(self, **data):
        self.__dict__.update(data)

@pytest.fixture
def document_analysis_service():
    """Fixture for DocumentAnalysisService."""
    return DocumentAnalysisService()

@pytest.fixture
async def mock_prompt_service():
    """Mock PromptService."""
    mock_prompt_service = AsyncMock()
    return mock_prompt_service

@pytest.fixture
async def mock_get_model():
    """Mock get_model function."""
    mock_get_model = AsyncMock()
    return mock_get_model

@pytest.mark.asyncio
class TestDocumentAnalysisService:
    @pytest.fixture
    async def client(self, document_analysis_service, mock_prompt_service, mock_get_model):
        """Test client fixture."""
        document_analysis_service.prompt_service = mock_prompt_service
        return document_analysis_service

    @pytest.mark.asyncio
    async def test_analyze_resume_success(self, client, mock_get_model):
        """Test successful resume analysis."""
        resume_text = "Experienced software engineer..."
        target_industry = "Technology"
        mock_get_model.return_value = "mock_model"
        mock_prompt_service.format_prompt.return_value = "formatted_prompt"
        
        result = await client.analyze_resume(resume_text, target_industry)
        assert isinstance(result, ResumeAnalysisResult)
        assert result.skills is not None
        assert result.experience is not None
        assert result.education is not None

    @pytest.mark.asyncio
    async def test_analyze_resume_no_target_industry(self, client, mock_get_model):
        """Test resume analysis without target industry."""
        resume_text = "Experienced software engineer..."
        mock_get_model.return_value = "mock_model"
        mock_prompt_service.format_prompt.return_value = "formatted_prompt"

        result = await client.analyze_resume(resume_text)
        assert isinstance(result, ResumeAnalysisResult)
        assert result.skills is not None
        assert result.experience is not None
        assert result.education is not None

    @pytest.mark.asyncio
    async def test_analyze_resume_ai_error(self, client, mock_get_model):
        """Test resume analysis with AI error."""
        resume_text = "Invalid resume content"
        mock_get_model.side_effect = AIError(AIErrorType.MODEL_ERROR, "Model failed")

        with pytest.raises(AIError):
            await client.analyze_resume(resume_text)

    @pytest.mark.asyncio
    async def test_analyze_job_description_success(self, client, mock_get_model):
        """Test successful job description analysis."""
        job_description_text = "Software Engineer - Exciting opportunity..."
        mock_get_model.return_value = "mock_model"
        mock_prompt_service.format_prompt.return_value = "formatted_prompt"

        result = await client.analyze_job_description(job_description_text)
        assert isinstance(result, JobDescriptionAnalysisResult)
        assert result.title is not None
        assert result.required_skills is not None

    @pytest.mark.asyncio
    async def test_analyze_job_description_ai_error(self, client, mock_get_model):
        """Test job description analysis with AI error."""
        job_description_text = "Invalid job description"
        mock_get_model.side_effect = AIError(AIErrorType.MODEL_ERROR, "Model failed")

        with pytest.raises(AIError):
            await client.analyze_job_description(job_description_text)

    @pytest.mark.asyncio
    async def test_service_enabled_status(self, document_analysis_service):
        """Test service enabled status."""
        assert document_analysis_service.config["enabled"] == settings.enable_ai_features

    @pytest.mark.asyncio
    async def test_service_model_config(self, document_analysis_service):
        """Test service model config."""
        assert document_analysis_service.config["model"] == settings.ai_model

    @pytest.mark.asyncio
    async def test_service_max_tokens_config(self, document_analysis_service):
        """Test service max tokens config."""
        assert document_analysis_service.config["max_tokens"] == settings.ai_max_tokens

    @pytest.mark.asyncio
    async def test_service_temperature_config(self, document_analysis_service):
        """Test service temperature config."""
        assert document_analysis_service.config["temperature"] == settings.ai_temperature