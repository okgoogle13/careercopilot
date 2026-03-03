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
        resume = generate_tailored_resume(base_profile_data, comparison_analysis)
        assert resume == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_empty_base_profile(self, mock_gemini_pro, empty_base_profile_data, comparison_analysis):
        """
        Test resume generation with an empty base profile.
        """
        resume = generate_tailored_resume(empty_base_profile_data, comparison_analysis)
        assert resume == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_empty_comparison_analysis(self, mock_gemini_pro, base_profile_data, empty_comparison_analysis):
        """
        Test resume generation with an empty comparison analysis.
        """
        resume = generate_tailored_resume(base_profile_data, empty_comparison_analysis)
        assert resume == "Mocked Resume Content"
        mock_gemini_pro.generate.assert_called_once()

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_invalid_input_types(self, mock_gemini_pro):
        """
        Test resume generation with invalid input types.
        """
        with pytest.raises(TypeError):
            generate_tailored_resume(123, "string")

    @patch('backend.app.genkit_flows.document_generator.gemini_pro', new_callable=MagicMock)
    def test_generate_tailored_resume_gemini_error(self, mock_gemini_pro):
        """
        Test resume generation when Gemini Pro raises an exception.
        """
        mock_gemini_pro.generate.side_effect = Exception("Gemini Error")
        with pytest.raises(Exception) as excinfo:
            generate_tailored_resume({"key": "value"}, {"key": "value"})
        assert "Gemini Error" in str(excinfo.value)

@pytest.fixture
def base_profile_data():
    """Fixture for base profile data."""
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
    """Fixture for comparison analysis."""
    return {
        "matching_skills": ["Python"],
        "missing_skills": ["Java", "SQL"],
        "improvement_suggestions": ["Add more details to experience section"]
    }

@pytest.fixture
def empty_base_profile_data():
    """Fixture for empty base profile data."""
    return {}

@pytest.fixture
def empty_comparison_analysis():
    """Fixture for empty comparison analysis."""
    return {}