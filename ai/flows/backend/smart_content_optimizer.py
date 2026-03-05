"""
Smart Content Optimization System using Firebase Genkit

Provides advanced content optimization for resumes, cover letters, and LinkedIn profiles
with AI-powered suggestions and ATS optimization.
"""

import json
import os
from enum import Enum
from typing import Any, Dict, List, Optional, cast

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError
from .types import ModelConfig as ModelConfigProtocol

try:
    import genkit
    from genkit.plugins import google_genai
except Exception:
    genkit = None  # type: ignore[assignment]
    google_genai = None  # type: ignore[assignment]


def _noop_flow(*args, **kwargs):
    def _decorator(fn):
        return fn

    return _decorator


genkit_flow = getattr(genkit, "flow", _noop_flow)

# Load environment variables
load_dotenv()
if genkit is not None:
    genkit_module: Any = genkit
    if getattr(genkit_module, "get_plugin", None) and not genkit_module.get_plugin("googleai"):  # type: ignore[attr-defined]
        genkit_module.init(plugins=[google_genai.init(api_key=os.getenv("GEMINI_API_KEY"))])  # type: ignore[attr-defined]

gemini_pro: ModelConfigProtocol = cast(ModelConfigProtocol, get_ai_config().get_model_config("gemini-3.0-flash"))


# Enums and Models
class ContentType(str, Enum):
    RESUME = "resume"
    COVER_LETTER = "cover_letter"
    LINKEDIN_PROFILE = "linkedin_profile"
    LINKEDIN_HEADLINE = "linkedin_headline"
    EMAIL_TEMPLATE = "email_template"


class OptimizationGoal(str, Enum):
    ATS_OPTIMIZATION = "ats_optimization"
    HUMAN_READABILITY = "human_readability"
    KEYWORD_DENSITY = "keyword_density"
    IMPACT_MAXIMIZATION = "impact_maximization"
    PERSONAL_BRANDING = "personal_branding"


class OptimizationSuggestion(BaseModel):
    type: str = Field(description="Type of suggestion: word_choice, structure, keyword, format")
    priority: str = Field(description="high, medium, low priority")
    original_text: str = Field(description="Original text segment")
    suggested_text: str = Field(description="Optimized text suggestion")
    reasoning: str = Field(description="Why this change improves the content")
    impact_score: int = Field(description="Expected impact (1-10)", ge=1, le=10)
    location: str = Field(
        description="Where in document: header, summary, experience, skills, etc."
    )


class ATSAnalysis(BaseModel):
    ats_score: int = Field(description="ATS compatibility score (0-100)", ge=0, le=100)
    keyword_density: float = Field(description="Keyword density percentage", ge=0, le=100)
    readability_score: int = Field(description="Human readability score (0-100)", ge=0, le=100)
    formatting_issues: List[str] = Field(description="ATS formatting problems")
    missing_keywords: List[str] = Field(description="Important keywords missing")
    keyword_placement_suggestions: List[str] = Field(description="Where to place key terms")
    section_recommendations: List[str] = Field(description="Section structure improvements")


class ContentOptimizationResult(BaseModel):
    original_score: int = Field(description="Original content quality score (0-100)", ge=0, le=100)
    optimized_score: int = Field(
        description="Expected score after optimization (0-100)", ge=0, le=100
    )
    improvement_percentage: float = Field(description="Percentage improvement", ge=0)

    suggestions: List[OptimizationSuggestion] = Field(
        description="Detailed optimization suggestions"
    )
    ats_analysis: ATSAnalysis = Field(description="ATS compatibility analysis")

    optimized_content: str = Field(description="Fully optimized version of content")
    key_improvements: List[str] = Field(description="Summary of major improvements made")

    next_steps: List[str] = Field(description="Additional steps to further improve content")
    success_metrics: List[str] = Field(description="How to measure success of changes")


class PersonalBrandingAnalysis(BaseModel):
    current_brand_strength: int = Field(description="Current brand clarity (0-100)", ge=0, le=100)
    brand_consistency: int = Field(description="Consistency across content (0-100)", ge=0, le=100)
    unique_value_proposition: str = Field(description="Identified unique value proposition")
    brand_keywords: List[str] = Field(description="Key terms that define the personal brand")
    messaging_gaps: List[str] = Field(description="Areas where messaging could be stronger")
    brand_positioning: str = Field(description="How candidate should position themselves")
    storytelling_opportunities: List[str] = Field(description="Places to add compelling narratives")


