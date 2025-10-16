"""
NLP Monitoring Module

This module provides monitoring capabilities for the NLP service,
including metrics collection and health checks.
"""

import logging
import time
from functools import wraps
from typing import Any, Dict, Optional

import psutil

logger = logging.getLogger(__name__)


class NLPMonitor:
    """Monitor for NLP service metrics and health."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(NLPMonitor, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self._metrics = {}
        self._initialized = True
        logger.info("NLP Monitor initialized")

    def track_operation(self, name: str, model: str = "default"):
        """Decorator to track NLP operation metrics."""

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
                    logger.error(f"Error in {name}: {str(e)}")
                    raise
                finally:
                    duration = time.time() - start_time
                    self.record_metric(
                        f"{name}_duration_seconds",
                        duration,
                        {"operation": name, "model": model, "status": status},
                    )
                    self.record_metric(
                        f"{name}_count",
                        1,
                        {"operation": name, "model": model, "status": status},
                    )

            return wrapper

        return decorator

    def record_metric(
        self, name: str, value: float, labels: Optional[Dict[str, str]] = None
    ):
        """Record a metric with optional labels."""
        if name not in self._metrics:
            self._metrics[name] = []
        self._metrics[name].append((value, labels or {}))

    def get_metrics(self) -> Dict[str, Any]:
        """Get all recorded metrics."""
        return self._metrics

    def get_health(self) -> Dict[str, Any]:
        """Get health status of the NLP service."""
        process = psutil.Process()
        memory_info = process.memory_info()

        return {
            "status": "healthy",
            "memory_usage_mb": memory_info.rss / (1024 * 1024),
            "cpu_percent": process.cpu_percent(),
            "thread_count": process.num_threads(),
            "metrics_recorded": len(self._metrics),
        }


# Global monitor instance
nlp_monitor = NLPMonitor()


def get_nlp_health() -> Dict[str, Any]:
    """Get the health status of the NLP service."""
    return nlp_monitor.get_health()


def track_nlp_operation(name: str, model: str = "default"):
    """Decorator to track NLP operations."""
    return nlp_monitor.track_operation(name, model)
