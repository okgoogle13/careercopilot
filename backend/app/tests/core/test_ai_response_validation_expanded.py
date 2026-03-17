"""
Tests for AI response validation and parsing utility.
"""

from app.core import ai_response_validation
from app.core.ai_response_validation import (
    AIResponseValidationError,
    JobRequirements,
    KSCResponseComplete,
    SemanticAnalysis,
    STARResponse,
    ValidationErrorType,
)

# TestClient removed as ai_response_validation does not expose a FastAPI app


def test_validate_star_response_success():
    """Test successful validation of a STAR response."""
    data = {
        "situation": "A challenging project...",
        "task": "My responsibility was...",
        "action": "I implemented a solution...",
        "result": "The project was successful...",
    }
    schema = STARResponse
    result = ai_response_validation.validate_ai_response(data, schema)
    assert result.is_valid
    assert result.parsed_data.situation == "A challenging project..."


def test_validate_star_response_missing_field():
    """Test validation failure due to a missing required field in STAR response."""
    data = {
        "situation": "A challenging project...",
        "task": "My responsibility was...",
        "result": "The project was successful...",
    }
    schema = STARResponse
    result = ai_response_validation.validate_ai_response(data, schema)
    assert not result.is_valid
    assert result.error_type == ValidationErrorType.MISSING_REQUIRED_FIELDS


def test_validate_star_response_empty_field():
    """Test validation failure due to an empty field in STAR response."""
    data = {
        "situation": "A challenging project...",
        "task": "My responsibility was...",
        "action": "",
        "result": "The project was successful...",
    }
    schema = STARResponse
    result = ai_response_validation.validate_ai_response(data, schema)
    assert not result.is_valid
    assert result.error_type == ValidationErrorType.INVALID_FIELD_TYPE


def test_validate_ksc_response_complete_success():
    """Test successful validation of a KSC response complete."""
    data = {
        "ksc_analysis": {
            "ksc_interpretation": "Analysis of KSC...",
            "key_competencies": ["Skill 1", "Skill 2"],
            "success_factors": ["Factor 1", "Factor 2"],
            "common_pitfalls": ["Pitfall 1"],
        },
        "experience_selection": {
            "chosen_experience": "Relevant experience...",
            "relevance_score": 85.0,
            "selection_rationale": "Rationale for selection...",
            "alternative_experiences": ["Exp 1", "Exp 2"],
        },
        "star_response": {
            "situation": "Detailed situation context",
            "task": "Detailed task summary",
            "action": "Detailed action summary",
            "result": "Detailed result summary",
        },
    }
    schema = KSCResponseComplete
    result = ai_response_validation.validate_ai_response(data, schema)
    assert result.is_valid
    assert result.parsed_data.ksc_analysis.ksc_interpretation == "Analysis of KSC..."


def test_validate_semantic_analysis_success():
    """Test successful validation of Semantic Analysis."""
    data = {"similarity_score": 90.0, "explanation": "High similarity score."}
    schema = SemanticAnalysis
    result = ai_response_validation.validate_ai_response(data, schema)
    assert result.is_valid
    assert result.parsed_data.similarity_score == 90.0


def test_validate_semantic_analysis_legacy_field():
    """Test Semantic Analysis with legacy field 'similarityScore'."""
    data = {"similarityScore": 95.0, "explanation": "Very high similarity."}
    schema = SemanticAnalysis
    result = ai_response_validation.validate_ai_response(data, schema)
    assert result.is_valid
    assert result.parsed_data.similarity_score == 95.0


def test_validate_job_requirements_success():
    """Test successful validation of Job Requirements."""
    data = {
        "required_skills": ["Python", "SQL"],
        "preferred_skills": ["AWS", "Docker"],
        "experience_level": "Mid-level",
        "education_level": "Bachelor's",
    }
    schema = JobRequirements
    result = ai_response_validation.validate_ai_response(data, schema)
    assert result.is_valid
    assert result.parsed_data.required_skills == ["Python", "SQL"]


def test_validate_invalid_json():
    """Test validation failure due to invalid JSON."""
    data = "invalid json"
    schema = STARResponse
    result = ai_response_validation.validate_ai_response(data, schema)
    assert not result.is_valid
    assert result.error_type == ValidationErrorType.INVALID_JSON


def test_validate_empty_response():
    """Test validation failure due to an empty response."""
    data = {}
    schema = STARResponse
    result = ai_response_validation.validate_ai_response(data, schema)
    assert not result.is_valid
    assert result.error_type == ValidationErrorType.EMPTY_RESPONSE


def test_validate_malformed_structure():
    """Test validation failure due to malformed structure."""
    data = {"wrong_field": "value"}
    schema = STARResponse
    result = ai_response_validation.validate_ai_response(data, schema)
    assert not result.is_valid
    assert result.error_type == ValidationErrorType.MALFORMED_STRUCTURE


def test_ai_response_validation_error_exception():
    """Test that AIResponseValidationError is raised correctly."""
    try:
        raise AIResponseValidationError(
            "Test error", ValidationErrorType.INVALID_JSON, None, "response", "schema"
        )
    except AIResponseValidationError as e:
        assert e.error_type == ValidationErrorType.INVALID_JSON
        assert e.message == "Test error"
        assert e.response_content == "response"
        assert e.expected_schema == "schema"
