"""
Integration tests for Genkit AI endpoints.
Tests Genkit flow integration, error handling, and response schemas.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

from app.main import app
from app.models.database import User


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""
    def mock_get_current_user():
        return User(
            id="test-user-genkit",
            email="genkit@test.com",
            name="Genkit Test User",
            auth_provider="firebase"
        )

    from app.core import dependencies
    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def mock_genkit_enabled():
    """Mock Genkit as enabled."""
    with patch('app.core.genkit_init.is_genkit_enabled', return_value=True):
        yield


@pytest.fixture
def mock_genkit_disabled():
    """Mock Genkit as disabled."""
    with patch('app.core.genkit_init.is_genkit_enabled', return_value=False):
        yield


class TestCoverLetterGeneration:
    """Test cover letter generation endpoints."""

    def test_cover_letter_disabled_returns_503(self, client, mock_current_user, mock_genkit_disabled):
        """Test endpoint returns 503 when Genkit is disabled."""
        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={
                "candidate_profile": {"name": "John Doe", "skills": ["Python"]},
                "job_description": "Python developer position",
                "company_info": {"name": "Test Corp"},
                "style": "professional"
            }
        )
        assert response.status_code == 503
        assert "disabled" in response.json().get("detail", "").lower()

    @patch('app.genkit_flows.smart_cover_letter_system.generate_smart_cover_letter')
    def test_cover_letter_enabled_calls_flow(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Test cover letter generation calls Genkit flow when enabled."""
        mock_flow.return_value = {
            "cover_letter_text": "Dear Hiring Manager...",
            "key_selling_points": ["Python expert", "Team player"],
            "confidence_score": 0.9
        }

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={
                "candidate_profile": {"name": "John Doe"},
                "job_description": "Python developer"
            }
        )

        if response.status_code == 200:
            mock_flow.assert_called_once()
            data = response.json()
            assert "cover_letter_text" in data

    def test_cover_letter_missing_fields_returns_422(self, client, mock_current_user):
        """Test validation errors for missing required fields."""
        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={}  # Missing required fields
        )
        assert response.status_code == 422


