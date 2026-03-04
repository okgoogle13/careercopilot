"""
Integration tests for Genkit AI endpoints.
Tests Genkit flow integration, error handling, and response schemas.
"""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.database import User


def _cover_letter_response():
    """Return a minimal valid SmartCoverLetter payload."""
    return {
        "letter_content": "Dear Hiring Manager,\nI am excited to apply.",
        "subject_line": "Application for Software Engineer",
        "sections": [
            {
                "section_name": "Opening",
                "content": "I am excited to apply.",
                "personalization_elements": ["Role title"],
                "key_messages": ["Strong alignment"],
                "call_to_action": "I welcome the opportunity to discuss further.",
            }
        ],
        "analysis": {
            "readability_score": 85,
            "personalization_score": 88,
            "compelling_score": 84,
            "keyword_alignment": 80,
            "strengths": ["Clear relevance"],
            "improvement_areas": ["Add a quantified impact example"],
            "tone_assessment": "professional",
            "unique_elements": ["Company-specific motivation"],
        },
        "personalization_notes": ["Tailored to the role"],
        "key_selling_points": ["Python expert", "Team player"],
        "company_connections": ["Interest in the company mission"],
        "alternative_versions": {"brief": "Shorter version"},
        "follow_up_suggestions": ["Follow up in one week"],
    }


def _optimized_resume_response():
    """Return a minimal valid OptimizedResume payload."""
    return {
        "resume_text": "Optimized resume text",
        "keywords_integrated": ["Python", "Leadership"],
    }


def _job_analysis_response():
    """Return a minimal valid UnifiedJobAnalysis payload."""
    return {
        "job_details": {
            "company_name": "Tech Corp",
            "role_title": "Senior Python Developer",
            "full_description": "Build backend systems using Python and FastAPI.",
            "essential_criteria": ["Python"],
            "desirable_criteria": ["FastAPI"],
            "subsectors": [],
            "key_responsibilities": ["Build APIs"],
        },
        "company_context": None,
        "analysis_success": True,
        "error_message": None,
    }


def _company_context_response():
    """Return a minimal valid CompanyContext payload."""
    return {
        "recent_achievements": ["Expanded platform capabilities"],
        "core_values": ["Innovation", "Collaboration"],
        "recommended_tone": "conversational",
        "why_work_here_points": ["Meaningful product impact"],
        "interview_questions": ["How is success measured for this role?"],
        "cultural_insights": "Collaborative and fast-moving team.",
    }


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
            auth_provider="firebase",
        )

    from app.core import dependencies

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def mock_genkit_enabled():
    """Mock Genkit as enabled."""
    with patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=True):
        yield


@pytest.fixture
def mock_genkit_disabled():
    """Mock Genkit as disabled."""
    with patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=False):
        yield


class TestCoverLetterGeneration:
    """Test cover letter generation endpoints."""

    def test_cover_letter_disabled_returns_503(
        self, client, mock_current_user, mock_genkit_disabled
    ):
        """Test endpoint returns 503 when Genkit is disabled."""
        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={
                "candidate_profile": {"name": "John Doe", "skills": ["Python"]},
                "job_description": "Python developer position",
                "company_info": {"name": "Test Corp"},
                "style": "professional",
            },
        )
        assert response.status_code == 503
        assert "disabled" in response.json().get("detail", "").lower()

    @patch("app.api.endpoints.genkit.generate_smart_cover_letter")
    def test_cover_letter_enabled_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test cover letter generation calls Genkit flow when enabled."""
        mock_flow.return_value = _cover_letter_response()

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={"candidate_profile": {"name": "John Doe"}, "job_description": "Python developer"},
        )

        assert response.status_code == 200
        mock_flow.assert_called_once()
        data = response.json()
        assert "letter_content" in data

    def test_cover_letter_missing_fields_returns_422(self, client, mock_current_user):
        """Test validation errors for missing required fields."""
        response = client.post(
            "/api/genkit/cover-letter/generate", json={}  # Missing required fields
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
                "ksc_statement": "Demonstrated ability to work in a team",
            },
        )
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.generateKscResponse", new_callable=AsyncMock)
    def test_ksc_generation_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test KSC generation calls Genkit flow."""
        mock_flow.return_value = {
            "situation": "Team project at XYZ Corp",
            "task": "Lead feature development",
            "action": "Coordinated with 5 developers",
            "result": "Delivered on time",
        }

        response = client.post(
            "/api/genkit/ksc/generate",
            json={
                "user_profile_data": {"experience": [{"role": "Developer"}]},
                "ksc_statement": "Team collaboration",
            },
        )

        assert response.status_code == 200
        mock_flow.assert_awaited_once()


