"""Focused tests for JobsService edge cases not covered by the critical-path suite."""

import json
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services.jobs_service import JobsService


@pytest.fixture
def mock_db():
    """Create a mock SQLAlchemy session."""
    return Mock(spec=Session)


@pytest.mark.asyncio
async def test_compare_resume_to_job_uses_extracted_text_fallback(mock_db):
    """Legacy extractedText should still be accepted when fullText is missing."""
    asset = SimpleNamespace(
        id="asset-456",
        user_id="user-123",
        document_type="resume",
        extracted_data={"extractedText": "Fallback resume text"},
    )
    mock_db.query.return_value.filter.return_value.first.return_value = asset

    with (
        patch(
            "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
        ) as mock_analyze,
        patch(
            "app.services.jobs_service.compare_resume_to_job", new_callable=AsyncMock
        ) as mock_compare,
    ):
        mock_analyze.return_value = json.dumps({"title": "Case Manager"})
        mock_compare.return_value = json.dumps({"match_score": 88})

        result = await JobsService.compare_resume_to_job(
            mock_db,
            "user-123",
            "asset-456",
            "Case Manager role",
        )

    assert result == {"match_score": 88}
    mock_compare.assert_awaited_once_with(
        resume_text="Fallback resume text",
        job_analysis_data={"title": "Case Manager"},
    )


@pytest.mark.asyncio
async def test_compare_resume_to_job_returns_http_400_for_invalid_comparison_json(mock_db):
    """Malformed comparison JSON should map to the explicit 400 branch."""
    asset = SimpleNamespace(
        id="asset-789",
        user_id="user-123",
        document_type="resume",
        extracted_data={"fullText": "Resume body"},
    )
    mock_db.query.return_value.filter.return_value.first.return_value = asset

    with (
        patch(
            "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
        ) as mock_analyze,
        patch(
            "app.services.jobs_service.compare_resume_to_job", new_callable=AsyncMock
        ) as mock_compare,
    ):
        mock_analyze.return_value = json.dumps({"title": "Support Worker"})
        mock_compare.return_value = "{bad-json"

        with pytest.raises(HTTPException) as exc_info:
            await JobsService.compare_resume_to_job(
                mock_db,
                "user-123",
                "asset-789",
                "Support Worker role",
            )

    assert exc_info.value.status_code == 400
    assert "Invalid JSON response from AI" in exc_info.value.detail


@pytest.mark.asyncio
async def test_compare_resume_to_job_wraps_unexpected_errors_in_http_500(mock_db):
    """Unexpected errors should be normalized to a 500 HTTPException."""
    with patch(
        "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
    ) as mock_analyze:
        mock_analyze.side_effect = RuntimeError("genkit unavailable")

        with pytest.raises(HTTPException) as exc_info:
            await JobsService.compare_resume_to_job(
                mock_db,
                "user-123",
                "asset-789",
                "Support Worker role",
            )

    assert exc_info.value.status_code == 500
    assert "genkit unavailable" in exc_info.value.detail
