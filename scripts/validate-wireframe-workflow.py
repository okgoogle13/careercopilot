#!/usr/bin/env python3
"""Validate canonical wireframes against migration planning artifacts.

Also validates build contract XML files against docs/schema/build_contract.xsd
when --build-contracts is supplied (Gap 1: MDA PIM schema enforcement).
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path
from typing import Any

_REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_MATRIX = _REPO_ROOT / "docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json"
DEFAULT_GAP_MAP = _REPO_ROOT / "docs/project/active/frontend-source-of-truth-migration/control/gap-map.json"
DEFAULT_SCREENS_ROOT = _REPO_ROOT / "frontend/src/screens"
DEFAULT_PLACEMENT_REPORT = _REPO_ROOT / ".claude/wireframes/placement_report.json"
DEFAULT_JSON_OUT = _REPO_ROOT / "tmp/migration/wireframe-workflow-report.json"
DEFAULT_BUILD_CONTRACT_SCHEMA = _REPO_ROOT / "docs/schema/build_contract.xsd"
DEFAULT_BUILD_CONTRACTS_GLOB = _REPO_ROOT / "docs/project/active/frontend-source-of-truth-migration/contracts"

COLOR_LITERAL_RE = re.compile(
    r"#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(",
    re.IGNORECASE,
)


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def add_issue(bucket: list[dict[str, Any]], issue_type: str, **data: Any) -> None:
    bucket.append({"type": issue_type, **data})


# ---------------------------------------------------------------------------
# Gap 1: Build Contract XSD Validation
# ---------------------------------------------------------------------------

def validate_build_contract_xsd(
    contract_paths: list[Path],
    schema_path: Path,
) -> list[dict[str, Any]]:
    """Validate each build contract XML file against build_contract.xsd.

    Requires xmllint (libxml2) on PATH. If xmllint is unavailable the check
    is skipped with a warning rather than failing hard, to keep CI stable on
    environments where xmllint is not installed.

    Returns a list of issue dicts (empty = all pass).
    """
    issues: list[dict[str, Any]] = []

    if not schema_path.exists():
        issues.append({
            "type": "xsd_schema_missing",
            "schema_path": str(schema_path),
            "recommendation": "Run scripts/validate-wireframe-workflow.py from repo root",
        })
        return issues

    xmllint = shutil.which("xmllint")
    if xmllint is None:
        issues.append({
            "type": "xsd_validator_unavailable",
            "message": "xmllint not found on PATH — skipping build contract schema validation",
            "recommendation": "Install libxml2 (brew install libxml2)",
        })
        return issues

    for contract_path in contract_paths:
        if not contract_path.exists():
            issues.append({
                "type": "build_contract_not_found",
                "contract_path": str(contract_path),
            })
            continue
        result = subprocess.run(
            [xmllint, "--schema", str(schema_path), str(contract_path), "--noout"],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            issues.append({
                "type": "build_contract_xsd_failure",
                "contract_path": str(contract_path),
                "errors": result.stderr.strip().splitlines(),
            })

    return issues




def validate_xml_file(path: Path) -> dict[str, Any]:
    raw = path.read_text(encoding="utf-8")
    result: dict[str, Any] = {
        "wireframe_id": path.stem.replace(".wireframe", ""),
        "xml_path": str(path),
        "status": "pass",
        "missing_blocks": [],
        "warnings": [],
        "failures": [],
        "element_count": 0,
        "component_mapping_count": 0,
        "elements_with_component_mapping": 0,
        "accessibility_count": 0,
        "elements_with_accessibility": 0,
        "motion_contract_count": 0,
        "spring_motion_contract_count": 0,
        "legacy_motion_contract_count": 0,
        "token_hygiene_pass": not bool(COLOR_LITERAL_RE.search(raw)),
        "has_layout_structure": "<layout_structure" in raw,
        "has_layout_binding": "<layout_binding" in raw,
        "has_responsive_rules": "<responsive_rules" in raw,
        "code_components": [],
    }

    if not result["token_hygiene_pass"]:
        add_issue(result["failures"], "hardcoded_color_literal")

    try:
        root = ET.fromstring(raw)
    except ET.ParseError as exc:
        result["status"] = "fail"
        add_issue(result["failures"], "xml_parse_error", message=str(exc))
        return result

    required_blocks = ["meta", "layout", "elements", "compliance_score"]
    for block in required_blocks:
        if root.find(block) is None:
            result["missing_blocks"].append(block)
            add_issue(result["failures"], "missing_block", block=block)

    elements_parent = root.find("elements")
    elements = list(elements_parent.findall("element")) if elements_parent is not None else []
    result["element_count"] = len(elements)
    component_mappings = root.findall(".//component_mapping")
    result["component_mapping_count"] = len(component_mappings)
    result["accessibility_count"] = len(root.findall(".//accessibility"))
    motion_contracts = root.findall(".//motion_contract")
    result["motion_contract_count"] = len(motion_contracts)
    result["spring_motion_contract_count"] = sum(
        1 for node in motion_contracts if node.attrib.get("type") == "spring"
    )
    result["legacy_motion_contract_count"] = max(
        0, result["motion_contract_count"] - result["spring_motion_contract_count"]
    )
    result["code_components"] = sorted(
        {node.attrib.get("code_component", "") for node in component_mappings if node.attrib.get("code_component")}
    )

    mapped_elements = 0
    accessible_elements = 0
    for element in elements:
        if element.find("component_mapping") is not None:
            mapped_elements += 1
        if element.find("accessibility") is not None:
            accessible_elements += 1
    result["elements_with_component_mapping"] = mapped_elements
    result["elements_with_accessibility"] = accessible_elements

    if elements and mapped_elements != len(elements):
        add_issue(
            result["failures"],
            "component_mapping_coverage_mismatch",
            element_count=len(elements),
            mapped_elements=mapped_elements,
        )

    if elements and accessible_elements != len(elements):
        add_issue(
            result["warnings"],
            "accessibility_coverage_incomplete",
            element_count=len(elements),
            accessible_elements=accessible_elements,
        )

    if not result["has_layout_structure"]:
        add_issue(result["warnings"], "missing_layout_structure")
    if not result["has_layout_binding"]:
        add_issue(result["warnings"], "missing_layout_binding")
    if not result["has_responsive_rules"]:
        add_issue(result["warnings"], "missing_responsive_rules")

    if result["failures"]:
        result["status"] = "fail"
    elif result["warnings"]:
        result["status"] = "warn"
    return result


def evaluate_route_coverage(
    rows: list[dict[str, Any]],
    screens_root: Path,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, set[str]]]:
    failures: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    expected_paths: dict[str, set[str]] = defaultdict(set)

    for row in rows:
        coverage = row.get("wireframe_coverage")
        xml_path = row.get("xml_wireframe_path")
        route = row.get("current_route")
        target_surfaces = row.get("target_component_surfaces") or []

        if coverage == "internal_no_wireframe_required":
            if xml_path:
                add_issue(
                    warnings,
                    "internal_route_has_wireframe_path",
                    route=route,
                    xml_wireframe_path=xml_path,
                )
            continue

        if coverage == "missing_wireframe":
            if xml_path:
                add_issue(
                    failures,
                    "missing_wireframe_has_xml_path",
                    route=route,
                    xml_wireframe_path=xml_path,
                )
            continue

        if not xml_path:
            add_issue(failures, "expected_wireframe_path_missing", route=route)
            continue

        full_path = Path(xml_path)
        expected_paths[str(full_path)].add(route)
        if not full_path.exists():
            add_issue(
                failures,
                "wireframe_path_not_found",
                route=route,
                xml_wireframe_path=xml_path,
            )

        screen_reference = row.get("screen_reference")
        if screen_reference and not Path(screen_reference).exists():
            add_issue(
                failures,
                "screen_reference_not_found",
                route=route,
                screen_reference=screen_reference,
            )

        if not target_surfaces:
            add_issue(failures, "target_component_surfaces_missing", route=route)

    canonical_xmls = {str(p) for p in screens_root.rglob("*.wireframe.xml")}
    orphan_wireframes = sorted(canonical_xmls.difference(expected_paths))
    for orphan in orphan_wireframes:
        add_issue(warnings, "orphan_canonical_wireframe", xml_wireframe_path=orphan)

    return failures, warnings, expected_paths


def evaluate_component_alignment(
    rows: list[dict[str, Any]],
    features: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    failures: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []

    rows_by_route = {
        row.get("target_route") or row.get("current_route"): row
        for row in rows
    }

    for feature in features:
        owner_route = feature.get("owner_route")
        owner_surface = feature.get("owner_surface")
        row = rows_by_route.get(owner_route)
        if not row:
            add_issue(
                failures,
                "feature_owner_route_missing_from_matrix",
                feature_id=feature.get("feature_id"),
                owner_route=owner_route,
            )
            continue

        target_surfaces = set(row.get("target_component_surfaces") or [])
        if owner_surface not in target_surfaces:
            add_issue(
                failures,
                "feature_owner_surface_not_in_matrix_target_surfaces",
                feature_id=feature.get("feature_id"),
                owner_route=owner_route,
                owner_surface=owner_surface,
                target_component_surfaces=sorted(target_surfaces),
            )

        if row.get("wireframe_coverage") == "missing_wireframe":
            add_issue(
                warnings,
                "feature_owner_route_has_missing_wireframe",
                feature_id=feature.get("feature_id"),
                owner_route=owner_route,
            )

    return failures, warnings


def evaluate_legacy_artifacts(
    claude_wireframes_root: Path,
    canonical_results: list[dict[str, Any]],
    placement_report: Path | None,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    failures: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    summary: dict[str, Any] = {}

    spring_summary = claude_wireframes_root / "SPRING_PHYSICS_SUMMARY.md"
    summary_doc = claude_wireframes_root / "SUMMARY.md"
    actual_spring_files = sum(1 for item in canonical_results if item["spring_motion_contract_count"] > 0)
    total_wireframes = len(canonical_results)

    summary["canonical_wireframes_with_spring"] = actual_spring_files
    summary["canonical_wireframe_count"] = total_wireframes

    if spring_summary.exists():
        text = spring_summary.read_text(encoding="utf-8")
        if "COMPLETE" in text and actual_spring_files < total_wireframes:
            add_issue(
                warnings,
                "legacy_spring_completion_claim_mismatch",
                documented_file=str(spring_summary),
                canonical_wireframes_with_spring=actual_spring_files,
                canonical_wireframe_count=total_wireframes,
            )

    if summary_doc.exists():
        text = summary_doc.read_text(encoding="utf-8")
        if "COMPLETE & VERIFIED" in text:
            incomplete_schema = sum(
                1
                for item in canonical_results
                if not (
                    item["has_layout_structure"]
                    and item["has_layout_binding"]
                    and item["has_responsive_rules"]
                )
            )
            if incomplete_schema:
                add_issue(
                    warnings,
                    "legacy_summary_claim_mismatch",
                    documented_file=str(summary_doc),
                    canonical_files_missing_upgraded_schema=incomplete_schema,
                )

    placement_summary: dict[str, Any] = {}
    if placement_report and placement_report.exists():
        data = load_json(placement_report)
        invalid_paths = data.get("diagnostics", {}).get("invalid_asset_file_paths", [])
        placement_summary = {
            "placement_report_path": str(placement_report),
            "aggregate_score": data.get("aggregate_score"),
            "pass": data.get("compliance", {}).get("pass"),
            "invalid_asset_file_paths_count": len(invalid_paths),
        }
        if invalid_paths:
            add_issue(
                warnings,
                "placement_report_integrity_warning",
                placement_report=str(placement_report),
                invalid_asset_file_paths_count=len(invalid_paths),
                recommendation="run manifest-reconciler before trusting placement success",
            )
        if data.get("compliance", {}).get("pass") and invalid_paths:
            add_issue(
                warnings,
                "placement_report_pass_despite_integrity_issues",
                placement_report=str(placement_report),
            )

    summary["placement_report"] = placement_summary
    return failures, warnings, summary


def determine_status(*issue_groups: list[dict[str, Any]]) -> str:
    failures = issue_groups[0]
    warnings = issue_groups[1]
    if failures:
        return "fail"
    if warnings:
        return "warn"
    return "pass"


def with_file_context(file_results: list[dict[str, Any]], key: str) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    for item in file_results:
        for issue in item[key]:
            issues.append({"xml_path": item["xml_path"], **issue})
    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--matrix", type=Path, default=DEFAULT_MATRIX)
    parser.add_argument("--gap-map", type=Path, default=DEFAULT_GAP_MAP)
    parser.add_argument("--screens-root", type=Path, default=DEFAULT_SCREENS_ROOT)
    parser.add_argument("--placement-report", type=Path, default=DEFAULT_PLACEMENT_REPORT)
    parser.add_argument("--json-out", type=Path, default=DEFAULT_JSON_OUT)
    parser.add_argument("--strict", action="store_true", help="exit non-zero on warnings")
    # Gap 1: build contract XSD validation
    parser.add_argument(
        "--build-contracts",
        type=Path,
        nargs="*",
        default=None,
        help="One or more build contract XML files to validate against the XSD schema. "
             "If omitted, all *-build-contract-*.xml files under the default contracts dir are checked.",
    )
    parser.add_argument(
        "--xsd",
        type=Path,
        default=DEFAULT_BUILD_CONTRACT_SCHEMA,
        help=f"Path to build contract XSD schema (default: {DEFAULT_BUILD_CONTRACT_SCHEMA})",
    )
    args = parser.parse_args()

    matrix = load_json(args.matrix)
    gap_map = load_json(args.gap_map)
    rows = matrix.get("rows", [])
    features = gap_map.get("features", [])
    canonical_xmls = sorted(args.screens_root.rglob("*.wireframe.xml"))

    file_results = [validate_xml_file(path) for path in canonical_xmls]
    route_failures, route_warnings, _expected_paths = evaluate_route_coverage(rows, args.screens_root)
    component_failures, component_warnings = evaluate_component_alignment(rows, features)
    legacy_failures, legacy_warnings, legacy_summary = evaluate_legacy_artifacts(
        _REPO_ROOT / ".claude/wireframes",
        file_results,
        args.placement_report,
    )

    # Gap 1: XSD validation of build contracts
    if args.build_contracts is not None:
        contract_paths = args.build_contracts
    else:
        contracts_dir = DEFAULT_BUILD_CONTRACTS_GLOB
        contract_paths = sorted(contracts_dir.glob("*build-contract*.xml")) if contracts_dir.exists() else []
    xsd_issues = validate_build_contract_xsd(contract_paths, args.xsd)
    xsd_failures = [i for i in xsd_issues if i["type"] in ("build_contract_xsd_failure", "build_contract_not_found", "xsd_schema_missing")]
    xsd_warnings = [i for i in xsd_issues if i["type"] not in ("build_contract_xsd_failure", "build_contract_not_found", "xsd_schema_missing")]

    schema_failures = with_file_context(file_results, "failures")
    schema_warnings = with_file_context(file_results, "warnings")

    failures = schema_failures + route_failures + component_failures + legacy_failures + xsd_failures
    warnings = schema_warnings + route_warnings + component_warnings + legacy_warnings + xsd_warnings
    status = determine_status(failures, warnings)

    report = {
        "status": status,
        "canonical_wireframe_count": len(file_results),
        "matrix_row_count": len(rows),
        "schema_summary": {
            "failed_files": sum(1 for item in file_results if item["status"] == "fail"),
            "warn_files": sum(1 for item in file_results if item["status"] == "warn"),
            "files_with_upgraded_schema": sum(
                1
                for item in file_results
                if item["has_layout_structure"] and item["has_layout_binding"] and item["has_responsive_rules"]
            ),
        },
        "route_coverage_summary": {
            "missing_wireframes": [
                row.get("current_route")
                for row in rows
                if row.get("wireframe_coverage") == "missing_wireframe"
            ],
            "failures": route_failures,
            "warnings": route_warnings,
        },
        "component_alignment_summary": {
            "failures": component_failures,
            "warnings": component_warnings,
        },
        "asset_integrity_summary": legacy_summary.get("placement_report", {}),
        "legacy_artifact_findings": {
            "summary": legacy_summary,
            "warnings": legacy_warnings,
        },
        # Gap 1: build contract XSD validation results
        "build_contract_xsd_summary": {
            "contracts_checked": len(contract_paths),
            "failures": xsd_failures,
            "warnings": xsd_warnings,
        },
        "schema_failures": schema_failures,
        "schema_warnings": schema_warnings,
        "file_results": file_results,
    }

    args.json_out.parent.mkdir(parents=True, exist_ok=True)
    args.json_out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    print(f"Wireframe workflow status: {status}")
    print(f"Canonical wireframes: {len(file_results)}")
    print(f"Schema failures: {len(schema_failures)}")
    print(f"Schema warnings: {len(schema_warnings)}")
    print(f"Build contract XSD checks: {len(contract_paths)} file(s) — {len(xsd_failures)} failure(s)")
    print(
        "Route coverage gaps: "
        + ", ".join(report["route_coverage_summary"]["missing_wireframes"])
    )
    asset_warn_count = report["asset_integrity_summary"].get("invalid_asset_file_paths_count", 0)
    if asset_warn_count:
        print(f"Asset integrity warnings: {asset_warn_count} invalid asset file paths in placement report")
    print(f"JSON report: {args.json_out}")

    if status == "fail":
        return 1
    if status == "warn" and args.strict:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
