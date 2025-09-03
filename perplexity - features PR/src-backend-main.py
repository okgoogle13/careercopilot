"""
Personal CareerCopilot FastAPI Application
Simple web interface for personal job search automation
"""

import asyncio
import logging
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from personal_workflow import PersonalCareerWorkflow
from config.personal_config import get_personal_config
from src.backend.utils.logging_config import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CareerCopilot Personal Edition",
    description="Personal AI-powered job search automation",
    version="1.0.0",
    docs_url="/docs",  # Swagger documentation
    redoc_url="/redoc"
)

# Mount static files and templates
app.mount("/static", StaticFiles(directory="src/frontend/static"), name="static")
templates = Jinja2Templates(directory="src/frontend/templates")

# Global instances
workflow = PersonalCareerWorkflow()
config = get_personal_config()

# Pydantic models for API requests
class JobApplicationRequest(BaseModel):
    job_url: str
    custom_message: Optional[str] = None

class CompanyResearchRequest(BaseModel):
    job_url: str

class ConfigUpdateRequest(BaseModel):
    daily_job_scan: Optional[bool] = None
    email_notifications: Optional[bool] = None
    target_roles: Optional[List[str]] = None

# Root endpoint - serve the main dashboard
@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """Main dashboard page"""

    # Get recent activity summary
    try:
        summary_data = {
            "user_name": config.name,
            "location": config.location,
            "career_transition": f"{config.career_transition_from} → {config.career_transition_to}",
            "target_roles": config.target_roles[:5],
            "daily_scan_enabled": config.daily_job_scan,
            "last_scan": "This morning",  # Would come from database
            "applications_this_week": 3,  # Would come from database
            "response_rate": "15%"  # Would come from database
        }

        return templates.TemplateResponse(
            "dashboard.html",
            {"request": request, "data": summary_data}
        )

    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        raise HTTPException(status_code=500, detail="Dashboard loading failed")

# API Endpoints

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "user": config.name,
        "version": "1.0.0"
    }

