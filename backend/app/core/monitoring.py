"""Comprehensive monitoring and metrics collection for CareerCopilot

Provides application performance monitoring, error tracking, and business metrics
with support for Prometheus, custom dashboards, and alerting."""

import asyncio
import logging
import threading
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from functools import wraps
from typing import Any, Callable, Dict, List, Optional

import psutil
from fastapi import FastAPI, Request, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    REGISTRY,
    Counter,
    Histogram,
    generate_latest,
)
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


@dataclass
class MetricPoint:
    """Single metric data point"""

    timestamp: datetime
    value: float
    labels: Dict[str, str] = field(default_factory=dict)


@dataclass
class PerformanceMetrics:
    """Performance metrics for a specific operation"""

    count: int = 0
    total_time: float = 0.0
    min_time: float = float("inf")
    max_time: float = 0.0
    error_count: int = 0
    last_error: Optional[str] = None
    recent_times: deque = field(default_factory=lambda: deque(maxlen=100))

    @property
    def avg_time(self) -> float:
        return self.total_time / self.count if self.count > 0 else 0.0

    @property
    def error_rate(self) -> float:
        return self.error_count / self.count if self.count > 0 else 0.0

    @property
    def p95_time(self) -> float:
        if not self.recent_times:
            return 0.0
        sorted_times = sorted(self.recent_times)
        index = int(len(sorted_times) * 0.95)
        return sorted_times[min(index, len(sorted_times) - 1)]


