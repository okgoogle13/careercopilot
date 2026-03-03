"""Unit tests for the template service."""

import asyncio
import sys
from dataclasses import dataclass, field
from enum import Enum
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

core_module = sys.modules.setdefault("app.core", ModuleType("app.core"))
core_module.__path__ = getattr(core_module, "__path__", [])
config_module = sys.modules.setdefault("app.core.config", ModuleType("app.core.config"))
config_module.get_personal_config = getattr(
    config_module, "get_personal_config", lambda: SimpleNamespace()
)
core_module.config = config_module

ai_prompt_builder_module = sys.modules.setdefault(
    "app.services.ai_prompt_builder", ModuleType("app.services.ai_prompt_builder")
)


class _PromptType(Enum):
    """Minimal prompt-type enum used by TemplateService."""

    GENERIC = "generic"


@dataclass
class _PromptContext:
    """Minimal prompt-context dataclass used by TemplateService."""

    job_context: dict | None = None
    company_context: dict | None = None
    custom_data: dict = field(default_factory=dict)


ai_prompt_builder_module.PromptType = getattr(ai_prompt_builder_module, "PromptType", _PromptType)
ai_prompt_builder_module.PromptContext = getattr(
    ai_prompt_builder_module, "PromptContext", _PromptContext
)
ai_prompt_builder_module.get_ai_prompt_builder = getattr(
    ai_prompt_builder_module,
    "get_ai_prompt_builder",
    lambda: SimpleNamespace(generate_ai_response=AsyncMock()),
)

import app.services.template_service as template_service_module
from app.services.template_service import (
    GeneratedTemplate,
    TemplateContext,
    TemplateService,
    TemplateType,
    get_template_service,
)


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


@pytest.fixture
def fake_personal_config():
    """Provide deterministic career-transition config data."""
    return SimpleNamespace(
        career_transition_from="Finance",
        career_transition_to="Community Services",
        location="Melbourne",
        target_industries=["Government", "Nonprofit"],
        target_roles=["Case Manager", "Support Worker"],
        transferable_skills=["Analysis", "Stakeholder Management"],
        personal_story={"motivation": "Community impact"},
    )


@pytest.fixture
def fake_ai_prompt_builder():
    """Provide an async AI prompt builder double."""
    return SimpleNamespace(generate_ai_response=AsyncMock())


@pytest.fixture(autouse=True)
def reset_template_service_singleton(monkeypatch):
    """Reset the module singleton between tests."""
    monkeypatch.setattr(template_service_module, "_template_service", None)


@pytest.fixture
def template_service(monkeypatch, fake_personal_config, fake_ai_prompt_builder):
    """Create a template service with patched config and AI dependencies."""
    monkeypatch.setattr(
        template_service_module,
        "get_personal_config",
        MagicMock(return_value=fake_personal_config),
    )
    monkeypatch.setattr(
        template_service_module,
        "get_ai_prompt_builder",
        MagicMock(return_value=fake_ai_prompt_builder),
    )
    return TemplateService()


def test_template_service_initializes_career_context(template_service):
    """The service should flatten config into reusable string context."""
    assert template_service.career_context == {
        "transition_from": "Finance",
        "transition_to": "Community Services",
        "location": "Melbourne",
        "target_industries": "Government, Nonprofit",
        "target_roles": "Case Manager, Support Worker",
        "transferable_skills": "Analysis, Stakeholder Management",
        "personal_motivation": "Community impact",
    }


def test_build_template_prompt_covers_remaining_template_types(template_service):
    """Prompt building should handle all remaining enum branches and fallback types."""
    interview_prompt = template_service._build_template_prompt(TemplateType.INTERVIEW_THANK_YOU)
    reference_prompt = template_service._build_template_prompt(TemplateType.REFERENCE_REQUEST)
    cover_letter_prompt = template_service._build_template_prompt(TemplateType.COVER_LETTER)
    custom_prompt = template_service._build_template_prompt(
        SimpleNamespace(value="custom_template")
    )

    assert "post-interview thank you" in interview_prompt
    assert "reference request email" in reference_prompt
    assert "cover letter template" in cover_letter_prompt
    assert "custom_template" in custom_prompt


