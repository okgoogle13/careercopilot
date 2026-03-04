"""Unit tests for the document processing helpers."""

import asyncio
import importlib.util
import json
import sys
from contextlib import contextmanager
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest
from pydantic import BaseModel

MODULE_PATH = Path(__file__).resolve().parents[2] / "core/document_processing.py"


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for isolated tests."""
    return None


@contextmanager
def _patched_modules(modules):
    originals = {name: sys.modules.get(name) for name in modules}
    try:
        for name, module in modules.items():
            sys.modules[name] = module
        yield
    finally:
        for name, original in originals.items():
            if original is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = original


def _load_module():
    """Load the module with stubs for AI client, config, and AI errors."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []

    ai_client_module = ModuleType("app.core.ai_client")

    class AIRequest:
        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)

    class _Response:
        def __init__(self, content="ok"):
            self.content = content

    class _Client:
        def __init__(self):
            self.requests = []

        async def generate_text(self, request):
            self.requests.append(request)
            return _Response('{"value": "generated"}')

    client = _Client()
    ai_client_module.AIRequest = AIRequest
    ai_client_module.get_ai_client = lambda: client
    ai_client_module._client = client

    ai_error_module = ModuleType("app.core.ai_error_handling")

    class AIError(Exception):
        def __init__(self, error_type, message, details=None):
            super().__init__(message)
            self.error_type = error_type
            self.message = message
            self.details = details or {}

    class AIErrorType:
        API_ERROR = "api_error"
        PARSE_ERROR = "parse_error"
        PROCESSING_ERROR = "processing_error"

    ai_error_module.AIError = AIError
    ai_error_module.AIErrorType = AIErrorType

    config_module = ModuleType("app.core.config")
    config_module.settings = SimpleNamespace(
        ai_model="gemini-test",
        ai_max_tokens=512,
        ai_temperature=0.3,
    )

    core_module.ai_client = ai_client_module
    core_module.ai_error_handling = ai_error_module
    core_module.config = config_module

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.core.ai_client": ai_client_module,
        "app.core.ai_error_handling": ai_error_module,
        "app.core.config": config_module,
    }

    with _patched_modules(stubs):
        module_name = f"_document_processing_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        return module


class _ResultModel(BaseModel):
    value: str


def test_prompt_template_formats_with_instructions_and_json_suffix():
    """PromptTemplate should enforce required variables and append JSON guidance."""
    module = _load_module()
    template = module.PromptTemplate(
        template="Hello {name}",
        required_variables=["name"],
        instructions="Follow the rules.",
    )

    result = template.format(name="Nina")

    assert result.startswith("Follow the rules.")
    assert "Hello Nina" in result
    assert result.endswith("Please respond with valid JSON only.")

    with pytest.raises(ValueError, match="Missing required template variables"):
        template.format()


def test_process_document_rejects_empty_and_short_inputs():
    """Input validation should fail before any AI calls."""
    module = _load_module()
    template = module.PromptTemplate(template="{content}", required_variables=["content"])

    with pytest.raises(module.DocumentProcessingError, match="non-empty string"):
        asyncio.run(module.process_document("", template, _ResultModel))

    with pytest.raises(module.DocumentProcessingError, match="too short"):
        asyncio.run(module.process_document(" small ", template, _ResultModel))


def test_process_document_formats_prompt_and_parses_result(monkeypatch):
    """The happy path should format the prompt, call AI, and parse JSON."""
    module = _load_module()
    template = module.PromptTemplate(
        template="Resume: {content} / Role: {role}",
        required_variables=["content", "role"],
    )

    async def fake_request(prompt, model, max_tokens, temperature):
        assert "Resume: This is a valid resume body" in prompt
        assert "Role: Analyst" in prompt
        assert model == "custom-model"
        assert max_tokens == 256
        assert temperature == 0.8
        return '{"value": "parsed"}'

    monkeypatch.setattr(module, "_make_ai_request", fake_request)

    result = asyncio.run(
        module.process_document(
            file_content="This is a valid resume body",
            prompt_template=template,
            response_model=_ResultModel,
            processor_config={"model": "custom-model", "max_tokens": 256, "temperature": 0.8},
            role="Analyst",
        )
    )

    assert result == _ResultModel(value="parsed")


