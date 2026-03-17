# Figma MCP Inventory and Accelerator Decisions

Date: 2026-03-16
Program: PR126 frontend source-of-truth migration
Status: advisory support input

## Page inventory

These pages were fetched directly by page node ID from Figma file `YPDj0edchIDXykYChSmCUd`, not by root traversal.

| Figma page | Page node | Scaffold node | Runtime route family | Canonical route(s) | Canonical screen |
|------------|-----------|---------------|----------------------|--------------------|------------------|
| Home | `0:1` | `1:10` | `landing` | `/` | `frontend/src/screens/01_landing/HeroLanding.tsx` |
| Dashboard | `1:2` | `1:166` | `dashboard` | `/dashboard` | `frontend/src/screens/11_dashboard/DashboardOverview.tsx` |
| Opportunities | `1:3` | `1:579` | `jobs` | `/opportunities`, `/job-queue` | `frontend/src/screens/06_lookout/LookoutDiscovery.tsx` |
| Applications | `1:4` | `1:1323` | `applications` | `/tracker` | `frontend/src/screens/07_kanban/KanbanTracker.tsx` |
| Ingestion | `1:5` | `1:1683` | `ingestion` | `/career/ingest` | `frontend/src/screens/04_ingestion/IngestionFlow.tsx` |
| Analysis | `1:6` | `1:1720` | `analysis` | `/analysis` | `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx` |
| Account Control | `1:8` | `1:2125` | `account` | `/settings`, `/profile` | `frontend/src/screens/10_settings/SettingsControl.tsx` |

## Shared shell notes

- Five pages use the broad `Scaffold` + `Body` + `Sidebar` pattern.
- `Ingestion` is the structural outlier; it does not expose the same top-level sidebar shell pattern.
- Shared shell value exists in the Figma file, but it must stay behind the shared-primitive audit and cannot silently override runtime shell ownership.

## Accelerator decisions

### Adopt now

1. Draft build-contract generation from Figma Scaffold nodes
   - allowed use: prefill region inventory, shell sections, and component hierarchy
   - blocked use: auto-approving contracts or overriding runtime/design/capability truth
2. Draft wireframe XML generation or drift-diff support from Figma page structure
   - allowed use: reduce transcription drift and compare Figma structure with canonical XML
   - blocked use: replacing canonical `frontend/src/screens/**/*.wireframe.xml` without review

### Pilot only

1. Structural scaffold injection
   - allowed use: shell decomposition experiments and scratch scaffolds
   - blocked use: direct runtime TSX promotion or direct feature implementation from generated scaffolds

### Reject for now

1. Backend schema extraction from Figma labels or card text
2. Token auto-reconciliation from Figma variables

These are rejected because Figma is not capability truth, and current MCP access does not expose reliable variable coverage for token sync.

## Immediate implications for Step 4

- Expand support-reference audit coverage beyond `landing`, `dashboard`, and `analysis`.
- Add a dedicated shared-shell audit artifact before any route work that touches sidebar, logo, header, footer, or shell layout.
- Treat Figma MCP as a structural acceleration lane only; do not use it to generate backend contracts or token truth.
