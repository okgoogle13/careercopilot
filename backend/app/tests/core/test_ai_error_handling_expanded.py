import pytest

from app.core.ai_error_handling import (
    AIError,
    AIErrorType,
    AIOperationHandler,
    RetryConfig,
    safe_ai_call,
    validate_ai_response,
    with_ai_error_handling,
)


def test_ai_error_str():
    error = AIError("test message", AIErrorType.TIMEOUT)
    assert str(error) == "timeout: test message"


def test_classify_error_detailed():
    handler = AIOperationHandler()
    assert handler.classify_error(Exception("quota exceeded")) == AIErrorType.QUOTA_EXCEEDED
    assert handler.classify_error(Exception("quota")) == AIErrorType.RATE_LIMIT
    assert (
        handler.classify_error(Exception("service unavailable")) == AIErrorType.SERVICE_UNAVAILABLE
    )
    assert handler.classify_error(Exception("503 error")) == AIErrorType.SERVICE_UNAVAILABLE
    assert handler.classify_error(Exception("unknown error")) == AIErrorType.UNKNOWN


def test_calculate_delay_with_jitter():
    config = RetryConfig(base_delay=1.0, jitter=True)
    handler = AIOperationHandler(config)
    delay = handler.calculate_delay(1, AIErrorType.TIMEOUT)
    assert 0.5 <= delay <= 1.0


@pytest.mark.asyncio
async def test_execute_with_retry_none_result():
    handler = AIOperationHandler(RetryConfig(max_attempts=1))

    async def return_none():
        return None

    with pytest.raises(AIError) as exc_info:
        await handler.execute_with_retry(return_none)
    assert exc_info.value.error_type == AIErrorType.UNKNOWN
    assert "returned None" in str(exc_info.value)


@pytest.mark.asyncio
async def test_execute_with_retry_sync_callable_in_async_context():
    # Covers line 147 (else block in async execute_with_retry)
    handler = AIOperationHandler(RetryConfig(max_attempts=1))

    def sync_op():
        return "sync ok"

    result = await handler.execute_with_retry(sync_op)
    assert result == "sync ok"


def test_execute_with_retry_sync_success():
    handler = AIOperationHandler()

    def sync_op():
        return "sync success"

    result = handler.execute_with_retry_sync(sync_op)
    assert result == "sync success"


def test_execute_with_retry_sync_non_retryable_error():
    # Covers lines 222-224
    handler = AIOperationHandler(RetryConfig(max_attempts=3))

    def fail_auth():
        raise Exception("authentication failed")

    with pytest.raises(AIError) as exc_info:
        handler.execute_with_retry_sync(fail_auth)
    assert exc_info.value.error_type == AIErrorType.AUTHENTICATION


def test_execute_with_retry_sync_failure():
    config = RetryConfig(max_attempts=2, base_delay=0.01)
    handler = AIOperationHandler(config)

    call_count = 0

    def failing_sync_op():
        nonlocal call_count
        call_count += 1
        raise Exception("sync fail")

    with pytest.raises(AIError) as exc_info:
        handler.execute_with_retry_sync(failing_sync_op)
    assert call_count == 2
    assert "failed after 2 attempts" in str(exc_info.value)


def test_execute_with_retry_sync_none_result():
    handler = AIOperationHandler(RetryConfig(max_attempts=1))

    def return_none():
        return None

    with pytest.raises(AIError) as exc_info:
        handler.execute_with_retry_sync(return_none)
    assert "returned None" in str(exc_info.value)


def test_decorator_sync():
    @with_ai_error_handling(RetryConfig(max_attempts=1))
    def sync_decorated():
        return "decorated success"

    assert sync_decorated() == "decorated success"


@pytest.mark.asyncio
async def test_safe_ai_call_success():
    async def op():
        return "safe"

    result = await safe_ai_call(op)
    assert result == "safe"


def test_validate_ai_response_empty_string():
    with pytest.raises(AIError, match="AI response is empty"):
        validate_ai_response(" ", str)


@pytest.mark.asyncio
async def test_execute_with_retry_last_attempt_exception_coverage():
    # To cover line 183-190 where last_error is used after loop
    config = RetryConfig(max_attempts=2, base_delay=0.01)
    handler = AIOperationHandler(config)

    async def fail():
        raise Exception("failed")

    with pytest.raises(AIError) as exc_info:
        await handler.execute_with_retry(fail)
    assert (
        exc_info.value.error_type == AIErrorType.UNKNOWN
    )  # Exception("failed") classified as UNKNOWN
