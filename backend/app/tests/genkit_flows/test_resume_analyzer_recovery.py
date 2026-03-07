"""
Comprehensive tests for resume_analyzer.py genkit flow.
Target coverage: 27% → 80% (10-15 tests)
"""

import json
from unittest.mock import AsyncMock, MagicMock, Mock, patch

import pytest

from app.genkit_flows.resume_analyzer import (
    compare_resume_to_job,
)

# ==================== FIXTURES ====================


@pytest.fixture
def sample_resume_text():
    """Sample resume text."""
    return """
    John Doe
    john@example.com

    SKILLS
    - Python (5 years)
    - Django, Flask
    - PostgreSQL, MongoDB
    - AWS, Docker

    EXPERIENCE
    Senior Developer at TechCorp (2020-2023)
    - Led team of 5 developers
    - Built scalable microservices
    - Reduced latency by 40%

    Junior Developer at StartupInc (2018-2020)
    - Developed REST APIs
    - Implemented CI/CD pipelines

    EDUCATION
    BS Computer Science, MIT (2018)
    """


@pytest.fixture
def sample_job_analysis():
    """Sample job analysis data."""
    return {
        "title": "Senior Python Developer",
        "company": "TechCorp",
        "location": "San Francisco, CA",
        "summary": "Seeking experienced Python developer",
        "key_requirements": [
            "5+ years Python experience",
            "Django/Flask expertise",
            "AWS experience",
        ],
        "technical_skills": ["Python", "Django", "Flask", "AWS", "PostgreSQL"],
        "soft_skills": ["Leadership", "Communication"],
        "experience_level": "5+ years",
    }


@pytest.fixture
def expected_comparison_output():
    """Expected comparison output structure."""
    return {
        "match_score": 85,
        "matched_skills": ["Python", "Django", "Flask", "AWS", "PostgreSQL"],
        "missing_skills": [],
        "overall_fit": "Strong match",
        "recommendations": "Highlight leadership experience and AWS projects",
    }


# ==================== SUCCESS FLOW TESTS ====================


@pytest.mark.asyncio
async def test_compare_resume_to_job_success(
    sample_resume_text, sample_job_analysis, expected_comparison_output
):
    """Test successful resume comparison."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = expected_comparison_output

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch(
            "app.genkit_flows.resume_analyzer.format_prompt", return_value="Formatted prompt"
        ):
            result = await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    assert isinstance(result, str)
    parsed = json.loads(result)
    assert parsed["match_score"] == 85
    assert "Python" in parsed["matched_skills"]


@pytest.mark.asyncio
async def test_compare_resume_to_job_returns_json_string(sample_resume_text, sample_job_analysis):
    """Test result is returned as JSON string."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "match_score": 75,
        "matched_skills": ["Python"],
        "missing_skills": ["Kubernetes"],
        "overall_fit": "Good match",
        "recommendations": "Add Kubernetes experience",
    }

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    assert isinstance(result, str)
    parsed = json.loads(result)
    assert "match_score" in parsed
    assert "matched_skills" in parsed


@pytest.mark.asyncio
async def test_compare_resume_to_job_with_string_output(sample_resume_text, sample_job_analysis):
    """Test handling when model returns string directly."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = '{"match_score": 90}'

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    assert result == '{"match_score": 90}'


# ==================== FALLBACK TESTS ====================


@pytest.mark.asyncio
async def test_compare_resume_to_job_model_unavailable(sample_resume_text, sample_job_analysis):
    """Test fallback when Genkit model is unavailable."""
    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=None):
        result = await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    parsed = json.loads(result)
    assert parsed["match_score"] == 0
    assert parsed["overall_fit"] == "Analysis unavailable"
    assert "try again later" in parsed["recommendations"]


@pytest.mark.asyncio
async def test_compare_resume_to_job_empty_output(sample_resume_text, sample_job_analysis):
    """Test fallback when model returns empty output."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = None

    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    parsed = json.loads(result)
    assert parsed["match_score"] == 0
    assert parsed["overall_fit"] == "Analysis unavailable"


@pytest.mark.asyncio
async def test_compare_resume_to_job_exception_handling(sample_resume_text, sample_job_analysis):
    """Test exception returns fallback data."""
    mock_model = AsyncMock()
    mock_model.generate = AsyncMock(side_effect=Exception("AI service error"))

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    parsed = json.loads(result)
    assert parsed["match_score"] == 0
    assert parsed["overall_fit"] == "Analysis unavailable"


# ==================== PROMPT FORMATTING TESTS ====================


