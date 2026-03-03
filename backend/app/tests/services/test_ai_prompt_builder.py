"""Unit tests for the AI prompt builder service."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

import app.services.ai_prompt_builder as ai_prompt_builder_module
from app.services.ai_prompt_builder import (
    AIPromptBuilder,
    PromptContext,
    PromptType,
    get_ai_prompt_builder,
)


@pytest.fixture
def fake_personal_config():
    """Provide a lightweight config object for predictable context generation."""
    return SimpleNamespace(
        career_transition_from="Finance",
        career_transition_to="Community Services",
        location="Melbourne",
        target_industries=["Government", "Nonprofit"],
        target_roles=["Case Manager", "Support Worker"],
        transferable_skills=["Analysis", "Stakeholder Management"],
        personal_story={"motivation": "Community impact"},
    )


def test_builder_initializes_career_context(monkeypatch, fake_personal_config):
    """The builder should flatten the personal config into prompt-safe strings."""
    monkeypatch.setattr(ai_prompt_builder_module, "get_personal_config", MagicMock(return_value=fake_personal_config))
    monkeypatch.setattr(ai_prompt_builder_module, "get_personal_cache", MagicMock(return_value="cache"))

    builder = AIPromptBuilder()

    assert builder.cache == "cache"
    assert builder.career_context == {
        "transition_from": "Finance",
        "transition_to": "Community Services",
        "location": "Melbourne",
        "target_industries": "Government, Nonprofit",
        "target_roles": "Case Manager, Support Worker",
        "transferable_skills": "Analysis, Stakeholder Management",
        "personal_motivation": "Community impact",
    }


@pytest.mark.asyncio
async def test_generate_ai_response_builds_request_with_optional_context(monkeypatch, fake_personal_config):
    """The generated Genkit request should include all supported context layers."""
    monkeypatch.setattr(ai_prompt_builder_module, "get_personal_config", MagicMock(return_value=fake_personal_config))
    monkeypatch.setattr(ai_prompt_builder_module, "get_personal_cache", MagicMock(return_value="cache"))
    flow = AsyncMock(return_value=SimpleNamespace(content="Generated response"))
    monkeypatch.setattr(ai_prompt_builder_module, "careerIntelligenceFlow", flow)
    builder = AIPromptBuilder()

    response = await builder.generate_ai_response(
        prompt_type=PromptType.INTERVIEW_PREP,
        task_prompt="Prepare me for a panel interview",
        context=PromptContext(
            job_context={"title": "Case Manager"},
            company_context={"name": "Community First"},
            custom_data={"tone": "direct"},
        ),
    )

    assert response == "Generated response"
    request = flow.await_args.args[0]
    assert request.prompt_type == "interview_prep"
    assert request.task_prompt == "Prepare me for a panel interview"
    assert request.user_id == "personal_user"
    assert request.context_data["career_context"]["transition_to"] == "Community Services"
    assert request.context_data["job_context"] == {"title": "Case Manager"}
    assert request.context_data["company_context"] == {"name": "Community First"}
    assert request.context_data["custom_data"] == {"tone": "direct"}


@pytest.mark.asyncio
async def test_generate_ai_response_returns_error_string_on_failure(monkeypatch, fake_personal_config):
    """Unexpected Genkit failures should be surfaced as a stable error string."""
    monkeypatch.setattr(ai_prompt_builder_module, "get_personal_config", MagicMock(return_value=fake_personal_config))
    monkeypatch.setattr(ai_prompt_builder_module, "get_personal_cache", MagicMock(return_value="cache"))
    monkeypatch.setattr(
        ai_prompt_builder_module,
        "careerIntelligenceFlow",
        AsyncMock(side_effect=RuntimeError("flow unavailable")),
    )
    builder = AIPromptBuilder()

    response = await builder.generate_ai_response(
        prompt_type=PromptType.GENERIC,
        task_prompt="Summarize this role",
    )

    assert response == "Error generating AI response: flow unavailable"


def test_get_ai_prompt_builder_returns_singleton(monkeypatch):
    """The module-level accessor should reuse one builder instance."""
    instance = MagicMock(spec=AIPromptBuilder)

    monkeypatch.setattr(ai_prompt_builder_module, "_ai_prompt_builder", None)
    monkeypatch.setattr(ai_prompt_builder_module, "AIPromptBuilder", MagicMock(return_value=instance))

    first = get_ai_prompt_builder()
    second = get_ai_prompt_builder()

    assert first is instance
    assert second is instance
    ai_prompt_builder_module.AIPromptBuilder.assert_called_once()

