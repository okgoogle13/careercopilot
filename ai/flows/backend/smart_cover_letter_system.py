"""
Smart Cover Letter Generation System using Firebase Genkit

Advanced cover letter generation with personalization, company research integration,
and multi-format output capabilities.
"""

import json
import os
from typing import Any, Dict, List, Optional, cast
from enum import Enum

from .types import ModelConfig as ModelConfigProtocol

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from ai.schemas.backend.document_models import CareerProfile

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.prompt_service import format_prompt
from app.core.ats_gate import ats_gate

try:
    import genkit
    from genkit.plugins import google_genai
except Exception:
    genkit = None  # type: ignore[assignment]
    googleai = None  # type: ignore[assignment]


def _noop_flow(*args, **kwargs):
    def _decorator(fn):
        return fn

    return _decorator


genkit_flow = getattr(genkit, "flow", _noop_flow) if genkit else _noop_flow

# Load environment variables
load_dotenv()
if genkit is not None:
    genkit_module: Any = genkit
    if getattr(genkit_module, "get_plugin", None) and not genkit_module.get_plugin("googleai"):  # type: ignore[attr-defined]
        genkit_module.init(plugins=[google_genai.init(api_key=os.getenv("GEMINI_API_KEY"))])  # type: ignore[attr-defined]

gemini_pro: ModelConfigProtocol = cast(ModelConfigProtocol, get_ai_config().get_model_config("gemini-3.0-flash"))


# Data Models
class CoverLetterStyle(str, Enum):
    PROFESSIONAL = "professional"
    CONVERSATIONAL = "conversational"
    CREATIVE = "creative"
    EXECUTIVE = "executive"
    TECHNICAL = "technical"


class CoverLetterFormat(str, Enum):
    FULL_LETTER = "full_letter"
    EMAIL_APPLICATION = "email_application"
    LINKEDIN_MESSAGE = "linkedin_message"
    NETWORKING_EMAIL = "networking_email"


class CoverLetterSection(BaseModel):
    section_name: str = Field(description="Name of the section")
    content: str = Field(description="Content of the section")
    personalization_elements: List[str] = Field(description="Personalized elements used")
    key_messages: List[str] = Field(description="Main messages conveyed")
    call_to_action: Optional[str] = Field(description="Any call to action in this section")


class CoverLetterAnalysis(BaseModel):
    readability_score: int = Field(description="Readability score (0-100)", ge=0, le=100)
    personalization_score: int = Field(description="Personalization level (0-100)", ge=0, le=100)
    compelling_score: int = Field(description="How compelling/persuasive (0-100)", ge=0, le=100)
    keyword_alignment: int = Field(description="Job keyword alignment (0-100)", ge=0, le=100)

    strengths: List[str] = Field(description="Cover letter strengths")
    improvement_areas: List[str] = Field(description="Areas for improvement")
    tone_assessment: str = Field(description="Overall tone: professional, friendly, formal, etc.")
    unique_elements: List[str] = Field(description="What makes this letter stand out")


class SmartCoverLetter(BaseModel):
    letter_content: str = Field(description="Complete cover letter content")
    subject_line: Optional[str] = Field(description="Email subject line if applicable")

    sections: List[CoverLetterSection] = Field(description="Breakdown by sections")
    analysis: CoverLetterAnalysis = Field(description="Quality analysis")

    personalization_notes: List[str] = Field(description="How the letter was personalized")
    key_selling_points: List[str] = Field(description="Main selling points highlighted")
    company_connections: List[str] = Field(description="Company-specific connections made")

    alternative_versions: Dict[str, str] = Field(description="Different style/format versions")
    follow_up_suggestions: List[str] = Field(description="Follow-up communication suggestions")


class CompanyResearchInsights(BaseModel):
    company_overview: str = Field(description="Brief company overview")
    recent_news: List[str] = Field(description="Recent company developments")
    company_values: List[str] = Field(description="Core company values and culture")
    key_initiatives: List[str] = Field(description="Major projects or initiatives")
    industry_position: str = Field(description="Company's position in industry")
    growth_indicators: List[str] = Field(description="Signs of company growth/success")
    potential_challenges: List[str] = Field(description="Challenges company may be facing")
    connection_opportunities: List[str] = Field(description="Ways to connect with company mission")


