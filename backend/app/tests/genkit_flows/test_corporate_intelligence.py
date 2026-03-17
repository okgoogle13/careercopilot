"""Focused tests for the corporate intelligence helper."""

from types import SimpleNamespace

from app.genkit_flows import corporate_intelligence as module


def test_research_company_happy_path(monkeypatch):
    """Structured Gemini output should be parsed into a corporate profile."""
    monkeypatch.setattr(
        module,
        "SearchService",
        lambda: SimpleNamespace(research_company=lambda name: "Test Research Summary"),
    )
    monkeypatch.setattr(
        module,
        "_get_model",
        lambda: SimpleNamespace(
            generate_content=lambda *args, **kwargs: SimpleNamespace(
                text='{"name":"Test Company","mission_statement":"Test Mission","core_values":["Value1","Value2"],"strategic_focus":"Test Focus","communication_style":"Test Style","known_for":"Test Known"}'
            )
        ),
    )

    profile = module.research_company("Test Company")

    assert isinstance(profile, module.CorporateProfile)
    assert profile.name == "Test Company"
    assert profile.core_values == ["Value1", "Value2"]


def test_research_company_falls_back_when_search_fails(monkeypatch):
    """Missing search data should return the default fallback profile."""
    monkeypatch.setattr(
        module,
        "SearchService",
        lambda: SimpleNamespace(research_company=lambda name: None),
    )

    profile = module.research_company("Test Company")

    assert profile.mission_statement == "Information not available (Search failed)"
    assert profile.known_for == "Unknown"


def test_research_company_falls_back_without_genai(monkeypatch):
    """Without a model, the helper should use the research summary directly."""
    monkeypatch.setattr(
        module,
        "SearchService",
        lambda: SimpleNamespace(research_company=lambda name: "Test Research Summary"),
    )
    monkeypatch.setattr(module, "get_configured_google_generativeai", lambda x: None)
    monkeypatch.setattr(module, "_get_model", lambda: None)

    profile = module.research_company("Test Company")

    assert profile.name == "Test Company"
    assert profile.mission_statement == "Test Research Summary"


def test_research_company_returns_error_profile_on_parse_failure(monkeypatch):
    """Model or parsing errors should return the explicit error fallback."""
    monkeypatch.setattr(
        module,
        "SearchService",
        lambda: SimpleNamespace(research_company=lambda name: "Test Research Summary"),
    )
    monkeypatch.setattr(
        module,
        "_get_model",
        lambda: SimpleNamespace(
            generate_content=lambda *args, **kwargs: (_ for _ in ()).throw(RuntimeError("boom"))
        ),
    )

    profile = module.research_company("Test Company")

    assert profile.mission_statement == "Error parsing research data"
    assert profile.core_values == ["Error"]


def test_resolve_search_summary_handles_async_results():
    """Async search-service results should be resolved into strings."""

    async def _research():
        return "Async Summary"

    assert module._resolve_search_summary(_research()) == "Async Summary"
