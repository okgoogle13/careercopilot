"""
NLP Model Manager - Singleton Pattern for Efficient Model Loading

This module provides a singleton pattern for loading and caching NLP models,
solving the performance issue of loading spaCy models on every request.

Key Features:
- Singleton pattern ensures models are loaded once at startup
- Thread-safe model access
- Lazy loading with fallback options
- Memory-efficient model caching
- Health checks and error handling
"""

import logging
import os
import threading
import time
from functools import lru_cache, wraps
from typing import Any, Optional

import psutil

# Import metrics
from app.monitoring.nlp_metrics import (
    track_model_load_time,
    track_model_memory_usage,
    track_nlp_duration,
    track_nlp_request,
    track_tokens_processed,
)

from ..monitoring.nlp_metrics import NLP_REQUEST_DURATION

logger = logging.getLogger(__name__)


class NLPModelManager:
    """
    Singleton manager for NLP models to prevent repeated loading.

    Solves the performance issue of loading spaCy models (or other NLP models)
    on every request by caching them in memory at application startup.
    """

    _instance: Optional["NLPModelManager"] = None
    _lock = threading.Lock()

    def __new__(cls) -> "NLPModelManager":
        """Ensure only one instance exists (Singleton pattern)."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        """Initialize the model manager (called only once)."""
        if hasattr(self, "_initialized") and self._initialized:
            return

        self._models: dict[str, Any] = {}
        self._model_info: dict[str, dict[str, Any]] = {}
        self._loading_lock = threading.RLock()
        self._initialized = True

        logger.info("NLP Model Manager initialized")

    def track_nlp_operation(self, endpoint: str, model_name: str = "default"):
        """Decorator to track NLP operations with metrics"""

        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                start_time = time.time()
                status = "success"

                try:
                    result = func(*args, **kwargs)
                    return result
                except Exception as e:
                    status = "error"
                    logger.error(f"Error in {endpoint}: {e!s}")
                    raise
                finally:
                    duration = time.time() - start_time
                    track_nlp_request(endpoint, model_name, status)
                    NLP_REQUEST_DURATION.labels(endpoint=endpoint, model=model_name).observe(
                        duration
                    )

                    # Track tokens if available in the result
                    if "result" in locals() and hasattr(result, "get"):
                        tokens = result.get("tokens_processed", 0)
                        if tokens > 0:
                            track_tokens_processed(model_name, endpoint, tokens)

            return wrapper

        return decorator

    def load_model(
        self, model_name: str, model_type: str = "spacy", force_reload: bool = False
    ) -> Any:
        """
        Load an NLP model with caching and thread safety.

        Args:
            model_name: Name of the model to load (e.g., 'en_core_web_sm')
            model_type: Type of model ('spacy', 'transformers', etc.)
            force_reload: If True, force reload the model even if already loaded

        Returns:
            The loaded model
        """
        cache_key = f"{model_type}:{model_name}"

        with self._loading_lock:
            if cache_key in self._models and not force_reload:
                # Update last accessed time
                if cache_key in self._model_info:
                    self._model_info[cache_key]["last_accessed"] = time.time()
                return self._models[cache_key]

            try:
                logger.info(f"Loading {model_type} model: {model_name}")
                start_time = time.time()

                if model_type == "spacy":
                    import spacy

                    model = spacy.load(model_name)
                elif model_type == "transformers":
                    from transformers import pipeline

                    model = pipeline("text-classification", model=model_name)
                else:
                    raise ValueError(f"Unsupported model type: {model_type}")

                load_time = time.time() - start_time
                logger.info(
                    f"Successfully loaded {model_type} model {model_name} in {load_time:.2f}s"
                )

                # Track model metrics
                process = psutil.Process(os.getpid())
                memory_usage = process.memory_info().rss
                track_model_load_time(model_name, load_time)
                track_model_memory_usage(model_name, memory_usage)

                self._models[cache_key] = model
                self._model_info[cache_key] = {
                    "type": model_type,
                    "name": model_name,
                    "load_time": load_time,
                    "memory_usage": memory_usage,
                    "last_accessed": time.time(),
                }

                return model

            except Exception as e:
                logger.error(f"Failed to load {model_type} model {model_name}: {e!s}")
                track_nlp_request("load_model", model_name, "error")
                raise

    def load_spacy_model(
        self, model_name: str = "en_core_web_sm", force_reload: bool = False
    ) -> Any:
        """
        Load and cache a spaCy model.

        Args:
            model_name: Name of the spaCy model to load
            force_reload: Whether to force reload even if cached

        Returns:
            The loaded spaCy nlp object

        Raises:
            ImportError: If spaCy is not installed
            OSError: If the model is not found
        """
        return self.load_model(model_name, "spacy", force_reload)

    def get_model(self, model_name: str) -> Any | None:
        """
        Get a cached model by name.

        Args:
            model_name: Name of the model to retrieve

        Returns:
            The cached model or None if not found
        """
        return self._models.get(model_name)

    def is_model_loaded(self, model_name: str) -> bool:
        """Check if a model is already loaded and cached."""
        return model_name in self._models

    def get_model_info(self, model_name: str) -> dict[str, Any]:
        """Get information about a cached model."""
        return self._model_info.get(model_name, {})

    def list_loaded_models(self) -> dict[str, dict[str, Any]]:
        """List all loaded models with their info."""
        return self._model_info.copy()

    def unload_model(self, model_name: str) -> bool:
        """
        Unload a model from cache to free memory.

        Args:
            model_name: Name of the model to unload

        Returns:
            True if model was unloaded, False if not found
        """
        with self._loading_lock:
            if model_name in self._models:
                del self._models[model_name]
                if model_name in self._model_info:
                    del self._model_info[model_name]
                logger.info(f"Unloaded model: {model_name}")
                return True
            return False

    def clear_cache(self) -> None:
        """Clear all cached models."""
        with self._loading_lock:
            model_count = len(self._models)
            self._models.clear()
            self._model_info.clear()
            logger.info(f"Cleared {model_count} cached models")

    def get_memory_usage(self) -> dict[str, Any]:
        """Get estimated memory usage of all cached models."""
        total_mb = sum(info.get("memory_usage", 0) for info in self._model_info.values())

        return {
            "total_models": len(self._models),
            "total_memory_mb": total_mb,
            "models": {
                name: info.get("memory_usage", 0) for name, info in self._model_info.items()
            },
        }

    def health_check(self) -> dict[str, Any]:
        """Perform health check on all cached models."""
        status = {
            "status": "healthy",
            "models_loaded": len(self._models),
            "models": {},
            "issues": [],
        }

        for model_name, model in self._models.items():
            try:
                # Test the model with a simple operation
                if callable(model):
                    # For spaCy models, test with a simple sentence
                    test_doc = model("Test sentence.")
                    status["models"][model_name] = {
                        "status": "healthy",
                        "tokens_processed": len(test_doc),
                    }
                else:
                    status["models"][model_name] = {"status": "unknown"}

            except Exception as e:
                issue = f"Model '{model_name}' health check failed: {e!s}"
                status["issues"].append(issue)
                status["models"][model_name] = {"status": "unhealthy", "error": str(e)}

        if status["issues"]:
            status["status"] = "degraded"

        return status

    @staticmethod
    def _estimate_memory_usage(model: Any) -> float:
        """Estimate memory usage of a model in MB."""
        try:
            import sys

            # Get approximate size
            size_bytes = sys.getsizeof(model)

            # For spaCy models, also account for vocab size
            if hasattr(model, "vocab"):
                size_bytes += sys.getsizeof(model.vocab)

            return round(size_bytes / (1024 * 1024), 2)

        except Exception:
            return 0.0


# Global singleton instance
nlp_model_manager = NLPModelManager()


# Convenience functions for easier usage
def load_spacy_model(model_name: str = "en_core_web_sm", force_reload: bool = False) -> Any:
    """Convenience function to load a spaCy model."""
    return nlp_model_manager.load_spacy_model(model_name, force_reload)


def get_spacy_model(model_name: str = "en_core_web_sm") -> Any | None:
    """Convenience function to get a cached spaCy model."""
    return nlp_model_manager.get_model(model_name)


@lru_cache(maxsize=1)
def get_default_spacy_model() -> Any:
    """Get the default spaCy model with LRU caching."""
    return load_spacy_model("en_core_web_sm")


def preload_models() -> None:
    """
    Preload commonly used models at application startup.
    Call this function in your application's startup routine.
    """
    manager = NLPModelManager()

    # Preload default models
    models_to_load = [
        ("en_core_web_sm", "spacy"),
        # Add other commonly used models here
    ]

    for model_name, model_type in models_to_load:
        try:
            with track_nlp_duration("preload_models", model_name):
                manager.load_model(model_name, model_type)
                logger.info(f"Preloaded {model_type} model: {model_name}")
                track_nlp_request("preload_models", model_name, "success")
        except Exception as e:
            logger.error(f"Failed to preload {model_type} model {model_name}: {e!s}")
            track_nlp_request("preload_models", model_name, "error")
            # Continue with other models even if one fails

    # Log memory usage
    memory_info = nlp_model_manager.get_memory_usage()
    logger.info(
        f"Total models loaded: {memory_info['total_models']}, "
        f"Memory usage: {memory_info['total_memory_mb']:.2f} MB"
    )


def health_check_models() -> dict[str, Any]:
    """Perform health check on all loaded models."""
    return nlp_model_manager.health_check()
