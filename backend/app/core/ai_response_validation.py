"""
AI Response Validation and Parsing Utility

A reusable utility for validating and parsing AI responses against predefined schemas
using Pydantic models. This ensures data structure consistency and prevents errors
across all AI flows in the application.
"""

import json
import logging
from datetime import datetime
from enum import Enum
from typing import Any, TypeVar

from pydantic import BaseModel, Field, ValidationError, model_validator, validator

logger = logging.getLogger(__name__)

# Generic type for Pydantic models
T = TypeVar("T", bound=BaseModel)


class ValidationErrorType(Enum):
    """Types of validation errors that can occur"""

    INVALID_JSON = "invalid_json"
    MISSING_REQUIRED_FIELDS = "missing_required_fields"
    INVALID_FIELD_TYPE = "invalid_field_type"
    FAILED_CUSTOM_VALIDATION = "failed_custom_validation"
    EMPTY_RESPONSE = "empty_response"
    MALFORMED_STRUCTURE = "malformed_structure"


class AIResponseValidationError(Exception):
    """Custom exception for AI response validation errors"""

    def __init__(
        self,
        message: str,
        error_type: ValidationErrorType,
        original_error: Exception | None = None,
        response_content: str | None = None,
        expected_schema: str | None = None,
    ):
        self.message = message
        self.error_type = error_type
        self.original_error = original_error
        self.response_content = response_content
        self.expected_schema = expected_schema
        super().__init__(message)


class ValidationResult(BaseModel):
    """Result of AI response validation"""

    is_valid: bool
    parsed_data: Any | None = None
    error_message: str | None = None
    error_type: ValidationErrorType | None = None
    validation_warnings: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class BaseAIResponseSchema(BaseModel):
    """Base class for all AI response schemas"""

    class Config:
        # Allow extra fields by default to handle AI variability
        extra = "allow"
        # Validate assignment to catch runtime changes
        validate_assignment = True


# --- Common AI Response Schemas ---


class STARResponse(BaseAIResponseSchema):
    """STAR methodology response schema"""

    situation: str = Field(..., min_length=10, description="Situation context")
    task: str = Field(..., min_length=10, description="Task description")
    action: str = Field(..., min_length=10, description="Actions taken")
    result: str = Field(..., min_length=10, description="Results achieved")

    @validator("situation", "task", "action", "result")
    def validate_non_empty_content(cls, v):
        if not v or v.strip() == "":
            raise ValueError("STAR component cannot be empty")
        return v.strip()


class KSCAnalysis(BaseAIResponseSchema):
    """Key Selection Criteria analysis schema"""

    ksc_interpretation: str = Field(..., description="Analysis of what the KSC is asking for")
    key_competencies: list[str] = Field(..., description="Key skills/competencies tested")
    success_factors: list[str] = Field(..., description="What makes a strong response")
    common_pitfalls: list[str] = Field(default_factory=list, description="Common mistakes to avoid")


class ExperienceSelection(BaseAIResponseSchema):
    """Experience selection details schema"""

    chosen_experience: str = Field(..., description="Description of selected experience")
    relevance_score: float = Field(..., ge=0, le=100, description="Relevance score 0-100")
    selection_rationale: str = Field(..., description="Why this experience was chosen")
    alternative_experiences: list[str] = Field(
        default_factory=list, description="Other potential experiences"
    )


class KSCResponseComplete(BaseAIResponseSchema):
    """Complete KSC response with analysis"""

    ksc_analysis: KSCAnalysis
    experience_selection: ExperienceSelection
    star_response: STARResponse
    response_enhancement: dict[str, Any] | None = None
    interview_preparation: dict[str, Any] | None = None


class SemanticAnalysis(BaseAIResponseSchema):
    """Semantic analysis response schema"""

    similarity_score: float = Field(..., ge=0, le=100, description="Similarity score 0-100")
    explanation: str = Field(..., min_length=10, description="Explanation for the score")

    # Legacy field name support
    similarityScore: float | None = None

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_field(cls, values: Any) -> Any:
        if isinstance(values, dict) and values.get("similarityScore") is not None:
            values = values.copy()
            values["similarity_score"] = values["similarityScore"]
        return values


