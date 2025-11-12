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

## Configuration Files

- `.env.local` - Local development environment variables (not committed)
- `.env.production` - Production environment template
- `backend/app/core/config.py` - Centralized configuration management
- `backend/app/core/secure_config.py` - Secure settings with Secret Manager integration
- `backend/app/core/secret_manager.py` - Google Cloud Secret Manager integration
- `backend/app/core/firestore_cache.py` - Firestore-backed cache service
- `backend/app/core/genkit_init.py` - Genkit AI framework initialization and flow management
- `verify_genkit.py` - Genkit verification and health check script

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

## Testing Infrastructure & Automation Skills

### Testing Skills & Subagents (NEW - 2025-01-06)

**Current Test Coverage:**
- **Frontend Components:** 10.6% (12/113 components tested)
- **Backend APIs:** 85% (comprehensive pytest coverage)
- **E2E Flows:** 90% (7 Playwright tests, 722 lines)
- **Storybook Documentation:** 3.5% (4/113 components)

**Coverage Goals:**
- **Frontend Target:** 50% (56 components)
- **Storybook Target:** 40% (45 components)
- **E2E Target:** 95% (10+ critical flows)

### Frontend Unit Test Generation (NEW)

**Jest Test Scaffolder:**
- **Skill**: `jest-test-scaffolder` - Generate React component and hook tests
- **Location**: `.claude/skills/jest-test-scaffolder/`
- **Capabilities:**
  - Auto-detect component props from TypeScript
  - Generate render tests, interaction tests, accessibility tests
  - Use `@testing-library/react` + `userEvent` patterns
  - Support component and custom hook testing
  - Include edge cases (disabled, loading, error states)
  - Generate TODO placeholders for manual test additions
- **Templates:**
  - `component.test.tsx.tpl` - Component test template
  - `hook.test.tsx.tpl` - React hook test template
- **Pattern:** Matches existing `Button.test.tsx` (36 lines, 3 tests)
- **Usage:**
  ```bash
  # Ask Claude: "Create tests for {{ComponentName}}"
  # Generates: src/components/.../__ tests__/{{ComponentName}}.test.tsx
  # Run: yarn test {{ComponentName}}
  ```

### Backend Unit Test Generation (Planned)

**Pytest Test Scaffolder:**
- **Skill**: `pytest-test-scaffolder` (Pending - Week 2)
- **Location**: `.claude/skills/pytest-test-scaffolder/` (To be created)
- **Capabilities:**
  - Generate unit tests for Python functions/classes
  - Create fixtures for dependencies
  - Include happy path + error scenarios
  - Use pytest markers (unit, integration, asyncio)
  - Mock external dependencies
- **Templates:**
  - `unit_test.py.tpl` - Synchronous test template
  - `async_test.py.tpl` - Async function test template
  - `fixture.py.tpl` - Shared fixture template
- **Pattern:** Matches existing `test_ksc_integration.py` (268 lines)

### Integration Test Scaffolding

**API Integration Test Scaffolder:**
- **Skill**: `api-integration-test-scaffolder` - Generate backend integration tests
- **Location**: `.claude/skills/api-integration-test-scaffolder/`
- **Capabilities:**
  - Create comprehensive E2E API tests
  - Test scenarios: success, validation, auth, errors, concurrent requests
  - Mock Firebase Auth and Genkit flows
  - Include performance assertions (response time < 10s)
  - Validate response structure and types
- **Template:** `integration_test.py.tpl` (✅ NOW COMPLETE)
- **Target:** `backend/app/tests/integration/test_{{feature_name}}_integration.py`
- **Usage:**
  ```bash
  # Ask Claude: "Test {{endpoint_name}} integration"
  # Generates: backend/app/tests/integration/test_{{feature}}_integration.py
  # Run: pytest backend/app/tests/integration/ -v
  ```

### Component Documentation

**Storybook Scaffolder:**
- **Skill**: `storybook-scaffolder` - Generate Storybook stories
- **Location**: `.claude/skills/storybook-scaffolder/`
- **Capabilities:**
  - Create `.stories.tsx` files from component
  - Auto-extract component name and props
  - Generate variant stories (Primary, Secondary, sizes, colors)
  - Add interaction tests with `@storybook/test`
  - Include accessibility addon usage
- **Template:** `story.tsx.tpl`
- **Usage:**
  ```bash
  # Ask Claude: "Create story for {{ComponentName}}"
  # Generates: src/components/.../{{ComponentName}}.stories.tsx
  # Run: yarn storybook
  ```

### E2E Test Generation

