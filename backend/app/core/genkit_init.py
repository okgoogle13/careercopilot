"""
genkit_init.py (Refactored)

Initializes and configures the Genkit framework for the CareerCopilot application.
This module provides a single point of initialization, exports configured AI models,
and includes a health check function for robust production monitoring.
"""
import logging
import os

import genkit
from genkit.genkit_flow import ModelReference
from genkit.plugins import dotprompt, gemini

# Setup logger for this module
logger = logging.getLogger(__name__)

# --- Exported Models ---
# These will be populated by init_genkit() and can be imported by flows.
gemini_pro: ModelReference = None
gemini_15_pro: ModelReference = None

# --- Core Initialization ---


def init_genkit():
    """
    Initializes the Genkit framework with required plugins.
    This function is idempotent and safe to call multiple times.
    """
    global gemini_pro, gemini_15_pro

    if genkit.is_initialized():
        logger.info("Genkit already initialized. Skipping.")
        return

    # RETAINED: Configuration from environment variables
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning(
            "GEMINI_API_KEY environment variable not set. " "Genkit flows will not be functional."
        )
        # We don't return here, allowing the app to run without AI features if needed.

    try:
        # REFACTOR: Use the standard genkit.init() call for simplicity and clarity.
        genkit.init(
            plugins=[
                gemini.init(api_key=api_key),
                dotprompt.init(),
            ],
            log_level=os.getenv("GENKIT_LOG_LEVEL", "INFO"),
            enable_tracing=os.getenv("ENABLE_TELEMETRY", "true").lower() == "true",
        )

        # REFACTOR: Populate exported model variables directly after init.
        # This is cleaner than a getter function.
        gemini_pro = gemini.gemini_pro
        gemini_15_pro = gemini.gemini_1_5_pro

        logger.info("Genkit framework initialized successfully with Gemini plugin.")

    except Exception as e:
        logger.error(f"A critical error occurred during Genkit initialization: {e}", exc_info=True)
        # Re-raise the exception to prevent the application from starting
        # in a broken state if Genkit is essential.
        raise


# --- Health Check ---


def check_genkit_health() -> dict:
    """
    RETAINED: Performs a health check for Genkit services.

    Returns:
        A dictionary containing the health status of Genkit.
    """
    api_key_present = bool(os.getenv("GEMINI_API_KEY"))
    health_status = {
        "genkit_initialized": genkit.is_initialized(),
        "gemini_api_key_present": api_key_present,
        "flows_enabled": os.getenv("ENABLE_GENKIT_FLOWS", "false").lower() == "true",
        "errors": [],
    }

    if not health_status["genkit_initialized"]:
        health_status["errors"].append("Genkit failed to initialize.")
    if not health_status["gemini_api_key_present"]:
        health_status["errors"].append("GEMINI_API_KEY is not set.")

    return health_status


# --- Application Startup Integration ---


def startup_genkit():
    """
    A wrapper to be called during FastAPI application startup.
    Honors the ENABLE_GENKIT_FLOWS feature flag.
    """
    if os.getenv("ENABLE_GENKIT_FLOWS", "false").lower() == "true":
        init_genkit()
    else:
        logger.warning(
            "Genkit initialization skipped because ENABLE_GENKIT_FLOWS is not set to 'true'."
        )
