# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Output**: Code first. No preamble.

---

## Stack

| Layer    | Tech                                   |
| -------- | -------------------------------------- |
| Frontend | React 18 + TS + Vite + Tailwind v4     |
| State    | Zustand + TanStack Query               |
| Backend  | FastAPI + SQLAlchemy + Genkit + Python 3.10+ |
| Cloud    | GCP us-central1 · Firebase · Cloud Run |
| Design   | **KR Solidarity v6.0** (M3 Expressive, Manifesto Canon) |
| Tests    | Jest (frontend), Playwright (e2e), pytest (backend) |
| DB       | PostgreSQL via SQLAlchemy + Alembic migrations |

---

## Task Delegation Strategy (Token Conservation) ⚡

**RULE: Default to delegation via polling agent, NOT local execution.**

The CareerCopilot project uses an autonomous task queue system to conserve Claude Code tokens. **Before writing code locally, check if the task should be delegated to Gemini.**

### Delegate to Gemini (via `/tmp/kerala-rage-task-queue.json`)

**Heavy lifting tasks** — Always delegate these:
- ✅ Test generation (pytest, Jest, Playwright)
- ✅ Security analysis and fix application
- ✅ Code refactoring and cleanup
- ✅ Codebase analysis (coverage gaps, complexity, API mapping)
- ✅ Documentation generation
- ✅ Report generation (deployment readiness, etc.)

**Decision checklist:**
- Does this involve generating >50 lines of code? → Delegate
- Will this consume >15K tokens? → Consider delegation
- Can this run autonomously without human review? → Delegate
- Is this test/security/analysis work? → Delegate

### Keep in Claude Code (Local Execution)

**Human judgment tasks** — Keep these local:
- 🔍 Code review and approval
- 🐛 Bug fixes with architectural decisions
- 🔗 Integration and deployment work
- 🧪 Manual testing and validation
- 📝 Git operations and commits

### How to Delegate

1. **Create a task in the queue** (`/tmp/kerala-rage-task-queue.json`):
   ```json
   {
     "task_id": "test-generation-batch-1",
     "assigned_to": "gemini",
     "status": "pending",
     "priority": "high",
     "inputs": {
       "task_type": "test_generation",
       "description": "Generate tests for X",
       "requirements": ["..."],
       "reference_files": ["..."],
       "output_path": "/Users/okgoogle13/Projects/careercopilot/.claude/reports/output.json"
     }
   }
   ```

2. **Polling agent auto-executes:**
   ```bash
   ./scripts/task-poller-control.sh status  # Check progress
   ./scripts/task-poller-control.sh logs     # Watch execution
   ./scripts/task-poller-control.sh pending  # See next tasks
   ```

3. **Validate outputs** in `/Users/okgoogle13/Projects/careercopilot/.claude/reports/`

### Token Budget Targets
- **Claude Code**: Max 150K per sprint (75% of 200K budget)
- **Gemini (delegated)**: Min 200K+ (unlimited via delegation)
- **Target ratio**: 70% Gemini / 30% Claude Code

### Red Flags (Indicates Token Waste)
- ❌ Writing 50+ lines of test code locally
- ❌ Generating security/coverage analysis in Claude Code
- ❌ Manual code generation that could be templated
- ❌ Using >50K tokens on a single task type
- ❌ Not checking if task is in delegation list

---

## Workspace Structure

```
frontend/               # React 18 app (Vite)
  src/
    components/ui/     # UI primitives & archetypes
    features/          # Feature modules (Auth, Dashboard, Applications, etc.)
    layouts/           # Page layouts (legacy shell names: LaboratoryShell, GalleryShell)
    stores/            # Zustand state (useModeStore, auth stores)
    hooks/             # Custom React hooks
    api/               # Frontend API clients
    lib/               # Utilities & helpers
    styles/            # Design tokens & CSS variables
    pages/             # Route pages
  tests/               # E2E tests (Playwright)
  scripts/             # Build & asset generation scripts (kr-solidarity)

backend/               # FastAPI application
  app/
    api/
      router.py        # Main API router (aggregates all endpoints)
      endpoints/       # Resource-specific routers (ingest, job_scout, etc.)
    services/          # Business logic (ATS scoring, job matching, etc.)
    schemas/           # Pydantic models (request/response validation)
    models/            # SQLAlchemy ORM models
    core/              # Database, config, monitoring, logging
    genkit_flows/      # AI orchestration (symlink: ../../../ai/flows/backend)
    agents/            # Autonomous AI agents
    tests/             # Unit & integration tests
  pyproject.toml       # Python 3.10+, dependencies, tool config

frontend/src/design/   # M3 Expressive design tokens
  tokens/
    tokens.json        # Master token file (Kerala Rage: semantic colors, typography, motion, shapes, shadows)

frontend/src/components/ui/NativeAnchor.tsx  # Symbolic anchor (Stone archetype)

scripts/               # Root-level deployment & utility scripts
  deploy.sh
  lint-autofix.sh
  test-deployment.sh
  kr/                  # Kerala Rage asset orchestration scripts
```

