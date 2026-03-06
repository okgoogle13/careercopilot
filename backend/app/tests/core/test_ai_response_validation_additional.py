from __future__ import annotations

import pytest

from app.core import ai_response_validation as arv


def test_validator_unknown_schema_returns_malformed_structure() -> None:
    validator = arv.AIResponseValidator()
    result = validator.validate_response('{"a":1}', "unknown_schema")
    assert result.is_valid is False
    assert result.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE


def test_validate_response_empty_and_invalid_json_without_fallback() -> None:
    validator = arv.AIResponseValidator()
    empty = validator.validate_response("", "star_response")
    assert empty.is_valid is False
    assert empty.error_type == arv.ValidationErrorType.EMPTY_RESPONSE

    invalid = validator.validate_response("not-json", "star_response")
    assert invalid.is_valid is False
    assert invalid.error_type == arv.ValidationErrorType.INVALID_JSON


def test_star_response_whitespace_validation_branch() -> None:
    with pytest.raises(Exception):
        arv.STARResponse(
            situation=" " * 10,
            task="Valid task content",
            action="Valid action content",
            result="Valid result content",
        )


def test_register_schema_path_and_validate_success() -> None:
    class _MiniSchema(arv.BaseAIResponseSchema):
        value: str

    validator = arv.AIResponseValidator()
    validator.register_schema("mini", _MiniSchema)
    result = validator.validate_response('{"value":"ok"}', "mini")
    assert result.is_valid is True


def test_validate_response_without_warnings_mode() -> None:
    validator = arv.AIResponseValidator(enable_warnings=False)
    result = validator.validate_response(
        '{"situation":"Detailed situation text",'
        '"task":"Detailed task text",'
        '"action":"Detailed action text",'
        '"result":"Detailed result text"}',
        "star_response",
    )
    assert result.is_valid is True
    assert result.validation_warnings == []


def test_validate_response_schema_error_path_without_fallback() -> None:
    validator = arv.AIResponseValidator()
    result = validator.validate_response('{"situation":"too short"}', "star_response")
    assert result.is_valid is False
    assert result.error_type == arv.ValidationErrorType.FAILED_CUSTOM_VALIDATION


def test_validator_invalid_json_uses_fallback() -> None:
    validator = arv.AIResponseValidator()
    fallback = {
        "situation": "A very detailed situation text",
        "task": "A very detailed task text",
        "action": "A very detailed action text",
        "result": "A very detailed result text",
    }
    result = validator.validate_response("not-json", "star_response", fallback_data=fallback)
    assert result.is_valid is True
    assert "fallback_used" in result.metadata


def test_validator_clean_json_response_removes_wrappers() -> None:
    validator = arv.AIResponseValidator()
    raw = '```json\n{"similarity_score": 90, "explanation": "Long enough explanation text"}\n```'
    cleaned = validator._clean_json_response(raw)
    assert cleaned.startswith("{")
    assert cleaned.endswith("}")


def test_validator_collects_warnings_for_required_empty_fields() -> None:
    validator = arv.AIResponseValidator()
    warnings = validator._collect_warnings(
        {
            "situation": "",
            "task": "Task long enough",
            "action": "Action long enough",
            "result": "Result long enough",
        },
        arv.STARResponse,
    )
    assert any("Required field 'situation' is empty" in w for w in warnings)


def test_validator_create_fallback_result_failure_returns_invalid() -> None:
    validator = arv.AIResponseValidator()
    bad_fallback = {"situation": "x"}
    result = validator._create_fallback_result(arv.STARResponse, bad_fallback, "star_response")
    assert result.is_valid is False
    assert result.error_type == arv.ValidationErrorType.FAILED_CUSTOM_VALIDATION


def test_validate_and_parse_with_fallback_path() -> None:
    validator = arv.AIResponseValidator()
    fallback = {
        "similarity_score": 50.0,
        "explanation": "Fallback explanation text is sufficiently long.",
    }
    result = validator.validate_and_parse("not-json", arv.SemanticAnalysis, fallback_data=fallback)
    assert result.is_valid is True
    assert result.metadata.get("fallback_used") is True


