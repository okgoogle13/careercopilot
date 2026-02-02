import pytest
from unittest.mock import patch

@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    return "test_user@example.com"