class JobRequirements(BaseAIResponseSchema):
    """Job requirements extraction schema"""

    required_skills: list[str] = Field(default_factory=list, description="Required skills")
    preferred_skills: list[str] = Field(default_factory=list, description="Preferred skills")
    experience_level: str = Field(default="", description="Required experience level")
    education_level: str = Field(default="", description="Required education level")
    responsibilities: list[str] = Field(default_factory=list, description="Key responsibilities")

    # Legacy field name support
    requiredSkills: list[str] | None = None
    preferredSkills: list[str] | None = None
    experienceLevel: str | None = None
    educationLevel: str | None = None

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_fields(cls, values: Any) -> Any:
        if not isinstance(values, dict):
            return values

        values = values.copy()
        legacy_mappings = {
            "requiredSkills": "required_skills",
            "preferredSkills": "preferred_skills",
            "experienceLevel": "experience_level",
            "educationLevel": "education_level",
        }

        for legacy_name, current_name in legacy_mappings.items():
            if values.get(legacy_name) is not None:
                values[current_name] = values[legacy_name]

        return values


class ResumeEntities(BaseAIResponseSchema):
    """Resume entities extraction schema"""

    skills: list[str] = Field(default_factory=list, description="Extracted skills")
    experience: list[dict[str, Any]] = Field(default_factory=list, description="Work experience")
    education: list[dict[str, Any]] = Field(
        default_factory=list, description="Education background"
    )
    achievements: list[str] = Field(default_factory=list, description="Key achievements")


class CoverLetterResponse(BaseAIResponseSchema):
    """Cover letter generation response schema"""

    cover_letter_content: str = Field(..., min_length=100, description="Generated cover letter")
    tone_analysis: dict[str, Any] | None = None
    customization_notes: list[str] = Field(default_factory=list)
    word_count: int | None = None

    @validator("word_count", always=True)
    def calculate_word_count(cls, v, values):
        if "cover_letter_content" in values:
            return len(values["cover_letter_content"].split())
        return v


class ATSScoreBreakdown(BaseAIResponseSchema):
    """ATS score breakdown schema"""

    keyword_score: float = Field(..., ge=0, le=100)
    semantic_score: float = Field(..., ge=0, le=100)
    formatting_score: float = Field(..., ge=0, le=100)

    # Legacy field name support
    keywordScore: float | None = None
    semanticScore: float | None = None
    formattingScore: float | None = None

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_scores(cls, values: Any) -> Any:
        if not isinstance(values, dict):
            return values

        values = values.copy()
        legacy_mappings = {
            "keywordScore": "keyword_score",
            "semanticScore": "semantic_score",
            "formattingScore": "formatting_score",
        }

        for legacy_name, current_name in legacy_mappings.items():
            if values.get(legacy_name) is not None:
                values[current_name] = values[legacy_name]

        return values


class ATSResult(BaseAIResponseSchema):
    """Complete ATS scoring result schema"""

    overall_score: float = Field(..., ge=0, le=100, description="Overall ATS score")
    breakdown: ATSScoreBreakdown
    matched_keywords: list[str] = Field(default_factory=list)
    missing_keywords: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)

    # Legacy field name support
    overallScore: float | None = None
    matchedKeywords: list[str] | None = None
    missingKeywords: list[str] | None = None

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_fields(cls, values: Any) -> Any:
        if not isinstance(values, dict):
            return values

        values = values.copy()
        legacy_mappings = {
            "overallScore": "overall_score",
            "matchedKeywords": "matched_keywords",
            "missingKeywords": "missing_keywords",
        }

        for legacy_name, current_name in legacy_mappings.items():
            if values.get(legacy_name) is not None:
                values[current_name] = values[legacy_name]

        return values


# --- AI Response Validator Class ---


