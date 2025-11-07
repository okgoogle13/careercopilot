import os
import sys
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient


def pytest_configure(config):
    """
    Configure pytest before test collection.
    Sets up environment variables and clears Prometheus registry.
    """
    # Set up test environment variables BEFORE any module imports
    os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-testing-only")
    os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only")
    os.environ.setdefault("ENV", "test")
    os.environ.setdefault("ENVIRONMENT", "test")
    os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
    os.environ.setdefault("ENABLE_GENKIT_FLOWS", "false")

    # Clear Prometheus registry to avoid duplicate metrics
    try:
        from prometheus_client import REGISTRY

        # Get all collectors to remove
        collectors = list(REGISTRY._collector_to_names.keys())
        for collector in collectors:
            try:
                REGISTRY.unregister(collector)
            except Exception:
                pass  # Ignore if already unregistered
    except ImportError:
        pass  # Prometheus not installed


@pytest.fixture(autouse=True)
def setup_test_env(monkeypatch):
    """
    Automatically set up test environment for all tests.
    This runs before each test.
    """
    # Ensure environment variables are set for each test
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret-key-for-testing-only")
    monkeypatch.setenv("SECRET_KEY", "test-secret-key-for-testing-only")
    monkeypatch.setenv("ENV", "test")
    monkeypatch.setenv("ENVIRONMENT", "test")
    monkeypatch.setenv("ENABLE_GENKIT_FLOWS", "false")


@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    return MagicMock()


@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    return lambda: {"uid": "test_user_id"}


@pytest.fixture
def client(monkeypatch, mock_db, mock_get_current_user):
    """Sync test client for the app with mocked dependencies."""
    # Import here to ensure environment is set up first
    from app.core.dependencies import get_current_user
    from app.main import app

    # monkeypatch.setattr(db, "db", mock_db)  # TODO: Fix db import
    app.dependency_overrides[get_current_user] = mock_get_current_user

    with TestClient(app) as tc:
        yield tc

    app.dependency_overrides.clear()
