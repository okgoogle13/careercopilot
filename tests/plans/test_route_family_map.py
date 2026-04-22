import json
from pathlib import Path


def test_route_family_map_has_all_families():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    expected = {
        "landing",
        "auth-onboarding",
        "dashboard",
        "analysis",
        "documents",
        "applications",
        "jobs",
        "generation",
        "account",
        "ingestion",
        "internal-tools",
        "landing-prototype",
        "fallback",
    }
    assert expected.issubset({item["family"] for item in data["families"]})


def test_ingestion_has_single_canonical_contract():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    ingestion = next(item for item in data["families"] if item["family"] == "ingestion")
    assert ingestion["canonical_backend_contracts"] == ["/api/v1/ingest"]


def test_capability_led_additions_declared():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    expected = {
        "application_detail_management",
        "smart_ingestion_flow",
        "voice_profile_management",
        "document_redline_workspace",
        "resume_audit_history",
    }
    assert expected.issubset({item["id"] for item in data["capability_led_additions"]})


def test_route_families_have_final_decisions():
    data = json.loads(Path(".claude/route-family-map.json").read_text())
    allowed = {"keep", "expand", "merge", "replace", "retire"}
    for family in data["families"]:
      assert family["decision"] in allowed
