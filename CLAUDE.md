# Career Copilot — Claude Instructions

> **Output Style**: Direct answers. No preamble. No "I'll help you with...". Code first, explanations only when asked.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TS + Vite + Tailwind v4 |
| State | Zustand + TanStack Query |
| Backend | FastAPI + SQLAlchemy + Genkit |
| Cloud | GCP us-central1 · Firebase · Cloud Run |
| Design | **Northcote Curio** (M3 Expressive) |

## MCP Task Routing

Route computationally expensive or bulk tasks to **flash-sidekick** to preserve context window.

| Task Type | Route To | Tool |
|-----------|----------|------|
| Summarize large files/text | `flash-sidekick` | `quick_summarize` |
| Code quality analysis | `flash-sidekick` | `analyze_code_quality` |
| Generate unit tests | `flash-sidekick` | `generate_unit_tests` |
| Generate docstrings | `flash-sidekick` | `generate_docstrings` |
| Batch file analysis | `flash-sidekick` | `batch_file_analysis` |
| Extract dependencies | `flash-sidekick` | `extract_dependencies` |
| Complex research queries | `flash-sidekick` | `consult_pro` (Gemini Pro) |
| Web research with citations | `flash-sidekick` | `web_research_synthesis` |
| Refactoring suggestions | `flash-sidekick` | `suggest_refactoring` |

**Keep in Claude** (requires creative judgment):
- UI/UX design decisions
- Code architecture
- Design system compliance audits
- Component implementation with Northcote Curio tokens

## Design System: Northcote Curio

Victorian naturalist field station aesthetic. Dual modes:

| Mode | Context | Typography | Wallpaper Opacity |
|------|---------|------------|-------------------|
| **Gallery** | User-facing, emotional | Fraunces SOFT=100 WONK=1, Caveat OK | 0.65+ |
| **Laboratory** | Tools, clinical | Fraunces SOFT=20 WONK=0, NO cursive | 0.05 |

**Anti-Slop Protocol** (strictly enforced):
- ❌ Inter, Roboto, Arial
- ❌ Uniform border-radius
- ❌ Purple gradients
- ✅ Federation Typography Stack (Fraunces, Libre Bodoni, Work Sans, JetBrains Mono)
- ✅ Asymmetric organic shapes
- ✅ Australian botanical palette

Tokens: `design-system/tokens.json`

## Quick Commands

```bash
# Frontend
cd frontend && yarn dev          # :5173
yarn build && yarn preview
yarn test && yarn lint:fix

# Backend
cd backend && uvicorn backend.app.main:app --reload  # :8000
pytest backend/app/tests/

# Deploy
./scripts/deploy.sh staging
./scripts/deploy.sh production
```

## File Patterns

| Pattern | Location |
|---------|----------|
| Components | `frontend/src/components/{Name}/{Name}.tsx` |
| Pages | `frontend/src/pages/{name}/index.tsx` |
| API routes | `backend/app/api/endpoints/{resource}.py` |
| Services | `backend/app/services/{name}_service.py` |
| Genkit flows | `backend/app/genkit_flows/{flow_name}.py` |
| Design tokens | `design-system/tokens.json` |

## Component Template

```tsx
interface Props { /* typed */ }

export const Component: React.FC<Props> = ({ ...props }) => {
  return <div className="/* Tailwind tokens only */">{/* */}</div>;
};
```

## Response Guidelines

1. **Code requests** → Output code immediately, no setup narrative
2. **Design questions** → Reference Northcote Curio tokens, cite mode (Gallery/Laboratory)
3. **Bulk analysis** → Route to flash-sidekick, return synthesized result
4. **Debugging** → Identify issue first, then minimal fix
5. **Architecture** → Diagrams via Mermaid when useful

## Environment

```bash
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_PROJECT_ID=careercopilot-468811
ENABLE_GENKIT_FLOWS=true
```

## Key URLs

- Staging: https://careercopilot-staging.web.app
- Production: https://careercopilot-468811.web.app
- GCP: us-central1

---
*Token-efficient by design. Route bulk work to sidekicks.*
