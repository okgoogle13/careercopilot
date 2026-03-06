"""Comprehensive tests for ApplicationStrategyRequest model.

Tests cover Pydantic validation, field serialization, and data integrity.
"""

import pytest
from pydantic import ValidationError

from app.models.strategy_request import ApplicationStrategyRequest

# ============================================================================
# Model Creation Tests
# ============================================================================


class TestApplicationStrategyRequestCreation:
    """Tests for creating ApplicationStrategyRequest instances."""

    def test_create_with_required_fields(self):
        """Test creating request with required fields."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job/123",
            resume_text="John Doe\n\nExperienced developer",
        )

        assert request.job_url == "https://example.com/job/123"
        assert request.resume_text == "John Doe\n\nExperienced developer"

    def test_create_with_all_fields(self):
        """Test creating request with all fields."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job/456",
            resume_text="Jane Smith\n\nEngineer",
            missing_keywords=["Python", "AWS"],
        )

        assert request.job_url == "https://example.com/job/456"
        assert request.resume_text == "Jane Smith\n\nEngineer"
        assert request.missing_keywords == ["Python", "AWS"]

    def test_create_with_empty_missing_keywords(self):
        """Test creating request with empty keywords list."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="Resume content",
            missing_keywords=[],
        )

        assert request.missing_keywords == []

    def test_default_missing_keywords_empty_list(self):
        """Test missing_keywords defaults to empty list."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="Resume",
        )

        assert request.missing_keywords == []
        assert isinstance(request.missing_keywords, list)


# ============================================================================
# Field Validation Tests
# ============================================================================


class TestFieldValidation:
    """Tests for field validation."""

    def test_missing_job_url_raises_error(self):
        """Test missing job_url raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            ApplicationStrategyRequest(
                resume_text="Resume content",
            )

        assert "job_url" in str(exc_info.value)

    def test_missing_resume_text_raises_error(self):
        """Test missing resume_text raises validation error."""
        with pytest.raises(ValidationError) as exc_info:
            ApplicationStrategyRequest(
                job_url="https://example.com/job",
            )

        assert "resume_text" in str(exc_info.value)

    def test_none_job_url_raises_error(self):
        """Test None job_url raises validation error."""
        with pytest.raises(ValidationError):
            ApplicationStrategyRequest(
                job_url=None,
                resume_text="Resume",
            )

    def test_none_resume_text_raises_error(self):
        """Test None resume_text raises validation error."""
        with pytest.raises(ValidationError):
            ApplicationStrategyRequest(
                job_url="https://example.com/job",
                resume_text=None,
            )

    def test_empty_job_url_accepted(self):
        """Test empty string job_url is accepted."""
        # Pydantic allows empty strings by default
        request = ApplicationStrategyRequest(
            job_url="",
            resume_text="Resume",
        )
        assert request.job_url == ""

    def test_empty_resume_text_accepted(self):
        """Test empty string resume_text is accepted."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="",
        )
        assert request.resume_text == ""


# ============================================================================
# Data Type Tests
# ============================================================================


class TestDataTypes:
    """Tests for data type handling."""

    def test_job_url_string_type(self):
        """Test job_url is string type."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="Resume",
        )
        assert isinstance(request.job_url, str)

    def test_resume_text_string_type(self):
        """Test resume_text is string type."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume content",
        )
        assert isinstance(request.resume_text, str)

    def test_missing_keywords_list_type(self):
        """Test missing_keywords is list type."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=["Python"],
        )
        assert isinstance(request.missing_keywords, list)

    def test_missing_keywords_list_of_strings(self):
        """Test missing_keywords contains strings."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=["Python", "AWS", "Docker"],
        )
        assert all(isinstance(k, str) for k in request.missing_keywords)

    def test_type_coercion_integer_to_string_url(self):
        """Test type validation rejects integer for job_url."""
        # Pydantic v2 enforces strict typing
        with pytest.raises(ValidationError):
            ApplicationStrategyRequest(
                job_url=12345,
                resume_text="Resume",
            )


