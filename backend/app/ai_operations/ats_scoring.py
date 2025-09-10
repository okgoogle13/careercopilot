"""
ATS Scoring Operations

Service layer for ATS analysis that delegates to the comprehensive
genkit flow implementation while providing a clean API interface.
"""

import logging
from typing import Any, Dict, List, Optional

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class ATSScorer:
    """Service layer for ATS scoring that delegates to genkit flow implementation"""

    def __init__(self):
        # Import the working genkit flow
        from app.genkit_flows.ats_scoring import atsScoring
        self.ats_flow = atsScoring

    @monitor_performance("ats_comprehensive_scoring")
    @cached_ai_operation("ats_scoring", user_id_param="user_id")
    async def comprehensive_ats_analysis(
        self,
        user_id: str,
        resume_text: str,
        job_description: str,
        profile_keywords: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
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
            # Input validation
            if not resume_text or not isinstance(resume_text, str):
                raise InputValidationError("Resume text is required and must be a string")

            if not job_description or not isinstance(job_description, str):
                raise InputValidationError("Job description is required and must be a string")

            # Sanitize inputs
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            sanitized_job_desc = InputSanitizer.sanitize_text_input(job_description)
            
            # Sanitize profile keywords if provided
            sanitized_keywords = None
            if profile_keywords:
                sanitized_keywords = [
                    InputSanitizer.sanitize_text_input(kw).sanitized_content
                    for kw in profile_keywords
                ]

            # Delegate to the genkit flow implementation
            result = await self.ats_flow(
                resumeText=sanitized_resume.sanitized_content,
                jobDescription=sanitized_job_desc.sanitized_content,
                profileKeywords=sanitized_keywords,
                user_id=user_id,
            )

            # Convert Pydantic model to dict for consistency
            if hasattr(result, 'model_dump'):
                result_dict = result.model_dump()
            elif hasattr(result, 'dict'):
                result_dict = result.dict()
            else:
                result_dict = dict(result) if hasattr(result, '__dict__') else result

            logger.info(
                f"ATS analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "overall_score": result_dict.get("overallScore", 0),
                    "keywords_count": len(profile_keywords) if profile_keywords else 0,
                },
            )

            return result_dict

        except Exception as e:
            logger.error(f"Error in ATS analysis for user {user_id}: {str(e)}")
            raise



# Global instance
ats_scorer = ATSScorer()
