# Support Reference Audit — Opportunities (`/opportunities`)

**Route row:** `opportunities` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/06_lookout/06_lookout.wireframe.xml` + `frontend/src/screens/06_lookout/LookoutDiscovery.tsx`
**Runtime owner:** `frontend/src/features/opportunities/Opportunities.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/Opportunities.tsx`

## Decision

- **Approved reuse mode:** `keep_behavior_rewrite_styling`
- **Why:** the support candidate has strong lead-card hierarchy, filter sequencing, and job-intel metadata pacing, but it hardcodes multiple hex values and pushes the page toward a stylized dispatch/intelligence portal that would overdetermine runtime voice if copied literally.
- **Archetype mapping:** `Placard`-led lookout board with `March` filter chips and dispatch-card stacks.
- **Generic SaaS risk:** `medium-high` — structurally stronger than the current route shell, but still easy to collapse into a polished recruitment portal or stylized ops feed if the dispatch framing is copied without a stronger KR route context.

## Reuse Allowed

- card hierarchy and filter ordering
- metadata stack for organization / location / recency / score
- jobs-family section sequencing and worklist density patterns

## Rewrite Required

- all hardcoded colors and inline SVG hex values must be rewritten to runtime-safe tokens
- keep jobs-family ownership tied to `/opportunities` and the shared `06_lookout` screen family
- keep `/job-queue` as a sibling jobs-family route rather than collapsing both routes into one Figma concept
- recompose page voice so it does not read as a generic job portal or over-themed dispatch dashboard

## Exclusions

- no direct promotion of `Opportunities.tsx`
- no shell chrome override from the support candidate
- no backend contract inference from lead-card labels or mock fields
- no flora or non-human mascot motifs
