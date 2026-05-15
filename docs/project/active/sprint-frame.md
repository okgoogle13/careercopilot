# Sprint Frame — CareerCopilot Final Sprint
**Phase**: P09 Sprint Coordination
**Generated**: 2026-04-01T02:12:00.000Z
**Input**: `figma-sync-order.json` (15 pages, 6 batches)

---

## Milestones

### M1 — Shared Layout Sync (Batch 1)
**Readiness gate**: `primitive-sync-targets.json` written AND `tsc --noEmit` passes
**Items**: MigratedRouteLayout, Layout, Navigation/Sidebar
**Blocker**: Figma node IDs missing for all shared layout components — need Figma MCP extraction
**Parallelisable**: No — must complete before any page-level work

### M2 — Public Routes Sync (Batch 2)
**Readiness gate**: M1 complete, Figma node IDs resolved for `/` and `/auth`
**Items**: Landing (`/`), Auth (`/auth`)
**Blocker**: None — screenshots captured, components confirmed CANONICAL
**Parallelisable**: Yes — Landing and Auth can run in parallel

### M3 — Core Protected Routes Sync (Batch 3)
**Readiness gate**: M2 complete, shared chrome renders correctly
**Items**: Dashboard, Profile, Analysis, Documents, Applications, Lookout, Ingestion
**Blocked routes**:
- `/auth` — Figma node ID missing
- `/profile` — Figma node ID missing
- `/docs` — Figma node ID missing
**Resolved routes (Figma node IDs found)**:
- `/dashboard` (1:166)
- `/analysis` (1:1720)
- `/applications` (1:1323)
- `/lookout` (1:579)
- `/ingestion` (1:1683)
**Parallelisable**: All resolved Batch 3 routes can now proceed to sync. Drinking from the manifest (P13) is unblocked for these.

### M4 — Secondary Protected Routes Sync (Batch 4)
**Readiness gate**: M3 complete
**Items**: Settings, Onboarding, Apply, Generation
**Blocked routes**: Onboarding, Apply, Generation are NEEDS_MIGRATION status — require App.tsx import check before Figma sync.
**Resolved route (Figma node ID found)**:
- `/settings` (1:2125)
**Parallelisable**: Settings sync is unblocked. Others parallelisable once migration source is verified.

### M5 — Dev/Internal Surfaces (Batch 5)
**Readiness gate**: M4 complete
**Items**: Style Guide, Design Sidekick, Asset Library
**Blocker**: None — low priority, P3
**Parallelisable**: All 3 parallelisable

### M6 — Verification & Closeout (P15)
**Readiness gate**: All batches complete, `tsc --noEmit` passes, `yarn test --passWithNoTests` passes
**Items**: migration-audit per modified route, token compliance, vision-scorer-mcp global score ≥ 90
**Parallelisable**: Audits parallelisable per route

### M7 — Deployment Prep (P16)
**Readiness gate**: M6 complete, compliance-report.md written
**Items**: CI/CD config review, firebase.json check, pr-summary.md
**Parallelisable**: CI/CD review and pr-summary can run in parallel

---

## Blocked Routes Summary

| Route | Blocker | Resolve At |
|-------|---------|------------|
| `/apply` | NEEDS_MIGRATION — App.tsx may still reference stale source | P11 |
| `/generation` | NEEDS_MIGRATION — TabbedGenerationPanel may need extraction | P11 |
| `/onboarding` | NEEDS_MIGRATION — OnboardingPage source unverified | P11 |
| `/auth` | Missing Figma node ID | P13 |
| Batch 1 (Shared) | Missing Figma node IDs | P13 |
| Core Pages | **RESOLVED** — Node IDs for Dashboard, Analysis, Applications, Lookout, Settings, Ingestion found | DONE |

---

## Evidence Requirements Per Batch

| Batch | Required Evidence |
|-------|------------------|
| Batch 1 (Shared) | primitive-sync-targets.json, tsc passes |
| Batch 2 (Public) | Figma node IDs extracted, screenshot match, vision-scorer ≥ 90 |
| Batch 3 (Core) | Figma node IDs, registry entries resolved, tsc passes |
| Batch 4 (Secondary) | NEEDS_MIGRATION resolved, Figma node IDs, tsc passes |
| Batch 5 (Dev) | Optional — style-guide compliance only |
| M6 Closeout | compliance-report.md, orphans-final.json, global score ≥ 90 |
| M7 Deploy | pr-summary.md, firebase.json verified, CI/CD reviewed |
