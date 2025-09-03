# AI Operations Caching System

## Overview

The AI Operations Caching System is designed to improve performance and reduce costs for CareerCopilot's AI-powered features by intelligently caching frequently requested operations.

## Key Benefits

- **Cost Reduction**: Avoid duplicate AI API calls by caching results
- **Performance**: Reduce response times from seconds to milliseconds
- **Scalability**: Handle more concurrent users with cached responses
- **Intelligence**: Different cache strategies per operation type

## Architecture

### Components

1. **Cache Backend** (`cache.py`)
   - Abstract interface for different storage backends
   - In-memory backend for development
   - Redis backend for production

2. **Cache Decorators** (`cache_decorators.py`)
   - Easy-to-use decorators for adding caching to functions
   - Automatic key generation and TTL management

3. **Cache Middleware** (`cache_middleware.py`)
   - Automatic cache cleanup and monitoring
   - Performance tracking and health checks
   - Automatic cache invalidation on data changes

4. **Cached Operations** (`cached_ai_operations.py`)
   - Example implementations for all AI operations
   - Ready to replace existing operations when genkit is fixed

## Cache Configurations

| Operation Type | TTL | Max Entries | Invalidate on Update |
|---------------|-----|-------------|---------------------|
| resume_analysis | 1 hour | 500 | ✅ Yes |
| job_analysis | 2 hours | 200 | ❌ No |
| ats_scoring | 30 min | 300 | ✅ Yes |
| cover_letter | 15 min | 100 | ✅ Yes |
| voice_profile | 24 hours | 50 | ✅ Yes |
| ksc_response | 1 hour | 200 | ✅ Yes |

## Usage Examples

### Using Decorators

```python
from app.core.cache_decorators import cached_ai_operation

@cached_ai_operation('resume_analysis', user_id_param='user_id')
async def analyze_resume(user_id: str, resume_text: str) -> dict:
    # Your AI operation here
    result = await expensive_ai_call(resume_text)
    return result
```

### Direct Cache Access

```python
from app.core.cache import get_ai_cache

cache = get_ai_cache()

# Check cache first
cached_result = await cache.get("resume_analysis", user_id, input_data)
if cached_result:
    return cached_result

# Perform operation and cache result
result = await ai_operation(input_data)
await cache.set("resume_analysis", user_id, input_data, result)
```

### Context Manager

```python
from app.core.cache_decorators import CacheContext

async with CacheContext("job_analysis", user_id, input_data) as cached:
    if cached is not None:
        return cached

    result = await expensive_operation()
    await cached.set_result(result)
    return result
```

## Environment Configuration

### Development (In-Memory Cache)
```bash
# No additional configuration needed
# Uses in-memory cache automatically
```

### Production (Redis Cache)
```bash
# Set Redis connection URL
REDIS_URL=redis://localhost:6379

# Optional: Cache cleanup interval (seconds)
CACHE_CLEANUP_INTERVAL=3600
```

### Cloud Run with Redis (Recommended for Production)
```bash
# Use Redis Cloud or Google Memory Store
REDIS_URL=redis://your-redis-instance:6379

# Or use Redis with authentication
REDIS_URL=redis://username:password@host:port/db
```

## Monitoring and Health Checks

### Health Check Endpoints

- `GET /health` - General application health
- `GET /cache/health` - Cache system health and statistics

### Cache Performance Headers (Development)

In non-production environments, cache performance headers are added:
```
X-Cache-Stats: hits:42,misses:8
```

### Logging

Cache operations are logged with appropriate levels:
- `INFO`: Cache hits, misses, and successful operations
- `WARNING`: Cache configuration issues
- `ERROR`: Cache failures (with fallback to direct operation)

## Cache Invalidation Strategy

### Automatic Invalidation

The system automatically invalidates relevant caches when user data changes:

- **Document uploads/updates** → Invalidates: resume_analysis, ats_scoring, voice_profile
- **Profile updates** → Invalidates: voice_profile, resume_analysis
- **User data changes** → Invalidates: all user-specific caches

