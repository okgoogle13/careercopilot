"""
Input validation and sanitization utilities for AI agent security.
Prevents prompt injection and ensures safe processing of user inputs.
"""

import html
import re
from typing import Any

from pydantic import BaseModel


class InputValidationError(Exception):
    """Raised when input validation fails."""


class SanitizedInput(BaseModel):
    """Container for sanitized input with metadata."""

    original_length: int
    sanitized_content: str
    warnings: list[str] = []


class InputSanitizer:
    """Centralized input sanitization for AI operations."""

    # Maximum input lengths to prevent resource exhaustion
    MAX_TEXT_LENGTH = 50000  # ~50KB
    MAX_PROMPT_LENGTH = 10000  # ~10KB

    # Dangerous patterns that could indicate prompt injection
    DANGEROUS_PATTERNS = [
        r"ignore\s+previous\s+instructions",
        r"forget\s+everything",
        r"system\s*:",
        r"assistant\s*:",
        r"user\s*:",
        r"<\s*script",
        r"javascript\s*:",
        r"data\s*:",
        r"\[INST\]",
        r"\[/INST\]",
        r"###\s*instruction",
        r"###\s*response",
    ]

    # HTML tags to remove for safety
    HTML_TAGS = re.compile(r"<[^>]+>")

    @classmethod
    def sanitize_text_input(cls, text: str, max_length: int | None = None) -> SanitizedInput:
        """
        Sanitize text input for AI processing.

        Args:
            text: Raw text input from user
            max_length: Override default max length

        Returns:
            SanitizedInput with cleaned content and warnings

        Raises:
            InputValidationError: If input is invalid or dangerous
        """
        if not isinstance(text, str):
            raise InputValidationError("Input must be a string")

        original_length = len(text)
        warnings = []

        # Check length limits
        max_len = max_length or cls.MAX_TEXT_LENGTH
        if original_length > max_len:
            raise InputValidationError(
                f"Input too long: {original_length} chars (limit: {max_len})"
            )

        # Check for empty input
        if not text.strip():
            raise InputValidationError("Input cannot be empty")

        # Remove HTML tags
        sanitized = cls.HTML_TAGS.sub("", text)
        if len(sanitized) != original_length:
            warnings.append("HTML tags removed")

        # HTML entity decode
        sanitized = html.unescape(sanitized)

        # Check for dangerous prompt injection patterns
        text_lower = sanitized.lower()
        for pattern in cls.DANGEROUS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                warnings.append(f"Suspicious pattern detected: {pattern}")
                # Replace suspicious patterns with safe alternatives
                sanitized = re.sub(pattern, "[REDACTED]", sanitized, flags=re.IGNORECASE)

        # Normalize whitespace
        sanitized = re.sub(r"\s+", " ", sanitized).strip()

        # Final length check after sanitization
        if len(sanitized) > max_len:
            sanitized = sanitized[: max_len - 3] + "..."
            warnings.append("Content truncated to fit length limit")

        return SanitizedInput(
            original_length=original_length,
            sanitized_content=sanitized,
            warnings=warnings,
        )

    @classmethod
    def sanitize_dict_input(cls, data: dict[str, Any]) -> dict[str, Any]:
        """
        Recursively sanitize dictionary values.

        Args:
            data: Dictionary with potentially unsafe values

        Returns:
            Dictionary with sanitized values
        """
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                try:
                    sanitized_input = cls.sanitize_text_input(
                        value, max_length=cls.MAX_PROMPT_LENGTH
                    )
                    sanitized[key] = sanitized_input.sanitized_content
                except InputValidationError:
                    # Skip invalid inputs rather than failing the entire operation
                    continue
            elif isinstance(value, dict):
                sanitized[key] = cls.sanitize_dict_input(value)
            elif isinstance(value, list):
                sanitized[key] = [
                    (
                        cls.sanitize_text_input(item).sanitized_content
                        if isinstance(item, str)
                        else item
                    )
                    for item in value
                ]
            else:
                sanitized[key] = value
        return sanitized

    @classmethod
    def create_safe_prompt(cls, template: str, **kwargs) -> str:
        """
        Create a safe prompt by sanitizing all input variables.

        Args:
            template: Prompt template with placeholders
            **kwargs: Variables to inject into template

        Returns:
            Safe prompt with sanitized inputs

        Raises:
            InputValidationError: If template or inputs are invalid
        """
        # Sanitize all string inputs
        safe_kwargs = {}
        for key, value in kwargs.items():
            if isinstance(value, str):
                sanitized = cls.sanitize_text_input(value)
                safe_kwargs[key] = sanitized.sanitized_content
            elif isinstance(value, dict):
                safe_kwargs[key] = cls.sanitize_dict_input(value)
            else:
                safe_kwargs[key] = str(value)  # Convert to string safely

        try:
            # Create prompt with sanitized inputs
            prompt = template.format(**safe_kwargs)

            # Final safety check on complete prompt
            if len(prompt) > cls.MAX_PROMPT_LENGTH * 2:  # Allow longer for complete prompts
                raise InputValidationError(f"Generated prompt too long: {len(prompt)} chars")

            return prompt

        except KeyError as e:
            raise InputValidationError(f"Missing template variable: {e}")
        except Exception as e:
            raise InputValidationError(f"Prompt creation failed: {e}")


# Convenience functions for common use cases
def sanitize_resume_text(resume_text: str) -> str:
    """Sanitize resume text for AI analysis."""
    result = InputSanitizer.sanitize_text_input(resume_text)
    return result.sanitized_content


def sanitize_job_description(job_description: str) -> str:
    """Sanitize job description for AI analysis."""
    result = InputSanitizer.sanitize_text_input(job_description)
    return result.sanitized_content


def create_analysis_prompt(template: str, resume: str, job_desc: str) -> str:
    """Create a safe analysis prompt with sanitized inputs."""
    return InputSanitizer.create_safe_prompt(template, resume_text=resume, job_description=job_desc)
