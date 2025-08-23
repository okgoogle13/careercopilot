"""
Tests for the monitoring and logging system
"""

import asyncio
from unittest.mock import MagicMock, patch

import pytest
from app.core.logging_config import RequestContextLogger, StructuredFormatter, get_logging_config, request_id_context, user_id_context
from app.core.monitoring import MetricsCollector, PerformanceMetrics, monitor_performance, performance_context, track_ai_usage, track_error, track_user_action


class TestMetricsCollector:
    """Test metrics collection functionality"""

    @pytest.fixture
    def collector(self):
        return MetricsCollector()

    def test_increment_counter(self, collector):
        # Test basic counter increment
        collector.increment_counter("test_counter")
        assert collector.counters["test_counter"] == 1

        # Test increment with value
        collector.increment_counter("test_counter", 5)
        assert collector.counters["test_counter"] == 6

        # Test with labels
        collector.increment_counter("labeled_counter", labels={"type": "test"})
        assert collector.counters["labeled_counter{type=test}"] == 1

    def test_set_gauge(self, collector):
        # Test gauge setting
        collector.set_gauge("test_gauge", 42.5)
        assert collector.gauges["test_gauge"] == 42.5

        # Test with labels
        collector.set_gauge("memory_usage", 75.0, labels={"process": "main"})
        assert collector.gauges["memory_usage{process=main}"] == 75.0

    def test_record_histogram(self, collector):
        # Test histogram recording
        values = [1.0, 2.0, 3.0, 2.5, 1.5]
        for value in values:
            collector.record_histogram("response_time", value)

        assert len(collector.histograms["response_time"]) == 5
        assert all(v in collector.histograms["response_time"] for v in values)

    def test_record_performance(self, collector):
        # Test performance metrics recording
        collector.record_performance("test_operation", 0.5, success=True)
        collector.record_performance(
            "test_operation", 0.7, success=False, error="Test error"
        )

        metrics = collector.performance_metrics["test_operation"]
        assert metrics.count == 2
        assert metrics.error_count == 1
        assert metrics.total_time == 1.2
        assert metrics.avg_time == 0.6
        assert metrics.last_error == "Test error"

    def test_metrics_summary(self, collector):
        # Add some test data
        collector.increment_counter("requests_total", 100)
        collector.set_gauge("cpu_usage", 45.0)
        collector.record_histogram("response_time", 0.25)
        collector.record_performance("api_call", 0.3, success=True)

        summary = collector.get_metrics_summary()

        assert "uptime_seconds" in summary
        assert "counters" in summary
        assert "gauges" in summary
        assert "performance_metrics" in summary
        assert "histogram_summaries" in summary

        assert summary["counters"]["requests_total"] == 100
        assert summary["gauges"]["cpu_usage"] == 45.0

    def test_prometheus_export(self, collector):
        # Add test data
        collector.increment_counter("http_requests_total", 50)
        collector.set_gauge("memory_usage_bytes", 1024000)

        prometheus_output = collector.export_prometheus_format()

        assert "# TYPE http_requests_total counter" in prometheus_output
        assert "http_requests_total 50" in prometheus_output
        assert "# TYPE memory_usage_bytes gauge" in prometheus_output
        assert "memory_usage_bytes 1024000" in prometheus_output


class TestPerformanceMetrics:
    """Test performance metrics calculations"""

    def test_performance_calculations(self):
        metrics = PerformanceMetrics()

        # Add some performance data
        times = [0.1, 0.2, 0.15, 0.3, 0.12, 0.18, 0.25, 0.09, 0.22, 0.16]
        for duration in times:
            metrics.count += 1
            metrics.total_time += duration
            metrics.min_time = min(metrics.min_time, duration)
            metrics.max_time = max(metrics.max_time, duration)
            metrics.recent_times.append(duration)

        # Test calculations
        assert metrics.count == 10
        assert abs(metrics.avg_time - 0.177) < 0.001  # Average of times
        assert metrics.min_time == 0.09
        assert metrics.max_time == 0.3
        assert metrics.error_rate == 0.0  # No errors added

        # Test P95 calculation
        p95_time = metrics.p95_time
        assert 0.2 <= p95_time <= 0.3  # Should be in upper range


