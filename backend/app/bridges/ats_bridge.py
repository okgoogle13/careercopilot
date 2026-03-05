import logging
from typing import Any

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer
from app.core.observability import monitor_performance
from app.genkit_flows.ats_scoring import atsScoring
from app.schemas.ats import ATSScoringInput

logger = logging.getLogger(__name__)


class ATSScorer:
    """
    Bridge wrapper for ATS scoring calls.
    Maintains the expected signature for background workers while delegating to Genkit flows.
    """

    @monitor_performance("ats_comprehensive_scoring")
    @cached_ai_operation("ats_scoring", user_id_param="user_id")
    async def comprehensive_ats_analysis(
        self,
        user_id: str,
        resume_text: str,
        job_description: str,
        profile_keywords: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Perform comprehensive ATS analysis by delegating to the genkit flow.

        Args:
            user_id: User identifier for tracking and caching
            resume_text: Raw resume content
            job_description: Job description text
            profile_keywords: Optional additional keywords to consider

        Returns:
            dict: Complete ATS analysis with scores and recommendations
        """
        try:
            # 1. Validate Input using strict Pydantic model
            input_data = ATSScoringInput(
                user_id=user_id,
                resume_text=resume_text,
                job_description=job_description,
                profile_keywords=profile_keywords,
            )

            # 2. Sanitize input
            sanitized_resume = InputSanitizer.sanitize_text_input(input_data.resume_text)
            sanitized_job_desc = InputSanitizer.sanitize_text_input(input_data.job_description)

            sanitized_keywords = None
            if input_data.profile_keywords:
                sanitized_keywords = [
                    InputSanitizer.sanitize_text_input(kw).sanitized_content
                    for kw in input_data.profile_keywords
                ]

            # 3. Call Genkit Flow
            result = await atsScoring(
                resumeText=sanitized_resume.sanitized_content,
                jobDescription=sanitized_job_desc.sanitized_content,
                profileKeywords=sanitized_keywords,
                user_id=input_data.user_id,
            )

            # 4. Convert back to Dict (Compatibility requirement)
            if hasattr(result, "model_dump"):
                result_dict = result.model_dump()
            elif hasattr(result, "dict"):
                result_dict = result.dict()
            else:
                result_dict = dict(result) if hasattr(result, "__dict__") else result

            logger.info(
                f"ATS analysis completed via Bridge for user {user_id}",
                extra={
                    "user_id": user_id,
                    "overall_score": result_dict.get("overallScore", 0),
                },
            )

            return result_dict

        except Exception as e:
            logger.error(f"Error in ATS analysis Bridge for user {user_id}: {e!s}")
            raise


# Global instance for import compatibility
ats_scorer = ATSScorer()
