"""
Production Configuration for CareerCopilot

This module contains production-specific settings and configurations.
"""
import os
from typing import Any, Dict


class ProductionConfig:
    """Production configuration class."""

    # Application settings
    DEBUG = False
    TESTING = False
    ENV = "production"

    # Monitoring configuration
    PROMETHEUS_MULTIPROC_DIR = os.getenv("PROMETHEUS_MULTIPROC_DIR", "/tmp/prometheus_metrics")
    METRICS_PORT = int(os.getenv("METRICS_PORT", "8001"))
    ENABLE_METRICS = os.getenv("ENABLE_METRICS", "true").lower() == "true"
    METRICS_PATH = os.getenv("METRICS_PATH", "/metrics")

    # NLP Monitoring
    NLP_METRICS_ENABLED = os.getenv("NLP_METRICS_ENABLED", "true").lower() == "true"
    NLP_METRICS_UPDATE_INTERVAL = int(os.getenv("NLP_METRICS_UPDATE_INTERVAL", "60"))  # seconds
    NLP_METRICS_RETENTION_DAYS = int(os.getenv("NLP_METRICS_RETENTION_DAYS", "7"))

    # Logging configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # Performance settings
    MAX_WORKERS = int(os.getenv("MAX_WORKERS", "4"))
    WORKER_TIMEOUT = int(os.getenv("WORKER_TIMEOUT", "120"))  # seconds

    # Caching configuration
    CACHE_TTL = int(os.getenv("CACHE_TTL_HOURS", "24")) * 3600  # Convert hours to seconds

    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        """Convert configuration to dictionary, excluding private and callable attributes."""
        return {
            key: value
            for key, value in cls.__dict__.items()
            if not key.startswith("_")
            and not callable(value)
            and not isinstance(value, classmethod)
        }
