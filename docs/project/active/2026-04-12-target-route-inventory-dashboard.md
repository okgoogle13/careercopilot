# Target Route Inventory and Progress Dashboard

Date: 2026-04-12
Status: Working source for route ownership, naming, and low-burden progress tracking

## Purpose

This document turns the mixed state across:

- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `docs/design/01_CANON.md`

into one operational inventory for:

- final route ownership
- final naming structure
- final component and layer naming decisions
- low-burden progress reporting
- plugin-based task completion tracking

## Decision Rules

Use this order when docs disagree:

1. Runtime truth:
`frontend/src/App.tsx`
`frontend/src/config/route-registry.ts`
2. Naming truth:
`docs/design/01_CANON.md`
3. Migration/reference truth:
`docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`

Interpretation:

- If the route matrix describes an older standalone route but runtime now redirects it, treat it as `redirect_only`.
- If a screen pairing still uses old naming but runtime is consolidated, keep the runtime route and mark the pairing as a convergence item.
- Archetype names are internal semantics, not the primary public naming layer.

## Final Naming Decisions

### Route and product naming

- Use plain route language for product surfaces:
`/dashboard`, `/analysis`, `/documents`, `/apply`, `/generation`
- Keep redirect aliases explicit when they still exist:
`/docs [redirect]`, `/feed [redirect]`, `/tracker [redirect]`
- Keep support and internal surfaces clearly marked:
`support /asset-library`
`internal /style-guide`

### Component naming

- Public and implementation-facing components use plain UI or product names:
`LandingPage`, `ProfilePage`, `Documents`, `ApplyQuick`, `TabbedGenerationPanel`
- Route owners should live in `features/` unless the repo is in a documented convergence exception.
- Design reference surfaces can remain in `screens/`, but they are not the default ownership layer for production.

### Figma/page structure naming

Use this layer structure consistently:

- Page tab:
`/dashboard`
`/generation`
`/docs [redirect]`
`support /asset-library`
- Top-level frame:
`Route / Dashboard`
`Route / Generation`
`Route / Docs`
`Utility / Style Guide`
- Shared shell:
`PageBackground`
`PageCanvas`
`AppShell`
`Sidebar`
`MainContent`
`PageChromeHeader`
- Route content regions:
`DashboardContent`
`DocumentsContent`
`ProfileContent`
`OpportunitiesContent`
`GenerationContent`
`ApplyContent`

## Final Target Inventory

### Canonical product routes

| Route | Class | Final Status | Runtime owner | Design reference | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | public | canonical | `features/landing/LandingPage` | `screens/01_landing/HeroLanding` | Canonical landing route |
| `/auth` | public | canonical | `AuthPage -> screens/02_auth/AuthModal` | `screens/02_auth/AuthModal` | Canonical auth entrypoint |
| `/dashboard` | protected | canonical | `features/dashboard/Dashboard` | `screens/11_dashboard/DashboardOverview` | Canonical dashboard |
| `/profile` | protected | canonical | `features/profile/ProfilePage` | mixed; registry still points at `04_ingestion` | Canonical profile/account route |
| `/opportunities` | protected | canonical | currently `screens/06_opportunities/OpportunitiesDiscovery` | `screens/06_opportunities` | Runtime canonical, ownership still converging |
| `/applications` | protected | canonical | `features/applications/ApplicationTracker` | `screens/07_kanban/KanbanTracker` | Canonical application tracking route |
| `/analysis` | protected | canonical | `features/analysis/AnalysisPage` | `screens/05_analysis/AnalysisWorkbench` | Canonical analysis route |
| `/documents` | protected | canonical | `features/documents/Documents` | `screens/08_workbench/DocumentWorkbench` | Canonical documents workspace |
| `/apply` | protected | canonical | `features/applications/ApplyQuick` | `screens/09_finalization/ApplicationFinalization` | Canonical application execution route |
| `/generation` | protected | canonical | `features/documents/components/TabbedGenerationPanel` | `screens/12_generation/GenerationWorkbench` | Canonical generation workspace |
| `/settings` | protected | canonical | `features/settings/Settings` | `screens/10_settings/SettingsControl` | Canonical settings route |
| `/onboarding` | protected | canonical | `features/onboarding/OnboardingPage` | `screens/03_onboarding/OnboardFlow` | Canonical onboarding route |

