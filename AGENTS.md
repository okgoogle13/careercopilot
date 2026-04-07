# AGENTS.md

Career Copilot is an AI-powered job application assistant built with React 18, TypeScript, FastAPI, Google Genkit, Postgres, and Firebase hosting/auth integrations. This file is the single operational instruction source for coding agents working in this repo.

## Distill-First Operating Mode

`distill` is not just an output filter in this repo. It is the default operating mentality.

- Pipe every non-interactive shell command through `distill` unless exact raw output is required or the command is interactive/TUI.
- Prompts to `distill` must be explicit: say exactly what you need to know and exactly how the answer should be compressed.
- Wait for `distill` to finish before taking the next step.
- Think the same way you use `distill`: start from the smallest authoritative artifact, compress noisy evidence early, avoid broad speculative reads, and prefer short verified summaries over raw dumps.
- Never dump raw build, test, grep, or audit logs into agent context when a distilled result will do.

Examples:

```bash
(cd frontend && yarn type-check) | distill "Did the frontend type check pass? Return PASS/FAIL and only failing file:line:error entries."
(cd backend && pytest) | distill "Did backend tests pass? Return PASS/FAIL, failing test names, and first actionable error only."
rg -n "figma:asset|--sys-|#[0-9A-Fa-f]{3,6}" frontend/src | distill "List only real violations with file:line and a one-line reason."
```

## Current Stage

The repo is in a Figma-to-code integration stage combined with frontend source-of-truth convergence.

The priority is not broad refactoring. The priority is:

1. Keep design intent, screen mappings, and live routes aligned.
2. Replace prototype-era or Figma-bound leftovers with canonical repo artifacts.
3. Preserve KR Solidarity design constraints while promoting real screens into production-safe code.

If Figma, wireframes, runtime code, and control JSON disagree, do not guess. Reconcile the disagreement through the authority order below.

## Authority Order

Use these sources in this order.

1. Design canon:
   - `docs/design/01_CANON.md`
   - `docs/design/02_SYSTEM.md`
2. Active Figma coordination:
   - `docs/project/active/figma-agent-tasks.md`
   - `docs/project/active/figma-sync-order.json`
3. Migration control artifacts:
   - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
   - `docs/design/screen-map.json`
4. Screen pairing inside the repo:
   - `frontend/src/screens/mapping.schema.json`
   - `frontend/src/screens/*/mapping.json`
   - `frontend/src/screens/*/*.wireframe.xml`
   - `frontend/src/screens/*/*.tsx`
5. Runtime truth:
   - `frontend/src/App.tsx`
   - `frontend/src/config/route-registry.ts`
   - `frontend/src/features/**`
   - `frontend/src/pages/**`
6. Capability truth:
   - `backend/app/api/endpoints/**`
   - backend schemas and service contracts used by mounted routes
7. Asset truth:
   - `docs/manifests/kr-manifest.json`
   - canonical asset registries/manifests referenced by active docs

Conflict rules:

- Design canon wins for palette, typography, shapes, motion, and symbolic constraints.
- Figma task docs win for active handoff status like missing node IDs, token-name checks, and asset-slot annotation requirements.
- `mapping.json` plus paired wireframe plus paired screen component define the local design implementation contract for a surface.
- Runtime truth decides what is actually exposed to users today.
- Control JSON is coordination truth, not license to override runtime or design truth blindly.
- Prototype `/kr/*` routes and harvest artifacts are reference-only unless explicitly promoted.

## Figma Integration Workflow

When a task involves a Figma design file, follow this sequence.

1. Identify the surface and locate its local authority:
   - `frontend/src/screens/<screen-id>/mapping.json`
   - paired `*.wireframe.xml`
   - paired screen `*.tsx`
2. Cross-check that surface against:
   - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
   - `docs/design/screen-map.json`
3. Check `docs/project/active/figma-sync-order.json` for a real `figma_node_id`.
   - If the node ID is missing, treat the task as blocked on Figma-side work rather than inventing a mapping.
4. Keep Figma variable names aligned with code tokens:
   - source of truth: `frontend/src/design/tokens/tokens.json`
   - CSS usage: semantic `--kr-*` tokens only
5. Translate Figma design intent into canonical repo artifacts:
   - wireframe -> mapping -> screen/component -> live route
   - not raw screenshot copying and not ad hoc visual approximation
6. Replace prototype-era Figma asset bindings:
   - remove or convert `figma:asset/*`
   - use manifest-backed asset IDs or canonical local asset references
   - never introduce new production code that depends on raw `figma:asset` imports
7. Only touch `frontend/src/App.tsx` or `frontend/src/config/route-registry.ts` when the task is explicitly about route promotion, registry repair, or live exposure.

Blocked-state rules:

- Missing node IDs: stop and request/update the Figma-side artifact rather than fabricating IDs.
- Token-name mismatch between Figma and code: update the token source of truth deliberately, then regenerate derived CSS.
- Asset slots without manifest IDs: keep them reference-only until a canonical `kr-asset-id` exists.

