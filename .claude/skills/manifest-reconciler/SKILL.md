---
name: manifest-reconciler
description: Reconcile filesystem assets, manifest entries, and hero registry references to prove integrity and route asset issues to path validation or placement review. Use after asset additions, renames, bulk edits, packaging checks, or harvest prep when files, manifest, and registry may have drifted.
---

# Manifest Reconciler

## Purpose

Detect mismatches between on-disk assets, manifest entries, and hero registry references before any path audit, placement review, packaging, or harvest gating.

## Shared References

- `../shared-references/STATUS_THRESHOLDS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`
- `references/WORKFLOW.md`
- `../../../docs/design/04_ASSETS.md`
- `../../../docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
- `../../../docs/project/active/frontend-source-of-truth-migration/control/archive/harvest-spec.md`

## Prerequisites

- keep `frontend/public/assets` as the asset source of truth
- keep `frontend/scripts/kr` generators available before claiming integrity success
- know whether the target issue is integrity, pathing, placement, or visual quality

## Harvest Boundary

- treat this skill as an integrity gate only
- do not treat a passing reconciliation run as approval to harvest raw prototype TSX or support-only shell surfaces
- follow the migration harvest order from `COMET-MANIFEST.md`: integrity first, then pathing, then placement, then route-local audit or visual review as required

## Scope

Checks:
- missing or orphaned assets
- unresolved manifest references
- hero-registry/manifest drift
- layering compatibility consistency

## Operator Workflow

1. Confirm the route, asset set, or packaging context.
2. Run the wrapper for the default reconciliation sequence.
3. If the wrapper fails mid-step, rerun the individual frontend commands to isolate the broken stage.
4. If integrity passes, hand off to `asset-path-validator`.
5. Only hand off to `asset-placement-strategy` after integrity and path references are both clean enough to trust manifest ids.

### Preferred entrypoint

Use the wrapper when you want one repeatable integrity pass:

```bash
cd /Users/okgoogle13/Projects/careercopilot
.claude/skills/manifest-reconciler/scripts/run-manifest-reconciliation.sh
```

### Repo-native commands

Use the individual frontend commands when you are debugging one step:

```bash
cd /Users/okgoogle13/Projects/careercopilot/frontend
node scripts/kr/generate-manifest.mjs
node scripts/kr/validate-manifest.mjs
node scripts/kr/generate-hero-registry.mjs
```

## Output Interpretation

Treat these as blocking:
- missing assets required by the manifest
- manifest ids that do not resolve to files
- hero-registry references that drift from the manifest
- layering compatibility mismatches that break composition contracts

Treat these as follow-on issues:
- unused assets with documented reasons
- naming cleanup that does not break integrity

Map outcomes to the harvest sequence:
- `pass`: integrity is proven; continue to `asset-path-validator`
- `needs_refinement`: treat as support-only until the mismatch is fixed or explicitly quarantined
- `fail`: block packaging, placement, and harvest prep until integrity is restored

## Decision Guide

- Use `manifest-reconciler` for: "Do the files, manifest, and registry still agree?"
- Use `asset-path-validator` next for: "Do code, docs, and wireframes point at canonical asset locations?"
- Use `asset-placement-strategy` after that for: "Are the right assets in the right slots?"
- Use `component-visual-audit` or `m3-visual-audit` last for: "Does the composed result actually look right?"

## Example

```bash
cd /Users/okgoogle13/Projects/careercopilot
.claude/skills/manifest-reconciler/scripts/run-manifest-reconciliation.sh
```

Expected outcome:
- manifest and registry are regenerated consistently
- integrity mismatches become explicit
- downstream path and placement audits can trust the registry state

### Example JSON-style outcome

```json
{
  "wrapper": "manifest_reconciliation_audit",
  "status": "pass|needs_refinement|fail",
  "blocking_issues": [],
  "follow_on_issues": [],
  "next_skill": "asset-path-validator"
}
```

## Edge Cases

- No asset changes but reconciliation still fails:
  - suspect registry drift or stale generated artifacts
- Assets exist on disk but are not canonical:
  - treat as integrity failure until naming or manifest alignment is restored
- Hero registry is valid but the screen still looks wrong:
  - hand off to `asset-placement-strategy` or visual audit; reconciliation only proves integrity
- Validation script missing:
  - stop and restore the frontend KR scripts before claiming integrity success
- Generated files changed but git diff is unexpectedly large:
  - inspect for unintended asset naming, folder-structure drift, or accidental prototype-source promotion before continuing

## Troubleshooting

### Manifest validates but hero composition still breaks

- `manifest-reconciler` proves integrity, not placement quality
- use `asset-placement-strategy` next

### Generated manifest changed unexpectedly

- inspect recent asset additions, deletions, or naming changes
- confirm the asset directory and manifest source of truth are aligned

### Missing output contract references

- use the wrapper key `manifest_reconciliation_audit`
- treat this skill as the integrity source, not the final visual judge

### `generate-hero-registry.mjs` fails

- run `node scripts/kr/generate-manifest.mjs` first
- inspect the manifest output path referenced by the generator
- then rerun the registry generation step

### Validation passes but packaging still breaks

- hand off to `asset-path-validator` or `asset-packager`
- reconciliation proves registry/file integrity, not packaging rules

## Output Contract

Use deterministic shape with wrapper key `manifest_reconciliation_audit` and map the result to `pass`, `needs_refinement`, or `fail`.

## Success Metrics

- one operator can run a full reconciliation from a single wrapper command
- blocking integrity issues are separated from path, placement, and visual issues
- manifest drift, missing files, and registry drift are unambiguous in the result
- the next handoff is explicit enough that harvest workers do not skip straight from integrity to porting

## Related Skills

- `asset-path-validator`
- `asset-packager`
- `phase4-pipeline-orchestrator`
- `asset-placement-strategy`
- `migration-audit`
