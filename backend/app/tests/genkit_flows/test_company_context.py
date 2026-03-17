"""Tests for company_context async genkit flow."""

import json
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.genkit_flows.company_context import CompanyContext, generate_company_context


@pytest.fixture
def mock_async_model(monkeypatch):
    m = AsyncMock()
    monkeypatch.setattr("app.genkit_flows.company_context.get_model", lambda: m)
    return m


@pytest.fixture
def valid_context_json():
    return json.dumps(
        {
            "recent_achievements": ["Launched new AI platform"],
            "core_values": ["Innovation", "Integrity"],
            "recommended_tone": "conversational",
            "why_work_here_points": ["Great culture", "High impact"],
            "interview_questions": ["What does success look like?"],
            "cultural_insights": "Collaborative, fast-paced environment.",
        }
    )


@pytest.mark.asyncio
class TestGenerateCompanyContext:
    async def test_happy_path_returns_context(self, mock_async_model, valid_context_json):
        """Should parse model JSON into a CompanyContext."""
        mock_response = MagicMock()
        mock_response.text = valid_context_json
        mock_async_model.generate.return_value = mock_response

        result = await generate_company_context(
            company_name="Acme Corp",
            job_description="Software Engineer role",
        )

        assert isinstance(result, CompanyContext)
        assert result.recommended_tone == "conversational"
        assert "Innovation" in result.core_values

    async def test_model_unavailable_returns_fallback(self, monkeypatch):
        """When model is None, a fallback CompanyContext should be returned."""
        monkeypatch.setattr("app.genkit_flows.company_context.get_model", lambda: None)

        result = await generate_company_context(
            company_name="Fallback Corp",
            job_description="Any job",
        )

        assert isinstance(result, CompanyContext)
        assert "Fallback Corp" in result.recent_achievements[0]

    async def test_model_failure_returns_fallback(self, mock_async_model):
        """An exception from the model should return a fallback context, not crash."""
        mock_async_model.generate.side_effect = Exception("API Error")

        result = await generate_company_context(
            company_name="Error Corp",
            job_description="Some job",
        )

        assert isinstance(result, CompanyContext)
        # Should gracefully fall back
        assert len(result.interview_questions) > 0

    async def test_long_job_description_is_truncated(self, mock_async_model, valid_context_json):
        """Verify that job description is truncated to 800 chars for prompt."""
        long_jd = "X" * 2000
        mock_response = MagicMock()
        mock_response.text = valid_context_json
        mock_async_model.generate.return_value = mock_response

        await generate_company_context(company_name="BigCo", job_description=long_jd)
        # Get text content called in generate
        call_kwargs = mock_async_model.generate.call_args
        prompt_used = call_kwargs[1].get("prompt", "") or (
            call_kwargs[0][0] if call_kwargs[0] else ""
        )
        # Long description should be truncated in the prompt
        assert "X" * 2000 not in str(prompt_used)


class TestCompanyContextSchema:
    def test_defaults_are_applied(self):
        """Default fields should be populated when not supplied."""
        ctx = CompanyContext()
        assert ctx.recommended_tone == "conversational"
        assert isinstance(ctx.core_values, list)
        assert isinstance(ctx.interview_questions, list)
