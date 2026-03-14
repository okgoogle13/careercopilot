#!/usr/bin/env python3
"""Scaffold stubbed .tsx component files from a build_contract.xml.

Reads the mapping_registry, component_manifest, file_system_mapping, and
supplementary_briefs from the supplied build contract and generates:
  - Stubbed .tsx files at each file_system_mapping path
  - TypeScript interfaces from prop_contract and state_contract
  - Empty useQuery / useMutation hook stubs from data_fetching / data_mutation
  - A parallel __tests__/ directory with stub test files from test_contract

Gap 6 — MDA pipeline automation: closes the gap between PSM (build contract)
and the generated output layer by making scaffold deterministic and repeatable.

Usage:
    python3 scripts/scaffold-from-contract.py \\
        --build-contract docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml \\
        [--supplementary-briefs docs/project/active/frontend-source-of-truth-migration/contracts/tracker-supplementary-component-briefs.xml] \\
        [--dry-run] \\
        [--force]
"""

from __future__ import annotations

import argparse
import re
import textwrap
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------


@dataclass
class PropSpec:
    name: str
    ts_type: str
    required: bool = True
    default: str | None = None
    description: str = ""


@dataclass
class StateSpec:
    name: str
    ts_type: str
    default: str | None = None


@dataclass
class QuerySpec:
    name: str
    hook: str
    key: str
    endpoint: str
    enabled: str | None = None


@dataclass
class MutationSpec:
    name: str
    hook: str
    endpoint: str
    payload: str | None = None
    on_success: str = ""
    on_error: str = ""


@dataclass
class TestSpec:
    description: str


@dataclass
class ComponentSpec:
    name: str
    role: str
    file_path: str
    required_props: list[PropSpec] = field(default_factory=list)
    optional_props: list[PropSpec] = field(default_factory=list)
    local_state: list[StateSpec] = field(default_factory=list)
    queries: list[QuerySpec] = field(default_factory=list)
    mutations: list[MutationSpec] = field(default_factory=list)
    tests: list[TestSpec] = field(default_factory=list)
    child_components: list[str] = field(default_factory=list)
    design_tokens: list[str] = field(default_factory=list)
    description: str = ""


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------


def _text(node: ET.Element | None, default: str = "") -> str:
    if node is None:
        return default
    return (node.text or "").strip() or default


def _attr(node: ET.Element, attr: str, default: str = "") -> str:
    return node.attrib.get(attr, default).strip() or default


def _fallback_element(node: ET.Element | None) -> ET.Element:
    return node if node is not None else ET.Element("_")


def _parse_props(parent: ET.Element, tag: str = "prop") -> list[PropSpec]:
    specs: list[PropSpec] = []
    for prop_node in parent.findall(tag):
        specs.append(PropSpec(
            name=_attr(prop_node, "name"),
            ts_type=_attr(prop_node, "type", "unknown"),
            required=_attr(prop_node, "required", "true").lower() != "false",
            default=prop_node.attrib.get("default"),
            description=_attr(prop_node, "description"),
        ))
    return specs


def _parse_state(parent: ET.Element, tag: str = "state") -> list[StateSpec]:
    specs: list[StateSpec] = []
    for state_node in parent.findall(tag):
        specs.append(StateSpec(
            name=_attr(state_node, "name"),
            ts_type=_attr(state_node, "type", "unknown"),
            default=state_node.attrib.get("default"),
        ))
    return specs


def _parse_queries(parent: ET.Element) -> list[QuerySpec]:
    return [
        QuerySpec(
            name=_attr(node, "name"),
            hook=_attr(node, "hook", "useQuery"),
            key=_attr(node, "key"),
            endpoint=_attr(node, "endpoint"),
            enabled=node.attrib.get("enabled"),
        )
        for node in parent.findall("query")
    ]


def _parse_mutations(parent: ET.Element) -> list[MutationSpec]:
    return [
        MutationSpec(
            name=_attr(node, "name"),
            hook=_attr(node, "hook", "useMutation"),
            endpoint=_attr(node, "endpoint"),
            payload=node.attrib.get("payload"),
            on_success=_attr(node, "on_success"),
            on_error=_attr(node, "on_error"),
        )
        for node in parent.findall("mutation")
    ]


def _parse_tests(parent: ET.Element) -> list[TestSpec]:
    return [
        TestSpec(description=_attr(node, "description"))
        for node in parent.findall("test")
    ]


def _parse_design_tokens(parent: ET.Element) -> list[str]:
    return [
        f"{_attr(node, 'ref')} - {_attr(node, 'usage')}"
        for node in parent.findall("token")
    ] + [
        f"{_attr(node, 'ref')} - {_attr(node, 'usage')}"
        for node in parent.findall(".//dependency[@type='design_token']")
    ]


