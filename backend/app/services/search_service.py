import logging
import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class SearchResult(BaseModel):
    content: str
    citations: list[str] = []


class SearchService:
    """
    Service for performing deep web research using Perplexity API.
    Uses 'sonar-pro' (formerly sonar-reasoning-pro) for high-quality, reasoned synthesis.
    Now uses async httpx client for better performance in async contexts.
    """

    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.logger = logging.getLogger(__name__)

        if not self.api_key:
            self.logger.warning(
                "PERPLEXITY_API_KEY is not set. Search capabilities will be disabled."
            )

    async def research_company(self, company_name: str) -> str | None:
        """
        [DECOMMISSIONED] Research functionality via Perplexity has been removed.
        Returns a placeholder indicating capability retirement.
        """
        self.logger.info(f"Research requested for {company_name} - [CAPABILITY RETIRED]")
        return f"Research capability for '{company_name}' is currently offline (Perplexity decommissioning in progress)."
