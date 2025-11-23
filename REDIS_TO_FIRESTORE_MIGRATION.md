# Redis to Firestore Migration Guide

## Overview
This guide provides a complete migration strategy from Cloud Memorystore (Redis) to Cloud Firestore, leveraging Firebase's free tier while maintaining equivalent functionality.

## Current State Analysis

### Existing Redis Patterns to Migrate
1. **USER_SESSIONS** (Redis Hash) → Firestore Document
2. **LEADERBOARD** (Redis Sorted Set) → Firestore Collection with Queries
3. **RATE_LIMITER** (Redis String/INCR) → Firestore Transactions

### Current Implementation Status
✅ **Firebase Admin SDK**: Already configured in `backend/app/core/firebase.py`
✅ **Firestore Cache**: Basic implementation exists in `backend/app/core/firestore_cache.py`
⚠️ **Redis Usage**: No active Redis implementation found (clean slate migration)

## Data Structure Mapping

### 1. USER_SESSIONS (Hash → Document)

**Redis Pattern:**
```redis
HSET USER_SESSIONS:user123 "user_id" "user123"
HSET USER_SESSIONS:user123 "session_token" "abc123"
HSET USER_SESSIONS:user123 "expires_at" "2024-01-01T00:00:00Z"
```

**Firestore Equivalent:**
```javascript
// Collection: user_sessions
// Document: user123
{
  "user_id": "user123",
  "session_token": "abc123", 
  "expires_at": Timestamp("2024-01-01T00:00:00Z"),
  "created_at": Timestamp("2023-12-01T00:00:00Z")
}
```

### 2. LEADERBOARD (Sorted Set → Collection)

**Redis Pattern:**
```redis
ZADD LEADERBOARD 1500 "player1"
ZADD LEADERBOARD 2000 "player2"
ZREVRANGE LEADERBOARD 0 10
```

**Firestore Equivalent:**
```javascript
// Collection: leaderboard
// Documents: auto-generated IDs
{
  "player_id": "player1",
  "score": 1500,
  "rank": 2,
  "updated_at": Timestamp("2023-12-01T00:00:00Z")
}

// Query for top 10:
db.collection("leaderboard")
  .orderBy("score", "desc")
  .limit(10)
```

### 3. RATE_LIMITER (String/INCR → Transaction)

**Redis Pattern:**
```redis
INCR rate_limit:user123:api_calls
EXPIRE rate_limit:user123:api_calls 3600
```

**Firestore Equivalent:**
```javascript
// Collection: rate_limits
// Document: user123:api_calls
{
  "count": 15,
  "window_start": Timestamp("2023-12-01T12:00:00Z"),
  "expires_at": Timestamp("2023-12-01T13:00:00Z")
}

// Atomic increment using transaction
```

## Migration Implementation

### Step 1: Enhanced Firestore Cache Manager

Create `backend/app/utils/firestore_cache_manager.py`:

```python
"""
Enhanced Firestore Cache Manager
Drop-in replacement for Redis with full pattern support
"""

import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from firebase_admin import firestore
from ..core.firebase import get_firestore

class FirestoreCacheManager:
    def __init__(self):
        self.db = get_firestore()
        
    # USER_SESSIONS Methods
    def session_set(self, user_id: str, field: str, value: Any) -> bool:
        """Set session field (HSET equivalent)"""
        doc_ref = self.db.collection('user_sessions').document(user_id)
        doc_ref.set({field: value}, merge=True)
        return True
        
    def session_get(self, user_id: str, field: str) -> Optional[Any]:
        """Get session field (HGET equivalent)"""
        doc = self.db.collection('user_sessions').document(user_id).get()
        if doc.exists:
            return doc.to_dict().get(field)
        return None
        
    def session_get_all(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get all session fields (HGETALL equivalent)"""
        doc = self.db.collection('user_sessions').document(user_id).get()
        if doc.exists:
            return doc.to_dict()
        return None
        
    # LEADERBOARD Methods  
    def leaderboard_add(self, leaderboard_id: str, player_id: str, score: float) -> bool:
        """Add player to leaderboard (ZADD equivalent)"""
        doc_ref = self.db.collection('leaderboards').document(leaderboard_id)
        doc_ref.set({
            f"players.{player_id}": {
                "score": score,
                "updated_at": firestore.SERVER_TIMESTAMP
            }
        }, merge=True)
        return True
        
    def leaderboard_get_top(self, leaderboard_id: str, limit: int = 10) -> List[Dict]:
        """Get top players (ZREVRANGE equivalent)"""
        doc = self.db.collection('leaderboards').document(leaderboard_id).get()
        if not doc.exists:
            return []
            
        players = doc.to_dict().get('players', {})
        # Sort by score descending and return top N
        sorted_players = sorted(
            players.items(), 
            key=lambda x: x[1]['score'], 
            reverse=True
        )[:limit]
        
        return [
            {"player_id": pid, **data} 
            for pid, data in sorted_players
        ]
        
    # RATE_LIMITER Methods
    def rate_limit_increment(self, key: str, window_seconds: int = 3600) -> int:
        """Increment rate limit counter (INCR + EXPIRE equivalent)"""
        doc_ref = self.db.collection('rate_limits').document(key)
        
        @firestore.transactional
        def increment_in_transaction(transaction, ref):
            doc = ref.get(transaction=transaction)
            now = datetime.now()
            
            if doc.exists:
                data = doc.to_dict()
                window_start = data.get('window_start')
                
                # Check if window expired
                if window_start and (now - window_start.to_datetime()).seconds > window_seconds:
                    # Reset for new window
                    new_count = 1
                    new_window_start = now
                else:
                    # Increment existing
                    new_count = data.get('count', 0) + 1
                    new_window_start = window_start or now
            else:
                # New document
                new_count = 1
                new_window_start = now
            
            expires_at = new_window_start + timedelta(seconds=window_seconds)
            
            transaction.set(ref, {
                'count': new_count,
                'window_start': new_window_start,
                'expires_at': expires_at
            })
            
            return new_count
        
        transaction = self.db.transaction()
        return increment_in_transaction(transaction, doc_ref)
```

