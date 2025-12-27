# Redis to Firestore Migration: Step-by-Step Plan

## Overview

This document provides a detailed, step-by-step migration plan from Cloud Memorystore (Redis) to Cloud Firestore.

## Prerequisites

### 1. Environment Setup

- ✅ Firebase Admin SDK already configured
- ✅ Firestore client available in `backend/app/core/firebase.py`
- ✅ Basic Firestore cache implementation exists

### 2. Dependencies to Install

```bash
# Already installed (verify):
pip install firebase-admin google-cloud-firestore

# If Redis is still needed for migration:
pip install redis
```

## Step 1: Code Analysis and Identification

### Files That Need Updates

Based on repository analysis, the following files may need Redis-to-Firestore migration:

1. **Backend Services** (if Redis is added later):
   - `backend/app/services/user_profile_service.py` - Already uses Firestore
   - `backend/app/core/auth.py` - May need session caching
   - `backend/app/api/endpoints/` - May need rate limiting

2. **Import Replacements**:

```python
# Old imports to replace:
import redis
from redis import Redis

# New imports:
from backend.app.utils.firestore_cache_manager import FirestoreCacheManager, get_cache_manager
from backend.app.core.firestore_cache import get_firestore_cache
```

## Step 2: Data Structure Implementation

### 2.1 USER_SESSIONS Migration

**Current Redis Pattern:**

```redis
HSET USER_SESSIONS user123 '{"token": "abc123", "expires": "2024-01-01"}'
HGET USER_SESSIONS user123
```

**Firestore Implementation:**

```python
# Collection: user_sessions
# Document: user123
{
  "token": "abc123",
  "expires": Timestamp("2024-01-01T00:00:00Z"),
  "updated_at": Timestamp("2023-12-01T00:00:00Z")
}
```

### 2.2 LEADERBOARD Migration

**Current Redis Pattern:**

```redis
ZADD LEADERBOARD 1500 "player1"
ZADD LEADERBOARD 2000 "player2"
ZREVRANGE LEADERBOARD 0 10
```

**Firestore Implementation:**

```python
# Collection: leaderboards
# Document: global
{
  "players": {
    "player1": {
      "score": 1500,
      "updated_at": Timestamp("2023-12-01T00:00:00Z")
    },
    "player2": {
      "score": 2000,
      "updated_at": Timestamp("2023-12-01T00:00:00Z")
    }
  }
}
```

### 2.3 RATE_LIMITER Migration

**Current Redis Pattern:**

```redis
INCR rate_limit:user123:api_calls
EXPIRE rate_limit:user123:api_calls 3600
```

**Firestore Implementation:**

```python
# Collection: rate_limits
# Document: user123:api_calls
{
  "count": 15,
  "window_start": Timestamp("2023-12-01T12:00:00Z"),
  "expires_at": Timestamp("2023-12-01T13:00:00Z"),
  "max_requests": 100
}
```

## Step 3: Implementation Steps

### Step 3.1: Create Enhanced Cache Manager

✅ **COMPLETED**: `backend/app/utils/firestore_cache_manager.py`

Features:

- Session management (hash operations)
- Leaderboard operations (sorted set)
- Rate limiting with transactions
- TTL support
- Atomic operations

### Step 3.2: Update Service Files

#### Example: Update User Profile Service

```python
# In backend/app/services/user_profile_service.py

# Add caching
from ..utils.firestore_cache_manager import get_cache_manager

class UserProfileService:
    def __init__(self):
        self.db = get_firestore()
        self.cache = get_cache_manager()

    def get_profile(self, user_id: str) -> Optional[Dict]:
        # Try cache first
        cached = self.cache.get_document(f"profile:{user_id}")
        if cached:
            return cached

        # Fetch from Firestore
        profile = self.get_user_profile(user_id)
        if profile:
            # Cache for 1 hour
            self.cache.set_document(f"profile:{user_id}", profile, 3600)

        return profile
```

