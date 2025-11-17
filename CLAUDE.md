# Project Commands and Notes

## Email Service (AWS SES)

- **Quick Start**: See [AWS_SES_QUICK_START.md](AWS_SES_QUICK_START.md) for 15-minute setup
- **Full Setup Guide**: [docs/AWS_SES_SETUP.md](docs/AWS_SES_SETUP.md) - Complete AWS SES configuration
- **Migration Summary**: [AWS_SES_MIGRATION_SUMMARY.md](AWS_SES_MIGRATION_SUMMARY.md) - SendGrid → AWS SES changes
- **Setup GCP Secrets**: `./scripts/setup-aws-ses-secrets.sh` - Add AWS credentials to Google Cloud Secret Manager
- **Setup GitHub Secrets**: `./scripts/setup-aws-ses-github-secrets.sh` - Add AWS credentials to GitHub Secrets
- **Email Service**: Uses AWS SES with Gmail sender (100% free, 62k emails/month)

## Configuration Management

### Production Secrets (Google Cloud Secret Manager)

- **Setup Secrets**: `python3 scripts/setup-production-secrets.py` - Interactive production secrets setup
- **Validate Secrets**: `python3 scripts/production-secrets-validator.py` - Validate all production secrets
- **Deployment Checklist**: `python3 scripts/production-secrets-validator.py --checklist` - Generate deployment checklist
- **Environment Template**: `python3 scripts/production-secrets-validator.py --env-template` - Generate .env template
- **Firebase Config**: `python3 scripts/fetch-firebase-config.py` - Fetch Firebase config from Secret Manager for frontend builds

### Development Configuration

- **Interactive Setup**: `./setup-api-keys.sh` - Interactive local development setup
- **Firebase Config**: `python3 scripts/setup-firebase-config.py` - Configure Firebase integration
- **Test Configuration**: `python3 scripts/test-configuration.py` - Validate all configurations
- **Genkit Verification**: `python3 verify_genkit.py` - Verify Genkit AI framework integration

### Secrets Management Flow

```bash
# For Production Deployment:
1. python3 scripts/production-secrets-validator.py  # Check current status
2. python3 scripts/setup-production-secrets.py      # Set up missing secrets
3. python3 scripts/production-secrets-validator.py --checklist  # Final validation

# For Local Development:
1. ./setup-api-keys.sh  # Interactive setup
2. python3 scripts/test-configuration.py  # Validate setup
3. ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py  # Test Genkit integration

# Firebase Configuration from Secret Manager:
# For production builds (requires GOOGLE_CLOUD_PROJECT environment variable):
GOOGLE_CLOUD_PROJECT=careercopilot-468811 python3 scripts/fetch-firebase-config.py --output frontend/.env.production.local
```

## Cache Configuration (Firestore-backed)

The application uses Firebase Cloud Firestore for caching instead of Redis, providing seamless integration with the existing Firebase infrastructure.

- **Collection Name**: `redis_cache` (Firestore collection for storing cached values)
- **Cache Service**: `backend/app/core/firestore_cache.py` - Firestore-backed cache implementation
- **LLM Cache**: `backend/app/ai/llm_service.py` - Uses Firestore cache for LLM responses
- **Cache Middleware**: `backend/app/core/cache_middleware.py` - Automatic cache cleanup and monitoring
- **Features**:
  - Automatic TTL-based expiration (default: 1 hour)
  - Pattern-based cache clearing
  - Cache statistics and monitoring
  - Automatic expired entry cleanup
  - Seamless fallback when Firestore unavailable

## Core Configuration Files

- `.env.local` - Local development environment (not committed)
- `.env.production` - Production template
- `backend/app/core/config.py` - Centralized configuration
- `backend/app/core/secure_config.py` - Secret Manager integration
- `backend/app/core/firestore_cache.py` - Firestore cache (instead of Redis)
- `backend/app/core/genkit_init.py` - Genkit initialization
- `verify_genkit.py` - Genkit health check

## Backend API Development & Integration Skills

### Backend API Scaffolding (NEW - 2025-01-06)

