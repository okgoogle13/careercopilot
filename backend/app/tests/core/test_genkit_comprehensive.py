"""Comprehensive test suite for genkit.py (compatibility shim).

Coverage target: 85% (10+ test cases)
Functions tested:
- get_genkit_instance()
- get_model()
- LazyGenkitProxy._runtime()
- LazyGenkitProxy.flow()
- LazyGenkitProxy.generate()
- LazyGenkitProxy.__getattr__()
"""

from unittest.mock import MagicMock, patch

import pytest

from app.core.genkit import (
    LazyGenkitProxy,
    ai,
    get_genkit_instance,
    get_model,
)


class TestGenkitShimGetters:
    """Tests for getter functions in genkit.py shim."""

    def test_get_genkit_instance(self):
        """Test get_genkit_instance returns the lazy proxy result."""
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = MagicMock()
            result = get_genkit_instance()
            mock_get_model.assert_called_once()
            assert result is not None

    def test_get_genkit_instance_returns_none(self):
        """Test get_genkit_instance when model is not initialized."""
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None
            result = get_genkit_instance()
            assert result is None

    def test_get_model(self):
        """Test get_model backward-compatible alias."""
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = MagicMock()
            result = get_model()
            mock_get_model.assert_called_once()
            assert result is not None

    def test_get_model_returns_none(self):
        """Test get_model when model is not available."""
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None
            result = get_model()
            assert result is None


class TestLazyGenkitProxy:
    """Tests for LazyGenkitProxy class."""

    def test_proxy_creation(self):
        """Test creating a LazyGenkitProxy instance."""
        proxy = LazyGenkitProxy()
        assert proxy is not None
        assert isinstance(proxy, LazyGenkitProxy)

    def test_proxy_runtime_method(self):
        """Test _runtime method returns model."""
        proxy = LazyGenkitProxy()
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = MagicMock()
            result = proxy._runtime()
            assert result is not None

    def test_proxy_runtime_method_none(self):
        """Test _runtime method returns None when model unavailable."""
        proxy = LazyGenkitProxy()
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None
            result = proxy._runtime()
            assert result is None

    def test_proxy_flow_method_with_runtime(self):
        """Test flow method when runtime is available."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_flow_method = MagicMock(return_value="flow_decorator")
        mock_runtime.flow = mock_flow_method

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = proxy.flow(name="test_flow")
            assert result == "flow_decorator"
            mock_flow_method.assert_called_once()

    def test_proxy_flow_method_without_runtime(self):
        """Test flow method when runtime is not available."""
        proxy = LazyGenkitProxy()
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None
            result = proxy.flow(name="test_flow")
            # Should return a no-op decorator
            assert callable(result)

    def test_proxy_flow_noop_decorator_preserves_function(self):
        """Test that flow no-op decorator preserves function."""
        proxy = LazyGenkitProxy()
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None

            def test_func():
                return "test_result"

            decorator = proxy.flow()
            decorated = decorator(test_func)
            assert decorated is test_func
            assert decorated() == "test_result"

    @pytest.mark.asyncio
    async def test_proxy_generate_with_sync_runtime(self):
        """Test generate method with synchronous runtime."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_runtime.generate.return_value = "sync_result"

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = await proxy.generate("test_prompt")
            assert result == "sync_result"

    @pytest.mark.asyncio
    async def test_proxy_generate_with_async_runtime(self):
        """Test generate method with asynchronous runtime."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()

        async def async_generate(*args, **kwargs):
            return "async_result"

        mock_runtime.generate = async_generate

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = await proxy.generate("test_prompt")
            assert result == "async_result"

    @pytest.mark.asyncio
    async def test_proxy_generate_no_runtime(self):
        """Test generate method when runtime is not available."""
        proxy = LazyGenkitProxy()
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None
            with pytest.raises(RuntimeError, match="Genkit model not available"):
                await proxy.generate("test_prompt")

    def test_proxy_getattr_existing_attribute(self):
        """Test __getattr__ for existing runtime attribute."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_runtime.custom_method = MagicMock(return_value="custom_result")

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = proxy.custom_method()
            assert result == "custom_result"

    def test_proxy_getattr_no_runtime(self):
        """Test __getattr__ when runtime is not available."""
        proxy = LazyGenkitProxy()
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = None
            with pytest.raises(AttributeError):
                proxy.nonexistent_method()

    def test_proxy_getattr_non_callable(self):
        """Test __getattr__ for non-callable attribute."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_runtime.config = {"setting": "value"}

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = proxy.config
            assert result == {"setting": "value"}


class TestAiProxyGlobal:
    """Tests for the global 'ai' proxy instance."""

    def test_ai_proxy_instance_exists(self):
        """Test that 'ai' global proxy instance exists."""
        assert ai is not None
        assert isinstance(ai, LazyGenkitProxy)

    def test_ai_proxy_flow_method(self):
        """Test ai proxy flow method."""
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_runtime = MagicMock()
            mock_runtime.flow = MagicMock(return_value="flow_decorator")
            mock_get_model.return_value = mock_runtime

            result = ai.flow(name="test")
            assert result == "flow_decorator"

    @pytest.mark.asyncio
    async def test_ai_proxy_generate_method(self):
        """Test ai proxy generate method."""
        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_runtime = MagicMock()
            mock_runtime.generate.return_value = "generated_content"
            mock_get_model.return_value = mock_runtime

            result = await ai.generate("prompt")
            assert result == "generated_content"


class TestGenkitShimIntegration:
    """Integration tests for the genkit shim module."""

    def test_shim_exports_all_required_functions(self):
        """Test that all required functions are exported."""
        from app.core import genkit

        assert hasattr(genkit, "ai")
        assert hasattr(genkit, "get_genkit_instance")
        assert hasattr(genkit, "get_model")
        assert hasattr(genkit, "init_genkit")
        assert hasattr(genkit, "is_genkit_enabled")
        assert hasattr(genkit, "register_flow_function")

    def test_shim_all_exports(self):
        """Test __all__ exports are correct."""
        from app.core import genkit

        assert "ai" in genkit.__all__
        assert "get_genkit_instance" in genkit.__all__
        assert "get_model" in genkit.__all__

    def test_proxy_method_chaining(self):
        """Test that proxy methods can be chained."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_obj = MagicMock()
        mock_obj.method = MagicMock(return_value="result")
        mock_runtime.get_object = MagicMock(return_value=mock_obj)

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = proxy.get_object().method()
            assert result == "result"

    def test_multiple_proxy_calls(self):
        """Test multiple calls to proxy methods."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        call_count = 0

        def counting_method(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            return f"call_{call_count}"

        mock_runtime.test_method = counting_method

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result1 = proxy.test_method()
            result2 = proxy.test_method()
            assert result1 == "call_1"
            assert result2 == "call_2"

    def test_proxy_with_complex_arguments(self):
        """Test proxy with complex argument types."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()

        def complex_method(data, options=None):
            return {"data_received": data, "options": options}

        mock_runtime.process = complex_method

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = proxy.process(data={"key": "value"}, options={"setting": True})
            assert result["data_received"] == {"key": "value"}
            assert result["options"] == {"setting": True}


