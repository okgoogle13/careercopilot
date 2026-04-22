"""
Tests for the JobScoutAgent class.
"""

from unittest.mock import AsyncMock

import pytest

from app.agents.job_scout import JobScoutAgent
from app.services.flash_sidekick_service import FlashSidekickService
from app.services.playwright_service import PlaywrightService


# Mocking setup
@pytest.fixture
def job_scout_agent():
    """Fixture for JobScoutAgent."""
    playwright_service_mock = AsyncMock(spec=PlaywrightService)
    flash_sidekick_service_mock = AsyncMock(spec=FlashSidekickService)
    agent = JobScoutAgent()
    agent.browser = playwright_service_mock
    agent.ai_parser = flash_sidekick_service_mock
    return agent


@pytest.fixture
def mock_playwright_service():
    """Fixture for mocking PlaywrightService."""
    return AsyncMock(spec=PlaywrightService)


@pytest.fixture
def mock_flash_sidekick_service():
    """Fixture for mocking FlashSidekickService."""
    return AsyncMock(spec=FlashSidekickService)


# Test Cases for search_jobs
class TestSearchJobs:
    @pytest.mark.asyncio
    async def test_search_jobs_success(
        self, job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
    ):
        """Test successful job search."""
        mock_playwright_service.navigate_and_scrape.return_value = (
            "<html><body><a href='url1'>Job 1</a><a href='url2'>Job 2</a></body></html>"
        )
        mock_flash_sidekick_service.extract_links_from_search_results.return_value = [
            "url1",
            "url2",
        ]

        job_scout_agent.browser = mock_playwright_service
        job_scout_agent.ai_parser = mock_flash_sidekick_service

        result = await job_scout_agent.search_jobs("Software Engineer", "Sydney")
        assert result == ["url1", "url2"]
        mock_playwright_service.navigate_and_scrape.assert_called_once()
        mock_flash_sidekick_service.extract_links_from_search_results.assert_called_once()

    @pytest.mark.asyncio
    async def test_search_jobs_no_results(
        self, job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
    ):
        """Test job search with no results."""
        mock_playwright_service.navigate_and_scrape.return_value = "<html><body></body></html>"
        mock_flash_sidekick_service.extract_links_from_search_results.return_value = []

        job_scout_agent.browser = mock_playwright_service
        job_scout_agent.ai_parser = mock_flash_sidekick_service

        result = await job_scout_agent.search_jobs("Data Scientist", "Melbourne")
        assert result == []

    @pytest.mark.asyncio
    async def test_search_jobs_exception(self, job_scout_agent, mock_playwright_service):
        """Test job search with an exception during scraping."""
        mock_playwright_service.navigate_and_scrape.side_effect = Exception("Scraping failed")

        job_scout_agent.browser = mock_playwright_service

        result = await job_scout_agent.search_jobs("Project Manager", "Brisbane")
        assert result == []


# Test Cases for examine_job
class TestExamineJob:
    @pytest.mark.asyncio
    async def test_examine_job_success(self, job_scout_agent, mock_playwright_service):
        """Test successful job examination."""
        mock_playwright_service.navigate_and_scrape.return_value = (
            "<html><body>Job Details</body></html>"
        )

        job_scout_agent.browser = mock_playwright_service

        result = await job_scout_agent.examine_job("http://example.com/job1")
        assert result == {
            "url": "http://example.com/job1",
            "raw_content_length": len("<html><body>Job Details</body></html>"),
        }
        mock_playwright_service.navigate_and_scrape.assert_called_once()

    @pytest.mark.asyncio
    async def test_examine_job_exception(self, job_scout_agent, mock_playwright_service):
        """Test job examination with an exception."""
        mock_playwright_service.navigate_and_scrape.side_effect = Exception("Examination failed")

        job_scout_agent.browser = mock_playwright_service

        result = await job_scout_agent.examine_job("http://example.com/job2")
        assert result == {}


# Test Cases for analyze_job_content
class TestAnalyzeJobContent:
    @pytest.mark.asyncio
    async def test_analyze_job_content_success(
        self, job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
    ):
        """Test successful job content analysis."""
        mock_playwright_service.navigate_and_scrape.return_value = (
            "<html><body>"
            + "Job Content with title, company, salary, and deadline. " * 3
            + "</body></html>"
        )
        mock_flash_sidekick_service.quick_summarize.return_value = '{"title": "Software Engineer", "company": "Acme Corp", "salary": "$100k", "deadline": "2024-01-01"}'

        job_scout_agent.browser = mock_playwright_service
        job_scout_agent.ai_parser = mock_flash_sidekick_service

        result = await job_scout_agent.analyze_job_content("http://example.com/job3")
        assert result == {
            "title": "Software Engineer",
            "company": "Acme Corp",
            "salary": "$100k",
            "deadline": "2024-01-01",
            "status": "ready_to_apply",
        }

    @pytest.mark.asyncio
    async def test_analyze_job_content_insufficient_content(
        self, job_scout_agent, mock_playwright_service
    ):
        """Test job content analysis with insufficient content."""
        mock_playwright_service.navigate_and_scrape.return_value = ""

        job_scout_agent.browser = mock_playwright_service

        result = await job_scout_agent.analyze_job_content("http://example.com/job4")
        assert result is None

    @pytest.mark.asyncio
    async def test_analyze_job_content_exception(
        self, job_scout_agent, mock_playwright_service, mock_flash_sidekick_service
    ):
        """Test job content analysis with an exception."""
        mock_playwright_service.navigate_and_scrape.side_effect = Exception("Analysis failed")

        job_scout_agent.browser = mock_playwright_service
        job_scout_agent.ai_parser = mock_flash_sidekick_service

        result = await job_scout_agent.analyze_job_content("http://example.com/job5")
        assert result is None
