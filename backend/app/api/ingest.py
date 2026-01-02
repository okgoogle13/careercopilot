from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import logging
from app.services.google_workspace import GoogleWorkspaceService
from app.services.job_store import get_job_store
from app.core.security import get_current_user_id, get_current_user_optional

router = APIRouter()
logger = logging.getLogger(__name__)


class JobClipRequest(BaseModel):
    url: str
    source: str = "browser_extension"
    notes: Optional[str] = None
    # user_id will be injected from authentication, not from request body

class JobQueueItem(BaseModel):
    id: str
    title: str
    company: str
    url: str
    status: str  # "pending_analysis", "ready_to_apply", "applied"
    date_clipped: str
    notes: Optional[str] = None

async def process_job_clip(payload: JobClipRequest, job_store):
    """
    Background task to:
    1. Save job to Firestore
    2. Create Google Task & Calendar Event
    """
    logger.info(f"[*] INGESTION STARTED: {payload.url}")
    logger.info(f"[*] NOTES: {payload.notes}")
    
    # Create job item
    job_item = {
        "title": "Pending Analysis",  # Will be extracted by JobScout
        "company": "Unknown",  # Will be extracted by JobScout
        "url": payload.url,
        "status": "pending_analysis",
        "date_clipped": datetime.now().isoformat(),
        "notes": payload.notes or "",
        "source": payload.source,
        "user_id": payload.user_id  # For multi-user support
    }
    
    # Save to Firestore (or in-memory fallback)
    try:
        job_id = await job_store.add_job(job_item)
        logger.info(f"[+] Job {job_id} saved to {job_store.get_storage_mode()} storage")
    except Exception as e:
        logger.error(f"[!] Failed to save job: {e}")
        raise
    
    # --- GOOGLE WORKSPACE INTEGRATION ---
    try:
        gw = GoogleWorkspaceService()
        
        # 1. Create a Task to apply
        await gw.create_task(
            title=f"Apply: New Opportunity via {payload.source}",
            notes=f"URL: {payload.url}\n\nUser Notes: {payload.notes or 'No notes'}"
        )
        
        # 2. Block time tomorrow to do the work
        await gw.schedule_deep_work(
            summary=f"Application Prep: {payload.url[:50]}...",
            duration_minutes=45
        )
        
        logger.info("[+] Google Workspace integration: Task and calendar event created")
        
    except Exception as e:
        logger.warning(f"[!] Google Workspace integration failed (non-critical): {e}")
    # -----------------------------------------
    
    logger.info(f"[SUCCESS] Job {job_id} queued for processing: {payload.url}")

@router.post("/clip")
async def clip_job(
    payload: JobClipRequest, 
    background_tasks: BackgroundTasks,
    user_id: Optional[str] = Depends(get_current_user_optional)  # OPTIONAL AUTH
):
    """
    Receives job URLs from the Chrome Extension.
    Saves to Firestore and creates Google Workspace tasks.
    
    **Authentication:** Optional. Works for single-user or multi-user deployments.
    """
    job_store = get_job_store()
    # Use authenticated user_id if provided, otherwise use "default" for single-user
    payload.user_id = user_id or "default"
    background_tasks.add_task(process_job_clip, payload, job_store)
    logger.info(f"[API] Job clip accepted for user {payload.user_id}")
    return {
        "status": "accepted", 
        "message": "Job sent to CareerCopilot.",
        "storage_mode": job_store.get_storage_mode(),
        "user_id": payload.user_id
    }

@router.get("/queue", response_model=List[JobQueueItem])
async def get_job_queue(
    user_id: Optional[str] = Depends(get_current_user_optional)  # OPTIONAL AUTH
):
    """
    Retrieves the list of clipped jobs from Firestore.
    
    **Authentication:** Optional. If no auth, returns all jobs (single-user mode).
    If authenticated, returns only user's jobs (multi-user mode).
    """
    job_store = get_job_store()
    
    try:
        # Use "default" for single-user, or actual user_id for multi-user
        filter_user_id = user_id or "default"
        jobs = await job_store.get_all_jobs(user_id=filter_user_id)
        logger.info(f"[API] Retrieved {len(jobs)} jobs for user {filter_user_id} from {job_store.get_storage_mode()} storage")
        return jobs
    except Exception as e:
        logger.error(f"[API] Failed to retrieve jobs: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve job queue: {str(e)}")

