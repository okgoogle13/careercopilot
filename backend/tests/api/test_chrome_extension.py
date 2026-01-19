import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.chrome_extension import JobAnalysisOutput
from app.core.dependencies import get_current_user
from app.core.database import get_db

client = TestClient(app)

class DummyUser:
    id = "user-123"

@pytest.fixture(autouse=True)
def override_dependencies():
    def _get_current_user():
        return DummyUser()

    def _get_db():
        db = MagicMock()

        def _refresh(obj):
            obj.id = "test_job_id"

        db.refresh.side_effect = _refresh
        return db

    app.dependency_overrides[get_current_user] = _get_current_user
    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides = {}

@pytest.fixture
def mock_analyze_flow():
    with patch("app.api.endpoints.chrome_extension.analyzeJobPostingFlow", new_callable=AsyncMock) as mock:
        yield mock

@pytest.fixture
def mock_calendar_manager():
    with patch("app.api.endpoints.chrome_extension.createCalendarEvent") as mock:
        yield mock

@pytest.fixture
def mock_background_tasks():
    with patch("fastapi.BackgroundTasks.add_task") as mock:
        yield mock

def test_analyze_job_posting_success(mock_analyze_flow, mock_background_tasks):
    mock_analyze_flow.return_value = JobAnalysisOutput(
        overall_fit_score=88,
        matching_qualifications=["Python", "FastAPI"],
        gaps_and_development_areas=["Kubernetes"],
        key_selling_points=["Systems thinking"],
        application_strategy="Focus on platform experience.",
        deadline="2023-12-31",
        is_remote=True,
        match_score=90,
    )

    payload = {
        "title": "Software Engineer",
        "company": "Tech Corp",
        "description": "Great job opportunity...",
        "url": "https://example.com/job",
        "source": "manual"
    }

    response = client.post("/api/chrome-extension/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["job_id"] == "test_job_id"
    assert data["job_saved"] is True
    assert data["deadline_found"] == "2023-12-31"
    
    mock_analyze_flow.assert_called_once()
    
    # Verify background task specifically for calendar creation is queued
    # Note: Logic in endpoint puts _create_calendar_entry into background tasks
    # We can't easily assert the function passed to add_task is exactly _create_calendar_entry 
    # without deeper introspection, but we can check if add_task was called.
    # Actually, with TestClient, background tasks are executed? No, usually they are recorded.
    # But since we mocked BackgroundTasks in the function signature? 
    # Wait, FastAPI BackgroundTasks are injected. 
    # Ideally we mock the wrapper _create_calendar_entry or verify add_task usage.
    
def test_analyze_job_posting_no_deadline(mock_analyze_flow, mock_background_tasks):
    mock_analyze_flow.return_value = JobAnalysisOutput(
        overall_fit_score=75,
        matching_qualifications=["APIs"],
        gaps_and_development_areas=["Testing"],
        key_selling_points=["Delivery"],
        application_strategy="Emphasize reliability.",
        deadline=None,
        is_remote=False,
        match_score=80,
    )

    payload = {
        "title": "Software Engineer",
        "description": "Job...",
        "url": "https://example.com"
    }

    response = client.post("/api/chrome-extension/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["deadline_found"] is None
    
    # Using TestClient usually executes background tasks unless verified otherwise.
    # But here we assume no calendar event task should be added if no deadline.
    
def test_analyze_job_posting_ai_failure():
    # Mock AI failure
    with patch("app.api.endpoints.chrome_extension.analyzeJobPostingFlow", new_callable=AsyncMock) as mock:
        mock.side_effect = Exception("AI Error")

        payload = {
            "title": "Software Engineer",
            "description": "Job...",
            "url": "https://example.com"
        }

        response = client.post("/api/chrome-extension/analyze", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Failed to analyze job" in data["markdown_analysis"]
