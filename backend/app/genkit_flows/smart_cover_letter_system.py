"""
Smart Cover Letter Generation System using Firebase Genkit

Advanced cover letter generation with personalization, company research integration,
and multi-format output capabilities.
"""

import json
from enum import Enum

from pydantic import BaseModel, Field

from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.genkit_init import genkit_flow, get_model
from app.core.input_validation import InputSanitizer, InputValidationError


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
    personalization_elements: list[str] = Field(description="Personalized elements used")
    key_messages: list[str] = Field(description="Main messages conveyed")
    call_to_action: str | None = Field(description="Any call to action in this section")


class CoverLetterAnalysis(BaseModel):
    readability_score: int = Field(description="Readability score (0-100)", ge=0, le=100)
    personalization_score: int = Field(description="Personalization level (0-100)", ge=0, le=100)
    compelling_score: int = Field(description="How compelling/persuasive (0-100)", ge=0, le=100)
    keyword_alignment: int = Field(description="Job keyword alignment (0-100)", ge=0, le=100)

    strengths: list[str] = Field(description="Cover letter strengths")
    improvement_areas: list[str] = Field(description="Areas for improvement")
    tone_assessment: str = Field(description="Overall tone: professional, friendly, formal, etc.")
    unique_elements: list[str] = Field(description="What makes this letter stand out")


class SmartCoverLetter(BaseModel):
    letter_content: str = Field(description="Complete cover letter content")
    subject_line: str | None = Field(description="Email subject line if applicable")

    sections: list[CoverLetterSection] = Field(description="Breakdown by sections")
    analysis: CoverLetterAnalysis = Field(description="Quality analysis")

    personalization_notes: list[str] = Field(description="How the letter was personalized")
    key_selling_points: list[str] = Field(description="Main selling points highlighted")
    company_connections: list[str] = Field(description="Company-specific connections made")

    alternative_versions: dict[str, str] = Field(description="Different style/format versions")
    follow_up_suggestions: list[str] = Field(description="Follow-up communication suggestions")


class CompanyResearchInsights(BaseModel):
    company_overview: str = Field(description="Brief company overview")
    recent_news: list[str] = Field(description="Recent company developments")
    company_values: list[str] = Field(description="Core company values and culture")
    key_initiatives: list[str] = Field(description="Major projects or initiatives")
    industry_position: str = Field(description="Company's position in industry")
    growth_indicators: list[str] = Field(description="Signs of company growth/success")
    potential_challenges: list[str] = Field(description="Challenges company may be facing")
    connection_opportunities: list[str] = Field(description="Ways to connect with company mission")