class MetricsCollector:
    """Central metrics collection system"""

    def __init__(self):
        self.metrics: Dict[str, List[MetricPoint]] = defaultdict(list)
        self.performance_metrics: Dict[str, PerformanceMetrics] = defaultdict(PerformanceMetrics)
        self.counters: Dict[str, int] = defaultdict(int)
        self.gauges: Dict[str, float] = {}
        self.histograms: Dict[str, List[float]] = defaultdict(list)
        self._lock = threading.Lock()
        self._start_time = datetime.now(timezone.utc)

    def increment_counter(self, name: str, value: int = 1, labels: Optional[Dict[str, str]] = None):
        """Increment a counter metric"""
        with self._lock:
            full_name = self._build_metric_name(name, labels)
            self.counters[full_name] += value
            self._add_metric_point(name, value, labels)

    def set_gauge(self, name: str, value: float, labels: Optional[Dict[str, str]] = None):
        """Set a gauge metric value"""
        with self._lock:
            full_name = self._build_metric_name(name, labels)
            self.gauges[full_name] = value
            self._add_metric_point(name, value, labels)

    def record_histogram(self, name: str, value: float, labels: Optional[Dict[str, str]] = None):
        """Record a value in a histogram"""
        with self._lock:
            full_name = self._build_metric_name(name, labels)
            self.histograms[full_name].append(value)
            # Keep only last 1000 values to prevent memory issues
            if len(self.histograms[full_name]) > 1000:
                self.histograms[full_name] = self.histograms[full_name][-1000:]
            self._add_metric_point(name, value, labels)

    def record_performance(
        self,
        operation: str,
        duration: float,
        success: bool = True,
        error: Optional[str] = None,
    ):
        """Record performance metrics for an operation"""
        with self._lock:
            metrics = self.performance_metrics[operation]
            metrics.count += 1
            metrics.total_time += duration
            metrics.min_time = min(metrics.min_time, duration)
            metrics.max_time = max(metrics.max_time, duration)
            metrics.recent_times.append(duration)

            if not success:
                metrics.error_count += 1
                metrics.last_error = error

    def _build_metric_name(self, name: str, labels: Optional[Dict[str, str]] = None) -> str:
        """Build a full metric name including labels"""
        if not labels:
            return name

        label_str = ",".join(f"{k}={v}" for k, v in sorted(labels.items()))
        return f"{name}{{{label_str}}}"

    def _add_metric_point(self, name: str, value: float, labels: Optional[Dict[str, str]] = None):
        """Add a metric point to the time series"""
        point = MetricPoint(timestamp=datetime.now(timezone.utc), value=value, labels=labels or {})
        self.metrics[name].append(point)

        # Keep only last 1000 points per metric
        if len(self.metrics[name]) > 1000:
            self.metrics[name] = self.metrics[name][-1000:]

    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get a summary of all collected metrics"""
        with self._lock:
            uptime = (datetime.now(timezone.utc) - self._start_time).total_seconds()

            return {
                "uptime_seconds": uptime,
                "counters": dict(self.counters),
                "gauges": dict(self.gauges),
                "performance_metrics": {
                    name: {
                        "count": pm.count,
                        "avg_time_ms": pm.avg_time * 1000,
                        "min_time_ms": (pm.min_time * 1000 if pm.min_time != float("inf") else 0),
                        "max_time_ms": pm.max_time * 1000,
                        "p95_time_ms": pm.p95_time * 1000,
                        "error_count": pm.error_count,
                        "error_rate": pm.error_rate,
                        "last_error": pm.last_error,
                    }
                    for name, pm in self.performance_metrics.items()
                },
                "histogram_summaries": {
                    name: {
                        "count": len(values),
                        "avg": sum(values) / len(values) if values else 0,
                        "min": min(values) if values else 0,
                        "max": max(values) if values else 0,
                        "p50": self._percentile(values, 0.5),
                        "p95": self._percentile(values, 0.95),
                        "p99": self._percentile(values, 0.99),
                    }
                    for name, values in self.histograms.items()
                    if values
                },
            }

    def _percentile(self, values: List[float], percentile: float) -> float:
        """Calculate percentile from a list of values"""
        if not values:
            return 0.0
        sorted_values = sorted(values)
        index = int(len(sorted_values) * percentile)
        return sorted_values[min(index, len(sorted_values) - 1)]

    def export_prometheus_format(self) -> str:
        """Export metrics in Prometheus format"""
        output = []
        timestamp = int(time.time() * 1000)

        # Export counters
        for name, value in self.counters.items():
            output.append(f"# TYPE {name} counter")
            output.append(f"{name} {value} {timestamp}")

        # Export gauges
        for name, value in self.gauges.items():
            output.append(f"# TYPE {name} gauge")
            output.append(f"{name} {value} {timestamp}")

        # Export histograms
        for name, values in self.histograms.items():
            if values:
                output.append(f"# TYPE {name} histogram")
                output.append(f"{name}_count {len(values)} {timestamp}")
                output.append(f"{name}_sum {sum(values)} {timestamp}")
                # Add buckets for histogram
                buckets = [
                    0.005,
                    0.01,
                    0.025,
                    0.05,
                    0.1,
                    0.25,
                    0.5,
                    1.0,
                    2.5,
                    5.0,
                    10.0,
                ]
                for bucket in buckets:
                    count = sum(1 for v in values if v <= bucket)
                    output.append(f'{{{name}_bucket{{le="{bucket}"}}}} {count} {timestamp}')
                output.append('{{{name}_bucket{{le="+Inf"}}}} {len(values)} {timestamp}')

        return "\n".join(output)


# Global metrics collector instance
_metrics_collector = MetricsCollector()


def get_metrics_collector() -> MetricsCollector:
    """Get the global metrics collector instance"""
    return _metrics_collector


# Decorators for automatic metrics collection


def monitor_performance(operation_name: Optional[str] = None, record_args: bool = False):
    """
    Decorator to monitor function performance

    Args:
        operation_name: Custom name for the operation (defaults to function name)
        record_args: Whether to record function arguments in logs
    """

    def decorator(func: Callable) -> Callable:
        op_name = operation_name or f"{func.__module__}.{func.__name__}"

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            collector = get_metrics_collector()

            # Log function start
            extra_data = {"operation": op_name}
            if record_args:
                extra_data.update({"args_count": len(args), "kwargs_keys": list(kwargs.keys())})

            logger.debug(f"Starting operation: {op_name}", extra=extra_data)

            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time

                # Record successful operation
                collector.record_performance(op_name, duration, success=True)
                collector.increment_counter(f"{op_name}_total")
                collector.record_histogram(f"{op_name}_duration_seconds", duration)

                logger.info(
                    f"Operation {op_name} completed successfully",
                    extra={
                        "operation": op_name,
                        "duration_ms": duration * 1000,
                        "success": True,
                    },
                )

                return result

            except Exception as e:
                duration = time.time() - start_time
                error_msg = str(e)

                # Record failed operation
                collector.record_performance(op_name, duration, success=False, error=error_msg)
                collector.increment_counter(f"{op_name}_total")
                collector.increment_counter(f"{op_name}_errors")

                logger.error(
                    f"Operation {op_name} failed",
                    exc_info=True,
                    extra={
                        "operation": op_name,
                        "duration_ms": duration * 1000,
                        "success": False,
                        "error_type": type(e).__name__,
                        "error_message": error_msg,
                    },
                )

                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            collector = get_metrics_collector()

            logger.debug(f"Starting operation: {op_name}")

            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time

                collector.record_performance(op_name, duration, success=True)
                collector.increment_counter(f"{op_name}_total")
                collector.record_histogram(f"{op_name}_duration_seconds", duration)

                logger.info(
                    f"Operation {op_name} completed successfully",
                    extra={"operation": op_name, "duration_ms": duration * 1000},
                )

                return result

            except Exception as e:
                duration = time.time() - start_time
                error_msg = str(e)

                collector.record_performance(op_name, duration, success=False, error=error_msg)
                collector.increment_counter(f"{op_name}_total")
                collector.increment_counter(f"{op_name}_errors")

                logger.error(
                    f"Operation {op_name} failed",
                    exc_info=True,
                    extra={
                        "operation": op_name,
                        "duration_ms": duration * 1000,
                        "error_type": type(e).__name__,
                    },
                )

                raise

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


@asynccontextmanager
async def performance_context(operation_name: str):
    """Context manager for monitoring operation performance"""
    start_time = time.time()
    collector = get_metrics_collector()

    logger.debug(f"Starting operation: {operation_name}")

    try:
        yield
        duration = time.time() - start_time

        collector.record_performance(operation_name, duration, success=True)
        collector.increment_counter(f"{operation_name}_total")
        collector.record_histogram(f"{operation_name}_duration_seconds", duration)

        logger.info(
            f"Operation {operation_name} completed successfully",
            extra={"operation": operation_name, "duration_ms": duration * 1000},
        )

    except Exception as e:
        duration = time.time() - start_time
        error_msg = str(e)

        collector.record_performance(operation_name, duration, success=False, error=error_msg)
        collector.increment_counter(f"{operation_name}_total")
        collector.increment_counter(f"{operation_name}_errors")

        logger.error(
            f"Operation {operation_name} failed",
            exc_info=True,
            extra={
                "operation": operation_name,
                "duration_ms": duration * 1000,
                "error_type": type(e).__name__,
            },
        )

        raise


class SystemMonitor:
    """System resource monitoring"""

    def __init__(self, collection_interval: float = 60.0):
        self.collection_interval = collection_interval
        self.collector = get_metrics_collector()
        self._monitoring_task: Optional[asyncio.Task] = None
        self._running = False

    async def start(self):
        """Start system monitoring"""
        if self._running:
            return

        self._running = True
        self._monitoring_task = asyncio.create_task(self._monitor_loop())
        logger.info("System monitoring started")

    async def stop(self):
        """Stop system monitoring"""
        self._running = False
        if self._monitoring_task:
            self._monitoring_task.cancel()
            try:
                await self._monitoring_task
            except asyncio.CancelledError:
                pass
        logger.info("System monitoring stopped")

    async def _monitor_loop(self):
        """Main monitoring loop"""
        while self._running:
            try:
                await self._collect_system_metrics()
                await asyncio.sleep(self.collection_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in system monitoring: {e}", exc_info=True)
                await asyncio.sleep(5)  # Brief pause before retrying

    async def _collect_system_metrics(self):
        """Collect system resource metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            self.collector.set_gauge("system_cpu_percent", cpu_percent)

            # Memory metrics
            memory = psutil.virtual_memory()
            self.collector.set_gauge("system_memory_percent", memory.percent)
            self.collector.set_gauge("system_memory_available_bytes", memory.available)
            self.collector.set_gauge("system_memory_used_bytes", memory.used)

            # Disk metrics
            disk = psutil.disk_usage("/")
            self.collector.set_gauge("system_disk_percent", disk.percent)
            self.collector.set_gauge("system_disk_free_bytes", disk.free)
            self.collector.set_gauge("system_disk_used_bytes", disk.used)

            # Network metrics (if available)
            try:
                network = psutil.net_io_counters()
                self.collector.set_gauge("system_network_bytes_sent", network.bytes_sent)
                self.collector.set_gauge("system_network_bytes_recv", network.bytes_recv)
            except AttributeError:
                # Network metrics not available on this system
                pass

            # Process metrics
            process = psutil.Process()
            self.collector.set_gauge("process_cpu_percent", process.cpu_percent())
            memory_info = process.memory_info()
            self.collector.set_gauge("process_memory_rss_bytes", memory_info.rss)
            self.collector.set_gauge("process_memory_vms_bytes", memory_info.vms)

            # File descriptor count (Unix only)
            try:
                self.collector.set_gauge("process_open_fds", process.num_fds())
            except (AttributeError, NotImplementedError):
                # Not available on Windows
                pass

            logger.debug("System metrics collected")

        except Exception as e:
            logger.error(f"Failed to collect system metrics: {e}", exc_info=True)


