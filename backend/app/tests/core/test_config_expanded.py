from unittest.mock import MagicMock, patch

import pytest

from app.core import config
from app.core.config import PersonalCareerConfig, get_personal_config, validate_required_api_keys


class TestConfigExpanded:
    def test_get_personal_config_singleton(self):
        # Reset global state for test
        config._personal_config = None

        cfg1 = get_personal_config()
        assert isinstance(cfg1, PersonalCareerConfig)
        assert cfg1.name == "Your Name"

        cfg2 = get_personal_config()
        assert cfg1 is cfg2  # Singleton check

    def test_validate_required_api_keys_success(self):
        with patch("app.core.config.settings") as mock_settings:
            mock_settings.enable_ai_features = True
            mock_settings.gemini_api_key = "test-key"
            mock_settings.anthropic_api_key = "test-key-2"

            # Should not raise
            validate_required_api_keys()

    def test_validate_required_api_keys_disabled(self):
        with patch("app.core.config.settings") as mock_settings:
            mock_settings.enable_ai_features = False

            # Should not raise even if keys are missing
            validate_required_api_keys()

    def test_validate_required_api_keys_missing_critical(self):
        with patch("app.core.config.settings") as mock_settings:
            mock_settings.enable_ai_features = True
            mock_settings.gemini_api_key = ""

            with pytest.raises(RuntimeError) as excinfo:
                validate_required_api_keys()
            assert "Critical API keys are missing: GEMINI_API_KEY" in str(excinfo.value)

    def test_validate_required_api_keys_missing_optional_warning(self):
        with patch("app.core.config.settings") as mock_settings:
            mock_settings.enable_ai_features = True
            mock_settings.gemini_api_key = "test-key"
            mock_settings.anthropic_api_key = ""

            with patch("logging.getLogger") as mock_get_logger:
                mock_logger = MagicMock()
                mock_get_logger.return_value = mock_logger

                validate_required_api_keys()

                # Check if warning was logged
                mock_logger.warning.assert_called()
                args, _ = mock_logger.warning.call_args
                assert "Optional API keys are missing" in args[0]
