# Screen: /welcome

- Legacy implementation: `apps/web/src/features/WelcomeLegacy.tsx`
- Migrated implementation: `apps/web/src/screens/WelcomeScreen.tsx`
- Cutover mechanism: `apps/web/src/router/RouteGate.tsx`
- Default flag state: `DEFAULT_FEATURE_FLAGS.welcome = false`
- Wireframe artifact: `docs/design-system/wireframes/welcome.json`

Current migrated shell:

- eyebrow: `Welcome Briefing`
- title: `Bring Your Application Into View`
- primary action: `Start Onboarding Pass`
- secondary action: `Open Onboarding Route`

Copy posture:

- keep the opening brief short, specific, and route-aware
- avoid generic welcome-tour language or setup filler
- keep status copy focused on the next route action

The migrated screen preserves the route URL, keeps legacy fallback as the committed baseline, and replaces the placeholder welcome step with a concrete briefing shell that matches the migration family.
