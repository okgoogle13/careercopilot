# Dependency Cleanup Safety Checklist (2026-03-09)

## Scope
Review of Gemini cleanup proposal with execution-safe subset applied.

## Safe-Now Changes Applied
- [x] Added `zod` to `functions` workspace dependencies.
  - File: `functions/package.json`
  - Rationale: `functions/src/mcp_server.ts` imports `zod`; root-hoisted dependency should not be required.
- [x] Added UI-owned runtime deps to `@careercopilot/ui`.
  - File: `frontend/packages/ui/package.json`
  - Added: `cmdk`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-resizable-panels`, `vaul`.
  - Rationale: these are imported by UI package source and should be declared by the package itself.

## Verified Current State (No Action Needed)
- [x] No root `package-lock.json` present.
- [x] No root `.temp-*` files present.

## Not Safe As-Is (Defer)
- [ ] Strip root `dependencies` to zero.
  - Blocker: requires full import-to-workspace ownership audit and lockfile convergence.
- [ ] Force version standardization (`react`, `zod`, `recharts`) in one pass.
  - Blocker: high regression risk across frontend/UI/functions without phased validation.
- [ ] Consolidate/delete root `.env*` files blindly.
  - Blocker: multiple scripts/servers read root `.env` conventions.
- [ ] Remove `assets/` or `libs/legacy-ui/` directly.
  - Blocker: tracked data and legacy references require migration plan.

## Recommended Next Safe Sequence
1. `yarn install` and confirm lockfile stability.
2. Validate targeted builds:
   - `yarn build:functions`
   - `cd frontend/packages/ui && yarn build`
   - `cd frontend && yarn type-check`
3. Only then begin root dependency reductions in small batches (1-3 deps per batch) with validation after each batch.
