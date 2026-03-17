# Support Reference Audit — Analysis (`/analysis`)

**Route row:** `analysis` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/05_analysis/05_analysis.wireframe.xml` + `frontend/src/screens/05_analysis/AnalysisWorkbench.tsx`
**Runtime owner:** `frontend/src/features/analysis/AnalysisPage.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/Analysis.tsx`

## Decision

- **Approved reuse mode:** `keep_behavior_rewrite_styling`
- **Why:** the consolidated candidate has useful evidence-board composition and analytics storytelling, but it embeds hardcoded hex chart colors and mock-data presentation that cannot become runtime truth unchanged.
- **Archetype mapping:** `Placard` evidence-board shell with stacked analysis strips and `Scaffold` support zones for ATS/result output.
- **Generic SaaS risk:** `medium-high` — the evidence storytelling is useful, but the result cards and analytics framing still drift toward standard B2B insight dashboards without a stronger KR Solidarity voice pass.

## Reuse Allowed

- evidence-card hierarchy and ATS storytelling layout
- chart grouping, section labels, and results-panel sequencing
- card-to-chart relationship patterns for resume audit output

## Rewrite Required

- replace all hardcoded chart/surface colors with semantic tokens or runtime-safe chart color mapping
- keep backend contract ownership tied to `resume_audit` on `/analysis`
- convert mock-data assumptions into API-driven or test-fixture-driven runtime behavior only
- restyle evidence panels and result summaries so they read as a pressure-bearing analysis workbench rather than a generic analytics portal

## Exclusions

- no direct promotion of the consolidated support file
- no hardcoded visualization colors in runtime truth
- no flora or non-human mascot motifs
