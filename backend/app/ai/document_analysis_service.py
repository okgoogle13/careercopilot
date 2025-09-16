"""Unified Document Analysis Service.

This module provides a consolidated AI-powered analysis service for documents including:
- Resume analysis and skill extraction
- Job description analysis and requirements extraction
- Generic document processing with configurable schemas
- Unified error handling and caching
"""

import logging
import re
from typing import Any, Dict, List, Optional, Type, TypeVar, Union

from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings
from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt, get_prompt_service
from pydantic import BaseModel, Field

from .base_service import BaseAIService

logger = logging.getLogger(__name__)

# Type variable for Pydantic models
T = TypeVar("T", bound=BaseModel)


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


class SalaryRange(BaseModel):
    """Salary range information."""

    min: Optional[int] = None
    max: Optional[int] = None
    currency: str = "USD"


class ResumeAnalysisResult(BaseModel):
    """Result of resume analysis."""

    skills: List[str] = Field(default_factory=list, description="List of extracted skills")
    experience: List[Experience] = Field(
        default_factory=list, description="Work experience entries"
    )
    education: List[Education] = Field(default_factory=list, description="Education history")
    summary: str = Field(default="", description="Professional summary")
    raw_data: Optional[Dict[str, Any]] = None


class JobDescriptionAnalysisResult(BaseModel):
    """Result of job description analysis."""

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


