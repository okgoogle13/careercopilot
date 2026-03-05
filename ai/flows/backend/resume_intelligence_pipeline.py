"""
Advanced Resume Intelligence Pipeline using Firebase Genkit

Comprehensive resume analysis system that provides deep insights, scoring,
and optimization recommendations using AI-powered analysis.
"""

from __future__ import annotations

import asyncio
import json
import os
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Type, TypeVar, cast
from typing_extensions import ParamSpec

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.prompt_service import format_prompt

# Type variables
P = ParamSpec('P')
R = TypeVar('R')

# Protocol for model configuration
class ModelConfigProtocol:
    """Protocol for model configuration."""

    def generate(self, prompt: str, **kwargs: Any) -> Any:
        ...


# Type for genkit flow
def _noop_flow(*args: Any, **kwargs: Any) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """No-op flow decorator for when genkit is not available."""
    def _decorator(fn: Callable[P, R]) -> Callable[P, R]:
        return fn
    return _decorator




# Type stubs for genkit if not available
try:
    import genkit
    from genkit import ai
    from genkit.plugins import google_genai
    GENKIT_AVAILABLE = True
except ImportError:
    GENKIT_AVAILABLE = False
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Genkit available: {GENKIT_AVAILABLE}")
    genkit = None  # type: ignore[assignment]
    ai = None  # type: ignore[assignment]
    google_genai = None  # type: ignore[assignment]

# Initialize genkit flow decorator
genkit_flow: Any = getattr(genkit, "flow", _noop_flow) if GENKIT_AVAILABLE else _noop_flow

# Load environment variables
load_dotenv()

# Initialize genkit using centralized initialization
from app.core.genkit_init import init_genkit
init_genkit()


# Get model configuration (lazy loading - only when needed)
# This allows the backend to start even if AI config isn't fully set up
_gemini_model_cache: Optional[ModelConfigProtocol] = None

def get_gemini_model() -> ModelConfigProtocol:
    """Get Gemini model configuration, loading it only when needed."""
    global _gemini_model_cache
    if _gemini_model_cache is None:
        try:
            model_config = get_ai_config().get_model_config("gemini-3.0-flash")
            if model_config is None:
                raise RuntimeError("Failed to load model configuration: gemini-3.0-flash not found")
            _gemini_model_cache = cast(ModelConfigProtocol, model_config)
        except Exception as e:
            # Re-raise with context - this will only happen when the function is called
            raise RuntimeError(f"Failed to load Gemini model configuration: {e}")
    return _gemini_model_cache


# Core Data Models
class ResumeSection(str, Enum):
    CONTACT_INFO = "contact_info"
    SUMMARY = "summary"
    EXPERIENCE = "experience"
    EDUCATION = "education"
    SKILLS = "skills"
    CERTIFICATIONS = "certifications"
    PROJECTS = "projects"
    ACHIEVEMENTS = "achievements"


class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ExperienceEntry(BaseModel):
    job_title: str = Field(description="Job title or role")
    company: str = Field(description="Company name")
    duration: str = Field(description="Time period in role")
    responsibilities: List[str] = Field(description="Key responsibilities")
    achievements: List[str] = Field(description="Quantifiable achievements")
    skills_demonstrated: List[str] = Field(description="Skills shown in this role")
    impact_score: int = Field(description="Impact score (1-10)", ge=1, le=10)


class SkillAssessment(BaseModel):
    skill: str = Field(description="Skill name")
    level: SkillLevel = Field(description="Assessed skill level")
    evidence_count: int = Field(description="Number of supporting evidence points")
    years_experience: Optional[int] = Field(description="Estimated years of experience")
    market_demand: str = Field(description="Market demand: high, medium, low")
    improvement_potential: str = Field(description="Potential for growth: high, medium, low")


