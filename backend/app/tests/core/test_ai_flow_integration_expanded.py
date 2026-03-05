from __future__ import annotations

import pytest

from app.core.ai_error_handling import AIError
from app.core.ai_flow_integration import (
    AIFlowManager,
    create_fallback_response,
    create_migration_wrapper,
    extract_validated_data,
    migrate_json_parsing,
    validate_ai_flow_response,
)
from app.core.ai_response_validation import (
    ATSResult,
    BaseAIResponseSchema,
    STARResponse,
    ValidationResult,
)


@pytest.mark.asyncio
async def test_validate_ai_flow_response_success():
    @validate_ai_flow_response(STARResponse)
    async def _flow():
        return (
            '{"situation":"Strong situation data",'
            '"task":"Clear task summary",'
            '"action":"Detailed action taken",'
            '"result":"Meaningful measurable result"}'
        )

    result = await _flow()
    assert result.is_valid is True
    assert isinstance(result.parsed_data, STARResponse)


@pytest.mark.asyncio
async def test_validate_ai_flow_response_error_with_fallback():
    fallback = {
        "situation": "Fallback situation content",
        "task": "Fallback task content",
        "action": "Fallback action content",
        "result": "Fallback result content",
    }

    @validate_ai_flow_response(STARResponse, fallback_data=fallback)
    async def _flow():
        raise RuntimeError("flow failed")

    result = await _flow()
    assert result.is_valid is True
    assert result.metadata.get("fallback_used") is True


@pytest.mark.asyncio
async def test_validate_ai_flow_response_invalid_without_fallback_raises():
    @validate_ai_flow_response(STARResponse)
    async def _flow():
        return "{}"

    with pytest.raises(AIError):
        await _flow()


def test_extract_validated_data_and_error_path():
    parsed = STARResponse(
        situation="Situation long enough",
        task="Task long enough too",
        action="Action long enough now",
        result="Result long enough now",
    )
    ok = ValidationResult(is_valid=True, parsed_data=parsed)
    assert extract_validated_data(ok) == parsed

    bad = ValidationResult(is_valid=False, parsed_data=None, error_message="none")
    with pytest.raises(AIError):
        extract_validated_data(bad)


def test_create_fallback_response_known_and_generic():
    star = create_fallback_response(STARResponse, "temporary error")
    assert isinstance(star, STARResponse)
    assert "temporary error" in star.situation

    ats = create_fallback_response(ATSResult, "temporary error")
    assert isinstance(ats, ATSResult)
    assert ats.overall_score == 50.0

    class _GenericSchema(BaseAIResponseSchema):
        text: str
        value: int

    generic = create_fallback_response(_GenericSchema, "oops")
    assert generic.text == "oops"
    assert generic.value == 0


@pytest.mark.asyncio
async def test_flow_manager_success_and_fallback():
    manager = AIFlowManager()
    fallback = {
        "situation": "Fallback situation content",
        "task": "Fallback task content",
        "action": "Fallback action content",
        "result": "Fallback result content",
    }
    manager.register_flow("star", STARResponse, fallback_data=fallback)

    async def _ok():
        return (
            '{"situation":"Strong situation data",'
            '"task":"Clear task summary",'
            '"action":"Detailed action taken",'
            '"result":"Meaningful measurable result"}'
        )

    result_ok = await manager.execute_flow("star", _ok)
    assert result_ok.is_valid is True
    assert isinstance(result_ok.parsed_data, STARResponse)

    async def _boom():
        raise RuntimeError("boom")

    result_fb = await manager.execute_flow("star", _boom)
    assert result_fb.is_valid is True
    assert result_fb.metadata.get("fallback_used") is True

    assert manager.get_flow_schema("star") is STARResponse

    with pytest.raises(ValueError):
        await manager.execute_flow("missing", _ok)


def test_migrate_json_parsing_helper():
    result = migrate_json_parsing(
        '{"situation":"Strong situation data","task":"Clear task summary","action":"Detailed action taken","result":"Meaningful measurable result"}',
        STARResponse,
    )
    assert result.is_valid is True
    assert isinstance(result.parsed_data, STARResponse)


@pytest.mark.asyncio
async def test_create_migration_wrapper_paths():
    async def _dict_flow():
        return {
            "situation": "Strong situation data",
            "task": "Clear task summary",
            "action": "Detailed action taken",
            "result": "Meaningful measurable result",
        }

    wrapped_dict = create_migration_wrapper(_dict_flow, STARResponse)
    res_dict = await wrapped_dict()
    assert res_dict.is_valid is True

    async def _str_flow():
        return (
            '{"situation":"Strong situation data",'
            '"task":"Clear task summary",'
            '"action":"Detailed action taken",'
            '"result":"Meaningful measurable result"}'
        )

    wrapped_str = create_migration_wrapper(_str_flow, STARResponse)
    res_str = await wrapped_str()
    assert res_str.is_valid is True

    async def _bad_flow():
        return {"bad": "shape"}

    fallback = {
        "situation": "Fallback situation content",
        "task": "Fallback task content",
        "action": "Fallback action content",
        "result": "Fallback result content",
    }
    wrapped_bad = create_migration_wrapper(_bad_flow, STARResponse, fallback_data=fallback)
    res_bad = await wrapped_bad()
    assert res_bad.is_valid is True
    assert res_bad.metadata.get("fallback_used") is True
