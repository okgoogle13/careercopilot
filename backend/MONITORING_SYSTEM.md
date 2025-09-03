# Comprehensive Monitoring and Logging System

## Overview

The CareerCopilot monitoring system provides comprehensive observability into application performance, user behavior, system health, and business metrics. It includes structured logging, performance monitoring, error tracking, and automated alerting.

## Key Features

- **📊 Performance Monitoring**: Request/response times, throughput, error rates
- **📈 Business Metrics**: User actions, AI usage, cost tracking
- **🖥️ System Health**: CPU, memory, disk, network monitoring
- **📝 Structured Logging**: JSON logs with context and correlation
- **🚨 Intelligent Alerts**: Configurable thresholds with severity levels
- **📱 Dashboard Ready**: Comprehensive APIs for monitoring dashboards
- **🔍 Error Tracking**: Detailed error analysis and root cause tracking

## Architecture

### Core Components

1. **Logging System** (`logging_config.py`)
   - Environment-specific configurations
   - Structured JSON logging
   - Request correlation tracking
   - Performance and debug logging

2. **Metrics Collection** (`monitoring.py`)
   - Prometheus-compatible metrics
   - Custom business metrics
   - Performance timing decorators
   - System resource monitoring

3. **Monitoring Middleware** (`monitoring_middleware.py`)
   - Automatic request/response tracking
   - Error interception and logging
   - Health check endpoints
   - Context injection for logs

4. **Monitoring APIs** (`api/v1/monitoring.py`)
   - Metrics export endpoints
   - Dashboard data aggregation
   - Alert management
   - Admin monitoring tools

## Logging Configuration

### Environment-Based Setup

| Environment | Log Level | Outputs | Format |
|-------------|-----------|---------|---------|
| **Development** | DEBUG | Console + File | Detailed text |
| **Staging** | INFO | Console + Files | Structured JSON |
| **Production** | WARNING | Console + Error File | Structured JSON |

### Log Structure

```json
{
  "timestamp": "2025-01-15T10:30:45.123Z",
  "level": "INFO",
  "logger": "app.api.v1.documents",
  "message": "Document uploaded successfully",
  "module": "documents",
  "function": "upload_document",
  "line": 156,
  "request_id": "req_abc123",
  "user_id": "user_456",
  "extra": {
    "document_id": "doc_789",
    "file_size": 2048576,
    "processing_time_ms": 450
  }
}
```

### Usage Examples

```python
from app.core.logging_config import get_logger, log_function_call

logger = get_logger(__name__)

# Basic logging
logger.info("User logged in", extra={'user_id': '123', 'ip': '192.168.1.1'})

# Function call logging decorator
@log_function_call(level=logging.INFO)
async def process_document(user_id: str, document: UploadFile):
    # Function automatically logged with parameters and timing
    return result

# Context-aware logging
with RequestContextLogger(request_id='req_123', user_id='user_456'):
    logger.info("Processing request")  # Automatically includes context
```

## Metrics and Monitoring

### Collected Metrics

#### Performance Metrics
- `http_requests_total` - Total HTTP requests by method/path/status
- `http_request_duration_seconds` - Request response time histogram
- `http_requests_errors_total` - HTTP errors by type
- `operation_duration_seconds` - Custom operation timing

#### Business Metrics
- `user_action_*` - User actions (document_upload, analysis_request, etc.)
- `ai_operation_total` - AI operations by type
- `ai_operation_cached_total` - Cached AI operations
- `ai_tokens_used_total` - Token consumption tracking

#### System Metrics
- `system_cpu_percent` - CPU usage percentage
- `system_memory_percent` - Memory usage percentage
- `system_disk_percent` - Disk usage percentage
- `process_memory_rss_bytes` - Process memory usage

### Monitoring Decorators

```python
from app.core.monitoring import monitor_performance, performance_context

# Automatic performance monitoring
@monitor_performance('document_processing')
async def process_document(file_data: bytes):
    # Function automatically tracked for timing and errors
    return processed_data

# Context manager for complex operations
async def complex_operation():
    async with performance_context('multi_step_analysis'):
        step1_result = await step_1()
        step2_result = await step_2()
        return combine_results(step1_result, step2_result)
```

