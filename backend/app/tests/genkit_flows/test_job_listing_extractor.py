"""Tests for job_listing_extractor flows."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from app.genkit_flows import job_listing_extractor as module
from app.genkit_flows.job_listing_extractor import (
    _scrape_url_content,
    advanced_job_analysis_flow,
    extract_job_listing_details_flow,
)


@pytest.fixture
def mock_job_details():
    from app.models.schemas import JobListingDetails

    return JobListingDetails(
        role_title="Software Engineer",
        company_name="Acme Corp",
        essential_criteria=["Python", "FastAPI"],
        desirable_criteria=["Docker"],
        key_responsibilities=["Build APIs"],
        role_type="full_time",
        subsectors=["Technology"],
        location="Sydney",
        salary_range=None,
        application_deadline=None,
        full_description="",
    )


@pytest.fixture
def mock_async_model(monkeypatch):
    m = AsyncMock()
    monkeypatch.setattr("app.genkit_flows.job_listing_extractor.get_model", lambda: m)
    return m


class TestScrapeUrlContent:
    def test_success_returns_text(self, monkeypatch):
        """Successful scrape returns text content."""
        monkeypatch.setattr(module, "scrape_url_sync", lambda url: "Job description text")
        monkeypatch.setattr(module, "extract_documents_from_page", lambda *a, **kw: "")
        result = _scrape_url_content("https://example.com/job")
        assert result == "Job description text"

    def test_scrape_failure_raises_ioerror(self, monkeypatch):
        """Failed scrape should raise IOError."""
        monkeypatch.setattr(
            module, "scrape_url_sync", lambda url: (_ for _ in ()).throw(Exception("NetworkError"))
        )
        with pytest.raises(IOError, match="Failed to retrieve"):
            _scrape_url_content("https://bad-url.com")

    def test_document_extraction_failure_is_non_fatal(self, monkeypatch):
        """Document extraction error should be a warning, not crash."""
        monkeypatch.setattr(module, "scrape_url_sync", lambda url: "Base text")
        monkeypatch.setattr(
            module,
            "extract_documents_from_page",
            lambda *a, **kw: (_ for _ in ()).throw(Exception("PDF error")),
        )
        result = _scrape_url_content("https://example.com")
        assert result == "Base text"


@pytest.mark.asyncio
class TestExtractJobListingDetailsFlow:
    async def test_text_source_happy_path(self, mock_async_model, mock_job_details):
        """Plain text source should be parsed into JobListingDetails."""
        mock_response = MagicMock()
        mock_response.output.return_value = mock_job_details
        mock_async_model.generate.return_value = mock_response

        result = await extract_job_listing_details_flow(
            "Software Engineer at Acme - Python required"
        )
        assert result.role_title == "Software Engineer"

    async def test_url_dict_source_scrapes_and_extracts(
        self, mock_async_model, mock_job_details, monkeypatch
    ):
        """Dict source with 'url' key should scrape then extract."""
        monkeypatch.setattr(module, "_scrape_url_content", lambda url: "Scraped job text")
        mock_response = MagicMock()
        mock_response.output.return_value = mock_job_details
        mock_async_model.generate.return_value = mock_response

        result = await extract_job_listing_details_flow({"url": "https://example.com/job"})
        assert result.company_name == "Acme Corp"

    async def test_invalid_source_type_raises_type_error(self, mock_async_model):
        """Non-str, non-dict source should raise TypeError."""
        with pytest.raises(TypeError):
            await extract_job_listing_details_flow(12345)

    async def test_empty_content_raises_value_error(self, mock_async_model, monkeypatch):
        """Empty content from source should raise ValueError."""
        monkeypatch.setattr(module, "_scrape_url_content", lambda url: "")
        with pytest.raises(ValueError, match="Empty content"):
            await extract_job_listing_details_flow({"url": "https://empty.com"})

    async def test_model_unavailable_raises_runtime_error(self, monkeypatch):
        """None model should raise RuntimeError."""
        monkeypatch.setattr("app.genkit_flows.job_listing_extractor.get_model", lambda: None)
        with pytest.raises(RuntimeError, match="not available"):
            await extract_job_listing_details_flow("some job text")


@pytest.mark.asyncio
class TestAdvancedJobAnalysisFlow:
    async def test_happy_path_returns_string(self, mock_async_model, mock_job_details):
        """Should return a string analysis result."""
        mock_response = AsyncMock()
        mock_response.output.return_value = "Detailed analysis of the role."
        mock_async_model.generate.return_value = mock_response

        result = await advanced_job_analysis_flow(
            job_details=mock_job_details, user_prompt="What are the most important criteria?"
        )
        assert isinstance(result, str)

    async def test_model_unavailable_raises_runtime_error(self, monkeypatch, mock_job_details):
        """None model should raise RuntimeError."""
        monkeypatch.setattr("app.genkit_flows.job_listing_extractor.get_model", lambda: None)
        with pytest.raises(RuntimeError, match="not available"):
            await advanced_job_analysis_flow(
                job_details=mock_job_details, user_prompt="Analyze this"
            )
