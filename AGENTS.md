# AGENTS.md

<<<<<<< HEAD
Career Copilot is an AI-powered job application assistant built with React, FastAPI, Google Genkit, and Firestore. This document guides AI models and coding agents on project conventions, workflows, dependencies, code style, testing, security, and boundaries.

**Note**: This file complements README.md by providing detailed context for AI agents and coding assistants across multiple platforms (GitHub Copilot, Claude Code, and other compatible agents).
=======
Career Copilot is an AI-powered job application assistant built with React, FastAPI, Google Genkit, and Supabase/Postgres (with legacy Firestore artifacts still present). This document guides AI models and coding agents on project conventions, workflows, dependencies, code style, testing, security, and boundaries.

**Note**: This file complements README.md by providing detailed context for AI agents and coding assistants across multiple platforms (GitHub Copilot, OpenAI Codex, Claude, etc.).
>>>>>>> restoration-KR-Rage-Figma-v2.0

## Quick Commands

### Testing & Validation

```bash
<<<<<<< HEAD
# Run all tests
cd frontend && yarn test
cd backend && pytest backend/app/tests/

# Type check
cd frontend && yarn type-check
cd backend && mypy backend/

# Format & lint
cd frontend && yarn lint:fix
cd backend && ruff check --fix backend/
=======
# Run all tests (from repo root)
(cd frontend && yarn test)
(cd backend && pytest)

# Type check (from repo root)
(cd frontend && yarn type-check)
(cd backend && mypy .)

# Format & lint (from repo root)
(cd frontend && yarn lint:fix)
(cd backend && ruff check --fix .)
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

### Backend AI Agents

```bash
<<<<<<< HEAD
# Run specific agent tests
pytest backend/app/tests/agents/test_document_generator.py -v

# Test Genkit flows locally
ENABLE_GENKIT_FLOWS=true pytest backend/app/tests/agents/ -v

# Run backend dev server
uvicorn backend.app.main:app --reload
=======
# Run specific Genkit flow tests
pytest backend/app/tests/genkit_flows/test_ats_scoring.py -v

# Test Genkit flows locally
ENABLE_GENKIT_FLOWS=true pytest backend/app/tests/genkit_flows -v

# Run backend dev server
cd backend && uvicorn app.main:app --reload
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

### Frontend Components