# ============================================================================
# Serialization Tests
# ============================================================================


class TestSerialization:
    """Tests for model serialization."""

    def test_model_dict_conversion(self):
        """Test converting model to dict."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="Resume content",
            missing_keywords=["Python"],
        )

        data = request.model_dump()

        assert isinstance(data, dict)
        assert data["job_url"] == "https://example.com/job"
        assert data["resume_text"] == "Resume content"
        assert data["missing_keywords"] == ["Python"]

    def test_model_json_conversion(self):
        """Test converting model to JSON."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="Resume",
            missing_keywords=["Python", "AWS"],
        )

        json_str = request.model_dump_json()

        assert isinstance(json_str, str)
        assert "https://example.com/job" in json_str
        assert "Resume" in json_str
        assert "Python" in json_str

    def test_model_reconstruction_from_dict(self):
        """Test creating model from dict."""
        data = {
            "job_url": "https://example.com/job",
            "resume_text": "Resume",
            "missing_keywords": ["Python"],
        }

        request = ApplicationStrategyRequest(**data)

        assert request.job_url == data["job_url"]
        assert request.resume_text == data["resume_text"]
        assert request.missing_keywords == data["missing_keywords"]

    def test_model_reconstruction_with_extra_fields(self):
        """Test creating model with extra fields (should be ignored)."""
        data = {
            "job_url": "https://example.com",
            "resume_text": "Resume",
            "missing_keywords": ["Python"],
            "extra_field": "should be ignored",
        }

        request = ApplicationStrategyRequest(**data)

        assert request.job_url == "https://example.com"
        # Extra field should not be stored
        assert not hasattr(request, "extra_field")


# ============================================================================
# Edge Cases Tests
# ============================================================================


class TestEdgeCases:
    """Tests for edge cases."""

    def test_very_long_job_url(self):
        """Test handling very long job URL."""
        long_url = "https://example.com/" + "a" * 10000
        request = ApplicationStrategyRequest(
            job_url=long_url,
            resume_text="Resume",
        )
        assert request.job_url == long_url

    def test_very_long_resume_text(self):
        """Test handling very long resume text."""
        long_resume = "A" * 50000
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text=long_resume,
        )
        assert request.resume_text == long_resume

    def test_many_missing_keywords(self):
        """Test handling many missing keywords."""
        keywords = [f"keyword{i}" for i in range(1000)]
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=keywords,
        )
        assert len(request.missing_keywords) == 1000

    def test_special_characters_in_url(self):
        """Test URL with special characters."""
        url = "https://example.com/job?id=123&title=Senior%20Engineer"
        request = ApplicationStrategyRequest(
            job_url=url,
            resume_text="Resume",
        )
        assert request.job_url == url

    def test_special_characters_in_resume(self):
        """Test resume with special characters."""
        resume = "John Doe\nEmail: john@example.com\nSkills: Python, C++, C#"
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text=resume,
        )
        assert request.resume_text == resume

    def test_unicode_characters(self):
        """Test handling unicode characters."""
        request = ApplicationStrategyRequest(
            job_url="https://example.com/job",
            resume_text="João da Silva\n技能：Python、JavaScript",
            missing_keywords=["Português", "中文"],
        )
        assert "João" in request.resume_text
        assert "技能" in request.resume_text
        assert "中文" in request.missing_keywords

    def test_whitespace_handling(self):
        """Test handling various whitespace."""
        request = ApplicationStrategyRequest(
            job_url="  https://example.com  ",
            resume_text="  Resume with spaces  ",
            missing_keywords=["  keyword  "],
        )
        # Pydantic doesn't strip by default
        assert request.job_url == "  https://example.com  "

    def test_newlines_and_tabs(self):
        """Test handling newlines and tabs."""
        resume = "Name:\tJohn Doe\nPosition:\tEngineer\nSkills:\tPython\n\tJavaScript"
        request = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text=resume,
        )
        assert "\t" in request.resume_text
        assert "\n" in request.resume_text