def test_parse_template_response_parses_structured_email_json(template_service):
    """JSON AI responses should be converted into GeneratedTemplate objects."""
    result = template_service._parse_template_response(
        TemplateType.EMAIL_APPLICATION,
        '{"subject_line":"Application for [JOB_TITLE]","email_body":"Dear [CONTACT_NAME]","placeholders":{"[JOB_TITLE]":"Job title"},"customization_tips":["Tailor this"]}',
        None,
    )

    assert result.subject_line == "Application for [JOB_TITLE]"
    assert result.content == "Dear [CONTACT_NAME]"
    assert result.placeholders == {"[JOB_TITLE]": "Job title"}
    assert result.customization_tips == ["Tailor this"]


def test_parse_template_response_uses_raw_content_for_non_json(template_service):
    """Non-JSON AI responses should still produce a usable template."""
    result = template_service._parse_template_response(
        TemplateType.COVER_LETTER,
        "Dear [COMPANY_NAME], I am applying for [JOB_TITLE].",
        None,
    )

    assert result.content == "Dear [COMPANY_NAME], I am applying for [JOB_TITLE]."
    assert result.placeholders == {
        "[COMPANY_NAME]": "Company name",
        "[JOB_TITLE]": "Job title or role",
    }
    assert result.customization_tips == [
        "Customize with specific details about the role and company"
    ]


def test_parse_template_response_parses_cover_letter_json(template_service):
    """Cover letter JSON should read from cover_letter_content."""
    result = template_service._parse_template_response(
        TemplateType.COVER_LETTER,
        '{"cover_letter_content":"Letter body","placeholders":{"[COMPANY_NAME]":"Company name"}}',
        None,
    )

    assert result.content == "Letter body"
    assert result.subject_line is None
    assert result.placeholders == {"[COMPANY_NAME]": "Company name"}


def test_parse_template_response_uses_generic_content_branch(template_service):
    """Non-email, non-cover-letter templates should use the generic content field."""
    custom_type = SimpleNamespace(value="custom_template")
    result = template_service._parse_template_response(
        custom_type,
        '{"content":"Custom body","subject_line":"Custom subject"}',
        None,
    )

    assert result.content == "Custom body"
    assert result.subject_line == "Custom subject"


def test_parse_template_response_returns_safe_fallback_on_parse_error(template_service):
    """Malformed JSON should fall back to review guidance."""
    result = template_service._parse_template_response(
        TemplateType.EMAIL_APPLICATION,
        '{"email_body":"broken"',
        None,
    )

    assert result.content == '{"email_body":"broken"'
    assert result.placeholders == {}
    assert result.customization_tips == ["Review and customize before using"]


def test_extract_placeholders_maps_known_and_unknown_tokens(template_service):
    """Placeholder detection should produce human-readable descriptions."""
    placeholders = template_service._extract_placeholders(
        "[COMPANY_NAME] [JOB_TITLE] [CONTACT_NAME] [SPECIFIC_SKILL] [CUSTOM_FIELD]"
    )

    assert placeholders == {
        "[COMPANY_NAME]": "Company name",
        "[JOB_TITLE]": "Job title or role",
        "[CONTACT_NAME]": "Contact person's name",
        "[SPECIFIC_SKILL]": "Relevant skill or experience",
        "[CUSTOM_FIELD]": "Customize custom field",
    }


def test_generate_template_returns_parsed_ai_response(template_service, fake_ai_prompt_builder):
    """Successful AI output should be parsed and returned."""
    fake_ai_prompt_builder.generate_ai_response.return_value = (
        '{"subject_line":"Application","email_body":"Hello there","placeholders":{},'
        '"customization_tips":["Tip"]}'
    )
    context = TemplateContext(
        company_name="Community First",
        job_title="Case Manager",
        job_description="Support people in the community",
        contact_name="Alex",
        personal_notes="Mention lived experience",
        custom_data={"tone": "warm"},
    )

    result = asyncio.run(
        template_service.generate_template(TemplateType.EMAIL_APPLICATION, context)
    )

    assert result.subject_line == "Application"
    assert result.content == "Hello there"
    call = fake_ai_prompt_builder.generate_ai_response.await_args
    assert call.args[0] is template_service_module.PromptType.GENERIC
    assert "Community Services" in call.args[1]
    prompt_context = call.args[2]
    assert prompt_context.job_context == {
        "title": "Case Manager",
        "company": "Community First",
        "description": "Support people in the community",
    }
    assert prompt_context.custom_data["template_type"] == "email_application"
    assert prompt_context.custom_data["contact_name"] == "Alex"
    assert prompt_context.custom_data["tone"] == "warm"


