"""
Tests for document_generator module.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os
from backend.app.genkit_flows.document_generator import generate_tailored_resume
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture
def test_client():
    """Fixture for creating a test client."""
    return TestClient(
        app="backend.app.main:app"  # Replace with your app entry point
    )

class TestDocumentGenerator:

    @pytest.fixture
    def mock_gemini_pro(self):
        """Mock the Gemini Pro model."""
        mock_gemini = MagicMock()
        mock_gemini.generate.return_value.text = "Mocked Resume Content"
        return mock_gemini

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_happy_path(self, mock_gemini_pro, base_profile_data, comparison_analysis):
        """
        Test successful resume generation with valid inputs.
        """
        result = generate_tailored_resume(base_profile_data, comparison_analysis)
        assert result == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_empty_base_profile(self, mock_gemini_pro, empty_base_profile_data, comparison_analysis):
        """
        Test resume generation with an empty base profile.
        """
        result = generate_tailored_resume(empty_base_profile_data, comparison_analysis)
        assert result == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_empty_comparison_analysis(self, mock_gemini_pro, base_profile_data, empty_comparison_analysis):
        """
        Test resume generation with an empty comparison analysis.
        """
        result = generate_tailored_resume(base_profile_data, empty_comparison_analysis)
        assert result == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_large_input(self, mock_gemini_pro, large_base_profile_data, large_comparison_analysis):
        """
        Test resume generation with large input data.
        """
        result = generate_tailored_resume(large_base_profile_data, large_comparison_analysis)
        assert result == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', side_effect=Exception("API Error"))
    def test_generate_tailored_resume_api_error(self, mock_gemini_pro):
        """
        Test resume generation when the Gemini API returns an error.
        """
        with pytest.raises(Exception, match="API Error"):
            generate_tailored_resume({"key": "value"}, {"key": "value"})

# Sample data for tests
@pytest.fixture
def base_profile_data():
    """Sample base profile data."""
    return {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "experience": [
            {"title": "Software Engineer", "company": "Acme Corp", "years": 2}
        ],
        "skills": ["Python", "JavaScript"]
    }

@pytest.fixture
def comparison_analysis():
    """Sample comparison analysis data."""
    return {
        "matching_skills": ["Python"],
        "missing_skills": ["Java", "SQL"],
        "improvement_suggestions": ["Add more details to experience section"]
    }

@pytest.fixture
def empty_base_profile_data():
    """Empty base profile data."""
    return {}

@pytest.fixture
def empty_comparison_analysis():
    """Empty comparison analysis data."""
    return {}

@pytest.fixture
def large_base_profile_data():
    """Large base profile data."""
    return {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "experience": [{"title": "Software Engineer", "company": "Acme Corp", "years": 2}] * 100,
        "skills": ["Python", "JavaScript"] * 50
    }

@pytest.fixture
def large_comparison_analysis():
    """Large comparison analysis data."""
    return {
        "matching_skills": ["Python"] * 100,
        "missing_skills": ["Java", "SQL"] * 50,
        "improvement_suggestions": ["Add more details to experience section"] * 100
    }