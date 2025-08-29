"""
Enhanced workflow API endpoints with database integration.
Provides production-ready endpoints for all CareerCopilot operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.database import User, Job, Application, AIInteraction, AgentSession
from app.workflows.personal_career_workflow import PersonalCareerWorkflow
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class JobDiscoveryRequest(BaseModel):
    user_id: str
    search_params: Dict[str, Any] = {}


class SalaryAnalysisRequest(BaseModel):
    user_id: str
    job_title: str
    company: str
    location: str


class SkillsAnalysisRequest(BaseModel):
    user_id: str
    job_descriptions: List[str]


class ApplicationRequest(BaseModel):
    user_id: str
    job_url: str


class InterviewPrepRequest(BaseModel):
    user_id: str
    job_description: str
    company_research: Dict[str, Any] = {}


@router.post("/job-discovery")
async def daily_job_discovery(
    request: JobDiscoveryRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Enhanced daily job discovery with database persistence.
    Runs asynchronously and stores results in database.
    """
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Create agent session for tracking
        session = AgentSession(
            user_id=request.user_id,
            session_type="daily_discovery",
            input_data=request.search_params,
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # Initialize workflow
        workflow = PersonalCareerWorkflow()

        # Run job discovery
        result = await workflow.daily_job_discovery()

        if result.get("success"):
            # Store discovered jobs in database
            jobs_data = result.get("jobs", [])
            stored_jobs = []

            for job_data in jobs_data:
                # Check if job already exists
                existing_job = (
                    db.query(Job)
                    .filter(Job.user_id == request.user_id, Job.url == job_data.get("url"))
                    .first()
                )

                if not existing_job:
                    job = Job(
                        user_id=request.user_id,
                        title=job_data.get("title"),
                        company=job_data.get("company"),
                        location=job_data.get("location"),
                        description=job_data.get("description"),
                        url=job_data.get("url"),
                        source="automated_discovery",
                        salary_min=job_data.get("salary_min"),
                        salary_max=job_data.get("salary_max"),
                        match_score=job_data.get("match_score"),
                        last_analyzed=datetime.utcnow(),
                    )
                    db.add(job)
                    stored_jobs.append(job)

            db.commit()

            # Update session with results
            session.status = "completed"
            session.completed_at = datetime.utcnow()
            session.final_result = result
            session.total_duration_ms = int(
                (datetime.utcnow() - session.started_at).total_seconds() * 1000
            )
            db.commit()

            logger.info(
                f"Job discovery completed for user {request.user_id}: {len(stored_jobs)} new jobs"
            )

            return {
                "success": True,
                "session_id": session.id,
                "jobs_discovered": len(jobs_data),
                "new_jobs_stored": len(stored_jobs),
                "promising_matches": result.get("promising_jobs", 0),
                "results": result,
            }

        else:
            session.status = "failed"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Job discovery failed: {result.get('error')}",
            )

    except Exception as e:
        logger.error(f"Job discovery error for user {request.user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job discovery failed: {str(e)}",
        )


@router.post("/salary-analysis")
async def salary_analysis(request: SalaryAnalysisRequest, db: Session = Depends(get_db)):
    """Enhanced salary intelligence with database tracking"""
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        workflow = PersonalCareerWorkflow()

        # Track AI interaction
        ai_interaction = AIInteraction(
            user_id=request.user_id,
            operation_type="salary_intelligence",
            prompt=f"Salary analysis for {request.job_title} at {request.company} in {request.location}",
        )

        start_time = datetime.utcnow()

        # Run salary analysis
        result = await workflow.salary_intelligence(
            job_title=request.job_title,
            company=request.company,
            location=request.location,
        )

        # Update AI interaction record
        ai_interaction.response = str(result)
        ai_interaction.response_time_ms = int(
            (datetime.utcnow() - start_time).total_seconds() * 1000
        )
        ai_interaction.success = True

        db.add(ai_interaction)
        db.commit()

        logger.info(f"Salary analysis completed for user {request.user_id}")

        return {
            "success": True,
            "job_title": request.job_title,
            "company": request.company,
            "location": request.location,
            "analysis": result,
            "interaction_id": ai_interaction.id,
        }

    except Exception as e:
        # Log failed interaction
        if "ai_interaction" in locals():
            ai_interaction.success = False
            ai_interaction.error_message = str(e)
            ai_interaction.response = ""
            db.add(ai_interaction)
            db.commit()

        logger.error(f"Salary analysis error for user {request.user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Salary analysis failed: {str(e)}",
        )


