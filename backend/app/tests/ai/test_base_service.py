"""Tests for the base AI service."""

import logging
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from app.ai.base_service import BaseAIService, T

# Configure logging for tests
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TestBaseAIService:
    """Tests for the BaseAIService class."""

    def test_init_with_config(self):
        """Test initialization with a configuration dictionary."""
        config = {"enabled": True, "api_key": "test_key"}
        service = BaseAIService(config=config)
        assert service.config == config
        assert service.is_enabled is True

    def test_init_without_config(self):
        """Test initialization without a configuration dictionary."""
        service = BaseAIService()
        assert service.config == {}
        assert service.is_enabled is False

    def test_initialize_success(self):
        """Test successful initialization."""
        service = BaseAIService(config={"enabled": True})
        service._initialize()
        assert service.is_initialized is True

    def test_initialize_failure(self):
        """Test initialization failure."""
        with patch("app.ai.base_service.logger.info", side_effect=Exception("Test error")):
            service = BaseAIService(config={"enabled": True})
            assert service.is_initialized is False

    def test_is_available_enabled_and_initialized(self):
        """Test is_available when enabled and initialized."""
        service = BaseAIService(config={"enabled": True})
        service._initialize()
        assert service.is_available() is True

    def test_is_available_enabled_but_not_initialized(self):
        """Test is_available when enabled but not initialized."""
        service = BaseAIService(config={"enabled": False})
        service.is_enabled = True
        assert service.is_available() is False

    def test_is_available_not_enabled(self):
        """Test is_available when not enabled."""
        service = BaseAIService(config={"enabled": False})
        assert service.is_available() is False

    def test_validate_input_valid(self):
        """Test validate_input with valid input."""
        service = BaseAIService()
        input_data = {"field1": "value1", "field2": 123}
        service.validate_input(input_data, ["field1", "field2"])
        assert True  # No exception raised

    def test_validate_input_missing_required_field(self):
        """Test validate_input with missing required field."""
        service = BaseAIService()
        input_data = {"field1": "value1"}
        with pytest.raises(ValueError) as excinfo:
            service.validate_input(input_data, ["field1", "field2"])
        assert "Missing required field: field2" in str(excinfo.value)

    def test_validate_input_none_input(self):
        """Test validate_input with None input."""
        service = BaseAIService()
        with pytest.raises(ValueError) as excinfo:
            service.validate_input(None)
        assert "Input cannot be None" in str(excinfo.value)

    def test_handle_error(self):
        """Test handle_error."""
        service = BaseAIService()
        with pytest.raises(RuntimeError) as excinfo:
            service.handle_error(Exception("Test error"), "Test context")
        assert "AI Service Error (Test context): Test error" in str(excinfo.value)

    def test_handle_error_without_context(self):
        """Test handle_error without context."""
        service = BaseAIService()
        with pytest.raises(RuntimeError) as excinfo:
            service.handle_error(Exception("Test error"))
        assert "AI Service Error: Test error" in str(excinfo.value)

    def test_str_representation(self):
        """Test the string representation of the service."""
        service = BaseAIService(config={"enabled": True})
        service._initialize()
        assert str(service) == "BaseAIService(enabled=True)"

        service = BaseAIService(config={"enabled": False})
        assert str(service) == "BaseAIService(enabled=False)"


class ExampleAIServiceModel(BaseModel):
    """A simple Pydantic model for testing."""

    name: str
    age: int


class TestBaseAIServicePydanticIntegration:
    """Tests for BaseAIService integration with Pydantic models."""

    def test_validate_input_with_pydantic_model(self):
        """Test validate_input with a Pydantic model as input."""
        service = BaseAIService()
        input_data = ExampleAIServiceModel(name="Alice", age=30)
        service.validate_input(input_data, ["name", "age"])
        assert True  # No exception raised

    def test_validate_input_missing_field_in_pydantic_model(self):
        """Test validate_input with a Pydantic model missing a required field."""
        service = BaseAIService()
        input_data = ExampleAIServiceModel.model_construct(name="Alice")
        with pytest.raises(ValueError) as excinfo:
            service.validate_input(input_data, ["name", "age"])
        assert "Missing required field: age" in str(excinfo.value)
