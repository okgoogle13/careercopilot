"""
NLP Metrics Service for Production

This service handles the collection and export of NLP-related metrics in production.
"""

import logging
import os
import threading
import time
from typing import Any, Dict, Optional

from prometheus_client import Counter, Gauge, Histogram, start_http_server

from app.config.production import ProductionConfig as config

logger = logging.getLogger(__name__)


class NLPMetricsService:
    """Service for managing NLP metrics collection and export."""

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(NLPMetricsService, cls).__new__(cls)
                cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self._metrics: Dict[str, Any] = {}
        self._initialized = True
        self._running = False
        self._thread: Optional[threading.Thread] = None

        # Initialize Prometheus metrics
        self._init_prometheus_metrics()

        logger.info("NLP Metrics Service initialized")

    def _init_prometheus_metrics(self):
        """Initialize Prometheus metrics."""
        self.request_count = Counter(
            "nlp_requests_total",
            "Total number of NLP requests",
            ["endpoint", "model", "status"],
        )

        self.request_duration = Histogram(
            "nlp_request_duration_seconds",
            "Time spent processing NLP requests",
            ["endpoint", "model"],
            buckets=(0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, float("inf")),
        )

        self.tokens_processed = Counter(
            "nlp_tokens_processed_total",
            "Total number of tokens processed",
            ["model", "operation"],
        )

        self.model_load_time = Gauge(
            "nlp_model_load_time_seconds", "Time taken to load NLP models", ["model"]
        )

        self.model_memory_usage = Gauge(
            "nlp_model_memory_usage_bytes",
            "Memory usage of loaded NLP models",
            ["model"],
        )

    def start_metrics_server(self):
        """Start the Prometheus metrics server."""
        if not config.ENABLE_METRICS:
            logger.info("Metrics collection is disabled in configuration")
            return

        try:
            # Ensure the directory for multiprocess metrics exists
            os.makedirs(config.PROMETHEUS_MULTIPROC_DIR, exist_ok=True)
            os.environ["PROMETHEUS_MULTIPROC_DIR"] = config.PROMETHEUS_MULTIPROC_DIR

            # Start the metrics server in a separate thread
            self._running = True
            self._thread = threading.Thread(target=self._run_metrics_server, daemon=True)
            self._thread.start()
            logger.info(f"Started Prometheus metrics server on port {config.METRICS_PORT}")

        except Exception as e:
            logger.error(f"Failed to start metrics server: {str(e)}")

    def _run_metrics_server(self):
        """Run the Prometheus metrics server."""
        try:
            start_http_server(config.METRICS_PORT)
            while self._running:
                time.sleep(1)
        except Exception as e:
            logger.error(f"Metrics server error: {str(e)}")
            self._running = False

    def stop_metrics_server(self):
        """Stop the metrics server."""
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5)
        logger.info("Metrics server stopped")

    def track_request(self, endpoint: str, model: str, status: str = "success"):
        """Track an NLP request."""
        if config.NLP_METRICS_ENABLED:
            self.request_count.labels(endpoint=endpoint, model=model, status=status).inc()

    def track_duration(self, endpoint: str, model: str):
        """Track the duration of an NLP operation."""
        if config.NLP_METRICS_ENABLED:
            return self.request_duration.labels(endpoint=endpoint, model=model).time()
        return nullcontext()

    def track_tokens(self, model: str, operation: str, count: int):
        """Track the number of tokens processed."""
        if config.NLP_METRICS_ENABLED and count > 0:
            self.tokens_processed.labels(model=model, operation=operation).inc(count)

    def track_model_load(self, model: str, load_time: float):
        """Track model loading time."""
        if config.NLP_METRICS_ENABLED:
            self.model_load_time.labels(model=model).set(load_time)

    def track_memory_usage(self, model: str, memory_bytes: int):
        """Track model memory usage."""
        if config.NLP_METRICS_ENABLED:
            self.model_memory_usage.labels(model=model).set(memory_bytes)


# Global instance
nlp_metrics_service = NLPMetricsService()


def start_nlp_metrics_service():
    """Start the NLP metrics service."""
    nlp_metrics_service.start_metrics_server()


def stop_nlp_metrics_service():
    """Stop the NLP metrics service."""
    nlp_metrics_service.stop_metrics_server()


# Context manager for tracking operation duration
class nullcontext:
    """Null context manager for when metrics are disabled."""

    def __enter__(self):
        pass

    def __exit__(self, *args):
        pass
