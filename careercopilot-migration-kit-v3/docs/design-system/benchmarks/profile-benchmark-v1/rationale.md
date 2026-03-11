# Profile Benchmark v1

This benchmark defines the current standard for the migrated `/profile` route.

## Derived From

- `frontend/src/features/style-guide/StyleGuide.tsx`
- `frontend/src/features/style-guide/M3ExpressiveComponents.tsx`
- `docs/design-system/benchmarks/style-guide-rubric-v1/rubric.md`

## Why it should pass

- Typography: the strike, placard title, and form labels maintain the same three-tier hierarchy as the established migration shell.
- Shapes: the route reuses the expressive placard and field framing already proven in auth migrations.
- Colour: all presentation remains semantic-token driven and preserves KR Solidarity contrast.
- Motion: interaction intent is present through field and action treatment without adding theatrical behavior.
- M3 Expressive quality: the route stays authored and specific rather than generic profile-settings UI.
- Asset usage: the route passes through justified absence rather than decorative filler.
- Proportions: form density and supporting copy remain balanced for a simple profile-foundation step.
- Anti-slop: the route avoids default enterprise profile-settings framing.
- UX copy: actions and status language orient the user toward next-step application work rather than placeholder administration.

## Evidence

- `apps/web/src/screens/ProfileScreen.tsx`
- `docs/design-system/wireframes/profile.json`
- Screenshot evidence pending capture

## Guardrails

- Keep the route reversible through `RouteGate`
- Keep semantic-token-only styling
- Keep zero-flora and deprecated-token bans intact
- Do not add decorative assets without manifest-backed rationale
