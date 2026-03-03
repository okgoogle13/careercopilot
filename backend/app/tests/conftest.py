import os
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient


def pytest_configure(config):
    """
    Configure pytest before test collection.
    Sets up environment variables and clears Prometheus registry.
    """
    # Set up test environment variables BEFORE any module imports
    os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-testing-only")
    os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only")
    os.environ.setdefault("ENV", "test")
    os.environ.setdefault("ENVIRONMENT", "test")
    os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
    os.environ.setdefault("ENABLE_GENKIT_FLOWS", "false")

    # Clear Prometheus registry to avoid duplicate metrics
    try:
        from prometheus_client import REGISTRY

        # Get all collectors to remove
        collectors = list(REGISTRY._collector_to_names.keys())
        for collector in collectors:
            try:
                REGISTRY.unregister(collector)
            except Exception:
                pass  # Ignore if already unregistered
    except ImportError:
        pass  # Prometheus not installed


@pytest.fixture(autouse=True)
def setup_test_env(monkeypatch):
    """
    Automatically set up test environment for all tests.
    This runs before each test.
    """
    # Ensure environment variables are set for each test
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret-key-for-testing-only")
    monkeypatch.setenv("SECRET_KEY", "test-secret-key-for-testing-only")
    monkeypatch.setenv("ENV", "test")
    monkeypatch.setenv("ENVIRONMENT", "test")
    monkeypatch.setenv("ENABLE_GENKIT_FLOWS", "false")


@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    return MagicMock()


@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    from types import SimpleNamespace
    return lambda: SimpleNamespace(id="test_user_id", uid="test_user_id", email="test@example.com")


@pytest.fixture
def client(monkeypatch, mock_db, mock_get_current_user):
    """Sync test client for the app with mocked dependencies."""
    # Import here to ensure environment is set up first
    from app.core import db as db_module
    from app.core.dependencies import get_current_user
    from app.main import app

    # Monkeypatch the db variable in the db module
    monkeypatch.setattr(db_module, "db", mock_db)

    # Also patch the user_profile_service db instance
    from app.services.user_profile_service import user_profile_service
    user_profile_service.db = mock_db

    app.dependency_overrides[get_current_user] = mock_get_current_user

    with TestClient(app) as tc:
        yield tc

    app.dependency_overrides.clear()


# --- Shared Test Data Fixtures ---

@pytest.fixture
def sample_resume_text() -> str:
    """Mock resume text for testing."""
    return """
    Jane Doe
    Software Engineer with 5 years of experience.
    Expert in Python, React, and AWS.
    Built various scalable applications using microservices architecture.
    """


@pytest.fixture
def sample_job_description() -> str:
    """Mock job description for testing."""
    return """
    Senior Software Engineer
    5+ years experience required.
    Core skills: Python, React, Docker, AWS.
    Experience with system design is a plus.
    """


@pytest.fixture
def mock_job_requirements():
    """Mock JobRequirements instance."""
    from app.genkit_flows.extract_job_requirements import JobRequirements
    return JobRequirements(
        requiredSkills=["Python", "React", "AWS", "Docker"],
        preferredSkills=["System Design"],
        experienceLevel="Senior",
    )


@pytest.fixture
def mock_resume_entities():
    """Mock ResumeEntities instance."""
    from app.genkit_flows.extract_resume_entities import ResumeEntities
    return ResumeEntities(
        skills=["Python", "React", "AWS", "JavaScript"],
        experience=[{"title": "Software Engineer", "duration": "5 years"}],
        education=[{"degree": "BS Computer Science"}],
    )


@pytest.fixture(autouse=True)
def mock_genkit_model(monkeypatch):
    """Mock Genkit model to return predictable responses in tests."""
    from unittest.mock import AsyncMock

    class MockResponse:
        def __init__(self, data):
            self.data = data
        def output(self):
            return self.data

    class MockModel:
        async def generate(self, prompt: str, **kwargs):
            # Default mock responses based on prompt keywords or just a generic one
            # Convert prompt to string if it's not
            prompt_str = str(prompt)
            if "job_description_analysis" in prompt_str:
                return MockResponse({
                    "title": "Mocked Senior Software Engineer",
                    "company": "Mocked Tech Corp",
                    "location": "Mocked City, Remote",
                    "summary": "A mocked job analysis for testing purposes.",
                    "key_requirements": ["Mocked Req 1", "Mocked Req 2"],
                    "technical_skills": ["Python", "Pytest", "Mocking"],
                    "soft_skills": ["Communication", "Problem Solving"],
                    "experience_level": "Senior",
                    "match_score": 85
                })
            elif "resume_comparison" in prompt_str or "compare_resume_to_job" in prompt_str:
                return MockResponse({
                    "overall_match_score": 90,
                    "relevance_score": 92,
                    "skill_alignment_score": 88,
                    "experience_alignment_score": 90,
                    "justification": "The candidate's skills are a mocked strong match.",
                    "missing_skills": ["None"],
                    "recommendations": ["Hire immediately (mocked)"]
                })
            
            # Default fallback for any other prompt
            return MockResponse({"mocked_response": "Generic mocked AI response"})

    mock_model = MockModel()
    
    # Patch get_model in all relevant places
    import app.core.genkit_init
    monkeypatch.setattr(app.core.genkit_init, "get_model", lambda: mock_model)
    
    return mock_model