# ============================================================================
# Model Validation Rules Tests
# ============================================================================


class TestModelValidationRules:
    """Tests for Pydantic validation configuration."""

    def test_model_is_pydantic_base_model(self):
        """Test ApplicationStrategyRequest is BaseModel."""
        from pydantic import BaseModel

        assert issubclass(ApplicationStrategyRequest, BaseModel)

    def test_model_fields_defined(self):
        """Test model has required fields."""
        fields = ApplicationStrategyRequest.model_fields
        assert "job_url" in fields
        assert "resume_text" in fields
        assert "missing_keywords" in fields

    def test_job_url_is_required(self):
        """Test job_url field is required."""
        field_info = ApplicationStrategyRequest.model_fields["job_url"]
        assert field_info.is_required()

    def test_resume_text_is_required(self):
        """Test resume_text field is required."""
        field_info = ApplicationStrategyRequest.model_fields["resume_text"]
        assert field_info.is_required()

    def test_missing_keywords_is_optional_with_default(self):
        """Test missing_keywords has default value."""
        field_info = ApplicationStrategyRequest.model_fields["missing_keywords"]
        assert field_info.default == []


# ============================================================================
# Field Type Annotation Tests
# ============================================================================


class TestFieldTypeAnnotations:
    """Tests for field type annotations."""

    def test_job_url_annotation(self):
        """Test job_url is annotated as str."""
        annotations = ApplicationStrategyRequest.__annotations__
        assert annotations.get("job_url") == str

    def test_resume_text_annotation(self):
        """Test resume_text is annotated as str."""
        annotations = ApplicationStrategyRequest.__annotations__
        assert annotations.get("resume_text") == str

    def test_missing_keywords_annotation(self):
        """Test missing_keywords is annotated as list."""
        annotations = ApplicationStrategyRequest.__annotations__
        missing_keywords_type = annotations.get("missing_keywords")
        assert "list" in str(missing_keywords_type)


# ============================================================================
# Comparison and Equality Tests
# ============================================================================


class TestEqualityAndComparison:
    """Tests for model equality and comparison."""

    def test_identical_requests_are_equal(self):
        """Test two identical requests are equal."""
        req1 = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
        )
        req2 = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
        )
        assert req1 == req2

    def test_different_requests_not_equal(self):
        """Test different requests are not equal."""
        req1 = ApplicationStrategyRequest(
            job_url="https://example.com/1",
            resume_text="Resume1",
        )
        req2 = ApplicationStrategyRequest(
            job_url="https://example.com/2",
            resume_text="Resume2",
        )
        assert req1 != req2

    def test_different_keywords_not_equal(self):
        """Test requests with different keywords are not equal."""
        req1 = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=["Python"],
        )
        req2 = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=["JavaScript"],
        )
        assert req1 != req2


# ============================================================================
# Copy and Clone Tests
# ============================================================================


class TestCopyAndClone:
    """Tests for copying model instances."""

    def test_model_copy(self):
        """Test copying model instance."""
        original = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=["Python"],
        )

        copy = original.model_copy()

        assert copy == original
        assert copy is not original

    def test_model_copy_update(self):
        """Test copying and updating model."""
        original = ApplicationStrategyRequest(
            job_url="https://example.com/1",
            resume_text="Resume",
        )

        updated = original.model_copy(update={"job_url": "https://example.com/2"})

        assert original.job_url == "https://example.com/1"
        assert updated.job_url == "https://example.com/2"

    def test_model_copy_deep(self):
        """Test deep copy of model."""
        original = ApplicationStrategyRequest(
            job_url="https://example.com",
            resume_text="Resume",
            missing_keywords=["Python", "AWS"],
        )

        copy = original.model_copy(deep=True)

        copy.missing_keywords.append("Docker")

        assert len(original.missing_keywords) == 2
        assert len(copy.missing_keywords) == 3
