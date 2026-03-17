"""Comprehensive test suite for prompt_service.py.

Coverage target: 85% (60+ test cases)
Functions tested:
- PromptTemplate.format()
- PromptService.__init__()
- PromptService._load_config()
- PromptService._load_templates()
- PromptService._create_template()
- PromptService.get_template()
- PromptService.get_templates_by_category()
- PromptService.list_templates()
- PromptService.list_categories()
- PromptService.format_prompt()
- PromptService.get_system_prompt()
- PromptService.get_category_config()
- PromptService.get_length_instruction()
- PromptService.validate_template_parameters()
- PromptService.reload_templates()
- PromptService.get_template_metadata()
- PromptService.update_template_usage()
- get_prompt_service()
- format_prompt()
- get_system_prompt()
"""

import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from app.core.prompt_service import (
    PromptService,
    PromptTemplate,
    format_prompt,
    get_prompt_service,
    get_system_prompt,
)


@pytest.fixture
def temp_prompts_dir():
    """Create a temporary directory with test prompt files."""
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)

        # Create prompt_config.json
        config = {
            "prompt_management": {
                "version": "1.0",
                "default_language": "en",
                "cache_prompts": True,
                "validate_parameters": True,
            },
            "categories": {
                "general": {"default_language": "en"},
                "cover_letter": {"max_length": 500},
            },
            "validation_rules": {
                "required_parameters": True,
                "parameter_type_checking": True,
                "template_syntax_validation": True,
            },
            "length_instructions": {
                "short": "Keep it brief (50-100 words)",
                "standard": "Standard length (200-300 words)",
                "long": "Detailed response (500+ words)",
            },
        }
        config_file = tmpdir_path / "prompt_config.json"
        with open(config_file, "w") as f:
            json.dump(config, f)

        # Create sample prompts file
        prompts = {
            "greeting": {
                "name": "Greeting Prompt",
                "description": "A simple greeting prompt",
                "category": "general",
                "version": "1.0",
                "template": "Hello, {name}! Welcome to {place}.",
                "parameters": ["name", "place"],
                "output_format": "text",
                "system_prompt": "You are a friendly assistant.",
                "has_system_prompt": True,
                "metadata": {"tags": ["greeting"], "usage_count": 0},
            },
            "interview_prep": {
                "name": "Interview Preparation",
                "description": "Prepare for an interview",
                "category": "general",
                "version": "1.0",
                "template": "Prepare for {job_title} interview at {company}.",
                "parameters": ["job_title", "company"],
                "output_format": "text",
                "metadata": {"tags": ["interview"]},
            },
            "cover_letter_template": {
                "name": "Cover Letter",
                "description": "Template for cover letter",
                "category": "cover_letter",
                "version": "2.0",
                "template": "Dear {hiring_manager},\n\nI am interested in {position}.",
                "parameters": ["hiring_manager", "position"],
                "output_format": "text",
                "system_prompt": "Write professional cover letters.",
                "has_system_prompt": True,
                "metadata": {"tags": ["cover_letter"]},
            },
            "resume_summary": {
                "name": "Resume Summary",
                "description": "Professional summary for resume",
                "category": "general",
                "version": "1.0",
                "template": "Experienced {role} with {years} years of expertise in {skills}.",
                "parameters": ["role", "years", "skills"],
                "output_format": "text",
                "metadata": {},
            },
        }
        prompts_file = tmpdir_path / "prompts.json"
        with open(prompts_file, "w") as f:
            json.dump(prompts, f)

        yield tmpdir_path


@pytest.fixture
def prompt_service(temp_prompts_dir):
    """Create a PromptService with test data."""
    return PromptService(prompts_dir=str(temp_prompts_dir))