**FastAPI Endpoint Scaffolding:**
- **Skill**: `fastapi-endpoint-scaffolder` - Create new FastAPI endpoints with Pydantic models, tests, and router registration
- **Location**: `.claude/skills/fastapi-endpoint-scaffolder/`
- **Capabilities**:
  - Generate FastAPI endpoint files with proper structure (`backend/app/api/endpoints/`)
  - Create Pydantic request/response models (`backend/app/models/*_schemas.py`)
  - Auto-update router registration (`backend/app/api/router.py`)
  - Generate integration test scaffolds (`backend/app/tests/api/`)
  - Include authentication middleware (Firebase Auth)
  - Standard error handling patterns

**Pydantic Model Scaffolding:**
- **Skill**: `pydantic-model-scaffolder` - Create type-safe Pydantic models for API data validation
- **Location**: `.claude/skills/pydantic-model-scaffolder/`
- **Capabilities**:
  - Generate Request/Response/Database model variants
  - Add field validation rules (email, length, ranges, enums)
  - Create list/pagination response models
  - Include OpenAPI documentation examples
  - Auto-update `backend/app/models/__init__.py`

### Frontend-Backend Integration Analysis (NEW - 2025-01-06)

**Integration Mapping:**
- **Skill**: `frontend-backend-mapper` - Analyze and map frontend API calls to backend endpoints
- **Location**: `.claude/skills/frontend-backend-mapper/`
- **Capabilities**:
  - Scan all frontend API services (`frontend/src/api/*.ts`)
  - Scan all backend endpoints (`backend/app/api/endpoints/*.py`)
  - Generate integration health report (`docs/INTEGRATION_MAP.md`)
  - Detect missing backend endpoints (frontend calls without backend)
  - Identify unused backend endpoints (backend routes without frontend)
  - Find type mismatches (camelCase vs snake_case, type inconsistencies)
  - Calculate integration health score
  - Create visual Mermaid diagrams

**API Contract Validation:**
- **Skill**: `api-contract-validator` - Validate type contracts between TypeScript and Pydantic
- **Location**: `.claude/skills/api-contract-validator/`
- **Capabilities**:
  - Compare TypeScript interfaces vs Pydantic models
  - Detect field name mismatches (camelCase vs snake_case)
  - Identify type inconsistencies (string vs int, optional differences)
  - Validate enum value consistency
  - Generate validation reports with fix recommendations
  - Provide code examples for fixes
  - Distinguish breaking vs non-breaking changes

**Integration Test Scaffolding:**
- **Skill**: `api-integration-test-scaffolder` - Generate E2E integration tests
- **Location**: `.claude/skills/api-integration-test-scaffolder/`
- **Capabilities**:
  - Create tests for frontend → backend → Genkit flow paths
  - Include test scenarios: success, validation, auth, errors
  - Mock Firebase Auth and external services
  - Verify Genkit flow execution
  - Test response validation and type checking
  - Generate comprehensive test suites (`backend/app/tests/integration/`)

### Fullstack Flow Analysis (NEW - 2025-01-06)

**Complete Flow Mapping:**
- **Skill**: `fullstack-flow-mapper` - Trace complete data flows across all layers
- **Location**: `.claude/skills/fullstack-flow-mapper/`
- **Capabilities**:
  - Map Component → Service → Endpoint → Genkit Flow → Database
  - Generate comprehensive flow documentation (`docs/FULLSTACK_FLOWS.md`)
  - Create visual architecture diagrams (Mermaid sequence diagrams)
  - Document data transformations at each layer
  - Track caching strategies and performance metrics
  - Identify optimization opportunities
  - Map error handling patterns

**Fullstack Integration Specialist (NEW - 2025-01-06):**
- **Subagent**: `fullstack-integration-specialist` - Expert orchestrator for full-stack feature development
- **Location**: `.claude/agents/fullstack-integration-specialist.md`
- **Expertise**:
  - Complete stack integration (React → FastAPI → Genkit → Firestore)
  - Full-stack feature planning and architecture
  - Systematic use of all backend and integration skills
  - Integration debugging and troubleshooting
  - API contract design and validation
  - Type safety across stack boundaries
