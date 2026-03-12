import json
from pathlib import Path


def load_artifact(name):
    paths = {
        "route-family-map": ".claude/route-family-map.json",
        "capability-gap-matrix": ".claude/plans/frontend-capability-gap-matrix.json",
        "route-family-target-state": ".claude/plans/route-family-target-state.json",
    }
    return json.loads(Path(paths[name]).read_text())


def find_cross_family_decision(data, topic):
    matches = [d for d in data["cross_family_decisions"] if d["topic"] == topic]
    assert len(matches) == 1, f"Expected exactly 1 cross_family_decision with topic '{topic}', found {len(matches)}"
    return matches[0]


def find_family(data, family_name, key="family"):
    matches = [f for f in data["families"] if f[key] == family_name]
    assert len(matches) == 1, f"Expected exactly 1 family '{family_name}', found {len(matches)}"
    return matches[0]


def test_ingestion_contract_resolved_in_target_state():
    """Ingestion contract must be resolved, not 'unresolved', in target-state."""
    data = load_artifact("route-family-target-state")
    ingestion = find_cross_family_decision(data, "canonical_ingestion_contract")
    assert ingestion["status"] == "resolved"


def test_prototype_routes_all_tracked():
    """All 5 /kr/* prototype routes must be tracked for retirement."""
    data = load_artifact("route-family-target-state")
    lp = find_family(data, "landing-prototype")
    expected_routes = {"/kr/landing", "/kr/auth", "/kr/onboarding", "/kr/analysis", "/kr/dashboard"}
    assert expected_routes.issubset(set(lp["current_runtime_routes"]))


def test_prototype_routes_in_route_family_map():
    """route-family-map must also track all 5 /kr/* prototype routes."""
    data = load_artifact("route-family-map")
    lp = find_family(data, "landing-prototype")
    expected_routes = {"/kr/landing", "/kr/auth", "/kr/onboarding", "/kr/analysis", "/kr/dashboard"}
    assert expected_routes.issubset(set(lp["runtime_routes"]))


def test_voice_ownership_explicit():
    """Voice ownership must have an explicit runtime owner in target-state."""
    data = load_artifact("route-family-target-state")
    voice = find_cross_family_decision(data, "voice_ownership")
    assert voice["preferred_runtime_owner"] in {"/profile", "/settings", "/asset-library"}


def test_family_decisions_aligned_across_artifacts():
    """Family decisions must match between route-family-map and target-state."""
    rfm = load_artifact("route-family-map")
    rfs = load_artifact("route-family-target-state")

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
    rfm = load_artifact("route-family-map")
    cgm = load_artifact("capability-gap-matrix")

    cap_ids = {c["id"] for c in cgm["capability_matrix"]}
    for family in rfm["families"]:
        for dep in family.get("capability_dependencies", []):
            assert dep in cap_ids, (
                f"Unknown capability {dep} in family {family['family']}"
            )


def test_capability_led_additions_have_valid_owner_families():
    """Every capability-led addition must reference an existing route family."""
    rfm = load_artifact("route-family-map")
    family_names = {f["family"] for f in rfm["families"]}
    for addition in rfm["capability_led_additions"]:
        assert addition["owner_family"] in family_names, (
            f"Addition {addition['id']} references unknown family {addition['owner_family']}"
        )


def test_all_capabilities_have_resolution_status():
    """Every capability in gap-matrix must have a resolution_status field."""
    cgm = load_artifact("capability-gap-matrix")
    allowed_statuses = {"unresolved", "partially_resolved", "resolved", "resolved_defer"}
    for cap in cgm["capability_matrix"]:
        assert "resolution_status" in cap, (
            f"Capability {cap['id']} missing resolution_status field"
        )
        assert cap["resolution_status"] in allowed_statuses, (
            f"Capability {cap['id']} has invalid resolution_status: {cap['resolution_status']}"
        )


def test_unresolved_capabilities_have_blocked_by():
    """Unresolved capabilities must have a blocked_by note explaining what is missing."""
    cgm = load_artifact("capability-gap-matrix")
    for cap in cgm["capability_matrix"]:
        if cap.get("resolution_status") == "unresolved":
            assert "blocked_by" in cap and len(cap["blocked_by"]) > 0, (
                f"Unresolved capability {cap['id']} missing blocked_by note"
            )


def test_ingestion_contract_sync_across_all_artifacts():
    """Ingestion canonical contract must be consistent across all three artifacts."""
    rfm = load_artifact("route-family-map")
    rfs = load_artifact("route-family-target-state")

    rfm_canonical = rfm["canonical_backend_contracts"]["ingestion"]["canonical"]
    rfs_decision = find_cross_family_decision(rfs, "canonical_ingestion_contract")

    assert rfm_canonical == rfs_decision["canonical"], (
        f"Ingestion canonical mismatch: "
        f"route-family-map={rfm_canonical}, "
        f"target-state={rfs_decision['canonical']}"
    )


def test_no_absolute_paths_in_gap_matrix():
    """Capability gap matrix must not contain machine-specific absolute paths."""
    text = Path(".claude/plans/frontend-capability-gap-matrix.json").read_text()
    assert "/Users/" not in text, "Gap matrix contains absolute /Users/ paths"
    assert "C:\\" not in text, "Gap matrix contains absolute Windows paths"