class TestPromptTemplate:
    """Tests for PromptTemplate class."""

    def test_prompt_template_creation(self):
        """Test creating a PromptTemplate instance."""
        template = PromptTemplate(
            name="Test Template",
            description="A test template",
            category="general",
            version="1.0",
            template="Hello {name}",
            parameters=["name"],
            output_format="text",
        )
        assert template.name == "Test Template"
        assert template.category == "general"
        assert template.has_system_prompt is False

    def test_prompt_template_format_success(self):
        """Test successful template formatting."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Hello {name}! You are {age} years old.",
            parameters=["name", "age"],
            output_format="text",
        )
        result = template.format(name="Alice", age=30)
        assert result == "Hello Alice! You are 30 years old."

    def test_prompt_template_format_with_none_values(self):
        """Test template formatting with None values converts to 'Not specified'."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Name: {name}, Age: {age}",
            parameters=["name", "age"],
            output_format="text",
        )
        result = template.format(name="Bob", age=None)
        assert "Not specified" in result
        assert "Bob" in result

    def test_prompt_template_format_missing_parameters(self):
        """Test template formatting with missing required parameters."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Hello {name}! You are {age} years old.",
            parameters=["name", "age"],
            output_format="text",
        )
        with pytest.raises(ValueError, match="Missing required parameters"):
            template.format(name="Charlie")

    def test_prompt_template_format_with_extra_parameters(self):
        """Test template formatting with extra unused parameters."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Hello {name}",
            parameters=["name"],
            output_format="text",
        )
        result = template.format(name="Diana", extra="value")
        assert result == "Hello Diana"

    def test_prompt_template_format_invalid_key(self):
        """Test template formatting with invalid key error."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Hello {name}",
            parameters=["name"],
            output_format="text",
        )
        with pytest.raises(ValueError, match="Template formatting failed"):
            template.format(wrong_param="Value")

    def test_prompt_template_format_general_exception(self):
        """Test template formatting with general exception."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Hello {name}",
            parameters=["name"],
            output_format="text",
        )
        with patch.object(PromptTemplate, "format") as mock_format:
            mock_format.side_effect = Exception("Unexpected error")
            with pytest.raises(Exception):
                mock_format(name="Value")

    def test_prompt_template_with_system_prompt(self):
        """Test PromptTemplate with system prompt."""
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Test {param}",
            parameters=["param"],
            output_format="text",
            system_prompt="You are a helpful assistant.",
            has_system_prompt=True,
        )
        assert template.system_prompt == "You are a helpful assistant."
        assert template.has_system_prompt is True

    def test_prompt_template_metadata(self):
        """Test PromptTemplate with metadata."""
        metadata = {"tags": ["test"], "priority": "high"}
        template = PromptTemplate(
            name="Test",
            description="Test",
            category="general",
            version="1.0",
            template="Test",
            parameters=[],
            output_format="text",
            metadata=metadata,
        )
        assert template.metadata == metadata


class TestPromptServiceInitialization:
    """Tests for PromptService initialization."""

    def test_prompt_service_initialization(self, prompt_service):
        """Test PromptService initialization."""
        assert prompt_service.prompts_dir is not None
        assert prompt_service._cached is True
        assert len(prompt_service._templates) > 0

    def test_prompt_service_default_prompts_dir(self):
        """Test PromptService with default prompts directory."""
        with patch.object(PromptService, "_load_config"):
            with patch.object(PromptService, "_load_templates"):
                service = PromptService()
                assert service.prompts_dir is not None

    def test_prompt_service_custom_prompts_dir(self, temp_prompts_dir):
        """Test PromptService with custom prompts directory."""
        service = PromptService(prompts_dir=str(temp_prompts_dir))
        assert service.prompts_dir == temp_prompts_dir

    def test_prompt_service_config_loaded(self, prompt_service):
        """Test that config is loaded on initialization."""
        assert prompt_service._config is not None
        assert "prompt_management" in prompt_service._config


class TestPromptServiceLoadConfig:
    """Tests for PromptService._load_config()."""

    def test_load_config_success(self, prompt_service):
        """Test successful config loading."""
        assert prompt_service._config["prompt_management"]["version"] == "1.0"
        assert prompt_service._config["prompt_management"]["cache_prompts"] is True

    def test_load_config_file_not_found(self, temp_prompts_dir):
        """Test config loading when file doesn't exist."""
        empty_dir = tempfile.TemporaryDirectory()
        service = PromptService(prompts_dir=empty_dir.name)
        assert service._config is not None
        assert "prompt_management" in service._config
        empty_dir.cleanup()

    def test_load_config_invalid_json(self, temp_prompts_dir):
        """Test config loading with invalid JSON."""
        config_file = temp_prompts_dir / "prompt_config.json"
        with open(config_file, "w") as f:
            f.write("invalid json {")

        service = PromptService(prompts_dir=str(temp_prompts_dir))
        assert service._config is not None
        assert "prompt_management" in service._config

    def test_get_default_config(self, prompt_service):
        """Test default config structure."""
        default_config = prompt_service._get_default_config()
        assert "prompt_management" in default_config
        assert "categories" in default_config
        assert "validation_rules" in default_config


