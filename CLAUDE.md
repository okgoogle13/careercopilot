# Career Copilot: Claude Development Guidelines

<!-- AUTO-MANAGED: project-description -->
## Project Overview

**Career Copilot** is an AI-powered career assistant application that helps users with:
- Resume tailoring and optimization
- Cover letter generation
- Key Selection Criteria (KSC) response generation
- Job application workflow management

**Tech Stack:**
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python 3.10+) with SQLAlchemy ORM
- **AI/ML**: Genkit Framework, Vertex AI, Anthropic Claude API
- **Cloud Infrastructure**: Google Cloud Platform (us-central1)
- **Deployment**: Firebase Hosting (frontend), Cloud Run (backend)

<!-- END AUTO-MANAGED -->

---

<!-- AUTO-MANAGED: architecture -->
## Repository Structure

```
careercopilot/
├── frontend/                    # React + TypeScript application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Route-level page components
│   │   ├── api/                # API client and service layer
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand state management
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions and helpers
│   │   └── styles/             # Global styles and Tailwind config
│   ├── tests/                  # Jest unit tests & Playwright E2E tests
│   ├── package.json            # Node.js dependencies
│   └── tsconfig.json           # TypeScript configuration
│
├── backend/                     # FastAPI Python backend
│   ├── app/
│   │   ├── api/                # REST API endpoints
│   │   ├── agents/             # AI agents for autonomous tasks
│   │   ├── core/               # Core configurations and utilities
│   │   ├── models/             # Pydantic request/response models
│   │   ├── services/           # Business logic layer
│   │   ├── flows/              # Genkit AI flows
│   │   ├── genkit_flows/       # Advanced Genkit flow implementations
│   │   ├── monitoring/         # Health checks & observability
│   │   └── main.py             # FastAPI application entry
│   ├── tests/                  # pytest unit and integration tests
│   ├── pyproject.toml          # Python dependencies
│   └── requirements.txt         # Pinned dependencies
│
├── functions/                   # Firebase Cloud Functions
│   ├── src/                    # JavaScript/TypeScript functions
│   └── package.json            # Node.js dependencies
│
├── scripts/                     # Deployment & utility scripts
├── .github/workflows/           # CI/CD GitHub Actions
├── docs/                        # Project documentation
└── claude.md                    # This file
```

<!-- END AUTO-MANAGED -->

---

<!-- AUTO-MANAGED: conventions -->
## Frontend Development

### Key Frameworks & Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| React | UI framework | 18.2.0 |
| TypeScript | Type safety | 5.7.0 |
| Vite | Build tool | 7.3.1 |
| Tailwind CSS | Styling | 4.1.18 |
| Zustand | State management | 5.0.8 |
| React Hook Form | Form management | 7.69.0 |
| TanStack Query | Server state | 5.90.12 |
| Radix UI | Accessible components | Latest |
| Framer Motion | Animations | 12.23.26 |
| Playwright | E2E testing | 1.42.1 |
| Jest | Unit testing | 29.7.0 |

### Component Structure

**Location**: `frontend/src/components/`

Components follow a consistent structure:

```typescript
// ComponentName.tsx
interface ComponentProps {
  // Props interface
}

export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
}) => {
  // Implementation
  return <div>{/* JSX */}</div>;
};

export default ComponentName;
```

**Best Practices:**
- Keep components small and focused (single responsibility)
- Use TypeScript for type safety
- Export named exports for easier testing
- Use Tailwind CSS for styling (no inline CSS)
- Leverage Radix UI for accessible primitives
- Prefer functional components with hooks

### Styling Strategy

- **Tailwind CSS v4** for utility-first styling
- **Emotion** for complex styling needs
- **CSS Modules** for component-scoped styles (if needed)
- **Design Tokens**: Use Tailwind config for consistency
- No inline `style` props—use className with Tailwind utilities

### State Management

**Zustand** is the primary state management library:

