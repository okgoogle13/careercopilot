"""
AI-Powered Career Services API

Advanced AI endpoints for job matching, content optimization, resume intelligence,
and smart cover letter generation using Firebase Genkit flows.
"""

import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional

from app.core.ai_error_handling import AIError, AIErrorType
from app.core.dependencies import get_current_user
from app.core.limiter import limiter

# Import Genkit flows
from app.genkit_flows.advanced_job_matching import (
    CandidateProfile,
    JobMatchAnalysis,
    JobOpportunityRanking,
    MarketPositioningAnalysis,
    analyze_job_batch,
    analyze_job_match_detailed,
    analyze_market_positioning,
    rank_job_opportunities,
)
from app.genkit_flows.resume_intelligence_pipeline import (
    CareerProgressionAnalysis,
    ResumeAnalysisResult,
    ResumeIntelligenceReport,
    SkillsGapAnalysis,
    analyze_career_progression,
    analyze_resume_comprehensive,
    analyze_skills_gap_for_transition,
    generate_resume_intelligence_report,
)
from app.genkit_flows.smart_content_optimizer import (
    ContentOptimizationResult,
    LinkedInOptimizationResult,
    MultiChannelOptimizationResult,
    PersonalBrandingAnalysis,
    analyze_personal_branding,
    optimize_content_for_job,
    optimize_linkedin_profile,
    optimize_multi_channel_presence,
)
from app.genkit_flows.smart_cover_letter_system import (
    CompanyResearchInsights,
    CoverLetterOptimizationResult,
    MultiFormatCoverLetterSuite,
    SmartCoverLetter,
    create_multi_format_cover_letter_suite,
    generate_smart_cover_letter,
    optimize_existing_cover_letter,
    research_company_for_application,
)
from fastapi import APIRouter, Body, Depends, HTTPException, status
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter()


# Request Models
class JobMatchRequest(BaseModel):
    job_description: str = Field(..., description="Full job posting text")
    candidate_profile: Dict = Field(..., description="Comprehensive candidate information")


class JobRankingRequest(BaseModel):
    candidate_profile: Dict = Field(..., description="Candidate information")
    job_opportunities: List[Dict] = Field(..., description="List of job opportunities")


class MarketPositioningRequest(BaseModel):
    candidate_profile: Dict = Field(..., description="Candidate information")
    target_role: str = Field(..., description="Target job role")
    location: str = Field(..., description="Target location/market")


class ContentOptimizationRequest(BaseModel):
    content: str = Field(..., description="Content to optimize")
    job_description: str = Field(..., description="Target job posting")
    content_type: str = Field(..., description="Type of content")
    optimization_goals: List[str] = Field(
        default=["ats_optimization"], description="Optimization objectives"
    )


class PersonalBrandingRequest(BaseModel):
    resume: str = Field(..., description="Resume content")
    linkedin_profile: Optional[str] = Field(None, description="LinkedIn profile content")
    career_goals: Optional[str] = Field(None, description="Career objectives")


class LinkedInOptimizationRequest(BaseModel):
    current_profile: str = Field(..., description="Current LinkedIn profile")
    target_roles: List[str] = Field(..., description="Target job roles")
    industry_focus: str = Field(..., description="Target industry")
    career_stage: str = Field(..., description="Career stage level")


class ResumeAnalysisRequest(BaseModel):
    resume_content: str = Field(..., description="Resume text content")
    target_industry: Optional[str] = Field(None, description="Target industry")


class ResumeIntelligenceRequest(BaseModel):
    resume_content: str = Field(..., description="Resume text content")
    target_industry: Optional[str] = Field(None, description="Target industry")
    career_goals: Optional[str] = Field(None, description="Career objectives")
    experience_level: str = Field(default="mid_level", description="Experience level")


class SkillsGapRequest(BaseModel):
    resume_content: str = Field(..., description="Current resume")
    target_role_description: str = Field(..., description="Target role description")
    current_industry: str = Field(..., description="Current industry")
    target_industry: str = Field(..., description="Target industry")


class CoverLetterRequest(BaseModel):
    candidate_profile: Dict = Field(..., description="Candidate information")
    job_description: str = Field(..., description="Job posting text")
    company_info: Optional[Dict] = Field(None, description="Company research data")
    style: str = Field(default="professional", description="Cover letter style")
    format_type: str = Field(default="full_letter", description="Output format")
    special_instructions: Optional[str] = Field(None, description="Special requirements")


