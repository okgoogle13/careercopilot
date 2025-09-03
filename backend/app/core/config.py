try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

from dataclasses import dataclass, field
from typing import Dict, List


class Settings(BaseSettings):
    # Core application settings
    debug: bool = False
    environment: str = "development"

    class Config:
        env_file = ".env"


@dataclass
class PersonalCareerConfig:
    """Personal configuration for CareerCopilot"""

    name: str = "Your Name"
    email: str = "nishantdougall@gmail.com"
    location: str = "Northcote, VIC, Australia"
    career_transition_from: str = "Finance"
    career_transition_to: str = "Social Work/Community Services"
    target_industries: List[str] = field(
        default_factory=lambda: [
            "Healthcare",
            "Education",
            "Community Services",
            "Government",
        ]
    )
    target_roles: List[str] = field(
        default_factory=lambda: [
            "Social Worker",
            "Case Manager",
            "Community Services Worker",
        ]
    )
    salary_range: Dict[str, int] = field(
        default_factory=lambda: {"min": 60000, "max": 85000, "currency": "AUD"}
    )
    transferable_skills: List[str] = field(
        default_factory=lambda: [
            "Financial Analysis",
            "Data Analysis",
            "Client Relationship Management",
            "Risk Assessment",
            "Stakeholder Management",
            "Report Writing",
        ]
    )
    personal_story: Dict[str, str] = field(
        default_factory=lambda: {
            "background": "Finance professional transitioning to social work",
            "motivation": "Direct community impact and social justice",
        }
    )
    email_notifications: bool = True


# Global configuration instances
settings = Settings()
_personal_config: PersonalCareerConfig = None


def get_personal_config() -> PersonalCareerConfig:
    """Get or create global PersonalCareerConfig instance"""
    global _personal_config
    if _personal_config is None:
        _personal_config = PersonalCareerConfig()
    return _personal_config
