# Screen: /profile

- Legacy implementation: `apps/web/src/features/ProfileLegacy.tsx`
- Migrated implementation: `apps/web/src/screens/ProfileScreen.tsx`
- Cutover mechanism: `apps/web/src/router/RouteGate.tsx`
- Default flag state: `DEFAULT_FEATURE_FLAGS.profile = false`
- Wireframe artifact: `docs/design-system/wireframes/profile.json`

Current migrated shell:

- eyebrow: `Profile Foundation`
- title: `Shape Your Movement Profile`
- primary action: `Save Profile Foundation`
- secondary action: `Review Dashboard`

Copy posture:

- keep the tone concrete, supportive, and movement-oriented
- frame profile setup as application preparation, not bureaucratic profile administration
- keep validation and status language direct enough to guide the next step without placeholder tone

The migrated screen preserves the route URL, keeps legacy fallback as the committed baseline, and replaces the generated placeholder shell with a profile-foundation step that fits the current migration family.