@genkit_flow(output_schema=ContentOptimizationResult)
@with_ai_error_handling()
def optimize_content_for_job(
    content: str, job_description: str, content_type: str, optimization_goals: List[str]
) -> ContentOptimizationResult:
    """
    Optimizes content (resume, cover letter, etc.) for a specific job opportunity.

    Args:
        content: Original content text
        job_description: Target job posting
        content_type: Type of content being optimized
        optimization_goals: List of optimization objectives

    Returns:
        ContentOptimizationResult: Comprehensive optimization analysis and suggestions
    """
    try:
        # Input validation
        if not all([content, job_description, content_type]):
            raise InputValidationError("Content, job description, and content type are required")

        # Sanitize inputs
        sanitized_content = InputSanitizer.sanitize_text_input(content)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)

        prompt = f"""
As an expert content strategist and ATS optimization specialist, analyze and optimize this content
for the specific job opportunity. Provide comprehensive suggestions for improvement.

CONTENT TYPE: {content_type}
OPTIMIZATION GOALS: {', '.join(optimization_goals)}

ORIGINAL CONTENT:
{sanitized_content.sanitized_content}

TARGET JOB DESCRIPTION:
{sanitized_job.sanitized_content}

OPTIMIZATION REQUIREMENTS:
1. Analyze current content quality and ATS compatibility
2. Extract key requirements and keywords from job description
3. Identify gaps between content and job requirements
4. Provide specific, actionable optimization suggestions
5. Score expected improvement from changes
6. Create optimized version of the content
7. Analyze ATS compatibility issues and solutions
8. Suggest keyword placement and density improvements
9. Recommend structural and formatting changes
10. Provide success metrics for measuring improvement

SCORING CRITERIA:
- Consider keyword relevance and placement
- Evaluate quantifiable achievements and impact statements
- Assess ATS parsing compatibility
- Review content flow and readability
- Analyze alignment with job requirements
- Check for power words and action verbs

For each suggestion, provide:
- Specific text changes with before/after
- Clear reasoning for the improvement
- Expected impact score (1-10)
- Priority level (high/medium/low)

Return optimized content that maintains authentic voice while maximizing job match.
Respond with valid JSON matching the ContentOptimizationResult schema.
"""

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
                "max_output_tokens": 4000,
            },
            output_schema=ContentOptimizationResult,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Content optimization failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow(output_schema=PersonalBrandingAnalysis)
@with_ai_error_handling()
def analyze_personal_branding(
    resume: str,
    linkedin_profile: Optional[str] = None,
    career_goals: Optional[str] = None,
) -> PersonalBrandingAnalysis:
    """
    Analyzes personal branding consistency and strength across career materials.

    Args:
        resume: Resume content
        linkedin_profile: LinkedIn profile content (optional)
        career_goals: Career objectives and goals (optional)

    Returns:
        PersonalBrandingAnalysis: Comprehensive personal branding analysis
    """
    try:
        # Input validation
        if not resume:
            raise InputValidationError("Resume content is required")

        sanitized_resume = InputSanitizer.sanitize_text_input(resume)
        sanitized_linkedin = (
            InputSanitizer.sanitize_text_input(linkedin_profile) if linkedin_profile else None
        )
        sanitized_goals = InputSanitizer.sanitize_text_input(career_goals) if career_goals else None

        content_sections = {
            "resume": sanitized_resume.sanitized_content,
            "linkedin": (sanitized_linkedin.sanitized_content if sanitized_linkedin else None),
            "career_goals": (sanitized_goals.sanitized_content if sanitized_goals else None),
        }

        prompt = f"""
As a personal branding strategist and career coach, analyze the consistency and strength
of this candidate's personal brand across their career materials.

CONTENT TO ANALYZE:
{json.dumps(content_sections, separators=(",", ":"))}

PERSONAL BRANDING ANALYSIS:
1. Assess current brand strength and clarity
2. Evaluate consistency of messaging across materials
3. Identify unique value proposition and differentiators
4. Extract key brand keywords and themes
5. Identify messaging gaps and opportunities
6. Recommend brand positioning strategy
7. Suggest storytelling opportunities
8. Provide specific improvements for brand coherence

EVALUATION CRITERIA:
- Message consistency across platforms
- Clarity of unique value proposition
- Strength of professional narrative
- Keyword alignment and repetition
- Compelling storytelling elements
- Professional differentiation
- Career progression logic
- Authentic voice and personality

Provide actionable recommendations for strengthening personal brand impact.
Respond with valid JSON matching the PersonalBrandingAnalysis schema.
"""

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },
            output_schema=PersonalBrandingAnalysis,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Personal branding analysis failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class LinkedInOptimizationResult(BaseModel):
    headline_suggestions: List[str] = Field(description="Optimized headline options")
    summary_optimization: str = Field(description="Optimized about/summary section")
    skills_recommendations: List[str] = Field(description="Skills to highlight or add")
    experience_improvements: List[str] = Field(description="How to improve experience descriptions")
    keyword_strategy: List[str] = Field(description="Keywords to incorporate naturally")
    engagement_tips: List[str] = Field(description="Tips for increasing profile engagement")
    network_building_strategy: List[str] = Field(description="Networking and connection strategies")
    content_posting_ideas: List[str] = Field(description="Ideas for LinkedIn posts and articles")