```typescript
// stores/appStore.ts
import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**React Query** for server state:
- Cache API responses
- Automatic refetching
- Optimistic updates
- Devtools for debugging

### API Integration

**Location**: `frontend/src/api/`

```typescript
// Example: aiServices.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const generateKscResponses = async (jobDescription: string) => {
  const response = await apiClient.post('/api/v1/ksc/generate', {
    jobDescription,
  });
  return response.data;
};
```

**Error Handling:**
- Use try-catch in components
- Display user-friendly error messages via toast notifications (Sonner)
- Log errors to monitoring service

### Form Handling

Use **React Hook Form** with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return <form onSubmit={handleSubmit(onSubmit)}>{/* */}</form>;
};
```

### Testing

**Jest Unit Tests** (`frontend/tests/`):
```bash
yarn test                 # Run all tests
yarn test:watch         # Watch mode
yarn test:coverage      # Coverage report
```

**Playwright E2E Tests** (`frontend/tests/e2e/`):
```bash
yarn test:e2e           # Run all E2E tests
yarn test:e2e:headed    # With browser UI
yarn test:e2e:debug     # Debug mode
```

**Best Practices:**
- Test behavior, not implementation
- Mock API calls in unit tests
- Use React Testing Library for component tests
- Keep tests focused and DRY

### Scripts

```bash
# Development
yarn dev              # Start dev server (port 5173)
yarn type-check      # Type checking
yarn lint            # ESLint check
yarn lint:fix        # Auto-fix lint issues
yarn format          # Format with Prettier

# Building
yarn build           # Production build
yarn preview         # Preview build locally

# Testing
yarn test            # Unit tests
yarn test:coverage   # Coverage report
yarn test:e2e        # E2E tests

# Documentation
yarn storybook       # Component documentation
yarn docs            # Generate JSDoc
```

<!-- END AUTO-MANAGED -->

---

<!-- AUTO-MANAGED: build-commands -->
## Build & Development Commands

**Frontend** (`frontend/`):
- `yarn dev` - Start dev server (port 5173)
- `yarn build` - Production build
- `yarn test` - Jest unit tests
- `yarn test:e2e` - Playwright E2E tests
- `yarn lint` - ESLint check
- `yarn lint:fix` - Auto-fix lint issues

**Backend** (`backend/`):
- `uvicorn backend.app.main:app --reload` - Start dev server
- `pytest backend/app/tests/` - Run tests
- `python -m pytest --cov` - Coverage report
- `./scripts/lint-autofix.sh` - Auto-fix all linting

<!-- END AUTO-MANAGED -->

---

## Backend Development

### Project Layout

**Location**: `backend/app/`

| Directory | Purpose |
|-----------|---------|
| `api/` | REST endpoint handlers (routes) |
| `agents/` | AI agents for autonomous operations |
| `core/` | Config, database, security utilities |
| `models/` | Pydantic request/response schemas |
| `services/` | Business logic and workflows |
| `flows/` | Genkit flow definitions |
| `genkit_flows/` | Advanced AI flow implementations |
| `monitoring/` | Health checks, observability |

### Configuration Management

**Location**: `backend/app/core/`

```python
# config.py - Settings management
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_URL: str = "http://localhost:8000"
    DATABASE_URL: str
    ENABLE_GENKIT_FLOWS: bool = True

    class Config:
        env_file = ".env.local"
        env_file_encoding = "utf-8"

settings = Settings()
```

**Environment Variables**:
- `.env.local` - Local development (git-ignored)
- `.env.production` - Production template
- `Google Cloud Secret Manager` - Production secrets

### API Endpoints

**Location**: `backend/app/api/`

Convention: RESTful endpoints with FastAPI

