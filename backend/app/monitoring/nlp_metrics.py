"""
NLP Service Metrics for Prometheus monitoring
"""
import time

from prometheus_client import Counter, Gauge, Histogram, start_http_server

# Initialize metrics
NLP_REQUESTS_TOTAL = Counter(
    "nlp_requests_total", "Total number of NLP requests", ["endpoint", "model", "status"]
)

NLP_REQUEST_DURATION = Histogram(
    "nlp_request_duration_seconds",
    "Time spent processing NLP requests",
    ["endpoint", "model"],
    buckets=(0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, float("inf")),
)

NLP_TOKENS_PROCESSED = Counter(
    "nlp_tokens_processed_total", "Total number of tokens processed", ["model", "operation"]
)

NLP_MODEL_LOAD_TIME = Gauge(
    "nlp_model_load_time_seconds", "Time taken to load NLP models", ["model"]
)

NLP_MODEL_MEMORY_USAGE = Gauge(
    "nlp_model_memory_usage_bytes", "Memory usage of loaded NLP models", ["model"]
)


def start_metrics_server(port=8001):
    """Start the Prometheus metrics server"""
    start_http_server(port)


def track_nlp_request(endpoint, model, status="success"):
    """Track NLP request metrics"""
    NLP_REQUESTS_TOTAL.labels(endpoint=endpoint, model=model, status=status).inc()


def track_nlp_duration(endpoint, model):
    """Track NLP processing duration"""
    return NLP_REQUEST_DURATION.labels(endpoint=endpoint, model=model).time()


def track_tokens_processed(model, operation, count):
    """Track number of tokens processed"""
    NLP_TOKENS_PROCESSED.labels(model=model, operation=operation).inc(count)


def track_model_load_time(model, load_time):
    """Track model loading time"""
    NLP_MODEL_LOAD_TIME.labels(model=model).set(load_time)


def track_model_memory_usage(model, memory_bytes):
    """Track model memory usage"""
    NLP_MODEL_MEMORY_USAGE.labels(model=model).set(memory_bytes)