**Webapp Testing (Playwright):**
- **Skill**: `webapp-testing` - Generate Playwright E2E tests
- **Location**: `.claude/skills/webapp-testing/`
- **Capabilities:**
  - Write new E2E tests for user journeys
  - Run existing Playwright test suites
  - Use stable `data-testid` selectors
  - Include accessibility and mobile testing
  - Consult selector reference guide
- **Reference:** `.claude/skills/webapp-testing/REFERENCE/careercopilot-selectors.md`
- **Target:** `frontend/tests/{{feature_name}}.spec.js`
- **Usage:**
  ```bash
  # Ask Claude: "Test {{feature_name}} end-to-end"
  # Generates: frontend/tests/{{feature_name}}.spec.js
  # Run: npx playwright test
  ```

### Testing Orchestration (NEW)

**Testing Specialist Subagent:**
- **Subagent**: `testing-specialist` - Expert test automation and QA specialist
- **Location**: `.claude/agents/testing-specialist.md`
- **Expertise:**
  - Test generation for all layers (frontend, backend, integration, E2E)
  - Coverage analysis and improvement (10.6% → 50% target)
  - Test quality assurance and pattern enforcement
  - Test data management and fixture creation
  - Integration with other specialists (fullstack, test-runner, code-reviewer)
- **Responsibilities:**
  1. **Test Generation:**
     - Use `jest-test-scaffolder` for React components
     - Use `pytest-test-scaffolder` for Python functions
     - Use `api-integration-test-scaffolder` for API endpoints
     - Use `storybook-scaffolder` for component documentation
     - Use `webapp-testing` for E2E user journeys
  2. **Coverage Analysis:**
     - Run `yarn test:coverage` and `pytest --cov`
     - Identify untested critical paths (89.4% components uncovered)
     - Prioritize by user impact
     - Track progress toward 50% target
  3. **Quality Assurance:**
     - Review test patterns and best practices
     - Enforce React Testing Library standards
     - Ensure accessibility testing
     - Refactor brittle/flaky tests
  4. **Proactive Testing:**
     - Automatically generate tests for new components
     - Flag PRs without test coverage
     - Report weekly coverage metrics
- **When to Use:**
  - "Create tests for {{ComponentName}}"
  - "Improve test coverage to 50%"
  - "Test {{endpoint_name}} integration"
  - "Generate Storybook story for {{ComponentName}}"
  - "Fix failing tests in {{TestFile}}"
- **Collaboration:**
  - Works with `fullstack-integration-specialist` on full-stack feature tests
  - Reports to `test-runner` for test execution
  - Coordinates with `code-reviewer` on quality checks

### Quick Start: Testing Workflows

**Generate Component Tests:**
```bash
# Ask Claude: "Create tests for the Badge component"
# testing-specialist uses jest-test-scaffolder:
# 1. Reads src/components/ui/Badge/Badge.tsx
# 2. Extracts props: { children, variant, size, color }
# 3. Generates __tests__/Badge.test.tsx (5 tests)
# 4. Runs: yarn test Badge
# 5. Reports: ✅ 5/5 tests passing, coverage 100%
```

**Improve Coverage:**
```bash
# Ask Claude: "Improve frontend test coverage to 50%"
# testing-specialist:
# 1. Runs yarn test:coverage (current: 10.6%)
# 2. Identifies 44 critical components needing tests
# 3. Generates tests systematically (10/week for 4 weeks)
# 4. Tracks progress: Week 1 (20%), Week 2 (35%), Week 3 (45%), Week 4 (50%)
```

**Generate Integration Tests:**
```bash
# Ask Claude: "Test the notification preferences endpoint"
# testing-specialist uses api-integration-test-scaffolder:
# 1. Identifies POST /api/v1/users/notifications/preferences
# 2. Generates test_notification_preferences_integration.py
# 3. Includes 10 scenarios (success, validation, auth, concurrent, performance)
# 4. Runs: pytest backend/app/tests/integration/ -v
# 5. Reports: ✅ 10/10 scenarios passing
```

**Create Storybook Stories:**
```bash
# Ask Claude: "Create story for Input component"
# testing-specialist uses storybook-scaffolder:
# 1. Reads src/components/ui/Input/Input.tsx
# 2. Generates Input.stories.tsx with variant stories
# 3. Adds interaction tests for typing, validation, error states
# 4. Runs: yarn storybook
# 5. Reports: ✅ Story created with 4 variants
```

### Test Infrastructure

**Frontend Testing (Vitest):**
- **Runner:** Vitest 4.0.7
- **Config:** `frontend/vitest.config.ts`
- **Coverage:** v8 provider, HTML/JSON/text reports
- **Commands:**
  - `yarn test` - Run all tests
  - `yarn test:watch` - Watch mode
  - `yarn test:coverage` - Generate coverage report
  - `yarn test {{ComponentName}}` - Run specific test

