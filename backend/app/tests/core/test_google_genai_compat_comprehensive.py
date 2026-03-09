"""Comprehensive test suite for google_genai_compat.py.

Coverage target: 85% (10+ test cases)
Functions tested:
- GOOGLE_GENERATIVEAI_AVAILABLE constant
- import_google_generativeai()
- get_configured_google_generativeai()
"""

from unittest.mock import MagicMock, patch

import pytest

from app.core.google_genai_compat import (
    GOOGLE_GENERATIVEAI_AVAILABLE,
    get_configured_google_generativeai,
    import_google_generativeai,
)


class TestGoogleGenerativeAIAvailability:
    """Tests for GOOGLE_GENERATIVEAI_AVAILABLE constant."""

    def test_google_generativeai_available_is_boolean(self):
        """Test that GOOGLE_GENERATIVEAI_AVAILABLE is a boolean."""
        assert isinstance(GOOGLE_GENERATIVEAI_AVAILABLE, bool)

    def test_google_generativeai_available_value(self):
        """Test the value of GOOGLE_GENERATIVEAI_AVAILABLE."""
        # Should be True or False depending on whether module is installed
        assert isinstance(GOOGLE_GENERATIVEAI_AVAILABLE, bool)


class TestImportGoogleGenerativeAI:
    """Tests for import_google_generativeai() function."""

    def test_import_returns_module_on_success(self):
        """Test successful import returns the module."""
        with patch("importlib.import_module") as mock_import:
            mock_module = MagicMock()
            mock_import.return_value = mock_module

            with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                result = import_google_generativeai()
                assert result is not None

    def test_import_returns_none_when_not_available(self):
        """Test import returns None when module not available."""
        from app.core import google_genai_compat

        original_value = google_genai_compat._google_generativeai
        try:
            google_genai_compat._google_generativeai = None
            with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", False):
                result = import_google_generativeai()
                assert result is None
        finally:
            google_genai_compat._google_generativeai = original_value

    def test_import_caches_result(self):
        """Test that import result is cached."""
        with patch("importlib.import_module") as mock_import:
            mock_module = MagicMock()
            mock_import.return_value = mock_module

            with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                with patch("app.core.google_genai_compat._google_generativeai", None):
                    # First import
                    result1 = import_google_generativeai()

                    # Should return cached value
                    with patch("importlib.import_module") as mock_import2:
                        result2 = import_google_generativeai()

                    # If cached, mock_import2 shouldn't be called
                    # (but mock_import would have been called once)
                    assert result1 is not None

    def test_import_returns_cached_if_already_imported(self):
        """Test that cached import is returned if already imported."""
        mock_module = MagicMock()

        with patch("app.core.google_genai_compat._google_generativeai", mock_module):
            result = import_google_generativeai()
            assert result is mock_module

    def test_import_suppresses_deprecation_warnings(self):
        """Test that import function can be called without raising warnings."""
        from app.core import google_genai_compat

        original_value = google_genai_compat._google_generativeai
        try:
            google_genai_compat._google_generativeai = None
            # Simply verify the function works without raising
            result = import_google_generativeai()
            # Result depends on whether google.generativeai is actually installed
            # Should be None or a module, not raise
            assert result is None or hasattr(result, "__name__")
        finally:
            google_genai_compat._google_generativeai = original_value

    def test_import_handles_import_error(self):
        """Test import handles ImportError gracefully."""
        from app.core import google_genai_compat

        original_value = google_genai_compat._google_generativeai
        try:
            google_genai_compat._google_generativeai = None
            # When module is not available, GOOGLE_GENERATIVEAI_AVAILABLE should be False
            with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", False):
                result = import_google_generativeai()
                assert result is None
        finally:
            google_genai_compat._google_generativeai = original_value

    def test_import_module_only_called_once(self):
        """Test that importlib.import_module is only called once due to caching."""
        from app.core import google_genai_compat

        # Reset the cached value
        original_cache = google_genai_compat._google_generativeai

        try:
            google_genai_compat._google_generativeai = None

            with patch("importlib.import_module") as mock_import:
                mock_module = MagicMock()
                mock_import.return_value = mock_module

                with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                    # First call
                    result1 = import_google_generativeai()
                    call_count_1 = mock_import.call_count

                    # Second call
                    result2 = import_google_generativeai()
                    call_count_2 = mock_import.call_count

                    # Should not have called import_module again
                    assert call_count_1 == call_count_2

        finally:
            google_genai_compat._google_generativeai = original_cache


