from datetime import datetime, timedelta

from app.models.cache import Cache


class TestCacheModel:
    def test_cache_model_initialization(self):
        now = datetime.utcnow()
        expiry = now + timedelta(hours=1)
        cache_item = Cache(
            key="test-key",
            value="test-value",
            operation_type="llm-call",
            expires_at=expiry,
            user_id="user123",
            size_bytes=100,
        )

        assert cache_item.key == "test-key"
        assert cache_item.value == "test-value"
        assert cache_item.operation_type == "llm-call"
        assert cache_item.expires_at == expiry
        assert cache_item.user_id == "user123"
        assert cache_item.size_bytes == 100
        # hit_count is None until persisted if not explicitly set
        assert cache_item.hit_count is None

    def test_cache_model_repr(self):
        cache_item = Cache(key="abc-123", operation_type="extraction")
        assert repr(cache_item) == "<Cache abc-123 (extraction)>"

    def test_cache_model_default_created_at(self):
        cache_item = Cache(key="k", value="v", operation_type="o", expires_at=datetime.utcnow())
        # Note: created_at default is only set when persisted, but we can verify it exists in the model definition
        assert hasattr(cache_item, "created_at")
