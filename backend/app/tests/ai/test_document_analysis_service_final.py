from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from pydantic import BaseModel

from app.ai import document_analysis_service as das
from app.core.ai_error_handling import AIError, AIErrorType


class DummyResponseModel(BaseModel):
    skills: list[str] = []


@pytest.fixture
def service() -> das.DocumentAnalysisService:
    return das.DocumentAnalysisService(
        config={"enabled": True, "max_tokens": 111, "temperature": 0.3}
    )


def test_sanitize_text_removes_html_and_normalizes(service: das.DocumentAnalysisService) -> None:
    assert service._sanitize_text("<p>Hello</p>\n\n  world") == "Hello world"


def test_default_result_helpers(service: das.DocumentAnalysisService) -> None:
    resume = service._get_default_resume_result()
    job = service._get_default_job_result()
    assert resume.raw_data == {"error": "Analysis not available"}
    assert job.raw_data == {"error": "Analysis not available"}


@pytest.mark.asyncio
async def test_analyze_resume_validation(service: das.DocumentAnalysisService) -> None:
    with pytest.raises(ValueError):
        await service.analyze_resume("")
    with pytest.raises(ValueError):
        await service.analyze_resume("too short")


@pytest.mark.asyncio
async def test_analyze_resume_disabled_returns_default() -> None:
    s = das.DocumentAnalysisService(config={"enabled": False})
    result = await s.analyze_resume("This is a sufficiently long resume text for testing.")
    assert result.raw_data == {"error": "Analysis not available"}


@pytest.mark.asyncio
async def test_analyze_resume_happy_path_passes_clean_text(
    service: das.DocumentAnalysisService,
) -> None:
    expected = das.ResumeAnalysisResult(skills=["Python"], summary="ok")

    async def fake_analyze_document(**kwargs):
        assert kwargs["template_id"] == "comprehensive_resume_analysis"
        assert "<" not in kwargs["document_text"]
        assert kwargs["template_params"]["target_industry"] == "Tech"
        return expected

    service._analyze_document = fake_analyze_document
    result = await service.analyze_resume("<b>Resume content with enough length.</b>", "Tech")
    assert result.skills == ["Python"]


@pytest.mark.asyncio
async def test_analyze_resume_failure_returns_default_with_error(
    service: das.DocumentAnalysisService,
) -> None:
    service._analyze_document = AsyncMock(side_effect=RuntimeError("boom"))
    result = await service.analyze_resume("This is a sufficiently long resume text for testing.")
    assert "error" in (result.raw_data or {})


@pytest.mark.asyncio
async def test_analyze_job_description_validation(service: das.DocumentAnalysisService) -> None:
    with pytest.raises(ValueError):
        await service.analyze_job_description("")
    with pytest.raises(ValueError):
        await service.analyze_job_description("too short")


@pytest.mark.asyncio
async def test_analyze_job_description_disabled_returns_default() -> None:
    s = das.DocumentAnalysisService(config={"enabled": False})
    result = await s.analyze_job_description(
        "This is a sufficiently long job description text for testing."
    )
    assert result.raw_data == {"error": "Analysis not available"}


@pytest.mark.asyncio
async def test_analyze_job_description_failure_returns_default(
    service: das.DocumentAnalysisService,
) -> None:
    service._analyze_document = AsyncMock(side_effect=RuntimeError("boom"))
    result = await service.analyze_job_description(
        "This is a sufficiently long job description text for testing."
    )
    assert "error" in (result.raw_data or {})


@pytest.mark.asyncio
async def test_analyze_document_generic_validation(service: das.DocumentAnalysisService) -> None:
    with pytest.raises(ValueError):
        await service.analyze_document_generic("", "t", DummyResponseModel)
    with pytest.raises(ValueError):
        await service.analyze_document_generic("good text", "", DummyResponseModel)


@pytest.mark.asyncio
async def test_analyze_document_generic_disabled_raises_aierror() -> None:
    s = das.DocumentAnalysisService(config={"enabled": False})
    with pytest.raises(AIError) as exc:
        await s.analyze_document_generic("valid document text", "tmpl", DummyResponseModel)
    assert exc.value.error_type == AIErrorType.SERVICE_UNAVAILABLE


@pytest.mark.asyncio
async def test_analyze_document_generic_reraises_on_failure(
    service: das.DocumentAnalysisService,
) -> None:
    service._analyze_document = AsyncMock(side_effect=RuntimeError("x"))
    with pytest.raises(RuntimeError):
        await service.analyze_document_generic("valid document text", "tmpl", DummyResponseModel)


@pytest.mark.asyncio
async def test__analyze_document_model_unavailable(
    monkeypatch: pytest.MonkeyPatch, service: das.DocumentAnalysisService
) -> None:
    monkeypatch.setattr(das, "get_model", lambda: None)
    with pytest.raises(AIError) as exc:
        await service._analyze_document("doc", "tmpl", DummyResponseModel, {})
    assert exc.value.error_type == AIErrorType.MODEL_UNAVAILABLE


