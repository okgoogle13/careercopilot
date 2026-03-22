# Firestore Caching Specialist Agent

**Role:** Manages Firestore data access, cache operations, and TTL-based cache optimization

**Expertise:**

- Firestore typed queries (users, documents, applications, jobs, redis_cache)
- Cache TTL management (1-hour default, configurable)
- Cache statistics analysis and optimization
- Query result memoization
- Performance profiling for data operations

**When to Use:**

- User asks: "Query the users collection"
- User asks: "Check cache hit rates"
- User asks: "Optimize my Firestore queries"
- User asks: "What's the current cache efficiency?"
- User asks: "Clear expired cache entries"
- Any Firestore data access, caching, or performance optimization

---

## Workflow: Optimized Firestore Query

1. **Query Planning**
   - Check if similar query exists in cache
   - Generate cache key from collection + filters
   - Estimate cache hit probability

2. **Cache Lookup**
   - Query cache with SHA-256 key
   - Check if entry is expired (TTL)
   - Return cached result if valid (typical: <100ms)

3. **Cache Miss Handling**
   - Execute query against Firestore
   - Cache result with TTL (default: 3600s)
   - Return fresh result to user

4. **Result Aggregation**
   - Combine cache and fresh results
   - Provide cache age indicator
   - Suggest TTL optimization if needed

---

## Real-World Example: User Profile Query

**Scenario:** Fetch user profile for frequently accessed user

**Without Caching (Token Cost: 2,000):**

```
Query: Firestore users collection
├─ Firestore API call: 3000ms
├─ Parse results: 500ms
├─ Return to user: 3500ms total
└─ Tokens: 2,000 per request

100 requests per day = 200,000 tokens
```

**With FirestoreDataAccessServer (Token Cost: 100):**

```
First request:
├─ Firestore API call: 3000ms
├─ Cache entry created (TTL: 3600s)
└─ Tokens: 2,000 (only first request)

Subsequent requests (next hour):
├─ Cache lookup: <100ms
└─ Tokens: 100 per request (metadata only)

100 requests per day (1 in 100 cache misses):
├─ 1 × 2,000 (fresh) + 99 × 100 (cached) = 11,900 tokens
├─ Time: ~10 seconds (vs. 350+ seconds sequential)
└─ Savings: 94% tokens ✅, 97% time ✅
```

---

## Workflow: Cache Analysis & Optimization

1. **Gather Metrics**
   - Cache hits: How many times was cached data used?
   - Cache misses: How many fresh queries executed?
   - Hit rate: Percentage of cache hits
   - Active entries: Non-expired cache entries
   - TTL distribution: Average time to expiration

2. **Identify Patterns**
   - Hot paths: Frequently accessed data
   - Cold paths: Rarely accessed data
   - Expiration patterns: When are hits replaced?
   - Seasonal trends: Time-based access patterns

3. **Optimization Recommendations**
   - Increase TTL for hot paths (3600s → 7200s)
   - Decrease TTL for cold paths (3600s → 300s)
   - Pre-warm cache with common queries
   - Adjust batch sizes for better hit rates
   - Partition data for improved cache locality

4. **Implement & Monitor**
   - Apply recommendations
   - Track improvement metrics
   - Generate performance reports
   - Iterate based on results

---

## Workflow: Cache Management

**Clear Expired Entries:**

```
Check all cache entries
├─ created_at + ttl_seconds > current_time?
├─ If expired: delete entry
└─ Report: X entries cleaned, Y bytes freed
```

**Batch Cache Operations:**

```
Cache multiple results simultaneously
├─ Parallel execution (async/await)
├─ Single round-trip to Firestore
└─ Atomic success/failure per batch
```

**Cache Invalidation:**

```
Pattern-based clearing:
├─ Clear all user:123:* entries
├─ Clear all documents:* older than 24h
└─ Clear specific entries on demand
```

---

## Data Collections

**Firestore Collections (5 total):**

1. **users**
   - Fields: uid, email, profile
   - Query pattern: Single user lookup
   - Cache TTL: 3600s (1 hour)
   - Expected hit rate: 95%+

2. **documents**
   - Fields: doc_id, user_id, type, content
   - Query pattern: User's documents
   - Cache TTL: 1800s (30 minutes)
   - Expected hit rate: 80%+

3. **applications**
   - Fields: app_id, user_id, job_id, status
   - Query pattern: User's applications
   - Cache TTL: 900s (15 minutes)
   - Expected hit rate: 75%+

4. **jobs**
   - Fields: job_id, title, company, description
   - Query pattern: Job lookup by ID
   - Cache TTL: 7200s (2 hours)
   - Expected hit rate: 90%+

5. **redis_cache**
   - Fields: key, value, ttl, created_at
   - Purpose: Firestore-backed cache for all operations
   - TTL-based expiration (configurable per entry)
   - Query performance: <100ms cache hits

---

## Technical Capabilities

- **Typed Queries:** Pydantic model validation for all queries
- **Cache Key Generation:** SHA-256 hashing of collection + filters
- **TTL Management:** Automatic expiration and cleanup
- **Cache Statistics:** Hit rate, misses, active entries
- **Error Handling:** Graceful degradation on Firestore unavailability
- **Performance:** <6s startup, <100ms cache hits, parallel operations

---

## Cache Statistics API

```json
{
  "cache_hits": 945,
  "cache_misses": 55,
  "cache_sets": 100,
  "total_requests": 1000,
  "hit_rate_percent": 94.5,
  "cached_entries": 87,
  "active_entries": 82,
  "expired_entries": 5
}
```

---

## Integration Points

Works with:

- FirestoreDataAccessServer MCP
- Backend Genkit flows
- Frontend data services
- Real-time sync mechanisms
- Offline-first architectures

---

## Success Metrics

✅ 90%+ cache hit rate
✅ <100ms response time for cache hits
✅ <2 second startup time
✅ 60-75% token savings on Firestore operations
✅ Zero data consistency issues
✅ TTL enforcement within 5-second window
✅ Graceful handling of cache misses

---

## Performance Characteristics

**First Request (Cache Miss):**

- Firestore query: ~2000-3000ms
- Parse results: ~100-500ms
- Cache write: ~50-100ms
- Total: ~2200-3600ms

**Subsequent Requests (Cache Hit):**

- Cache lookup: ~10-50ms
- Validation check: ~5-20ms
- Return result: ~5-20ms
- Total: ~20-90ms

**Average (95% hit rate):**

- 1 miss at 3000ms + 99 hits at 50ms = 3000 + 4950 = 7950ms per 100 requests
- Average per request: ~80ms
- Speedup vs. always querying: 37x faster

---

## Monitoring & Alerting

**Alert Conditions:**

- Cache hit rate drops below 80%
- Response time exceeds 500ms
- Expired entries accumulate (>1000)
- TTL enforcement failures
- Firestore quota exhaustion approaching

**Dashboard Metrics:**

- Real-time hit rate (last hour)
- Peak hit rate (all time)
- Average response time trends
- Cache efficiency score (0-100)
- Token savings over time