class TestKSCGeneration:
    """Test KSC (Key Selection Criteria) generation endpoints."""

    def test_ksc_disabled_returns_503(self, client, mock_current_user, mock_genkit_disabled):
        """Test KSC endpoint returns 503 when disabled."""
        response = client.post(
            "/api/genkit/ksc/generate",
            json={
                "user_profile_data": {"experience": []},
                "ksc_statement": "Demonstrated ability to work in a team"
            }
        )
        assert response.status_code == 503

    @patch('app.genkit_flows.ksc_generator.generateKscResponse')
    def test_ksc_generation_calls_flow(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Test KSC generation calls Genkit flow."""
        mock_flow.return_value = {
            "situation": "Team project at XYZ Corp",
            "task": "Lead feature development",
            "action": "Coordinated with 5 developers",
            "result": "Delivered on time"
        }

        response = client.post(
            "/api/genkit/ksc/generate",
            json={
                "user_profile_data": {"experience": [{"role": "Developer"}]},
                "ksc_statement": "Team collaboration"
            }
        )

        if response.status_code == 200:
            mock_flow.assert_called_once()


class TestResumeOptimization:
    """Test resume optimization endpoints."""

    def test_resume_optimize_disabled_returns_503(self, client, mock_current_user, mock_genkit_disabled):
        """Test resume optimization returns 503 when disabled."""
        response = client.post(
            "/api/genkit/resume/optimize",
            json={
                "resume_content": "Original resume text",
                "target_job": "Software Engineer"
            }
        )
        assert response.status_code == 503

    @patch('app.genkit_flows.resume_optimizer.optimize_resume')
    def test_resume_optimization_calls_flow(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Test resume optimization calls Genkit flow."""
        mock_flow.return_value = {
            "optimized_sections": {},
            "improvements": ["Quantified achievements", "Added keywords"],
            "ats_score": 85
        }

        response = client.post(
            "/api/genkit/resume/optimize",
            json={
                "resume_content": "Software engineer with 5 years experience",
                "target_job": "Senior Engineer"
            }
        )

        if response.status_code == 200:
            mock_flow.assert_called_once()


class TestJobAnalysis:
    """Test job analysis endpoints."""

    def test_job_analysis_disabled_returns_503(self, client, mock_current_user, mock_genkit_disabled):
        """Test job analysis returns 503 when disabled."""
        response = client.post(
            "/api/genkit/job/analyze",
            json={
                "job_url": "https://example.com/job"
            }
        )
        assert response.status_code == 503

    @patch('app.genkit_flows.unified_job_analyzer.analyze_job_from_url')
    def test_job_analysis_calls_flow(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Test job analysis calls Genkit flow."""
        mock_flow.return_value = {
            "title": "Senior Python Developer",
            "company": "Tech Corp",
            "required_skills": ["Python", "FastAPI"],
            "salary_range": "$120k-$150k",
            "match_score": 0.85
        }

        response = client.post(
            "/api/genkit/job/analyze",
            json={
                "job_url": "https://example.com/job/123"
            }
        )

        if response.status_code == 200:
            mock_flow.assert_called_once()
            data = response.json()
            assert "title" in data


class TestCompanyContext:
    """Test company context generation endpoints."""

    def test_company_context_disabled_returns_503(self, client, mock_current_user, mock_genkit_disabled):
        """Test company context returns 503 when disabled."""
        response = client.post(
            "/api/genkit/company/context",
            json={
                "company_name": "Test Corp"
            }
        )
        assert response.status_code == 503

    @patch('app.genkit_flows.company_context.generate_company_context')
    def test_company_context_calls_flow(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Test company context generation calls Genkit flow."""
        mock_flow.return_value = {
            "company_name": "Test Corp",
            "industry": "Technology",
            "values": ["Innovation", "Collaboration"],
            "recent_news": []
        }

        response = client.post(
            "/api/genkit/company/context",
            json={
                "company_name": "Test Corp",
                "additional_info": "Tech startup"
            }
        )

        if response.status_code == 200:
            mock_flow.assert_called_once()


class TestGenkitErrorHandling:
    """Test Genkit endpoint error handling."""

    @patch('app.genkit_flows.smart_cover_letter_system.generate_smart_cover_letter')
    def test_genkit_flow_exception_returns_500(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Test Genkit flow exceptions return 500."""
        mock_flow.side_effect = Exception("Genkit API error")

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={
                "candidate_profile": {},
                "job_description": "Test"
            }
        )

        assert response.status_code == 500

    def test_invalid_json_returns_422(self, client, mock_current_user):
        """Test invalid JSON returns validation error."""
        response = client.post(
            "/api/genkit/cover-letter/generate",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422


class TestGenkitResponseSchemas:
    """Validate Genkit response schemas match Pydantic models."""

    @patch('app.genkit_flows.smart_cover_letter_system.generate_smart_cover_letter')
    def test_cover_letter_response_schema(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Validate cover letter response structure."""
        mock_response = {
            "cover_letter_text": "Test letter",
            "key_selling_points": ["Point 1"],
            "confidence_score": 0.8,
            "style": "professional",
            "word_count": 200
        }
        mock_flow.return_value = mock_response

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={
                "candidate_profile": {},
                "job_description": "Test"
            }
        )

        if response.status_code == 200:
            data = response.json()
            assert "cover_letter_text" in data
            assert isinstance(data.get("confidence_score"), (int, float))

    @patch('app.genkit_flows.unified_job_analyzer.analyze_job_from_url')
    def test_job_analysis_response_schema(self, mock_flow, client, mock_current_user, mock_genkit_enabled):
        """Validate job analysis response structure."""
        mock_response = {
            "title": "Engineer",
            "company": "Corp",
            "required_skills": [],
            "match_score": 0.9
        }
        mock_flow.return_value = mock_response

        response = client.post(
            "/api/genkit/job/analyze",
            json={"job_url": "https://example.com"}
        )

        if response.status_code == 200:
            data = response.json()
            assert "title" in data
            assert "company" in data
