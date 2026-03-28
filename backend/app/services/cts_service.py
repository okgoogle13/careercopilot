"""
Google Cloud Talent Solution (CTS) Service for CareerCopilot.
Provides structured job search and discovery using the CTS v4 API.
"""

import logging
from typing import Any, Dict, List, Optional

from google.cloud import talent_v4 as talent

from app.core.config import settings

logger = logging.getLogger(__name__)


class CTSService:
    """
    Wrapper for Google Cloud Talent Solution v4 API.
    Handles job search, discovery, and metadata extraction.
    """

    def __init__(self):
        try:
            self.job_client = talent.JobServiceClient()
            self.tenant_client = talent.TenantServiceClient()
            self.project_id = settings.google_cloud_project or settings.gcp_project_id
            self.tenant_id = settings.cts_tenant_id

            if not self.project_id:
                logger.warning("GCP Project ID not configured; CTS Service may fail.")
        except Exception as e:
            logger.error(f"Failed to initialize CTS clients: {e}")
            raise

    def get_parent(self) -> str:
        """Returns the resource name of the tenant."""
        return f"projects/{self.project_id}/tenants/{self.tenant_id}"

    async def search_jobs(
        self,
        query: str,
        location: Optional[str] = None,
        distance_miles: int = 50,
        page_size: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Performs a job search within the configured tenant.

        Args:
            query: Keywords or job title to search for.
            location: Optional location string (e.g., "Melbourne, VIC").
            distance_miles: Search radius in miles.
            page_size: Number of results to return.

        Returns:
            List of dictionaries containing job details.
        """
        parent = self.get_parent()

        # 1. Build Request
        request = talent.SearchJobsRequest(
            parent=parent,
            search_mode=talent.SearchJobsRequest.SearchMode.JOB_SEARCH,
            request_metadata=talent.RequestMetadata(
                user_id="careercopilot-system-scout",
                session_id="scout-session",
                domain="careercopilot.ai",
            ),
            job_query=talent.JobQuery(query=query),
            max_page_size=page_size,
        )

        if location:
            request.job_query.location_filters.append(
                talent.LocationFilter(address=location, distance_in_miles=distance_miles)
            )

        # 2. Execute Search
        try:
            logger.info(f"Searching CTS for '{query}' in {location or 'anywhere'}...")
            response = self.job_client.search_jobs(request=request)

            job_results = []
            for result in response.matching_jobs:
                job = result.job
                job_results.append(
                    {
                        "id": job.name.split("/")[-1],
                        "name": job.name,
                        "title": job.title,
                        "company": job.company,
                        "description": job.description,
                        "application_info": {
                            "uris": (
                                list(job.application_info.uris) if job.application_info.uris else []
                            )
                        },
                        "posting_publish_time": (
                            job.posting_publish_time.isoformat()
                            if job.posting_publish_time
                            else None
                        ),
                        "requisition_id": job.requisition_id,
                    }
                )

            logger.info(f"CTS found {len(job_results)} matching jobs.")
            return job_results

        except Exception as e:
            logger.error(f"CTS Search failed: {e}")
            # Depending on project policy, we could fall back or re-raise
            return []

    async def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves details for a specific job by its ID."""
        name = f"{self.get_parent()}/jobs/{job_id}"
        try:
            job = self.job_client.get_job(name=name)
            return {
                "id": job_id,
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "uris": list(job.application_info.uris) if job.application_info.uris else [],
            }
        except Exception as e:
            logger.error(f"Failed to fetch job {job_id}: {e}")
            return None

    def initialize_tenant(self, display_name: str = "Default Tenant"):
        """
        Ensures the tenant exists.
        Note: Requires roles/jobs.admin permissions.
        """
        parent = f"projects/{self.project_id}"
        tenant = talent.Tenant(external_id=self.tenant_id, display_name=display_name)

        try:
            # Check if exists first (get_tenant doesn't exist by external_id easily without list)
            tenants = self.tenant_client.list_tenants(parent=parent)
            for t in tenants:
                if t.external_id == self.tenant_id:
                    logger.info(f"Tenant {self.tenant_id} already exists.")
                    return t

            logger.info(f"Creating new CTS Tenant: {self.tenant_id}")
            return self.tenant_client.create_tenant(parent=parent, tenant=tenant)
        except Exception as e:
            logger.error(f"Failed to initialize CTS Tenant: {e}")
            return None


# Singleton instance
cts_service = CTSService()