class AIResponseValidator:
    """
    Main validator class for AI responses with schema validation and parsing
    """

    def __init__(self, enable_warnings: bool = True, strict_mode: bool = False):
        """
        Initialize the validator

        Args:
            enable_warnings: Whether to collect validation warnings
            strict_mode: Whether to fail on missing optional fields
        """
        self.enable_warnings = enable_warnings
        self.strict_mode = strict_mode
        self._schema_registry: dict[str, type[BaseAIResponseSchema]] = {}
        self._register_default_schemas()

    def _register_default_schemas(self):
        """Register all default schemas"""
        self._schema_registry.update(
            {
                "star_response": STARResponse,
                "ksc_complete": KSCResponseComplete,
                "ksc_analysis": KSCAnalysis,
                "semantic_analysis": SemanticAnalysis,
                "job_requirements": JobRequirements,
                "resume_entities": ResumeEntities,
                "cover_letter": CoverLetterResponse,
                "ats_result": ATSResult,
                "ats_breakdown": ATSScoreBreakdown,
            }
        )

    def register_schema(self, name: str, schema_class: type[BaseAIResponseSchema]):
        """Register a custom schema"""
        self._schema_registry[name] = schema_class
        logger.info(f"Registered custom schema: {name}")

    def validate_response(
        self,
        response_content: str,
        schema_name: str,
        fallback_data: dict[str, Any] | None = None,
    ) -> ValidationResult:
        """
        Validate AI response against a registered schema

        Args:
            response_content: Raw AI response content
            schema_name: Name of the registered schema
            fallback_data: Optional fallback data if validation fails

        Returns:
            ValidationResult with validation outcome and parsed data
        """
        if schema_name not in self._schema_registry:
            return ValidationResult(
                is_valid=False,
                error_message=f"Unknown schema: {schema_name}",
                error_type=ValidationErrorType.MALFORMED_STRUCTURE,
            )

        schema_class = self._schema_registry[schema_name]

        try:
            # Step 1: Parse JSON
            if not response_content or response_content.strip() == "":
                if fallback_data:
                    return self._create_fallback_result(schema_class, fallback_data, schema_name)

                return ValidationResult(
                    is_valid=False,
                    error_message="Empty response content",
                    error_type=ValidationErrorType.EMPTY_RESPONSE,
                )

            # Clean and parse JSON
            cleaned_content = self._clean_json_response(response_content)

            try:
                parsed_json = json.loads(cleaned_content)
            except json.JSONDecodeError as e:
                logger.warning(f"JSON parsing failed for {schema_name}: {e!s}")

                if fallback_data:
                    return self._create_fallback_result(schema_class, fallback_data, schema_name)

                return ValidationResult(
                    is_valid=False,
                    error_message=f"Invalid JSON: {e!s}",
                    error_type=ValidationErrorType.INVALID_JSON,
                    metadata={"original_content": response_content[:200]},
                )

            # Step 2: Validate against schema
            try:
                validated_data = schema_class(**parsed_json)

                warnings = []
                if self.enable_warnings:
                    warnings = self._collect_warnings(parsed_json, schema_class)

                return ValidationResult(
                    is_valid=True,
                    parsed_data=validated_data,
                    validation_warnings=warnings,
                    metadata={
                        "schema_used": schema_name,
                        "validation_timestamp": datetime.utcnow().isoformat(),
                    },
                )

            except ValidationError as e:
                logger.error(f"Schema validation failed for {schema_name}: {e!s}")

                if fallback_data:
                    return self._create_fallback_result(schema_class, fallback_data, schema_name)

                return ValidationResult(
                    is_valid=False,
                    error_message=f"Schema validation failed: {e!s}",
                    error_type=ValidationErrorType.FAILED_CUSTOM_VALIDATION,
                    metadata={"validation_errors": e.errors()},
                )

        except Exception as e:
            logger.error(f"Unexpected error validating {schema_name}: {e!s}")

            if fallback_data:
                return self._create_fallback_result(schema_class, fallback_data, schema_name)

            return ValidationResult(
                is_valid=False,
                error_message=f"Validation error: {e!s}",
                error_type=ValidationErrorType.MALFORMED_STRUCTURE,
            )

    def _clean_json_response(self, response_content: str) -> str:
        """Clean AI response content to extract valid JSON"""
        content = response_content.strip()

        # Remove common AI response prefixes/suffixes
        prefixes_to_remove = [
            "```json",
            "```",
            "Here's the JSON:",
            "The response is:",
            "Response:",
            "Output:",
            "Result:",
            "JSON:",
        ]

        suffixes_to_remove = ["```", "---", "End of response"]

        for prefix in prefixes_to_remove:
            if content.startswith(prefix):
                content = content[len(prefix) :].strip()

        for suffix in suffixes_to_remove:
            if content.endswith(suffix):
                content = content[: -len(suffix)].strip()

        # Find JSON boundaries if wrapped in other text
        start_idx = content.find("{")
        end_idx = content.rfind("}")

        if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
            content = content[start_idx : end_idx + 1]

        return content

    def _collect_warnings(
        self, data: dict[str, Any], schema_class: type[BaseAIResponseSchema]
    ) -> list[str]:
        """Collect validation warnings for potential issues"""
        warnings = []

        # Check for empty string values in required fields
        fields_obj = getattr(schema_class, "model_fields", None)
        if isinstance(fields_obj, dict):
            fields_map = fields_obj
        else:
            legacy_fields = getattr(schema_class, "__fields__", {})
            fields_map = legacy_fields if isinstance(legacy_fields, dict) else {}

        for field_name, field_info in fields_map.items():
            if field_name in data:
                value = data[field_name]
                is_required = (
                    field_info.is_required()
                    if hasattr(field_info, "is_required")
                    else field_info.required
                )
                if isinstance(value, str) and value.strip() == "" and is_required:
                    warnings.append(f"Required field '{field_name}' is empty")
                elif isinstance(value, list) and len(value) == 0 and is_required:
                    warnings.append(f"Required list field '{field_name}' is empty")

        return warnings

    def _create_fallback_result(
        self,
        schema_class: type[BaseAIResponseSchema],
        fallback_data: dict[str, Any],
        schema_name: str,
    ) -> ValidationResult:
        """Create a validation result using fallback data"""
        try:
            fallback_instance = schema_class(**fallback_data)
            return ValidationResult(
                is_valid=True,
                parsed_data=fallback_instance,
                validation_warnings=["Using fallback data due to validation failure"],
                metadata={
                    "schema_used": schema_name,
                    "fallback_used": True,
                    "validation_timestamp": datetime.utcnow().isoformat(),
                },
            )
        except Exception as e:
            return ValidationResult(
                is_valid=False,
                error_message=f"Fallback data validation failed: {e!s}",
                error_type=ValidationErrorType.FAILED_CUSTOM_VALIDATION,
            )

    def validate_and_parse(
        self,
        response_content: str,
        expected_schema: type[T],
        fallback_data: dict[str, Any] | None = None,
    ) -> ValidationResult:
        """
        Direct validation with schema class (alternative to registry approach)

        Args:
            response_content: Raw AI response
            expected_schema: Pydantic schema class
            fallback_data: Optional fallback data

        Returns:
            ValidationResult with parsed data
        """
        try:
            cleaned_content = self._clean_json_response(response_content)
            parsed_json = json.loads(cleaned_content)
            validated_data = expected_schema(**parsed_json)

            return ValidationResult(
                is_valid=True,
                parsed_data=validated_data,
                metadata={
                    "schema_used": expected_schema.__name__,
                    "validation_timestamp": datetime.utcnow().isoformat(),
                },
            )

        except Exception as e:
            if fallback_data:
                try:
                    fallback_instance = expected_schema(**fallback_data)
                    return ValidationResult(
                        is_valid=True,
                        parsed_data=fallback_instance,
                        validation_warnings=["Using fallback data"],
                        metadata={"fallback_used": True},
                    )
                except Exception:
                    pass

            return ValidationResult(
                is_valid=False,
                error_message=str(e),
                error_type=ValidationErrorType.FAILED_CUSTOM_VALIDATION,
            )