def test_validate_and_parse_success_and_invalid_fallback() -> None:
    validator = arv.AIResponseValidator()
    ok = validator.validate_and_parse(
        '{"similarity_score": 88, "explanation": "A sufficiently long explanation text."}',
        arv.SemanticAnalysis,
    )
    assert ok.is_valid is True

    bad_fallback = validator.validate_and_parse(
        "not-json",
        arv.SemanticAnalysis,
        fallback_data={"similarity_score": 88},
    )
    assert bad_fallback.is_valid is False
    assert bad_fallback.error_type == arv.ValidationErrorType.FAILED_CUSTOM_VALIDATION


def test_validate_and_parse_without_fallback_returns_failed_validation() -> None:
    validator = arv.AIResponseValidator()
    result = validator.validate_and_parse("not-json", arv.SemanticAnalysis)
    assert result.is_valid is False
    assert result.error_type == arv.ValidationErrorType.FAILED_CUSTOM_VALIDATION


def test_validate_ai_response_type_schema_non_dict_payload_and_unsupported_type() -> None:
    non_dict = arv.validate_ai_response(
        response_content="[1,2,3]",
        schema_name=arv.STARResponse,
    )
    assert non_dict.is_valid is False
    assert non_dict.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE

    unsupported = arv.validate_ai_response(
        response_content=12345,
        schema_name=arv.STARResponse,
    )
    assert unsupported.is_valid is False
    assert unsupported.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE


def test_validate_ai_response_malformed_structure_when_no_known_fields() -> None:
    result = arv.validate_ai_response(
        response_content={"not_star_field": "value"},
        schema_name=arv.STARResponse,
    )
    assert result.is_valid is False
    assert result.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE


def test_validate_ai_response_with_custom_validator_and_runtime_json_error() -> None:
    validator = arv.AIResponseValidator()

    delegated = arv.validate_ai_response(
        response_content='{"situation":"A detailed text","task":"A detailed text","action":"A detailed text","result":"A detailed text"}',
        schema_name="star_response",
        validator=validator,
    )
    assert delegated.is_valid is True

    class _RuntimeSchema(arv.BaseAIResponseSchema):
        value: str

        def __init__(self, **data):
            raise RuntimeError("schema runtime error")

    runtime_err = arv.validate_ai_response(
        response_content='{"value":"x"}',
        schema_name=_RuntimeSchema,
    )
    assert runtime_err.is_valid is False
    assert runtime_err.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE


@pytest.mark.asyncio
async def test_validate_ai_response_decorator_success_and_exception() -> None:
    @arv.validate_ai_response_decorator(
        "star_response",
        fallback_data={
            "situation": "A detailed fallback situation text",
            "task": "A detailed fallback task text",
            "action": "A detailed fallback action text",
            "result": "A detailed fallback result text",
        },
    )
    async def _ok():
        return (
            '{"situation":"A detailed situation text",'
            '"task":"A detailed task text",'
            '"action":"A detailed action text",'
            '"result":"A detailed result text"}'
        )

    @arv.validate_ai_response_decorator("star_response")
    async def _fail():
        raise RuntimeError("boom")

    out_ok = await _ok()
    assert out_ok.is_valid is True

    out_fail = await _fail()
    assert out_fail.is_valid is False
    assert out_fail.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE


def test_legacy_field_mappings_and_word_count_helpers() -> None:
    jr = arv.JobRequirements(
        requiredSkills=["Python"],
        preferredSkills=["FastAPI"],
        experienceLevel="Senior",
        educationLevel="Bachelor",
        responsibilities=["Build APIs"],
    )
    assert jr.required_skills == ["Python"]
    assert jr.preferred_skills == ["FastAPI"]
    assert jr.experience_level == "Senior"
    assert jr.education_level == "Bachelor"

    breakdown = arv.ATSScoreBreakdown(
        keywordScore=80,
        semanticScore=75,
        formattingScore=90,
    )
    assert breakdown.keyword_score == 80
    assert breakdown.semantic_score == 75
    assert breakdown.formatting_score == 90

    ats = arv.ATSResult(
        overallScore=81,
        breakdown={"keyword_score": 80, "semantic_score": 75, "formatting_score": 90},
        matchedKeywords=["python"],
        missingKeywords=["go"],
        recommendations=["add cloud keywords"],
    )
    assert ats.overall_score == 81
    assert ats.matched_keywords == ["python"]
    assert ats.missing_keywords == ["go"]

    cl = arv.CoverLetterResponse(
        cover_letter_content=(
            "This is a sufficiently long cover letter body with more than one hundred characters "
            "to satisfy schema requirements and enable computed word count."
        )
    )
    assert isinstance(cl.word_count, int)
    assert cl.word_count > 10
    # Direct validator helper path where cover_letter_content is unavailable.
    assert arv.CoverLetterResponse.calculate_word_count(7, {}) == 7