```bash
# Test specific component
<<<<<<< HEAD
cd frontend && yarn test DocumentGeneration.test.tsx
=======
cd frontend && yarn test JobQueue.test.tsx
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Build & preview
cd frontend && yarn build && yarn preview

# Run end-to-end tests
<<<<<<< HEAD
cd frontend && npx playwright test
=======
cd frontend && yarn test:e2e
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
**Stack**: React 18 + TypeScript · FastAPI · Google Genkit · Firestore · GCP
**Frontend**: `frontend/` (Vite, Tailwind v4, Zustand, TanStack Query)
**Backend**: `backend/` (FastAPI, SQLAlchemy, async/await)
**Design System**: Northcote Curio (M3 variant with Australian botanical palette)
**Target Users**: Transitioning to social work, community services, government/nonprofit roles

## Key Technologies

| Layer                  | Tech                                             | Rationale                                                |
| ---------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| AI Orchestration       | Google Genkit                                    | Native Gemini 1.5 integration, multi-model support       |
| LLM – High Volume      | Gemini 1.5 Flash                                 | Document generation, ATS optimization, parsing           |
| LLM – Complex Analysis | Gemini 1.5 Pro                                   | Company research, multi-step workflows, QA               |
| Document Parsing       | Langextract                                      | Structured resume/document extraction                    |
| Backend API            | FastAPI                                          | Type safety, async-first, auto OpenAPI docs              |
| Frontend               | React 18 + TS                                    | Component-driven, strict typing, Northcote design tokens |
| State Management       | Zustand                                          | Lightweight, no boilerplate                              |
| Data Fetching          | TanStack Query                                   | Server state, caching, sync                              |
| Data Persistence       | Firestore                                        | Real-time, Firebase auth integration                     |
| File Storage           | Cloud Storage                                    | Scalable uploads and generated document storage          |
| Hosting                | Cloud Run (backend), Firebase Hosting (frontend) | Serverless, auto-scaling                                 |
=======
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
  - Source of truth: `frontend/src/design/tokens/tokens.json` (complete Kerala Rage M3 Expressive system)
  - CSS variables: `frontend/src/design/styles/design-tokens.css` (auto-generated)
  - Deprecated legacy file: `design-system/tokens.json` (Material Design 3 only, incomplete — do not use)
  - All UI must use semantic tokens (--sys-color-*); no hardcoded hex values
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
>>>>>>> restoration-KR-Rage-Figma-v2.0

## Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI setup, middleware, routes
<<<<<<< HEAD
│   ├── api/endpoints/             # API route handlers (resumes, cover-letters, analysis, profiles)
│   ├── services/                  # Firebase SDK, authentication, document operations
│   ├── agents/                    # AI agents using Genkit flows
│   │   ├── document_generator.py  # Resume/cover letter generation
│   │   ├── ats_optimizer.py       # ATS scoring, keyword matching
│   │   ├── resume_parser.py       # Document parsing with Langextract
│   │   └── ksc_generator.py       # Key Selection Criteria for government roles
│   ├── genkit_flows/              # Genkit @define_flow definitions
│   └── tests/                     # Unit & integration tests

frontend/
├── src/
│   ├── components/                # React components (Northcote Curio compliant)
│   │   ├── DocumentGeneration/    # Resume/cover letter generation UI
│   │   ├── AtsAnalyzer/           # ATS scoring interface
│   │   ├── ProfileForm/           # User profile input
│   │   └── ui/                    # Design system components
│   ├── pages/                     # Route pages
│   ├── services/                  # API client (apiClient.ts), Firebase SDK usage
│   ├── hooks/                     # useAuth, useProfile, custom hooks
│   ├── types/                     # TypeScript interfaces & contracts
│   └── tests/                     # Jest, Playwright e2e tests

design-system/
└── tokens.json                    # Northcote Curio design tokens (colors, typography, spacing)
=======
│   ├── api/endpoints/             # API route handlers (analysis, documents, workflows, genkit, job_scout, ingest)
│   ├── core/                      # Auth (Supabase JWT), database, Genkit init, config
│   ├── services/                  # Ingestion, vector_store, supabase client
│   ├── agents/                    # Job scout agent
│   ├── genkit_flows/              # Import namespace for Genkit flows (must resolve for `app.genkit_flows.*` imports)
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

## Standards & Patterns

### Do

<<<<<<< HEAD
- ✅ Use Firebase v9 modular SDK (`import { doc } from 'firebase/firestore'`)
- ✅ Use Google Genkit for all AI workflows via `@define_flow` decorators
- ✅ Route high-volume tasks to Gemini 1.5 Flash (document generation, ATS scoring, parsing)
- ✅ Route complex reasoning to Gemini 1.5 Pro (company research, career strategy)
- ✅ Use Langextract exclusively for resume/document parsing
- ✅ Implement standardized I/O for all AI agents (see API Contracts section)
- ✅ Include confidence scores (0-1) and error details in all AI responses
- ✅ Use async/await in FastAPI endpoints and Genkit flows
- ✅ Use TypeScript strict mode (`tsconfig.json: "strict": true`)
- ✅ Apply Northcote Curio design tokens for all UI (no hardcoded colors)
=======
- ✅ Use Supabase client config from `frontend/src/config/supabase.ts` for auth/storage
- ✅ Use Supabase auth helpers in `backend/app/core/auth.py` and `backend/app/core/dependencies.py`
- ✅ Use Genkit flow decorators from `app.genkit_flows.flow_decorator` (`@genkit_flow`, `@async_genkit_flow`) and verify the `app.genkit_flows` import path resolves in your environment
- ✅ Route high-volume tasks to Gemini Flash (runtime default: 3.0; service config in `ai/config/ai_config.json`)
- ✅ Route complex reasoning to Gemini Pro (3.0/2.5 per service config)
- ✅ Use `IngestionService` for document parsing (pdfminer.six/python-docx) and `VectorStore` for embeddings
- ✅ Implement standardized I/O for all AI flows (Pydantic output schemas)
- ✅ Include confidence scores where the response schema supports it
- ✅ Use async/await in FastAPI endpoints and Genkit flows
- ✅ Use TypeScript strict mode (`tsconfig.json: "strict": true`)
- ✅ Apply kerala-rage kr-solidarity design tokens for all UI (no hardcoded colors)
>>>>>>> restoration-KR-Rage-Figma-v2.0
- ✅ Validate all AI agent inputs before processing
- ✅ Test AI agents with sample user data before deployment
- ✅ Use environment variables for API keys, model configs, and secrets

### Don't

<<<<<<< HEAD
- ❌ Do NOT use Firebase v8 legacy SDK
- ❌ Do NOT hard-code API keys or secrets in code
=======
- ❌ Do NOT hard-code API keys or secrets in code
- ❌ Do NOT expose provider secrets in frontend `VITE_*` variables for production builds
>>>>>>> restoration-KR-Rage-Figma-v2.0
- ❌ Do NOT create monolithic agents—keep to single responsibility
- ❌ Do NOT skip error handling in AI operations
- ❌ Do NOT use localStorage/sessionStorage in generated artifacts
- ❌ Do NOT bypass authentication on protected routes
- ❌ Do NOT store sensitive user data in client-side Zustand state
<<<<<<< HEAD
- ❌ Do NOT query Firestore directly from React components (use API layer only)
- ❌ Do NOT commit sensitive files (`.env.local`, API credentials)
- ❌ Do NOT use Inter, Roboto, or Arial fonts (use Fraunces, Caveat, Work Sans from Northcote)
=======
- ❌ Do NOT query Supabase/Postgres/Firestore directly from React components (use API layer only)
- ❌ Do NOT introduce new Firebase client usage (legacy server-side only)
- ❌ Do NOT commit sensitive files (`.env.local`, API credentials)
- ❌ Do NOT use Inter, Roboto, or Arial fonts (use Fraunces, Caveat, Work Sans from kerala-rage)
>>>>>>> restoration-KR-Rage-Figma-v2.0

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
<<<<<<< HEAD
- Modify Firebase security rules or Firestore indexes
=======
- Modify Supabase RLS/policies, database migrations, or Firestore rules/indexes (legacy)
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
- Query Firestore directly from frontend code (centralize in API layer)
- Store user passwords in plain text (always hash with bcrypt, use Firebase Auth)
=======
- Query Supabase/Postgres/Firestore directly from frontend code (centralize in API layer)
- Store user passwords in plain text (always hash with bcrypt, use Supabase Auth)
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Log sensitive data (PII, API keys, auth tokens) to console or files

**Security Gotchas**:

- Pre-commit hooks verify no secrets leak; if hook fails, fix issues and recommit (never skip with `--no-verify`)
<<<<<<< HEAD
- Genkit flows inherit Firebase context; always validate user ownership of data before returning results
- Firestore security rules are the primary defense; misconfigured rules expose user data to public read
=======
- Genkit flows inherit request auth context; always validate user ownership via Supabase JWT claims and DB records
- Supabase RLS/DB policies + API auth are primary defenses; Firestore rules apply only to legacy tests
>>>>>>> restoration-KR-Rage-Figma-v2.0

## Token Efficiency & MCP Delegation

### MCP Routing Overview (Authoritative)

<<<<<<< HEAD
Use MCP servers to keep context small, reduce latency, and avoid heavy local parsing. When in doubt, **route to the smallest capable MCP tool** rather than doing large reads or complex analysis inline.

**MCP configuration reference:** `/Users/okgoogle13/.gemini/antigravity/mcp_config.json` (current Gemini config). For Claude Desktop setup, see `CLAUDE_DESKTOP_MCP_CONFIG.md`.

**Primary MCP servers used in this repo:**
- **flash-sidekick**: fast analysis over large code/data, batching, and search grounding.
- **design-system-sidekick**: Northcote Curio design validation, token extraction, and visual compliance checks.
=======
Use MCP servers to keep context small, reduce latency, and avoid heavy local parsing. Prefer the smallest capable MCP tool first, then fall back to local commands if MCP is unavailable.

Start each session by checking server availability (`list_mcp_resources` / `list_mcp_resource_templates`) rather than assuming specific local config paths.

**Primary MCP servers used in this repo:**

- **flash-sidekick**: fast analysis over large code/data, batching, and search grounding.
- **design-system-sidekick**: kerala-rage kr-solidarity design validation, token extraction, and visual compliance checks.
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **docker** (when enabled): containerized checks or reproductions that must run in Docker.
- **playwright** (when enabled): UI verification and browser-based checks.

If a task is both large and visual (e.g., "audit multiple UI screens and check token compliance"), **split**: use flash-sidekick for bulk file/context extraction and design-system-sidekick for visual validation.

<<<<<<< HEAD
### Flash Sidekick Mandatory Routing

For tasks involving bulk data, ALWAYS delegate to flash-sidekick MCP server:

| Operation           | Direct (Claude) Cost | Delegated (Flash) Cost | Savings |
| ------------------- | -------------------- | ---------------------- | ------- |
=======
### Flash Sidekick Routing

For tasks involving bulk data, prefer `flash-sidekick` when available:

| Operation           | Direct Agent Cost | Delegated (Flash) Cost | Savings |
| ------------------- | ----------------- | ---------------------- | ------- |
>>>>>>> restoration-KR-Rage-Figma-v2.0
| Read 10 files       | ~50K tokens          | ~2K tokens             | 96%     |
| Grep + read matches | ~30K tokens          | ~1K tokens             | 97%     |
| Generate tests      | ~20K tokens          | ~1K tokens             | 95%     |

<<<<<<< HEAD
### Delegation Rules (Enforced)
=======
### Delegation Rules
>>>>>>> restoration-KR-Rage-Figma-v2.0

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

<<<<<<< HEAD
Use **design-system-sidekick** whenever a task requires **visual validation**, **token extraction**, or **Northcote Curio compliance**. This includes:
- Validating newly generated assets (e.g., wallpaper, motifs, specimens).
=======
Use **design-system-sidekick** whenever a task requires **visual validation**, **token extraction**, or **kerala-rage kr-solidarity compliance**. This includes:

- Validating newly generated assets (e.g., wallpaper, motifs, kr-motifs).
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Checking a UI screenshot for palette, density, or typographic compliance.
- Extracting or comparing design tokens from visuals.
- Suggesting prompt refinements for asset regeneration.

If the task involves **code-only styling changes** (e.g., Tailwind classes, token mapping in CSS/TS), use flash-sidekick for bulk reads and analysis, then apply changes locally.

### MCP Task Routing Matrix (Practical)

<<<<<<< HEAD
| Task type | Use MCP server | Notes |
| --- | --- | --- |
| Read many files, summarize, find patterns | flash-sidekick | Prefer batch tools; avoid large local reads. |
| Code quality scan or lint-like review | flash-sidekick | Use analyze_code_quality for findings. |
| Git history or blame analysis | flash-sidekick | Use consult_pro for compact history summaries. |
| Visual compliance or asset validation | design-system-sidekick | Use validate_asset_compliance and related tools. |
| Token extraction from imagery | design-system-sidekick | Use extract_visual_design_tokens. |
| UI regression screenshots or flows | playwright (if configured) | Use for browser-based checks only. |
| Container-only reproduction | docker (if configured) | Do not use unless explicitly needed. |
=======
| Task type                                 | Preferred MCP (if available) | Fallback if unavailable                          |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------ |
| Read many files, summarize, find patterns | flash-sidekick               | `rg` + targeted local file reads                 |
| Code quality scan or lint-like review     | flash-sidekick               | local linters/tests with narrowed scope          |
| Git history or blame analysis             | flash-sidekick               | `git log`, `git show`, `git blame`               |
| Visual compliance or asset validation     | design-system-sidekick       | local token/style inspection                     |
| Token extraction from imagery             | design-system-sidekick       | manual token mapping from design artifacts       |
| UI regression screenshots or flows        | playwright (if configured)   | local Playwright runs                            |
| Container-only reproduction               | docker (if configured)       | local runtime reproduction without Docker        |
>>>>>>> restoration-KR-Rage-Figma-v2.0

### MCP Failure Handling

If an MCP server is unavailable:
<<<<<<< HEAD
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
1. Note it explicitly.
2. Offer a fallback approach (local read, smaller scope, or partial summary).
3. Ask whether to proceed with reduced coverage.

### Session Budget Protocol

1. **Start of session**: Estimate task complexity
<<<<<<< HEAD
2. **At 75% budget**: Stop, summarize progress, propose continuation
3. **Never**: Push through expensive operations to "finish"

## API Contracts

### Document Generation

```python
# POST /api/resumes/tailored
Request:
{
    "user_profile": {
        "name": str,
        "email": str,
        "experience": list[dict],
        "skills": list[str]
    },
    "job_description": str,
    "optimization_level": "balanced" | "aggressive"  # ATS optimization intensity
}