def test_process_document_wraps_ai_failures(monkeypatch):
    """Unexpected processing errors should be wrapped as DocumentProcessingError."""
    module = _load_module()
    template = module.PromptTemplate(template="{content}", required_variables=["content"])

    async def failing_request(*_args, **_kwargs):
        raise RuntimeError("service unavailable")

    monkeypatch.setattr(module, "_make_ai_request", failing_request)

    with pytest.raises(module.DocumentProcessingError, match="Failed to process document"):
        asyncio.run(
            module.process_document(
                file_content="This content is definitely long enough.",
                prompt_template=template,
                response_model=_ResultModel,
            )
        )


def test_make_ai_request_builds_request_and_returns_content():
    """The AI request helper should call generate_text with normalized fields."""
    module = _load_module()

    result = asyncio.run(module._make_ai_request("Prompt", "gemini", 100, 0.2))

    client = module.get_ai_client()
    request = client.requests[-1]
    assert request.service_name == "document_processing"
    assert request.user_id == "system"
    assert request.model_name == "gemini"
    assert result == '{"value": "generated"}'


def test_make_ai_request_wraps_client_errors(monkeypatch):
    """AI client failures should be re-raised as AIError."""
    module = _load_module()

    class _BrokenClient:
        async def generate_text(self, _request):
            raise RuntimeError("network down")

    monkeypatch.setattr(module, "get_ai_client", lambda: _BrokenClient())

    with pytest.raises(module.AIError) as exc_info:
        asyncio.run(module._make_ai_request("Prompt", "gemini", 100, 0.2))

    assert exc_info.value.error_type == module.AIErrorType.API_ERROR
    assert exc_info.value.details["error"] == "network down"


def test_parse_ai_response_handles_wrapped_json_and_errors():
    """JSON parsing should trim wrappers and classify failures."""
    module = _load_module()

    parsed = module._parse_ai_response('prefix {"value": "ok"} suffix', _ResultModel)
    assert parsed == _ResultModel(value="ok")

    with pytest.raises(module.AIError) as parse_error:
        module._parse_ai_response("not json", _ResultModel)
    assert parse_error.value.error_type == module.AIErrorType.PARSE_ERROR

    with pytest.raises(module.AIError) as processing_error:
        module._parse_ai_response(json.dumps({"missing": "field"}), _ResultModel)
    assert processing_error.value.error_type == module.AIErrorType.PROCESSING_ERROR


def test_generic_document_processor_delegates_to_helpers(monkeypatch):
    """The wrapper class should expose template, parsing, and process delegation."""
    module = _load_module()
    template = module.PromptTemplate(template="{content}", required_variables=["content"])
    processor = module.GenericDocumentProcessor(template, _ResultModel, {"model": "x"})

    assert processor.get_prompt_template() is template
    assert processor.parse_response('{"value": "ok"}') == _ResultModel(value="ok")

    async def fake_process_document(**kwargs):
        assert kwargs["prompt_template"] is template
        assert kwargs["processor_config"] == {"model": "x"}
        return _ResultModel(value="done")

    monkeypatch.setattr(module, "process_document", fake_process_document)

    result = asyncio.run(processor.process("This body is long enough."))
    assert result == _ResultModel(value="done")


def test_convenience_functions_delegate_to_process_document(monkeypatch):
    """Resume, job description, and comparison helpers should call process_document."""
    module = _load_module()
    calls = []

    async def fake_process_document(**kwargs):
        calls.append(kwargs)
        return SimpleNamespace(ok=True)

    monkeypatch.setattr(module, "process_document", fake_process_document)

    ai_module = ModuleType("app.ai")
    ai_module.__path__ = []
    resume_service_module = ModuleType("app.ai.resume_service")

    class ResumeAnalysisResult(BaseModel):
        skills: list[str] = []

    resume_service_module.ResumeAnalysisResult = ResumeAnalysisResult

    with _patched_modules({"app.ai": ai_module, "app.ai.resume_service": resume_service_module}):
        asyncio.run(module.process_resume("This resume text is long enough."))

    asyncio.run(module.process_job_description("This job description is long enough."))
    asyncio.run(module.compare_resume_to_job("resume text", "job description"))

    assert calls[0]["prompt_template"] is module.PromptTemplates.RESUME_ANALYSIS
    assert calls[1]["prompt_template"] is module.PromptTemplates.JOB_DESCRIPTION_ANALYSIS
    assert calls[2]["prompt_template"] is module.PromptTemplates.DOCUMENT_COMPARISON
    assert calls[2]["file_content"] == "comparison_request"
