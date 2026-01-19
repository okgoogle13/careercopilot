# Master Migration Plan (Authoritative)

**Last Updated:** 2026-01-19  
**Status:** Phase 5.5 + Phase 6 remaining  
**Baseline:** `develop`

---

## Phase 1–5 Summary (Completed)

- **Phase 1–4:** Migration scaffolding, component moves, facade structure, shell stability complete.
- **Phase 5:** Navigation contract unified and wired.

---

## Phase 4.5: Supabase Migration (Completed)

- [x] **Database Migration**: Postgres -> Supabase (Mumbai Pooler).
- [x] **Infrastructure**: Removed local `postgres` container.
- [x] **Authentication**: Confirmed Local JWT (backed by Supabase User table).
- [x] **Cleanup**: Removed `firebase-admin`, legacy scripts, and service accounts.

---

## Phase 5.5: Stabilization & QA (Remaining)

### 5.5.1 Verification Tasks
- [ ] **Build & Preview Gate**
  - **Purpose:** Ensure production build is green and preview renders core routes.
  - **Inputs:** `frontend/` source, lockfiles.
  - **Commands:** `pnpm -C frontend install`, `pnpm -C frontend build`, `pnpm -C frontend preview`
  - **Outputs:** Build logs, running preview URL, list of any build warnings.
- [ ] **Navigation Regression Sweep**
  - **Purpose:** Validate routing and history integrity after migration.
  - **Inputs:** Preview URL.
  - **Steps:** Navigate across primary routes; use browser back/forward; verify `?tool=` query routing.
  - **Outputs:** Pass/fail checklist with any broken routes.
- [ ] **Component Coverage Audit**
  - **Purpose:** Ensure key UI components have tests/stories and render correctly.
  - **Inputs:** `docs/development/FRONTEND_MIGRATION_QUEUE.md`, Storybook.
  - **Focus:** `MetricCard`, `ImpactEnhancements`, `StatusBadge`, `M3Button`, `M3Card`
  - **Outputs:** List of missing tests/stories + file paths.
- [ ] **Design Token Health Check**
  - **Purpose:** Confirm no hardcoded styles remain in migrated components.
  - **Inputs:** `frontend/src/globals.css`, token files, component sources.
  - **Steps:** Grep for hardcoded hex/rgb, pixel radii, box-shadows.
  - **Outputs:** Findings list with file paths and replacements needed.
- [ ] **Smoke Tests (UI)**
  - **Purpose:** Validate core user flows in Gallery + Laboratory.
  - **Inputs:** Preview URL, browser automation.
  - **Steps:** Login flow (mock), open Gallery feed, open Laboratory dashboard, open a detail panel.
  - **Outputs:** Pass/fail checklist + screenshots on failure.
- [ ] **Northcote Curio Visual Verification**
  - **Purpose:** Confirm new design tokens are active and visible.
  - **Inputs:** `frontend/src/globals.css`, preview URL.
  - **Steps:** Verify `NorthcoteButton` GRAD hover, `StatusBadge` breathing animation, tokenized colors/shapes on key pages.
  - **Outputs:** Visual checklist with notes/screenshots.

### 5.5.3 Claude Desktop QA Task List (Handover)
- [ ] **MCP Health Check**
  - Confirm filesystem + Playwright MCP servers respond.
  - Confirm flash-sidekick MCP responds (`flash-sidekick` and `flash-sidekick-fast`).
- [ ] **Plan Review & Approval**
  - Review migration and deployment readiness sections; approve or flag blockers.
- [ ] **Component Coverage Audit**
  - Identify missing tests/stories for top queue items.
- [ ] **Design Token Health Check**
  - Find hardcoded colors/radii/shadows in migrated components.
- [ ] **Navigation Regression Sweep**
  - Verify routing, back/forward, and `?tool=` handling (Playwright).
- [ ] **Storybook Gaps Review**
  - Identify reusable components without stories.
- [ ] **Deployment Readiness Review**
  - Check CI parity and release blockers.

### 5.5.2 Quality Gates
- [ ] **Performance Baseline**
  - **Purpose:** Establish baseline for regression tracking.
  - **Inputs:** Preview URL.
  - **Steps:** Lighthouse run on Home, Gallery, Laboratory.
  - **Outputs:** `lighthouse-report.html` and scores table.
- [ ] **Accessibility Baseline**
  - **Purpose:** Confirm accessible focus states and contrast.
  - **Inputs:** Preview URL.
  - **Steps:** Keyboard nav sweep, focus ring visibility, basic ARIA checks.
  - **Outputs:** A11y checklist with issues + screenshots.
- [ ] **Stakeholder Review**
  - **Purpose:** Final visual parity signoff.
  - **Inputs:** Screenshots + notes.
  - **Outputs:** Approval or change list.

---

## Phase 6: Performance Optimizations (Remaining)

### 6.1 Bundle & Runtime Optimization
- [ ] **Route-level Lazy Loading**
  - **Inputs:** `frontend/src/routes` or router config.
  - **Outputs:** Code-splitting plan + updated imports.
- [ ] **Asset Optimization**
  - **Inputs:** `frontend/src/assets/**`
  - **Outputs:** Compressed assets + lazy loading for large images.
- [ ] **Tailwind Output Minimization**
  - **Inputs:** Tailwind config + global CSS.
  - **Outputs:** Reduced CSS output size; report before/after.
- [ ] **Dependency Audit**
  - **Inputs:** `frontend/package.json`
  - **Outputs:** List of unused deps + removal plan.

### 6.2 UX Performance Enhancements
- [ ] **Animation Budgeting**
  - **Inputs:** Framer Motion usage sites.
  - **Outputs:** Reduced motion configs + list of adjusted components.
- [ ] **Render Profiling**
  - **Inputs:** React profiler results.
  - **Outputs:** Hotspot list + memoization targets.
- [ ] **Skeletons + Prefetch**
  - **Inputs:** Data fetch points.
  - **Outputs:** Skeleton components + prefetch wiring.

### 6.3 Verification & Monitoring
- [ ] **Lighthouse Regression**
  - **Inputs:** Baseline reports from Phase 5.5.
  - **Outputs:** Delta report (scores, regressions).
- [ ] **Real-User Monitoring Hooks**
  - **Inputs:** Router + analytics integration points.
  - **Outputs:** Lightweight timing events for route + render.
- [ ] **Documentation Updates**
  - **Outputs:** Updated `docs/development/` notes and summary.

---

## Phase 7: Codebase Cleanup (Pending)

### 7.1 Dead File Audit
- [ ] **Inventory candidates**
  - **Inputs:** `rg` search results, unused imports, orphaned files.
  - **Commands:** `rg -n "<filename>|<symbol>" backend frontend functions`
  - **Outputs:** `docs/development/cleanup_candidates.md`

### 7.2 Safe Removal / Archive
- [ ] **Validate references** before removal.
- [ ] **Archive** uncertain files to `archive/legacy_folders/` instead of deleting.
- [ ] **Do not remove** anything referenced by `backend/app/workers/ats_score_worker.py` without a bridge.

### 7.3 Verification
- [ ] Build + tests after cleanup (frontend, backend, functions).
- [ ] Update docs policy index if file locations change.

---

## Supporting Queues

- **Frontend migration queue:** `docs/development/FRONTEND_MIGRATION_QUEUE.md`
- **Genkit migration queue:** `docs/development/GENKIT_MIGRATION_QUEUE.md`
- **CI coverage audit:** `docs/development/CI_COVERAGE_AUDIT.md`