Response:
{
    "success": bool,
    "content": str,  # Generated resume markdown
    "confidence_score": float,  # 0-1
    "metadata": {
        "processing_time_ms": int,
        "tokens_used": int,
        "model": "gemini-1.5-flash"
    },
    "suggestions": [str]  # Actionable improvements
}
```

### AI Analysis

```python
# POST /api/analysis/ats-score
Request: { "resume": str, "job_description": str }

Response:
{
    "success": bool,
    "score": float,  # 0-100 ATS match percentage
    "confidence_score": float,  # 0-1 confidence in score
    "missing_keywords": [str],
    "suggestions": [str],
    "metadata": { "model": "gemini-1.5-flash" }
}
```

### Resume Parsing

```python
# POST /api/documents/parse
Request: FormData with file upload

Response:
{
    "success": bool,
    "profile": {
        "name": str,
        "email": str,
        "phone": str,
        "experience": [dict],
        "skills": [str],
        "education": [dict]
    },
    "confidence_score": float,
    "metadata": { "file_name": str, "pages": int }
=======
2. **When context/runtime gets expensive**: checkpoint progress and continue in smaller batches
3. **Only pause for user confirmation** when a task requires reduced coverage or risk acceptance

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
>>>>>>> restoration-KR-Rage-Figma-v2.0
}
```

## Genkit Flow Patterns

All AI agents must follow this structure:

```python
<<<<<<< HEAD
from genkit import define_flow