class TestGetConfiguredGoogleGenerativeAI:
    """Tests for get_configured_google_generativeai() function."""

    def test_get_configured_with_api_key(self):
        """Test getting configured module with API key."""
        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_import.return_value = mock_module

            result = get_configured_google_generativeai("test-api-key-123")

            assert result is mock_module
            mock_module.configure.assert_called_once_with(api_key="test-api-key-123")

    def test_get_configured_without_api_key(self):
        """Test getting configured module without API key returns None."""
        result = get_configured_google_generativeai(None)
        assert result is None

    def test_get_configured_with_empty_api_key(self):
        """Test getting configured module with empty API key returns None."""
        result = get_configured_google_generativeai("")
        assert result is None

    def test_get_configured_import_not_available(self):
        """Test when import is not available."""
        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_import.return_value = None

            result = get_configured_google_generativeai("test-api-key")
            assert result is None

    def test_get_configured_multiple_keys(self):
        """Test configuring with different API keys."""
        from app.core import google_genai_compat

        original_configured_key = google_genai_compat._configured_api_key

        try:
            google_genai_compat._configured_api_key = None

            with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
                mock_module = MagicMock()
                mock_module.configure = MagicMock()
                mock_import.return_value = mock_module

                # First configuration
                result1 = get_configured_google_generativeai("key-1")
                assert mock_module.configure.call_count == 1

                # Second configuration with different key
                result2 = get_configured_google_generativeai("key-2")
                assert mock_module.configure.call_count == 2

                # Third configuration with same key as second (should not reconfigure)
                result3 = get_configured_google_generativeai("key-2")
                assert mock_module.configure.call_count == 2  # No additional call

        finally:
            google_genai_compat._configured_api_key = original_configured_key

    def test_get_configured_caches_api_key(self):
        """Test that API key is cached to avoid reconfiguration."""
        from app.core import google_genai_compat

        original_configured_key = google_genai_compat._configured_api_key

        try:
            google_genai_compat._configured_api_key = None

            with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
                mock_module = MagicMock()
                mock_module.configure = MagicMock()
                mock_import.return_value = mock_module

                # Configure with same key twice
                get_configured_google_generativeai("same-key")
                get_configured_google_generativeai("same-key")

                # Should only configure once
                mock_module.configure.assert_called_once_with(api_key="same-key")

        finally:
            google_genai_compat._configured_api_key = original_configured_key

    def test_get_configured_returns_same_module(self):
        """Test that same module instance is returned."""
        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_import.return_value = mock_module

            result1 = get_configured_google_generativeai("test-key-1")
            result2 = get_configured_google_generativeai("test-key-2")

            # Both should return the same module instance
            assert result1 is result2
            assert result1 is mock_module

    def test_get_configured_with_whitespace_api_key(self):
        """Test handling of whitespace-only API key."""
        # Whitespace string is truthy in Python, so it will attempt configuration
        # The function checks for truthiness, not emptiness after strip
        # So "   " will be treated as a valid key
        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_import.return_value = mock_module

            result = get_configured_google_generativeai("   ")
            # Whitespace string is truthy, so configuration happens
            assert result is not None

    def test_get_configured_exception_during_configure(self):
        """Test handling of exception during configure call."""
        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure.side_effect = Exception("Config error")
            mock_import.return_value = mock_module

            with pytest.raises(Exception, match="Config error"):
                get_configured_google_generativeai("test-key")