@genkit_flow(output_schema=SmartCoverLetter)
@with_ai_error_handling()
def generate_smart_cover_letter(
    candidate_profile: dict,
    job_description: str,
    company_info: dict | None = None,
    style: str = "professional",
    format_type: str = "full_letter",
    special_instructions: str | None = None,
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
        if not all([candidate_profile, job_description]):
            raise InputValidationError("Candidate profile and job description are required")

        # Sanitize inputs
        sanitized_profile = InputSanitizer.sanitize_dict_input(candidate_profile)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        sanitized_company = InputSanitizer.sanitize_dict_input(company_info) if company_info else {}
        sanitized_instructions = (
            InputSanitizer.sanitize_text_input(special_instructions)
            if special_instructions
            else None
        )

        prompt = f"""
As an expert cover letter strategist and career coach, create a highly personalized,
compelling cover letter that demonstrates deep understanding of the role and company.

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(',', ':'))}

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

COMPANY INFORMATION:
{json.dumps(sanitized_company, separators=(',', ':')) if sanitized_company else "Limited company information available"}

STYLE: {style}
FORMAT: {format_type}
SPECIAL INSTRUCTIONS: {sanitized_instructions.sanitized_content if sanitized_instructions else "None"}

COVER LETTER GENERATION REQUIREMENTS:

1. STRATEGIC POSITIONING:
   - Lead with strongest, most relevant qualifications
   - Connect candidate's experience directly to job requirements
   - Highlight unique value proposition and differentiators
   - Demonstrate understanding of company needs and challenges

2. PERSONALIZATION ELEMENTS:
   - Reference specific job requirements and how candidate meets them
   - Connect to company values, mission, or recent developments
   - Use industry-relevant language and terminology
   - Include specific examples and quantifiable achievements

3. COMPELLING NARRATIVE:
   - Create logical flow from opening to closing
   - Tell candidate's professional story in context of this opportunity
   - Balance confidence with genuine interest
   - Include strong call to action

4. STYLE ADAPTATION:
   - {style} tone throughout
   - Appropriate level of formality for company culture
   - Industry-appropriate language and concepts
   - Length appropriate for {format_type}

5. QUALITY ASSURANCE:
   - High readability and flow
   - Error-free grammar and spelling
   - Professional formatting
   - Strong opening and closing

6. MULTI-VERSION OUTPUT:
   - Primary version in requested style
   - Alternative versions (brief/extended, different tones)
   - Section-by-section breakdown
   - Personalization and improvement notes

Create a cover letter that makes the candidate impossible to ignore while
maintaining authenticity and professional standards.

Respond with valid JSON matching the SmartCoverLetter schema.
"""

        model = get_model()
        if model is None:
            raise RuntimeError("Genkit model not available")

        response = model.generate(
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
            message=f"Smart cover letter generation failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow(output_schema=CompanyResearchInsights)
@with_ai_error_handling()
def research_company_for_application(
    company_name: str,
    industry: str,
    job_role: str,
    additional_context: str | None = None,
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

        prompt = f"""
As a company research specialist, provide comprehensive insights about this company
to inform a personalized job application strategy.

COMPANY: {sanitized_company.sanitized_content}
INDUSTRY: {sanitized_industry.sanitized_content}
TARGET ROLE: {sanitized_role.sanitized_content}
ADDITIONAL CONTEXT: {sanitized_context.sanitized_content if sanitized_context else "None provided"}

RESEARCH ANALYSIS REQUIRED:

1. COMPANY OVERVIEW:
   - Brief company history and background
   - Core business model and offerings
   - Company size and market presence
   - Organizational structure and culture

2. RECENT DEVELOPMENTS:
   - Recent news, announcements, or press releases
   - Product launches or service expansions
   - Leadership changes or strategic shifts
   - Awards, recognition, or achievements

3. COMPANY CULTURE & VALUES:
   - Core values and mission statement
   - Cultural characteristics and work environment
   - Employee value propositions
   - Diversity and inclusion commitments

4. BUSINESS INITIATIVES:
   - Major ongoing projects or initiatives
   - Digital transformation efforts
   - Sustainability or social responsibility programs
   - Innovation and R&D focus areas

5. MARKET POSITION:
   - Industry standing and competitive position
   - Market share and growth trajectory
   - Key competitors and differentiators
   - Industry trends affecting the company

6. GROWTH & OPPORTUNITIES:
   - Signs of company growth and expansion
   - New market entries or acquisitions
   - Investment in talent and capabilities
   - Future growth opportunities and challenges

7. APPLICATION STRATEGY INSIGHTS:
   - How to connect personal experience to company needs
   - Value propositions that would resonate
   - Cultural fit elements to emphasize
   - Specific ways to demonstrate interest and knowledge

Focus on insights that can be used to create highly personalized, informed
job applications that demonstrate genuine interest and understanding.

Respond with valid JSON matching the CompanyResearchInsights schema.
"""

        model = get_model()
        if model is None:
            raise RuntimeError("Genkit model not available")

        response = model.generate(
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
            message=f"Company research failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class CoverLetterOptimizationResult(BaseModel):
    original_score: int = Field(description="Original cover letter score", ge=0, le=100)
    optimized_score: int = Field(description="Optimized score", ge=0, le=100)
    improvement_percentage: float = Field(description="Percentage improvement")

    optimized_content: str = Field(description="Optimized cover letter content")
    changes_made: list[str] = Field(description="Specific changes and improvements")
    optimization_rationale: list[str] = Field(description="Why changes were made")

    before_after_comparison: dict[str, dict[str, str]] = Field(
        description="Side-by-side comparison"
    )
    success_probability: int = Field(description="Estimated success probability", ge=0, le=100)


@genkit_flow(output_schema=CoverLetterOptimizationResult)
@with_ai_error_handling()
def optimize_existing_cover_letter(
    existing_cover_letter: str,
    job_description: str,
    candidate_profile: dict,
    company_insights: dict | None = None,
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
        sanitized_profile = InputSanitizer.sanitize_dict_input(candidate_profile)
        sanitized_insights = (
            InputSanitizer.sanitize_dict_input(company_insights) if company_insights else {}
        )

        prompt = f"""
As a cover letter optimization expert, analyze this existing cover letter
and create an improved version with enhanced impact and job alignment.

EXISTING COVER LETTER:
{sanitized_letter.sanitized_content}

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(',', ':'))}

COMPANY INSIGHTS:
{json.dumps(sanitized_insights, separators=(',', ':')) if sanitized_insights else "No additional company insights available"}

OPTIMIZATION ANALYSIS:

1. CURRENT ASSESSMENT:
   - Score current cover letter quality (0-100)
   - Identify strengths to preserve
   - Identify weaknesses and gaps
   - Assess job alignment and personalization

2. OPTIMIZATION STRATEGY:
   - Strengthen opening paragraph impact
   - Improve job requirement alignment
   - Enhance personalization elements
   - Optimize achievement presentation
   - Strengthen closing and call to action

3. CONTENT IMPROVEMENTS:
   - Add missing key qualifications
   - Incorporate stronger action verbs
   - Include quantifiable achievements
   - Improve flow and readability
   - Add company-specific connections

4. QUALITY ENHANCEMENT:
   - Eliminate weak or generic language
   - Strengthen value proposition
   - Improve professional tone
   - Optimize length and structure
   - Ensure error-free presentation

5. STRATEGIC POSITIONING:
   - Better highlight unique differentiators
   - Improve candidate-role fit demonstration
   - Enhance storytelling elements
   - Strengthen competitive positioning

Provide specific before/after comparisons and clear rationale for all changes.
The optimized version should significantly outperform the original.

Respond with valid JSON matching the CoverLetterOptimizationResult schema.
"""

        model = get_model()
        if model is None:
            raise RuntimeError("Genkit model not available")

        response = model.generate(
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
            message=f"Cover letter optimization failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class MultiFormatCoverLetterSuite(BaseModel):
    full_cover_letter: str = Field(description="Traditional full-length cover letter")
    email_version: str = Field(description="Email application version")
    linkedin_message: str = Field(description="LinkedIn connection message")
    networking_email: str = Field(description="Networking/informational interview email")
    follow_up_templates: dict[str, str] = Field(description="Follow-up email templates")

    format_guidelines: dict[str, str] = Field(description="Usage guidelines for each format")
    personalization_tips: list[str] = Field(description="How to further personalize each version")
    timing_recommendations: dict[str, str] = Field(description="When to use each format")


@genkit_flow(output_schema=MultiFormatCoverLetterSuite)
@with_ai_error_handling()
def create_multi_format_cover_letter_suite(
    candidate_profile: dict,
    job_description: str,
    company_insights: dict | None = None,
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
        sanitized_profile = InputSanitizer.sanitize_dict_input(candidate_profile)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        sanitized_insights = (
            InputSanitizer.sanitize_dict_input(company_insights) if company_insights else {}
        )

        prompt = f"""
As a comprehensive application strategy specialist, create a complete suite
of personalized application materials in multiple formats for this opportunity.

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(',', ':'))}

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

COMPANY INSIGHTS:
{json.dumps(sanitized_insights, separators=(',', ':')) if sanitized_insights else "Limited company information available"}

MULTI-FORMAT SUITE REQUIREMENTS:

1. FULL COVER LETTER (Traditional):
   - Complete formal cover letter (3-4 paragraphs)
   - Professional tone and structure
   - Comprehensive qualification presentation
   - Strong opening and closing

2. EMAIL APPLICATION VERSION:
   - Concise email format (2-3 short paragraphs)
   - Professional email tone
   - Clear subject line included
   - Brief but compelling content

3. LINKEDIN MESSAGE:
   - Brief connection message (under 300 characters)
   - Professional but personable tone
   - Immediate value proposition
   - Clear call to action

4. NETWORKING EMAIL:
   - Informational interview request format
   - Relationship-building focus
   - Value-first approach
   - Professional networking tone

5. FOLLOW-UP TEMPLATES:
   - Thank you after application
   - Follow-up after no response
   - Interview thank you
   - Post-interview follow-up

6. USAGE GUIDELINES:
   - When to use each format
   - Customization tips for different scenarios
   - Timing recommendations
   - Personalization strategies

Maintain consistent messaging and value proposition across all formats
while optimizing each for its specific use case and communication channel.

Respond with valid JSON matching the MultiFormatCoverLetterSuite schema.
"""

        model = get_model()
        if model is None:
            raise RuntimeError("Genkit model not available")

        response = model.generate(
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
            message=f"Multi-format cover letter suite creation failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Export main functions
__all__ = [
    "CompanyResearchInsights",
    "CoverLetterFormat",
    "CoverLetterOptimizationResult",
    "CoverLetterStyle",
    "MultiFormatCoverLetterSuite",
    "SmartCoverLetter",
    "create_multi_format_cover_letter_suite",
    "generate_smart_cover_letter",
    "optimize_existing_cover_letter",
    "research_company_for_application",
]