@define_flow(name="resume_generator")
async def generate_resume(input_data: dict) -> dict:
    # 1. Validate input schema
    if not input_data.get("user_profile"):
        return {"success": False, "error": "Missing user_profile"}

    # 2. Build prompt with context
    prompt = f"""Generate a tailored resume...
    Profile: {input_data['user_profile']}
    Job: {input_data['job_description']}
    """

    # 3. Call LLM (Flash for generation, Pro for analysis)
    try:
        result = await generate(
            model="gemini-1.5-flash",
            prompt=prompt,
            config={"temperature": 0.7}
        )

        # 4. Return standardized response
        return {
            "success": True,
            "content": result.text,
            "confidence_score": 0.92,
            "suggestions": [],
            "metadata": {"model": "gemini-1.5-flash"}
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "content": None,
            "confidence_score": 0.0
        }
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

## Code Examples

### Good: Focused Agent with Error Handling

<<<<<<< HEAD
See [backend/app/agents/document_generator.py](backend/app/agents/document_generator.py) for the reference pattern. One clear responsibility, standardized I/O, proper error handling.

### Good: API Route

See [backend/app/api/endpoints/resumes.py](backend/app/api/endpoints/resumes.py). Async FastAPI endpoint calling Genkit flow, input validation, response serialization.

