"""Unit tests for the web search service."""

from unittest.mock import patch

import pytest

from app.services.web_search import search_company_info, search_job_market_trends, web_search


@pytest.mark.asyncio
async def test_web_search_salary_query():
    """Test web search with a salary-related query."""
    results = await web_search("Average salary for Python developer in Australia")
    assert len(results) > 0
    assert any("Salary" in r["title"] or "PayScale" in r["title"] for r in results)
    assert any("https://www.seek.com.au" in r["url"] for r in results)


@pytest.mark.asyncio
async def test_web_search_social_work_query():
    """Test web search with a social work-related query."""
    results = await web_search("social work award rates")
    assert len(results) > 0
    assert any("Social" in r["title"] for r in results)
    assert all("snippet" in r for r in results)


@pytest.mark.asyncio
async def test_web_search_general_query():
    """Test web search with a general query."""
    results = await web_search("coding paradigms", max_results=1)
    assert len(results) == 1
    assert "Search results for: coding paradigms" in results[0]["title"]


@pytest.mark.asyncio
async def test_web_search_zero_max_results_returns_empty_list():
    """Result limiting should support zero without errors."""
    results = await web_search("salary benchmark", max_results=0)
    assert results == []


@pytest.mark.asyncio
async def test_web_search_error_handling():
    """Test error handling in web search."""
    with patch("asyncio.sleep", side_effect=Exception("Async error")):
        results = await web_search("any query")
        assert results == []


@pytest.mark.asyncio
async def test_search_company_info():
    """Test searching for company information."""
    info = await search_company_info("Google")
    assert info is not None
    assert info["name"] == "Google"
    assert "industry" in info
    assert "website" in info
    assert info["website"] == "https://google.com.au"


@pytest.mark.asyncio
async def test_search_company_info_error():
    """Test error handling in company search."""
    with patch("asyncio.sleep", side_effect=RuntimeError("Search error")):
        info = await search_company_info("Any Company")
        assert info is None


@pytest.mark.asyncio
async def test_search_job_market_trends():
    """Test searching for job market trends."""
    trends = await search_job_market_trends("Technology", "Sydney")
    assert trends["industry"] == "Technology"
    assert trends["location"] == "Sydney"
    assert "job_growth" in trends
    assert "top_skills" in trends
    assert len(trends["top_skills"]) > 0
    assert "salary_trends" in trends


@pytest.mark.asyncio
async def test_search_job_market_trends_error():
    """Test error handling in market trends search."""
    with patch("asyncio.sleep", side_effect=Exception("Trends error")):
        trends = await search_job_market_trends("Any", "Anywhere")
        assert trends == {}
