from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.database import User, Job
from app.genkit_flows.calendar_manager import createCalendarEvent
from app.genkit_flows.chrome_extension_flow import analyzeJobPostingFlow
from app.schemas.chrome_extension import JobPostingData, JobAnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=JobAnalysisResponse)
async def analyze_job_posting(
    job_data: JobPostingData, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze a job posting using Genkit, save it to the dashboard, 
    and create calendar reminders if a deadline is found.
    """
    try:
        # 1. Call Genkit Flow
        output = await analyzeJobPostingFlow(job_data)
        
        # 2. Convert structured output to Markdown for the frontend/extension
        analysis_text = _format_output_as_markdown(output)
        
        # 3. Save to Database
        new_job = Job(
            user_id=current_user.id,
            title=job_data.title,
            company=job_data.company or "Unknown",
            description=job_data.description,
            url=job_data.url,
            location=job_data.location,
            source="chrome_extension",
            analysis_summary=analysis_text,
            match_score=output.match_score,
        )
        
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
        
        job_id = str(new_job.id)
        
        # 4. Create Calendar Event (Background Task)
        if output.deadline:
            job_dict = new_job.to_dict()
            job_dict["deadline"] = output.deadline
            background_tasks.add_task(
                _create_calendar_entry, 
                current_user.id, 
                job_dict
            )

        return JobAnalysisResponse(
            success=True,
            markdown_analysis=analysis_text,
            job_id=job_id,
            job_saved=True,
            deadline_found=output.deadline
        )

    except Exception as e:
        logger.error(f"Error in analyze_job_posting: {e}")
        return JobAnalysisResponse(
            success=False,
            markdown_analysis=f"### Error\n\nFailed to analyze job: {str(e)}",
            job_saved=False
        )

def _format_output_as_markdown(output: Any) -> str:
    """Helper to convert structured flow output to markdown for display"""
    md = f"## Job Analysis\n\n"
    md += f"### Overall Fit Score: {output.overall_fit_score}%\n\n"
    
    md += "### Matching Qualifications\n"
    for q in output.matching_qualifications:
        md += f"- {q}\n"
    md += "\n"
    
    md += "### Gaps & Development Areas\n"
    for g in output.gaps_and_development_areas:
        md += f"- {g}\n"
    md += "\n"
    
    md += "### Key Selling Points\n"
    for s in output.key_selling_points:
        md += f"- {s}\n"
    md += "\n"
    
    md += f"### Application Strategy\n{output.application_strategy}\n\n"
    
    if output.deadline:
        md += f"**Deadline Found:** {output.deadline}\n"
    if output.is_remote:
        md += f"**Note:** Remote work opportunity identified.\n"
        
    return md

async def _create_calendar_entry(user_id: str, job_details: dict):
    """
    Wrapper to call the calendar manager safely
    """
    try:
        from app.core.loguru_config import get_logger
        logger = get_logger(__name__)
        logger.info(f"📅 Creating calendar event for job: {job_details.get('title')}")
        await createCalendarEvent(user_id, job_details)
        logger.info("✅ Calendar event created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create calendar event: {e}")

import logging
logger = logging.getLogger(__name__)
