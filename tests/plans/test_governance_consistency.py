import json
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTROL_ROOT = (
    REPO_ROOT
    / "docs"
    / "project"
    / "active"
    / "frontend-source-of-truth-migration"
    / "control"
)
CONTRACTS_ROOT = (
    REPO_ROOT
    / "docs"
    / "project"
    / "active"
    / "frontend-source-of-truth-migration"
    / "contracts"
)


def load_artifact(name):
    paths = {
        "route-matrix": CONTROL_ROOT / "route-matrix.json",
        "gap-map": CONTROL_ROOT / "gap-map.json",
    }
    return json.loads(paths[name].read_text())


def find_route(data, route_id):
    matches = [row for row in data["rows"] if row["route_id"] == route_id]
    assert len(matches) == 1, f"Expected exactly 1 route with route_id '{route_id}', found {len(matches)}"
    return matches[0]


def find_feature(data, feature_id):
    matches = [feature for feature in data["features"] if feature["feature_id"] == feature_id]
    assert len(matches) == 1, (
        f"Expected exactly 1 feature with feature_id '{feature_id}', found {len(matches)}"
    )
    return matches[0]


def test_gap_fill_script_uses_canonical_deprecated_archetype_list():
    """Gap-fill planner should match the canonical deprecated archetype list."""
    script_text = (REPO_ROOT / "scripts" / "derive-gap-fill-plan.py").read_text(encoding="utf-8")
    assert 'BANNED_ARCHETYPES = ("Seed", "Pebble", "Lens", "Jar", "Cabinet")' in script_text


def test_gap_fill_script_uses_timezone_utc():
    """Gap-fill planner should use timezone.utc instead of datetime.UTC."""
    script_text = (REPO_ROOT / "scripts" / "derive-gap-fill-plan.py").read_text(encoding="utf-8")
    assert "from datetime import datetime, timezone" in script_text
    assert "datetime.now(timezone.utc)" in script_text
    assert "datetime.now(UTC)" not in script_text
    assert "from datetime import datetime, UTC" not in script_text


def test_route_matrix_metadata_points_to_blueprint():
    """Route matrix metadata must point at the canonical blueprint."""
    route_matrix = load_artifact("route-matrix")
    assert (
        route_matrix["canonical_plan"]
        == "docs/project/active/frontend-source-of-truth-migration/control/blueprint.md"
    )
    assert route_matrix["row_count"] == len(route_matrix["rows"])


def test_gap_map_metadata_points_to_canonical_control_files():
    """Gap map metadata must point at the canonical blueprint and route matrix."""
    gap_map = load_artifact("gap-map")
    assert (
        gap_map["canonical_plan"]
        == "docs/project/active/frontend-source-of-truth-migration/control/blueprint.md"
    )
    assert (
        gap_map["canonical_route_matrix"]
        == "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json"
    )


def test_tracker_route_and_applications_crud_feature_are_aligned():
    """Tracker route and applications_crud gap entry must agree on ownership."""
    route_matrix = load_artifact("route-matrix")
    gap_map = load_artifact("gap-map")

    tracker = find_route(route_matrix, "tracker")
    applications_crud = find_feature(gap_map, "applications_crud")

    assert tracker["target_route"] == "/tracker"
    assert tracker["target_runtime_owner"] == "ApplicationTracker"
    assert "applications_crud" in tracker["backend_capabilities"]
    assert applications_crud["owner_route"] == tracker["target_route"]
    assert applications_crud["owner_surface"] == tracker["target_runtime_owner"]
    assert applications_crud["frontend_status"] == "mock_only"


def test_profile_route_and_voice_feature_are_aligned():
    """Profile route and voice ownership must agree on the canonical owner."""
    route_matrix = load_artifact("route-matrix")
    gap_map = load_artifact("gap-map")

    profile = find_route(route_matrix, "profile")
    voice = find_feature(gap_map, "voice_profile_capture")

    assert profile["target_route"] == "/profile"
    assert profile["target_runtime_owner"] == "ProfileView"
    assert voice["owner_route"] == profile["target_route"]
    assert voice["owner_surface"] == profile["target_runtime_owner"]


def test_ingestion_route_and_gap_entry_are_aligned():
    """Ingestion route and smart-ingestion gap entry must agree on ownership."""
    route_matrix = load_artifact("route-matrix")
    gap_map = load_artifact("gap-map")

    ingest = find_route(route_matrix, "career_ingest")
    ingestion_feature = find_feature(gap_map, "smart_ingestion_asset_pipeline")

    assert ingest["target_route"] == "/career/ingest"
    assert ingest["target_runtime_owner"] == "IngestionPage"
    assert ingestion_feature["owner_route"] == ingest["target_route"]
    assert ingestion_feature["owner_surface"] == ingest["target_runtime_owner"]


def test_js_validator_targets_canonical_control_workspace():
    """JS governance validator must be anchored to the canonical control workspace."""
    script_text = (
        REPO_ROOT / "frontend" / "scripts" / "validate-governance-artifacts.mjs"
    ).read_text(encoding="utf-8")
    assert "route-matrix.json" in script_text
    assert "gap-map.json" in script_text
    assert "frontend-source-of-truth-migration" in script_text
    assert ".claude', 'route-family-map.json" not in script_text
    assert ".claude', 'plans', 'frontend-capability-gap-matrix.json" not in script_text


def test_js_validator_emits_expected_json_contract():
    """JS validator should emit the deterministic JSON contract for canonical artifacts."""
    result = subprocess.run(
        ["node", "frontend/scripts/validate-governance-artifacts.mjs"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    payload = json.loads(result.stdout)
    assert payload["ok"] is True
    assert payload["validated"] == ["route-matrix", "gap-map"]
    assert payload["artifacts"]["route_matrix"].endswith(
        "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json"
    )
    assert payload["artifacts"]["gap_map"].endswith(
        "docs/project/active/frontend-source-of-truth-migration/control/gap-map.json"
    )


def test_tracker_contract_references_stable_filenames():
    """Tracker contract docs must use stable filenames instead of dated artifact names."""
    build_contract = (CONTRACTS_ROOT / "build-contract-tracker.xml").read_text(encoding="utf-8")
    briefs = (CONTRACTS_ROOT / "tracker-supplementary-component-briefs.xml").read_text(
        encoding="utf-8"
    )

    assert 'prompt_artifact="wireframe-build-contract-prompt.md"' in build_contract
    assert 'supplementary_briefs="tracker-supplementary-component-briefs.xml"' in build_contract
    assert "2026-03-14-wireframe-build-contract-prompt.md" not in build_contract
    assert 'build_contract_ref="build-contract-tracker.xml"' in briefs
    assert 'gap_map_ref="../control/gap-map.json"' in briefs
    assert "2026-03-14-build-contract-tracker.xml" not in briefs
    assert "2026-03-13-backend-feature-frontend-component-gap-map.json" not in briefs


def test_no_absolute_paths_in_control_artifacts():
    """Canonical control artifacts must not contain machine-specific absolute paths."""
    for path in (CONTROL_ROOT / "route-matrix.json", CONTROL_ROOT / "gap-map.json"):
        text = path.read_text(encoding="utf-8")
        assert "/Users/" not in text, f"{path.name} contains absolute /Users/ paths"
        assert r"C:\\" not in text, f"{path.name} contains absolute Windows paths"
        assert "/home/" not in text, f"{path.name} contains absolute /home/ paths"
