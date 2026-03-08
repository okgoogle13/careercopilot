import asyncio
import os
import sys
import json
from unittest.mock import MagicMock, patch

# Add current dir to path to import servers
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flash_sidekick import AsyncFlashSidekickServer
from design_system_sidekick import DesignSystemSidekickServer

async def test_flash_sidekick_fallback():
    print("\n--- Testing Flash Sidekick Fallback ---")
    with patch.dict(os.environ, {"GITHUB_TOKEN": "ghp_fake_token"}):
        server = AsyncFlashSidekickServer()

    # Mock Gemini failure
    server._get_model = MagicMock(return_value=None)

    # Mock GitHub Models (Azure AI Inference)
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = "GitHub Models Fallback Response"

    with patch("flash_sidekick.ChatCompletionsClient") as mock_cls, \
         patch("flash_sidekick.AzureKeyCredential") as mock_cred:
        mock_instance = mock_cls.return_value
        # Async context manager setup
        async def async_enter(*args, **kwargs): return mock_instance
        async def async_exit(*args, **kwargs): pass
        mock_instance.__aenter__ = async_enter
        mock_instance.__aexit__ = async_exit

        # Async complete
        async def mock_complete(*args, **kwargs):
            return mock_response
        mock_instance.complete = mock_complete

        result = await server._call_gemini_async("pro", "Test prompt")
        print(f"Result: {result}")
        assert "GitHub Models Fallback" in result
        print("✅ Flash Sidekick Fallback Verified")

async def test_design_sidekick_fallback():
    print("\n--- Testing Design System Sidekick Fallback ---")
    with patch.dict(os.environ, {"GITHUB_TOKEN": "ghp_fake_token"}):
        server = DesignSystemSidekickServer()

    server.gemini_model = MagicMock()
    # Force Gemini failure
    server.gemini_model.generate_content.side_effect = Exception("Gemini Down")

    # Mock GitHub Models success
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = '{"compliance": true, "score": 95}'

    with patch("design_system_sidekick.ChatCompletionsClient") as mock_cls, \
         patch("design_system_sidekick.AzureKeyCredential") as mock_cred:
        mock_instance = mock_cls.return_value
        # Sync complete (called in executor)
        mock_instance.complete.return_value = mock_response

        result = await server._call_llm_async("Test validation prompt", json_mode=True)
        print(f"Result: {result}")
        assert "compliance" in result
        print("✅ Design System Sidekick Fallback Verified")

async def main():
    try:
        await test_flash_sidekick_fallback()
        await test_design_sidekick_fallback()
        print("\n✨ All Fallback Tests Passed!")
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
