from __future__ import annotations

import json
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette.requests import Request

if "weasyprint" not in sys.modules:
    weasyprint_mod: Any = types.ModuleType("weasyprint")
    weasyprint_mod.HTML = object
    sys.modules["weasyprint"] = weasyprint_mod

if "docx" not in sys.modules:
    docx_mod: Any = types.ModuleType("docx")
    shared_mod: Any = types.ModuleType("docx.shared")
    enum_mod: Any = types.ModuleType("docx.enum")
    text_mod: Any = types.ModuleType("docx.enum.text")

    class _RGBColor:
        def __init__(self, r: int, g: int, b: int):
            self.rgb = (r, g, b)

    class _WDAlign:
        LEFT = 0
        JUSTIFY = 3
        CENTER = 1

    shared_mod.RGBColor = _RGBColor
    shared_mod.Pt = lambda x: x
    text_mod.WD_ALIGN_PARAGRAPH = _WDAlign

    sys.modules["docx"] = docx_mod
    sys.modules["docx.shared"] = shared_mod
    sys.modules["docx.enum"] = enum_mod
    sys.modules["docx.enum.text"] = text_mod

from app.core import ats_rules
from app.core import error_handlers as eh
from app.core import limiter, pdf_renderer
from app.core import templates_repo as tr
from app.core import theme_tokens
from app.schemas.ai import LlmRequest, LlmResponse


def test_get_theme_tokens_known_and_fallback() -> None:
    assert theme_tokens.get_theme_tokens("modern")["font"]["name"] == "Arial"
    assert theme_tokens.get_theme_tokens("does-not-exist")["font"]["name"] == "Calibri"


def test_rate_limit_exceeded_handler_and_user_key() -> None:
    scope = {"type": "http", "client": ("127.0.0.1", 8000), "headers": []}
    request = Request(scope)
    response = limiter._rate_limit_exceeded_handler(request, type("Exc", (), {"detail": "burst"})())
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.body.decode("utf-8")

    request.state.user_uid = "user-123"
    assert limiter.get_user_rate_limit_key(request) == "user:user-123"
    assert limiter.get_authenticated_user_key(request) == "user:user-123"

    scope2 = {"type": "http", "client": ("127.0.0.1", 8000), "headers": []}
    request2 = Request(scope2)
    assert limiter.get_user_rate_limit_key(request2).startswith("ip:")
    with pytest.raises(HTTPException) as exc:
        limiter.get_authenticated_user_key(request2)
    assert exc.value.status_code == 401


def test_validate_template_schema_paths(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        ats_rules,
        "ATS_RULES",
        {
            "resume": {
                "required_sections": ["Summary"],
                "prohibited": ["tables", "columns", "images"],
            }
        },
    )

    valid = {
        "atsProfile": {"columns": 1, "allowsTables": False, "allowsImages": False},
        "blocks": [{"kind": "section", "title": "Summary"}],
    }
    ats_rules.validate_template_schema(valid, "resume")

    with pytest.raises(ValueError, match="Multi-column"):
        ats_rules.validate_template_schema(
            {"atsProfile": {"columns": 2}, "blocks": [{"kind": "section", "title": "Summary"}]},
            "resume",
        )
    with pytest.raises(ValueError, match="Missing required ATS headings"):
        ats_rules.validate_template_schema({"atsProfile": {}, "blocks": []}, "resume")
    with pytest.raises(ValueError, match="Tables are disabled"):
        ats_rules.validate_template_schema(
            {
                "atsProfile": {"columns": 1, "allowsTables": True, "allowsImages": False},
                "blocks": [{"kind": "section", "title": "Summary"}],
            },
            "resume",
        )