#### Example: Add Rate Limiting to API Endpoints

```python
# In backend/app/api/middleware/rate_limiter.py

from ..utils.firestore_cache_manager import get_cache_manager

class RateLimiterMiddleware:
    def __init__(self, requests_per_minute: int = 100):
        self.cache = get_cache_manager()
        self.rpm = requests_per_minute

    async def __call__(self, request, call_next):
        # Get client IP or user ID
        client_id = self.get_client_id(request)

        # Check rate limit
        result = self.cache.rate_limit_increment(
            f"api:{client_id}",
            window_seconds=60,
            max_requests=self.rpm
        )

        if result['limited']:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")

        return await call_next(request)
```

### Step 3.3: Migration Script Execution

1. **Pre-Migration Backup**:

```bash
# Backup Redis data
redis-cli --rdb backup_redis_$(date +%Y%m%d_%H%M%S).rdb
```

2. **Dry Run Migration**:

```bash
cd /Applications/careercopilot
python scripts/migrate_redis_to_firestore.py --dry-run
```

3. **Execute Migration**:

```bash
python scripts/migrate_redis_to_firestore.py
```

4. **Validate Migration**:

```python
# Test the new cache manager
from backend.app.utils.firestore_cache_manager import get_cache_manager

cache = get_cache_manager()

# Test sessions
cache.session_set("test_user", "token", "abc123")
assert cache.session_get("test_user", "token") == "abc123"

# Test leaderboard
cache.leaderboard_add("global", "player1", 1500)
top_players = cache.leaderboard_get_top("global", 10)
assert len(top_players) > 0

# Test rate limiting
result = cache.rate_limit_increment("test_user", 60, 10)
assert result['count'] == 1
```

## Step 4: Configuration Updates

### 4.1 Environment Variables

Add to `.env` or configuration:

```bash
# Firestore cache settings
FIRESTORE_CACHE_COLLECTION=cache
FIRESTORE_CACHE_TTL_DEFAULT=3600
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_BURST=200
```

### 4.2 Firebase Configuration

Update `backend/app/core/firebase.py` if needed:

```python
# Add cache-specific configuration
firebase_config = {
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "cache_collection": os.getenv("FIRESTORE_CACHE_COLLECTION", "cache"),
    "cache_ttl_default": int(os.getenv("FIRESTORE_CACHE_TTL_DEFAULT", "3600"))
}
```

## Step 5: Testing Strategy

### 5.1 Unit Tests

Create tests in `backend/app/tests/test_firestore_cache_manager.py`:

```python
import pytest
from backend.app.utils.firestore_cache_manager import FirestoreCacheManager

class TestFirestoreCacheManager:
    def test_session_operations(self):
        cache = FirestoreCacheManager()

        # Test HSET/HGET
        assert cache.session_set("user1", "token", "abc123")
        assert cache.session_get("user1", "token") == "abc123"

        # Test HGETALL
        all_data = cache.session_get_all("user1")
        assert "token" in all_data

    def test_leaderboard_operations(self):
        cache = FirestoreCacheManager()

        # Test ZADD
        assert cache.leaderboard_add("test", "player1", 1500)
        assert cache.leaderboard_add("test", "player2", 2000)

        # Test ZREVRANGE
        top_players = cache.leaderboard_get_top("test", 10)
        assert len(top_players) == 2
        assert top_players[0]['player_id'] == "player2"  # Higher score

    def test_rate_limiting(self):
        cache = FirestoreCacheManager()

        # Test INCR
        result = cache.rate_limit_increment("test_user", 60, 5)
        assert result['count'] == 1
        assert result['remaining'] == 4
```

### 5.2 Integration Tests

Test end-to-end workflows:

- User session lifecycle
- API rate limiting
- Leaderboard updates

### 5.3 Performance Tests

Compare performance:

- Read/write latency
- Concurrent operations
- Memory usage

