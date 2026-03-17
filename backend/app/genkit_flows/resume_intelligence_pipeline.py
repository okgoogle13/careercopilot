"""
Advanced Resume Intelligence Pipeline using Firebase Genkit

Comprehensive resume analysis system that provides deep insights, scoring,
and optimization recommendations using AI-powered analysis.
"""

from __future__ import annotations

import asyncio
from datetime import datetime
from enum import Enum
from typing import Any, TypeVar, cast

from pydantic import BaseModel, Field
from typing_extensions import ParamSpec

from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.prompt_service import format_prompt

# Type variables
P = ParamSpec("P")
R = TypeVar("R")


# Protocol for model configuration
class ModelConfigProtocol:
    """Protocol for model configuration."""

    def generate(self, prompt: str, **kwargs: Any) -> Any: ...  # noqa: E704


from app.core.genkit_init import async_genkit_flow, get_model


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
    responsibilities: list[str] = Field(description="Key responsibilities")
    achievements: list[str] = Field(description="Quantifiable achievements")
    skills_demonstrated: list[str] = Field(description="Skills shown in this role")
    impact_score: int = Field(description="Impact score (1-10)", ge=1, le=10)


class SkillAssessment(BaseModel):
    skill: str = Field(description="Skill name")
    level: SkillLevel = Field(description="Assessed skill level")
    evidence_count: int = Field(description="Number of supporting evidence points")
    years_experience: int | None = Field(description="Estimated years of experience")
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
    section_scores: dict[str, int] = Field(description="Score by resume section")
    experience_analysis: list[ExperienceEntry] = Field(description="Detailed experience analysis")
    skills_assessment: list[SkillAssessment] = Field(description="Comprehensive skills evaluation")

    # Key insights
    strengths: list[str] = Field(description="Resume's strongest points")
    weaknesses: list[str] = Field(description="Areas needing improvement")
    missing_elements: list[str] = Field(description="Important missing components")

    # Recommendations
    immediate_improvements: list[str] = Field(description="Quick wins for improvement")
    strategic_recommendations: list[str] = Field(description="Long-term improvement strategy")
    industry_alignment: str = Field(description="How well aligned with target industry")

    # Competitive analysis
    competitive_position: str = Field(description="strong, average, weak market position")
    unique_differentiators: list[str] = Field(description="What makes this candidate unique")
    market_positioning_advice: list[str] = Field(description="How to position competitively")


class CareerProgressionAnalysis(BaseModel):
    career_trajectory: str = Field(description="upward, lateral, mixed, unclear progression")
    progression_score: int = Field(description="Career growth score (0-100)", ge=0, le=100)
    title_progression: list[str] = Field(description="Sequence of job titles")
    skill_evolution: dict[str, list[str]] = Field(description="How skills developed over time")
    career_gaps: list[str] = Field(description="Identified gaps or inconsistencies")
    growth_patterns: list[str] = Field(description="Patterns of professional development")
    future_trajectory: list[str] = Field(description="Likely next career moves")
    positioning_for_advancement: list[str] = Field(description="How to position for next level")


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
    thirty_day_action_items: list[str] = Field(description="Immediate actions to take")
    ninety_day_strategic_plan: list[str] = Field(description="Medium-term improvement plan")
    success_metrics: list[str] = Field(description="How to measure improvement")

    # Industry-specific insights
    industry_fit_analysis: dict[str, int] = Field(description="Fit scores by industry")
    role_recommendations: list[str] = Field(description="Suitable roles based on profile")


@async_genkit_flow(output_schema=ResumeAnalysisResult)
@with_ai_error_handling()
async def analyze_resume_comprehensive(
    resume_content: str, target_industry: str | None = None
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

        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        response = await model.generate(
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
            message=f"Comprehensive resume analysis failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@async_genkit_flow(output_schema=CareerProgressionAnalysis)
@with_ai_error_handling()
async def analyze_career_progression(
    resume_content: str, career_goals: str | None = None
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

        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        response = await model.generate(
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
            message=f"Career progression analysis failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@async_genkit_flow(output_schema=ResumeIntelligenceReport)
@with_ai_error_handling()
async def generate_resume_intelligence_report(
    resume_content: str,
    target_industry: str | None = None,
    career_goals: str | None = None,
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

        resume_analysis, career_progression = await asyncio.gather(analysis_task, progression_task)

        # Prepare comprehensive analysis

        prompt = f"""
As a senior career intelligence analyst, synthesize this resume analysis data
into a comprehensive strategic intelligence report with actionable insights.

RESUME ANALYSIS DATA:
{resume_analysis.model_dump_json()}

CAREER PROGRESSION DATA:
{career_progression.model_dump_json()}

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

        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        response = await model.generate(
            prompt=prompt,
            config={"response_mime_type": "application/json"},
            output_schema=ResumeIntelligenceReport,
        )

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
            message=f"Resume intelligence report generation failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Utility function for batch resume analysis
@with_ai_error_handling()
async def analyze_resume_batch(
    resume_contents: list[str], target_industry: str | None = None
) -> list[dict[str, Any]]:
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

    tasks = []
    for resume_content in resume_contents:
        tasks.append(analyze_resume_comprehensive(resume_content, target_industry))

    responses = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    for i, response in enumerate(responses):
        if isinstance(response, Exception):
            results.append({"resume_index": i, "error": str(response), "status": "failed"})
        else:
            analysis = cast(ResumeAnalysisResult, response)
            results.append({"resume_index": i, "analysis": analysis.dict(), "status": "success"})

    return results


# Skills gap analysis for career transition
class SkillsGapAnalysis(BaseModel):
    current_skills: list[SkillAssessment] = Field(description="Current skill inventory")
    target_role_requirements: list[str] = Field(description="Skills required for target role")
    skill_gaps: list[str] = Field(description="Missing skills for target role")
    transferable_skills: list[str] = Field(description="Skills that transfer well")
    development_priority: list[str] = Field(description="Skills to develop first")
    learning_recommendations: list[str] = Field(description="How to acquire missing skills")
    timeline_estimate: str = Field(description="Estimated time to bridge gaps")
    feasibility_score: int = Field(
        description="Career transition feasibility (0-100)", ge=0, le=100
    )


@async_genkit_flow(output_schema=SkillsGapAnalysis)
@with_ai_error_handling()
async def analyze_skills_gap_for_transition(
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

        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        response = await model.generate(
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
            message=f"Skills gap analysis failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Export main functions
__all__ = [
    "CareerProgressionAnalysis",
    "ExperienceEntry",
    "ResumeAnalysisResult",
    "ResumeIntelligenceReport",
    "SkillAssessment",
    "SkillsGapAnalysis",
    "analyze_career_progression",
    "analyze_resume_batch",
    "analyze_resume_comprehensive",
    "analyze_skills_gap_for_transition",
    "generate_resume_intelligence_report",
]
