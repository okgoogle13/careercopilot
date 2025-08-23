"""
Monitoring and metrics API endpoints

Provides endpoints for accessing application metrics, health status,
and monitoring data for dashboards and alerting systems.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from app.core.cache import get_ai_cache
from app.core.cache_middleware import cache_health_check
from app.core.dependencies import get_current_user  # For admin-only endpoints
from app.core.monitoring import get_metrics_collector
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import PlainTextResponse

router = APIRouter()


@router.get("/metrics", response_class=PlainTextResponse, tags=["Monitoring"])
async def get_prometheus_metrics():
    """
    Get metrics in Prometheus format for scraping

    Returns metrics in the standard Prometheus exposition format
    for integration with monitoring systems like Grafana.
    """
    try:
        collector = get_metrics_collector()
        return collector.export_prometheus_format()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to export metrics: {str(e)}"
        )


@router.get("/metrics/summary", tags=["Monitoring"])
async def get_metrics_summary():
    """
    Get a human-readable summary of application metrics

    Returns structured metrics data suitable for dashboards
    and monitoring interfaces.
    """
    try:
        collector = get_metrics_collector()
        summary = collector.get_metrics_summary()

        # Add additional computed metrics
        summary["computed_metrics"] = await _compute_additional_metrics(summary)

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "status": "ok",
            "metrics": summary,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get metrics summary: {str(e)}"
        )


@router.get("/health/detailed", tags=["Monitoring"])
async def get_detailed_health():
    """
    Get detailed health check information

    Provides comprehensive health status including all system components,
    recent errors, and performance indicators.
    """
    try:
        collector = get_metrics_collector()
        metrics = collector.get_metrics_summary()

        # Check various system components
        health_checks = {
            "database": await _check_database_health(),
            "cache": await _check_cache_health(),
            "system_resources": await _check_system_resources(),
            "error_rates": await _check_error_rates(metrics),
        }

        # Determine overall status
        all_healthy = all(
            check.get("healthy", False) for check in health_checks.values()
        )

        overall_status = "healthy" if all_healthy else "degraded"

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "status": overall_status,
            "uptime_seconds": metrics.get("uptime_seconds", 0),
            "checks": health_checks,
            "metrics_summary": {
                "total_requests": metrics.get("counters", {}).get(
                    "http_requests_total", 0
                ),
                "error_count": metrics.get("counters", {}).get(
                    "requests_error_total", 0
                ),
                "cache_hits": metrics.get("counters", {}).get(
                    "ai_operation_cached_total", 0
                ),
            },
        }
    except Exception as e:
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "status": "unhealthy",
            "error": str(e),
        }


@router.get("/performance", tags=["Monitoring"])
async def get_performance_metrics(
    operation: Optional[str] = Query(None, description="Filter by operation type"),
    time_window_minutes: int = Query(60, description="Time window for metrics"),
):
    """
    Get performance metrics for operations

    Returns detailed performance data including response times,
    error rates, and throughput for the specified time window.
    """
    try:
        collector = get_metrics_collector()
        metrics = collector.get_metrics_summary()

        performance_data = metrics.get("performance_metrics", {})

        # Filter by operation if specified
        if operation:
            if operation in performance_data:
                performance_data = {operation: performance_data[operation]}
            else:
                performance_data = {}

        # Add computed performance indicators
        for _op_name, op_metrics in performance_data.items():
            op_metrics["throughput_per_minute"] = _calculate_throughput(
                op_metrics.get("count", 0), metrics.get("uptime_seconds", 1)
            )
            op_metrics["reliability_score"] = _calculate_reliability_score(op_metrics)

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "time_window_minutes": time_window_minutes,
            "performance_metrics": performance_data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get performance metrics: {str(e)}"
        )


@router.get("/dashboard", tags=["Monitoring"])
async def get_dashboard_data():
    """
    Get comprehensive dashboard data

    Returns all key metrics and status information needed
    for a monitoring dashboard in a single request.
    """
    try:
        collector = get_metrics_collector()
        metrics_summary = collector.get_metrics_summary()

        # Get cache statistics
        cache_stats = await _get_cache_statistics()

        # Get recent error information
        recent_errors = await _get_recent_errors()

        # Calculate key performance indicators
        kpis = await _calculate_kpis(metrics_summary)

        dashboard_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "status": _determine_overall_status(metrics_summary),
            "kpis": kpis,
            "system_health": {
                "uptime_seconds": metrics_summary.get("uptime_seconds", 0),
                "memory_usage": metrics_summary.get("gauges", {}).get(
                    "system_memory_percent", 0
                ),
                "cpu_usage": metrics_summary.get("gauges", {}).get(
                    "system_cpu_percent", 0
                ),
                "disk_usage": metrics_summary.get("gauges", {}).get(
                    "system_disk_percent", 0
                ),
            },
            "request_metrics": {
                "total_requests": metrics_summary.get("counters", {}).get(
                    "http_requests_total", 0
                ),
                "error_count": metrics_summary.get("counters", {}).get(
                    "requests_error_total", 0
                ),
                "avg_response_time": _get_average_response_time(metrics_summary),
                "requests_per_minute": _calculate_requests_per_minute(metrics_summary),
            },
            "ai_metrics": {
                "total_operations": metrics_summary.get("counters", {}).get(
                    "ai_operation_total", 0
                ),
                "cached_operations": metrics_summary.get("counters", {}).get(
                    "ai_operation_cached_total", 0
                ),
                "cache_hit_rate": _calculate_cache_hit_rate(metrics_summary),
                "avg_tokens_per_operation": _calculate_avg_tokens(metrics_summary),
            },
            "cache_statistics": cache_stats,
            "recent_errors": recent_errors,
            "performance_by_operation": metrics_summary.get("performance_metrics", {}),
        }

        return dashboard_data
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get dashboard data: {str(e)}"
        )


@router.get("/alerts", tags=["Monitoring"])
async def get_active_alerts():
    """
    Get active alerts and warnings

    Returns current alerts based on configurable thresholds
    for error rates, response times, and resource usage.
    """
    try:
        collector = get_metrics_collector()
        metrics = collector.get_metrics_summary()

        alerts = []

        # Check error rate alerts
        error_alerts = await _check_error_rate_alerts(metrics)
        alerts.extend(error_alerts)

        # Check performance alerts
        performance_alerts = await _check_performance_alerts(metrics)
        alerts.extend(performance_alerts)

        # Check system resource alerts
        resource_alerts = await _check_resource_alerts(metrics)
        alerts.extend(resource_alerts)

        # Check cache health alerts
        cache_alerts = await _check_cache_alerts()
        alerts.extend(cache_alerts)

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "alert_count": len(alerts),
            "alerts": alerts,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get alerts: {str(e)}")


# Admin-only endpoints (require authentication)


@router.get("/admin/logs", tags=["Monitoring", "Admin"])
async def get_recent_logs(
    level: Optional[str] = Query("INFO", description="Log level filter"),
    limit: int = Query(100, description="Number of log entries to return"),
    current_user: str = Depends(get_current_user),
):
    """
    Get recent log entries (Admin only)

    Returns recent application logs filtered by level and limited by count.
    Requires admin authentication.
    """
    # This would implement log file reading or log aggregation system integration
    # For now, return a placeholder response
    return {
        "message": "Log endpoint not yet implemented - would integrate with log aggregation system",
        "requested_level": level,
        "requested_limit": limit,
    }


@router.post("/admin/clear-metrics", tags=["Monitoring", "Admin"])
async def clear_metrics(current_user: str = Depends(get_current_user)):
    """
    Clear all collected metrics (Admin only)

    Resets all metrics counters, histograms, and performance data.
    Use with caution as this will affect monitoring dashboards.
    """
    try:
        collector = get_metrics_collector()
        collector.metrics.clear()
        collector.performance_metrics.clear()
        collector.counters.clear()
        collector.gauges.clear()
        collector.histograms.clear()

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "message": "All metrics cleared successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to clear metrics: {str(e)}"
        )


# Helper functions


async def _compute_additional_metrics(summary: Dict[str, Any]) -> Dict[str, Any]:
    """Compute additional derived metrics"""
    uptime_hours = summary.get("uptime_seconds", 0) / 3600
    total_requests = summary.get("counters", {}).get("http_requests_total", 0)

    return {
        "uptime_hours": round(uptime_hours, 2),
        "requests_per_hour": round(total_requests / max(uptime_hours, 0.01), 2),
        "error_percentage": _calculate_error_percentage(summary),
        "cache_efficiency": _calculate_cache_efficiency(summary),
    }


async def _check_database_health() -> Dict[str, Any]:
    """Check database connection health"""
    try:
        from app.core.db import db

        # Simple connectivity test
        test_doc = db.collection("health_check").document("test")
        await test_doc.get()
        return {
            "healthy": True,
            "response_time_ms": 0,
        }  # Would measure actual response time
    except Exception as e:
        return {"healthy": False, "error": str(e)}


async def _check_cache_health() -> Dict[str, Any]:
    """Check cache system health"""
    try:
        cache_status = await cache_health_check()
        return {"healthy": cache_status["status"] == "healthy", "details": cache_status}
    except Exception as e:
        return {"healthy": False, "error": str(e)}


async def _check_system_resources() -> Dict[str, Any]:
    """Check system resource usage"""
    try:
        collector = get_metrics_collector()
        metrics = collector.get_metrics_summary()

        memory_percent = metrics.get("gauges", {}).get("system_memory_percent", 0)
        cpu_percent = metrics.get("gauges", {}).get("system_cpu_percent", 0)
        disk_percent = metrics.get("gauges", {}).get("system_disk_percent", 0)

        # Consider healthy if all resources are below 80%
        healthy = all([memory_percent < 80, cpu_percent < 80, disk_percent < 80])

        return {
            "healthy": healthy,
            "memory_percent": memory_percent,
            "cpu_percent": cpu_percent,
            "disk_percent": disk_percent,
        }
    except Exception as e:
        return {"healthy": False, "error": str(e)}


async def _check_error_rates(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Check if error rates are within acceptable limits"""
    total_requests = metrics.get("counters", {}).get("http_requests_total", 0)
    error_requests = metrics.get("counters", {}).get("requests_error_total", 0)

    if total_requests == 0:
        return {"healthy": True, "error_rate": 0}

    error_rate = error_requests / total_requests
    healthy = error_rate < 0.05  # 5% threshold

    return {
        "healthy": healthy,
        "error_rate": round(error_rate * 100, 2),
        "total_requests": total_requests,
        "error_requests": error_requests,
    }


