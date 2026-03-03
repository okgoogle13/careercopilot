"""
Tests for the Resume Intelligence Pipeline
"""

import asyncio
import functools
import os
import sys
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.core.ai_error_handling import AIError, AIErrorType

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import the pipeline module
import app.genkit_flows.resume_intelligence_pipeline as rip

# Import the pipeline functions and models to test
from app.genkit_flows.resume_intelligence_pipeline import (
    CareerProgressionAnalysis,
    ResumeAnalysisResult,
    SkillsGapAnalysis,
    analyze_career_progression,
    analyze_skills_gap_for_transition,
)

# Test data
SAMPLE_RESUME = """John Doe
Senior Software Engineer

SUMMARY
Experienced Senior Software Engineer with 5+ years of experience in building scalable web applications. Proficient in Python, JavaScript, and cloud technologies.

EXPERIENCE
Senior Software Engineer
ABC Company, San Francisco, CA
Jan 2020 - Present
- Led a team of 5 developers to build a microservices architecture
- Improved application performance by 40% through optimization
- Implemented CI/CD pipeline reducing deployment time by 60%

EDUCATION
B.S. in Computer Science
University of California, Berkeley
2015 - 2019

SKILLS
Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes
"""


class AsyncMockResponse:
    def __init__(self, data):
        self._data = data

    def output(self):
        if isinstance(self._data, Exception):
            raise self._data
        return self._data
    
    async def output_async(self):
        return self.output()
    
    def __await__(self):
        return self.output_async().__await__()


# Simple async mock for the model
class AsyncMockModel:
    def __init__(self, response_data=None):
        self._response_data = response_data or MOCK_ANALYSIS_RESPONSE
        self._generate_called = False
        self._generate_args = None
        self._generate_kwargs = None
        self._call_count = 0
        self._response_class = None

    def set_response(self, data):
        self._response_data = data

        # Create a response wrapper that handles both sync and async output()
        class ResponseWrapper:
            def __init__(self, data):
                self._data = data

            def output(self):
                # Sync output() method
                if hasattr(self._data, "dict"):
                    return self._data
                if callable(self._data):
                    return self._data()
                return self._data

            async def output_async(self):
                # Async output() method
                if hasattr(self._data, "dict"):
                    return self._data
                if asyncio.iscoroutinefunction(self._data):
                    return await self._data()
                if asyncio.iscoroutine(self._data):
                    return await self._data
                if callable(self._data):
                    return self._data()
                return self._data

            # Make output() awaitable if needed
            def __getattribute__(self, name):
                if name == "output" and asyncio.iscoroutinefunction(
                    object.__getattribute__(self, "output_async")
                ):
                    return object.__getattribute__(self, "output_async")
                return object.__getattribute__(self, name)

        self._response_class = ResponseWrapper(data)

    async def generate(self, prompt, **kwargs):
        self._generate_called = True
        self._call_count += 1
        self._generate_args = (prompt,)
        self._generate_kwargs = kwargs

        # Handle error case
        if isinstance(self._response_data, Exception):
            raise self._response_data

        return AsyncMockResponse(self._response_data)

    def assert_generate_called(self):
        assert self._generate_called, "Expected generate() to be called"
        return self

    # Removed duplicate definition of mock_error_handler_decorator
    def assert_generate_called_once(self):
        assert (
            self._call_count == 1
        ), f"Expected generate() to be called once, but was called {self._call_count} times"
        return self

    def assert_generate_called_with(self, *args, **kwargs):
        self.assert_generate_called()
        if args:
            assert self._generate_args == args, f"Expected args {args}, got {self._generate_args}"
        if kwargs:
            for k, v in kwargs.items():
                assert k in self._generate_kwargs, f"Expected kwarg {k} not found"
                assert (
                    self._generate_kwargs[k] == v
                ), f"Expected {k}={v}, got {k}={self._generate_kwargs[k]}"
        return self

    def configure_mock(self, **kwargs):
        if "_response_data" in kwargs:
            self._response_data = kwargs["_response_data"]

    def reset_mock(self):
        self._generate_called = False
        self._generate_args = None
        self._generate_kwargs = None
        self._call_count = 0

    # For compatibility with MagicMock assertion methods
    def assert_called(self):
        return self.assert_generate_called()

    def assert_called_once(self):
        return self.assert_generate_called_once()

    def assert_called_with(self, *args, **kwargs):
        return self.assert_generate_called_with(*args, **kwargs)