class DocumentAnalysisService(BaseAIService):
    """Unified service for analyzing documents using AI with comprehensive error handling.

    This service consolidates resume analysis, job description analysis, and generic
    document processing into a single, consistent interface that uses the new core components.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the document analysis service.

        Args:
            config: Configuration dictionary with optional keys:
                - model: The AI model to use (default: from settings)
                - max_tokens: Maximum tokens for AI response
                - temperature: Temperature for AI generation
                - enabled: Whether the service is enabled
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

        self.name = "document_analysis"
        self.version = "3.0.0"
        self.prompt_service = get_prompt_service()

    async def analyze_resume(
        self, resume_text: str, target_industry: str = ""
    ) -> ResumeAnalysisResult:
        """Analyze a resume and return structured results.

        Args:
            resume_text: The text content of the resume to analyze
            target_industry: Optional target industry for contextualized analysis

        Returns:
            ResumeAnalysisResult: Structured analysis results

        Raises:
            ValueError: If the input is invalid
        """
        # Input validation
        if not resume_text or not isinstance(resume_text, str):
            raise ValueError("Resume text must be a non-empty string")

        if len(resume_text) < 20:
            raise ValueError("Resume text is too short for meaningful analysis")

        # Check if service is enabled
        if not self.config.get("enabled", True):
            logger.warning("Document analysis service is disabled")
            return self._get_default_resume_result()

        try:
            # Sanitize input
            clean_text = self._sanitize_text(resume_text)

            # Use the centralized prompt service
            return await self._analyze_document(
                document_text=clean_text,
                template_id="comprehensive_resume_analysis",
                response_model=ResumeAnalysisResult,
                template_params={
                    "resume_content": clean_text,
                    "target_industry": target_industry or "General",
                },
            )

        except Exception as e:
            error_msg = f"Failed to analyze resume: {str(e)}"
            logger.error(error_msg, exc_info=True)

            # Return a default result with error information
            result = self._get_default_resume_result()
            result.raw_data = result.raw_data or {}
            result.raw_data["error"] = str(e)
            return result

    async def analyze_job_description(
        self, job_description_text: str
    ) -> JobDescriptionAnalysisResult:
        """Analyze a job description and return structured results.

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

        if len(job_description_text) < 20:
            raise ValueError("Job description text is too short for meaningful analysis")

        # Check if service is enabled
        if not self.config.get("enabled", True):
            logger.warning("Document analysis service is disabled")
            return self._get_default_job_result()

        try:
            # Sanitize input
            clean_text = self._sanitize_text(job_description_text)

            # Use the centralized prompt service
            return await self._analyze_document(
                document_text=clean_text,
                template_id="job_description_analysis",
                response_model=JobDescriptionAnalysisResult,
                template_params={"job_description": clean_text},
            )

        except Exception as e:
            error_msg = f"Failed to analyze job description: {str(e)}"
            logger.error(error_msg, exc_info=True)

            # Return a default result with error information
            result = self._get_default_job_result()
            result.raw_data = result.raw_data or {}
            result.raw_data["error"] = str(e)
            return result

    async def analyze_document_generic(
        self,
        document_text: str,
        template_id: str,
        response_model: Type[T],
        **template_params,
    ) -> T:
        """Generic document analysis with custom template and response model.

        Args:
            document_text: The text content to analyze
            template_id: ID of the prompt template to use
            response_model: Pydantic model for the expected response
            **template_params: Additional parameters for the prompt template

        Returns:
            Instance of response_model with analysis results

        Raises:
            ValueError: If the input is invalid
        """
        # Input validation
        if not document_text or not isinstance(document_text, str):
            raise ValueError("Document text must be a non-empty string")

        if not template_id:
            raise ValueError("Template ID must be provided")

        # Check if service is enabled
        if not self.config.get("enabled", True):
            logger.warning("Document analysis service is disabled")
            raise AIError(AIErrorType.SERVICE_UNAVAILABLE, "Document analysis service is disabled")

        try:
            # Sanitize input
            clean_text = self._sanitize_text(document_text)

            return await self._analyze_document(
                document_text=clean_text,
                template_id=template_id,
                response_model=response_model,
                template_params=template_params,
            )

        except Exception as e:
            error_msg = f"Failed to analyze document with template {template_id}: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise

    async def _analyze_document(
        self,
        document_text: str,
        template_id: str,
        response_model: Type[T],
        template_params: Dict[str, Any],
    ) -> T:
        """Internal method to perform document analysis using the unified architecture.

        Args:
            document_text: The sanitized document text
            template_id: ID of the prompt template
            response_model: Pydantic model for response
            template_params: Parameters for template formatting

        Returns:
            Instance of response_model with analysis results
        """
        # Get the AI model through the centralized system
        model = get_model()
        if not model:
            raise AIError(
                AIErrorType.MODEL_UNAVAILABLE,
                "AI model not available for document analysis",
            )

        # Format the prompt using the centralized prompt service
        try:
            prompt = format_prompt(template_id, **template_params)
            system_prompt = self.prompt_service.get_system_prompt(template_id)
        except Exception as e:
            raise AIError(
                AIErrorType.PROMPT_FORMATTING_ERROR,
                f"Failed to format prompt template {template_id}: {str(e)}",
            )

        # Generate response using the model
        try:
            generation_config = {
                "response_mime_type": "application/json",
                "max_output_tokens": self.config.get("max_tokens"),
                "temperature": self.config.get("temperature"),
            }

            if system_prompt:
                response = await model.generate(
                    prompt=prompt,
                    system_prompt=system_prompt,
                    output_schema=response_model,
                    config=generation_config,
                )
            else:
                response = await model.generate(
                    prompt=prompt,
                    output_schema=response_model,
                    config=generation_config,
                )

            return response.output()

        except Exception as e:
            raise AIError(
                AIErrorType.GENERATION_ERROR,
                f"Failed to generate analysis response: {str(e)}",
            )

    def _sanitize_text(self, text: str) -> str:
        """Sanitize and normalize input text."""
        # Remove any potential harmful content
        text = re.sub(r"<[^>]+>", "", text)  # Remove HTML tags
        text = re.sub(r"\s+", " ", text).strip()  # Normalize whitespace
        return text

    def _get_default_resume_result(self) -> ResumeAnalysisResult:
        """Return a default resume result when analysis cannot be performed."""
        return ResumeAnalysisResult(
            skills=[],
            experience=[],
            education=[],
            summary="",
            raw_data={"error": "Analysis not available"},
        )

    def _get_default_job_result(self) -> JobDescriptionAnalysisResult:
        """Return a default job result when analysis cannot be performed."""
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
            raw_data={"error": "Analysis not available"},
        )

    async def extract_skills(self, document_text: str, document_type: str = "resume") -> List[str]:
        """Extract skills from a document.

        Args:
            document_text: The text content of the document
            document_type: Type of document ("resume" or "job_description")

        Returns:
            List of extracted skills
        """
        if not self.is_available():
            return []

        try:
            if document_type == "resume":
                result = await self.analyze_resume(document_text)
                return result.skills
            elif document_type == "job_description":
                result = await self.analyze_job_description(document_text)
                return result.required_skills + result.preferred_skills
            else:
                # Generic skill extraction
                template_params = {
                    "document_text": document_text,
                    "document_type": document_type,
                }
                result = await self.analyze_document_generic(
                    document_text,
                    "skill_extraction",  # This template would need to be added
                    BaseModel,  # Simple response model for skills
                    **template_params,
                )
                return getattr(result, "skills", [])
        except Exception as e:
            logger.error(f"Failed to extract skills: {e}")
            return []


# Global instance
_document_analysis_service: Optional[DocumentAnalysisService] = None


def get_document_analysis_service() -> DocumentAnalysisService:
    """Get the global document analysis service instance."""
    global _document_analysis_service
    if _document_analysis_service is None:
        _document_analysis_service = DocumentAnalysisService()
    return _document_analysis_service


# Convenience functions for backward compatibility
async def analyze_resume(resume_text: str, target_industry: str = "") -> ResumeAnalysisResult:
    """Convenience function to analyze a resume."""
    service = get_document_analysis_service()
    return await service.analyze_resume(resume_text, target_industry)


async def analyze_job_description(
    job_description_text: str,
) -> JobDescriptionAnalysisResult:
    """Convenience function to analyze a job description."""
    service = get_document_analysis_service()
    return await service.analyze_job_description(job_description_text)
