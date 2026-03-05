"""Unit tests for ai_operations analyzers."""

import json
from types import SimpleNamespace

import pytest

from app.ai_operations.job_analyzer import JobAnalyzer
from app.ai_operations.resume_analyzer import ResumeAnalyzer
from app.core.input_validation import InputValidationError


class _FakeCache:
    CACHE_CONFIGS = {"default": {"ttl": 3600}}

    async def get(self, *_args, **_kwargs):
        return None

    async def set(self, *_args, **_kwargs):
        return True


@pytest.fixture(autouse=True)
def patch_cache(monkeypatch):
    monkeypatch.setattr("app.core.cache_decorators.get_ai_cache", lambda: _FakeCache())


@pytest.fixture
def sanitized_input(monkeypatch):
    sanitizer = SimpleNamespace(sanitized_content="cleaned content")
    monkeypatch.setattr(
        "app.ai_operations.job_analyzer.InputSanitizer.sanitize_text_input",
        lambda _text: sanitizer,
    )
    monkeypatch.setattr(
        "app.ai_operations.resume_analyzer.InputSanitizer.sanitize_text_input",
        lambda _text: sanitizer,
    )
    return sanitizer


@pytest.mark.asyncio
async def test_job_analyzer_rejects_invalid_input():
    analyzer = JobAnalyzer()

    with pytest.raises(InputValidationError):
        await analyzer.analyze_job_description("u1", "")

    with pytest.raises(InputValidationError):
        await analyzer.analyze_job_description("u1", 123)  # type: ignore[arg-type]


@pytest.mark.asyncio
async def test_job_analyzer_returns_dict_result(sanitized_input):
    analyzer = JobAnalyzer()
    analyzer.job_analysis_flow = lambda **_kwargs: {"job_title": "Case Manager"}

    result = await analyzer.analyze_job_description("u1", "raw")

    assert result == {"job_title": "Case Manager"}


@pytest.mark.asyncio
async def test_job_analyzer_parses_json_string(sanitized_input):
    analyzer = JobAnalyzer()
    analyzer.job_analysis_flow = lambda **_kwargs: json.dumps({"job_title": "Social Worker"})

    result = await analyzer.analyze_job_description("u1", "raw")

    assert result["job_title"] == "Social Worker"


@pytest.mark.asyncio
async def test_job_analyzer_wraps_non_json_string(sanitized_input):
    analyzer = JobAnalyzer()
    analyzer.job_analysis_flow = lambda **_kwargs: "plain analysis"

    result = await analyzer.analyze_job_description("u1", "raw")

    assert result == {"analysis": "plain analysis", "raw_output": True}


@pytest.mark.asyncio
async def test_resume_analyzer_rejects_invalid_resume_input():
    analyzer = ResumeAnalyzer()

    with pytest.raises(InputValidationError):
        await analyzer.analyze_resume("u1", "")

    with pytest.raises(InputValidationError):
        await analyzer.analyze_resume("u1", 42)  # type: ignore[arg-type]


@pytest.mark.asyncio
async def test_resume_analyzer_returns_dict_result(sanitized_input):
    analyzer = ResumeAnalyzer()
    analyzer.compare_flow = lambda **_kwargs: {"score": 88}

    result = await analyzer.analyze_resume("u1", "resume text", {"job_title": "Role"})

    assert result == {"score": 88}


@pytest.mark.asyncio
async def test_resume_analyzer_wraps_non_json_string(sanitized_input):
    analyzer = ResumeAnalyzer()
    analyzer.compare_flow = lambda **_kwargs: "resume analysis"

    result = await analyzer.analyze_resume("u1", "resume text")

    assert result == {"analysis": "resume analysis", "raw_output": True}


@pytest.mark.asyncio
async def test_compare_to_job_validates_job_analysis_data(sanitized_input):
    analyzer = ResumeAnalyzer()

    with pytest.raises(InputValidationError):
        await analyzer.compare_to_job("u1", "resume", {})

    with pytest.raises(InputValidationError):
        await analyzer.compare_to_job("u1", "resume", "not-a-dict")  # type: ignore[arg-type]


@pytest.mark.asyncio
async def test_compare_to_job_wraps_non_json_string(sanitized_input):
    analyzer = ResumeAnalyzer()
    analyzer.compare_flow = lambda **_kwargs: "comparison output"

    result = await analyzer.compare_to_job("u1", "resume", {"job_title": "Role"})

    assert result == {"comparison": "comparison output", "raw_output": True}
