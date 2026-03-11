# Screen: /register

- Legacy implementation: `apps/web/src/features/RegisterLegacy.tsx`
- Migrated implementation: `apps/web/src/screens/RegisterScreen.tsx`
- Cutover mechanism: `apps/web/src/router/RouteGate.tsx`
- Default flag state: `DEFAULT_FEATURE_FLAGS.register = false`
- Wireframe artifact: `docs/design-system/wireframes/register.json`

Current migrated shell:

- eyebrow: `Movement Entry`
- title: `Claim Your Collective Portal`
- primary action: `Create Account (Step 1 Of 2)`
- secondary action: `Back To Login`

Copy posture:

- keep the tone invitational but direct
- avoid bureaucratic account/portal vocabulary
- keep registration framed as the start of a visible journey

The migrated screen preserves the route URL and register interaction surface while keeping legacy fallback as the committed baseline until the flag flips.
