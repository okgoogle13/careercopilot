# Cache Strategy (Firestore-backed)

CareerCopilot uses Firebase Cloud Firestore for caching (Redis is retired). This file is the canonical cache strategy reference.

## Migration Status

- Status: completed
- Migration date: November 2025
- Redis dependencies removed from active runtime

## Architecture

### Collection Schema

- Collection name: `redis_cache`
- Document shape: key/value payload with TTL metadata

### Core Components

| Component | Location | Purpose |
| --- | --- | --- |
| Cache Service | `backend/app/core/firestore_cache.py` | Firestore-backed cache implementation |
| LLM Cache | `backend/app/ai/llm_service.py` | Caches LLM responses |
| Cache Middleware | `backend/app/core/cache_middleware.py` | Cleanup and monitoring hooks |

### Features

- TTL-based expiration (default: 1 hour)
- Pattern-based cache clearing
- Cache stats and hit/miss monitoring
- Expired entry cleanup
- Graceful fallback when cache unavailable

## Configuration

### Environment Variables

```bash
# Cache defaults
CACHE_TTL=3600
CACHE_ENABLED=true
CACHE_COLLECTION=redis_cache
```

### Example Usage

```python
from backend.app.core.firestore_cache import FirestoreCache

cache = FirestoreCache(collection_name="redis_cache", default_ttl=3600)
cache.set("key", "value", ttl=1800)
value = cache.get("key")
cache.delete("key")
cache.clear_pattern("user:*")
```

## Performance and Cost

- Read-heavy workloads should batch writes where possible.
- Keep cached documents below 1MB.
- Monitor read rates and expired-doc cleanup to manage Firestore cost.

## Monitoring and Health

```python
from backend.app.core.firestore_cache import get_cache_stats, health_check

stats = get_cache_stats()
health = health_check()
```

## Troubleshooting

1. High read cost: reduce cache misses and avoid over-fragmented keys.
2. Slow operations: batch updates instead of one-by-one writes.
3. Large payloads: trim cached data and store only retrieval-ready fields.

## Best Practices

1. Use consistent key naming (for example `user:123:profile`).
2. Match TTL to data volatility.
3. Do not cache sensitive PII unless explicitly approved.
4. Treat cache as acceleration layer, not source of truth.