```python
# endpoints/ksc.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/ksc", tags=["KSC"])

class KSCRequest(BaseModel):
    job_description: str
    user_profile_id: str | None = None

@router.post("/generate")
async def generate_ksc(request: KSCRequest):
    """Generate Key Selection Criteria responses."""
    try:
        result = await service.generate_ksc(request.job_description)
        return {"data": result, "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Best Practices:**
- Use type hints for all parameters and returns
- Validate requests with Pydantic models
- Return structured JSON responses
- Use appropriate HTTP status codes
- Document endpoints with docstrings

### Database

**Technology**: PostgreSQL + SQLAlchemy ORM

```python
# models/user.py
from sqlalchemy import Column, String, Integer
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True)
```

**Migrations**: Use Alembic for schema changes:
```bash
alembic revision --autogenerate -m "Add user table"
alembic upgrade head
```

### Genkit AI Framework

**Enable**: Set `ENABLE_GENKIT_FLOWS=true` in environment

**Location**: `backend/app/genkit_flows/`

```python
# Example Genkit flow
from genkit import define_flow
from genkit_plugin_google_genai import google_genai_model

@define_flow()
async def generate_cover_letter(job_description: str, tone: str = "professional"):
    """Generate a cover letter using Claude AI."""
    model = google_genai_model("gemini-1.5-pro")

    prompt = f"""Generate a {tone} cover letter for:
    {job_description}"""

    response = await model.generate(prompt)
    return response.text
```

### Services Layer

Business logic separated from routes:

```python
# services/ksc_service.py
from backend.app.core.genkit_init import run_genkit_flow

class KSCService:
    @staticmethod
    async def generate_ksc(job_description: str) -> dict:
        """Generate KSC responses using AI."""
        result = await run_genkit_flow(
            "generate_ksc",
            job_description=job_description
        )
        return result
```

### Testing

**pytest** for unit and integration tests:

```bash
pytest backend/app/tests/          # Run all tests
pytest backend/app/tests/ -v       # Verbose output
pytest backend/app/tests/ --cov    # Coverage report
```

**Test Structure**:
```python
# tests/test_ksc_service.py
import pytest
from unittest.mock import patch
from backend.app.services.ksc_service import KSCService

@pytest.mark.asyncio
async def test_generate_ksc():
    with patch('backend.app.genkit_init.run_genkit_flow') as mock_flow:
        mock_flow.return_value = {"responses": []}
        result = await KSCService.generate_ksc("Sample job description")
        assert "responses" in result
```

### Common Commands

```bash
# Setup
source venv/bin/activate          # Activate Python environment
pip install -e .                  # Install in development mode

# Development
uvicorn backend.app.main:app --reload  # Start dev server
python -m pytest                  # Run tests
python verify_genkit.py           # Verify Genkit integration

# Database
alembic upgrade head              # Apply migrations
alembic downgrade -1              # Rollback last migration

# Configuration
python scripts/setup-api-keys.sh  # Local dev setup
python scripts/production-secrets-validator.py  # Validate production
```

---

## Configuration & Secrets

### Local Development

1. **Setup Interactive Configuration**:
   ```bash
   ./setup-api-keys.sh
   ```
   Creates `.env.local` with required API keys.

2. **Required Environment Variables**:
   ```
   VITE_API_URL=http://localhost:8000
   VITE_FIREBASE_PROJECT_ID=careercopilot-468811
   ENABLE_GENKIT_FLOWS=true
   GEMINI_API_KEY=<your-api-key>
   ```

3. **Verify Configuration**:
   ```bash
   python scripts/test-configuration.py
   ENABLE_GENKIT_FLOWS=true python verify_genkit.py
   ```

### Production Secrets

Managed via **Google Cloud Secret Manager**:

```bash
# Check secret status
python scripts/production-secrets-validator.py

# Setup missing secrets interactively
python scripts/setup-production-secrets.py