### Step 2: Client Library Migration

**Files to Update:**

1. **Replace Redis imports:**
```python
# Old:
import redis
# OR
from redis import Redis

# New: 
from ..utils.firestore_cache_manager import FirestoreCacheManager
from ..core.firestore_cache import get_firestore_cache
```

2. **Update initialization:**
```python
# Old:
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# New:
cache_manager = FirestoreCacheManager()
```

### Step 3: Code Transformation Examples

#### Simple Key/Value Operations

**Redis Code:**
```python
# SET
redis_client.set('user:123:profile', profile_data, ex=3600)

# GET  
profile = redis_client.get('user:123:profile')
```

**Firestore Replacement:**
```python
# SET
cache_manager.set_document('user:123:profile', profile_data, expiry_seconds=3600)

# GET
profile = cache_manager.get_document('user:123:profile')
```

#### Hash Operations (USER_SESSIONS)

**Redis Code:**
```python
# HSET
redis_client.hset('USER_SESSIONS', 'user123', session_data)

# HGET
session = redis_client.hget('USER_SESSIONS', 'user123')
```

**Firestore Replacement:**
```python
# HSET
cache_manager.session_set('user123', 'session_data', session_data)

# HGET  
session = cache_manager.session_get('user123', 'session_data')
```

#### Counter Operations (RATE_LIMITER)

**Redis Code:**
```python
# INCR
count = redis_client.incr(f'rate_limit:{user_id}:api_calls')
redis_client.expire(f'rate_limit:{user_id}:api_calls', 3600)
```

**Firestore Replacement:**
```python
# INCR + EXPIRE
count = cache_manager.rate_limit_increment(f'{user_id}:api_calls', 3600)
```

#### Sorted Set Operations (LEADERBOARD)

**Redis Code:**
```python
# ZADD
redis_client.zadd('LEADERBOARD', {'player1': 1500})

# ZREVRANGE
top_players = redis_client.zrevrange('LEADERBOARD', 0, 10, withscores=True)
```

**Firestore Replacement:**
```python
# ZADD
cache_manager.leaderboard_add('global', 'player1', 1500)

# ZREVRANGE
top_players = cache_manager.leaderboard_get_top('global', 10)
```

## Step 4: Migration Script

Create `scripts/migrate_redis_to_firestore.py`:

```python
"""
Migration script to transfer data from Redis to Firestore
Run this before switching to the Firestore cache implementation
"""

import redis
from backend.app.core.firebase import get_firestore
from backend.app.utils.firestore_cache_manager import FirestoreCacheManager

def migrate_user_sessions(redis_client, cache_manager):
    """Migrate USER_SESSIONS hash"""
    print("Migrating USER_SESSIONS...")
    
    # Get all hash fields
    session_data = redis_client.hgetall('USER_SESSIONS')
    
    for user_id, data in session_data.items():
        # Parse the serialized data and set in Firestore
        parsed_data = json.loads(data)
        cache_manager.session_set(user_id, 'data', parsed_data)
        
    print(f"Migrated {len(session_data)} user sessions")

def migrate_leaderboard(redis_client, cache_manager):
    """Migrate LEADERBOARD sorted set"""
    print("Migrating LEADERBOARD...")
    
    # Get all leaderboard members with scores
    leaderboard_data = redis_client.zrange('LEADERBOARD', 0, -1, withscores=True)
    
    for player_id, score in leaderboard_data:
        cache_manager.leaderboard_add('global', player_id.decode(), float(score))
        
    print(f"Migrated {len(leaderboard_data)} leaderboard entries")

def main():
    # Connect to Redis
    redis_client = redis.Redis(host='localhost', port=6379, db=0)
    
    # Initialize Firestore cache manager
    cache_manager = FirestoreCacheManager()
    
    # Migrate data
    migrate_user_sessions(redis_client, cache_manager)
    migrate_leaderboard(redis_client, cache_manager)
    
    print("Migration complete!")

if __name__ == "__main__":
    main()
```

## Step 5: Testing and Validation

Create comprehensive tests to ensure the Firestore implementation matches Redis behavior:

1. **Unit Tests**: Test each cache method individually
2. **Integration Tests**: Test end-to-end workflows
3. **Performance Tests**: Compare read/write performance
4. **TTL Tests**: Verify expiration behavior

## Benefits of Migration

1. **Cost Savings**: Firebase free tier vs. Redis pricing
2. **Simplified Infrastructure**: One less service to manage
3. **Real-time Capabilities**: Firestore's real-time listeners
4. **Better Security**: Firebase's built-in security rules
5. **Easier Development**: No separate Redis connection management

## Rollback Plan

Keep the Redis code in a feature branch for at least 2 weeks after migration. If issues arise:

1. Switch back to Redis imports
2. Run data migration script in reverse
3. Deploy rollback version

## Monitoring

Add monitoring to track:
- Cache hit/miss ratios
- Operation latency
- Error rates
- Firestore usage against free tier limits
