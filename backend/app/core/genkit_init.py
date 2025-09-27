"""
Genkit Framework Initialization and Management.

This module is responsible for initializing and configuring the Genkit AI
framework for the application. It handles the dynamic loading of Genkit,
initialization of AI models (specifically Google's Gemini), registration of
AI-powered flows, and provides health monitoring capabilities.

The initialization is conditional based on the `ENABLE_GENKIT_FLOWS`
environment variable, allowing AI features to be toggled on or off.
"""
import logging
import os
from typing import Any, Callable, Dict, Optional

try:
    from genkit.ai import Genkit
    from genkit.plugins.google_genai import GoogleAI
    GENKIT_AVAILABLE = True
except ImportError:
    GENKIT_AVAILABLE = False
    Genkit = None
    GoogleAI = None

logger = logging.getLogger(__name__)

initialized = False
genkit_instance: Optional[Genkit] = None
registered_flows: Dict[str, Callable] = {}


def init_genkit() -> bool:
    """
    Initializes the Genkit framework and the Google AI plugin.

    This function checks for the availability of the Genkit library and the
    `GEMINI_API_KEY` environment variable. If both are present, it configures
    and initializes a global Genkit instance with the Google AI plugin.

    This function is idempotent; it will only perform initialization once.

    Returns:
        True if Genkit was successfully initialized, False otherwise.
    """
    global initialized, genkit_instance

    if initialized:
        logger.info("Genkit already initialized.")
        return True

    if not GENKIT_AVAILABLE:
        logger.error("Genkit library is not installed. Cannot initialize. Please `pip install genkit`.")
        return False

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY environment variable not set. Genkit initialization aborted.")
            return False

        genkit_instance = Genkit(
            plugins=[GoogleAI(api_key=api_key)],
            model="googleai/gemini-2.0-flash",
        )

        logger.info("Genkit initialized successfully with GoogleAI plugin.")
        initialized = True
        return True

    except Exception as e:
        logger.error(f"An unexpected error occurred during Genkit initialization: {e}", exc_info=True)
        return False


def get_model() -> Optional[Genkit]:
    """
    Retrieves the initialized Genkit instance for model operations.

    If Genkit has not been initialized yet, this function will attempt to
    initialize it first.

    Returns:
        The global Genkit instance if initialization was successful, otherwise None.
    """
    if not initialized:
        init_genkit()
    return genkit_instance


def is_genkit_enabled() -> bool:
    """
    Checks if Genkit flows are enabled via the environment variable.

    Returns:
        True if the `ENABLE_GENKIT_FLOWS` environment variable is set to 'true'
        (case-insensitive), otherwise False.
    """
    return os.getenv("ENABLE_GENKIT_FLOWS", "false").lower() == "true"


def check_genkit_health() -> Dict[str, Any]:
    """
    Performs a health check of the Genkit integration.

    This function provides a detailed status of the Genkit setup, including
    whether the library is installed, if it's been initialized, if the API key
    is present, and how many flows are registered.

    Returns:
        A dictionary containing key health status indicators and a list of
        any detected errors.
    """
    api_key_present = bool(os.getenv("GEMINI_API_KEY"))
    health_status = {
        "available": GENKIT_AVAILABLE,
        "initialized": initialized,
        "gemini_api_key_present": api_key_present,
        "enabled_by_env": is_genkit_enabled(),
        "flows_registered": len(registered_flows),
        "model_instance_available": bool(genkit_instance),
        "errors": [],
    }

    if not GENKIT_AVAILABLE:
        health_status["errors"].append("Genkit library is not installed.")
    elif health_status["enabled_by_env"]:
        if not api_key_present:
            health_status["errors"].append("GEMINI_API_KEY environment variable is not set.")
        if not initialized:
            health_status["errors"].append("Genkit failed to initialize.")
        if not genkit_instance:
            health_status["errors"].append("Genkit model instance is not available after initialization attempt.")

    return health_status


def startup_genkit() -> None:
    """
    Initializes Genkit during application startup if enabled.

    This function is intended to be called when the application starts. It
    respects the `ENABLE_GENKIT_FLOWS` environment variable to decide whether
    to proceed with initialization.
    """
    if is_genkit_enabled():
        logger.info("Genkit flows are enabled by environment variable. Initializing...")
        if init_genkit():
            logger.info("Genkit startup process completed successfully.")
        else:
            logger.warning("Genkit startup process completed with errors or warnings.")
    else:
        logger.info("Genkit initialization skipped as ENABLE_GENKIT_FLOWS is not set to 'true'.")


def register_flow_function(func: Callable, name: Optional[str] = None) -> Callable:
    """
    Registers a flow function for tracking and management.

    This function acts as a simple registry for AI flows, allowing them to be
    tracked and accessed centrally. It can be used as a decorator.

    Args:
        func: The function that implements the AI flow.
        name: An optional alternative name for the flow. If not provided, the
              function's `__name__` is used.

    Returns:
        The original, unmodified function.
    """
    flow_name = name or func.__name__
    registered_flows[flow_name] = func
    logger.debug(f"Registered Genkit flow: '{flow_name}'")
    return func


def get_registered_flows() -> Dict[str, Callable]:
    """
    Retrieves a dictionary of all registered flow functions.

    Returns:
        A copy of the dictionary containing all registered flows, mapping
        flow names to their corresponding functions.
    """
    return registered_flows.copy()
