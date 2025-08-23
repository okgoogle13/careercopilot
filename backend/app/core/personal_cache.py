"""
Personal Cache System for CareerCopilot
File-based caching with TTL support for personal automation
"""

import json
import hashlib
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional, Union

logger = logging.getLogger(__name__)

class PersonalCache:
    """File-based cache with TTL support for personal automation"""
    
    def __init__(self, cache_dir: str = "data/cache"):
        self.cache_dir = Path(cache_dir)
        self.default_ttl = timedelta(hours=24)
        
        # Create cache directory if it doesn't exist
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # Ensure subdirectories exist
        (self.cache_dir / "profiles").mkdir(exist_ok=True)
        (self.cache_dir / "research").mkdir(exist_ok=True)
        (self.cache_dir / "jobs").mkdir(exist_ok=True)
        (self.cache_dir / "ai_responses").mkdir(exist_ok=True)
        
        logger.info(f"PersonalCache initialized with directory: {self.cache_dir}")
    
    def _generate_cache_key(self, key: str) -> str:
        """Generate safe filename from cache key"""
        # Create hash of key for safe filename
        key_hash = hashlib.md5(key.encode()).hexdigest()
        return f"{key_hash}.json"
    
    def _get_cache_file_path(self, key: str, category: str = "general") -> Path:
        """Get full path for cache file"""
        filename = self._generate_cache_key(key)
        return self.cache_dir / category / filename
    
    async def get(self, key: str, category: str = "general") -> Optional[Dict[str, Any]]:
        """Retrieve cached value with TTL check"""
        try:
            cache_file = self._get_cache_file_path(key, category)
            
            if not cache_file.exists():
                logger.debug(f"Cache MISS: {key} (file not found)")
                return None
            
            # Read cache file
            with open(cache_file, 'r') as f:
                cache_data = json.load(f)
            
            # Check TTL
            cached_time = datetime.fromisoformat(cache_data.get("timestamp", ""))
            expires_at = datetime.fromisoformat(cache_data.get("expires_at", ""))
            
            if datetime.now() > expires_at:
                logger.debug(f"Cache EXPIRED: {key}")
                self._delete_cache_file_sync(cache_file)
                return None
            
            logger.debug(f"Cache HIT: {key}")
            return cache_data.get("value")
            
        except Exception as e:
            logger.error(f"Cache GET error for {key}: {e}")
            return None
    
    async def set(self, key: str, value: Dict[str, Any], 
                 ttl: Optional[timedelta] = None, category: str = "general") -> bool:
        """Store value in cache with TTL"""
        try:
            if ttl is None:
                ttl = self.default_ttl
            
            cache_file = self._get_cache_file_path(key, category)
            
            now = datetime.now()
            expires_at = now + ttl
            
            cache_data = {
                "key": key,
                "value": value,
                "timestamp": now.isoformat(),
                "expires_at": expires_at.isoformat(),
                "ttl_hours": ttl.total_seconds() / 3600,
                "category": category
            }
            
            # Ensure parent directory exists
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Write cache file
            with open(cache_file, 'w') as f:
                json.dump(cache_data, f, indent=2, default=str)
            
            logger.debug(f"Cache SET: {key} (TTL: {ttl})")
            return True
            
        except Exception as e:
            logger.error(f"Cache SET error for {key}: {e}")
            return False
    
    async def delete(self, key: str, category: str = "general") -> bool:
        """Delete cached value"""
        try:
            cache_file = self._get_cache_file_path(key, category)
            return self._delete_cache_file_sync(cache_file)
        except Exception as e:
            logger.error(f"Cache DELETE error for {key}: {e}")
            return False
    
    def _delete_cache_file_sync(self, cache_file: Path) -> bool:
        """Delete cache file if it exists (synchronous)"""
        try:
            if cache_file.exists():
                os.remove(cache_file)
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting cache file {cache_file}: {e}")
            return False
    
    async def clear_expired(self, category: Optional[str] = None) -> int:
        """Remove all expired cache entries"""
        try:
            cleared_count = 0
            
            if category:
                # Clear specific category
                category_dir = self.cache_dir / category
                if category_dir.exists():
                    cleared_count += await self._clear_expired_in_directory(category_dir)
            else:
                # Clear all categories
                for subdir in self.cache_dir.iterdir():
                    if subdir.is_dir():
                        cleared_count += await self._clear_expired_in_directory(subdir)
            
            logger.info(f"Cleared {cleared_count} expired cache entries")
            return cleared_count
            
        except Exception as e:
            logger.error(f"Error clearing expired cache: {e}")
            return 0
    
    async def _clear_expired_in_directory(self, directory: Path) -> int:
        """Clear expired files in a specific directory"""
        cleared_count = 0
        now = datetime.now()
        
        for cache_file in directory.glob("*.json"):
            try:
                with open(cache_file, 'r') as f:
                    cache_data = json.load(f)
                
                expires_at = datetime.fromisoformat(cache_data.get("expires_at", ""))
                
                if now > expires_at:
                    os.remove(cache_file)
                    cleared_count += 1
                    
            except Exception as e:
                logger.error(f"Error checking cache file {cache_file}: {e}")
        
        return cleared_count
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            stats = {
                "total_files": 0,
                "categories": {},
                "total_size_mb": 0
            }
            
            for category_dir in self.cache_dir.iterdir():
                if category_dir.is_dir():
                    category_name = category_dir.name
                    files = list(category_dir.glob("*.json"))
                    file_count = len(files)
                    
                    # Calculate size
                    total_size = sum(f.stat().st_size for f in files if f.exists())
                    
                    stats["categories"][category_name] = {
                        "files": file_count,
                        "size_mb": round(total_size / (1024 * 1024), 2)
                    }
                    
                    stats["total_files"] += file_count
                    stats["total_size_mb"] += stats["categories"][category_name]["size_mb"]
            
            stats["total_size_mb"] = round(stats["total_size_mb"], 2)
            return stats
            
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {}
    
    # Convenience methods for specific cache categories
    
    async def cache_user_profile(self, user_id: str, profile_data: Dict[str, Any], 
                               ttl: timedelta = timedelta(days=7)) -> bool:
        """Cache user profile with 7-day TTL"""
        return await self.set(f"profile_{user_id}", profile_data, ttl, "profiles")
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get cached user profile"""
        return await self.get(f"profile_{user_id}", "profiles")
    
    async def cache_company_research(self, company_name: str, job_url: str, 
                                   research_data: Dict[str, Any],
                                   ttl: timedelta = timedelta(days=7)) -> bool:
        """Cache company research with 7-day TTL"""
        # Create composite key from company and job URL hash
        url_hash = hashlib.md5(job_url.encode()).hexdigest()[:8]
        cache_key = f"company_{company_name}_{url_hash}"
        return await self.set(cache_key, research_data, ttl, "research")
    
    async def get_company_research(self, company_name: str, job_url: str) -> Optional[Dict[str, Any]]:
        """Get cached company research"""
        url_hash = hashlib.md5(job_url.encode()).hexdigest()[:8]
        cache_key = f"company_{company_name}_{url_hash}"
        return await self.get(cache_key, "research")
    
    async def cache_ai_response(self, prompt_hash: str, response_data: Dict[str, Any],
                              ttl: timedelta = timedelta(hours=72)) -> bool:
        """Cache AI response with 72-hour TTL"""
        return await self.set(f"ai_{prompt_hash}", response_data, ttl, "ai_responses")
    
    async def get_ai_response(self, prompt_hash: str) -> Optional[Dict[str, Any]]:
        """Get cached AI response"""
        return await self.get(f"ai_{prompt_hash}", "ai_responses")
    
    async def cache_job_opportunity(self, job_id: str, job_data: Dict[str, Any],
                                  ttl: timedelta = timedelta(days=3)) -> bool:
        """Cache job opportunity with 3-day TTL"""
        return await self.set(f"job_{job_id}", job_data, ttl, "jobs")
    
    async def get_job_opportunity(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get cached job opportunity"""
        return await self.get(f"job_{job_id}", "jobs")

# Global instance
_personal_cache: Optional[PersonalCache] = None

def get_personal_cache(cache_dir: str = "data/cache") -> PersonalCache:
    """Get or create global PersonalCache instance"""
    global _personal_cache
    if _personal_cache is None:
        _personal_cache = PersonalCache(cache_dir)
    return _personal_cache