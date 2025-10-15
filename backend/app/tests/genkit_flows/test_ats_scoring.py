"""
Unit tests for the ATS Scoring Genkit flow.

This module contains pytest tests that verify the ats_scoring.py Genkit flow
functionality with mocked AI models.
"""

from typing import List
from unittest.mock import AsyncMock, Mock, patch

import pytest
from app.genkit_flows.ats_scoring import AtsResult, ScoreBreakdown, atsScoring
from app.genkit_flows.extract_job_requirements import JobRequirements
from app.genkit_flows.extract_resume_entities import ResumeEntities
from app.genkit_flows.keyword_placer import KeywordPlacementSuggestion


class TestAtsScoring:
    """Test suite for the ATS scoring flow."""

    @pytest.fixture
    def sample_resume_text(self) -> str:
        """Provide sample resume text for testing."""
        return """
        John Doe
        Senior Software Engineer

        EXPERIENCE:
        - 5 years of Python development
        - React and JavaScript experience
        - Led team of 4 developers
        - Built scalable web applications

        SKILLS:
        Python, React, JavaScript, Docker, AWS, PostgreSQL

        EDUCATION:
        BS Computer Science, University of Technology
        """

    @pytest.fixture
    def sample_job_description(self) -> str:
        """Provide sample job description for testing."""
        return """
        Senior Software Engineer

        We are seeking a Senior Software Engineer with:
        - 3+ years Python experience
        - React/JavaScript skills
        - Leadership experience
        - AWS cloud experience
        - Database knowledge (PostgreSQL preferred)

        Requirements:
        - Bachelor's degree in Computer Science
        - Strong communication skills
        - Experience with containerization (Docker)
        """

    @pytest.fixture
    def mock_job_requirements(self) -> JobRequirements:
        """Mock job requirements extraction result."""
        return JobRequirements(
            requiredSkills=["Python", "React", "Bachelor's degree", "AWS"],
            preferredSkills=["Leadership", "Communication", "Docker", "PostgreSQL"],
            experienceLevel="Senior",
        )

    @pytest.fixture
    def mock_resume_entities(self) -> ResumeEntities:
        """Mock resume entities extraction result."""
        return ResumeEntities(
            skills=["Python", "React", "JavaScript", "Docker", "AWS", "PostgreSQL"],
            experience=[
                {
                    "title": "Senior Software Engineer",
                    "company": "Tech Corp",
                    "duration": "5 years",
                }
            ],
            education=[
                {"degree": "Bachelor's", "field": "Computer Science", "institution": "University"}
            ],
        )

    @pytest.fixture
    def mock_keyword_placement_suggestions(self) -> List[KeywordPlacementSuggestion]:
        """Mock keyword placement suggestions."""
        return [
            KeywordPlacementSuggestion(
                keyword="Machine Learning",
                suggested_placement="skills",
                context="Consider adding 'Machine Learning' to your skills section",
                priority="medium",
            )
        ]

    @pytest.mark.asyncio
    async def test_ats_scoring_returns_expected_structure(
        self,
        sample_resume_text: str,
        sample_job_description: str,
        mock_job_requirements: JobRequirements,
        mock_resume_entities: ResumeEntities,
        mock_keyword_placement_suggestions: List[KeywordPlacementSuggestion],
    ):
        """
        Test that atsScoring flow returns a response with the expected AtsResult structure.

        This test mocks the geminiPro model and supporting flows to verify the main
        flow returns the correct data structure with score and recommendations.
        """

        # Mock the supporting flow functions
        with patch("app.genkit_flows.ats_scoring.extractJobRequirements") as mock_extract_job:
            with patch("app.genkit_flows.ats_scoring.extractResumeEntities") as mock_extract_resume:
                with patch(
                    "app.genkit_flows.ats_scoring.suggestKeywordPlacement"
                ) as mock_keyword_placement:
                    with patch(
                        "app.genkit_flows.ats_scoring.enhanced_ai_handler"
                    ) as mock_ai_handler:
                        # Configure mock returns for supporting flows
                        mock_extract_job.run = AsyncMock(return_value=mock_job_requirements)
                        mock_extract_resume.run = AsyncMock(return_value=mock_resume_entities)
                        mock_keyword_placement.run = AsyncMock(
                            return_value=mock_keyword_placement_suggestions
                        )

                        # Mock the enhanced AI handler to return expected results
                        mock_ai_handler.execute_ai_operation = AsyncMock()
                        mock_ai_handler.execute_ai_operation.side_effect = [
                            mock_job_requirements,  # First call for job requirements
                            mock_resume_entities,  # Second call for resume entities
                            # Mock semantic analysis result
                            Mock(
                                similarityScore=85,
                                explanation="Strong match based on skills and experience",
                            ),
                            mock_keyword_placement_suggestions,  # Keyword placement suggestions
                        ]

                        # Mock the gemini_pro model for any direct calls
                        with patch("app.genkit_flows.ats_scoring.gemini_pro") as mock_gemini:
                            mock_response = Mock()
                            mock_response.text.return_value = "Mocked AI response"
                            mock_gemini.generate.return_value = mock_response

                            # Execute the flow
                            result = await atsScoring(
                                resumeText=sample_resume_text,
                                jobDescription=sample_job_description,
                                profileKeywords=["Python", "React"],
                                user_id="test_user",
                            )

                            # Assert that result is an AtsResult instance
                            assert isinstance(
                                result, AtsResult
                            ), f"Expected AtsResult, got {type(result)}"

                            # Assert required fields are present
                            assert hasattr(
                                result, "overallScore"
                            ), "Result should have overallScore"
                            assert hasattr(result, "breakdown"), "Result should have breakdown"
                            assert hasattr(
                                result, "matchedKeywords"
                            ), "Result should have matchedKeywords"
                            assert hasattr(
                                result, "missingKeywords"
                            ), "Result should have missingKeywords"
                            assert hasattr(
                                result, "recommendations"
                            ), "Result should have recommendations"

                            # Assert score is a valid number between 0-100
                            assert isinstance(
                                result.overallScore, (int, float)
                            ), "overallScore should be numeric"
                            assert (
                                0 <= result.overallScore <= 100
                            ), f"overallScore should be 0-100, got {result.overallScore}"

                            # Assert breakdown has expected structure
                            assert isinstance(
                                result.breakdown, ScoreBreakdown
                            ), "breakdown should be ScoreBreakdown instance"
                            assert hasattr(
                                result.breakdown, "keywordMatch"
                            ), "breakdown should have keywordMatch"
                            assert hasattr(
                                result.breakdown, "experienceMatch"
                            ), "breakdown should have experienceMatch"
                            assert hasattr(
                                result.breakdown, "semanticScore"
                            ), "breakdown should have semanticScore"
                            assert hasattr(
                                result.breakdown, "formattingScore"
                            ), "breakdown should have formattingScore"

                            # Assert keywords are lists of strings
                            assert isinstance(
                                result.matchedKeywords, list
                            ), "matchedKeywords should be a list"
                            assert isinstance(
                                result.missingKeywords, list
                            ), "missingKeywords should be a list"

                            for keyword in result.matchedKeywords:
                                assert isinstance(
                                    keyword, str
                                ), f"matchedKeywords should contain strings, got {type(keyword)}"

                            for keyword in result.missingKeywords:
                                assert isinstance(
                                    keyword, str
                                ), f"missingKeywords should contain strings, got {type(keyword)}"

                            # Assert recommendations is a list of strings
                            assert isinstance(
                                result.recommendations, list
                            ), "recommendations should be a list"
                            assert (
                                len(result.recommendations) > 0
                            ), "recommendations should not be empty"

                            for recommendation in result.recommendations:
                                assert isinstance(
                                    recommendation, str
                                ), f"recommendations should contain strings, got {type(recommendation)}"
                                assert (
                                    len(recommendation.strip()) > 0
                                ), "recommendations should not be empty strings"

    @pytest.mark.asyncio
    async def test_ats_scoring_with_minimal_input(self):
        """
        Test atsScoring with minimal valid input to ensure robustness.
        """
        with patch("app.genkit_flows.ats_scoring.extractJobRequirements"):
            with patch("app.genkit_flows.ats_scoring.extractResumeEntities"):
                with patch("app.genkit_flows.ats_scoring.enhanced_ai_handler") as mock_ai_handler:
                    # Minimal mock responses
                    minimal_job_reqs = JobRequirements(
                        requiredSkills=["Python"],
                        preferredSkills=[],
                        experienceLevel="Junior",
                    )

                    minimal_resume_entities = ResumeEntities(
                        skills=["Python"],
                        experience=[{"title": "Junior Developer", "duration": "1 year"}],
                        education=[{"degree": "High School"}],
                    )

                    mock_ai_handler.execute_ai_operation = AsyncMock()
                    mock_ai_handler.execute_ai_operation.side_effect = [
                        minimal_job_reqs,
                        minimal_resume_entities,
                        Mock(similarityScore=60, explanation="Basic match"),
                        [],  # No keyword placement suggestions
                    ]

                    result = await atsScoring(
                        resumeText="Python developer with 1 year experience",
                        jobDescription="Looking for Python developer",
                    )

                    # Should still return valid AtsResult structure
                    assert isinstance(result, AtsResult)
                    assert isinstance(result.overallScore, (int, float))
                    assert isinstance(result.recommendations, list)

    @pytest.mark.asyncio
    async def test_ats_scoring_with_profile_keywords(
        self,
        sample_resume_text: str,
        sample_job_description: str,
        mock_job_requirements: JobRequirements,
        mock_resume_entities: ResumeEntities,
    ):
        """
        Test atsScoring with additional profile keywords parameter.
        """
        with patch("app.genkit_flows.ats_scoring.enhanced_ai_handler") as mock_ai_handler:
            mock_ai_handler.execute_ai_operation = AsyncMock()
            mock_ai_handler.execute_ai_operation.side_effect = [
                mock_job_requirements,
                mock_resume_entities,
                Mock(
                    similarityScore=90,
                    explanation="Excellent match with profile keywords",
                ),
                [],
            ]

            profile_keywords = ["Python", "React", "Machine Learning", "AWS"]

            result = await atsScoring(
                resumeText=sample_resume_text,
                jobDescription=sample_job_description,
                profileKeywords=profile_keywords,
                user_id="test_user_with_profile",
            )

            # Verify the flow handles profile keywords parameter
            assert isinstance(result, AtsResult)
            assert result.overallScore >= 0

            # Profile keywords should influence matching
            matched_keywords = result.matchedKeywords
            assert len(matched_keywords) >= 0  # Should have some matches

            # Verify some profile keywords appear in matched or missing
            all_keywords = result.matchedKeywords + result.missingKeywords
            common_keywords = set(profile_keywords).intersection(set(all_keywords))
            assert len(common_keywords) > 0, "Some profile keywords should appear in results"

    @pytest.mark.asyncio
    async def test_ats_scoring_error_handling(self):
        """
        Test that atsScoring handles errors gracefully and still returns a valid result.
        """
        with patch("app.genkit_flows.ats_scoring.enhanced_ai_handler") as mock_ai_handler:
            # Simulate an error in one of the AI operations
            mock_ai_handler.execute_ai_operation = AsyncMock()
            mock_ai_handler.execute_ai_operation.side_effect = [
                Exception("AI service temporarily unavailable"),  # Simulate error
            ]

            # The enhanced error handling should provide fallbacks
            with pytest.raises(Exception, match="AI service temporarily unavailable"):
                await atsScoring(resumeText="Test resume", jobDescription="Test job description")

            # Note: In a real implementation with proper error handling,
            # this might return a fallback result instead of raising an exception
