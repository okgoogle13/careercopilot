"""
Tests for the notifier module.
"""

import os
from unittest.mock import patch

import pytest

from app.genkit_flows.notifier import sendNewOpportunityNotification


@pytest.fixture(autouse=True)
def setup_env():
    """Setup required environment variables for testing."""
    with patch.dict(
        os.environ, {"AWS_ACCESS_KEY_ID": "mock_key", "SES_SENDER_EMAIL": "mock@example.com"}
    ):
        yield


@pytest.fixture
def mock_send_email():
    """Mock the send_email function."""
    with patch("app.genkit_flows.notifier.send_email") as mock:
        yield mock


def test_send_new_opportunity_notification_happy_path(mock_send_email):
    """
    Test that the notification is sent successfully with valid data.
    """
    user_data = {"email": "test@example.com", "displayName": "Test User"}
    opportunity_data = {
        "title": "Software Engineer",
        "company": "Test Company",
        "id": "123",
        "deadline": "2024-01-01",
    }
    mock_send_email.return_value = {"message_id": "12345", "status_code": 200}

    sendNewOpportunityNotification(user_data, opportunity_data)

    mock_send_email.assert_called_once()
    assert mock_send_email.call_args.kwargs["to_email"] == "test@example.com"
    assert "Software Engineer" in mock_send_email.call_args.kwargs["subject"]
    assert "Test Company" in mock_send_email.call_args.kwargs["subject"]


def test_send_new_opportunity_notification_no_ses_configured(mock_send_email):
    """
    Test that the notification is skipped if AWS SES is not configured.
    """
    os.environ["AWS_ACCESS_KEY_ID"] = ""
    os.environ["SES_SENDER_EMAIL"] = ""

    user_data = {"email": "test@example.com", "displayName": "Test User"}
    opportunity_data = {"title": "Software Engineer", "company": "Test Company", "id": "123"}

    sendNewOpportunityNotification(user_data, opportunity_data)

    mock_send_email.assert_not_called()


def test_send_new_opportunity_notification_missing_email(mock_send_email):
    """
    Test that a ValueError is raised if the user data does not include an email address.
    """
    user_data = {"displayName": "Test User"}
    opportunity_data = {"title": "Software Engineer", "company": "Test Company", "id": "123"}

    with pytest.raises(ValueError) as excinfo:
        sendNewOpportunityNotification(user_data, opportunity_data)

    assert "User data must include an email address." in str(excinfo.value)
    mock_send_email.assert_not_called()


def test_send_new_opportunity_notification_missing_job_title(mock_send_email):
    """
    Test that the job title defaults to 'N/A' if not provided in opportunity data.
    """
    user_data = {"email": "test@example.com", "displayName": "Test User"}
    opportunity_data = {"company": "Test Company", "id": "123"}

    sendNewOpportunityNotification(user_data, opportunity_data)

    mock_send_email.assert_called_once()
    assert "N/A" in mock_send_email.call_args.kwargs["subject"]


def test_send_new_opportunity_notification_missing_company(mock_send_email):
    """
    Test that the company name defaults to 'N/A' if not provided in opportunity data.
    """
    user_data = {"email": "test@example.com", "displayName": "Test User"}
    opportunity_data = {"title": "Software Engineer", "id": "123"}

    sendNewOpportunityNotification(user_data, opportunity_data)

    mock_send_email.assert_called_once()
    assert "N/A" in mock_send_email.call_args.kwargs["subject"]


def test_send_new_opportunity_notification_error_sending_email(mock_send_email):
    """
    Test that an exception during email sending is caught and printed, but doesn't break the flow.
    """
    user_data = {"email": "test@example.com", "displayName": "Test User"}
    opportunity_data = {"title": "Software Engineer", "company": "Test Company", "id": "123"}
    mock_send_email.side_effect = Exception("Failed to send email")

    sendNewOpportunityNotification(user_data, opportunity_data)

    mock_send_email.assert_called_once()
