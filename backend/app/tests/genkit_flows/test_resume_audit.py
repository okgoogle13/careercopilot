import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.resume_audit import resumeAuditRKL
from app.models.resume_audit_schemas import AuditResult, Violation


@pytest.fixture
def mock_audit_result():
    return AuditResult(
        overallScore=75.5,
        scanSimulation="The recruiter spends 6 seconds on your summary...",
        violations=[
            Violation(
                ruleId="L1.001",
                severity="warning",
                message="Too many bullet points",
                location="Experience section",
            )
        ],
        recommendations=["Shorten your summary"],
    )


@pytest.mark.asyncio
async def test_resume_audit_rkl_success(mock_audit_result):
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.output.return_value = mock_audit_result
    mock_model.generate = AsyncMock(return_value=mock_response)

    with (
        patch("app.genkit_flows.resume_audit.get_model", return_value=mock_model),
        patch("app.genkit_flows.resume_audit.get_prompt_service") as mock_prompt_svc,
    ):

        mock_prompt_svc.return_value.get_system_prompt.return_value = "System prompt"

        result = await resumeAuditRKL(resume_text="My resume...", strictness_mode="strict")

        assert isinstance(result, AuditResult)
        assert result.overallScore == 75.5
        mock_model.generate.assert_called_once()


@pytest.mark.asyncio
async def test_resume_audit_rkl_no_model():
    with patch("app.genkit_flows.resume_audit.get_model", return_value=None):
        result = await resumeAuditRKL(resume_text="My resume...")
        assert isinstance(result, AuditResult)
        assert result.overallScore == 0
        assert "Audit failed" in result.scanSimulation


@pytest.mark.asyncio
async def test_resume_audit_rkl_exception():
    mock_model = MagicMock()
    mock_model.generate = AsyncMock(side_effect=Exception("Model crashed"))

    with patch("app.genkit_flows.resume_audit.get_model", return_value=mock_model):
        result = await resumeAuditRKL(resume_text="My resume...")
        assert isinstance(result, AuditResult)
        assert result.overallScore == 0
        assert "Audit failed" in result.scanSimulation
