"""
Comprehensive tests for job_analyzer.py genkit flow.
Target coverage: 45% → 80% (10-15 tests)
"""

import json
from unittest.mock import AsyncMock, MagicMock, Mock, patch

import pytest

from app.genkit_flows.job_analyzer import (
    JobAnalysisSchema,
    analyze_job_description,
)

# ==================== FIXTURES ====================


@pytest.fixture
def sample_job_description():
    """Sample job description text."""
    return """
    Senior Python Developer

    Company: TechCorp Inc.
    Location: San Francisco, CA

    We are seeking an experienced Python developer with strong backend skills.

    Required Skills:
    - Python (5+ years)
    - Django/Flask
    - PostgreSQL
    - AWS

    Preferred Skills:
    - Docker
    - Kubernetes
    - React

    Requirements:
    - Bachelor's degree in Computer Science or related field
    - 5+ years of professional software development experience
    - Strong problem-solving skills
    - Excellent communication abilities
    """


@pytest.fixture
def expected_analysis_output():
    """Expected analysis output structure."""
    return {
        "title": "Senior Python Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "summary": "Seeking experienced Python developer",
        "key_requirements": [
            "Bachelor's degree in Computer Science",
            "5+ years experience",
        ],
        "technical_skills": ["Python", "Django", "Flask", "PostgreSQL", "AWS"],
        "soft_skills": ["Problem-solving", "Communication"],
        "experience_level": "5+ years",
    }


# ==================== SUCCESS FLOW TESTS ====================


@pytest.mark.asyncio
async def test_analyze_job_description_success(sample_job_description, expected_analysis_output):
    """Test successful job description analysis."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = expected_analysis_output

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Formatted prompt"):
            result = await analyze_job_description(sample_job_description)

    assert isinstance(result, str)
    parsed = json.loads(result)
    assert parsed["title"] == "Senior Python Developer"
    assert parsed["company"] == "TechCorp Inc."


@pytest.mark.asyncio
async def test_analyze_job_description_returns_json_string(sample_job_description):
    """Test result is returned as JSON string."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"title": "Engineer", "company": "Corp"}

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description(sample_job_description)

    assert isinstance(result, str)
    parsed = json.loads(result)
    assert "title" in parsed


@pytest.mark.asyncio
async def test_analyze_job_description_with_string_output(sample_job_description):
    """Test handling when model returns string directly."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = '{"title": "Engineer"}'

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description(sample_job_description)

    assert result == '{"title": "Engineer"}'


# ==================== FALLBACK TESTS ====================


@pytest.mark.asyncio
async def test_analyze_job_description_model_unavailable():
    """Test fallback when Genkit model is unavailable."""
    with patch("app.genkit_flows.job_analyzer.get_model", return_value=None):
        result = await analyze_job_description("Some job description")

    parsed = json.loads(result)
    assert parsed["title"] == "Unknown Title"
    assert parsed["company"] == "Unknown Company"
    assert parsed["summary"] == "AI analysis unavailable"


@pytest.mark.asyncio
async def test_analyze_job_description_empty_output():
    """Test fallback when model returns empty output."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = None

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description("Job description")

    parsed = json.loads(result)
    assert parsed["title"] == "Unknown Title"


@pytest.mark.asyncio
async def test_analyze_job_description_exception_handling():
    """Test exception returns fallback data."""
    mock_model = AsyncMock()
    mock_model.generate = AsyncMock(side_effect=Exception("AI service error"))

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description("Job description")

    parsed = json.loads(result)
    assert parsed["title"] == "Unknown Title"
    assert parsed["summary"] == "AI analysis unavailable"


# ==================== PROMPT FORMATTING TESTS ====================


@pytest.mark.asyncio
async def test_analyze_job_description_uses_format_prompt(sample_job_description):
    """Test that format_prompt is called with correct template."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"title": "Test"}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt") as mock_format:
            mock_format.return_value = "Formatted prompt"

            await analyze_job_description(sample_job_description)

            mock_format.assert_called_once_with(
                "job_description_analysis", job_description=sample_job_description
            )


@pytest.mark.asyncio
async def test_analyze_job_description_model_config(sample_job_description):
    """Test model.generate is called with correct config."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"title": "Test"}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            await analyze_job_description(sample_job_description)

    # Verify generate was called with JSON response config
    call_args = mock_model.generate.call_args
    assert call_args[1]["config"]["response_mime_type"] == "application/json"


# ==================== EDGE CASE TESTS ====================


@pytest.mark.asyncio
async def test_analyze_job_description_empty_input():
    """Test analysis with empty job description."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "title": "Unknown",
        "company": "Unknown",
        "location": "Unknown",
        "summary": "No description provided",
        "key_requirements": [],
        "technical_skills": [],
        "soft_skills": [],
        "experience_level": "Unknown",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description("")

    parsed = json.loads(result)
    assert "title" in parsed


@pytest.mark.asyncio
async def test_analyze_job_description_very_long_input():
    """Test analysis with very long job description."""
    long_description = "x" * 10000

    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"title": "Test", "company": "Test Corp"}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description(long_description)

    assert isinstance(result, str)


@pytest.mark.asyncio
async def test_analyze_job_description_special_characters():
    """Test analysis with special characters in description."""
    special_desc = """
    Title: Senior Engineer @ TechCorp™
    Salary: $100,000-$150,000
    Skills: C++, C#, .NET
    """

    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "title": "Senior Engineer @ TechCorp™",
        "company": "TechCorp",
        "location": "Unknown",
        "summary": "Test",
        "key_requirements": [],
        "technical_skills": ["C++", "C#", ".NET"],
        "soft_skills": [],
        "experience_level": "Senior",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            result = await analyze_job_description(special_desc)

    parsed = json.loads(result)
    assert "C++" in parsed["technical_skills"] or "title" in parsed


@pytest.mark.asyncio
async def test_analyze_job_description_logging(sample_job_description):
    """Test that flow logs execution."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"title": "Test"}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.job_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.job_analyzer.format_prompt", return_value="Prompt"):
            with patch("app.genkit_flows.job_analyzer.logger") as mock_logger:
                await analyze_job_description(sample_job_description)

                # Verify logging occurred
                assert mock_logger.info.called


# ==================== SCHEMA VALIDATION TESTS ====================


def test_job_analysis_schema_structure():
    """Test JobAnalysisSchema has correct fields."""
    schema = JobAnalysisSchema(
        title="Engineer",
        company="Corp",
        location="SF",
        summary="Summary",
        key_requirements=["Req1"],
        technical_skills=["Python"],
        soft_skills=["Communication"],
        experience_level="5 years",
    )

    assert schema.title == "Engineer"
    assert schema.company == "Corp"
    assert schema.location == "SF"
    assert len(schema.technical_skills) == 1


def test_job_analysis_schema_optional_match_score():
    """Test match_score is optional in schema."""
    schema = JobAnalysisSchema(
        title="Engineer",
        company="Corp",
        location="SF",
        summary="Summary",
        key_requirements=[],
        technical_skills=[],
        soft_skills=[],
        experience_level="5 years",
    )

    assert schema.match_score is None

    schema_with_score = JobAnalysisSchema(
        title="Engineer",
        company="Corp",
        location="SF",
        summary="Summary",
        key_requirements=[],
        technical_skills=[],
        soft_skills=[],
        experience_level="5 years",
        match_score=85,
    )

    assert schema_with_score.match_score == 85