---

## Design System: KR Solidarity v6.0 (M3 Expressive)

**Single mode: Solidarity** (dark-only, unified product experience). Identity: Kerala diaspora + Naarm/Melbourne street aesthetics (screenprint + wheat-paste) + First Nations solidarity. No bureaucratic motifs, no white backgrounds, **STRICT ZERO-FLORA LOCKDOWN**.

> **Canon:** `docs/design/01_CANON.md` → `02_SYSTEM.md` → `03_COMPONENTS.md` → `04_ASSETS.md` → `05_FLOWS.md`

### Semantic Color Variables (The Truth)

All colors are **semantic** (usage-driven), not generic. **Truth lives in `frontend/src/design/tokens/tokens.json`** (DTCG format).

**CSS Variable Convention**: `--sys-color-{name}-base` (base value) or `--sys-color-{name}-steps` (tonal ramp)

| Semantic Name | CSS Variable | Usage Intent | Base Hex |
|---|---|---|---|
| **charcoalBackground** | `--sys-color-charcoalBackground-base` | Foundational canvas; all backgrounds. Never use white. | `#1A1A1A` |
| **solidarityRed** | `--sys-color-solidarityRed-base` | Primary buttons, key icon hits, small glows | `#F14714` |
| **kr-charcoalRed** | `--sys-color-kr-charcoalRed-base` | Errors, destructive actions, critical prompts | `#F14844` |
| **kr-activistSmokeGreen** | `--sys-color-kr-activistSmokeGreen-base` | Urban accents, map routes, reflective sections | `#48DA8B` |
| **signalGreen** | `--sys-color-signalGreen-base` | Small accents, links, paint-splash moments | `#48F0E5` |
| **inkGold** | `--sys-color-inkGold-base` | Halo/saint disks, ornament hits, celebratory states | `#DAF674` |
| **stencilYellow** | `--sys-color-stencilYellow-base` | Large poster words, key UI warnings (non-bureaucratic) | `#F6E748` |
| **worker-ash** | `--sys-color-worker-ash-base` | Primary readable ink on dark surfaces | `#DAF6B3` |
| **solidaritySmokeOrange** | `--sys-color-solidaritySmokeOrange-base` | Portrait warmth, paper aging, earth layers | `#DA8B48` |
| **protestMetalBlue** | `--sys-color-protestMetalBlue-base` | Ripples, quiet tech accents, charts secondary | `#48B3DA` |
| **aboriginalFlagRed** | `--sys-color-aboriginalFlagRed-base` | **Restricted** — First Nations solidarity contexts only | `#D81E05` |
| **aboriginalFlagYellow** | `--sys-color-aboriginalFlagYellow-base` | **Restricted** — First Nations solidarity contexts only | `#FCD116` |
| **aboriginalFlagBlack** | `--sys-color-aboriginalFlagBlack-base` | **Restricted** — First Nations solidarity contexts only | `#000000` |

**Tonal Steps**: Each color has a `steps` array (dark → light ramp). Use `base` for primary UI assignments, reference `steps` for hover/pressed/disabled state variants.

**When Building UIs**: Use `--sys-color-{name}-base` for color assignments. Do not mix token names from other design systems.

### Typography (Variable Fonts Only)

| Role | Font | Usage |
|---|---|---|
| **primary** | Work Sans (Variable, wght 100–900) | Body, UI labels, navigation — workhorse |
| **display** | Fraunces (Variable opsz, wght, SOFT, WONK) | Headlines, hero text, expressive moments |
| **proclamation** | Libre Bodoni | Authoritative text, formal proclamation style |
| **mono** | JetBrains Mono (wght 400–600) | Code, data, technical annotations |
| **curator** | Caveat | Handwritten accents, curator notes |
| **colorAccent** | Nabla | **Hero Hit** — Restricted: icon-scale hero moments only. One word per hero view. |

No Inter, Roboto, or Arial. Extreme contrast typography is the M3 Expressive standard. Enable `font-optical-sizing: auto` globally.

