"""Unit tests for the retired SearchService."""

import asyncio

import pytest

from app.services.search_service import SearchResult, SearchService


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


def test_search_result_defaults_to_empty_citations():
    """The response model should default citations to an empty list."""
    result = SearchResult(content="Summary")
    assert result.citations == []


def test_research_company_returns_placeholder():
    """Research should return the decommissioned placeholder text."""
    service = SearchService()
    result = asyncio.run(service.research_company("Community First"))
    assert "Community First" in result
    assert "[CAPABILITY RETIRED]" in result or "offline" in result
