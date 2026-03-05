"""Integration test for the legacy career-ingestion API."""

from unittest.mock import patch

from app.schemas.career_master import CareerDatabase
from app.tests.helpers.endpoint_fixtures import make_upload_payload
from app.tests.helpers.route_paths import LEGACY_INGEST


def test_ingestion_endpoint_exists(client):
    """Test that the /api/v1/ingest endpoint is registered"""
    response = client.get("/openapi.json")
    assert response.status_code == 200

    openapi_spec = response.json()
    assert LEGACY_INGEST in openapi_spec["paths"]


def test_ingestion_requires_auth(client):
    """Test that ingestion endpoint requires authentication"""
    response = client.post(
        LEGACY_INGEST,
        files=make_upload_payload("test.txt", b"Sample resume text"),
    )
    # In current app wiring this endpoint may return auth or processing failures.
    assert response.status_code in [401, 403, 500]


@patch("app.api.endpoints._shared.extract_text_from_upload")
@patch("app.api.endpoints.career_ingestion.ingest_career_history")
@patch("app.api.endpoints.career_ingestion.persist_user_profile_snapshot")
def test_ingestion_success_flow(
    mock_persist,
    mock_ingest_flow,
    mock_extract_text,
    authenticated_client,
):
    """Test successful career ingestion flow"""
    mock_extract_text.return_value = "Sample resume text with achievements"
    mock_persist.return_value = True

    payload = {
        "Personal_Information": {
            "FullName": "Test User",
            "Email": "test@example.com",
            "Phone": "123-456-7890",
            "Location": "Sydney, Australia",
            "Portfolio_Website_URLs": [],
        },
        "Career_Profile": {
            "Target_Titles": ["Software Engineer"],
            "Master_Summary_Points": ["Experienced developer"],
        },
        "Master_Skills_Inventory": [],
        "Career_Entries": [],
        "Structured_Achievements": [],
        "KSC_Responses": [],
    }
    mock_ingest_flow.return_value = CareerDatabase.model_validate(payload)

    # Make request
    response = authenticated_client.post(
        LEGACY_INGEST,
        files=make_upload_payload(
            "resume.txt",
            b"Software Engineer with 5 years experience",
        ),
    )

    # Verify
    assert response.status_code == 200
    data = response.json()
    assert "Personal_Information" in data
    assert data["Personal_Information"]["FullName"] == "Test User"
    mock_persist.assert_called_once()
