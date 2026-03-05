"""Tests for /applications API endpoints."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.dependencies import get_current_user

    # Using integer ID as Application model likely expects it for user_id
    mock_user = SimpleNamespace(id=1, uid="test_uid", email="test@example.com", name="Test User")
    client.app.dependency_overrides[get_current_user] = lambda: mock_user
    yield client


class TestApplicationsEndpoints:
    def test_create_application_happy_path(self, auth_client):
        """Should create a new application in the DB."""
        response = auth_client.post(
            "/api/applications/",
            json={
                "role_title": "Software Engineer",
                "company_name": "Acme Corp",
                "status": "applied",
                "applied_at": "2024-03-05T12:00:00",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["role_title"] == "Software Engineer"
        assert data["company_name"] == "Acme Corp"
        assert "id" in data

    def test_get_all_applications(self, auth_client):
        """Should return a list of applications for current user."""
        # Create two applications
        auth_client.post("/api/applications/", json={"role_title": "Job 1", "company_name": "A"})
        auth_client.post("/api/applications/", json={"role_title": "Job 2", "company_name": "B"})

        response = auth_client.get("/api/applications/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
        titles = [app["role_title"] for app in data]
        assert "Job 1" in titles
        assert "Job 2" in titles

    def test_get_single_application(self, auth_client):
        """Should retrieve a specific application by ID."""
        create_res = auth_client.post(
            "/api/applications/", json={"role_title": "FindMe", "company_name": "X"}
        )
        app_id = create_res.json()["id"]

        response = auth_client.get(f"/api/applications/{app_id}")
        assert response.status_code == 200
        assert response.json()["role_title"] == "FindMe"

    def test_get_nonexistent_application_404(self, auth_client):
        """Should return 404 for invalid ID."""
        response = auth_client.get("/api/applications/999999")
        assert response.status_code == 404

    def test_update_application(self, auth_client):
        """Should update application fields."""
        create_res = auth_client.post(
            "/api/applications/", json={"role_title": "Old", "company_name": "X"}
        )
        app_id = create_res.json()["id"]

        response = auth_client.put(
            f"/api/applications/{app_id}",
            json={"role_title": "New Title", "company_name": "X", "status": "interviewing"},
        )
        assert response.status_code == 200
        assert response.json()["role_title"] == "New Title"

    def test_delete_application(self, auth_client):
        """Should remove application from DB."""
        create_res = auth_client.post(
            "/api/applications/", json={"role_title": "To Delete", "company_name": "X"}
        )
        app_id = create_res.json()["id"]

        del_res = auth_client.delete(f"/api/applications/{app_id}")
        assert del_res.status_code == 204

        # Verify it's gone
        get_res = auth_client.get(f"/api/applications/{app_id}")
        assert get_res.status_code == 404
