"""
genkit_init.py

Initializes and configures the Genkit framework for the CareerCopilot application.
Handles AI model initialization, flow registration, and provides health monitoring.
"""

import importlib
import logging
import warnings
from collections.abc import Callable
from typing import Any, cast

from app.core.google_genai_compat import (
    GOOGLE_GENERATIVEAI_AVAILABLE,
    get_configured_google_generativeai,
)

# Best-effort dynamic imports for Genkit
GENKIT_AVAILABLE = False
genkit_ai: Any = None
genkit_plugins_google: Any = None
try:
    with warnings.catch_warnings():
        warnings.filterwarnings(
            "ignore",
            message=r'Field name "schema".*',
            category=UserWarning,
        )
        genkit_ai = importlib.import_module("genkit.ai")
        genkit_plugins_google = importlib.import_module("genkit.plugins.google_genai")
    GENKIT_AVAILABLE = True
except ImportError:
    GENKIT_AVAILABLE = False

# Setup logger for this module
logger = logging.getLogger(__name__)

# --- Global State ---
initialized: bool = False
genkit_instance: Any | None = None
registered_flows: dict[str, Any] = {}


def _get_settings() -> Any:
    """Load application settings lazily to avoid circular imports."""
    from app.core.secure_config import settings as secure_settings

    return secure_settings


def _get_gemini_api_key() -> str | None:
    """Resolve the Gemini API key from centralized settings."""
    settings = _get_settings()
    api_key = getattr(settings, "GEMINI_API_KEY", None)
    return api_key if isinstance(api_key, str) and api_key else None


# --- Core Initialization ---


def init_genkit() -> bool:
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

    if not is_genkit_enabled():
        logger.info("Genkit initialization skipped because flows are disabled")
        return False

    api_key = _get_gemini_api_key()
    if not api_key:
        logger.warning("GEMINI_API_KEY not set. Some AI features will be disabled.")
        return False

    logger.info("Successfully resolved GEMINI_API_KEY from settings")

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
                    model="googleai/gemini-1.5-flash",
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
            genai = cast(Any, get_configured_google_generativeai(api_key))
            if genai is None:
                logger.error("google-generativeai fallback is unavailable")
                return False

            # Test the API key by listing models
            models = list(genai.list_models())
            if not models:
                logger.error("No models available from Google Generative AI API")
                return False

            # Create a simple wrapper object for compatibility
            class GenerativeAIWrapper:
                def __init__(self, genai_module: Any):
                    self.genai = genai_module
                    self.model_name = "gemini-1.5-flash"

                def generate(self, prompt: str, **kwargs) -> Any:
                    """Generate content using Gemini"""
                    model = self.genai.GenerativeModel(self.model_name)
                    return model.generate_content(prompt, **kwargs)

            genkit_instance = GenerativeAIWrapper(genai)
            logger.info(
                f"Genkit initialized successfully with google-generativeai (found {len(models)} models)"
            )
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
    if not is_genkit_enabled():
        return None
    if not initialized:
        init_genkit()
    return genkit_instance


def is_genkit_enabled() -> bool:
    """
    Check if Genkit flows are enabled via environment variable.

    Returns:
        bool: True if Genkit flows are enabled
    """
    settings = _get_settings()
    return bool(
        getattr(settings, "ENABLE_AI_FEATURES", True)
        and getattr(settings, "ENABLE_GENKIT_FLOWS", True)
    )


def check_genkit_health() -> dict[str, Any]:
    """
    Check the health of the Genkit framework and registered flows.

    Returns:
        Dict containing health status information
    """
    # API key is present if either the env var is set OR the model is successfully initialized
    api_key_present = bool(_get_gemini_api_key()) or initialized
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


import functools
import inspect

from pydantic import BaseModel

# --- Unified Decorator ---


def genkit_flow(
    _func: Callable[..., Any] | None = None,
    *,
    name: str | None = None,
    output_schema: type[BaseModel] | None = None,
    **kwargs: Any,
) -> Callable[[Callable[..., Any]], Any]:
    """
    Standardized Genkit flow decorator.
    Gracefully handles missing framework and provides central registration.
    """

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        flow_name = name or func.__name__
        register_flow_function(func, flow_name)

        # Wrap for logging and health checks
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs_inner):
            logger.info(f"Executing AI Flow: {flow_name}")
            return await func(*args, **kwargs_inner)

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs_inner):
            logger.info(f"Executing AI Flow: {flow_name}")
            return func(*args, **kwargs_inner)

        wrapper = async_wrapper if inspect.iscoroutinefunction(func) else sync_wrapper

        if GENKIT_AVAILABLE and is_genkit_enabled():
            try:
                # Use real genkit flow if possible
                flow_dec = getattr(genkit_ai, "flow", None)
                if flow_dec:
                    real_flow = flow_dec(name=flow_name, output_schema=output_schema, **kwargs)
                    return real_flow(wrapper)
            except Exception as e:
                logger.warning(f"Failed to apply real genkit flow to {flow_name}: {e}")
        return wrapper

    if _func is not None:
        return decorator(_func)
    return decorator


# --- Aliases and Helpers for backward compatibility ---
async_genkit_flow = genkit_flow


def simple_genkit_flow(
    output_schema: type[BaseModel] | None = None,
) -> Callable[[Callable[..., Any]], Any]:
    return genkit_flow(output_schema=output_schema)


def create_flow_wrapper(
    func: Callable[..., Any],
    name: str | None = None,
    output_schema: type[BaseModel] | None = None,
) -> Callable[..., Any]:
    return genkit_flow(name=name, output_schema=output_schema)(func)


def run_flow(flow_func: Callable[..., Any], **kwargs: Any) -> Any:
    return flow_func(**kwargs)


async def run_flow_async(flow_func: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
    import asyncio
    import functools

    if inspect.iscoroutinefunction(flow_func):
        return await flow_func(*args, **kwargs)
    else:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, functools.partial(flow_func, *args, **kwargs))