### Gold Standard Components (Reference)
These components are 100% compliant with `kr-solidarity v6.0` and should be used as the source of truth:
- **ActionButton.tsx** (`Pebble`): Atomic primary button with high-intensity motion.
- **KeralaRageButton.tsx** (`Pebble`): Standard UI button with loading and icon states.
- **SolidarityCard.tsx** (`Slab`): Primary container — asymmetric `radius-slab` archetype.
- **NativeAnchor.tsx** (`Stone`): Symbolic anchor component with Halo/Grit/Blueprint overlays.
- **ManifestoSlab.tsx** (`Slab`): Complex layout container for text-heavy content.
- **Stone.tsx** (`Stone`): Expressive card / hero anchor.
- **Lens.tsx** (`Lens`): Comprehensive text input and focal container (`TacticalInput`).
- **Signal.tsx** (`Signal`): Status and notification indicator.

**All archetypes MUST use `--sys-color-*` CSS variables, never hardcoded hex.**

### Design System Sources of Truth (Hierarchy)

| Priority | Source | Path |
|---|---|---|
| **1 — Canon** | KR Solidarity Design Canon | `docs/design/01_CANON.md` |
| **2 — System** | Palette, typography, motion specs | `docs/design/02_SYSTEM.md` |
| **3 — Components** | Component catalog & archetypes | `docs/design/03_COMPONENTS.md` |
| **4 — Assets** | Asset naming, manifest, IDs | `docs/design/04_ASSETS.md` |
| **5 — Flows** | Page-level UX flows | `docs/design/05_FLOWS.md` |
| **6 — Tokens** | DTCG token source | `frontend/src/design/tokens/tokens.json` |
| **7 — CSS Vars** | Auto-generated CSS variables | `frontend/src/design/styles/design-tokens.css` |
| **8 — Manifest** | Asset manifest (87 assets) | `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json` |
| **9 — Registry** | Hero registry (compositions) | `frontend/public/assets/kr-solidarity-hero-registry.json` |
| **Deprecated** | Do not use | `design-system/tokens.json` |

### Legacy Constraints (Do NOT Expand)

- `useModeStore`, `routeModeMap.ts` exist for backward compatibility but are **frozen**
- `LaboratoryShell`, `GalleryShell` layout containers: use but don't modify
- No new mode-dependent logic; **Solidarity is the only mode**

### Anti-Patterns

**Non-negotiable violations (NO_GO):**
- ❌ Hardcoded colors like `#1A1A1A` → use `--sys-color-charcoalBackground-base`
- ❌ White or light backgrounds — `charcoalBackground` is the only permitted canvas
- ❌ Generic shape radius (`border-radius: 8px`) → use `radius-pebble`, `radius-stone`, `radius-slab`
- ❌ Purple gradients, blue stock-photo palettes
- ❌ Aboriginal Flag colors or Nabla font outside their strictly restricted contexts
- ❌ Uniform font weights — use variable font axes intentionally
- ❌ **STRICT ZERO-FLORA**: No flora (gum leaves, eucalyptus), no Australian endemic fauna
- ❌ `labWrenMetalBlue` — deprecated, renamed to `protestMetalBlue`
- ❌ `inter`, `Roboto`, `Arial`, `Sora`, `Plus Jakarta Sans` fonts
- ❌ Bureaucratic / passport / visa / border motifs
- ❌ Jar archetype on `SolidarityCard` — now uses `Slab`

**Required (must-haves):**
- ✅ All colors from `--sys-color-{name}-base` semantic tokens
- ✅ Approved fonts: Work Sans, Fraunces, Libre Bodoni, JetBrains Mono, Caveat, Nabla
- ✅ Asymmetric radii (Pebble / Stone / Slab) per component archetype
- ✅ M3 Expressive spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- ✅ `font-optical-sizing: auto` enabled globally
- ✅ `prefers-reduced-motion` respected in all animation logic

---

## Design-to-Code Workflow (Design Workflow 2026)

**Execution Standard**: Follow `/.agent/workflows/design-workflow-2026.md` for all design tasks.

### Phase 1: Research & Briefing
1. Use `prompts/library/design-brief.md` template
2. **Human review**: Equity, inclusion, alignment

### Phase 2: Ideation & Flows
1. Use `prompts/library/user-flows.md` template
2. **Human review**: Select ethical, feasible flow

### Phase 3: Wireframing
1. Use **wireframe-annotator** skill or `prompts/library/wireframes-lowfi.md`
2. Include: `<layout>`, `<tokens>`, `<accessibility>` blocks

### Phase 4: UI Specification (HiFi)
1. Use `prompts/library/ui-spec-hifi.md` template
2. Apply **Asset Generation Prompting Strategy**
3. **Output**: Developer-ready specs with token references