### Good: React Component with Northcote Tokens

See [frontend/src/components/DocumentGeneration/DocumentGeneration.tsx](frontend/src/components/DocumentGeneration/DocumentGeneration.tsx). Uses design tokens, no hardcoded colors, TypeScript strict mode, integrates TanStack Query.

### Good: useAuth Hook

See [frontend/src/hooks/useAuth.ts](frontend/src/hooks/useAuth.ts). Wraps Firebase auth, updates Zustand state, handles token refresh.

### Bad: Direct Firestore in Component

❌ Avoid fetching Firestore directly in React components. Routes allow centralized auth, error handling, logging.
=======
See [ai/flows/backend/resume_optimizer.py](ai/flows/backend/resume_optimizer.py) for the reference pattern. One clear responsibility, standardized I/O, proper error handling.

### Good: API Route

See [backend/app/api/endpoints/genkit.py](backend/app/api/endpoints/genkit.py). Async FastAPI endpoints calling Genkit flows with input validation and response models.

### Good: React Component with kerala-rage Tokens

See [frontend/src/components/kerala-rage/ActionButton.tsx](frontend/src/components/kerala-rage/ActionButton.tsx). Uses design tokens, no hardcoded colors, TypeScript strict mode.

### Good: Auth Context

See [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx). Wraps Supabase auth, manages auth state, handles token refresh.

### Bad: Direct DB in Component

❌ Avoid calling Supabase/Postgres directly in React components. Use the API layer for centralized auth, error handling, and logging.
>>>>>>> restoration-KR-Rage-Figma-v2.0

### Bad: Monolithic Agent

❌ Avoid agents doing document generation + ATS analysis + parsing. Each should have one responsibility.

## Testing

<<<<<<< HEAD
### Unit Tests - Backend Agents

```python
# backend/app/tests/agents/test_document_generator.py
import pytest
from backend.app.agents.document_generator import generate_resume

@pytest.mark.asyncio
async def test_generate_resume_success():
    result = await generate_resume({
        "user_profile": {"name": "Alice", "experience": []},
        "job_description": "Software Engineer"
    })
    assert result["success"] == True
    assert len(result["content"]) > 0
    assert 0 <= result["confidence_score"] <= 1
=======
### Unit Tests - Backend Genkit Flows

```bash
pytest backend/app/tests/genkit_flows/test_ats_scoring.py -v
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

