# AGENTS.md

Career Copilot is an AI-powered job application assistant built with React, FastAPI, Google Genkit, and Supabase/Postgres (with legacy Firestore artifacts still present). This document guides AI models and coding agents on project conventions, workflows, dependencies, code style, testing, security, and boundaries.

**Note**: This file complements README.md by providing detailed context for AI agents and coding assistants across multiple platforms (GitHub Copilot, OpenAI Codex, Claude, etc.).

## Quick Commands

### Testing & Validation

```bash
# Run all tests
cd frontend && yarn test
cd backend && pytest

# Type check
cd frontend && yarn type-check
cd backend && mypy .

# Format & lint
cd frontend && yarn lint:fix
cd backend && ruff check --fix .
```

### Backend AI Agents

```bash
# Run specific Genkit flow tests
pytest backend/app/tests/genkit_flows/test_ats_scoring.py -v

# Test Genkit flows locally
ENABLE_GENKIT_FLOWS=true pytest backend/app/tests/genkit_flows -v

# Run backend dev server
cd backend && uvicorn app.main:app --reload
```

### Frontend Components

```bash
# Test specific component
cd frontend && yarn test JobQueue.test.tsx

# Build & preview
cd frontend && yarn build && yarn preview

# Run end-to-end tests
cd frontend && yarn test:e2e
```

### Deployment

```bash
# Pre-flight checks
./scripts/test-deployment.sh

# Deploy to staging (requires confirmation)
./scripts/deploy.sh staging

# Deploy to production (requires confirmation)
./scripts/deploy.sh production
```

## Project Overview

**Stack**: React 18 + TypeScript · FastAPI · Google Genkit · Supabase (Postgres/Auth/Storage) · GCP
**Frontend**: `frontend/` (Vite, Tailwind v4, Zustand, TanStack Query, MUI)
**Backend**: `backend/` (FastAPI, SQLAlchemy, Supabase/Postgres, async/await)

### Design System

- **Name**: kerala-rage – Contemporary Australian Design System
- **Foundation**: Material 3 Expressive, dark theme by default
- **Palette**:
  - Background/surface: Asphalt Black `#1A1714`
  - Text: Paper White `#F5F0E8`
  - Primary actions: Wattle Gold `#D4A84B`
  - Alerts/urgency: [DEPRECATED_STYLE] Red `#C45C4B`
  - Structural neutrals: Ochre Earth `#B8733D`, Concrete Grey `#A39B8F`
  - Growth accents: Gum Leaf Green `#6B7F6E`
- **Tokens**:
  - Source of truth: `design-system/tokens.json`
  - CSS variables: `frontend/src/design/styles/kerala-rage.css`
  - Frontend token mirror: `frontend/src/design/tokens/tokens.json`
  - All UI must use these tokens; no hardcoded hex values
- **Aesthetic**:
  - Contemporary Australian, Peter Drew street art influence
  - Australian endemic species as living, present-day symbols
  - Explicitly avoid kerala-streetprint kr-motif plates, museum-cabinet framing, or colonial nostalgia
- **Target Users**: Transitioning to social work, community services, government/nonprofit roles

## Key Technologies

| Layer                  | Tech                                                          | Rationale                                                  |
| ---------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| AI Orchestration       | Google Genkit + `app.core.genkit_init`                         | Standardized flow wiring with fallback to google-generativeai |
| LLM – High Volume      | Gemini 3.0 Flash (runtime) / Gemini 2.5 Flash (service config) | Fast generation and ATS tasks                              |
| LLM – Complex Analysis | Gemini 3.0 Pro / Gemini 2.5 Pro                                | Deep reasoning and analysis                                |
| Document Parsing       | pdfminer.six + python-docx (`IngestionService`)                | PDF/DOCX ingestion and chunking                            |
| Backend API            | FastAPI                                                       | Type safety, async-first, auto OpenAPI docs                |
| Frontend               | React 18 + TS                                                  | Component-driven, strict typing, kerala-rage design tokens  |
| Design System          | kerala-rage Contemporary Australian                            | Material 3 Expressive, dark UI, Australian endemic palette |
| State Management       | React Context + Zustand                                        | Auth context + lightweight global state                    |
| Data Fetching          | TanStack Query + axios                                         | Server state, caching, async requests                      |
| Data Persistence       | Postgres via SQLAlchemy (Supabase) + SQLite dev                | Primary DB with local dev fallback                         |
| Vector Store           | pgvector + Gemini embeddings                                   | Semantic search over career artifacts                      |
| File Storage           | Supabase Storage                                               | Scalable uploads and generated document storage            |
| Hosting                | Cloud Run (backend), Firebase Hosting (frontend)               | Serverless, auto-scaling                                   |

## Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI setup, middleware, routes
│   ├── api/endpoints/             # API route handlers (analysis, documents, workflows, genkit, job_scout, ingest)
│   ├── core/                      # Auth (Supabase JWT), database, Genkit init, config
│   ├── services/                  # Ingestion, vector_store, supabase client
│   ├── agents/                    # Job scout agent
│   ├── genkit_flows/              # Symlink -> ai/flows/backend (Genkit flow definitions)
│   └── tests/                     # Unit & integration tests

ai/
└── flows/backend/                 # Genkit flows (ATS, cover letters, resume optimizer, job analyzer, etc.)

frontend/
├── src/
│   ├── components/                # React components (kerala-rage kr-solidarity compliant)
│   │   ├── kerala-rage/            # Design system components
│   │   └── ui/                    # Shared UI primitives
│   ├── pages/                     # AnalysisPage, IngestionPage, JobQueue
│   ├── api/                       # API services + axios client
│   ├── services/                  # Genkit/AI helpers, mock data
│   ├── context/                   # AuthContext (Supabase)
│   ├── hooks/                     # Custom hooks
│   └── design/                    # Token styles + presets

chrome-extension/

design-system/
└── tokens.json                    # kerala-rage kr-solidarity design tokens (colors, typography, spacing)
```

## Standards & Patterns

### Do

- ✅ Use Supabase client config from `frontend/src/config/supabase.ts` for auth/storage
- ✅ Use Supabase auth helpers in `backend/app/core/auth.py` and `backend/app/core/dependencies.py`
- ✅ Use Genkit flow decorators from `app.genkit_flows.flow_decorator` (`@genkit_flow`, `@async_genkit_flow`)
- ✅ Route high-volume tasks to Gemini Flash (runtime default: 3.0; service config in `ai/config/ai_config.json`)
- ✅ Route complex reasoning to Gemini Pro (3.0/2.5 per service config)
- ✅ Use `IngestionService` for document parsing (pdfminer.six/python-docx) and `VectorStore` for embeddings
- ✅ Implement standardized I/O for all AI flows (Pydantic output schemas)
- ✅ Include confidence scores where the response schema supports it
- ✅ Use async/await in FastAPI endpoints and Genkit flows
- ✅ Use TypeScript strict mode (`tsconfig.json: "strict": true`)
- ✅ Apply kerala-rage kr-solidarity design tokens for all UI (no hardcoded colors)
- ✅ Validate all AI agent inputs before processing
- ✅ Test AI agents with sample user data before deployment
- ✅ Use environment variables for API keys, model configs, and secrets

### Don't

- ❌ Do NOT hard-code API keys or secrets in code
- ❌ Do NOT create monolithic agents—keep to single responsibility
- ❌ Do NOT skip error handling in AI operations
- ❌ Do NOT use localStorage/sessionStorage in generated artifacts
- ❌ Do NOT bypass authentication on protected routes
- ❌ Do NOT store sensitive user data in client-side Zustand state
- ❌ Do NOT query Supabase/Postgres/Firestore directly from React components (use API layer only)
- ❌ Do NOT introduce new Firebase client usage (legacy server-side only)
- ❌ Do NOT commit sensitive files (`.env.local`, API credentials)
- ❌ Do NOT use Inter, Roboto, or Arial fonts (use Fraunces, Caveat, Work Sans from kerala-rage)

## Git Workflow & Safety Boundaries

### ✅ Always OK (no permission needed)

- Read files, run tests, type check, lint, format
- Analyze code quality, create documentation
- Run backend/frontend dev servers locally
- Review existing agents, components, flows
- Write unit tests for components & agents
- Update non-sensitive config (e.g., model names)
- Create feature branches and commits (with clear messages)

### 🤔 Ask First

- Install new npm/pip dependencies
- Modify Supabase RLS/policies, database migrations, or Firestore rules/indexes (legacy)
- Change Genkit flow structure or AI model selection
- Update environment variable requirements
- Delete user data, documents, or collections
- Modify authentication settings
- Deploy to staging or production
- Make breaking changes to API contracts

### 🚫 Never

- **Commit secrets, API keys, credentials** (CRITICAL – check `.gitignore` for `.env.local`, `credentials.json`, `.firebase-key`)
- Modify `.gitignore` to allow secret files (defeats security)
- Force-push to `main` or `develop` (destroys history and collaboration)
- Delete or reset `git history` (unrecoverable for other developers)
- Hard-code secrets in environment setup or configuration files
- Bypass authentication checks or security rules
- Access user data outside authorized endpoints (violates privacy)
- Query Supabase/Postgres/Firestore directly from frontend code (centralize in API layer)
- Store user passwords in plain text (always hash with bcrypt, use Supabase Auth)
- Log sensitive data (PII, API keys, auth tokens) to console or files

**Security Gotchas**:

- Pre-commit hooks verify no secrets leak; if hook fails, fix issues and recommit (never skip with `--no-verify`)
- Genkit flows inherit request auth context; always validate user ownership via Supabase JWT claims and DB records
- Supabase RLS/DB policies + API auth are primary defenses; Firestore rules apply only to legacy tests

## Token Efficiency & MCP Delegation

### MCP Routing Overview (Authoritative)

Use MCP servers to keep context small, reduce latency, and avoid heavy local parsing. When in doubt, **route to the smallest capable MCP tool** rather than doing large reads or complex analysis inline.

**MCP configuration reference:** `/Users/okgoogle13/.gemini/antigravity/mcp_config.json` (current Gemini config). For Claude Desktop setup, see `CLAUDE_DESKTOP_MCP_CONFIG.md`.

**Primary MCP servers used in this repo:**

- **flash-sidekick**: fast analysis over large code/data, batching, and search grounding.
- **design-system-sidekick**: kerala-rage kr-solidarity design validation, token extraction, and visual compliance checks.
- **docker** (when enabled): containerized checks or reproductions that must run in Docker.
- **playwright** (when enabled): UI verification and browser-based checks.

If a task is both large and visual (e.g., "audit multiple UI screens and check token compliance"), **split**: use flash-sidekick for bulk file/context extraction and design-system-sidekick for visual validation.

### Flash Sidekick Mandatory Routing

For tasks involving bulk data, ALWAYS delegate to flash-sidekick MCP server:

| Operation           | Direct (Claude) Cost | Delegated (Flash) Cost | Savings |
| ------------------- | -------------------- | ---------------------- | ------- |
| Read 10 files       | ~50K tokens          | ~2K tokens             | 96%     |
| Grep + read matches | ~30K tokens          | ~1K tokens             | 97%     |
| Generate tests      | ~20K tokens          | ~1K tokens             | 95%     |

### Delegation Rules (Enforced)

```python
# Pseudo-code for agent behavior
if file_lines > 500:
    use flash_sidekick.quick_summarize(file)
