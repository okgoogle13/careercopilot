from typing import Optional

from app.core.db import db
from app.core.dependencies import get_current_user
from app.genkit_flows.calendar_manager import createCalendarEvent
from app.genkit_flows.email_scanner import scanEmailsForJobOpportunities
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()


class CalendarEventRequest(BaseModel):
    opportunity_id: str
    title: str
    company: str
    deadline: str
    timezone: Optional[str] = "America/Los_Angeles"


class JobDiscoveryRequest(BaseModel):
    auto_scan: Optional[bool] = True
    max_emails: Optional[int] = 50


@router.get("/")
async def list_opportunities(uid: str = Depends(get_current_user)):
    """
    Lists all job opportunities found for the authenticated user.
    """
    try:
        opportunities_ref = db.collection("opportunities")
        # Create a query against the collection
        query = opportunities_ref.where("user_id", "==", uid).order_by(
            "found_at", direction="DESCENDING"
        )

        docs = query.stream()

        opportunities = []
        for doc in docs:
            opportunity_data = doc.to_dict()
            opportunity_data["id"] = doc.id
            opportunities.append(opportunity_data)

        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@router.post("/discover")
async def discover_opportunities(
    request: JobDiscoveryRequest, uid: str = Depends(get_current_user)
):
    """
    Triggers automatic job discovery by scanning emails for new opportunities.
    """
    try:
        # Trigger email scanning for job opportunities
        result = await scanEmailsForJobOpportunities(uid)

        return {
            "success": True,
            "message": "Job discovery completed successfully",
            "opportunities_found": result.get("opportunities_found", 0),
            "scan_summary": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job discovery failed: {e}")


@router.post("/calendar/create")
async def create_calendar_event(
    request: CalendarEventRequest, uid: str = Depends(get_current_user)
):
    """
    Creates a calendar event for a job opportunity deadline.
    """
    try:
        opportunity_data = {
            "title": request.title,
            "company": request.company,
            "deadline": request.deadline,
        }

        # Create the calendar event
        event_id = await createCalendarEvent(uid, opportunity_data)

        # Update the opportunity document with calendar event ID
        opportunity_ref = db.collection("opportunities").document(request.opportunity_id)
        opportunity_ref.update({"calendarEventId": event_id, "calendar_synced": True})

        return {
            "success": True,
            "event_id": event_id,
            "message": "Calendar event created successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calendar event creation failed: {e}")


@router.get("/stats")
async def get_opportunity_stats(uid: str = Depends(get_current_user)):
    """
    Returns statistics about job opportunities for the user.
    """
    try:
        opportunities_ref = db.collection("opportunities")
        query = opportunities_ref.where("user_id", "==", uid)

        docs = list(query.stream())
        total_opportunities = len(docs)

        # Count opportunities with calendar events
        calendar_synced = sum(1 for doc in docs if doc.to_dict().get("calendar_synced", False))

        # Count opportunities from last 7 days
        from datetime import datetime, timedelta

        week_ago = datetime.now() - timedelta(days=7)
        recent_opportunities = sum(
            1
            for doc in docs
            if doc.to_dict().get("found_at") and doc.to_dict()["found_at"] > week_ago
        )

        return {
            "total_opportunities": total_opportunities,
            "calendar_synced": calendar_synced,
            "recent_opportunities": recent_opportunities,
            "sync_percentage": (
                (calendar_synced / total_opportunities * 100) if total_opportunities > 0 else 0
            ),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {e}")