**Backend Testing (pytest):**
- **Runner:** pytest 7.0.0+
- **Config:** `backend/pytest.ini`, `backend/pyproject.toml`
- **Coverage:** pytest-cov with 25% minimum threshold
- **Commands:**
  - `pytest backend/app/tests/` - Run all tests
  - `pytest backend/app/tests/ -v` - Verbose output
  - `pytest backend/app/tests/ --cov` - With coverage
  - `pytest -m unit` - Run only unit tests

**E2E Testing (Playwright):**
- **Framework:** Playwright 1.55.0
- **Config:** `frontend/playwright.config.ts`
- **Browsers:** Chromium (Desktop Chrome)
- **Commands:**
  - `npx playwright test` - Run all E2E tests
  - `npx playwright test --headed` - With browser UI
  - `npx playwright test --debug` - Debug mode
  - `npx playwright test {{test_name}}` - Run specific test

### Coverage Improvement Roadmap

**Baseline (Current):**
- Frontend Components: 10.6% (12/113)
- Storybook: 3.5% (4/113)
- Backend: 85% (comprehensive)
- E2E: 90% (7 tests)

**Target (Month 1):**
- Frontend Components: 50% (56/113)
- Storybook: 40% (45/113)
- Backend: 90% (maintain + new features)
- E2E: 95% (10+ critical flows)

**Weekly Milestones:**
- Week 1: Frontend 20% (22 components) + Integration tests complete
- Week 2: Frontend 35% (39 components) + pytest-test-scaffolder created
- Week 3: Frontend 45% (50 components) + Enhanced Storybook
- Week 4: Frontend 50% (56 components) + Storybook 40%

## Linting Commands

- **All Projects (Root)**:
  - `yarn lint` - Run ESLint on frontend and functions
  - `yarn lint:fix` - Auto-fix all linting errors across entire project
  - `yarn lint:ci` - Run linting with CI-friendly settings
  - `yarn lint:autofix` - Execute comprehensive auto-fix script
- **Individual Projects**:
  - **Functions**: `npm run lint` or `npm run lint:fix` (from functions directory)
- **Formatting**:
  - `yarn format` - Format all files with Prettier
  - `yarn format:check` - Check formatting without changes
- **Pre-commit**: Hooks configured with `husky` for automatic linting on commit
- **Workspace Setup**: Yarn workspaces with functions using npm scripts

### Current Frontend Scripts

- `yarn dev` - Start Vite development server
- `yarn build` - TypeScript compilation + Vite build for production
- `yarn preview` - Preview production build locally
- `yarn test` - Run Jest unit tests
- `yarn lint` - Run ESLint (max 0 warnings)
- `yarn lint:fix`- Auto-fix ESLint issues (max 10 warnings)
- `yarn lint:ci` - Run ESLint with CI settings (max 5 warnings)
- `yarn storybook` - Start Storybook development server
- `2` - Build Storybook for production

## Frontend Deployment Readiness Commands

- **Full Deployment Check**: `./scripts/frontend-deployment-readiness.sh` - Comprehensive validation (TypeScript, build, tests, linting, security)
- **TypeScript Validation**: `./scripts/typescript-check.sh` - Dedicated TypeScript type checking and analysis
- **Bundle Analysis**: `./scripts/vite-bundle-analyzer.sh` - Vite bundle analysis and optimization recommendations
- **Frontend Structure**: `./frontend/restructure.sh` - Reorganize frontend components and structure
- See `scripts/frontend-commands.md` for detailed usage and examples

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

## Testing Framework

### Frontend Testing

- **Unit Tests**: Jest + React Testing Library for component testing
- **Test Commands**:
  - `yarn test` - Run all frontend tests
  - `yarn test:watch` - Run tests in watch mode
  - `yarn test:coverage` - Generate coverage report
- **Component Tests**: Comprehensive tests for all major UI components
  - `KscGeneratorPage` - Render tests and user interaction validation
  - `CoverLetterGenerator` - AI service integration and form validation
  - `TailoredResumeGenerator` - Resume generation workflow testing
  - `OneClickApplyButton` - Complex application flow testing
  - `DocumentReviewModal` - Document review and approval workflow
  - `Editor` - Rich text editing functionality
  - `KeywordTagGroup` - Keyword management and bulk actions

### Backend Testing

- **Unit Tests**: pytest for flow and service testing
- **Test Commands**:
  - `pytest backend/app/tests/` - Run all backend tests
  - `pytest backend/app/tests/ -v` - Verbose test output
  - `pytest backend/app/tests/ --cov` - Generate coverage report
