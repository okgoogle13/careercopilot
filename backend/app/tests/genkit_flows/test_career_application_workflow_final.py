from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.genkit_flows import career_application_workflow as flow
from app.genkit_flows.ksc_generator import STAR_Response


def test_get_generation_model_raises_when_missing(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        flow, "get_ai_config", lambda: SimpleNamespace(get_model_config=lambda _m: None)
    )
    with pytest.raises(RuntimeError, match="Model configuration not available"):
        flow._get_generation_model()


@pytest.mark.asyncio
async def test_generate_application_package_collects_step_errors(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        flow,
        "InputSanitizer",
        SimpleNamespace(
            sanitize_text_input=lambda text: SimpleNamespace(sanitized_content=text),
            sanitize_dict_input=lambda d: d,
        ),
    )

    resume_analysis = SimpleNamespace(overall_score=70, dict=lambda: {"overall_score": 70})
    resume_report = SimpleNamespace(resume_analysis=resume_analysis)

    monkeypatch.setattr(
        flow, "generate_resume_intelligence_report", AsyncMock(return_value=resume_report)
    )
    monkeypatch.setattr(
        flow,
        "research_company_for_application",
        AsyncMock(side_effect=RuntimeError("research fail")),
    )
    monkeypatch.setattr(
        flow, "_generate_tailored_resume", AsyncMock(side_effect=RuntimeError("tailor fail"))
    )
    monkeypatch.setattr(
        flow, "generate_smart_cover_letter", AsyncMock(side_effect=RuntimeError("cover fail"))
    )
    monkeypatch.setattr(
        flow, "_detect_ksc_criteria", lambda _jd: ["criterion one long enough to pass threshold"]
    )
    monkeypatch.setattr(
        flow, "_generate_ksc_responses", AsyncMock(side_effect=RuntimeError("ksc fail"))
    )
    monkeypatch.setattr(
        flow,
        "_generate_application_strategy",
        lambda *_a, **_k: (_ for _ in ()).throw(RuntimeError("strategy fail")),
    )

    result = await flow.generate_application_package(
        "Company: Acme\nRole: Engineer\nselection criteria\n1. a very long criterion text here",
        {
            "profile_summary": "Summary",
            "experience": ["X"],
            "skills": ["Y"],
            "target_industry": "Tech",
        },
    )

    assert result.success is False
    assert any("Company research failed" in e for e in result.error_details)
    assert any("Resume tailoring failed" in e for e in result.error_details)
    assert any("Cover letter generation failed" in e for e in result.error_details)
    assert any("KSC generation failed" in e for e in result.error_details)
    assert any("Strategy generation failed" in e for e in result.error_details)


@pytest.mark.asyncio
async def test_generate_application_package_with_ksc_success(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        flow,
        "InputSanitizer",
        SimpleNamespace(
            sanitize_text_input=lambda text: SimpleNamespace(sanitized_content=text),
            sanitize_dict_input=lambda d: d,
        ),
    )

    resume_analysis = SimpleNamespace(overall_score=80, dict=lambda: {"overall_score": 80})
    resume_report = SimpleNamespace(resume_analysis=resume_analysis)
    cover_analysis = SimpleNamespace(compelling_score=85, personalization_score=90, dict=lambda: {})
    cover = SimpleNamespace(analysis=cover_analysis)

    monkeypatch.setattr(
        flow, "generate_resume_intelligence_report", AsyncMock(return_value=resume_report)
    )
    monkeypatch.setattr(
        flow,
        "research_company_for_application",
        AsyncMock(return_value=SimpleNamespace(dict=lambda: {})),
    )
    monkeypatch.setattr(
        flow,
        "_generate_tailored_resume",
        AsyncMock(
            return_value=flow.TailoredResumeResult(
                tailored_content="x",
                original_score=80,
                tailored_score=90,
                improvements_made=[],
                keyword_matches=[],
                competitive_advantages=[],
            )
        ),
    )
    monkeypatch.setattr(flow, "generate_smart_cover_letter", AsyncMock(return_value=cover))
    monkeypatch.setattr(
        flow,
        "_detect_ksc_criteria",
        lambda _jd: ["criterion a long enough statement for extraction"],
    )
    monkeypatch.setattr(
        flow,
        "_generate_ksc_responses",
        AsyncMock(
            return_value=flow.KSCResponsesResult(
                generated_responses=[
                    {"criterion": STAR_Response(situation="s", task="t", action="a", result="r")}
                ],
                total_criteria_addressed=1,
                coverage_completeness="full",
                response_quality_score=90,
            )
        ),
    )

    result = await flow.generate_application_package(
        "Company: Acme\nRole: Engineer\nkey selection criteria\n1. criterion",
        {"resume_content": "resume content long enough", "target_industry": "Tech"},
    )

    assert "ksc_responses" in result.components_generated
    assert result.success is True


@pytest.mark.asyncio
async def test_generate_ksc_responses_partial_and_minimal(monkeypatch: pytest.MonkeyPatch) -> None:
    async def maybe_fail(user_profile_data, ksc_statement):
        if "fail" in ksc_statement:
            raise RuntimeError("nope")
        return STAR_Response(situation="s", task="t", action="a", result="r")

    monkeypatch.setattr(flow, "generateKscResponse", maybe_fail)

    partial = await flow._generate_ksc_responses(["ok criterion 1", "fail criterion 2"], {"x": 1})
    assert partial.coverage_completeness == "partial"

    minimal = await flow._generate_ksc_responses(["fail criterion"], {"x": 1})
    assert minimal.coverage_completeness == "minimal"


def test_generate_application_strategy_strength_bands() -> None:
    result = flow.ApplicationPackageResult(
        success=False,
        job_match_score=0,
        application_strength="weak",
        competitive_positioning=[],
        success_probability=0,
        application_strategy=[],
        interview_prep_focus=[],
        follow_up_recommendations=[],
        generation_timestamp="now",
        processing_time_seconds=0.1,
        components_generated=[],
    )

    # Force low score path
    result.resume_intelligence = None
    result.cover_letter = None
    result.tailored_resume = None
    result.ksc_responses = None
    flow._generate_application_strategy(result, "desc")
    assert result.application_strength == "fair" or result.application_strength == "weak"

    # Force strong path with full ksc bonus branch
    result.resume_intelligence = SimpleNamespace(resume_analysis=SimpleNamespace(overall_score=95))
    result.cover_letter = SimpleNamespace(
        analysis=SimpleNamespace(compelling_score=95, personalization_score=95)
    )
    result.tailored_resume = SimpleNamespace(tailored_score=95)
    result.ksc_responses = SimpleNamespace(response_quality_score=95, coverage_completeness="full")
    flow._generate_application_strategy(result, "desc")
    assert result.application_strength in {"strong", "excellent"}
    assert result.success_probability <= 95


def test_extract_helpers_and_detect_ksc_criteria() -> None:
    assert flow._extract_company_name("Company: Atlassian\nRole: Developer") == "Atlassian"
    assert flow._extract_company_name("No company line") is None

    assert flow._extract_job_role("Role: Principal Engineer") == "Principal Engineer"
    assert flow._extract_job_role("Nothing") == "Professional Role"

    jd = """Key selection criteria
1. Demonstrated experience in cross-functional stakeholder management and delivery.
2. Ability to write clear technical documents and maintain standards.
desirable
- ignored
"""
    criteria = flow._detect_ksc_criteria(jd)
    assert len(criteria) == 2