### Unit Tests - React Components

```bash
<<<<<<< HEAD
cd frontend && yarn test DocumentGeneration.test.tsx --coverage
=======
cd frontend && yarn test JobQueue.test.tsx --coverage
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

### E2E Tests

```bash
<<<<<<< HEAD
cd frontend && npx playwright test tests/e2e/document-workflow.spec.ts
```

### Firebase Emulator for Security Rules

```bash
firebase emulators:start
# Tests run against local emulator, no live data affected
```

=======
cd frontend && npx playwright test tests/e2e/ingestion-flow.spec.ts
```

### Firestore Emulator (Legacy Tests Only)

```bash
firebase emulators:start
# Only needed for legacy Firestore integration tests.
```

### Mocking & Offline Testing

- Many Python tests mock Genkit or `gemini_pro`. When adding tests, mock external Genkit calls (see tests under `backend/app/tests/genkit_flows/`).
- Use `cached_ai_operations.py` helpers in tests where Genkit is unavailable to avoid hitting live APIs.

>>>>>>> restoration-KR-Rage-Figma-v2.0
## Performance Targets

- Document generation: < 30 seconds
- ATS analysis: < 10 seconds
- Resume parsing: < 15 seconds
- API response times: < 2 seconds (excluding AI processing)

Include timing in agent metadata for monitoring.

## PR Checklist

- [ ] Tests pass: `cd frontend && yarn test` and `cd backend && pytest`
<<<<<<< HEAD
- [ ] Type check passes: `yarn type-check` and `mypy backend/`
- [ ] Linting passes: `yarn lint` and `ruff check backend/`
- [ ] Code follows Northcote design system (if UI changes)
- [ ] AI agent I/O matches documented contracts
- [ ] No secrets committed (check `.gitignore`)
- [ ] Commit message format: `feat(scope): description` or `fix(scope): description`
- [ ] If Firebase changes: tested with emulator
=======
- [ ] Type check passes: `cd frontend && yarn type-check` and `cd backend && mypy .`
- [ ] Linting passes: `cd frontend && yarn lint` and `cd backend && ruff check .`
- [ ] Code follows kerala-rage design system (if UI changes)
- [ ] AI agent I/O matches documented contracts
- [ ] No secrets committed (check `.gitignore`)
- [ ] Commit message format: `feat(scope): description` or `fix(scope): description`
- [ ] If Firestore legacy tests change: run emulator; if Supabase policies change: verify locally
>>>>>>> restoration-KR-Rage-Figma-v2.0

## When Stuck

- **Ambiguous requirements**: Ask clarifying questions about user intent or technical approach
- **Complex workflows**: Propose a plan before implementation; create draft PR for early feedback
- **AI quality issues**: Add failing test reproducing the issue, then modify prompt/model to fix
- **Performance problems**: Profile with monitoring; avoid speculative optimizations
<<<<<<< HEAD
- **Firestore/auth issues**: Use emulator locally; check security rules

## Agent Compatibility
=======
- **Supabase/auth issues**: Validate JWT flow and API dependencies; Firestore emulator only for legacy tests

## Agent & Codex Compatibility
>>>>>>> restoration-KR-Rage-Figma-v2.0

This AGENTS.md file is compatible with:

- **GitHub Copilot** – Provides context for Copilot chat and inline suggestions
<<<<<<< HEAD
- **Claude Code** – Full AI agent support with boundary specifications and workflow documentation
- **agents.md standard** – Follows the open agents.md specification for cross-platform compatibility

**For Claude Code users**: The document is organized for optimal parsing. Run tests with commands listed in "Quick Commands" section. Update this file if project structure or conventions change.
=======
- **OpenAI Codex** – Structured per Codex AGENTS.md conventions with environment setup, testing, and style guidance
- **Claude Code** – Full AI agent support with boundary specifications and workflow documentation
- **agents.md-style conventions** – Structured for cross-platform parsing and low-ambiguity execution

**For Codex users**: The document is organized for optimal parsing. Run tests with commands listed in "Quick Commands" section. Update this file if project structure or conventions change.

### Codex-High Optimization Notes

- Use copy/paste-safe commands that do not depend on previous `cd` state.
- Prefer repo-relative paths over machine-specific absolute paths.
- Keep routing rules explicit with MCP fallback behavior when servers are unavailable.
- Favor deterministic checks (tests, type checks, lint) before subjective review.
>>>>>>> restoration-KR-Rage-Figma-v2.0

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

