"""
Tests for enhanced AI error handling system
"""

import asyncio
import pytest
from unittest.mock import Mock

from app.core.enhanced_ai_error_handling import (
    EnhancedAIErrorHandler,
    AIServiceType,
    AIOperationContext,
    AIOperationResult,
    create_fallback_strategy,
    create_detailed_error_message,
    enhanced_ai_handler,
)
from app.core.ai_error_handling import AIError, AIErrorType


class TestEnhancedAIErrorHandler:
    """Test suite for EnhancedAIErrorHandler"""

    def setup_method(self):
        """Setup test fixtures"""
        self.handler = EnhancedAIErrorHandler()
        self.context = AIOperationContext(
            operation_name="test_operation",
            service_type=AIServiceType.GEMINI_ANALYSIS,
            user_id="test_user_123",
            input_size=100,
        )

    @pytest.mark.asyncio
    async def test_successful_operation(self):
        """Test successful AI operation execution"""

        # Mock a successful operation
        async def mock_operation():
            await asyncio.sleep(0.1)  # Simulate processing time
            return {"result": "success", "data": "test_data"}

        result = await self.handler.execute_ai_operation(mock_operation, self.context)

        assert result.success is True
        assert result.data == {"result": "success", "data": "test_data"}
        assert result.error is None
        assert result.fallback_used is False
        assert result.execution_time > 0

    @pytest.mark.asyncio
    async def test_operation_with_retry_success(self):
        """Test operation that fails initially but succeeds on retry"""
        call_count = 0

        async def mock_failing_then_success():
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise AIError(message="Rate limit exceeded", error_type=AIErrorType.RATE_LIMIT)
            return {"result": "success_after_retry"}

        result = await self.handler.execute_ai_operation(mock_failing_then_success, self.context)

        assert result.success is True
        assert result.data == {"result": "success_after_retry"}
        assert call_count == 2

    @pytest.mark.asyncio
    async def test_operation_with_fallback_success(self):
        """Test operation that fails but succeeds with fallback"""

        async def mock_failing_operation():
            raise AIError(
                message="Service unavailable",
                error_type=AIErrorType.SERVICE_UNAVAILABLE,
            )

        async def mock_fallback():
            return {"fallback": "data", "degraded": True}

        fallback_strategy = create_fallback_strategy(enabled=True, fallback_function=mock_fallback)

        result = await self.handler.execute_ai_operation(
            mock_failing_operation, self.context, fallback_strategy
        )

        assert result.success is True
        assert result.data == {"fallback": "data", "degraded": True}
        assert result.fallback_used is True

    @pytest.mark.asyncio
    async def test_operation_with_degraded_mode_fallback(self):
        """Test fallback to degraded mode"""

        async def mock_failing_operation():
            raise AIError(message="Authentication failed", error_type=AIErrorType.AUTHENTICATION)

        fallback_strategy = create_fallback_strategy(enabled=True, degraded_mode=True)

        result = await self.handler.execute_ai_operation(
            mock_failing_operation, self.context, fallback_strategy
        )

        assert result.success is True
        assert result.fallback_used is True
        assert "degraded_mode" in result.data
        assert result.data["degraded_mode"] is True

    @pytest.mark.asyncio
    async def test_operation_complete_failure(self):
        """Test operation that fails completely (no fallback)"""

        async def mock_failing_operation():
            raise AIError(message="Invalid request format", error_type=AIErrorType.INVALID_REQUEST)

        result = await self.handler.execute_ai_operation(mock_failing_operation, self.context)

        assert result.success is False
        assert result.data is None
        assert result.error is not None
        assert result.error.error_type == AIErrorType.INVALID_REQUEST
        assert result.fallback_used is False

    def test_operation_health_tracking(self):
        """Test operation health metrics tracking"""
        # Simulate multiple operations
        for i in range(5):
            result = AIOperationResult(
                success=True, execution_time=0.1 + i * 0.01, context=self.context
            )
            self.handler._record_operation_stats(result)

        # Add a failed operation
        failed_result = AIOperationResult(
            success=False,
            execution_time=0.2,
            context=self.context,
            error=AIError("Test error", AIErrorType.TIMEOUT),
        )
        self.handler._record_operation_stats(failed_result)

        health = self.handler.get_operation_health("test_operation")

        assert health["status"] in ["healthy", "degraded", "unhealthy"]
        assert "success_rate" in health
        assert "avg_execution_time" in health
        assert health["total_operations"] == 6

    def test_create_fallback_strategy(self):
        """Test fallback strategy creation"""
        strategy = create_fallback_strategy(
            enabled=True,
            fallback_data={"test": "data"},
            use_cached_result=True,
            degraded_mode=False,
        )

        assert strategy.enabled is True
        assert strategy.fallback_data == {"test": "data"}
        assert strategy.use_cached_result is True
        assert strategy.degraded_mode is False

    def test_create_detailed_error_message(self):
        """Test detailed error message creation"""
        # Test successful result
        success_result = AIOperationResult(success=True)
        message = create_detailed_error_message(success_result)
        assert "completed successfully" in message

        # Test rate limit error
        rate_limit_error = AIError("Rate limit", AIErrorType.RATE_LIMIT)
        error_result = AIOperationResult(
            success=False, error=rate_limit_error, context=self.context
        )
        message = create_detailed_error_message(error_result, "test operation")
        assert "AI service is currently busy" in message
        assert "test operation" in message

        # Test timeout error
        timeout_error = AIError("Timeout", AIErrorType.TIMEOUT)
        timeout_result = AIOperationResult(success=False, error=timeout_error, context=self.context)
        message = create_detailed_error_message(timeout_result)
        assert "took too long" in message

    def test_service_specific_retry_configs(self):
        """Test that different service types have appropriate retry configurations"""
        # Check that different service types have different retry configs
        gemini_handler = self.handler.operation_handlers[AIServiceType.GEMINI_ANALYSIS]
        scoring_handler = self.handler.operation_handlers[AIServiceType.GEMINI_SCORING]
        keyword_handler = self.handler.operation_handlers[AIServiceType.KEYWORD_MATCHING]

        assert gemini_handler.retry_config.max_attempts == 4
        assert scoring_handler.retry_config.max_attempts == 2
        assert keyword_handler.retry_config.max_attempts == 1

    def test_degraded_result_generation(self):
        """Test degraded result generation for different service types"""
        # Test scoring degraded result
        scoring_context = AIOperationContext(
            operation_name="test",
            service_type=AIServiceType.GEMINI_SCORING,
            user_id="test",
        )
        result = self.handler._get_degraded_result(scoring_context)

        assert "overall_score" in result
        assert result["overall_score"] == 50.0
        assert result["degraded_mode"] is True

        # Test extraction degraded result
        extraction_context = AIOperationContext(
            operation_name="test",
            service_type=AIServiceType.GEMINI_EXTRACTION,
            user_id="test",
        )
        result = self.handler._get_degraded_result(extraction_context)

        assert "skills" in result
        assert "extracted" in result
        assert result["extracted"] is False
        assert result["degraded_mode"] is True