# ---------------------------------------------------------------------------
# Build contract + supplementary briefs parsers
# ---------------------------------------------------------------------------


def parse_contract(contract_path: Path) -> dict[str, Any]:
    """Extract file_system_mapping and component manifest from build contract."""
    root = ET.parse(contract_path).getroot()
    fs_map = root.find("file_system_mapping")
    components: dict[str, dict[str, Any]] = {}

    if fs_map is not None:
        for path_node in fs_map.findall(".//path[@component]"):
            comp_name = _attr(path_node, "component")
            components[comp_name] = {"file_path": path_node.text.strip() if path_node.text else ""}

    # Augment with manifest data
    for comp_node in root.findall(".//component"):
        name = _text(comp_node.find("component_name"))
        if not name:
            continue
        if name not in components:
            components[name] = {}
        components[name]["role"] = _text(comp_node.find("role"), "support_component")
        components[name]["description"] = ""
        components[name]["required_props"] = _parse_props(
            _fallback_element(comp_node.find("required_props")), "prop"
        )
        components[name]["optional_props"] = _parse_props(
            _fallback_element(comp_node.find("optional_props")), "prop"
        )
        components[name]["local_state"] = _parse_state(
            _fallback_element(comp_node.find("local_state")), "state"
        )
        comp_children = comp_node.find("child_components")
        components[name]["child_components"] = [
            child.text.strip() for child in (list(comp_children) if comp_children is not None else []) if child.text
        ]

    return components


def parse_supplementary_briefs(briefs_path: Path | None) -> dict[str, Any]:
    """Extract richer contract data from supplementary_component_briefs XML."""
    if briefs_path is None or not briefs_path.exists():
        return {}
    root = ET.parse(briefs_path).getroot()
    result: dict[str, Any] = {}
    for brief in root.findall("brief"):
        name = _attr(brief, "component_name")
        desc_node = brief.find("description")
        prop_specs = _parse_props(_fallback_element(brief.find("prop_contract")))
        result[name] = {
            "description": _text(desc_node),
            "file_path": _text(brief.find("file_path")),
            "required_props": [prop for prop in prop_specs if prop.required],
            "optional_props": [prop for prop in prop_specs if not prop.required],
            "local_state": _parse_state(_fallback_element(brief.find("state_contract"))),
            "queries": _parse_queries(_fallback_element(brief.find("data_fetching"))),
            "mutations": _parse_mutations(_fallback_element(brief.find("data_mutation"))),
            "tests": _parse_tests(_fallback_element(brief.find("test_contract"))),
            "design_tokens": _parse_design_tokens(_fallback_element(brief.find("design_tokens"))),
        }
    return result


def merge_specs(
    contract_components: dict[str, Any],
    briefs: dict[str, Any],
) -> list[ComponentSpec]:
    """Merge build contract and supplementary briefs into ComponentSpec list."""
    specs: list[ComponentSpec] = []
    all_names = sorted(set(contract_components) | set(briefs))
    for name in all_names:
        c = contract_components.get(name, {})
        b = briefs.get(name, {})
        file_path = b.get("file_path") or c.get("file_path", "")
        # Skip reference-only and shared-shell entries (no file to scaffold)
        role = c.get("role", "support_component")
        if role in ("reference_only", "shared_shell_reference"):
            continue
        specs.append(ComponentSpec(
            name=name,
            role=role,
            file_path=file_path,
            required_props=b.get("required_props") or c.get("required_props", []),
            optional_props=b.get("optional_props") or c.get("optional_props", []),
            local_state=b.get("local_state") or c.get("local_state", []),
            queries=b.get("queries", []),
            mutations=b.get("mutations", []),
            tests=b.get("tests", []),
            child_components=c.get("child_components", []),
            design_tokens=b.get("design_tokens", []),
            description=b.get("description", ""),
        ))
    return specs


# ---------------------------------------------------------------------------
# Code generation
# ---------------------------------------------------------------------------


def _props_to_interface(spec: ComponentSpec) -> str:
    lines = [f"export interface {spec.name}Props {{"]
    seen_props: set[str] = set()
    for prop in spec.required_props:
        if prop.name in seen_props:
            continue
        seen_props.add(prop.name)
        comment = f"  // {prop.description}" if prop.description else ""
        lines.append(f"  {prop.name}: {prop.ts_type};{comment}")
    for prop in spec.optional_props:
        if prop.name in seen_props:
            continue
        seen_props.add(prop.name)
        default_comment = f" // default: {prop.default}" if prop.default else ""
        lines.append(f"  {prop.name}?: {prop.ts_type};{default_comment}")
    lines.append("}")
    return "\n".join(lines)


