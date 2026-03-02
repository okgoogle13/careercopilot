# Master Migration Plan v2

## Goals
- 100% Component Migration
- 100% Design Token Compliance
- >80% Test Coverage
- 100% Storybook Stories

## Metrics
Metrics are tracked in `frontend/component-inventory.json`.

## Current Snapshot (2026-01-20)
- Total components: 172
<<<<<<< HEAD
- Migrated (Curio-only): 76
- Mixed (Curio + legacy): 17
- Not migrated (legacy-only): 16
- Unknown: 63
- Curio adoption: 44.2% (76/172)

## Next Steps (Prioritized)
### Phase 1: Resolve Mixed Components (fastest ROI)
- Convert the 17 mixed components to Curio-only by removing legacy MUI/M3 usage.
- Prioritize by usage count and critical flows (auth, onboarding, gallery/lab shells, applications, documents).

### Phase 2: Migrate Legacy-Only Components
- Convert the 16 legacy-only components to Curio tokens and mode system.
=======
- Migrated (kr-solidarity-only): 76
- Mixed (kr-solidarity + legacy): 17
- Not migrated (legacy-only): 16
- Unknown: 63
- kr-solidarity adoption: 44.2% (76/172)

## Next Steps (Prioritized)
### Phase 1: Resolve Mixed Components (fastest ROI)
- Convert the 17 mixed components to kr-solidarity-only by removing legacy MUI/M3 usage.
- Prioritize by usage count and critical flows (auth, onboarding, kr-dark/lab shells, applications, documents).

### Phase 2: Migrate Legacy-Only Components
- Convert the 16 legacy-only components to kr-solidarity tokens and mode system.
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Start with high-usage UI primitives and shared components to lift dependent features.

### Phase 3: Classify Unknowns
- Identify which of the 63 unknown components are used.
<<<<<<< HEAD
- Used: migrate to Curio tokens/mode system.
=======
- Used: migrate to kr-solidarity tokens/mode system.
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Unused: archive or flag for removal.

### Ongoing
- Re-run the inventory script before each planning cycle:
  `cd frontend && node --loader ts-node/esm scripts/component-inventory.ts`
- Update `docs/CURRENT_STATUS.md` after each batch completion.
