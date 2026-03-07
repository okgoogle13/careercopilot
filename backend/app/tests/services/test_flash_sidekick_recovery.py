"""
Tests for flash_sidekick_service.py.
Target coverage: 68% → 72% (6 tests)

Note: This module uses MCP (Model Context Protocol). Full MCP integration testing
requires MCP server infrastructure. These tests focus on initialization and structure.
"""

import pytest

from app.services.flash_sidekick_service import FlashSidekickService

# ==================== FIXTURES ====================


@pytest.fixture
def service():
    """Create FlashSidekickService instance."""
    return FlashSidekickService()


# ==================== INITIALIZATION TESTS ====================


def test_service_initialization(service):
    """Test FlashSidekickService initialization."""
    assert service.server_command == "/home/njd/careercopilot/careercopilot-1/.venv/bin/python3"
    assert "/flash_sidekick.py" in service.server_args[0]
    assert "GEMINI_MODEL" in service.env
    assert "GEMINI_PRO_MODEL" in service.env


def test_service_environment_variables(service):
    """Test environment variables are properly set."""
    assert service.env["GEMINI_MODEL"] == "models/gemini-2.5-flash-lite"
    assert service.env["GEMINI_PRO_MODEL"] == "models/gemini-2.5-pro"


def test_service_environment_inherits_os_environ(service):
    """Test that service environment inherits from os.environ."""
    import os

    # Service env should contain custom variables
    assert "GEMINI_MODEL" in service.env
    assert "GEMINI_PRO_MODEL" in service.env
    # And also inherit PATH from os.environ if it exists
    if "PATH" in os.environ:
        assert "PATH" in service.env


def test_service_server_args_is_list(service):
    """Test that server_args is a list."""
    assert isinstance(service.server_args, list)
    assert len(service.server_args) == 1


def test_service_env_is_dict(service):
    """Test that env is a dictionary."""
    assert isinstance(service.env, dict)
    assert len(service.env) >= 2  # At least GEMINI_MODEL and GEMINI_PRO_MODEL


def test_service_has_required_methods(service):
    """Test that service has required async methods."""
    import inspect

    assert hasattr(service, "quick_summarize")
    assert hasattr(service, "extract_links_from_search_results")
    assert inspect.iscoroutinefunction(service.quick_summarize)
    assert inspect.iscoroutinefunction(service.extract_links_from_search_results)
