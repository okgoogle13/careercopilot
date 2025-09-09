# Project Commands and Notes

## Configuration Management

### Production Secrets (Google Cloud Secret Manager)
- **Setup Secrets**: `python3 scripts/setup-production-secrets.py` - Interactive production secrets setup
- **Validate Secrets**: `python3 scripts/production-secrets-validator.py` - Validate all production secrets
- **Deployment Checklist**: `python3 scripts/production-secrets-validator.py --checklist` - Generate deployment checklist
- **Environment Template**: `python3 scripts/production-secrets-validator.py --env-template` - Generate .env template

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
```

## Configuration Files
- `.env.local` - Local development environment variables (not committed)
- `.env.production` - Production environment template
- `backend/app/core/config.py` - Centralized configuration management
- `backend/app/core/secure_config.py` - Secure settings with Secret Manager integration
- `backend/app/core/secret_manager.py` - Google Cloud Secret Manager integration
- `backend/app/core/genkit_init.py` - Genkit AI framework initialization and flow management
- `verify_genkit.py` - Genkit verification and health check script

## Linting Commands
- **Frontend**: `yarn lint` or `yarn lint:fix` (from frontend directory)
- **Functions**: `npm run lint:fix` (uses npm)
- **All projects**: `./scripts/lint-autofix.sh` - Auto-fix all linting errors across the entire project
- **CI linting**: `lint:ci` scripts available with higher warning tolerance
- **Pre-commit**: Hooks configured with `pre-commit install` for automatic linting on commit
- **Workspace setup**: Functions uses npm while frontend uses yarn

### Current Frontend Scripts
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn clean` - Remove node_modules, dist, and .vite directories
- `yarn lint` - Run ESLint checker
- `yarn lint:fix` - Auto-fix ESLint issues

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
- **Frontend**: `yarn build` (from frontend directory) - Build frontend application
- **Functions**: `yarn build:functions` - Build Firebase functions
- **Cleanup**: `yarn clean` - Clean build artifacts
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
- `frontend/jest.config.js` - Jest configuration for React components
- `frontend/playwright.config.ts` - Playwright E2E test configuration
- `backend/app/tests/conftest.py` - pytest configuration and fixtures
- `frontend/src/setupTests.ts` - Test environment setup

## CI/CD Testing Pipeline

### GitHub Actions Workflow
- **Main Workflow**: `.github/workflows/ci.yml` - Comprehensive testing pipeline
- **Test Triggers**: Pull requests, pushes to main/develop, manual dispatch
- **Parallel Execution**: All test suites run in parallel for faster feedback

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
- **Frontend**: React + TypeScript + Vite with Tailwind CSS v3
- **Component Library**: Radix UI components with custom styling
- **API Integration**: All AI service endpoints implemented and connected
- **Error Handling**: Comprehensive error handling across all components
- **Build System**: Clean builds with proper TypeScript compilation
- **Linting**: ESLint configured with auto-fix capabilities
- **Testing**: Complete test suite with unit, integration, and E2E coverage
- **Test Framework**: Jest, pytest, Playwright with comprehensive mocking strategies
