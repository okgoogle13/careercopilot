# Production Monitoring and Cache Validation

This document outlines the monitoring and cache validation setup for the Career Copilot backend.

## Cache Validation Tests

We've implemented comprehensive cache validation tests to ensure the caching system works as expected:

### Running Cache Tests

```bash
# Run all cache validation tests
pytest tests/performance/test_cache_validation.py -v

# Run with coverage report
pytest --cov=app.core.cache tests/performance/test_cache_validation.py -v
```

### Test Coverage

The cache validation tests cover:

1. **Cache Hit Rate**
   - Verifies that repeated requests return cached results
   - Measures performance improvement with cache hits

2. **Cache Invalidation**
   - Tests TTL-based cache expiration
   - Verifies cache invalidation after TTL

3. **Concurrent Access**
   - Tests cache behavior under concurrent requests
   - Ensures thread safety and proper locking

4. **API Endpoints**
   - Tests cache-related monitoring endpoints
   - Verifies cache statistics and invalidation endpoints

## Production Monitoring

We've set up a comprehensive monitoring system to track:

### Key Metrics

- **Cache Performance**
  - Hit/Miss rates
  - Cache size
  - Eviction rates

- **AI Usage & Costs**
  - Token usage by model
  - Cost per model
  - Usage trends over time

- **System Resources**
  - CPU/Memory usage
  - Disk I/O
  - Network latency

### Setting Up Monitoring

1. Start the monitoring service:

```bash
python -m scripts.monitor_production
```

2. Access Prometheus metrics at `http://localhost:8000/metrics`

3. View Grafana dashboard (if configured) at `http://localhost:3000`

### Monitoring Endpoints

- `GET /monitoring/cache/stats` - Get cache statistics
- `POST /monitoring/cache/invalidate` - Invalidate cache entries
- `GET /monitoring/ai/costs` - Get AI usage and costs
- `GET /monitoring/system` - Get system resource usage

### Alerting

Alerts are configured for:
- High error rates (>1% of requests)
- High cache miss rates (>50% for critical operations)
- Unusual AI cost spikes
- System resource constraints

## Cost Optimization

The monitoring system helps identify cost-saving opportunities:

1. **Cache Optimization**
   - Identify frequently accessed data that could benefit from caching
   - Adjust TTLs based on access patterns

2. **Model Selection**
   - Track cost vs. performance across different models
   - Identify opportunities to use cheaper models where appropriate

3. **Usage Patterns**
   - Identify peak usage times
   - Optimize batch processing during off-peak hours

## Troubleshooting

### Common Issues

1. **High Cache Miss Rate**
   - Check if cache TTL is too short
   - Verify cache keys are consistent
   - Check for cache stampede

2. **High AI Costs**
   - Review token usage by endpoint
   - Check for inefficient prompts
   - Consider response caching for similar requests

3. **Performance Issues**
   - Check system resource usage
   - Review database query performance
   - Check for network latency issues

For more information, see the [Monitoring Architecture](../docs/ARCHITECTURE.md#monitoring) documentation.
