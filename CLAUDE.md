# Project Commands and Notes

## Configuration Management
- **Setup Script**: `./setup-api-keys.sh` - Interactive configuration setup
- **Production Secrets**: `python3 scripts/setup-production-secrets.py` - Set up Google Cloud secrets
- **Firebase Config**: `python3 scripts/setup-firebase-config.py` - Configure Firebase integration
- **Test Configuration**: `python3 scripts/test-configuration.py` - Validate all configurations

## Configuration Files
- `.env.local` - Local development environment variables (not committed)
- `.env.production` - Production environment template
- `backend/app/core/config.py` - Centralized configuration management
- `backend/app/core/secure_config.py` - Secure settings with Secret Manager integration
- `backend/app/core/secret_manager.py` - Google Cloud Secret Manager integration

## Linting Commands
- Frontend: `yarn lint:fix` (uses yarn)
- Functions: `npm run lint:fix` (uses npm)
- CI linting: `lint:ci` scripts available with higher warning tolerance
- Test scripts use `lint:ci` instead of strict linting for CI compatibility
- Workspace setup: Functions uses npm while frontend uses yarn

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

## Python Virtual Environment
- Activate venv: `source venv/bin/activate`
- Deactivate: `deactivate`