def test_generate_template_uses_fallback_for_generic_ai_marker(
    template_service, fake_ai_prompt_builder
):
    """Generic bridge fallback text should route into the local fallback templates."""
    expected = GeneratedTemplate(template_type=TemplateType.NETWORKING_EMAIL, content="fallback")
    fake_ai_prompt_builder.generate_ai_response.return_value = "Enhanced AI response for generic"
    template_service._generate_fallback_template = MagicMock(return_value=expected)

    result = asyncio.run(template_service.generate_template(TemplateType.NETWORKING_EMAIL))

    assert result is expected
    template_service._generate_fallback_template.assert_called_once_with(
        TemplateType.NETWORKING_EMAIL, None
    )


def test_generate_template_uses_fallback_when_ai_raises(template_service, fake_ai_prompt_builder):
    """AI failures should fall back to local templates instead of propagating errors."""
    expected = GeneratedTemplate(template_type=TemplateType.FOLLOW_UP_EMAIL, content="fallback")
    fake_ai_prompt_builder.generate_ai_response.side_effect = RuntimeError("service offline")
    template_service._generate_fallback_template = MagicMock(return_value=expected)

    result = asyncio.run(template_service.generate_template(TemplateType.FOLLOW_UP_EMAIL))

    assert result is expected


def test_generate_template_uses_fallback_when_prompt_building_fails(template_service):
    """Top-level prompt-building failures should also fall back safely."""
    expected = GeneratedTemplate(template_type=TemplateType.COVER_LETTER, content="fallback")
    template_service._build_template_prompt = MagicMock(side_effect=RuntimeError("bad prompt"))
    template_service._generate_fallback_template = MagicMock(return_value=expected)

    result = asyncio.run(template_service.generate_template(TemplateType.COVER_LETTER))

    assert result is expected


def test_generate_fallback_template_builds_placeholders(template_service):
    """Fallback templates should still expose placeholders for customization."""
    result = template_service._generate_fallback_template(TemplateType.COVER_LETTER, None)

    assert "[JOB_TITLE]" in result.content
    assert result.placeholders["[COMPANY_NAME]"] == "Company name"
    assert result.customization_tips


def test_generate_application_materials_returns_all_core_templates(template_service):
    """The helper should assemble the standard application pack."""
    generated = GeneratedTemplate(template_type=TemplateType.EMAIL_APPLICATION, content="content")
    template_service.generate_template = AsyncMock(return_value=generated)

    result = asyncio.run(
        template_service.generate_application_materials(
            job_title="Case Manager",
            company_name="Community First",
            job_description="Support people",
        )
    )

    assert result == {
        "email_application": generated,
        "cover_letter": generated,
        "follow_up_email": generated,
        "interview_thank_you": generated,
    }
    assert template_service.generate_template.await_count == 4


def test_generate_application_materials_returns_empty_dict_on_failure(template_service):
    """Unexpected errors should degrade to an empty response payload."""
    template_service.generate_template = AsyncMock(side_effect=RuntimeError("boom"))

    assert (
        asyncio.run(
            template_service.generate_application_materials(
                job_title="Case Manager",
                company_name="Community First",
            )
        )
        == {}
    )


def test_get_template_service_returns_singleton(monkeypatch):
    """The accessor should cache the service instance."""
    instance = MagicMock(spec=TemplateService)
    factory = MagicMock(return_value=instance)
    monkeypatch.setattr(template_service_module, "_template_service", None)
    monkeypatch.setattr(template_service_module, "TemplateService", factory)

    first = get_template_service()
    second = get_template_service()

    assert first is instance
    assert second is instance
    factory.assert_called_once()
