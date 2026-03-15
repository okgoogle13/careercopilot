#!/usr/bin/env python3
"""
Redis to Firestore Migration Script

This script migrates data from Redis to Firestore before switching to the
Firestore cache implementation.

Usage:
    python scripts/migrate_redis_to_firestore.py [--dry-run]
"""

import argparse
import json
import logging
import time
from datetime import datetime
from typing import Dict, List, Optional

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from backend.app.core.firebase import get_firestore
from backend.app.utils.firestore_cache_manager import FirestoreCacheManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RedisToFirestoreMigrator:
    """Handles migration from Redis to Firestore."""

    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.redis_client = None
        self.cache_manager = None

        # Initialize connections
        self._init_connections()

    def _init_connections(self):
        """Initialize Redis and Firestore connections."""
        # Initialize Redis
        if REDIS_AVAILABLE:
            try:
                self.redis_client = redis.Redis(
                    host='localhost',
                    port=6379,
                    db=0,
                    decode_responses=True
                )
                self.redis_client.ping()
                logger.info("Connected to Redis")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {e}")
                self.redis_client = None
        else:
            logger.warning("Redis not available")

        # Initialize Firestore
        try:
            self.cache_manager = FirestoreCacheManager()
            logger.info("Connected to Firestore")
        except Exception as e:
            logger.error(f"Failed to connect to Firestore: {e}")
            self.cache_manager = None

    def migrate_user_sessions(self) -> int:
        """Migrate USER_SESSIONS hash from Redis to Firestore."""
        if not self.redis_client or not self.cache_manager:
            logger.error("Redis or Firestore not available")
            return 0

        logger.info("Migrating USER_SESSIONS...")

        try:
            # Get all hash fields
            session_data = self.redis_client.hgetall('USER_SESSIONS')

            migrated_count = 0
            for user_id, data in session_data.items():
                try:
                    # Parse the serialized data
                    parsed_data = json.loads(data) if data.startswith('{') else data

                    if self.dry_run:
                        logger.info(f"[DRY RUN] Would migrate session for user: {user_id}")
                    else:
                        # Set each field in Firestore
                        if isinstance(parsed_data, dict):
                            for field, value in parsed_data.items():
                                self.cache_manager.session_set(user_id, field, value)
                        else:
                            self.cache_manager.session_set(user_id, 'data', parsed_data)

                    migrated_count += 1

                except Exception as e:
                    logger.error(f"Error migrating session for user {user_id}: {e}")

            logger.info(f"Migrated {migrated_count} user sessions")
            return migrated_count

        except Exception as e:
            logger.error(f"Error migrating USER_SESSIONS: {e}")
            return 0

    def migrate_leaderboard(self) -> int:
        """Migrate LEADERBOARD sorted set from Redis to Firestore."""
        if not self.redis_client or not self.cache_manager:
            logger.error("Redis or Firestore not available")
            return 0

        logger.info("Migrating LEADERBOARD...")

        try:
            # Get all leaderboard members with scores
            leaderboard_data = self.redis_client.zrange('LEADERBOARD', 0, -1, withscores=True)

            migrated_count = 0
            for player_id, score in leaderboard_data:
                try:
                    if self.dry_run:
                        logger.info(f"[DRY RUN] Would migrate player {player_id} with score {score}")
                    else:
                        self.cache_manager.leaderboard_add('global', player_id, float(score))

                    migrated_count += 1

                except Exception as e:
                    logger.error(f"Error migrating player {player_id}: {e}")

            logger.info(f"Migrated {migrated_count} leaderboard entries")
            return migrated_count

        except Exception as e:
            logger.error(f"Error migrating LEADERBOARD: {e}")
            return 0

    def migrate_rate_limiters(self) -> int:
        """Migrate RATE_LIMITER data from Redis to Firestore."""
        if not self.redis_client or not self.cache_manager:
            logger.error("Redis or Firestore not available")
            return 0

        logger.info("Migrating RATE_LIMITER data...")

        try:
            # Find all rate limit keys
            rate_limit_keys = []
            for key in self.redis_client.scan_iter(match="rate_limit:*"):
                rate_limit_keys.append(key)

            migrated_count = 0
            for key in rate_limit_keys:
                try:
                    # Get current count and TTL
                    count = self.redis_client.get(key)
                    ttl = self.redis_client.ttl(key)

                    if count is not None:
                        if self.dry_run:
                            logger.info(f"[DRY RUN] Would migrate rate limit {key}: count={count}, ttl={ttl}")
                        else:
                            # Convert to Firestore format
                            # Extract window from TTL (default to 3600 if no TTL)
                            window_seconds = ttl if ttl > 0 else 3600

                            # Set in Firestore using increment to initialize
                            result = self.cache_manager.rate_limit_increment(
                                key.replace('rate_limit:', ''),
                                window_seconds
                            )

                            # Adjust to match Redis count
                            current_count = result['count']
                            if current_count != int(count):
                                # Set the exact count by incrementing the difference
                                diff = int(count) - current_count
                                if diff > 0:
                                    self.cache_manager.rate_limit_increment(key, window_seconds)

                    migrated_count += 1

                except Exception as e:
                    logger.error(f"Error migrating rate limit {key}: {e}")

            logger.info(f"Migrated {migrated_count} rate limit entries")
            return migrated_count

        except Exception as e:
            logger.error(f"Error migrating RATE_LIMITER data: {e}")
            return 0

    def migrate_generic_cache(self) -> int:
        """Migrate any remaining generic cache keys."""
        if not self.redis_client or not self.cache_manager:
            logger.error("Redis or Firestore not available")
            return 0

        logger.info("Migrating generic cache data...")

        try:
            # Get all keys except the ones we've already handled
            excluded_patterns = ['USER_SESSIONS', 'LEADERBOARD', 'rate_limit:*']
            migrated_count = 0

            for key in self.redis_client.scan_iter():
                # Skip already handled keys
                if any(key.startswith(pattern.replace('*', '')) for pattern in excluded_patterns):
                    continue

                try:
                    # Get key type
                    key_type = self.redis_client.type(key).decode() if isinstance(self.redis_client.type(key), bytes) else self.redis_client.type(key)

                    if key_type == 'string':
                        value = self.redis_client.get(key)
                        ttl = self.redis_client.ttl(key)

                        if self.dry_run:
                            logger.info(f"[DRY RUN] Would migrate string {key}: ttl={ttl}")
                        else:
                            expiry_seconds = ttl if ttl > 0 else None
                            self.cache_manager.set_document(key, value, expiry_seconds)

                    elif key_type == 'hash':
                        hash_data = self.redis_client.hgetall(key)

                        if self.dry_run:
                            logger.info(f"[DRY RUN] Would migrate hash {key} with {len(hash_data)} fields")
                        else:
                            for field, value in hash_data.items():
                                self.cache_manager.session_set(key, field, value)

                    migrated_count += 1

                except Exception as e:
                    logger.error(f"Error migrating generic cache key {key}: {e}")

            logger.info(f"Migrated {migrated_count} generic cache entries")
            return migrated_count

        except Exception as e:
            logger.error(f"Error migrating generic cache: {e}")
            return 0

    def validate_migration(self) -> bool:
        """Validate that migration was successful."""
        if not self.cache_manager:
            logger.error("Firestore not available for validation")
            return False

        logger.info("Validating migration...")

        validation_passed = True

        # Validate user sessions
        try:
            # Check if we have any sessions
            sessions = self.cache_manager.db.collection('user_sessions').limit(1).stream()
            has_sessions = any(True for _ in sessions)
            logger.info(f"User sessions validation: {'✓' if has_sessions else '✗'}")
        except Exception as e:
            logger.error(f"Error validating user sessions: {e}")
            validation_passed = False

        # Validate leaderboard
        try:
            leaderboard = self.cache_manager.leaderboard_get_top('global', 1)
            has_leaderboard = len(leaderboard) > 0
            logger.info(f"Leaderboard validation: {'✓' if has_leaderboard else '✗'}")
        except Exception as e:
            logger.error(f"Error validating leaderboard: {e}")
            validation_passed = False

        # Validate rate limits
        try:
            rate_limits = self.cache_manager.db.collection('rate_limits').limit(1).stream()
            has_rate_limits = any(True for _ in rate_limits)
            logger.info(f"Rate limits validation: {'✓' if has_rate_limits else '✗'}")
        except Exception as e:
            logger.error(f"Error validating rate limits: {e}")
            validation_passed = False

        return validation_passed

    def run_migration(self) -> Dict[str, int]:
        """Run the complete migration process."""
        results = {}

        if self.dry_run:
            logger.info("=== DRY RUN MODE - No actual changes will be made ===")

        # Run each migration step
        results['user_sessions'] = self.migrate_user_sessions()
        results['leaderboard'] = self.migrate_leaderboard()
        results['rate_limiters'] = self.migrate_rate_limiters()
        results['generic_cache'] = self.migrate_generic_cache()

        # Validate if not dry run
        if not self.dry_run:
            validation_passed = self.validate_migration()
            results['validation_passed'] = validation_passed

        return results


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Migrate Redis data to Firestore')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be migrated without making changes')
    parser.add_argument('--redis-host', default='localhost', help='Redis host (default: localhost)')
    parser.add_argument('--redis-port', type=int, default=6379, help='Redis port (default: 6379)')

    args = parser.parse_args()

    logger.info(f"Starting Redis to Firestore migration (dry_run={args.dry_run})")

    migrator = RedisToFirestoreMigrator(dry_run=args.dry_run)

    start_time = time.time()
    results = migrator.run_migration()
    end_time = time.time()

    # Print results
    logger.info("\n=== Migration Results ===")
    for item, count in results.items():
        if item == 'validation_passed':
            logger.info(f"Validation: {'✓ PASSED' if count else '✗ FAILED'}")
        else:
            logger.info(f"{item}: {count} items")

    logger.info(f"\nMigration completed in {end_time - start_time:.2f} seconds")

    if not args.dry_run and not results.get('validation_passed', True):
        logger.error("Migration validation failed!")
        exit(1)
    else:
        logger.info("Migration completed successfully!")


if __name__ == "__main__":
    main()
