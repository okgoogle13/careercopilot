"""
Advanced Resume Intelligence Pipeline using Firebase Genkit

Comprehensive resume analysis system that provides deep insights, scoring,
and optimization recommendations using AI-powered analysis.
"""

import json
import asyncio
import os
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.prompt_service import format_prompt

try:
    import genkit
    from genkit import ai
    from genkit.plugins import google_genai
except Exception:
    genkit = None
    googleai = None
    ai = None


def _noop_flow(*args, **kwargs):
    def _decorator(fn):
        return fn

    return _decorator


genkit_flow = getattr(genkit, "flow", _noop_flow) if genkit else _noop_flow

# Load environment variables
load_dotenv()
if genkit and getattr(genkit, "get_plugin", None) and not genkit.get_plugin("googleai"):
    genkit.init(plugins=[google_genai.init(api_key=os.getenv("GEMINI_API_KEY"))])

gemini_pro = get_ai_config().get_model_config("gemini-2.0-flash")


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


@genkit_flow(output_schema=ResumeAnalysisResult)
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

        response = gemini_pro.generate(
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


@genkit_flow(output_schema=CareerProgressionAnalysis)
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

        response = gemini_pro.generate(
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


@genkit_flow(output_schema=ResumeIntelligenceReport)
@with_ai_error_handling()
def generate_resume_intelligence_report(
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
        # Get core analysis components in parallel
        resume_analysis_task = asyncio.create_task(analyze_resume_comprehensive.run(resume_content, target_industry))
        career_progression_task = asyncio.create_task(analyze_career_progression.run(resume_content, career_goals))

        resume_analysis, career_progression = await asyncio.gather(resume_analysis_task, career_progression_task)

        # Prepare comprehensive analysis

        prompt = f"""
As a senior career intelligence analyst, synthesize this resume analysis data
into a comprehensive strategic intelligence report with actionable insights.

RESUME ANALYSIS DATA:
{json.dumps(resume_analysis.dict(), indent=2)}

CAREER PROGRESSION DATA:
{json.dumps(career_progression.dict(), indent=2)}

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

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.2,
            },
            output_schema=ResumeIntelligenceReport,
        )

        result = response.output()

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
) -> List[Dict]:
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


@genkit_flow(output_schema=SkillsGapAnalysis)
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

        response = gemini_pro.generate(
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
