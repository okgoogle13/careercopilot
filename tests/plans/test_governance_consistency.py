import json
from pathlib import Path


def _load_artifact(name):
    paths = {
        "route-family-map": ".claude/route-family-map.json",
        "capability-gap-matrix": ".claude/plans/frontend-capability-gap-matrix.json",
        "route-family-target-state": ".claude/plans/route-family-target-state.json",
    }
    return json.loads(Path(paths[name]).read_text())


def test_ingestion_contract_resolved_in_target_state():
    """Ingestion contract must be resolved, not 'unresolved', in target-state."""
    data = _load_artifact("route-family-target-state")
    ingestion = next(
        d for d in data["cross_family_decisions"]
        if d["topic"] == "canonical_ingestion_contract"
    )
    assert ingestion["status"] == "resolved"


def test_prototype_routes_all_tracked():
    """All 5 /kr/* prototype routes must be tracked for retirement."""
    data = _load_artifact("route-family-target-state")
    lp = next(f for f in data["families"] if f["family"] == "landing-prototype")
    expected_routes = {"/kr/landing", "/kr/auth", "/kr/onboarding", "/kr/analysis", "/kr/dashboard"}
    assert expected_routes.issubset(set(lp["current_runtime_routes"]))


def test_prototype_routes_in_route_family_map():
    """route-family-map must also track all 5 /kr/* prototype routes."""
    data = _load_artifact("route-family-map")
    lp = next(f for f in data["families"] if f["family"] == "landing-prototype")
    expected_routes = {"/kr/landing", "/kr/auth", "/kr/onboarding", "/kr/analysis", "/kr/dashboard"}
    assert expected_routes.issubset(set(lp["runtime_routes"]))


def test_voice_ownership_explicit():
    """Voice ownership must have an explicit runtime owner in target-state."""
    data = _load_artifact("route-family-target-state")
    voice = next(
        d for d in data["cross_family_decisions"]
        if d["topic"] == "voice_ownership"
    )
    assert voice["preferred_runtime_owner"] in {"/profile", "/settings", "/asset-library"}


def test_family_decisions_aligned_across_artifacts():
    """Family decisions must match between route-family-map and target-state."""
    rfm = _load_artifact("route-family-map")
    rfs = _load_artifact("route-family-target-state")

    rfm_decisions = {f["family"]: f["decision"] for f in rfm["families"]}
    rfs_decisions = {f["family"]: f["decision"] for f in rfs["families"]}

    for family in rfm_decisions:
        assert family in rfs_decisions, f"Family {family} missing from target-state"
        assert rfm_decisions[family] == rfs_decisions[family], (
            f"Decision mismatch for {family}: "
            f"route-family-map={rfm_decisions[family]}, "
            f"target-state={rfs_decisions[family]}"
        )


def test_capability_deps_exist_in_gap_matrix():
    """Every capability dependency in route-family-map must exist in gap-matrix."""
    rfm = _load_artifact("route-family-map")
    cgm = _load_artifact("capability-gap-matrix")

    cap_ids = {c["id"] for c in cgm["capability_matrix"]}
    for family in rfm["families"]:
        for dep in family.get("capability_dependencies", []):
            assert dep in cap_ids, (
                f"Unknown capability {dep} in family {family['family']}"
            )


def test_capability_led_additions_have_valid_owner_families():
    """Every capability-led addition must reference an existing route family."""
    rfm = _load_artifact("route-family-map")
    family_names = {f["family"] for f in rfm["families"]}
    for addition in rfm["capability_led_additions"]:
        assert addition["owner_family"] in family_names, (
            f"Addition {addition['id']} references unknown family {addition['owner_family']}"
        )
