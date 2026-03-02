"""
KSC (Key Selection Criteria) Generator Operations

Service layer for key selection criteria generation that delegates to genkit flow implementation
while providing a clean API interface with caching and monitoring.
"""

import logging
from typing import Any

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance
from app.schemas.career_master import CareerDatabase

logger = logging.getLogger(__name__)


class KSCGenerator:
    """KSC generation operations using Genkit flows"""

    def __init__(self):
        # Import the working genkit flows
        from app.genkit_flows.ksc_generator import generateCompleteKscResponse, generateKscResponse
        
        self.ksc_complete_flow = generateCompleteKscResponse
        self.ksc_basic_flow = generateKscResponse

    @monitor_performance("ksc_star_generation")
    @cached_ai_operation("ksc_generation", user_id_param="user_id")
    async def generate_star_response(
        self,
        user_id: str,
        user_profile_data: dict[str, Any],
        ksc_statement: str,
        response_length: str = "comprehensive",
        focus_achievements: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Generate a STAR methodology response for a Key Selection Criterion.

        Args:
            user_id: User identifier for tracking and caching
            user_profile_data: User's profile with experiences and achievements
            ksc_statement: The key selection criterion to address
            response_length: Response length preference (concise/standard/comprehensive)
            focus_achievements: Optional specific achievements to prioritize

        Returns:
            dict: STAR response with analysis and metadata
        """
        try:
            # Input validation
            if not user_profile_data or not isinstance(user_profile_data, dict):
                raise InputValidationError("User profile data is required and must be a dictionary")

            if not ksc_statement or not isinstance(ksc_statement, str):
                raise InputValidationError("KSC statement is required and must be a string")

            # Sanitize inputs
            sanitized_ksc = InputSanitizer.sanitize_text_input(ksc_statement)
            
            # Convert user_profile_data to CareerDatabase model for the flow
            # We use model_validate to handle the dictionary transformation
            try:
                profile_model = CareerDatabase.model_validate(user_profile_data)
            except Exception as e:
                logger.warning(f"Could not validate profile data against CareerDatabase: {e!s}. Using raw dict.")
                # Fallback to creating a minimal model if needed, but for now we'll pass it if possible
                # or raise error if strictness is required.
                raise InputValidationError(f"Invalid profile data structure: {e!s}")

            # Delegate to the genkit flow implementation
            # Note: generateCompleteKscResponse returns KSCResponseComplete
            result = await self.ksc_complete_flow(
                profile=profile_model,
                ksc_statement=sanitized_ksc.sanitized_content,
                response_length=response_length
            )

            # Convert result to dictionary for backward compatibility with existing API
            # result is a KSCResponseComplete Pydantic model
            parsed_result = result.model_dump()
            
            # Ensure keys match what the previous frontend/service expected
            # (ksc_analysis, experience_selection, star_response)
            
            logger.info(
                f"KSC STAR response generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": "gemini-3.0-flash",
                    "response_length": response_length,
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in KSC generation for user {user_id}: {e!s}")
            from app.core.ai_error_handling import AIError, AIErrorType
            raise AIError(
                message=f"KSC generation failed: {e!s}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("ksc_multiple_responses")
    @cached_ai_operation("ksc_batch", user_id_param="user_id")
    async def generate_multiple_ksc_responses(
        self,
        user_id: str,
        user_profile_data: dict[str, Any],
        ksc_statements: list[str],
        response_preferences: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Generate STAR responses for multiple KSC statements.
        Note: Currently implemented as sequential calls to the main flow
        to ensure consistency and context.
        """
        responses = []
        for ksc in ksc_statements:
            resp = await self.generate_star_response(
                user_id=user_id,
                user_profile_data=user_profile_data,
                ksc_statement=ksc
            )
            responses.append(resp)
            
        return {
            "ksc_responses": responses,
            "metadata": {
                "count": len(ksc_statements),
                "user_id": user_id
            }
        }

    @monitor_performance("ksc_response_optimization")
    async def optimize_star_response(
        self,
        user_id: str,
        existing_response: str,
        ksc_statement: str,
        feedback_areas: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Optimize an existing STAR response.
        (Future: Create a specific Genkit flow for optimization)
        """
        # For now, we'll return a message that this is being upgraded
        return {
            "status": "upgrading",
            "message": "Optimization flow is being migrated to Genkit.",
            "original_response": existing_response
        }


# Global instance
ksc_generator = KSCGenerator()
