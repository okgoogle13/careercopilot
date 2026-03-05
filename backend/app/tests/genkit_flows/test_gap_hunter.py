"""Focused tests for the gap hunter helper."""

from types import SimpleNamespace

import pytest

from app.genkit_flows import gap_hunter as module


def test_gap_hunter_happy_path(monkeypatch):
    """Missing skills with vector matches should produce evidence and strategy advice."""
    monkeypatch.setattr(
        module,
        "_get_generation_model",
        lambda: SimpleNamespace(
            generate_content=lambda prompt: SimpleNamespace(text="Skill1, Skill2")
        ),
    )
    vector_store = SimpleNamespace(
        query_similar=lambda query, n_results=2: [
            {"content": "Evidence for Skill", "metadata": {"source_type": "KSC"}}
        ]
    )
    monkeypatch.setattr(module, "VectorStore", lambda: vector_store)

    result = module.gap_hunter_flow("Resume content", "Job description")

    assert result.missing_skills == ["Skill1", "Skill2"]
    assert len(result.evidence_found) == 2
    assert "strategically insert" in result.strategy_advice


def test_gap_hunter_with_no_gaps(monkeypatch):
    """Empty model output should produce the no-gap fallback."""
    monkeypatch.setattr(
        module,
        "_get_generation_model",
        lambda: SimpleNamespace(generate_content=lambda prompt: SimpleNamespace(text="")),
    )
    monkeypatch.setattr(
        module, "VectorStore", lambda: SimpleNamespace(query_similar=lambda *args, **kwargs: [])
    )

    result = module.gap_hunter_flow("", "")

    assert result.missing_skills == []
    assert result.evidence_found == []
    assert result.strategy_advice == "No major gaps found."


def test_gap_hunter_with_no_evidence(monkeypatch):
    """When no vector evidence is found, the manual-add fallback should be used."""
    monkeypatch.setattr(
        module,
        "_get_generation_model",
        lambda: SimpleNamespace(generate_content=lambda prompt: SimpleNamespace(text="Skill1")),
    )
    monkeypatch.setattr(
        module, "VectorStore", lambda: SimpleNamespace(query_similar=lambda *args, **kwargs: [])
    )

    result = module.gap_hunter_flow("Resume", "Job description")

    assert result.missing_skills == ["Skill1"]
    assert result.evidence_found == []
    assert "add this manually" in result.strategy_advice


def test_gap_hunter_bubbles_model_errors(monkeypatch):
    """Unexpected model failures should propagate."""
    monkeypatch.setattr(
        module,
        "_get_generation_model",
        lambda: SimpleNamespace(
            generate_content=lambda prompt: (_ for _ in ()).throw(RuntimeError("GenAI Error"))
        ),
    )
    monkeypatch.setattr(
        module, "VectorStore", lambda: SimpleNamespace(query_similar=lambda *args, **kwargs: [])
    )

    with pytest.raises(RuntimeError, match="GenAI Error"):
        module.gap_hunter_flow("Resume", "Job description")