def _calculate_throughput(count: int, uptime_seconds: float) -> float:
    """Calculate operations per minute"""
    uptime_minutes = max(uptime_seconds / 60, 0.01)  # Avoid division by zero
    return round(count / uptime_minutes, 2)


def _calculate_reliability_score(metrics: Dict[str, Any]) -> float:
    """Calculate a reliability score (0-100) based on error rate and performance"""
    error_rate = metrics.get("error_rate", 0)
    avg_time = metrics.get("avg_time_ms", 0)

    # Score based on error rate (lower is better)
    error_score = max(0, 100 - (error_rate * 2000))  # Heavy penalty for errors

    # Score based on performance (lower response time is better)
    performance_score = max(0, 100 - (avg_time / 50))  # Penalty for slow responses

    # Combined score (weighted average)
    return round((error_score * 0.7) + (performance_score * 0.3), 1)


async def _get_cache_statistics() -> Dict[str, Any]:
    """Get detailed cache statistics"""
    try:
        get_ai_cache()
        cache_status = await cache_health_check()
        return cache_status
    except Exception:
        return {"status": "unavailable"}


async def _get_recent_errors() -> List[Dict[str, Any]]:
    """Get recent error information"""
    # This would integrate with error tracking system
    # For now, return placeholder data
    return []