def _state_default_expression(state: StateSpec) -> str:
    if state.default is None:
        return "null"

    default = state.default.strip()
    if not default:
        return "null"
    if default in {"true", "false", "null"}:
        return default
    if re.fullmatch(r"-?\d+(\.\d+)?", default):
        return default
    if default in {"{}", "[]"}:
        return default
    if " or " in default.lower():
        return "null"
    if default.startswith("{") or default.startswith("["):
        return default
    if default.startswith(("'", '"')) and default.endswith(("'", '"')):
        return default
    if "'" in state.ts_type or "string" in state.ts_type.lower():
        return repr(default)
    return "null"


def _state_to_declarations(spec: ComponentSpec) -> list[str]:
    decls: list[str] = []
    for state in spec.local_state:
        default = _state_default_expression(state)
        decls.append(f"  const [{state.name}, set{state.name[0].upper()}{state.name[1:]}] = React.useState<{state.ts_type}>({default});")
    return decls


def _query_stubs(spec: ComponentSpec) -> list[str]:
    stubs: list[str] = []
    for q in spec.queries:
        key_repr = q.key or f"['{spec.name.lower()}']"
        enabled_clause = f", enabled: {q.enabled}" if q.enabled else ""
        stubs.append(
            f"  const {{ data: {q.name}, isLoading: {q.name}Loading, error: {q.name}Error }} = {q.hook}({{\n"
            f"    queryKey: {key_repr},\n"
            f"    queryFn: async () => {{ /* TODO: use {q.endpoint} service fn */ throw new Error('Not implemented'); }}{enabled_clause}\n"
            f"  }});"
        )
    return stubs


def _mutation_stubs(spec: ComponentSpec) -> list[str]:
    stubs: list[str] = []
    for m in spec.mutations:
        payload_type = m.payload or "Record<string, unknown>"
        stubs.append(
            f"  const {m.name} = {m.hook}<{payload_type}>({{ // endpoint: {m.endpoint}\n"
            f"    mutationFn: async (payload) => {{ /* TODO: use {m.endpoint} service fn */ throw new Error('Not implemented'); }},\n"
            f"    onSuccess: () => {{ /* {m.on_success} */ }},\n"
            f"    onError: () => {{ /* {m.on_error} */ }},\n"
            f"  }});"
        )
    return stubs


def _token_comment(spec: ComponentSpec) -> str:
    if not spec.design_tokens:
        return ""
    lines = ["  /**\n   * Design tokens for this component (enforced — no hardcoded colors/shapes):\n   *"]
    for token in spec.design_tokens:
        lines.append(f"   * {token}")
    lines.append("   */")
    return "\n".join(lines)


def _collect_placeholder_types(spec: ComponentSpec) -> list[str]:
    builtins = {
        "string", "number", "boolean", "null", "undefined", "void", "unknown", "any",
        "record", "array", "promise", "react", "reactelement", "error",
    }
    found: set[str] = set()
    type_sources = [prop.ts_type for prop in spec.required_props + spec.optional_props]
    type_sources.extend(state.ts_type for state in spec.local_state)
    type_sources.extend(m.payload for m in spec.mutations if m.payload)

    for type_source in type_sources:
        for token in re.findall(r"\b[A-Za-z_][A-Za-z0-9_]*\b", type_source):
            if token.lower() in builtins:
                continue
            if token in {"React", "Record", "Promise"}:
                continue
            if not token[0].isupper():
                continue
            found.add(token)

    return sorted(found)