### Phase 5: Accessibility Audit
1. Check layout against WCAG 2.2 AA
2. Document fixes in `<accessibility>` block

### Phase 6: Handoff
1. Export design tokens to Figma (via `sync-tokens-to-figma-vars.mjs`)
2. Convert design to React via **figma-to-page** skill
3. Generate SVG primitives via **kr-svg** skill
4. Validate component compliance via **ui-design-evaluator** + **m3-expressive-ui-evaluator**

---

## Skills for Design Tasks (Next Phase)

These skills are optimized for the upcoming workflow:

| Skill | Purpose | Input | Output |
|---|---|---|---|
| **figma-to-page** | Convert Figma inspect to React code | Figma design + inspect details | React `.tsx` file + hooks |
| **kr-svg** | Generate KR Solidarity SVG primitives | Usage intent (e.g., "icon button") | SVG with semantic colors (`--sys-color-*` CSS vars) |
| **ui-design-evaluator** / **component-visual-audit** | Audit UI against kr-solidarity v6.0 | Component screenshot or code | Visual score + semantic color compliance |
| **m3-expressive-ui-evaluator** | Check M3 Expressive compliance | Design mockup | Typography score, contrast score, spring physics usage |
| **kerala-rage-brand-enforcer** | Enforce Zero-Flora Lockdown + Canon compliance | Any component or asset | Pass/Fail with remediation steps |
| **token-orchestrator** | DTCG compliance + KR Solidarity palette rules | `tokens.json` | Validated token set + CSS var rebuild |
| **wireframe-annotator** | Generate annotated ASCII wireframes | Feature brief + `05_FLOWS.md` | Wireframe with `<layout>`, `<tokens>`, `<accessibility>` blocks |

**Usage**: Invoke skills via `/skill-name` (e.g., `/figma-to-page`) in Claude Code prompts.

---

## Quick Commands

### Setup (First Time)
```bash
# Backend: Python 3.10+ required
cd backend
python3.10 -m venv venv
source venv/bin/activate
pip install -e ".[dev]"

# Frontend
cd frontend
yarn install

# Verify setup
cd frontend && yarn build
cd ../backend && pytest --co -q
```

### Development

