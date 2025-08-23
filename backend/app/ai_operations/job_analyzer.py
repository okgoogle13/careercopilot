"""
Job Analysis Operations

Analyzes job descriptions to extract requirements, skills, and key information
using the centralized AI configuration system.
"""

import json
import logging
from typing import Any, Dict, List, Optional

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class JobAnalyzer:
    """Job description analysis operations"""

    def __init__(self):
        self.ai_client = get_ai_client()

    @monitor_performance("job_description_analysis")
    @cached_ai_operation("job_analysis", user_id_param="user_id")
    async def analyze_job_description(
        self, user_id: str, job_description: str, company_info: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze a job description to extract key requirements and information.

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
            sanitized_company_info = None
            if company_info:
                sanitized_company_info = InputSanitizer.sanitize_text_input(company_info)

            system_prompt = (
                "You are an expert HR analyst and job market researcher with deep "
                "knowledge of industry requirements, salary ranges, and career "
                "progression paths. Analyze job descriptions with precision and "
                "industry insight."
            )

            company_section = (
                f"\\n\\nAdditional Company Information:\\n{sanitized_company_info.sanitized_content}"
                if sanitized_company_info
                else ""
            )

            prompt = f"""Analyze the job description below and extract comprehensive information.

Required JSON structure:
{{
    "job_title": "<standardized job title>",
    "company_name": "<company name if mentioned>",
    "location": "<job location>",
    "employment_type": "<full-time/part-time/contract/internship>",
    "remote_policy": "<on-site/remote/hybrid>",
    "experience_level": "<entry/junior/mid/senior/lead/executive>",
    "required_skills": {{
        "technical_skills": [<list of required technical skills>],
        "soft_skills": [<list of required soft skills>],
        "programming_languages": [<list of programming languages>],
        "frameworks": [<list of frameworks and tools>],
        "databases": [<list of database technologies>],
        "cloud_platforms": [<list of cloud platforms>]
    }},
    "preferred_skills": {{
        "technical_skills": [<list of preferred technical skills>],
        "soft_skills": [<list of preferred soft skills>],
        "programming_languages": [<list of preferred programming languages>],
        "frameworks": [<list of preferred frameworks and tools>]
    }},
    "education_requirements": {{
        "degree_level": "<bachelor/master/phd/none>",
        "field_of_study": [<list of relevant fields>],
        "certifications": [<list of preferred certifications>]
    }},
    "experience_requirements": {{
        "years_required": <minimum years of experience>,
        "years_preferred": <preferred years of experience>,
        "industry_experience": [<list of relevant industries>],
        "specific_experience": [<list of specific experience requirements>]
    }},
    "responsibilities": [<list of key job responsibilities>],
    "benefits": [<list of benefits and perks mentioned>],
    "salary": {{
        "range_mentioned": <true/false>,
        "min_salary": <minimum salary if mentioned>,
        "max_salary": <maximum salary if mentioned>,
        "currency": "<currency code>",
        "salary_type": "<hourly/annual>"
    }},
    "company_culture": {{
        "values": [<list of company values mentioned>],
        "work_environment": "<description of work environment>",
        "team_structure": "<description of team structure>",
        "growth_opportunities": [<list of growth opportunities>]
    }},
    "application_requirements": {{
        "required_documents": [<list of required documents>],
        "application_deadline": "<deadline if mentioned>",
        "contact_information": "<contact details if provided>"
    }},
    "industry": "<industry/sector>",
    "job_function": "<primary job function>",
    "difficulty_score": <1-10 scale of role complexity>,
    "competitiveness_score": <1-10 scale of market competitiveness>
}}{company_section}

Job Description:
---
{sanitized_job_desc.sanitized_content}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="job_analysis",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2000,
                temperature=0.5,
            )

            response = await self.ai_client.generate_text(request)

            # Parse JSON response
            try:
                parsed_result = json.loads(response.content.strip())
            except json.JSONDecodeError as e:
                raise AIError(
                    message=f"AI returned invalid JSON: {str(e)}",
                    error_type=AIErrorType.INVALID_REQUEST,
                    original_error=e,
                )

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "provider": response.provider,
                "tokens_used": response.tokens_used,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
                "analysis_timestamp": response.request_id,
            }

            logger.info(
                f"Job analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": response.model_used,
                    "job_title": parsed_result.get("job_title", "Unknown"),
                    "cached": response.cached,
                    "required_skills_count": len(
                        parsed_result.get("required_skills", {}).get("technical_skills", [])
                    ),
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in job analysis for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Job analysis failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("job_requirements_extraction")
    @cached_ai_operation("document_extraction", user_id_param="user_id")
    async def extract_job_requirements(
        self,
        user_id: str,
        job_description: str,
        focus_areas: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Extract specific job requirements with focus on particular areas.

        Args:
            user_id: User identifier
            job_description: Job description text
            focus_areas: Optional list of areas to focus on (e.g., ["technical", "leadership"])

        Returns:
            dict: Focused requirements extraction
        """
        try:
            sanitized_job_desc = InputSanitizer.sanitize_text_input(job_description)

            focus_instruction = ""
            if focus_areas:
                focus_instruction = (
                    f"\\nFocus particularly on these areas: {', '.join(focus_areas)}"
                )

            system_prompt = (
                "You are a specialized job requirements analyst with expertise in "
                "parsing complex job descriptions for specific requirements and "
                "qualifications."
            )

            prompt = f"""Extract specific job requirements from the job description below.{focus_instruction}

Required JSON structure:
{{
    "must_have_requirements": {{
        "technical_skills": [<list of absolutely required technical skills>],
        "experience": [<list of required experience types>],
        "education": [<list of required education/certifications>],
        "soft_skills": [<list of required soft skills>]
    }},
    "nice_to_have_requirements": {{
        "technical_skills": [<list of preferred technical skills>],
        "experience": [<list of preferred experience types>],
        "education": [<list of preferred education/certifications>],
        "soft_skills": [<list of preferred soft skills>]
    }},
    "deal_breakers": [<list of absolute requirements that cannot be compromised>],
    "growth_areas": [<list of skills/areas where growth is acceptable>],
    "assessment_criteria": [<list of how candidates will likely be evaluated>],
    "keyword_importance": {{
        "high_priority": [<keywords that are very important for ATS>],
        "medium_priority": [<keywords that are somewhat important>],
        "low_priority": [<keywords that are nice to have>]
    }},
    "role_complexity": {{
        "technical_complexity": <1-10 scale>,
        "leadership_complexity": <1-10 scale>,
        "stakeholder_complexity": <1-10 scale>,
        "decision_making_level": <1-10 scale>
    }}
}}

Job Description:
---
{sanitized_job_desc.sanitized_content}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="document_extraction",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=1500,
                temperature=0.3,
            )

            response = await self.ai_client.generate_text(request)

            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "extraction_focus": focus_areas,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
            }

            return parsed_result

        except Exception as e:
            logger.error(f"Error in job requirements extraction for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Job requirements extraction failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("salary_analysis")
    async def analyze_salary_expectations(
        self, user_id: str, job_description: str, location: str, experience_level: str
    ) -> Dict[str, Any]:
        """
        Analyze and provide salary expectations for a job.

        Args:
            user_id: User identifier
            job_description: Job description text
            location: Job location
            experience_level: Experience level (entry/mid/senior/etc)

        Returns:
            dict: Salary analysis and market data
        """
        try:
            sanitized_inputs = {
                "job_desc": InputSanitizer.sanitize_text_input(job_description),
                "location": InputSanitizer.sanitize_text_input(location),
                "experience": InputSanitizer.sanitize_text_input(experience_level),
            }

            system_prompt = (
                "You are a compensation analyst with expertise in salary "
                "benchmarking,\n                market analysis, and geographic "
                "pay variations. Provide accurate salary insights based on "
                "current market conditions."
            )

            prompt = f"""Analyze the job description and provide a comprehensive salary analysis.

Required JSON structure:
{{
    "salary_analysis": {{
        "base_salary_range": {{
            "min": <minimum expected salary>,
            "max": <maximum expected salary>,
            "median": <median expected salary>,
            "currency": "USD"
        }},
        "total_compensation_range": {{
            "min": <minimum total comp including benefits>,
            "max": <maximum total comp including benefits>,
            "median": <median total comp>
        }},
        "factors_affecting_salary": [<list of factors that impact salary for this role>],
        "location_adjustment": {{
            "location_factor": <multiplier compared to national average>,
            "cost_of_living_note": "<brief note about location impact>"
        }},
        "experience_premium": {{
            "current_level_multiplier": <salary multiplier for current experience level>,
            "next_level_range": "<salary range for next experience level>"
        }}
    }},
    "market_insights": {{
        "demand_level": "<low/medium/high>",
        "supply_level": "<low/medium/high>",
        "growth_trend": "<declining/stable/growing>",
        "key_market_drivers": [<list of factors driving demand/supply>],
        "negotiation_points": [<list of potential negotiation factors>]
    }},
    "benefits_expectations": [<list of typical benefits for this type of role>],
    "career_progression": {{
        "next_level_timeline": "<typical years to next level>",
        "progression_path": [<list of typical career progression steps>],
        "skill_development_priorities": [<list of skills to develop for advancement>]
    }},
    "recommendations": [<list of actionable recommendations for salary negotiation>]
}}

Job Description:
---
{sanitized_inputs['job_desc'].sanitized_content}
---

Location: {sanitized_inputs['location'].sanitized_content}
Experience Level: {sanitized_inputs['experience'].sanitized_content}

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="job_analysis",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=1800,
                temperature=0.4,
            )

            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "analysis_location": location,
                "experience_level": experience_level,
                "response_time_ms": response.response_time_ms,
            }

            logger.info(
                f"Salary analysis completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "location": location,
                    "experience_level": experience_level,
                    "model_used": response.model_used,
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in salary analysis for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Salary analysis failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )


# Global instance
job_analyzer = JobAnalyzer()
