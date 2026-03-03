"""
Tests for the company_analyzer module.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.genkit_flows.company_analyzer import analyze_company_website, CompanyAnalysis
from backend.app.main import app
from unittest.mock import patch
import requests
from requests.exceptions import RequestException
from dotenv import load_dotenv
import os

load_dotenv()

@pytest.fixture
def test_client():
    """Fixture to create a test client for the FastAPI application."""
    return TestClient(app)

class TestCompanyAnalyzer:

    def test_analyze_company_website_happy_path(self, test_client):
        """
        Test successful analysis of a company website.
        """
        url = "https://www.example.com"
        response = analyze_company_website(url)
        assert isinstance(response, CompanyAnalysis)
        assert isinstance(response.company_keywords, list)
        assert isinstance(response.company_tone, str)

    def test_analyze_company_website_invalid_url(self):
        """
        Test handling of an invalid URL.
        """
        url = "invalid-url"
        with pytest.raises(ConnectionError):
            analyze_company_website(url)

    def test_analyze_company_website_request_exception(self):
        """
        Test handling of a request exception (e.g., timeout).
        """
        with patch('requests.get') as mock_get:
            mock_get.side_effect = RequestException("Timeout error")
            url = "https://www.example.com"
            with pytest.raises(ConnectionError):
                analyze_company_website(url)

    def test_analyze_company_website_bad_status_code(self):
        """
        Test handling of a bad HTTP status code (e.g., 404).
        """
        with patch('requests.get') as mock_get:
            mock_get.return_value.status_code = 404
            url = "https://www.example.com"
            with pytest.raises(ConnectionError):
                analyze_company_website(url)

    def test_analyze_company_website_no_text_extracted(self):
        """
        Test handling of a website with no extractable text.
        """
        with patch('requests.get') as mock_get:
            mock_get.return_value.content = "<html></html>"
            url = "https://www.example.com"
            with pytest.raises(ValueError):
                analyze_company_website(url)

    def test_analyze_company_website_gemini_failure(self):
        """
        Test handling of a failure from the Gemini model.
        """
        with patch('requests.get') as mock_get:
            mock_get.return_value.content = "<html><body>Some text</body></html>"
        with patch('backend.app.genkit_flows.company_analyzer.gemini_pro.generate') as mock_generate:
            mock_generate.return_value.output.return_value = None
            url = "https://www.example.com"
            with pytest.raises(ValueError):
                analyze_company_website(url)

    @patch('backend.app.genkit_flows.company_analyzer.gemini_pro.generate')
    def test_analyze_company_website_gemini_response_schema(self, mock_generate):
        """
        Test that the Gemini response is correctly mapped to the CompanyAnalysis schema.
        """
        mock_generate.return_value.output.return_value = CompanyAnalysis(company_keywords=["keyword1", "keyword2"], company_tone="formal")
        url = "https://www.example.com"
        response = analyze_company_website(url)
        assert isinstance(response, CompanyAnalysis)
        assert response.company_keywords == ["keyword1", "keyword2"]
        assert response.company_tone == "formal"