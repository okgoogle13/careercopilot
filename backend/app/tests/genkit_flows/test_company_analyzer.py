"""
Tests for the company_analyzer module.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.genkit_flows.company_analyzer import analyze_company_website, CompanyAnalysis
from unittest.mock import patch
from requests.exceptions import RequestException, ConnectionError
from pydantic import ValidationError
from dotenv import load_dotenv
import os

# Load environment variables for testing
load_dotenv()

@pytest.fixture
def test_client():
    """Fixture to create a test client."""
    from backend.app.main import app  # Import app here to avoid circular dependency
    client = TestClient(app)
    return client

def test_analyze_company_website_happy_path(monkeypatch):
    """
    Test successful analysis of a company website.
    """
    mock_gemini_pro_generate = monkeypatch.setattr("backend.app.genkit_flows.company_analyzer.gemini_pro.generate",
                                                    lambda prompt, config, output_schema:
                                                    {"company_keywords": ["tech", "innovation"],
                                                     "company_tone": "professional"})

    result = analyze_company_website("https://www.example.com")
    assert isinstance(result, CompanyAnalysis)
    assert result.company_keywords == ["tech", "innovation"]
    assert result.company_tone == "professional"

def test_analyze_company_website_connection_error(monkeypatch):
    """
    Test handling of connection errors when fetching the URL.
    """
    monkeypatch.setattr("backend.app.genkit_flows.company_analyzer.requests.get",
                        lambda url, headers, timeout:
                        raise RequestException("Connection failed"))

    with pytest.raises(ConnectionError) as excinfo:
        analyze_company_website("https://www.example.com")
    assert "Failed to fetch URL" in str(excinfo.value)

def test_analyze_company_website_bad_status_code(monkeypatch):
    """
    Test handling of bad status codes (e.g., 404) when fetching the URL.
    """
    mock_response = patch('backend.app.genkit_flows.company_analyzer.requests.get')
    mock_response.return_value.status_code = 404
    mock_response.return_value.raise_for_status.side_effect = requests.exceptions.HTTPError("Not Found")

    with pytest.raises(ConnectionError) as excinfo:
        analyze_company_website("https://www.example.com")
    assert "Failed to fetch URL" in str(excinfo.value)

def test_analyze_company_website_no_text_extracted(monkeypatch):
    """
    Test handling of cases where no text can be extracted from the website.
    """
    mock_response = patch('backend.app.genkit_flows.company_analyzer.requests.get')
    mock_response.return_value.content = "<html></html>"  # Empty HTML
    monkeypatch.setattr("backend.app.genkit_flows.company_analyzer.BeautifulSoup",
                        lambda content, parser: type('MockSoup', (object,), {'get_text': lambda: ""})())

    with pytest.raises(ValueError) as excinfo:
        analyze_company_website("https://www.example.com")
    assert "Could not extract any text from the website." in str(excinfo.value)

def test_analyze_company_website_gemini_pro_failure(monkeypatch):
    """
    Test handling of cases where Gemini Pro fails to generate an analysis.
    """
    mock_gemini_pro_generate = monkeypatch.setattr("backend.app.genkit_flows.company_analyzer.gemini_pro.generate",
                                                    lambda prompt, config, output_schema: None)

    with pytest.raises(ValueError) as excinfo:
        analyze_company_website("https://www.example.com")
    assert "Failed to generate company analysis from the model." in str(excinfo.value)

def test_analyze_company_website_schema_validation(monkeypatch):
    """
    Test that the output conforms to the CompanyAnalysis schema.
    """
    mock_gemini_pro_generate = monkeypatch.setattr("backend.app.genkit_flows.company_analyzer.gemini_pro.generate",
                                                    lambda prompt, config, output_schema:
                                                    {"invalid_field": "some_value"})

    with pytest.raises(ValidationError):
        analyze_company_website("https://www.example.com")