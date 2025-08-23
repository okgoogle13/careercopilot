"""
Resume Analysis Operations

Modern implementation using the centralized AI configuration system
with comprehensive security, monitoring, and caching.
"""

import json
import logging
from typing import Any, Dict, Optional

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class ResumeAnalyzer:
    """Resume analysis operations using centralized AI system"""

    def __init__(self):
        self.ai_client = get_ai_client()

    @monitor_performance("resume_comparison")
    @cached_ai_operation("resume_analysis", user_id_param="user_id")
    async def compare_resume_to_job(
        self, user_id: str, resume_text: str, job_analysis_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Compare a resume to job analysis data with expert career coaching insights.

        Args:
            user_id: User identifier for tracking and caching
            resume_text: Raw resume content from user
            job_analysis_data: Structured job analysis data

        Returns:
            dict: Structured analysis with match score and recommendations

        Raises:
            InputValidationError: If input validation fails
            AIError: If AI operation fails
        """
        try:
            # Input validation and sanitization
            if not resume_text or not isinstance(resume_text, str):
                raise InputValidationError(
                    "Resume text is required and must be a string"
                )

            if not job_analysis_data or not isinstance(job_analysis_data, dict):
                raise InputValidationError(
                    "Job analysis data is required and must be a dictionary"
                )

            # Sanitize inputs to prevent prompt injection
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            sanitized_job_data = InputSanitizer.sanitize_dict_input(job_analysis_data)

            # Log warnings if any suspicious content was detected
            if sanitized_resume.warnings:
                logger.warning(
                    f"Resume sanitization warnings for user {user_id}: {sanitized_resume.warnings}"
                )

            # Create comprehensive analysis prompt
            system_prompt = """You are an expert career coach with 15+ years of experience in resume analysis and job matching. Your expertise includes ATS optimization, industry-specific requirements, and career development strategies."""

            prompt = f"""Analyze the provided resume against the structured job analysis data and provide a comprehensive comparison.

REQUIREMENTS:
- Respond ONLY with a valid JSON object (no additional text)
- Provide actionable, specific feedback
- Consider both technical and soft skills
- Include ATS optimization recommendations

Required JSON structure:
{"match_score": <integer 0-100>,
    "matching_skills": [<list of skills found in both resume and job requirements>],
    "missing_skills": [<list of key job skills not found in resume>],
    "improvement_suggestions": [<list of specific, actionable recommendations>],
    "strengths": [<list of resume strengths relevant to the job>],
    "ats_optimization": [<list of ATS-specific recommendations>],
    "experience_match": {"level": "<entry/mid/senior/executive>",
        "years_gap": <integer, negative if over-qualified, positive if under-qualified>,
        "relevant_experience": [<list of relevant experience highlights>]
    } ,
    "industry_alignment": {"score": <integer 0-100>,
        "transferable_skills": [<list of skills that transfer across industries>],
        "industry_specific_gaps": [<list of industry-specific knowledge gaps>]
    } }

Resume Text:
---
{sanitized_resume.sanitized_content}
---

Job Analysis Data:
---
{json.dumps(sanitized_job_data, indent=2)}
---

Respond with ONLY the JSON object:"""

            # Create AI request
            request = AIRequest(
                prompt=prompt,
                service_name="resume_analysis",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2000,
                temperature=0.7,
            )

            # Generate response using AI client
            response = await self.ai_client.generate_text(request)

            logger.info(
                f"Resume analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": response.model_used,
                    "tokens_used": response.tokens_used,
                    "response_time_ms": response.response_time_ms,
                    "cached": response.cached,
                    "cost_estimate": response.cost_estimate,
                },
            )

            # Parse and validate JSON response
            try:
                parsed_result = json.loads(response.content.strip())
            except json.JSONDecodeError as e:
                raise AIError(
                    message=f"AI returned invalid JSON: {str(e)}",
                    error_type=AIErrorType.INVALID_REQUEST,
                    original_error=e,
                )

            # Validate required fields in response
            required_fields = [
                "match_score",
                "matching_skills",
                "missing_skills",
                "improvement_suggestions",
                "strengths",
                "ats_optimization",
                "experience_match",
                "industry_alignment",
            ]
            missing_fields = [
                field for field in required_fields if field not in parsed_result
            ]

            if missing_fields:
                raise AIError(
                    message=f"AI response missing required fields: {missing_fields}",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

            # Validate field types and ranges
            if not isinstance(parsed_result["match_score"], int) or not (
                0 <= parsed_result["match_score"] <= 100
            ):
                raise AIError(
                    message="Match score must be an integer between 0 and 100",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

            # Validate list fields
            list_fields = [
                "matching_skills",
                "missing_skills",
                "improvement_suggestions",
                "strengths",
                "ats_optimization",
            ]
            for field in list_fields:
                if not isinstance(parsed_result[field], list):
                    raise AIError(
                        message=f"Field '{field}' must be a list",
                        error_type=AIErrorType.INVALID_REQUEST,
                    )

            # Validate nested objects
            if not isinstance(parsed_result["experience_match"], dict):
                raise AIError(
                    message="Field 'experience_match' must be an object",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

            if not isinstance(parsed_result["industry_alignment"], dict):
                raise AIError(
                    message="Field 'industry_alignment' must be an object",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "provider": response.provider,
                "tokens_used": response.tokens_used,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
                "cost_estimate": response.cost_estimate,
                "analysis_timestamp": response.request_id,
            }

            return parsed_result

        except InputValidationError as e:
            logger.error(f"Input validation failed for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Input validation failed: {str(e)}",
                error_type=AIErrorType.INVALID_REQUEST,
                original_error=e,
            )

        except AIError:
            # Re-raise AI errors as-is with logging
            logger.error(f"AI error in resume analysis for user {user_id}")
            raise

        except Exception as e:
            logger.error(
                f"Unexpected error in resume analysis for user {user_id}: {str(e)}"
            )
            raise AIError(
                message=f"Unexpected error in resume analysis: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("resume_skills_extraction")
    @cached_ai_operation("document_extraction", user_id_param="user_id")
    async def extract_resume_skills(
        self, user_id: str, resume_text: str, job_context: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extract skills, experience, and key information from a resume.

        Args:
            user_id: User identifier for tracking and caching
            resume_text: Raw resume content
            job_context: Optional job context for targeted extraction

        Returns:
            dict: Extracted skills, experience, education, and contact info
        """
        try:
            # Sanitize input
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)

            system_prompt = """You are an expert resume parser with deep knowledge of industry skills, technologies, and career progression patterns. Extract comprehensive information with high accuracy."""

            context_section = (
                f"\n\nJob Context (for targeted extraction):\n{job_context}"
                if job_context
                else ""
            )

            prompt = f"""Extract comprehensive information from the resume below. Focus on accuracy and completeness.

Required JSON structure:
{"contact_info": {"name": "<full name>",
        "email": "<email address>",
        "phone": "<phone number>",
        "location": "<city, state/country>",
        "linkedin": "<LinkedIn URL>",
        "portfolio": "<portfolio/website URL>"
    } ,
    "professional_summary": "<2-3 sentence professional summary>",
    "technical_skills": {"programming_languages": [<list of programming languages>],
        "frameworks": [<list of frameworks and libraries>],
        "databases": [<list of database technologies>],
        "cloud_platforms": [<list of cloud platforms>],
        "tools": [<list of development tools and software>],
        "methodologies": [<list of methodologies like Agile, DevOps>]
    } ,
    "soft_skills": [<list of soft skills and interpersonal abilities>],
    "experience": [
        {"title": "<job title>",
            "company": "<company name>",
            "duration": "<start date - end date>",
            "description": "<job description>",
            "achievements": [<list of key achievements>],
            "technologies": [<list of technologies used>]
        }
    ],
    "education": [
        {"degree": "<degree type>",
            "field": "<field of study>",
            "institution": "<school name>",
            "graduation_year": "<year>",
            "gpa": "<GPA if mentioned>",
            "honors": [<list of academic honors>]
        }
    ],
    "certifications": [
        {"name": "<certification name>",
            "issuer": "<issuing organization>",
            "date": "<issue date>",
            "expiry": "<expiry date if applicable>"
        }
    ],
    "projects": [
        {"name": "<project name>",
            "description": "<project description>",
            "technologies": [<list of technologies used>],
            "url": "<project URL if available>"
        }
    ],
    "languages": [<list of spoken languages with proficiency levels>],
    "years_of_experience": <total years of professional experience>,
    "career_level": "<entry/junior/mid/senior/lead/executive>"
} {context_section}

Resume Text:
---
{sanitized_resume.sanitized_content}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="document_extraction",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2500,
                temperature=0.3,  # Lower temperature for extraction accuracy
            )

            response = await self.ai_client.generate_text(request)

            # Parse JSON response
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "provider": response.provider,
                "tokens_used": response.tokens_used,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
                "extraction_timestamp": response.request_id,
            }

            logger.info(
                f"Skills extraction completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": response.model_used,
                    "cached": response.cached,
                    "skills_count": len(
                        parsed_result.get("technical_skills", {}).get(
                            "programming_languages", []
                        )
                    )
                    + len(parsed_result.get("soft_skills", [])),
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in skills extraction for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Skills extraction failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )


# Global instance for easy import
resume_analyzer = ResumeAnalyzer()