### Redirect-only routes

| Route | Final Status | Redirect target | Why it stays |
| --- | --- | --- | --- |
| `/login` | redirect_only | `/auth?mode=login` | public mode alias |
| `/register` | redirect_only | `/auth?mode=register` | public mode alias |
| `/welcome` | redirect_only | `/onboarding` | onboarding alias |
| `/tracker` | redirect_only | `/applications` | old applications alias |
| `/lookout` | redirect_only | `/opportunities` | old route language |
| `/feed` | redirect_only | `/opportunities` | old jobs alias |
| `/dashboard-overview` | redirect_only | `/dashboard` | old dashboard alias |
| `/kanban` | redirect_only | `/applications` | old tracker alias |
| `/job-queue` | redirect_only | `/dashboard` | old queue alias in runtime |
| `/docs` | redirect_only | `/documents` | old docs alias |
| `/editor` | redirect_only | `/documents` | old editor alias |
| `/apply/quick` | redirect_only | `/apply` | old quick-apply route |
| `/ksc-generator` | redirect_only | `/generation` | old generation split route |
| `/cover-letter-generator` | redirect_only | `/generation` | old generation split route |
| `/studio` | redirect_only | `/generation` | old generation alias |
| `/identity` | redirect_only | `/profile` | old profile alias |
| `/dossier` | redirect_only | `/profile` | old profile alias |
| `/career/ingest` | redirect_only | `/ingestion` | retained alias; upstream of profile redirect |
| `/ingestion` | redirect_only | `/profile` | canonical ingestion capability folded into profile runtime |

### Support and internal routes

| Route | Class | Final Status | Runtime owner | Notes |
| --- | --- | --- | --- | --- |
| `/asset-library` | support | support_surface | `features/analysis/AssetLibrary` | Keep out of product route counts |
| `/design-sidekick` | internal | internal_reference | `features/design-sidekick/DesignSidekick` | Internal tool |
| `/style-guide` | internal | internal_reference | `features/style-guide/StyleGuide` | Internal design reference |
| `/animation-test` | internal | internal_reference | `components/debug/AnimationTest` | Internal debug route |
| `/test-tokens` | internal | internal_reference | `components/debug/TokenTest` | Internal debug route |
| `*` | fallback | canonical_support | `features/not-found/NotFound` | Keep as runtime fallback |

## Matrix Rows To Treat As Superseded

These matrix targets should not be used as standalone final product inventory unless you intentionally reopen them:

| Matrix route | Why superseded |
| --- | --- |
| `/apply/quick` as standalone target route | runtime has consolidated to `/apply` |
| `/ksc-generator` as canonical product route | runtime has consolidated to `/generation` |
| `/cover-letter-generator` as canonical product route | runtime has consolidated to `/generation` |
| `/job-queue` as canonical product route | runtime treats it as redirect |
| `/career/ingest` as canonical product route | runtime folds ingestion into `/profile` via redirect chain |
| `/tracker` as canonical product route | runtime uses `/applications` |

## Convergence Exceptions To Track

These are the few places where the final inventory is decided, but the repo still has stale ownership metadata.

| Area | Current mismatch | Final decision |
| --- | --- | --- |
| `screen-map` and route naming | `06_lookout` language remains in screen references | final product route name is `/opportunities` |
| generation screen mapping | `12_generation/mapping.json` still references `/ksc-generator, /cover-letter-generator` | final product route is `/generation` |
| profile screen mapping | `route-registry.ts` maps `/profile` to `screenId: '04_ingestion'` | final product route is `/profile`; mapping needs convergence |
| opportunities runtime owner | runtime mounts a `screens/` surface, not a `features/` owner | keep `/opportunities`, but converge ownership deliberately |

## Low-Burden Status Model

Use two separate fields so updates stay lightweight.

### 1. Surface status

This is what the route is in the final inventory.

- `canonical`
- `redirect_only`
- `support_surface`
- `internal_reference`
- `superseded_matrix_target`

### 2. Progress stage

This is how far the route family is through convergence.

- `named`
- `runtime_aligned`
- `design_aligned`
- `ownership_aligned`
- `verified`
- `blocked`