**Backend** (FastAPI with reload):
```bash
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (Vite dev server):
```bash
cd frontend
yarn dev  # http://localhost:5173
```

### Design Token Sync

**Rebuild CSS variables from tokens.json** (run from repo root):
```bash
python3 scripts/build-m3-tokens.py  # Generates frontend/src/design/styles/design-tokens.css
cd frontend && npm run kr:validate   # Verify manifest compliance
```

**KR asset pipeline**:
```bash
cd frontend
npm run kr:sync     # Regenerate manifest + hero registry
npm run kr:validate # Validate asset manifest integrity
npm run kr:watch    # Watch assets for changes
```

**Sync tokens to Figma** (after token updates):
```bash
node scripts/sync-tokens-to-figma-vars.mjs
```

### Testing

**Frontend**:
```bash
cd frontend
yarn test                    # Jest (watch mode)
yarn test:coverage          # With coverage report
yarn test:e2e               # Playwright tests
yarn test:e2e:headed        # Headed mode (visual)
```

**Backend**:
```bash
cd backend && source venv/bin/activate
pytest                       # Run all tests
pytest -v --cov=app         # With coverage
```

### Linting & Formatting

**Frontend**:
```bash
cd frontend
yarn lint:fix               # Auto-fix ESLint
yarn format                 # Auto-format Prettier
```

**Backend**:
```bash
cd backend && source venv/bin/activate
black app && isort app && mypy app
```

---

## Architecture Notes

### Frontend Data Flow
- **Components** read from **Zustand stores** (useModeStore, auth store)
- **Services** (`frontend/src/services/`) make API calls via Axios
- **TanStack Query** handles server state caching
- **Routes** are centralized in `config/navigation.tsx`
- **Layouts** apply LaboratoryShell (grid) or GalleryShell (custom) containers
- **ModeSync** in App.tsx auto-switches design mode based on route
- **Design tokens** are consumed via CSS variables (`--sys-color-*`)

### Backend Structure
- **`api/router.py`** aggregates all endpoint routers
- **`api/endpoints/*.py`** = individual resource routers (follow FastAPI convention)
- **`services/*.py`** = business logic (no direct HTTP concerns)
- **`core/database.py`** = SQLAlchemy session management
- **`core/genkit_init.py`** = Genkit model initialization (respects `ENABLE_GENKIT_FLOWS`)
- **`models/database.py`** = SQLAlchemy ORM schemas
- **`schemas/*.py`** = Pydantic validation models
- **Migrations**: `backend/alembic/` (auto-generated via SQLAlchemy 2.0 style)

### AI/Genkit Integration
- **Location**: `ai/flows/backend/` (symlinked as `app/genkit_flows/`)
- **Models**: Gemini 3.0 Flash (speed), Gemini 3.0 Pro (reasoning)
- **Key flows**: `career_application_workflow.py`, `ats_scoring.py`, `advanced_job_matching.py`
- **Enable locally**: Set `ENABLE_GENKIT_FLOWS=true` in `.env.local`
- **Testing**: Use `pytest-mock` to mock Genkit responses; avoid real API calls in unit tests

---

## File Patterns

| Pattern           | Location                                      |
| ----------------- | --------------------------------------------- |
| UI Component      | `frontend/src/components/ui/{Name}.tsx`       |
| Feature Module    | `frontend/src/features/{Name}/index.tsx`      |
| API Route         | `backend/app/api/endpoints/{resource}.py`     |
| Service Logic     | `backend/app/services/{name}_service.py`      |
| Genkit Flow       | `backend/app/genkit_flows/{flow_name}.py`     |
| Design Tokens     | `frontend/src/design/tokens/tokens.json`      |
| CSS Variables     | `frontend/src/styles/design-tokens.css`       |
| Test (Frontend)   | `frontend/src/{feature}/__tests__/{test}.test.tsx` |
| Test (Backend)    | `backend/app/tests/{domain}/{test}.py`        |

---

## Environment Configuration

### Local (`backend/.env.local`, `frontend/.env.local`)
- **Created by**: `./setup-api-keys.sh` (interactive setup)
- **Gitignored**: Never commit secrets
- **Required keys**:
  - Backend: `GENKIT_GOOGLE_API_KEY`, `DATABASE_URL`, `SENTRY_DSN`, etc.
  - Frontend: `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, etc.

### Production
- **Secrets**: Google Cloud Secret Manager
- **Deployment**: `./scripts/deploy.sh production` (requires confirmation + GCP auth)

---

## URLs & Services

- **Staging**: https://careercopilot-staging.web.app
- **Production**: https://careercopilot-468811.web.app
- **Backend local**: http://localhost:8000
- **Frontend local**: http://localhost:5173
- **Storybook**: http://localhost:6006 (`yarn storybook`)
- **GCP Project**: us-central1, careercopilot-468811

---

## Helpful References

- **Python version**: 3.10 minimum (pyproject.toml)
- **Node version**: 18+ (package.json)
- **Design tokens DTCG**: `frontend/src/design/tokens/tokens.json` is the source of truth (complete Kerala Rage system)
- **CSS variables**: `frontend/src/design/styles/design-tokens.css` (auto-generated, `--sys-*` prefix, rebuilt via `python3 scripts/build-m3-tokens.py` from repo root)
- **Token sync to Figma**: `node scripts/sync-tokens-to-figma-vars.mjs`
- **M3 Expressive**: Variable fonts + extreme contrast typography
- **Type safety**: Frontend uses strict TS; backend uses mypy (strict)
- **Pre-commit hooks**: Configured in `.husky/` (auto-rebuilds design tokens on commit)

---

## Design Canon Quick Links

| Doc | Purpose |
|---|---|
| [`docs/design/01_CANON.md`](docs/design/01_CANON.md) | Identity, Manifesto, Cultural Safety, Zero-Flora Rule |
| [`docs/design/02_SYSTEM.md`](docs/design/02_SYSTEM.md) | Palette, Typography, Shape Archetypes, Motion |
| [`docs/design/03_COMPONENTS.md`](docs/design/03_COMPONENTS.md) | Component catalog (NativeAnchor, SolidarityCard, etc.) |
| [`docs/design/04_ASSETS.md`](docs/design/04_ASSETS.md) | Asset IDs (KR-SOLID-XXX), manifest, naming convention |
| [`docs/design/05_FLOWS.md`](docs/design/05_FLOWS.md) | Page-level UX flows and screen placement |
| [`.claude/skills/SKILL_REGISTRY.md`](.claude/skills/SKILL_REGISTRY.md) | 67 agents — pipeline roles, priority tiers |

---

_Tokens are law. Semantic color variables (`--sys-color-*`) are the source of truth. All components consume design tokens, never hardcoded colors. KR Solidarity v6.0 mode only. Zero-Flora. No Jar archetype. No labWrenMetalBlue._