def test_template_repo_list_get_cache_and_missing(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    manifest = {
        "templates": [
            {"docType": "resume", "id": "base"},
            {"docType": "cover_letter", "id": "base"},
        ]
    }
    (tmp_path / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    (tmp_path / "resume").mkdir()
    (tmp_path / "resume" / "base.json").write_text(
        json.dumps({"atsProfile": {"columns": 1}, "blocks": []}), encoding="utf-8"
    )

    calls = {"count": 0}

    def _validate(_: dict, __: str) -> None:
        calls["count"] += 1

    monkeypatch.setattr(tr, "validate_template_schema", _validate)

    repo = tr.TemplateRepo(root=tmp_path)
    assert len(repo.list_templates()) == 2
    assert len(repo.list_templates("resume")) == 1

    first = repo.get("resume", "base")
    second = repo.get("resume", "base")
    assert first == second
    assert calls["count"] == 1

    with pytest.raises(FileNotFoundError):
        repo.get("resume", "missing")


@pytest.mark.asyncio
async def test_error_handler_and_decorator_branches() -> None:
    value_exc = eh.ErrorHandler.handle_value_error(ValueError("bad"), "ctx")
    assert value_exc.status_code == 400

    not_found = eh.ErrorHandler.handle_not_found("User", "u1")
    assert not_found.status_code == 404
    assert "u1" in str(not_found.detail)

    db_exc = eh.ErrorHandler.handle_database_error(IntegrityError("x", {}, Exception("boom")), "db")
    assert db_exc.status_code == 409

    db_exc2 = eh.ErrorHandler.handle_database_error(SQLAlchemyError("db down"), "db")
    assert db_exc2.status_code == 500

    generic = eh.ErrorHandler.handle_generic_error(RuntimeError("oops"), "run")
    assert generic.status_code == 500

    @eh.with_error_handling("decorated")
    async def _ok() -> str:
        return "ok"

    @eh.with_error_handling("decorated")
    async def _value() -> str:
        raise ValueError("bad input")

    @eh.with_error_handling("decorated")
    async def _http() -> str:
        raise HTTPException(status_code=418, detail="teapot")

    assert await _ok() == "ok"
    with pytest.raises(HTTPException) as exc:
        await _value()
    assert exc.value.status_code == 400

    with pytest.raises(HTTPException) as exc2:
        await _http()
    assert exc2.value.status_code == 418

    assert eh.safe_operation(lambda: 42, context="x", default=0) == 42
    assert eh.safe_operation(lambda: 1 / 0, context="x", default=-1) == -1


def test_pdf_renderer_paths(monkeypatch: pytest.MonkeyPatch) -> None:
    class _FakeHTML:
        def __init__(self, *, string: str):
            self.string = string

        def write_pdf(self) -> bytes:
            return self.string.encode("utf-8")

    monkeypatch.setattr(pdf_renderer, "HTML", _FakeHTML)

    cover = pdf_renderer.render_cover_letter_pdf("Para one\n\nPara two", candidate_name="Jane")
    assert b"Jane" in cover
    assert b"<p>Para one</p>" in cover

    resume = pdf_renderer.render_resume_pdf(
        {
            "basics": {"name": "Alex", "email": "alex@example.com", "phone": "0400"},
            "summary": "Summary text",
            "work": [{"role": "Engineer", "company": "Acme", "bullets": ["did x"]}],
        }
    )
    assert b"Professional Summary" in resume
    assert b"Engineer" in resume
    assert b"did x" in resume

    ksc = pdf_renderer.render_ksc_pdf(
        [{"criterion": "Communication", "response": "Strong response\n\nMore detail"}], "Role A"
    )
    assert b"Selection Criteria: Role A" in ksc
    assert b"Communication" in ksc


@pytest.mark.asyncio
async def test_llm_service_branches(monkeypatch: pytest.MonkeyPatch) -> None:
    from app.core.ai import llm_service as llm

    class _Cache:
        def __init__(self, cached=None, fail_get=False, fail_set=False):
            self.cached = cached
            self.fail_get = fail_get
            self.fail_set = fail_set
            self.set_calls = 0

        def get(self, _key):
            if self.fail_get:
                raise RuntimeError("cache read failed")
            return self.cached

        def set(self, **_kwargs):
            if self.fail_set:
                raise RuntimeError("cache write failed")
            self.set_calls += 1

        def clear_pattern(self, _pattern):
            return 7

    request = LlmRequest(prompt="hello", service_name="resume", user_id="u1")

    cached_payload = LlmResponse(content="from-cache", model_used="m", cached=False).model_dump(
        mode="json"
    )
    cache = _Cache(cached=cached_payload)
    monkeypatch.setattr(llm, "get_cache_store", lambda: cache)
    result = await llm.get_llm_response(request)
    assert result.cached is True
    assert result.content == "from-cache"

    cache2 = _Cache(cached=None)
    monkeypatch.setattr(llm, "get_cache_store", lambda: cache2)
    monkeypatch.setattr(llm, "is_genkit_enabled", lambda: False)
    result2 = await llm.get_llm_response(request)
    assert result2.model_used == "mock"
    assert result2.metadata.get("genkit_disabled") is True

    cache3 = _Cache(cached=None, fail_get=True)
    monkeypatch.setattr(llm, "get_cache_store", lambda: cache3)
    monkeypatch.setattr(llm, "is_genkit_enabled", lambda: True)

    async def _gen(_req):
        return LlmResponse(content="fresh", model_used="gemini", cached=False)

    class _ServiceConfig:
        cache_ttl_seconds = 123

    class _Cfg:
        def get_service_config(self, _name):
            return _ServiceConfig()

    monkeypatch.setattr(llm, "generate_llm_response", _gen)
    monkeypatch.setattr(llm, "get_ai_config", lambda: _Cfg())
    result3 = await llm.get_llm_response(request)
    assert result3.content == "fresh"

    async def _boom(_req):
        raise RuntimeError("ai down")

    monkeypatch.setattr(llm, "generate_llm_response", _boom)
    result4 = await llm.get_llm_response(request)
    assert result4.error == "ai down"

    assert llm.clear_cache_pattern("llm:") == 7
    assert llm.get_cache_stats()["backend"] == "sqlalchemy"
