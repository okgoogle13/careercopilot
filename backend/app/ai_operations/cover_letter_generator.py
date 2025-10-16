"""
Cover Letter Generation Operations

Service layer for cover letter generation that delegates to genkit flow implementation
while providing a clean API interface with caching and monitoring.
"""

import logging
from typing import Any, Dict, Optional

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class CoverLetterGenerator:
    """Service layer for cover letter generation that delegates to genkit flow"""

    def __init__(self):
        # Import the working genkit flow
        from app.genkit_flows.cover_letter_generator import (
            generate_tailored_cover_letter,
        )

        self.cover_letter_flow = generate_tailored_cover_letter

    @monitor_performance("cover_letter_generation")
    @cached_ai_operation("cover_letter", user_id_param="user_id")
    async def generate_tailored_cover_letter(
        self,
        user_id: str,
        base_profile_data: Dict[str, Any],
        job_analysis_data: Dict[str, Any],
        voice_profile: Optional[Dict[str, Any]] = None,
        customization_preferences: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate a tailored cover letter by delegating to the genkit flow.

        Args:
            user_id: User identifier for tracking and caching
            base_profile_data: User profile information
            job_analysis_data: Job requirements and analysis
            voice_profile: Optional voice profile for style matching
            customization_preferences: Optional customization settings

        Returns:
            dict: Generated cover letter with analysis
        """
        try:
            # Input validation
            if not base_profile_data or not isinstance(base_profile_data, dict):
                raise InputValidationError(
                    "Base profile data is required and must be a dictionary"
                )
            if not job_analysis_data or not isinstance(job_analysis_data, dict):
                raise InputValidationError(
                    "Job analysis data is required and must be a dictionary"
                )

            # Sanitize inputs
            sanitized_profile = InputSanitizer.sanitize_dict_input(base_profile_data)
            sanitized_job_data = InputSanitizer.sanitize_dict_input(job_analysis_data)
            sanitized_voice = None
            if voice_profile:
                sanitized_voice = InputSanitizer.sanitize_dict_input(voice_profile)

            # Delegate to the genkit flow implementation
            result = self.cover_letter_flow(
                base_profile_data=sanitized_profile,
                job_analysis_data=sanitized_job_data,
                voice_profile=sanitized_voice,
            )

            # Convert result to dict if needed
            if isinstance(result, str):
                try:
                    import json

                    result_dict = json.loads(result)
                except json.JSONDecodeError:
                    # If not JSON, wrap the result
                    result_dict = {
                        "cover_letter": result,
                        "raw_output": True,
                        "customization_applied": bool(customization_preferences),
                    }
            else:
                result_dict = (
                    result
                    if isinstance(result, dict)
                    else {"cover_letter": str(result)}
                )

            # Add metadata for tracking
            result_dict["metadata"] = {
                "user_id": user_id,
                "voice_profile_used": bool(voice_profile),
                "customization_applied": bool(customization_preferences),
                "company": job_analysis_data.get("company_name", "Unknown"),
            }

            logger.info(
                f"Cover letter generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "voice_profile_used": bool(voice_profile),
                    "company": job_analysis_data.get("company_name", "Unknown"),
                },
            )

            return result_dict

        except Exception as e:
            logger.error(
                f"Error in cover letter generation for user {user_id}: {str(e)}"
            )
            raise


# Global instance
cover_letter_generator = CoverLetterGenerator()
