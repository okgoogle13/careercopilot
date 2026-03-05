"""
Tests for the prompt management service

Validates that prompts can be loaded, formatted, and used correctly.
"""

import json
from unittest.mock import patch

import pytest

from app.core.prompt_service import PromptService, PromptTemplate, format_prompt, get_system_prompt


@pytest.fixture
def temp_prompts_dir(tmp_path):
    """Create a temporary prompts directory for testing"""
    prompts_dir = tmp_path / "prompts"
    prompts_dir.mkdir()

    # Create test config
    config_data = {
        "prompt_management": {"version": "1.0", "cache_prompts": True},
        "categories": {"test_category": {"name": "Test Category", "default_temperature": 0.3}},
        "length_instructions": {
            "concise": "Keep it short (100-200 words)",
            "standard": "Standard length (300-400 words)",
        },
    }

    config_file = prompts_dir / "prompt_config.json"
    config_file.write_text(json.dumps(config_data, indent=2))

    # Create test templates
    templates_data = {
        "test_template": {
            "name": "Test Template",
            "description": "A test template",
            "category": "test_category",
            "version": "1.0",
            "template": "Hello {name}, this is a test with {param}.",
            "parameters": ["name", "param"],
            "output_format": "text",
            "metadata": {"usage_count": 0},
        },
        "system_prompt_template": {
            "name": "System Prompt Template",
            "description": "Template with system prompt",
            "category": "test_category",
            "version": "1.0",
            "system_prompt": "You are a helpful assistant.",
            "template": "Process this: {input_text}",
            "parameters": ["input_text"],
            "output_format": "json",
            "has_system_prompt": True,
            "metadata": {"usage_count": 0},
        },
    }

    templates_file = prompts_dir / "test_templates.json"
    templates_file.write_text(json.dumps(templates_data, indent=2))

    return str(prompts_dir)


