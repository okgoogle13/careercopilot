# CLAUDE.md

Guidance for Claude Code working in this repository.

> **Output**: Code first. No preamble.

---

## Stack

| Layer    | Tech                                   |
| -------- | -------------------------------------- |
| Frontend | React 18 + TS + Vite + Tailwind v4     |
| State    | Zustand + TanStack Query               |
| Backend  | FastAPI + SQLAlchemy + Genkit          |
| Cloud    | GCP us-central1 · Firebase · Cloud Run |
| Design   | **kerala-rage kr-solidarity** (M3 Expressive) |

---

## MCP Task Routing ⚠️ MANDATORY

Route to **flash-sidekick** to preserve context:
- Summarize large files/text → `quick_summarize`
- Code quality analysis → `analyze_code_quality`
- Generate unit tests → `generate_unit_tests`
- Batch file analysis → `batch_file_analysis`
- Complex research → `consult_pro`

**Keep in Claude**: UI/UX decisions, code architecture, design compliance audits

**Budget**:
- Target: < 150K tokens per task
- Action at 75%: stop, summarize, propose new session
- Forbidden: sequential reads of 5+ files, unbatched greps

---

## Design System: kerala-rage kr-solidarity

**Single mode: Solidarity** (unified product experience)

**Truth lives in**:
- Tokens: `design-system/tokens.json` (DTCG)
- CSS Vars: `frontend/src/design/styles/design-tokens.css`
- Archetypes: `frontend/src/components/ui/*` (Seed, Pebble, Lens, Jar, Cabinet, Stone)

**Anti-Slop**:
- ❌ Inter/Roboto/Arial as primary font
- ❌ Uniform border-radius
- ❌ Purple gradients
- ✅ Token-based typography (Fraunces, Work Sans, JetBrains Mono)
- ✅ Asymmetric shapes
- ✅ Palette from tokens (Solidarity Red #C45C4B, Ink Gold #D4A84B, Asphalt Black #1A1714)

**Legacy identifiers** (LaboratoryShell, GalleryShell, useModeStore, routeModeMap.ts) exist but do NOT add new mode-dependent logic.

---

## Architecture

### Frontend (`/frontend/src`)
```
components/ui/          # kerala-rage archetypes (40+)
features/               # Feature modules
layouts/                # Legacy shell names remain
stores/                 # Zustand state
design/tokens/          # Token definitions
config/navigation.tsx   # Routes
```

### Backend (`/backend/app`)
```
api/endpoints/          # Resource routers
genkit_flows/           # AI orchestration (40+ flows)
services/               # Business logic
core/                   # DB, Genkit init, config
schemas/                # Pydantic models
```

**Key Genkit Flows**: `career_application_workflow.py`, `ats_scoring.py`, `advanced_job_matching.py`

**Enable**: `ENABLE_GENKIT_FLOWS=true`
**Models**: Gemini 3.0 Flash (speed), Gemini 3.0 Pro (reasoning)

---

## Quick Commands

**Dev**:
```bash
# Backend
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload

# Frontend
cd frontend && yarn dev
```

**Test**:
```bash
cd frontend && yarn test              # Jest
cd frontend && yarn test:e2e          # Playwright
cd backend && pytest                  # Pytest
```

**Lint**:
```bash
cd frontend && yarn lint:fix && yarn format:fix
cd backend && black app && isort app && mypy app
```

**Deploy**:
```bash
./scripts/deploy.sh staging       # careercopilot-staging.web.app
./scripts/deploy.sh production    # careercopilot-468811.web.app
```

---

## File Patterns

| Pattern           | Location                                      |
| ----------------- | --------------------------------------------- |
| UI Component      | `frontend/src/components/ui/{Name}.tsx`       |
| Feature Module    | `frontend/src/features/{Name}/index.tsx`      |
| API Route         | `backend/app/api/endpoints/{resource}.py`     |
| Service Logic     | `backend/app/services/{name}_service.py`      |
| Genkit Flow       | `backend/app/genkit_flows/{flow_name}.py`     |
| Design Tokens     | `design-system/tokens.json`                   |
| Test (Frontend)   | `frontend/src/{feature}/__tests__/{test}.test.tsx` |
| Test (Backend)    | `backend/app/tests/{domain}/{test}.py`        |

---

## Response Guidelines

1. **Code requests** → output code immediately
2. **Design questions** → cite tokens/components as source of truth
3. **Bulk analysis** → route to flash-sidekick (MCP routing)
4. **Debugging** → root cause first, minimal fix
5. **Genkit flows** → use decorators, mock in tests, respect `ENABLE_GENKIT_FLOWS`

---

## Component Template

```tsx
interface Props {
  // Props with clear types
}

export const Component: React.FC<Props> = (props) => {
  return (
    <div className="/* Tailwind utilities mapped to tokens */">
      {/* Use archetypes: Seed, Pebble, Lens, Jar, Cabinet, Stone */}
    </div>
  );
};
```

---

## Skills

**Central Hub**: `.claude/skills/SKILL_REGISTRY.md` (52+ skills)

**Key skills**:
- Design: `ui-design-evaluator`, `kerala-rage-visual-audit`, `token-orchestrator`
- Scaffold: `component-builder`, `react-page-scaffolder`, `pytest-test-scaffolder`
- Validate: `audit-agent`, `compliance-dashboard`, `auto-validator`
- Generate: `asset-packager`, `batch-processor`

---

## URLs

- Staging: https://careercopilot-staging.web.app
- Production: https://careercopilot-468811.web.app
- Backend (local): http://localhost:8000
- GCP: us-central1, careercopilot-468811

---

_Tokens and archetypes are law. Solidarity mode is the only mode._