class TestMonitoringDecorators:
    """Test monitoring decorators and context managers"""

    @pytest.mark.asyncio
    async def test_monitor_performance_decorator_async(self):
        call_count = 0

        @monitor_performance("test_async_operation")
        async def test_async_function(delay: float = 0.01):
            nonlocal call_count
            call_count += 1
            await asyncio.sleep(delay)
            return "success"

        # Test successful execution
        result = await test_async_function(0.01)
        assert result == "success"
        assert call_count == 1

        # Check that metrics were recorded
        from app.core.monitoring import get_metrics_collector

        collector = get_metrics_collector()

        assert "test_async_operation" in collector.performance_metrics
        metrics = collector.performance_metrics["test_async_operation"]
        assert metrics.count >= 1
        assert metrics.error_count == 0

    @pytest.mark.asyncio
    async def test_monitor_performance_decorator_error(self):
        @monitor_performance("test_error_operation")
        async def test_error_function():
            raise ValueError("Test error")

        # Test error handling
        with pytest.raises(ValueError, match="Test error"):
            await test_error_function()

        # Check that error was recorded
        from app.core.monitoring import get_metrics_collector

        collector = get_metrics_collector()

        metrics = collector.performance_metrics["test_error_operation"]
        assert metrics.error_count >= 1
        assert "Test error" in str(metrics.last_error)

    @pytest.mark.asyncio
    async def test_performance_context_manager(self):
        async with performance_context("test_context_operation"):
            await asyncio.sleep(0.01)

        # Check that metrics were recorded
        from app.core.monitoring import get_metrics_collector

        collector = get_metrics_collector()

        assert "test_context_operation" in collector.performance_metrics
        metrics = collector.performance_metrics["test_context_operation"]
        assert metrics.count >= 1
        assert metrics.error_count == 0


class TestBusinessMetrics:
    """Test business metrics tracking functions"""

    def test_track_user_action(self):
        with patch("app.core.monitoring.get_metrics_collector") as mock_get_collector:
            mock_collector = MagicMock()
            mock_get_collector.return_value = mock_collector

            track_user_action("document_upload", "user_123", file_size=1024)

            # Verify counter was incremented
            mock_collector.increment_counter.assert_called_with(
                "user_action_document_upload", labels={"user_id": "user_123"}
            )

    def test_track_ai_usage(self):
        with patch("app.core.monitoring.get_metrics_collector") as mock_get_collector:
            mock_collector = MagicMock()
            mock_get_collector.return_value = mock_collector

            track_ai_usage("resume_analysis", "user_456", tokens_used=1500, cached=True)

            # Verify multiple counters were incremented
            expected_calls = [
                (("ai_operation_resume_analysis",), {}),
                (("ai_operation_total",), {}),
                (("ai_operation_resume_analysis_cached",), {}),
                (("ai_operation_cached_total",), {}),
                (("ai_tokens_used_total",), {"value": 1500}),
            ]

            assert mock_collector.increment_counter.call_count >= 4
            mock_collector.record_histogram.assert_called_with(
                "ai_tokens_per_resume_analysis", 1500
            )

    def test_track_error(self):
        with patch("app.core.monitoring.get_metrics_collector") as mock_get_collector:
            mock_collector = MagicMock()
            mock_get_collector.return_value = mock_collector

            track_error("ValueError", "auth_service", "Invalid credentials", "user_789")

            # Verify error tracking
            mock_collector.increment_counter.assert_any_call(
                "error_ValueError", labels={"component": "auth_service"}
            )
            mock_collector.increment_counter.assert_any_call("error_total")