class TestPromptService:
    """Test the PromptService class"""

    def test_prompt_service_initialization(self, temp_prompts_dir):
        """Test that PromptService initializes correctly"""
        service = PromptService(temp_prompts_dir)

        assert service._cached is True
        assert len(service._templates) == 2
        assert "test_template" in service._templates
        assert "system_prompt_template" in service._templates

    def test_get_template(self, temp_prompts_dir):
        """Test getting a specific template"""
        service = PromptService(temp_prompts_dir)

        template = service.get_template("test_template")
        assert template is not None
        assert template.name == "Test Template"
        assert template.category == "test_category"
        assert len(template.parameters) == 2

    def test_template_formatting(self, temp_prompts_dir):
        """Test formatting a template with parameters"""
        service = PromptService(temp_prompts_dir)

        result = service.format_prompt("test_template", name="Alice", param="example")
        assert result == "Hello Alice, this is a test with example."

    def test_template_formatting_missing_params(self, temp_prompts_dir):
        """Test that missing parameters raise an error"""
        service = PromptService(temp_prompts_dir)

        with pytest.raises(ValueError, match="Missing required parameters"):
            service.format_prompt("test_template", name="Alice")

    def test_get_system_prompt(self, temp_prompts_dir):
        """Test getting system prompt from template"""
        service = PromptService(temp_prompts_dir)

        system_prompt = service.get_system_prompt("system_prompt_template")
        assert system_prompt == "You are a helpful assistant."

        # Test template without system prompt
        system_prompt = service.get_system_prompt("test_template")
        assert system_prompt is None

    def test_list_templates(self, temp_prompts_dir):
        """Test listing all templates"""
        service = PromptService(temp_prompts_dir)

        templates = service.list_templates()
        assert len(templates) == 2
        assert "test_template" in templates
        assert "system_prompt_template" in templates

    def test_get_templates_by_category(self, temp_prompts_dir):
        """Test getting templates by category"""
        service = PromptService(temp_prompts_dir)

        templates = service.get_templates_by_category("test_category")
        assert len(templates) == 2

    def test_get_length_instruction(self, temp_prompts_dir):
        """Test getting length instructions"""
        service = PromptService(temp_prompts_dir)

        instruction = service.get_length_instruction("concise")
        assert instruction == "Keep it short (100-200 words)"

        # Nonexistent length type falls back to "standard" default
        instruction = service.get_length_instruction("nonexistent")
        assert instruction == "Standard length (300-400 words)"

    def test_validate_template_parameters(self, temp_prompts_dir):
        """Test parameter validation"""
        service = PromptService(temp_prompts_dir)

        # Valid parameters
        errors = service.validate_template_parameters(
            "test_template", {"name": "Alice", "param": "test"}
        )
        assert len(errors) == 0

        # Missing parameters
        errors = service.validate_template_parameters("test_template", {"name": "Alice"})
        assert len(errors) == 1
        assert "Missing required parameters" in errors[0]

    def test_update_template_usage(self, temp_prompts_dir):
        """Test updating template usage statistics"""
        service = PromptService(temp_prompts_dir)

        template = service.get_template("test_template")
        original_count = template.metadata.get("usage_count", 0)

        service.update_template_usage("test_template")

        assert template.metadata["usage_count"] == original_count + 1
        assert "last_used" in template.metadata

    def test_list_categories(self, temp_prompts_dir):
        """Test listing categories"""
        service = PromptService(temp_prompts_dir)
        categories = service.list_categories()
        assert "test_category" in categories

    def test_get_category_config(self, temp_prompts_dir):
        """Test getting category configuration"""
        service = PromptService(temp_prompts_dir)
        config = service.get_category_config("test_category")
        assert config["name"] == "Test Category"

        # Non-existent category
        assert service.get_category_config("nonexistent") == {}

    def test_get_template_metadata(self, temp_prompts_dir):
        """Test getting template metadata"""
        service = PromptService(temp_prompts_dir)
        metadata = service.get_template_metadata("test_template")
        assert "usage_count" in metadata

        # Non-existent template
        assert service.get_template_metadata("nonexistent") == {}

    def test_reload_templates(self, temp_prompts_dir):
        """Test reloading templates from disk"""
        service = PromptService(temp_prompts_dir)
        # Clear templates to ensure they are reloaded
        service._templates.clear()
        assert len(service._templates) == 0

        service.reload_templates()
        assert len(service._templates) == 2

    def test_validate_parameters_template_not_found(self, temp_prompts_dir):
        """Test validation when template is not found"""
        service = PromptService(temp_prompts_dir)
        errors = service.validate_template_parameters("nonexistent", {})
        assert len(errors) == 1
        assert "not found" in errors[0]

    def test_update_template_usage_nonexistent(self, temp_prompts_dir):
        """Test updating usage for non-existent template (should not crash)"""
        service = PromptService(temp_prompts_dir)
        service.update_template_usage("nonexistent")


class TestPromptTemplate:
    """Test the PromptTemplate class"""

    def test_template_creation(self):
        """Test creating a PromptTemplate"""
        template = PromptTemplate(
            name="Test",
            description="Test template",
            category="test",
            version="1.0",
            template="Hello {name}",
            parameters=["name"],
            output_format="text",
        )

        assert template.name == "Test"
        assert template.parameters == ["name"]

    def test_template_formatting(self):
        """Test template formatting"""
        template = PromptTemplate(
            name="Test",
            description="Test template",
            category="test",
            version="1.0",
            template="Hello {name}, your score is {score}",
            parameters=["name", "score"],
            output_format="text",
        )

        result = template.format(name="Alice", score=95)
        assert result == "Hello Alice, your score is 95"

    def test_template_formatting_with_none_values(self):
        """Test template formatting with None values"""
        template = PromptTemplate(
            name="Test",
            description="Test template",
            category="test",
            version="1.0",
            template="Hello {name}, status: {status}",
            parameters=["name", "status"],
            output_format="text",
        )

        result = template.format(name="Alice", status=None)
        assert result == "Hello Alice, status: Not specified"

    def test_template_formatting_key_error(self):
        """Test template formatting with missing key during format call"""
        template = PromptTemplate(
            name="Test",
            description="Test template",
            category="test",
            version="1.0",
            template="Hello {name}, {missing}",
            parameters=["name"],  # Parameter missing from explicit param list
            output_format="text",
        )

        with pytest.raises(ValueError, match="Template formatting failed"):
            template.format(name="Alice")


