# Frontend Consolidation (PR126) Execution Plan
*Optimized for Claude Code Autonomous Execution*

## Execution Context & Authority
- **Primary Objective**: Purge frontend structural drift and finalize the Kerala Rage "Gold Standard" architecture.
- **Authority Order**:
  1. **Runtime Truth:** `App.tsx` and mounted routes.
  2. **Design Truth:** `screens/**` wireframes.
  3. **Capability Truth:** Current backend endpoints.

---

## Phase 0: Target State Baseline Extraction [COMPLETED]
*Capture the AST metrics and dependency trees before modifying the codebase.*

1. Run the precise snapshot block from the repository root:
   ```bash
   yarn install
   npx tsx tools/scripts/scan-routes.ts
   npx tsx tools/scripts/scan-screens.ts
   npx tsx tools/scripts/scan-api-usage.ts
   python3 tools/scripts/scan-endpoints.py
   npx tsx tools/scripts/detect-orphans.ts
   # Run frontend subsets
   cd frontend
   npx tsx scripts/component-inventory.ts
   npx tsx scripts/inventory-postprocess.ts
   npx tsx scripts/component-inventory.ts --raw
   npx tsx scripts/generate-layered-blueprint.ts
   cd ..
   # Run Integrity checks
   npx tsx tools/ci/check-route-integrity.ts
   npx tsx tools/ci/check-screen-pairs.ts
   ```
2. Verify that `docs/manifests/orphans.json` and `frontend/component-inventory.json` have generated successfully.

---

## Phase 1: Routing & Shell Drift Convergence
*Re-map canonical route owners and eliminate legacy abstractions.*

1. **Target**: `frontend/src/App.tsx`
2. **Execute**:
   - Update `LandingPage`, `DashboardPage`, `ProfilePage`, `ApplicationsPage`, `AnalysisPage`, `DocsPage`, `SettingsPage`, and `OnboardingPage` to import directly from their canonical `features/` directory equivalent (e.g. `import { Dashboard } from './features/dashboard/Dashboard'`).
   - Remove `<ProtectedLayout />` wrap from `/asset-library` and `/test-tokens`. Migrate them to `<MigratedRouteLayout />` or delete if unauthorized.
   - Strip all obsolete static redirects (`/tracker`, `/opportunities`, `/kanban`, `/ingestion`) if they are already handled by `route-registry.ts`.
3. **Validate**:
   ```bash
   cd frontend && yarn type-check
   ```

---

## Phase 2: Design System Hardening & Component Audit
*Enforce the KR Solidarity v6.1 DTCG `sys-*` to `kr-*` token migration.*

1. **Target**: `frontend/src/components/*` & `frontend/src/features/*`
2. **Execute**:
   - Scan for legacy `--sys-` and `--color-` variables or hardcoded radii using `rg`.
   - Replace literal geometry (e.g., `rounded-xl`) with canonical token classes (e.g., `rounded-[var(--kr-shape-placard-base-01)]` or `--radius-*`).
   - Update primary action buttons (Strike) to utilize `--kr-color-ink-gold-base` palettes.
   - Refactor overly complex conditional render operations using the `asChild` composition pattern per `.claude/skills/building-components`.
3. **Validate**:
   - Verify class replacement consistency via `grep_search`.

---

## Phase 3: Legacy Quarantine
*Purge the dead documentation, scripts, and harvested prototypes.*

1. **Target**: Entire Repository
2. **Execute**:
   - `rm -rf frontend/src/pages/` (Only after Phase 1 type-check passes).
   - `rm -rf docs/project/active/frontend-source-of-truth-migration/` (Purge outdated tracker logic).
   - `rm archive/scripts/consolidate_components.py` (Purge outdated shims).
   - Evaluate `prototype_v2.0` directory and `rm` any `.tsx` files already bridged into canonical `features/`.

---

## Phase 4: API Convergence & React Router prep
*Homogenize standard React implementations.*

1. **Target**: `frontend/src/features/*`
2. **Execute**:
   - Perform an AST evaluation (using `flash-sidekick` / `quick_summarize`) over features to identify raw `axios` or `fetch` calls. Replace them with standardized `TanStack Query` hooks aligned to `route-registry.ts`'s `apiDeps`.
   - Identify existing custom `onSubmit` forms rendering URL search params and switch them to `<Form method="get">` per `.claude/skills/react-router-framework-mode`.

---

## Phase 5: Final Evaluation Snapshot
*Re-run the baseline extraction to quantify the clean-up.*

1. **Execute**:
   ```bash
   # Re-run the Phase 0 snapshot block exactly
   ```
2. **Analysis**:
   - Compare the final `docs/manifests/orphans.json` vs the Phase 0 output.
   - Provide the finalized layout delta log representing deleted pages, removed components, and updated route structures.

---

## Phase 6: Project Dissolution & Documentation Sync
*Dissolve the active project context into the permanent frontend repository structure.*

1. **Execute**:
   - Move final checkpoint reports to `frontend/docs/reports/PR126-consolidation/`.
   - Sync architectural findings (from this plan and execution) to `frontend/README.md`.
   - Clean up `docs/project/active/` by removing all PR126-specific planning files.
   - Archiving the completion record in `docs/project/archive/PR126-completion.md`.