class ResumeAnalysisResult(BaseModel):
    overall_score: int = Field(description="Overall resume score (0-100)", ge=0, le=100)
    ats_compatibility_score: int = Field(description="ATS parsing score (0-100)", ge=0, le=100)
    human_readability_score: int = Field(
        description="Human readability score (0-100)", ge=0, le=100
    )
    impact_score: int = Field(description="Achievement impact score (0-100)", ge=0, le=100)

    # Detailed breakdowns
    section_scores: Dict[str, int] = Field(description="Score by resume section")
    experience_analysis: List[ExperienceEntry] = Field(description="Detailed experience analysis")
    skills_assessment: List[SkillAssessment] = Field(description="Comprehensive skills evaluation")

    # Key insights
    strengths: List[str] = Field(description="Resume's strongest points")
    weaknesses: List[str] = Field(description="Areas needing improvement")
    missing_elements: List[str] = Field(description="Important missing components")

    # Recommendations
    immediate_improvements: List[str] = Field(description="Quick wins for improvement")
    strategic_recommendations: List[str] = Field(description="Long-term improvement strategy")
    industry_alignment: str = Field(description="How well aligned with target industry")

    # Competitive analysis
    competitive_position: str = Field(description="strong, average, weak market position")
    unique_differentiators: List[str] = Field(description="What makes this candidate unique")
    market_positioning_advice: List[str] = Field(description="How to position competitively")


class CareerProgressionAnalysis(BaseModel):
    career_trajectory: str = Field(description="upward, lateral, mixed, unclear progression")
    progression_score: int = Field(description="Career growth score (0-100)", ge=0, le=100)
    title_progression: List[str] = Field(description="Sequence of job titles")
    skill_evolution: Dict[str, List[str]] = Field(description="How skills developed over time")
    career_gaps: List[str] = Field(description="Identified gaps or inconsistencies")
    growth_patterns: List[str] = Field(description="Patterns of professional development")
    future_trajectory: List[str] = Field(description="Likely next career moves")
    positioning_for_advancement: List[str] = Field(description="How to position for next level")


class ResumeIntelligenceReport(BaseModel):
    analysis_timestamp: str = Field(description="When analysis was performed")
    resume_analysis: ResumeAnalysisResult = Field(description="Core resume analysis")
    career_progression: CareerProgressionAnalysis = Field(description="Career trajectory analysis")

    # Strategic insights
    market_readiness: int = Field(description="Market readiness score (0-100)", ge=0, le=100)
    interview_readiness: int = Field(
        description="Interview preparation score (0-100)", ge=0, le=100
    )
    salary_negotiation_strength: int = Field(
        description="Negotiation position strength (0-100)", ge=0, le=100
    )

    # Action plan
    thirty_day_action_items: List[str] = Field(description="Immediate actions to take")
    ninety_day_strategic_plan: List[str] = Field(description="Medium-term improvement plan")
    success_metrics: List[str] = Field(description="How to measure improvement")

    # Industry-specific insights
    industry_fit_analysis: Dict[str, int] = Field(description="Fit scores by industry")
    role_recommendations: List[str] = Field(description="Suitable roles based on profile")


@genkit_flow  # type: ignore[misc]
@with_ai_error_handling()
def analyze_resume_comprehensive(
    resume_content: str, target_industry: Optional[str] = None
) -> ResumeAnalysisResult:
    """
    Performs comprehensive resume analysis with detailed scoring and insights.

    Args:
        resume_content: Full resume text content
        target_industry: Target industry for tailored analysis

    Returns:
        ResumeAnalysisResult: Detailed analysis with scores and recommendations
    """
    try:
        if not resume_content or not isinstance(resume_content, str):
            raise InputValidationError("Resume content is required and must be a string")

        sanitized_content = InputSanitizer.sanitize_text_input(resume_content)

        prompt = format_prompt(
            "comprehensive_resume_analysis",
            resume_content=sanitized_content.sanitized_content,
            target_industry=target_industry or "General analysis",
        )

        response = get_gemini_model().generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.2,
                "max_output_tokens": 3000,
            },
            output_schema=ResumeAnalysisResult,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Comprehensive resume analysis failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow  # type: ignore[misc]