class TestConvenienceFunctions:
    """Test the convenience functions"""

    def test_format_prompt_function(self, temp_prompts_dir):
        """Test the format_prompt convenience function"""
        with patch("app.core.prompt_service._prompt_service", PromptService(temp_prompts_dir)):
            result = format_prompt("test_template", name="Bob", param="data")
            assert result == "Hello Bob, this is a test with data."

    def test_get_system_prompt_function(self, temp_prompts_dir):
        """Test the get_system_prompt convenience function"""
        with patch("app.core.prompt_service._prompt_service", PromptService(temp_prompts_dir)):
            system_prompt = get_system_prompt("system_prompt_template")
            assert system_prompt == "You are a helpful assistant."


class TestErrorHandling:
    """Test error handling scenarios"""

    def test_missing_config_file(self, tmp_path):
        """Test handling missing config file"""
        prompts_dir = tmp_path / "prompts"
        prompts_dir.mkdir()

        # Only create templates, no config
        templates_data = {
            "test_template": {
                "name": "Test",
                "description": "Test",
                "category": "test",
                "version": "1.0",
                "template": "Hello {name}",
                "parameters": ["name"],
                "output_format": "text",
            }
        }

        templates_file = prompts_dir / "test_templates.json"
        templates_file.write_text(json.dumps(templates_data))

        # Should use default config
        service = PromptService(str(prompts_dir))
        assert len(service._templates) == 1

    def test_invalid_json_config(self, tmp_path):
        """Test handling invalid JSON in config file"""
        prompts_dir = tmp_path / "prompts"
        prompts_dir.mkdir()

        # Create invalid JSON config
        config_file = prompts_dir / "prompt_config.json"
        config_file.write_text("{ invalid json }")

        # Should use default config
        service = PromptService(str(prompts_dir))
        assert service._config["prompt_management"]["version"] == "1.0"

    def test_invalid_json_templates(self, tmp_path):
        """Test handling invalid JSON in templates file"""
        prompts_dir = tmp_path / "prompts"
        prompts_dir.mkdir()

        # Create valid config
        config_data = {"prompt_management": {"version": "1.0"}}
        config_file = prompts_dir / "prompt_config.json"
        config_file.write_text(json.dumps(config_data))

        # Create invalid JSON templates
        templates_file = prompts_dir / "invalid_templates.json"
        templates_file.write_text("{ invalid json }")

        # Should skip the invalid file
        service = PromptService(str(prompts_dir))
        assert len(service._templates) == 0

    def test_nonexistent_template(self, temp_prompts_dir):
        """Test accessing non-existent template"""
        service = PromptService(temp_prompts_dir)

        template = service.get_template("nonexistent")
        assert template is None

        with pytest.raises(ValueError, match="Template 'nonexistent' not found"):
            service.format_prompt("nonexistent", param="value")

    def test_get_default_prompts_dir(self):
        """Test getting the default prompts directory"""
        service = PromptService()
        default_dir = service._get_default_prompts_dir()
        assert "backend/app/prompts" in default_dir

    def test_get_prompt_service_singleton(self):
        """Test that get_prompt_service returns a singleton"""
        from app.core.prompt_service import get_prompt_service

        service1 = get_prompt_service()
        service2 = get_prompt_service()
        assert service1 is service2

    def test_format_prompt_no_category_config(self, temp_prompts_dir):
        """Test formatting a prompt without category config"""
        service = PromptService(temp_prompts_dir)
        # Manually clear category config to hit the negative branch in format_prompt
        service._config["categories"] = {}
        result = service.format_prompt("test_template", name="Alice", param="test")
        assert result == "Hello Alice, this is a test with test."
