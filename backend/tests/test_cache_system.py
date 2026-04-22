"""
Tests for the AI operations caching system using the new cache implementation.
"""

import asyncio
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

import pytest

from app.core.cache_decorators import CacheContext, cached_ai_operation
from app.core.personal_cache import get_ai_cache


@pytest.fixture(autouse=True)
@pytest.mark.asyncio
async def clear_cache():
    """Clear the cache before each test."""
    cache = get_ai_cache()
    await cache.clear_all()
    yield
    await cache.clear_all()


class TestCacheDecorators:
    """Test cache decorators functionality"""

    @pytest.mark.asyncio
    async def test_cached_operation_decorator(self):
        # Ensure cache is cleared before test
        from app.core.personal_cache import get_ai_cache

        cache = get_ai_cache()
        await cache.clear_all()

        import uuid

        user_id = f"test_user_{uuid.uuid4()}"
        input_text = f"test input data_{uuid.uuid4()}"

        # Mock function call counter
        call_count = 0

        @cached_ai_operation("test_operation", user_id_param="user_id")
        async def mock_expensive_operation(user_id: str, input_text: str):
            nonlocal call_count
            call_count += 1
            await asyncio.sleep(0.01)  # Simulate processing time
            return {
                "processed": input_text,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

        # First call - should execute function
        result1 = await mock_expensive_operation(user_id, input_text)
        assert call_count == 1
        assert result1["processed"] == input_text

        # Second call with same parameters - should use cache
        result2 = await mock_expensive_operation(user_id, input_text)
        assert call_count == 1  # Function not called again
        assert result2 == result1  # Same result from cache

        operation_type = "test_operation"
        input_data = {"key": "value"}
        result = {"data": "test_result"}

        # Test cache miss
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            assert ctx.cached is False

            # Set the result
            await ctx.set_result(result)

            # Should be cached now
            assert ctx.cached is True

            # Get the result
            cached_result = await ctx.get_result()
            assert cached_result == result

        # Test cache hit in a new context
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            assert ctx.cached is True
            assert await ctx.get_result() == result

        # Test cache invalidation
        await cache.invalidate_user_cache(user_id, [operation_type])

        # Should be a cache miss after invalidation
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            assert ctx.cached is False

    @pytest.mark.asyncio
    async def test_cache_error_handling(self):
        """Test that cache handles errors gracefully"""
        # Test with invalid inputs
        with pytest.raises(ValueError):
            async with CacheContext("", "", {}) as ctx:
                pass

        # Test with None values
        with pytest.raises(ValueError):
            async with CacheContext(None, None, None) as ctx:  # type: ignore
                pass


class TestAICache:
    """Test the main AI cache functionality"""

    @pytest.fixture
    def ai_cache(self):
        import asyncio

        cache_obj = get_ai_cache()
        # Ensure we clean it up synchronously
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        if loop.is_running():
            # Special handling for already running loop (like in some pytest-asyncio modes)
            # but usually, we can just call it in an async test
            pass
        else:
            loop.run_until_complete(cache_obj.clear_all())
        return cache_obj

    @pytest.mark.asyncio
    async def test_cache_miss_and_set(self, ai_cache):
        """Test basic cache get/set operations"""
        user_id = "user_123"
        operation_type = "resume_analysis"
        input_data = {"resume_text": "Software engineer with 5 years experience"}

        # Should be cache miss initially
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            assert ctx.cached is False

            # Set cache entry
            test_result = {"skills": ["Python", "FastAPI"], "score": 85}
            await ctx.set_result(test_result)

            # Should be in cache now
            assert ctx.cached is True
            cached_result = await ctx.get_result()
            assert cached_result == test_result

    @pytest.mark.asyncio
    async def test_cache_key_consistency(self, ai_cache):
        """Test that cache keys are consistent and unique"""
        user_id = "user_456"
        operation_type = "job_analysis"
        input_data = {"job_description": "Senior Python Developer position"}

        # Test with CacheContext which handles key generation internally
        async with CacheContext(operation_type, user_id, input_data) as ctx1:
            key1 = ctx1.cache_key

        # Same inputs should generate same key
        async with CacheContext(operation_type, user_id, input_data) as ctx2:
            key2 = ctx2.cache_key
            assert key1 == key2, "Same inputs should generate same cache key"

        # Different input should generate different key
        different_input = {"job_description": "Junior Java Developer position"}
        async with CacheContext(operation_type, user_id, different_input) as ctx3:
            key3 = ctx3.cache_key
            assert key3 != key1, "Different inputs should generate different cache keys"

    @pytest.mark.asyncio
    async def test_cache_ttl(self, ai_cache):
        """Test that cache respects TTL"""
        user_id = "user_ttl"
        operation_type = "test_ttl"
        input_data = {"test": "ttl_test"}

        # Set with short TTL (1 second)
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            await ctx.set_result({"data": "test"}, ttl=1)
            assert await ctx.get_result() == {"data": "test"}

        # Should still be cached
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            assert ctx.cached is True

        # Wait for TTL to expire
        await asyncio.sleep(1.1)

        # Should be a cache miss now
        async with CacheContext(operation_type, user_id, input_data) as ctx:
            assert ctx.cached is False

    @pytest.mark.asyncio
    async def test_user_cache_invalidation(self, ai_cache):
        """Test that user cache invalidation works correctly"""
        user_id = "user_789"
        cache = ai_cache

        # Set multiple cache entries for user using CacheContext
        operations = [
            ("resume_analysis", {"resume": "data1"}),
            ("ats_scoring", {"resume": "data1", "job": "data2"}),
            ("voice_profile", {"documents": ["doc1", "doc2"]}),
        ]

        # Set cache entries
        for op_type, input_data in operations:
            async with CacheContext(op_type, user_id, input_data) as ctx:
                await ctx.set_result({"result": f"{op_type}_result"})

        # Verify entries exist
        for op_type, input_data in operations:
            async with CacheContext(op_type, user_id, input_data) as ctx:
                assert ctx.cached is True
                result = await ctx.get_result()
                assert result == {"result": f"{op_type}_result"}

        # Invalidate user cache for specific operations
        invalidated = await cache.invalidate_user_cache(user_id, ["resume_analysis", "ats_scoring"])
        assert invalidated >= 2, "Should have invalidated at least 2 operations"

        # Verify only specified operations were invalidated
        async with CacheContext("resume_analysis", user_id, operations[0][1]) as ctx:
            assert ctx.cached is False, "resume_analysis should be invalidated"

        async with CacheContext("voice_profile", user_id, operations[2][1]) as ctx:
            assert ctx.cached is True, "voice_profile should still be cached"


class TestCacheConfiguration:
    """Test cache configuration and TTL behavior"""

    @pytest.mark.asyncio
    async def test_different_ttl_per_operation(self):
        """Test that different operations can have different TTLs"""
        cache = get_ai_cache()
        user_id = "ttl_test_user"

        # Test operations with different TTLs
        operations = [
            ("short_ttl", {"data": "short"}, 10),  # 10 seconds
            ("medium_ttl", {"data": "medium"}, 60),  # 1 minute
            ("long_ttl", {"data": "long"}, 3600),  # 1 hour
        ]

        # Set cache entries with different TTLs
        for op_type, input_data, ttl in operations:
            async with CacheContext(op_type, user_id, input_data) as ctx:
                await ctx.set_result({"result": f"{op_type}_result"}, ttl=ttl)

        # Verify all entries are cached initially
        for op_type, input_data, _ in operations:
            async with CacheContext(op_type, user_id, input_data) as ctx:
                assert ctx.cached is True
                result = await ctx.get_result()
                assert result == {"result": f"{op_type}_result"}

    @pytest.mark.asyncio
    async def test_cache_config_validation(self):
        """Test that cache configuration is valid"""
        cache = get_ai_cache()

        # Test with invalid operation type
        with pytest.raises(ValueError):
            async with CacheContext("", "user123", {}) as ctx:
                pass

        # Test with invalid user ID
        with pytest.raises(ValueError):
            async with CacheContext("test_op", "", {}) as ctx:
                pass


class TestCacheIntegration:
    """Integration tests for the complete cache system"""

    @pytest.mark.asyncio
    async def test_end_to_end_cache_flow(self):
        """Test complete cache flow with multiple operations"""
        cache = get_ai_cache()
        user_id = "integration_user"

        # Test data
        test_data = [
            ("resume_analysis", {"resume_text": "Python developer"}),
            ("job_analysis", {"job_description": "Senior Python Developer"}),
            ("cover_letter", {"job_title": "Python Developer"}),
        ]

        # Test cache miss, set, and get
        for op_type, input_data in test_data:
            # First call - cache miss
            async with CacheContext(op_type, user_id, input_data) as ctx:
                assert ctx.cached is False

                # Set the result
                result = {"status": "success", "op_type": op_type}
                await ctx.set_result(result)

                # Should be cached now
                assert ctx.cached is True

                # Get the result
                cached_result = await ctx.get_result()
                assert cached_result == result

            # Second call - cache hit
            async with CacheContext(op_type, user_id, input_data) as ctx:
                assert ctx.cached is True
                result = await ctx.get_result()
                assert result == {"status": "success", "op_type": op_type}

        # Test cache invalidation
        invalidated = await cache.invalidate_user_cache(
            user_id, ["resume_analysis", "job_analysis"]
        )
        assert invalidated >= 2  # At least 2 operations should be invalidated

        # Verify invalidation
        async with CacheContext("resume_analysis", user_id, test_data[0][1]) as ctx:
            assert ctx.cached is False

        async with CacheContext("cover_letter", user_id, test_data[2][1]) as ctx:
            assert ctx.cached is True  # This one should still be cached

    @pytest.mark.asyncio
    async def test_cache_error_handling(self):
        """Test that cache handles errors gracefully"""
        # Create a mock cache that will raise an error
        with patch("app.core.personal_cache.get_ai_cache") as mock_get_cache:
            # Configure the mock to raise an exception
            mock_cache = AsyncMock()
            mock_cache.get.side_effect = Exception("Cache error")
            mock_get_cache.return_value = mock_cache

            # Should not raise an exception
            result = await get_ai_cache().get("test_op", "user123", {})
            assert result is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