# Global system monitor instance
_system_monitor: Optional[SystemMonitor] = None


async def start_system_monitoring(interval: float = 60.0) -> SystemMonitor:
    """Start system resource monitoring"""
    global _system_monitor
    if _system_monitor is None:
        _system_monitor = SystemMonitor(collection_interval=interval)
    await _system_monitor.start()
    return _system_monitor


async def stop_system_monitoring():
    """Stop system resource monitoring"""
    global _system_monitor
    if _system_monitor:
        await _system_monitor.stop()
        _system_monitor = None


# Business metrics helpers


def track_user_action(action: str, user_id: str, **metadata):
    """Track user actions for business intelligence"""
    collector = get_metrics_collector()

    # Increment action counter
    collector.increment_counter(f"user_action_{action}", labels={"user_id": user_id})

    # Log the action
    logger.info(
        f"User action: {action}",
        extra={"user_id": user_id, "action": action, "metadata": metadata},
    )


def track_ai_usage(
    operation_type: str,
    user_id: str,
    tokens_used: Optional[int] = None,
    cached: bool = False,
):
    """Track AI operation usage for cost monitoring"""
    collector = get_metrics_collector()

    # Track usage counters
    collector.increment_counter(f"ai_operation_{operation_type}")
    collector.increment_counter("ai_operation_total")

    if cached:
        collector.increment_counter(f"ai_operation_{operation_type}_cached")
        collector.increment_counter("ai_operation_cached_total")

    if tokens_used:
        collector.increment_counter("ai_tokens_used_total", tokens_used)
        collector.record_histogram(f"ai_tokens_per_{operation_type}", tokens_used)

    # Log usage
    logger.info(
        f"AI operation: {operation_type}",
        extra={
            "user_id": user_id,
            "operation_type": operation_type,
            "tokens_used": tokens_used,
            "cached": cached,
        },
    )


