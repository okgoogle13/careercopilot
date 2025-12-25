# Cache Strategy - Firestore Implementation

## Overview

CareerCopilot has successfully migrated from Redis to Firestore for caching. This document outlines the current caching strategy and implementation details.

## Migration Status

✅ **COMPLETED** - Redis to Firestore migration finished successfully.

### Migration Details

- **Original Script**: `migrate_redis_to_firestore.py` (now archived)
- **Migration Date**: November 2025
- **Status**: Full migration completed, Redis dependencies removed

## Current Cache Implementation

### Firestore Cache Collection

```javascript
// Cache collection structure
{
  collection: "redis_cache",
  document: "cache_key",
  data: {
    value: "cached_data",
    ttl: 1640995200,  // Unix timestamp
    created_at: 1640991600,
    namespace: "default"
  }
}
```

### TTL Implementation

- **Default TTL**: 1 hour (3600 seconds)
- **TTL Field**: Unix timestamp for automatic expiration
- **Cleanup**: Background process removes expired documents

## Cache Usage Patterns

### 1. API Response Caching

```python
# Backend implementation
from app.core.cache import get_cache, set_cache

# Get cached response
cached = await get_cache(f"api:{endpoint}:{params_hash}")

# Set cache with TTL
await set_cache(f"api:{endpoint}:{params_hash}", data, ttl=3600)
```

### 2. Session Caching

```python
# User session data
session_key = f"session:{user_id}"
session_data = await get_cache(session_key)
```

### 3. Configuration Caching

```python
# Firebase config and other static data
config_key = "firebase:config"
config = await get_cache(config_key, ttl=86400)  # 24 hours
```

## Performance Characteristics

### Firestore vs Redis

- **Latency**: ~5-10ms additional latency vs Redis
- **Scalability**: Better horizontal scaling
- **Cost**: Pay-per-operation model
- **Persistence**: Automatic data persistence
- **Integration**: Native Firebase integration

### Optimization Strategies

1. **Batch Operations**: Use batch writes for multiple cache updates
2. **Indexing**: Proper indexes on cache collection
3. **TTL Management**: Efficient cleanup of expired documents
4. **Cold Starts**: Warm cache strategies for deployment

## Cache Configuration

### Environment Variables

```bash
# Cache configuration
CACHE_TTL_DEFAULT=3600
CACHE_COLLECTION=redis_cache
CACHE_CLEANUP_INTERVAL=300
```

### Backend Settings

```python
# app/core/cache.py
CACHE_SETTINGS = {
    "default_ttl": 3600,
    "collection": "redis_cache",
    "max_batch_size": 500,
    "cleanup_interval": 300
}
```

## Monitoring and Debugging

### Cache Metrics

```python
# Monitor cache performance
cache_stats = {
    "hits": 0,
    "misses": 0,
    "sets": 0,
    "deletes": 0,
    "error_rate": 0.0
}
```

### Debug Tools

```bash
# View cache contents
python3 scripts/debug-cache.py --list

# Clear cache
python3 scripts/debug-cache.py --clear

# Cache statistics
python3 scripts/debug-cache.py --stats
```

## Best Practices

### 1. Cache Key Design

- Use consistent naming conventions
- Include namespace prefixes
- Hash large keys
- Avoid special characters

### 2. TTL Management

- Set appropriate TTL for data type
- Use shorter TTL for volatile data
- Longer TTL for static configuration
- Implement cache warming strategies

### 3. Error Handling

- Graceful degradation on cache failures
- Retry logic for transient errors
- Fallback to direct data source
- Log cache performance issues

## Migration Benefits

1. **Simplified Infrastructure**: No separate Redis server
2. **Better Integration**: Native Firebase integration
3. **Cost Efficiency**: Pay-per-use model
4. **Scalability**: Automatic scaling with Firestore
5. **Persistence**: Data survives restarts
6. **Security**: Firebase security rules

## Future Considerations

1. **Performance Optimization**: Consider edge caching for frequently accessed data
2. **Cache Warming**: Implement pre-warming strategies
3. **Analytics**: Add detailed cache analytics
4. **Multi-region**: Consider multi-region deployment
5. **Compression**: Implement data compression for large cache values

---

**Note**: The migration script `migrate_redis_to_firestore.py` has been archived and should not be used. All caching operations should use the Firestore implementation documented above.