class TestIntegrationWithExistingCode:
    """Integration tests with existing AI operations"""

    @pytest.mark.asyncio
    async def test_ats_scoring_error_handling_integration(self):
        """Test ATS scoring with enhanced error handling (mock)"""
        # This would test the actual ats_scoring.py integration
        # For now, we'll test the pattern

        async def mock_extract_job_requirements():
            return Mock(requiredSkills=["Python"], preferredSkills=["FastAPI"])

        async def mock_extract_resume_entities():
            return Mock(skills=["Python", "JavaScript"], experience=[], education=[])

        context = AIOperationContext(
            operation_name="test_ats_integration",
            service_type=AIServiceType.GENKIT_FLOW,
            user_id="test_user",
        )

        # Test successful extraction
        result = await enhanced_ai_handler.execute_ai_operation(
            mock_extract_job_requirements, context
        )

        assert result.success is True

    @pytest.mark.asyncio
    async def test_api_endpoint_error_handling_pattern(self):
        """Test API endpoint error handling pattern"""
        # Simulate the pattern used in analysis.py

        async def mock_ai_operation():
            raise AIError("Service temporarily unavailable", AIErrorType.SERVICE_UNAVAILABLE)

        context = AIOperationContext(
            operation_name="api_test",
            service_type=AIServiceType.GEMINI_ANALYSIS,
            user_id="test_user",
        )

        fallback_strategy = create_fallback_strategy(
            enabled=True,
            fallback_data={"degraded": True, "message": "Service unavailable"},
        )

        result = await enhanced_ai_handler.execute_ai_operation(
            mock_ai_operation, context, fallback_strategy
        )

        assert result.success is True
        assert result.fallback_used is True
        assert result.data["degraded"] is True


@pytest.mark.asyncio
async def test_concurrent_operations():
    """Test concurrent AI operations with error handling"""
    handler = EnhancedAIErrorHandler()

    async def mock_operation(delay: float, should_fail: bool = False):
        await asyncio.sleep(delay)
        if should_fail:
            raise AIError("Mock error", AIErrorType.TIMEOUT)
        return {"delay": delay, "success": True}

    # Create multiple concurrent operations
    tasks = []
    for i in range(5):
        context = AIOperationContext(
            operation_name=f"concurrent_test_{i}",
            service_type=AIServiceType.GEMINI_ANALYSIS,
            user_id="concurrent_user",
        )

        # Make some operations fail
        should_fail = i % 2 == 0
        fallback_strategy = (
            create_fallback_strategy(
                enabled=True, fallback_data={"concurrent": i, "fallback": True}
            )
            if should_fail
            else None
        )

        # Pass the actual async function and its arguments, not a lambda
        task = handler.execute_ai_operation(
            mock_operation, context, fallback_strategy, i * 0.1, should_fail
        )
        tasks.append(task)

    # Wait for all operations to complete
    results = await asyncio.gather(*tasks)

    # Check that all operations completed (some with fallbacks)
    assert len(results) == 5
    successful_count = sum(1 for r in results if r.success)
    fallback_count = sum(1 for r in results if getattr(r, "fallback_used", False))

    # At least two operations should use fallback (since should_fail is True for even indices)
    assert successful_count == 5  # All should succeed (some via fallback)
    assert fallback_count >= 2  # Some should have used fallbacks


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