@genkit_flow(output_schema=SmartCoverLetter)
@with_ai_error_handling()
@ats_gate("full_letter", on_fail="warn")
def generate_smart_cover_letter(
    profile: CareerProfile,
    job_description: str,
    company_info: Optional[Dict] = None,
    style: str = "professional",
    format_type: str = "full_letter",
    special_instructions: Optional[str] = None,
) -> SmartCoverLetter:
    """
    Generates a highly personalized, compelling cover letter with company research integration.

    Args:
        candidate_profile: Comprehensive candidate information
        job_description: Full job posting text
        company_info: Optional company research data
        style: Cover letter style preference
        format_type: Output format (full letter, email, etc.)
        special_instructions: Any special requirements or requests

    Returns:
        SmartCoverLetter: Complete cover letter with analysis and alternatives
    """
    try:
        # Input validation
        if not all([profile, job_description]):
            raise InputValidationError("Career profile and job description are required")

        # Sanitize inputs
        profile_dict = profile.model_dump(exclude={"job_context", "selection_criteria"})
        sanitized_profile = InputSanitizer.sanitize_dict_input(profile_dict)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        sanitized_company = InputSanitizer.sanitize_dict_input(company_info) if company_info else {}
        sanitized_instructions = (
            InputSanitizer.sanitize_text_input(special_instructions)
            if special_instructions
            else None
        )

        prompt = format_prompt(
            "cover_letter_smart_generate",
            candidate_profile=json.dumps(sanitized_profile, separators=(',', ':')),
            job_description=sanitized_job.sanitized_content,
            company_information=(
                json.dumps(sanitized_company, separators=(',', ':'))
                if sanitized_company
                else "Limited company information available"
            ),
            style=style,
            format_type=format_type,
            special_instructions=(
                sanitized_instructions.sanitized_content if sanitized_instructions else "None"
            ),
        )

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.4,
                "max_output_tokens": 3500,
            },
            output_schema=SmartCoverLetter,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Smart cover letter generation failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow(output_schema=CompanyResearchInsights)
@with_ai_error_handling()
def research_company_for_application(
    company_name: str,
    industry: str,
    job_role: str,
    additional_context: Optional[str] = None,
) -> CompanyResearchInsights:
    """
    Generates company research insights to inform personalized cover letters.

    Args:
        company_name: Name of target company
        industry: Company's industry sector
        job_role: Specific role being applied for
        additional_context: Any additional context about the company

    Returns:
        CompanyResearchInsights: Comprehensive company research for personalization
    """
    try:
        sanitized_company = InputSanitizer.sanitize_text_input(company_name)
        sanitized_industry = InputSanitizer.sanitize_text_input(industry)
        sanitized_role = InputSanitizer.sanitize_text_input(job_role)
        sanitized_context = (
            InputSanitizer.sanitize_text_input(additional_context) if additional_context else None
        )

        prompt = format_prompt(
            "cover_letter_company_research",
            company_name=sanitized_company.sanitized_content,
            industry=sanitized_industry.sanitized_content,
            job_role=sanitized_role.sanitized_content,
            additional_context=sanitized_context.sanitized_content if sanitized_context else "None provided",
        )

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },
            output_schema=CompanyResearchInsights,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Company research failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class CoverLetterOptimizationResult(BaseModel):
    original_score: int = Field(description="Original cover letter score", ge=0, le=100)
    optimized_score: int = Field(description="Optimized score", ge=0, le=100)
    improvement_percentage: float = Field(description="Percentage improvement")

    optimized_content: str = Field(description="Optimized cover letter content")
    changes_made: List[str] = Field(description="Specific changes and improvements")
    optimization_rationale: List[str] = Field(description="Why changes were made")

    before_after_comparison: Dict[str, Dict[str, str]] = Field(
        description="Side-by-side comparison"
    )
    success_probability: int = Field(description="Estimated success probability", ge=0, le=100)


