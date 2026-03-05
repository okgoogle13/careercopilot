"""Supplemental tests for career_intelligence flow behavior."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from app.genkit_flows import career_intelligence as module
from app.schemas.ai import CareerIntelligenceRequest


def _request(prompt_type: str) -> CareerIntelligenceRequest:
    return CareerIntelligenceRequest(
        user_id="user-1",
        prompt_type=prompt_type,
        task_prompt="Analyze opportunities",
        context_data={
            "career_context": {
                "transition_from": "Finance",
                "transition_to": "Social Work",
                "location": "Melbourne",
                "target_industries": ["Community Services"],
                "target_roles": ["Case Manager"],
                "transferable_skills": ["Stakeholder Management"],
                "personal_motivation": "Community impact",
            }
        },
    )


def test_build_system_context_includes_focus_for_salary_analysis():
    text = module._build_system_context(_request("salary_analysis"))
    assert "FOCUS: Provide accurate salary research" in text
    assert "move from Finance to Social Work" in text


def test_build_system_context_includes_focus_for_interview_prep():
    text = module._build_system_context(_request("interview_prep"))
    assert "FOCUS: Generate interview questions and STAR method answers." in text


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "prompt_type, expected_schema_name",
    [
        ("skills_analysis", "SkillsAnalysisResponse"),
        ("interview_prep", "InterviewPrepResponse"),
        ("company_research", "CompanyResearchResponse"),
    ],
)
async def test_flow_uses_expected_output_schema_for_prompt_type(
    monkeypatch, prompt_type, expected_schema_name
):
    req = _request(prompt_type)
    req.context_data["job_context"] = {"title": "Case Manager"}
    req.context_data["company_context"] = {"name": "Community Org"}
    req.context_data["custom_data"] = {"market_focus": "VIC"}

    model = AsyncMock()
    model.model_name = "gemini-test"
    model.generate.return_value = MagicMock(
        output=MagicMock(return_value=MagicMock(model_dump=MagicMock(return_value={"ok": True})))
    )
    monkeypatch.setattr(module, "get_model", lambda: model)

    result = await module.careerIntelligenceFlow(req)

    assert result.metadata["prompt_type"] == prompt_type
    call = model.generate.await_args
    assert call.kwargs["output_schema"].__name__ == expected_schema_name
    assert "CURRENT JOB CONTEXT" in call.kwargs["prompt"]
    assert "COMPANY CONTEXT" in call.kwargs["prompt"]
    assert "ADDITIONAL DATA" in call.kwargs["prompt"]


@pytest.mark.asyncio
async def test_flow_falls_back_to_string_when_response_has_no_text(monkeypatch):
    req = _request("general")

    class ResponseWithoutText:
        def __str__(self):
            return "stringified-response"

    model = AsyncMock()
    model.model_name = "gemini-test"
    model.generate.return_value = ResponseWithoutText()
    monkeypatch.setattr(module, "get_model", lambda: model)

    result = await module.careerIntelligenceFlow(req)

    assert result.content == "stringified-response"
