"""
Smoke test for CTS Service.
"""

import asyncio
import logging

from app.core.config import settings
from app.services.cts_service import cts_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def smoke_test_cts():
    print("--- CTS Smoke Test ---")
    print(f"Project: {settings.google_cloud_project}")
    print(f"Tenant: {settings.cts_tenant_id}")

    # Optional: Initialize tenant (requires jobs.admin)
    # logger.info("Attempting to initialize/check tenant...")
    # cts_service.initialize_tenant()

    print("\n1. Searching for 'Social Worker' in 'Melbourne'...")
    results = await cts_service.search_jobs(query="Social Worker", location="Melbourne, VIC")

    if results:
        print(f"Success! Found {len(results)} jobs.")
        for i, res in enumerate(results[:3]):
            print(f"  {i + 1}. {res['title']} at {res['company']}")
            print(f"     URL: {res['application_info']['uris']}")
    else:
        print(
            "No jobs found (this is normal if the tenant/project is empty, but verify API didn't error)."
        )
        print(
            "Check logs for 'CTS Search failed' to confirm if it was a permission or connectivity issue."
        )


if __name__ == "__main__":
    asyncio.run(smoke_test_cts())