# Generate deployment checklist
python scripts/production-secrets-validator.py --checklist
```

---

## CI/CD Pipeline

**Workflow**: `.github/workflows/ci.yml`

Runs on: Pull Requests, Pushes to main/develop, Manual dispatch

**Jobs** (all run in parallel):
1. **Frontend Tests**: Jest + ESLint + TypeScript check
2. **Backend Tests**: pytest + type checking (mypy) + Bandit security scan
3. **E2E Tests**: Playwright tests on staging environment
4. **Security**: CodeQL + dependency scanning

**Quality Gates**:
- All tests must pass
- No type errors
- Linting passes
- Security checks pass

**Artifacts**:
- Test coverage reports
- E2E failure screenshots
- Security scan results
- Build logs

---

## Deployment

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:5173 | Local development |
| Staging | https://careercopilot-staging.web.app | Pre-production testing |
| Production | https://careercopilot-468811.web.app | Live application |

### Pre-Deployment Checklist

```bash
# 1. Verify all tests pass locally
yarn test           # Frontend
pytest backend/     # Backend
yarn test:e2e       # E2E

# 2. Validate linting
yarn lint
./scripts/lint-autofix.sh

# 3. Check configurations
python scripts/production-secrets-validator.py --checklist

# 4. Run deployment test
./scripts/test-deployment.sh
```

### Deployment Commands

```bash
# Test deployment without deploying
./scripts/test-deployment.sh

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production (with safety prompt)
./scripts/deploy.sh production

# Deploy specific component
./scripts/deploy.sh frontend    # Frontend only
./scripts/deploy.sh backend     # Backend only
./scripts/deploy.sh functions   # Functions only
```

### Infrastructure

**Primary Region**: `us-central1`

| Service | Purpose | Region |
|---------|---------|--------|
| Cloud Run | Backend API | us-central1 |
| Firebase Hosting | Frontend | us-central1 |
| Firestore | NoSQL database | us-central1 |
| Cloud Storage | File storage | us-central1 |
| Vertex AI | Vector search | us-central1 |
| Artifact Registry | Docker images | us-central1-docker.pkg.dev |

---

## Code Standards & Best Practices

### TypeScript Frontend

**DO**:
- Use strict mode (`strict: true` in tsconfig.json)
- Define interfaces for all component props
- Use const assertions for literals
- Prefer `const` over `let`
- Extract magic strings into constants

**DON'T**:
- Use `any` type without justification
- Add `// @ts-ignore` comments
- Implement components without React.FC<Props> type
- Mutate state directly in Zustand

### Python Backend

**DO**:
- Use type hints for all functions
- Add docstrings to public functions
- Follow PEP 8 style guide
- Use async/await for I/O operations
- Validate inputs with Pydantic models

**DON'T**:
- Use `from module import *`
- Catch bare `Exception`
- Hardcode configuration values
- Skip error handling for external API calls

### Commit Messages

Format: `<type>(<scope>): <description>`