<<<<<<< HEAD
- **Formatter**: Ruff format (configured in `pyproject.toml`)
- **Linter**: Ruff check (replace legacy Black/Flake8)
- **Type checking**: mypy strict mode
- **Docstring style**: Google-style docstrings with parameter types
- **Async/await**: Required for all I/O operations (FastAPI routes, Genkit flows)
- **Error handling**: Always return standardized `{"success": bool, "error": str}` responses
=======
- **Formatter**: Black (configured in `backend/pyproject.toml`)
- **Linter**: Ruff (configured in `backend/pyproject.toml`); legacy `flake8` config remains in `backend/setup.cfg`
- **Type checking**: mypy (configured in `backend/mypy.ini`, non-strict with overrides)
- **Docstring style**: Google-style docstrings with parameter types
- **Async/await**: Required for all I/O operations (FastAPI routes, Genkit flows)
- **Error handling**: Use typed success response models and raise `HTTPException` for API errors; use standardized result objects in service/worker layers where applicable
>>>>>>> restoration-KR-Rage-Figma-v2.0

### TypeScript Frontend

- **Mode**: `tsconfig.json: "strict": true` (required, no `any` types)
- **Formatter**: Prettier (configured in `.prettierrc`)
- **Linter**: ESLint with TypeScript parser
- **Component style**: Functional components with hooks
<<<<<<< HEAD
- **Styling**: Tailwind CSS with Northcote Curio design tokens only (no hardcoded colors)
=======
- **Styling**: Tailwind CSS with kerala-rage kr-solidarity design tokens only (no hardcoded colors)
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **State management**: Zustand for global state, TanStack Query for server state
- **File naming**: PascalCase for components, camelCase for utilities

### Genkit Flows

<<<<<<< HEAD
- **Naming convention**: `@define_flow(name="snake_case_flow_name")`
- **Input validation**: Always validate input_data schema first
- **Model selection**: Default to Gemini 1.5 Flash; escalate to Pro for complex reasoning
- **Temperature config**: `{"temperature": 0.7}` for generation, `0.3` for analysis
- **Response format**: Always return standardized response with `success`, `content`, `confidence_score`, `metadata`

### Firebase & Security

- **SDK version**: Firebase v9 modular SDK only (no legacy SDK)
- **Auth**: Always check `request.auth != null` before user operations
- **Firestore queries**: Never expose raw queries from frontend (use API layer)
=======
- **Naming convention**: `@genkit_flow` / `@async_genkit_flow` from `app.genkit_flows.flow_decorator`
- **Input validation**: Always validate input_data schema first
- **Model selection**: Default to Gemini Flash; escalate to Pro for complex reasoning (see `ai/config/ai_config.json`)
- **Temperature config**: Use service defaults from `ai/config/ai_config.json` unless a flow requires overrides
- **Response format**: Prefer Pydantic output schemas for structured responses

### Supabase & Security

- **Auth**: Validate Supabase JWTs in `backend/app/core/auth.py` and guard routes via dependencies
- **Database**: Enforce least-privilege access; avoid direct client DB access outside the API layer
- **Legacy Firestore**: Keep confined to legacy tests; do not introduce new client usage
>>>>>>> restoration-KR-Rage-Figma-v2.0
- **Secrets**: Store in Google Cloud Secret Manager or `.env.local` (never commit)

### Commit Messages

Format: `<type>(<scope>): <description>`

Examples:

- `feat(agents): Add KSC generator flow for government applications`
- `fix(frontend): Correct ATS score calculation in analysis component`
<<<<<<< HEAD
- `refactor(backend): Simplify resume parsing with Langextract`
=======
- `refactor(backend): Simplify ingestion parsing with pdfminer`
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
uvicorn backend.app.main:app --reload
=======
cd backend && uvicorn app.main:app --reload
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

### Incremental Development

```bash
# Run specific agent tests while developing
<<<<<<< HEAD
pytest backend/app/tests/agents/test_document_generator.py -v --tb=short

# Type check just your changes
yarn type-check

# Lint and fix only modified files
yarn lint:fix
=======
pytest backend/app/tests/genkit_flows/test_ats_scoring.py -v --tb=short

# Type check just your changes
(cd frontend && yarn type-check)

# Lint and fix only modified files
(cd frontend && yarn lint:fix)
>>>>>>> restoration-KR-Rage-Figma-v2.0
```

### Before Submitting PR

