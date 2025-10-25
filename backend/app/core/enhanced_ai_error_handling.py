"""
Enhanced AI Flow Error Handling System

Provides granular error handling, fallback mechanisms, and detailed logging
for individual AI service operations within complex flows.
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional

from .ai_error_handling import AIError, AIErrorType, AIOperationHandler, RetryConfig

logger = logging.getLogger(__name__)


class AIServiceType(Enum):
    """Types of AI services for specific error handling"""

    GEMINI_EXTRACTION = "gemini_extraction"
    GEMINI_ANALYSIS = "gemini_analysis"
    GEMINI_SCORING = "gemini_scoring"
    GENKIT_FLOW = "genkit_flow"
    KEYWORD_MATCHING = "keyword_matching"
    SEMANTIC_ANALYSIS = "semantic_analysis"
    TEXT_PROCESSING = "text_processing"


@dataclass
class AIOperationContext:
    """Context information for AI operations"""

    operation_name: str
    service_type: AIServiceType
    user_id: str
    input_size: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class AIOperationResult:
    """Result container with success/failure information"""

    success: bool
    data: Any = None
    error: Optional[AIError] = None
    fallback_used: bool = False
    context: Optional[AIOperationContext] = None
    execution_time: float = 0.0


@dataclass
class FallbackStrategy:
    """Configuration for fallback mechanisms"""

    enabled: bool = True
    fallback_function: Optional[Callable] = None
    fallback_data: Any = None
    use_cached_result: bool = True
    degraded_mode: bool = False


class EnhancedAIErrorHandler:
    """Enhanced error handler with granular control and fallbacks"""

    def __init__(self):
        self.operation_handlers = {
            AIServiceType.GEMINI_EXTRACTION: AIOperationHandler(
                RetryConfig(max_attempts=3, base_delay=1.0, max_delay=30.0)
            ),
            AIServiceType.GEMINI_ANALYSIS: AIOperationHandler(
                RetryConfig(max_attempts=4, base_delay=2.0, max_delay=60.0)
            ),
            AIServiceType.GEMINI_SCORING: AIOperationHandler(
                RetryConfig(max_attempts=2, base_delay=0.5, max_delay=15.0)
            ),
            AIServiceType.GENKIT_FLOW: AIOperationHandler(
                RetryConfig(max_attempts=3, base_delay=1.5, max_delay=45.0)
            ),
            AIServiceType.KEYWORD_MATCHING: AIOperationHandler(
                RetryConfig(max_attempts=1, base_delay=0.1, max_delay=1.0)
            ),
            AIServiceType.SEMANTIC_ANALYSIS: AIOperationHandler(
                RetryConfig(max_attempts=3, base_delay=2.0, max_delay=60.0)
            ),
            AIServiceType.TEXT_PROCESSING: AIOperationHandler(
                RetryConfig(max_attempts=2, base_delay=0.5, max_delay=10.0)
            ),
        }
        self.operation_stats: Dict[str, List[AIOperationResult]] = {}

    async def execute_ai_operation(
        self,
        operation: Callable,
        context: AIOperationContext,
        fallback_strategy: Optional[FallbackStrategy] = None,
        *args,
        **kwargs,
    ) -> AIOperationResult:
        """
        Execute AI operation with enhanced error handling and fallback.

        Args:
            operation: The AI operation function to execute
            context: Context information for the operation
            fallback_strategy: Optional fallback configuration
            *args, **kwargs: Arguments for the operation

        Returns:
            AIOperationResult with success/failure details
        """
        start_time = asyncio.get_event_loop().time()
        result = AIOperationResult(success=False, context=context)

        try:
            # Log operation start
            logger.info(
                f"Starting AI operation: {context.operation_name} "
                f"[{context.service_type.value}] for user {context.user_id}"
            )

            # Get appropriate handler for this service type
            handler = self.operation_handlers.get(
                context.service_type,
                self.operation_handlers[AIServiceType.GEMINI_ANALYSIS],
            )

            # Execute with retry logic
            operation_result = await handler.execute_with_retry(operation, *args, **kwargs)

            # Validate result
            if operation_result is None:
                raise AIError(
                    message=f"Operation {context.operation_name} returned None",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

            # Success
            result.success = True
            result.data = operation_result

            logger.info(
                f"AI operation succeeded: {context.operation_name} "
                f"[{context.service_type.value}]"
            )

        except AIError as ai_error:
            result.error = ai_error

            logger.warning(
                f"AI operation failed: {context.operation_name} "
                f"[{context.service_type.value}] - {ai_error.error_type.value}: {ai_error.message}"
            )

                # Attempt fallback if configured
            if fallback_strategy and fallback_strategy.enabled:
                try:
                    fallback_result = await self._execute_fallback(
                        context, fallback_strategy, ai_error, *args, **kwargs
                    )
                    # Mark fallback_used True if fallback was attempted, regardless of success
                    if fallback_result:
                        fallback_result.fallback_used = True
                        result = fallback_result
                except Exception as fallback_error:
                    logger.error(
                        f"Error in fallback execution for {context.operation_name}: {fallback_error}",
                        exc_info=True
                    )
                    # If fallback fails, we'll use the original error
                    result.error = ai_error
        except Exception as e:
            # Unexpected error - wrap in AIError
            error_msg = f"Unexpected error in {context.operation_name}"
            logger.exception(error_msg)
            result.error = AIError(
                message=error_msg,
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

            logger.error(
                f"Unexpected error in AI operation: {context.operation_name} "
                f"[{context.service_type.value}] - {str(e)}",
                exc_info=True,
            )

        finally:
            # Record execution time
            end_time = asyncio.get_event_loop().time()
            result.execution_time = end_time - start_time

            # Store operation stats
            self._record_operation_stats(result)

        return result

    async def _execute_fallback(
        self,
        context: AIOperationContext,
        strategy: FallbackStrategy,
        original_error: AIError,
        *args,
        **kwargs,
    ) -> AIOperationResult:
        """Execute fallback mechanism"""

        logger.info(
            f"Attempting fallback for {context.operation_name} "
            f"due to {original_error.error_type.value}"
        )

        result = AIOperationResult(success=False, context=context)

        try:
            if strategy.fallback_function:
                # Execute custom fallback function
                fallback_data = await strategy.fallback_function(*args, **kwargs)
                result.success = True
                result.data = fallback_data

            elif strategy.fallback_data is not None:
                # Use pre-configured fallback data
                result.success = True
                result.data = strategy.fallback_data

            elif strategy.use_cached_result:
                # Try to get cached result
                cached_result = await self._get_cached_result(context, *args, **kwargs)
                if cached_result is not None:
                    result.success = True
                    result.data = cached_result

            elif strategy.degraded_mode:
                # Return minimal/degraded result
                result.success = True
                result.data = self._get_degraded_result(context)

            if result.success:
                logger.info(f"Fallback succeeded for {context.operation_name}")
            else:
                logger.warning(f"All fallback attempts failed for {context.operation_name}")

        except Exception as e:
            logger.error(f"Fallback execution failed: {str(e)}", exc_info=True)
            result.error = AIError(
                message=f"Fallback failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

        return result

    async def _get_cached_result(
        self, context: AIOperationContext, *args, **kwargs
    ) -> Optional[Any]:
        """Try to retrieve cached result for operation"""
        # This would integrate with your existing cache system
        # For now, return None - implement based on your cache strategy
        logger.info(f"Checking cache for {context.operation_name}")
        return None

    def _get_degraded_result(self, context: AIOperationContext) -> Any:
        """Generate minimal result for degraded mode"""
        service_type = context.service_type

        if service_type == AIServiceType.GEMINI_SCORING:
            return {
                "overall_score": 50.0,
                "breakdown": {
                    "keyword_score": 50.0,
                    "semantic_score": 50.0,
                    "formatting_score": 50.0,
                },
                "matched_keywords": [],
                "missing_keywords": [],
                "recommendations": ["Analysis temporarily unavailable. Please try again later."],
                "degraded_mode": True,
            }
        elif service_type == AIServiceType.GEMINI_EXTRACTION:
            return {
                "skills": [],
                "experience": [],
                "education": [],
                "extracted": False,
                "degraded_mode": True,
            }
        elif service_type == AIServiceType.SEMANTIC_ANALYSIS:
            return {
                "similarity_score": 50,
                "explanation": "Semantic analysis temporarily unavailable. Please try again later.",
                "degraded_mode": True,
            }
        else:
            return {"degraded_mode": True, "message": "Service temporarily unavailable"}

    def _record_operation_stats(self, result: AIOperationResult):
        """Record operation statistics for monitoring"""
        if not result.context:
            return

        operation_name = result.context.operation_name
        if operation_name not in self.operation_stats:
            self.operation_stats[operation_name] = []

        self.operation_stats[operation_name].append(result)

        # Keep only recent results (last 100)
        if len(self.operation_stats[operation_name]) > 100:
            self.operation_stats[operation_name] = self.operation_stats[operation_name][-100:]

    def get_operation_health(self, operation_name: str) -> Dict[str, Any]:
        """Get health metrics for an operation"""
        if operation_name not in self.operation_stats:
            return {"status": "no_data"}

        recent_results = self.operation_stats[operation_name][-10:]  # Last 10 operations

        success_count = sum(1 for r in recent_results if r.success)
        fallback_count = sum(1 for r in recent_results if r.fallback_used)
        avg_execution_time = sum(r.execution_time for r in recent_results) / len(recent_results)

        return {
            "status": (
                "healthy"
                if success_count >= 8
                else "degraded" if success_count >= 5 else "unhealthy"
            ),
            "success_rate": success_count / len(recent_results),
            "fallback_rate": fallback_count / len(recent_results),
            "avg_execution_time": avg_execution_time,
            "total_operations": len(recent_results),
        }

    @asynccontextmanager
    async def ai_operation_context(
        self,
        operation_name: str,
        service_type: AIServiceType,
        user_id: str,
        fallback_strategy: Optional[FallbackStrategy] = None,
        **metadata,
    ):
        """Context manager for AI operations with automatic error handling"""
        context = AIOperationContext(
            operation_name=operation_name,
            service_type=service_type,
            user_id=user_id,
            metadata=metadata,
        )

        try:
            yield context
        except Exception as e:
            logger.error(
                f"Error in AI operation context {operation_name}: {str(e)}",
                exc_info=True,
            )
            raise


# Global instance
enhanced_ai_handler = EnhancedAIErrorHandler()


# Convenience functions
async def execute_with_enhanced_handling(
    operation: Callable,
    operation_name: str,
    service_type: AIServiceType,
    user_id: str,
    fallback_strategy: Optional[FallbackStrategy] = None,
    *args,
    **kwargs,
) -> AIOperationResult:
    """Execute AI operation with enhanced error handling"""
    context = AIOperationContext(
        operation_name=operation_name, service_type=service_type, user_id=user_id
    )

    return await enhanced_ai_handler.execute_ai_operation(
        operation, context, fallback_strategy, *args, **kwargs
    )


def create_fallback_strategy(
    enabled: bool = True,
    fallback_function: Optional[Callable] = None,
    fallback_data: Any = None,
    use_cached_result: bool = False,
    degraded_mode: bool = False,
) -> FallbackStrategy:
    """Create a fallback strategy configuration"""
    return FallbackStrategy(
        enabled=enabled,
        fallback_function=fallback_function,
        fallback_data=fallback_data,
        use_cached_result=use_cached_result,
        degraded_mode=degraded_mode,
    )


def create_detailed_error_message(result: AIOperationResult, operation_context: str = "") -> str:
    """Create detailed, user-friendly error message"""
    if result.success:
        return "Operation completed successfully"

    if not result.error:
        return "Unknown error occurred"

    error = result.error
    context = result.context

    base_message = (
        f"Error in {operation_context or context.operation_name if context else 'AI operation'}"
    )

    if error.error_type == AIErrorType.RATE_LIMIT:
        return f"{base_message}: AI service is currently busy. Please try again in a few minutes."
    elif error.error_type == AIErrorType.TIMEOUT:
        return f"{base_message}: The request took too long to complete. Please try again."
    elif error.error_type == AIErrorType.QUOTA_EXCEEDED:
        return f"{base_message}: Service quota exceeded. Please try again later."
    elif error.error_type == AIErrorType.INVALID_REQUEST:
        return f"{base_message}: Invalid input provided. Please check your data and try again."
    elif error.error_type == AIErrorType.SERVICE_UNAVAILABLE:
        return f"{base_message}: Service is temporarily unavailable. Please try again later."
    elif error.error_type == AIErrorType.AUTHENTICATION:
        return f"{base_message}: Authentication error. Please refresh the page and try again."
    else:
        return f"{base_message}: An unexpected error occurred. Please try again."