elif files_to_analyze > 3:
    use flash_sidekick.batch_file_analysis(files)
elif task == "code_quality":
    use flash_sidekick.analyze_code_quality(code)
elif task == "git_history":
    use flash_sidekick.consult_pro(query)
```

### Design System Sidekick Routing

Use **design-system-sidekick** whenever a task requires **visual validation**, **token extraction**, or **kerala-rage kr-solidarity compliance**. This includes:

- Validating newly generated assets (e.g., wallpaper, motifs, kr-motifs).
- Checking a UI screenshot for palette, density, or typographic compliance.
- Extracting or comparing design tokens from visuals.
- Suggesting prompt refinements for asset regeneration.

If the task involves **code-only styling changes** (e.g., Tailwind classes, token mapping in CSS/TS), use flash-sidekick for bulk reads and analysis, then apply changes locally.

### MCP Task Routing Matrix (Practical)

| Task type                                 | Use MCP server             | Notes                                            |
| ----------------------------------------- | -------------------------- | ------------------------------------------------ |
| Read many files, summarize, find patterns | flash-sidekick             | Prefer batch tools; avoid large local reads.     |
| Code quality scan or lint-like review     | flash-sidekick             | Use analyze_code_quality for findings.           |
| Git history or blame analysis             | flash-sidekick             | Use consult_pro for compact history summaries.   |
| Visual compliance or asset validation     | design-system-sidekick     | Use validate_asset_compliance and related tools. |
| Token extraction from imagery             | design-system-sidekick     | Use extract_visual_design_tokens.                |
| UI regression screenshots or flows        | playwright (if configured) | Use for browser-based checks only.               |
| Container-only reproduction               | docker (if configured)     | Do not use unless explicitly needed.             |

### MCP Failure Handling

If an MCP server is unavailable:

1. Note it explicitly.
2. Offer a fallback approach (local read, smaller scope, or partial summary).
3. Ask whether to proceed with reduced coverage.

### Session Budget Protocol

1. **Start of session**: Estimate task complexity
2. **At 75% budget**: Stop, summarize progress, propose continuation
3. **Never**: Push through expensive operations to "finish"

## API Contracts

Canonical schemas live in:
- `backend/app/api/endpoints/genkit.py`
- `backend/app/api/endpoints/analysis.py`
- `backend/app/api/endpoints/documents.py`
- `backend/app/api/endpoints/ingest.py`

Key endpoints (current):
- `POST /api/genkit/cover-letter/generate`
- `POST /api/genkit/ksc/generate`
- `POST /api/genkit/resume/optimize`
- `POST /api/genkit/company/context`
- `POST /api/genkit/job/analyze-url`
- `POST /api/analysis/optimize-resume`
- `POST /api/ingest/artifacts/upload` (FormData: `file` + `source_type`)

Example: cover letter request (`CoverLetterRequest` in `backend/app/api/endpoints/genkit.py`)

```python
{
    "candidate_profile": {"name": "Jane Doe", "experience": [], "skills": []},
    "job_description": "Senior Case Manager",
    "company_info": {"name": "Community First"},
    "style": "professional",
    "format_type": "full_letter",
    "special_instructions": "Keep it concise"
}
```

## Genkit Flow Patterns

All AI agents must follow this structure:

```python
from pydantic import BaseModel
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.core.genkit_init import get_model

