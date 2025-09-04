"""
Firebase Genkit Initialization and Configuration

This module handles the initialization of Firebase Genkit and Google AI plugins
for all AI-powered features in CareerCopilot.
"""

import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

# Global flag to track initialization
_genkit_initialized = False


def init_genkit() -> bool:
    """
    Initialize Firebase Genkit with Google AI plugin.

    Returns:
        bool: True if initialization successful, False otherwise
    """
    global _genkit_initialized

    if _genkit_initialized:
        logger.info("Genkit already initialized")
        return True

    try:
        import genkit
        from genkit.plugins import googleai

        # Check if we have the required API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found - Genkit flows will not work")
            return False

        # Initialize Genkit with Google AI plugin if not already done
        if not genkit.get_plugin("googleai"):
            genkit.init(
                plugins=[googleai.init(api_key=api_key)],
                log_level=os.getenv("GENKIT_LOG_LEVEL", "INFO"),
            )

        _genkit_initialized = True
        logger.info("Genkit initialized successfully with Google AI plugin")
        return True

    except ImportError as e:
        logger.warning(f"Genkit not available: {e}")
        return False
    except Exception as e:
        logger.error(f"Failed to initialize Genkit: {e}")
        return False


def is_genkit_available() -> bool:
    """
    Check if Genkit is available and properly configured.

    Returns:
        bool: True if Genkit is available, False otherwise
    """
    return _genkit_initialized or init_genkit()


def get_genkit_model(model_name: Optional[str] = None):
    """
    Get a Genkit model instance.

    Args:
        model_name: Optional model name, defaults to gemini-1.5-pro

    Returns:
        Model instance or None if not available
    """
    if not is_genkit_available():
        return None

    try:
        from genkit.plugins import googleai

        model_name = model_name or os.getenv("DEFAULT_AI_MODEL", "gemini-1.5-pro")

        if model_name == "gemini-1.5-pro":
            return googleai.gemini_15_pro
        elif model_name == "gemini-pro":
            return googleai.gemini_pro
        else:
            logger.warning(f"Unknown model: {model_name}, falling back to gemini-1.5-pro")
            return googleai.gemini_15_pro

    except Exception as e:
        logger.error(f"Failed to get model {model_name}: {e}")
        return None


def check_genkit_health() -> dict:
    """
    Perform health check for Genkit services.

    Returns:
        dict: Health status information
    """
    health_status = {
        "genkit_available": False,
        "google_ai_configured": False,
        "api_key_present": bool(os.getenv("GEMINI_API_KEY")),
        "flows_enabled": os.getenv("ENABLE_GENKIT_FLOWS", "false").lower() == "true",
        "errors": [],
    }

    try:
        health_status["genkit_available"] = is_genkit_available()

        if health_status["genkit_available"]:
            import genkit

            health_status["google_ai_configured"] = bool(genkit.get_plugin("googleai"))

    except Exception as e:
        health_status["errors"].append(f"Health check failed: {str(e)}")

    return health_status


# Initialize Genkit on module import if enabled
if os.getenv("ENABLE_GENKIT_FLOWS", "false").lower() == "true":
    init_genkit()
