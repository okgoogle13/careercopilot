# backend/app/ai/llm_service.py

import redis
import hashlib
import json
import os
from typing import Dict
from app.core.loguru_config import get_logger

logger = get_logger(__name__)

# Redis client configuration - use environment variables for production
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = None

try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    # Test connection
    redis_client.ping()
    logger.info("Redis cache initialized successfully", redis_url=REDIS_URL)
except (redis.ConnectionError, redis.TimeoutError) as e:
    logger.warning("Redis cache unavailable, falling back to no caching", error=str(e))
    redis_client = None


def get_llm_response(prompt: str, model_params: dict) -> dict:
    """
    Gets a response from an LLM, using a cache to avoid redundant calls.

    Args:
        prompt: The input prompt for the LLM
        model_params: Dictionary containing model configuration

    Returns:
        Dictionary containing the LLM response
    """
    # Create a stable cache key
    param_str = json.dumps(model_params, sort_keys=True)
    key_material = (prompt + param_str).encode("utf-8")
    cache_key = f"llm:{hashlib.sha256(key_material).hexdigest()[:16]}"

    # 1. Check cache first (if Redis is available)
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                logger.info("Cache HIT", cache_key=cache_key, prompt_length=len(prompt))
                return json.loads(cached_result)
        except Exception as e:
            logger.error("Cache read error", error=str(e))

    # 2. If miss, call the actual LLM API and cache the result
    logger.info(
        "Cache MISS - calling LLM API",
        cache_key=cache_key,
        model=model_params.get("model"),
    )

    # This would be replaced with actual Genkit AI API call
    # For now, using placeholder response
    result = {
        "response": f"LLM response for prompt: {prompt[:50]}...",
        "model": model_params.get("model", "unknown"),
        "tokens_used": len(prompt.split()) * 1.3,  # Rough estimate
        "cached": False,
    }

    # Cache the result (if Redis is available)
    if redis_client:
        try:
            cache_ttl = 3600  # Cache for 1 hour
            redis_client.set(cache_key, json.dumps(result), ex=cache_ttl)
            logger.info("Response cached", cache_key=cache_key, ttl=cache_ttl)
        except Exception as e:
            logger.error("Cache write error", error=str(e))

    return result


def clear_cache_pattern(pattern: str = "llm:*") -> int:
    """
    Clear cached LLM responses matching a pattern.

    Args:
        pattern: Redis key pattern to match (default: all LLM cache)

    Returns:
        Number of keys deleted
    """
    if not redis_client:
        logger.warning("Redis unavailable - cannot clear cache")
        return 0

    try:
        keys = redis_client.keys(pattern)
        if keys:
            deleted = redis_client.delete(*keys)
            logger.info("Cache cleared", pattern=pattern, keys_deleted=deleted)
            return deleted
        return 0
    except Exception as e:
        logger.error("Cache clear error", error=str(e), pattern=pattern)
        return 0


def get_cache_stats() -> Dict[str, int]:
    """
    Get cache statistics.

    Returns:
        Dictionary with cache statistics
    """
    if not redis_client:
        return {"status": "unavailable", "total_keys": 0, "llm_keys": 0}

    try:
        info = redis_client.info("keyspace")
        llm_keys = len(redis_client.keys("llm:*"))

        return {
            "status": "connected",
            "total_keys": info.get("db0", {}).get("keys", 0),
            "llm_keys": llm_keys,
            "memory_usage": redis_client.info("memory")["used_memory_human"],
        }
    except Exception as e:
        logger.error("Cache stats error", error=str(e))
        return {"status": "error", "error": str(e)}
