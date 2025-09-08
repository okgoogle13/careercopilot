"""Job Description Analysis Service.

This module provides AI-powered analysis of job descriptions with support for:
- Requirements extraction
- Skills identification
- Company culture analysis
- Compatibility scoring
"""

import logging
import re
from typing import Any, Dict, List, Optional

from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings
from pydantic import BaseModel, Field

from .base_service import BaseAIService

logger = logging.getLogger(__name__)


class SalaryRange(BaseModel):
    """Salary range information."""
    
    min: Optional[int] = None
    max: Optional[int] = None
    currency: str = "USD"


class JobDescriptionAnalysisResult(BaseModel):
    """Result of job description analysis.

    Attributes:
        title: Job title
        company: Company name
        location: Job location
        job_type: Type of employment (full-time, part-time, etc.)
        experience_level: Required experience level
        required_skills: List of required skills
        preferred_skills: List of preferred/nice-to-have skills
        responsibilities: List of job responsibilities
        requirements: List of job requirements
        salary_range: Salary information if available
        benefits: List of benefits offered
        company_description: Description of the company
        summary: Generated job summary
        raw_data: Raw analysis data from AI
    """

    title: str = Field(default="", description="Job title")
    company: str = Field(default="", description="Company name")
    location: str = Field(default="", description="Job location")
    job_type: str = Field(default="", description="Employment type")
    experience_level: str = Field(default="", description="Experience level required")
    required_skills: List[str] = Field(default_factory=list, description="Required skills")
    preferred_skills: List[str] = Field(default_factory=list, description="Preferred skills")
    responsibilities: List[str] = Field(default_factory=list, description="Job responsibilities")
    requirements: List[str] = Field(default_factory=list, description="Job requirements")
    salary_range: Optional[SalaryRange] = Field(None, description="Salary information")
    benefits: List[str] = Field(default_factory=list, description="Benefits offered")
    company_description: str = Field(default="", description="Company description")
    summary: str = Field(default="", description="Job summary")
    raw_data: Optional[Dict[str, Any]] = None