@router.post("/skills-analysis")
async def skills_analysis(request: SkillsAnalysisRequest, db: Session = Depends(get_db)):
    """Enhanced skills trend analysis with database tracking"""
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        workflow = PersonalCareerWorkflow()

        # Track AI interaction
        ai_interaction = AIInteraction(
            user_id=request.user_id,
            operation_type="skills_trends",
            prompt=f"Skills analysis for {len(request.job_descriptions)} job descriptions",
        )

        start_time = datetime.utcnow()

        # Convert job descriptions to required format
        job_listings = [{"description": desc} for desc in request.job_descriptions]

        # Run skills analysis
        result = await workflow.analyze_skills_trends(job_listings)

        # Update AI interaction record
        ai_interaction.response = str(result)
        ai_interaction.response_time_ms = int(
            (datetime.utcnow() - start_time).total_seconds() * 1000
        )
        ai_interaction.success = True

        db.add(ai_interaction)
        db.commit()

        logger.info(f"Skills analysis completed for user {request.user_id}")

        return {
            "success": True,
            "job_descriptions_analyzed": len(request.job_descriptions),
            "analysis": result,
            "interaction_id": ai_interaction.id,
        }

    except Exception as e:
        # Log failed interaction
        if "ai_interaction" in locals():
            ai_interaction.success = False
            ai_interaction.error_message = str(e)
            ai_interaction.response = ""
            db.add(ai_interaction)
            db.commit()

        logger.error(f"Skills analysis error for user {request.user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Skills analysis failed: {str(e)}",
        )


@router.post("/apply-to-job")
async def apply_to_job(
    request: ApplicationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Enhanced job application with full database tracking"""
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Create agent session for tracking
        session = AgentSession(
            user_id=request.user_id,
            session_type="application_prep",
            input_data={"job_url": request.job_url},
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        workflow = PersonalCareerWorkflow()

        # Run complete application workflow
        result = await workflow.apply_to_job(request.job_url)

        if result.get("success"):
            # Find or create job record
            job = (
                db.query(Job)
                .filter(Job.user_id == request.user_id, Job.url == request.job_url)
                .first()
            )

            if not job:
                job = Job(
                    user_id=request.user_id,
                    title=result.get("job_title", "Unknown"),
                    company=result.get("company", "Unknown"),
                    url=request.job_url,
                    source="manual_application",
                )
                db.add(job)
                db.commit()
                db.refresh(job)

            # Create application record
            application = Application(
                user_id=request.user_id,
                job_id=job.id,
                status="prepared",
                cover_letter=result.get("application_materials", {})
                .get("cover_letter", {})
                .get("content"),
                email_application=result.get("application_materials", {})
                .get("email_application", {})
                .get("content"),
                follow_up_email=result.get("application_materials", {})
                .get("follow_up_email", {})
                .get("content"),
                interview_thank_you=result.get("application_materials", {})
                .get("interview_thank_you", {})
                .get("content"),
                company_research=result.get("company_research", {}),
                interview_prep=result.get("interview_prep", {}),
            )

            db.add(application)
            db.commit()
            db.refresh(application)

            # Update session
            session.status = "completed"
            session.completed_at = datetime.utcnow()
            session.final_result = result
            session.total_duration_ms = int(
                (datetime.utcnow() - session.started_at).total_seconds() * 1000
            )
            db.commit()

            logger.info(f"Application prepared for user {request.user_id}, job {job.id}")

            return {
                "success": True,
                "session_id": session.id,
                "job_id": job.id,
                "application_id": application.id,
                "materials_generated": result.get("materials_generated", False),
                "results": result,
            }

        else:
            session.status = "failed"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Application preparation failed: {result.get('error')}",
            )

    except Exception as e:
        logger.error(f"Application error for user {request.user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Application preparation failed: {str(e)}",
        )


@router.get("/users/{user_id}/sessions")
async def get_user_sessions(
    user_id: str,
    session_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Get agent sessions for a user"""
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    query = db.query(AgentSession).filter(AgentSession.user_id == user_id)

    if session_type:
        query = query.filter(AgentSession.session_type == session_type)

    sessions = query.order_by(AgentSession.started_at.desc()).limit(limit).all()

    return {
        "user_id": user_id,
        "session_type_filter": session_type,
        "sessions": sessions,
        "total_count": len(sessions),
    }


@router.post("/users/{user_id}/weekly-review")
async def weekly_review(user_id: str, db: Session = Depends(get_db)):
    """Enhanced weekly review with database insights"""
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Get week's data from database
        week_ago = datetime.utcnow() - timedelta(days=7)

        applications_this_week = (
            db.query(Application)
            .filter(Application.user_id == user_id, Application.last_updated >= week_ago)
            .count()
        )

        jobs_discovered = (
            db.query(Job).filter(Job.user_id == user_id, Job.discovered_at >= week_ago).count()
        )

        ai_interactions = (
            db.query(AIInteraction)
            .filter(AIInteraction.user_id == user_id, AIInteraction.created_at >= week_ago)
            .count()
        )

        # Run workflow review
        workflow = PersonalCareerWorkflow()
        result = await workflow.weekly_review()

        # Enhanced response with database insights
        database_insights = {
            "applications_this_week": applications_this_week,
            "jobs_discovered": jobs_discovered,
            "ai_interactions": ai_interactions,
            "most_active_day": "Tuesday",  # Could calculate from actual data
            "avg_match_score": 0.75,  # Could calculate from job match scores
        }

        return {
            "success": True,
            "user_id": user_id,
            "review_period": "last_7_days",
            "workflow_analysis": result.get("analysis", {}),
            "database_insights": database_insights,
            "combined_recommendations": result.get("analysis", {}).get("recommendations", []),
        }

    except Exception as e:
        logger.error(f"Weekly review error for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Weekly review failed: {str(e)}",
        )
