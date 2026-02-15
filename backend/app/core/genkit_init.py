"""
genkit_init.py

Initializes and configures the Genkit framework for the CareerCopilot application.
Handles AI model initialization, flow registration, and provides health monitoring.
"""

import importlib
import logging
import os
from collections.abc import Callable
from typing import Any, cast

# Best-effort dynamic imports for Genkit
GENKIT_AVAILABLE = False
genkit_ai: Any = None
genkit_plugins_google: Any = None
try:
    genkit_ai = importlib.import_module("genkit.ai")
    genkit_plugins_google = importlib.import_module("genkit.plugins.google_genai")
    GENKIT_AVAILABLE = True
except ImportError:
    GENKIT_AVAILABLE = False

# Try to import google-generativeai as fallback
GOOGLE_GENERATIVEAI_AVAILABLE = False
google_generativeai: Any = None
try:
    google_generativeai = importlib.import_module("google.generativeai")
    GOOGLE_GENERATIVEAI_AVAILABLE = True
except ImportError:
    GOOGLE_GENERATIVEAI_AVAILABLE = False

# Setup logger for this module
logger = logging.getLogger(__name__)

# --- Global State ---
initialized: bool = False
genkit_instance: Any | None = None
registered_flows: dict[str, Any] = {}

# --- Core Initialization ---


async def init_genkit() -> bool:
    """
    Initialize the Genkit framework with required plugins and models.
    Falls back to google-generativeai if Genkit plugin initialization fails.

    Returns:
        bool: True if initialization was successful, False otherwise
    """
    global initialized, genkit_instance

    if initialized:
        logger.info("Genkit already initialized")
        return True

    # Configure API key from centralized secret manager
    try:
        from app.core.secret_manager import get_secret
        api_key = get_secret("GEMINI_API_KEY")
        if api_key:
            logger.info("Successfully retrieved GEMINI_API_KEY")
    except Exception as e:
        # Fallback to direct env check if secret manager fails or is not available
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning(f"Could not fetch API key: {e!s}")
            logger.warning("GEMINI_API_KEY not set. Some AI features will be disabled.")
            return False

    # Try Genkit first (primary method)
    if GENKIT_AVAILABLE:
        try:
            # Initialize Genkit with Google AI plugin
            Genkit = getattr(genkit_ai, "Genkit", None)
            GoogleAI = getattr(genkit_plugins_google, "GoogleAI", None)
            if Genkit is None or GoogleAI is None:
                logger.warning("Genkit classes missing, falling back to google-generativeai")
            else:
                genkit_local = cast(Any, Genkit)
                google_ai_local = cast(Any, GoogleAI)
                genkit_instance = genkit_local(
                    plugins=[google_ai_local(api_key=api_key)],
                    model="googleai/gemini-2.5-flash",  # Updated to available model
                )
                logger.info("Genkit initialized successfully with plugin")
                initialized = True
                return True

        except Exception as e:
            logger.warning(f"Genkit plugin initialization failed: {e!s}")
            logger.info("Falling back to google-generativeai library")

    # Fallback to google-generativeai (more reliable)
    if GOOGLE_GENERATIVEAI_AVAILABLE:
        try:
            genai = cast(Any, google_generativeai)
            genai.configure(api_key=api_key)

            # Test the API key by listing models
            models = list(genai.list_models())
            if not models:
                logger.error("No models available from Google Generative AI API")
                return False

            # Create a simple wrapper object for compatibility
            class GenerativeAIWrapper:
                def __init__(self, genai_module: Any):
                    self.genai = genai_module
                    self.model_name = "gemini-2.5-flash"  # Updated to available model

                async def generate(self, prompt: str, **kwargs) -> Any:
                    """Generate content using Gemini"""
                    model = self.genai.GenerativeModel(self.model_name)
                    return model.generate_content(prompt, **kwargs)

            genkit_instance = GenerativeAIWrapper(genai)
            logger.info(f"Genkit initialized successfully with google-generativeai (found {len(models)} models)")
            initialized = True
            return True

        except Exception as e:
            logger.error(f"Failed to initialize with google-generativeai: {e!s}", exc_info=True)
            return False

    logger.error("Neither Genkit nor google-generativeai available")
    return False


def get_model() -> Any | None:
    """
    Get the initialized Genkit instance for model operations.

    Returns:
        The Genkit instance, or None if not initialized
    """
    if not initialized:
        init_genkit()
    return genkit_instance


def is_genkit_enabled() -> bool:
    """
    Check if Genkit flows are enabled via environment variable.

    Returns:
        bool: True if Genkit flows are enabled
    """
    return os.getenv("ENABLE_GENKIT_FLOWS", "true").lower() == "true"


def check_genkit_health() -> dict[str, Any]:
    """
    Check the health of the Genkit framework and registered flows.

    Returns:
        Dict containing health status information
    """
    # API key is present if either the env var is set OR the model is successfully initialized
    api_key_present = bool(os.getenv("GEMINI_API_KEY")) or initialized
    errors: list[str] = []
    health_status: dict[str, Any] = {
        "available": GENKIT_AVAILABLE or GOOGLE_GENERATIVEAI_AVAILABLE,
        "initialized": initialized,
        "gemini_api_key_present": api_key_present,
        "enabled": is_genkit_enabled(),
        "flows_registered": len(registered_flows),
        "model_available": bool(genkit_instance),
        "models_initialized": bool(genkit_instance),  # For compatibility with verify script
        "errors": errors,
    }

    # Only check errors if Genkit flows are enabled
    if health_status["enabled"]:
        if not health_status["available"]:
            errors.append("Genkit or google-generativeai not available")
        if not health_status["initialized"]:
            errors.append("Genkit failed to initialize")
        if not health_status["model_available"]:
            errors.append("Gemini model not available")

    return health_status


async def startup_genkit() -> None:
    """
    Initialize Genkit during application startup.
    Honors the ENABLE_GENKIT_FLOWS environment variable.
    """
    if is_genkit_enabled():
        logger.info("Genkit flows are enabled, initializing...")
        if await init_genkit():
            logger.info("Genkit startup completed successfully")
        else:
            logger.warning("Genkit startup completed with warnings")
    else:
        logger.info("Genkit initialization skipped (ENABLE_GENKIT_FLOWS is not 'true')")


def register_flow_function(func: Callable[..., Any], name: str | None = None) -> Callable[..., Any]:
    """
    Register a flow function for tracking purposes.

    Args:
        func: The flow function to register
        name: Optional name for the flow

    Returns:
        The original function
    """
    flow_name = name or func.__name__
    registered_flows[flow_name] = func
    logger.debug(f"Registered flow function: {flow_name}")
    return func


def get_registered_flows() -> dict[str, Any]:
    """
    Get all registered flow functions.

    Returns:
        Dictionary of registered flows
    """
    return registered_flows.copy()
