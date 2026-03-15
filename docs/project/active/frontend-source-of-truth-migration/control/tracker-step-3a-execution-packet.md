# `/tracker` Step 3a Execution Packet

This is the active execution packet for `/tracker` Step 3a. Stub generation is complete; the remaining work is route-local verification and implementation closeout.

## Inputs

- build contract: `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml`
- supplementary briefs: `docs/project/active/frontend-source-of-truth-migration/contracts/tracker-supplementary-component-briefs.xml`
- paired runtime owner: `frontend/src/features/applications/ApplicationTracker.tsx`

## Implemented Scope

The first support-component pass now exists for:

- `frontend/src/features/applications/components/KanbanColumn.tsx`
- `frontend/src/features/applications/components/ApplicationDetailPanel.tsx`
- `frontend/src/features/applications/components/ApplicationEditForm.tsx`
- `frontend/src/features/applications/components/ApplicationStatusActions.tsx`
- `frontend/src/features/applications/components/ApplicationArchiveAction.tsx`

The routed owner remains canonical:

- `frontend/src/features/applications/ApplicationTracker.tsx`

## Current Verification Commands

Run from repo root.

## Post-Generation Checks

Run these to close Step 3a:

```bash
bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh /tracker
bash .claude/skills/migration-audit/scripts/run-migration-audit.sh /tracker
bash .claude/skills/api-contract-validator/scripts/run-api-contract-validator.sh /tracker
```

Route-local verification for the implemented route owner:

```bash
cd frontend && yarn test src/features/applications/__tests__/ApplicationTracker.test.tsx --runInBand
cd frontend && yarn type-check
```

## Operator Notes

- `scaffold-from-contract.py` remains the TSX stub generator of record for `/tracker`, but this packet is now past the scaffold phase.
- `migration-audit` is support-only in M1. Missing benchmark coverage does not block this stub pass.
- `api-contract-validator` should be used to confirm the canonical `/tracker` caller and endpoint pairing before replacing mock data in `ApplicationTracker`.
