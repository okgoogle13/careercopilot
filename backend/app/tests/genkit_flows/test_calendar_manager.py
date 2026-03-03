"""
Tests for calendar_manager.py
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
from app.genkit_flows.calendar_manager import createCalendarEvent
from app.core.database import SessionLocal
from app.models.database import Application
from app.core.secrets import get_user_secret

@pytest.fixture
def mock_get_user_secret(monkeypatch):
    """Mock get_user_secret function."""
    def mock_get_user_secret(user_id, key):
        if user_id == "test_user" and key == "google_credentials":
            return {"access_token": "test_token", "refresh_token": "test_refresh"}
        return None

    monkeypatch.setattr("app.core.secrets.get_user_secret", mock_get_user_secret)

@pytest.fixture
def mock_google_api():
    """Mock Google Calendar API."""
    mock_credentials = MagicMock()
    mock_credentials.from_authorized_user_info.return_value = mock_credentials
    mock_build = MagicMock()
    mock_build.return_value.events.insert.return_value.execute.return_value = {"id": "test_event_id"}
    return mock_credentials, mock_build

@pytest.fixture
def mock_db():
    """Mock database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def mock_application(mock_db):
    """Mock application object in the database."""
    application = Application(id="test_app_id", application_metadata={})
    mock_db.add(application)
    mock_db.commit()
    yield application
    mock_db.rollback()

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_happy_path(mock_credentials, mock_build, mock_get_user_secret, mock_application):
    """Test successful calendar event creation."""
    opportunity_data = {
        "title": "Software Engineer",
        "company": "Acme Corp",
        "deadline": "2024-12-31",
        "id": "test_app_id"
    }
    event_id = createCalendarEvent("test_user", opportunity_data)
    assert event_id == "test_event_id"
    assert mock_application.application_metadata == {"calendar_event_id": "test_event_id"}

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_no_google_credentials(mock_credentials, mock_build, mock_get_user_secret):
    """Test exception when Google API dependencies are not installed."""
    with pytest.raises(Exception, match="Google API dependencies are not installed."):
        createCalendarEvent("test_user", {"title": "Test Job", "deadline": "2024-12-31"})

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_user_not_authenticated(mock_credentials, mock_build, mock_get_user_secret):
    """Test exception when user is not authenticated with Google."""
    mock_get_user_secret.return_value = None
    with pytest.raises(Exception, match="User has not authenticated with Google."):
        createCalendarEvent("test_user", {"title": "Test Job", "deadline": "2024-12-31"})

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_missing_deadline(mock_credentials, mock_build, mock_get_user_secret):
    """Test exception when opportunity data is missing a deadline."""
    with pytest.raises(ValueError, match="Opportunity data must include a 'deadline'."):
        createCalendarEvent("test_user", {"title": "Test Job", "company": "Test Co"})

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_invalid_deadline_format(mock_credentials, mock_build, mock_get_user_secret):
    """Test exception when deadline is in an invalid format."""
    with pytest.raises(ValueError):
        createCalendarEvent("test_user", {"title": "Test Job", "deadline": "invalid-date"})

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_no_opportunity_id(mock_credentials, mock_build, mock_get_user_secret):
    """Test when opportunity data does not have an id."""
    opportunity_data = {
        "title": "Software Engineer",
        "company": "Acme Corp",
        "deadline": "2024-12-31",
    }
    event_id = createCalendarEvent("test_user", opportunity_data)
    assert event_id == "test_event_id"

@patch('googleapiclient.discovery.build')
@patch('google.oauth2.credentials.Credentials')
def test_createCalendarEvent_database_error(mock_credentials, mock_build, mock_get_user_secret, mock_db, mock_application):
    """Test handling of database errors during metadata update."""
    mock_db.rollback.side_effect = Exception("Database error")
    opportunity_data = {
        "title": "Software Engineer",
        "company": "Acme Corp",
        "deadline": "2024-12-31",
        "id": "test_app_id"
    }
    event_id = createCalendarEvent("test_user", opportunity_data)
    assert event_id == "test_event_id"