"""
Tests for the AI operations caching system
"""

import pytest
import asyncio
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock

from app.core.cache import (
    AICache, InMemoryCacheBackend, CacheEntry, CacheConfig, get_ai_cache
)
from app.core.cache_decorators import cached_ai_operation, CacheContext


class TestInMemoryCacheBackend:
    """Test the in-memory cache backend"""
    
    @pytest.fixture
    def backend(self):
        return InMemoryCacheBackend(max_size=5)
    
    @pytest.fixture
    def sample_entry(self):
        return CacheEntry(
            key="test_key",
            value={"result": "test_data"},
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(seconds=3600),
            operation_type="test_operation",
            input_hash="abc123"
        )
    
    @pytest.mark.asyncio
    async def test_set_and_get(self, backend, sample_entry):
        # Set entry
        success = await backend.set(sample_entry)
        assert success is True
        
        # Get entry
        retrieved = await backend.get(sample_entry.key)
        assert retrieved is not None
        assert retrieved.value == sample_entry.value
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_key(self, backend):
        result = await backend.get("nonexistent_key")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_expired_entry_removal(self, backend):
        # Create expired entry
        expired_entry = CacheEntry(
            key="expired_key",
            value={"data": "expired"},
            created_at=datetime.utcnow() - timedelta(seconds=7200),
            expires_at=datetime.utcnow() - timedelta(seconds=3600),
            operation_type="test",
            input_hash="expired"
        )
        
        await backend.set(expired_entry)
        
        # Should return None for expired entry
        result = await backend.get("expired_key")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_lru_eviction(self, backend):
        # Fill cache beyond capacity
        for i in range(7):  # More than max_size of 5
            entry = CacheEntry(
                key=f"key_{i}",
                value={"data": f"value_{i}"},
                created_at=datetime.utcnow(),
                expires_at=datetime.utcnow() + timedelta(seconds=3600),
                operation_type="test",
                input_hash=f"hash_{i}"
            )
            await backend.set(entry)
        
        # First entries should be evicted
        assert await backend.get("key_0") is None
        assert await backend.get("key_1") is None
        
        # Later entries should remain
        assert await backend.get("key_5") is not None
        assert await backend.get("key_6") is not None
    
    @pytest.mark.asyncio
    async def test_delete(self, backend, sample_entry):
        await backend.set(sample_entry)
        
        # Verify entry exists
        assert await backend.get(sample_entry.key) is not None
        
        # Delete entry
        success = await backend.delete(sample_entry.key)
        assert success is True
        
        # Verify entry is gone
        assert await backend.get(sample_entry.key) is None
    
    @pytest.mark.asyncio
    async def test_clear_by_pattern(self, backend):
        # Add entries with different patterns
        entries = [
            ("user_123_resume", {"type": "resume"}),
            ("user_123_job", {"type": "job"}),
            ("user_456_resume", {"type": "resume"}),
            ("other_key", {"type": "other"})
        ]
        
        for key, value in entries:
            entry = CacheEntry(
                key=key,
                value=value,
                created_at=datetime.utcnow(),
                expires_at=datetime.utcnow() + timedelta(seconds=3600),
                operation_type="test",
                input_hash=key
            )
            await backend.set(entry)
        
        # Clear entries matching pattern
        cleared = await backend.clear_by_pattern("user_123")
        assert cleared == 2
        
        # Verify correct entries were cleared
        assert await backend.get("user_123_resume") is None
        assert await backend.get("user_123_job") is None
        assert await backend.get("user_456_resume") is not None
        assert await backend.get("other_key") is not None


class TestAICache:
    """Test the main AI cache functionality"""
    
    @pytest.fixture
    def cache(self):
        backend = InMemoryCacheBackend(max_size=100)
        return AICache(backend)
    
    @pytest.mark.asyncio
    async def test_cache_miss_and_set(self, cache):
        user_id = "user_123"
        operation_type = "resume_analysis"
        input_data = {"resume_text": "Software engineer with 5 years experience"}
        
        # Should be cache miss initially
        result = await cache.get(operation_type, user_id, input_data)
        assert result is None
        
        # Set cache entry
        test_result = {"skills": ["Python", "FastAPI"], "score": 85}
        success = await cache.set(operation_type, user_id, input_data, test_result)
        assert success is True
        
        # Should be cache hit now
        cached_result = await cache.get(operation_type, user_id, input_data)
        assert cached_result == test_result
    
    @pytest.mark.asyncio
    async def test_cache_key_consistency(self, cache):
        user_id = "user_456"
        operation_type = "job_analysis"
        input_data = {"job_description": "Senior Python Developer position"}
        
        # Generate key multiple times - should be consistent
        key1 = cache._generate_cache_key(operation_type, user_id, input_data)
        key2 = cache._generate_cache_key(operation_type, user_id, input_data)
        assert key1 == key2
        
        # Different input should generate different key
        different_input = {"job_description": "Junior Java Developer position"}
        key3 = cache._generate_cache_key(operation_type, user_id, different_input)
        assert key3 != key1
    
    @pytest.mark.asyncio
    async def test_user_cache_invalidation(self, cache):
        user_id = "user_789"
        
        # Set multiple cache entries for user
        operations = [
            ("resume_analysis", {"resume": "data1"}),
            ("ats_scoring", {"resume": "data1", "job": "data2"}),
            ("voice_profile", {"documents": ["doc1", "doc2"]})
        ]
        
        for op_type, input_data in operations:
            await cache.set(op_type, user_id, input_data, {"result": f"{op_type}_result"})
        
        # Verify entries exist
        for op_type, input_data in operations:
            result = await cache.get(op_type, user_id, input_data)
            assert result is not None
        
        # Invalidate user cache
        invalidated = await cache.invalidate_user_cache(user_id, ["resume_analysis", "ats_scoring"])
        assert invalidated == 2
        
        # Verify correct entries were invalidated
        assert await cache.get("resume_analysis", user_id, operations[0][1]) is None
        assert await cache.get("ats_scoring", user_id, operations[1][1]) is None
        assert await cache.get("voice_profile", user_id, operations[2][1]) is not None


