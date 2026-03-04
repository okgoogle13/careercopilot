import sys
from datetime import datetime


class TestCacheModel:
    def test_cache_model_fields(self):
        if "app.models.cache" in sys.modules:
            del sys.modules["app.models.cache"]
        from app.models.cache import Cache

        pass
