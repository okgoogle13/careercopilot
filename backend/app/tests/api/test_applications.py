"""Tests for /applications API endpoints."""

from types import SimpleNamespace

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.dependencies import get_current_user

    # Using integer ID as Application model likely expects it for user_id
    mock_user = SimpleNamespace(
        id="test_uid", uid="test_uid", email="test@example.com", name="Test User"
    )
    client.app.dependency_overrides[get_current_user] = lambda: mock_user
    yield client


class TestApplicationsEndpoints:
    def test_create_application_happy_path(self, auth_client):
        """Should create a new application in the DB."""
        response = auth_client.post(
            "/api/applications/",
            json={
                "jobTitle": "Software Engineer",
                "companyName": "Acme Corp",
                "jobDescription": "Full stack developer role involving Python and React with at least 5 years experience in building scalable web applications.",
                "deadline": "2024-12-31T23:59:59",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["jobTitle"] == "Software Engineer"
        assert data["companyName"] == "Acme Corp"
        assert "id" in data

    def test_get_all_applications(self, auth_client):
        """Should return a list of applications for current user."""
        # Create two applications
        desc = "Software Engineer role with focus on backend and cloud. Requires extensive knowledge of AWS."
        auth_client.post(
            "/api/applications/",
            json={"jobTitle": "Job 1", "companyName": "A", "jobDescription": desc},
        )
        auth_client.post(
            "/api/applications/",
            json={"jobTitle": "Job 2", "companyName": "B", "jobDescription": desc},
        )

        response = auth_client.get("/api/applications/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
        titles = [app["jobTitle"] for app in data]
        assert "Job 1" in titles
        assert "Job 2" in titles

    def test_get_single_application(self, auth_client):
        """Should retrieve a specific application by ID."""
        desc = "Position for a senior data scientist with deep learning expertise and strong statistics background."
        create_res = auth_client.post(
            "/api/applications/",
            json={"jobTitle": "FindMe", "companyName": "X", "jobDescription": desc},
        )
        app_id = create_res.json()["id"]

        response = auth_client.get(f"/api/applications/{app_id}")
        assert response.status_code == 200
        assert response.json()["jobTitle"] == "FindMe"

    def test_get_nonexistent_application_404(self, auth_client):
        """Should return 404 for invalid ID."""
        response = auth_client.get("/api/applications/999999")
        assert response.status_code == 404

    def test_update_application(self, auth_client):
        """Should update application fields."""
        desc = "Marketing Manager position for a fast-growing startup in the fintech industry."
        create_res = auth_client.post(
            "/api/applications/",
            json={"jobTitle": "Old", "companyName": "X", "jobDescription": desc},
        )
        app_id = create_res.json()["id"]

        response = auth_client.put(
            f"/api/applications/{app_id}",
            json={
                "jobTitle": "New Title",
                "status": "interviewing",
                "notes": "Phone screen booked",
            },
        )
        assert response.status_code == 200
        assert response.json()["jobTitle"] == "New Title"
        assert response.json()["status"] == "interviewing"
        assert response.json()["notes"] == "Phone screen booked"

    def test_delete_application(self, auth_client):
        """Should remove application from DB."""
        desc = "Frontend Engineer with strong TypeScript and React skills. Knowledge of testing is a plus."
        create_res = auth_client.post(
            "/api/applications/",
            json={"jobTitle": "To Delete", "companyName": "X", "jobDescription": desc},
        )
        app_id = create_res.json()["id"]

        del_res = auth_client.delete(f"/api/applications/{app_id}")
        assert del_res.status_code == 204

        # Verify it's gone
        get_res = auth_client.get(f"/api/applications/{app_id}")
        assert get_res.status_code == 404
