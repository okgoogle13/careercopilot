# Phase 4: Experimental Support Integrations (Foundation)

Implement high-leverage integrations: **Harvest Audit** and **Owner Mapper**.

## 1. Key Components

### 1.1 `prototype-harvest-audit.py` [NEW]
- **Goal**: Deterministic QA gates (no drift, no leaks).
- **Function**: Scans edits for destructive ops or prototype shell violations.
- **Portability**: Auto-root discovery via `git rev-parse`.
- **Efficiency**: Delegates bulk scans to `flash-sidekick`.

### 1.2 `canonical-owner-mapper.py` [NEW]
- **Goal**: Inventory prototype surfaces and map to `route-matrix.md`.
- **Function**: Classifies surfaces (`harvest_now`, `support_only`) and generates `migration_matrix.json`.
- **Efficiency**: Uses `flash-sidekick.quick_summarize` for large-scale surface analysis.

## 2. Verification Plan

### 2.1 Automated
- Run `prototype-harvest-audit.py --dry-run` on `ValidationDashboard.tsx` to verify gate detection.
- Validate `migration_matrix.json` alignment with `/frontend/src/App.tsx` routes.

### 2.2 Manual
- Verify that `Owner Mapper` correctly identifies the `support-only` status of prototype TSX.
- Confirm Firebase configuration exports match the canonical `frontend/src/config/firebase.ts` authority.

---
**Note**: Implementation follows the "Native Agent" strategy (Gemini for Mapper, Claude for Audit).