@pytest.mark.asyncio
async def test_compare_resume_to_job_uses_format_prompt(sample_resume_text, sample_job_analysis):
    """Test that format_prompt is called with correct template."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"match_score": 80}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt") as mock_format:
            mock_format.return_value = "Formatted prompt"

            await compare_resume_to_job(sample_resume_text, sample_job_analysis)

            # Verify format_prompt called with correct template and args
            mock_format.assert_called_once()
            call_args = mock_format.call_args
            assert call_args[0][0] == "resume_job_comparison"
            assert "resume_text" in call_args[1]
            assert "job_analysis_data" in call_args[1]


@pytest.mark.asyncio
async def test_compare_resume_to_job_job_data_serialization(
    sample_resume_text, sample_job_analysis
):
    """Test job analysis data is serialized to JSON."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"match_score": 80}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt") as mock_format:
            mock_format.return_value = "Prompt"

            await compare_resume_to_job(sample_resume_text, sample_job_analysis)

            # Verify job_analysis_data is JSON string
            call_args = mock_format.call_args
            job_data = call_args[1]["job_analysis_data"]
            assert isinstance(job_data, str)
            # Verify it's valid JSON
            parsed = json.loads(job_data)
            assert parsed["title"] == "Senior Python Developer"


@pytest.mark.asyncio
async def test_compare_resume_to_job_model_config(sample_resume_text, sample_job_analysis):
    """Test model.generate is called with correct config."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"match_score": 80}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            await compare_resume_to_job(sample_resume_text, sample_job_analysis)

    # Verify generate was called with JSON response config
    call_args = mock_model.generate.call_args
    assert call_args[1]["config"]["response_mime_type"] == "application/json"


# ==================== EDGE CASE TESTS ====================


@pytest.mark.asyncio
async def test_compare_resume_to_job_empty_resume():
    """Test comparison with empty resume."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "match_score": 0,
        "matched_skills": [],
        "missing_skills": ["Python", "Django"],
        "overall_fit": "Poor match",
        "recommendations": "Resume appears empty",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job("", {"title": "Engineer"})

    parsed = json.loads(result)
    assert parsed["match_score"] == 0


@pytest.mark.asyncio
async def test_compare_resume_to_job_empty_job_analysis():
    """Test comparison with empty job analysis."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "match_score": 50,
        "matched_skills": [],
        "missing_skills": [],
        "overall_fit": "Cannot assess",
        "recommendations": "Job description incomplete",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job("Resume text", {})

    parsed = json.loads(result)
    assert "match_score" in parsed


@pytest.mark.asyncio
async def test_compare_resume_to_job_high_match_score(sample_resume_text):
    """Test comparison resulting in high match score."""
    job_analysis = {
        "title": "Python Developer",
        "technical_skills": ["Python", "Django"],
    }

    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "match_score": 95,
        "matched_skills": ["Python", "Django", "Flask", "AWS"],
        "missing_skills": [],
        "overall_fit": "Excellent match",
        "recommendations": "Apply immediately",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(sample_resume_text, job_analysis)

    parsed = json.loads(result)
    assert parsed["match_score"] >= 90


@pytest.mark.asyncio
async def test_compare_resume_to_job_low_match_score(sample_resume_text):
    """Test comparison resulting in low match score."""
    job_analysis = {
        "title": "Java Developer",
        "technical_skills": ["Java", "Spring", "Hibernate"],
    }

    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "match_score": 20,
        "matched_skills": [],
        "missing_skills": ["Java", "Spring", "Hibernate"],
        "overall_fit": "Poor match",
        "recommendations": "Consider learning Java stack",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(sample_resume_text, job_analysis)

    parsed = json.loads(result)
    assert parsed["match_score"] < 50


@pytest.mark.asyncio
async def test_compare_resume_to_job_logging(sample_resume_text, sample_job_analysis):
    """Test that flow logs execution."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {"match_score": 80}
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            with patch("app.genkit_flows.resume_analyzer.logger") as mock_logger:
                await compare_resume_to_job(sample_resume_text, sample_job_analysis)

                # Verify logging occurred
                assert mock_logger.info.called


# ==================== SPECIAL CHARACTER HANDLING ====================


@pytest.mark.asyncio
async def test_compare_resume_to_job_special_characters_in_resume():
    """Test comparison with special characters in resume."""
    resume_with_special_chars = """
    Name: Müller O'Brien
    Email: user+test@example.com
    Skills: C++, C#, .NET, R&D
    """

    job_analysis = {
        "title": "Software Engineer",
        "technical_skills": ["C++", "C#"],
    }

    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = {
        "match_score": 85,
        "matched_skills": ["C++", "C#"],
        "missing_skills": [],
        "overall_fit": "Good match",
        "recommendations": "Strong technical skills",
    }
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.resume_analyzer.get_model", return_value=mock_model):
        with patch("app.genkit_flows.resume_analyzer.format_prompt", return_value="Prompt"):
            result = await compare_resume_to_job(resume_with_special_chars, job_analysis)

    assert isinstance(result, str)
    parsed = json.loads(result)
    assert parsed["match_score"] == 85