# Mock AI Config class
class MockAIConfig:
    """Mock AI configuration"""

    def __init__(self):
        self.model_name = "gemini-pro"
        self.temperature = 0.7
        self.max_tokens = 2048
        self.top_p = 0.9
        self.frequency_penalty = 0.0
        self.presence_penalty = 0.0
        self.stop_sequences = None
        # Add a mock generate method that returns an async response
        self.generate = AsyncMock(return_value=AsyncMockResponse(MOCK_ANALYSIS_RESPONSE))

    def get_model_config(self, model_name):
        # Return a new instance with the same configuration
        config = MockAIConfig()
        config.model_name = model_name
        return config


# Mock the error handler decorator
def mock_error_handler_decorator(*args, **kwargs):
    """Mock the error handler decorator to pass through the function"""

    def decorator(func):
        if asyncio.iscoroutinefunction(func):

            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if isinstance(e, AIError):
                        raise
                    raise AIError(
                        message=f"Comprehensive resume analysis failed: {str(e)}",
                        error_type=AIErrorType.GENERATION_FAILED,
                        original_error=e,
                    )

            return async_wrapper
        else:

            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if isinstance(e, AIError):
                        raise
                    raise AIError(
                        message=f"Comprehensive resume analysis failed: {str(e)}",
                        error_type=AIErrorType.GENERATION_FAILED,
                        original_error=e,
                    )

            return sync_wrapper

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
    progression_score=75,
    career_trajectory="upward",
    title_progression=["Junior Developer", "Developer", "Senior Developer"],
    skill_evolution={
        "Python": ["Basic", "Intermediate", "Advanced"],
        "Docker": ["None", "Basic", "Intermediate"],
    },
    career_gaps=["Gap in 2020"],
    growth_patterns=["Consistent skill improvement"],
    future_trajectory=["Tech Lead", "Engineering Manager"],
    positioning_for_advancement=["Improve leadership skills"],
    key_areas_for_growth=["Cloud Architecture"],
    recommended_actions=["Get AWS Certification"],
)

# Create a mock skills gap analysis
MOCK_SKILLS_GAP_ANALYSIS = SkillsGapAnalysis(
    current_skills=[
        {
            "skill": "Python",
            "level": "advanced",
            "evidence_count": 3,
            "years_experience": 5,
            "market_demand": "high",
            "improvement_potential": "low",
        }
    ],
    target_role_requirements=["Python", "Machine Learning", "Cloud Computing"],
    skill_gaps=["Machine Learning", "Cloud Computing"],
    transferable_skills=["Python", "Data Analysis"],
    development_priority=["Machine Learning", "TensorFlow", "AWS"],
    learning_recommendations=[
        "Complete Machine Learning specialization on Coursera",
        "Build 2-3 ML projects using TensorFlow",
    ],
    timeline_estimate="6-12 months",
    feasibility_score=80,
    positioning_for_advancement=[
        "Highlight leadership experience in current role",
        "Seek mentorship opportunities",
        "Pursue leadership training",
    ],
)

from app.genkit_flows.resume_intelligence_pipeline import ResumeIntelligenceReport