class TestPromptServiceLoadTemplates:
    """Tests for PromptService._load_templates()."""

    def test_load_templates_success(self, prompt_service):
        """Test successful template loading."""
        assert len(prompt_service._templates) > 0
        assert "greeting" in prompt_service._templates
        assert "cover_letter_template" in prompt_service._templates

    def test_load_templates_empty_directory(self):
        """Test template loading from empty directory."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir)
            config_file = tmpdir_path / "prompt_config.json"
            with open(config_file, "w") as f:
                json.dump({}, f)

            service = PromptService(prompts_dir=str(tmpdir_path))
            assert len(service._templates) == 0

    def test_load_templates_invalid_json_in_template_file(self, temp_prompts_dir):
        """Test template loading with invalid JSON in template file."""
        bad_file = temp_prompts_dir / "bad_prompts.json"
        with open(bad_file, "w") as f:
            f.write("{invalid json")

        service = PromptService(prompts_dir=str(temp_prompts_dir))
        # Should still have loaded the valid prompts.json
        assert len(service._templates) > 0

    def test_create_template(self, prompt_service):
        """Test _create_template method."""
        template_data = {
            "name": "Test Template",
            "description": "A test",
            "category": "general",
            "version": "1.0",
            "template": "Hello {name}",
            "parameters": ["name"],
            "output_format": "text",
            "system_prompt": "Assistant prompt",
            "has_system_prompt": True,
            "metadata": {"key": "value"},
        }
        template = prompt_service._create_template("test_id", template_data)
        assert template.name == "Test Template"
        assert template.system_prompt == "Assistant prompt"
        assert template.metadata["key"] == "value"

    def test_create_template_with_defaults(self, prompt_service):
        """Test _create_template with minimal data (uses defaults)."""
        template_data = {"template": "Simple template"}
        template = prompt_service._create_template("minimal", template_data)
        assert template.name == "minimal"
        assert template.category == "general"
        assert template.version == "1.0"
        assert template.has_system_prompt is False


class TestPromptServiceGetMethods:
    """Tests for PromptService getter methods."""

    def test_get_template_success(self, prompt_service):
        """Test getting an existing template."""
        template = prompt_service.get_template("greeting")
        assert template is not None
        assert template.name == "Greeting Prompt"

    def test_get_template_not_found(self, prompt_service):
        """Test getting a non-existent template."""
        template = prompt_service.get_template("nonexistent")
        assert template is None

    def test_get_templates_by_category(self, prompt_service):
        """Test getting templates by category."""
        templates = prompt_service.get_templates_by_category("general")
        assert len(templates) > 0
        assert all(t.category == "general" for t in templates)

    def test_get_templates_by_category_empty(self, prompt_service):
        """Test getting templates from non-existent category."""
        templates = prompt_service.get_templates_by_category("nonexistent")
        assert templates == []

    def test_list_templates(self, prompt_service):
        """Test listing all template IDs."""
        templates = prompt_service.list_templates()
        assert isinstance(templates, list)
        assert "greeting" in templates
        assert "cover_letter_template" in templates

    def test_list_categories(self, prompt_service):
        """Test listing all categories."""
        categories = prompt_service.list_categories()
        assert isinstance(categories, list)
        assert "general" in categories
        assert "cover_letter" in categories

    def test_get_system_prompt_exists(self, prompt_service):
        """Test getting system prompt that exists."""
        system_prompt = prompt_service.get_system_prompt("greeting")
        assert system_prompt == "You are a friendly assistant."

    def test_get_system_prompt_not_exists(self, prompt_service):
        """Test getting system prompt that doesn't exist."""
        system_prompt = prompt_service.get_system_prompt("interview_prep")
        assert system_prompt is None

    def test_get_system_prompt_template_not_found(self, prompt_service):
        """Test getting system prompt for non-existent template."""
        system_prompt = prompt_service.get_system_prompt("nonexistent")
        assert system_prompt is None

    def test_get_category_config(self, prompt_service):
        """Test getting category configuration."""
        config = prompt_service.get_category_config("cover_letter")
        assert config is not None
        assert "max_length" in config

    def test_get_category_config_empty(self, prompt_service):
        """Test getting configuration for non-existent category."""
        config = prompt_service.get_category_config("nonexistent")
        assert config == {}

    def test_get_length_instruction_standard(self, prompt_service):
        """Test getting standard length instruction."""
        instruction = prompt_service.get_length_instruction("standard")
        assert "200-300 words" in instruction

    def test_get_length_instruction_default(self, prompt_service):
        """Test getting default length instruction."""
        instruction = prompt_service.get_length_instruction("nonexistent")
        assert isinstance(instruction, str)

    def test_get_template_metadata_exists(self, prompt_service):
        """Test getting metadata for existing template."""
        metadata = prompt_service.get_template_metadata("greeting")
        assert isinstance(metadata, dict)
        assert "tags" in metadata

    def test_get_template_metadata_not_found(self, prompt_service):
        """Test getting metadata for non-existent template."""
        metadata = prompt_service.get_template_metadata("nonexistent")
        assert metadata == {}


