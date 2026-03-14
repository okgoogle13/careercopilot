---
name: api-contract-validator
description: Validate request and response contract alignment between frontend API callers and backend FastAPI/Pydantic models.
chainable: true
gate_type: contract-alignment
lifecycle_stage: M1-M2
metadata:
  version: 1.2.0
  tags:
    - migration
    - contract
    - api
    - enforcement
---

# API Contract Validator

## Purpose

Check that retained frontend API contracts still match the mounted backend endpoints used by this repository.

For the frontend source-of-truth migration, this skill is primarily for validating retained route owners such as `/career/ingest`, `/tracker`, `/documents`, and `/profile` after route ownership is already decided.

## Allowed Use

- compare frontend API callers in `frontend/src/api/` and related hooks/services against mounted backend endpoints
- identify request/response field mismatches, optionality drift, and path drift
- validate retained contracts before route implementation or migration closure

## Blocked Use

- do not use this skill to decide canonical ownership or planning truth
- do not treat deprecated or transitional frontend callers as canonical simply because they still exist
- do not scan unrelated schema files and call that migration evidence

## Primary Sources

- frontend callers:
  - `frontend/src/api/`
  - route-local hooks/services when they bypass shared callers
- backend contracts:
  - `backend/app/api/endpoints/`
  - request/response models used by those endpoints

## Workflow

1. Identify the canonical route owner from `control/route-matrix.json`.
2. Identify the retained capability owner from `control/gap-map.json` when relevant.
3. Trace the active frontend caller for the route.
4. Trace the mounted backend endpoint and its request/response models.
5. Report:
   - path mismatches
   - field mismatches
   - required/optional mismatches
   - enum drift
   - stale non-canonical callers still present in active code

## Multi-Caller Deduplication (MIG-103)

When multiple frontend callers are found for the same route, apply the following:

1. **Identify the active caller**: the one imported by the live route component in `frontend/src/App.tsx` or the route's primary screen
2. **Flag stale callers**: all others — mark for removal, do not treat as canonical
3. **Flag the route in output**: set `multi_caller_note.flagged: true` with caller count
4. **Do not choose canonical ownership**: that is a planning decision, not a contract validation decision

**Known fragmented routes (as of M1):**

| Route | Issue |
|-------|-------|
| `/career/ingest` | 4 API paths (MIG-103) — fragmented callers, not yet canonicalized |
| `/tracker` | Shared api/ + local hooks — verify active caller before validating |

## Output Expectations

Return a machine-readable JSON report per `references/JSON_CONTRACT.md`:

- `gate_result`: `pass` | `fail` | `needs_review`
- `contract_checked.frontend_callers`: all located callers
- `contract_checked.canonical_caller`: the active one (or `null` if undetermined)
- `contract_checked.stale_callers`: those to remove
- `breaking_mismatches[]`: field/path mismatches that break the contract
- `non_breaking_mismatches[]`: optionality drift, type widening
- `multi_caller_note`: flagged when caller count > 1
- `recommended_canonical_caller`: file path

## Notes

- prefer mounted endpoint truth over old planning prose
- for migration work, keep the report route-specific and actionable
- if multiple callers exist, explicitly identify which one is active and which are legacy
- see `references/JSON_CONTRACT.md` for full schema
- see `scripts/run-api-contract-validator.sh` for automation
