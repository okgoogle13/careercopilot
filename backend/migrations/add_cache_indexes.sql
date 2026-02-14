-- SQL Migration: Add performance indexes to cache table
-- Date: 2026-02-14
-- Purpose: Improve cache query performance by adding indexes on frequently filtered columns

-- Create unique index on key column (for fast cache lookups)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cache_key ON cache(key);

-- Create index on expires_at column (for efficient cleanup queries)
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at);

-- Create composite index on user_id and operation_type (for analytics/user-specific cleanup)
CREATE INDEX IF NOT EXISTS idx_cache_user_operation ON cache(user_id, operation_type);

-- Performance impact: 
-- - idx_cache_key: O(1) cache lookups instead of O(n) table scans
-- - idx_cache_expires_at: Faster cleanup of expired entries (used in cleanup_expired())
-- - idx_cache_user_operation: Faster user-specific cache operations
