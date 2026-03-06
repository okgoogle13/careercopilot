from __future__ import annotations

import pytest

from app.core.input_validation import (
    InputSanitizer,
    InputValidationError,
    create_analysis_prompt,
)


def test_sanitize_text_input_decodes_html_entities() -> None:
    text = "Research &amp; development"
    result = InputSanitizer.sanitize_text_input(text)
    assert result.sanitized_content == "Research & development"


def test_sanitize_dict_input_skips_invalid_string_fields() -> None:
    data = {
        "valid": "good text",
        "invalid_empty": "   ",
        "nested": {"inner_invalid": "", "inner_valid": "ok"},
    }
    out = InputSanitizer.sanitize_dict_input(data)
    assert out["valid"] == "good text"
    assert "invalid_empty" not in out
    assert "inner_invalid" not in out["nested"]
    assert out["nested"]["inner_valid"] == "ok"


def test_create_safe_prompt_rejects_generated_prompt_too_long() -> None:
    template = "{content}"
    huge = "a" * (InputSanitizer.MAX_PROMPT_LENGTH * 2 + 1)
    with pytest.raises(InputValidationError, match="Generated prompt too long"):
        InputSanitizer.create_safe_prompt(template, content=huge)


def test_create_safe_prompt_wraps_general_exception() -> None:
    class _BadTemplate:
        def format(self, **_kwargs):
            raise RuntimeError("format exploded")

    with pytest.raises(InputValidationError, match="Prompt creation failed"):
        InputSanitizer.create_safe_prompt(_BadTemplate(), value="x")


def test_create_analysis_prompt_convenience() -> None:
    prompt = create_analysis_prompt(
        "Resume: {resume_text} Job: {job_description}",
        resume="Skilled engineer",
        job_desc="Build APIs",
    )
    assert "Skilled engineer" in prompt
    assert "Build APIs" in prompt


def test_sanitize_dict_input_preserves_non_string_values() -> None:
    data = {"num": 42, "flag": True, "items": ["ok", 7]}
    out = InputSanitizer.sanitize_dict_input(data)
    assert out["num"] == 42
    assert out["flag"] is True
    assert out["items"][1] == 7


def test_create_safe_prompt_handles_dict_and_non_string_kwargs() -> None:
    prompt = InputSanitizer.create_safe_prompt(
        "meta={meta} count={count}",
        meta={"k": "v"},
        count=3,
    )
    assert "count=3" in prompt


def test_sanitize_text_input_truncation_branch(monkeypatch: pytest.MonkeyPatch) -> None:
    def _fake_sub(pattern, repl, string, count=0, flags=0):
        if pattern == r"\s+":
            return "x" * 20
        return re_sub(pattern, repl, string, count=count, flags=flags)

    import re as _re

    re_sub = _re.sub
    monkeypatch.setattr(_re, "sub", _fake_sub)
    result = InputSanitizer.sanitize_text_input("abc", max_length=10)
    assert result.sanitized_content.endswith("...")
    assert "Content truncated to fit length limit" in result.warnings
