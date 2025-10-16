#!/usr/bin/env python3
"""
Production monitoring and cost savings analysis
"""

import asyncio
import json
import logging
import os
import time
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import aiohttp
import pandas as pd
from fastapi import FastAPI
from prometheus_client import (  # type: ignore
    Counter,
    Gauge,
    Histogram,
    start_http_server,
)
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Prometheus metrics
CACHE_HITS = Counter("cache_hits_total", "Total cache hits", ["operation"])
CACHE_MISSES = Counter("cache_misses_total", "Total cache misses", ["operation"])
CACHE_SIZE = Gauge("cache_size_bytes", "Current cache size in bytes")
REQUEST_LATENCY = Histogram("request_duration_seconds", "Request latency in seconds", ["endpoint"])
AI_COST = Counter("ai_cost_usd", "Total AI API cost in USD")

# Cost tracking
COST_PER_TOKEN = {
    "gpt-4": 0.03 / 1000,  # $0.03 per 1K tokens
    "gpt-3.5-turbo": 0.002 / 1000,  # $0.002 per 1K tokens
    "claude-2": 0.01102 / 1000,  # $0.01102 per 1K tokens
}


class CacheStats(BaseModel):
    hits: int
    misses: int
    size: int
    hit_rate: float


class AIMetrics(BaseModel):
    model: str
    prompt_tokens: int
    completion_tokens: int
    cost_usd: float


class MonitoringService:
    def __init__(self, prometheus_port: int = 8000):
        self.prometheus_port = prometheus_port
        self.start_time = datetime.utcnow()
        self.ai_metrics: Dict[str, List[dict]] = defaultdict(list)
        self.cache_stats: Dict[str, CacheStats] = {}

    async def start(self):
        """Start the monitoring service"""
        start_http_server(self.prometheus_port)
        logger.info(f"Prometheus metrics available on port {self.prometheus_port}")

        # Start background tasks
        asyncio.create_task(self._collect_system_metrics())
        asyncio.create_task(self._report_metrics())

    async def record_ai_usage(
        self, model: str, prompt_tokens: int, completion_tokens: int
    ) -> float:
        """Record AI usage and calculate cost"""
        cost_per_token = COST_PER_TOKEN.get(model, 0.0)
        cost = (prompt_tokens + completion_tokens) * cost_per_token

        self.ai_metrics[model].append(
            {
                "timestamp": datetime.utcnow(),
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "cost_usd": cost,
            }
        )

        AI_COST.inc(cost)
        return cost

    async def record_cache_metrics(self, operation: str, hit: bool, size_bytes: int) -> None:
        """Record cache metrics"""
        if hit:
            CACHE_HITS.labels(operation=operation).inc()
        else:
            CACHE_MISSES.labels(operation=operation).inc()

        CACHE_SIZE.set(size_bytes)

        # Update cache stats
        if operation not in self.cache_stats:
            self.cache_stats[operation] = CacheStats(hits=0, misses=0, size=0, hit_rate=0.0)

        stats = self.cache_stats[operation]
        if hit:
            stats.hits += 1
        else:
            stats.misses += 1

        total = stats.hits + stats.misses
        stats.hit_rate = stats.hits / total if total > 0 else 0.0
        stats.size = size_bytes

    async def get_ai_cost_summary(self, hours: int = 24) -> dict:
        """Get AI cost summary for the last N hours"""
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        total_cost = 0.0
        usage_by_model = defaultdict(lambda: {"cost": 0.0, "tokens": 0})

        for model, metrics in self.ai_metrics.items():
            for metric in metrics:
                if metric["timestamp"] >= cutoff:
                    usage = usage_by_model[model]
                    usage["cost"] += metric["cost_usd"]
                    usage["tokens"] += metric["prompt_tokens"] + metric["completion_tokens"]
                    total_cost += metric["cost_usd"]

        return {
            "total_cost_usd": round(total_cost, 4),
            "usage_by_model": {
                model: {
                    "cost_usd": round(data["cost"], 4),
                    "tokens": data["tokens"],
                }
                for model, data in usage_by_model.items()
            },
            "time_period_hours": hours,
        }

    async def get_cache_stats(self) -> Dict[str, dict]:
        """Get cache statistics"""
        return {
            op: {
                "hits": stats.hits,
                "misses": stats.misses,
                "hit_rate": round(stats.hit_rate, 4),
                "size_bytes": stats.size,
            }
            for op, stats in self.cache_stats.items()
        }

    async def _collect_system_metrics(self):
        """Background task to collect system metrics"""
        import psutil

        while True:
            try:
                # CPU usage
                cpu_percent = psutil.cpu_percent(interval=1)
                # Memory usage
                memory = psutil.virtual_memory()
                # Disk usage
                disk = psutil.disk_usage("/")

                # Update Prometheus metrics
                Gauge("cpu_usage_percent").set(cpu_percent)
                Gauge("memory_usage_bytes").set(memory.used)
                Gauge("memory_available_bytes").set(memory.available)
                Gauge("disk_usage_bytes").set(disk.used)

                await asyncio.sleep(60)  # Update every minute

            except Exception as e:
                logger.error(f"Error collecting system metrics: {e}")
                await asyncio.sleep(60)  # Wait before retrying

    async def _report_metrics(self):
        """Periodically report metrics to logs"""
        while True:
            try:
                # Report every 5 minutes
                await asyncio.sleep(300)

                # Get cost summary for the last hour
                cost_summary = await self.get_ai_cost_summary(hours=1)

                # Log metrics
                logger.info(f"AI Cost (last hour): ${cost_summary['total_cost_usd']:.4f}")

                # Log cache hit rates
                cache_stats = await self.get_cache_stats()
                for op, stats in cache_stats.items():
                    logger.info(
                        f"Cache {op}: {stats['hit_rate'] * 100:.1f}% hit rate "
                        f"({stats['hits']} hits, {stats['misses']} misses)"
                    )

                # Log system metrics
                if hasattr(self, "system_metrics"):
                    logger.info(
                        f"System: {self.system_metrics['cpu_percent']}% CPU, "
                        f"{self.system_metrics['memory_used_gb']:.1f}GB RAM used"
                    )

            except Exception as e:
                logger.error(f"Error reporting metrics: {e}")


# Singleton instance
monitoring_service = MonitoringService()


async def start_monitoring():
    """Start the monitoring service"""
    await monitoring_service.start()


if __name__ == "__main__":
    # Example usage
    async def main():
        await monitoring_service.start()

        # Example: Record some AI usage
        await monitoring_service.record_ai_usage(
            model="gpt-4",
            prompt_tokens=1000,
            completion_tokens=500,
        )

        # Example: Record cache hits/misses
        await monitoring_service.record_cache_metrics(
            operation="document_analysis",
            hit=True,
            size_bytes=1024 * 1024,  # 1MB
        )

        # Keep the service running
        while True:
            await asyncio.sleep(1)

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Monitoring service stopped")
