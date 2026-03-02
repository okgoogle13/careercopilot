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
<<<<<<< HEAD
from typing import Any, Dict, List, Optional, Type, TypeVar
=======
from typing import Any, TypeVar
>>>>>>> restoration-KR-Rage-Figma-v2.0

from pydantic import BaseModel, Field, ValidationError, validator

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
<<<<<<< HEAD
        original_error: Optional[Exception] = None,
        response_content: Optional[str] = None,
        expected_schema: Optional[str] = None,
=======
        original_error: Exception | None = None,
        response_content: str | None = None,
        expected_schema: str | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ):
        self.error_type = error_type
        self.original_error = original_error
        self.response_content = response_content
        self.expected_schema = expected_schema
        super().__init__(message)


class ValidationResult(BaseModel):
    """Result of AI response validation"""

    is_valid: bool
<<<<<<< HEAD
    parsed_data: Optional[Any] = None
    error_message: Optional[str] = None
    error_type: Optional[ValidationErrorType] = None
    validation_warnings: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
=======
    parsed_data: Any | None = None
    error_message: str | None = None
    error_type: ValidationErrorType | None = None
    validation_warnings: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
>>>>>>> restoration-KR-Rage-Figma-v2.0


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
<<<<<<< HEAD
    key_competencies: List[str] = Field(..., description="Key skills/competencies tested")
    success_factors: List[str] = Field(..., description="What makes a strong response")
    common_pitfalls: List[str] = Field(default_factory=list, description="Common mistakes to avoid")
=======
    key_competencies: list[str] = Field(..., description="Key skills/competencies tested")
    success_factors: list[str] = Field(..., description="What makes a strong response")
    common_pitfalls: list[str] = Field(default_factory=list, description="Common mistakes to avoid")
>>>>>>> restoration-KR-Rage-Figma-v2.0


class ExperienceSelection(BaseAIResponseSchema):
    """Experience selection details schema"""

    chosen_experience: str = Field(..., description="Description of selected experience")
    relevance_score: float = Field(..., ge=0, le=100, description="Relevance score 0-100")
    selection_rationale: str = Field(..., description="Why this experience was chosen")
<<<<<<< HEAD
    alternative_experiences: List[str] = Field(
=======
    alternative_experiences: list[str] = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        default_factory=list, description="Other potential experiences"
    )


class KSCResponseComplete(BaseAIResponseSchema):
    """Complete KSC response with analysis"""

    ksc_analysis: KSCAnalysis
    experience_selection: ExperienceSelection
    star_response: STARResponse
<<<<<<< HEAD
    response_enhancement: Optional[Dict[str, Any]] = None
    interview_preparation: Optional[Dict[str, Any]] = None
=======
    response_enhancement: dict[str, Any] | None = None
    interview_preparation: dict[str, Any] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


class SemanticAnalysis(BaseAIResponseSchema):
    """Semantic analysis response schema"""

    similarity_score: float = Field(..., ge=0, le=100, description="Similarity score 0-100")
    explanation: str = Field(..., min_length=10, description="Explanation for the score")

    # Legacy field name support
<<<<<<< HEAD
    similarityScore: Optional[float] = None
=======
    similarityScore: float | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

    @validator("similarityScore", pre=True, always=True)
    def handle_legacy_field(cls, v, values):
        if v is not None:
            values["similarity_score"] = v
        return v


class JobRequirements(BaseAIResponseSchema):
    """Job requirements extraction schema"""

<<<<<<< HEAD
    required_skills: List[str] = Field(default_factory=list, description="Required skills")
    preferred_skills: List[str] = Field(default_factory=list, description="Preferred skills")
    experience_level: str = Field(default="", description="Required experience level")
    education_level: str = Field(default="", description="Required education level")
    responsibilities: List[str] = Field(default_factory=list, description="Key responsibilities")

    # Legacy field name support
    requiredSkills: Optional[List[str]] = None
    preferredSkills: Optional[List[str]] = None
    experienceLevel: Optional[str] = None
    educationLevel: Optional[str] = None
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0

    @validator("requiredSkills", pre=True, always=True)
    def handle_legacy_required_skills(cls, v, values):
        if v is not None:
            values["required_skills"] = v
        return v

    @validator("preferredSkills", pre=True, always=True)
    def handle_legacy_preferred_skills(cls, v, values):
        if v is not None:
            values["preferred_skills"] = v
        return v