### Manual Invalidation

```python
from app.core.cache import get_ai_cache

cache = get_ai_cache()

# Invalidate specific operation types for a user
await cache.invalidate_user_cache(user_id, ['resume_analysis', 'ats_scoring'])

# Invalidate all caches for a user
await cache.invalidate_user_cache(user_id)
```

## Redis Backend Configuration

### Basic Redis Setup
```python
from app.core.redis_cache import RedisCacheBackend
from app.core.cache import setup_cache

backend = RedisCacheBackend(
    redis_url="redis://localhost:6379",
    compression=True,
    serialization='json'
)

cache = setup_cache(backend)
```

### Redis Cluster (High Availability)
```python
from app.core.redis_cache import RedisClusterCacheBackend

cluster_nodes = [
    {"host": "node1", "port": 7000},
    {"host": "node2", "port": 7000},
    {"host": "node3", "port": 7000}
]

backend = RedisClusterCacheBackend(cluster_nodes)
```

## Performance Considerations

### Cache Key Design
- Keys include operation type, user ID, and input hash
- Deterministic key generation ensures consistency
- Short prefixes for efficient storage

### Memory Usage
- In-memory cache uses LRU eviction
- Redis backend leverages Redis TTL for automatic cleanup
- Configurable max entries per operation type

### Compression
- JSON serialization with optional gzip compression
- Reduces memory usage for large AI responses
- Configurable per backend

## Security Considerations

### Data Privacy
- Cache keys don't expose sensitive data
- TTL ensures data doesn't persist indefinitely
- User-specific caches prevent data leakage

### Access Control
- Cache operations require user authentication
- User can only access their own cached data
- Automatic invalidation on data changes

## Troubleshooting

### Common Issues

1. **Redis Connection Failures**
   ```
   ERROR: Redis health check failed
   ```
   - Check Redis URL and connectivity
   - Verify authentication credentials
   - Falls back to in-memory cache automatically

2. **High Cache Miss Rate**
   ```
   X-Cache-Stats: hits:5,misses:95
   ```
   - Check if TTL is too short
   - Verify input data consistency
   - Monitor for frequent cache invalidations

3. **Memory Usage Issues**
   - Adjust max_entries in cache configurations
   - Enable compression for large responses
   - Monitor Redis memory usage

### Debug Mode

Enable detailed cache logging:
```python
import logging
logging.getLogger('app.core.cache').setLevel(logging.DEBUG)
```

## Migration Guide

### From Non-Cached to Cached Operations

1. **Add Cache Decorator**:
   ```python
   # Before
   async def analyze_resume(user_id: str, resume_text: str):
       return await ai_service.analyze(resume_text)

   # After
   @cached_ai_operation('resume_analysis', user_id_param='user_id')
   async def analyze_resume(user_id: str, resume_text: str):
       return await ai_service.analyze(resume_text)
   ```

2. **Update Cache Configuration** in `cache.py`:
   ```python
   CACHE_CONFIGS['your_operation'] = CacheConfig(
       ttl_seconds=3600,
       max_entries=200,
       cache_null_results=False
   )
   ```

3. **Test Cache Behavior**:
   - Verify cache hits with identical inputs
   - Test cache invalidation on data changes
   - Monitor performance improvements

## Future Enhancements

### Planned Features
- **Distributed Cache Warming**: Pre-populate cache with common queries
- **Cache Analytics**: Detailed performance metrics and optimization suggestions
- **Smart TTL**: Dynamic TTL based on data staleness detection
- **Multi-Level Caching**: L1 (in-memory) + L2 (Redis) cache hierarchy

### Integration Opportunities
- **Background Job Processing**: Cache results from scheduled AI operations
- **Real-time Updates**: WebSocket notifications for cache invalidations
- **A/B Testing**: Cache different AI model responses for comparison

## Conclusion

The AI Operations Caching System provides a robust, scalable foundation for improving CareerCopilot's performance while reducing operational costs. The system is designed to be transparent to existing code while providing powerful caching capabilities with minimal configuration.