@with_ai_error_handling()
def analyze_career_progression(
    resume_content: str, career_goals: Optional[str] = None
) -> CareerProgressionAnalysis:
    """
    Analyzes career progression patterns and provides advancement strategy.

    Args:
        resume_content: Full resume text content
        career_goals: Optional career objectives and aspirations

    Returns:
        CareerProgressionAnalysis: Career trajectory analysis and advancement strategy
    """
    try:
        sanitized_content = InputSanitizer.sanitize_text_input(resume_content)
        sanitized_goals = InputSanitizer.sanitize_text_input(career_goals) if career_goals else None

        prompt = format_prompt(
            "career_progression_analysis",
            resume_content=sanitized_content.sanitized_content,
            career_goals=(
                sanitized_goals.sanitized_content if sanitized_goals else "Not specified"
            ),
        )

        response = get_gemini_model().generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },
            output_schema=CareerProgressionAnalysis,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Career progression analysis failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow  # type: ignore[misc]
@with_ai_error_handling()
async def generate_resume_intelligence_report(
    resume_content: str,
    target_industry: Optional[str] = None,
    career_goals: Optional[str] = None,
    experience_level: str = "mid_level",
) -> ResumeIntelligenceReport:
    """
    Generates a comprehensive resume intelligence report with strategic insights.

    Args:
        resume_content: Full resume text content
        target_industry: Target industry for analysis
        career_goals: Career objectives and aspirations
        experience_level: early_career, mid_level, senior_level, executive

    Returns:
        ResumeIntelligenceReport: Comprehensive intelligence report with strategic action plan
    """
    try:
        # Run analyses in parallel
        analysis_task = asyncio.create_task(
            analyze_resume_comprehensive(resume_content, target_industry)
        )
        progression_task = asyncio.create_task(
            analyze_career_progression(resume_content, career_goals)
        )

        resume_analysis, career_progression = await asyncio.gather(
            analysis_task, progression_task
        )

        # Prepare comprehensive analysis

        prompt = f"""
As a senior career intelligence analyst, synthesize this resume analysis data
into a comprehensive strategic intelligence report with actionable insights.

RESUME ANALYSIS DATA:
{json.dumps(resume_analysis.dict(), separators=(",", ":"))}

CAREER PROGRESSION DATA:
{json.dumps(career_progression.dict(), separators=(",", ":"))}

CONTEXT:
- Target Industry: {target_industry or "General"}
- Career Goals: {career_goals or "Not specified"}
- Experience Level: {experience_level}

INTELLIGENCE REPORT REQUIREMENTS:
1. Strategic Market Positioning:
   - Overall market readiness and competitive positioning
   - Interview readiness and preparation needs
   - Salary negotiation strength and leverage points

2. Industry Fit Analysis:
   - Score fit across multiple industries (0-100)
   - Identify best-match industries and roles
   - Highlight transferable skills and experience

3. Action Planning:
   - 30-day immediate action items for quick wins
   - 90-day strategic improvement plan
   - Success metrics and measurement criteria

4. Role and Industry Recommendations:
   - Specific roles that match this profile
   - Industries where candidate would be competitive
   - Growth trajectory and advancement opportunities

The report should provide executive-level strategic insights with specific,
measurable actions for career advancement and market positioning.

Respond with valid JSON matching the ResumeIntelligenceReport schema.
"""

        response = get_gemini_model().generate(
            prompt=prompt,
            config={"response_mime_type": "application/json"},
            output_schema=ResumeIntelligenceReport,
        )

        # Ensure the response has the expected output method
        if not hasattr(response, 'output') or not callable(response.output):
            raise RuntimeError("Invalid response from model: missing output method")

        result = response.output()
        if not isinstance(result, ResumeIntelligenceReport):
            raise RuntimeError("Unexpected response type from model")

        # Add the component analyses
        result.resume_analysis = resume_analysis
        result.career_progression = career_progression
        result.analysis_timestamp = datetime.now().isoformat()

        return result

    except Exception as e:
        raise AIError(
            message=f"Resume intelligence report generation failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Utility function for batch resume analysis
@with_ai_error_handling()
def analyze_resume_batch(
    resume_contents: List[str], target_industry: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Analyzes multiple resumes for comparative insights.

    Args:
        resume_contents: List of resume text contents
        target_industry: Target industry for analysis

    Returns:
        List[Dict]: List of resume analysis results with comparative insights
    """
    if len(resume_contents) > 5:
        raise InputValidationError("Batch analysis limited to 5 resumes per request")

    results = []
    for i, resume_content in enumerate(resume_contents):
        try:
            analysis = analyze_resume_comprehensive(resume_content, target_industry)
            results.append({"resume_index": i, "analysis": analysis.dict(), "status": "success"})
        except Exception as e:
            results.append({"resume_index": i, "error": str(e), "status": "failed"})

    return results


# Skills gap analysis for career transition
class SkillsGapAnalysis(BaseModel):
    current_skills: List[SkillAssessment] = Field(description="Current skill inventory")
    target_role_requirements: List[str] = Field(description="Skills required for target role")
    skill_gaps: List[str] = Field(description="Missing skills for target role")
    transferable_skills: List[str] = Field(description="Skills that transfer well")
    development_priority: List[str] = Field(description="Skills to develop first")
    learning_recommendations: List[str] = Field(description="How to acquire missing skills")
    timeline_estimate: str = Field(description="Estimated time to bridge gaps")
    feasibility_score: int = Field(
        description="Career transition feasibility (0-100)", ge=0, le=100
    )


@genkit_flow  # type: ignore[misc]
@with_ai_error_handling()
def analyze_skills_gap_for_transition(
    resume_content: str,
    target_role_description: str,
    current_industry: str,
    target_industry: str,
) -> SkillsGapAnalysis:
    """
    Analyzes skill gaps for career transition and provides development roadmap.
    """
    try:
        sanitized_resume = InputSanitizer.sanitize_text_input(resume_content)
        sanitized_target = InputSanitizer.sanitize_text_input(target_role_description)

        prompt = f"""
As a career transition specialist, analyze the skill gaps between current profile
and target role, providing a strategic development roadmap.

CURRENT RESUME:
{sanitized_resume.sanitized_content}

TARGET ROLE:
{sanitized_target.sanitized_content}

TRANSITION CONTEXT:
- Current Industry: {current_industry}
- Target Industry: {target_industry}

SKILLS GAP ANALYSIS:
1. Current Skills Inventory - assess all demonstrated skills
2. Target Role Requirements - extract required skills from job description
3. Gap Identification - skills missing for target role success
4. Transferable Skills - current skills that apply to target role
5. Development Prioritization - which skills to develop first
6. Learning Strategy - how to acquire missing skills efficiently
7. Timeline Planning - realistic timeframe for skill development
8. Feasibility Assessment - how achievable this transition is

Provide specific, actionable guidance for successful career transition.
Respond with valid JSON matching the SkillsGapAnalysis schema.
"""

        response = get_gemini_model().generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },
            output_schema=SkillsGapAnalysis,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Skills gap analysis failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Export main functions
__all__ = [
    "analyze_resume_comprehensive",
    "analyze_career_progression",
    "generate_resume_intelligence_report",
    "analyze_skills_gap_for_transition",
    "analyze_resume_batch",
    "ResumeAnalysisResult",
    "CareerProgressionAnalysis",
    "ResumeIntelligenceReport",
    "SkillsGapAnalysis",
    "ExperienceEntry",
    "SkillAssessment",
]
