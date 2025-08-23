"""
Personal Cache Implementation
Simple caching for single-user CareerCopilot system
"""

import json
import asyncio
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from pathlib import Path

class PersonalCache:
    """Simple file-based cache for personal use"""
    
    def __init__(self, cache_dir: str = "data/cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.default_ttl = timedelta(hours=24)
        
    def _get_cache_file(self, key: str) -> Path:
        """Get cache file path for key"""
        # Create safe filename from key
        safe_key = hashlib.md5(key.encode()).hexdigest()
        return self.cache_dir / f"{safe_key}.json"
    
    async def get(self, key: str) -> Optional[Dict[str, Any]]:
        """Get value from cache"""
        
        cache_file = self._get_cache_file(key)
        
        if not cache_file.exists():
            return None
        
        try:
            with open(cache_file, 'r') as f:
                cache_data = json.load(f)
            
            # Check if expired
            cached_time = datetime.fromisoformat(cache_data['timestamp'])
            if datetime.now() - cached_time > self.default_ttl:
                # Remove expired cache
                cache_file.unlink()
                return None
            
            return cache_data['data']
            
        except (json.JSONDecodeError, KeyError, ValueError):
            # Invalid cache file, remove it
            cache_file.unlink()
            return None
    
    async def set(self, key: str, value: Dict[str, Any], ttl: Optional[timedelta] = None) -> None:
        """Set value in cache"""
        
        cache_file = self._get_cache_file(key)
        
        cache_data = {
            'key': key,
            'data': value,
            'timestamp': datetime.now().isoformat(),
            'ttl_hours': (ttl or self.default_ttl).total_seconds() / 3600
        }
        
        with open(cache_file, 'w') as f:
            json.dump(cache_data, f, indent=2, default=str)
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        
        cache_file = self._get_cache_file(key)
        
        if cache_file.exists():
            cache_file.unlink()
            return True
        
        return False
    
    async def clear(self) -> int:
        """Clear all cache entries"""
        
        count = 0
        for cache_file in self.cache_dir.glob("*.json"):
            cache_file.unlink()
            count += 1
        
        return count
    
    async def cleanup_expired(self) -> int:
        """Remove expired cache entries"""
        
        count = 0
        now = datetime.now()
        
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                with open(cache_file, 'r') as f:
                    cache_data = json.load(f)
                
                cached_time = datetime.fromisoformat(cache_data['timestamp'])
                ttl = timedelta(hours=cache_data.get('ttl_hours', 24))
                
                if now - cached_time > ttl:
                    cache_file.unlink()
                    count += 1
                    
            except (json.JSONDecodeError, KeyError, ValueError):
                # Invalid cache file, remove it
                cache_file.unlink()
                count += 1
        
        return count
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        
        cache_files = list(self.cache_dir.glob("*.json"))
        total_size = sum(f.stat().st_size for f in cache_files)
        
        return {
            'total_entries': len(cache_files),
            'total_size_bytes': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'cache_directory': str(self.cache_dir)
        }