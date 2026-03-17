"""
Comprehensive tests for ats_scoring.py genkit flow.
Target coverage: 61% → 80% (15-20 tests)
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.ats_scoring import (
    AtsResult,
    SemanticAnalysis,
    _calculate_formatting_score,
    _calculate_keyword_score,
    _generate_recommendations,
    _perform_semantic_analysis,
    atsScoring,
)
from app.genkit_flows.extract_job_requirements import JobRequirements
from app.genkit_flows.extract_resume_entities import ResumeEntities
from app.genkit_flows.keyword_placer import KeywordPlacementSuggestion

# ==================== FIXTURES ====================


@pytest.fixture
def sample_resume_text():
    """Sample resume text."""
    return """
    John Doe
    Software Engineer

    Skills: Python, JavaScript, React, Docker

    Experience:
    - Senior Developer at TechCorp (2020-2023)
    - Junior Developer at StartupInc (2018-2020)

    Education:
    - BS Computer Science, University (2018)
    """


@pytest.fixture
def sample_job_description():
    """Sample job description."""
    return """
    Senior Software Engineer

    Required Skills:
    - Python
    - React
    - AWS

    Preferred Skills:
    - Docker
    - Kubernetes

    5+ years experience required.
    """


@pytest.fixture
def sample_job_requirements():
    """Sample JobRequirements object."""
    return JobRequirements(
        requiredSkills=["Python", "React", "AWS"],
        preferredSkills=["Docker", "Kubernetes"],
        experienceLevel="5+ years",
    )


@pytest.fixture
def sample_resume_entities():
    """Sample ResumeEntities object."""
    return ResumeEntities(
        skills=["Python", "JavaScript", "React", "Docker"],
        experience=[
            {"title": "Senior Developer", "company": "TechCorp", "duration": "2020-2023"},
            {"title": "Junior Developer", "company": "StartupInc", "duration": "2018-2020"},
        ],
        education=[{"degree": "BS Computer Science", "institution": "University", "year": "2018"}],
    )


# ==================== KEYWORD SCORE CALCULATION TESTS ====================


def test_calculate_keyword_score_perfect_match(sample_job_requirements):
    """Test keyword score with all skills matched."""
    resume_skills = ["Python", "React", "AWS", "Docker", "Kubernetes"]

    result = _calculate_keyword_score(resume_skills, sample_job_requirements)

    assert result["score"] == 100.0
    assert len(result["matchedKeywords"]) == 5
    assert len(result["missingKeywords"]) == 0


def test_calculate_keyword_score_partial_match(sample_job_requirements):
    """Test keyword score with partial match."""
    resume_skills = ["Python", "React"]  # Missing AWS, Docker, Kubernetes

    result = _calculate_keyword_score(resume_skills, sample_job_requirements)

    assert result["score"] < 100.0
    assert "Python" in result["matchedKeywords"]
    assert "React" in result["matchedKeywords"]
    assert "AWS" in result["missingKeywords"]


def test_calculate_keyword_score_no_match(sample_job_requirements):
    """Test keyword score with no matches."""
    resume_skills = ["Java", "C++", "Ruby"]

    result = _calculate_keyword_score(resume_skills, sample_job_requirements)

    assert result["score"] == 0.0
    assert len(result["matchedKeywords"]) == 0
    assert len(result["missingKeywords"]) == 5


def test_calculate_keyword_score_case_insensitive(sample_job_requirements):
    """Test keyword matching is case-insensitive."""
    resume_skills = ["python", "REACT", "aws"]

    result = _calculate_keyword_score(resume_skills, sample_job_requirements)

    assert len(result["matchedKeywords"]) == 3


def test_calculate_keyword_score_empty_job_requirements():
    """Test keyword score with empty job requirements."""
    job_reqs = JobRequirements(
        requiredSkills=[],
        preferredSkills=[],
        experienceLevel="",
    )
    resume_skills = ["Python", "React"]

    result = _calculate_keyword_score(resume_skills, job_reqs)

    assert result["score"] == 100.0  # No requirements = perfect score


def test_calculate_keyword_score_required_weight():
    """Test required skills have 80% weight."""
    job_reqs = JobRequirements(
        requiredSkills=["Python"],  # 1 required
        preferredSkills=[],
        experienceLevel="",
    )
    resume_skills = ["Python"]

    result = _calculate_keyword_score(resume_skills, job_reqs)

    assert result["score"] == 100.0  # (1/1 * 0.8) + 0.2 = 1.0


def test_calculate_keyword_score_preferred_weight():
    """Test preferred skills have 20% weight."""
    job_reqs = JobRequirements(
        requiredSkills=[],
        preferredSkills=["Docker"],  # 1 preferred
        experienceLevel="",
    )
    resume_skills = ["Docker"]

    result = _calculate_keyword_score(resume_skills, job_reqs)

    assert result["score"] == 100.0  # 0.8 + (1/1 * 0.2) = 1.0


# ==================== FORMATTING SCORE CALCULATION TESTS ====================


def test_calculate_formatting_score_all_sections(sample_resume_entities):
    """Test formatting score with all sections present."""
    score = _calculate_formatting_score(sample_resume_entities)

    assert score == 100.0


def test_calculate_formatting_score_missing_skills():
    """Test formatting score missing skills section."""
    entities = ResumeEntities(
        skills=[],
        experience=[{"title": "Developer", "company": "Corp"}],
        education=[{"degree": "BS", "institution": "University"}],
    )

    score = _calculate_formatting_score(entities)

    assert score < 100.0
    assert score >= 66.0  # 33.3 + 33.4


def test_calculate_formatting_score_missing_experience():
    """Test formatting score missing experience section."""
    entities = ResumeEntities(
        skills=["Python"],
        experience=[],
        education=[{"degree": "BS", "institution": "University"}],
    )

    score = _calculate_formatting_score(entities)

    assert score < 100.0
    assert score >= 66.0


def test_calculate_formatting_score_missing_education():
    """Test formatting score missing education section."""
    entities = ResumeEntities(
        skills=["Python"],
        experience=[{"title": "Developer", "company": "Corp"}],
        education=[],
    )

    score = _calculate_formatting_score(entities)

    assert score < 100.0
    assert score >= 66.0


def test_calculate_formatting_score_empty_resume():
    """Test formatting score with completely empty resume."""
    entities = ResumeEntities(skills=[], experience=[], education=[])

    score = _calculate_formatting_score(entities)

    assert score == 0.0


# ==================== RECOMMENDATIONS GENERATION TESTS ====================


def test_generate_recommendations_missing_keywords():
    """Test recommendations include missing keywords."""
    keyword_analysis = {
        "score": 60.0,
        "matchedKeywords": ["Python"],
        "missingKeywords": ["AWS", "Docker"],
    }
    semantic_analysis = SemanticAnalysis(similarityScore=80, explanation="Good match")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=100.0,
        job_extraction_success=True,
        resume_extraction_success=True,
        semantic_analysis_success=True,
    )

    assert any("missing keywords" in rec.lower() for rec in recommendations)


def test_generate_recommendations_low_semantic_score():
    """Test recommendations for low semantic similarity."""
    keyword_analysis = {"score": 100.0, "matchedKeywords": [], "missingKeywords": []}
    semantic_analysis = SemanticAnalysis(similarityScore=50, explanation="Needs improvement")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=100.0,
        job_extraction_success=True,
        resume_extraction_success=True,
        semantic_analysis_success=True,
    )

    assert any("alignment" in rec.lower() for rec in recommendations)


def test_generate_recommendations_low_formatting_score():
    """Test recommendations for poor formatting."""
    keyword_analysis = {"score": 100.0, "matchedKeywords": [], "missingKeywords": []}
    semantic_analysis = SemanticAnalysis(similarityScore=90, explanation="Excellent")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=50.0,
        job_extraction_success=True,
        resume_extraction_success=True,
        semantic_analysis_success=True,
    )

    assert any("sections" in rec.lower() for rec in recommendations)


def test_generate_recommendations_job_extraction_failure():
    """Test recommendations include warning for job extraction failure."""
    keyword_analysis = {"score": 80.0, "matchedKeywords": [], "missingKeywords": []}
    semantic_analysis = SemanticAnalysis(similarityScore=80, explanation="Good")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=100.0,
        job_extraction_success=False,  # Failed
        resume_extraction_success=True,
        semantic_analysis_success=True,
    )

    assert any("job description analysis" in rec.lower() for rec in recommendations)


def test_generate_recommendations_resume_extraction_failure():
    """Test recommendations include warning for resume extraction failure."""
    keyword_analysis = {"score": 80.0, "matchedKeywords": [], "missingKeywords": []}
    semantic_analysis = SemanticAnalysis(similarityScore=80, explanation="Good")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=100.0,
        job_extraction_success=True,
        resume_extraction_success=False,  # Failed
        semantic_analysis_success=True,
    )

    assert any("resume parsing" in rec.lower() for rec in recommendations)


def test_generate_recommendations_semantic_analysis_failure():
    """Test recommendations when semantic analysis unavailable."""
    keyword_analysis = {"score": 80.0, "matchedKeywords": [], "missingKeywords": []}
    semantic_analysis = SemanticAnalysis(similarityScore=50, explanation="Fallback")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=100.0,
        job_extraction_success=True,
        resume_extraction_success=True,
        semantic_analysis_success=False,  # Failed
    )

    assert any("semantic similarity" in rec.lower() for rec in recommendations)


def test_generate_recommendations_all_good():
    """Test recommendations when everything is good."""
    keyword_analysis = {"score": 100.0, "matchedKeywords": ["Python"], "missingKeywords": []}
    semantic_analysis = SemanticAnalysis(similarityScore=95, explanation="Excellent")

    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score=100.0,
        job_extraction_success=True,
        resume_extraction_success=True,
        semantic_analysis_success=True,
    )

    assert any(
        "good alignment" in rec.lower() or "customizing" in rec.lower() for rec in recommendations
    )


# ==================== SEMANTIC ANALYSIS TESTS ====================


@pytest.mark.asyncio
async def test_perform_semantic_analysis_success(sample_resume_text, sample_job_description):
    """Test successful semantic analysis."""
    mock_model = AsyncMock()
    mock_response = MagicMock()
    mock_response.output.return_value = SemanticAnalysis(
        similarityScore=85, explanation="Strong match"
    )
    mock_model.generate = AsyncMock(return_value=mock_response)

    with patch("app.genkit_flows.ats_scoring.get_model", return_value=mock_model):
        with patch("app.genkit_flows.ats_scoring.format_prompt", return_value="Formatted prompt"):
            result = await _perform_semantic_analysis(sample_resume_text, sample_job_description)

    assert result.similarityScore == 85
    assert result.explanation == "Strong match"


@pytest.mark.asyncio
async def test_perform_semantic_analysis_no_model():
    """Test RuntimeError when model not available."""
    with patch("app.genkit_flows.ats_scoring.get_model", return_value=None):
        with pytest.raises(RuntimeError, match="Genkit model not available"):
            await _perform_semantic_analysis("resume", "job desc")


# ==================== FULL ATS SCORING FLOW TESTS ====================


@pytest.mark.asyncio
async def test_ats_scoring_success(sample_resume_text, sample_job_description):
    """Test successful ATS scoring flow."""
    mock_job_reqs = JobRequirements(
        requiredSkills=["Python", "React"],
        preferredSkills=["Docker"],
        experienceLevel="5+ years",
    )
    mock_resume_entities = ResumeEntities(
        skills=["Python", "React", "Docker"],
        experience=[{"title": "Developer", "company": "Corp"}],
        education=[{"degree": "BS", "institution": "University"}],
    )

    with patch("app.genkit_flows.ats_scoring.enhanced_ai_handler") as mock_handler:
        # Mock all AI operations to succeed
        mock_handler.execute_ai_operation = AsyncMock(
            side_effect=[
                # Job requirements extraction
                MagicMock(success=True, data=mock_job_reqs, fallback_used=False),
                # Resume entities extraction
                MagicMock(success=True, data=mock_resume_entities, fallback_used=False),
                # Semantic analysis
                MagicMock(
                    success=True,
                    data=SemanticAnalysis(similarityScore=85, explanation="Good"),
                    fallback_used=False,
                ),
                # Keyword matching
                MagicMock(
                    success=True,
                    data={
                        "score": 100.0,
                        "matchedKeywords": ["Python", "React", "Docker"],
                        "missingKeywords": [],
                    },
                    fallback_used=False,
                ),
                # Formatting score
                MagicMock(success=True, data=100.0, fallback_used=False),
            ]
        )

        with patch("app.genkit_flows.ats_scoring.settings") as mock_settings:
            mock_settings.ats_scoring_weights = {
                "keyword": 0.4,
                "semantic": 0.4,
                "formatting": 0.2,
            }

            result = await atsScoring(sample_resume_text, sample_job_description)

    assert isinstance(result, AtsResult)
    assert result.overallScore > 0


@pytest.mark.asyncio
async def test_ats_scoring_with_fallbacks(sample_resume_text, sample_job_description):
    """Test ATS scoring with fallback data."""
    with patch("app.genkit_flows.ats_scoring.enhanced_ai_handler") as mock_handler:
        # Mock AI operations with failures triggering fallbacks
        mock_handler.execute_ai_operation = AsyncMock(
            side_effect=[
                # Job requirements extraction fails
                MagicMock(
                    success=False,
                    data=JobRequirements(requiredSkills=[], preferredSkills=[], experienceLevel=""),
                    fallback_used=True,
                    error="Extraction failed",
                ),
                # Resume entities extraction fails
                MagicMock(
                    success=False,
                    data=ResumeEntities(skills=[], experience=[], education=[]),
                    fallback_used=True,
                    error="Extraction failed",
                ),
                # Semantic analysis uses fallback
                MagicMock(
                    success=True,
                    data=SemanticAnalysis(similarityScore=50, explanation="Fallback"),
                    fallback_used=True,
                ),
                # Keyword matching
                MagicMock(
                    success=True,
                    data={"score": 25.0, "matchedKeywords": [], "missingKeywords": []},
                    fallback_used=False,
                ),
                # Formatting score
                MagicMock(success=True, data=50.0, fallback_used=False),
            ]
        )

        with patch("app.genkit_flows.ats_scoring.settings") as mock_settings:
            mock_settings.ats_scoring_weights = {
                "keyword": 0.4,
                "semantic": 0.4,
                "formatting": 0.2,
            }

            result = await atsScoring(sample_resume_text, sample_job_description)

    assert isinstance(result, AtsResult)
    assert any("⚠️" in rec for rec in result.recommendations)


@pytest.mark.asyncio
async def test_ats_scoring_with_missing_keywords(sample_resume_text, sample_job_description):
    """Test ATS scoring with keyword placement suggestions."""
    mock_job_reqs = JobRequirements(
        requiredSkills=["Python", "React", "AWS"],
        preferredSkills=[],
        experienceLevel="",
    )
    mock_resume_entities = ResumeEntities(
        skills=["Python"],
        experience=[{"title": "Developer"}],
        education=[{"degree": "BS"}],
    )
    mock_placement = MagicMock(
        suggestions=[
            KeywordPlacementSuggestion(
                keyword="React",
                suggested_location="Skills section",
                example_sentence="Add React to your skills: Python, React, AWS",
            )
        ]
    )

    with patch("app.genkit_flows.ats_scoring.enhanced_ai_handler") as mock_handler:
        mock_handler.execute_ai_operation = AsyncMock(
            side_effect=[
                # Job requirements
                MagicMock(success=True, data=mock_job_reqs, fallback_used=False),
                # Resume entities
                MagicMock(success=True, data=mock_resume_entities, fallback_used=False),
                # Semantic analysis
                MagicMock(
                    success=True,
                    data=SemanticAnalysis(similarityScore=70, explanation="Okay"),
                    fallback_used=False,
                ),
                # Keyword matching with missing keywords
                MagicMock(
                    success=True,
                    data={
                        "score": 50.0,
                        "matchedKeywords": ["Python"],
                        "missingKeywords": ["React", "AWS"],
                    },
                    fallback_used=False,
                ),
                # Formatting score
                MagicMock(success=True, data=100.0, fallback_used=False),
                # Keyword placement suggestions
                MagicMock(success=True, data=mock_placement, fallback_used=False),
            ]
        )

        with patch("app.genkit_flows.ats_scoring.settings") as mock_settings:
            mock_settings.ats_scoring_weights = {
                "keyword": 0.4,
                "semantic": 0.4,
                "formatting": 0.2,
            }

            result = await atsScoring(sample_resume_text, sample_job_description)

    assert result.keyword_placement_suggestions is not None
    assert len(result.keyword_placement_suggestions) > 0
