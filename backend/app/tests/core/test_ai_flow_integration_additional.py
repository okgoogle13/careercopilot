from __future__ import annotations

from typing import Any

import pytest

from app.core.ai_error_handling import AIError, AIErrorType
from app.core.ai_flow_integration import (
    AIFlowManager,
    create_fallback_response,
    create_migration_wrapper,
    default_flow_manager,
    validate_ai_flow_response,
)
from app.core.ai_response_validation import (
    BaseAIResponseSchema,
    JobRequirements,
    ResumeEntities,
    SemanticAnalysis,
    STARResponse,
)


class _StrictSchema(BaseAIResponseSchema):
    text: str


class _ManyTypesSchema(BaseAIResponseSchema):
    text: str
    value_float: float
    value_int: int
    tags: list
    meta: dict


class _LegacyFieldInfo:
    def __init__(self, required: bool, type_):
        self.required = required
        self.type_ = type_


class _LegacySchema:
    __name__ = "_LegacySchema"
    __fields__: dict[str, Any] = {
        "text": _LegacyFieldInfo(True, str),
        "score": _LegacyFieldInfo(True, float),
        "count": _LegacyFieldInfo(True, int),
        "items": _LegacyFieldInfo(True, list),
        "meta": _LegacyFieldInfo(True, dict),
    }

    def __init__(self, **kwargs):
        self.data = kwargs


def test_create_fallback_response_known_additional_types() -> None:
    sem = create_fallback_response(SemanticAnalysis, "err")
    assert sem.similarity_score == 50.0

    req = create_fallback_response(JobRequirements, "err")
    assert req.required_skills == []
    assert req.experience_level == "Not determined"

    entities = create_fallback_response(ResumeEntities, "err")
    assert entities.skills == []


def test_create_fallback_response_generic_many_field_types() -> None:
    generic = create_fallback_response(_ManyTypesSchema, "oops")
    assert generic.text == "oops"
    assert generic.value_float == 0.0
    assert generic.value_int == 0
    assert generic.tags == []
    assert generic.meta == {}


def test_create_fallback_response_legacy_v1_field_path() -> None:
    legacy = create_fallback_response(_LegacySchema, "legacy-error")  # type: ignore[arg-type]
    assert legacy.data["text"] == "legacy-error"
    assert legacy.data["score"] == 0.0
    assert legacy.data["count"] == 0
    assert legacy.data["items"] == []
    assert legacy.data["meta"] == {}


def test_create_fallback_response_generic_failure_path() -> None:
    class _Unbuildable:
        __name__ = "_Unbuildable"
        __fields__: dict[str, Any] = {}

        def __init__(self, **_kwargs):
            raise RuntimeError("cannot build")

    with pytest.raises(ValueError, match="Cannot create fallback"):
        create_fallback_response(_Unbuildable)  # type: ignore[arg-type]


@pytest.mark.asyncio
async def test_validate_ai_flow_response_raises_unknown_without_fallback() -> None:
    @validate_ai_flow_response(STARResponse)
    async def _flow():
        raise RuntimeError("boom")

    with pytest.raises(AIError) as exc:
        await _flow()
    assert exc.value.error_type == AIErrorType.UNKNOWN


@pytest.mark.asyncio
async def test_validate_ai_flow_response_invalid_fallback_then_raises_unknown() -> None:
    @validate_ai_flow_response(STARResponse, fallback_data={"bad": "shape"})
    async def _flow():
        raise RuntimeError("boom")

    with pytest.raises(AIError) as exc:
        await _flow()
    assert exc.value.error_type == AIErrorType.UNKNOWN


@pytest.mark.asyncio
async def test_ai_flow_manager_execute_flow_returns_invalid_without_fallback() -> None:
    mgr = AIFlowManager()
    mgr.register_flow("strict", _StrictSchema)

    async def _flow():
        raise RuntimeError("explode")

    result = await mgr.execute_flow("strict", _flow)
    assert result.is_valid is False
    assert result.error_type is not None


@pytest.mark.asyncio
async def test_ai_flow_manager_execute_flow_invalid_fallback_returns_invalid() -> None:
    mgr = AIFlowManager()
    mgr.register_flow("strict", _StrictSchema, fallback_data={"wrong": "shape"})

    async def _flow():
        raise RuntimeError("explode")

    result = await mgr.execute_flow("strict", _flow)
    assert result.is_valid is False
    assert "Flow execution failed" in (result.error_message or "")


@pytest.mark.asyncio
async def test_create_migration_wrapper_unexpected_type_and_fallback_paths() -> None:
    async def _unexpected():
        return 12345

    wrapped = create_migration_wrapper(_unexpected, _StrictSchema)
    result = await wrapped()
    assert result.is_valid is False
    assert "Unexpected result type" in (result.error_message or "")

    async def _dict_bad():
        return {"not_text": "x"}

    wrapped_fb = create_migration_wrapper(
        _dict_bad,
        _StrictSchema,
        fallback_data={"text": "fallback"},
    )
    result_fb = await wrapped_fb()
    assert result_fb.is_valid is True
    assert result_fb.metadata.get("fallback_used") is True


@pytest.mark.asyncio
async def test_create_migration_wrapper_dict_invalid_without_fallback_returns_invalid() -> None:
    async def _dict_bad():
        return {"not_text": "x"}

    wrapped = create_migration_wrapper(_dict_bad, _StrictSchema)
    result = await wrapped()
    assert result.is_valid is False
    assert "Migration wrapper error" in (result.error_message or "")


@pytest.mark.asyncio
async def test_create_migration_wrapper_fallback_build_failure_returns_invalid() -> None:
    async def _unexpected():
        return 999

    wrapped = create_migration_wrapper(
        _unexpected,
        _StrictSchema,
        fallback_data={"wrong_key": "x"},
    )
    result = await wrapped()
    assert result.is_valid is False
    assert "Migration wrapper error" in (result.error_message or "")


def test_get_flow_schema_missing_returns_none() -> None:
    assert default_flow_manager.get_flow_schema("does-not-exist") is None
