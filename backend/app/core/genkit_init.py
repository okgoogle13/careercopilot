"""
genkit_init.py

Initializes and configures the Genkit framework for the CareerCopilot application.
Handles AI model initialization, flow registration, and provides health monitoring.
"""
import logging
import os
from typing import Any, Callable, Dict, Optional

try:
    from genkit.ai import Genkit
    from genkit.plugins.google_genai import GoogleAI

    GENKIT_AVAILABLE = True
except ImportError as e:
    GENKIT_AVAILABLE = False
    Genkit = None
    GoogleAI = None

# Setup logger for this module
logger = logging.getLogger(__name__)

# --- Global State ---
initialized = False
genkit_instance = None
registered_flows: Dict[str, Any] = {}

# --- Core Initialization ---


def init_genkit() -> bool:
    """
    Initialize the Genkit framework with required plugins and models.

    Returns:
        bool: True if initialization was successful, False otherwise
    """
    global initialized, genkit_instance

    if initialized:
        logger.info("Genkit already initialized")
        return True

    if not GENKIT_AVAILABLE:
        logger.error("Genkit is not available. Please install genkit package.")
        return False

    try:
        # Configure API key from environment
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not set. Some AI features will be disabled.")
            return False

        # Initialize Genkit with Google AI plugin
        genkit_instance = Genkit(
            plugins=[GoogleAI(api_key=api_key)],
            model="googleai/gemini-1.5-pro",
        )

        logger.info("Genkit initialized successfully")
        initialized = True
        return True

    except Exception as e:
        logger.error(f"Failed to initialize Genkit: {str(e)}", exc_info=True)
        return False


def get_model():
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
    return os.getenv("ENABLE_GENKIT_FLOWS", "false").lower() == "true"


def check_genkit_health() -> Dict[str, Any]:
    """
    Check the health of the Genkit framework and registered flows.

    Returns:
        Dict containing health status information
    """
    api_key_present = bool(os.getenv("GEMINI_API_KEY"))
    health_status = {
        "available": GENKIT_AVAILABLE,
        "initialized": initialized,
        "gemini_api_key_present": api_key_present,
        "enabled": is_genkit_enabled(),
        "flows_registered": len(registered_flows),
        "model_available": bool(genkit_instance),
        "errors": [],
    }

    if not GENKIT_AVAILABLE:
        health_status["errors"].append("Genkit package not available")
    elif health_status["enabled"]:
        if not health_status["initialized"]:
            health_status["errors"].append("Genkit failed to initialize")
        if not health_status["gemini_api_key_present"]:
            health_status["errors"].append("GEMINI_API_KEY is not set")
        if not health_status["model_available"]:
            health_status["errors"].append("Gemini model not available")

    return health_status


def startup_genkit() -> None:
    """
    Initialize Genkit during application startup.
    Honors the ENABLE_GENKIT_FLOWS environment variable.
    """
    if is_genkit_enabled():
        logger.info("Genkit flows are enabled, initializing...")
        if init_genkit():
            logger.info("Genkit startup completed successfully")
        else:
            logger.warning("Genkit startup completed with warnings")
    else:
        logger.info("Genkit initialization skipped (ENABLE_GENKIT_FLOWS is not 'true')")


def register_flow_function(func: Callable, name: Optional[str] = None) -> Callable:
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


def get_registered_flows() -> Dict[str, Any]:
    """
    Get all registered flow functions.

    Returns:
        Dictionary of registered flows
    """
    return registered_flows.copy()
