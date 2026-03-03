"""
Test suite for gap_hunter module.
"""

import pytest
from fastapi.testclient import TestClient
from app.genkit_flows.gap_hunter import gap_hunter_flow, GapAnalysisResult
from unittest.mock import patch, MagicMock
from app.services.vector_store import VectorStore

# Mock the VectorStore class
@pytest.fixture
def mock_vector_store():
    """Fixture for mocking the VectorStore class."""
    mock_vector_store = MagicMock(spec=VectorStore)
    return mock_vector_store

# Mock the genai model
@pytest.fixture
def mock_genai_model():
    """Fixture for mocking the genai model."""
    mock_model = MagicMock()
    return mock_model

@pytest.fixture
def client():
    """Fixture for creating a test client."""
    return TestClient(app="app.app:app")  # Replace with your app import

class TestGapHunterFlow:

    def test_happy_path(self, mock_vector_store, mock_genai_model):
        """
        Test the happy path scenario where gaps are identified and evidence is found.
        """
        mock_genai_model.generate_content.return_value.text = "Skill1, Skill2, Skill3"
        mock_vector_store.query_similar.return_value = [
            {"content": "Evidence for Skill1...", "metadata": {"source_type": "KSC"}},
            {"content": "Evidence for Skill2...", "metadata": {"source_type": "Cover Letter"}}
        ]

        result = gap_hunter_flow(
            resume_text="Resume content",
            job_description="Job description content"
        )

        assert isinstance(result, GapAnalysisResult)
        assert len(result.missing_skills) == 3
        assert len(result.evidence_found) == 2
        assert "Skill1" in result.missing_skills
        assert "Skill2" in result.missing_skills
        assert "Skill3" in result.missing_skills
        assert "Evidence for Skill1..." in result.evidence_found[0]
        assert "Evidence for Skill2..." in result.evidence_found[1]
        assert "strategically insert" in result.strategy_advice

    def test_no_gaps_found(self, mock_genai_model, mock_vector_store):
        """
        Test the scenario where no gaps are identified.
        """
        mock_genai_model.generate_content.return_value.text = ""
        result = gap_hunter_flow(
            resume_text="Resume content",
            job_description="Job description content"
        )

        assert isinstance(result, GapAnalysisResult)
        assert not result.missing_skills
        assert not result.evidence_found
        assert "No major gaps found" in result.strategy_advice

    def test_no_evidence_found(self, mock_genai_model, mock_vector_store):
        """
        Test the scenario where gaps are identified but no evidence is found.
        """
        mock_genai_model.generate_content.return_value.text = "Skill1, Skill2"
        mock_vector_store.query_similar.return_value = []

        result = gap_hunter_flow(
            resume_text="Resume content",
            job_description="Job description content"
        )

        assert isinstance(result, GapAnalysisResult)
        assert len(result.missing_skills) == 2
        assert not result.evidence_found
        assert "You may need to add this manually" in result.strategy_advice

    def test_empty_resume_and_jd(self, mock_genai_model, mock_vector_store):
        """
        Test with empty resume and job description.
        """
        mock_genai_model.generate_content.return_value.text = ""
        result = gap_hunter_flow(
            resume_text="",
            job_description=""
        )

        assert isinstance(result, GapAnalysisResult)
        assert not result.missing_skills
        assert not result.evidence_found
        assert "No major gaps found" in result.strategy_advice

    def test_long_resume_and_jd(self, mock_genai_model, mock_vector_store):
        """
        Test with long resume and job description (truncated to 3000 characters).
        """
        long_resume = "A" * 3500
        long_jd = "B" * 3200
        mock_genai_model.generate_content.return_value.text = "Skill1"
        result = gap_hunter_flow(
            resume_text=long_resume,
            job_description=long_jd
        )

        assert isinstance(result, GapAnalysisResult)
        assert "Skill1" in result.missing_skills

    @patch('app.genkit_flows.gap_hunter.genai')
    def test_genai_error(self, mock_genai, mock_vector_store):
        """
        Test the scenario where the GenAI model raises an exception.
        """
        mock_genai.configure.return_value = None
        mock_genai.GenerativeModel.return_value.generate_content.side_effect = Exception("GenAI Error")

        with pytest.raises(Exception, match="GenAI Error"):
            gap_hunter_flow(
                resume_text="Resume content",
                job_description="Job description content"
            )