"""Unit tests for file upload validation decorators."""

import importlib.util
import io
import sys
from contextlib import contextmanager
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest
from fastapi import HTTPException, UploadFile

MODULE_PATH = Path(__file__).resolve().parents[2] / "core/file_upload_decorators.py"


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


def _make_upload(filename="resume.pdf", content=b"hello world", content_type="application/pdf"):
    """Build a small UploadFile for validation tests."""
    return UploadFile(
        filename=filename, file=io.BytesIO(content), headers={"content-type": content_type}
    )


def _load_module():
    """Load the module with a lightweight config stub."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []
    config_module = ModuleType("app.core.config")
    config_module.settings = SimpleNamespace(max_file_size_mb=10)
    core_module.config = config_module

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.core.config": config_module,
    }

    with _patched_modules(stubs):
        module_name = f"_file_upload_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        return module


def test_file_upload_config_uses_settings_default():
    """Default config should inherit the max size from settings."""
    module = _load_module()
    config = module.FileUploadConfig()

    assert config.max_file_size_mb == 10
    assert ".pdf" in config.allowed_extensions
    assert "application/pdf" in config.allowed_content_types


def test_validate_file_upload_requires_file():
    """Missing files should fail immediately."""
    module = _load_module()

    with pytest.raises(module.FileValidationError, match="No file provided"):
        module.validate_file_upload(None, module.FileUploadConfig())


def test_validate_file_upload_rejects_blank_filename():
    """Blank filenames should be rejected when required."""
    module = _load_module()

    with pytest.raises(module.FileValidationError, match="Filename is required"):
        module.validate_file_upload(_make_upload(filename="   "), module.FileUploadConfig())


def test_validate_file_upload_rejects_forbidden_filename_patterns():
    """Hidden files and executable-like patterns should be blocked."""
    module = _load_module()

    with pytest.raises(module.FileValidationError, match="forbidden pattern"):
        module.validate_file_upload(_make_upload(filename=".hidden.pdf"), module.FileUploadConfig())


def test_validate_file_upload_enforces_allowed_pattern_list():
    """Allowed filename patterns should be respected when configured."""
    module = _load_module()
    config = module.FileUploadConfig(allowed_filename_patterns=[r".*resume.*"])

    with pytest.raises(module.FileValidationError, match="allowed patterns"):
        module.validate_file_upload(_make_upload(filename="cover-letter.pdf"), config)


def test_validate_file_upload_rejects_extension_and_content_type():
    """Extension and content type should each be validated."""
    module = _load_module()

    with pytest.raises(module.FileValidationError, match="File extension"):
        module.validate_file_upload(_make_upload(filename="resume.csv"), module.FileUploadConfig())

    with pytest.raises(module.FileValidationError, match="Content type"):
        module.validate_file_upload(
            _make_upload(content_type="image/png"),
            module.FileUploadConfig(),
        )


def test_validate_file_upload_enforces_size_limit():
    """Large files should be rejected when they exceed the configured limit."""
    module = _load_module()
    config = module.FileUploadConfig(max_file_size_mb=1)
    file_obj = _make_upload(content=b"x" * (2 * 1024 * 1024))

    with pytest.raises(module.FileValidationError, match="exceeds maximum allowed size"):
        module.validate_file_upload(file_obj, config)


def test_validate_file_upload_ignores_size_check_errors():
    """Unexpected file-size inspection errors should be logged and ignored."""
    module = _load_module()
    config = module.FileUploadConfig()
    upload = _make_upload()

    class _BrokenFile:
        def seek(self, *_args):
            raise RuntimeError("seek failed")

    upload.file = _BrokenFile()

    module.validate_file_upload(upload, config)


def test_validate_multiple_files_checks_count_and_wraps_indexed_failures():
    """Multi-file validation should enforce max count and annotate failing items."""
    module = _load_module()
    config = module.FileUploadConfig(max_files=1)

    with pytest.raises(module.FileValidationError, match="No files provided"):
        module.validate_multiple_files([], config)

    with pytest.raises(module.FileValidationError, match="Too many files"):
        module.validate_multiple_files([_make_upload(), _make_upload()], config)

    with pytest.raises(module.FileValidationError, match="File 1 validation failed"):
        module.validate_multiple_files(
            [_make_upload(filename=".bad.pdf")], module.FileUploadConfig()
        )


def test_require_valid_file_upload_allows_valid_single_file():
    """The decorator should pass through when the file validates."""
    module = _load_module()

    @module.require_valid_file_upload()
    async def endpoint(file):
        return {"filename": file.filename}

    result = pytest.run(asyncio=False) if False else None
    # Keep async invocation explicit without pytest-asyncio dependency.
    import asyncio

    payload = asyncio.run(endpoint(file=_make_upload()))
    assert payload == {"filename": "resume.pdf"}


def test_require_valid_file_upload_returns_400_for_missing_single_file():
    """Missing file kwargs should map to an HTTP 400."""
    module = _load_module()

    @module.require_valid_file_upload()
    async def endpoint():
        return {"ok": True}

    import asyncio

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(endpoint())

    assert exc_info.value.status_code == 400
    assert "No file parameter found" in exc_info.value.detail


def test_require_valid_file_upload_handles_multiple_files_and_validation_failures():
    """The decorator should validate list inputs for multi-file endpoints."""
    module = _load_module()

    @module.require_valid_file_upload(
        config=module.FileUploadConfig(max_files=2),
        single_file=False,
    )
    async def endpoint(files):
        return {"count": len(files)}

    import asyncio

    result = asyncio.run(
        endpoint(
            files=[_make_upload(), _make_upload(filename="notes.txt", content_type="text/plain")]
        )
    )
    assert result == {"count": 2}

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(endpoint(files=[_make_upload(filename=".bad.pdf")]))

    assert exc_info.value.status_code == 400


def test_require_valid_file_upload_converts_unexpected_errors_to_500(monkeypatch):
    """Unexpected exceptions inside validation should be converted to HTTP 500."""
    module = _load_module()

    @module.require_valid_file_upload()
    async def endpoint(file):
        return {"ok": True}

    monkeypatch.setattr(
        module,
        "validate_file_upload",
        lambda *_args, **_kwargs: (_ for _ in ()).throw(RuntimeError("boom")),
    )

    import asyncio

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(endpoint(file=_make_upload()))

    assert exc_info.value.status_code == 500


def test_convenience_upload_decorators_return_callable_wrappers():
    """Convenience helpers should produce decorators that validate expected types."""
    module = _load_module()
    assert callable(module.require_valid_resume_upload())
    assert callable(module.require_valid_job_description_upload())
    assert callable(module.require_valid_document_upload(max_files=2))
