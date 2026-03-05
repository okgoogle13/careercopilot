"""Comprehensive tests for application_strategy_workflow."""

import importlib
import types
from unittest.mock import AsyncMock

import pytest


def _load_module():
    fake_genkit = types.SimpleNamespace(flow=lambda **_kwargs: (lambda fn: fn))

    import sys

    sys.modules["genkit"] = fake_genkit
    sys.modules.pop("app.genkit_flows.application_strategy_workflow", None)
    return importlib.import_module("app.genkit_flows.application_strategy_workflow")


@pytest.mark.asyncio
async def test_create_application_strategy_happy_path(monkeypatch):
    module = _load_module()
    monkeypatch.setattr(
        module, "ApplicationStrategyResult", lambda **kwargs: types.SimpleNamespace(**kwargs)
    )

    monkeypatch.setattr(
        module,
        "extract_job_listing_details_flow",
        AsyncMock(
            return_value=types.SimpleNamespace(
                company_name="Org",
                role_title="Case Manager",
                key_responsibilities=["Support clients", "Coordinate services"],
            )
        ),
    )
    monkeypatch.setattr(
        module,
        "research_company",
        lambda _name: types.SimpleNamespace(
            strategic_focus="Community outcomes", communication_style="Empathetic"
        ),
    )
    monkeypatch.setattr(
        module,
        "gap_hunter_flow",
        lambda **_kwargs: types.SimpleNamespace(
            evidence_found=["Ran support program", "Led outreach"]
        ),
    )
    monkeypatch.setattr(
        module,
        "optimize_resume",
        AsyncMock(
            return_value={
                "resume_text": "optimized",
                "keywords_integrated": ["care"],
                "improvements_made": [],
            }
        ),
    )

    result = await module.create_application_strategy("https://job", "resume", ["care"])

    assert "Strategy for Org" in result.strategy_summary
    assert "Bridged 2 gaps" in result.strategy_summary


@pytest.mark.asyncio
async def test_create_application_strategy_job_extraction_failure(monkeypatch):
    module = _load_module()
    monkeypatch.setattr(
        module, "ApplicationStrategyResult", lambda **kwargs: types.SimpleNamespace(**kwargs)
    )

    monkeypatch.setattr(
        module,
        "extract_job_listing_details_flow",
        AsyncMock(side_effect=RuntimeError("extract fail")),
    )
    monkeypatch.setattr(
        module, "gap_hunter_flow", lambda **_kwargs: types.SimpleNamespace(evidence_found=[])
    )
    monkeypatch.setattr(
        module,
        "optimize_resume",
        AsyncMock(
            return_value={
                "resume_text": "optimized",
                "keywords_integrated": [],
                "improvements_made": [],
            }
        ),
    )

    result = await module.create_application_strategy("https://job", "resume", ["care"])

    assert result.corporate_profile is None
    assert "Strategy for Target Company" in result.strategy_summary


@pytest.mark.asyncio
async def test_create_application_strategy_tolerates_corporate_and_gap_failures(monkeypatch):
    module = _load_module()
    monkeypatch.setattr(
        module, "ApplicationStrategyResult", lambda **kwargs: types.SimpleNamespace(**kwargs)
    )

    monkeypatch.setattr(
        module,
        "extract_job_listing_details_flow",
        AsyncMock(
            return_value=types.SimpleNamespace(
                company_name="Org",
                role_title="Case Manager",
                key_responsibilities=["Support clients"],
            )
        ),
    )
    monkeypatch.setattr(
        module, "research_company", lambda _name: (_ for _ in ()).throw(RuntimeError("corp fail"))
    )
    monkeypatch.setattr(
        module, "gap_hunter_flow", lambda **_kwargs: (_ for _ in ()).throw(RuntimeError("gap fail"))
    )
    monkeypatch.setattr(
        module,
        "optimize_resume",
        AsyncMock(
            return_value={
                "resume_text": "optimized",
                "keywords_integrated": [],
                "improvements_made": [],
            }
        ),
    )

    result = await module.create_application_strategy("https://job", "resume", ["care"])

    assert result.corporate_profile is None
    assert result.gap_analysis is None
    assert "Standard Optimization" in result.strategy_summary