class ExampleResponse(BaseModel):
    content: str

@async_genkit_flow(name="example_flow", output_schema=ExampleResponse)
async def example_flow(prompt: str) -> ExampleResponse:
    if not prompt:
        return ExampleResponse(content="")

    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available")

    response = model.generate(prompt=prompt)
    text = response.text if hasattr(response, "text") else str(response)
    return ExampleResponse(content=text)
```

## Code Examples

### Good: Focused Agent with Error Handling

See [ai/flows/backend/resume_optimizer.py](ai/flows/backend/resume_optimizer.py) for the reference pattern. One clear responsibility, standardized I/O, proper error handling.

### Good: API Route

See [backend/app/api/endpoints/genkit.py](backend/app/api/endpoints/genkit.py). Async FastAPI endpoints calling Genkit flows with input validation and response models.

### Good: React Component with kerala-rage Tokens

See [frontend/src/components/kerala-rage/ActionButton.tsx](frontend/src/components/kerala-rage/ActionButton.tsx). Uses design tokens, no hardcoded colors, TypeScript strict mode.

### Good: Auth Context

See [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx). Wraps Supabase auth, manages auth state, handles token refresh.

### Bad: Direct DB in Component

❌ Avoid calling Supabase/Postgres directly in React components. Use the API layer for centralized auth, error handling, and logging.

### Bad: Monolithic Agent

❌ Avoid agents doing document generation + ATS analysis + parsing. Each should have one responsibility.

## Testing

### Unit Tests - Backend Genkit Flows

```bash
pytest backend/app/tests/genkit_flows/test_ats_scoring.py -v
```

### Unit Tests - React Components

```bash
cd frontend && yarn test JobQueue.test.tsx --coverage
```

### E2E Tests

```bash
cd frontend && npx playwright test tests/e2e/ingestion-flow.spec.ts
```

### Firestore Emulator (Legacy Tests Only)

```bash
firebase emulators:start
# Only needed for legacy Firestore integration tests.
```

## Performance Targets

- Document generation: < 30 seconds
- ATS analysis: < 10 seconds
- Resume parsing: < 15 seconds
- API response times: < 2 seconds (excluding AI processing)

Include timing in agent metadata for monitoring.

## PR Checklist

- [ ] Tests pass: `cd frontend && yarn test` and `cd backend && pytest`
- [ ] Type check passes: `yarn type-check` and `cd backend && mypy .`
- [ ] Linting passes: `yarn lint` and `cd backend && ruff check .`
- [ ] Code follows kerala-rage design system (if UI changes)
- [ ] AI agent I/O matches documented contracts
- [ ] No secrets committed (check `.gitignore`)
- [ ] Commit message format: `feat(scope): description` or `fix(scope): description`
- [ ] If Firestore legacy tests change: run emulator; if Supabase policies change: verify locally

## When Stuck

- **Ambiguous requirements**: Ask clarifying questions about user intent or technical approach
- **Complex workflows**: Propose a plan before implementation; create draft PR for early feedback
- **AI quality issues**: Add failing test reproducing the issue, then modify prompt/model to fix
- **Performance problems**: Profile with monitoring; avoid speculative optimizations
- **Supabase/auth issues**: Validate JWT flow and API dependencies; Firestore emulator only for legacy tests

## Agent & Codex Compatibility

This AGENTS.md file is compatible with:

- **GitHub Copilot** – Provides context for Copilot chat and inline suggestions
- **OpenAI Codex** – Structured per Codex AGENTS.md conventions with environment setup, testing, and style guidance
- **Claude Code** – Full AI agent support with boundary specifications and workflow documentation
- **agents.md standard** – Follows the open agents.md specification for cross-platform compatibility

**For Codex users**: The document is organized for optimal parsing. Run tests with commands listed in "Quick Commands" section. Update this file if project structure or conventions change.

## Domain Knowledge: Community Services

Target users transitioning into:

- Social work roles
- Community services positions
- Government/public sector jobs
- Nonprofit organizations

Key document requirements:

- **KSC (Key Selection Criteria)** responses for government job applications
- **Mission-aligned language** for nonprofit applications
- **STAR methodology** for behavioral examples (Situation, Task, Action, Result)
- **Cultural competency & trauma-informed practice** emphasis
- Community impact and social justice alignment

## Code Style & Conventions

### Python Backend

- **Formatter**: Black (configured in `backend/pyproject.toml`)
- **Linter**: Ruff (configured in `backend/pyproject.toml`); legacy `flake8` config remains in `backend/setup.cfg`
- **Type checking**: mypy (configured in `backend/mypy.ini`, non-strict with overrides)
- **Docstring style**: Google-style docstrings with parameter types
- **Async/await**: Required for all I/O operations (FastAPI routes, Genkit flows)
- **Error handling**: Always return standardized `{"success": bool, "error": str}` responses

### TypeScript Frontend

- **Mode**: `tsconfig.json: "strict": true` (required, no `any` types)
- **Formatter**: Prettier (configured in `.prettierrc`)
- **Linter**: ESLint with TypeScript parser
- **Component style**: Functional components with hooks
- **Styling**: Tailwind CSS with kerala-rage kr-solidarity design tokens only (no hardcoded colors)
- **State management**: Zustand for global state, TanStack Query for server state
- **File naming**: PascalCase for components, camelCase for utilities

### Genkit Flows

- **Naming convention**: `@genkit_flow` / `@async_genkit_flow` from `app.genkit_flows.flow_decorator`
- **Input validation**: Always validate input_data schema first
- **Model selection**: Default to Gemini Flash; escalate to Pro for complex reasoning (see `ai/config/ai_config.json`)
- **Temperature config**: Use service defaults from `ai/config/ai_config.json` unless a flow requires overrides
- **Response format**: Prefer Pydantic output schemas for structured responses

### Supabase & Security

- **Auth**: Validate Supabase JWTs in `backend/app/core/auth.py` and guard routes via dependencies
- **Database**: Enforce least-privilege access; avoid direct client DB access outside the API layer
- **Legacy Firestore**: Keep confined to legacy tests; do not introduce new client usage
- **Secrets**: Store in Google Cloud Secret Manager or `.env.local` (never commit)

### Commit Messages

Format: `<type>(<scope>): <description>`

Examples:

- `feat(agents): Add KSC generator flow for government applications`
- `fix(frontend): Correct ATS score calculation in analysis component`
- `refactor(backend): Simplify ingestion parsing with pdfminer`
- `test(agents): Add integration tests for cover letter generation`
- `docs(agents): Update API contract for document parsing endpoint`

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`

