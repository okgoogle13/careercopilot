"""
Advanced Intelligence API endpoints with ML-powered market analysis.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging

from app.core.database import get_db
from app.models.database import User, MarketAnalysis
from app.ml.market_intelligence import JobMarketAnalyzer, SkillMatchingEngine
from app.agents.orchestrator import AgentOrchestrator
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class MarketAnalysisRequest(BaseModel):
    field: str
    location: str
    refresh_data: bool = False


class JobMatchRequest(BaseModel):
    user_id: str
    job_description: str


class WorkflowRequest(BaseModel):
    workflow_type: str
    user_id: str
    parameters: Dict[str, Any] = {}


@router.post("/market-analysis")
async def analyze_market_trends(request: MarketAnalysisRequest, db: Session = Depends(get_db)):
    """
    ML-powered comprehensive market trend analysis.
    Analyzes salary trends, skill demands, competition levels, and forecasts.
    """
    try:
        analyzer = JobMarketAnalyzer()

        logger.info(f"Starting market analysis for {request.field} in {request.location}")

        analysis = await analyzer.analyze_market_trends(
            field=request.field,
            location=request.location,
            refresh_data=request.refresh_data,
        )

        return {
            "success": True,
            "analysis": analysis,
            "metadata": {
                "analysis_type": "comprehensive_market_trends",
                "ml_powered": True,
                "data_sources": analysis.get("summary", {}).get("total_jobs_analyzed", 0),
            },
        }

    except Exception as e:
        logger.error(f"Market analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Market analysis failed: {str(e)}",
        )


@router.post("/job-match-analysis")
async def calculate_job_match(request: JobMatchRequest, db: Session = Depends(get_db)):
    """
    Advanced ML-based job matching with detailed compatibility analysis.
    """
    try:
        # Get user profile
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Build user profile for matching
        user_profile = {
            "skills": [],  # Could be extended to store user skills
            "experience_years": 3,  # Could be derived from user data
            "career_transition_from": user.career_transition_from or "finance",
            "career_transition_to": user.career_transition_to or "social_work",
            "target_roles": user.target_roles or [],
        }

        # Perform ML-based matching
        matching_engine = SkillMatchingEngine()
        match_analysis = await matching_engine.calculate_job_match_score(
            user_profile=user_profile, job_description=request.job_description
        )

        return {
            "success": True,
            "user_id": request.user_id,
            "match_analysis": match_analysis,
            "metadata": {
                "analysis_type": "ml_job_matching",
                "confidence": match_analysis.get("confidence", "medium"),
                "analysis_dimensions": ["skills", "experience", "background"],
            },
        }

    except Exception as e:
        logger.error(f"Job match analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job match analysis failed: {str(e)}",
        )


@router.post("/multi-agent-workflow")
async def run_multi_agent_workflow(request: WorkflowRequest, db: Session = Depends(get_db)):
    """
    Execute multi-agent workflow for advanced intelligence gathering.
    """
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Prepare workflow context
        workflow_context = {
            "user_id": request.user_id,
            "user_profile": {
                "career_transition_from": user.career_transition_from,
                "career_transition_to": user.career_transition_to,
                "location": user.location,
                "target_roles": user.target_roles,
                "salary_range": user.salary_range,
            },
            **request.parameters,
        }

        # Initialize orchestrator and run workflow
        orchestrator = AgentOrchestrator()

        logger.info(f"Starting {request.workflow_type} workflow for user {request.user_id}")

        results = await orchestrator.run_workflow(
            workflow_type=request.workflow_type, context=workflow_context
        )

        return {
            "success": True,
            "workflow_results": results,
            "metadata": {
                "workflow_type": request.workflow_type,
                "session_id": results.get("session_id"),
                "agents_used": results.get("agents_completed", []),
                "multi_agent": True,
            },
        }

    except Exception as e:
        logger.error(f"Multi-agent workflow failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Multi-agent workflow failed: {str(e)}",
        )


@router.get("/workflow-session/{session_id}")
async def get_workflow_session_status(session_id: str, db: Session = Depends(get_db)):
    """
    Get detailed status and results of a multi-agent workflow session.
    """
    try:
        orchestrator = AgentOrchestrator()
        session_status = orchestrator.get_session_status(session_id)

        if "error" in session_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=session_status["error"]
            )

        return {"success": True, "session_status": session_status}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get workflow session status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get session status: {str(e)}",
        )


@router.get("/market-insights")
async def get_market_insights(
    field: str = Query(..., description="Job field (e.g., social_work, finance)"),
    location: str = Query(..., description="Location (e.g., Melbourne, Sydney)"),
    days_back: int = Query(30, description="Days of historical data to analyze"),
    db: Session = Depends(get_db),
):
    """
    Get consolidated market insights from recent analyses.
    """
    try:
        # Get recent market analyses
        recent_analyses = (
            db.query(MarketAnalysis)
            .filter(MarketAnalysis.field == field, MarketAnalysis.location == location)
            .order_by(MarketAnalysis.analysis_date.desc())
            .limit(5)
            .all()
        )

        if not recent_analyses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No market analysis data found for {field} in {location}",
            )

        # Consolidate insights from multiple analyses
        latest_analysis = recent_analyses[0]

        consolidated_insights = {
            "summary": {
                "field": field,
                "location": location,
                "last_updated": latest_analysis.analysis_date,
                "total_analyses": len(recent_analyses),
                "data_confidence": "high" if len(recent_analyses) >= 3 else "medium",
            },
            "current_market": {
                "average_salary": latest_analysis.average_salary,
                "salary_range": latest_analysis.salary_range,
                "competition_level": latest_analysis.competition_level,
                "total_opportunities": latest_analysis.total_jobs_found,
            },
            "trending_skills": latest_analysis.top_skills[:5],
            "emerging_skills": latest_analysis.emerging_skills,
            "top_employers": latest_analysis.top_employers[:5],
            "forecast": latest_analysis.demand_forecast,
            "recommendations": [
                f"Average salary expectation: ${latest_analysis.average_salary:,}",
                f"Focus on developing: {', '.join(latest_analysis.emerging_skills[:3])}",
                f"Competition level is {latest_analysis.competition_level} - adjust strategy accordingly",
                f"Top hiring employers: {', '.join(latest_analysis.top_employers[:3])}",
            ],
            "historical_trend": {
                "analyses_available": len(recent_analyses),
                "trend_direction": "stable",  # Could calculate actual trend
                "market_growth": ("steady" if latest_analysis.total_jobs_found > 20 else "limited"),
            },
        }

        return {
            "success": True,
            "insights": consolidated_insights,
            "metadata": {
                "data_sources": len(recent_analyses),
                "analysis_type": "consolidated_market_insights",
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get market insights: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get market insights: {str(e)}",
        )


@router.get("/skill-trends")
async def analyze_skill_trends(
    field: str = Query(..., description="Job field to analyze"),
    location: str = Query(..., description="Location for analysis"),
    time_period: int = Query(90, description="Time period in days"),
    db: Session = Depends(get_db),
):
    """
    Advanced skill trend analysis across time periods.
    """
    try:
        # Get market analyses for trend analysis
        analyses = (
            db.query(MarketAnalysis)
            .filter(MarketAnalysis.field == field, MarketAnalysis.location == location)
            .order_by(MarketAnalysis.analysis_date.desc())
            .limit(10)
            .all()
        )

        if not analyses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No historical data available for skill trend analysis",
            )

        # Analyze skill trends over time
        skill_evolution = {}
        for analysis in reversed(analyses):  # Oldest first
            for skill in analysis.top_skills:
                if skill not in skill_evolution:
                    skill_evolution[skill] = []

                # Get skill frequency from skill_frequency dict
                frequency = (
                    analysis.skill_frequency.get(skill, 0) if analysis.skill_frequency else 0
                )
                skill_evolution[skill].append(
                    {
                        "date": analysis.analysis_date,
                        "frequency": frequency,
                        "rank": (
                            analysis.top_skills.index(skill) + 1
                            if skill in analysis.top_skills
                            else None
                        ),
                    }
                )

        # Identify trending skills
        trending_up = []
        trending_down = []

        for skill, evolution in skill_evolution.items():
            if len(evolution) >= 2:
                recent_freq = evolution[-1]["frequency"]
                older_freq = evolution[0]["frequency"]

                if recent_freq > older_freq * 1.2:  # 20% increase
                    trending_up.append(
                        {
                            "skill": skill,
                            "growth_rate": f"{((recent_freq / older_freq - 1) * 100):.1f}%",
                        }
                    )
                elif recent_freq < older_freq * 0.8:  # 20% decrease
                    trending_down.append(
                        {
                            "skill": skill,
                            "decline_rate": f"{((1 - recent_freq / older_freq) * 100):.1f}%",
                        }
                    )

        return {
            "success": True,
            "skill_trends": {
                "field": field,
                "location": location,
                "analysis_period": f"{time_period} days",
                "trending_up": trending_up[:5],
                "trending_down": trending_down[:3],
                "stable_skills": [
                    skill
                    for skill in skill_evolution.keys()
                    if skill not in [s["skill"] for s in trending_up + trending_down]
                ][:5],
                "current_top_skills": analyses[0].top_skills[:10],
                "emerging_skills": analyses[0].emerging_skills,
                "recommendations": [
                    (
                        f"Focus on developing {trending_up[0]['skill']} - growing {trending_up[0]['growth_rate']}"
                        if trending_up
                        else "Continue developing core skills"
                    ),
                    "Consider obtaining certifications in emerging skill areas",
                    "Highlight stable skills that remain consistently in demand",
                ],
            },
            "metadata": {
                "analyses_used": len(analyses),
                "skills_tracked": len(skill_evolution),
                "confidence": "high" if len(analyses) >= 5 else "medium",
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Skill trend analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Skill trend analysis failed: {str(e)}",
        )