```bash
# Full validation
./scripts/test-deployment.sh

# Ensure all tests pass
<<<<<<< HEAD
cd frontend && yarn test && cd ../backend && pytest
=======
(cd frontend && yarn test)
(cd backend && pytest)
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Check no secrets are committed
git diff HEAD --name-only | xargs git check-attr filter
```

<<<<<<< HEAD
## Firestore & Cloud Storage

### Collection Structure

- `/users/{uid}/profiles/{profileId}` — User profiles (skills, experience)
- `/users/{uid}/documents/{docId}` — Generated resumes, cover letters
- `/users/{uid}/jobs/{jobId}` — Saved job opportunities
- `/templates/` — Document templates (global, admin-writable)

### Cloud Storage Paths

- `/users/{uid}/uploads/` — User-uploaded documents
- `/users/{uid}/generated/` — AI-generated documents
- `/templates/` — Template assets and previews

### Security Rules

- All user data requires authentication (`request.auth != null`)
- Users can only access their own data (`request.auth.uid == resource.data.userId`)
- Templates are publicly readable, admin-writable only

## Genkit Model Selection

| Model            | Use Case                                     | Speed  | Cost | Quality   |
| ---------------- | -------------------------------------------- | ------ | ---- | --------- |
| Gemini 1.5 Flash | Document generation, ATS, keyword extraction | < 5s   | Low  | Good      |
| Gemini 1.5 Pro   | Company research, strategy, QA               | 10-20s | High | Excellent |
=======
## Frontend Readiness & Build Diagnostics

Use these before deploy or when debugging build issues:

1. **Validate build locally**:
   - `yarn install` then `yarn build:frontend`
   - Verify `frontend/dist` contains `index.html` and assets.
2. **Helper scripts**:
   - `./scripts/frontend-readiness.sh`: Installs deps, builds, and verifies artifacts.
   - `./scripts/prep-production-env.sh`: Creates `frontend/.env.production.local` using `scripts/fetch-firebase-config.py`.
3. **Preview production build**:
   - `cd frontend && yarn preview`
4. **Hosting Emulator**:
   - `firebase emulators:start --only hosting` to replicate hosting behavior.

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
>>>>>>> restoration-KR-Rage-Figma-v2.0

**Rule of thumb**: Default to Flash. Escalate to Pro only for complex reasoning or multi-step workflows.

## Environment Variables (Development)

```bash
<<<<<<< HEAD
# .env.local (never committed)
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_PROJECT_ID=careercopilot-468811
FIREBASE_EMULATOR_HOST=localhost:8080

ENABLE_GENKIT_FLOWS=true
ENABLE_NLP_PRELOAD=true

GEMINI_API_KEY=<your-key>
LANGEXTRACT_API_KEY=<your-key>
=======
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
# Provider API keys should stay backend-only in production.
# Legacy/local-only fallback (avoid in production):
# VITE_GEMINI_API_KEY=<your-key>
VITE_USE_MOCK_API=true
VITE_USE_MOCK_AUTH=true
VITE_OFFLINE_MODE=false
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
=======

## Production Troubleshooting (https://careercopilot-468811.web.app)

### Quick Triage Checklist
1. **Firebase Console**: Check Hosting status & deploy history (look for recent errors).
2. **Build Artifacts**: Confirm `frontend/dist` was uploaded and `firebase.json` points to it.
3. **Rewrites**: Verify single-page app rewrite (`source: "**"`, `destination: "/index.html"`) in `firebase.json`.
4. **Env Vars**: Confirm `frontend/.env.production` keys were present at build time.
5. **Backend Logs**: Inspect Cloud Functions / Cloud Run logs for 5xx errors.

### Common Issues
- **Stale CDN**: Hosting caches `/static/**`. If users see old assets, try `firebase hosting:channel:deploy` or redeploy.
- **Missing Config**: If API calls fail, ensure `scripts/fetch-firebase-config.py` ran before build.
- **404s**: Check `index.html` references correct hashed filenames.
- **Auth Failures**: Verify Firebase project ID matches the hosted site.

### Diagnostics
- **Cloud Functions Logs**: Filter `severity=ERROR` in GCP Console.
- **Cloud Run Logs**: Query `resource.type="cloud_run_revision" AND severity>=ERROR`.
- **Sentry**: Check DSN in `backend/app/core/secure_config.py`.

### Quick Rollback
- **Clone Channel**: `firebase hosting:clone <source> <target>`
- **Redeploy Function**: `firebase deploy --only functions:functionName` found in `functions/` workspace.
>>>>>>> restoration-KR-Rage-Figma-v2.0