Definitions:

- `named`: route/page/frame naming is coherent
- `runtime_aligned`: App and registry agree on route intent
- `design_aligned`: Figma and screen references use the final route language
- `ownership_aligned`: final feature owner is clear and no longer split across `screens/` and `features/`
- `verified`: route behavior and ownership are stable enough to stop tracking as active convergence

## Low-Burden Dashboard

Use one row per route family or active convergence item, not one row per file.

### Dashboard table

| Family | Final route | Surface status | Progress | Owner | Next action | Blocker | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| landing | `/` | canonical | named | frontend | none | none | stable |
| auth | `/auth` | canonical | runtime_aligned | frontend | keep `/login` and `/register` redirect-only | none | stable enough |
| onboarding | `/onboarding` | canonical | runtime_aligned | frontend | confirm `/welcome` remains redirect-only | workflow validation | |
| dashboard | `/dashboard` | canonical | named | frontend | decide whether old dashboard aliases stay in Figma | none | stable runtime |
| opportunities | `/opportunities` | canonical | blocked | frontend | converge `06_lookout` naming and ownership | runtime owner still on `screens/` | highest-value cleanup target |
| applications | `/applications` | canonical | runtime_aligned | frontend | keep tracker aliases redirect-only | backend env noise | |
| analysis | `/analysis` | canonical | runtime_aligned | frontend | keep support split with `/asset-library` | none | |
| documents | `/documents` | canonical | named | frontend | collapse `/docs` and `/editor` references | none | strong cleanup target |
| apply | `/apply` | canonical | design_aligned | frontend | none | none | strongest current shell |
| generation | `/generation` | canonical | blocked | frontend | update screen pairing and legacy route language | mapping still references old split routes | strongest current shell |
| profile | `/profile` | canonical | blocked | frontend | fix screen ownership metadata | registry still points at ingestion screen | high-value cleanup target |
| settings | `/settings` | canonical | runtime_aligned | frontend | none | none | |

### Reporting cadence

Keep updates to three lines:

1. `Completed`
2. `In progress`
3. `Blocked / needs decision`

Example:

```md
Completed: Figma route naming normalized for canonical and redirect pages.
In progress: opportunities family ownership convergence.
Blocked / needs decision: keep redirect pages as standalone design refs or fold into canonical pages.
```

## Task Completion Tracking With Anthropic Productivity Plugin

Use Anthropic’s official `Productivity` plugin for the task layer, and keep this document as the inventory/dashboard layer.

Official references:

- Anthropic official marketplace install flow: `https://code.claude.com/docs/en/discover-plugins`
- Productivity plugin overview: `https://claude.com/plugins/productivity`

### Install and initialize

1. Open plugin browser:
`/plugin`
2. Or install directly from the official Anthropic marketplace:
`/plugin install productivity@claude-plugins-official`
3. Initialize the plugin in the repo:
`/start`

Expected result from the plugin:

- markdown task list
- memory/context setup
- visual dashboard support

### How to map this dashboard into plugin tasks

Create tasks at the route-family level, not file level.

Recommended task list:

- `Converge opportunities naming and ownership`
- `Converge generation route naming in screen mappings`
- `Converge profile route ownership metadata`
- `Collapse redirect-only Figma pages into reference strategy`
- `Repair legacy desktop shells for documents/opportunities/profile`

### Required task fields

For each plugin task, track:

- `task`
- `owner`
- `status`
- `route_family`
- `definition_of_done`
- `blocked_by`

Recommended statuses:

- `todo`
- `in_progress`
- `blocked`
- `done`

### Definition of done

Use this checklist for convergence tasks:

- runtime route is correct in `App.tsx`
- registry route intent is correct in `route-registry.ts`
- screen/design naming uses final route language
- Figma page/frame names are normalized
- no older alias is still being treated as canonical by mistake

### Update protocol

Use the plugin lightly:

- `/update`
for normal progress checks
- `/update --comprehensive`
for weekly review, stale-task cleanup, and missed work discovery

### Working rule

The plugin is the task system.
This document is the inventory and reporting schema.

Do not duplicate file-level checklists into both places.
Use plugin tasks for action, and update this document only when route ownership or final naming decisions change.