@app.post("/api/daily-scan")
async def trigger_daily_scan(background_tasks: BackgroundTasks):
    """Trigger daily job discovery scan"""

    logger.info("Daily scan triggered via API")

    try:
        # Run scan in background
        background_tasks.add_task(run_daily_scan_background)

        return {
            "status": "started",
            "message": "Daily job scan started in background",
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Failed to start daily scan: {e}")
        raise HTTPException(status_code=500, detail="Failed to start daily scan")

@app.post("/api/apply")
async def apply_to_job(request: JobApplicationRequest, background_tasks: BackgroundTasks):
    """Apply to a specific job with full automation"""

    logger.info(f"Job application requested: {request.job_url}")

    try:
        # Validate URL
        if not request.job_url.startswith(("http://", "https://")):
            raise HTTPException(status_code=400, detail="Invalid job URL")

        # Start application process in background
        background_tasks.add_task(
            process_job_application_background,
            request.job_url,
            request.custom_message
        )

        return {
            "status": "started",
            "message": "Application preparation started",
            "job_url": request.job_url,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Job application failed: {e}")
        raise HTTPException(status_code=500, detail="Job application failed")

@app.post("/api/research")
async def research_company(request: CompanyResearchRequest):
    """Research company from job URL"""

    logger.info(f"Company research requested: {request.job_url}")

    try:
        # Validate URL
        if not request.job_url.startswith(("http://", "https://")):
            raise HTTPException(status_code=400, detail="Invalid job URL")

        # Execute research
        research_results = await workflow.quick_company_research(request.job_url)

        return {
            "status": "success",
            "data": research_results,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Company research failed: {e}")
        raise HTTPException(status_code=500, detail="Company research failed")

@app.post("/api/weekly-review")
async def trigger_weekly_review(background_tasks: BackgroundTasks):
    """Trigger weekly application review"""

    logger.info("Weekly review triggered via API")

    try:
        # Run review in background
        background_tasks.add_task(run_weekly_review_background)

        return {
            "status": "started",
            "message": "Weekly review started in background",
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Failed to start weekly review: {e}")
        raise HTTPException(status_code=500, detail="Failed to start weekly review")

@app.get("/api/status")
async def get_system_status():
    """Get current system status and recent activity"""

    try:
        # In a real implementation, this would query the database
        status_data = {
            "user": {
                "name": config.name,
                "email": config.email,
                "location": config.location
            },
            "automation": {
                "daily_scan": config.daily_job_scan,
                "email_notifications": config.email_notifications,
                "last_scan": "2025-08-23T09:00:00Z",  # From database
            },
            "activity": {
                "jobs_found_today": 12,  # From database
                "applications_this_week": 3,  # From database
                "pending_responses": 5,  # From database
            },
            "next_actions": [
                "Review prepared materials for Software Engineer at TechCorp",
                "Follow up on application to Community Services Melbourne",
                "Complete skills assessment for Mental Health Worker role"
            ]
        }

        return {
            "status": "success",
            "data": status_data,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail="Status check failed")

@app.get("/api/applications")
async def get_applications(limit: int = 10):
    """Get recent job applications"""

    try:
        # In real implementation, query from Firebase
        applications = [
            {
                "id": "app_001",
                "job_title": "Social Worker",
                "company": "Melbourne Community Health",
                "applied_date": "2025-08-20",
                "status": "applied",
                "match_score": 0.85
            },
            {
                "id": "app_002",
                "job_title": "Case Manager",
                "company": "Youth Support Services",
                "applied_date": "2025-08-18",
                "status": "interview_scheduled",
                "match_score": 0.92
            }
        ]

        return {
            "status": "success",
            "data": applications[:limit],
            "total": len(applications),
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Applications fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch applications")

@app.put("/api/config")
async def update_config(request: ConfigUpdateRequest):
    """Update personal configuration"""

    logger.info("Configuration update requested")

    try:
        # Update configuration
        updates = {}

        if request.daily_job_scan is not None:
            updates["daily_job_scan"] = request.daily_job_scan

        if request.email_notifications is not None:
            updates["email_notifications"] = request.email_notifications

        if request.target_roles is not None:
            updates["target_roles"] = request.target_roles

        # In real implementation, save to database and update config
        logger.info(f"Configuration updates: {updates}")

        return {
            "status": "success",
            "message": "Configuration updated successfully",
            "updates": updates,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Configuration update failed: {e}")
        raise HTTPException(status_code=500, detail="Configuration update failed")

# Background task functions
async def run_daily_scan_background():
    """Background task for daily job scanning"""

    try:
        logger.info("Starting background daily scan")
        results = await workflow.daily_job_discovery()
        logger.info(f"Background daily scan completed: {results['total_jobs_found']} jobs found")

    except Exception as e:
        logger.error(f"Background daily scan failed: {e}")

async def process_job_application_background(job_url: str, custom_message: Optional[str]):
    """Background task for job application processing"""

    try:
        logger.info(f"Starting background job application for: {job_url}")
        results = await workflow.apply_to_job(job_url, custom_message)
        logger.info(f"Background job application completed: {results['company']}")

    except Exception as e:
        logger.error(f"Background job application failed: {e}")

async def run_weekly_review_background():
    """Background task for weekly review"""

    try:
        logger.info("Starting background weekly review")
        results = await workflow.weekly_review()
        logger.info(f"Background weekly review completed: {results['applications_reviewed']} applications reviewed")

    except Exception as e:
        logger.error(f"Background weekly review failed: {e}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    """Custom 404 handler"""
    return templates.TemplateResponse(
        "error.html",
        {"request": request, "error_code": 404, "error_message": "Page not found"},
        status_code=404
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: HTTPException):
    """Custom 500 handler"""
    return templates.TemplateResponse(
        "error.html",
        {"request": request, "error_code": 500, "error_message": "Internal server error"},
        status_code=500
    )

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""

    logger.info("=== CareerCopilot Personal Edition Starting ===")
    logger.info(f"User: {config.name}")
    logger.info(f"Location: {config.location}")
    logger.info(f"Daily automation: {'Enabled' if config.daily_job_scan else 'Disabled'}")

    # Initialize workflow components
    await workflow.initialize_user_profile()

    logger.info("=== Startup Complete ===")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on application shutdown"""

    logger.info("=== CareerCopilot Personal Edition Shutting Down ===")

    # Clean up resources if needed
    # await workflow.cleanup()

    logger.info("=== Shutdown Complete ===")

# Development server
if __name__ == "__main__":
    # Configuration for development
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )

    # For production, use:
    # uvicorn main:app --host 0.0.0.0 --port 8000