def test_model_validators_non_dict_passthrough_paths() -> None:
    with pytest.raises(Exception):
        arv.SemanticAnalysis.model_validate([])
    with pytest.raises(Exception):
        arv.JobRequirements.model_validate([])
    with pytest.raises(Exception):
        arv.ATSScoreBreakdown.model_validate([])
    with pytest.raises(Exception):
        arv.ATSResult.model_validate([])


def test_validator_fallback_paths_and_unexpected_error(monkeypatch: pytest.MonkeyPatch) -> None:
    validator = arv.AIResponseValidator()

    fallback_star = {
        "situation": "A detailed fallback situation text",
        "task": "A detailed fallback task text",
        "action": "A detailed fallback action text",
        "result": "A detailed fallback result text",
    }

    empty_with_fallback = validator.validate_response(
        "", "star_response", fallback_data=fallback_star
    )
    assert empty_with_fallback.is_valid is True

    bad_schema_with_fallback = validator.validate_response(
        '{"situation":"only one field"}',
        "star_response",
        fallback_data=fallback_star,
    )
    assert bad_schema_with_fallback.is_valid is True

    monkeypatch.setattr(
        validator, "_clean_json_response", lambda _x: (_ for _ in ()).throw(RuntimeError("bad"))
    )
    unexpected = validator.validate_response('{"x":1}', "star_response")
    assert unexpected.is_valid is False
    assert unexpected.error_type == arv.ValidationErrorType.MALFORMED_STRUCTURE


def test_validator_outer_exception_with_fallback(monkeypatch: pytest.MonkeyPatch) -> None:
    validator = arv.AIResponseValidator()
    fallback_star = {
        "situation": "A detailed fallback situation text",
        "task": "A detailed fallback task text",
        "action": "A detailed fallback action text",
        "result": "A detailed fallback result text",
    }
    monkeypatch.setattr(
        validator, "_clean_json_response", lambda _x: (_ for _ in ()).throw(RuntimeError("bad"))
    )
    out = validator.validate_response('{"x":1}', "star_response", fallback_data=fallback_star)
    assert out.is_valid is True
    assert out.metadata.get("fallback_used") is True


def test_collect_warnings_legacy_fields_path() -> None:
    class _LegacyField:
        def __init__(self, required: bool):
            self.required = required

    class _LegacySchema:
        __fields__ = {"required_text": _LegacyField(True)}

    validator = arv.AIResponseValidator()
    warnings = validator._collect_warnings({"required_text": ""}, _LegacySchema)  # type: ignore[arg-type]
    assert any("required_text" in w for w in warnings)


def test_collect_warnings_required_list_path() -> None:
    validator = arv.AIResponseValidator()
    warnings = validator._collect_warnings(
        {
            "ksc_interpretation": "Detailed interpretation text",
            "key_competencies": [],
            "success_factors": ["factor-1"],
        },
        arv.KSCAnalysis,
    )
    assert any("Required list field 'key_competencies' is empty" in w for w in warnings)


def test_create_fallback_helpers() -> None:
    star = arv.create_fallback_star_response()
    sem = arv.create_fallback_semantic_analysis()
    assert "Unable to analyze" in star.situation
    assert sem.similarity_score == 50.0


def test_ats_result_legacy_partial_mapping_branch() -> None:
    ats = arv.ATSResult(
        overallScore=77,
        breakdown={"keyword_score": 70, "semantic_score": 75, "formatting_score": 80},
        recommendations=["x"],
    )
    assert ats.overall_score == 77