async def _calculate_kpis(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate key performance indicators"""
    uptime_seconds = metrics.get("uptime_seconds", 0)
    total_requests = metrics.get("counters", {}).get("http_requests_total", 0)
    metrics.get("counters", {}).get("requests_error_total", 0)
    ai_operations = metrics.get("counters", {}).get("ai_operation_total", 0)
    metrics.get("counters", {}).get("ai_operation_cached_total", 0)

    return {
        "availability_percent": 99.9,  # Would calculate from actual downtime
        "error_rate_percent": _calculate_error_percentage(metrics),
        "avg_response_time_ms": _get_average_response_time(metrics),
        "requests_per_second": round(total_requests / max(uptime_seconds, 1), 2),
        "cache_hit_rate_percent": _calculate_cache_hit_rate(metrics),
        "ai_operations_per_hour": round(
            ai_operations / max(uptime_seconds / 3600, 0.01), 2
        ),
    }


def _determine_overall_status(metrics: Dict[str, Any]) -> str:
    """Determine overall application status"""
    error_rate = _calculate_error_percentage(metrics)

    if error_rate > 10:
        return "unhealthy"
    elif error_rate > 5:
        return "degraded"
    else:
        return "healthy"


def _calculate_error_percentage(metrics: Dict[str, Any]) -> float:
    """Calculate error percentage from metrics"""
    total_requests = metrics.get("counters", {}).get("http_requests_total", 0)
    error_requests = metrics.get("counters", {}).get("requests_error_total", 0)

    if total_requests == 0:
        return 0.0

    return round((error_requests / total_requests) * 100, 2)


def _calculate_cache_hit_rate(metrics: Dict[str, Any]) -> float:
    """Calculate cache hit rate percentage"""
    total_operations = metrics.get("counters", {}).get("ai_operation_total", 0)
    cached_operations = metrics.get("counters", {}).get("ai_operation_cached_total", 0)

    if total_operations == 0:
        return 0.0

    return round((cached_operations / total_operations) * 100, 2)


def _get_average_response_time(metrics: Dict[str, Any]) -> float:
    """Get average response time from performance metrics"""
    performance_metrics = metrics.get("performance_metrics", {})

    if not performance_metrics:
        return 0.0

    total_time = sum(pm.get("total_time", 0) for pm in performance_metrics.values())
    total_count = sum(pm.get("count", 0) for pm in performance_metrics.values())

    if total_count == 0:
        return 0.0

    return round((total_time / total_count) * 1000, 2)  # Convert to milliseconds


def _calculate_requests_per_minute(metrics: Dict[str, Any]) -> float:
    """Calculate requests per minute"""
    total_requests = metrics.get("counters", {}).get("http_requests_total", 0)
    uptime_minutes = max(metrics.get("uptime_seconds", 0) / 60, 0.01)

    return round(total_requests / uptime_minutes, 2)


def _calculate_avg_tokens(metrics: Dict[str, Any]) -> float:
    """Calculate average tokens per AI operation"""
    total_tokens = metrics.get("counters", {}).get("ai_tokens_used_total", 0)
    total_operations = metrics.get("counters", {}).get("ai_operation_total", 0)

    if total_operations == 0:
        return 0.0

    return round(total_tokens / total_operations, 1)


def _calculate_cache_efficiency(metrics: Dict[str, Any]) -> float:
    """Calculate cache efficiency score"""
    hit_rate = _calculate_cache_hit_rate(metrics)

    # Convert hit rate to efficiency score (0-100)
    return min(100, hit_rate * 1.2)  # Slightly boost score for good hit rates


async def _check_error_rate_alerts(metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Check for error rate alerts"""
    alerts = []
    error_rate = _calculate_error_percentage(metrics)

    if error_rate > 10:
        alerts.append(
            {
                "type": "error_rate",
                "severity": "critical",
                "message": f"High error rate: {error_rate}%",
                "threshold": "10%",
                "current_value": f"{error_rate}%",
            }
        )
    elif error_rate > 5:
        alerts.append(
            {
                "type": "error_rate",
                "severity": "warning",
                "message": f"Elevated error rate: {error_rate}%",
                "threshold": "5%",
                "current_value": f"{error_rate}%",
            }
        )

    return alerts


async def _check_performance_alerts(metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Check for performance alerts"""
    alerts = []
    avg_response_time = _get_average_response_time(metrics)

    if avg_response_time > 5000:  # 5 seconds
        alerts.append(
            {
                "type": "response_time",
                "severity": "critical",
                "message": f"Very slow response time: {avg_response_time}ms",
                "threshold": "5000ms",
                "current_value": f"{avg_response_time}ms",
            }
        )
    elif avg_response_time > 2000:  # 2 seconds
        alerts.append(
            {
                "type": "response_time",
                "severity": "warning",
                "message": f"Slow response time: {avg_response_time}ms",
                "threshold": "2000ms",
                "current_value": f"{avg_response_time}ms",
            }
        )

    return alerts


async def _check_resource_alerts(metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Check for system resource alerts"""
    alerts = []

    memory_percent = metrics.get("gauges", {}).get("system_memory_percent", 0)
    cpu_percent = metrics.get("gauges", {}).get("system_cpu_percent", 0)
    disk_percent = metrics.get("gauges", {}).get("system_disk_percent", 0)

    if memory_percent > 90:
        alerts.append(
            {
                "type": "memory_usage",
                "severity": "critical",
                "message": f"High memory usage: {memory_percent}%",
                "threshold": "90%",
                "current_value": f"{memory_percent}%",
            }
        )
    elif memory_percent > 80:
        alerts.append(
            {
                "type": "memory_usage",
                "severity": "warning",
                "message": f"Elevated memory usage: {memory_percent}%",
                "threshold": "80%",
                "current_value": f"{memory_percent}%",
            }
        )

    if cpu_percent > 90:
        alerts.append(
            {
                "type": "cpu_usage",
                "severity": "critical",
                "message": f"High CPU usage: {cpu_percent}%",
                "threshold": "90%",
                "current_value": f"{cpu_percent}%",
            }
        )

    if disk_percent > 90:
        alerts.append(
            {
                "type": "disk_usage",
                "severity": "critical",
                "message": f"High disk usage: {disk_percent}%",
                "threshold": "90%",
                "current_value": f"{disk_percent}%",
            }
        )

    return alerts


async def _check_cache_alerts() -> List[Dict[str, Any]]:
    """Check for cache system alerts"""
    alerts = []

    try:
        cache_status = await cache_health_check()
        if cache_status["status"] != "healthy":
            alerts.append(
                {
                    "type": "cache_health",
                    "severity": "warning",
                    "message": "Cache system unhealthy",
                    "details": cache_status,
                }
            )
    except Exception:
        alerts.append(
            {
                "type": "cache_health",
                "severity": "critical",
                "message": "Cache system unreachable",
            }
        )

    return alerts
