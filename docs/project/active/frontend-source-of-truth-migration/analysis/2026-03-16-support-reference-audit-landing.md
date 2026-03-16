# Support Reference Audit — Landing (`/`)

**Route row:** `root` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/01_landing/01_landing.wireframe.xml` + `frontend/src/screens/01_landing/HeroLanding.tsx`
**Runtime owner:** `frontend/src/features/landing/LandingPage.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/LandingPage.tsx`

## Decision

- **Approved reuse mode:** `keep_behavior_rewrite_styling`
- **Why:** the consolidated candidate has stronger manifesto pacing, hero sequencing, and CTA rhythm than the current reference shell, but it is not safe for direct promotion because it mixes token helpers with hardcoded color comments/alpha expressions.
- **Archetype mapping:** `Placard`-led landing shell with `Strike`-driven CTA clusters and a manifesto-style hero scaffold.
- **Generic SaaS risk:** `medium` — structurally useful, but the card rhythm and polished dashboard-style sectioning will read like a generic portal if the CTA stack, typography pressure, and surface asymmetry are copied too literally.

## Reuse Allowed

- hero composition rhythm and section ordering
- manifesto copy cadence and CTA grouping
- feature-card sequencing and motion timing ideas

## Rewrite Required

- all presentation must stay owned by the canonical runtime route and semantic token system
- any inline alpha/color helper logic must be rewritten against current KR Solidarity tokens
- routing and auth entrypoints remain owned by the current runtime feature surface
- hero and feature sections must be re-authored away from polished SaaS card-grid symmetry toward KR Solidarity asymmetry and manifesto pacing

## Exclusions

- no direct promotion of the consolidated TSX file
- no remote/undocumented asset assumptions
- no `/kr/*` navigation or prototype route semantics
- no flora or non-human mascot imagery