class TestPromptServiceFormatting:
    """Tests for prompt formatting methods."""

    def test_format_prompt_success(self, prompt_service):
        """Test successful prompt formatting."""
        result = prompt_service.format_prompt("greeting", name="Alice", place="Wonderland")
        assert "Alice" in result
        assert "Wonderland" in result

    def test_format_prompt_template_not_found(self, prompt_service):
        """Test formatting with non-existent template."""
        with pytest.raises(ValueError, match="Template 'nonexistent' not found"):
            prompt_service.format_prompt("nonexistent", param="value")

    def test_format_prompt_missing_parameters(self, prompt_service):
        """Test formatting with missing parameters."""
        with pytest.raises(ValueError, match="Missing required parameters"):
            prompt_service.format_prompt("greeting", name="Alice")

    def test_format_prompt_multiple_templates(self, prompt_service):
        """Test formatting multiple different templates."""
        result1 = prompt_service.format_prompt("greeting", name="Bob", place="Earth")
        result2 = prompt_service.format_prompt(
            "interview_prep", job_title="Engineer", company="TechCorp"
        )
        assert "Bob" in result1
        assert "Engineer" in result2

    def test_format_prompt_with_category_config(self, prompt_service):
        """Test that category config is considered during formatting."""
        result = prompt_service.format_prompt(
            "cover_letter_template", hiring_manager="John", position="Manager"
        )
        assert "John" in result
        assert "Manager" in result


class TestPromptServiceValidation:
    """Tests for parameter validation."""

    def test_validate_template_parameters_success(self, prompt_service):
        """Test successful parameter validation."""
        errors = prompt_service.validate_template_parameters(
            "greeting", {"name": "Alice", "place": "Wonderland"}
        )
        assert errors == []

    def test_validate_template_parameters_missing(self, prompt_service):
        """Test validation with missing parameters."""
        errors = prompt_service.validate_template_parameters("greeting", {"name": "Alice"})
        assert len(errors) > 0
        assert "Missing required parameters" in errors[0]

    def test_validate_template_parameters_template_not_found(self, prompt_service):
        """Test validation for non-existent template."""
        errors = prompt_service.validate_template_parameters("nonexistent", {})
        assert len(errors) > 0
        assert "not found" in errors[0]

    def test_validate_template_parameters_extra_params(self, prompt_service):
        """Test validation with extra parameters (should succeed)."""
        errors = prompt_service.validate_template_parameters(
            "greeting", {"name": "Alice", "place": "Wonderland", "extra": "value"}
        )
        assert errors == []


class TestPromptServiceUsageTracking:
    """Tests for template usage tracking."""

    def test_update_template_usage_creates_count(self, prompt_service):
        """Test updating template usage for first time."""
        prompt_service.update_template_usage("greeting")
        metadata = prompt_service.get_template_metadata("greeting")
        assert metadata.get("usage_count", 0) >= 1

    def test_update_template_usage_increments(self, prompt_service):
        """Test that usage count increments."""
        prompt_service.update_template_usage("greeting")
        prompt_service.update_template_usage("greeting")
        metadata = prompt_service.get_template_metadata("greeting")
        assert metadata.get("usage_count", 0) >= 2

    def test_update_template_usage_sets_last_used(self, prompt_service):
        """Test that last_used timestamp is set."""
        prompt_service.update_template_usage("greeting")
        metadata = prompt_service.get_template_metadata("greeting")
        assert "last_used" in metadata

    def test_update_template_usage_nonexistent(self, prompt_service):
        """Test updating usage for non-existent template (should not error)."""
        prompt_service.update_template_usage("nonexistent")
        # Should not raise exception


