# Support Reference Audit — Dashboard (`/dashboard`)

**Route row:** `dashboard` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/11_dashboard/11_dashboard.wireframe.xml` + `frontend/src/screens/11_dashboard/DashboardOverview.tsx`
**Runtime owner:** `frontend/src/features/dashboard/Dashboard.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/Dashboard.tsx`

## Decision

- **Approved reuse mode:** `keep_behavior_rewrite_styling`
- **Why:** the consolidated candidate has strong data-density patterns, panel segmentation, and metric hierarchy, but it is not portable as-is because it imports `figma:asset/...` and carries hardcoded hex values for chart and illustration treatment.
- **Archetype mapping:** `Scaffold`-heavy operational shell with `Placard` metric clusters and spotlight panels.
- **Generic SaaS risk:** `high` — the source is sophisticated, but its panel grids, chart framing, and hero-overview treatment skew heavily toward a polished generic SaaS dashboard unless aggressively de-SaaS'd at implementation time.

## Reuse Allowed

- tactical panel decomposition and metric hierarchy
- scroll-pressure / spotlight sequencing patterns
- dashboard information architecture for grouped operational metrics

## Rewrite Required

- replace all `figma:asset` bindings with canonical repo-managed assets or remove them
- rewrite chart and surface styling to semantic tokens only
- preserve the current runtime owner and backend capability mapping from the route matrix
- recompose overview panels so they do not preserve off-the-shelf SaaS dashboard symmetry, illustration framing, or neutral enterprise chart styling

## Exclusions

- no direct promotion of `Dashboard.tsx` from consolidated-reference
- no Figma-bound or remote image dependencies in runtime truth
- no flora or non-human mascot motifs in hero/overview panels