@genkit_flow(output_schema=CoverLetterOptimizationResult)
@with_ai_error_handling()
def optimize_existing_cover_letter(
    existing_cover_letter: str,
    job_description: str,
    profile: CareerProfile,
    company_insights: Optional[Dict] = None,
) -> CoverLetterOptimizationResult:
    """
    Optimizes an existing cover letter for better impact and job alignment.

    Args:
        existing_cover_letter: Current cover letter content
        job_description: Target job posting
        candidate_profile: Candidate information
        company_insights: Optional company research data

    Returns:
        CoverLetterOptimizationResult: Optimized version with improvement analysis
    """
    try:
        sanitized_letter = InputSanitizer.sanitize_text_input(existing_cover_letter)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        profile_dict = profile.model_dump(exclude={"job_context", "selection_criteria"})
        sanitized_profile = InputSanitizer.sanitize_dict_input(profile_dict)
        sanitized_insights = (
            InputSanitizer.sanitize_dict_input(company_insights) if company_insights else {}
        )

        prompt = format_prompt(
            "cover_letter_optimize",
            existing_cover_letter=sanitized_letter.sanitized_content,
            job_description=sanitized_job.sanitized_content,
            candidate_profile=json.dumps(sanitized_profile, separators=(',', ':')),
            company_insights=(
                json.dumps(sanitized_insights, separators=(',', ':'))
                if sanitized_insights
                else "No additional company insights available"
            ),
        )

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
                "max_output_tokens": 3000,
            },
            output_schema=CoverLetterOptimizationResult,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Cover letter optimization failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class MultiFormatCoverLetterSuite(BaseModel):
    full_cover_letter: str = Field(description="Traditional full-length cover letter")
    email_version: str = Field(description="Email application version")
    linkedin_message: str = Field(description="LinkedIn connection message")
    networking_email: str = Field(description="Networking/informational interview email")
    follow_up_templates: Dict[str, str] = Field(description="Follow-up email templates")

    format_guidelines: Dict[str, str] = Field(description="Usage guidelines for each format")
    personalization_tips: List[str] = Field(description="How to further personalize each version")
    timing_recommendations: Dict[str, str] = Field(description="When to use each format")


@genkit_flow(output_schema=MultiFormatCoverLetterSuite)
@with_ai_error_handling()
@ats_gate("full_letter", on_fail="warn")
def create_multi_format_cover_letter_suite(
    profile: CareerProfile,
    job_description: str,
    company_insights: Optional[Dict] = None,
) -> MultiFormatCoverLetterSuite:
    """
    Creates a complete suite of application materials in different formats.

    Args:
        candidate_profile: Comprehensive candidate information
        job_description: Target job posting
        company_insights: Optional company research data

    Returns:
        MultiFormatCoverLetterSuite: Complete suite of application formats
    """
    try:
        profile_dict = profile.model_dump(exclude={"job_context", "selection_criteria"})
        sanitized_profile = InputSanitizer.sanitize_dict_input(profile_dict)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        sanitized_insights = (
            InputSanitizer.sanitize_dict_input(company_insights) if company_insights else {}
        )

        prompt = format_prompt(
            "cover_letter_multi_format",
            candidate_profile=json.dumps(sanitized_profile, separators=(',', ':')),
            job_description=sanitized_job.sanitized_content,
            company_insights=(
                json.dumps(sanitized_insights, separators=(',', ':'))
                if sanitized_insights
                else "Limited company information available"
            ),
        )

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.4,
                "max_output_tokens": 4000,
            },
            output_schema=MultiFormatCoverLetterSuite,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Multi-format cover letter suite creation failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Export main functions
__all__ = [
    "generate_smart_cover_letter",
    "research_company_for_application",
    "optimize_existing_cover_letter",
    "create_multi_format_cover_letter_suite",
    "SmartCoverLetter",
    "CompanyResearchInsights",
    "CoverLetterOptimizationResult",
    "MultiFormatCoverLetterSuite",
    "CoverLetterStyle",
    "CoverLetterFormat",
]
