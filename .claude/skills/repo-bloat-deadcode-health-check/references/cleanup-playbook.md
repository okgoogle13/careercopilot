# Cleanup Playbook

Use this playbook after running `scripts/repo_health_audit.py`.

## Confidence Tiers

- `high`: Generated artifacts, logs, temporary files, obvious duplicates in output folders.
- `medium`: Stale files and duplicate source-like files with no clear ownership.
- `low`: Unused runtime dependencies and suspected dead code paths.

## Safe Removal Sequence

1. Create a focused branch for cleanup.
2. Remove `high` confidence items in one small batch.
3. Run lint, type-check, and targeted tests.
4. Remove `medium` confidence items in small, reviewable batches.
5. Validate runtime behavior for affected areas.
6. Remove `low` confidence items only with owner confirmation or usage proof.

## Validation Checklist

1. Confirm build still succeeds.
2. Confirm lint and type checks pass.
3. Confirm impacted tests pass.
4. Confirm no required file path or import broke.
5. Re-run the scanner and compare deltas.

## Reporting Template

Use this structure in your response:

1. Findings by severity and path.
2. Planned removals by confidence tier.
3. Commands executed and pass/fail results.
4. Deferred items and residual risk.