def track_error(error_type: str, component: str, error_message: str, user_id: Optional[str] = None):
    """Track application errors for monitoring"""
    collector = get_metrics_collector()

    # Increment error counters
    collector.increment_counter(f"error_{error_type}", labels={"component": component})
    collector.increment_counter("error_total")

    # Log the error
    logger.error(
        f"Application error in {component}",
        extra={
            "error_type": error_type,
            "component": component,
            "error_message": error_message,
            "user_id": user_id,
        },
    )


# =============================================================================
# Prometheus Metrics Integration
# =============================================================================

# Define Prometheus metrics
http_requests_total = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status_code", "environment"],
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint", "environment"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0],
)

ai_requests_total = Counter(
    "ai_requests_total",
    "Total number of AI service requests",
    ["ai_service", "operation", "status", "environment"],
)

ai_request_duration_seconds = Histogram(
    "ai_request_duration_seconds",
    "AI service request duration in seconds",
    ["ai_service", "operation", "environment"],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 30.0, 60.0],
)

application_errors_total = Counter(
    "application_errors_total",
    "Total application errors",
    ["error_type", "component", "severity", "environment"],
)


class PrometheusMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for Prometheus metrics collection."""

    def __init__(self, app: FastAPI, environment: str = "development"):
        super().__init__(app)
        self.environment = environment

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request and collect metrics."""
        start_time = time.time()
        method = request.method
        endpoint = self._normalize_path(request.url.path)

        try:
            response = await call_next(request)
            status_code = str(response.status_code)
        except Exception as e:
            application_errors_total.labels(
                error_type=type(e).__name__,
                component="middleware",
                severity="high",
                environment=self.environment,
            ).inc()
            status_code = "500"
            raise
        finally:
            duration = time.time() - start_time

            http_requests_total.labels(
                method=method,
                endpoint=endpoint,
                status_code=status_code,
                environment=self.environment,
            ).inc()

            http_request_duration_seconds.labels(
                method=method,
                endpoint=endpoint,
                environment=self.environment,
            ).observe(duration)

        return response

    def _normalize_path(self, path: str) -> str:
        """Normalize path to reduce cardinality."""
        if path.startswith("/api/v1/"):
            parts = path.split("/")
            normalized = []
            for part in parts:
                if part.isdigit() or len(part) == 36:  # UUID-like
                    normalized.append("{id}")
                else:
                    normalized.append(part)
            return "/".join(normalized)
        return path


def setup_prometheus_monitoring(app: FastAPI, environment: str = "development") -> None:
    """Set up Prometheus monitoring for FastAPI application."""

    # Add metrics middleware
    app.add_middleware(PrometheusMiddleware, environment=environment)

    # Add metrics endpoint
    @app.get("/metrics", include_in_schema=False)
    async def metrics():
        """Prometheus metrics endpoint."""
        return Response(
            generate_latest(REGISTRY),
            media_type=CONTENT_TYPE_LATEST,
        )

    # Add health check endpoints
    @app.get("/health", include_in_schema=False)
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "environment": environment}

    @app.get("/ready", include_in_schema=False)
    async def readiness_check():
        """Readiness check endpoint."""
        return {"status": "ready", "environment": environment}