```
feat(frontend): add cover letter generator component
fix(backend): resolve KSC API timeout issues
refactor(core): simplify authentication flow
docs(readme): update deployment instructions
test(e2e): add critical path test for job application
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

---

## Troubleshooting Guide

### Frontend Issues

**Problem**: ESLint pre-commit hook fails
```bash
./scripts/lint-autofix.sh  # Auto-fix issues
yarn lint:fix             # Fix frontend issues only
```

**Problem**: TypeScript compilation errors
```bash
yarn type-check          # Check types
tsc --noEmit             # Verbose type checking
```

**Problem**: Tests fail locally
```bash
yarn test:watch          # Run in watch mode
yarn test:update         # Update snapshots if intentional
```

### Backend Issues

**Problem**: Database migration fails
```bash
alembic current          # Check current revision
alembic history          # View migration history
alembic upgrade head     # Apply latest migrations
```

**Problem**: Genkit integration fails
```bash
ENABLE_GENKIT_FLOWS=true python verify_genkit.py
# Check: GEMINI_API_KEY is set
# Check: Google Cloud credentials configured
```

**Problem**: Uvicorn server won't start
```bash
lsof -i :8000            # Check port 8000
uvicorn backend.app.main:app --reload --port 8001  # Use different port
```

### General Issues

**Authentication error with `gcloud`**:
```bash
gcloud auth application-default login
gcloud auth configure-docker us-central1-docker.pkg.dev
```

**Port already in use**:
```bash
# macOS/Linux
lsof -i :5173            # Frontend port
lsof -i :8000            # Backend port
kill -9 <PID>
```

---

## Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `frontend/src/main.tsx` | React app entry point |
| `backend/app/main.py` | FastAPI app initialization |
| `backend/app/core/config.py` | Configuration management |
| `backend/app/core/database.py` | Database connection setup |
| `frontend/vite.config.ts` | Vite build configuration |
| `.github/workflows/ci.yml` | CI/CD pipeline definition |
| `frontend/jest.config.mjs` | Jest testing configuration |
| `backend/pyproject.toml` | Python dependencies |
| `firebase.json` | Firebase configuration |
| `tailwind.config.js` | Tailwind CSS configuration |

---

## Performance Optimization

### Frontend

- **Code Splitting**: Route-based chunks via Vite
- **Image Optimization**: Use WebP with fallbacks
- **Bundle Analysis**: `./scripts/vite-bundle-analyzer.sh`
- **Lazy Loading**: React.lazy() for route components
- **Memoization**: React.memo() for expensive renders

### Backend

- **Caching**: Redis for frequently accessed data
- **Query Optimization**: Use indexed columns in databases
- **Async Processing**: Background tasks for long operations
- **NLP Performance**: `ENABLE_NLP_PRELOAD=true` for model caching

---

## Security Considerations

- Never commit `.env` files (use `.env.example`)
- Rotate API keys regularly: `./scripts/rotate-api-keys.sh`
- Use Secret Manager for production secrets
- Validate and sanitize all user inputs
- Use HTTPS for all external API calls
- Implement rate limiting on endpoints
- Keep dependencies updated: `./scripts/check-updates.sh`

---

## References & Resources

- **Frontend**: [React docs](https://react.dev), [TypeScript docs](https://www.typescriptlang.org/)
- **Backend**: [FastAPI docs](https://fastapi.tiangolo.com/), [SQLAlchemy docs](https://www.sqlalchemy.org/)
- **AI**: [Genkit docs](https://firebase.google.com/docs/genkit), [Claude API](https://docs.anthropic.com/)
- **Cloud**: [GCP docs](https://cloud.google.com/docs), [Firebase docs](https://firebase.google.com/docs)
- **Testing**: [Jest docs](https://jestjs.io/), [Playwright docs](https://playwright.dev/)

---

## Quick Links

- **Staging**: https://careercopilot-staging.web.app
- **Production**: https://careercopilot-468811.web.app
- **GitHub**: Repository root
- **GCP Console**: us-central1 region
- **Firebase Console**: careercopilot-468811 project

---

<!-- MANUAL -->
## Project Notes & Updates

This section is for manual project-specific notes and updates that won't be auto-modified.

### Custom Development Patterns
- Feature-driven architecture with agents for autonomous AI tasks
- Monorepo structure with frontend, backend, and cloud functions
- Design system compliance tracked with Northcote Curio V3.1

### Known Issues & Workarounds
- Pre-commit hooks occasionally timeout on large Python imports; run `./scripts/lint-autofix.sh` if this occurs
- Genkit flows require `ENABLE_GENKIT_FLOWS=true` to be set before running backend

### Important Contacts & Resources
- Frontend lead: React/TypeScript specialist
- Backend lead: FastAPI/Python specialist
- Infrastructure: GCP us-central1 managed via gcloud CLI

<!-- END MANUAL -->

---

**Last Updated**: January 2026
**Maintained By**: Career Copilot Development Team
**Auto-Memory**: Enabled (v1.0.0)