def generate_component_tsx(spec: ComponentSpec) -> str:
    props_interface = _props_to_interface(spec)
    state_decls = _state_to_declarations(spec)
    query_stubs = _query_stubs(spec)
    mutation_stubs = _mutation_stubs(spec)
    token_comment = _token_comment(spec)

    child_imports = "\n".join(
        f"// import {{ {child} }} from './{child}';"
        for child in spec.child_components
        if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", child)
    )
    placeholder_types = _collect_placeholder_types(spec)
    placeholder_type_block = "\n".join(
        f"type {type_name} = unknown;"
        for type_name in placeholder_types
    )

    state_block = "\n".join(state_decls) if state_decls else "  // no local state"
    query_block = "\n".join(query_stubs) if query_stubs else "  // no queries"
    mutation_block = "\n".join(mutation_stubs) if mutation_stubs else "  // no mutations"

    description_comment = f"/**\n * {spec.description}\n *\n * Scaffold generated from build contract. Implement according to contract spec.\n * @see docs/schema/build_contract.xsd\n */" if spec.description else "/** Scaffold generated from build contract. Implement according to contract spec. */"

    # Generate TanStack Query imports if queries or mutations are present
    tanstack_import = ""
    if spec.queries or spec.mutations:
        imports = ["useQuery"] if spec.queries else []
        if spec.mutations:
            imports.append("useMutation")
        tanstack_import = f"import {{ {', '.join(imports)} }} from '@tanstack/react-query';"

    prop_names: list[str] = []
    for prop in spec.required_props + spec.optional_props:
        if prop.name not in prop_names:
            prop_names.append(prop.name)
    destructured_props = ", ".join(prop_names) or "props"

    return textwrap.dedent(f"""\
        /**
         * {spec.name}.tsx — scaffolded from build contract
         * Role: {spec.role}
         * SCAFFOLD: Replace TODO sections with real implementation.
         * Token rule: All colors/shapes must use --sys-color-* and --sys-shape-* tokens.
         *             Zero hardcoded hex, rgba(), hsla() values permitted.
         */
        import React from 'react';
        {tanstack_import}
        {child_imports}

        {description_comment}
        {placeholder_type_block}
        {props_interface}

        {token_comment}
        export const {spec.name} = ({{{destructured_props}}}: {spec.name}Props): React.ReactElement => {{
        {state_block}

        {query_block}

        {mutation_block}

          // TODO: Implement component body per build contract and supplementary brief.
          return (
            <div data-testid="{spec.name.lower()}-root">
              {{/* {spec.name} — implement here */}}
            </div>
          );
        }};

        export default {spec.name};
    """)


def generate_test_stub(spec: ComponentSpec) -> str:
    test_cases = "\n\n".join(
        f"  it('{t.description}', () => {{\n    // TODO: implement\n  }});"
        for t in spec.tests
    ) or "  it('renders without crashing', () => {\n    // TODO: implement\n  });"

    return textwrap.dedent(f"""\
        /**
         * {spec.name}.test.tsx — scaffolded from build contract test_contract
         * Implement each test per the description.
         */
        import React from 'react';
        import {{ render }} from '@testing-library/react';
        import {{ {spec.name} }} from '../{spec.name}';

        describe('{spec.name}', () => {{
        {test_cases}
        }});
    """)


# ---------------------------------------------------------------------------
# Writer
# ---------------------------------------------------------------------------


def write_scaffold(
    spec: ComponentSpec,
    repo_root: Path,
    dry_run: bool = False,
    force: bool = False,
) -> dict[str, Any]:
    if not spec.file_path:
        return {"component": spec.name, "status": "skipped", "reason": "no file_path in contract"}

    out_path = repo_root / spec.file_path
    test_dir = out_path.parent / "__tests__"
    test_path = test_dir / f"{spec.name}.test.tsx"

    tsx_content = generate_component_tsx(spec)
    test_content = generate_test_stub(spec)

    results: list[str] = []

    for target, content in [(out_path, tsx_content), (test_path, test_content)]:
        if target.exists() and not force:
            results.append(f"SKIP (exists): {target.relative_to(repo_root)}")
            continue
        if dry_run:
            results.append(f"DRY-RUN: would write {target.relative_to(repo_root)}")
        else:
            if target.exists():
                print(f"  WARNING: overwriting {target.relative_to(repo_root)}")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
            results.append(f"WRITTEN: {target.relative_to(repo_root)}")

    return {"component": spec.name, "status": "ok", "files": results}


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--build-contract", type=Path, required=True,
        help="Path to route build_contract.xml",
    )
    parser.add_argument(
        "--supplementary-briefs", type=Path, default=None,
        help="Optional supplementary_component_briefs.xml for richer spec data",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print what would be written without creating any files",
    )
    parser.add_argument(
        "--force", action="store_true",
        help="Overwrite existing files (use with caution)",
    )
    args = parser.parse_args()

    contract_components = parse_contract(args.build_contract)
    briefs = parse_supplementary_briefs(args.supplementary_briefs)
    specs = merge_specs(contract_components, briefs)

    print(f"Scaffolding {len(specs)} components from {args.build_contract.name}")
    if args.dry_run:
        print("(DRY-RUN — no files will be written)\n")

    for spec in specs:
        result = write_scaffold(spec, REPO_ROOT, dry_run=args.dry_run, force=args.force)
        for line in result.get("files", [result.get("reason", "")]):
            print(f"  [{spec.name}] {line}")


if __name__ == "__main__":
    main()
