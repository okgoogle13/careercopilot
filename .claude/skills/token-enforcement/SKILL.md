---
name: token-enforcement
description: Atomic enforcement gate to verify KR Solidarity token and copy hygiene in migrated frontend code.
---


# Token Enforcement

## Skill Metadata
<!-- For documentation only — not parsed by Claude Code skill loader -->
- **Version**: 1.5.0
- **Gate type**: enforcement
- **Lifecycle stage**: copy-cleared
- **Triggers**: [visual-ready-gate]
- **JSON I/O**: true
- **Chainable**: true
- **Aliases**: `/ma-token`

## Purpose

Check migrated frontend code for KR Solidarity token compliance and banned naming drift.

This skill applies to this repository's frontend code. Do not redirect operators into an external migration-kit workspace.

## Canonical Sources

- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`

## Allowed Use

- validate migrated route code before marking a route ready
- validate component or page styling after migration edits
- provide a deterministic pass/fail signal for token hygiene

## Blocked Use

- do not use this as a substitute for visual audit
- do not create a second token source of truth
- do not apply migration-only rules to unrelated backend files or non-UI docs

## Enforcement Rules

Fail on:

- hardcoded `#hex`, `rgb(a)`, or `hsl(a)` values in migrated frontend code
- banned deprecated token names:
  - `labWrenMetalBlue`
  - `GumLeafGreen`
  - `WattleGold`
  - `inkGreen`
- banned archetype names in new migration code:
  - `Jar`, `Cabinet`, `Seed`, `Leaf` (Regex: `<(Jar|Cabinet|Seed|Leaf)[ />]`)
- forbidden font drift such as `Inter`, `Roboto`, or `Arial`
- screen-level styling that bypasses:
  - `--sys-color-*`
  - `--sys-shape-*`
  - `--sys-type-*`

## Suggested Scope

Typical targets:

- `frontend/src/features/**/*.tsx`
- `frontend/src/pages/**/*.tsx`
- `frontend/src/components/**/*.tsx`

> [!NOTE]
> The audit is intelligently route-scoped. When a valid route is provided, it targets only the runtime surface and associated components defined in `route-matrix.json`.

## Prerequisites

- `run-token-enforcement.sh` must be executable (`chmod +x .claude/skills/token-enforcement/scripts/run-token-enforcement.sh`).
- Route must be registered in `route-matrix.json` for **Intelligent Scoping**.
- Node.js and Python 3 environment for JSON reporting.

## Usage

```bash
# Aliases: /ma-token /ma-tokens

# 1. Intelligent Check (Specific Route)
# Use this when working on a specific migrated route.
/ma-token /tracker

# 2. Bulk Check (Fallback)
# If route_id is omitted, logic scans all frontend/src/features/**/*.tsx
# NOTE: Results will be broad and may flag legacy code.
/ma-token
```

## Maintenance Guide

To update the enforcement logic (e.g., new banned archetypes or tokens):

1. **Edit Script**: Modify `scripts/run-token-enforcement.sh`.
2. **Update Patterns**: Adjust the `run_grep` calls for `BANNED_ARCHETYPES` or `DEPRECATED_TOKENS`.
3. **Verify**: Run the script against a known violation to confirm the new pattern fires.

## Integration

### migration-audit
This skill is a primary blocking gate for `migration-audit`.
- **Failure Condition**: If token-enforcement returns `status: fail`.
- **Downstream Logic**: `migration-audit` sets its top-level status to `needs_refinement`.
- **Operator Action**: Violations must be resolved before the route can achieve a `pass` status.

## Output Expectations

Returns a JSON payload with the following structure:

### Sample Pass
```json
{
  "gate": "token-enforcement",
  "status": "pass",
  "truncated": false,
  "violation_count": 0,
  "recheck_command": ".claude/skills/token-enforcement/scripts/run-token-enforcement.sh /tracker"
}
```

### Sample Fail
```json
{
  "gate": "token-enforcement",
  "status": "fail",
  "truncated": true,
  "violation_count": 200,
  "violations": [
    {
      "rule": "BR-TOKEN-001",
      "type": "hardcoded-color",
      "severity": "critical",
      "file": "frontend/src/features/Tracker/index.tsx:24",
      "value": "color: '#1A1714'",
      "remediation": "Replace with canonical --sys-color-* token"
    }
  ],
  "recheck_command": ".claude/skills/token-enforcement/scripts/run-token-enforcement.sh /tracker"
}
```

## Troubleshooting

- **Audit Noise**: If canonical source files are being flagged, verify the scan scope excludes those files.
- **False Positives**: Check `references/FAILURE_MODES.md` for common blocking states.
- **Missing Script**: Ensure `scripts/run-token-enforcement.sh` has executable permissions (`chmod +x`).

## Related Documentation

- [Enforcement Rules](references/ENFORCEMENT_RULES.md)
- [Failure Modes](references/FAILURE_MODES.md)
- [JSON Contract](references/JSON_CONTRACT.md)
