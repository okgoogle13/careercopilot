"""
Tests for the core monitoring module.
"""

from collections import deque
from datetime import datetime, timezone

# import increment_counter, set_gauge, record_histogram, record_performance - these are part of MetricsCollector
from typing import Dict, Optional
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.core.monitoring import MetricPoint, MetricsCollector, PerformanceMetrics


@pytest.fixture
def metrics_collector():
    """Fixture to provide a MetricsCollector instance."""
    return MetricsCollector()


def test_increment_counter(metrics_collector):
    """Test incrementing a counter metric."""
    metrics_collector.increment_counter("test_counter")
    assert metrics_collector.counters["test_counter"] == 1

    metrics_collector.increment_counter("test_counter", 5)
    assert metrics_collector.counters["test_counter"] == 6

    metrics_collector.increment_counter("test_counter_with_label", 2, {"label1": "value1"})
    assert metrics_collector.counters["test_counter_with_label{label1=value1}"] == 2


def test_set_gauge(metrics_collector):
    """Test setting a gauge metric value."""
    metrics_collector.set_gauge("test_gauge", 10.5)
    assert metrics_collector.gauges["test_gauge"] == 10.5

    metrics_collector.set_gauge("test_gauge_with_label", 20.0, {"label2": "value2"})
    assert metrics_collector.gauges["test_gauge_with_label{label2=value2}"] == 20.0


def test_record_histogram(metrics_collector):
    """Test recording a value in a histogram."""
    metrics_collector.record_histogram("test_histogram", 5.0)
    metrics_collector.record_histogram("test_histogram", 10.0)
    assert len(metrics_collector.histograms["test_histogram"]) == 2

    metrics_collector.record_histogram("test_histogram_with_label", 15.0, {"label3": "value3"})
    assert len(metrics_collector.histograms["test_histogram_with_label{label3=value3}"]) == 1

    # Test histogram length limit
    for i in range(1001):
        metrics_collector.record_histogram("test_histogram", float(i))
    assert len(metrics_collector.histograms["test_histogram"]) == 1000


def test_record_performance(metrics_collector):
    """Test recording performance metrics for an operation."""
    metrics_collector.record_performance("test_operation", 0.5, success=True)
    assert metrics_collector.performance_metrics["test_operation"].count == 1
    assert metrics_collector.performance_metrics["test_operation"].total_time == 0.5

    metrics_collector.record_performance(
        "test_operation", 1.0, success=False, error="Something went wrong"
    )
    assert metrics_collector.performance_metrics["test_operation"].count == 2
    assert metrics_collector.performance_metrics["test_operation"].error_count == 1
    assert (
        metrics_collector.performance_metrics["test_operation"].last_error == "Something went wrong"
    )

    assert metrics_collector.performance_metrics["test_operation"].avg_time > 0
    assert metrics_collector.performance_metrics["test_operation"].error_rate > 0


def test_performance_metrics_properties(metrics_collector):
    """Test the properties of PerformanceMetrics."""
    metrics_collector.record_performance("test_operation", 0.2)
    metrics_collector.record_performance("test_operation", 0.8)
    metrics_collector.record_performance("test_operation", 0.5)

    metrics = metrics_collector.performance_metrics["test_operation"]
    assert abs(metrics.avg_time - 0.5) < 1e-6
    assert abs(metrics.error_rate) < 1e-6
    assert metrics.p95_time <= 0.8


def test_build_metric_name(metrics_collector):
    """Test building metric names with labels."""
    labels = {"label1": "value1", "label2": "value2"}
    expected_name = "test_metric{label1=value1,label2=value2}"
    assert metrics_collector._build_metric_name("test_metric", labels) == expected_name
    assert metrics_collector._build_metric_name("test_metric") == "test_metric"


def test_add_metric_point(metrics_collector):
    """Test adding metric points to the time series."""
    metrics_collector._add_metric_point("test_metric", 1.0, {"label": "value"})
    assert len(metrics_collector.metrics["test_metric"]) == 1
    assert isinstance(metrics_collector.metrics["test_metric"][0], MetricPoint)

    # Test metric point length limit
    for i in range(1001):
        metrics_collector._add_metric_point("test_metric", float(i))
    assert len(metrics_collector.metrics["test_metric"]) == 1000