- **When to Use**:
  - Planning new full-stack features
  - Debugging integration issues (422 errors, type mismatches)
  - Analyzing system architecture
  - Generating integration documentation
  - Validating frontend ↔ backend contracts

### Quick Start: Backend API Development

**Create New Endpoint:**
```bash
# Use the fastapi-endpoint-scaffolder skill
# Ask Claude: "Create a new endpoint for user notifications"
# Skill will:
# 1. Create backend/app/api/endpoints/notifications.py
# 2. Create backend/app/models/notification_schemas.py
# 3. Update backend/app/api/router.py
# 4. Generate backend/app/tests/api/test_notifications.py
```

**Validate Integration:**
```bash
# Use the frontend-backend-mapper skill
# Ask Claude: "Map all frontend-backend integrations"
# Generates: docs/INTEGRATION_MAP.md with health report
```

**Check Type Safety:**
```bash
# Use the api-contract-validator skill
# Ask Claude: "Validate all API contracts"
# Generates: docs/API_CONTRACT_VALIDATION.md with mismatches
```

**Document Flows:**
```bash
# Use the fullstack-flow-mapper skill
# Ask Claude: "Map the KSC generation flow"
# Generates: docs/FULLSTACK_FLOWS.md with Mermaid diagrams
```

## Testing & Test Automation

### Current Test Coverage (Updated 2025-11-14)

- **Frontend Components:** 17% (22/128 components tested)
- **Backend APIs:** 85% (comprehensive pytest coverage)
- **E2E Flows:** 90% (7 Playwright tests, 722 lines)
- **Storybook Documentation:** 2.3% (3/128 components)

**Target:** 50% frontend components, 40% Storybook, 95% E2E flows

### Testing Skills

**Jest Test Scaffolder** (`jest-test-scaffolder`)
- Generate React component and hook tests with auto-detected props
- Use `@testing-library/react` + `userEvent` patterns, edge case coverage
- Templates: `component.test.tsx.tpl`, `hook.test.tsx.tpl`

**API Integration Test Scaffolder** (`api-integration-test-scaffolder`)
- Generate backend integration tests with success, validation, auth, error scenarios
- Mock Firebase Auth and Genkit flows, performance assertions

**Storybook Scaffolder** (`storybook-scaffolder`)
- Generate `.stories.tsx` files with variant stories and interaction tests
- Auto-extract component names and props

**Webapp Testing** (`webapp-testing`)
- Generate Playwright E2E tests for user journeys
- Reference: `.claude/skills/webapp-testing/REFERENCE/careercopilot-selectors.md`

**Testing Specialist Subagent** (`testing-specialist`)
- Orchestrates test generation for all layers with coverage analysis
- Integrates with fullstack-integration-specialist, test-runner, code-reviewer

### Test Commands

**Frontend (Jest):**
- `yarn test` - Run all tests
- `yarn test:watch` - Watch mode
- `yarn test:coverage` - Generate coverage report

**Backend (pytest):**
- `pytest backend/app/tests/` - Run all tests
- `pytest backend/app/tests/ --cov` - With coverage

**E2E (Playwright):**
- `yarn test:e2e` - Run all E2E tests
- `yarn test:e2e:headed` - With browser UI

## Jules Delegation Protocol

### Core Rules

1. **Paths**: Always relative (e.g., `./frontend/src/components/`) - start with `./`
2. **Format**: Single continuous line per task, no newlines: `Task: [Components] - [Action] - [Requirements] - [Handover hook]`
3. **Handover Hook**: Append markdown report generation (creates `./.ai_reports/[ComponentName]_report.md`)

### Launch Commands

```bash
# Launch all tasks from tasks.txt:
cat tasks.txt | while IFS= read -r line; do
  jules remote new --repo . --session "$line"
done

# Monitor sessions:
jules remote list
jules remote status --session [batch-name]
```

**Report template:** `# [ComponentName] Status, **Result:** [SUCCESS/FAILURE], **Files Modified:** [List], **Test Coverage:** [Summary], **Pending Actions:** [Next steps]`

