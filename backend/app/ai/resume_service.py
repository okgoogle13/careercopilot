"""Resume Analysis Service.

This module provides AI-powered analysis of resumes with support for:
- Skills extraction
- Experience analysis
- Education verification
- Professional summary generation
"""

import logging
import re
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.core.ai_client import get_ai_client
from app.core.config import settings

from .base_service import BaseAIService

logger = logging.getLogger(__name__)


class Education(BaseModel):
    """Education information model."""

    degree: str
    field: str
    institution: str
    year: int


class Experience(BaseModel):
    """Work experience model."""

    title: str
    company: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: Optional[str] = None


class ResumeAnalysisResult(BaseModel):
    """Result of resume analysis.

    Attributes:
        skills: List of extracted skills
        experience: List of work experiences
        education: List of education entries
        summary: Generated professional summary
        raw_data: Raw analysis data from AI
    """

    skills: List[str] = Field(default_factory=list, description="List of extracted skills")
    experience: List[Experience] = Field(
        default_factory=list, description="Work experience entries"
    )
    education: List[Education] = Field(default_factory=list, description="Education history")
    summary: str = Field(default="", description="Professional summary")
    raw_data: Optional[Dict[str, Any]] = None


class ResumeAnalysisService(BaseAIService):
    """Service for analyzing resumes using AI with comprehensive error handling.

    This service provides:
    - Skills extraction and categorization
    - Experience analysis
    - Education verification
    - Professional summary generation
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the resume analysis service.

        Args:
            config: Configuration dictionary with the following optional keys:
                - model: The AI model to use (default: settings.ai_model)
                - max_tokens: Maximum tokens for AI response (default: settings.ai_max_tokens)
                - temperature: Temperature for AI generation (default: settings.ai_temperature)
                - enabled: Whether the service is enabled (default: settings.enable_ai_features)
        """
        super().__init__(config or {})
        self.config = {
            "model": (config.get("model", settings.ai_model) if config else settings.ai_model),
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

        self.name = "resume_analysis"
        self.version = "2.0.0"
        self.required_params = ["resume_text"]
        self.ai_client = get_ai_client()

    async def analyze_resume(self, resume_text: str) -> ResumeAnalysisResult:
        """Analyze a resume and return structured results.

        This is the main entry point for resume analysis. It performs:
        1. Input validation and sanitization
        2. AI-powered analysis of the resume content using generic document processing
        3. Structured extraction of skills, experience, and education
        4. Generation of a professional summary

        Args:
            resume_text: The text content of the resume to analyze

        Returns:
            ResumeAnalysisResult: Structured analysis results

        Raises:
            ValueError: If the input is invalid
        """
        # Input validation
        if not resume_text or not isinstance(resume_text, str):
            raise ValueError("Resume text must be a non-empty string")

        if len(resume_text) < 20:  # Minimum reasonable length for a resume
            raise ValueError("Resume text is too short for meaningful analysis")

        # Check if service is enabled
        if not self.config.get("enabled", True):
            logger.warning("Resume analysis service is disabled")
            return self._get_default_result()

        try:
            # Sanitize input
            clean_text = self._sanitize_resume_text(resume_text)

            # Use generic document processing
            from app.core.document_processing import PromptTemplates, process_document

            result = await process_document(
                file_content=clean_text,
                prompt_template=PromptTemplates.RESUME_ANALYSIS,
                response_model=ResumeAnalysisResult,
                processor_config=self.config,
            )
            return result

        except Exception as e:
            error_msg = f"Failed to analyze resume: {str(e)}"
            logger.error(error_msg, exc_info=True)

            # Return a default result with error information
            result = self._get_default_result(resume_text)
            result.raw_data = result.raw_data or {}
            result.raw_data["error"] = str(e)
            return result

    def _sanitize_resume_text(self, text: str) -> str:
        """Sanitize and normalize resume text."""
        # Remove any potential harmful content
        text = re.sub(r"<[^>]+>", "", text)  # Remove HTML tags
        text = re.sub(r"\s+", " ", text).strip()  # Normalize whitespace
        return text

    # NOTE: The following methods are now handled by the generic document processor:
    # - _create_analysis_prompt: Use PromptTemplates.RESUME_ANALYSIS
    # - _make_ai_request: Handled by process_document function
    # - _parse_ai_response: Handled by process_document function

    # These methods are kept for backward compatibility if needed elsewhere

    def _get_default_result(self, resume_text: str = "") -> ResumeAnalysisResult:
        """Return a default result when analysis cannot be performed."""
        return ResumeAnalysisResult(
            skills=[],
            experience=[],
            education=[],
            summary="",
            raw_data={
                "error": "Analysis not available",
                "input_sample": (
                    resume_text[:200] + "..." if len(resume_text) > 200 else resume_text
                ),
            },
        )

    async def extract_skills(self, resume_text: str) -> List[str]:
        """Extract skills from resume text using AI.

        Args:
            resume_text: The text content of the resume

        Returns:
            List of extracted skills
        """
        if not self.is_available():
            return []

        try:
            # Sanitize input
            clean_text = self._sanitize_resume_text(resume_text)

            # Create a prompt for skill extraction
            skill_extraction_prompt = f"""Analyze the following resume and extract ONLY the skills mentioned.

Resume:
{clean_text}

Return the skills as a JSON object with this format:
{{"skills": ["skill1", "skill2", "skill3", ...]}}

Include all technical skills, tools, frameworks, methodologies, soft skills, and certifications mentioned."""

            # Use AI client to extract skills
            from app.core.document_processing import process_document

            # Define a simple response model for skill extraction
            class SkillExtractionResult(BaseModel):
                skills: List[str] = Field(default_factory=list, description="List of extracted skills")

            result = await process_document(
                file_content=clean_text,
                prompt_template=skill_extraction_prompt,
                response_model=SkillExtractionResult,
                processor_config=self.config,
            )

            # Deduplicate and clean up skills
            unique_skills = list(set(skill.strip() for skill in result.skills if skill.strip()))

            logger.info(f"Extracted {len(unique_skills)} unique skills from resume")
            return sorted(unique_skills)

        except Exception as e:
            self.handle_error(e, "extract_skills")
            return []


# Example usage:
if __name__ == "__main__":
    import asyncio

    async def main():
        service = ResumeAnalysisService()
        result = await service.analyze_resume(
            """
            John Doe
            Senior Software Engineer

            Skills: Python, Machine Learning, Data Science

            Experience:
            - Senior Developer at Tech Corp (2020-Present)
              * Led AI development team
              * Implemented machine learning models

            Education:
            B.Sc in Computer Science, University of Technology (2018)
        """
        )
        print("Analysis Result:")
        print(f"Summary: {result.summary}")
        print(f"Skills: {', '.join(result.skills)}")

    asyncio.run(main())