### Custom Metrics

```python
from app.core.monitoring import get_metrics_collector

collector = get_metrics_collector()

# Track business events
collector.increment_counter('subscription_created', labels={'plan': 'premium'})

# Record measurements
collector.record_histogram('file_size_bytes', file_size)

# Set current values
collector.set_gauge('active_users', current_user_count)
```

## API Endpoints

### Core Monitoring Endpoints

| Endpoint | Description | Auth Required |
|----------|-------------|---------------|
| `GET /metrics` | Prometheus metrics format | No |
| `GET /health` | Basic health check | No |
| `GET /api/v1/monitoring/health/detailed` | Detailed health status | No |
| `GET /api/v1/monitoring/metrics/summary` | Human-readable metrics | No |
| `GET /api/v1/monitoring/dashboard` | Dashboard data | No |
| `GET /api/v1/monitoring/alerts` | Active alerts | No |
| `GET /api/v1/monitoring/performance` | Performance metrics | No |

### Admin Endpoints (Authentication Required)

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/monitoring/admin/logs` | Recent log entries |
| `POST /api/v1/monitoring/admin/clear-metrics` | Reset all metrics |

### Example API Responses

#### Dashboard Data
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "status": "healthy",
  "kpis": {
    "availability_percent": 99.9,
    "error_rate_percent": 0.2,
    "avg_response_time_ms": 125,
    "requests_per_second": 45.2,
    "cache_hit_rate_percent": 78.5,
    "ai_operations_per_hour": 340
  },
  "system_health": {
    "uptime_seconds": 86400,
    "memory_usage": 42.5,
    "cpu_usage": 15.2,
    "disk_usage": 68.1
  },
  "ai_metrics": {
    "total_operations": 2450,
    "cached_operations": 1920,
    "cache_hit_rate": 78.4,
    "avg_tokens_per_operation": 1250
  }
}
```

#### Active Alerts
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "alert_count": 1,
  "alerts": [
    {
      "type": "response_time",
      "severity": "warning",
      "message": "Slow response time: 2100ms",
      "threshold": "2000ms",
      "current_value": "2100ms"
    }
  ]
}
```

## Alert Configuration

### Default Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | >5% | >10% |
| Response Time | >2s | >5s |
| Memory Usage | >80% | >90% |
| CPU Usage | >80% | >90% |
| Disk Usage | >80% | >90% |
| Cache Health | Degraded | Unavailable |

### Alert Severity Levels

- **Critical**: Immediate action required, service impact
- **Warning**: Attention needed, potential service impact
- **Info**: Informational, no immediate action needed

## Dashboard Integration

### Recommended Dashboards

1. **Application Overview**
   - Request volume and response times
   - Error rates and success rates
   - Active users and sessions

2. **AI Operations Dashboard**
   - AI operation types and volumes
   - Cache hit rates and performance
   - Token usage and cost tracking
   - Response time by operation type

3. **System Health Dashboard**
   - CPU, memory, disk usage
   - Network I/O and connections
   - Process metrics and file descriptors

4. **Business Intelligence Dashboard**
   - User actions and engagement
   - Feature usage analytics
   - Conversion funnel metrics
   - Revenue and subscription metrics

### Grafana Integration

```yaml
# Example Grafana dashboard config
dashboard:
  title: "CareerCopilot Application Monitoring"
  panels:
    - title: "Request Rate"
      type: "graph"
      targets:
        - expr: 'rate(http_requests_total[5m])'
    - title: "Error Rate"
      type: "singlestat"
      targets:
        - expr: 'rate(http_requests_errors_total[5m]) / rate(http_requests_total[5m])'
    - title: "Response Time P95"
      type: "graph"
      targets:
        - expr: 'histogram_quantile(0.95, http_request_duration_seconds_bucket)'
```

## Production Deployment

### Environment Variables

```bash
# Logging configuration
ENV=production
LOG_LEVEL=WARNING