---

## Frontend Development & Build Commands

**Development:**
- `yarn dev` - Start Vite development server
- `yarn storybook` - Start Storybook development server

**Building & Validation:**
- `yarn build` - TypeScript compilation + Vite production build
- `yarn preview` - Preview production build locally
- `yarn build-storybook` - Build Storybook for production

**Linting & Formatting:**
- `yarn lint` - Run ESLint (entire project)
- `yarn lint:fix` - Auto-fix ESLint issues
- `yarn lint:ci` - CI-friendly linting
- `yarn format` - Format with Prettier
- `yarn format:check` - Check formatting without changes
- Pre-commit hooks enabled via `husky`

**Deployment Readiness:**
- `./scripts/frontend-deployment-readiness.sh` - Full TypeScript, build, tests, linting, security validation
- `./scripts/typescript-check.sh` - TypeScript type checking
- `./scripts/vite-bundle-analyzer.sh` - Bundle analysis and optimization
- See `scripts/frontend-commands.md` for more details

## Frontend Migration Preparation (Material Design 3)

The project is preparing for automated Material Design 3 (M3) migration. Migration automation skills are being built and will be deployed soon. In the meantime, the codebase must be prepared for seamless automation.

### Current Readiness Status

- **Readiness Score:** 12% (based on initial audit)
- **Target Score:** 70% before migration automation
- **Components:** 126 total
- **With Tests:** 17% (22 components)
- **With Storybook:** 2% (3 components)
- **With Index Exports:** 18% (5 components)

### Migration Preparation Commands

**Quick Start (All-in-One):**
```bash
./scripts/prepare-for-migration.sh
# Interactive script that runs all preparation steps in order
# Creates backups, validates each step, runs TypeScript compilation
```

**Individual Steps:**

1. **Audit Current Structure:**
   ```bash
   ./scripts/audit-component-structure.sh
   # Analyzes component structure and generates readiness report
   ```

2. **Consolidate Duplicate Directories:**
   ```bash
   ./scripts/consolidate-duplicate-dirs.sh
   # Merges Ksc/KSC, renames PascalCase dirs to kebab-case
   # Updates all imports automatically
   ```

3. **Standardize Component Structure:**
   ```bash
   ./scripts/standardize-component-structure.sh --dry-run  # Preview
   ./scripts/standardize-component-structure.sh           # Apply
   # Moves loose files into ComponentName/ directories
   # Creates index.ts barrel exports
   ```

4. **Generate Component Manifest:**
   ```bash
   node scripts/generate-component-manifest.ts
   # Creates component-manifest.json for automation tools
   # Generates component-manifest-summary.md report
   ```

5. **Validate Migration Readiness:**
   ```bash
   ./scripts/pre-migration-validation.sh
   # Runs 10 validation checks
   # Verifies structure, tests, TypeScript, build, linting
   # Exit code 0 = ready, 1 = not ready
   ```

### M3 Migration Skills (In Development)

Located in `.claude/skills/frontend-migration/`:

- **m3-layout-refactor** - Migrates layout patterns to M3 spacing/grid system
- **m3-color-themer** - Applies M3 color system and dynamic color
- **m3-typography-classifier** - Updates typography to M3 type scale
- **m3-editorial-stylist** - Standardizes content/editorial styling
- **m3-shape-refactor** - Applies M3 shape system (corner radius)
- **m3-elevation-refactor** - Migrates shadows to M3 elevation tokens
- **m3-icon-replacer** - Swaps icons to Material Symbols
- **m3-motion-applier** - Adds M3 motion/animation patterns

**Status:** Placeholder files created, implementation in progress

### Documentation

- **Quick Start Guide:** `MIGRATION_PREP_QUICKSTART.md` - Step-by-step instructions
- **Full Readiness Report:** `docs/MIGRATION_READINESS.md` - Comprehensive analysis
- **Component Manifest:** `component-manifest.json` - Generated automation data
- **Manifest Summary:** `component-manifest-summary.md` - Human-readable report

### Preparation Workflow