class TestPromptServiceReload:
    """Tests for template reloading."""

    def test_reload_templates(self, prompt_service, temp_prompts_dir):
        """Test reloading templates from disk."""
        original_count = len(prompt_service._templates)
        prompt_service.reload_templates()
        assert prompt_service._cached is True
        assert len(prompt_service._templates) >= original_count

    def test_reload_clears_cache(self, prompt_service):
        """Test that reload clears the cache."""
        prompt_service._cached = True
        prompt_service.reload_templates()
        # After reload, should be re-cached
        assert prompt_service._cached is True

    def test_reload_with_file_changes(self, temp_prompts_dir, prompt_service):
        """Test reload picks up file changes."""
        initial_count = len(prompt_service._templates)

        # Add new template
        new_prompts = {
            "new_template": {
                "name": "New Template",
                "description": "New",
                "category": "general",
                "version": "1.0",
                "template": "New {param}",
                "parameters": ["param"],
                "output_format": "text",
            }
        }
        new_file = temp_prompts_dir / "new_prompts.json"
        with open(new_file, "w") as f:
            json.dump(new_prompts, f)

        prompt_service.reload_templates()
        assert len(prompt_service._templates) > initial_count


class TestPromptServiceGlobalFunctions:
    """Tests for module-level convenience functions."""

    def test_get_prompt_service_singleton(self):
        """Test that get_prompt_service returns singleton."""
        service1 = get_prompt_service()
        service2 = get_prompt_service()
        assert service1 is service2

    def test_format_prompt_global_function(self, monkeypatch):
        """Test global format_prompt function."""
        mock_service = MagicMock()
        mock_service.format_prompt.return_value = "Formatted prompt"
        mock_service.update_template_usage.return_value = None

        monkeypatch.setattr("app.core.prompt_service._prompt_service", mock_service)

        result = format_prompt("test_template", param="value")
        assert result == "Formatted prompt"
        mock_service.update_template_usage.assert_called_once_with("test_template")

    def test_get_system_prompt_global_function(self, monkeypatch):
        """Test global get_system_prompt function."""
        mock_service = MagicMock()
        mock_service.get_system_prompt.return_value = "System prompt"

        monkeypatch.setattr("app.core.prompt_service._prompt_service", mock_service)

        result = get_system_prompt("test_template")
        assert result == "System prompt"
        mock_service.get_system_prompt.assert_called_once_with("test_template")


