"""
Comprehensive tests for the Template Service.
"""

import json
from datetime import datetime
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.core.config import get_personal_config
from app.models.user import User
from app.services.ai_prompt_builder import PromptContext, PromptType, get_ai_prompt_builder
from app.services.template_service import (
    GeneratedTemplate,
    TemplateContext,
    TemplateService,
    TemplateType,
)


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""

    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    from app.core import dependencies

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def template_service(mock_current_user):
    """Fixture for the TemplateService."""
    return TemplateService()


@pytest.fixture
async def mock_ai_prompt_builder():
    """Mock the AI prompt builder."""
    mock_builder = AsyncMock()
    return mock_builder


@pytest.fixture(autouse=True)
def mock_get_ai_prompt_builder(mock_ai_prompt_builder):
    """Mock the get_ai_prompt_builder function."""
    with patch("app.services.template_service.get_ai_prompt_builder") as mock:
        mock.return_value = mock_ai_prompt_builder
        yield


@pytest.mark.asyncio
class TestTemplateService:
    """Tests for the TemplateService class."""

    async def test_generate_template_cover_letter_happy_path(
        template_service, mock_ai_prompt_builder
    ):
        """Test generating a cover letter with valid context."""
        context = TemplateContext(company_name="Acme Corp", job_title="Software Engineer")
        mock_ai_prompt_builder.generate_ai_response.return_value = (
            "This is a generated cover letter."
        )

        template = await template_service.generate_template(TemplateType.COVER_LETTER, context)

        assert isinstance(template, GeneratedTemplate)
        assert template.template_type == TemplateType.COVER_LETTER
        assert "generated cover letter" in template.content
        assert template.generated_at is not None
        mock_ai_prompt_builder.generate_ai_response.assert_called_once()

    async def test_generate_template_email_application_no_context(
        template_service, mock_ai_prompt_builder
    ):
        """Test generating an email application with no context."""
        mock_ai_prompt_builder.generate_ai_response.return_value = (
            "This is a generated email application."
        )

        template = await template_service.generate_template(TemplateType.EMAIL_APPLICATION)

        assert isinstance(template, GeneratedTemplate)
        assert template.template_type == TemplateType.EMAIL_APPLICATION
        assert "generated email application" in template.content
        assert template.generated_at is not None
        mock_ai_prompt_builder.generate_ai_response.assert_called_once()

    async def test_generate_template_fallback(template_service, mock_ai_prompt_builder):
        """Test generating a template that falls back to enhanced templates."""
        mock_ai_prompt_builder.generate_ai_response.return_value = (
            "Enhanced AI response for generic"
        )

        template = await template_service.generate_template(TemplateType.FOLLOW_UP_EMAIL)

        assert isinstance(template, GeneratedTemplate)
        assert template.template_type == TemplateType.FOLLOW_UP_EMAIL
        assert template.content is not None
        assert template.generated_at is not None

    async def test_generate_template_ai_error(template_service, mock_ai_prompt_builder):
        """Test generating a template when the AI generation fails."""
        mock_ai_prompt_builder.generate_ai_response.side_effect = Exception("AI generation failed")

        with pytest.raises(Exception) as excinfo:
            await template_service.generate_template(TemplateType.COVER_LETTER)

        assert "AI generation failed" in str(excinfo.value)

    def test_template_service_initialization(template_service):
        """Test that the TemplateService initializes correctly."""
        assert template_service.config is not None
        assert template_service.ai_prompt_builder is not None
        assert template_service.career_context is not None

    async def test_generate_template_with_custom_data(template_service, mock_ai_prompt_builder):
        """Test generating a template with custom data."""
        context = TemplateContext(custom_data={"key1": "value1", "key2": "value2"})
        mock_ai_prompt_builder.generate_ai_response.return_value = (
            "This is a generated template with custom data."
        )

        template = await template_service.generate_template(TemplateType.COVER_LETTER, context)

        assert template.template_type == TemplateType.COVER_LETTER
        assert "generated template with custom data" in template.content
        assert template.custom_data == {"key1": "value1", "key2": "value2"}

    async def test_generate_template_with_company_research(
        template_service, mock_ai_prompt_builder
    ):
        """Test generating a template with company research."""
        context = TemplateContext(company_research={"industry": "Tech", "size": "Large"})
        mock_ai_prompt_builder.generate_ai_response.return_value = (
            "This is a generated template with company research."
        )

        template = await template_service.generate_template(TemplateType.COVER_LETTER, context)

        assert template.template_type == TemplateType.COVER_LETTER
        assert "generated template with company research" in template.content
        assert template.company_research == {"industry": "Tech", "size": "Large"}

    async def test_generate_template_with_personal_notes(template_service, mock_ai_prompt_builder):
        """Test generating a template with personal notes."""
        context = TemplateContext(personal_notes="Important note about the company.")
        mock_ai_prompt_builder.generate_ai_response.return_value = (
            "This is a generated template with personal notes."
        )

        template = await template_service.generate_template(TemplateType.COVER_LETTER, context)

        assert template.template_type == TemplateType.COVER_LETTER
        assert "generated template with personal notes" in template.content
        assert template.personal_notes == "Important note about the company."