- **Flow Tests**: Genkit flow validation with mocked AI models
  - `test_ats_scoring.py` - ATS scoring flow with comprehensive mocking
  - `test_cover_letter_robustness.py` - Robustness testing for edge cases
  - `test_cover_letter_output_validation.py` - AI model output validation

### Integration Testing

- **API Testing**: httpx + FastAPI TestClient for endpoint validation
- **Test Commands**:
  - `pytest backend/app/tests/api/` - Run integration tests
- **Endpoint Tests**:
  - `test_ksc_integration.py` - POST /api/v1/ksc/generate endpoint validation
  - Request/response validation, error handling, concurrent request testing

### End-to-End (E2E) Testing

- **E2E Framework**: Playwright for complete user journey testing
- **Test Commands**:
  - `npx playwright test` (from frontend directory) - Run all E2E tests
  - `npx playwright test --headed` - Run tests with browser UI
  - `npx playwright test --debug` - Debug mode with step-through
- **User Journey Tests**:
  - `ksc-generation-workflow.spec.js` - Complete KSC generation workflow
  - Mobile responsiveness, accessibility, keyboard navigation testing
  - Error handling and edge case validation

### Test Coverage

- **Frontend**: Component rendering, user interactions, API integration, error states
- **Backend**: Flow logic, AI model mocking, robustness testing, output validation
- **Integration**: API endpoints, request/response validation, error handling
- **E2E**: Complete user workflows, accessibility, responsive design

### Test Configuration Files

- `frontend/package.json` - Jest configuration embedded for React components
- `frontend/playwright.config.ts` - Playwright E2E test configuration
- `functions/package.json` - Jest configuration for Functions testing
- `frontend/src/setupTests.ts` - Test environment setup
- `jest.config.js` files removed in favor of package.json configuration

## CI/CD Testing Pipeline

### GitHub Actions Workflow

- **Main Workflow**: `.github/workflows/ci.yml` - Comprehensive testing pipeline
- **Test Triggers**: Pull requests, pushes to main/develop, manual dispatch
- **Parallel Execution**: All test suites run in parallel for faster feedback
  - Frontend tests (Jest), Backend tests (pytest), and E2E tests (Playwright) execute simultaneously
  - Tool calls batched together for optimal performance (multiple bash commands, file operations)
  - Independent test jobs reduce total CI/CD pipeline execution time
  - Parallel dependency installation across workspaces (frontend, functions)
  - Concurrent linting and type checking processes

### Test Jobs in CI Pipeline

#### Frontend Testing Job

- **Jest Unit Tests**: Component rendering, user interactions, API integration
- **Coverage Report**: HTML and XML coverage reports with artifacts
- **Linting & Formatting**: ESLint and Prettier validation
- **Build Verification**: Ensures frontend builds successfully

#### Backend Testing Job

- **Unit Tests**: `pytest app/tests/genkit_flows/ app/tests/core/` with coverage
- **Integration Tests**: `pytest app/tests/api/` for endpoint validation
- **Coverage Upload**: Codecov integration for coverage tracking
- **Security Scanning**: Bandit security analysis with artifact reports
- **Type Checking**: mypy validation for type safety

#### E2E Testing Job

- **Playwright Tests**: Complete user journey validation
- **Multi-Browser**: Chromium, Firefox, WebKit testing
- **Full Stack**: Starts both backend and frontend servers
- **Screenshot Capture**: Failure screenshots uploaded as artifacts
- **Environment Variables**: Uses staging environment configuration

#### Performance Testing Job (Optional)

- **Benchmark Tests**: Performance regression detection
- **Scheduled Runs**: Runs on schedule or manual trigger
- **Performance Metrics**: Benchmark results with historical tracking

### Test Artifacts & Reporting

- **Coverage Reports**: Frontend and backend coverage uploaded to Codecov
- **Test Results**: HTML reports for all test suites
- **E2E Screenshots**: Failure screenshots for debugging
- **Security Reports**: Bandit security scan results
- **Performance Benchmarks**: Historical performance tracking

### Quality Gate

- **All Tests Required**: Frontend, backend, functions, and E2E tests must pass
- **Security Validation**: CodeQL and Bandit security checks
- **Test Summary**: Detailed test results table in PR comments
- **Artifact Links**: Direct links to coverage and test reports

### Manual Test Controls

```bash
# Trigger CI with specific test options
gh workflow run ci.yml \
  --ref develop \
  -f run_e2e_tests=true \
  -f run_performance_tests=false \
  -f test_environment=staging
```

### Environment Configuration

- **Test Environment**: Isolated test database and services
- **API Keys**: Staging environment secrets for integration tests
- **Service Mocking**: External services mocked in unit tests
- **Database**: Testcontainers for integration test isolation

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
- memorize
