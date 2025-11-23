"""
Integration tests for AI-Powered Career Services API endpoints
"""

from unittest.mock import patch

from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app

client = TestClient(app)


# Mock authentication
def mock_get_current_user():
    return "test_user@example.com"


app.dependency_overrides[get_current_user] = mock_get_current_user

# Test data
SAMPLE_RESUME = """
John Doe
Senior Software Engineer
San Francisco, CA | johndoe@email.com | (555) 123-4567

SUMMARY
Senior Software Engineer with 8+ years of experience...
"""

SAMPLE_JOB_DESCRIPTION = """
We are looking for a Senior Software Engineer with experience in Python and cloud technologies.
Requirements:
- 5+ years of software development experience
- Strong Python skills
- Experience with AWS or GCP
- Bachelor's degree in Computer Science or related field
"""


class TestAIEndpoints:
    def test_analyze_resume_endpoint(self):
        """Test resume analysis endpoint"""
        with patch(
            "app.genkit_flows.resume_intelligence_pipeline.analyze_resume_comprehensive"
        ) as mock_analyze:
            mock_analyze.return_value = {
                "overall_score": 85,
                "ats_compatibility_score": 90,
                "human_readability_score": 88,
                "section_scores": {"experience": 90, "education": 85, "skills": 80},
                "strengths": ["Strong technical skills"],
                "weaknesses": ["Could use more metrics"],
            }

            response = client.post(
                "/api/analysis/resume-intelligence",
                json={"resume_content": SAMPLE_RESUME, "target_industry": "Technology"},
            )

            assert response.status_code == 200
            data = response.json()
            assert data["overall_score"] == 85
            assert "strengths" in data
            assert "weaknesses" in data

    def test_generate_application_package_endpoint(self):
        """Test application package generation endpoint"""
        with patch(
            "app.genkit_flows.career_application_workflow.generate_application_package"
        ) as mock_generate:
            mock_generate.return_value = {
                "success": True,
                "components_generated": ["resume", "cover_letter"],
                "processing_time_seconds": 10.0,
                "resume": {"content": "..."}
            }

            response = client.post(
                "/api/workflows/generate-application",
                json={
                    "job_description": SAMPLE_JOB_DESCRIPTION,
                    "user_profile": {
                        "name": "John Doe",
                        "email": "john@example.com",
                        "resume_content": SAMPLE_RESUME,
                        "skills": [],
                        "experience": []
                    },
                },
            )

            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "data" in data
            assert data["data"]["components_generated"] == ["resume", "cover_letter"]

    # def test_skills_gap_analysis_endpoint(self):
    #     """Test skills gap analysis endpoint"""
    #     with patch(
    #         "app.genkit_flows.resume_intelligence_pipeline.analyze_skills_gap_for_transition"
    #     ) as mock_analyze:
    #         mock_analyze.return_value = {
    #             "skill_gaps": ["Machine Learning", "Data Analysis"],
    #             "transferable_skills": ["Python", "Problem Solving"],
    #             "feasibility_score": 75,
    #         }
    #
    #         response = client.post(
    #             "/api/ai/skills-gap/analyze",
    #             json={
    #                 "resume_content": SAMPLE_RESUME,
    #                 "target_role_description": "Data Scientist",
    #                 "current_industry": "Software Development",
    #                 "target_industry": "Data Science",
    #             },
    #         )
    #
    #         assert response.status_code == 200
    #         data = response.json()
    #         assert "skill_gaps" in data
    #         assert "transferable_skills" in data
    #         assert data["feasibility_score"] == 75

    def test_rate_limiting(self):
        """Test rate limiting on API endpoints"""
        # This test assumes the rate limit is set to 100 requests per minute
        for _ in range(105):  # Exceed rate limit
            response = client.post("/api/analysis/resume-intelligence", json={"resume_content": SAMPLE_RESUME})

            if response.status_code == 429:  # Rate limit exceeded
                break
        else:
            assert False, "Rate limiting not working as expected"

    def test_authentication_required(self):
        """Test that endpoints require authentication"""
        # Clear the auth override for this test
        app.dependency_overrides = {}

        response = client.post("/api/analysis/resume-intelligence", json={"resume_content": SAMPLE_RESUME})

        assert response.status_code == 401  # Unauthorized

        # Restore the auth override
        app.dependency_overrides[get_current_user] = mock_get_current_user
