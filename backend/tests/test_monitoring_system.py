"""
Tests for the monitoring and logging system
"""

import asyncio
from unittest.mock import MagicMock, patch

import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

from core.logging_config import (
    RequestContextLogger,
    StructuredFormatter,
    get_logging_config,
    request_id_context,
    user_id_context,
)
from core.monitoring import (
    MetricsCollector,
    PerformanceMetrics,
    monitor_performance,
    performance_context,
    track_ai_usage,
    track_error,
    track_user_action,
)