"""
Enhanced Firestore Cache Manager
Drop-in replacement for Redis with full pattern support for:
- USER_SESSIONS (Hash)
- LEADERBOARD (Sorted Set) 
- RATE_LIMITER (String/INCR)
"""

import json
import logging
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from firebase_admin import firestore
from google.cloud.firestore_v1.transaction import Transaction

from ..core.firebase import get_firestore

logger = logging.getLogger(__name__)


class FirestoreCacheManager:
    """
    Enhanced Firestore cache manager that replicates Redis patterns.
    
    Supports:
    - Simple key/value (Redis String) -> Firestore documents
    - Hash maps (Redis Hash) -> Firestore document fields
    - Counters (Redis INCR) -> Firestore transactions
    - Sorted sets (Redis ZSET) -> Firestore with ordered queries
    """
    
    def __init__(self):
        """Initialize with Firestore client."""
        self.db = get_firestore()
        if not self.db:
            raise RuntimeError("Firestore not available")
    
    # ===== BASIC CACHE OPERATIONS =====
    
    def get_document(self, key: str) -> Optional[Any]:
        """
        Get a document by key, checking expiry.
        
        Equivalent to Redis GET operation.
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if expired/not found
        """
        try:
            doc_ref = self.db.collection('cache').document(key)
            doc = doc_ref.get()
            
            if not doc.exists:
                return None
                
            data = doc.to_dict()
            
            # Check expiry
            expires_at = data.get('expiresAt')
            if expires_at and datetime.fromtimestamp(expires_at) < datetime.now():
                # Document expired, delete it
                doc_ref.delete()
                return None
                
            return data.get('value')
            
        except Exception as e:
            logger.error(f"Error getting cache document {key}: {e}")
            return None
    
    def set_document(self, key: str, data: Any, expiry_seconds: Optional[int] = None) -> bool:
        """
        Set a document with optional expiry.
        
        Equivalent to Redis SET operation with optional EXPIRE.
        
        Args:
            key: Cache key
            data: Data to cache
            expiry_seconds: TTL in seconds
            
        Returns:
            True if successful
        """
        try:
            doc_data = {'value': data}
            
            if expiry_seconds:
                expires_at = time.time() + expiry_seconds
                doc_data['expiresAt'] = expires_at
            
            self.db.collection('cache').document(key).set(doc_data)
            return True
            
        except Exception as e:
            logger.error(f"Error setting cache document {key}: {e}")
            return False
    
    # ===== USER_SESSIONS (HASH) OPERATIONS =====
    
    def session_set(self, user_id: str, field: str, value: Any) -> bool:
        """
        Set session field (Redis HSET equivalent).
        
        Args:
            user_id: User identifier
            field: Session field name
            value: Field value
            
        Returns:
            True if successful
        """
        try:
            doc_ref = self.db.collection('user_sessions').document(user_id)
            doc_ref.set({
                field: value,
                'updated_at': firestore.SERVER_TIMESTAMP
            }, merge=True)
            return True
            
        except Exception as e:
            logger.error(f"Error setting session field {field} for user {user_id}: {e}")
            return False
    
    def session_get(self, user_id: str, field: str) -> Optional[Any]:
        """
        Get session field (Redis HGET equivalent).
        
        Args:
            user_id: User identifier
            field: Session field name
            
        Returns:
            Field value or None
        """
        try:
            doc = self.db.collection('user_sessions').document(user_id).get()
            if doc.exists:
                return doc.to_dict().get(field)
            return None
            
        except Exception as e:
            logger.error(f"Error getting session field {field} for user {user_id}: {e}")
            return None
    
    def session_get_all(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get all session fields (Redis HGETALL equivalent).
        
        Args:
            user_id: User identifier
            
        Returns:
            All session fields or None
        """
        try:
            doc = self.db.collection('user_sessions').document(user_id).get()
            if doc.exists:
                data = doc.to_dict()
                # Remove system fields
                return {k: v for k, v in data.items() if not k.startswith('_')}
            return None
            
        except Exception as e:
            logger.error(f"Error getting all session fields for user {user_id}: {e}")
            return None
    
    def session_delete(self, user_id: str) -> bool:
        """
        Delete user session (Redis DEL equivalent for hash).
        
        Args:
            user_id: User identifier
            
        Returns:
            True if successful
        """
        try:
            self.db.collection('user_sessions').document(user_id).delete()
            return True
            
        except Exception as e:
            logger.error(f"Error deleting session for user {user_id}: {e}")
            return False
    
    # ===== LEADERBOARD (SORTED SET) OPERATIONS =====
    
    def leaderboard_add(self, leaderboard_id: str, player_id: str, score: float) -> bool:
        """
        Add player to leaderboard (Redis ZADD equivalent).
        
        Args:
            leaderboard_id: Leaderboard identifier
            player_id: Player identifier
            score: Player score
            
        Returns:
            True if successful
        """
        try:
            # Use a subcollection for players
            doc_ref = self.db.collection('leaderboards').document(leaderboard_id)
            doc_ref.set({
                f'players.{player_id}': {
                    'score': score,
                    'player_id': player_id,
                    'updated_at': firestore.SERVER_TIMESTAMP
                }
            }, merge=True)
            return True
            
        except Exception as e:
            logger.error(f"Error adding player {player_id} to leaderboard {leaderboard_id}: {e}")
            return False
    
    def leaderboard_get_top(self, leaderboard_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get top players from leaderboard (Redis ZREVRANGE equivalent).
        
        Args:
            leaderboard_id: Leaderboard identifier
            limit: Number of top players to return
            
        Returns:
            List of players with scores and ranks
        """
        try:
            doc = self.db.collection('leaderboards').document(leaderboard_id).get()
            if not doc.exists:
                return []
            
            players_data = doc.to_dict().get('players', {})
            if not players_data:
                return []
            
            # Sort players by score descending
            sorted_players = sorted(
                players_data.items(),
                key=lambda x: x[1].get('score', 0),
                reverse=True
            )
            
            # Add ranks and limit results
            result = []
            for rank, (player_id, data) in enumerate(sorted_players[:limit], 1):
                result.append({
                    'rank': rank,
                    'player_id': player_id,
                    'score': data.get('score', 0),
                    'updated_at': data.get('updated_at')
                })
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting top players from leaderboard {leaderboard_id}: {e}")
            return []
    
    def leaderboard_get_rank(self, leaderboard_id: str, player_id: str) -> Optional[int]:
        """
        Get player's rank in leaderboard.
        
        Args:
            leaderboard_id: Leaderboard identifier
            player_id: Player identifier
            
        Returns:
            Player rank or None if not found
        """
        try:
            doc = self.db.collection('leaderboards').document(leaderboard_id).get()
            if not doc.exists:
                return None
            
            players_data = doc.to_dict().get('players', {})
            if player_id not in players_data:
                return None
            
            # Sort and find rank
            sorted_players = sorted(
                players_data.items(),
                key=lambda x: x[1].get('score', 0),
                reverse=True
            )
            
            for rank, (pid, _) in enumerate(sorted_players, 1):
                if pid == player_id:
                    return rank
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting rank for player {player_id}: {e}")
            return None
    
    def leaderboard_remove(self, leaderboard_id: str, player_id: str) -> bool:
        """
        Remove player from leaderboard.
        
        Args:
            leaderboard_id: Leaderboard identifier
            player_id: Player identifier
            
        Returns:
            True if successful
        """
        try:
            doc_ref = self.db.collection('leaderboards').document(leaderboard_id)
            doc_ref.update({
                f'players.{player_id}': firestore.DELETE_FIELD
            })
            return True
            
        except Exception as e:
            logger.error(f"Error removing player {player_id} from leaderboard: {e}")
            return False
    
    # ===== RATE_LIMITER (COUNTER) OPERATIONS =====
    
    def rate_limit_increment(self, key: str, window_seconds: int = 3600, max_requests: int = 100) -> Dict[str, Any]:
        """
        Increment rate limit counter (Redis INCR + EXPIRE equivalent).
        
        Args:
            key: Rate limit key (e.g., 'user123:api_calls')
            window_seconds: Time window in seconds
            max_requests: Maximum allowed requests
            
        Returns:
            Dictionary with count, remaining, and reset time
        """
        try:
            doc_ref = self.db.collection('rate_limits').document(key)
            
            @firestore.transactional
            def increment_in_transaction(transaction: Transaction, ref):
                doc = ref.get(transaction=transaction)
                now = datetime.now()
                
                if doc.exists:
                    data = doc.to_dict()
                    window_start = data.get('window_start')
                    
                    if window_start:
                        window_start_dt = window_start if isinstance(window_start, datetime) else window_start.to_datetime()
                        # Check if window expired
                        if (now - window_start_dt).total_seconds() > window_seconds:
                            # Reset for new window
                            new_count = 1
                            new_window_start = now
                        else:
                            # Increment existing
                            new_count = data.get('count', 0) + 1
                            new_window_start = window_start_dt
                    else:
                        new_count = 1
                        new_window_start = now
                else:
                    # New document
                    new_count = 1
                    new_window_start = now
                
                expires_at = new_window_start + timedelta(seconds=window_seconds)
                reset_time = int(expires_at.timestamp())
                
                transaction.set(ref, {
                    'count': new_count,
                    'window_start': new_window_start,
                    'expires_at': expires_at,
                    'max_requests': max_requests
                })
                
                return {
                    'count': new_count,
                    'remaining': max(0, max_requests - new_count),
                    'reset_time': reset_time,
                    'limited': new_count > max_requests
                }
            
            transaction = self.db.transaction()
            return increment_in_transaction(transaction, doc_ref)
            
        except Exception as e:
            logger.error(f"Error incrementing rate limit for key {key}: {e}")
            return {
                'count': 0,
                'remaining': max_requests,
                'reset_time': int((datetime.now() + timedelta(seconds=window_seconds)).timestamp()),
                'limited': False
            }
    
    def rate_limit_check(self, key: str) -> Dict[str, Any]:
        """
        Check current rate limit status without incrementing.
        
        Args:
            key: Rate limit key
            
        Returns:
            Dictionary with current status
        """
        try:
            doc = self.db.collection('rate_limits').document(key).get()
            if not doc.exists:
                return {
                    'count': 0,
                    'remaining': 100,  # Default max
                    'reset_time': 0,
                    'limited': False
                }
            
            data = doc.to_dict()
            count = data.get('count', 0)
            max_requests = data.get('max_requests', 100)
            expires_at = data.get('expires_at')
            
            # Check if expired
            if expires_at and datetime.now() > expires_at:
                return {
                    'count': 0,
                    'remaining': max_requests,
                    'reset_time': 0,
                    'limited': False
                }
            
            reset_time = int(expires_at.timestamp()) if expires_at else 0
            
            return {
                'count': count,
                'remaining': max(0, max_requests - count),
                'reset_time': reset_time,
                'limited': count > max_requests
            }
            
        except Exception as e:
            logger.error(f"Error checking rate limit for key {key}: {e}")
            return {
                'count': 0,
                'remaining': 100,
                'reset_time': 0,
                'limited': False
            }
    
    # ===== UTILITY METHODS =====
    
    def delete(self, key: str) -> bool:
        """
        Delete a cache document (Redis DEL equivalent).
        
        Args:
            key: Cache key
            
        Returns:
            True if successful
        """
        try:
            self.db.collection('cache').document(key).delete()
            return True
            
        except Exception as e:
            logger.error(f"Error deleting cache document {key}: {e}")
            return False
    
    def clear_expired(self) -> int:
        """
        Clean up expired documents.
        
        Returns:
            Number of documents cleaned
        """
        try:
            now = datetime.now()
            expired_docs = self.db.collection('cache').where(
                'expiresAt', '<', now.timestamp()
            ).stream()
            
            batch = self.db.batch()
            count = 0
            for doc in expired_docs:
                batch.delete(doc.reference)
                count += 1
            
            batch.commit()
            logger.info(f"Cleaned up {count} expired cache documents")
            return count
            
        except Exception as e:
            logger.error(f"Error cleaning expired documents: {e}")
            return 0


# Global cache manager instance
_cache_manager: Optional[FirestoreCacheManager] = None


def get_cache_manager() -> FirestoreCacheManager:
    """Get the global cache manager instance."""
    global _cache_manager
    if _cache_manager is None:
        _cache_manager = FirestoreCacheManager()
    return _cache_manager
