from __future__ import annotations

from unittest.mock import AsyncMock

import pytest

from app.core.ai_error_handling import AIError, AIErrorType
from app.core.enhanced_ai_error_handling import (
    AIOperationContext,
    AIOperationResult,
    AIServiceType,
    EnhancedAIErrorHandler,
    FallbackStrategy,
    create_detailed_error_message,
    execute_with_enhanced_handling,
)


def _fast_handler() -> EnhancedAIErrorHandler:
    handler = EnhancedAIErrorHandler()
    for op_handler in handler.operation_handlers.values():
        op_handler.retry_config.max_attempts = 1
        op_handler.retry_config.base_delay = 0.0
        op_handler.retry_config.max_delay = 0.0
    return handler


@pytest.mark.asyncio
async def test_execute_operation_none_result_becomes_aierror() -> None:
    handler = _fast_handler()
    ctx = AIOperationContext("none-op", AIServiceType.GEMINI_ANALYSIS, "u1")

    async def op_none():
        return None

    result = await handler.execute_ai_operation(op_none, ctx)
    assert result.success is False
    assert result.error is not None
    assert result.error.error_type == AIErrorType.UNKNOWN


@pytest.mark.asyncio
async def test_execute_operation_unexpected_exception_wrapped_unknown() -> None:
    handler = _fast_handler()
    ctx = AIOperationContext("boom-op", AIServiceType.GEMINI_ANALYSIS, "u1")

    async def op_boom():
        raise RuntimeError("boom")

    result = await handler.execute_ai_operation(op_boom, ctx)
    assert result.success is False
    assert result.error is not None
    assert result.error.error_type == AIErrorType.UNKNOWN


@pytest.mark.asyncio
async def test_fallback_cached_result_path() -> None:
    handler = _fast_handler()
    ctx = AIOperationContext("cached-op", AIServiceType.GEMINI_ANALYSIS, "u1")

    async def failing():
        raise AIError("x", AIErrorType.TIMEOUT)

    handler._get_cached_result = AsyncMock(return_value={"cached": True})
    strategy = FallbackStrategy(enabled=True, use_cached_result=True)

    result = await handler.execute_ai_operation(failing, ctx, strategy)
    assert result.success is True
    assert result.fallback_used is True
    assert result.data == {"cached": True}


@pytest.mark.asyncio
async def test_fallback_all_attempts_fail_without_error() -> None:
    handler = _fast_handler()
    ctx = AIOperationContext("fail-op", AIServiceType.GEMINI_ANALYSIS, "u1")

    async def failing():
        raise AIError("x", AIErrorType.TIMEOUT)

    # enabled fallback but no function/data/cache/degraded -> all fallback attempts fail
    strategy = FallbackStrategy(enabled=True, use_cached_result=False, degraded_mode=False)
    result = await handler.execute_ai_operation(failing, ctx, strategy)

    assert result.success is False
    assert result.error is None
    assert result.fallback_used is True


@pytest.mark.asyncio
async def test_fallback_function_raises_and_preserves_original_error() -> None:
    handler = _fast_handler()
    ctx = AIOperationContext("fallback-crash-op", AIServiceType.GEMINI_ANALYSIS, "u1")

    async def failing():
        raise AIError("primary", AIErrorType.RATE_LIMIT)

    async def bad_fallback(*_args, **_kwargs):
        raise RuntimeError("fallback boom")

    strategy = FallbackStrategy(enabled=True, fallback_function=bad_fallback)
    result = await handler.execute_ai_operation(failing, ctx, strategy)

    assert result.success is False
    assert result.error is not None
    assert result.error.error_type == AIErrorType.UNKNOWN


@pytest.mark.asyncio
async def test_get_cached_result_returns_none() -> None:
    handler = EnhancedAIErrorHandler()
    ctx = AIOperationContext("cache-check", AIServiceType.GEMINI_ANALYSIS, "u1")
    assert await handler._get_cached_result(ctx) is None


def test_get_degraded_result_semantic_and_default() -> None:
    handler = EnhancedAIErrorHandler()

    semantic = handler._get_degraded_result(
        AIOperationContext("sem", AIServiceType.SEMANTIC_ANALYSIS, "u1")
    )
    assert semantic["degraded_mode"] is True
    assert "similarity_score" in semantic

    default = handler._get_degraded_result(
        AIOperationContext("other", AIServiceType.GENKIT_FLOW, "u1")
    )
    assert default["degraded_mode"] is True
    assert "message" in default


def test_record_stats_without_context_and_trim_to_100() -> None:
    handler = EnhancedAIErrorHandler()

    handler._record_operation_stats(AIOperationResult(success=True, context=None))
    assert handler.operation_stats == {}

    ctx = AIOperationContext("trim-op", AIServiceType.GEMINI_ANALYSIS, "u1")
    for _ in range(105):
        handler._record_operation_stats(
            AIOperationResult(success=True, context=ctx, execution_time=0.01)
        )

    assert len(handler.operation_stats["trim-op"]) == 100


def test_get_operation_health_no_data() -> None:
    handler = EnhancedAIErrorHandler()
    assert handler.get_operation_health("missing")["status"] == "no_data"


@pytest.mark.asyncio
async def test_ai_operation_context_manager_exception_path() -> None:
    handler = EnhancedAIErrorHandler()
    with pytest.raises(ValueError):
        async with handler.ai_operation_context("ctx-op", AIServiceType.GEMINI_ANALYSIS, "u1"):
            raise ValueError("inside")


@pytest.mark.asyncio
async def test_execute_with_enhanced_handling_convenience() -> None:
    async def op_ok():
        return {"ok": True}

    result = await execute_with_enhanced_handling(
        op_ok,
        operation_name="conv-op",
        service_type=AIServiceType.TEXT_PROCESSING,
        user_id="u1",
    )
    assert result.success is True
    assert result.data == {"ok": True}


def test_create_detailed_error_message_all_remaining_branches() -> None:
    ctx = AIOperationContext("op", AIServiceType.GEMINI_ANALYSIS, "u1")

    no_error = create_detailed_error_message(
        AIOperationResult(success=False, error=None, context=ctx)
    )
    assert "Unknown error" in no_error

    quota = create_detailed_error_message(
        AIOperationResult(
            success=False, error=AIError("q", AIErrorType.QUOTA_EXCEEDED), context=ctx
        )
    )
    invalid = create_detailed_error_message(
        AIOperationResult(
            success=False, error=AIError("i", AIErrorType.INVALID_REQUEST), context=ctx
        )
    )
    unavailable = create_detailed_error_message(
        AIOperationResult(
            success=False, error=AIError("s", AIErrorType.SERVICE_UNAVAILABLE), context=ctx
        )
    )
    auth = create_detailed_error_message(
        AIOperationResult(
            success=False, error=AIError("a", AIErrorType.AUTHENTICATION), context=ctx
        )
    )
    other = create_detailed_error_message(
        AIOperationResult(success=False, error=AIError("o", AIErrorType.UNKNOWN), context=ctx)
    )

    assert "quota exceeded" in quota.lower()
    assert "invalid input" in invalid.lower()
    assert "temporarily unavailable" in unavailable.lower()
    assert "authentication error" in auth.lower()
    assert "unexpected error" in other.lower()
