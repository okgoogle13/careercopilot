
<<<<<<< HEAD
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import logging

=======
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.agents.job_scout import JobScoutAgent

logger = logging.getLogger(__name__)

router = APIRouter()

class JobSearchRequest(BaseModel):
    query: str
<<<<<<< HEAD
    location: Optional[str] = "Australia"

class JobScoutResponse(BaseModel):
    found_links: List[str]
=======
    location: str | None = "Australia"

class JobScoutResponse(BaseModel):
    found_links: list[str]
>>>>>>> restoration-KR-Rage-Figma-v2.0
    message: str

# Instantiate the agent globally or per request
# Since Playwright has some state/startup cost, a global or dependency injection approach is preferred.
# For now, we instantiate per request but the PlaywrightService might tackle management.
# Ideally, PlaywrightService should be a singleton or managed resource.

@router.post("/search", response_model=JobScoutResponse)
async def search_jobs(request: JobSearchRequest):
    """
    Triggers the JobScout Agent to search for jobs based on the query.
    """
    logger.info(f"Received job search request: {request.query} in {request.location}")
<<<<<<< HEAD
    
    try:
        agent = JobScoutAgent()
        links = await agent.search_jobs(request.query, request.location)
        
=======

    try:
        agent = JobScoutAgent()
        links = await agent.search_jobs(request.query, request.location)

>>>>>>> restoration-KR-Rage-Figma-v2.0
        return JobScoutResponse(
            found_links=links,
            message=f"Successfully found {len(links)} potential job links."
        )
    except Exception as e:
        logger.error(f"Job search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