@genkit_flow(output_schema=LinkedInOptimizationResult)
@with_ai_error_handling()
def optimize_linkedin_profile(
    current_profile: str,
    target_roles: List[str],
    industry_focus: str,
    career_stage: str,
) -> LinkedInOptimizationResult:
    """
    Optimizes LinkedIn profile for maximum visibility and engagement.

    Args:
        current_profile: Current LinkedIn profile content
        target_roles: List of target job roles
        industry_focus: Target industry or field
        career_stage: early_career, mid_career, senior_level, executive

    Returns:
        LinkedInOptimizationResult: Comprehensive LinkedIn optimization recommendations
    """
    try:
        # Input validation
        if not all([current_profile, target_roles, industry_focus, career_stage]):
            raise InputValidationError("All parameters are required for LinkedIn optimization")

        sanitized_profile = InputSanitizer.sanitize_text_input(current_profile)

        prompt = f"""
As a LinkedIn optimization expert and social media strategist, provide comprehensive
recommendations to maximize this LinkedIn profile's effectiveness.

CURRENT PROFILE:
{sanitized_profile.sanitized_content}

TARGET ROLES: {', '.join(target_roles)}
INDUSTRY FOCUS: {industry_focus}
CAREER STAGE: {career_stage}

LINKEDIN OPTIMIZATION STRATEGY:
1. Create compelling headline options that attract recruiters
2. Optimize the About/Summary section for keyword visibility
3. Recommend skills to highlight and add
4. Improve experience section descriptions for impact
5. Develop keyword strategy for LinkedIn algorithm
6. Provide engagement and networking tips
7. Suggest content strategy for thought leadership
8. Recommend profile optimization techniques

LINKEDIN ALGORITHM CONSIDERATIONS:
- Keyword placement for search optimization
- Skills section optimization for recruiter searches
- Activity and engagement factors
- Network quality and connection strategies
- Content posting for visibility
- Profile completeness factors

Focus on making the profile discoverable by recruiters while building authentic
professional relationships and demonstrating industry expertise.

Respond with valid JSON matching the LinkedInOptimizationResult schema.
"""

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.4,
            },
            output_schema=LinkedInOptimizationResult,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"LinkedIn optimization failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class MultiChannelOptimizationResult(BaseModel):
    resume_optimized: str = Field(description="Optimized resume content")
    cover_letter_template: str = Field(description="Customizable cover letter template")
    linkedin_summary: str = Field(description="Optimized LinkedIn summary")
    elevator_pitch: str = Field(description="30-second elevator pitch")
    interview_talking_points: List[str] = Field(description="Key points for interviews")
    email_templates: Dict[str, str] = Field(description="Professional email templates")
    consistency_score: int = Field(description="Cross-platform consistency (0-100)", ge=0, le=100)
    unified_messaging: List[str] = Field(description="Core messages to use everywhere")


@genkit_flow(output_schema=MultiChannelOptimizationResult)
@with_ai_error_handling()
def optimize_multi_channel_presence(
    resume: str, target_role: str, unique_value_props: List[str], career_narrative: str
) -> MultiChannelOptimizationResult:
    """
    Creates consistent, optimized content across all career marketing channels.

    Args:
        resume: Current resume content
        target_role: Primary target role
        unique_value_props: Key differentiators and strengths
        career_narrative: Overall career story and goals

    Returns:
        MultiChannelOptimizationResult: Optimized content for all channels
    """
    try:
        sanitized_resume = InputSanitizer.sanitize_text_input(resume)
        sanitized_role = InputSanitizer.sanitize_text_input(target_role)
        sanitized_narrative = InputSanitizer.sanitize_text_input(career_narrative)

        prompt = f"""
As a comprehensive career marketing strategist, create consistent, optimized content
across all professional channels while maintaining authentic personal branding.

CURRENT RESUME:
{sanitized_resume.sanitized_content}

TARGET ROLE: {sanitized_role.sanitized_content}
UNIQUE VALUE PROPOSITIONS: {', '.join(unique_value_props)}
CAREER NARRATIVE: {sanitized_narrative.sanitized_content}

MULTI-CHANNEL OPTIMIZATION:
1. Optimize resume for ATS and human readers
2. Create adaptable cover letter template with placeholders
3. Develop LinkedIn summary aligned with resume
4. Craft compelling 30-second elevator pitch
5. Prepare interview talking points and stories
6. Create professional email templates for networking
7. Ensure consistent messaging across all platforms
8. Develop unified core messages for all communications

CONSISTENCY REQUIREMENTS:
- Same key skills and strengths highlighted everywhere
- Consistent career narrative and progression story
- Aligned value propositions across platforms
- Coordinated keyword strategy
- Uniform professional tone and voice
- Complementary but platform-specific content

Create content that reinforces the same professional brand story while optimizing
for each channel's specific requirements and audience expectations.

Respond with valid JSON matching the MultiChannelOptimizationResult schema.
"""

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
                "max_output_tokens": 4000,
            },
            output_schema=MultiChannelOptimizationResult,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Multi-channel optimization failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Export main functions
__all__ = [
    "optimize_content_for_job",
    "analyze_personal_branding",
    "optimize_linkedin_profile",
    "optimize_multi_channel_presence",
    "ContentOptimizationResult",
    "PersonalBrandingAnalysis",
    "LinkedInOptimizationResult",
    "MultiChannelOptimizationResult",
    "ContentType",
    "OptimizationGoal",
]