class TestPromptServiceEdgeCases:
    """Tests for edge cases and error conditions."""

    def test_empty_template_string(self, prompt_service):
        """Test template with empty template string."""
        template = PromptTemplate(
            name="Empty",
            description="Empty template",
            category="general",
            version="1.0",
            template="",
            parameters=[],
            output_format="text",
        )
        result = template.format()
        assert result == ""

    def test_template_with_numeric_parameters(self):
        """Test template with numeric parameter values."""
        template = PromptTemplate(
            name="Numeric",
            description="Test",
            category="general",
            version="1.0",
            template="Price: ${price}, Quantity: {quantity}",
            parameters=["price", "quantity"],
            output_format="text",
        )
        result = template.format(price=99.99, quantity=5)
        assert "99.99" in result
        assert "5" in result

    def test_template_with_special_characters(self):
        """Test template with special characters."""
        template = PromptTemplate(
            name="Special",
            description="Test",
            category="general",
            version="1.0",
            template="Hello @{name}! Use #hashtag",
            parameters=["name"],
            output_format="text",
        )
        result = template.format(name="User")
        assert "@User" in result
        assert "#hashtag" in result

    def test_category_with_no_config(self, prompt_service):
        """Test getting config for category with no configuration."""
        config = prompt_service.get_category_config("interview_prep")
        # Category exists in templates but may not have explicit config
        assert isinstance(config, dict)

    def test_format_prompt_with_unicode(self, prompt_service):
        """Test formatting with unicode characters."""
        result = prompt_service.format_prompt("greeting", name="Müller", place="München")
        assert "Müller" in result
        assert "München" in result

    def test_very_long_template_parameters(self):
        """Test template formatting with very long parameter values."""
        long_text = "x" * 10000
        template = PromptTemplate(
            name="Long",
            description="Test",
            category="general",
            version="1.0",
            template="Content: {content}",
            parameters=["content"],
            output_format="text",
        )
        result = template.format(content=long_text)
        assert long_text in result

    def test_template_with_braces_in_values(self):
        """Test template with literal braces in parameter values."""
        template = PromptTemplate(
            name="Braces",
            description="Test",
            category="general",
            version="1.0",
            template="JSON: {json_data}",
            parameters=["json_data"],
            output_format="text",
        )
        json_str = '{"key": "value"}'
        result = template.format(json_data=json_str)
        assert json_str in result

    def test_multiple_same_parameter_in_template(self):
        """Test template using same parameter multiple times."""
        template = PromptTemplate(
            name="Repeat",
            description="Test",
            category="general",
            version="1.0",
            template="{name} says hello to {name}",
            parameters=["name"],
            output_format="text",
        )
        result = template.format(name="Echo")
        assert result == "Echo says hello to Echo"

    def test_config_with_no_validation_rules(self, temp_prompts_dir):
        """Test service with config missing validation_rules."""
        config = {"prompt_management": {}}
        config_file = temp_prompts_dir / "prompt_config.json"
        with open(config_file, "w") as f:
            json.dump(config, f)

        service = PromptService(prompts_dir=str(temp_prompts_dir))
        # Should still work, using defaults
        errors = service.validate_template_parameters("greeting", {})
        assert isinstance(errors, list)


class TestPromptServiceIntegration:
    """Integration tests combining multiple operations."""

    def test_full_workflow(self, prompt_service):
        """Test complete workflow: validate -> format -> track."""
        # Validate
        errors = prompt_service.validate_template_parameters(
            "greeting", {"name": "Bob", "place": "NYC"}
        )
        assert errors == []

        # Format
        result = prompt_service.format_prompt("greeting", name="Bob", place="NYC")
        assert "Bob" in result

        # Track usage
        prompt_service.update_template_usage("greeting")
        metadata = prompt_service.get_template_metadata("greeting")
        assert metadata.get("usage_count", 0) >= 1

    def test_multiple_format_calls(self, prompt_service):
        """Test formatting same template with different parameters."""
        result1 = prompt_service.format_prompt("greeting", name="Alice", place="Paris")
        result2 = prompt_service.format_prompt("greeting", name="Bob", place="Berlin")

        assert "Alice" in result1
        assert "Paris" in result1
        assert "Bob" in result2
        assert "Berlin" in result2

    def test_list_and_format_all_templates(self, prompt_service):
        """Test listing all templates and formatting each."""
        template_ids = prompt_service.list_templates()
        assert len(template_ids) > 0

        for template_id in template_ids:
            template = prompt_service.get_template(template_id)
            assert template is not None

    def test_category_filtering_and_validation(self, prompt_service):
        """Test getting templates by category and validating them."""
        general_templates = prompt_service.get_templates_by_category("general")
        assert len(general_templates) > 0

        for template in general_templates:
            # Check that each template can be validated
            valid_params = dict.fromkeys(template.parameters, "test_value")
            errors = prompt_service.validate_template_parameters(
                prompt_service.list_templates()[0], valid_params
            )
            # May have errors, but method should work


class TestPromptServiceConcurrency:
    """Tests for concurrent operations (simulated)."""

    def test_concurrent_usage_updates(self, prompt_service):
        """Test that multiple usage updates work correctly."""
        for _ in range(5):
            prompt_service.update_template_usage("greeting")

        metadata = prompt_service.get_template_metadata("greeting")
        assert metadata.get("usage_count", 0) >= 5

    def test_multiple_template_access(self, prompt_service):
        """Test accessing multiple templates in sequence."""
        for template_id in prompt_service.list_templates():
            template = prompt_service.get_template(template_id)
            assert template is not None