class TestCacheDecorators:
    """Test cache decorators functionality"""
    
    @pytest.mark.asyncio
    async def test_cached_operation_decorator(self):
        # Mock function call counter
        call_count = 0
        
        @cached_ai_operation('test_operation', user_id_param='user_id')
        async def mock_expensive_operation(user_id: str, input_text: str):
            nonlocal call_count
            call_count += 1
            await asyncio.sleep(0.01)  # Simulate processing time
            return {"processed": input_text, "timestamp": datetime.utcnow().isoformat()}
        
        user_id = "test_user"
        input_text = "test input data"
        
        # First call - should execute function
        result1 = await mock_expensive_operation(user_id, input_text)
        assert call_count == 1
        assert result1["processed"] == input_text
        
        # Second call with same parameters - should use cache
        result2 = await mock_expensive_operation(user_id, input_text)
        assert call_count == 1  # Function not called again
        assert result2 == result1  # Same result from cache
        
        # Different input - should execute function again
        result3 = await mock_expensive_operation(user_id, "different input")
        assert call_count == 2
        assert result3["processed"] == "different input"
    
    @pytest.mark.asyncio
    async def test_cache_context_manager(self):
        user_id = "context_user"
        operation_type = "test_context_op"
        input_data = {"test": "data"}
        
        # First use - cache miss
        async with CacheContext(operation_type, user_id, input_data) as cached:
            assert cached is None
            
            # Set result in context
            result = {"computed": "result"}
            success = await cached.set_result(result)
            assert success is True
        
        # Second use - cache hit
        async with CacheContext(operation_type, user_id, input_data) as cached:
            assert cached is not None
            assert cached == {"computed": "result"}


class TestCacheConfiguration:
    """Test cache configuration and TTL behavior"""
    
    @pytest.mark.asyncio
    async def test_different_ttl_per_operation(self):
        backend = InMemoryCacheBackend()
        cache = AICache(backend)
        
        user_id = "ttl_test_user"
        input_data = {"test": "data"}
        
        # Test different operation types have different TTLs
        operations = [
            ("resume_analysis", 3600),  # 1 hour
            ("job_analysis", 7200),     # 2 hours  
            ("cover_letter", 900)       # 15 minutes
        ]
        
        for op_type, expected_ttl in operations:
            # Set cache entry
            await cache.set(op_type, user_id, input_data, {"result": f"{op_type}_data"})
            
            # Check the created entry has correct TTL
            key = cache._generate_cache_key(op_type, user_id, input_data)
            entry = await backend.get(key)
            
            assert entry is not None
            ttl_diff = (entry.expires_at - entry.created_at).total_seconds()
            assert abs(ttl_diff - expected_ttl) < 10  # Allow small timing differences
    
    def test_cache_config_validation(self):
        # Test that all required operation types have configurations
        cache = AICache(InMemoryCacheBackend())
        
        required_operations = [
            'resume_analysis', 'job_analysis', 'ats_scoring',
            'cover_letter', 'voice_profile', 'ksc_response'
        ]
        
        for op_type in required_operations:
            config = cache.CACHE_CONFIGS.get(op_type)
            assert config is not None, f"Missing cache config for {op_type}"
            assert config.ttl_seconds > 0, f"Invalid TTL for {op_type}"
            assert config.max_entries > 0, f"Invalid max_entries for {op_type}"


@pytest.mark.integration
class TestCacheIntegration:
    """Integration tests for the complete cache system"""
    
    @pytest.mark.asyncio
    async def test_end_to_end_cache_flow(self):
        # Test complete flow: miss -> compute -> cache -> hit
        from app.core.cached_ai_operations import CachedAIOperations
        
        user_id = "integration_user"
        resume_text = "Experienced Python developer with expertise in FastAPI and React"
        
        # First call - cache miss, should compute result
        result1 = await CachedAIOperations.analyze_resume_cached(
            user_id=user_id,
            resume_text=resume_text,
            analysis_type="comprehensive"
        )
        
        assert result1 is not None
        assert "skills_extracted" in result1
        assert result1["analysis_type"] == "comprehensive"
        
        # Second call - cache hit, should return same result
        result2 = await CachedAIOperations.analyze_resume_cached(
            user_id=user_id,
            resume_text=resume_text,
            analysis_type="comprehensive"
        )
        
        assert result2 == result1
        
        # Different analysis type - cache miss, new computation
        result3 = await CachedAIOperations.analyze_resume_cached(
            user_id=user_id,
            resume_text=resume_text,
            analysis_type="basic"
        )
        
        assert result3 != result1  # Different result for different analysis type
        assert result3["analysis_type"] == "basic"
    
    @pytest.mark.asyncio
    async def test_cache_error_handling(self):
        # Test that cache errors don't break the application
        
        # Mock a failing backend
        failing_backend = AsyncMock()
        failing_backend.get = AsyncMock(side_effect=Exception("Cache error"))
        failing_backend.set = AsyncMock(return_value=False)
        
        cache = AICache(failing_backend)
        
        # Operations should still work despite cache failures
        # (In real implementation, this would fall back to direct computation)
        user_id = "error_test_user"
        input_data = {"test": "data"}
        
        # Get should return None on error
        result = await cache.get("test_operation", user_id, input_data)
        assert result is None
        
        # Set should return False on error
        success = await cache.set("test_operation", user_id, input_data, {"result": "data"})
        assert success is False


# Fixtures for all tests
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])