import logging
<<<<<<< HEAD
from genkit.ai import Genkit
from genkit.plugins.google_genai import GoogleAI
from app.core.ai_config import get_ai_config, AIProvider

# 1. Retrieve Key from existing Config Manager to avoid duplication
config_manager = get_ai_config()
creds = config_manager.get_provider_credentials(AIProvider.GOOGLE_AI)

# Note: In a real scenario, we might want to handle the case where creds is None more gracefully or ensuring it's loaded.
# Assuming get_ai_config() handles env loading.

if not creds or not creds.api_key:
    # Log warning instead of raising error at module level to avoid breaking app startup if config is missing
    logging.warning("Google AI API Key not found in AIConfigManager. Genkit may fail to initialize properly.")

# 2. Initialize Genkit (Singleton)
# We strictly use 'google_ai' (Free Tier) not 'vertexai' (Paid Enterprise)
import os
if os.environ.get("ENABLE_GENKIT_FLOWS", "true").lower() == "false":
    plugins = []
else:
    plugins = [GoogleAI(api_key=creds.api_key if creds else "")]

ai = Genkit(
    plugins=plugins,
    model="googleai/gemini-3.0-flash"  # Defaulting to Flash for speed/quota safety
)

def get_genkit_instance():
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
    return ai
