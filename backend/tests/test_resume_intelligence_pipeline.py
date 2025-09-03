"""
Tests for the Resume Intelligence Pipeline
"""
import asyncio
import json
import os
import sys
from typing import Any, Awaitable, Callable, Dict, List, Optional, Union
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.input_validation import InputValidationError
from app.genkit_flows.resume_intelligence_pipeline import (
    CareerProgressionAnalysis,
    ResumeAnalysisResult,
    ResumeIntelligenceReport,
    SkillsGapAnalysis,
    analyze_career_progression,
    analyze_resume_comprehensive,
    analyze_skills_gap_for_transition,
    generate_resume_intelligence_report,
)

# Mock the genkit and googleai modules
mock_genkit = MagicMock()
mock_googleai = MagicMock()
mock_ai = MagicMock()

# Create a mock for gemini_pro that can be reset
mock_gemini_pro = MagicMock()

# Create a mock for the generate method that returns a MockResponse
mock_gemini_pro.generate = MagicMock()


def mock_error_handler_decorator(*args, **kwargs):
    """Mock the error handler decorator to pass through the function"""

    def decorator(func):
        return func

    return decorator


# Mock response data for testing
MOCK_ANALYSIS_RESPONSE = ResumeAnalysisResult(
    overall_score=85,
    ats_compatibility_score=90,
    human_readability_score=95,
    impact_score=80,
    section_scores={"experience": 90, "education": 85, "skills": 95},
    experience_analysis=[
        {
            "job_title": "Senior Developer",
            "company": "Tech Corp",
            "duration": "2 years",
            "responsibilities": ["Leading a team", "Developing features"],
            "achievements": ["Improved performance by 20%"],
            "skills_demonstrated": ["Python", "Leadership"],
            "impact_score": 8,  # Must be between 1-10
        }
    ],
    skills_assessment=[
        {
            "skill": "Python",
            "level": "advanced",
            "evidence_count": 5,
            "years_experience": 5,
            "market_demand": "high",
            "improvement_potential": "low",
        }
    ],
    strengths=["Strong technical skills"],
    weaknesses=["Could include more metrics"],
    missing_elements=["Quantifiable achievements"],
    immediate_improvements=["Add metrics to experience section"],
    strategic_recommendations=["Highlight leadership experience more prominently"],
    industry_alignment="Good fit for tech industry",
    competitive_position="strong",
    unique_differentiators=["Diverse skill set across multiple domains"],
    market_positioning_advice=["Emphasize technical leadership experience"],
)

MOCK_CAREER_PROGRESSION = CareerProgressionAnalysis(
    career_trajectory="upward",
    progression_score=75,
    title_progression=[
        "Junior Developer",
        "Mid-level Developer",
        "Senior Developer",
        "Lead Developer",
    ],
    skill_evolution={
        "Python": ["Basic", "Intermediate", "Advanced"],
        "Leadership": ["None", "Basic", "Developing"],
    },
    career_gaps=["Limited experience in cloud architecture", "No formal management experience"],
    growth_patterns=[
        "Consistent skill development in technical areas",
        "Increasing leadership responsibilities in recent roles",
    ],
    future_trajectory=[
        "Short-term: Transition to team lead role",
        "Mid-term: Move into engineering management",
        "Long-term: Director of Engineering",
    ],
    positioning_for_advancement=[
        "Highlight leadership experience in current role",
        "Seek mentorship opportunities",
        "Pursue leadership training",
    ],
)

MOCK_SKILLS_GAP = SkillsGapAnalysis(
    current_skills=[
        {
            "skill": "Python",
            "level": "advanced",
            "evidence_count": 5,
            "years_experience": 5,
            "market_demand": "high",
            "improvement_potential": "low",
        }
    ],
    target_role_requirements=["Machine Learning", "Data Analysis", "Python", "Team Leadership"],
    skill_gaps=["Machine Learning", "Data Visualization", "Cloud Architecture"],
    transferable_skills=["Problem Solving", "Project Management", "Team Collaboration"],
    development_priority=[
        "Machine Learning Fundamentals",
        "Data Analysis with Python",
        "Cloud Certifications",
    ],
    learning_recommendations=[
        "Complete a Machine Learning specialization on Coursera",
        "Attend data science meetups and workshops",
        "Work on ML projects to build a portfolio",
    ],
    timeline_estimate="6-12 months",
    feasibility_score=75,
)


# Create a mock response class that can be awaited
class MockResponse:
    def __init__(self, data):
        self._data = data

    async def output(self):
        if isinstance(self._data, Exception):
            raise self._data
        return self._data


