---
title: Figma MCP Visual Sync Strategy
date: 2026-04-01
---

## Context
We want a custom MCP skill that mirrors the KR Solidarity design system inside the canonical Figma file. Rather than re-creating every page sequentially, the skill should learn from the most expressive pages (living style guide + a few complex workflows) and turn those learnings into a reusable rule set.

## Runtime Authority
Figma sync must mirror the live frontend runtime before it tries to reconcile historical docs or route-intent artifacts.

- Primary route authority: `frontend/src/App.tsx`
- Primary migrated shell: `frontend/src/layouts/MigratedRouteLayout.tsx`
- Support-only legacy shell: `ProtectedLayout` mounted in `App.tsx` for `/asset-library` and `/test-tokens`
- Current migrated navigation truth: `frontend/src/config/navigation.schema.ts`
- Route intent reference only: `frontend/src/config/route-registry.ts`

This matters because the repo is currently in a transition state:

- Runtime and nav expose `/applications`
- `route-registry.ts` still records `/tracker`
- Runtime redirects `/documents` to `/docs`
- Design docs and route registry still mostly describe `/documents`
- `DocsPage` is imported in `App.tsx` but not mounted as a live route

The sync process must preserve those discrepancies as explicit drift items instead of flattening them into a false single truth.

## Current Route Inventory To Mirror In Figma

### Public and Internal Surfaces
- `/` -> `frontend/src/features/landing/LandingPage.tsx`
- `/auth` -> Auth bridge inside `frontend/src/App.tsx`
- `/login` -> redirect to `/auth?mode=login`
- `/register` -> redirect to `/auth?mode=register`
- `/style-guide` -> `frontend/src/features/style-guide/StyleGuide.tsx`
- `/design-sidekick` -> `frontend/src/features/design-sidekick/DesignSidekick`
- `/animation-test` -> debug-only internal route

### Canonical Migrated Product Routes
- `/dashboard` -> `frontend/src/features/dashboard/Dashboard.tsx`
- `/profile` -> `frontend/src/features/profile/ProfilePage.tsx`
- `/opportunities` -> `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
- `/applications` -> `frontend/src/features/applications/ApplicationTracker.tsx`
- `/analysis` -> `frontend/src/features/analysis/AnalysisPage.tsx`
- `/apply` -> `frontend/src/features/applications/ApplyQuick.tsx`
- `/generation` -> `frontend/src/features/documents/components/TabbedGenerationPanel.tsx`
- `/settings` -> `frontend/src/features/settings/Settings.tsx`
- `/onboarding` -> `frontend/src/features/onboarding/OnboardingPage.tsx`

### Support-Only Protected Surfaces
- `/asset-library` -> `frontend/src/features/analysis/AssetLibrary`
- `/test-tokens` -> `frontend/src/components/debug/TokenTest`

### Legacy Redirect Families Still Present In Runtime
- `/tracker` and `/kanban` -> `/applications`
- `/lookout` and `/feed` -> `/opportunities`
- `/career/ingest` -> `/ingestion` -> `/profile`
- `/identity` and `/dossier` -> `/profile`
- `/apply/quick` -> `/apply`
- `/ksc-generator` and `/cover-letter-generator` -> `/generation`
- `/job-queue` -> `/dashboard`
- `/welcome` -> `/onboarding`
- `/documents` and `/editor` -> `/docs` (known unresolved drift)

## Figma Modeling Rules

- Do not model the app as `createBrowserRouter`; the live app still uses `BrowserRouter` with `<Routes>` in `App.tsx`.
- Do not use `./components/*` as the main route-owner namespace for product pages. The current runtime owners are primarily in `features/*`, with `screens/*` used in specific migrated cases like `/opportunities`.
- Do not collapse `/apply`, `/generation`, or `/settings` into `/profile`. The runtime still mounts those as separate product surfaces.
- Treat `/applications` as the current user-facing route label and page path in Figma, but preserve a drift note that canonical docs and `route-registry.ts` still reference `/tracker`.
- Treat `/documents` vs `/docs` as an active architecture issue. Figma should not invent a third route. If a docs/workbench page is drawn, label it with a note that runtime redirect behavior is unresolved.

## Objective
Deliver a spec for a multi-phase sync flow that:

- establishes token/variable foundations by mining the living style guide
- maps component primitives and variants before tackling entire pages
- applies the learned patterns holistically across the remaining file
- finishes with a page-by-page verification sweep and exception register

## Phases

### 1. Discovery Debug
- Identify canonical token sources in code (tokens.json, CSS vars, TypeScript theme objects).
- Inspect the Figma file for existing naming conventions, components, mode scopes, and the page roster.
- Build a route ledger first: route, shell, owner file, live status, redirect target, and drift notes.
- Choose 3–5 “golden” pages (style guide, dashboard, applications, analysis, profile) that expose broad visual vocabulary without hiding route drift.
- Document the naming/scope rules gleaned from those pages to feed the rule engine.

### 2. Rule Extraction
- Translate tokens into Figma variable names, scopes, code syntax, and semantic alias hierarchy.
- Capture typography, spacing, shapes, and effect recipes that reappear across the chosen page samples.
- Catalog each reusable component primitive, its variant axes, and binding expectations (Strike buttons, March selects, etc.).
- Treat living style guide sections as system documentation, not literal screen clones.
- Extract shell rules separately from page rules:
  - `MigratedRouteLayout` for core product routes
  - legacy protected shell only for support/debug surfaces

### 3. System Build (Foundations → Components → Sections)
- Build or reconcile primitives first (variables, styles, effects, color modes) using the figma-generate-library rules.
- Create components/variants one at a time, validating structure/screenshots after each.
- Assemble layout patterns (headers, cards, tables, forms) using those components, binding to the tokens.
- Record any bespoke visuals as exceptions instead of forcing them into the system.
- Keep route-specific sections distinct where the runtime keeps them distinct:
  - Applications board
  - Analysis workspace
  - Generation workspace
  - Settings / profile trust surfaces

### 4. Holistic Application
- Apply the same rule set across the rest of the file by targeting recurrent section types rather than page order.
- Keep an exception register for page-specific art or layout breakpoints.
- Maintain a delta tracker so future syncs can diff token/component changes and revalidate selectively.
- Track route drift separately from visual drift so unresolved architecture issues do not get misclassified as Figma defects.

### 5. Validation Sweep
- Perform a per-page audit once the system is in place (metadata, screenshots, token bindings).
- Flag mismatches (missing components, drifted spacing, color mismatches) and resolve them using the recorded rules.
- Capture final screenshots + state register for the completed run and pack into artifact logs for user checkpoints.
- Validation output must include:
  - live route path
  - route owner file
  - shell type
  - whether the page is mounted, redirected, support-only, or drifted
  - whether the Figma page reflects runtime truth or an intended future-state abstraction

## Next Steps
- Build the sync skill to follow these phases in sequential checkpoints (discovery -> foundations -> components -> sections -> validation).
- Surface decisions about the system (token map, exception register) during the user approval gates described in the Figma skill guides.
- Keep all generated state ledgers and IDs to enable idempotent resumes in subsequent runs.
- Create a `route-sync-ledger` artifact as part of discovery so future sync passes can tell the difference between:
  - runtime truth
  - route-intent docs
  - nav truth
  - unresolved migration debt
