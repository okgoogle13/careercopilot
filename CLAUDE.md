# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Output Style**: Direct answers. No preamble. No "I'll help you with...". Code first, explanations only when asked.

## Stack

| Layer    | Tech                                   |
| -------- | -------------------------------------- |
| Frontend | React 18 + TS + Vite + Tailwind v4     |
| State    | Zustand + TanStack Query               |
| Backend  | FastAPI + SQLAlchemy + Genkit          |
| Cloud    | GCP us-central1 · Firebase · Cloud Run |
| Design   | **kerala-rage kr-solidarity** (M3 Expressive)    |

## MCP Task Routing ⚠️ MANDATORY

> [!CAUTION]
> These are **mandatory** routing rules. Violating them exhausts your token budget.

Route computationally expensive or bulk tasks to **flash-sidekick** to preserve context window.

| Task Type                   | Route To         | Tool                       |
| --------------------------- | ---------------- | -------------------------- |
| Summarize large files/text  | `flash-sidekick` | `quick_summarize`          |
| Code quality analysis       | `flash-sidekick` | `analyze_code_quality`     |
| Generate unit tests         | `flash-sidekick` | `generate_unit_tests`      |
| Generate docstrings         | `flash-sidekick` | `generate_docstrings`      |
| Batch file analysis         | `flash-sidekick` | `batch_file_analysis`      |
| Extract dependencies        | `flash-sidekick` | `extract_dependencies`     |
| Complex research queries    | `flash-sidekick` | `consult_pro` (Gemini Pro) |
| Web research with citations | `flash-sidekick` | `web_research_synthesis`   |
| Refactoring suggestions     | `flash-sidekick` | `suggest_refactoring`      |

**Keep in Claude** (requires creative judgment):

- UI/UX design decisions
- Code architecture
- Design system compliance audits
- Component implementation with kerala-rage kr-solidarity tokens

### Session Budget

- **Target**: < 150K tokens per complex task
- **Action at 75%**: Stop, summarize, propose new session
- **Forbidden**: Sequential reads of 5+ files, unbatched greps

## Architecture Overview

### Frontend Structure (`/frontend/src`)
```
components/
  ├── ui/                    # kerala-rage design system components
  │   ├── Seed.tsx          # Badge/overlay
  │   ├── Pebble.tsx        # Button
  │   ├── Lens.tsx          # Card container
  │   ├── Jar.tsx           # Dialog/modal
  │   ├── Cabinet.tsx       # Drawer
  │   ├── Stone.tsx         # Heavy component
  │   └── ... (40+ archetypes)
  ├── atomic/               # M3 primitives
  └── shared/               # Shared utilities
features/                   # Feature modules (auth, dashboard, analysis, etc.)
layouts/                    # LaboratoryShell + GalleryShell
stores/                     # Zustand state (useModeStore for Gallery/Laboratory mode)
hooks/                      # useApi, useAnalysis, etc.
design/
  ├── tokens/               # Token definitions
  └── styles/               # CSS variables + Tailwind config
config/
  ├── navigation.tsx        # Route definitions
  └── routeModeMap.ts       # Mode switching rules per route
```

### Backend Structure (`/backend/app`)
```
api/
  ├── router.py             # Main API router
  └── endpoints/            # Resource routers (analysis, applications, documents, workflows, etc.)
genkit_flows/              # AI workflow definitions (40+ flows)
services/                  # Business logic (document parsing, web search, vector storage, etc.)
core/
  ├── database.py           # SQLAlchemy ORM models
  ├── genkit_init.py        # Genkit + Gemini initialization
  └── secure_config.py      # Environment + secrets management
schemas/                   # Pydantic validation models
tests/                     # Pytest suites (api, integration, genkit_flows)
```

## Design System: kerala-rage kr-solidarity

Contemporary Australian dark aesthetic. Dual modes:

| Mode           | Context                | Typography                          | Wallpaper Opacity |
| -------------- | ---------------------- | ----------------------------------- | ----------------- |
| **Gallery**    | User-facing, emotional | Fraunces SOFT=100 WONK=1, Caveat OK | 0.65+             |
| **Laboratory** | Tools, clinical        | Fraunces SOFT=20 WONK=0, NO cursive | 0.05              |

**Anti-Slop Protocol** (strictly enforced):

