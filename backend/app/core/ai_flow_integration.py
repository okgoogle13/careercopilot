"""
AI Flow Integration Helpers

Helper functions and decorators to integrate the AI response validation utility
into existing flows with minimal code changes.
"""

import logging
from functools import wraps
from typing import Any, Callable, Dict, Optional, Type, TypeVar, get_origin

from .ai_error_handling import AIError, AIErrorType
from .ai_response_validation import (
    AIResponseValidator,
    BaseAIResponseSchema,
    ValidationErrorType,
    ValidationResult,
    default_validator,
)

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseAIResponseSchema)


def validate_ai_flow_response(
    schema_class: Type[T],
    fallback_data: Optional[Dict[str, Any]] = None,
    validator: Optional[AIResponseValidator] = None,
):
    """
    Decorator to automatically validate AI flow responses

    Usage:
        @validate_ai_flow_response(STARResponse, fallback_data={...})
        async def my_flow_function(params) -> str:
            # Your existing flow logic that returns AI response content
            return ai_response_content

    The decorated function will return a ValidationResult instead of raw content.
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                # Execute the original function
                response_content = await func(*args, **kwargs)

                # Use provided validator or default
                validation_validator = validator or default_validator

                # Validate the response
                result = validation_validator.validate_and_parse(
                    response_content, schema_class, fallback_data
                )

                if not result.is_valid and not result.parsed_data:
                    # If validation completely failed, raise an error
                    raise AIError(
                        message=f"AI response validation failed: {result.error_message}",
                        error_type=AIErrorType.INVALID_REQUEST,
                        original_error=Exception(result.error_message),
                    )

                return result

            except Exception as e:
                if isinstance(e, AIError):
                    raise

                logger.error(f"Error in validated AI flow {func.__name__}: {str(e)}")

                # Try to create fallback result
                if fallback_data:
                    try:
                        fallback_instance = schema_class(**fallback_data)
                        return ValidationResult(
                            is_valid=True,
                            parsed_data=fallback_instance,
                            validation_warnings=["Using fallback data due to function error"],
                            metadata={"fallback_used": True, "original_error": str(e)},
                        )
                    except Exception:
                        pass

                raise AIError(
                    message=f"AI flow execution failed: {str(e)}",
                    error_type=AIErrorType.UNKNOWN,
                    original_error=e,
                )

        return wrapper

    return decorator


def extract_validated_data(validation_result: ValidationResult) -> Any:
    """
    Helper function to extract validated data from ValidationResult

    Args:
        validation_result: The ValidationResult from a validated AI flow

    Returns:
        The parsed and validated data

    Raises:
        AIError: If validation failed and no fallback data is available
    """
    if validation_result.parsed_data:
        return validation_result.parsed_data

    raise AIError(
        message=f"No validated data available: {validation_result.error_message}",
        error_type=AIErrorType.INVALID_REQUEST,
    )


def create_fallback_response(
    schema_class: Type[T], error_message: str = "Processing temporarily unavailable"
) -> T:
    """
    Create a fallback response for common schema types

    Args:
        schema_class: The schema class to create fallback for
        error_message: Error message to include in fallback

    Returns:
        Fallback instance of the schema
    """
    # Import here to avoid circular imports
    from .ai_response_validation import (
        ATSResult,
        ATSScoreBreakdown,
        JobRequirements,
        ResumeEntities,
        SemanticAnalysis,
        STARResponse,
    )

    if schema_class == STARResponse:
        return STARResponse(
            situation=f"Unable to analyze situation: {error_message}",
            task=f"Could not identify task: {error_message}",
            action=f"Unable to determine actions: {error_message}",
            result=f"Could not extract results: {error_message}",
        )

    elif schema_class == SemanticAnalysis:
        return SemanticAnalysis(
            similarity_score=50.0,
            explanation=f"Semantic analysis unavailable: {error_message}",
        )

    elif schema_class == JobRequirements:
        return JobRequirements(
            required_skills=[],
            preferred_skills=[],
            experience_level="Not determined",
            education_level="Not determined",
            responsibilities=[],
        )

    elif schema_class == ResumeEntities:
        return ResumeEntities(skills=[], experience=[], education=[], achievements=[])

    elif schema_class == ATSResult:
        return ATSResult(
            overall_score=50.0,
            breakdown=ATSScoreBreakdown(
                keyword_score=50.0, semantic_score=50.0, formatting_score=50.0
            ),
            matched_keywords=[],
            missing_keywords=[],
            recommendations=[f"Analysis temporarily unavailable: {error_message}"],
        )

    else:
        # Generic fallback - try to create with minimal data
        try:
            # Get required fields and provide default values
            required_fields: Dict[str, Any] = {}
            fields = getattr(schema_class, "model_fields", schema_class.__fields__)

            for field_name, field_info in fields.items():
                if hasattr(field_info, "is_required"):
                    is_required = field_info.is_required()
                    annotation = field_info.annotation
                else:
                    is_required = field_info.required
                    annotation = field_info.type_

                if not is_required:
                    continue

                origin = get_origin(annotation)
                if annotation == str:
                    required_fields[field_name] = error_message
                elif annotation == float:
                    required_fields[field_name] = 0.0
                elif annotation == int:
                    required_fields[field_name] = 0
                elif annotation == list or origin == list:
                    required_fields[field_name] = []
                elif annotation == dict or origin == dict:
                    required_fields[field_name] = {}

            return schema_class(**required_fields)
        except Exception:
            raise ValueError(f"Cannot create fallback for schema {schema_class.__name__}")


class AIFlowManager:
    """
    Manager class for handling AI flows with validation
    """

    def __init__(self, validator: Optional[AIResponseValidator] = None):
        self.validator = validator or default_validator
        self.registered_flows: Dict[str, Dict[str, Any]] = {}

    def register_flow(
        self,
        name: str,
        schema_class: Type[BaseAIResponseSchema],
        fallback_data: Optional[Dict[str, Any]] = None,
    ):
        """Register a flow with its schema and fallback data"""
        self.registered_flows[name] = {
            "schema_class": schema_class,
            "fallback_data": fallback_data,
        }
        logger.info(f"Registered AI flow: {name}")

    async def execute_flow(
        self, flow_name: str, flow_function: Callable, *args, **kwargs
    ) -> ValidationResult:
        """
        Execute a registered flow with automatic validation

        Args:
            flow_name: Name of the registered flow
            flow_function: The flow function to execute
            *args, **kwargs: Arguments to pass to the flow function

        Returns:
            ValidationResult with validated data
        """
        if flow_name not in self.registered_flows:
            raise ValueError(f"Flow {flow_name} not registered")

        flow_config = self.registered_flows[flow_name]
        schema_class = flow_config["schema_class"]
        fallback_data = flow_config.get("fallback_data")

        try:
            # Execute the flow function
            response_content = await flow_function(*args, **kwargs)

            # Validate the response
            result = self.validator.validate_and_parse(
                response_content, schema_class, fallback_data
            )

            return result

        except Exception as e:
            logger.error(f"Error executing flow {flow_name}: {str(e)}")

            # Try to create fallback result
            if fallback_data:
                try:
                    fallback_instance = schema_class(**fallback_data)
                    return ValidationResult(
                        is_valid=True,
                        parsed_data=fallback_instance,
                        validation_warnings=["Using fallback data due to execution error"],
                        metadata={"fallback_used": True, "original_error": str(e)},
                    )
                except Exception:
                    pass

            return ValidationResult(
                is_valid=False,
                error_message=f"Flow execution failed: {str(e)}",
                error_type=ValidationErrorType.MALFORMED_STRUCTURE,
            )

    def get_flow_schema(self, flow_name: str) -> Optional[Type[BaseAIResponseSchema]]:
        """Get the schema class for a registered flow"""
        if flow_name in self.registered_flows:
            return self.registered_flows[flow_name]["schema_class"]
        return None


# Global flow manager instance
default_flow_manager = AIFlowManager()


# Migration helpers for existing flows
def migrate_json_parsing(
    original_json_parse_code: str,
    schema_class: Type[T],
    fallback_data: Optional[Dict[str, Any]] = None,
) -> ValidationResult:
    """
    Helper to migrate existing json.loads() calls to use validation

    Usage:
        # Old code:
        # parsed_result = json.loads(response.content.strip())

        # New code:
        validation_result = migrate_json_parsing(
            response.content.strip(),
            MySchema,
            fallback_data
        )
        parsed_result = extract_validated_data(validation_result)
    """
    return default_validator.validate_and_parse(
        original_json_parse_code, schema_class, fallback_data
    )


def create_migration_wrapper(
    original_function: Callable,
    schema_class: Type[T],
    fallback_data: Optional[Dict[str, Any]] = None,
):
    """
    Create a wrapper that adds validation to an existing function

    This is useful for gradually migrating existing AI operations
    """

    @wraps(original_function)
    async def wrapper(*args, **kwargs):
        try:
            # Call original function
            result = await original_function(*args, **kwargs)

            # If result is already a dict, assume it's already parsed
            if isinstance(result, dict):
                try:
                    validated_data = schema_class(**result)
                    return ValidationResult(
                        is_valid=True,
                        parsed_data=validated_data,
                        metadata={"migration_wrapper": True},
                    )
                except Exception:
                    if fallback_data:
                        fallback_instance = schema_class(**fallback_data)
                        return ValidationResult(
                            is_valid=True,
                            parsed_data=fallback_instance,
                            validation_warnings=["Using fallback data"],
                            metadata={"fallback_used": True},
                        )
                    raise

            # If result is a string, validate it
            elif isinstance(result, str):
                return default_validator.validate_and_parse(result, schema_class, fallback_data)

            else:
                raise ValueError(f"Unexpected result type: {type(result)}")

        except Exception as e:
            if fallback_data:
                try:
                    fallback_instance = schema_class(**fallback_data)
                    return ValidationResult(
                        is_valid=True,
                        parsed_data=fallback_instance,
                        validation_warnings=["Using fallback data due to error"],
                        metadata={"fallback_used": True, "original_error": str(e)},
                    )
                except Exception:
                    pass

            return ValidationResult(
                is_valid=False,
                error_message=f"Migration wrapper error: {str(e)}",
                error_type=ValidationErrorType.MALFORMED_STRUCTURE,
            )

    return wrapper
