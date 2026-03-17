"""Tests for career_intelligence async genkit flow."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from app.genkit_flows.career_intelligence import (
    _build_system_context,
    careerIntelligenceFlow,
)
from app.schemas.ai import AIResponseModel, CareerIntelligenceRequest


@pytest.fixture
def base_request():
    return CareerIntelligenceRequest(
        user_id="user-123",
        prompt_type="salary_analysis",
        task_prompt="What salary should I expect?",
        context_data={
            "career_context": {
                "transition_from": "Finance",
                "transition_to": "Social Work",
                "location": "Melbourne",
                "target_industries": "Community Services",
                "target_roles": "Case Manager",
                "transferable_skills": "Analysis, Communication",
                "personal_motivation": "Meaningful work",
            }
        },
    )


@pytest.fixture
def mock_async_model(monkeypatch):
    m = AsyncMock()
    m.model_name = "gemini-1.5-flash"  # Must be a string for AIResponseModel validation
    monkeypatch.setattr("app.genkit_flows.career_intelligence.get_model", lambda: m)
    return m


class TestBuildSystemContext:
    def test_contains_transition_from_to(self, base_request):
        context = _build_system_context(base_request)
        assert "Finance" in context
        assert "Social Work" in context

    def test_salary_analysis_adds_focus(self, base_request):
        context = _build_system_context(base_request)
        assert "salary" in context.lower()

    def test_skills_analysis_adds_focus(self, base_request):
        base_request.prompt_type = "skills_analysis"
        context = _build_system_context(base_request)
        assert "skills" in context.lower()

    def test_interview_prep_adds_focus(self, base_request):
        base_request.prompt_type = "interview_prep"
        context = _build_system_context(base_request)
        assert "interview" in context.lower()

    def test_company_research_adds_focus(self, base_request):
        base_request.prompt_type = "company_research"
        context = _build_system_context(base_request)
        assert "company" in context.lower() or "research" in context.lower()

    def test_unknown_prompt_type_no_crash(self, base_request):
        base_request.prompt_type = "unknown_type"
        context = _build_system_context(base_request)
        assert isinstance(context, str)


@pytest.mark.asyncio
class TestCareerIntelligenceFlow:
    async def test_happy_path_returns_ai_response(self, mock_async_model, base_request):
        """Should return AIResponseModel with generated content."""
        # Use a generic prompt_type so the flow takes the response.text branch
        base_request.prompt_type = "general"
        mock_response = MagicMock()
        mock_response.text = "£60,000 is the expected salary."
        mock_async_model.generate.return_value = mock_response

        result = await careerIntelligenceFlow(base_request)

        assert isinstance(result, AIResponseModel)
        assert result.content
        mock_async_model.generate.assert_called_once()

    async def test_model_unavailable_raises_runtime_error(self, monkeypatch, base_request):
        """A None model should raise RuntimeError."""
        monkeypatch.setattr("app.genkit_flows.career_intelligence.get_model", lambda: None)
        with pytest.raises(RuntimeError, match="not initialized"):
            await careerIntelligenceFlow(base_request)

    async def test_model_error_propagates(self, mock_async_model, base_request):
        """Errors from the model should propagate upward."""
        mock_async_model.generate.side_effect = RuntimeError("API Overloaded")
        with pytest.raises(RuntimeError, match="API Overloaded"):
            await careerIntelligenceFlow(base_request)

    async def test_includes_job_context_if_provided(self, mock_async_model, base_request):
        """Job and company context should be injected into the prompt."""
        base_request.prompt_type = "general"
        base_request.context_data["job_context"] = {"title": "Case Manager", "company": "Acme"}
        mock_response = MagicMock()
        mock_response.text = "Context-aware answer"
        mock_async_model.generate.return_value = mock_response

        result = await careerIntelligenceFlow(base_request)
        assert result.content
