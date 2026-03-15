---
name: migration-audit
description: Run deterministic migration quality audits for this repo's frontend source-of-truth migration.
---

# Migration Audit

**Full Version**: 2.3.0
**Primary Consumer**: [subagent-driven-development](../subagent-driven-development/SKILL.md)

## Purpose

Audit one migrated route or wireframe-backed surface and produce a single report that separates structural correctness from visual quality.

This skill is execution support, not planning truth.

## Pre-Audit Checklist

Before running the audit, ensure:
- [ ] Route is defined in `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`.
- [ ] A valid `benchmark_id` is identified for non-auth routes.
- [ ] XML Wireframe exists and matches the `xml_wireframe_path` in the matrix.
- [ ] (For `--visual`) Dev server (`localhost:5173`) and Backend (`localhost:8000`) are running.

## Allowed Use

- audit route/runtime/design/capability alignment after the route is in `route-matrix.json`
- audit wireframe-backed routes (validates XML structural consistency automatically)
- use as evidence for readiness on routes that already have a named benchmark

## Blocked Use

- **Legacy Prototypes**: Routes starting with `/kr/` or marked as `layout: prototype` will **fail**.
- **Diverged Wireframes**: If `scripts/validate-wireframe-workflow.py` fails, the audit will **fail**.
- **Hardcoded Styling**: Routes failing `token-enforcement` will trigger `needs_refinement`.
- do not use derived artifacts to override runtime, design, or capability truth.

## Benchmarks

- `TARGET`: The route ID (e.g., `/tracker`). Must match an entry in `route-matrix.json`.
- `BENCHMARK_ID`: The unique identifier for the truth-source wireframe. For non-auth routes, this is often the route ID itself (e.g., `/tracker`). The audit script validates existence of `.wireframe.xml` and paired `.tsx` benchmarks defined in the migration matrix.

## Workflow

1.  **Matrix Gate**: Verifies route existence and extracts mappings from `route-matrix.json`.
2.  **Wireframe Validation**: structural and coordinate check of XML wireframe (P1 gate).
3.  **Governance Check**: Ensures Build Contract is in `execution_ready` state.
4.  **Manifest Check**: Verifies route presence and checks for prototype status (P0 gate).
5.  **Live Verification** (Optional: `--visual`): Captures headless screenshot of the target route.
6.  **Token Enforcement**: Checks for structural/brand compliance (P0 gate).
7.  **Reporting**: Emits consolidated JSON audit report with follow-up commands.

## Usage

```bash
# Aliases: /ma, /audit-migration (slash command aliases)

# Decision Rule:
# - Skip --visual during iterative token/structural fixing (saves time/compute).
# - Use --visual ONLY when submitting a route as "Ready for Review" or for final proof.

# Structural check only
/ma /career/ingest

# Full audit with visual evidence (requires running dev server)
/ma /career/ingest --visual
```

## Output Details

Returns a JSON report including:
- `status`:
  - `pass`: All gates clear.
  - `needs_refinement`: Token violations found or truth layers missing.
  - `fail`: Structural wireframe error or prototype route usage.
- `evidence`: Paths to `route_matrix` and `gap_map`.
- `screenshot_path`: Populated ONLY when `--visual` is passed.
- `token_enforcement`: Detailed violation report from the token gate.
- `follow_up`: Actionable list of remediation commands (e.g., `/visual-audit`).

### Sample Output

**Status: Pass**
```json
{
  "gate": "migration-audit",
  "status": "pass",
  "evidence": { "route_matrix": "control/route-matrix.json" },
  "token_enforcement": { "status": "pass", "violation_count": 0 }
}
```

**Status: Needs Refinement**
```json
{
  "gate": "migration-audit",
  "status": "needs_refinement",
  "reason": "token-enforcement failed; fix hardcoded colors",
  "token_enforcement": { "status": "fail", "violation_count": 2, "violations": [...] },
  "follow_up": ["fix token violations before marking route ready"]
}
```

## Troubleshooting & Recovery

- **Benchmark Missing**: Audit will mark `needs_refinement`. Supply a benchmark ID in the command.
- **Wireframe Validation Failure**: Run `python3 scripts/validate-wireframe-workflow.py --route-id <ID>` to debug XML divergence.
- **Token Blockage**: Review the `token_enforcement` payload. Resolve all "critical" hardcoded colors.
- **Dev Server Down**: Visual capture will be skipped. Ensure `yarn dev` is running on PORT 5173.
- **Ambiguous Failure/Script Error**: If the audit script crashes or fails without a JSON report, check `.claude/skills/migration-audit/scripts/run-migration-audit.sh` logs. Escalate to the human if logs indicate environment issues (e.g., missing dependencies).

## Related Documentation

- [Blueprint](docs/project/active/frontend-source-of-truth-migration/control/blueprint.md)
- [Route Matrix](docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json)
- [Gap Map](docs/project/active/frontend-source-of-truth-migration/control/gap-map.json)
