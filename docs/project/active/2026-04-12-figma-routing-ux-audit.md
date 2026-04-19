# Figma Routing and UX Audit

Date: 2026-04-12
File: `https://www.figma.com/design/eoNJnwvDZ64OUgSthE20WW/...`
Scope: routing alignment, layer naming cleanup, quick-win audit, UX/copy/styling review

## Quick Wins Completed

- Renamed all Figma page tabs to reflect live runtime intent from `frontend/src/App.tsx` and `frontend/src/config/route-registry.ts`.
- Renamed canonical route pages to explicit route labels such as `/dashboard`, `/profile`, `/documents`, `/apply`, and `/generation`.
- Renamed legacy alias pages to explicit redirect labels such as `/feed [redirect]`, `/docs [redirect]`, `/ksc-generator [redirect]`, and `/welcome [redirect]`.
- Renamed internal or support pages to non-product labels such as `support /asset-library` and `internal /style-guide`.
- Replaced anonymous top-level frames like `KR Solidarity CAREERCOPILOT`, `KSCGenerator`, and `ApplyQuick` with explicit frame names such as `Route / Opportunities`, `Route / Generation`, and `Route / Apply`.
- Normalized obvious legacy shell labels on older pages from `Body` / `Layout` / `Main Content` to `PageCanvas` / `AppShell` / `MainContent` where the structure was unambiguous.
- Normalized a subset of route-surface frames from names like `Dashboard`, `Documents`, `Analysis`, `ProfilePage`, and `Opportunities` to `DashboardContent`, `DocumentsContent`, `AnalysisContent`, `ProfileContent`, and `OpportunitiesContent`.

## Canonical Routing Used For This Pass

This cleanup followed runtime truth, not older migration docs, where they conflicted.

- Canonical product routes used in Figma labels:
`/`, `/auth`, `/onboarding`, `/dashboard`, `/profile`, `/opportunities`, `/applications`, `/analysis`, `/documents`, `/apply`, `/generation`, `/settings`
- Redirect or alias references kept but explicitly marked:
`/login`, `/register`, `/welcome`, `/dashboard-overview`, `/job-queue`, `/feed`, `/tracker`, `/kanban`, `/identity`, `/dossier`, `/docs`, `/editor`, `/ksc-generator`, `/studio`
- Support or internal surfaces labeled separately:
`/asset-library`, `/test-tokens`, `/style-guide`, `/design-sidekick`, `/animation-test`, `/dev-map`

## Findings

### 1. The file mixes two very different page systems

- Newer pages such as `/generation` and `/apply` already use a cleaner structure with `PageBackground`, `AppShell`, `Sidebar`, `MainContent`, and clearly named content regions.
- Older pages such as `/opportunities`, `/profile`, `/analysis`, `/documents`, `/feed`, `/docs`, `/editor`, `/dashboard-overview`, and `/job-queue` were built from a raw anonymous shell and had route meaning encoded only in page names or inner content.
- The rename pass improved legibility, but the older pages are still structurally inconsistent below the first few levels.

### 2. Several older route pages look visually broken at their current frame size

- `/opportunities` renders as a narrow, collapsed strip with large empty black space.
- `/profile` renders similarly, with a compressed content column and large unused canvas.
- These look less like intentional mobile references and more like partially broken desktop surfaces.
- The file currently does not label these pages as mobile variants, reference artifacts, or broken legacy pages, which makes them easy to misread as current production intent.

### 3. Canonical route naming is clearer now, but repo-side governance is still inconsistent

- Runtime canonical navigation is `/opportunities`, but older repo artifacts still refer to `/lookout` and `06_lookout`.
- Runtime canonical documents route is `/documents`, while the Figma file also preserves `/docs [redirect]` and `/editor [redirect]`.
- Runtime canonical generation route is `/generation`, but the existing screen pairing still references `/ksc-generator, /cover-letter-generator`.
- Runtime `/profile` is canonical while `/ingestion` redirects to `/profile`, but `route-registry.ts` still points `/profile` at `screenId: '04_ingestion'`.

### 4. The strongest current reference pages are `/generation` and `/apply`

- These pages already use the newer shell vocabulary.
- Their content regions are named well enough to serve as the pattern for future page migrations.
- They are the best candidates for a reusable desktop route template in Figma.

## UX Copy Issues

- Landing hero copy currently leads with `GENERIC CAREERS DON'T FIT YOU.` which is emotionally sharp but still generic. It states the problem more than the product promise.
- `/apply` uses `No neutral canvas.` as a prominent sub-line. It fits the manifesto voice, but the user task at this step is job targeting and draft generation. The line may need a more operational companion sentence.
- `/generation` uses `Generation Workbench` and `Live Draft / Output`, which are clearer than some other pages, but the long preview strings already overflow visually at the current layout width.
- `/opportunities` uses labels such as `CLASSIFIED`, `VERIFIED`, and `DISPATCH_SW-0427`. These create atmosphere, but some of them read like internal lore rather than user-facing job-discovery language.
- Sidebar language is still mixed across the file:
`Jobs` vs `Opportunities`
`Generator` vs `Generation`
`Scoring` vs `Analysis`

## Styling And Structure Decisions Needed

- Decide whether the narrow legacy route pages are intentional mobile references or broken desktop artifacts.
- Decide whether redirect aliases should remain as full-page references, or be collapsed into one canonical page plus state annotations.
- Decide whether support pages like `/asset-library` should live in the same main design file as product routes.
- Decide whether the sidebar IA should mirror runtime route names exactly, or whether some labels intentionally stay more editorial than the route paths.
- Decide whether landing should keep the current manifesto-first tone, or shift slightly toward a clearer product-value headline.

## Simplification Opportunities

- Merge `/dashboard-overview [redirect]` and `/job-queue [redirect]` into annotations or variants attached to `/dashboard` rather than standalone full pages.
- Merge `/feed [redirect]` into `/opportunities`.
- Merge `/tracker [redirect]` and `/kanban [redirect]` into `/applications`.
- Merge `/identity [redirect]` and `/dossier [redirect]` into `/profile`.
- Merge `/docs [redirect]` and `/editor [redirect]` into `/documents`.
- Merge `/ksc-generator [redirect]` and `/studio [redirect]` into `/generation`.
- Use `/generation` and `/apply` as the reference shell for rebuilding older pages instead of continuing to patch the anonymous legacy shells.

## Repo Mismatches To Resolve Before Deeper Figma Work

- `frontend/src/screens/12_generation/mapping.json` still maps generation to `/ksc-generator, /cover-letter-generator` instead of the live canonical `/generation`.
- `docs/design/screen-map.json` and screen naming still carry older `06_lookout` language, while runtime uses `/opportunities`.
- `frontend/src/config/route-registry.ts` currently maps `/profile` to `screenId: '04_ingestion'`, which should be treated as unresolved convergence, not settled truth.

## Recommended Next Pass

- Keep the current naming cleanup.
- Do not visually redesign the older broken pages until the redirect-archive strategy is agreed.
- Pick one route family for structural repair first:
`/opportunities`
or
`/documents`
or
`/profile`
- Use the `/generation` and `/apply` shell pattern as the structural baseline for that repair.
