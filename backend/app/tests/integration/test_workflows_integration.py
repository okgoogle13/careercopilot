from fastapi.testclient import TestClient

from app.main import app


def test_generate_application_endpoint_disabled():
    with TestClient(app) as client:
        response = client.post(
            "/api/workflows/generate-application",
            json={
                "job_description": "x" * 80,
                "user_profile": {"name": "Test User"},
            },
        )
    assert response.status_code == 503


def test_scan_email_opportunities_endpoint_disabled():
    with TestClient(app) as client:
        response = client.post(
            "/api/workflows/scan-email-opportunities",
            json={"user_id": "test-user"},
        )
    assert response.status_code == 503


def test_workflow_health_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/workflows/health")
    assert response.status_code == 200
    body = response.json()
    assert body["service"] == "workflows"
    assert body["components"]["genkit_flows"] == "disabled"


def test_workflow_status_endpoint_not_implemented():
    with TestClient(app) as client:
        response = client.get("/api/workflows/status/abc123")
    assert response.status_code == 501
