# Legacy Automation Workflows (Archived)

This folder quarantines legacy queue/stage workflow guidance that is no longer authoritative.

## Not authoritative for release readiness

Old multi-queue/stage tracking docs are retained only for historical context.

## Current source of truth

Use orchestrator artifacts instead:
- `docs/design/generated/design-readiness.json`
- `docs/design/design-readiness.md`
- `docs/design/runs/<timestamp>.json`

## Migration policy

Any remaining references to old queue-based automation should be updated to point to orchestrator outputs.
