import pytest
from app.core.ai_error_handling import (
    AIError,
    AIErrorType,
    AIOperationHandler,
    RetryConfig,
    create_user_friendly_error,
    validate_ai_response,
    with_ai_error_handling,
)


class TestAIOperationHandler:
    """Test suite for AI operation error handling."""

    def test_classify_error_rate_limit(self):
        """Test classification of rate limit errors."""
        handler = AIOperationHandler()

        rate_limit_errors = [
            Exception("Rate limit exceeded"),
            Exception("Quota exceeded for requests"),
            Exception("Too many requests"),
        ]

        for error in rate_limit_errors:
            error_type = handler.classify_error(error)
            assert error_type == AIErrorType.RATE_LIMIT

    def test_classify_error_timeout(self):
        """Test classification of timeout errors."""
        handler = AIOperationHandler()

        timeout_errors = [
            Exception("Request timeout"),
            Exception("Deadline exceeded"),
            Exception("Connection timeout"),
        ]

        for error in timeout_errors:
            error_type = handler.classify_error(error)
            assert error_type == AIErrorType.TIMEOUT

    def test_classify_error_invalid_request(self):
        """Test classification of invalid request errors."""
        handler = AIOperationHandler()

        invalid_errors = [
            Exception("Invalid request format"),
            Exception("Bad request: missing parameter"),
            Exception("Invalid API key"),
        ]

        for error in invalid_errors:
            error_type = handler.classify_error(error)
            assert error_type == AIErrorType.INVALID_REQUEST

    def test_should_retry_logic(self):
        """Test retry logic for different error types."""
        handler = AIOperationHandler()

        # Should retry
        assert handler.should_retry(AIErrorType.RATE_LIMIT)
        assert handler.should_retry(AIErrorType.TIMEOUT)
        assert handler.should_retry(AIErrorType.SERVICE_UNAVAILABLE)
        assert handler.should_retry(AIErrorType.UNKNOWN)

        # Should not retry
        assert handler.should_retry(AIErrorType.INVALID_REQUEST) is False
        assert handler.should_retry(AIErrorType.AUTHENTICATION) is False
        assert handler.should_retry(AIErrorType.QUOTA_EXCEEDED) is False

    def test_calculate_delay(self):
        """Test delay calculation for retries."""
        config = RetryConfig(
            base_delay=1.0, exponential_base=2.0, max_delay=10.0, jitter=False
        )
        handler = AIOperationHandler(config)

        # Test exponential backoff
        delay1 = handler.calculate_delay(1, AIErrorType.TIMEOUT)
        delay2 = handler.calculate_delay(2, AIErrorType.TIMEOUT)
        delay3 = handler.calculate_delay(3, AIErrorType.TIMEOUT)

        assert delay1 == 1.0
        assert delay2 == 2.0
        assert delay3 == 4.0

        # Test max delay cap
        delay_large = handler.calculate_delay(10, AIErrorType.TIMEOUT)
        assert delay_large == config.max_delay

        # Test rate limit gets longer delays
        delay_rate_limit = handler.calculate_delay(1, AIErrorType.RATE_LIMIT)
        assert delay_rate_limit > delay1

    @pytest.mark.asyncio
    async def test_execute_with_retry_success(self):
        """Test successful operation without retries."""
        handler = AIOperationHandler()

        async def successful_operation():
            return "success"

        result = await handler.execute_with_retry(successful_operation)
        assert result == "success"

    @pytest.mark.asyncio
    async def test_execute_with_retry_eventual_success(self):
        """Test operation that succeeds after one failure."""
        config = RetryConfig(max_attempts=3, base_delay=0.1)
        handler = AIOperationHandler(config)

        call_count = 0

        async def flaky_operation():
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Service temporarily unavailable")
            return "success"

        result = await handler.execute_with_retry(flaky_operation)
        assert result == "success"
        assert call_count == 2

    @pytest.mark.asyncio
    async def test_execute_with_retry_max_attempts_exceeded(self):
        """Test operation that fails all retry attempts."""
        config = RetryConfig(max_attempts=2, base_delay=0.1)
        handler = AIOperationHandler(config)

        async def always_failing_operation():
            raise Exception("Service unavailable")

        with pytest.raises(AIError) as exc_info:
            await handler.execute_with_retry(always_failing_operation)

        assert "failed after 2 attempts" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_execute_with_retry_non_retryable_error(self):
        """Test that non-retryable errors are not retried."""
        handler = AIOperationHandler()

        call_count = 0

        async def operation_with_auth_error():
            nonlocal call_count
            call_count += 1
            raise Exception("Authentication failed")

        with pytest.raises(AIError) as exc_info:
            await handler.execute_with_retry(operation_with_auth_error)

        # Should only be called once (no retries for auth errors)
        assert call_count == 1
        assert exc_info.value.error_type == AIErrorType.AUTHENTICATION


class TestValidateAIResponse:
    """Test suite for AI response validation."""

    def test_validate_valid_response(self):
        """Test validation of valid response."""
        response = "This is a valid response"
        result = validate_ai_response(response, str)
        assert result == response

    def test_validate_none_response_raises_error(self):
        """Test that None response raises error."""
        with pytest.raises(AIError, match="AI response is None"):
            validate_ai_response(None, str)

    def test_validate_wrong_type_raises_error(self):
        """Test that wrong type raises error."""
        with pytest.raises(AIError, match="type mismatch"):
            validate_ai_response(123, str)

    def test_validate_empty_string_raises_error(self):
        """Test that empty string raises error."""
        with pytest.raises(AIError, match="AI response is empty"):
            validate_ai_response("", str)

        with pytest.raises(AIError, match="AI response is empty"):
            validate_ai_response("   ", str)


class TestWithAIErrorHandlingDecorator:
    """Test suite for the error handling decorator."""

    @pytest.mark.asyncio
    async def test_decorator_successful_operation(self):
        """Test decorator with successful operation."""

        @with_ai_error_handling()
        async def successful_operation():
            return "success"

        result = await successful_operation()
        assert result == "success"

    @pytest.mark.asyncio
    async def test_decorator_with_retries(self):
        """Test decorator with retry logic."""
        call_count = 0

        @with_ai_error_handling(RetryConfig(max_attempts=3, base_delay=0.1))
        async def flaky_operation():
            nonlocal call_count
            call_count += 1
            if call_count <= 2:
                raise Exception("Service temporarily unavailable")
            return "success"

        result = await flaky_operation()
        assert result == "success"
        assert call_count == 3


class TestCreateUserFriendlyError:
    """Test suite for user-friendly error messages."""

    def test_user_friendly_error_messages(self):
        """Test that all error types have user-friendly messages."""
        error_types = [
            AIErrorType.RATE_LIMIT,
            AIErrorType.TIMEOUT,
            AIErrorType.QUOTA_EXCEEDED,
            AIErrorType.INVALID_REQUEST,
            AIErrorType.SERVICE_UNAVAILABLE,
            AIErrorType.AUTHENTICATION,
            AIErrorType.UNKNOWN,
        ]

        for error_type in error_types:
            error = AIError("Technical error message", error_type)
            friendly_message = create_user_friendly_error(error)

            # Message should be user-friendly (no technical jargon)
            assert "Technical error message" not in friendly_message
            assert len(friendly_message) > 10  # Should be descriptive
            assert not friendly_message.islower()  # Should be properly capitalized
