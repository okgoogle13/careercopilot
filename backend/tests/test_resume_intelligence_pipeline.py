"""
Tests for the Resume Intelligence Pipeline
"""
from unittest.mock import AsyncMock, MagicMock, PropertyMock, patch

import pytest
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.input_validation import InputValidationError
from app.genkit_flows.resume_intelligence_pipeline import (
    CareerProgressionAnalysis,
    ResumeAnalysisResult,
    SkillsGapAnalysis,
    analyze_career_progression,
    analyze_resume_comprehensive,
    analyze_skills_gap_for_transition,
    gemini_pro,
    generate_resume_intelligence_report,
)

SAMPLE_RESUME = """
John Doe
Senior Software Engineer
San Francisco, CA | johndoe@email.com | (555) 123-4567

SUMMARY
Senior Software Engineer with 8+ years of experience...

EXPERIENCE

Senior Software Engineer
Tech Corp, San Francisco, CA | 2020 - Present
- Led a team of 5 engineers to develop...
- Implemented microservices architecture...
- Reduced API response time by 40%...

EDUCATION
MS in Computer Science
Stanford University | 2015 - 2017

SKILLS
Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes
"""


class TestResumeIntelligencePipeline:
    @pytest.mark.asyncio
    async def test_analyze_resume_comprehensive(self):
        """Test comprehensive resume analysis"""
        # Create a mock response that matches the ResumeAnalysisResult schema
        mock_response = {
            "overall_score": 85,
            "ats_compatibility_score": 90,
            "human_readability_score": 88,
            "impact_score": 82,
            "section_scores": {"experience": 85, "education": 90, "skills": 80},
            "experience_analysis": [],
            "skills_assessment": [],
            "strengths": ["Strong technical skills"],
            "weaknesses": ["Could include more metrics"],
            "missing_elements": ["Quantifiable achievements"],
            "immediate_improvements": ["Add metrics to experience section"],
            "strategic_recommendations": ["Highlight leadership experience more prominently"],
            "industry_alignment": "Good fit for tech industry",
            "competitive_position": "strong",
            "unique_differentiators": ["Diverse skill set across multiple domains"],
            "market_positioning_advice": ["Emphasize technical leadership experience"],
        }

        # Mock the AI model and its methods
        with patch("app.genkit_flows.resume_intelligence_pipeline.gemini_pro") as mock_gemini_pro:
            # Set up the mock to return our response
            mock_gemini_pro.generate.return_value = MagicMock(
                output=MagicMock(return_value=mock_response)
            )

            # Call the function with test data
            result = await analyze_resume_comprehensive(SAMPLE_RESUME)

            # Verify the results
            assert isinstance(result, ResumeAnalysisResult)
            assert result.overall_score == 85
            assert "Strong technical skills" in result.strengths
            assert "Could include more metrics" in result.weaknesses

            # Verify the model was called with the correct parameters
            mock_gemini_pro.generate.assert_called_once()
            args, kwargs = mock_gemini_pro.generate.call_args
            assert "RESUME CONTENT:" in kwargs["prompt"]
            assert "COMPREHENSIVE ANALYSIS REQUIREMENTS:" in kwargs["prompt"]

    @pytest.mark.asyncio
    async def test_analyze_career_progression(self):
        """Test career progression analysis"""
        # Create a mock response that matches the CareerProgressionAnalysis schema
        mock_response = {
            "career_trajectory": "upward",
            "progression_score": 90,
            "title_progression": ["Junior Developer", "Developer", "Senior Developer"],
            "skill_evolution": {"Python": ["Basic", "Intermediate", "Advanced"]},
            "career_gaps": ["1-year gap in 2020"],
            "growth_patterns": ["Consistent skill advancement"],
            "future_trajectory": ["Potential for technical leadership"],
            "positioning_for_advancement": ["Highlight leadership experience"],
        }

        # Mock the AI model and its methods
        with patch("app.genkit_flows.resume_intelligence_pipeline.gemini_pro") as mock_gemini_pro:
            # Set up the mock to return our response
            mock_gemini_pro.generate.return_value = MagicMock(
                output=MagicMock(return_value=mock_response)
            )

            # Call the function with test data
            result = await analyze_career_progression(SAMPLE_RESUME)

            # Verify the results
            assert isinstance(result, CareerProgressionAnalysis)
            assert result.progression_score == 90
            assert "Junior Developer" in result.title_progression
            assert "Consistent skill advancement" in result.growth_patterns

            # Verify the model was called with the correct parameters
            mock_gemini_pro.generate.assert_called_once()

    @pytest.mark.asyncio
    async def test_skills_gap_analysis(self):
        """Test skills gap analysis"""
        # Create a mock response that matches the SkillsGapAnalysis schema
        mock_response = {
            "current_skills": [
                {
                    "skill": "Python",
                    "level": "advanced",
                    "evidence_count": 5,
                    "market_demand": "high",
                    "improvement_potential": "low",
                }
            ],
            "target_role_requirements": ["Cloud Architecture", "DevOps"],
            "skill_gaps": ["Cloud Architecture", "DevOps"],
            "transferable_skills": ["Python", "System Design"],
            "development_priority": ["Cloud Architecture", "Containerization"],
            "learning_resources": ["AWS Certification", "Kubernetes Course"],
            "timeline_estimate": "6-12 months",
            "feasibility_score": 75,
        }

        # Mock the AI model and its methods
        with patch("app.genkit_flows.resume_intelligence_pipeline.gemini_pro") as mock_gemini_pro:
            # Set up the mock to return our response
            mock_gemini_pro.generate.return_value = MagicMock(
                output=MagicMock(return_value=mock_response)
            )

            # Call the function with test data
            result = await analyze_skills_gap_for_transition(
                SAMPLE_RESUME, "Cloud Architect", "Software Development", "Cloud"
            )

            # Verify the results
            assert isinstance(result, SkillsGapAnalysis)
            assert "Cloud Architecture" in result.skill_gaps
            assert "AWS Certification" in result.learning_resources
            assert result.feasibility_score == 75

            # Verify the model was called with the correct parameters
            mock_gemini_pro.generate.assert_called_once()
            args, kwargs = mock_gemini_pro.generate.call_args
            assert "TARGET ROLE: Cloud Architect" in kwargs["prompt"]
            assert "CURRENT INDUSTRY: Software Development" in kwargs["prompt"]

    @pytest.mark.asyncio
    async def test_generate_resume_intelligence_report(self):
        """Test generating a complete resume intelligence report"""
        # Create mock responses for each AI call
        mock_responses = [
            # analyze_resume_comprehensive response
            {
                "overall_score": 85,
                "ats_compatibility_score": 90,
                "human_readability_score": 88,
                "impact_score": 82,
                "section_scores": {"experience": 85, "education": 90, "skills": 80},
                "experience_analysis": [],
                "skills_assessment": [],
                "strengths": ["Strong technical skills"],
                "weaknesses": ["Could include more metrics"],
                "missing_elements": ["Quantifiable achievements"],
                "immediate_improvements": ["Add metrics to experience section"],
                "strategic_recommendations": ["Highlight leadership experience more prominently"],
                "industry_alignment": "Good fit for tech industry",
                "competitive_position": "strong",
                "unique_differentiators": ["Diverse skill set across multiple domains"],
                "market_positioning_advice": ["Emphasize technical leadership experience"],
            },
            # analyze_career_progression response
            {
                "career_trajectory": "upward",
                "progression_score": 90,
                "title_progression": ["Junior Developer", "Developer", "Senior Developer"],
                "skill_evolution": {"Python": ["Basic", "Intermediate", "Advanced"]},
                "career_gaps": ["1-year gap in 2020"],
                "growth_patterns": ["Consistent skill advancement"],
                "future_trajectory": ["Potential for technical leadership"],
                "positioning_for_advancement": ["Highlight leadership experience"],
            },
            # analyze_skills_gap_for_transition response
            {
                "current_skills": [
                    {
                        "skill": "Python",
                        "level": "advanced",
                        "evidence_count": 5,
                        "market_demand": "high",
                        "improvement_potential": "low",
                    }
                ],
                "target_role_requirements": ["Cloud Architecture", "DevOps"],
                "skill_gaps": ["Cloud Architecture", "DevOps"],
                "transferable_skills": ["Python", "System Design"],
                "development_priority": ["Cloud Architecture", "Containerization"],
                "learning_resources": ["AWS Certification", "Kubernetes Course"],
                "timeline_estimate": "6-12 months",
                "feasibility_score": 75,
            },
        ]

        # Mock the AI model to return different responses for each call
        with patch("app.genkit_flows.resume_intelligence_pipeline.gemini_pro") as mock_gemini_pro:
            # Set up the mock to return our responses in sequence
            mock_gemini_pro.generate.side_effect = [
                MagicMock(output=MagicMock(return_value=response)) for response in mock_responses
            ]

            # Call the function with test data
            report = await generate_resume_intelligence_report(
                SAMPLE_RESUME, "Cloud Architect", "Become a cloud architect", "mid_level"
            )

            # Verify the results
            assert report.resume_analysis.overall_score == 85
            assert report.career_analysis.progression_score == 90
            assert "Cloud Architecture" in report.skills_gap.skill_gaps
            assert len(report.thirty_day_action_items) > 0
            assert len(report.ninety_day_strategic_plan) > 0

            # Verify the model was called the expected number of times
            assert mock_gemini_pro.generate.call_count == 3

    @pytest.mark.asyncio
    async def test_error_handling(self):
        """Test error handling in the pipeline"""
        # Mock the AI model to raise an exception
        with patch("app.genkit_flows.resume_intelligence_pipeline.gemini_pro") as mock_gemini_pro:
            # Set up the mock to raise an exception
            mock_gemini_pro.generate.side_effect = Exception("API Error")

            # Test that the function raises the expected exception
            with pytest.raises(AIError) as exc_info:
                await analyze_resume_comprehensive("")

            # Verify the error message is in the exception
            assert "API Error" in str(exc_info.value)

            # Verify the model was called once
            mock_gemini_pro.generate.assert_called_once()

    @pytest.mark.asyncio
    async def test_input_validation(self):
        """Test input validation in the pipeline"""
        # Test empty resume content
        with pytest.raises(InputValidationError):
            await analyze_resume_comprehensive("")

        # Test invalid resume content type
        with pytest.raises(InputValidationError):
            await analyze_resume_comprehensive(123)  # type: ignore
