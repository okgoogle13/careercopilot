# Component Migration Handover Strategy

  Use `/project-manager` as the top-
  level orchestration frame, `/
  sprint-coordinator` for the next
  sprint board, and the migration-kit
  workflow docs as the source of
  truth.

  Project: `careercopilot-migration-
  kit-v3`
  Objective: continue the phased `/
  features` -> `/screens` migration
  with benchmark-first, copy-cleared,
  visual-ready gates. Do not treat
  reactive audit as the primary
  discovery mechanism anymore.

  Executive Summary
  - The migration kit is stable and
  passing.
  - Current migrated routes in the
  kit:
    - `/login`
    - `/register`
    - `/dashboard`
  - All three are:
    - `benchmark-defined`
    - `copy-cleared`
    - `visual-ready`
    - `migrated-ready`
  - All three still preserve legacy
  fallback through `RouteGate` with
  default flags set to `false`.
  - A proactive copy gate now exists
  and is wired into `verify`:
    - `npm run audit:copy`
  - The migration process has been
  hardened so generated scaffolds are
  not route-ready until they pass
  benchmark and copy gates.

  Source of truth
  - Tracker:
    - `careercopilot-migration-kit-
  v3/docs/migration/
  MIGRATION_TRACKER.md`
  - Plan:
    - `careercopilot-migration-kit-
  v3/docs/migration/PR_PLAN.md`
  - Guardrails:
    - `careercopilot-migration-kit-
  v3/docs/migration/
  MIGRATION_GUARDRAILS.md`
  - Audit flow:
    - `careercopilot-migration-kit-
  v3/docs/migration/
  AUDIT_ORCHESTRATOR.md`

  Current route-processing map

  A. Routes already processed in
  migration kit
  These are the only routed
  migration-kit slices currently
  implemented and audit-ready.

  1. `/login`
  - Parent app route:
    - `frontend/src/App.tsx` -> `/
  login` -> `Login`
  - Migration-kit route:
    - `careercopilot-migration-kit-
  v3/apps/web/src/router/
  ScreensRouter.tsx`
  - Legacy fallback:
    - `careercopilot-migration-kit-
  v3/apps/web/src/features/
  LoginLegacy.tsx`
  - Migrated screen:
    - `careercopilot-migration-kit-
  v3/apps/web/src/screens/
  LoginScreen.tsx`
  - Benchmark:
    - `auth-benchmark-v1`
  - State:
    - fully processed in kit
    - copy-cleared
    - audit-ready

  2. `/register`
  - Parent app route:
    - `frontend/src/App.tsx` -> `/
  register` -> `Register`
  - Migration-kit route:
    - `careercopilot-migration-kit-
  v3/apps/web/src/router/
  ScreensRouter.tsx`
  - Legacy fallback:
    - `careercopilot-migration-kit-
  v3/apps/web/src/features/
  RegisterLegacy.tsx`
  - Migrated screen:
    - `careercopilot-migration-kit-
  v3/apps/web/src/screens/
  RegisterScreen.tsx`
  - Benchmark:
    - `auth-benchmark-v1`
  - State:
    - fully processed in kit
    - copy-cleared
    - audit-ready

  3. `/dashboard`
  - Parent app route:
    - `frontend/src/App.tsx` -> `/
  dashboard` -> `Dashboard`
  - Migration-kit route:
    - `careercopilot-migration-kit-
  v3/apps/web/src/router/
  ScreensRouter.tsx`
  - Legacy fallback:
    - `careercopilot-migration-kit-
  v3/apps/web/src/features/
  DashboardLegacy.tsx`
  - Migrated screen:
    - `careercopilot-migration-kit-
  v3/apps/web/src/screens/
  DashboardScreen.tsx`
  - Benchmark:
    - `dashboard-benchmark-v1`
  - State:
    - fully processed in kit
    - copy-cleared
    - audit-ready

  B. Route draft already present in
  kit but NOT processed
  4. `/profile`
  - Parent app route:
    - `frontend/src/App.tsx` -> `/
  profile` -> `ProfileView`
  - Migration-kit screen draft:
    - `careercopilot-migration-kit-
  v3/apps/web/src/screens/
  ProfileScreen.tsx`
  - Current state:
    - draft-generated only
    - not routed in kit
    - not benchmark-defined
    - not copy-cleared
    - not visual-ready
    - intentionally excluded from the
  new proactive copy gate as a
  generated draft
  - This is the strongest candidate
  for the next real route migration
  if you want to extend the kit.

  C. Parent-app public routes not yet
  modeled in migration kit
  These exist in `frontend/src/
  App.tsx` but have no migration-kit
  routing or benchmark bundle yet.

  5. `/`
  - parent app uses `LandingPage`
  - kit currently redirects `/` -> `/
  login`
  - decision needed: keep as
  redirect-only in kit, or eventually
  model landing migration

  6. `/design-sidekick`
  - utility/design route
  - probably out of first-wave
  migration scope unless the kit
  expands into design tools

  7. `/style-guide`
  - style-guide route
  - not a migration target itself; it
  is rubric source material

  8. `/kr/landing`
  9. `/kr/auth`
  10. `/kr/onboarding`
  11. `/kr/analysis`
  12. `/kr/dashboard`
  - KR showcase/demo routes
  - likely reference surfaces, not
  immediate migration-kit production
  route targets
  - should not be scheduled ahead of
  product routes unless you
  explicitly want a KR showcase
  sprint

  D. Parent-app protected routes not
  yet modeled in migration kit
  These are the remaining product
  routes that would need migration-
  kit processing if the kit expands
  beyond auth + dashboard.

  13. `/onboarding`
  14. `/welcome`
  15. `/tracker`
  16. `/documents`
  17. `/analysis`
  18. `/opportunities`
  19. `/ksc-generator`
  20. `/cover-letter-generator`
  21. `/settings`
  22. `/profile`
  23. `/asset-library`
  24. `/career/ingest`
  25. `/job-queue`
  26. `/apply/quick`
  27. `/test-tokens`

  Current recommended migration queue
  Use `/project-manager` to frame
  these as phases, not as one flat
  backlog.

  Phase 1: quality hardening on
  already-processed routes
  - `/login`
  - `/register`
  - `/dashboard`
  Goal:
  - strengthen typography, asset
  posture, visual polish, and
  screenshot evidence
  Reason:
  - these three are the benchmark-
  bearing routes and should define
  the migration standard before
  scaling out

  Phase 2: first new route promotion
  from draft to real migration
  - `/profile`
  Goal:
  - promote from `draft-generated`
  to:
    - `benchmark-defined`
    - `copy-cleared`
    - `visual-ready`
    - then routed behind `RouteGate`
  Reason:
  - a draft already exists, so it is
  the lowest-friction next real route

  Phase 3: core protected workflow
  routes
  Recommended order:
  1. `/onboarding`
  2. `/welcome`
  3. `/documents`
  4. `/analysis`
  5. `/tracker`
  6. `/career/ingest`
  7. `/job-queue`
  Reason:
  - these routes sit closest to the
  auth/dashboard path and core user
  workflow

  Phase 4: specialist productivity
  routes
  Recommended order:
  1. `/ksc-generator`
  2. `/cover-letter-generator`
  3. `/opportunities`
  4. `/apply/quick`
  Reason:
  - these are feature-heavy and
  should inherit stabilized migration
  patterns from earlier workflow
  routes

  Phase 5: secondary/support routes
  Recommended order:
  1. `/settings`
  2. `/asset-library`
  3. `/test-tokens`
  Reason:
  - lower-priority or support
  surfaces
  - should not lead the migration
  cadence

  Phase 6: non-product or reference
  routes
  - `/design-sidekick`
  - `/style-guide`
  - `/kr/landing`
  - `/kr/auth`
  - `/kr/onboarding`
  - `/kr/analysis`
  - `/kr/dashboard`
  Reason:
  - treat as a separate decision, not
  as part of the main product
  migration queue

  Current migration-kit workflow
  rules
  Every new route must move through:
  1. `draft-generated`
  2. `benchmark-defined`
  3. `copy-cleared`
  4. `visual-ready`
  5. `migrated-ready`

  Do not skip these gates.
  Do not treat generated screens as
  review-ready.
  Do not use reactive audit as the
  first place to discover copy or
  tone problems.

  Current benchmarks
  - Auth routes:
    - `careercopilot-migration-kit-
  v3/docs/design-system/benchmarks/
  auth-benchmark-v1/benchmark.json`
  - Dashboard route:
    - `careercopilot-migration-kit-
  v3/docs/design-system/benchmarks/
  dashboard-benchmark-v1/
  benchmark.json`
  - Shared rubric:
    - `careercopilot-migration-kit-
  v3/docs/design-system/benchmarks/
  style-guide-rubric-v1/rubric.md`

  Current proactive gates
  - `npm run audit:copy`
  - `npm run audit:legacy`
  - `npm run design-audit`
  - `npm run verify`

  Recommended next sprint using `/
  sprint-coordinator`
  Sprint objective:
  - lock visual quality on the three
  processed routes
  - decide and prepare the next real
  route promotion

  Milestone A: benchmark and visual
  hardening
  Targets:
  - `/login`
  - `/register`
  - `/dashboard`
  Tasks:
  - run `asset-placement-strategy`
  - run `kerala-rage-typography-
  strategy`
  - run `m3-visual-audit`
  - refresh screenshots if visuals
  change
  Exit criteria:
  - all three routes remain
  benchmark-valid and visually
  stronger than current baseline

  Milestone B: next-route promotion
  planning
  Primary candidate:
  - `/profile`
  Tasks:
  - define benchmark id
  - create copy guide
  - decide whether `/profile`
  deserves immediate migration or
  should be deferred behind `/
  onboarding`
  Exit criteria:
  - one clear next route selected
  with benchmark-first plan

  Milestone C: route backlog mapping
  Tasks:
  - categorize the remaining parent-
  app routes into:
    - core workflow
    - specialist productivity
    - support
    - reference/demo
  - produce a migration sequence and
  dependency map
  Exit criteria:
  - no ambiguity about which route
  comes after the next selected
  candidate

  Default recommendation
  - First: visual hardening on `/
  login`, `/register`, `/dashboard`
  - Second: decide between `/profile`
  and `/onboarding` as the next real
  migration target
  - Recommended default: `/profile`
  if the goal is extending the
  migration pattern cheaply
  - Recommended default: `/
  onboarding` if the goal is moving
  deeper into core user journey

  Commands and signals
  From `careercopilot-migration-kit-
  v3`:
  - `npm run lint`
  - `npm run type-check`
  - `npm run test`
  - `npm run audit:copy -- --json`
  - `npm run audit:legacy -- --json`
  - `npm run design-audit -- --json`
  - `npm run verify`

  Current status signal
  - `npm run verify` passes
  - `npm run audit:copy` passes
  - `npm run audit:legacy` passes
  - only non-blocking issue remains
  the React Router v7 future-flag
  warnings during Vitest

  What I want from you
  Using `/project-manager`:
  - produce a project snapshot that
  explicitly maps all 27 parent-app
  routes into:
    - already processed in kit
    - draft in kit
    - queued for migration
    - reference/demo/out of current
  scope

  Using `/sprint-coordinator`:
  - produce a sprint board for the
  next sprint with:
    - Milestone A: visual hardening
    - Milestone B: next-route
  promotion decision
    - Milestone C: backlog mapping
  - include owners, dependencies,
  readiness scoring, and blocker
  handling

  Then recommend the next
  implementation packet with a single
  primary target route.