# Monitoring settings
METRICS_ENABLED=true
SYSTEM_MONITORING_INTERVAL=60
ENABLE_ALERTING=true

# Optional: External monitoring integration
PROMETHEUS_GATEWAY_URL=http://pushgateway:9091
GRAFANA_API_KEY=your_grafana_api_key
```

### Docker Integration

```dockerfile
# Install monitoring dependencies
RUN pip install psutil redis

# Create logs directory
RUN mkdir -p /app/logs

# Expose metrics port (optional)
EXPOSE 8080 9090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

### Kubernetes Deployment

```yaml
apiVersion: v1
kind: Service
metadata:
  name: careercopilot-backend
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/path: "/metrics"
    prometheus.io/port: "8080"
spec:
  selector:
    app: careercopilot-backend
  ports:
    - port: 8080
      targetPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: careercopilot-backend
spec:
  template:
    spec:
      containers:
      - name: backend
        image: careercopilot-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: ENV
          value: "production"
        - name: LOG_LEVEL
          value: "WARNING"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Performance Impact

### Resource Usage
- **Memory**: ~10-20MB additional for metrics collection
- **CPU**: <1% overhead for monitoring middleware
- **Disk**: Log rotation prevents unbounded growth
- **Network**: Minimal impact for metrics export

### Optimization Features
- **Sampling**: Request sampling for high-volume endpoints
- **Batching**: Metric batching to reduce overhead
- **Filtering**: Configurable exclusion of noisy endpoints
- **Compression**: Log compression for storage efficiency

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   ```bash
   # Check metrics collection size
   curl http://localhost:8080/api/v1/monitoring/metrics/summary

   # Clear metrics if needed (dev only)
   curl -X POST http://localhost:8080/api/v1/monitoring/admin/clear-metrics
   ```

2. **Missing Metrics**
   ```python
   # Verify metrics collector is working
   from app.core.monitoring import get_metrics_collector
   collector = get_metrics_collector()
   print(collector.get_metrics_summary())
   ```

3. **Log File Permissions**
   ```bash
   # Ensure log directory is writable
   mkdir -p logs
   chmod 755 logs
   ```

4. **System Monitoring Not Working**
   ```bash
   # Install psutil if missing
   pip install psutil

   # Check system monitor status
   curl http://localhost:8080/api/v1/monitoring/health/detailed
   ```

### Debug Mode

```python
import logging
from app.core.logging_config import setup_logging

# Enable debug logging
setup_logging(environment='development')
logging.getLogger('app.core.monitoring').setLevel(logging.DEBUG)
```

## Security Considerations

### Data Privacy
- **Log Sanitization**: PII automatically redacted from logs
- **Metric Labels**: No sensitive data in metric labels
- **Admin Endpoints**: Authentication required for sensitive operations
- **Log Retention**: Configurable retention periods

### Access Control
- **Monitoring Endpoints**: Public health checks, protected admin functions
- **Metrics Export**: Rate limited to prevent abuse
- **Alert Data**: No sensitive information in alerts

## Future Enhancements

### Planned Features
- **Distributed Tracing**: OpenTelemetry integration for request tracing
- **Log Aggregation**: ELK stack or similar for centralized log management
- **Advanced Alerting**: Integration with PagerDuty, Slack, email
- **ML-Based Anomaly Detection**: Automatic anomaly detection in metrics
- **Custom Dashboard Builder**: UI for creating custom monitoring dashboards

### Integration Roadmap
- **APM Tools**: New Relic, DataDog, or AppDynamics integration
- **Error Tracking**: Sentry or Rollbar for enhanced error tracking
- **Business Intelligence**: Integration with analytics platforms
- **Cost Monitoring**: AWS/GCP cost tracking integration

## Conclusion

The CareerCopilot monitoring system provides enterprise-grade observability with minimal performance impact. It enables proactive issue detection, performance optimization, and data-driven decision making through comprehensive metrics collection and intelligent alerting.

The system is designed to scale with your application and provides the foundation for maintaining high availability and optimal user experience in production environments.