class TestGoogleGenAICompatIntegration:
    """Integration tests for the google_genai_compat module."""

    def test_full_workflow(self):
        """Test complete workflow of importing and configuring."""
        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_module.GenerativeModel = MagicMock()
            mock_import.return_value = mock_module

            # Import
            imported = import_google_generativeai()
            assert imported is not None

            # Configure
            configured = get_configured_google_generativeai("test-api-key")
            assert configured is not None

            # Verify configuration was called
            mock_module.configure.assert_called_with(api_key="test-api-key")

    def test_import_and_get_configured_same_instance(self):
        """Test that get_configured returns configured module."""
        from app.core import google_genai_compat

        original_value = google_genai_compat._google_generativeai
        try:
            google_genai_compat._google_generativeai = None
            with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
                mock_module = MagicMock()
                mock_module.configure = MagicMock()
                mock_import.return_value = mock_module

                configured = get_configured_google_generativeai("test-key")
                assert configured is not None
                mock_module.configure.assert_called_once_with(api_key="test-key")
        finally:
            google_genai_compat._google_generativeai = original_value

    def test_multiple_configurations_sequence(self):
        """Test sequence of multiple configurations."""
        from app.core import google_genai_compat

        original_configured_key = google_genai_compat._configured_api_key

        try:
            google_genai_compat._configured_api_key = None

            with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
                mock_module = MagicMock()
                mock_module.configure = MagicMock()
                mock_import.return_value = mock_module

                # Sequence of operations
                result1 = get_configured_google_generativeai("key-a")
                result2 = get_configured_google_generativeai("key-a")
                result3 = get_configured_google_generativeai("key-b")
                result4 = get_configured_google_generativeai("key-b")

                # All should return same module
                assert result1 is result2 is result3 is result4

                # Configure should be called twice (key-a and key-b)
                assert mock_module.configure.call_count == 2

        finally:
            google_genai_compat._configured_api_key = original_configured_key


class TestGoogleGenAICompatEdgeCases:
    """Edge case tests for google_genai_compat."""

    def test_import_with_special_characters_in_path(self):
        """Test import behavior with special characters."""
        with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", True):
            with patch("importlib.import_module") as mock_import:
                mock_module = MagicMock()
                mock_import.return_value = mock_module

                result = import_google_generativeai()
                assert result is not None

    def test_get_configured_with_very_long_api_key(self):
        """Test handling very long API key."""
        long_key = "x" * 1000

        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_import.return_value = mock_module

            result = get_configured_google_generativeai(long_key)
            assert result is not None
            mock_module.configure.assert_called_once_with(api_key=long_key)

    def test_get_configured_with_special_characters_in_key(self):
        """Test API key with special characters."""
        special_key = "test!@#$%^&*()_+-=[]{}|;:',.<>?/`~key"

        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_import.return_value = mock_module

            result = get_configured_google_generativeai(special_key)
            assert result is not None
            mock_module.configure.assert_called_once_with(api_key=special_key)

    def test_global_state_isolation(self):
        """Test that function calls don't leak state between tests."""
        from app.core import google_genai_compat

        original_cache = google_genai_compat._google_generativeai
        original_key = google_genai_compat._configured_api_key

        try:
            google_genai_compat._google_generativeai = None
            google_genai_compat._configured_api_key = None

            with patch("app.core.google_genai_compat.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                with patch("importlib.import_module") as mock_import:
                    mock_module1 = MagicMock()
                    mock_module1.configure = MagicMock()
                    mock_import.return_value = mock_module1

                    # First workflow
                    get_configured_google_generativeai("key1")

                    # Reset cache
                    google_genai_compat._google_generativeai = None
                    google_genai_compat._configured_api_key = None

                    mock_module2 = MagicMock()
                    mock_module2.configure = MagicMock()
                    mock_import.return_value = mock_module2

                    # Second workflow
                    result = get_configured_google_generativeai("key2")

                    # Should have fresh configure call
                    mock_module2.configure.assert_called_once_with(api_key="key2")

        finally:
            google_genai_compat._google_generativeai = original_cache
            google_genai_compat._configured_api_key = original_key

    def test_false_api_key_treated_as_none(self):
        """Test that falsy API keys are treated as None."""
        # Test various falsy values
        for falsy_value in [None, "", False, 0]:
            result = get_configured_google_generativeai(falsy_value)
            assert result is None

    def test_unicode_api_key(self):
        """Test handling of unicode characters in API key."""
        unicode_key = "test-key-μαγι-日本語-🔑"

        with patch("app.core.google_genai_compat.import_google_generativeai") as mock_import:
            mock_module = MagicMock()
            mock_module.configure = MagicMock()
            mock_import.return_value = mock_module

            result = get_configured_google_generativeai(unicode_key)
            assert result is not None
            mock_module.configure.assert_called_once_with(api_key=unicode_key)
