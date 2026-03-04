"""Focused tests for the keyword placer flow."""

from types import SimpleNamespace

from app.genkit_flows import keyword_placer as module


def _response_for(*keywords):
    return module.KeywordPlacementResponse(
        suggestions=[
            module.KeywordPlacementSuggestion(
                keyword=keyword,
                suggested_location="Summary",
                example_sentence=f"Example sentence for {keyword}.",
            )
            for keyword in keywords
        ]
    )


def test_suggest_keyword_placement_happy_path(monkeypatch):
    """The flow should return the structured model output."""
    expected = _response_for("keyword1", "keyword2")
    fake_model = SimpleNamespace(
        generate=lambda *args, **kwargs: SimpleNamespace(output=lambda: expected)
    )
    monkeypatch.setattr(module, "get_model", lambda: fake_model)

    result = module.suggestKeywordPlacement(
        "Experienced professional with a strong background.",
        ["keyword1", "keyword2"],
    )

    assert result == expected


def test_suggest_keyword_placement_with_empty_keywords(monkeypatch):
    """An empty missing-keyword list should still return a valid schema response."""
    expected = module.KeywordPlacementResponse(suggestions=[])
    fake_model = SimpleNamespace(
        generate=lambda *args, **kwargs: SimpleNamespace(output=lambda: expected)
    )
    monkeypatch.setattr(module, "get_model", lambda: fake_model)

    result = module.suggestKeywordPlacement("Experienced professional.", [])

    assert result.suggestions == []


def test_keyword_placement_schema():
    """The schema should validate structured suggestions."""
    payload = _response_for("keyword1")

    assert isinstance(payload, module.KeywordPlacementResponse)
    assert payload.suggestions[0].keyword == "keyword1"