## Step 6: Deployment Strategy

### 6.1 Blue-Green Deployment

1. Deploy Firestore cache alongside Redis
2. Use feature flags to switch between implementations
3. Monitor performance and error rates
4. Gradually migrate traffic to Firestore
5. Decommission Redis

### 6.2 Feature Flag Implementation

```python
# In backend/app/core/config.py
USE_FIRESTORE_CACHE = os.getenv("USE_FIRESTORE_CACHE", "false").lower() == "true"

# In service code
if USE_FIRESTORE_CACHE:
    from ..utils.firestore_cache_manager import get_cache_manager
    cache = get_cache_manager()
else:
    import redis
    cache = redis.Redis()
```

## Step 7: Monitoring and Maintenance

### 7.1 Metrics to Monitor

- Cache hit/miss ratios
- Operation latency (p50, p95, p99)
- Error rates
- Firestore usage against free tier limits
- Rate limit effectiveness

### 7.2 Alerting

Set up alerts for:

- High error rates (>5%)
- Latency spikes (>1000ms)
- Firestore quota usage (>80%)
- Cache miss rates (>50%)

### 7.3 Cleanup Tasks

- Expired document cleanup (weekly)
- Performance optimization (monthly)
- Security rule reviews (quarterly)

## Step 8: Rollback Plan

### 8.1 Immediate Rollback

1. Switch feature flag back to Redis
2. Deploy previous version
3. Verify Redis connectivity
4. Monitor system stability

### 8.2 Data Rollback (if needed)

Run reverse migration script:

```python
# scripts/migrate_firestore_to_redis.py
# Export from Firestore and import to Redis
```

## Step 9: Cost Analysis

### 9.1 Current Redis Costs

- Memorystore instance: $X/month
- Network egress: $Y/month

### 9.2 Firestore Free Tier Benefits

- Reads: 50k/day (1.5M/month)
- Writes: 20k/day (600k/month)
- Deletes: 20k/day (600k/month)
- Storage: 1GB

### 9.3 Expected Savings

- Eliminate Redis hosting costs
- Reduce network complexity
- Leverage Firebase free tier

## Step 10: Post-Migration Tasks

### 10.1 Documentation Updates

- Update API documentation
- Update deployment guides
- Update troubleshooting guides

### 10.2 Team Training

- Firestore cache patterns
- Monitoring procedures
- Emergency procedures

### 10.3 Clean Up

- Remove Redis dependencies
- Delete unused Redis instances
- Clean up migration scripts

## Timeline Estimate

| Phase          | Duration     | Dependencies               |
| -------------- | ------------ | -------------------------- |
| Implementation | 2-3 days     | Development resources      |
| Testing        | 2-3 days     | Test environment           |
| Migration      | 1 day        | Maintenance window         |
| Validation     | 1-2 days     | Monitoring setup           |
| **Total**      | **6-9 days** | **Full team availability** |

## Success Criteria

1. ✅ All Redis patterns successfully migrated to Firestore
2. ✅ Performance within 10% of Redis implementation
3. ✅ 99.9% uptime during migration
4. ✅ All tests passing
5. ✅ No data loss
6. ✅ Cost savings achieved
7. ✅ Team trained on new implementation

## Risk Mitigation

| Risk                           | Probability | Impact | Mitigation                      |
| ------------------------------ | ----------- | ------ | ------------------------------- |
| Data loss during migration     | Low         | High   | Dry-run testing, backups        |
| Performance degradation        | Medium      | Medium | Performance testing, monitoring |
| Firestore quota exceeded       | Low         | High   | Usage monitoring, alerts        |
| Team unfamiliar with Firestore | Low         | Medium | Training, documentation         |
| Rollback complications         | Low         | Medium | Rollback plan, testing          |

This comprehensive plan ensures a smooth, safe migration from Redis to Firestore while maintaining system reliability and performance.
