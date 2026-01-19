# backend/app/api/v1/analysis.py (Revised)

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional, cast

from app.core.dependencies import get_current_user
from app.genkit_flows.advanced_job_matching import analyze_job_match_detailed
from app.genkit_flows.ats_scoring import AtsResult, atsScoring
from app.genkit_flows.flow_decorator import run_flow_async
from app.genkit_flows.resume_intelligence_pipeline import generate_resume_intelligence_report
from app.genkit_flows.smart_content_optimizer import optimize_content_for_job
from app.genkit_flows.resume_optimizer import optimizeResume, OptimizedResume
from app.genkit_flows.company_analyzer import analyze_company_website, CompanyAnalysis
from app.models import ATSScoreResponse, CategoryScore

router = APIRouter()


class ATSScoreRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post(
    "/ats-score",
    response_model=ATSScoreResponse,
    summary="Get ATS Score Analysis",
    tags=["Analysis"],
)
async def create_ats_score_analysis(
    request: ATSScoreRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> ATSScoreResponse:
    """
    Invokes the sophisticated `atsScoring` Genkit flow and transforms its
    output into the format expected by the frontend UI components.
    
    This endpoint provides real-time AI-powered analysis of resume compatibility
    with job descriptions, including keyword matching, semantic analysis, and
    formatting recommendations.
    """
    try:
        # Step 1: Call your existing, powerful Genkit flow.
        # Note: Your flow expects snake_case arguments.
        flow_result: AtsResult = await run_flow_async(
            atsScoring,
            **{
                "resumeText": request.resume_text,
                "jobDescription": request.job_description,
                "user_id": getattr(current_user, "uid", None),
            },
        )

        # Step 2: Transform flow output (AtsResult) to API response (ATSScoreResponse).
        # This is the "Adapter" logic.
        response_data = ATSScoreResponse(
            overallScore=int(flow_result.overallScore),
            categories=[
                CategoryScore(
                    name="Keyword Optimization",
                    score=int(flow_result.breakdown.keywordScore),
                    status=(
                        "good"
                        if flow_result.breakdown.keywordScore >= 80
                        else ("warning" if flow_result.breakdown.keywordScore >= 60 else "poor")
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.keywordScore < 80
                        else ["Keywords are well-optimized."]
                    ),
                ),
                CategoryScore(
                    name="Semantic Match",
                    score=int(flow_result.breakdown.semanticScore),
                    status=(
                        "good"
                        if flow_result.breakdown.semanticScore >= 80
                        else ("warning" if flow_result.breakdown.semanticScore >= 60 else "poor")
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.semanticScore < 80
                        else ["Semantic content aligns well with the job."]
                    ),
                ),
                CategoryScore(
                    name="Formatting & Structure",
                    score=int(flow_result.breakdown.formattingScore),
                    status=(
                        "good"
                        if flow_result.breakdown.formattingScore >= 80
                        else ("warning" if flow_result.breakdown.formattingScore >= 60 else "poor")
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.formattingScore < 80
                        else ["Resume format is ATS-friendly."]
                    ),
                ),
            ],
            matched_keywords=getattr(flow_result.keywordMatches, "matched", []),
            missing_keywords=getattr(flow_result.keywordMatches, "missing", []),
        )

        return response_data

    except Exception as e:
        print(f"API Error in /ats-score endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while running the ATS analysis.",
        )


class JobMatchingRequest(BaseModel):
    candidate_profile: Dict[str, Any]
    job_description: str
    matching_preferences: Dict[str, Any] = Field(default_factory=dict)


class ContentOptimizationRequest(BaseModel):
    content: str
    target_role: str
    optimization_goals: List[str] = Field(default_factory=list)


class ResumeIntelligenceRequest(BaseModel):
    resume_content: str
    target_industry: Optional[str] = None
    career_goals: Optional[str] = None
    experience_level: str = "mid_level"


class OptimizeResumeRequest(BaseModel):
    job_description: str
    company_url: Optional[str] = None


class OptimizeResumeResponse(BaseModel):
    optimized_text: str


@router.post(
    "/job-matching",
    summary="Advanced Job Compatibility Analysis",
    tags=["Analysis"],
)
async def analyze_job_match(
    request: JobMatchingRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Analyze compatibility between candidate profile and job opportunity
    using advanced multi-dimensional matching algorithms.
    """
    try:
        result = cast(
            Dict[str, Any],
            await run_flow_async(
                analyze_job_match_detailed,
                **{
                    "job_description": request.job_description,
                    "candidate_profile": request.candidate_profile,
                },
            ),
        )
        return result
    except Exception as e:
        print(f"Job matching analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze job compatibility",
        )


@router.post(
    "/content-optimization",
    summary="Smart Content Optimization",
    tags=["Analysis"],
)
async def optimize_content(
    request: ContentOptimizationRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Optimize resume/cover letter content for specific target roles
    using AI-powered content enhancement.
    """
    try:
        result = cast(
            Dict[str, Any],
            await run_flow_async(
                optimize_content_for_job,
                **{
                    "content": request.content,
                    "job_description": request.target_role,
                    "content_type": "resume",
                    "optimization_goals": request.optimization_goals,
                },
            ),
        )
        return result
    except Exception as e:
        print(f"Content optimization error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to optimize content",
        )


@router.post(
    "/resume-intelligence",
    summary="Resume Intelligence Analysis",
    tags=["Analysis"],
)
async def generate_resume_intelligence(
    request: ResumeIntelligenceRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Generate comprehensive resume intelligence report with
    market readiness analysis and optimization recommendations.
    """
    try:
        result = cast(
            Dict[str, Any],
            await run_flow_async(
                generate_resume_intelligence_report,
                **{
                    "resume_content": request.resume_content,
                    "target_industry": request.target_industry,
                    "career_goals": request.career_goals,
                    "experience_level": request.experience_level,
                },
            ),
        )
        return result
    except Exception as e:
        print(f"Resume intelligence error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate resume intelligence report",
        )


@router.post(
    "/optimize-resume",
    response_model=OptimizeResumeResponse,
    summary="Optimize Resume with AI",
    tags=["Analysis"],
)
async def optimize_resume(
    request: OptimizeResumeRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> OptimizeResumeResponse:
    """
    Optimize a resume by incorporating missing keywords based on a job description.
    Optionally analyzes company website for targeted optimization.
    
    This endpoint:
    1. Runs ATS scoring to identify missing keywords
    2. Optionally scrapes and analyzes company website (if URL provided)
    3. Uses AI to naturally integrate keywords and match company tone
    
    Returns optimized resume text.
    """
    try:
        # For now, we'll need resume text from request
        # In production, this would fetch from Firestore document
        # TODO: Add document_id parameter and fetch from Firestore
        
        # Placeholder: Using resume_text from request for now
        resume_text = request.job_description  # TEMP: Replace with actual resume fetch
        
        # Step 1: Run ATS scoring to find missing keywords
        ats_result: AtsResult = await run_flow_async(
            atsScoring,
            **{
                "resumeText": resume_text,
                "jobDescription": request.job_description,
                "user_id": getattr(current_user, "uid", None),
            },
        )

        missing_keywords = getattr(
            getattr(ats_result, "keywordMatches", None), "missing", []
        )
        
        if not missing_keywords or len(missing_keywords) == 0:
            raise HTTPException(
                status_code=400,
                detail="No missing keywords found. Your resume is already well-aligned!",
            )

        # Step 2: Optional company analysis
        company_analysis_result: Optional[CompanyAnalysis] = None
        if request.company_url:
            try:
                company_analysis_result = await run_flow_async(
                    analyze_company_website,
                    **{"url": request.company_url},
                )
            except (ConnectionError, ValueError) as e:
                print(f"Warning: Company analysis failed: {e}")
                # Continue without company analysis

        # Step 3: Run optimizer flow
        optimizer_args = {
            "resumeText": resume_text,
            "missingKeywords": missing_keywords,
            "jobDescription": request.job_description,
        }
        
        if company_analysis_result:
            optimizer_args["company_keywords"] = company_analysis_result.company_keywords
            optimizer_args["company_tone"] = company_analysis_result.company_tone

        optimized_result: OptimizedResume = await run_flow_async(
            optimizeResume,
            **optimizer_args,
        )

        return OptimizeResumeResponse(optimized_text=optimized_result.resume_text)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Resume optimization error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during resume optimization: {str(e)}",
        )


@router.get("/", tags=["Analysis"])
async def get_analysis_data(current_user: Any = Depends(get_current_user)):
    """
    Get aggregated analysis data for the dashboard using real Firestore data and AI analysis.
    """
    from app.core.db import db
    from datetime import datetime, timedelta
    from collections import Counter
    
    # Initialize default response structure
    response = {
        "atsScoreHistory": [],
        "applicationStatus": [],
        "keywordMatch": [],
        "matchedKeywords": [],
        "missingKeywords": []
    }
    
    if not db:
        # Return mock data if database unavailable
        return {
            "atsScoreHistory": [{"month": 'Jan', "score": 82}],
            "applicationStatus": [{"name": 'Applied', "value": 1, "color": '#D0BCFF'}],
            "keywordMatch": [],
            "matchedKeywords": [],
            "missingKeywords": ["Database unavailable"]
        }
    
    try:
        # Fetch user's applications from Firestore
        apps_ref = db.collection("users").document(current_user.uid).collection("applications")
        applications = []
        for doc in apps_ref.stream():
            app_data = doc.to_dict()
            app_data["id"] = doc.id
            applications.append(app_data)
        
        # 1. Calculate Application Status Distribution
        status_counts = Counter(app.get("status", "applied") for app in applications)
        status_colors = {
            "applied": "#D0BCFF",
            "screening": "#A8C5A3", 
            "interviewing": "#A8C5A3",
            "offered": "#F4D06F",
            "rejected": "#E07A5F",
            "accepted": "#8A9A5B"
        }
        
        response["applicationStatus"] = [
            {
                "name": status.capitalize(),
                "value": count,
                "color": status_colors.get(status.lower(), "#CAC4D0")
            }
            for status, count in status_counts.items()
        ]
        
        # 2. Calculate ATS Score History (last 6 months)
        # Group applications by month and calculate average ATS scores
        now = datetime.now()
        monthly_scores = {}
        
        for app in applications:
            ats_score = app.get("atsScore")
            created_date = app.get("createdAt")
            
            if ats_score and created_date:
                # Parse date (handle both string and timestamp)
                if isinstance(created_date, str):
                    try:
                        app_date = datetime.fromisoformat(created_date.replace('Z', '+00:00'))
                    except:
                        continue
                else:
                    app_date = created_date
                
                month_key = app_date.strftime("%b")
                if month_key not in monthly_scores:
                    monthly_scores[month_key] = []
                monthly_scores[month_key].append(ats_score)
        
        # Generate last 6 months
        months = []
        for i in range(5, -1, -1):
            month_date = now - timedelta(days=30*i)
            month_key = month_date.strftime("%b")
            months.append(month_key)
        
        response["atsScoreHistory"] = [
            {
                "month": month,
                "score": int(sum(monthly_scores.get(month, [75])) / len(monthly_scores.get(month, [1])))
            }
            for month in months
        ]
        
        # 3. Aggregate Keyword Analysis from Applications
        all_matched_keywords = []
        all_missing_keywords = []
        keyword_frequency = Counter()
        
        for app in applications:
            # Extract keywords from application metadata
            if "atsAnalysis" in app:
                analysis = app["atsAnalysis"]
                matched = analysis.get("matchedKeywords", [])
                missing = analysis.get("missingKeywords", [])
                
                all_matched_keywords.extend(matched)
                all_missing_keywords.extend(missing)
                
                for keyword in matched:
                    keyword_frequency[keyword] += 1
        
        # Get top keywords by frequency
        top_keywords = keyword_frequency.most_common(5)
        response["keywordMatch"] = [
            {"keyword": keyword, "rate": count}
            for keyword, count in top_keywords
        ]
        
        # Get unique matched and missing keywords
        response["matchedKeywords"] = list(set(all_matched_keywords))[:8]
        response["missingKeywords"] = list(set(all_missing_keywords))[:7]
        
        # If no real data, provide helpful defaults
        if not response["matchedKeywords"]:
            response["matchedKeywords"] = ["No applications analyzed yet"]
        if not response["missingKeywords"]:
            response["missingKeywords"] = ["Upload applications to see keyword analysis"]
        
        return response
        
    except Exception as e:
        print(f"Error aggregating analysis data: {e}")
        # Return partial data on error
        return response
