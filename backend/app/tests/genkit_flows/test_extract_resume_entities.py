"""
Tests for extract_resume_entities flow.
"""

from typing import Any, Dict, List
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from app.core import dependencies  # Import dependencies for mocking
from app.genkit_flows.extract_resume_entities import (
    ResumeEntities,
    extractResumeEntities,
)
from app.genkit_flows.shared import create_extraction_flow


# Mock User class for mocking current user
class User:
    def __init__(self, id: str, email: str):
        self.id = id
        self.email = email


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""

    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app="app.main:app")  # Replace with your app entry point


class TestExtractResumeEntities:
    @pytest.mark.asyncio
    @patch("app.genkit_flows.shared.get_model")
    async def test_extract_resume_entities_happy_path(self, mock_get_model, mock_current_user):
        """
        Test successful extraction of resume entities with a valid resume text.
        """
        mock_response = ResumeEntities(
            skills=["Python", "Data Analysis", "Machine Learning"],
            experience=[
                {
                    "title": "Data Scientist",
                    "company": "Acme Corp",
                    "duration": "2020-2023",
                }
            ],
            education=[
                {
                    "degree": "Master of Science",
                    "institution": "Stanford University",
                }
            ],
        )
        mock_get_model.return_value.generate.return_value.output.return_value = mock_response

        resume_text = "Experienced Data Scientist with skills in Python and Machine Learning."
        result = extractResumeEntities(resume_text)

        assert result == mock_response
        assert "Python" in result.skills

    @pytest.mark.asyncio
    @patch("app.genkit_flows.shared.get_model")
    async def test_extract_resume_entities_empty_resume(self, mock_get_model, mock_current_user):
        """
        Test extraction with an empty resume text.
        """
        mock_response = ResumeEntities(
            skills=[],
            experience=[],
            education=[],
        )
        mock_get_model.return_value.generate.return_value.output.return_value = mock_response

        resume_text = ""
        result = extractResumeEntities(resume_text)

        assert result == mock_response
        assert len(result.skills) == 0