## Development Workflow

### Local Setup

```bash
# Install all dependencies
./scripts/setup-everything.sh

# Activate Python environment
source venv/bin/activate

# Set up local secrets
./setup-api-keys.sh

# Start frontend dev server (port 5173)
cd frontend && yarn dev

# Start backend dev server (port 8000)
cd backend && uvicorn app.main:app --reload
```

### Incremental Development

```bash
# Run specific agent tests while developing
pytest backend/app/tests/genkit_flows/test_ats_scoring.py -v --tb=short

# Type check just your changes
yarn type-check

# Lint and fix only modified files
yarn lint:fix
```

### Before Submitting PR

```bash
# Full validation
./scripts/test-deployment.sh

# Ensure all tests pass
cd frontend && yarn test && cd ../backend && pytest

# Check no secrets are committed
git diff HEAD --name-only | xargs git check-attr filter
```

## Supabase & Storage

### Database

- Primary DB: Postgres via SQLAlchemy (Supabase). See `backend/app/core/database.py` and `backend/app/models/database.py`.
- Vector store: pgvector embeddings in `backend/app/models/document_embedding.py` and `backend/app/services/vector_store.py`.

### Storage

- Supabase Storage bucket configured by `SUPABASE_STORAGE_BUCKET` (default: `user_assets`).
- Client helpers live in `frontend/src/api/storageService.ts`.

