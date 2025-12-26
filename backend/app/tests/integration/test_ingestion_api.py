"""
Integration test for Career Ingestion Flow
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, AsyncMock
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_user():
    user = Mock()
    user.uid = "test_user_123"
    user.email = "test@example.com"
    return user

def test_ingestion_endpoint_exists(client):
    """Test that the /api/v1/ingest endpoint is registered"""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    
    openapi_spec = response.json()
    assert "/api/v1/ingest" in openapi_spec["paths"]
    
def test_ingestion_requires_auth(client):
    """Test that ingestion endpoint requires authentication"""
    response = client.post(
        "/api/v1/ingest",
        files={"files": ("test.txt", b"Sample resume text", "text/plain")}
    )
    # Should return 401 or redirect to login
    assert response.status_code in [401, 403]

@patch("app.api.routes.ingestion.get_current_user")
@patch("app.api.routes.ingestion.extract_text_from_upload")
@patch("app.api.routes.ingestion.ingest_career_history")
@patch("app.api.routes.ingestion.user_profile_service")
async def test_ingestion_success_flow(
    mock_profile_service,
    mock_ingest_flow,
    mock_extract_text,
    mock_auth,
    client,
    mock_user
):
    """Test successful career ingestion flow"""
    # Setup mocks
    mock_auth.return_value = mock_user
    mock_extract_text.return_value = "Sample resume text with achievements"
    
    mock_career_db = Mock()
    mock_career_db.model_dump.return_value = {
        "Personal_Information": {
            "FullName": "Test User",
            "Email": "test@example.com",
            "Phone": "123-456-7890",
            "Location": "Sydney, Australia",
            "Portfolio_Website_URLs": []
        },
        "Career_Profile": {
            "Target_Titles": ["Software Engineer"],
            "Master_Summary_Points": ["Experienced developer"]
        },
        "Master_Skills_Inventory": [],
        "Career_Entries": [],
        "Structured_Achievements": [],
        "KSC_Responses": []
    }
    mock_ingest_flow.return_value = mock_career_db
    mock_profile_service.update_user_profile = AsyncMock()
    
    # Make request
    response = client.post(
        "/api/v1/ingest",
        files={"files": ("resume.txt", b"Software Engineer with 5 years experience", "text/plain")}
    )
    
    # Verify
    assert response.status_code == 200
    data = response.json()
    assert "Personal_Information" in data
    assert data["Personal_Information"]["FullName"] == "Test User"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