# Create a mock model class that returns a MockResponse
class MockModel:
    def __init__(self, response_data=None):
        self._response_data = response_data or MOCK_ANALYSIS_RESPONSE
        self.model = "gemini-1.5-pro"
        self.temperature = 0.2
        self.max_output_tokens = 3000
        self.response_mime_type = "application/json"

    async def generate(self, prompt, **kwargs):
        if isinstance(self._response_data, Exception):
            raise self._response_data
        return MockResponse(self._response_data)


# Mock the AI config
class MockAIConfig:
    def get_model_config(self, model_name):
        return MockModel()


# Create the mock objects
mock_ai_config = MockAIConfig()
mock_gemini_pro = mock_ai_config.get_model_config("gemini-1.5-pro")


# Create a second mock error handler decorator that preserves async/await
def mock_error_handler_decorator_async(*args, **kwargs):
    def decorator(f):
        if asyncio.iscoroutinefunction(f):

            async def async_wrapper(*args, **kwargs):
                try:
                    return await f(*args, **kwargs)
                except Exception as e:
                    raise e

            return async_wrapper
        else:

            def sync_wrapper(*args, **kwargs):
                return f(*args, **kwargs)

            return sync_wrapper

    return decorator


# Patch the modules before importing the pipeline
sys.modules["genkit"] = MagicMock()
sys.modules["googleai"] = MagicMock()


# Now import the pipeline with the mocks in place
def mock_flow(*args, **kwargs):
    def decorator(f):
        return f

    return decorator


def mock_get_ai_config():
    mock_config = MagicMock()
    mock_config.get_model_config.return_value = MockModel()
    return mock_config


# Patch the genkit module
mock_genkit.flow = mock_flow
mock_genkit.get_plugin.return_value = True
mock_genkit.init.return_value = None
mock_genkit.get_ai_config = mock_get_ai_config

# Apply the mocks
sys.modules["genkit"] = mock_genkit
sys.modules["genkit.plugins"] = MagicMock()
sys.modules["genkit.plugins.googleai"] = mock_googleai

# Now import the module under test
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
Tech Company Inc. | 2018 - Present
- Led a team of 5 developers...

EDUCATION
MS in Computer Science
Stanford University | 2015 - 2017

