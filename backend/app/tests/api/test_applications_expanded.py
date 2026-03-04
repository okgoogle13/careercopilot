from datetime import datetime

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.main import app
from app.models.database import Application, User


# Define Mock objects for database and user
class MockDB:
    def __init__(self):
        self.applications = {
            "app_123": Application(
                id="app_123",
                user_id="test_user",
                job_title="Engineer",
                company_name="AI Corp",
                job_description="Standard description that meets the 50 char minimum length requirement."
                * 2,
                status="draft",
                source="manual",
                application_metadata={},
                created_at=datetime.now(),
                updated_at=datetime.now(),
            )
        }

    def add(self, obj, *args, **kwargs):
        if not getattr(obj, "id", None):
            obj.id = f"app_{len(self.applications) + 1}"
        if not getattr(obj, "user_id", None):
            obj.user_id = "test_user"
        if not getattr(obj, "status", None):
            obj.status = "draft"
        if not getattr(obj, "source", None):
            obj.source = "manual"
        if not getattr(obj, "created_at", None):
            obj.created_at = datetime.now()
        if not getattr(obj, "updated_at", None):
            obj.updated_at = datetime.now()
        self.applications[obj.id] = obj

    def commit(self, *args, **kwargs):
        pass

    def refresh(self, obj, *args, **kwargs):
        if not getattr(obj, "created_at", None):
            obj.created_at = datetime.now()
        if not getattr(obj, "updated_at", None):
            obj.updated_at = datetime.now()
        pass

    def delete(self, obj):
        if obj.id in self.applications:
            del self.applications[obj.id]

    def query(self, model):
        self.model = model
        return self

    def filter(self, *args, **kwargs):
        return self

    def offset(self, skip):
        return self

    def limit(self, limit):
        return self

    def first(self, *args, **kwargs):
        # Simplistic mock for filtered first()
        if "non_existent" in str(args) or "non_existent" in str(kwargs):
            return None
        return next(iter(self.applications.values()), None)

    def all(self, *args, **kwargs):
        return list(self.applications.values())


async def mock_get_db():
    yield MockDB()


async def mock_get_current_user():
    return User(id="test_user", email="test@example.com")


app.dependency_overrides[get_db] = mock_get_db
app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)


def test_create_application_success():
    payload = {
        "jobTitle": "Software Engineer",
        "companyName": "Google",
        "jobDescription": "Building AI at scale with modern machine learning frameworks and large scale distributed systems.",
    }
    response = client.post("/api/applications/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["jobTitle"] == "Software Engineer"


def test_get_application_success():
    response = client.get("/api/applications/app_123")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == "app_123"


def test_get_application_not_found():
    # Mocking a scenario where the application is not found
    class MockDBEmpty(MockDB):
        def first(self, *args, **kwargs):
            return None

    app.dependency_overrides[get_db] = lambda: MockDBEmpty()
    response = client.get("/api/applications/non_existent")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    app.dependency_overrides[get_db] = mock_get_db  # Restore


def test_get_all_applications():
    response = client.get("/api/applications/")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)


def test_update_application_success():
    payload = {
        "jobTitle": "Senior Engineer",
        "companyName": "AI Corp",
        "jobDescription": "Updated description that also meets the 50 char minimum length requirement."
        * 2,
    }
    response = client.put("/api/applications/app_123", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["jobTitle"] == "Senior Engineer"


def test_update_application_not_found():
    class MockDBEmpty(MockDB):
        def first(self, *args, **kwargs):
            return None

    app.dependency_overrides[get_db] = lambda: MockDBEmpty()
    payload = {
        "jobTitle": "Senior Engineer",
        "companyName": "AI Corp",
        "jobDescription": "Updated description that also meets the 50 char minimum length requirement."
        * 2,
    }
    response = client.put("/api/applications/non_existent", json=payload)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    app.dependency_overrides[get_db] = mock_get_db  # Restore


def test_delete_application_success():
    response = client.delete("/api/applications/app_123")
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_delete_application_not_found():
    class MockDBEmpty(MockDB):
        def first(self, *args, **kwargs):
            return None

    app.dependency_overrides[get_db] = lambda: MockDBEmpty()
    response = client.delete("/api/applications/non_existent")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    app.dependency_overrides[get_db] = mock_get_db  # Restore
