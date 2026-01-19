# NLP Service Monitoring

This document outlines the monitoring setup for the CareerCopilot NLP service in production.

## Overview

The NLP service includes comprehensive monitoring to track performance, resource usage, and health metrics. This enables proactive issue detection and performance optimization.

## Metrics Collection

The following metrics are collected:

- **Request Metrics**: Count and duration of NLP requests by endpoint and model
- **Token Processing**: Number of tokens processed by model and operation
- **Model Metrics**: Loading time and memory usage of NLP models
- **System Metrics**: CPU, memory, and thread usage

## Configuration

Monitoring is configured via environment variables in `.env.production`:

```env
# Monitoring Configuration
PROMETHEUS_MULTIPROC_DIR=/tmp/prometheus_metrics
METRICS_PORT=8001
ENABLE_METRICS=true
METRICS_PATH=/metrics
NLP_METRICS_ENABLED=true
NLP_METRICS_UPDATE_INTERVAL=60
NLP_METRICS_RETENTION_DAYS=7
```

## Accessing Metrics

### Prometheus Endpoint

Metrics are exposed at `/metrics` when `ENABLE_METRICS=true`:

```bash
curl http://localhost:8001/metrics
```

### Health Check Endpoints

- `GET /health`: Overall service health
- `GET /health/cache`: Cache health status
- `GET /nlp/health`: NLP models health status

## Grafana Dashboard

A pre-configured Grafana dashboard is available at `monitoring/grafana/dashboards/nlp-dashboard.json`. This dashboard provides visualizations for:

- Request rates and latencies
- Token processing throughput
- Model memory usage
- Error rates

## Alerting

Alerts are configured in `monitoring/alerts.yml` and include:

- High error rates
- Increased latency
- Memory pressure
- Model loading failures

## Troubleshooting

### Common Issues

1. **Missing Metrics**: Ensure `ENABLE_METRICS=true` and the metrics service is running
2. **Permission Issues**: The `/tmp/prometheus_metrics` directory must be writable
3. **High Memory Usage**: Check for memory leaks in model loading/unloading

### Logs

Check application logs for monitoring-related errors. Look for entries with the `nlp_monitor` or `prometheus` loggers.

## Performance Considerations

- Metrics collection adds minimal overhead (1-2% CPU)
- Memory usage scales with the number of unique metric labels
- Disable metrics in development with `ENABLE_METRICS=false`

## Security

- The metrics endpoint should be protected in production
- Use network policies to restrict access to the metrics port
- Rotate API keys and credentials regularly
