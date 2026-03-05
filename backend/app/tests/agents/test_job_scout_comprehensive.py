"""
Comprehensive tests for the JobScoutAgent class.
"""

import json
import logging
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.agents.job_scout import JobListingDetails, JobScoutAgent
from app.services.flash_sidekick_service import FlashSidekickService
from app.services.playwright_service import PlaywrightService

# Configure logging for tests
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest.fixture
def job_scout_agent():
    """Fixture for JobScoutAgent instance."""
    return JobScoutAgent()


@pytest.fixture
async def mock_playwright_service():
    """Fixture for mocking PlaywrightService."""
    mock_service = AsyncMock(PlaywrightService)
    return mock_service


@pytest.fixture
async def mock_flash_sidekick_service():
    """Fixture for mocking FlashSidekickService."""
    mock_service = AsyncMock(FlashSidekickService)
    return mock_service


@pytest.mark.asyncio
async def test_search_jobs_happy_path(
    job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
):
    """Test successful job search with valid topic and location."""
    mock_playwright_service.navigate_and_scrape.return_value = (
        "<html><body><a href='job1.com'>Job 1</a><a href='job2.com'>Job 2</a></body></html>"
    )
    mock_flash_sidekick_service.extract_links_from_search_results.return_value = [
        "job1.com",
        "job2.com",
    ]

    job_scout_agent.browser = mock_playwright_service
    job_scout_agent.ai_parser = mock_flash_sidekick_service

    links = await job_scout_agent.search_jobs("Software Engineer", "Sydney")
    assert len(links) == 2
    assert "job1.com" in links
    assert "job2.com" in links
    mock_playwright_service.navigate_and_scrape.assert_called_once()
    mock_flash_sidekick_service.extract_links_from_search_results.assert_called_once()


@pytest.mark.asyncio
async def test_search_jobs_no_results(
    job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
):
    """Test job search with no results."""
    mock_playwright_service.navigate_and_scrape.return_value = "<html><body></body></html>"
    mock_flash_sidekick_service.extract_links_from_search_results.return_value = []

    job_scout_agent.browser = mock_playwright_service
    job_scout_agent.ai_parser = mock_flash_sidekick_service

    links = await job_scout_agent.search_jobs("Unicorn Hunter", "Atlantis")
    assert len(links) == 0
    mock_playwright_service.navigate_and_scrape.assert_called_once()
    mock_flash_sidekick_service.extract_links_from_search_results.assert_called_once()


@pytest.mark.asyncio
async def test_search_jobs_exception(job_scout_agent, mock_playwright_service):
    """Test job search with an exception during scraping."""
    mock_playwright_service.navigate_and_scrape.side_effect = Exception("Scraping failed")

    job_scout_agent.browser = mock_playwright_service
    job_scout_agent.ai_parser = FlashSidekickService()  # Use real FlashSidekickService here

    links = await job_scout_agent.search_jobs("Data Scientist", "Remote")
    assert len(links) == 0


@pytest.mark.asyncio
async def test_examine_job_happy_path(job_scout_agent, mock_playwright_service):
    """Test successful job examination."""
    mock_playwright_service.navigate_and_scrape.return_value = (
        "<html><body>Job Description</body></html>"
    )

    job_scout_agent.browser = mock_playwright_service

    job_details = await job_scout_agent.examine_job("https://example.com/job1")
    assert job_details["url"] == "https://example.com/job1"
    assert job_details["raw_content_length"] == len("<html><body>Job Description</body></html>")
    mock_playwright_service.navigate_and_scrape.assert_called_once_with("https://example.com/job1")


@pytest.mark.asyncio
async def test_examine_job_exception(job_scout_agent, mock_playwright_service):
    """Test job examination with an exception during scraping."""
    mock_playwright_service.navigate_and_scrape.side_effect = Exception("Scraping failed")

    job_scout_agent.browser = mock_playwright_service

    job_details = await job_scout_agent.examine_job("https://example.com/job1")
    assert not job_details


@pytest.mark.asyncio
async def test_analyze_job_content_happy_path(
    job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
):
    """Test successful job content analysis."""
    mock_playwright_service.navigate_and_scrape.return_value = (
        "<html><body><h1>Software Engineer</h1><p>Company: Acme Corp</p></body></html>"
    )
    mock_flash_sidekick_service.quick_summarize.return_value = '```json\n{\n  "title": "Software Engineer",\n  "company": "Acme Corp",\n  "salary": null,\n  "deadline": null\n}\n```'

    job_scout_agent.browser = mock_playwright_service
    job_scout_agent.ai_parser = mock_flash_sidekick_service

    job_data = await job_scout_agent.analyze_job_content("https://example.com/job1")
    assert job_data["title"] == "Software Engineer"
    assert job_data["company"] == "Acme Corp"
    assert job_data["salary"] == "Not specified"
    assert job_data["deadline"] is None
    assert job_data["status"] == "ready"
    mock_playwright_service.navigate_and_scrape.assert_called_once_with("https://example.com/job1")
    mock_flash_sidekick_service.quick_summarize.assert_called_once()


@pytest.mark.asyncio
async def test_analyze_job_content_insufficient_content(job_scout_agent, mock_playwright_service):
    """Test job content analysis with insufficient content."""
    mock_playwright_service.navigate_and_scrape.return_value = ""

    job_scout_agent.browser = mock_playwright_service
    job_scout_agent.ai_parser = FlashSidekickService()

    job_data = await job_scout_agent.analyze_job_content("https://example.com/job1")
    assert job_data is None


@pytest.mark.asyncio
async def test_analyze_job_content_exception(
    job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
):
    """Test job content analysis with an exception during parsing."""
    mock_playwright_service.navigate_and_scrape.return_value = (
        "<html><body><h1>Software Engineer</h1></body></html>"
    )
    mock_flash_sidekick_service.quick_summarize.side_effect = Exception("Parsing failed")

    job_scout_agent.browser = mock_playwright_service
    job_scout_agent.ai_parser = mock_flash_sidekick_service

    job_data = await job_scout_agent.analyze_job_content("https://example.com/job1")
    assert job_data is None