# --- Utility Functions ---


def validate_ai_response(
    response_content: Any,
    schema_name: str | type[BaseAIResponseSchema],
    validator: AIResponseValidator | None = None,
    fallback_data: dict[str, Any] | None = None,
) -> ValidationResult:
    """
    Convenience function for validating AI responses

    Args:
        response_content: Raw AI response content or parsed response object
        schema_name: Name of registered schema or schema class
        validator: Optional custom validator instance
        fallback_data: Optional fallback data

    Returns:
        ValidationResult
    """
    if validator is None:
        validator = AIResponseValidator()

    if isinstance(schema_name, type) and issubclass(schema_name, BaseAIResponseSchema):
        schema_class = schema_name

        if response_content is None or response_content == "" or response_content == {}:
            return ValidationResult(
                is_valid=False,
                error_message="Empty response content",
                error_type=ValidationErrorType.EMPTY_RESPONSE,
            )

        if isinstance(response_content, (dict, list)):
            parsed_json = response_content
        elif isinstance(response_content, str):
            try:
                cleaned_content = validator._clean_json_response(response_content)
                parsed_json = json.loads(cleaned_content)
            except json.JSONDecodeError as exc:
                return ValidationResult(
                    is_valid=False,
                    error_message=f"Invalid JSON: {exc!s}",
                    error_type=ValidationErrorType.INVALID_JSON,
                )
        else:
            return ValidationResult(
                is_valid=False,
                error_message=f"Unsupported response content type: {type(response_content).__name__}",
                error_type=ValidationErrorType.MALFORMED_STRUCTURE,
            )

        try:
            if not isinstance(parsed_json, dict):
                return ValidationResult(
                    is_valid=False,
                    error_message="Parsed JSON must be an object for schema validation.",
                    error_type=ValidationErrorType.MALFORMED_STRUCTURE,
                )
            validated_data = schema_class(**parsed_json)
            return ValidationResult(
                is_valid=True,
                parsed_data=validated_data,
                metadata={
                    "schema_used": schema_class.__name__,
                    "validation_timestamp": datetime.utcnow().isoformat(),
                },
            )
        except ValidationError as exc:
            errors = exc.errors()
            missing_fields = [error for error in errors if error.get("type") == "missing"]
            field_names = set(schema_class.model_fields)
            has_known_fields = isinstance(parsed_json, dict) and any(
                field in parsed_json for field in field_names
            )

            if missing_fields and not has_known_fields:
                error_type = ValidationErrorType.MALFORMED_STRUCTURE
            elif missing_fields:
                error_type = ValidationErrorType.MISSING_REQUIRED_FIELDS
            else:
                error_type = ValidationErrorType.INVALID_FIELD_TYPE

            return ValidationResult(
                is_valid=False,
                error_message=f"Schema validation failed: {exc!s}",
                error_type=error_type,
                metadata={"validation_errors": errors},
            )

        except Exception as exc:
            return ValidationResult(
                is_valid=False,
                error_message=f"Validation error: {exc!s}",
                error_type=ValidationErrorType.MALFORMED_STRUCTURE,
            )

    return validator.validate_response(response_content, schema_name, fallback_data)


