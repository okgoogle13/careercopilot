# Frontend Cleanup Closeout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the frontend cleanup so runtime routing, feature ownership, shell/layout assignment, legacy/reference surfaces, shared UI boundaries, and migration PM artifacts all agree with the real app.

**Architecture:** Use the `frontend-cleanup-manager` authority order: runtime truth first (`frontend/src/App.tsx`), then design truth (`frontend/src/screens/**`), then capability truth (backend/API contracts), then derived PM artifacts. `frontend/src/App.tsx` remains the only runtime router, `frontend/src/features/**` remains the only canonical product-route ownership layer, `frontend/src/pages/**` becomes compatibility-only or is removed, and reference/prototype surfaces are quarantined out of the runtime import graph.

**Tech Stack:** React 18, TypeScript, React Router, Jest, Storybook, ts-morph helper scripts, TanStack Query, FastAPI-backed API services, migration governance scripts under `tools/ci/` and `tools/scripts/`.

---

## Sprint Frame

- **Sprint name:** Frontend Cleanup Closeout
- **Sprint window:** 2026-03-18 to 2026-03-27
- **Primary owner:** `frontend-cleanup-manager`
- **Review owner:** `code-reviewer`
- **PM owner:** `project-manager`
- **Tracking owner:** `sprint-coordinator`
- **Objective:** Convert the frontend from “route-complete but structurally dirty” to “runtime-clean, ownership-clean, and release-auditable.”

## Executive Snapshot

- **Current truth:** `frontend/src/App.tsx` is now the sole router, `/analysis` and `/apply/quick` have already moved into `features/`, and the runtime scan now sees `26 reachable paths` (`19` canonical routes + `7` legacy redirects).
- **Current highest-risk gaps:** three canonical routes still live on `ProtectedLayout`, `frontend/src/pages/` still contains non-runtime remnants, reference/prototype surfaces are mixed into live-looking namespaces, and generic/shared UI primitives remain split between `frontend/src/components/ui/**` and `frontend/packages/ui/**`.
- **Single highest-priority decision:** quarantine-first cleanup remains mandatory. Delete only after router proof + reference proof + verification.

## Success Criteria

- [ ] No live product route in `frontend/src/App.tsx` imports from `frontend/src/pages/**`.
- [ ] `frontend/src/App.tsx` and `frontend/src/config/route-registry.ts` agree on every reachable path and every canonical route layout.
- [ ] `frontend/src/pages/**` is either removed or reduced to explicit compatibility wrappers with expiry notes.
- [ ] `frontend/src/components/phase3-batch*` and page-shell/reference surfaces are quarantined from runtime imports.
- [ ] Generic primitives have one owner each; app-specific KR wrappers remain local and explicit.
- [ ] All touched PM/control artifacts reflect runtime truth, not optimistic completion language.
- [ ] Verification passes for route integrity, screen pairs, type-check, and targeted tests.

## Readiness Scoring

Start each daily checkpoint at `100`.

- Subtract `20` for any live route still mounted from `pages/`.
- Subtract `15` for any canonical route still on the wrong layout.
- Subtract `15` for any unresolved API convergence blocker in active user-facing flows.
- Subtract `10` for each runtime import from reference/prototype folders.
- Subtract `10` for each PM artifact that still points at retired runtime owners.
- Subtract `10` if type-check or route-integrity is failing.
- Subtract `5` if targeted frontend tests are hanging or unverified.

**Sprint health bands**
- `90-100`: green
- `70-89`: yellow
- `<70`: red

## Milestones

| Milestone | Goal | Target date | Dependencies | Exit criteria |
|---|---|---:|---|---|
| M1 | Runtime authority locked | 2026-03-19 | none | Router, registry, manifests, and canonical route owners aligned |
| M2 | Shell/layout cleanup finished | 2026-03-21 | M1 | `/welcome`, `/documents`, `/asset-library` explicitly resolved and shell ownership documented |
| M3 | Legacy/reference quarantine complete | 2026-03-24 | M1 | `pages/`, phase batches, and shell references either quarantined or retired |
| M4 | Shared UI and API convergence stabilized | 2026-03-25 | M1, M2 | duplicate primitives resolved and active API callers use canonical clients |
| M5 | Verification + PM closeout pack | 2026-03-27 | M1-M4 | checks green, PM artifacts synced, blocker register refreshed |

## Dependency Map

- `M1` unblocks all other work.
- `M2` and `M3` can run in parallel after `M1`.
- `M4` depends on runtime ownership from `M1` and shell decisions from `M2`.
- `M5` depends on all preceding milestones and must not be advanced on narrative-only progress.