class ResumeEntities(BaseAIResponseSchema):
    """Resume entities extraction schema"""

<<<<<<< HEAD
    skills: List[str] = Field(default_factory=list, description="Extracted skills")
    experience: List[Dict[str, Any]] = Field(default_factory=list, description="Work experience")
    education: List[Dict[str, Any]] = Field(
        default_factory=list, description="Education background"
    )
    achievements: List[str] = Field(default_factory=list, description="Key achievements")
=======
    skills: list[str] = Field(default_factory=list, description="Extracted skills")
    experience: list[dict[str, Any]] = Field(default_factory=list, description="Work experience")
    education: list[dict[str, Any]] = Field(
        default_factory=list, description="Education background"
    )
    achievements: list[str] = Field(default_factory=list, description="Key achievements")
>>>>>>> restoration-KR-Rage-Figma-v2.0


class CoverLetterResponse(BaseAIResponseSchema):
    """Cover letter generation response schema"""

    cover_letter_content: str = Field(..., min_length=100, description="Generated cover letter")
<<<<<<< HEAD
    tone_analysis: Optional[Dict[str, Any]] = None
    customization_notes: List[str] = Field(default_factory=list)
    word_count: Optional[int] = None
=======
    tone_analysis: dict[str, Any] | None = None
    customization_notes: list[str] = Field(default_factory=list)
    word_count: int | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

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
<<<<<<< HEAD
    keywordScore: Optional[float] = None
    semanticScore: Optional[float] = None
    formattingScore: Optional[float] = None
=======
    keywordScore: float | None = None
    semanticScore: float | None = None
    formattingScore: float | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

    @validator("keywordScore", pre=True, always=True)
    def handle_legacy_keyword_score(cls, v, values):
        if v is not None:
            values["keyword_score"] = v
        return v


class ATSResult(BaseAIResponseSchema):
    """Complete ATS scoring result schema"""

    overall_score: float = Field(..., ge=0, le=100, description="Overall ATS score")
    breakdown: ATSScoreBreakdown
<<<<<<< HEAD
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

    # Legacy field name support
    overallScore: Optional[float] = None
    matchedKeywords: Optional[List[str]] = None
    missingKeywords: Optional[List[str]] = None
=======
    matched_keywords: list[str] = Field(default_factory=list)
    missing_keywords: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)

    # Legacy field name support
    overallScore: float | None = None
    matchedKeywords: list[str] | None = None
    missingKeywords: list[str] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

    @validator("overallScore", pre=True, always=True)
    def handle_legacy_overall_score(cls, v, values):
        if v is not None:
            values["overall_score"] = v
        return v


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
<<<<<<< HEAD
        self._schema_registry: Dict[str, Type[BaseAIResponseSchema]] = {}
=======
        self._schema_registry: dict[str, type[BaseAIResponseSchema]] = {}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
    def register_schema(self, name: str, schema_class: Type[BaseAIResponseSchema]):
