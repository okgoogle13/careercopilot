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

### Secrets Management Flow
```bash
# For Production Deployment:
1. python3 scripts/production-secrets-validator.py  # Check current status
2. python3 scripts/setup-production-secrets.py      # Set up missing secrets
3. python3 scripts/production-secrets-validator.py --checklist  # Final validation

# For Local Development:
1. ./setup-api-keys.sh  # Interactive setup
2. python3 scripts/test-configuration.py  # Validate setup
```

## Configuration Files
- `.env.local` - Local development environment variables (not committed)
- `.env.production` - Production environment template
- `backend/app/core/config.py` - Centralized configuration management
- `backend/app/core/secure_config.py` - Secure settings with Secret Manager integration
- `backend/app/core/secret_manager.py` - Google Cloud Secret Manager integration

## Linting Commands
- Frontend: `yarn lint:fix` (uses yarn)
- Functions: `npm run lint:fix` (uses npm)
- **All projects**: `yarn lint:autofix` or `./scripts/lint-autofix.sh` - Auto-fix all linting errors across the entire project
- CI linting: `lint:ci` scripts available with higher warning tolerance
- Test scripts use `lint:ci` instead of strict linting for CI compatibility
- Workspace setup: Functions uses npm while frontend uses yarn

## Frontend Deployment Readiness Commands
- **Full Deployment Check**: `./scripts/frontend-deployment-readiness.sh` - Comprehensive validation (TypeScript, build, tests, linting, security)
- **TypeScript Validation**: `./scripts/typescript-check.sh` - Dedicated TypeScript type checking and analysis
- **Bundle Analysis**: `./scripts/vite-bundle-analyzer.sh` - Vite bundle analysis and optimization recommendations
- **Package.json integration**:
  - `npm run bundle-analysis` - Analyze existing build
  - `npm run bundle-analysis:build` - Full rebuild with analysis
  - `npm run deployment-check` - Complete deployment readiness check
  - `npm run typescript-check` - TypeScript validation
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
- `yarn build:frontend` - Build frontend application
- `yarn build:functions` - Build Firebase functions
- `yarn clean` - Clean build artifacts

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
