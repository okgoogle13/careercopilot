import logging

from genkit.ai import Genkit
from genkit.plugins.google_genai import GoogleAI

from app.core.ai_config import AIProvider, get_ai_config

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
    model="googleai/gemini-2.5-flash"  # Updated to available model for v0.5.0
)

def get_genkit_instance():
    return ai
