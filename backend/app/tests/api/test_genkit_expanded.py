"""Focused tests for Genkit API endpoint behavior."""

from unittest.mock import AsyncMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.endpoints import genkit as module


def _client():
    app = FastAPI()
    app.include_router(module.router)
    return TestClient(app)


def _cover_letter_response():
    return {
        "letter_content": "Test Cover Letter",
        "subject_line": "Application",
        "sections": [
            {
                "section_name": "Opening",
                "content": "Intro",
                "personalization_elements": ["Role"],
                "key_messages": ["Fit"],
                "call_to_action": "Talk soon",
            }
        ],
        "analysis": {
            "readability_score": 80,
            "personalization_score": 80,
            "compelling_score": 80,
            "keyword_alignment": 80,
            "strengths": ["Clear"],
            "improvement_areas": ["Metrics"],
            "tone_assessment": "professional",
            "unique_elements": ["Specificity"],
        },
        "personalization_notes": ["Tailored"],
        "key_selling_points": ["Python"],
        "company_connections": ["Mission fit"],
        "alternative_versions": {"brief": "Short"},
        "follow_up_suggestions": ["Follow up"],
    }


def _resume_response():
    return {"resume_text": "Optimized Resume", "keywords_integrated": ["Python", "AWS"]}


def _job_analysis_response():
    return {
        "job_details": {
            "company_name": "Acme Corp",
            "role_title": "Test Job",
            "full_description": "Detailed role description",
            "essential_criteria": [],
            "desirable_criteria": [],
            "subsectors": [],
            "key_responsibilities": [],
        },
        "company_context": None,
        "analysis_success": True,
        "error_message": None,
    }


class TestGenerateCoverLetter:
    def test_generate_cover_letter_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "generate_smart_cover_letter", return_value=_cover_letter_response()
            ) as mock_flow,
        ):
            response = _client().post(
                "/cover-letter/generate",
                json={
                    "candidate_profile": {"name": "John Doe"},
                    "job_description": "Software Engineer",
                },
            )

        assert response.status_code == 200
        assert response.json()["letter_content"] == "Test Cover Letter"
        mock_flow.assert_called_once()

    def test_generate_cover_letter_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = _client().post(
                "/cover-letter/generate",
                json={
                    "candidate_profile": {"name": "John Doe"},
                    "job_description": "Software Engineer",
                },
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
            response = _client().post(
                "/cover-letter/generate",
                json={
                    "candidate_profile": {"name": "John Doe"},
                    "job_description": "Software Engineer",
                },
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
            response = _client().post(
                "/ksc/generate",
                json={
                    "user_profile_data": {"skills": ["Python"]},
                    "ksc_statement": "Led a team",
                },
            )

        assert response.status_code == 200
        assert response.json()["result"] == "Result"
        mock_flow.assert_awaited_once()

    def test_generate_ksc_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = _client().post(
                "/ksc/generate",
                json={
                    "user_profile_data": {"skills": ["Python"]},
                    "ksc_statement": "Led a team",
                },
            )

        assert response.status_code == 503

    def test_generate_ksc_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "generateKscResponse", AsyncMock(side_effect=Exception("Test Exception"))
            ),
        ):
            response = _client().post(
                "/ksc/generate",
                json={
                    "user_profile_data": {"skills": ["Python"]},
                    "ksc_statement": "Led a team",
                },
            )

        assert response.status_code == 500
        assert "KSC generation failed" in response.json()["detail"]


class TestAnalyzeJobUrl:
    def test_analyze_job_url_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "analyze_job_from_url", AsyncMock(return_value=_job_analysis_response())
            ) as mock_flow,
        ):
            response = _client().post("/job/analyze-url", json={"url": "https://example.com/job"})

        assert response.status_code == 200
        assert response.json()["job_details"]["role_title"] == "Test Job"
        mock_flow.assert_awaited_once()

    def test_analyze_job_url_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = _client().post("/job/analyze-url", json={"url": "https://example.com/job"})

        assert response.status_code == 503

    def test_analyze_job_url_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "analyze_job_from_url", AsyncMock(side_effect=Exception("Test Exception"))
            ),
        ):
            response = _client().post("/job/analyze-url", json={"url": "https://example.com/job"})

        assert response.status_code == 500
        assert "Job URL analysis failed" in response.json()["detail"]


class TestOptimizeResume:
    def test_optimize_resume_success(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "optimize_resume", AsyncMock(return_value=_resume_response())
            ) as mock_flow,
        ):
            response = _client().post(
                "/resume/optimize",
                json={
                    "resume_text": "Experienced software engineer...",
                    "missing_keywords": ["Python", "AWS"],
                    "job_description": "Software Engineer",
                },
            )

        assert response.status_code == 200
        assert response.json()["resume_text"] == "Optimized Resume"
        mock_flow.assert_awaited_once()

    def test_optimize_resume_genkit_disabled(self):
        with patch.object(module, "is_genkit_enabled", return_value=False):
            response = _client().post(
                "/resume/optimize",
                json={
                    "resume_text": "Experienced software engineer...",
                    "missing_keywords": ["Python", "AWS"],
                    "job_description": "Software Engineer",
                },
            )

        assert response.status_code == 503

    def test_optimize_resume_exception(self):
        with (
            patch.object(module, "is_genkit_enabled", return_value=True),
            patch.object(
                module, "optimize_resume", AsyncMock(side_effect=Exception("Test Exception"))
            ),
        ):
            response = _client().post(
                "/resume/optimize",
                json={
                    "resume_text": "Experienced software engineer...",
                    "missing_keywords": ["Python", "AWS"],
                    "job_description": "Software Engineer",
                },
            )

        assert response.status_code == 500
        assert "Resume optimization failed" in response.json()["detail"]
