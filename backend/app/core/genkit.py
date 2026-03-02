import logging
import os
from typing import Any

from genkit.ai import Genkit
from genkit.plugins.google_genai import GoogleAI
from app.core.ai_config import AIProvider, get_ai_config

logger = logging.getLogger(__name__)

# --- Initialization Logic ---

def _initialize_genkit() -> Genkit:
    """Initialize Genkit with centralized configuration."""
    config_manager = get_ai_config()
    creds = config_manager.get_provider_credentials(AIProvider.GOOGLE_AI)
    
    api_key = creds.api_key if creds else os.environ.get("GOOGLE_AI_API_KEY")
    
    if not api_key:
        logger.warning("Google AI API Key not found. AI operations may fail.")
    
    # Check if flows are enabled
    enable_flows = os.environ.get("ENABLE_GENKIT_FLOWS", "true").lower() == "true"
    plugins = [GoogleAI(api_key=api_key)] if enable_flows and api_key else []
    
    return Genkit(
        plugins=plugins,
        model="googleai/gemini-3.0-flash" # Default model
    )

# Singleton instance
ai = _initialize_genkit()

def get_genkit_instance() -> Genkit:
    """Returns the singleton Genkit instance."""
    return ai

def get_model() -> Genkit:
    """Alias for get_genkit_instance for backward compatibility with older flows."""
    return ai
