"""
Prompt Management Service

Centralized service for loading, managing, and formatting AI prompts
from external JSON files. Provides caching, validation, and versioning.
"""

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


@dataclass
class PromptTemplate:
    """Represents a single prompt template with metadata"""

    name: str
    description: str
    category: str
    version: str
    template: str
    parameters: list[str]
    output_format: str
    system_prompt: str | None = None
    has_system_prompt: bool = False
    metadata: dict[str, Any] = field(default_factory=dict)

    def format(self, **kwargs: Any) -> str:
        """Format the template with provided parameters"""
        try:
            # Validate required parameters
            missing_params = [param for param in self.parameters if param not in kwargs]
            if missing_params:
                raise ValueError(f"Missing required parameters: {missing_params}")

            # Replace None values with empty strings or default values
            formatted_kwargs = {}
            for key, value in kwargs.items():
                if value is None:
                    formatted_kwargs[key] = "Not specified"
                else:
                    formatted_kwargs[key] = str(value)

            return self.template.format(**formatted_kwargs)
        except KeyError as e:
            raise ValueError(f"Template formatting failed: missing parameter {e}")
        except Exception as e:
            raise ValueError(f"Template formatting failed: {e!s}")


class PromptService:
    """Service for managing AI prompts from JSON templates"""

    def __init__(self, prompts_dir: str | None = None):
        self.prompts_dir = Path(prompts_dir or self._get_default_prompts_dir())
        self._templates: dict[str, PromptTemplate] = {}
        self._config: dict[str, Any] = {}
        self._cached = False

        # Load configuration and templates on initialization
        self._load_config()
        self._load_templates()

    def _get_default_prompts_dir(self) -> str:
        """Get the default prompts directory path"""
        current_file = Path(__file__)
        app_dir = current_file.parent.parent  # Go up from core to app
        return str(app_dir / "prompts")

    def _load_config(self) -> None:
        """Load prompt configuration from JSON"""
        config_path = self.prompts_dir / "prompt_config.json"
        try:
            with open(config_path, encoding="utf-8") as f:
                self._config = json.load(f)
            logger.info(f"Loaded prompt configuration from {config_path}")
        except FileNotFoundError:
            logger.warning(f"Prompt config file not found at {config_path}, using defaults")
            self._config = self._get_default_config()
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in prompt config: {e}")
            self._config = self._get_default_config()

    def _get_default_config(self) -> dict[str, Any]:
        """Get default configuration when config file is missing"""
        return {
            "prompt_management": {
                "version": "1.0",
                "default_language": "en",
                "cache_prompts": True,
                "validate_parameters": True,
            },
            "categories": {},
            "validation_rules": {
                "required_parameters": True,
                "parameter_type_checking": True,
                "template_syntax_validation": True,
            },
        }

    def _load_templates(self) -> None:
        """Load all prompt templates from JSON files"""
        template_files = list(self.prompts_dir.glob("*.json"))
        template_files = [f for f in template_files if f.name != "prompt_config.json"]

        for template_file in template_files:
            try:
                with open(template_file, encoding="utf-8") as f:
                    templates_data = json.load(f)

                for template_id, template_data in templates_data.items():
                    template = self._create_template(template_id, template_data)
                    self._templates[template_id] = template

                logger.info(f"Loaded {len(templates_data)} templates from {template_file.name}")

            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in template file {template_file}: {e}")
            except Exception as e:
                logger.error(f"Error loading templates from {template_file}: {e}")

        self._cached = True
        logger.info(f"Total templates loaded: {len(self._templates)}")

    def _create_template(self, template_id: str, template_data: dict[str, Any]) -> PromptTemplate:
        """Create a PromptTemplate object from JSON data"""
        return PromptTemplate(
            name=template_data.get("name", template_id),
            description=template_data.get("description", ""),
            category=template_data.get("category", "general"),
            version=template_data.get("version", "1.0"),
            template=template_data.get("template", ""),
            parameters=template_data.get("parameters", []),
            output_format=template_data.get("output_format", "text"),
            system_prompt=template_data.get("system_prompt"),
            has_system_prompt=template_data.get("has_system_prompt", False),
            metadata=template_data.get("metadata", {}),
        )

    def get_template(self, template_id: str) -> PromptTemplate | None:
        """Get a specific prompt template by ID"""
        return self._templates.get(template_id)

    def get_templates_by_category(self, category: str) -> list[PromptTemplate]:
        """Get all templates in a specific category"""
        return [template for template in self._templates.values() if template.category == category]

    def list_templates(self) -> list[str]:
        """List all available template IDs"""
        return list(self._templates.keys())

    def list_categories(self) -> list[str]:
        """List all available categories"""
        return list({template.category for template in self._templates.values()})

    def format_prompt(self, template_id: str, **kwargs: Any) -> str:
        """Format a prompt template with the provided parameters"""
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template '{template_id}' not found")

        # Add default values from config for missing parameters
        if template.category in self._config.get("categories", {}):
            self._config["categories"][template.category]
            # Could add default parameter values from category config if needed

        return template.format(**kwargs)

    def get_system_prompt(self, template_id: str) -> str | None:
        """Get the system prompt for a template if it exists"""
        template = self.get_template(template_id)
        if template and template.has_system_prompt:
            return template.system_prompt
        return None

    def get_category_config(self, category: str) -> dict[str, Any]:
        """Get configuration for a specific category"""
        categories = self._config.get("categories", {})
        from typing import cast as _cast

        return _cast(dict[str, Any], categories.get(category, {}))

    def get_length_instruction(self, length_type: str) -> str:
        """Get length instruction text for a specific type"""
        from typing import cast as _cast

        length_instructions = _cast(dict[str, str], self._config.get("length_instructions", {}))
        return length_instructions.get(length_type, length_instructions.get("standard", ""))

    def validate_template_parameters(
        self, template_id: str, parameters: dict[str, Any]
    ) -> list[str]:
        """Validate parameters for a template and return any validation errors"""
        template = self.get_template(template_id)
        if not template:
            return [f"Template '{template_id}' not found"]

        errors = []

        # Check for missing required parameters
        if self._config.get("validation_rules", {}).get("required_parameters", True):
            missing_params = [param for param in template.parameters if param not in parameters]
            if missing_params:
                errors.append(f"Missing required parameters: {missing_params}")

        return errors

    def reload_templates(self) -> None:
        """Reload all templates from disk (useful for development)"""
        self._templates.clear()
        self._cached = False
        self._load_config()
        self._load_templates()
        logger.info("Templates reloaded from disk")

    def get_template_metadata(self, template_id: str) -> dict[str, Any]:
        """Get metadata for a specific template"""
        template = self.get_template(template_id)
        if not template:
            return {}
        return template.metadata

    def update_template_usage(self, template_id: str) -> None:
        """Update usage count for a template (for analytics)"""
        template = self.get_template(template_id)
        if template:
            template.metadata["usage_count"] = template.metadata.get("usage_count", 0) + 1
            template.metadata["last_used"] = datetime.now().isoformat()


# Global instance
_prompt_service: PromptService | None = None


def get_prompt_service() -> PromptService:
    """Get the global prompt service instance"""
    global _prompt_service
    if _prompt_service is None:
        _prompt_service = PromptService()
    return _prompt_service


def format_prompt(template_id: str, **kwargs: Any) -> str:
    """Convenience function to format a prompt"""
    service = get_prompt_service()
    service.update_template_usage(template_id)
    return service.format_prompt(template_id, **kwargs)


def get_system_prompt(template_id: str) -> str | None:
    """Convenience function to get a system prompt"""
    return get_prompt_service().get_system_prompt(template_id)