class CompanyResearchRequest(BaseModel):
    company_name: str = Field(..., description="Target company name")
    industry: str = Field(..., description="Company industry")
    job_role: str = Field(..., description="Target role")
    additional_context: Optional[str] = Field(None, description="Additional context")


class CoverLetterOptimizationRequest(BaseModel):
    existing_cover_letter: str = Field(..., description="Current cover letter")
    job_description: str = Field(..., description="Target job posting")
    candidate_profile: Dict = Field(..., description="Candidate information")
    company_insights: Optional[Dict] = Field(None, description="Company research")


class MultiFormatRequest(BaseModel):
    candidate_profile: Dict = Field(..., description="Candidate information")
    job_description: str = Field(..., description="Job posting text")
    company_insights: Optional[Dict] = Field(None, description="Company research")


# Job Matching Endpoints
@router.post("/job-matching/analyze", response_model=JobMatchAnalysis, tags=["AI Job Matching"])
@limiter.limit("10/minute")
async def analyze_job_match(
    request: JobMatchRequest, current_user: str = Depends(get_current_user)
):
    """
    Perform comprehensive job matching analysis with detailed scoring and recommendations.
    """
    try:
        logger.info(f"Job match analysis requested by user: {current_user}")

        result = analyze_job_match_detailed(
            job_description=request.job_description, candidate_profile=request.candidate_profile
        )

        logger.info(f"Job match analysis completed - Score: {result.overall_match_score}")
        return result

    except AIError as e:
        logger.error(f"AI job matching failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job matching analysis failed: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Unexpected error in job matching: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during job matching analysis",
        )


@router.post(
    "/job-matching/rank-opportunities",
    response_model=List[JobOpportunityRanking],
    tags=["AI Job Matching"],
)
@limiter.limit("5/minute")
async def rank_job_opportunities_endpoint(
    request: JobRankingRequest, current_user: str = Depends(get_current_user)
):
    """
    Rank multiple job opportunities for a candidate with detailed analysis.
    """
    try:
        logger.info(
            f"Job ranking requested by user: {current_user} for {len(request.job_opportunities)} jobs"
        )

        result = rank_job_opportunities(
            candidate_profile=request.candidate_profile, job_opportunities=request.job_opportunities
        )

        return result

    except AIError as e:
        logger.error(f"Job ranking failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job ranking failed: {str(e)}",
        )


@router.post(
    "/job-matching/market-positioning",
    response_model=MarketPositioningAnalysis,
    tags=["AI Job Matching"],
)
@limiter.limit("5/minute")
async def analyze_market_positioning_endpoint(
    request: MarketPositioningRequest, current_user: str = Depends(get_current_user)
):
    """
    Analyze candidate's market positioning and competitive advantages.
    """
    try:
        result = analyze_market_positioning(
            candidate_profile=request.candidate_profile,
            target_role=request.target_role,
            location=request.location,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Market positioning analysis failed: {str(e)}",
        )


# Content Optimization Endpoints
@router.post(
    "/content-optimization/optimize",
    response_model=ContentOptimizationResult,
    tags=["AI Content Optimization"],
)
@limiter.limit("10/minute")
async def optimize_content_endpoint(
    request: ContentOptimizationRequest, current_user: str = Depends(get_current_user)
):
    """
    Optimize content (resume, cover letter, etc.) for specific job opportunities.
    """
    try:
        logger.info(f"Content optimization requested by user: {current_user}")

        result = optimize_content_for_job(
            content=request.content,
            job_description=request.job_description,
            content_type=request.content_type,
            optimization_goals=request.optimization_goals,
        )

        return result

    except AIError as e:
        logger.error(f"Content optimization failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Content optimization failed: {str(e)}",
        )


@router.post(
    "/content-optimization/personal-branding",
    response_model=PersonalBrandingAnalysis,
    tags=["AI Content Optimization"],
)
@limiter.limit("5/minute")
async def analyze_personal_branding_endpoint(
    request: PersonalBrandingRequest, current_user: str = Depends(get_current_user)
):
    """
    Analyze personal branding consistency and strength across career materials.
    """
    try:
        result = analyze_personal_branding(
            resume=request.resume,
            linkedin_profile=request.linkedin_profile,
            career_goals=request.career_goals,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Personal branding analysis failed: {str(e)}",
        )


