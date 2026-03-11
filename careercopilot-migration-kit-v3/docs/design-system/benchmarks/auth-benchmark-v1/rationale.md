# Auth Benchmark v1

This benchmark defines the current gold standard for the migrated auth routes: `/login` and `/register`.

## Derived From

- `frontend/src/features/style-guide/StyleGuide.tsx`
- `frontend/src/features/style-guide/M3ExpressiveComponents.tsx`
- `docs/design-system/benchmarks/style-guide-rubric-v1/rubric.md`

## Why it passes

- Typography: the auth shell creates a clear three-tier hierarchy without making the form feel theatrical or untrustworthy.
- Shapes: the shell and framed regions feel expressive and intentional without collapsing into generic form cards.
- Colour: the route stays semantic-token driven and preserves KR Solidarity contrast.
- Motion: entry and interaction states communicate intent without distracting from task completion.
- M3 Expressive quality: the composition feels authored, not placeholder-flat.
- Asset usage: the benchmark passes through justified absence rather than decorative filler.
- Proportions: form, shell, and supporting content balance well at the current density.
- Anti-slop: the routes avoid default enterprise-auth styling.
- UX copy: CTAs, helper copy, and status language are specific enough to orient the user and avoid placeholder tone.

## Evidence

- `apps/web/src/screens/LoginScreen.tsx`
- `apps/web/src/screens/RegisterScreen.tsx`
- `docs/design-system/wireframes/login.json`
- `docs/design-system/wireframes/register.json`
- `frontend/docs/design/generated/previews/login.png`
- `frontend/docs/design/generated/previews/register.png`
- `frontend/docs/design/generated/previews/run-2026-03-10_13-22-12/login.png`
- `frontend/docs/design/generated/previews/run-2026-03-10_13-22-12/register.png`

## Guardrails

- Keep the routes reversible through `RouteGate`
- Keep semantic-token-only styling
- Keep zero-flora and deprecated-token bans intact
- Do not add decorative assets without manifest-backed rationale