1. Run audit to assess current state
2. Consolidate duplicate directories (Ksc/KSC)
3. Standardize component structure
4. Generate component manifest
5. Address failing validation checks
6. Generate missing tests (use `jest-test-scaffolder` skill)
7. Generate Storybook stories (use `storybook-scaffolder` skill)
8. Re-run validation until 70%+ readiness
9. Wait for M3 migration skills deployment
10. Run automated migration

### Safety Features

- **Backups:** All scripts create timestamped backups in `./backups/`
- **Dry-Run Mode:** Preview changes before applying
- **TypeScript Validation:** All scripts verify compilation after changes
- **Git Integration:** Changes are trackable and reversible
- **Import Auto-Update:** Scripts automatically update imports after restructuring

## Design System & Aesthetic Direction (Design Wing)

The project includes a comprehensive **Design Wing** infrastructure for creating and managing design systems with full WCAG compliance and accessibility auditing.

### Design Agents (3 Total)

**Visual Design Director** (`visual-design-director`)
- Senior Art Director who defines aesthetic direction and visual vibe
- Analyzes design references and creates `aestheticPreferences` JSON
- Orchestrates design critique using vision analysis
- Hands off complete aesthetic specifications to Design Systems Architect

**Design Systems Architect** (`design-systems-architect`)
- Design Operations specialist who translates aesthetics into tokenized systems
- Receives aesthetic preferences and generates complete token system
- Validates color contrast against WCAG AA/AAA standards
- Builds frontend assets (CSS variables, Tailwind configuration)

**UX & Accessibility Lead** (`ux-accessibility-lead`)
- User advocate who audits designs for accessibility and usability
- Validates WCAG compliance, focus states, and keyboard navigation
- Audits user flows against Nielsen's 10 Usability Heuristics
- Provides actionable remediation recommendations

### Design Skills (4 + PDF Multimodal Skills)

**Design Skills:**
- `design-critique-vision` - Analyzes screenshots for visual quality, hierarchy, spacing, and contrast
- `design-token-generator` - Translates aesthetic preferences into complete design token JSON (color, shape, spacing, elevation, typography)
- `wcag-contrast-checker` - Validates text/background color pairs against WCAG AA/AAA standards
- `ux-heuristic-audit` - Audits user flows against Nielsen's 10 Usability Heuristics

**Document Skills (PDF Multimodal):**
- `pdf-text-extractor` - Extract text, summarize, answer questions, or parse forms from PDF documents
- Includes specialized guides: `forms.md` (structured form extraction), `reference.md` (usage patterns)

### Design System Automation Scripts

- `scripts/validate-design-tokens.py` - Schema validation, WCAG contrast checking, comprehensive error reporting
- `scripts/build-design-tokens.py` - Generates CSS variables (`:root`) and Tailwind configuration patch
- `scripts/update-design-system.sh` - Orchestration script: validates → builds → reports with error handling
- `design-system/` - Directory for storing `tokens.json` and generated assets

### Design System Workflow

```
1. User provides design vibe/reference
   ↓
2. Visual Design Director analyzes & creates aestheticPreferences JSON
   ↓
3. Design Systems Architect generates token system via design-token-generator skill
   ↓
4. WCAG validation via wcag-contrast-checker skill
   ↓
5. Save to design-system/tokens.json
   ↓
6. Build frontend assets: ./scripts/update-design-system.sh
   ↓
7. Frontend Specialist consumes tokens in components (CSS variables)
   ↓
8. UX & Accessibility Lead audits final design for compliance
```

### Quick Start: Create a Design System

```bash
# 1. Define aesthetics with Visual Design Director
# Request: "Create a design system with a 'premium, minimal' aesthetic"

# 2. Design Systems Architect generates tokens (automatic)
# Saves to: design-system/tokens.json

# 3. Build frontend assets
./scripts/update-design-system.sh

# 4. Output generated:
# - frontend/src/styles/design-tokens.css (CSS custom properties)
# - design-system/tailwind-token-patch.js (Tailwind config patch)

# 5. Import in your app
# Add to frontend/src/App.tsx: import './styles/design-tokens.css'

# 6. Use in components
# .button { background-color: var(--sys-color-primary); color: var(--sys-color-on-primary); }
```

