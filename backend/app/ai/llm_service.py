# backend/app/ai/llm_service.py

import hashlib
import json
from typing import Dict

from app.core.loguru_config import get_logger
from app.core.ai_config import get_ai_config
from app.core.firestore_cache import get_firestore_cache

logger = get_logger(__name__)

# Initialize Firestore cache
cache = get_firestore_cache()


def get_llm_response(prompt: str, model_params: dict) -> dict:
    """
    Gets a response from an LLM, using Firestore cache to avoid redundant calls.

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

    # 1. Check Firestore cache first
    try:
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info("Cache HIT", cache_key=cache_key, prompt_length=len(prompt))
            return cached_result
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

    # Cache the result in Firestore
    try:
        # Determine TTL from AI service config when available
        cache_ttl = 3600
        try:
            service_name = (
                model_params.get("service_name")
                or model_params.get("task_type")
            )
            if service_name:
                svc = get_ai_config().get_service_config(service_name)
                if svc and getattr(svc, "cache_enabled", True):
                    cache_ttl = int(getattr(svc, "cache_ttl_seconds", cache_ttl))
        except Exception as e:
            logger.warning("Failed to resolve per-flow cache TTL", error=str(e))
        cache.set(cache_key, result, cache_ttl)
        logger.info("Response cached", cache_key=cache_key, ttl=cache_ttl)
    except Exception as e:
        logger.error("Cache write error", error=str(e))

    return result


def clear_cache_pattern(pattern: str = "llm:") -> int:
    """
    Clear cached LLM responses matching a pattern.

    Args:
        pattern: Key pattern prefix to match (default: all LLM cache with "llm:" prefix)

    Returns:
        Number of keys deleted
    """
    try:
        deleted = cache.clear_pattern(pattern)
        if deleted > 0:
            logger.info("Cache cleared", pattern=pattern, keys_deleted=deleted)
        return deleted
    except Exception as e:
        logger.error("Cache clear error", error=str(e), pattern=pattern)
        return 0


def get_cache_stats() -> Dict[str, int]:
    """
    Get cache statistics from Firestore.

    Returns:
        Dictionary with cache statistics
    """
    try:
        return cache.get_stats()
    except Exception as e:
        logger.error("Cache stats error", error=str(e))
        return {"status": "error", "error": str(e)}
