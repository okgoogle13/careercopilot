# Dashboard Benchmark v1

This benchmark defines the current gold standard for the migrated `/dashboard` route.

## Derived From

- `frontend/src/features/style-guide/StyleGuide.tsx`
- `frontend/src/features/style-guide/M3ExpressiveComponents.tsx`
- `docs/design-system/benchmarks/style-guide-rubric-v1/rubric.md`

## Why it passes

- Typography: the strike, placard title, and card values create a clear three-tier hierarchy without drifting into generic UI styling.
- Shapes: the dashboard reuses the same expressive shell language as auth while adapting card surfaces to a dashboard rhythm.
- Colour: all presentation remains semantic-token driven and preserves KR Solidarity contrast.
- Motion: interaction intent is present in CTA and field treatment without theatrical overload.
- M3 Expressive quality: the composition feels intentional rather than placeholder-flat.
- Asset usage: the route currently passes through justified absence rather than decorative filler.
- Proportions: the headline, placard shell, and card grid balance well at the current density.
- Anti-slop: the screen does not collapse into generic enterprise dashboard styling.
- UX copy: labels and actions are specific enough to orient the user without placeholder language.

## Evidence

- `apps/web/src/screens/DashboardScreen.tsx`
- `docs/design-system/wireframes/dashboard.json`
- `frontend/docs/design/generated/previews/dashboard.png`
- `frontend/docs/design/generated/previews/run-2026-03-10_13-22-12/dashboard.png`

## Guardrails

- Keep the route reversible through `RouteGate`
- Keep semantic-token-only styling
- Keep zero-flora and deprecated-token bans intact
- Do not add decorative assets without manifest-backed rationale
