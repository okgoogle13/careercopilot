"""Resume Analysis Service.

This module provides AI-powered analysis of resumes with support for:
- Skills extraction
- Experience analysis
- Education verification
- Professional summary generation
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings
from pydantic import BaseModel, Field

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

        self.name = "resume_analysis"
        self.version = "2.0.0"
        self.required_params = ["resume_text"]
        self.ai_client = get_ai_client()

    async def analyze_resume(self, resume_text: str) -> ResumeAnalysisResult:
        """Analyze a resume and return structured results.

        This is the main entry point for resume analysis. It performs:
        1. Input validation and sanitization
        2. AI-powered analysis of the resume content
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

        # Sanitize input
        clean_text = self._sanitize_resume_text(resume_text)

        # Check if service is enabled
        if not self.config.get("enabled", True):
            logger.warning("Resume analysis service is disabled")
            return self._get_default_result()

        try:
            # Create and send AI prompt
            prompt = self._create_analysis_prompt(clean_text)
            response = await self._make_ai_request(prompt)

            # Parse and validate response
            result = self._parse_ai_response(response)
            return result

        except Exception as e:
            error_msg = f"Failed to analyze resume: {str(e)}"
            logger.error(error_msg, exc_info=True)

            # Return a default result with error information
            result = self._get_default_result(resume_text)
            result.raw_data["error"] = str(e)
            return result

    def _sanitize_resume_text(self, text: str) -> str:
        """Sanitize and normalize resume text."""
        # Remove any potential harmful content
        text = re.sub(r"<[^>]+>", "", text)  # Remove HTML tags
        text = re.sub(r"\s+", " ", text).strip()  # Normalize whitespace
        return text

    def _create_analysis_prompt(self, resume_text: str) -> str:
        """Create a structured prompt for resume analysis.

        Args:
            resume_text: The text content of the resume to analyze

        Returns:
            str: Formatted prompt for the AI model
        """
        return f"""
Analyze the following resume and extract structured information.

RESUME:
{resume_text}

Please provide a detailed analysis including:
1. Skills: List all technical and soft skills mentioned
2. Experience: Analyze work experience with company names, titles, and durations
3. Education: Extract education history with degrees and institutions
4. Summary: Generate a professional summary

Format your response as a JSON object with the following structure:
{{
    "skills": ["skill1", "skill2", ...],
    "experience": [
        {{
            "company": "Company Name",
            "title": "Job Title",
            "duration": "Start Date - End Date",
            "description": "Job description"
        }}
    ],
    "education": [
        {{
            "degree": "Degree Name",
            "field": "Field of Study",
            "institution": "School/University Name",
            "year": graduation_year
        }}
    ],
    "summary": "Professional summary"
}}
"""

    async def _make_ai_request(self, prompt: str) -> Dict[str, Any]:
        """Make an AI request with proper error handling."""
        try:
            request = AIRequest(
                prompt=prompt,
                model=self.config.get("model"),
                max_tokens=self.config.get("max_tokens"),
                temperature=self.config.get("temperature"),
                stream=False,
            )

            response = await self.ai_client.generate(request)
            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"AI request failed: {str(e)}", exc_info=True)
            raise AIError(
                error_type=AIErrorType.API_ERROR,
                message="Failed to process resume analysis request",
                details={"error": str(e)},
            )

    def _parse_ai_response(self, response: str) -> ResumeAnalysisResult:
        """Parse the AI response into a structured result."""
        try:
            # Parse the JSON response
            data = json.loads(response)

            # Convert to Pydantic models
            experience = [Experience(**exp) for exp in data.get("experience", [])]

            education = [Education(**edu) for edu in data.get("education", [])]

            return ResumeAnalysisResult(
                skills=data.get("skills", []),
                experience=experience,
                education=education,
                summary=data.get("summary", ""),
                raw_data={"response": data},
            )

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response: {str(e)}")
            raise AIError(
                error_type=AIErrorType.PARSE_ERROR,
                message="Failed to parse AI response",
                details={"error": str(e), "response": response[:500]},
            )
        except Exception as e:
            logger.error(f"Error processing AI response: {str(e)}", exc_info=True)
            raise AIError(
                error_type=AIErrorType.PROCESSING_ERROR,
                message="Error processing analysis results",
                details={"error": str(e)},
            )

    def _get_default_result(self, resume_text: str) -> ResumeAnalysisResult:
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
        """Extract skills from resume text.

        Args:
            resume_text: The text content of the resume

        Returns:
            List of extracted skills
        """
        if not self.is_available():
            return []

        try:
            # TODO: Implement skill extraction using Genkit
            # This is a placeholder implementation
            return ["Python", "Machine Learning", "Data Analysis"]
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
