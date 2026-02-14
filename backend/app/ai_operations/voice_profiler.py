"""
Voice Profiler Operations

Service layer for voice profile analysis that delegates to genkit flow implementation
while providing a clean API interface with caching and monitoring.
"""

import logging
from typing import Any

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class VoiceProfiler:
    """Service layer for voice profiling that delegates to genkit flow"""

    def __init__(self):
        # Import the working genkit flow
        from app.genkit_flows.voice_profiler import generate_voice_profile

        self.voice_profile_flow = generate_voice_profile

    @monitor_performance("voice_profile_generation")
    @cached_ai_operation("voice_profile", user_id_param="user_id")
    async def generate_voice_profile(self, user_id: str) -> dict[str, Any]:
        """
        Generate a voice profile for a user by analyzing their documents.

        Args:
            user_id: User identifier for document retrieval and profiling

        Returns:
            dict: Voice profile with tone, phrases, and vocabulary
        """
        try:
            if not user_id or not isinstance(user_id, str):
                raise InputValidationError("User ID is required and must be a string")

            # Delegate to the genkit flow implementation
            result = await self.voice_profile_flow(user_id=user_id)

            # Ensure result is a dictionary
            if isinstance(result, str):
                try:
                    import json

                    result_dict = json.loads(result)
                except json.JSONDecodeError:
                    result_dict = {"voice_profile": result, "raw_output": True}
            else:
                result_dict = result if isinstance(result, dict) else {"voice_profile": str(result)}

            logger.info(
                f"Voice profile generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "tone": result_dict.get("tone", "Unknown"),
                    "phrases_count": len(result_dict.get("common_phrases", [])),
                    "vocabulary_count": len(result_dict.get("professional_vocabulary", [])),
                },
            )

            return result_dict

        except Exception as e:
            logger.error(f"Error in voice profile generation for user {user_id}: {e!s}")
            raise

    @monitor_performance("voice_profile_analysis")
    @cached_ai_operation("voice_analysis", user_id_param="user_id")
    async def analyze_document_voice(self, user_id: str, document_text: str) -> dict[str, Any]:
        """
        Analyze the voice/tone of a specific document.

        Args:
            user_id: User identifier for tracking
            document_text: Text content to analyze

        Returns:
            dict: Voice analysis of the document
        """
        try:
            if not document_text or not isinstance(document_text, str):
                raise InputValidationError("Document text is required and must be a string")

            # Sanitize input
            sanitized_text = InputSanitizer.sanitize_text_input(document_text)

            # For single document analysis, we'd need to create a simplified version
            # This is a placeholder that demonstrates the pattern
            result = {
                "document_analysis": "Single document voice analysis",
                "text_length": len(sanitized_text.sanitized_content),
                "analysis_note": "This would analyze voice patterns in the provided text",
            }

            logger.info(
                f"Document voice analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "text_length": len(document_text),
                },
            )

            return result

        except Exception as e:
            logger.error(f"Error in document voice analysis for user {user_id}: {e!s}")
            raise


# Global instance
voice_profiler = VoiceProfiler()
