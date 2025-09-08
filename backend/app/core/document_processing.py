"""
Generic Document Processing Core Module

This module provides a unified interface for document processing operations,
consolidating common patterns used across resume analysis, job description
processing, and RAG document handling.
"""

import json
import logging
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, List, Optional, Type, TypeVar, Union

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings
from pydantic import BaseModel

logger = logging.getLogger(__name__)

# Type variables for generic processing
T = TypeVar("T", bound=BaseModel)


class DocumentProcessingError(Exception):
    """Custom exception for document processing errors."""

    pass


class PromptTemplate(BaseModel):
    """Template for AI prompts with placeholders."""

    template: str
    required_variables: List[str]
    instructions: str = ""
    expected_format: str = "json"

    def format(self, **kwargs) -> str:
        """Format the template with provided variables."""
        missing_vars = [var for var in self.required_variables if var not in kwargs]
        if missing_vars:
            raise ValueError(f"Missing required template variables: {missing_vars}")

        formatted_prompt = self.template.format(**kwargs)
        
        if self.instructions:
            formatted_prompt = f"{self.instructions}\n\n{formatted_prompt}"
        
        if self.expected_format == "json":
            formatted_prompt += "\n\nPlease respond with valid JSON only."
        
        return formatted_prompt


class DocumentProcessor(ABC):
    """Abstract base class for document processors."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the document processor."""
        self.config = config or {}
        self.ai_client = get_ai_client()

    @abstractmethod
    def get_prompt_template(self) -> PromptTemplate:
        """Return the prompt template for this processor."""
        pass

    @abstractmethod
    def parse_response(self, response: str) -> BaseModel:
        """Parse the AI response into a structured result."""
        pass

    def validate_input(self, **kwargs) -> Dict[str, Any]:
        """Validate and sanitize input parameters."""
        return kwargs


async def process_document(
    file_content: str,
    prompt_template: PromptTemplate,
    response_model: Type[T],
    processor_config: Optional[Dict[str, Any]] = None,
    **template_variables
) -> T:
    """
    Generic document processing function that encapsulates shared steps:
    1. Format prompt with template variables
    2. Call AI service
    3. Parse JSON response
    4. Return structured result

    Args:
        file_content: The text content to process
        prompt_template: Template for generating the AI prompt
        response_model: Pydantic model class for parsing the response
        processor_config: Configuration for the AI client
        **template_variables: Variables to inject into the prompt template

    Returns:
        Structured result as specified by response_model

    Raises:
        DocumentProcessingError: If processing fails
        AIError: If AI service call fails
    """
    if not file_content or not isinstance(file_content, str):
        raise DocumentProcessingError("File content must be a non-empty string")

    if len(file_content.strip()) < 10:
        raise DocumentProcessingError("File content is too short for meaningful processing")

    try:
        # Step 1: Format the prompt
        template_variables["content"] = file_content
        formatted_prompt = prompt_template.format(**template_variables)

        # Step 2: Call AI service
        config = processor_config or {}
        ai_response = await _make_ai_request(
            prompt=formatted_prompt,
            model=config.get("model", settings.ai_model),
            max_tokens=config.get("max_tokens", settings.ai_max_tokens),
            temperature=config.get("temperature", settings.ai_temperature),
        )

        # Step 3: Parse JSON response
        result = _parse_ai_response(ai_response, response_model)
        return result

    except Exception as e:
        logger.error(f"Document processing failed: {str(e)}", exc_info=True)
        raise DocumentProcessingError(f"Failed to process document: {str(e)}") from e


async def _make_ai_request(
    prompt: str, model: str, max_tokens: int, temperature: float
) -> str:
    """Make an AI request with proper error handling."""
    try:
        ai_client = get_ai_client()
        request = AIRequest(
            prompt=prompt,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=False,
        )

        response = await ai_client.generate(request)
        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"AI request failed: {str(e)}", exc_info=True)
        raise AIError(
            error_type=AIErrorType.API_ERROR,
            message="Failed to process AI request",
            details={"error": str(e)},
        )


def _parse_ai_response(response: str, response_model: Type[T]) -> T:
    """Parse the AI response into a structured result."""
    try:
        # Clean the response - remove any non-JSON content
        response = response.strip()
        
        # Find JSON content if wrapped in other text
        if not response.startswith('{') and '{' in response:
            start = response.find('{')
            end = response.rfind('}') + 1
            response = response[start:end]

        # Parse JSON
        data = json.loads(response)
        
        # Convert to Pydantic model
        return response_model.model_validate(data)

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response as JSON: {str(e)}")
        logger.debug(f"Response content: {response[:500]}...")
        raise AIError(
            error_type=AIErrorType.PARSE_ERROR,
            message="Failed to parse AI response as JSON",
            details={"error": str(e), "response_sample": response[:200]},
        )
    except Exception as e:
        logger.error(f"Error processing AI response: {str(e)}", exc_info=True)
        raise AIError(
            error_type=AIErrorType.PROCESSING_ERROR,
            message="Error processing AI response",
            details={"error": str(e)},
        )


