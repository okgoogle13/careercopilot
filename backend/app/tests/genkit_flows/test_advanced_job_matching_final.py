from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from app.core.ai_error_handling import AIError
from app.core.input_validation import InputValidationError
from app.genkit_flows import advanced_job_matching as module


def _sanitizer() -> SimpleNamespace:
    return SimpleNamespace(
        sanitize_dict_input=lambda d: d,
        sanitize_text_input=lambda t: SimpleNamespace(sanitized_content=t),
    )


def test_rank_job_opportunities_success(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(module, "InputSanitizer", _sanitizer())

    mock_model = MagicMock()
    mock_resp = MagicMock()
    mock_resp.output.return_value = [
        {
            "job_id": "1",
            "job_title": "Eng",
            "company": "Acme",
            "match_score": 88,
            "match_reasoning": "great fit",
            "application_priority": "high",
            "estimated_success_probability": 80,
        }
    ]
    mock_model.generate.return_value = mock_resp
    monkeypatch.setattr(module, "get_model", lambda: mock_model)

    result = module.rank_job_opportunities(
        {"skills": ["python"]}, [{"id": "1", "description": "x"}]
    )
    assert result[0]["job_id"] == "1"


def test_rank_job_opportunities_validation_errors() -> None:
    with pytest.raises((AIError, Exception)):
        module.rank_job_opportunities({}, [])
    with pytest.raises((AIError, Exception)):
        module.rank_job_opportunities({"x": 1}, "bad")  # type: ignore[arg-type]
    with pytest.raises((AIError, Exception)):
        module.rank_job_opportunities({"x": 1}, [{"id": str(i)} for i in range(11)])


def test_rank_job_opportunities_model_none_or_generate_error(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(module, "InputSanitizer", _sanitizer())
    monkeypatch.setattr(module, "get_model", lambda: None)
    with pytest.raises((AIError, Exception)):
        module.rank_job_opportunities({"x": 1}, [{"id": "1"}])

    bad_model = MagicMock()
    bad_model.generate.side_effect = RuntimeError("boom")
    monkeypatch.setattr(module, "get_model", lambda: bad_model)
    with pytest.raises((AIError, Exception)):
        module.rank_job_opportunities({"x": 1}, [{"id": "1"}])


def test_analyze_market_positioning_success(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(module, "InputSanitizer", _sanitizer())
    mock_model = MagicMock()
    mock_resp = MagicMock()
    mock_resp.output.return_value = {
        "competitive_position": "strong",
        "market_demand": 80,
        "salary_competitiveness": "market_rate",
        "unique_value_proposition": ["u"],
        "market_differentiators": ["d"],
        "positioning_recommendations": ["r"],
        "target_companies": ["c"],
        "negotiation_strengths": ["n"],
    }
    mock_model.generate.return_value = mock_resp
    monkeypatch.setattr(module, "get_model", lambda: mock_model)

    result = module.analyze_market_positioning({"skills": ["py"]}, "Engineer", "Sydney")
    assert result["competitive_position"] == "strong"


def test_analyze_market_positioning_validation_and_failures(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    with pytest.raises((AIError, Exception)):
        module.analyze_market_positioning({}, "", "")

    monkeypatch.setattr(module, "InputSanitizer", _sanitizer())
    monkeypatch.setattr(module, "get_model", lambda: None)
    with pytest.raises((AIError, Exception)):
        module.analyze_market_positioning({"x": 1}, "role", "loc")

    bad_model = MagicMock()
    bad_model.generate.side_effect = RuntimeError("gen fail")
    monkeypatch.setattr(module, "get_model", lambda: bad_model)
    with pytest.raises((AIError, Exception)):
        module.analyze_market_positioning({"x": 1}, "role", "loc")


def test_analyze_job_batch_success_and_failure_paths(monkeypatch: pytest.MonkeyPatch) -> None:
    calls = {"n": 0}

    class _FakeAnalysis:
        def __init__(self, idx: int):
            self.idx = idx

        def dict(self):
            return {"score": self.idx}

    def fake_analyze(job_desc, candidate_profile):
        calls["n"] += 1
        if "bad" in job_desc:
            raise RuntimeError("cannot analyze")
        return _FakeAnalysis(calls["n"])

    monkeypatch.setattr(module, "analyze_job_match_detailed", fake_analyze)

    results = module.analyze_job_batch({"x": 1}, ["good job", "bad job", "good again"])
    assert results[0]["status"] == "success"
    assert results[1]["status"] == "failed"
    assert "cannot analyze" in results[1]["error"]


def test_analyze_job_batch_limit() -> None:
    with pytest.raises((InputValidationError, Exception)):
        module.analyze_job_batch({"x": 1}, [str(i) for i in range(6)])
