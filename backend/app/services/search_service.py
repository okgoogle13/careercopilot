import logging
import os
import requests
from typing import List, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class SearchResult(BaseModel):
    content: str
    citations: List[str] = []

class SearchService:
    """
    Service for performing deep web research using Perplexity API.
    Uses 'sonar-pro' (formerly sonar-reasoning-pro) for high-quality, reasoned synthesis.
    """
    
    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.logger = logging.getLogger(__name__)

        if not self.api_key:
            self.logger.warning("PERPLEXITY_API_KEY is not set. Search capabilities will be disabled.")

    def research_company(self, company_name: str) -> Optional[str]:
        """
        Conduct deep research on a company to extract intelligence for job applications.
        returns a synthesized text summary of the company's mission, values, and culture.
        """
        if not self.api_key:
            return None

        # System prompt to guide Perplexity's research behavior
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert Corporate Intelligence Analyst helping a job seeker. "
                    "Your goal is to research a target company and provide a detailed briefing. "
                    "Focus on identifying their Mission, Core Values, Strategic Focus, "
                    "and Communication Style. Be specific and cite sources if possible."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Conduct a deep research analysis on the company: {company_name}. "
                    "Find their official mission statement, core values (often found on 'About Us' or 'Careers' pages), "
                    "recent strategic initiatives, and describe their overall brand tone. "
                    "Return the data as a detailed summary."
                ),
            },
        ]

        payload = {
            "model": "sonar-pro",
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 1000,
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            self.logger.info(f"Sending Perplexity request for: {company_name}")
            response = requests.post(self.base_url, json=payload, headers=headers, timeout=60)
            response.raise_for_status()
            
            data = response.json()
            # Extract the content from the first choice
            content = data["choices"][0]["message"]["content"]
            return content

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Perplexity API request failed for {company_name}: {str(e)}")
            return None
        except (KeyError, IndexError) as e:
             self.logger.error(f"Failed to parse Perplexity response: {str(e)}")
             return None
