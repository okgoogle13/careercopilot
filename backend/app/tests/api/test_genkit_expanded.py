"""Focused tests for Genkit API endpoint behavior."""

from unittest.mock import AsyncMock, patch

from app.api.endpoints import genkit as module
from app.tests.helpers.payload_factories import (
    make_cover_letter_request,
    make_ksc_request,
    make_resume_optimization_request,
)
from app.tests.helpers.response_factories import (
    make_cover_letter_response,
    make_job_analysis_response,
    make_optimized_resume_response,
)
from app.tests.helpers.router_clients import build_module_client


class TestGenerateCoverLetter:
    def test_generate_cover_letter_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module,
                "generate_smart_cover_letter",
                return_value=make_cover_letter_response(
                    letter_content="Test Cover Letter",
                    subject_line="Application",
                    sections=[
                        {
                            "section_name": "Opening",
                            "content": "Intro",
                            "personalization_elements": ["Role"],
                            "key_messages": ["Fit"],
                            "call_to_action": "Talk soon",
                        }
                    ],
                    analysis={
                        "readability_score": 80,
                        "personalization_score": 80,
                        "compelling_score": 80,
                        "keyword_alignment": 80,
                        "strengths": ["Clear"],
                        "improvement_areas": ["Metrics"],
                        "tone_assessment": "professional",
                        "unique_elements": ["Specificity"],
                    },
                    personalization_notes=["Tailored"],
                    key_selling_points=["Python"],
                    company_connections=["Mission fit"],
                    alternative_versions={"brief": "Short"},
                    follow_up_suggestions=["Follow up"],
                ),
            ) as mock_flow,
        ):
            response = build_module_client(module).post(
                "/cover-letter/generate",
                json=make_cover_letter_request(
                    candidate_profile={"name": "John Doe"},
                    job_description="Software Engineer",
                ),
            )

        assert response.status_code == 200
        assert response.json()["letter_content"] == "Test Cover Letter"
        mock_flow.assert_called_once()

    def test_generate_cover_letter_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = build_module_client(module).post(
                "/cover-letter/generate",
                json=make_cover_letter_request(
                    candidate_profile={"name": "John Doe"},
                    job_description="Software Engineer",
                ),
            )

        assert response.status_code == 503
        assert response.json() == {"detail": "Genkit flows are disabled."}

    def test_generate_cover_letter_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "generate_smart_cover_letter", side_effect=Exception("Test Exception")
            ),
        ):
            response = build_module_client(module).post(
                "/cover-letter/generate",
                json=make_cover_letter_request(
                    candidate_profile={"name": "John Doe"},
                    job_description="Software Engineer",
                ),
            )

        assert response.status_code == 500
        assert "Cover letter generation failed" in response.json()["detail"]


class TestGenerateKSC:
    def test_generate_ksc_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module,
                "generateKscResponse",
                AsyncMock(
                    return_value={
                        "situation": "Situation",
                        "task": "Task",
                        "action": "Action",
                        "result": "Result",
                    }
                ),
            ) as mock_flow,
        ):
            response = build_module_client(module).post(
                "/ksc/generate",
                json=make_ksc_request(
                    user_profile_data={"skills": ["Python"]},
                    ksc_statement="Led a team",
                ),
            )

        assert response.status_code == 200
        assert response.json()["result"] == "Result"
        mock_flow.assert_awaited_once()

    def test_generate_ksc_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = build_module_client(module).post(
                "/ksc/generate",
                json=make_ksc_request(
                    user_profile_data={"skills": ["Python"]},
                    ksc_statement="Led a team",
                ),
            )

        assert response.status_code == 503

    def test_generate_ksc_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "generateKscResponse", AsyncMock(side_effect=Exception("Test Exception"))
            ),
        ):
            response = build_module_client(module).post(
                "/ksc/generate",
                json=make_ksc_request(
                    user_profile_data={"skills": ["Python"]},
                    ksc_statement="Led a team",
                ),
            )

        assert response.status_code == 500
        assert "KSC generation failed" in response.json()["detail"]


class TestAnalyzeJobUrl:
    def test_analyze_job_url_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module,
                "analyze_job_from_url",
                AsyncMock(
                    return_value=make_job_analysis_response(
                        job_details={
                            "company_name": "Acme Corp",
                            "role_title": "Test Job",
                            "full_description": "Detailed role description",
                            "essential_criteria": [],
                            "desirable_criteria": [],
                            "subsectors": [],
                            "key_responsibilities": [],
                        }
                    )
                ),
            ) as mock_flow,
        ):
            response = build_module_client(module).post(
                "/job/analyze-url", json={"url": "https://example.com/job"}
            )

        assert response.status_code == 200
        assert response.json()["job_details"]["role_title"] == "Test Job"
        mock_flow.assert_awaited_once()

    def test_analyze_job_url_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = build_module_client(module).post(
                "/job/analyze-url", json={"url": "https://example.com/job"}
            )

        assert response.status_code == 503

    def test_analyze_job_url_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "analyze_job_from_url", AsyncMock(side_effect=Exception("Test Exception"))
            ),
        ):
            response = build_module_client(module).post(
                "/job/analyze-url", json={"url": "https://example.com/job"}
            )

        assert response.status_code == 500
        assert "Job URL analysis failed" in response.json()["detail"]


class TestOptimizeResume:
    def test_optimize_resume_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module,
                "optimize_resume",
                AsyncMock(
                    return_value=make_optimized_resume_response(
                        resume_text="Optimized Resume",
                        keywords_integrated=["Python", "AWS"],
                    )
                ),
            ) as mock_flow,
        ):
            response = build_module_client(module).post(
                "/resume/optimize",
                json=make_resume_optimization_request(
                    resume_text="Experienced software engineer...",
                    missing_keywords=["Python", "AWS"],
                    job_description="Software Engineer",
                ),
            )

        assert response.status_code == 200
        assert response.json()["resume_text"] == "Optimized Resume"
        mock_flow.assert_awaited_once()

    def test_optimize_resume_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = build_module_client(module).post(
                "/resume/optimize",
                json=make_resume_optimization_request(
                    resume_text="Experienced software engineer...",
                    missing_keywords=["Python", "AWS"],
                    job_description="Software Engineer",
                ),
            )

        assert response.status_code == 503

    def test_optimize_resume_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "optimize_resume", AsyncMock(side_effect=Exception("Test Exception"))
            ),
        ):
            response = build_module_client(module).post(
                "/resume/optimize",
                json=make_resume_optimization_request(
                    resume_text="Experienced software engineer...",
                    missing_keywords=["Python", "AWS"],
                    job_description="Software Engineer",
                ),
            )

        assert response.status_code == 500
        assert "Resume optimization failed" in response.json()["detail"]