class TestGenkitShimEdgeCases:
    """Edge case tests for genkit shim."""

    def test_proxy_handles_none_return_value(self):
        """Test proxy handling None return values."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_runtime.get_data = MagicMock(return_value=None)

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            result = proxy.get_data()
            assert result is None

    def test_proxy_handles_empty_collections(self):
        """Test proxy handling empty collections."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_runtime.get_list = MagicMock(return_value=[])
        mock_runtime.get_dict = MagicMock(return_value={})

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            assert proxy.get_list() == []
            assert proxy.get_dict() == {}

    def test_proxy_preserves_exception_messages(self):
        """Test that proxy preserves exception messages."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()
        mock_runtime.failing_method = MagicMock(side_effect=ValueError("Test error message"))

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime
            with pytest.raises(ValueError, match="Test error message"):
                proxy.failing_method()

    @pytest.mark.asyncio
    async def test_proxy_generate_awaitable_detection(self):
        """Test that generate correctly detects awaitable results."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()

        # Test with both sync and async results
        sync_result = "sync"

        async def async_gen():
            return "async"

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime

            # Sync result
            mock_runtime.generate = MagicMock(return_value=sync_result)
            result1 = await proxy.generate("prompt1")
            assert result1 == "sync"

            # Async result
            mock_runtime.generate = MagicMock(return_value=async_gen())
            result2 = await proxy.generate("prompt2")
            assert result2 == "async"

    def test_proxy_multiple_runtime_changes(self):
        """Test proxy behavior when runtime changes between calls."""
        proxy = LazyGenkitProxy()
        runtime1 = MagicMock()
        runtime1.method = MagicMock(return_value="runtime1_result")
        runtime2 = MagicMock()
        runtime2.method = MagicMock(return_value="runtime2_result")

        with patch("app.core.genkit._get_model") as mock_get_model:
            # First call with runtime1
            mock_get_model.return_value = runtime1
            result1 = proxy.method()
            assert result1 == "runtime1_result"

            # Second call with runtime2
            mock_get_model.return_value = runtime2
            result2 = proxy.method()
            assert result2 == "runtime2_result"

    def test_flow_decorator_on_proxy(self):
        """Test using flow decorator through proxy."""
        proxy = LazyGenkitProxy()
        mock_runtime = MagicMock()

        def mock_flow_decorator(func):
            def wrapper(*args, **kwargs):
                return f"wrapped: {func(*args, **kwargs)}"

            return wrapper

        mock_runtime.flow = MagicMock(return_value=mock_flow_decorator)

        with patch("app.core.genkit._get_model") as mock_get_model:
            mock_get_model.return_value = mock_runtime

            def test_function():
                return "original"

            decorator = proxy.flow(name="test")
            decorated = decorator(test_function)
            result = decorated()
            assert "wrapped:" in result
            assert "original" in result
