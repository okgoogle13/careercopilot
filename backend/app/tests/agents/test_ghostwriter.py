"""
Tests for the Ghostwriter Agent.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from pathlib import Path
from app.agents.ghostwriter import GhostwriterAgent
from app.services.flash_sidekick_service import FlashSidekickService

# Create a test client
# client = TestClient(app)  # Assuming you have a FastAPI app instance

# Mock data for testing
TEST_JOB_DATA = {
    "title": "Software Engineer",
    "company": "Acme Corp",
    "description": "Develop and maintain web applications.",
    "salary": "$100,000 - $150,000",
    "deadline": "2024-01-31",
}

# Create a dummy resume file for testing
RESUME_CONTENT = """
# John Doe
## Summary
A highly motivated software engineer with 5+ years of experience.

## Experience
- Software Engineer at XYZ Inc (2018-2023)
"""
RESUME_PATH = Path("user_profile/resume.md")
RESUME_PATH.parent.mkdir(parents=True, exist_ok=True)
RESUME_PATH.write_text(RESUME_CONTENT)


@pytest.fixture
async def ghostwriter_agent():
    """Fixture to create a GhostwriterAgent instance."""
    agent = GhostwriterAgent()
    return agent

@pytest.fixture
async def mock_flash_sidekick_service():
    """Fixture to mock the FlashSidekickService."""
    mock_service = AsyncMock(spec=FlashSidekickService)
    return mock_service

@pytest.mark.asyncio
async def test_ghostwriter_agent_initialization(ghostwriter_agent):
    """Test that the GhostwriterAgent initializes correctly."""
    assert isinstance(ghostwriter_agent, GhostwriterAgent)
    assert isinstance(ghostwriter_agent.ai_service, FlashSidekickService)

@pytest.mark.asyncio
async def test_load_resume_success(ghostwriter_agent):
    """Test that the load_resume method successfully loads the resume."""
    resume_content = await ghostwriter_agent.load_resume()
    assert resume_content == RESUME_CONTENT

@pytest.mark.asyncio
async def test_load_resume_file_not_found(ghostwriter_agent):
    """Test that the load_resume method handles the case where the resume file is not found."""
    Path("user_profile/resume.md").unlink()  # Remove the resume file
    resume_content = await ghostwriter_agent.load_resume()
    assert "No resume found" in resume_content

@pytest.mark.asyncio
async def test_load_resume_error_reading(ghostwriter_agent):
    """Test that the load_resume method handles errors when reading the resume file."""
    # Create a file with invalid permissions
    invalid_resume_path = Path("user_profile/invalid_resume.md")
    invalid_resume_path.parent.mkdir(parents=True, exist_ok=True)
    invalid_resume_path.write_text("test")
    invalid_resume_path.chmod(0)  # Remove read permissions

    try:
        await ghostwriter_agent.load_resume()
    except Exception as e:
        pass
    finally:
        invalid_resume_path.chmod(0o644)
        invalid_resume_path.unlink()

@pytest.mark.asyncio
@patch('app.agents.ghostwriter.FlashSidekickService.quick_summarize', new_callable=AsyncMock)
async def test_generate_cover_letter_success(
    ghostwriter_agent,
    mock_quick_summarize,
    mock_flash_sidekick_service
):
    """Test that the generate_cover_letter method successfully generates a cover letter."""
    mock_quick_summarize.return_value = "Generated cover letter content."
    cover_letter = await ghostwriter_agent.generate_cover_letter(TEST_JOB_DATA)
    assert cover_letter == "Generated cover letter content."
    mock_quick_summarize.assert_called_once()

@pytest.mark.asyncio
@patch('app.agents.ghostwriter.FlashSidekickService.quick_summarize', new_callable=AsyncMock)
async def test_generate_cover_letter_ai_error(
    ghostwriter_agent,
    mock_quick_summarize,
    mock_flash_sidekick_service
):
    """Test that the generate_cover_letter method handles errors from the AI service."""
    mock_quick_summarize.side_effect = Exception("AI service error")
    cover_letter = await ghostwriter_agent.generate_cover_letter(TEST_JOB_DATA)
    assert "Error generating cover letter" in cover_letter

@pytest.mark.asyncio
async def test_generate_cover_letter_empty_job_data(ghostwriter_agent):
    """Test that the generate_cover_letter method handles empty job data."""
    cover_letter = await ghostwriter_agent.generate_cover_letter({})
    assert "the position" in cover_letter
    assert "your organization" in cover_letter
    assert "See job posting" in cover_letter

@pytest.mark.asyncio
async def test_generate_cover_letter_markdown_cleanup(ghostwriter_agent):
    """Test that the generate_cover_letter method cleans up markdown formatting."""
    mock_flash_sidekick_service = AsyncMock(spec=FlashSidekickService)
    mock_flash_sidekick_service.quick_summarize.return_value = "```markdown\nThis is a test.\n```"
    ghostwriter_agent.ai_service = mock_flash_sidekick_service
    cover_letter = await ghostwriter_agent.generate_cover_letter(TEST_JOB_DATA)
    assert "This is a test." in cover_letter
    assert "```" not in cover_letter

@pytest.mark.asyncio
async def test_generate_cover_letter_long_job_description(ghostwriter_agent):
    """Test that the generate_cover_letter method handles long job descriptions."""
    long_description = "a" * 3001
    job_data = {"description": long_description}
    cover_letter = await ghostwriter_agent.generate_cover_letter(job_data)
    assert "a" * 2000 in cover_letter

@pytest.mark.asyncio
async def test_generate_cover_letter_long_resume(ghostwriter_agent):
    """Test that the generate_cover_letter method handles long resumes."""
    long_resume = "b" * 3001
    RESUME_PATH.write_text(long_resume)
    cover_letter = await ghostwriter_agent.generate_cover_letter(TEST_JOB_DATA)
    assert "b" * 3000 in cover_letter
    RESUME_PATH.write_text(RESUME_CONTENT) # Restore original resume

# Cleanup
RESUME_PATH.unlink()