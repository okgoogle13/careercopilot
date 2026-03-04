"""Focused tests for the smart ingestion Genkit flows."""

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.genkit_flows import smart_ingestion as module
from app.models.asset_library_schema import VoiceProfile
from app.models.ingestion_schemas import SuggestedTags
from app.models.master_profile_schema import KeySelectionCriteriaExample, MasterCareerProfile


def _master_profile():
    return MasterCareerProfile(
        personalInfo={
            "name": "John Doe",
            "email": "john@example.com",
            "summary": "Experienced engineer focused on backend systems.",
        },
        skills={
            "technical": ["Python"],
            "tools": ["FastAPI"],
            "soft": ["Communication"],
            "methodologies": ["Agile"],
        },
    )


@pytest.mark.asyncio
async def test_generate_with_model_returns_success_payload(monkeypatch):
    """The helper should unwrap successful handler results."""
    monkeypatch.setattr(module, "get_model", lambda: object())
    execute = AsyncMock(return_value=SimpleNamespace(success=True, data="Success", error=None))
    monkeypatch.setattr(module.enhanced_ai_handler, "execute_ai_operation", execute)

    result = await module._generate_with_model(
        prompt="Prompt",
        output_schema=SuggestedTags,
        operation_name="context_tagger",
    )

    assert result == "Success"
    execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_generate_with_model_requires_model(monkeypatch):
    """Missing models should fail fast."""
    monkeypatch.setattr(module, "get_model", lambda: None)

    with pytest.raises(RuntimeError, match="Genkit model not available"):
        await module._generate_with_model(
            prompt="Prompt",
            output_schema=SuggestedTags,
            operation_name="context_tagger",
        )


@pytest.mark.asyncio
async def test_generate_with_model_raises_on_failed_operation(monkeypatch):
    """Failed handler results should be converted to RuntimeError."""
    monkeypatch.setattr(module, "get_model", lambda: object())
    monkeypatch.setattr(
        module.enhanced_ai_handler,
        "execute_ai_operation",
        AsyncMock(
            return_value=SimpleNamespace(
                success=False,
                data=None,
                error=SimpleNamespace(message="model failed"),
            )
        ),
    )

    with pytest.raises(RuntimeError, match="model failed"):
        await module._generate_with_model(
            prompt="Prompt",
            output_schema=SuggestedTags,
            operation_name="context_tagger",
        )


@pytest.mark.asyncio
async def test_context_tagger_flow_returns_suggested_tags(monkeypatch):
    """The wrapper flow should pass through suggested tags."""
    expected = SuggestedTags(
        roleType="Software Engineer",
        subsectors=["Technology", "AI"],
        confidence=0.95,
    )
    monkeypatch.setattr(module, "_generate_with_model", AsyncMock(return_value=expected))

    result = await module.contextTaggerFlow("Resume text", user_id="user-1")

    assert result == expected


@pytest.mark.asyncio
async def test_resume_extractor_flow_returns_master_profile(monkeypatch):
    """The resume extractor should return the generated profile."""
    expected = _master_profile()
    monkeypatch.setattr(module, "_generate_with_model", AsyncMock(return_value=expected))

    result = await module.resumeExtractorFlow(
        resumeText="Resume text",
        confirmedTags={"roleType": "Engineer", "subsectors": ["Technology"]},
        user_id="user-1",
    )

    assert result == expected
    assert result.personalInfo.name == "John Doe"


@pytest.mark.asyncio
async def test_ksc_extractor_flow_returns_examples(monkeypatch):
    """The KSC extractor should return the wrapped extraction result."""
    expected = module.KSCExtractionResult(
        examples=[
            KeySelectionCriteriaExample(
                criteria="Demonstrate teamwork",
                example="I led a cross-functional project.",
                relatedSkills=["Teamwork", "Leadership"],
            )
        ]
    )
    monkeypatch.setattr(module, "_generate_with_model", AsyncMock(return_value=expected))

    result = await module.kscExtractorFlow(
        kscText="KSC text",
        confirmedTags={"roleType": "Engineer"},
        user_id="user-1",
    )

    assert result == expected
    assert result.examples[0].criteria == "Demonstrate teamwork"


@pytest.mark.asyncio
async def test_voice_profile_extractor_flow_returns_profile(monkeypatch):
    """The voice-profile flow should return the generated profile."""
    expected = VoiceProfile(
        tone="Professional",
        style="Concise and direct",
        vocabularyLevel="Advanced",
    )
    monkeypatch.setattr(module, "_generate_with_model", AsyncMock(return_value=expected))

    result = await module.voiceProfileExtractorFlow(
        writingSample="Writing sample",
        confirmedTags={"roleType": "Engineer"},
        user_id="user-1",
    )

    assert result == expected
    assert result.vocabularyLevel == "Advanced"
