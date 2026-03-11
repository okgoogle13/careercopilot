# Token Enforcement JSON Contract

## Purpose

token-enforcement is a **detection gate**, not an auto-fixer. It reports violations with benchmark-guided remediation steps. Humans/agents apply fixes, then re-run the gate for validation.

## Input Schema

```json
{
  "route": "/login",
  "screen_path": "apps/web/src/screens/LoginScreen.tsx",
  "mode": "verify" | "token-only" | "copy-only" | "recheck",
  "benchmark_id": "auth-benchmark-v1"
}
```

## Output Schema (Violation Report)

```json
{
  "gate": "token-enforcement",
  "route": "/login",
  "status": "pass" | "fail",
  "benchmark_id": "auth-benchmark-v1",
  "benchmark_reference": "careercopilot-migration-kit-v3/docs/design-system/benchmarks/auth-benchmark-v1/",
  "checks": {
    "lint": { "status": "pass", "violations": 0 },
    "type_check": { "status": "pass", "violations": 0 },
    "design_audit": { "status": "pass", "violations": 0, "findings": [] },
    "audit_copy": { "status": "pass", "violations": 0, "findings": [] },
    "test": { "status": "pass", "failures": 0 }
  },
  "violations": [
    {
      "type": "hardcoded-color",
      "severity": "critical",
      "file": "apps/web/src/screens/LoginScreen.tsx:42",
      "value": "#1A1714",
      "rule": "BR-TOKEN-001: No hardcoded color literals",
      "remediation": {
        "action": "Replace hardcoded color with semantic token",
        "fix": "Replace `#1A1714` with `--sys-color-charcoalBackground-base`",
        "benchmark_example": "auth-benchmark-v1/LoginScreen.tsx:42 uses --sys-color-charcoalBackground-base",
        "command": "Edit apps/web/src/screens/LoginScreen.tsx:42"
      }
    },
    {
      "type": "banned-meta-language",
      "severity": "high",
      "file": "apps/web/src/screens/LoginScreen.tsx:78",
      "value": "migration in progress",
      "rule": "BR-COPY-001: No developer meta-language in user-facing text",
      "remediation": {
        "action": "Rewrite user-facing copy to remove meta-language",
        "fix": "Replace 'migration in progress' with user-facing journey context",
        "benchmark_example": "auth-benchmark-v1/LoginScreen.tsx:78 uses 'Sign in to continue your application'",
        "command": "Edit apps/web/src/screens/LoginScreen.tsx:78"
      }
    }
  ],
  "remediation_workflow": [
    {
      "step": 1,
      "action": "Review violations and benchmark examples",
      "command": "cat careercopilot-migration-kit-v3/docs/design-system/benchmarks/auth-benchmark-v1/rationale.md"
    },
    {
      "step": 2,
      "action": "Apply fixes to LoginScreen.tsx using benchmark as reference",
      "commands": [
        "Edit apps/web/src/screens/LoginScreen.tsx:42 (replace hardcoded color)",
        "Edit apps/web/src/screens/LoginScreen.tsx:78 (rewrite copy)"
      ]
    },
    {
      "step": 3,
      "action": "Re-run token-enforcement to validate fixes",
      "command": "cd careercopilot-migration-kit-v3 && npm run verify -- --json"
    }
  ],
  "next_gate": "visual-ready",
  "commands": {
    "verify": "cd careercopilot-migration-kit-v3 && npm run verify",
    "recheck": "cd careercopilot-migration-kit-v3 && npm run verify -- --json --mode recheck"
  }
}
```

## Exit Codes
- `0`: All checks pass (status: "pass") → Proceed to next gate
- `1`: Token violations detected (status: "fail") → Apply remediation, recheck
- `2`: Copy violations detected (status: "fail") → Apply remediation, recheck
- `3`: Both token and copy violations (status: "fail") → Apply remediation, recheck

## Remediation Flow

```
┌─────────────────────────────────────────────────┐
│  token-enforcement (Detection Gate)             │
├─────────────────────────────────────────────────┤
│  Input: /login route                            │
│  Output: violations.json                        │
│    - 2 violations found                         │
│    - Benchmark: auth-benchmark-v1               │
│    - Remediation: See violations[].remediation  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Human/Agent Fixes (Using Benchmark as Guide)   │
├─────────────────────────────────────────────────┤
│  1. Read auth-benchmark-v1/rationale.md         │
│  2. Compare LoginScreen.tsx:42 vs benchmark:42  │
│  3. Apply fix: #1A1714 → --sys-color-*          │
│  4. Read benchmark copy examples                │
│  5. Rewrite copy using journey context          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  token-enforcement --recheck (Validation)       │
├─────────────────────────────────────────────────┤
│  Output: violations.json                        │
│    - 0 violations (status: pass)                │
│    - Proceed to next gate: visual-ready         │
└─────────────────────────────────────────────────┘
```

## Benchmark Reference Structure

When violations are detected, the skill outputs:

1. **Violation details**: What's wrong, where, why it's wrong
2. **Benchmark pointer**: Which benchmark bundle shows the "correct" pattern
3. **Specific example**: Exact line/file in benchmark that demonstrates fix
4. **Remediation command**: Actionable Edit/Write command for human/agent

Example:
```json
{
  "violation": "hardcoded-color at LoginScreen.tsx:42",
  "benchmark_reference": "auth-benchmark-v1/LoginScreen.tsx:42",
  "benchmark_value": "--sys-color-charcoalBackground-base",
  "command": "Edit apps/web/src/screens/LoginScreen.tsx:42 to use --sys-color-charcoalBackground-base"
}
```
