"""Expanded coverage tests for asset review endpoints."""

from __future__ import annotations

from datetime import datetime

import pytest

from app.api.endpoints import asset_review as ar


@pytest.fixture(autouse=True)
def _reset_storage():
    ar.REVIEWS_STORAGE.clear()
    ar.OVERRIDES_STORAGE.clear()
    yield
    ar.REVIEWS_STORAGE.clear()
    ar.OVERRIDES_STORAGE.clear()


def test_bulk_submit_review(client):
    payload = {
        "asset_ids": ["KR-SOLID-100", "KR-SOLID-101"],
        "bulk_decision": "approved",
        "reason": "Batch reviewed",
        "reviewed_by": "qa@example.com",
    }
    response = client.post("/api/asset-review/bulk-submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["assets_reviewed"] == 2
    assert ar.REVIEWS_STORAGE["KR-SOLID-100"]["is_bulk"] is True


def test_override_and_review_history(client):
    review = {
        "asset_id": "KR-SOLID-200",
        "overall_decision": "conditional-approval",
        "cultural_feedback": "acceptable with caveats",
        "reviewed_by": "reviewer@example.com",
        "confidence": 0.75,
        "overrides": [],
    }
    submit = client.post("/api/asset-review/submit", json=review)
    assert submit.status_code == 200

    override = {
        "violation_id": "warn-1",
        "decision": "accept",
        "justification": "Contextually valid",
        "reviewed_by": "reviewer@example.com",
        "reviewed_at": datetime.utcnow().isoformat(),
    }
    override_resp = client.post("/api/asset-review/override/KR-SOLID-200/warn-1", json=override)
    assert override_resp.status_code == 200
    assert override_resp.json()["override_id"] == "KR-SOLID-200_warn-1"

    history = client.get("/api/asset-review/asset/KR-SOLID-200/review-history")
    assert history.status_code == 200
    assert history.json()["asset_id"] == "KR-SOLID-200"
    assert len(history.json()["overrides"]) == 1


def test_review_history_not_found(client):
    response = client.get("/api/asset-review/asset/KR-SOLID-999/review-history")
    assert response.status_code == 404


def test_export_reviews_json_and_csv_and_invalid_format(client):
    payload = {
        "asset_id": "KR-SOLID-300",
        "overall_decision": "rejected",
        "cultural_feedback": "fails review",
        "reviewed_by": "rev@example.com",
        "confidence": 0.5,
        "overrides": [],
    }
    assert client.post("/api/asset-review/submit", json=payload).status_code == 200

    json_resp = client.post("/api/asset-review/export-reviews?format=json&include_rejected=false")
    assert json_resp.status_code == 200
    assert json_resp.json()["total_reviews"] == 0

    csv_resp = client.post("/api/asset-review/export-reviews?format=csv&include_rejected=true")
    assert csv_resp.status_code == 200
    assert "asset_id,decision" in csv_resp.json()["csv"]

    bad_resp = client.post("/api/asset-review/export-reviews?format=xml")
    assert bad_resp.status_code == 400


def test_clear_reviews_requires_confirmation(client):
    payload = {
        "asset_id": "KR-SOLID-400",
        "overall_decision": "approved",
        "cultural_feedback": "ok",
        "reviewed_by": "rev@example.com",
        "confidence": 0.9,
        "overrides": [],
    }
    assert client.post("/api/asset-review/submit", json=payload).status_code == 200

    no_confirm = client.delete("/api/asset-review/clear-reviews?confirm=false")
    assert no_confirm.status_code == 400

    confirmed = client.delete("/api/asset-review/clear-reviews?confirm=true")
    assert confirmed.status_code == 200
    assert confirmed.json()["reviews_deleted"] >= 1
    assert len(ar.REVIEWS_STORAGE) == 0
