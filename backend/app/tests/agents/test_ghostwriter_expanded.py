"""Expanded tests for GhostwriterAgent covering resume loading and fallback logic."""

from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.agents.ghostwriter import GhostwriterAgent


@pytest.fixture
def agent():
    return GhostwriterAgent()


class TestGhostwriterExpanded:
    @pytest.mark.asyncio
    async def test_load_resume_not_found(self, agent):
        """Should return placeholder when resume file missing."""
        with patch("app.agents.ghostwriter.RESUME_PATH") as mock_path:
            mock_path.exists.return_value = False
            content = await agent.load_resume()
            assert "No resume found" in content

    @pytest.mark.asyncio
    async def test_load_resume_read_error(self, agent):
        """Should return error message when file read fails."""
        with patch("app.agents.ghostwriter.RESUME_PATH") as mock_path:
            mock_path.exists.return_value = True
            mock_path.read_text.side_effect = Exception("Read error")
            content = await agent.load_resume()
            assert "Error loading resume" in content

    @pytest.mark.asyncio
    async def test_generate_cover_letter_markdown_cleanup(self, agent):
        """Should clean up markdown and text prefixes in AI response."""
        agent.ai_service.quick_summarize = AsyncMock(return_value="```markdown\nMy Letter\n```")
        # Mock load_resume to avoid file dependency
        agent.load_resume = AsyncMock(return_value="My Resume")

        result = await agent.generate_cover_letter({"title": "Role", "company": "Co"})
        assert result == "My Letter"

        # Test text prefix
        agent.ai_service.quick_summarize = AsyncMock(return_value="```text\nTyped Letter\n```")
        result = await agent.generate_cover_letter({"title": "Role", "company": "Co"})
        assert result == "Typed Letter"

    @pytest.mark.asyncio
    async def test_generate_cover_letter_fallback(self, agent):
        """Should return fallback template when AI service fails."""
        agent.ai_service.quick_summarize = AsyncMock(side_effect=Exception("AI Down"))
        agent.load_resume = AsyncMock(return_value="My Resume")

        result = await agent.generate_cover_letter({"title": "Backend Dev", "company": "Google"})
        assert "Dear Hiring Manager at Google" in result
        assert "AI generation failed" in result

    @pytest.mark.asyncio
    async def test_main_smoke(self):
        """Smoke test the agent initialization."""
        from app.agents.ghostwriter import GhostwriterAgent

        agent = GhostwriterAgent()
        assert agent is not None
