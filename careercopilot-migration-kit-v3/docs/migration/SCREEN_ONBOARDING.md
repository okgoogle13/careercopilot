# Screen: /onboarding

- Legacy implementation: `apps/web/src/features/OnboardingLegacy.tsx`
- Migrated implementation: `apps/web/src/screens/OnboardingScreen.tsx`
- Cutover mechanism: `apps/web/src/router/RouteGate.tsx`
- Default flag state: `DEFAULT_FEATURE_FLAGS.onboarding = false`
- Wireframe artifact: `docs/design-system/wireframes/onboarding.json`

Current migrated shell:

- eyebrow: `Onboarding Route`
- title: `Choose The Route Pressure Point`
- primary action: `Open Welcome Briefing`
- secondary action: `Review Dashboard First`

Copy posture:

- keep the onboarding route focused on concrete work paths rather than generic setup language
- frame the route as the first workflow choice, not a bureaucratic intake step
- keep status copy specific about what opens next

The migrated screen preserves the route URL, keeps legacy fallback as the committed baseline, and reframes onboarding as a route-selection step that stays aligned with the current migration shell.