## Project Snapshot

- Frontend: `frontend/` using React 18, TypeScript, Vite, Zustand, TanStack Query, Tailwind v4, MUI
- Backend: `backend/` using FastAPI, SQLAlchemy, Postgres, async/await
- AI orchestration: Genkit flows plus backend API wrappers
- Design system: KR Solidarity v6.1, Material 3 Expressive foundation, dark-only "Solidarity Mode"

Important directories:

- `frontend/src/screens/` contains design-paired surfaces and mapping metadata
- `frontend/src/features/` contains live feature implementations
- `frontend/src/design/` contains token source and generated styles
- `backend/app/api/endpoints/` contains mounted capability truth
- `docs/project/active/` contains current orchestration, migration, and Figma coordination docs

## Design System Rules

Non-negotiables:

- Use semantic `--kr-*` tokens for all new UI work. Do not introduce new `--sys-*` usage.
- No hardcoded hex values in production UI.
- No Australian flora/fauna motifs. Coconut palms and elephants are allowed where canon permits; gum leaves, wattle, and eucalyptus are not.
- No default-safe typography drift. Do not introduce Inter, Roboto, Arial, Sora, or Plus Jakarta Sans.
- Use KR Solidarity archetypes and current component names:
  - `Strike`
  - `Placard`
  - `Scaffold`
  - `March`
  - `Megaphone`
- Treat deprecated names like `Pebble`, `Stone`, `Slab`, `Jar`, `Cabinet`, `Lens`, `Signal`, and `HaloPulses` as compatibility residue, not new design vocabulary.

## Backend and AI Rules

- Prefer Genkit flow implementations and typed schemas over loose helper scripts.
- Use Pydantic models for backend contracts and structured Genkit outputs.
- Treat fallback AI models as disabled or unreliable unless the runtime config explicitly supports them.
- Validate auth and user ownership at the backend boundary.
- Keep agents single-purpose; do not create monolithic document-analysis-generation hybrids.

## Frontend Rules

- TypeScript strict mode is required.
- Use the API layer for server communication; do not query data stores directly from React components.
- Use `frontend/src/config/firebase.ts` for client Firebase config.
- Prefer runtime-safe feature modules over prototype copies.
- Keep screen-paired artifacts in sync when the task is a design-integration task:
  - `mapping.json`
  - local `*.wireframe.xml`
  - paired `*.tsx`

## Safe Commands

Use repo-root-safe commands and keep them distilled.

```bash
(cd frontend && yarn test) | distill "Did frontend tests pass? Return PASS/FAIL and failing tests only."
(cd backend && pytest) | distill "Did backend tests pass? Return PASS/FAIL and failing tests only."
(cd frontend && yarn type-check) | distill "Did frontend type check pass? Return PASS/FAIL and file:line:error only."
(cd backend && mypy .) | distill "Did backend mypy pass? Return PASS/FAIL and file:line:error only."
(cd frontend && yarn lint) | distill "Did frontend lint pass? Return PASS/FAIL and actionable failures only."
(cd backend && ruff check .) | distill "Did backend Ruff pass? Return PASS/FAIL and actionable failures only."
node frontend/scripts/validate-governance-artifacts.mjs | distill "Did governance validation pass? Return PASS/FAIL and failing checks only."
python3 scripts/design-validation/validate-tokens.py | distill "Did design token validation pass? Return PASS/FAIL and violations only."
```

## Ask First

Ask before:

- installing or upgrading dependencies
- changing database migrations or auth policy
- changing model-selection policy
- updating required environment variables
- deleting user or artifact data
- deploying to staging or production
- making breaking API-contract changes

## Never

Never:

- commit secrets, keys, or credentials
- weaken `.gitignore` to permit secret files
- bypass auth or ownership checks
- force-push protected branches
- reset or delete shared history
- introduce new production code that depends on raw `figma:asset/*`
- treat stale docs or archive artifacts as active authority

## Verification Before Claiming Completion

Before saying work is done:

1. Run the narrowest relevant validation commands through `distill`.
2. Verify touched design-integration artifacts still agree:
   - mapping metadata
   - paired wireframe/component
   - route/control docs if applicable
3. If UI styling changed, confirm token hygiene and zero-flora compliance.
4. If route exposure changed, confirm `App.tsx` and `route-registry.ts` intentionally agree.
5. If backend contracts changed, confirm mounted endpoints and schemas agree.

## Domain Context

Product focus:

- social work
- community services
- government and public sector applications
- nonprofit and mission-aligned roles

Common output expectations:

- KSC responses
- STAR-structured examples
- trauma-informed and culturally competent language
- nonprofit and community impact framing

## Legacy Note

`docs/guides/AGENTS.md` is a legacy entry point kept only as a redirect. Do not treat it as a second authority source.