@router.post("/{job_id}/analyze")
async def trigger_analysis(
    job_id: str,
    user_id: Optional[str] = Depends(get_current_user_optional)  # OPTIONAL AUTH
):
    """
    Triggers the JobScout agent to analyze a specific job.
    Updates the job record in Firestore with extracted data.
    
    **Authentication:** Optional (single-user friendly).
    """
    effective_user_id = user_id or "default"
    logger.info(f"[API] Analyze request for job ID: {job_id} from user {effective_user_id}")
    
    job_store = get_job_store()
    
    # 1. Find the job in storage
    job = await job_store.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found in storage")
    
    # 2. Optional ownership check (only in multi-user mode)
    if user_id and job.get("user_id") != user_id:
        logger.warning(f"[SECURITY] User {user_id} attempted to analyze job {job_id} owned by {job.get('user_id')}")
        raise HTTPException(status_code=403, detail="You do not have permission to analyze this job")
    
    job_url = job["url"]
    logger.info(f"[API] Found job: {job_url}")
    
    # 2. Run JobScout Agent
    try:
        from app.agents.job_scout import JobScoutAgent
        
        agent = JobScoutAgent()
        analysis_result = await agent.analyze_job_content(job_url)
        
        if not analysis_result:
            raise HTTPException(status_code=500, detail="Analysis failed - agent returned no data")
        
        # 3. Update Job Record in Firestore
        updates = {
            "title": analysis_result.get("title", job["title"]),
            "company": analysis_result.get("company", job["company"]),
            "salary": analysis_result.get("salary", "Not specified"),
            "deadline": analysis_result.get("deadline"),
            "status": analysis_result.get("status", "ready_to_apply"),
            "last_analyzed": datetime.now().isoformat()
        }
        
        await job_store.update_job(job_id, updates)
        
        logger.info(f"[API] ✓ Job {job_id} analysis complete: {updates['title']} at {updates['company']}")
        
        return {
            "status": "success",
            "message": f"Analyzed {updates['title']} at {updates['company']}",
            "data": analysis_result,
            "storage_mode": job_store.get_storage_mode()
        }
        
    except Exception as e:
        logger.error(f"[API] Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@router.post("/{job_id}/draft")
async def draft_cover_letter(
    job_id: str, 
    create_google_doc: bool = False,
    user_id: Optional[str] = Depends(get_current_user_optional)  # OPTIONAL AUTH
):
    """
    Generates a tailored cover letter for a specific job using the Ghostwriter agent.
    Optionally creates a Google Doc with the cover letter.
    Saves the cover letter to Firestore.
    
    **Authentication:** Optional (single-user friendly).
    
    Args:
        job_id: The ID of the job to draft a cover letter for
        create_google_doc: If True, attempts to create a Google Doc
        user_id: Optional authenticated user ID
        
    Returns:
        Dict containing the generated cover letter and metadata
    """
    effective_user_id = user_id or "default"
    logger.info(f"[API] Draft cover letter request for job ID: {job_id} from user {effective_user_id}")
    
    job_store = get_job_store()
    
    # 1. Find the job in storage
    job = await job_store.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found in storage")
    
    # 2. Optional ownership check (only in multi-user mode)
    if user_id and job.get("user_id") != user_id:
        logger.warning(f"[SECURITY] User {user_id} attempted to draft for job {job_id} owned by {job.get('user_id')}")
        raise HTTPException(status_code=403, detail="You do not have permission to draft cover letter for this job")
    
    # 2. Ensure job has been analyzed
    if job.get("status") == "pending_analysis":
        raise HTTPException(
            status_code=400, 
            detail="Job must be analyzed before drafting. Please run 'Analyze with JobScout' first."
        )
    
    logger.info(f"[API] Drafting cover letter for: {job.get('title')} at {job.get('company')}")
    
    # 3. Run Ghostwriter Agent
    try:
        from app.agents.ghostwriter import GhostwriterAgent
        
        agent = GhostwriterAgent()
        cover_letter = await agent.generate_cover_letter(job)
        
        if not cover_letter or len(cover_letter) < 50:
            raise HTTPException(status_code=500, detail="Cover letter generation failed - insufficient content")
        
        logger.info(f"[API] ✓ Cover letter drafted: {len(cover_letter)} characters")
        
        # 4. Save cover letter to Firestore
        cover_letter_data = {
            "cover_letter": cover_letter,
            "cover_letter_generated_at": datetime.now().isoformat(),
            "word_count": len(cover_letter.split()),
            "character_count": len(cover_letter)
        }
        
        await job_store.update_job(job_id, cover_letter_data)
        logger.info(f"[API] ✓ Cover letter saved to {job_store.get_storage_mode()} storage")
        
        # 5. Optionally create Google Doc
        google_doc_info = None
        if create_google_doc:
            try:
                gw = GoogleWorkspaceService()
                doc_title = f"Cover Letter - {job.get('title')} at {job.get('company')}"
                google_doc_info = await gw.create_doc(doc_title, cover_letter)
                
                if google_doc_info and google_doc_info.get("status") == "success":
                    logger.info(f"[API] ✓ Google Doc created: {google_doc_info.get('webViewLink')}")
                    # Save Google Doc link to Firestore
                    await job_store.update_job(job_id, {"google_doc_url": google_doc_info.get('webViewLink')})
                elif google_doc_info and google_doc_info.get("status") == "credentials_missing":
                    logger.warning("[API] Google Docs integration skipped - no credentials")
                    
            except Exception as e:
                logger.warning(f"[API] Google Doc creation failed (non-critical): {e}")
                # Don't fail the whole request if Google Docs fails
        
        response_data = {
            "cover_letter": cover_letter,
            "job_title": job.get("title"),
            "company": job.get("company"),
            "word_count": len(cover_letter.split()),
            "character_count": len(cover_letter),
            "storage_mode": job_store.get_storage_mode()
        }
        
        if google_doc_info:
            response_data["google_doc"] = google_doc_info
        
        return {
            "status": "success",
            "message": f"Cover letter drafted for {job.get('title')} at {job.get('company')}",
            "data": response_data
        }
        
    except Exception as e:
        logger.error(f"[API] Cover letter generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Draft error: {str(e)}")


@router.get("/storage/status")
async def get_storage_status():
    """
    Get information about the current storage backend.
    Useful for debugging and monitoring.
    """
    job_store = get_job_store()
    stats = job_store.get_stats()
    
    return {
        "status": "ok",
        "storage": stats,
        "message": f"Using {stats['mode']} storage"
    }