class TestLoggingSystem:
    """Test logging configuration and structured formatting"""

    def test_structured_formatter(self):
        import json
        import logging

        formatter = StructuredFormatter()

        # Create test log record
        record = logging.LogRecord(
            name="test.logger",
            level=logging.INFO,
            pathname="/app/test.py",
            lineno=42,
            msg="Test message with %s",
            args=("parameter",),
            exc_info=None,
        )
        record.module = "test"
        record.funcName = "test_function"

        # Format record
        formatted = formatter.format(record)

        # Parse as JSON
        log_data = json.loads(formatted)

        # Verify structure
        assert log_data["level"] == "INFO"
        assert log_data["logger"] == "test.logger"
        assert log_data["message"] == "Test message with parameter"
        assert log_data["module"] == "test"
        assert log_data["function"] == "test_function"
        assert log_data["line"] == 42
        assert "timestamp" in log_data

    def test_logging_config_environments(self):
        # Test development config
        dev_config = get_logging_config("development")
        assert dev_config["root"]["level"] == "DEBUG"
        assert "console" in dev_config["handlers"]
        assert "file_debug" in dev_config["handlers"]

        # Test production config
        prod_config = get_logging_config("production")
        assert prod_config["root"]["level"] == "WARNING"
        assert "console" in prod_config["handlers"]
        assert "file_error" in prod_config["handlers"]

    def test_request_context_logger(self):
        # Test context variable setting
        with RequestContextLogger("req_123", "user_456"):
            request_id = request_id_context.get()
            user_id = user_id_context.get()

            assert request_id == "req_123"
            assert user_id == "user_456"

        # Context should be cleared after exiting
        assert request_id_context.get() is None
        assert user_id_context.get() is None


class TestSystemMonitoring:
    """Test system resource monitoring"""

    @pytest.mark.asyncio
    async def test_system_monitor_initialization(self):
        from app.core.monitoring import SystemMonitor

        monitor = SystemMonitor(collection_interval=1.0)
        assert monitor.collection_interval == 1.0
        assert not monitor._running

    @pytest.mark.asyncio
    @patch("psutil.cpu_percent")
    @patch("psutil.virtual_memory")
    @patch("psutil.disk_usage")
    async def test_system_metrics_collection(self, mock_disk, mock_memory, mock_cpu):
        from app.core.monitoring import SystemMonitor

        # Mock system data
        mock_cpu.return_value = 25.5
        mock_memory.return_value = MagicMock(
            percent=45.2, available=8589934592, used=4294967296
        )
        mock_disk.return_value = MagicMock(
            percent=68.1, free=107374182400, used=42949672960
        )

        monitor = SystemMonitor(collection_interval=0.1)

        # Start monitoring briefly
        await monitor.start()
        await asyncio.sleep(0.2)  # Let it collect at least once
        await monitor.stop()

        # Check that metrics were collected
        from app.core.monitoring import get_metrics_collector

        collector = get_metrics_collector()

        # Verify system metrics were recorded
        gauges = collector.gauges
        assert any("system_cpu_percent" in key for key in gauges.keys())


@pytest.mark.integration
class TestMonitoringIntegration:
    """Integration tests for the complete monitoring system"""

    @pytest.mark.asyncio
    async def test_end_to_end_monitoring_flow(self):
        """Test complete monitoring flow from request to metrics"""
        from app.core.monitoring import get_metrics_collector

        collector = get_metrics_collector()

        # Simulate a complete request flow
        # 1. Track request start
        collector.increment_counter("http_requests_total")

        # 2. Perform monitored operation
        @monitor_performance("integration_test_operation")
        async def test_operation():
            await asyncio.sleep(0.01)
            return {"status": "success"}

        result = await test_operation()

        # 3. Track business metrics
        track_user_action("test_action", "test_user")
        track_ai_usage("test_ai_op", "test_user", tokens_used=100)

        # 4. Get metrics summary
        summary = collector.get_metrics_summary()

        # Verify complete flow
        assert result["status"] == "success"
        assert "integration_test_operation" in summary["performance_metrics"]
        assert summary["counters"]["http_requests_total"] >= 1
        assert summary["counters"]["user_action_test_action"] >= 1
        assert summary["counters"]["ai_operation_test_ai_op"] >= 1


# Fixtures for all tests
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
