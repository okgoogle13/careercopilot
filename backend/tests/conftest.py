import pytest
from unittest.mock import patch
import firebase_admin
from firebase_admin import credentials

@pytest.fixture(scope="session", autouse=True)
def firebase_app():
    """Initialize firebase app"""
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)

@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    return "test_user@example.com"
