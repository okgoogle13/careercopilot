"""
Tests for the smart cover letter generation system.
"""

import json
from typing import Dict, List, Optional
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from app.core.ai_error_handling import AIError, AIErrorType
from app.core.input_validation import InputValidationError
from app.genkit_flows.smart_cover_letter_system import (
    CompanyResearchInsights,
    CoverLetterAnalysis,
    CoverLetterFormat,
    CoverLetterSection,
    CoverLetterStyle,
    SmartCoverLetter,
    generate_smart_cover_letter,
)


# Mock data models for testing
class MockUser(BaseModel):
    id: str
    email: str


# Fixtures
@pytest.fixture
def test_client():
    """Create a test client."""
    return TestClient(app="main:app")  # Replace 'main:app' with your app entry point


@pytest.fixture
def mock_candidate_profile():
    """Mock candidate profile data."""
    return {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "experience": "5+ years",
        "skills": ["Python", "AI", "Communication"],
    }


@pytest.fixture
def mock_job_description():
    """Mock job description data."""
    return "Software Engineer with experience in AI and Python."


@pytest.fixture
def mock_company_info():
    """Mock company information data."""
    return {
        "name": "Acme Corp",
        "industry": "Technology",
        "values": ["Innovation", "Collaboration"],
    }


@pytest.fixture
def mock_genkit_flow():
    """Mock genkit flow."""
    with patch("app.genkit_flows.smart_cover_letter_system.genkit_flow") as mock:
        yield mock


# Test Cases
@pytest.fixture
def valid_cover_letter():
    """Returns a valid SmartCoverLetter object for testing."""
    return SmartCoverLetter(
        letter_content="Test Cover Letter",
        sections=[
            CoverLetterSection(
                section_name="Intro",
                content="Test Intro",
                personalization_elements=[],
                key_messages=[],
                call_to_action=None,
            )
        ],
        analysis=CoverLetterAnalysis(
            readability_score=80,
            personalization_score=90,
            compelling_score=85,
            keyword_alignment=75,
            strengths=["Strong skills"],
            improvement_areas=["More metrics"],
            tone_assessment="Professional",
            unique_elements=["AI focus"],
        ),
        personalization_notes=["Personalized for Acme Corp"],
        key_selling_points=["AI Skills"],
        company_connections=["Innovation"],
        alternative_versions={"email": "Email Version"},
        follow_up_suggestions=["Follow up in a week"],
        subject_line="Application for Software Engineer",
    )


class TestGenerateSmartCoverLetter:
    @patch("app.genkit_flows.smart_cover_letter_system.gemini_pro")
    def test_generate_smart_cover_letter_happy_path(
        self,
        mock_gemini,
        mock_candidate_profile,
        mock_job_description,
        mock_company_info,
        valid_cover_letter,
    ):
        """Test successful cover letter generation with valid inputs."""
        mock_gemini.generate.return_value.output.return_value = valid_cover_letter

        result = generate_smart_cover_letter(
            candidate_profile=mock_candidate_profile,
            job_description=mock_job_description,
            company_info=mock_company_info,
            style="professional",
            format_type="full_letter",
        )

        assert isinstance(result, SmartCoverLetter)
        assert result.letter_content == "Test Cover Letter"
        assert result.analysis.readability_score == 80

    @patch("app.genkit_flows.smart_cover_letter_system.gemini_pro")
    def test_generate_smart_cover_letter_no_company_info(
        self,
        mock_gemini,
        mock_candidate_profile,
        mock_job_description,
        valid_cover_letter,
    ):
        """Test cover letter generation without company info."""
        mock_gemini.generate.return_value.output.return_value = valid_cover_letter

        result = generate_smart_cover_letter(
            candidate_profile=mock_candidate_profile,
            job_description=mock_job_description,
            company_info=None,
        )

        assert isinstance(result, SmartCoverLetter)

    @patch("app.genkit_flows.smart_cover_letter_system.gemini_pro")
    def test_generate_smart_cover_letter_ai_error(
        self,
        mock_gemini,
        mock_candidate_profile,
        mock_job_description,
    ):
        """Test cover letter generation with an AI error."""
        mock_gemini.generate.side_effect = Exception("Test AI Error")

        with pytest.raises(AIError) as excinfo:
            generate_smart_cover_letter(
                candidate_profile=mock_candidate_profile,
                job_description=mock_job_description,
            )

        assert "Test AI Error" in str(excinfo.value)

    def test_generate_smart_cover_letter_input_validation_error(
        self,
        mock_candidate_profile,
    ):
        """Test cover letter generation with input validation error."""
        # The function wraps InputValidationError in AIError
        with pytest.raises(AIError) as excinfo:
            generate_smart_cover_letter(
                candidate_profile={},  # Invalid / empty profile
                job_description="",
            )
        assert "Candidate profile and job description are required" in str(excinfo.value)
