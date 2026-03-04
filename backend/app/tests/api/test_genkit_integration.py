"""
Integration tests for Genkit AI endpoints.
Tests Genkit flow integration, error handling, and response schemas.
"""

from unittest.mock import AsyncMock, patch

from app.tests.helpers.payload_factories import (
    make_company_context_request,
    make_cover_letter_request,
    make_ksc_request,
    make_resume_optimization_request,
)
from app.tests.helpers.response_factories import (
    make_company_context_response,
    make_cover_letter_response,
    make_job_analysis_response,
    make_optimized_resume_response,
)
from app.tests.helpers.route_paths import (
    GENKIT_COMPANY_CONTEXT,
    GENKIT_COVER_LETTER,
    GENKIT_JOB_ANALYZE_URL,
    GENKIT_KSC,
    GENKIT_RESUME_OPTIMIZE,
)


class TestCoverLetterGeneration:
    """Test cover letter generation endpoints."""

    def test_cover_letter_disabled_returns_503(
        self, client, mock_current_user, mock_genkit_disabled
    ):
        """Test endpoint returns 503 when Genkit is disabled."""
        response = client.post(
            GENKIT_COVER_LETTER,
            json=make_cover_letter_request(),
        )
        assert response.status_code == 503
        assert "disabled" in response.json().get("detail", "").lower()

    @patch("app.api.endpoints.genkit.generate_smart_cover_letter")
    def test_cover_letter_enabled_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test cover letter generation calls Genkit flow when enabled."""
        mock_flow.return_value = make_cover_letter_response()

        response = client.post(
            GENKIT_COVER_LETTER,
            json=make_cover_letter_request(
                candidate_profile={"name": "John Doe"},
                job_description="Python developer",
            ),
        )

        assert response.status_code == 200
        mock_flow.assert_called_once()
        data = response.json()
        assert "letter_content" in data

    def test_cover_letter_missing_fields_returns_422(self, client, mock_current_user):
        """Test validation errors for missing required fields."""
        response = client.post(GENKIT_COVER_LETTER, json={})  # Missing required fields
        assert response.status_code == 422


class TestKSCGeneration:
    """Test KSC (Key Selection Criteria) generation endpoints."""

    def test_ksc_disabled_returns_503(self, client, mock_current_user, mock_genkit_disabled):
        """Test KSC endpoint returns 503 when disabled."""
        response = client.post(
            GENKIT_KSC,
            json=make_ksc_request(),
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
            GENKIT_KSC,
            json=make_ksc_request(
                user_profile_data={"experience": [{"role": "Developer"}]},
                ksc_statement="Team collaboration",
            ),
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
            GENKIT_RESUME_OPTIMIZE,
            json=make_resume_optimization_request(),
        )
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.optimize_resume", new_callable=AsyncMock)
    def test_resume_optimization_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test resume optimization calls Genkit flow."""
        mock_flow.return_value = make_optimized_resume_response()

        response = client.post(
            GENKIT_RESUME_OPTIMIZE,
            json=make_resume_optimization_request(
                resume_text="Software engineer with 5 years experience",
                missing_keywords=["leadership"],
                job_description="Senior Engineer role focused on architecture and leadership.",
            ),
        )

        assert response.status_code == 200
        mock_flow.assert_awaited_once()


class TestJobAnalysis:
    """Test job analysis endpoints."""

    def test_job_analysis_disabled_returns_503(
        self, client, mock_current_user, mock_genkit_disabled
    ):
        """Test job analysis returns 503 when disabled."""
        response = client.post(GENKIT_JOB_ANALYZE_URL, json={"url": "https://example.com/job"})
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.analyze_job_from_url", new_callable=AsyncMock)
    def test_job_analysis_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test job analysis calls Genkit flow."""
        mock_flow.return_value = make_job_analysis_response()

        response = client.post(GENKIT_JOB_ANALYZE_URL, json={"url": "https://example.com/job/123"})

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
            GENKIT_COMPANY_CONTEXT,
            json=make_company_context_request(),
        )
        assert response.status_code == 503

    @patch("app.api.endpoints.genkit.generate_company_context", new_callable=AsyncMock)
    def test_company_context_calls_flow(
        self, mock_flow, client, mock_current_user, mock_genkit_enabled
    ):
        """Test company context generation calls Genkit flow."""
        mock_flow.return_value = make_company_context_response()

        response = client.post(
            GENKIT_COMPANY_CONTEXT,
            json=make_company_context_request(
                job_description="Tech startup role building backend systems.",
            ),
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
            GENKIT_COVER_LETTER,
            json=make_cover_letter_request(candidate_profile={}, job_description="Test"),
        )

        assert response.status_code == 500

    def test_invalid_json_returns_422(self, client, mock_current_user):
        """Test invalid JSON returns validation error."""
        response = client.post(
            GENKIT_COVER_LETTER,
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
        mock_flow.return_value = make_cover_letter_response()

        response = client.post(
            GENKIT_COVER_LETTER,
            json=make_cover_letter_request(candidate_profile={}, job_description="Test"),
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
        mock_flow.return_value = make_job_analysis_response()

        response = client.post(GENKIT_JOB_ANALYZE_URL, json={"url": "https://example.com"})

        assert response.status_code == 200
        data = response.json()
        assert "job_details" in data
        assert "company_context" in data