class GenericDocumentProcessor(DocumentProcessor):
    """Generic document processor implementation."""

    def __init__(
        self,
        prompt_template: PromptTemplate,
        response_model: Type[BaseModel],
        config: Optional[Dict[str, Any]] = None,
    ):
        """Initialize with custom template and response model."""
        super().__init__(config)
        self._prompt_template = prompt_template
        self._response_model = response_model

    def get_prompt_template(self) -> PromptTemplate:
        """Return the prompt template."""
        return self._prompt_template

    def parse_response(self, response: str) -> BaseModel:
        """Parse the response using the configured model."""
        return _parse_ai_response(response, self._response_model)

    async def process(self, file_content: str, **template_variables) -> BaseModel:
        """Process document using the configured template and model."""
        return await process_document(
            file_content=file_content,
            prompt_template=self._prompt_template,
            response_model=self._response_model,
            processor_config=self.config,
            **template_variables
        )


# Pre-defined prompt templates for common use cases
class PromptTemplates:
    """Collection of common prompt templates."""
    
    RESUME_ANALYSIS = PromptTemplate(
        template="""
Analyze the following resume and extract structured information.

RESUME:
{content}

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
            "start_date": "Start Date",
            "end_date": "End Date",
            "current": false,
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
}}""",
        required_variables=["content"],
        instructions="You are an expert HR analyst. Analyze resumes accurately and comprehensively.",
        expected_format="json"
    )

    JOB_DESCRIPTION_ANALYSIS = PromptTemplate(
        template="""
Analyze the following job description and extract key information.

JOB DESCRIPTION:
{content}

Extract and analyze:
1. Required skills and qualifications
2. Job responsibilities and duties
3. Company information and culture
4. Salary range and benefits (if mentioned)
5. Experience level required
6. Job type (full-time, part-time, contract, etc.)

Format your response as a JSON object with the following structure:
{{
    "title": "Job Title",
    "company": "Company Name",
    "location": "Location",
    "job_type": "full-time/part-time/contract/etc",
    "experience_level": "entry/mid/senior/executive",
    "required_skills": ["skill1", "skill2", ...],
    "preferred_skills": ["skill1", "skill2", ...],
    "responsibilities": ["responsibility1", "responsibility2", ...],
    "requirements": ["requirement1", "requirement2", ...],
    "salary_range": {{"min": 0, "max": 0, "currency": "USD"}},
    "benefits": ["benefit1", "benefit2", ...],
    "company_description": "Company description",
    "summary": "Job summary"
}}""",
        required_variables=["content"],
        instructions="You are an expert recruiter. Analyze job descriptions thoroughly and accurately.",
        expected_format="json"
    )

    DOCUMENT_COMPARISON = PromptTemplate(
        template="""
Compare the following resume and job description to assess fit and compatibility.

RESUME:
{resume_content}

JOB DESCRIPTION:
{job_description}

Provide a comprehensive comparison including:
1. Skills match analysis
2. Experience relevance assessment
3. Overall compatibility score (0-100)
4. Strengths and gaps
5. Recommendations for improvement

Format your response as a JSON object with the following structure:
{{
    "match_score": 85,
    "skills_match": {{"matched": ["skill1"], "missing": ["skill2"]}},
    "experience_relevance": "High/Medium/Low",
    "strengths": ["strength1", "strength2", ...],
    "gaps": ["gap1", "gap2", ...],
    "recommendations": ["recommendation1", "recommendation2", ...],
    "summary": "Overall assessment summary"
}}""",
        required_variables=["resume_content", "job_description"],
        instructions="You are an expert career counselor. Provide accurate and helpful assessments.",
        expected_format="json"
    )


# Convenience functions for common operations
async def process_resume(resume_text: str, config: Optional[Dict[str, Any]] = None) -> Any:
    """Process a resume using the standard resume analysis template."""
    from app.ai.resume_service import ResumeAnalysisResult
    
    return await process_document(
        file_content=resume_text,
        prompt_template=PromptTemplates.RESUME_ANALYSIS,
        response_model=ResumeAnalysisResult,
        processor_config=config,
    )


async def process_job_description(
    job_text: str, config: Optional[Dict[str, Any]] = None
) -> Any:
    """Process a job description using the standard job analysis template."""
    # This would need a JobDescriptionResult model to be defined
    # For now, we'll return a generic dict
    class JobDescriptionResult(BaseModel):
        title: str = ""
        company: str = ""
        location: str = ""
        summary: str = ""
        # Add more fields as needed
    
    return await process_document(
        file_content=job_text,
        prompt_template=PromptTemplates.JOB_DESCRIPTION_ANALYSIS,
        response_model=JobDescriptionResult,
        processor_config=config,
    )


async def compare_resume_to_job(
    resume_text: str, job_description: str, config: Optional[Dict[str, Any]] = None
) -> Any:
    """Compare a resume to a job description."""
    class ComparisonResult(BaseModel):
        match_score: int = 0
        summary: str = ""
        # Add more fields as needed
    
    return await process_document(
        file_content="",  # Not used in this template
        prompt_template=PromptTemplates.DOCUMENT_COMPARISON,
        response_model=ComparisonResult,
        processor_config=config,
        resume_content=resume_text,
        job_description=job_description,
    )