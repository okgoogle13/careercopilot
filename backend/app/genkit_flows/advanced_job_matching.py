"""
Advanced Job Matching System using Firebase Genkit

Provides sophisticated job matching algorithms that analyze multiple dimensions
of compatibility between candidates and job opportunities.
"""

import json

from pydantic import BaseModel, Field

from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.genkit_init import genkit_flow, get_model
from app.core.input_validation import InputSanitizer, InputValidationError


# Pydantic models for structured outputs
class SkillMatch(BaseModel):
    skill: str = Field(description="The skill name")
    candidate_level: int = Field(description="Candidate's skill level (1-10)", ge=1, le=10)
    required_level: int = Field(description="Required skill level (1-10)", ge=1, le=10)
    gap_score: int = Field(description="Skill gap score (0-10, 0=no gap)", ge=0, le=10)
    importance: str = Field(description="Skill importance: critical, important, nice-to-have")


class CareerTransitionAnalysis(BaseModel):
    transition_feasibility: int = Field(
        description="How feasible the transition is (0-100)", ge=0, le=100
    )
    transferable_skills: list[str] = Field(description="Skills that transfer from current field")
    skill_gaps: list[str] = Field(description="Skills needed for successful transition")
    transition_timeline: str = Field(
        description="Estimated timeline: immediate, 3-6months, 6-12months, 1-2years"
    )
    transition_strategy: list[str] = Field(description="Recommended steps for transition")


class JobMatchAnalysis(BaseModel):
    overall_match_score: int = Field(description="Overall job match score (0-100)", ge=0, le=100)
    skill_compatibility: int = Field(description="Skills match score (0-100)", ge=0, le=100)
    experience_fit: int = Field(description="Experience level fit (0-100)", ge=0, le=100)
    cultural_fit: int = Field(description="Cultural and values fit (0-100)", ge=0, le=100)
    growth_potential: int = Field(description="Career growth potential (0-100)", ge=0, le=100)

    skill_matches: list[SkillMatch] = Field(description="Detailed skill-by-skill analysis")
    critical_gaps: list[str] = Field(description="Critical gaps that may prevent success")
    competitive_advantages: list[str] = Field(
        description="Candidate's unique strengths for this role"
    )

    career_transition: CareerTransitionAnalysis | None = Field(
        default=None, description="Career transition analysis if applicable"
    )

    recommendations: list[str] = Field(description="Actionable recommendations to improve match")
    interview_prep_focus: list[str] = Field(
        description="Key areas to focus on for interview preparation"
    )

    confidence_level: str = Field(description="Analysis confidence: high, medium, low")
    match_category: str = Field(description="excellent, good, fair, poor")


class JobOpportunityRanking(BaseModel):
    job_id: str = Field(description="Job identifier")
    job_title: str = Field(description="Job title")
    company: str = Field(description="Company name")
    match_score: int = Field(description="Match score (0-100)", ge=0, le=100)
    match_reasoning: str = Field(description="Brief explanation of why this job matches well")
    application_priority: str = Field(description="high, medium, low priority for application")
    estimated_success_probability: int = Field(
        description="Likelihood of success (0-100)", ge=0, le=100
    )


class CandidateProfile(BaseModel):
    """Structured representation of a candidate's profile"""

    current_role: str | None = None
    years_experience: int = 0
    skills: list[str] = []
    education: list[str] = []
    career_transition_from: str | None = None
    career_transition_to: str | None = None
    preferred_location: str | None = None
    salary_expectations: str | None = None
    work_preferences: list[str] = []
    achievements: list[str] = []


@genkit_flow(output_schema=JobMatchAnalysis)
@with_ai_error_handling()
def analyze_job_match_detailed(job_description: str, candidate_profile: dict) -> JobMatchAnalysis:
    """
    Performs comprehensive job matching analysis using multiple AI evaluation criteria.

    Args:
        job_description: Full job posting text
        candidate_profile: Structured candidate information

    Returns:
        JobMatchAnalysis: Detailed analysis with scores and recommendations
    """
    try:
        # Input validation
        if not job_description or not isinstance(job_description, str):
            raise InputValidationError("Job description is required and must be a string")

        if not candidate_profile or not isinstance(candidate_profile, dict):
            raise InputValidationError("Candidate profile is required and must be a dictionary")

        # Sanitize inputs
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        sanitized_profile = InputSanitizer.sanitize_dict_input(candidate_profile)

        prompt = f"""
As an expert career coach and talent acquisition specialist, perform a comprehensive job match analysis.
Analyze how well this candidate fits the job opportunity across multiple dimensions.

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(",", ":"))}

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

ANALYSIS REQUIREMENTS:
1. Calculate overall match score (0-100) considering all factors
2. Analyze skills compatibility with detailed skill-by-skill breakdown
3. Evaluate experience fit and career progression alignment
4. Assess cultural and values compatibility
5. Determine growth potential and career development opportunities
6. Identify critical gaps that could prevent success
7. Highlight candidate's competitive advantages
8. If this involves career transition, provide detailed transition analysis
9. Give actionable recommendations for improving candidacy
10. Suggest interview preparation focus areas

SCORING CRITERIA:
- 90-100: Exceptional match, ideal candidate
- 80-89: Strong match, very good fit
- 70-79: Good match with some gaps
- 60-69: Moderate match, significant development needed
- 50-59: Weak match, major gaps
- Below 50: Poor match, not recommended

For skill analysis, rate both candidate level and required level (1-10 scale):
- 1-3: Beginner/Basic
- 4-6: Intermediate/Proficient
- 7-8: Advanced/Expert
- 9-10: Master/Industry Leader

Respond with a valid JSON object matching the JobMatchAnalysis schema.
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
            output_schema=JobMatchAnalysis,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Job match analysis failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow()
@with_ai_error_handling()
def rank_job_opportunities(
    candidate_profile: dict, job_opportunities: list[dict]
) -> list[JobOpportunityRanking]:
    """
    Ranks multiple job opportunities for a candidate based on match quality and success probability.

    Args:
        candidate_profile: Structured candidate information
        job_opportunities: List of job postings with id, title, company, and description

    Returns:
        List[JobOpportunityRanking]: Ranked list of job opportunities with detailed analysis
    """
    try:
        # Input validation
        if not candidate_profile or not isinstance(candidate_profile, dict):
            raise InputValidationError("Candidate profile is required and must be a dictionary")

        if not job_opportunities or not isinstance(job_opportunities, list):
            raise InputValidationError("Job opportunities must be a non-empty list")

        if len(job_opportunities) > 10:
            raise InputValidationError("Cannot rank more than 10 job opportunities at once")

        # Sanitize inputs
        sanitized_profile = InputSanitizer.sanitize_dict_input(candidate_profile)
        sanitized_jobs = [InputSanitizer.sanitize_dict_input(job) for job in job_opportunities]

        prompt = f"""
