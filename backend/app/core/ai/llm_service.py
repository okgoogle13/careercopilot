# backend/app/core/ai/llm_service.py

import hashlib
import json
from typing import Any, Dict

from app.core.loguru_config import get_logger
from app.core.ai_config import get_ai_config
from app.core.genkit_init import is_genkit_enabled
from app.core.database import SessionLocal
from app.genkit_flows.llm_service import generate_llm_response
from app.schemas.ai import LlmRequest, LlmResponse
from app.services.cache_store import SQLAlchemyCacheStore

logger = get_logger(__name__)

def get_cache_store() -> SQLAlchemyCacheStore:
    """Helper to get a cache store with a fresh DB session."""
    return SQLAlchemyCacheStore(SessionLocal())

def _build_cache_key(request: LlmRequest) -> str:
    request_payload = request.model_dump(mode="json", exclude_none=True)
    param_str = json.dumps(request_payload, sort_keys=True)
    key_material = param_str.encode("utf-8")
    return f"llm:{hashlib.sha256(key_material).hexdigest()[:16]}"


async def get_llm_response(request: LlmRequest) -> LlmResponse:
    """
    Gets a response from an LLM using Genkit, with SQLAlchemy-backed cache.

    Args:
        request: Structured request payload for the LLM call

    Returns:
        Structured response payload
    """
    cache_key = _build_cache_key(request)
    operation_type = request.service_name or request.task_type or "llm_generic"
    user_id = request.user_id

    # 1. Check SQL cache first
    cache = get_cache_store()
    try:
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache HIT for {cache_key}")
            cached_response = LlmResponse.model_validate(cached_result)
            return cached_response.model_copy(update={"cached": True})
    except Exception as e:
        logger.error(f"Cache read error: {e}")

    # 2. Check if Genkit is enabled
    if not is_genkit_enabled():
        logger.warning("Genkit flows are disabled, using mock response")
        return LlmResponse(
            content=f"[MOCK] Genkit disabled. Prompt: {request.prompt[:30]}",
            model_used="mock",
            cached=False,
            metadata={"operation_type": operation_type, "genkit_disabled": True},
        )

    # 3. Call Genkit model via flow
    logger.info(f"Cache MISS - calling Genkit for {operation_type}")

    try:
        response = await generate_llm_response(request)

        # 4. Cache the result
        try:
            cache_ttl = 3600
            svc_config = get_ai_config().get_service_config(operation_type)
            if svc_config:
                cache_ttl = svc_config.cache_ttl_seconds

            cache.set(
                key=cache_key,
                value=response.model_dump(mode="json"),
                operation_type=operation_type,
                ttl_seconds=cache_ttl,
                user_id=user_id,
            )
            logger.info(f"Response cached for {cache_key}")
        except Exception as cache_err:
            logger.error(f"Cache write error: {cache_err}")

        return response

    except Exception as ai_err:
        logger.error(f"AI Generation failed: {ai_err}")
        return LlmResponse(
            content="Error generating response",
            model_used=request.model_name,
            cached=False,
            error=str(ai_err),
        )

def clear_cache_pattern(pattern: str = "llm:") -> int:
    """Clear cached LLM responses matching a pattern."""
    return get_cache_store().clear_pattern(pattern)

def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics."""
    # Placeholder as SQLAlchemyCacheStore doesn't have get_stats yet
    return {"status": "ok", "backend": "sqlalchemy"}
