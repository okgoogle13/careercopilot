"""
Critical path tests for JobsService.
Priority: HIGH - 35% coverage, core service layer
"""

import json
from unittest.mock import AsyncMock, Mock, patch

import pytest
from sqlalchemy.orm import Session

from app.models.user_asset import UserAsset
from app.services.jobs_service import JobsService


@pytest.fixture
def mock_db():
    """Create mock database session."""
    return Mock(spec=Session)


@pytest.fixture
def test_user_asset():
    """Create test user asset."""
    return UserAsset(
        id="asset-123",
        user_id="user-123",
        document_type="resume",
        extracted_data={
            "fullText": "Senior Software Engineer with 5+ years experience in Python and React"
        },
    )


class TestCompareResumeToJob:
    """Test suite for compare_resume_to_job method."""

    @pytest.mark.asyncio
    async def test_compare_resume_to_job_success(self, mock_db, test_user_asset):
        """Test successful resume-to-job comparison."""
        mock_db.query.return_value.filter.return_value.first.return_value = test_user_asset

        job_description = """
        Senior Software Engineer
        Requirements:
        - 5+ years Python experience
        - React expertise
        - System design knowledge
        """

        with (
            patch(
                "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
            ) as mock_analyze,
            patch(
                "app.services.jobs_service.compare_resume_to_job", new_callable=AsyncMock
            ) as mock_compare,
        ):

            mock_analyze.return_value = json.dumps(
                {
                    "title": "Senior Software Engineer",
                    "required_skills": ["Python", "React", "System Design"],
                    "experience_level": "Senior",
                }
            )

            mock_compare.return_value = json.dumps(
                {
                    "match_score": 92,
                    "matched_skills": ["Python", "React"],
                    "missing_skills": ["System Design"],
                    "overall_fit": "Excellent",
                }
            )

            result = await JobsService.compare_resume_to_job(
                mock_db, "user-123", "asset-123", job_description
            )

            assert result["match_score"] == 92
            assert "Python" in result["matched_skills"]

    @pytest.mark.asyncio
    async def test_compare_resume_asset_not_found(self, mock_db):
        """Test error when asset not found."""
        mock_db.query.return_value.filter.return_value.first.return_value = None

        with pytest.raises(Exception):
            await JobsService.compare_resume_to_job(
                mock_db, "user-123", "nonexistent-asset", "job description"
            )

    @pytest.mark.asyncio
    async def test_compare_resume_missing_extracted_text(self, mock_db):
        """Test error when extracted text missing."""
        asset_no_text = UserAsset(
            id="asset-123",
            user_id="user-123",
            document_type="resume",
            extracted_data={},  # No fullText
        )
        mock_db.query.return_value.filter.return_value.first.return_value = asset_no_text

        with pytest.raises(Exception):
            await JobsService.compare_resume_to_job(
                mock_db, "user-123", "asset-123", "job description"
            )

    @pytest.mark.asyncio
    async def test_compare_resume_json_decode_error(self, mock_db, test_user_asset):
        """Test handling of JSON decode error from Genkit."""
        mock_db.query.return_value.filter.return_value.first.return_value = test_user_asset

        with patch(
            "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
        ) as mock_analyze:
            mock_analyze.return_value = "Invalid JSON{{"

            with pytest.raises(Exception):
                await JobsService.compare_resume_to_job(
                    mock_db, "user-123", "asset-123", "job description"
                )

    @pytest.mark.asyncio
    async def test_compare_resume_genkit_timeout(self, mock_db, test_user_asset):
        """Test handling of Genkit timeout."""
        mock_db.query.return_value.filter.return_value.first.return_value = test_user_asset

        with patch(
            "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
        ) as mock_analyze:
            mock_analyze.side_effect = TimeoutError("Genkit timeout")

            with pytest.raises(Exception):
                await JobsService.compare_resume_to_job(
                    mock_db, "user-123", "asset-123", "job description"
                )


class TestJobsServiceIntegration:
    """Integration tests for JobsService."""

    @pytest.mark.asyncio
    async def test_resume_to_job_workflow(self, mock_db, test_user_asset):
        """Test complete resume-to-job matching workflow."""
        mock_db.query.return_value.filter.return_value.first.return_value = test_user_asset

        job_description = "Senior Software Engineer - Python, React, System Design"

        with (
            patch(
                "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
            ) as mock_analyze,
            patch(
                "app.services.jobs_service.compare_resume_to_job", new_callable=AsyncMock
            ) as mock_compare,
        ):

            mock_analyze.return_value = json.dumps(
                {
                    "title": "Senior Software Engineer",
                    "required_skills": ["Python", "React"],
                    "seniority_level": 4,
                }
            )

            mock_compare.return_value = json.dumps(
                {
                    "match_score": 85,
                    "skill_match": 0.9,
                    "experience_match": 0.8,
                    "recommendation": "Strong candidate",
                }
            )

            result = await JobsService.compare_resume_to_job(
                mock_db, "user-123", "asset-123", job_description
            )

            assert result["match_score"] >= 80
            assert result["recommendation"] == "Strong candidate"

    @pytest.mark.asyncio
    async def test_compare_multiple_resumes(self, mock_db):
        """Test comparing multiple resumes to same job."""
        assets = [
            UserAsset(
                id=f"asset-{i}",
                user_id="user-123",
                document_type="resume",
                extracted_data={"fullText": f"Resume {i}"},
            )
            for i in range(3)
        ]

        job_description = "Senior Engineer"
        matches = []

        for asset in assets:
            mock_db.query.return_value.filter.return_value.first.return_value = asset

            with (
                patch(
                    "app.services.jobs_service.analyze_job_description", new_callable=AsyncMock
                ) as mock_analyze,
                patch(
                    "app.services.jobs_service.compare_resume_to_job", new_callable=AsyncMock
                ) as mock_compare,
            ):

                mock_analyze.return_value = json.dumps({"title": "Senior Engineer"})
                mock_compare.return_value = json.dumps({"match_score": 75 + i for i in range(3)})

                result = await JobsService.compare_resume_to_job(
                    mock_db, "user-123", asset.id, job_description
                )
                matches.append(result)

        assert len(matches) == 3