def create_fallback_star_response() -> STARResponse:
    """Create a fallback STAR response for error cases"""
    return STARResponse(
        situation="Unable to analyze specific situation due to processing limitations.",
        task="Could not identify specific task requirements from available data.",
        action="Unable to determine specific actions from the provided information.",
        result="Could not extract measurable results. Please provide more detailed information.",
    )


def create_fallback_semantic_analysis() -> SemanticAnalysis:
    """Create a fallback semantic analysis for error cases"""
    return SemanticAnalysis(
        similarity_score=50.0,
        explanation="Semantic analysis temporarily unavailable. Score represents neutral match.",
    )


# Global validator instance
default_validator = AIResponseValidator()


# Decorator for automatic response validation
def validate_ai_response_decorator(schema_name: str, fallback_data: dict[str, Any] | None = None):
    """
    Decorator for automatic AI response validation

    Usage:
        @validate_ai_response_decorator("star_response")
        async def generate_star_response(prompt: str) -> ValidationResult:
            response = await ai_client.generate(prompt)
            return response.content
    """

    def decorator(func):
        async def wrapper(*args, **kwargs):
            try:
                response_content = await func(*args, **kwargs)
                return default_validator.validate_response(
                    response_content, schema_name, fallback_data
                )
            except Exception as e:
                return ValidationResult(
                    is_valid=False,
                    error_message=f"Function execution failed: {e!s}",
                    error_type=ValidationErrorType.MALFORMED_STRUCTURE,
                )

        return wrapper

    return decorator