class JobDescriptionAnalysisService(BaseAIService):
    """Service for analyzing job descriptions using AI with comprehensive error handling.

    This service provides:
    - Requirements and skills extraction
    - Job type and level identification
    - Company culture analysis
    - Salary and benefits extraction
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the job description analysis service.

        Args:
            config: Configuration dictionary with the following optional keys:
                - model: The AI model to use (default: settings.ai_model)
                - max_tokens: Maximum tokens for AI response (default: settings.ai_max_tokens)
                - temperature: Temperature for AI generation (default: settings.ai_temperature)
                - enabled: Whether the service is enabled (default: settings.enable_ai_features)
        """
        super().__init__(config or {})
        self.config = {
            "model": config.get("model", settings.ai_model) if config else settings.ai_model,
            "max_tokens": (
                config.get("max_tokens", settings.ai_max_tokens)
                if config
                else settings.ai_max_tokens
            ),
            "temperature": (
                config.get("temperature", settings.ai_temperature)
                if config
                else settings.ai_temperature
            ),
            "enabled": (
                config.get("enabled", settings.enable_ai_features)
                if config
                else settings.enable_ai_features
            ),
            "cache_enabled": True,
            "cache_ttl": 3600,  # 1 hour cache TTL
        }

        self.name = "job_description_analysis"
        self.version = "2.0.0"
        self.required_params = ["job_description_text"]

    async def analyze_job_description(self, job_description_text: str) -> JobDescriptionAnalysisResult:
        """Analyze a job description and return structured results.

        This is the main entry point for job description analysis. It performs:
        1. Input validation and sanitization
        2. AI-powered analysis of the job description content using generic document processing
        3. Structured extraction of requirements, skills, and job details
        4. Generation of a job summary

        Args:
            job_description_text: The text content of the job description to analyze

        Returns:
            JobDescriptionAnalysisResult: Structured analysis results

        Raises:
            ValueError: If the input is invalid
        """
        # Input validation
        if not job_description_text or not isinstance(job_description_text, str):
            raise ValueError("Job description text must be a non-empty string")

        if len(job_description_text) < 20:  # Minimum reasonable length
            raise ValueError("Job description text is too short for meaningful analysis")

        # Check if service is enabled
        if not self.config.get("enabled", True):
            logger.warning("Job description analysis service is disabled")
            return self._get_default_result()

        try:
            # Sanitize input
            clean_text = self._sanitize_job_description_text(job_description_text)

            # Use generic document processing
            from app.core.document_processing import process_document, PromptTemplates
            
            result = await process_document(
                file_content=clean_text,
                prompt_template=PromptTemplates.JOB_DESCRIPTION_ANALYSIS,
                response_model=JobDescriptionAnalysisResult,
                processor_config=self.config,
            )
            return result

        except Exception as e:
            error_msg = f"Failed to analyze job description: {str(e)}"
            logger.error(error_msg, exc_info=True)

            # Return a default result with error information
            result = self._get_default_result(job_description_text)
            result.raw_data = result.raw_data or {}
            result.raw_data["error"] = str(e)
            return result

    def _sanitize_job_description_text(self, text: str) -> str:
        """Sanitize and normalize job description text."""
        # Remove any potential harmful content
        text = re.sub(r"<[^>]+>", "", text)  # Remove HTML tags
        text = re.sub(r"\s+", " ", text).strip()  # Normalize whitespace
        return text

    def _get_default_result(self, job_description_text: str = "") -> JobDescriptionAnalysisResult:
        """Return a default result when analysis cannot be performed."""
        return JobDescriptionAnalysisResult(
            title="",
            company="",
            location="",
            job_type="",
            experience_level="",
            required_skills=[],
            preferred_skills=[],
            responsibilities=[],
            requirements=[],
            salary_range=None,
            benefits=[],
            company_description="",
            summary="",
            raw_data={
                "error": "Analysis not available",
                "input_sample": (
                    job_description_text[:200] + "..." if len(job_description_text) > 200 else job_description_text
                ),
            },
        )

    async def extract_skills(self, job_description_text: str) -> List[str]:
        """Extract skills from job description text.

        Args:
            job_description_text: The text content of the job description

        Returns:
            List of extracted skills
        """
        if not self.is_available():
            return []

        try:
            result = await self.analyze_job_description(job_description_text)
            return result.required_skills + result.preferred_skills
        except Exception as e:
            self.handle_error(e, "extract_skills")
            return []

    async def extract_requirements(self, job_description_text: str) -> List[str]:
        """Extract requirements from job description text.

        Args:
            job_description_text: The text content of the job description

        Returns:
            List of extracted requirements
        """
        if not self.is_available():
            return []

        try:
            result = await self.analyze_job_description(job_description_text)
            return result.requirements
        except Exception as e:
            self.handle_error(e, "extract_requirements")
            return []


# Example usage:
if __name__ == "__main__":
    import asyncio

    async def main():
        service = JobDescriptionAnalysisService()
        result = await service.analyze_job_description(
            """
            Senior Software Engineer - AI/ML Team
            
            TechCorp Inc. is looking for a Senior Software Engineer to join our AI/ML team.
            
            Requirements:
            - Bachelor's degree in Computer Science or related field
            - 5+ years of software development experience
            - Strong proficiency in Python and machine learning frameworks
            - Experience with cloud platforms (AWS, GCP, Azure)
            
            Responsibilities:
            - Develop and maintain AI/ML models in production
            - Collaborate with cross-functional teams
            - Optimize model performance and scalability
            
            Benefits:
            - Competitive salary: $120,000 - $160,000
            - Health, dental, and vision insurance
            - 401(k) matching
            - Flexible work arrangements
        """
        )
        print("Analysis Result:")
        print(f"Title: {result.title}")
        print(f"Company: {result.company}")
        print(f"Required Skills: {', '.join(result.required_skills)}")
        print(f"Summary: {result.summary}")

    asyncio.run(main())