- ❌ Inter, Roboto, Arial
- ❌ Uniform border-radius
- ❌ Purple gradients
- ✅ Federation Typography Stack (Fraunces, Libre Bodoni, Work Sans, JetBrains Mono)
- ✅ Asymmetric organic shapes
- ✅ Australian botanical palette (Wattle Gold, Waratah Red, Ochre Earth, Gum Leaf Green)

**Palette Reference:**
- Primary: Wattle Gold (`#D4A84B`)
- Secondary: Waratah Red (`#C45C4B`)
- Tertiary: Ochre Earth (`#B8733D`)
- Surface: Asphalt Black (`#1A1714`)
- Text: Paper White (`#F5F0E8`)

**Mode Switching:** `useModeStore` (Zustand) + route-based auto-switching via `routeModeMap.ts`

Tokens: `design-system/tokens.json` (DTCG format)

## AI & Genkit Integration

**Genkit Flows** are the primary way to orchestrate AI operations. Located in `/backend/app/genkit_flows/`.

**Key Flows:**
- `career_application_workflow.py` – Full application preparation
- `ats_scoring.py` – Resume ATS optimization
- `advanced_job_matching.py` – Job-resume matching
- `company_analyzer.py` – Company website analysis
- `company_context.py` – Extract company tone

**Flow Decorators:**
- `@simple_genkit_flow` – Synchronous flow
- `@async_genkit_flow` – Async flow with streaming

**Flow I/O Schema:**
```python
{
  "success": bool,
  "content": str,
  "confidence_score": float,
  "suggestions": list,
  "metadata": dict,
  "error": str | None
}
```

**Enable Genkit:** `ENABLE_GENKIT_FLOWS=true` environment variable

**Models:**
- Speed/streaming: Gemini 3.0 Flash
- Reasoning: Gemini 3.0 Pro
- Keys: `GEMINI_API_KEY` (local) or Secret Manager (production)

## Testing Strategy

**Frontend (Jest + Playwright):**
```bash
yarn test              # Unit/component tests
yarn test:e2e          # Playwright end-to-end
yarn test:e2e:headed   # With browser visible
yarn test:e2e:ui       # Interactive test runner
```

**Backend (Pytest):**
```bash
pytest                              # All tests with coverage
pytest -v app/tests/genkit_flows/   # Specific folder
pytest -k "ats_scoring"             # By pattern
```

**Mocking:** Genkit flows are mocked in tests. Use `cached_ai_operations.py` for cached results when Genkit unavailable.

## API Conventions

**Endpoint Format:**
- Base: `/api`
- Resources: `/api/{resource}` (e.g., `/api/analysis`, `/api/applications`, `/api/documents`)
- Actions: `/api/{resource}/action-name` or POST with action in body

**Response Format:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "optional error message"
}
```

**Frontend Calls Backend:** Always use `useApi()` hook. No direct Firestore access from frontend.

## Development Workflow

**Typical Feature:**
1. Add route: `frontend/src/config/navigation.tsx`
2. Create feature: `frontend/src/features/{Name}/index.tsx`
3. Add API endpoint: `backend/app/api/endpoints/{resource}.py`
4. Register endpoint: `backend/app/api/router.py`
5. Add Genkit flow if AI needed: `backend/app/genkit_flows/{flow}.py`
6. Add tests: `frontend/src/features/{Name}/__tests__/` + `backend/app/tests/api/`

**Design System Token:**
1. Add to `design-system/tokens.json` (DTCG format)
2. Reference in CSS via `var(--token-name)` or Tailwind utilities
3. Test in `/frontend/src/components/debug/TokenTest.tsx`

**Pre-Commit Hooks** (`.pre-commit-config.yaml`):
- Python: Black, isort, mypy, flake8
- Frontend: ESLint, Prettier
- General: trailing whitespace, YAML, JSON, commit message validation

Run manually: `pre-commit run --all`

## Quick Commands

**Setup (first time):**
```bash
# Frontend
cd frontend && yarn install

# Backend
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

**Development (two terminals):**
```bash
# Terminal 1: Backend
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload  # :8000

# Terminal 2: Frontend
cd frontend && yarn dev  # :5173
```

**Testing:**
```bash
cd frontend && yarn test              # Unit tests
cd frontend && yarn test:e2e          # Playwright
cd backend && pytest                  # Backend tests
```

**Linting & Format:**
```bash
cd frontend && yarn lint:fix && yarn format:fix
cd backend && black app && isort app && mypy app
```

