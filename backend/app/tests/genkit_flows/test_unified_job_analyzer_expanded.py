"""
Test suite for unified_job_analyzer_expanded.
"""

from typing import Optional
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel, Field

from app.genkit_flows.company_context import CompanyContext, generate_company_context
from app.genkit_flows.job_listing_extractor import extract_job_listing_details_flow
from app.genkit_flows.unified_job_analyzer import UnifiedJobAnalysis, analyze_job_from_url
from app.models.schemas import JobListingDetails


# Mocking dependencies
@pytest.fixture
def mock_extract_job_listing_details_flow(monkeypatch):
    """Mock extract_job_listing_details_flow."""
    mock = AsyncMock()
    monkeypatch.setattr(
        "app.genkit_flows.unified_job_analyzer.extract_job_listing_details_flow", mock
    )
    return mock


@pytest.fixture
def mock_generate_company_context(monkeypatch):
    """Mock generate_company_context."""
    mock = AsyncMock()
    monkeypatch.setattr("app.genkit_flows.unified_job_analyzer.generate_company_context", mock)
    return mock


# Test Client
@pytest.fixture
def client():
    from app.main import app

    return TestClient(app)


class TestUnifiedJobAnalyzer:

    @pytest.mark.asyncio
    async def test_analyze_job_from_url_happy_path(
        self, mock_extract_job_listing_details_flow, mock_generate_company_context
    ):
        """Test successful job analysis with company context."""
        mock_job_details = JobListingDetails(
            company_name="Acme Corp", full_description="Some description"
        )
        mock_extract_job_listing_details_flow.return_value = mock_job_details
        mock_company_context = CompanyContext(recent_achievements=["Achievement 1"])
        mock_generate_company_context.return_value = mock_company_context

        result = await analyze_job_from_url("https://example.com/job/12345")

        assert isinstance(result, UnifiedJobAnalysis)
        assert result.job_details == mock_job_details
        assert result.company_context == mock_company_context
        assert result.analysis_success is True
        assert result.error_message is None

    @pytest.mark.asyncio
    async def test_analyze_job_from_url_no_company_context(
        self, mock_extract_job_listing_details_flow, mock_generate_company_context
    ):
        """Test job analysis when company context generation fails."""
        mock_job_details = JobListingDetails(
            company_name="Acme Corp", full_description="Some description"
        )
        mock_extract_job_listing_details_flow.return_value = mock_job_details
        mock_generate_company_context.side_effect = Exception("Company context generation failed")

        result = await analyze_job_from_url("https://example.com/job/12345")

        assert isinstance(result, UnifiedJobAnalysis)
        assert result.job_details == mock_job_details
        assert result.company_context is None
        assert result.analysis_success is True
        assert result.error_message is None

    @pytest.mark.asyncio
    async def test_analyze_job_from_url_no_company_name(
        self, mock_extract_job_listing_details_flow, mock_generate_company_context
    ):
        """Test job analysis when company name is missing."""
        mock_job_details = JobListingDetails(company_name=None, full_description="Some description")
        mock_extract_job_listing_details_flow.return_value = mock_job_details

        result = await analyze_job_from_url("https://example.com/job/12345")

        assert isinstance(result, UnifiedJobAnalysis)
        assert result.job_details == mock_job_details
        assert result.company_context is None
        assert result.analysis_success is True
        assert result.error_message is None

    @pytest.mark.asyncio
    async def test_analyze_job_from_url_extraction_failure(
        self, mock_extract_job_listing_details_flow, mock_generate_company_context
    ):
        """Test job analysis when job details extraction fails."""
        mock_extract_job_listing_details_flow.side_effect = Exception(
            "Job details extraction failed"
        )

        with pytest.raises(RuntimeError) as excinfo:
            await analyze_job_from_url("https://example.com/job/12345")

        assert "Failed to analyze job from URL" in str(excinfo.value)

    @pytest.mark.asyncio
    async def test_unified_job_analysis_schema(self):
        """Test the UnifiedJobAnalysis schema."""
        data = {
            "job_details": JobListingDetails(
                company_name="Test Co", essential_criteria=["Criteria"]
            ),
            "company_context": CompanyContext(recent_achievements=["Achievement"]),
            "analysis_success": True,
            "error_message": None,
        }
        UnifiedJobAnalysis(**data)

        data["analysis_success"] = False
        data["error_message"] = "Test Error"
        UnifiedJobAnalysis(**data)
