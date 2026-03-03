import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.dependencies import get_current_user

# Mock authentication
async def mock_get_current_user():
    return {"id": "test_user_id"}

app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

def test_get_analysis_data_success():
    """Test retrieving analysis data for the dashboard."""
    response = client.get("/api/analysis/")
    assert response.status_code == 200
    data = response.json()
    assert "atsScoreHistory" in data
    assert "applicationStatus" in data
    assert data["matchedKeywords"] == ["Python", "FastAPI"]

@pytest.mark.asyncio
async def test_optimize_resume_endpoint_missing_text():
    """Test resume optimization with missing resume text (should fail)."""
    payload = {
        "job_description": "We need a Python developer.",
        "company_url": "https://example.com"
    }
    response = client.post("/api/analysis/optimize-resume", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Resume text required"

def test_optimize_resume_endpoint_success(monkeypatch):
    """Test successful resume optimization with mocked Genkit flow."""
    from app.api.endpoints.analysis import optimize_resume
    
    class MockResult:
        resume_text = "Optimized Resume Content"

    async def mock_optimize(*args, **kwargs):
        return MockResult()

    monkeypatch.setattr("app.api.endpoints.analysis.optimize_resume", mock_optimize)

    payload = {
        "job_description": "We need a Python developer.",
        "resume_text": "Original Resume"
    }
    response = client.post("/api/analysis/optimize-resume", json=payload)
    assert response.status_code == 200
    assert response.json()["optimized_text"] == "Optimized Resume Content"
