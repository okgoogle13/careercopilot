#!/usr/bin/env python3
"""Derive a tokens-first gap-fill plan for a target route.

This planner reconciles the tracked route matrix, backend feature gap map,
existing frontend TSX files, and an optional approved build contract to answer:

- which existing component should remain the runtime base
- which existing component is reference-only
- which existing component is behavior-rich but token-dirty
- which components must be built fresh
- which components remain blocked on unresolved contract gaps
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, asdict
from datetime import datetime, UTC
from pathlib import Path
from typing import Any
import xml.etree.ElementTree as ET


REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_ROOT = (
    REPO_ROOT / "docs" / "project" / "active" / "frontend-source-of-truth-migration"
)
ROUTE_MATRIX_PATH = DOCS_ROOT / "2026-03-13-target-state-route-matrix.json"
GAP_MAP_PATH = DOCS_ROOT / "2026-03-13-backend-feature-frontend-component-gap-map.json"
SRC_ROOT = REPO_ROOT / "frontend" / "src"

ALLOWED_TOKEN_PREFIXES = ("--sys-color-", "--sys-shape-", "--sys-type-")
BANNED_TOKEN_NAMES = ("labWrenMetalBlue", "GumLeafGreen", "WattleGold", "inkGreen")
BANNED_ARCHETYPES = ("Jar", "Cabinet", "Seed", "Leaf")
HARD_CODED_COLOR_RE = re.compile(
    r"#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(",
    re.MULTILINE,
)
MUI_RE = re.compile(r"@mui/")
FONT_DRIFT_RE = re.compile(r"\b(Inter|Roboto|Arial|Plus Jakarta Sans|Sora)\b")


@dataclass
class CandidateAssessment:
    path: str
    layer: str
    behavior_score: int
    ownership_score: int
    design_alignment_score: int
    drift_penalty: int
    total_score: int
    token_state: str
    required_actions: list[str]


@dataclass
class ComponentPlan:
    component_name: str
    owner_route: str
    owner_surface: str | None
    canonical_status: str
    selected_base: str | None
    reuse_mode: str
    token_state: str
    existing_candidates: list[CandidateAssessment]
    required_actions: list[str]
    source_of_truth: list[str]
    blocking_gaps: list[str]


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def component_name_from_path(path_value: str | None) -> str | None:
    if not path_value or path_value == "none":
        return None
    return Path(path_value).stem


def build_contract_component_gaps(build_contract_path: Path | None) -> dict[str, list[str]]:
    if build_contract_path is None or not build_contract_path.exists():
        return {}
    root = ET.parse(build_contract_path).getroot()
    gaps: dict[str, list[str]] = {}
    all_names = set()
    for node in root.findall(".//component_name"):
        if node.text:
            all_names.add(node.text.strip())
    for node in root.findall(".//mapped_code_component"):
        if node.text:
            all_names.add(node.text.strip())
    for gap in root.findall(".//contract_gap"):
        message = " ".join(
            filter(
                None,
                [
                    gap.findtext("missing_input", "").strip(),
                    gap.findtext("effect_on_build", "").strip(),
                ],
            )
        )
        for name in all_names:
            if name in message:
                gaps.setdefault(name, []).append(message)
    return gaps


# ---------------------------------------------------------------------------
# Gap 2: Token extraction from wireframe XML
# ---------------------------------------------------------------------------


def extract_wireframe_tokens(wireframe_path: Path | None) -> list[str]:
    """Extract all token refs declared in <tokens> blocks within a wireframe XML.

    Returns a sorted, deduplicated list of CSS token variable names (e.g. --sys-color-inkGold-base).
    Wireframe token declarations are the canonical source of truth for which
    tokens a route's components should use — the build contract's dependency_contract
    should be a superset of this list.
    """
    if wireframe_path is None or not wireframe_path.exists():
        return []
    try:
        root = ET.parse(wireframe_path).getroot()
    except ET.ParseError:
        return []

    tokens: set[str] = set()
    # <tokens> blocks may appear under elements, layout, or at root level
    for token_node in root.findall(".//token"):
        ref = token_node.attrib.get("ref", "").strip()
        if ref.startswith("--sys-"):
            tokens.add(ref)
        value = (token_node.text or "").strip()
        if value.startswith("--sys-"):
            tokens.add(value)
    # Also check for inline token attribute on elements (some wireframes use token=)
    for element in root.findall(".//element"):
        for attr in ("shape_token", "color_token", "type_token", "motion_token"):
            val = element.attrib.get(attr, "").strip()
            if val.startswith("--sys-"):
                tokens.add(val)

    return sorted(tokens)


def contract_token_diff(
    wireframe_tokens: list[str],
    build_contract_path: Path | None,
) -> list[str]:
    """Find tokens declared in the wireframe but absent from the build contract.

    Returns a list of token ref strings that should be reviewed and added to
    the build contract's dependency_contract blocks if applicable.
    """
    if build_contract_path is None or not build_contract_path.exists():
        return wireframe_tokens

    try:
        contract_text = build_contract_path.read_text(encoding="utf-8")
    except OSError:
        return wireframe_tokens

    return [token for token in wireframe_tokens if token not in contract_text]




def find_route_row(route_id: str, route_matrix: dict[str, Any]) -> dict[str, Any]:
    for row in route_matrix["rows"]:
        if row["route_id"] == route_id or row["current_route"] == route_id:
            return row
    raise SystemExit(f"Unknown route_id: {route_id}")


def find_gap_entries(owner_route: str, gap_map: dict[str, Any]) -> list[dict[str, Any]]:
    return [feature for feature in gap_map["features"] if feature["owner_route"] == owner_route]


def index_tsx_files() -> dict[str, list[Path]]:
    index: dict[str, list[Path]] = {}
    for path in SRC_ROOT.rglob("*.tsx"):
        index.setdefault(path.stem, []).append(path)
    return index


def classify_layer(path: Path) -> str:
    rel = path.relative_to(REPO_ROOT).as_posix()
    if rel.startswith("frontend/src/features/") or rel.startswith("frontend/src/pages/"):
        return "runtime"
    if rel.startswith("frontend/src/screens/"):
        return "design_reference"
    if "phase3-batch" in rel:
        return "batch_reference"
    if rel.startswith("frontend/src/components/") or rel.startswith("frontend/src/layouts/"):
        return "component_library"
    return "other"


def analyze_tokens(path: Path) -> tuple[str, list[str]]:
    text = path.read_text(encoding="utf-8")
    actions: list[str] = []
    violations = False
    has_tokens = any(prefix in text for prefix in ALLOWED_TOKEN_PREFIXES)

    if HARD_CODED_COLOR_RE.search(text):
        violations = True
        actions.append("replace_hardcoded_colors")
    if any(token in text for token in BANNED_TOKEN_NAMES):
        violations = True
        actions.append("remove_deprecated_token_names")
    if any(archetype in text for archetype in BANNED_ARCHETYPES):
        violations = True
        actions.append("swap_deprecated_archetypes")
    if FONT_DRIFT_RE.search(text):
        violations = True
        actions.append("remove_forbidden_font_families")
    if MUI_RE.search(text):
        violations = True
        actions.append("remove_legacy_mui_patterns")

    if violations:
        return "dirty", actions
    if has_tokens:
        return "clean", actions
    return "unknown", actions


def score_candidate(
    name: str,
    path: Path,
    row: dict[str, Any],
    gap_entry: dict[str, Any] | None,
    screen_component: str | None,
) -> CandidateAssessment:
    rel = path.relative_to(REPO_ROOT).as_posix()
    layer = classify_layer(path)
    behavior_score = 0
    ownership_score = 0
    design_alignment_score = 0

    if row.get("paired_runtime_surface") and rel == row["paired_runtime_surface"]:
        behavior_score = 40
    elif row.get("current_runtime_owner") == name or row.get("target_runtime_owner") == name:
        behavior_score = 35 if layer == "runtime" else 18
    elif layer == "runtime":
        behavior_score = 25
    elif layer == "component_library":
        behavior_score = 15
    elif layer == "design_reference":
        behavior_score = 10

    if name == row.get("target_runtime_owner"):
        ownership_score = 25
    elif gap_entry and name == gap_entry.get("owner_surface"):
        ownership_score = 25
    elif name in (row.get("target_component_surfaces") or []):
        ownership_score = 18
    elif gap_entry and name in (gap_entry.get("reuse_components") or []):
        ownership_score = 18
    elif gap_entry and name in (gap_entry.get("reference_components") or []):
        ownership_score = 5

    if screen_component and name == screen_component:
        design_alignment_score = 10
    elif layer == "design_reference":
        design_alignment_score = 8
    elif row.get("family") and row["family"] in rel:
        design_alignment_score = 6

    token_state, required_actions = analyze_tokens(path)
    drift_penalty = 0
    if token_state == "dirty":
        drift_penalty = 25
    elif token_state == "unknown":
        drift_penalty = 10

    total_score = behavior_score + ownership_score + design_alignment_score - drift_penalty
    return CandidateAssessment(
        path=rel,
        layer=layer,
        behavior_score=behavior_score,
        ownership_score=ownership_score,
        design_alignment_score=design_alignment_score,
        drift_penalty=drift_penalty,
        total_score=total_score,
        token_state=token_state,
        required_actions=required_actions,
    )


def determine_canonical_status(
    name: str, row: dict[str, Any], gap_entry: dict[str, Any] | None
) -> str:
    if gap_entry and name in (gap_entry.get("deferred_components") or []):
        return "deferred"
    if gap_entry and name in (gap_entry.get("reference_components") or []):
        return "reference"
    if name == row.get("target_runtime_owner") or (gap_entry and name == gap_entry.get("owner_surface")):
        return "canonical"
    if gap_entry and name in (gap_entry.get("reuse_components") or []):
        return "support"
    if gap_entry and name in (gap_entry.get("new_components") or []):
        return "support"
    if name in (row.get("target_component_surfaces") or []):
        return "support"
    return "unknown"


def choose_reuse_mode(
    name: str,
    canonical_status: str,
    candidates: list[CandidateAssessment],
    blocking_gaps: list[str],
    gap_entry: dict[str, Any] | None,
) -> tuple[str, str, list[str], str | None]:
    if canonical_status == "reference":
        selected = candidates[0].path if candidates else None
        return "reference_only", "n/a", [], selected
    if canonical_status == "deferred":
        return "blocked", "n/a", ["respect_deferred_component_boundary"], None
    if blocking_gaps:
        selected = candidates[0].path if candidates else None
        return "blocked", candidates[0].token_state if candidates else "unknown", [], selected
    if not candidates:
        if gap_entry and name in (gap_entry.get("new_components") or []):
            return "build_new", "n/a", ["create_missing_component"], None
        return "blocked", "unknown", ["missing_existing_candidate"], None

    selected = sorted(
        candidates,
        key=lambda c: (
            c.total_score,
            1 if c.layer == "runtime" else 0,
            1 if c.token_state == "clean" else 0,
        ),
        reverse=True,
    )[0]

    if selected.token_state == "clean" and selected.total_score >= 80:
        return "reuse_as_is", selected.token_state, list(selected.required_actions), selected.path
    if selected.total_score >= 60:
        actions = list(selected.required_actions)
        if selected.token_state != "clean":
            actions.append("rewrite_styling_to_semantic_tokens")
        return "keep_behavior_rewrite_styling", selected.token_state, sorted(set(actions)), selected.path
    if selected.total_score >= 40:
        actions = list(selected.required_actions)
        actions.append("extend_token_coverage")
        return "keep_behavior_extend_tokens", selected.token_state, sorted(set(actions)), selected.path
    if gap_entry and name in (gap_entry.get("new_components") or []):
        return "build_new", selected.token_state, ["create_missing_component"], None
    return "blocked", selected.token_state, ["insufficient_runtime_base"], selected.path


def build_component_plan(
    name: str,
    row: dict[str, Any],
    gap_entry: dict[str, Any] | None,
    index: dict[str, list[Path]],
    contract_gaps: dict[str, list[str]],
    screen_component: str | None,
) -> ComponentPlan:
    candidate_paths = index.get(name, [])
    assessments = [
        score_candidate(name, path, row, gap_entry, screen_component) for path in candidate_paths
    ]
    assessments.sort(key=lambda c: c.total_score, reverse=True)
    canonical_status = determine_canonical_status(name, row, gap_entry)
    blocking_gaps = contract_gaps.get(name, [])
    reuse_mode, token_state, required_actions, selected_base = choose_reuse_mode(
        name, canonical_status, assessments, blocking_gaps, gap_entry
    )

    sources = ["route_matrix"]
    if gap_entry:
        sources.append("component_gap_map")
    if screen_component and name == screen_component:
        sources.append("screen_reference")
    if candidate_paths:
        sources.append("runtime_or_reference_tsx")
    if blocking_gaps:
        sources.append("build_contract")

    return ComponentPlan(
        component_name=name,
        owner_route=row["target_route"],
        owner_surface=gap_entry.get("owner_surface") if gap_entry else row.get("target_runtime_owner"),
        canonical_status=canonical_status,
        selected_base=selected_base,
        reuse_mode=reuse_mode,
        token_state=token_state,
        existing_candidates=assessments,
        required_actions=required_actions,
        source_of_truth=sources,
        blocking_gaps=blocking_gaps,
    )


def derive_plan(route_id: str, build_contract_path: Path | None) -> dict[str, Any]:
    route_matrix = read_json(ROUTE_MATRIX_PATH)
    gap_map = read_json(GAP_MAP_PATH)
    row = find_route_row(route_id, route_matrix)
    gap_entries = find_gap_entries(row["target_route"], gap_map)
    gap_entry = gap_entries[0] if gap_entries else None
    screen_component = component_name_from_path(row.get("screen_reference"))
    contract_gaps = build_contract_component_gaps(build_contract_path)
    index = index_tsx_files()

    # Gap 2: extract tokens from wireframe and diff against build contract
    wireframe_path_str = row.get("xml_wireframe_path")
    wireframe_path = Path(wireframe_path_str) if wireframe_path_str else None
    wireframe_tokens = extract_wireframe_tokens(wireframe_path)
    token_drift = contract_token_diff(wireframe_tokens, build_contract_path)

    component_order: list[str] = []
    for name in [
        row.get("target_runtime_owner"),
        *row.get("target_component_surfaces", []),
        gap_entry.get("owner_surface") if gap_entry else None,
        *(gap_entry.get("reuse_components", []) if gap_entry else []),
        *(gap_entry.get("reference_components", []) if gap_entry else []),
        *(gap_entry.get("new_components", []) if gap_entry else []),
        *(gap_entry.get("deferred_components", []) if gap_entry else []),
    ]:
        if name and name not in component_order:
            component_order.append(name)

    plans = [
        build_component_plan(name, row, gap_entry, index, contract_gaps, screen_component)
        for name in component_order
    ]

    normalized_build_contract = build_contract_path.resolve() if build_contract_path else None
    return {
        "artifact": "tokens_first_gap_fill_plan",
        "generated_at": datetime.now(UTC).isoformat(),
        "route_id": row["route_id"],
        "target_route": row["target_route"],
        "family": row["family"],
        "component_library_action": row["component_library_action"],
        "route_status": row["status"],
        "build_contract": str(normalized_build_contract.relative_to(REPO_ROOT)) if normalized_build_contract else None,
        "summary": {
            "canonical_owner": row.get("target_runtime_owner"),
            "screen_reference": row.get("screen_reference"),
            "paired_runtime_surface": row.get("paired_runtime_surface"),
            "token_rule": "reuse behavior and ownership from runtime; reuse presentation only if token-clean; otherwise rewrite styling to semantic tokens",
        },
        # Gap 2: token extraction — candidate list from wireframe; drift = in wireframe, not in contract
        "candidate_token_list": wireframe_tokens,
        "candidate_token_drift": {
            "description": "Tokens declared in wireframe XML but absent from build contract dependency_contract blocks. Review and add if applicable.",
            "tokens": token_drift,
            "count": len(token_drift),
        },
        "components": [asdict(plan) for plan in plans],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--route-id", required=True, help="Route id or current route from route matrix")
    parser.add_argument(
        "--build-contract",
        type=Path,
        default=None,
        help="Optional route-level build contract XML used to carry blocking gaps forward",
    )
    parser.add_argument("--json-out", type=Path, default=None, help="Optional output JSON path")
    args = parser.parse_args()

    plan = derive_plan(args.route_id, args.build_contract)
    output = json.dumps(plan, indent=2)
    if args.json_out:
        args.json_out.write_text(output + "\n")
    print(output)


if __name__ == "__main__":
    main()