**Deployment:**
```bash
./scripts/deploy.sh staging       # → careercopilot-staging.web.app
./scripts/deploy.sh production    # → careercopilot-468811.web.app
```

## File Patterns

| Pattern           | Location                                      |
| ----------------- | --------------------------------------------- |
| UI Component      | `frontend/src/components/ui/{Name}.tsx`       |
| Feature Module    | `frontend/src/features/{Name}/index.tsx`      |
| API Route         | `backend/app/api/endpoints/{resource}.py`     |
| Service Logic     | `backend/app/services/{name}_service.py`      |
| Genkit Flow       | `backend/app/genkit_flows/{flow_name}.py`     |
| Data Model        | `backend/app/models/database.py`              |
| Pydantic Schema   | `backend/app/schemas/{domain}.py`             |
| Design Tokens     | `design-system/tokens.json`                   |
| Test (Frontend)   | `frontend/src/{feature}/__tests__/{test}.test.tsx` |
| Test (Backend)    | `backend/app/tests/{domain}/{test}.py`        |

## Response Guidelines

1. **Code requests** → Output code immediately, no setup narrative
2. **Design questions** → Reference kerala-rage tokens + mode (Gallery/Laboratory), cite `design-system/tokens.json`
3. **Bulk analysis** → Route to flash-sidekick (see MCP Task Routing above)
4. **Debugging** → Identify root cause first, then minimal fix
5. **Architecture** → Diagrams via Mermaid when useful
6. **Genkit flows** → Use decorators, mock in tests, ensure `ENABLE_GENKIT_FLOWS` respected

## Common Issues & Fixes

**Genkit unavailable:**
- Check `ENABLE_GENKIT_FLOWS=true`
- Verify `GEMINI_API_KEY` set
- Check `backend/app/core/genkit_init.py` logs

**Design tokens not applied:**
- Run token validation: check Tailwind integration in `frontend/tailwind.config.ts`
- Ensure CSS variables in `frontend/src/design/styles/design-tokens.css`
- Reference via `var(--token-name)` or Tailwind utilities

**Pre-commit hook fails:**
- Run `pre-commit run --all` to see all failures
- Auto-fix: `black app`, `isort app`, `cd frontend && yarn lint:fix && yarn format:fix`

**Type errors in backend:**
- Run `mypy app/` to check strict mode
- Strict enforced in: `api/`, `core/`, `models/`, `schemas/`, `services/`
- Lenient in: `tests/`, `genkit_flows/`, `ml/`

## Component Template (kerala-rage)

```tsx
interface Props {
  // Props with clear types
}

export const Component: React.FC<Props> = ({ ...props }) => {
  return (
    <div className="/* Tailwind tokens only - use design-system/tokens.json */">
      {/* Use Kerala Rage component archetypes: Seed, Pebble, Lens, Jar, Cabinet, Stone, etc. */}
    </div>
  );
};
```

## Environment Variables

**Frontend (.env or .env.local):**
```bash
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_PROJECT_ID=careercopilot-468811
```

**Backend (.env or .env.local):**
```bash
GEMINI_API_KEY=your_key_here
ENABLE_GENKIT_FLOWS=true
FIREBASE_CREDENTIALS=path_to_credentials
```

**Production:** Secrets in Google Cloud Secret Manager

## Key URLs

- **Staging Frontend:** https://careercopilot-staging.web.app
- **Production Frontend:** https://careercopilot-468811.web.app
- **Backend (local):** http://localhost:8000
- **GCP Region:** us-central1
- **GCP Project:** careercopilot-468811

## References to Keep Nearby

- `.github/workflows/ci.yml` – CI/CD pipeline (parallel jobs: Jest, pytest, E2E, security scans)
- `.pre-commit-config.yaml` – Git hooks (linting, formatting, type checking)
- `README.md` – Quick start & feature overview
- `.github/copilot-instructions.md` – Shorter version for other agents
- `docs/design/` – Design documentation (tokens, typography, voice)
- `backend/app/genkit_flows/README_FLOW_DECORATOR.md` – Genkit flow patterns

## Token Budget

- **Target:** < 150K tokens per complex task
- **Action at 75%:** Summarize, propose new session
- **Avoid:** Sequential reads of 5+ files, unbatched greps (use Task tool with Explore agent)

---

_Token-efficient by design. Route bulk work to sidekicks via MCP Task Routing._
