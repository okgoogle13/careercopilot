"""Integration tests for /workflows — MVP contract."""

from fastapi.testclient import TestClient

from app.main import app


def test_generate_application_requires_auth():
    """Endpoint must reject requests without a valid auth token."""
    with TestClient(app) as client:
        response = client.post(
            "/api/workflows/generate-application",
            json={
                "job_description": "x" * 80,
                "user_profile": {"name": "Test User"},
            },
        )
    assert response.status_code in (401, 403)


def test_workflow_status_requires_auth():
    """Status endpoint must reject unauthenticated requests."""
    with TestClient(app) as client:
        response = client.get("/api/workflows/status/abc123")
    assert response.status_code in (401, 403)


def test_workflow_health_endpoint():
    """Health check returns 200 with available status."""
    with TestClient(app) as client:
        response = client.get("/api/workflows/health")
    assert response.status_code == 200
    body = response.json()
    assert body["service"] == "workflows"
    assert body["status"] == "available"
    assert body["components"]["genkit_flows"] == "available"


def test_generate_application_validates_short_jd():
    """Requests with a short job_description must return 422."""
    with TestClient(app) as client:
        response = client.post(
            "/api/workflows/generate-application",
            json={"job_description": "Too short", "user_profile": {}},
        )
    assert response.status_code == 422
