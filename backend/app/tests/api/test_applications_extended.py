import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.database import Application, User

# Mocking database and user dependency elsewhere in production-ready testing setup.
# Here we provide a self-contained mock for verification.

class MockDB:
    def add(self, obj, *args, **kwargs):
        self.obj = obj
        # Set required fields that are normally set by DB defaults/identity
        if not getattr(obj, "id", None):
            obj.id = "app_123"
        if not getattr(obj, "user_id", None):
            obj.user_id = "test_user"
        if not getattr(obj, "created_at", None):
            obj.created_at = datetime.now()
        if not getattr(obj, "updated_at", None):
            obj.updated_at = datetime.now()
        if not getattr(obj, "status", None):
            obj.status = "draft"
        if not getattr(obj, "source", None):
            obj.source = "manual"

    def commit(self, *args, **kwargs): pass
    def refresh(self, *args, **kwargs): pass
    def query(self, *args, **kwargs): return self
    def filter(self, *args, **kwargs): return self
    def offset(self, *args, **kwargs): return self
    def limit(self, *args, **kwargs): return self
    def first(self, *args, **kwargs):
        # Mocking finding one app with all required fields for Pydantic
        return Application(
            id="app_123", 
            user_id="test_user", 
            job_title="Engineer", 
            company_name="AI Corp",
            job_description="Standard description that meets the 50 char minimum length requirement." * 2,
            status="draft",
            source="manual",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    def all(self, *args, **kwargs):
        return [self.first()]

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
        "jobDescription": "Building AI at scale with modern machine learning frameworks and large scale distributed systems."
    }
    response = client.post("/api/applications/", json=payload)
    assert response.status_code == 201
    assert response.json()["job_title"] == "Software Engineer"

def test_get_application_not_found(monkeypatch):
    # Change MockDB to return None for first()
    class MockDBEmpty(MockDB):
        def first(self, *args, **kwargs): return None
    
    app.dependency_overrides[get_db] = lambda: MockDBEmpty()
    
    response = client.get("/api/applications/non_existent")
    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found."

def test_get_all_applications():
    app.dependency_overrides[get_db] = mock_get_db # Restore
    response = client.get("/api/applications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
