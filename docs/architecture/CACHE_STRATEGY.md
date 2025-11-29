# Cache Configuration (Firestore-backed)

The application uses Firebase Cloud Firestore for caching instead of Redis, providing seamless integration with the existing Firebase infrastructure.

## Architecture

### Collection Schema

- **Collection Name**: `redis_cache` (Firestore collection for storing cached values)
- **Document Structure**: Key-value pairs with TTL metadata

### Core Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Cache Service** | `backend/app/core/firestore_cache.py` | Firestore-backed cache implementation |
| **LLM Cache** | `backend/app/ai/llm_service.py` | Uses Firestore cache for LLM responses |
| **Cache Middleware** | `backend/app/core/cache_middleware.py` | Automatic cache cleanup and monitoring |

### Features

- **Automatic TTL-based expiration** (default: 1 hour)
- **Pattern-based cache clearing** (wildcard support)
- **Cache statistics and monitoring** (hit/miss ratios)
- **Automatic expired entry cleanup** (background task)
- **Seamless fallback** when Firestore unavailable

## Configuration

### Environment Variables

```bash
# Cache TTL (seconds)
CACHE_TTL=3600

# Cache enabled/disabled
CACHE_ENABLED=true

# Firestore collection name
CACHE_COLLECTION=redis_cache
```

### Cache Service Implementation

```python
from backend.app.core.firestore_cache import FirestoreCache

# Initialize cache
cache = FirestoreCache(
    collection_name="redis_cache",
    default_ttl=3600
)

# Use cache
result = cache.get("key")
cache.set("key", "value", ttl=1800)
cache.delete("key")
cache.clear_pattern("user:*")
```

## Performance Considerations

### Read/Write Patterns

- **Read-heavy**: Optimized for frequent reads with minimal writes
- **Batch operations**: Use batch writes for multiple cache updates
- **Indexing**: No additional indexes required for key-based lookups

### Cost Optimization

- **Document size**: Keep cached values under 1MB
- **Read frequency**: Monitor read operations to control costs
- **Cleanup**: Regular cleanup of expired entries

## Monitoring

### Cache Statistics

```python
from backend.app.core.firestore_cache import get_cache_stats

stats = get_cache_stats()
print(f"Hit ratio: {stats['hit_ratio']}")
print(f"Miss ratio: {stats['miss_ratio']}")
print(f"Total entries: {stats['total_entries']}")
```

### Health Checks

```python
from backend.app.core.firestore_cache import health_check

health = health_check()
if health['status'] == 'healthy':
    print("Cache is operational")
```

## Migration from Redis

### Data Migration

```bash
# Export Redis data (if available)
redis-cli --scan --pattern "*" | xargs -L 1 redis-cli MGET > redis_backup.json

# Import to Firestore
python3 scripts/migrate-redis-to-firestore.py --input redis_backup.json
```

### Code Changes

```python
# Before (Redis)
import redis
r = redis.Redis(host='localhost', port=6379, db=0)
r.set("key", "value")

# After (Firestore)
from backend.app.core.firestore_cache import FirestoreCache
cache = FirestoreCache()
cache.set("key", "value")
```

## Troubleshooting

### Common Issues

1. **High read costs**: Implement local caching layer
2. **Slow operations**: Use batch operations for bulk updates
3. **Memory usage**: Monitor document sizes and implement cleanup

### Debug Commands

```bash
# Check cache status
python3 -c "from backend.app.core.firestore_cache import health_check; print(health_check())"

# Clear all cache
python3 -c "from backend.app.core.firestore_cache import FirestoreCache; FirestoreCache().clear_all()"

# Monitor cache size
gcloud firestore collections list --project=careercopilot-468811
```

## Best Practices

1. **TTL Management**: Set appropriate TTL values based on data volatility
2. **Key Naming**: Use consistent key patterns (e.g., `user:123:profile`)
3. **Error Handling**: Implement graceful fallback when cache unavailable
4. **Monitoring**: Regular monitoring of cache performance and costs
5. **Cleanup**: Schedule regular cleanup of expired entries

## Security

- **Access Control**: Limit cache access to service accounts only
- **Data Classification**: Do not cache sensitive PII data
- **Encryption**: Firestore provides encryption at rest and in transit

## Future Enhancements

- **Multi-level caching**: Add local memory cache layer
- **Compression**: Implement compression for large cached values
- **Analytics**: Enhanced cache analytics and reporting
- **Distributed cache**: Consider multi-region cache for global applications
