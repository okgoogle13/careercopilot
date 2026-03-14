# Token Enforcement JSON Contract

## Purpose

token-enforcement is a **detection gate**, not an auto-fixer. It reports violations with token-source remediation steps. Humans/agents apply fixes, then re-run the gate for validation.

## Input Schema

```json
{
  "route": "/login"
}
```

## Output Schema (Violation Report)

The wrapper executes a grep-based scan across frontend source for hardcoded colors and deprecated tokens.

```json
{
  "gate": "token-enforcement",
  "route": "/login",
  "timestamp": "2026-03-14T15:30:42Z",
  "status": "pass" | "fail",
  "files_scanned": ["frontend/src/features", "frontend/src/pages", "frontend/src/screens", "frontend/src/components"],
  "violation_count": 2,
  "violations": [
    {
      "rule": "BR-TOKEN-001",
      "type": "hardcoded-color",
      "severity": "critical",
      "file": "frontend/src/screens/LoginScreen.tsx:42",
      "value": "#1A1714",
      "remediation": "Replace with canonical --sys-color-*, --sys-shape-*, or --sys-type-* token"
    },
    {
      "rule": "BR-TOKEN-002",
      "type": "deprecated-token",
      "severity": "high",
      "file": "frontend/src/features/profile/Profile.tsx:18",
      "value": "labWrenMetalBlue",
      "remediation": "Replace with canonical --sys-color-*, --sys-shape-*, or --sys-type-* token"
    }
  ],
  "canonical_sources": [
    "frontend/src/design/tokens/tokens.json",
    "frontend/src/design/styles/design-tokens.css"
  ],
  "recheck_command": ".claude/skills/token-enforcement/scripts/run-token-enforcement.sh /login",
  "next_gate": "migration-audit" | null
}
```

**Note**: `next_gate` is emitted as a convenience hint only. It is not an approval signal.

## Exit Codes
- `0`: All checks pass (status: "pass") → Proceed to next gate
- `1`: Token violations detected (status: "fail") → Apply remediation, recheck

## Remediation Flow

```
┌─────────────────────────────────────────────────┐
│  token-enforcement (Detection Gate)             │
├─────────────────────────────────────────────────┤
│  Input: /login route                            │
│  Output: violations.json                        │
│    - 2 violations found                         │
│    - Remediation: See violations[].remediation  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Human/Agent Fixes                              │
├─────────────────────────────────────────────────┤
│  1. Inspect violations[].file + violations[].value │
│  2. Replace hardcoded values with canonical tokens │
│  3. Re-run wrapper and confirm status=pass         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  token-enforcement --recheck (Validation)       │
├─────────────────────────────────────────────────┤
│  Output: violations.json                        │
│    - 0 violations (status: pass)                │
│    - next_gate may be "migration-audit"         │
└─────────────────────────────────────────────────┘
```

## Remediation Reference Structure

When violations are detected, the skill outputs:

1. **Violation details**: What's wrong, where, why it's wrong
2. **Canonical source**: Which token source of truth to consult
3. **Specific example**: Exact file/line that needs replacement
4. **Remediation command**: Actionable Edit/Write command for human/agent

Example:
```json
{
  "violation": "hardcoded-color at LoginScreen.tsx:42",
  "canonical_source": "frontend/src/design/tokens/tokens.json",
  "canonical_value": "--sys-color-charcoalBackground-base",
  "command": "Edit frontend/src/screens/LoginScreen.tsx:42 to use --sys-color-charcoalBackground-base"
}
```