@router.post(
    "/content-optimization/linkedin",
    response_model=LinkedInOptimizationResult,
    tags=["AI Content Optimization"],
)
@limiter.limit("5/minute")
async def optimize_linkedin_endpoint(
    request: LinkedInOptimizationRequest, current_user: str = Depends(get_current_user)
):
    """
    Optimize LinkedIn profile for maximum visibility and engagement.
    """
    try:
        result = optimize_linkedin_profile(
            current_profile=request.current_profile,
            target_roles=request.target_roles,
            industry_focus=request.industry_focus,
            career_stage=request.career_stage,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LinkedIn optimization failed: {str(e)}",
        )


@router.post(
    "/content-optimization/multi-channel",
    response_model=MultiChannelOptimizationResult,
    tags=["AI Content Optimization"],
)
@limiter.limit("3/minute")
async def optimize_multi_channel_endpoint(
    request: MultiFormatRequest, current_user: str = Depends(get_current_user)
):
    """
    Create consistent, optimized content across all career marketing channels.
    """
    try:
        result = optimize_multi_channel_presence(
            resume=request.candidate_profile.get("resume", ""),
            target_role=request.job_description,
            unique_value_props=request.candidate_profile.get("unique_strengths", []),
            career_narrative=request.candidate_profile.get("career_story", ""),
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Multi-channel optimization failed: {str(e)}",
        )


# Resume Intelligence Endpoints
@router.post(
    "/resume-intelligence/analyze",
    response_model=ResumeAnalysisResult,
    tags=["AI Resume Intelligence"],
)
@limiter.limit("10/minute")
async def analyze_resume_endpoint(
    request: ResumeAnalysisRequest, current_user: str = Depends(get_current_user)
):
    """
    Perform comprehensive resume analysis with detailed scoring and insights.
    """
    try:
        logger.info(f"Resume analysis requested by user: {current_user}")

        result = analyze_resume_comprehensive(
            resume_content=request.resume_content, target_industry=request.target_industry
        )

        logger.info(f"Resume analysis completed - Score: {result.overall_score}")
        return result

    except AIError as e:
        logger.error(f"Resume analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume analysis failed: {str(e)}",
        )


@router.post(
    "/resume-intelligence/career-progression",
    response_model=CareerProgressionAnalysis,
    tags=["AI Resume Intelligence"],
)
@limiter.limit("5/minute")
async def analyze_career_progression_endpoint(
    request: ResumeAnalysisRequest, current_user: str = Depends(get_current_user)
):
    """
    Analyze career progression patterns and advancement opportunities.
    """
    try:
        result = analyze_career_progression(
            resume_content=request.resume_content,
            career_goals=request.target_industry,  # Reusing field for career goals
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Career progression analysis failed: {str(e)}",
        )


@router.post(
    "/resume-intelligence/intelligence-report",
    response_model=ResumeIntelligenceReport,
    tags=["AI Resume Intelligence"],
)
@limiter.limit("3/minute")
async def generate_resume_intelligence_endpoint(
    request: ResumeIntelligenceRequest, current_user: str = Depends(get_current_user)
):
    """
    Generate comprehensive resume intelligence report with strategic insights.
    """
    try:
        logger.info(f"Resume intelligence report requested by user: {current_user}")

        result = generate_resume_intelligence_report(
            resume_content=request.resume_content,
            target_industry=request.target_industry,
            career_goals=request.career_goals,
            experience_level=request.experience_level,
        )

        return result

    except AIError as e:
        logger.error(f"Resume intelligence report failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume intelligence report generation failed: {str(e)}",
        )


@router.post(
    "/resume-intelligence/skills-gap",
    response_model=SkillsGapAnalysis,
    tags=["AI Resume Intelligence"],
)
@limiter.limit("5/minute")
async def analyze_skills_gap_endpoint(
    request: SkillsGapRequest, current_user: str = Depends(get_current_user)
):
    """
    Analyze skill gaps for career transition and provide development roadmap.
    """
    try:
        result = analyze_skills_gap_for_transition(
            resume_content=request.resume_content,
            target_role_description=request.target_role_description,
            current_industry=request.current_industry,
            target_industry=request.target_industry,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Skills gap analysis failed: {str(e)}",
        )


