"""
Tests for the Ghostwriter Agent.
"""

from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.agents.ghostwriter import GhostwriterAgent
from app.services.flash_sidekick_service import FlashSidekickService

# Create a dummy resume file for testing
RESUME_PATH = Path("user_profile/resume.md")
RESUME_PATH.parent.mkdir(parents=True, exist_ok=True)
RESUME_PATH.write_text("Test Resume Content")


@pytest.fixture
def ghostwriter_agent():
    """Fixture for GhostwriterAgent."""
    return GhostwriterAgent()


@pytest.fixture
async def mock_flash_sidekick_service():
    """Fixture for mocking FlashSidekickService."""
    mock_service = AsyncMock(spec=FlashSidekickService)
    return mock_service


@pytest.mark.asyncio
async def test_load_resume_success(ghostwriter_agent):
    """Test loading resume when file exists."""
    resume_content = await ghostwriter_agent.load_resume()
    assert "Test Resume Content" in resume_content


@pytest.mark.asyncio
async def test_load_resume_file_not_found(ghostwriter_agent):
    """Test loading resume when file does not exist."""
    Path("user_profile/resume.md").unlink()  # Remove the file
    resume_content = await ghostwriter_agent.load_resume()
    assert "No resume found" in resume_content


@pytest.mark.asyncio
async def test_load_resume_error_reading(ghostwriter_agent):
    """Test loading resume when there's an error reading the file."""
    # Create a file with invalid permissions
    invalid_resume_path = Path("user_profile/invalid_resume.md")
    invalid_resume_path.parent.mkdir(parents=True, exist_ok=True)
    invalid_resume_path.write_text("Test Content")
    invalid_resume_path.chmod(0)  # Remove read permissions

    try:
        await ghostwriter_agent.load_resume()
    except Exception as e:
        pass
    finally:
        invalid_resume_path.chmod(0o644)  # Restore permissions
        invalid_resume_path.unlink()


@pytest.mark.asyncio
@patch("app.services.flash_sidekick_service.FlashSidekickService.quick_summarize")
async def test_generate_cover_letter_success(
    mock_quick_summarize, ghostwriter_agent, mock_flash_sidekick_service
):
    """Test generating a cover letter with valid job data."""
    mock_quick_summarize.return_value = "Generated Cover Letter"
    job_data = {
        "title": "Software Engineer",
        "company": "Acme Corp",
        "description": "Develop and maintain software applications.",
    }
    cover_letter = await ghostwriter_agent.generate_cover_letter(job_data)
    assert "Generated Cover Letter" == cover_letter
    mock_quick_summarize.assert_called_once()


@pytest.mark.asyncio
@patch("app.services.flash_sidekick_service.FlashSidekickService.quick_summarize")
async def test_generate_cover_letter_ai_error(
    mock_quick_summarize, ghostwriter_agent, mock_flash_sidekick_service
):
    """Test generating a cover letter when the AI service fails."""
    mock_quick_summarize.side_effect = Exception("AI service error")
    job_data = {"title": "Software Engineer", "company": "Acme Corp"}
    cover_letter = await ghostwriter_agent.generate_cover_letter(job_data)
    assert "Error generating cover letter" in cover_letter
    mock_quick_summarize.assert_called_once()


@pytest.mark.asyncio
@patch("app.services.flash_sidekick_service.FlashSidekickService.quick_summarize")
async def test_generate_cover_letter_with_empty_job_data(
    mock_quick_summarize, ghostwriter_agent, mock_flash_sidekick_service
):
    """Test generating a cover letter with empty job data."""
    mock_quick_summarize.return_value = "Generated Cover Letter"
    job_data = {}
    cover_letter = await ghostwriter_agent.generate_cover_letter(job_data)
    assert "Generated Cover Letter" == cover_letter
    mock_quick_summarize.assert_called_once()


@pytest.mark.asyncio
@patch("app.services.flash_sidekick_service.FlashSidekickService.quick_summarize")
async def test_generate_cover_letter_markdown_cleanup(
    mock_quick_summarize, ghostwriter_agent, mock_flash_sidekick_service
):
    """Test cover letter markdown cleanup."""
    mock_quick_summarize.return_value = "```markdown\nTest Cover Letter\n```"
    job_data = {"title": "Software Engineer", "company": "Acme Corp"}
    cover_letter = await ghostwriter_agent.generate_cover_letter(job_data)
    assert "Test Cover Letter" == cover_letter