### Legacy Firestore

- Firestore schemas remain in `backend/app/models/*_schema.py` and legacy integration tests.
- Use Firestore emulator only if touching those paths.

## Genkit Model Selection

| Model            | Use Case                                           | Notes                                      |
| ---------------- | -------------------------------------------------- | ------------------------------------------ |
| Gemini 3.0 Flash | Default runtime model in Genkit init               | Fast, general-purpose generation           |
| Gemini 3.0 Pro   | Complex reasoning (company research, gap analysis) | Slower, highest reasoning quality          |
| Gemini 2.5 Flash | Service defaults in `ai/config/ai_config.json`     | High-volume tasks and ATS scoring          |
| Gemini 2.5 Pro   | High-quality services (ATS, cover letters)         | Higher quality with higher cost            |
| Gemini 1.5 *     | Fallbacks in `ai/config/ai_config.json`            | Legacy compatibility fallback              |

**Rule of thumb**: Default to Flash. Escalate to Pro only for complex reasoning or multi-step workflows.

## Environment Variables (Development)

```bash
# backend/.env.local (never committed)
DATABASE_URL=sqlite:///data/careercopilot-dev.db
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
SUPABASE_STORAGE_BUCKET=user_assets

ENABLE_GENKIT_FLOWS=true
ENABLE_NLP_PRELOAD=true
GEMINI_API_KEY=<your-key>

# frontend/.env.local (never committed)
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_SENTRY_DSN=<your-sentry-dsn>
VITE_GEMINI_API_KEY=<your-key>
VITE_USE_MOCK_API=true
VITE_USE_MOCK_AUTH=true
VITE_OFFLINE_MODE=false
```

## Deployment

### Staging

```bash
./scripts/deploy.sh staging
# https://careercopilot-staging.web.app
```

### Production

```bash
./scripts/deploy.sh production
# https://careercopilot-468811.web.app
# (Requires confirmation prompt)
```

Pre-flight checks ensure no secrets leak, tests pass, and builds succeed.