# Smart Cover Letter Endpoints
@router.post("/cover-letters/generate", response_model=SmartCoverLetter, tags=["AI Cover Letters"])
@limiter.limit("10/minute")
async def generate_cover_letter_endpoint(
    request: CoverLetterRequest, current_user: str = Depends(get_current_user)
):
    """
    Generate highly personalized, compelling cover letter with company research integration.
    """
    try:
        logger.info(f"Cover letter generation requested by user: {current_user}")

        result = generate_smart_cover_letter(
            candidate_profile=request.candidate_profile,
            job_description=request.job_description,
            company_info=request.company_info,
            style=request.style,
            format_type=request.format_type,
            special_instructions=request.special_instructions,
        )

        return result

    except AIError as e:
        logger.error(f"Cover letter generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cover letter generation failed: {str(e)}",
        )


@router.post(
    "/cover-letters/company-research",
    response_model=CompanyResearchInsights,
    tags=["AI Cover Letters"],
)
@limiter.limit("5/minute")
async def research_company_endpoint(
    request: CompanyResearchRequest, current_user: str = Depends(get_current_user)
):
    """
    Generate company research insights to inform personalized cover letters.
    """
    try:
        result = research_company_for_application(
            company_name=request.company_name,
            industry=request.industry,
            job_role=request.job_role,
            additional_context=request.additional_context,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Company research failed: {str(e)}",
        )


@router.post(
    "/cover-letters/optimize",
    response_model=CoverLetterOptimizationResult,
    tags=["AI Cover Letters"],
)
@limiter.limit("5/minute")
async def optimize_cover_letter_endpoint(
    request: CoverLetterOptimizationRequest, current_user: str = Depends(get_current_user)
):
    """
    Optimize an existing cover letter for better impact and job alignment.
    """
    try:
        result = optimize_existing_cover_letter(
            existing_cover_letter=request.existing_cover_letter,
            job_description=request.job_description,
            candidate_profile=request.candidate_profile,
            company_insights=request.company_insights,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cover letter optimization failed: {str(e)}",
        )


@router.post(
    "/cover-letters/multi-format",
    response_model=MultiFormatCoverLetterSuite,
    tags=["AI Cover Letters"],
)
@limiter.limit("3/minute")
async def create_multi_format_endpoint(
    request: MultiFormatRequest, current_user: str = Depends(get_current_user)
):
    """
    Create a complete suite of application materials in different formats.
    """
    try:
        result = create_multi_format_cover_letter_suite(
            candidate_profile=request.candidate_profile,
            job_description=request.job_description,
            company_insights=request.company_insights,
        )

        return result

    except AIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Multi-format cover letter suite creation failed: {str(e)}",
        )


# Health and Status Endpoints
@router.get("/health", tags=["Health"])
async def health_check():
    """
    Health check for AI-powered career services.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "job_matching": "operational",
            "content_optimization": "operational",
            "resume_intelligence": "operational",
            "cover_letter_generation": "operational",
        },
        "version": "1.0.0",
    }


@router.get("/features", tags=["Information"])
async def list_ai_features():
    """
    List all available AI-powered career features.
    """
    return {
        "job_matching": {
            "analyze": "Comprehensive job matching analysis",
            "rank_opportunities": "Rank multiple job opportunities",
            "market_positioning": "Market positioning analysis",
        },
        "content_optimization": {
            "optimize": "Content optimization for jobs",
            "personal_branding": "Personal branding analysis",
            "linkedin": "LinkedIn profile optimization",
            "multi_channel": "Multi-channel presence optimization",
        },
        "resume_intelligence": {
            "analyze": "Comprehensive resume analysis",
            "career_progression": "Career progression analysis",
            "intelligence_report": "Full intelligence report",
            "skills_gap": "Skills gap analysis for transitions",
        },
        "cover_letters": {
            "generate": "Smart cover letter generation",
            "company_research": "Company research insights",
            "optimize": "Cover letter optimization",
            "multi_format": "Multi-format application suite",
        },
    }