class TestResumeOptimization:
    """Test resume optimization endpoints."""

    def test_resume_optimize_disabled_returns_503(
        self, client, mock_current_user, mock_genkit_disabled
    ):
        """Test resume optimization returns 503 when disabled."""
        response = client.post(
            "/api/genkit/resume/optimize",
            json={
                "resume_text": "Original resume text",
                "missing_keywords": ["FastAPI"],
                "job_description": "Software Engineer role using Python and FastAPI.",
            },
        )
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.optimize_resume", new_callable=AsyncMock)
    def test_resume_optimization_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test resume optimization calls Genkit flow."""
        mock_flow.return_value = _optimized_resume_response()

        response = client.post(
            "/api/genkit/resume/optimize",
            json={
                "resume_text": "Software engineer with 5 years experience",
                "missing_keywords": ["leadership"],
                "job_description": "Senior Engineer role focused on architecture and leadership.",
            },
        )

        assert response.status_code == 200
        mock_flow.assert_awaited_once()


class TestJobAnalysis:
    """Test job analysis endpoints."""

    def test_job_analysis_disabled_returns_503(
        self, client, mock_current_user, mock_genkit_disabled
    ):
        """Test job analysis returns 503 when disabled."""
        response = client.post(
            "/api/genkit/job/analyze-url", json={"url": "https://example.com/job"}
        )
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.analyze_job_from_url", new_callable=AsyncMock)
    def test_job_analysis_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test job analysis calls Genkit flow."""
        mock_flow.return_value = _job_analysis_response()

        response = client.post(
            "/api/genkit/job/analyze-url", json={"url": "https://example.com/job/123"}
        )

        assert response.status_code == 200
        mock_flow.assert_awaited_once()
        data = response.json()
        assert "job_details" in data


class TestCompanyContext:
    """Test company context generation endpoints."""

    def test_company_context_disabled_returns_503(
        self, client, mock_current_user, mock_genkit_disabled
    ):
        """Test company context returns 503 when disabled."""
        response = client.post(
            "/api/genkit/company/context",
            json={
                "company_name": "Test Corp",
                "job_description": "Software engineering role building APIs.",
            },
        )
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.generate_company_context", new_callable=AsyncMock)
    def test_company_context_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test company context generation calls Genkit flow."""
        mock_flow.return_value = _company_context_response()

        response = client.post(
            "/api/genkit/company/context",
            json={
                "company_name": "Test Corp",
                "job_description": "Tech startup role building backend systems.",
            },
        )

        assert response.status_code == 200
        mock_flow.assert_awaited_once()


class TestGenkitErrorHandling:
    """Test Genkit endpoint error handling."""

    @patch("app.api.endpoints.genkit.generate_smart_cover_letter")
    def test_genkit_flow_exception_returns_500(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test Genkit flow exceptions return 500."""
        mock_flow.side_effect = Exception("Genkit API error")

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={"candidate_profile": {}, "job_description": "Test"},
        )

        assert response.status_code == 500

    def test_invalid_json_returns_422(self, client, mock_current_user):
        """Test invalid JSON returns validation error."""
        response = client.post(
            "/api/genkit/cover-letter/generate",
            data="invalid json",
            headers={"Content-Type": "application/json"},
        )
        assert response.status_code == 422


class TestGenkitResponseSchemas:
    """Validate Genkit response schemas match Pydantic models."""

    @patch("app.api.endpoints.genkit.generate_smart_cover_letter")
    def test_cover_letter_response_schema(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Validate cover letter response structure."""
        mock_flow.return_value = _cover_letter_response()

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={"candidate_profile": {}, "job_description": "Test"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "letter_content" in data
        assert isinstance(data.get("key_selling_points"), list)

    @patch("app.api.endpoints.genkit.analyze_job_from_url", new_callable=AsyncMock)
    def test_job_analysis_response_schema(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Validate job analysis response structure."""
        mock_flow.return_value = _job_analysis_response()

        response = client.post("/api/genkit/job/analyze-url", json={"url": "https://example.com"})

        assert response.status_code == 200
        data = response.json()
        assert "job_details" in data
        assert "company_context" in data
