---
name: manifest-reconciler
description: Reconcile assets across filesystem, manifest, and hero registry and report deterministic integrity gaps.
metadata:
  version: 2.3.0
  tags:
    - assets
    - manifest
    - integrity
---

# Manifest Reconciler

## Purpose

Detect mismatches between on-disk assets, manifest entries, and hero registry references.

## Prerequisites

- frontend KR asset scripts are present under `frontend/scripts/kr`
- manifest source of truth is the frontend public asset tree
- the operator knows whether the target issue is integrity, placement, or visual quality

## Best Practices

- run this after asset additions, deletions, or renames
- use this before packaging or release gating when asset integrity is in doubt
- do not confuse integrity success with visual success; use `asset-placement-strategy` for slot quality and `migration-audit` for screen readiness

## When to Use

- Before packaging/deploy.
- After bulk asset edits.
- When asset placement looks correct visually but integrity still needs verification.
- When a migration or visual audit flags suspicious asset references, drift, or registry mismatches.

## Shared References

- `../shared-references/STATUS_THRESHOLDS.md`
- `../../docs/design/04_ASSETS.md`
- `../shared-references/AUDIT_OUTPUT_CONTRACT.md`

## Scope

Checks:
- missing or orphaned assets
- unresolved manifest references
- hero-registry/manifest drift
- layering compatibility consistency

## How To Use

Use this skill when asset correctness must be proven across:
- on-disk files
- manifest entries
- hero registry usage

### Typical workflow

1. Identify the target asset set or route context.
2. Reconcile filesystem assets against the manifest.
3. Check hero registry references for drift.
4. Feed the reconciliation result into packaging or migration audit decisions.

### Repo-native commands

```bash
cd /Users/okgoogle13/Projects/careercopilot/frontend
node scripts/kr/generate-manifest.mjs
node scripts/kr/validate-manifest.mjs
node scripts/kr/generate-hero-registry.mjs
```

### Preferred operator workflow

Use the wrapper script when you want a repeatable reconciliation pass with one entrypoint:

```bash
cd /Users/okgoogle13/Projects/careercopilot
.claude/skills/manifest-reconciler/scripts/run-manifest-reconciliation.sh
```

Use the individual frontend commands directly when:
- you are debugging one generation step
- you already know the pipeline and only need one script rerun
- you want to inspect intermediate output before the full sequence completes

Use this skill instead of running those commands blindly when you need:
- interpretation of the integrity findings
- a decision about whether the issue is blocking
- guidance on whether to hand off to placement, packaging, or path validation

## Workflow

1. Confirm the relevant asset set, route, or packaging context.
2. Regenerate the manifest if assets may have changed.
3. Validate the manifest structure and file references.
4. Regenerate the hero registry so composition references align to current manifest state.
5. Interpret the result:
   - integrity pass
   - blocking integrity failure
   - non-blocking cleanup task
6. Hand off to the next skill if the issue is not actually integrity-related.

## Output Interpretation

Treat these as blocking:
- missing assets required by the manifest
- manifest ids that do not resolve to files
- hero-registry references that drift from the manifest
- layering compatibility mismatches that break composition contracts

Treat these as follow-on issues:
- unused assets with documented reasons
- naming cleanup that does not break integrity

## Decision Guide

Use `manifest-reconciler` when the question is:
- "Do the files, manifest, and registry still agree?"

Use `asset-placement-strategy` when the question is:
- "Are the right assets in the right slots?"

Use `component-visual-audit` or `m3-visual-audit` when the question is:
- "Does the composed result actually look right?"

## Example

```bash
cd /Users/okgoogle13/Projects/careercopilot/frontend
node scripts/kr/generate-manifest.mjs
node scripts/kr/validate-manifest.mjs
node scripts/kr/generate-hero-registry.mjs
```

Expected outcome:
- manifest and registry are regenerated consistently
- integrity mismatches become explicit
- downstream asset audits can trust the registry state

### Example JSON-style outcome

```json
{
  "wrapper": "manifest_reconciliation_audit",
  "status": "pass",
  "blocking_issues": [],
  "follow_on_issues": [],
  "next_skill": "asset-placement-strategy"
}
```

## Edge Cases

- No asset changes but reconciliation still fails:
  - suspect registry drift or stale generated artifacts
- Assets exist on disk but are not canonical:
  - treat as integrity failure until naming/manifest alignment is restored
- Hero registry is valid but the screen still looks wrong:
  - hand off to `asset-placement-strategy` or visual audit; reconciliation only proves integrity
- Validation script missing:
  - stop and restore the frontend KR scripts before claiming integrity success
- Generated files changed but git diff is unexpectedly large:
  - inspect for unintended asset naming or folder-structure drift before continuing

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

Use deterministic shape with wrapper key `manifest_reconciliation_audit`.

## Success Metrics

- one operator can run a full reconciliation from a single wrapper command
- blocking integrity issues are separated from visual or placement issues
- manifest drift, missing files, and registry drift are unambiguous in the result

## Related Skills

- `asset-path-validator`
- `asset-packager`
- `phase4-pipeline-orchestrator`
- `asset-placement-strategy`
- `migration-audit`
