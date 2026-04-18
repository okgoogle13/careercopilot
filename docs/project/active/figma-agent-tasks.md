# Figma ↔ Code Sync — Repaired Task List
**Updated**: 2026-04-17
**Active Figma File Key**: `eoNJnwvDZ64OUgSthE20WW`
**Rescue / historical donor file key**: `YPDj0edchIDXykYChSmCUd`

This task list repairs the broken April 1 sync contract.

Use this file together with:
- `docs/project/active/figma-sync-order.json`
- `frontend/src/App.tsx`
- `frontend/src/config/route-registry.ts`
- `docs/project/active/2026-04-12-target-route-inventory-dashboard.md`

## Contract Repairs Made

- The active sync target is now the newer Figma design file: `eoNJnwvDZ64OUgSthE20WW`.
- The older `YPDj0edchIDXykYChSmCUd` file is rescue/history only.
- Canonical product routes are now separated from redirect-history pages.
- Support and internal surfaces are now tracked separately from product route pages.
- `MISSING` now means `frame exists or is expected in the active file, but the node ID is not yet recorded`.
- Redirect-history pages now use `NOT_REQUIRED` and must not block code sync.

## Lane A — Figma Tasks

These tasks happen in Figma and unblock accurate sync from the active `eoNJnwvDZ64OUgSthE20WW` file.

### A-1 · DONE — Record stable node IDs for shared shell anchors

Shell anchors confirmed 2026-04-18 via Figma MCP. Reference page: `/generation` (page `19:3`).

| Surface | Node ID | Notes |
| --- | --- | --- |
| `AppShell` | `216:3` | Canonical shell container (Sidebar + MainContent) |
| `Sidebar` | `216:4` | Child of AppShell |
| `SidebarNavigation` | `216:22` | Child of Sidebar |
| `MainContent` | `216:123` | Child of AppShell, sibling of Sidebar |
| `PageChromeHeader` | `216:124` | Child of MainContent |
| `PageCanvas` (legacy) | `1:5117` | Older wrapper used in analysis/documents/applications — do not propagate |

**Shell pattern**: `PageBackground > AppShell > [Sidebar, MainContent > [PageChromeHeader, <RouteContent>]]`

**Deliverable**: ✅ `figma-sync-order.json` updated with confirmed node IDs.

### A-2 · DONE — Record node IDs for canonical product pages only

All canonical route node IDs confirmed 2026-04-18 via Figma MCP.

| Route | Frame name | Node ID | Shell pattern |
| --- | --- | --- | --- |
| `/` | `Route / Landing` | `1:6752` | Public (no shell) |
| `/auth` | `Route / Auth` | `1:147` | AuthLayout (no shell) |
| `/onboarding` | `Route / Onboarding` | `1:330` | 3 children (check structure) |
| `/dashboard` | `MainBoard` | `1:1277` | **EMPTY** — needs redesign |
| `/profile` | `Route / Profile` | `1:4411` | PageBackground + AppShell |
| `/opportunities` | `Route / Opportunities` | `1:2333` | PageBackground + AppShell |
| `/applications` | `Route / Applications` | `1:3176` | Legacy PageCanvas wrapper |
| `/analysis` | `Route / Analysis` | `1:5116` | Legacy PageCanvas wrapper |
| `/documents` | `Route / Documents` | `1:5490` | Legacy PageCanvas wrapper |
| `/apply` | `Route / Apply` | `20:13` | PageBackground + AppShell |
| `/generation` | `Route / Generation` | `20:10` | PageBackground + AppShell ✅ canonical |
| `/settings` | `Route / Settings` | `20:14` | PageBackground + AppShell |

**Deliverable**: ✅ `figma-sync-order.json` updated.

### A-3 · HIGH — Separate redirect-history pages from canonical pages in Figma

If old alias pages still exist in the active file, do one of these:
- archive them
- collapse them into annotations attached to the canonical page
- rename them explicitly as `[redirect-history]`

Redirect-history pages:
- `/login`
- `/register`
- `/welcome`
- `/dashboard-overview`
- `/job-queue`
- `/lookout`
- `/feed`
- `/tracker`
- `/kanban`
- `/docs`
- `/editor`
- `/apply/quick`
- `/ksc-generator`
- `/cover-letter-generator`
- `/studio`
- `/identity`
- `/dossier`
- `/career/ingest`
- `/ingestion`

**Rule**: redirect-history pages must not block code sync and must not stay mixed into the canonical sync queue.

### A-4 · HIGH — Separate utility and internal pages from product route tabs

These should be kept distinct from the canonical route pages:

| Surface | Target label |
| --- | --- |
| `/asset-library` | `support /asset-library` |
| `/design-sidekick` | `internal /design-sidekick` |
| `/style-guide` | `internal /style-guide` |
| `/animation-test` | archive or remove from design file |
| `/test-tokens` | archive or remove from design file |

**Deliverable**: either keep them with explicit labels or remove/archive them if they are no longer needed in the main file.

### A-5 · HIGH — Confirm route-family shell policy for broken legacy pages

The April 12 audit flagged older pages like `/opportunities`, `/profile`, `/analysis`, and `/documents` as structurally inconsistent.

For each of these route families, confirm one of:
- `desktop_canonical`
- `mobile_reference_only`
- `legacy_broken_archive`

**Deliverable**: add that decision into the frame description or the task notes before deep extraction work starts.

## Lane B — Code / Contract Tasks

These tasks happen in the repo after or alongside Lane A updates.

### B-1 · DONE — Repair the sync contract

- `figma-sync-order.json` now points at `eoNJnwvDZ64OUgSthE20WW`
- redirect-history and utility/internal pages are separated
- rescue file is marked historical-only

### B-2 · NEXT — Update downstream docs that still point at the old file key or old route model

Audit and update:
- `docs/project/active/implementation-plan.json`
- `docs/project/active/compliance-report.md`
- `docs/project/active/pr-summary.md`
- `docs/design/screen-map.json` if it is still treated as active

### B-3 · NEXT — Normalize stale paired-screen route language

High-value cleanup targets after the sync contract repair:
- `frontend/src/screens/04_ingestion/*`
- any remaining `06_lookout` naming residue in active docs
- any docs that still treat redirect pages as canonical targets

### B-4 · BLOCKED ON A-1/A-2 — Replace `MISSING` canonical node IDs with real active-file IDs

Only after Lane A extracts the actual IDs from the active file:
1. update `figma-sync-order.json`
2. use those IDs in follow-up sync or parity tasks
3. stop using old rescue-file IDs as placeholders

## Working Interpretation Rules

- A canonical product route with `figma_node_id: "MISSING"` is blocked on node extraction, not proof that the page frame does not exist.
- A redirect-history route with `figma_node_id: "NOT_REQUIRED"` must never block code work.
- A utility or internal route is tracked for reference only unless explicitly promoted.
- If a page exists in the rescue file but not the active file, treat it as donor/reference material, not active sync truth.

## Current Priority Order

1. shared shell anchors
2. canonical node IDs for `/auth`, `/onboarding`, `/profile`, `/opportunities`, `/applications`, `/analysis`, `/documents`, `/apply`, `/generation`, `/settings`
3. redirect-history cleanup
4. utility/internal separation
5. route-family shell decisions for older broken pages
