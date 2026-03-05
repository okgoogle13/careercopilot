"""
Job Analysis Operations

Service layer for job analysis that delegates to genkit flow implementation
while providing a clean API interface with caching and monitoring.
"""

import logging
from typing import Any

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.observability import monitor_performance

logger = logging.getLogger(__name__)


class JobAnalyzer:
    """Service layer for job analysis that delegates to genkit flow"""

    def __init__(self):
        # Import the working genkit flow
        from app.genkit_flows.job_analyzer import analyze_job_description

        self.job_analysis_flow = analyze_job_description

    @monitor_performance("job_description_analysis")
    @cached_ai_operation("job_analysis", user_id_param="user_id")
    async def analyze_job_description(
        self, user_id: str, job_description: str, company_info: str | None = None
    ) -> dict[str, Any]:
        """
        Analyze a job description by delegating to the genkit flow.

        Args:
            user_id: User identifier for tracking and caching
            job_description: Raw job description text
            company_info: Optional additional company information

        Returns:
            dict: Structured job analysis data
        """
        try:
            # Input validation
            if not job_description or not isinstance(job_description, str):
                raise InputValidationError("Job description is required and must be a string")

            # Sanitize inputs
            sanitized_job_desc = InputSanitizer.sanitize_text_input(job_description)

            # Delegate to the genkit flow implementation
            result = self.job_analysis_flow(job_description=sanitized_job_desc.sanitized_content)

            # Convert result to dict if needed
            if isinstance(result, str):
                try:
                    import json

                    result_dict = json.loads(result)
                except json.JSONDecodeError:
                    # If not JSON, wrap in basic structure
                    result_dict = {"analysis": result, "raw_output": True}
            else:
                result_dict = result if isinstance(result, dict) else {"analysis": str(result)}

            logger.info(
                f"Job analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "job_title": result_dict.get("job_title", "Unknown"),
                    "company_info_provided": bool(company_info),
                },
            )

            return result_dict

        except Exception as e:
            logger.error(f"Error in job analysis for user {user_id}: {e!s}")
            raise


# Global instance
job_analyzer = JobAnalyzer()
