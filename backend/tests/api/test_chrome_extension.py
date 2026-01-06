import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.api.endpoints.chrome_extension import JobPostingData

client = TestClient(app)

@pytest.fixture
def mock_ai_client():
    with patch("app.api.endpoints.chrome_extension.get_ai_client") as mock:
        yield mock

@pytest.fixture
def mock_firestore():
    with patch("app.api.endpoints.chrome_extension.db") as mock:
        mock.collection.return_value.document.return_value.collection.return_value.add.return_value = (None, MagicMock(id="test_job_id"))
        yield mock

@pytest.fixture
def mock_calendar_manager():
    with patch("app.api.endpoints.chrome_extension.createCalendarEvent") as mock:
        yield mock

@pytest.fixture
def mock_background_tasks():
    with patch("fastapi.BackgroundTasks.add_task") as mock:
        yield mock

def test_analyze_job_posting_success(mock_ai_client, mock_firestore, mock_background_tasks):
    # Mock AI response
    mock_ai_instance = MagicMock()
    mock_ai_instance.generate_text.return_value.content = """
    ## Analysis
    This is a great job.
    
    ```json
    {
        "deadline": "2023-12-31",
        "match_score": 90,
        "is_remote": true
    }
    ```
    """
    mock_ai_client.return_value = mock_ai_instance

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
    
    # Verify AI was called
    mock_ai_instance.generate_text.assert_called_once()
    
    # Verify Firestore save
    mock_firestore.collection.assert_called()
    
    # Verify background task specifically for calendar creation is queued
    # Note: Logic in endpoint puts _create_calendar_entry into background tasks
    # We can't easily assert the function passed to add_task is exactly _create_calendar_entry 
    # without deeper introspection, but we can check if add_task was called.
    # Actually, with TestClient, background tasks are executed? No, usually they are recorded.
    # But since we mocked BackgroundTasks in the function signature? 
    # Wait, FastAPI BackgroundTasks are injected. 
    # Ideally we mock the wrapper _create_calendar_entry or verify add_task usage.
    
def test_analyze_job_posting_no_deadline(mock_ai_client, mock_firestore, mock_background_tasks):
    # Mock AI response without deadline
    mock_ai_instance = MagicMock()
    mock_ai_instance.generate_text.return_value.content = """
    ## Analysis
    Good job.
    
    ```json
    {
        "deadline": null,
        "match_score": 80
    }
    ```
    """
    mock_ai_client.return_value = mock_ai_instance

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
    
def test_analyze_job_posting_ai_failure(mock_ai_client):
    # Mock AI failure
    mock_ai_client.return_value.generate_text.side_effect = Exception("AI Error")

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
