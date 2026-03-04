"""Focused tests for the Ghostwriter agent."""

from pathlib import Path
from unittest.mock import AsyncMock

import pytest

from app.agents.ghostwriter import GhostwriterAgent
from app.services.flash_sidekick_service import FlashSidekickService


@pytest.fixture
def ghostwriter_agent():
    """Create a GhostwriterAgent instance for tests."""
    return GhostwriterAgent()


@pytest.fixture
def resume_path(tmp_path, monkeypatch):
    """Point the agent at a temporary resume file path."""
    path = tmp_path / "user_profile" / "resume.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr("app.agents.ghostwriter.RESUME_PATH", path)
    return path


@pytest.mark.asyncio
async def test_ghostwriter_agent_initialization(ghostwriter_agent):
    """The agent should initialize with the expected AI service."""
    assert isinstance(ghostwriter_agent, GhostwriterAgent)
    assert isinstance(ghostwriter_agent.ai_service, FlashSidekickService)


@pytest.mark.asyncio
async def test_load_resume_success(ghostwriter_agent, resume_path):
    """The agent should load the current resume content."""
    resume_path.write_text("# John Doe\nExperienced software engineer.\n", encoding="utf-8")

    resume_content = await ghostwriter_agent.load_resume()

    assert "John Doe" in resume_content


@pytest.mark.asyncio
async def test_load_resume_file_not_found(ghostwriter_agent, resume_path):
    """A missing resume should return the fallback guidance text."""
    if resume_path.exists():
        resume_path.unlink()

    resume_content = await ghostwriter_agent.load_resume()

    assert "No resume found" in resume_content


@pytest.mark.asyncio
async def test_load_resume_error_reading(ghostwriter_agent, resume_path, monkeypatch):
    """Read errors should be surfaced in the returned message."""
    resume_path.write_text("placeholder", encoding="utf-8")
    monkeypatch.setattr(
        Path,
        "read_text",
        lambda self, encoding="utf-8": (_ for _ in ()).throw(OSError("permission denied")),
    )

    resume_content = await ghostwriter_agent.load_resume()

    assert "Error loading resume" in resume_content


@pytest.mark.asyncio
async def test_generate_cover_letter_success(ghostwriter_agent, resume_path):
    """The agent should return AI output when summarization succeeds."""
    resume_path.write_text("Resume content", encoding="utf-8")
    ghostwriter_agent.ai_service = AsyncMock(spec=FlashSidekickService)
    ghostwriter_agent.ai_service.quick_summarize.return_value = "Generated cover letter content."

    cover_letter = await ghostwriter_agent.generate_cover_letter(
        {
            "title": "Software Engineer",
            "company": "Acme Corp",
            "description": "Develop and maintain web applications.",
        }
    )

    assert cover_letter == "Generated cover letter content."
    ghostwriter_agent.ai_service.quick_summarize.assert_awaited_once()


@pytest.mark.asyncio
async def test_generate_cover_letter_ai_error_uses_fallback(ghostwriter_agent, resume_path):
    """AI errors should return the built-in fallback template."""
    resume_path.write_text("Resume content", encoding="utf-8")
    ghostwriter_agent.ai_service = AsyncMock(spec=FlashSidekickService)
    ghostwriter_agent.ai_service.quick_summarize.side_effect = Exception("AI service error")

    cover_letter = await ghostwriter_agent.generate_cover_letter(
        {"title": "Software Engineer", "company": "Acme Corp"}
    )

    assert "Error: AI service error" in cover_letter
    assert "Dear Hiring Manager at Acme Corp" in cover_letter


@pytest.mark.asyncio
async def test_generate_cover_letter_empty_job_data(ghostwriter_agent, resume_path):
    """Missing job data should use the default prompt placeholders."""
    resume_path.write_text("Resume content", encoding="utf-8")
    ghostwriter_agent.ai_service = AsyncMock(spec=FlashSidekickService)
    ghostwriter_agent.ai_service.quick_summarize.return_value = "Prompt handled."

    await ghostwriter_agent.generate_cover_letter({})

    prompt = ghostwriter_agent.ai_service.quick_summarize.await_args.args[0]
    assert "the position" in prompt
    assert "your organization" in prompt
    assert "See job posting" in prompt


@pytest.mark.asyncio
async def test_generate_cover_letter_markdown_cleanup(ghostwriter_agent, resume_path):
    """Markdown code fences should be stripped from AI output."""
    resume_path.write_text("Resume content", encoding="utf-8")
    ghostwriter_agent.ai_service = AsyncMock(spec=FlashSidekickService)
    ghostwriter_agent.ai_service.quick_summarize.return_value = "```markdown\nThis is a test.\n```"

    cover_letter = await ghostwriter_agent.generate_cover_letter(
        {"title": "Software Engineer", "company": "Acme Corp"}
    )

    assert cover_letter == "This is a test."


@pytest.mark.asyncio
async def test_generate_cover_letter_truncates_long_inputs(ghostwriter_agent, resume_path):
    """Prompt generation should cap long resume and job description content."""
    resume_path.write_text("b" * 4000, encoding="utf-8")
    ghostwriter_agent.ai_service = AsyncMock(spec=FlashSidekickService)
    ghostwriter_agent.ai_service.quick_summarize.return_value = "Prompt handled."

    await ghostwriter_agent.generate_cover_letter({"description": "a" * 3001})

    prompt = ghostwriter_agent.ai_service.quick_summarize.await_args.args[0]
    assert "a" * 2000 in prompt
    assert "a" * 2001 not in prompt
    assert "b" * 3000 in prompt
    assert "b" * 3001 not in prompt