MOCK_INTELLIGENCE_REPORT_RESPONSE = ResumeIntelligenceReport(
    analysis_timestamp="2023-01-01T00:00:00",
    resume_analysis=MOCK_ANALYSIS_RESPONSE,
    career_progression=MOCK_CAREER_PROGRESSION,
    market_readiness=85,
    interview_readiness=80,
    salary_negotiation_strength=75,
    thirty_day_action_items=["Update resume"],
    ninety_day_strategic_plan=["Get certification"],
    success_metrics=["More calls"],
    industry_fit_analysis={"Technology": 95},
    role_recommendations=["Senior Software Engineer"]
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
    target_role_requirements=[
        "Machine Learning",
        "Data Analysis",
        "Python",
        "Team Leadership",
    ],
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


@pytest.fixture
def mock_gemini():
    """Fixture to provide a mock Gemini model with proper async behavior"""

    class MockGeminiModel:
        def __init__(self):
            self.generate_calls = []
            self._response_data = None
            self._raise_exception = None
            self._response_class = None

        def set_response(self, data):
            self._response_data = data
            self._raise_exception = None

            # Create a response object that works with both sync and async code
            class ResponseWrapper:
                def __init__(self, data):
                    self._data = data
                    # If data is a Pydantic model, ensure it has a dict() method
                    if not hasattr(self._data, "dict") and hasattr(self._data, "__dict__"):
                        # For Pydantic v1 and v2 compatibility
                        if hasattr(self._data, "model_dump"):  # Pydantic v2
                            self._data.dict = self._data.model_dump
                        else:  # Pydantic v1
                            self._data.dict = lambda: self._data.__dict__

                def dict(self):
                    # Handle case where data is already a dict or has dict() method
                    if hasattr(self._data, "dict"):
                        return self._data.dict()
                    if hasattr(self._data, "model_dump"):  # Pydantic v2
                        return self._data.model_dump()
                    if isinstance(self._data, dict):
                        return self._data.copy()
                    return self._data

                def output(self):
                    # Return the data directly as Genkit's output() is sync
                    return self._data

                async def output_async(self):
                    return self.output()

                def model_dump(self):
                    return self.dict()

                def model_dump_json(self):
                    if hasattr(self._data, "model_dump_json"):
                        return self._data.model_dump_json()
                    import json
                    return json.dumps(self.dict(), default=str)

                def __eq__(self, other):
                    # Handle comparison with dict or Pydantic model
                    if other is None:
                        return False
                    if isinstance(other, dict):
                        return self.dict() == other
                    if hasattr(other, "dict"):
                        return self.dict() == other.dict()
                    if hasattr(other, "model_dump"):  # Pydantic v2
                        return self.dict() == other.model_dump()
                    return self.dict() == other

            self._response_class = ResponseWrapper(data)

        def set_exception(self, exc):
            self._raise_exception = exc
            self._response_data = None
            self._response_class = None

        async def generate(self, prompt, **kwargs):
            self.generate_calls.append((prompt, kwargs))

            # If we're supposed to raise an exception, do that
            if self._raise_exception is not None:
                raise self._raise_exception

            # If we have a response class, return it
            if self._response_class is not None:
                return self._response_class

            # Fallback to a simple response
            return AsyncMockResponse(self._response_data)

    return MockGeminiModel()


class MockGenerationConfig:
    """Mock GenerationConfig class for testing"""

    def __init__(self, **kwargs):
        self.temperature = kwargs.get("temperature", 0.2)
        self.max_output_tokens = kwargs.get("max_output_tokens", 4000)
        self.top_p = kwargs.get("top_p", 0.95)
        self.top_k = kwargs.get("top_k", 40)
        self.candidate_count = kwargs.get("candidate_count", 1)
        self.stop_sequences = kwargs.get("stop_sequences", None)
        self.presence_penalty = kwargs.get("presence_penalty", 0.0)
        self.frequency_penalty = kwargs.get("frequency_penalty", 0.0)
        # Add response_mime_type to match the actual implementation
        self.response_mime_type = kwargs.get("response_mime_type", "application/json")
        # Set all attributes from kwargs
        self.__dict__.update(kwargs)


class MockGoogleAI:
    """Mock GoogleAI client"""

    def __init__(self, *args, **kwargs):
        self.models = MagicMock()
        self.models.get.return_value = AsyncMockModel()


@pytest.fixture
def mock_googleai(monkeypatch, mock_gemini):
    """Fixture to provide a mock Google AI client and config"""
    # Create a mock for the GoogleAI client
    mock_client = MagicMock()

    # Create a mock for the models attribute
    mock_models = MagicMock()

    # Configure the models.get method to return our mock model
    mock_models.get.return_value = mock_gemini
    mock_client.models = mock_models

    # Create a mock GenerationConfig class
    class MockGoogleAIGenerationConfig:
        def __init__(self, **kwargs):
            self.temperature = kwargs.get("temperature", 0.2)
            self.max_output_tokens = kwargs.get("max_output_tokens", 2048)
            self.response_mime_type = kwargs.get("response_mime_type", "application/json")
            self.top_p = kwargs.get("top_p", 0.95)
            self.top_k = kwargs.get("top_k", 40)
            self.candidate_count = kwargs.get("candidate_count", 1)
            self.stop_sequences = kwargs.get("stop_sequences", None)
            self.presence_penalty = kwargs.get("presence_penalty", 0.0)
            self.frequency_penalty = kwargs.get("frequency_penalty", 0.0)
            # Add any other required attributes here
            self.__dict__.update(kwargs)

    # Create a mock for the googleai module from genkit.plugins
    mock_googleai_module = MagicMock()
    mock_googleai_module.GoogleAI = MagicMock(return_value=mock_client)
    mock_googleai_module.GenerationConfig = MockGoogleAIGenerationConfig

    # Create a mock for the genkit module
    mock_genkit = MagicMock()
    mock_genkit.ai = MagicMock()
    mock_genkit.plugins = MagicMock()
    mock_genkit.plugins.googleai = mock_googleai_module

    # Create a mock for the get_ai_config function
    def mock_get_ai_config():
        mock_config = MagicMock()
        # Configure the mock to return our mock_gemini when get_model_config is called
        mock_config.get_model_config.return_value = mock_gemini
        return mock_config

    # Save the original imports
    import sys

    original_googleai = sys.modules.get("googleai", None)
    original_genkit = sys.modules.get("genkit", None)

    # Create a mock for googleai module
    mock_googleai_root = MagicMock()
    mock_googleai_root.GenerationConfig = MockGoogleAIGenerationConfig

    # Patch the necessary modules and functions
    with (
        patch.dict(
            "sys.modules",
            {
                "googleai": mock_googleai_root,
                "genkit": mock_genkit,
                "genkit.plugins.googleai": mock_googleai_module,
            },
        ),
        patch(
            "app.genkit_flows.resume_intelligence_pipeline.get_ai_config",
            mock_get_ai_config,
        ),
    ):
        # Import the module to apply patches
        pass

        # Remove the module from sys.modules to force a reload
        if "app.genkit_flows.resume_intelligence_pipeline" in sys.modules:
            del sys.modules["app.genkit_flows.resume_intelligence_pipeline"]

        # Import the module fresh
        import sys
        import types

        # Create a new module
        module_name = "app.genkit_flows.resume_intelligence_pipeline"
        if module_name in sys.modules:
            del sys.modules[module_name]

        # Import the module fresh
        module = types.ModuleType(module_name)
        sys.modules[module_name] = module

        # Set up the module with our mocks
        module.googleai = mock_googleai_module
        module.gemini_pro = mock_gemini

        # Import the actual module to get the rest of the functionality
        from importlib import import_module

        actual_module = import_module(module_name)

        # Update the module with actual module's attributes
        for name in dir(actual_module):
            if not name.startswith("__"):
                setattr(module, name, getattr(actual_module, name))

        # Now import it for real
        from app.genkit_flows import resume_intelligence_pipeline

        # Make sure our mocks are in place
        resume_intelligence_pipeline.googleai = mock_googleai_module
        resume_intelligence_pipeline.gemini_pro = mock_gemini

        yield mock_googleai_module

    # Clean up after the test
    if original_googleai is not None:
        sys.modules["googleai"] = original_googleai
    if original_genkit is not None:
        sys.modules["genkit"] = original_genkit


@pytest.fixture
def mock_error_handler(monkeypatch):
    """Fixture to mock the error handler decorator"""
    from app.core import ai_error_handling

    original_handler = ai_error_handling.with_ai_error_handling

    def mock_decorator(*args, **kwargs):
        def decorator(f):
            return f

        return decorator

    monkeypatch.setattr(ai_error_handling, "with_ai_error_handling", mock_decorator)

    try:
        yield mock_decorator
    finally:
        # Restore the original handler
        monkeypatch.setattr(ai_error_handling, "with_ai_error_handling", original_handler)


@pytest.fixture
def mock_ai_config():
    """Fixture to provide a mock AI config"""
    return MockAIConfig()


# Removed duplicate mock_error_handler fixture and invalid placeholder


@pytest.fixture(autouse=True)
def setup_mocks(
    monkeypatch, mock_gemini, mock_googleai, mock_ai_config, mock_error_handler, request
):
    """Set up mocks for the resume intelligence pipeline"""
    # Import the module first to ensure it's in sys.modules
    from app.genkit_flows import resume_intelligence_pipeline as rip
    from app.core import genkit_init

    # Mock get_model to return our mock_gemini
    monkeypatch.setattr(rip, "get_model", lambda: mock_gemini)
    monkeypatch.setattr(genkit_init, "get_model", lambda: mock_gemini)

    # Store original imports and functions
    original_gemini = getattr(rip, "gemini_pro", None)
    original_googleai = getattr(rip, "googleai", None)
    original_error_handler = getattr(rip, "with_ai_error_handling", None)

    # Import the AI config module to patch get_ai_config
    from app.core import ai_config as ai_config_module

    original_get_ai_config = ai_config_module.get_ai_config

    # Create a mock for get_ai_config
    def mock_get_ai_config():
        mock_config = MagicMock()
        mock_config.get_model_config.return_value = mock_ai_config
        return mock_config

    # Patch the imports and functions
    monkeypatch.setattr(rip, "gemini_pro", mock_gemini)
    monkeypatch.setattr(rip, "googleai", mock_googleai)
    monkeypatch.setattr(ai_config_module, "get_ai_config", mock_get_ai_config)
    monkeypatch.setattr(rip, "with_ai_error_handling", mock_error_handler)

    # Clean up after test
    def cleanup():
        if original_gemini is not None:
            monkeypatch.setattr(rip, "gemini_pro", original_gemini)
        if original_googleai is not None:
            monkeypatch.setattr(rip, "googleai", original_googleai)
        if original_error_handler is not None:
            monkeypatch.setattr(rip, "with_ai_error_handling", original_error_handler)

        # Restore original get_ai_config
        monkeypatch.setattr(ai_config_module, "get_ai_config", original_get_ai_config)

        # Reload the module to restore original state

    # No need to reload rip here

    request.addfinalizer(cleanup)

    return {
        "mock_gemini": mock_gemini,
        "mock_googleai": mock_googleai,
        "mock_ai_config": mock_ai_config,
        "mock_error_handler": mock_error_handler,
    }


class TestResumeIntelligencePipeline:
    """Test cases for the resume intelligence pipeline"""

    def _get_exception_chain(self, exc):
        """Helper to get all exceptions in the chain"""
        chain = []
        current = exc
        while current is not None:
            chain.append(current)
            if hasattr(current, "original_error"):
                current = current.original_error
            elif hasattr(current, "__cause__") and current.__cause__ is not None:
                current = current.__cause__
            elif hasattr(current, "__context__") and current.__context__ is not None:
                current = current.__context__
            else:
                current = None
        return chain

    @pytest.mark.asyncio
    async def test_analyze_resume_comprehensive(self, mock_gemini):
        """Test comprehensive resume analysis"""
        # Import the module directly to avoid circular imports
        from app.genkit_flows import resume_intelligence_pipeline

        # Create a copy of the mock response to avoid modifying the original
        expected_response = (
            MOCK_ANALYSIS_RESPONSE.copy()
            if hasattr(MOCK_ANALYSIS_RESPONSE, "copy")
            else MOCK_ANALYSIS_RESPONSE
        )

        # Set the mock response data
        mock_gemini.set_response(expected_response)

        # Call the function
        result = await resume_intelligence_pipeline.analyze_resume_comprehensive(SAMPLE_RESUME)

        # Assert the result matches our mock response
        assert result == expected_response

        # Check the dict representation for Pydantic models
        if hasattr(result, "model_dump"):  # Pydantic v2
            assert result.model_dump() == expected_response.model_dump()
        elif hasattr(result, "dict"):  # Pydantic v1
            assert result.dict() == expected_response.dict()
        else:
            assert result == expected_response

        # Assert the mock was called with the expected arguments
        assert len(mock_gemini.generate_calls) > 0
        assert "John Doe" in mock_gemini.generate_calls[0][0]

        # Get the config from the first call
        call_kwargs = mock_gemini.generate_calls[0][1]
        assert "config" in call_kwargs
        config = call_kwargs["config"]
        if isinstance(config, dict):
            assert config.get("temperature") == 0.2
            assert config.get("max_output_tokens") == 3000
        else:
            assert config.temperature == 0.2
            assert config.max_output_tokens == 3000

    @pytest.mark.asyncio
    async def test_analyze_career_progression(self, mock_gemini):
        """Test career progression analysis"""
        # Create a copy of the mock response to avoid modifying the original
        expected_response = (
            MOCK_CAREER_PROGRESSION.copy()
            if hasattr(MOCK_CAREER_PROGRESSION, "copy")
            else MOCK_CAREER_PROGRESSION
        )

        # Set the expected response data
        mock_gemini.set_response(expected_response)

        # Call the function
        result = await analyze_career_progression(SAMPLE_RESUME)

        # Assert the result matches our mock response
        assert result == expected_response

        # Check the dict representation for Pydantic models
        if hasattr(result, "model_dump"):  # Pydantic v2
            assert result.model_dump() == expected_response.model_dump()
        elif hasattr(result, "dict"):  # Pydantic v1
            assert result.dict() == expected_response.dict()
        else:
            assert result == expected_response

        # Assert the mock was called with the expected arguments
        assert len(mock_gemini.generate_calls) > 0
        assert "John Doe" in mock_gemini.generate_calls[0][0]

    @pytest.mark.asyncio
    async def test_skills_gap_analysis(self, mock_gemini):
        """Test skills gap analysis"""
        # Create a copy of the mock response to avoid modifying the original
        expected_response = (
            MOCK_SKILLS_GAP_ANALYSIS.copy()
            if hasattr(MOCK_SKILLS_GAP_ANALYSIS, "copy")
            else MOCK_SKILLS_GAP_ANALYSIS
        )

        # Set the expected response data
        mock_gemini.set_response(expected_response)

        # Call the function
        result = await analyze_skills_gap_for_transition(
            resume_content=SAMPLE_RESUME,
            target_role_description="Senior Machine Learning Engineer",
            current_industry="Software Development",
            target_industry="Machine Learning",
        )

        # Assert the result matches our mock response
        assert result == expected_response

        # Check the dict representation for Pydantic models
        if hasattr(result, "model_dump"):  # Pydantic v2
            assert result.model_dump() == expected_response.model_dump()
        elif hasattr(result, "dict"):  # Pydantic v1
            assert result.dict() == expected_response.dict()
        else:
            assert result == expected_response

        # Assert the mock was called with the expected arguments
        assert len(mock_gemini.generate_calls) > 0
        assert "John Doe" in mock_gemini.generate_calls[0][0]

    @pytest.mark.asyncio
    async def test_generate_resume_intelligence_report(self, mock_gemini):
        """Test generating a complete resume intelligence report"""
        # Import the module directly to avoid circular imports
        from app.genkit_flows import resume_intelligence_pipeline

        # Use intelligence report response as the main response for the report
        mock_report = MOCK_INTELLIGENCE_REPORT_RESPONSE.copy()

        # Set the mock response data
        mock_gemini.set_response(mock_report)  # Will be used for the report generation

        # Also need to mock the outputs for the parallel tasks, but in this test they
        # will just get whatever the mock is currently set to, which is mock_report.
        # Actually, because there are multiple calls in parallel and then the final report call,
        # we can just use set_response with the report schema because ResponseWrapper handles it,
        # or we might need a more sophisticated mock if types mismatch. For now, try this.

        # Call the function
        result = await resume_intelligence_pipeline.generate_resume_intelligence_report(
            resume_content=SAMPLE_RESUME,
            target_industry="Technology",
            career_goals="Become a senior software architect",
            experience_level="mid_level",
        )

        # We can't do exact match because analysis_timestamp is generated inside the function
        assert result.market_readiness == mock_report.market_readiness
        assert result.thirty_day_action_items == mock_report.thirty_day_action_items

        # Assert the mock was called at least once
        assert len(mock_gemini.generate_calls) >= 1

        # Check that the resume content was included in the calls
        assert "John Doe" in mock_gemini.generate_calls[0][0]  # Analysis call

    @pytest.mark.asyncio
    async def test_error_handling(self, mock_gemini):
        """Test error handling in the pipeline"""
        from app.core.ai_error_handling import AIError
        from app.genkit_flows import resume_intelligence_pipeline

        # Configure the mock to raise an exception
        test_error = ValueError("API Error")
        mock_gemini.set_exception(test_error)

        # Test that the function raises an AIError
        with pytest.raises(AIError) as exc_info:
            await resume_intelligence_pipeline.analyze_resume_comprehensive(SAMPLE_RESUME)

        # Verify the error is wrapped in AIError
        assert isinstance(exc_info.value, AIError)

        # Check that the original error message is in the error chain
        error_chain = self._get_exception_chain(exc_info.value)
        error_messages = [str(e) for e in error_chain]
        assert any("API Error" in msg for msg in error_messages)

    @pytest.mark.asyncio
    async def test_input_validation(self, mock_gemini):
        """Test input validation in the pipeline"""
        from app.core.ai_error_handling import AIError, AIErrorType
        from app.genkit_flows import resume_intelligence_pipeline

        def assert_validation_error(exc):
            """Helper to check for validation error in possibly wrapped exception"""
            if hasattr(exc, "original_error"):
                # Check if the original error is a validation error
                return (
                    "Resume content is required" in str(exc.original_error)
                    or exc.original_error.error_type == AIErrorType.GENERATION_FAILED
                )
            return "Resume content is required" in str(exc)

        # Test empty resume content
        with pytest.raises(AIError) as exc_info:
            await resume_intelligence_pipeline.analyze_resume_comprehensive("")

        # The error should be an AIError, possibly wrapped in retry logic
        assert isinstance(exc_info.value, AIError)
        assert assert_validation_error(exc_info.value)

        # Test whitespace-only resume content
        with pytest.raises(AIError) as exc_info:
            await resume_intelligence_pipeline.analyze_resume_comprehensive("   \n  \t  ")

        # The error should be an AIError, possibly wrapped in retry logic
        assert isinstance(exc_info.value, AIError)
        assert assert_validation_error(exc_info.value)

        # Verify generate was never called (validation should fail first)
        assert (
            len(mock_gemini.generate_calls) == 0
        ), "Generate should not be called for invalid input"