As an expert career strategist, rank these job opportunities for the candidate from best to worst match.
Consider overall fit, success probability, career growth potential, and strategic value.

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(",", ":"))}

JOB OPPORTUNITIES:
{json.dumps(sanitized_jobs, separators=(",", ":"))}

RANKING CRITERIA:
1. Overall match quality (skills, experience, background)
2. Success probability (likelihood of getting and succeeding in the role)
3. Career advancement potential
4. Strategic career value
5. Market opportunity and timing
6. Compensation and benefits alignment

For each job, provide:
- Match score (0-100)
- Brief reasoning for the ranking
- Application priority (high/medium/low)
- Estimated success probability (0-100)

Return jobs ranked from best to worst match as a JSON array matching the JobOpportunityRanking schema.
"""

        model = get_model()
        if model is None:
            raise RuntimeError("Genkit model not available")

        response = model.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.2,
            },
            output_schema=list[JobOpportunityRanking],
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Job ranking failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


class MarketPositioningAnalysis(BaseModel):
    competitive_position: str = Field(description="strong, moderate, weak competitive position")
    market_demand: int = Field(description="Market demand score (0-100)", ge=0, le=100)
    salary_competitiveness: str = Field(description="above_market, market_rate, below_market")
    unique_value_proposition: list[str] = Field(description="Candidate's unique strengths")
    market_differentiators: list[str] = Field(description="What sets candidate apart")
    positioning_recommendations: list[str] = Field(description="How to position candidacy")
    target_companies: list[str] = Field(description="Companies that would value this profile")
    negotiation_strengths: list[str] = Field(description="Strengths for salary negotiation")


@genkit_flow(output_schema=MarketPositioningAnalysis)
@with_ai_error_handling()
def analyze_market_positioning(
    candidate_profile: dict, target_role: str, location: str
) -> MarketPositioningAnalysis:
    """
    Analyzes candidate's market positioning for their target role and provides strategic insights.

    Args:
        candidate_profile: Structured candidate information
        target_role: Target job role or title
        location: Target location/market

    Returns:
        MarketPositioningAnalysis: Strategic market positioning analysis
    """
    try:
        # Input validation
        if not all([candidate_profile, target_role, location]):
            raise InputValidationError("All parameters are required")

        sanitized_profile = InputSanitizer.sanitize_dict_input(candidate_profile)
        sanitized_role = InputSanitizer.sanitize_text_input(target_role)
        sanitized_location = InputSanitizer.sanitize_text_input(location)

        prompt = f"""
As a career strategist and market analyst, analyze this candidate's competitive positioning
for their target role in the specified market.

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(",", ":"))}

TARGET ROLE: {sanitized_role.sanitized_content}
LOCATION/MARKET: {sanitized_location.sanitized_content}

ANALYSIS FOCUS:
1. Competitive positioning vs other candidates in the market
2. Market demand for this role and skill set
3. Salary competitiveness and negotiation position
4. Unique value proposition and differentiators
5. Positioning strategy for applications and interviews
6. Target companies that would value this profile
7. Strengths for salary negotiation

Consider current market trends, skill demands, and competitive landscape.
Provide strategic recommendations for maximizing market position.

Respond with valid JSON matching the MarketPositioningAnalysis schema.
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
            output_schema=MarketPositioningAnalysis,
        )

        return response.output()

    except Exception as e:
        raise AIError(
            message=f"Market positioning analysis failed: {e!s}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Helper function for batch job analysis
@with_ai_error_handling()
def analyze_job_batch(candidate_profile: dict, job_descriptions: list[str]) -> list[dict]:
    """
    Analyzes multiple jobs for a candidate in batch for efficiency.

    Args:
        candidate_profile: Structured candidate information
        job_descriptions: List of job description texts

    Returns:
        List[Dict]: List of job match analyses
    """
    if len(job_descriptions) > 5:
        raise InputValidationError("Batch analysis limited to 5 jobs per request")

    results = []
    for i, job_desc in enumerate(job_descriptions):
        try:
            analysis = analyze_job_match_detailed(job_desc, candidate_profile)
            results.append({"job_index": i, "analysis": analysis.dict(), "status": "success"})
        except Exception as e:
            results.append({"job_index": i, "error": str(e), "status": "failed"})

    return results


# Export main functions
__all__ = [
    "CandidateProfile",
    "JobMatchAnalysis",
    "JobOpportunityRanking",
    "MarketPositioningAnalysis",
    "analyze_job_batch",
    "analyze_job_match_detailed",
    "analyze_market_positioning",
    "rank_job_opportunities",
]
