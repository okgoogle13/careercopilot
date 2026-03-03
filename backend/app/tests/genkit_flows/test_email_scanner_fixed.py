"""
Tests for email_scanner_fixed module.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.genkit_flows.email_scanner import scanEmailsForJobOpportunities, scanUserEmails, get_gmail_service, extract_job_details_from_email
from app.core.database import SessionLocal
from app.models.database import User, Application
from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt
from app.core.secrets import get_user_secret
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Mocking dependencies
@pytest.fixture
def mock_get_model():
    """Mock get_model function."""
    class MockModel:
        async def generate(self, prompt, config):
            return MockResponse(output={"title": "Software Engineer", "company": "Acme Corp", "description": "Great job!", "deadline": "2024-12-31"})
    return MockModel()

@pytest.fixture
def mock_get_user_secret():
    """Mock get_user_secret function."""
    def mock_get_user_secret(user_id, secret_name):
        if user_id == "test_user" and secret_name == "google_credentials":
            return {"access_token": "test_token", "refresh_token": "test_refresh_token"}
        return None
    return mock_get_user_secret

@pytest.fixture
def mock_db():
    """Mock SQLAlchemy database session."""
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture
def mock_get_current_user():
    """Mock authenticated user."""
    def mock_get_current_user():
        return User(id="test_user", email="test@example.com")
    return mock_get_current_user

class MockResponse:
    def __init__(self, output):
        self._output = output

    def output(self):
        return self._output

class TestScanEmailsForJobOpportunities:

    @pytest.fixture
    def client(self, mock_db, mock_get_model, mock_get_user_secret, mock_get_current_user):
        client = TestClient(app="main:app")  # Replace 'main:app' with your app import
        return client

    @patch('app.genkit_flows.email_scanner.get_gmail_service')
    @patch('app.genkit_flows.email_scanner.scanUserEmails')
    async def test_scan_emails_success(self, mock_scan_user_emails, mock_get_gmail_service, client):
        mock_scan_user_emails.return_value = [{"title": "Job 1", "company": "Company 1"}]
        mock_get_gmail_service.return_value = build("gmail", "v1", Credentials.from_authorized_user_info({"access_token": "test"}))
        response = await client.post("/scan_emails/", json={"user_id": "test_user"})
        assert response.status_code == 200
        assert response.json() == {
            "success": True,
            "opportunities_found": 1,
            "opportunities": [{"title": "Job 1", "company": "Company 1"}],
            "scan_timestamp": str(datetime.now(timezone.utc))
        }

    @patch('app.genkit_flows.email_scanner.get_gmail_service')
    @patch('app.genkit_flows.email_scanner.scanUserEmails')
    async def test_scan_emails_failure(self, mock_scan_user_emails, mock_get_gmail_service, client):
        mock_scan_user_emails.side_effect = Exception("Failed to scan emails")
        mock_get_gmail_service.return_value = build("gmail", "v1", Credentials.from_authorized_user_info({"access_token": "test"}))
        response = await client.post("/scan_emails/", json={"user_id": "test_user"})
        assert response.status_code == 200
        assert response.json() == {
            "success": False,
            "error": "Failed to scan emails",
            "opportunities_found": 0,
            "opportunities": []
        }

class TestScanUserEmails:

    @pytest.fixture
    def client(self, mock_db, mock_get_model, mock_get_user_secret, mock_get_current_user):
        client = TestClient(app="main:app")  # Replace 'main:app' with your app import
        return client

    @patch('app.genkit_flows.email_scanner.get_gmail_service')
    async def test_scan_user_emails_success(self, mock_get_gmail_service, mock_db, mock_get_model):
        mock_get_gmail_service.return_value = build("gmail", "v1", Credentials.from_authorized_user_info({"access_token": "test"}))
        mock_get_model.return_value = MockResponse(output={"title": "Software Engineer", "company": "Acme Corp", "description": "Great job!", "deadline": "2024-12-31"})
        user = User(id="test_user", email="test@example.com")
        mock_db.add(user)
        mock_db.commit()
        mock_db.refresh(user)

        opportunities = await scanUserEmails("test_user")
        assert len(opportunities) == 1
        assert opportunities[0]["title"] == "Software Engineer"

    @patch('app.genkit_flows.email_scanner.get_gmail_service')
    async def test_scan_user_emails_no_messages(self, mock_get_gmail_service, mock_db):
        mock_get_gmail_service.return_value = build("gmail", "v1", Credentials.from_authorized_user_info({"access_token": "test"}))
        opportunities = await scanUserEmails("test_user")
        assert len(opportunities) == 0

    @patch('app.genkit_flows.email_scanner.get_gmail_service')
    async def test_scan_user_emails_user_not_found(self, mock_get_gmail_service, mock_db):
        mock_get_gmail_service.return_value = build("gmail", "v1", Credentials.from_authorized_user_info({"access_token": "test"}))
        with pytest.raises(Exception) as excinfo:
            await scanUserEmails("non_existent_user")
        assert "User with ID non_existent_user not found in Database." in str(excinfo.value)

class TestGetGmailService:

    @patch('app.genkit_flows.email_scanner.get_user_secret')
    def test_get_gmail_service_success(self, mock_get_user_secret):
        mock_get_user_secret.return_value = {"access_token": "test_token", "refresh_token": "test_refresh_token"}
        service = get_gmail_service("test_user")
        assert service is not None

    @patch('app.genkit_flows.email_scanner.get_user_secret')
    def test_get_gmail_service_no_credentials(self, mock_get_user_secret):
        mock_get_user_secret.return_value = None
        with pytest.raises(Exception) as excinfo:
            get_gmail_service("test_user")
        assert "User has not authenticated with Google." in str(excinfo.value)

class TestExtractJobDetailsFromEmail:

    @pytest.fixture
    def client(self, mock_db, mock_get_model, mock_get_user_secret, mock_get_current_user):
        client = TestClient(app="main:app")  # Replace 'main:app' with your app import
        return client

    @patch('app.genkit_flows.email_scanner.get_model')
    async def test_extract_job_details_success(self, mock_get_model):
        mock_get_model.return_value = MockResponse(output={"title": "Software Engineer", "company": "Acme Corp", "description": "Great job!"})
        email_content = "This is a test email with job details."
        job_details = await extract_job_details_from_email.run(email_content)
        assert job_details["title"] == "Software Engineer"
        assert job_details["company"] == "Acme Corp"