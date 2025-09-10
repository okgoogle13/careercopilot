"""
Resume Analysis Operations

Service layer for resume analysis that delegates to genkit flow implementation
while providing a clean API interface with caching and monitoring.
"""

import logging
from typing import Any, Dict, List, Optional

from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class ResumeAnalyzer:
    """Service layer for resume analysis that delegates to genkit flow"""

    def __init__(self):
        # Import the working genkit flow
        from app.genkit_flows.resume_analyzer import compare_resume_to_job
        self.compare_flow = compare_resume_to_job

    @monitor_performance("resume_analysis")
    @cached_ai_operation("resume_analysis", user_id_param="user_id")
    async def analyze_resume(
        self, 
        user_id: str, 
        resume_text: str, 
        job_analysis_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Analyze a resume, optionally comparing it to job requirements.

        Args:
            user_id: User identifier for tracking and caching
            resume_text: Raw resume content
            job_analysis_data: Optional job analysis data for comparison

        Returns:
            dict: Structured resume analysis data
        """
        try:
            # Input validation
            if not resume_text or not isinstance(resume_text, str):
                raise InputValidationError("Resume text is required and must be a string")

            # Sanitize inputs
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            
            # Use comparison flow (can handle empty job data)
            result = self.compare_flow(
                resume_text=sanitized_resume.sanitized_content,
                job_analysis_data=job_analysis_data or {}
            )
            
            # Convert result to dict if needed
            if isinstance(result, str):
                try:
                    import json
                    result_dict = json.loads(result)
                except json.JSONDecodeError:
                    result_dict = {"analysis": result, "raw_output": True}
            else:
                result_dict = result if isinstance(result, dict) else {"analysis": str(result)}

            logger.info(
                f"Resume analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "job_comparison": bool(job_analysis_data),
                    "analysis_type": "comparison" if job_analysis_data else "standalone",
                },
            )

            return result_dict

        except Exception as e:
            logger.error(f"Error in resume analysis for user {user_id}: {str(e)}")
            raise

    @monitor_performance("resume_comparison")
    @cached_ai_operation("resume_comparison", user_id_param="user_id")
    async def compare_to_job(
        self,
        user_id: str,
        resume_text: str,
        job_analysis_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Compare resume to specific job requirements.

        Args:
            user_id: User identifier
            resume_text: Resume content
            job_analysis_data: Job requirements and analysis

        Returns:
            dict: Comparison analysis
        """
        try:
            if not resume_text or not isinstance(resume_text, str):
                raise InputValidationError("Resume text is required and must be a string")
            
            if not job_analysis_data or not isinstance(job_analysis_data, dict):
                raise InputValidationError("Job analysis data is required and must be a dictionary")

            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            
            # Use the comparison flow directly
            result = self.compare_flow(
                resume_text=sanitized_resume.sanitized_content,
                job_analysis_data=job_analysis_data
            )

            # Convert result to dict if needed  
            if isinstance(result, str):
                try:
                    import json
                    result_dict = json.loads(result)
                except json.JSONDecodeError:
                    result_dict = {"comparison": result, "raw_output": True}
            else:
                result_dict = result if isinstance(result, dict) else {"comparison": str(result)}

            logger.info(
                f"Resume comparison completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "job_title": job_analysis_data.get("job_title", "Unknown"),
                },
            )

            return result_dict

        except Exception as e:
            logger.error(f"Error in resume comparison for user {user_id}: {str(e)}")
            raise


# Global instance
resume_analyzer = ResumeAnalyzer()