@pytest.mark.asyncio
async def test__analyze_document_prompt_formatting_error(
    monkeypatch: pytest.MonkeyPatch, service: das.DocumentAnalysisService
) -> None:
    monkeypatch.setattr(das, "get_model", lambda: object())
    monkeypatch.setattr(
        das, "format_prompt", lambda *_a, **_kw: (_ for _ in ()).throw(ValueError("bad template"))
    )

    with pytest.raises(AIError) as exc:
        await service._analyze_document("doc", "tmpl", DummyResponseModel, {})
    assert exc.value.error_type == AIErrorType.PROMPT_FORMATTING_ERROR


@pytest.mark.asyncio
async def test__analyze_document_generate_with_and_without_system_prompt(
    monkeypatch: pytest.MonkeyPatch, service: das.DocumentAnalysisService
) -> None:
    mock_model = SimpleNamespace(generate=AsyncMock())
    mock_model.generate.return_value = SimpleNamespace(
        output=lambda: DummyResponseModel(skills=["A"])
    )
    monkeypatch.setattr(das, "get_model", lambda: mock_model)
    monkeypatch.setattr(das, "format_prompt", lambda *_a, **_kw: "PROMPT")

    # with system prompt
    service.prompt_service = SimpleNamespace(get_system_prompt=lambda _t: "SYS")
    result1 = await service._analyze_document("doc", "tmpl", DummyResponseModel, {"x": 1})
    assert result1.skills == ["A"]
    assert "system_prompt" in mock_model.generate.call_args.kwargs

    # without system prompt
    mock_model.generate.reset_mock()
    service.prompt_service = SimpleNamespace(get_system_prompt=lambda _t: "")
    result2 = await service._analyze_document("doc", "tmpl", DummyResponseModel, {"x": 1})
    assert result2.skills == ["A"]
    assert "system_prompt" not in mock_model.generate.call_args.kwargs


@pytest.mark.asyncio
async def test__analyze_document_generation_error(
    monkeypatch: pytest.MonkeyPatch, service: das.DocumentAnalysisService
) -> None:
    mock_model = SimpleNamespace(generate=AsyncMock(side_effect=RuntimeError("gen fail")))
    monkeypatch.setattr(das, "get_model", lambda: mock_model)
    monkeypatch.setattr(das, "format_prompt", lambda *_a, **_kw: "PROMPT")
    service.prompt_service = SimpleNamespace(get_system_prompt=lambda _t: "")

    with pytest.raises(AIError) as exc:
        await service._analyze_document("doc", "tmpl", DummyResponseModel, {})
    assert exc.value.error_type == AIErrorType.GENERATION_ERROR


@pytest.mark.asyncio
async def test_extract_skills_paths(
    monkeypatch: pytest.MonkeyPatch, service: das.DocumentAnalysisService
) -> None:
    # force availability gate
    service.is_enabled = True
    service.is_initialized = True

    service.analyze_resume = AsyncMock(return_value=das.ResumeAnalysisResult(skills=["Py", "TS"]))
    resume_skills = await service.extract_skills("resume text", "resume")
    assert resume_skills == ["Py", "TS"]

    service.analyze_job_description = AsyncMock(
        return_value=das.JobDescriptionAnalysisResult(
            required_skills=["AWS"], preferred_skills=["Docker"]
        )
    )
    job_skills = await service.extract_skills("job text", "job_description")
    assert job_skills == ["AWS", "Docker"]

    class SkillModel(BaseModel):
        skills: list[str]

    service.analyze_document_generic = AsyncMock(return_value=SkillModel(skills=["SQL"]))
    generic_skills = await service.extract_skills("doc", "portfolio")
    assert generic_skills == ["SQL"]


@pytest.mark.asyncio
async def test_extract_skills_unavailable_or_failure_returns_empty(
    service: das.DocumentAnalysisService,
) -> None:
    service.is_enabled = False
    service.is_initialized = False
    assert await service.extract_skills("x", "resume") == []

    service.is_enabled = True
    service.is_initialized = True
    service.analyze_resume = AsyncMock(side_effect=RuntimeError("boom"))
    assert await service.extract_skills("x", "resume") == []


@pytest.mark.asyncio
async def test_singleton_and_convenience_functions(monkeypatch: pytest.MonkeyPatch) -> None:
    das._document_analysis_service = None
    s1 = das.get_document_analysis_service()
    s2 = das.get_document_analysis_service()
    assert s1 is s2

    mock_service = SimpleNamespace(
        analyze_resume=AsyncMock(return_value=das.ResumeAnalysisResult(skills=["A"])),
        analyze_job_description=AsyncMock(return_value=das.JobDescriptionAnalysisResult(title="T")),
    )
    monkeypatch.setattr(das, "get_document_analysis_service", lambda: mock_service)

    rr = await das.analyze_resume("a" * 30)
    jr = await das.analyze_job_description("b" * 30)
    assert rr.skills == ["A"]
    assert jr.title == "T"