SKILLS
Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes
"""


@pytest.fixture(autouse=True)
def setup_mocks(monkeypatch):
    """Setup common mocks for all tests"""
    # Import the module with our existing mocks
    import app.genkit_flows.resume_intelligence_pipeline as rip
    from app.core.ai_config import get_ai_config

    # Create a fresh mock model for each test
    test_model = MockModel()

    # Mock the get_ai_config function to return our mock model
    def mock_get_ai_config():
        return MagicMock()

    # Patch the module-level references
    monkeypatch.setattr(rip, "gemini_pro", test_model)
    monkeypatch.setattr(rip, "with_ai_error_handling", mock_error_handler_decorator)
    monkeypatch.setattr("app.core.ai_config.get_ai_config", mock_get_ai_config)

    # Mock the Google AI config
    mock_googleai = MagicMock()
    mock_googleai.GenerationConfig.return_value = MagicMock()
    monkeypatch.setattr(rip, "googleai", mock_googleai)

    # Reload the module to apply the mocks
    import importlib

    importlib.reload(rip)

    # Add the test model to the test case for assertions
    rip.test_model = test_model

    # Update the module-level references in the global scope
    globals().update(rip.__dict__)

    # Return the mocks for use in tests
    return {
        "mock_genkit": sys.modules["genkit"],
        "mock_googleai": mock_googleai,
        "mock_gemini_pro": mock_gemini_pro,
        "MockResponse": MockResponse,
        "mock_error_handler": mock_error_handler_decorator,
        "mock_ai_config": mock_ai_config,
    }


@pytest.fixture
def mock_gemini(setup_mocks):
    """Fixture to mock the Gemini model"""
    return setup_mocks["mock_gemini_pro"]


@pytest.fixture
def mock_generate(setup_mocks):
    """Fixture to get the mock generate function"""
    return setup_mocks["mock_generate"]


@pytest.fixture
def mock_error_handler(setup_mocks):
    """Fixture to mock the error handler"""
    return setup_mocks["mock_error_handler"]


class TestResumeIntelligencePipeline:
    """Test cases for the resume intelligence pipeline"""

    @pytest.mark.asyncio
    async def test_analyze_resume_comprehensive(self):
        """Test the analyze_resume_comprehensive function"""
        # Call the function
        result = await analyze_resume_comprehensive(SAMPLE_RESUME)

        # Check the result
        assert isinstance(result, ResumeAnalysisResult)
        assert result.overall_score == MOCK_ANALYSIS_RESPONSE.overall_score
        assert result.ats_compatibility_score == MOCK_ANALYSIS_RESPONSE.ats_compatibility_score
        assert result.human_readability_score == MOCK_ANALYSIS_RESPONSE.human_readability_score
        assert result.impact_score == MOCK_ANALYSIS_RESPONSE.impact_score
        assert result.section_scores == MOCK_ANALYSIS_RESPONSE.section_scores
        assert len(result.strengths) > 0
        assert len(result.weaknesses) > 0

        # Verify the mock was called correctly
        assert mock_gemini_pro.generate.called

        # Verify the error handler was applied
        assert mock_error_handler_decorator.called

    @pytest.mark.asyncio
    async def test_analyze_career_progression(self):
        """Test the analyze_career_progression function"""
        # Update the test model to return career progression data
        import app.genkit_flows.resume_intelligence_pipeline as rip

        rip.test_model._response_data = MOCK_CAREER_PROGRESSION

        # Call the function
        result = await analyze_career_progression(SAMPLE_RESUME)

        # Check the result
        assert isinstance(result, CareerProgressionAnalysis)
        assert result.progression_score == MOCK_CAREER_PROGRESSION.progression_score
        assert result.career_trajectory == MOCK_CAREER_PROGRESSION.career_trajectory
        assert len(result.key_areas_for_growth) > 0
        assert len(result.recommended_actions) > 0

        # Verify the mock was called
        assert mock_gemini_pro.generate.called

    @pytest.mark.asyncio
    async def test_skills_gap_analysis(self):
        """Test skills gap analysis"""
        # Update the test model to return skills gap data
        import app.genkit_flows.resume_intelligence_pipeline as rip

        rip.test_model._response_data = MOCK_SKILLS_GAP
        rip.test_model.generate.return_value = MockResponse(MOCK_SKILLS_GAP)

        # Call the function
        result = await analyze_skills_gap_for_transition(
            resume_content=SAMPLE_RESUME,
            target_role_description="Senior Machine Learning Engineer",
            current_industry="Software Development",
            target_industry="Machine Learning",
        )

        # Check the result
        assert isinstance(result, SkillsGapAnalysis)
        assert result.feasibility_score == MOCK_SKILLS_GAP.feasibility_score
        assert result.timeline_estimate == MOCK_SKILLS_GAP.timeline_estimate

        # Verify the mock was called
        assert mock_gemini_pro.generate.called

    @pytest.mark.asyncio
    async def test_generate_resume_intelligence_report(self):
        """Test generating a complete resume intelligence report"""
        # Setup mock responses
        mock_gemini_pro._response_data = MOCK_ANALYSIS_RESPONSE

        # Call the function with test data
        report = await generate_resume_intelligence_report(SAMPLE_RESUME, "Data Science")

        # Verify the result has the expected structure
        assert isinstance(report, ResumeIntelligenceReport)
        assert report.overall_analysis is not None
        assert report.career_progression is not None
        assert report.skills_gap_analysis is not None

        # Verify the mock was called
        assert mock_gemini_pro.generate.called

    @pytest.mark.asyncio
    async def test_error_handling(self):
        """Test error handling in the pipeline"""
        # Update the test model to raise an error
        import app.genkit_flows.resume_intelligence_pipeline as rip

        rip.test_model._response_data = Exception("API Error")
        rip.test_model.generate.side_effect = Exception("API Error")

        # Test that the function raises an exception
        with pytest.raises(AIError) as exc_info:
            await analyze_resume_comprehensive(SAMPLE_RESUME)

        # Check the error details - the actual error message might be wrapped
        assert "API Error" in str(exc_info.value) or "generation_failed" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_input_validation(self):
        """Test input validation in the pipeline"""
        # Test empty resume content
        with patch('app.genkit_flows.resume_intelligence_pipeline.InputSanitizer.sanitize_text_input') as mock_sanitize:
            mock_sanitize.side_effect = InputValidationError("Resume content is required and must be a string")

            # Test that the validation error is raised
            with pytest.raises(InputValidationError) as exc_info:
                await analyze_resume_comprehensive("")
            
            assert "Resume content is required" in str(exc_info.value)
        
        # Test invalid input type
        with pytest.raises(InputValidationError):
            await analyze_resume_comprehensive(123)  # type: ignore