## Automated Linting Configuration

- **VS Code Auto-fix**: ESLint auto-fixes on save via `.vscode/settings.json`
- **Pre-commit Hooks**: Automatic linting and formatting via `pre-commit` (install with `pre-commit install`)
- **Workspace Support**: ESLint configured to work with both frontend and functions directories

## Deployment Workflow Scripts

### Main Deployment Script: `./scripts/deploy.sh`

Available targets:

- `./scripts/deploy.sh staging` - Deploy to staging environment
- `./scripts/deploy.sh production` - Deploy to production environment (with safety prompt)
- `./scripts/deploy.sh frontend` - Deploy only frontend
- `./scripts/deploy.sh functions` - Deploy only functions
- `./scripts/deploy.sh backend` - Backend deployment info
- `./scripts/deploy.sh all` - Deploy everything (frontend + functions + backend)

Options:

- `--skip-tests` - Skip running tests
- `--skip-lint` - Skip linting
- `--help` - Show help message

### Test Deployment: `./scripts/test-deployment.sh`

- Tests all deployment components without actual deployment
- Validates dependencies, builds, Firebase config, and project structure
- Run before actual deployment to catch issues early

### Build Commands

- **Frontend**: `yarn build:frontend` (from root) - Build frontend application
- **Functions**: `yarn build:functions` (from root) - Build Firebase functions
- **All**: `yarn build` (from root) - Build both frontend and functions
- **Development Servers**:
  - `yarn dev` (from root) - Start frontend development server
  - `yarn dev:functions` (from root) - Start Functions emulator
- **Cleanup**: `yarn clean` (from root) - Clean all build artifacts
- **Production Deployment**: `./scripts/deploy-production.sh` - Full production deployment
- **Staging Deployment**: `./scripts/deploy-staging.sh` - Deploy to staging environment

### Environment URLs

- Staging: https://careercopilot-staging.web.app
- Production: https://careercopilot-468811.web.app

## Infrastructure Configuration

- **Primary Region**: `us-central1` (consistent across all services)
- **Firebase Functions**: `us-central1`
- **Cloud Run Backend**: `us-central1`
- **Firestore Database**: `us-central1`
- **Cloud Storage**: `us-central1`
- **Vertex AI Vector Search**: `us-central1`
- **Artifact Registry**: `us-central1-docker.pkg.dev`

### Docker Registry Configuration

- **Registry URL**: `us-central1-docker.pkg.dev/PROJECT_ID/careercopilot`
- **Authentication**: `gcloud auth configure-docker us-central1-docker.pkg.dev`
- **Image Format**: `us-central1-docker.pkg.dev/careercopilot-468811/careercopilot/IMAGE:TAG`
- See `docs/DOCKER_REGISTRY_SETUP.md` for detailed configuration guide

## Python Virtual Environment

- Activate venv: `source venv/bin/activate`
- Deactivate: `deactivate`

## NLP Performance Optimization

- **Setup**: `./backend/setup_nlp.sh` - Install spaCy and download models
- **Test**: `python backend/test_nlp_optimization.py` - Benchmark performance improvements
- **Health Check**: `curl http://localhost:8080/nlp/health` - Monitor NLP model status
- **Performance**: 50-100x faster resume parsing (2500ms → 30ms per request)
- **Configuration**: Set `ENABLE_NLP_PRELOAD=true` to enable model caching
- **Documentation**: See `docs/NLP_OPTIMIZATION_GUIDE.md` for complete details

## AI Services Integration

- **API Services**: `frontend/src/api/aiServices.ts` - Frontend API client for AI-powered endpoints
- **Available Services**:
  - `generateKscResponses(jobDescription)` - Generate Key Selection Criteria responses
  - `detectKscCriteria(jobDescription)` - Detect KSC criteria from job descriptions
  - `generateSingleKscResponse(criterion, jobDescription, userProfile?)` - Generate single KSC response
  - `generateCoverLetter(jobDescription, tone)` - Generate tailored cover letters
  - `generateTailoredResume(jobDescription, userProfileId)` - Generate personalized resumes
