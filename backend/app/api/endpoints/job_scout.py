import logging

from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.job_scout import JobScoutAgent
from app.api.endpoints._shared import run_endpoint

logger = logging.getLogger(__name__)

router = APIRouter()


class JobSearchRequest(BaseModel):
    query: str
    location: str | None = "Australia"


class JobScoutResponse(BaseModel):
    found_links: list[str]
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

    async def operation() -> JobScoutResponse:
        agent = JobScoutAgent()
        links = await agent.search_jobs(request.query, request.location or "Australia")

        return JobScoutResponse(
            found_links=links, message=f"Successfully found {len(links)} potential job links."
        )

    return await run_endpoint(
        operation,
        "Job search failed",
        logger=logger,
    )