=======
    def register_schema(self, name: str, schema_class: type[BaseAIResponseSchema]):
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Register a custom schema"""
        self._schema_registry[name] = schema_class
        logger.info(f"Registered custom schema: {name}")

    def validate_response(
        self,
        response_content: str,
        schema_name: str,
<<<<<<< HEAD
        fallback_data: Optional[Dict[str, Any]] = None,
=======
        fallback_data: dict[str, Any] | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                logger.warning(f"JSON parsing failed for {schema_name}: {str(e)}")
=======
                logger.warning(f"JSON parsing failed for {schema_name}: {e!s}")
>>>>>>> restoration-KR-Rage-Figma-v2.0

                if fallback_data:
                    return self._create_fallback_result(schema_class, fallback_data, schema_name)

                return ValidationResult(
                    is_valid=False,
<<<<<<< HEAD
                    error_message=f"Invalid JSON: {str(e)}",
=======
                    error_message=f"Invalid JSON: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                logger.error(f"Schema validation failed for {schema_name}: {str(e)}")
=======
                logger.error(f"Schema validation failed for {schema_name}: {e!s}")
>>>>>>> restoration-KR-Rage-Figma-v2.0

                if fallback_data:
                    return self._create_fallback_result(schema_class, fallback_data, schema_name)

                return ValidationResult(
                    is_valid=False,
<<<<<<< HEAD
                    error_message=f"Schema validation failed: {str(e)}",
=======
                    error_message=f"Schema validation failed: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    error_type=ValidationErrorType.FAILED_CUSTOM_VALIDATION,
                    metadata={"validation_errors": e.errors()},
                )

        except Exception as e:
<<<<<<< HEAD
            logger.error(f"Unexpected error validating {schema_name}: {str(e)}")
=======
            logger.error(f"Unexpected error validating {schema_name}: {e!s}")
>>>>>>> restoration-KR-Rage-Figma-v2.0

            if fallback_data:
                return self._create_fallback_result(schema_class, fallback_data, schema_name)

            return ValidationResult(
                is_valid=False,
<<<<<<< HEAD
                error_message=f"Validation error: {str(e)}",
=======
                error_message=f"Validation error: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
        self, data: Dict[str, Any], schema_class: Type[BaseAIResponseSchema]
    ) -> List[str]:
=======
        self, data: dict[str, Any], schema_class: type[BaseAIResponseSchema]
    ) -> list[str]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Collect validation warnings for potential issues"""
        warnings = []

        # Check for empty string values in required fields
        for field_name, field_info in schema_class.__fields__.items():
            if field_name in data:
                value = data[field_name]
                if isinstance(value, str) and value.strip() == "" and field_info.required:
                    warnings.append(f"Required field '{field_name}' is empty")
                elif isinstance(value, list) and len(value) == 0 and field_info.required:
                    warnings.append(f"Required list field '{field_name}' is empty")

        return warnings

    def _create_fallback_result(
        self,
<<<<<<< HEAD
        schema_class: Type[BaseAIResponseSchema],
        fallback_data: Dict[str, Any],
=======
        schema_class: type[BaseAIResponseSchema],
        fallback_data: dict[str, Any],
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                error_message=f"Fallback data validation failed: {str(e)}",
=======
                error_message=f"Fallback data validation failed: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                error_type=ValidationErrorType.FAILED_CUSTOM_VALIDATION,
            )

    def validate_and_parse(
        self,
        response_content: str,
<<<<<<< HEAD
        expected_schema: Type[T],
        fallback_data: Optional[Dict[str, Any]] = None,
=======
        expected_schema: type[T],
        fallback_data: dict[str, Any] | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
    response_content: str,
    schema_name: str,
<<<<<<< HEAD
    validator: Optional[AIResponseValidator] = None,
    fallback_data: Optional[Dict[str, Any]] = None,
=======
    validator: AIResponseValidator | None = None,
    fallback_data: dict[str, Any] | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
) -> ValidationResult:
    """
    Convenience function for validating AI responses

    Args:
        response_content: Raw AI response content
        schema_name: Name of registered schema
        validator: Optional custom validator instance
        fallback_data: Optional fallback data

    Returns:
        ValidationResult
    """
    if validator is None:
        validator = AIResponseValidator()

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
def validate_ai_response_decorator(
<<<<<<< HEAD
    schema_name: str, fallback_data: Optional[Dict[str, Any]] = None
=======
    schema_name: str, fallback_data: dict[str, Any] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
):
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
<<<<<<< HEAD
                    error_message=f"Function execution failed: {str(e)}",
=======
                    error_message=f"Function execution failed: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    error_type=ValidationErrorType.MALFORMED_STRUCTURE,
                )

        return wrapper

    return decorator