- **Components**:
  - `CoverLetterGenerator.tsx` - Interactive cover letter generation with tone selection
  - `TailoredResumeGenerator.tsx` - Resume generation with job description tailoring
  - Both components include full API integration, loading states, and error handling

## Genkit AI Framework

- **Configuration**: Set `ENABLE_GENKIT_FLOWS=true` to enable Genkit flows
- **Initialization**: `backend/app/core/genkit_init.py` handles startup and flow registration
- **Health Monitoring**: Genkit health checks integrated into application status
- **API Key**: Requires `GEMINI_API_KEY` environment variable for Google AI integration
- **Verification**: Use `ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py` to test integration

## Additional Tools and Utilities

- **Environment Switching**:
  - `./scripts/switch-to-development.sh` - Switch to development environment
  - `./scripts/switch-to-production.sh` - Switch to production environment
- **Security & Updates**:
  - `./scripts/rotate-api-keys.sh` - Rotate API keys securely
  - `./scripts/check-updates.sh` - Check for dependency updates
  - `./scripts/update-dependencies.sh` - Update project dependencies
- **Testing & Monitoring**:
  - `./scripts/test-vector-search.py` - Test Vertex AI Vector Search functionality
  - `./scripts/test-docker-registry.sh` - Test Docker registry configuration
  - `./scripts/firebase-config-validator.py` - Validate Firebase configuration
- **Setup & Configuration**:
  - `./scripts/setup-everything.sh` - Complete project setup script
  - `./scripts/setup-firebase.sh` - Firebase-specific setup
  - `./scripts/validate-environment.sh` - Validate environment configuration

### Test Infrastructure

**Configuration:**
- `frontend/jest.config.mjs` - Jest ES module config with ts-jest
- `frontend/playwright.config.ts` - Playwright E2E configuration
- `backend/pytest.ini`, `backend/pyproject.toml` - Backend test config
- `frontend/src/setupTests.ts` - Firebase mocks, Material-UI theme, ResizeObserver

**CI/CD Pipeline** (`.github/workflows/ci.yml`):
- Parallel test execution: Frontend (Jest), Backend (pytest), E2E (Playwright)
- Coverage reporting to Codecov
- Security scanning (Bandit, CodeQL)
- Type checking (mypy)
- Artifacts: Coverage reports, E2E screenshots, security reports

## Current Project Status

### Frontend Architecture

- **Framework**: React 18.2.0 + TypeScript 5.0+ with Vite 5.0
- **Styling**: Material-UI v5.18 with Emotion styling engine and Tailwind CSS utilities
- **Component Structure**: Organized component library with comprehensive UI components
  - `ui/` - Base UI components (29 components)
  - `library/` - Reusable business components (15 components)
  - `features/` - Feature-specific components
  - `career/` - Career management components
  - `documents/` - Document handling components
- **State Management**: React Hook Form for forms, React Context for global state
- **Testing**: Jest + React Testing Library with 15s timeout configuration
- **Development Tools**: Storybook for component development and documentation

### Backend & Functions

- **Firebase Functions**: Node.js 20 runtime with TypeScript
- **AI Framework**: Genkit 1.19.1 for AI flow orchestration
- **Dependencies**:
  - Firebase Admin SDK 13.5.0
  - Google AI integration via @genkit-ai/googleai
  - Google Cloud Secret Manager integration
- **Build Process**: TypeScript compilation with separate tsconfig.build.json

### Workspace Configuration

- **Package Manager**: Yarn 4.10.2 with workspace support
- **Workspaces**: Frontend and Functions as separate workspace packages
- **Node Version**: >=18.0.0 required
- **Linting**: Unified ESLint configuration across workspaces
- **Pre-commit**: Husky + lint-staged for automated code quality checks

### Testing Infrastructure

- **Frontend**: Jest with jsdom, React Testing Library, Playwright for E2E
- **Functions**: Jest with comprehensive test coverage
- **CI/CD**: GitHub Actions with parallel test execution
- **Coverage**: Integrated coverage reporting