## File Structure Lock

### Runtime authority
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/config/route-registry.ts`
- Modify: `docs/manifests/routes.json`
- Modify: `docs/manifests/orphans.json`
- Modify: `tools/scripts/scan-routes.ts`
- Modify: `tools/ci/check-route-integrity.ts`

### Route owners and shell/layouts
- Modify: `frontend/src/layouts/MigratedRouteLayout.tsx`
- Modify: `frontend/src/layouts/Layout.tsx`
- Modify/create under: `frontend/src/features/analysis/**`
- Modify/create under: `frontend/src/features/applications/**`
- Modify/create under: `frontend/src/features/documents/**`
- Modify/create under: `frontend/src/features/onboarding/**`

### Legacy/reference cleanup
- Modify/delete under: `frontend/src/pages/**`
- Modify/delete under: `frontend/src/components/phase3-batch2/**`
- Modify/delete under: `frontend/src/components/phase3-batch3/**`
- Modify/delete under: `frontend/src/components/*Shell/**`
- Modify/delete under: `frontend/src/features/design-sidekick/**`
- Modify/delete under: `frontend/src/features/style-guide/**`
- Modify/delete under: `frontend/src/features/sandbox/**`
- Modify/delete under: `frontend/src/features/gallery/**`
- Modify/delete under: `frontend/src/features/editor/**`

### Shared UI and API boundaries
- Modify: `frontend/src/components/ui/**`
- Modify: `frontend/packages/ui/**`
- Modify: `frontend/src/api/**`
- Modify: `frontend/src/hooks/**`
- Modify: `frontend/src/config/api.ts`

### PM/control artifacts
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/claude-handoff.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`

## Daily Status Artifact Template

Use this at the end of each working day:

```md
### Daily Status - YYYY-MM-DD
- Sprint health: <score>/100
- Milestone in progress: <M1-M5>
- Completed today:
  - ...
- Evidence:
  - command/result
- Active blockers:
  - severity / owner / next checkpoint
- Next 3 tasks:
  - ...
```

## Chunk 1: Runtime Authority Lock

### Task 1: Reconfirm router, registry, and manifest truth

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/config/route-registry.ts`
- Modify: `tools/scripts/scan-routes.ts`
- Modify: `tools/ci/check-route-integrity.ts`
- Modify: `docs/manifests/routes.json`

- [ ] Read `frontend/src/App.tsx` from top to bottom and list every reachable path.
- [ ] Read `frontend/src/config/route-registry.ts` and confirm every reachable path has an entry.
- [ ] Run `node --import tsx tools/scripts/scan-routes.ts`.
- [ ] Run `node --import tsx tools/ci/check-route-integrity.ts`.
- [ ] If the runtime scan and registry disagree, fix `route-registry.ts` first and rerun both commands.
- [ ] Commit only the runtime-authority alignment changes.

### Task 2: Lock canonical vs redirect semantics

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/config/route-registry.ts`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`

- [ ] Mark all legacy redirects explicitly in comments or metadata as compatibility paths, not canonical routes.
- [ ] Ensure PM/control language distinguishes `canonical routes` from `reachable paths`.
- [ ] Re-run `node --import tsx tools/scripts/scan-routes.ts`.
- [ ] Re-run `node --import tsx tools/ci/check-route-integrity.ts`.
- [ ] Commit the canonical-vs-redirect language cleanup.

## Chunk 2: Shell and Layout Cleanup

### Task 3: Resolve the three ProtectedLayout holdouts

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/layouts/MigratedRouteLayout.tsx`
- Modify: `frontend/src/layouts/Layout.tsx`
- Modify: `frontend/src/features/documents/Documents.tsx`
- Modify: `frontend/src/features/analysis/AssetLibrary.tsx`
- Modify: `frontend/src/features/onboarding/WelcomeScreen.tsx`

- [ ] For `/welcome`, decide: migrate, retain as legacy shell, or retire. Record the reason in code comments and PM artifacts.
- [ ] For `/documents`, decide: migrate now or keep blocked behind explicit parity criteria. Do not leave it as an unexamined holdout.
- [ ] For `/asset-library`, preserve support-only ownership and confirm it does not silently carry product-shell logic.
- [ ] If any holdout is promoted, write the failing route-level test first, then implement the shell move, then rerun the test.
- [ ] Run `cd frontend && yarn type-check`.
- [ ] Run `node --import tsx tools/ci/check-screen-pairs.ts`.
- [ ] Commit one route family at a time; do not batch all three unless the changes are inseparable.

### Task 4: Shared shell adoption cleanup

**Files:**
- Modify: `frontend/src/layouts/MigratedRouteLayout.tsx`
- Modify: `frontend/src/components/ui/Footer.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] Write a failing test or story expectation for authoritative shell chrome if none exists.
- [ ] Wire canonical `Footer` only into the authoritative shell, not into legacy/reference shells.
- [ ] Replace the deferred hardcoded auth-loading color in `frontend/src/App.tsx` with semantic tokens.
- [ ] Run `cd frontend && yarn type-check`.
- [ ] Commit shell cleanup separately from route-owner work.

## Chunk 3: Page, Reference, and Prototype Quarantine

### Task 5: Empty or quarantine `frontend/src/pages/**`

**Files:**
- Modify/delete: `frontend/src/pages/Dashboard.tsx`
- Modify/delete: `frontend/src/pages/IngestionPage.tsx`
- Modify/delete: `frontend/src/pages/ResumeAuditPage.tsx`
- Modify/delete: `frontend/src/pages/__tests__/IngestionPage.test.tsx`
- Modify/delete: `frontend/src/pages/__tests__/ResumeAuditPage.test.tsx`

- [ ] Run `rg -n "src/pages/" frontend/src docs -S` to find all remaining references.
- [ ] Use existing ts-morph helpers before deleting any page file with ambiguous references.
- [ ] For `Dashboard.tsx`, remove it if it is only a dead re-export. If not, convert it to an explicit compatibility wrapper with an expiry comment.
- [ ] For `IngestionPage.tsx`, either move the tests to `frontend/src/features/ingestion/__tests__/` or retire them if they only validate dead behavior.
- [ ] For `ResumeAuditPage.tsx`, either rehome it under `features/analysis/` as an intentional support surface or quarantine/remove it.
- [ ] Run `node --import tsx tools/scripts/detect-orphans.ts`.
- [ ] Commit only after `pages/` state is intentionally reduced and documented.

### Task 6: Quarantine phase batches and page-shell references

**Files:**
- Modify/delete under: `frontend/src/components/phase3-batch2/**`
- Modify/delete under: `frontend/src/components/phase3-batch3/**`
- Modify/delete under: `frontend/src/components/*Shell/**`
- Modify: `frontend/src/screens/*/mapping.json`

- [ ] Inventory all runtime imports that still point into `phase3-batch*` or `*Shell` folders.
- [ ] Classify each surface as `reference-only`, `keep as internal`, `quarantine`, or `delete`.
- [ ] Move reference-only surfaces into an explicit internal/reference namespace if they must remain.
- [ ] Update `frontend/src/screens/*/mapping.json` to the new reference paths where needed.
- [ ] Run `rg -n "phase3-batch|PageShell|Shell/" frontend/src -S` and confirm no runtime route owner imports them.
- [ ] Commit the quarantine move before attempting deletion.

### Task 7: Quarantine internal/prototype feature areas

**Files:**
- Modify/delete under: `frontend/src/features/design-sidekick/**`
- Modify/delete under: `frontend/src/features/style-guide/**`
- Modify/delete under: `frontend/src/features/sandbox/**`
- Modify/delete under: `frontend/src/features/gallery/**`
- Modify/delete under: `frontend/src/features/editor/**`
- Modify/delete under: `frontend/src/features/KrDark/**`

- [ ] Confirm none of these folders are live route owners in `frontend/src/App.tsx`.
- [ ] Mark surviving folders as internal/reference-only in route metadata or docs.
- [ ] Remove any dead exports from barrel files.
- [ ] Run `node --import tsx tools/scripts/detect-orphans.ts`.
- [ ] Commit one folder family at a time.

## Chunk 4: Shared UI Boundary and Naming Cleanup

### Task 8: Resolve duplicate primitive ownership

**Files:**
- Modify: `frontend/src/components/ui/**`
- Modify: `frontend/packages/ui/**`
- Modify imports across: `frontend/src/features/**`

- [ ] Inventory overlapping primitives: `button`, `table`, `metric-card`, `use-mobile`, `icon-badge`, and any similar duplicate wrappers.
- [ ] Decide one canonical owner for each: generic reusable primitive in `frontend/packages/ui/**`, app-specific KR wrapper in `frontend/src/components/ui/**`.
- [ ] Write or move tests before deleting any losing duplicate.
- [ ] Update imports in touched features to the canonical owner.
- [ ] Run `cd frontend && yarn type-check`.
- [ ] Commit one primitive family at a time.

### Task 9: Naming convention normalization

**Files:**
- Modify: touched files under `frontend/src/features/**`
- Modify: touched files under `frontend/src/components/ui/**`
- Modify: touched stories and tests

- [ ] Enforce route-owner naming: `frontend/src/features/<family>/<RouteName>.tsx`.
- [ ] Enforce feature test placement: `frontend/src/features/<family>/__tests__/`.
- [ ] Remove stale “Page” naming where the file is no longer a route owner.
- [ ] Keep deprecated KR archetype names out of newly touched code.
- [ ] Commit naming-only changes separately from behavioral changes.

## Chunk 5: API Convergence and Contract Cleanup

### Task 10: Audit and converge active frontend callers

**Files:**
- Modify: `frontend/src/api/**`
- Modify: `frontend/src/hooks/**`
- Modify: `frontend/src/features/**`
- Modify: `frontend/src/config/api.ts`

- [ ] Group active frontend callers by workflow: ingestion, applications, analysis, documents.
- [ ] Confirm each workflow has one canonical client path.
- [ ] Remove direct `fetch` usage from route owners where a shared API client already exists.
- [ ] Keep specialized endpoints only where the workflow is truly distinct.
- [ ] Run targeted tests or type-checks after each workflow batch.
- [ ] Commit one workflow at a time.

### Task 11: Resume-audit and workflow follow-through

**Files:**
- Modify: `frontend/src/features/analysis/components/ResumeAuditEntryPoint.tsx`
- Modify: `frontend/src/features/applications/ApplyQuick.tsx`
- Modify: `frontend/src/services/resumeAuditService.ts`
- Modify: `frontend/src/api/workflowService.ts` or equivalent workflow client files

- [ ] Verify that canonical analysis and apply-quick surfaces use the current backend contract and no dead interim types remain.
- [ ] Add or tighten tests around persisted resume-audit history and workflow result handling.
- [ ] If tests are hanging, isolate the cause and record it as a blocker with an owner instead of silently accepting it.
- [ ] Commit after the contract-follow-through slice is green or explicitly blocked.

## Chunk 6: Verification, PM Reconciliation, and Release Gate

### Task 12: Full verification pass

**Files:**
- Modify only if fallout appears in touched code or docs

- [ ] Run `node --import tsx tools/scripts/scan-routes.ts`.
- [ ] Run `node --import tsx tools/scripts/detect-orphans.ts`.
- [ ] Run `node --import tsx tools/ci/check-route-integrity.ts`.
- [ ] Run `node --import tsx tools/ci/check-screen-pairs.ts`.
- [ ] Run `node frontend/scripts/validate-governance-artifacts.mjs`.
- [ ] Run `cd frontend && yarn type-check`.
- [ ] Run targeted Jest slices for every route family touched in this sprint.
- [ ] Record any failing or hanging test command verbatim in the daily status artifact.

### Task 13: PM and handoff closeout

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/claude-handoff.md`

- [ ] Update route counts, shell counts, and owner paths only after verification succeeds.
- [ ] Remove “nearly complete” or “resolved” language if evidence does not support it.
- [ ] Refresh the blocker register with severity, owner, impact radius, mitigation, and next checkpoint.
- [ ] Publish a final sprint snapshot with readiness score and milestone state.
- [ ] Commit PM/control updates separately from runtime code.

## Review Loop

After each chunk:

- [ ] Dispatch a reviewer using `requesting-code-review`.
- [ ] If issues are found, fix the chunk and rerun the reviewer.
- [ ] Do not advance the milestone until the chunk is approved or the blocker is explicitly recorded.

## Release Cadence Checkpoints

- **Checkpoint 1:** End of M1 — runtime authority locked
- **Checkpoint 2:** End of M2/M3 — shell and quarantine decisions complete
- **Checkpoint 3:** End of M4 — shared UI and API convergence stable
- **Checkpoint 4:** End of M5 — verification and PM closeout pack ready

## Blocker Register Seed

| Blocker | Severity | Owner | Impact | Re-evaluate at |
|---|---|---|---|---|
| `/tracker` live Firebase/Firestore verification still externalized | Medium | user + backend owner | prevents full route closeout | Checkpoint 4 |
| Targeted Jest slices may hang without clear signal | Medium | frontend cleanup owner | slows verification confidence | Checkpoint 2 |
| Legacy/reference folders may still contain hidden imports via barrels | High | frontend cleanup owner | blocks safe deletion | Checkpoint 2 |

## Final Deliverables

- Clean runtime router and route registry
- Resolved shell/layout assignment
- Quarantined or retired page/reference/prototype debt
- Shared UI ownership map with duplicates removed or deferred explicitly
- Updated route/orphan manifests
- Refreshed PM/control docs and handoff pack
