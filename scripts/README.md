# CareerCopilot Scripts Guide

This directory contains utility scripts for setup, deployment, testing, and maintenance of the CareerCopilot project.

## 📊 Cleanup Status (Nov 2025)

- **Active Scripts**: 58 (reduced from 85+)
- **Archived Scripts**: 39 (moved to `_archived/`)
- **Reduction**: 40% fewer scripts to maintain
- **Status**: ✅ Cleanup completed

## Quick Start

For initial project setup, run:

```bash
./scripts/setup-everything.sh
```

This master setup script handles:

- Node.js dependencies installation
- Firebase configuration
- API keys setup
- Environment configuration validation

## 📁 Essential Scripts (Post-Cleanup)

### 🚀 Deployment Scripts

- **`deploy.sh`** - Unified deployment (staging/production/frontend/functions)
- **`frontend-deployment-readiness.sh`** - Pre-deployment validation
- **`test-deployment.sh`** - Comprehensive deployment testing

### 🔐 Setup & Configuration Scripts

- **`setup-everything.sh`** - Master setup orchestrator
- **`setup-secrets.sh`** - Unified secrets management (replaces 3 scripts)
- **`setup-careercopilot-firebase.sh`** - Comprehensive Firebase setup
- **`setup-production-secrets.py`** - Production secrets configuration

### ✅ Validation & Testing Scripts

- **`test-configuration.py`** - Comprehensive configuration validation
- **`production-secrets-validator.py`** - Production secrets validation
- **`run-tests.sh`** - Test suite runner
- **`typescript-check.sh`** - TypeScript validation

### 🎨 Design System Scripts

- **`build-design-tokens.py`** - Design token generation
- **`build-m3-tokens.py`** - M3 token building
- **`validate-design-tokens.py`** - Token validation

### 🔄 Migration Scripts

- **`migrate-to-m3.py`** - M3 Expressive migration
- **`batch-migrate-m3.sh`** - Batch M3 migration

### 📊 Analysis Scripts

- **`vite-bundle-analyzer.sh`** - Bundle size analysis
- **`audit-component-structure.sh`** - Component structure audit
- **`audit-hardcoded-values.sh`** - Hardcoded values audit

## 📦 Archived Scripts

The following 39 scripts have been moved to `_archived/`:

- Obsolete migration scripts (Redis → Firestore completed)
- Redundant setup scripts (consolidated into unified scripts)
- One-time cleanup scripts (completed tasks)
- Duplicate deployment wrappers (consolidated into deploy.sh)

**Note**: All archived scripts are preserved and can be restored if needed.

## 🚨 Important Changes

1. **Unified Secrets Management**: Use `setup-secrets.sh` instead of separate API keys/credentials scripts
2. **Unified Deployment**: Use `deploy.sh` with environment arguments instead of separate staging/production scripts
3. **Comprehensive Firebase**: Use `setup-careercopilot-firebase.sh` for all Firebase setup
4. **Validation**: Use `test-configuration.py` for most validation needs

## Usage Examples

### Deploy to Staging:

```bash
./scripts/deploy.sh staging
```

### Deploy to Production:

```bash
./scripts/deploy.sh production
```

### Setup All Secrets:

```bash
./scripts/setup-secrets.sh
```

### Validate Configuration:

```bash
python3 scripts/test-configuration.py
```

### Run All Tests:

```bash
./scripts/run-tests.sh
```

### Migrate to M3:

```bash
python3 scripts/migrate-to-m3.py component-name
```

#### `configure-firebase-permissions.sh`

Set up Firebase IAM permissions and access controls.

```bash
./scripts/configure-firebase-permissions.sh
```

#### `setup-aws-ses-secrets.sh`

Configure AWS SES email service secrets.

```bash
./scripts/setup-aws-ses-secrets.sh
```

#### `setup-aws-ses-github-secrets.sh`

Add AWS SES credentials to GitHub Secrets for CI/CD.

```bash
./scripts/setup-aws-ses-github-secrets.sh
```

#### `setup-redis-secrets.sh`

Configure Redis service credentials.

```bash
./scripts/setup-redis-secrets.sh
```

#### `setup-careercopilot-firebase.sh`

CareerCopilot-specific Firebase setup with additional configurations.

```bash
./scripts/setup-careercopilot-firebase.sh
```

### Deployment Scripts

Use these scripts to deploy the application to various environments:

#### `deploy.sh` (Main Deployment)

Universal deployment script supporting multiple targets.

```bash
# Staging deployment
./scripts/deploy.sh staging

# Production deployment (with safety prompt)
./scripts/deploy.sh production

# Frontend only
./scripts/deploy.sh frontend

# Functions only
./scripts/deploy.sh functions

# All components
./scripts/deploy.sh all
```

#### `deploy-production.sh`

Production-specific deployment with additional safety checks.

```bash
./scripts/deploy-production.sh
```

#### `deploy-staging.sh`

Staging environment deployment.

```bash
./scripts/deploy-staging.sh
```

### Testing & Validation Scripts

Use these scripts to validate your setup and run tests:

#### `run-tests.sh`

Run all test suites (frontend, backend, functions).

```bash
./scripts/run-tests.sh
```

#### `test-deployment.sh`

Test deployment configuration without actual deployment.

```bash
./scripts/test-deployment.sh
```

#### `test-configuration.py`

Validate all configuration settings.

```bash
python3 scripts/test-configuration.py
```

#### `frontend-deployment-readiness.sh`

Comprehensive frontend deployment validation (TypeScript, build, tests, linting).

```bash
./scripts/frontend-deployment-readiness.sh
```

#### `validate-environment.sh`

Validate development environment configuration.

```bash
./scripts/validate-environment.sh
```

#### `validate-security.sh`

Security validation and checks.

```bash
./scripts/validate-security.sh
```

#### `run-validation-tests.sh`

Run validation test suite.

```bash
./scripts/run-validation-tests.sh
```

### Utilities & Maintenance Scripts

Use these scripts for routine maintenance and utility functions:

#### `rotate-api-keys.sh`

Securely rotate API keys.

```bash
./scripts/rotate-api-keys.sh
```

#### `check-updates.sh`

Check for available dependency updates.

```bash
./scripts/check-updates.sh
```

#### `update-dependencies.sh`

Update project dependencies.

```bash
./scripts/update-dependencies.sh
```

#### `switch-to-development.sh`

Switch environment to development mode.

```bash
./scripts/switch-to-development.sh
```

#### `switch-to-production.sh`

Switch environment to production mode.

```bash
./scripts/switch-to-production.sh
```

#### `standardize-package-manager.sh`

Standardize package manager configuration.

```bash
./scripts/standardize-package-manager.sh
```

#### `typescript-check.sh`

Dedicated TypeScript type checking.

```bash
./scripts/typescript-check.sh
```

#### `vite-bundle-analyzer.sh`

Analyze Vite bundle size and composition.

```bash
./scripts/vite-bundle-analyzer.sh
```

#### `lint-autofix.sh`

Auto-fix linting errors.

```bash
./scripts/lint-autofix.sh
```

#### `audit.sh`

Run security and dependency audits.

```bash
./scripts/audit.sh
```

#### `cleanup.sh`

General cleanup utility.

```bash
./scripts/cleanup.sh
```

### Configuration & Validation Scripts

Specialized scripts for configuration management and validation:

#### `firebase-config-validator.py`

Validate Firebase configuration.

```bash
python3 scripts/firebase-config-validator.py
```

#### `production-secrets-validator.py`

Validate production secrets configuration.

```bash
python3 scripts/production-secrets-validator.py
```

#### `check-genkit-config.py`

Check Genkit AI framework configuration.

```bash
python3 scripts/check-genkit-config.py
```

#### `fetch-firebase-config.py`

Fetch Firebase configuration from Secret Manager.

```bash
python3 scripts/fetch-firebase-config.py
```

#### `save-aws-ses-secrets.py`

Save AWS SES secrets to configuration.

```bash
python3 scripts/save-aws-ses-secrets.py
```

### Secret Management Scripts

Scripts for managing application secrets and credentials:

#### `manage_firebase_secrets.sh`

Comprehensive Firebase secrets management.

```bash
./scripts/manage_firebase_secrets.sh
```

#### `test_firebase_secrets.py`

Test Firebase secrets configuration.

```bash
python3 scripts/test_firebase_secrets.py
```

#### `setup_functions_secrets_secure.sh`

Secure setup of Firebase Functions secrets.

```bash
./scripts/setup_functions_secrets_secure.sh
```

#### `setup-github-secrets-comprehensive.sh`

Comprehensive GitHub Secrets setup for CI/CD.

```bash
./scripts/setup-github-secrets-comprehensive.sh
```

## Archived Scripts

One-time migration and deprecated scripts are archived in the `_archived/` directory.

**Do not use archived scripts without understanding their purpose first.**

See [\_archived/README.md](_archived/README.md) for details.

## Recommended Workflows

### Initial Development Setup

```bash
./scripts/setup-everything.sh
python3 scripts/test-configuration.py
```

### Before Committing Changes

```bash
./scripts/lint-autofix.sh
npm run build
npm run test
```

### Before Production Deployment

```bash
./scripts/frontend-deployment-readiness.sh
python3 scripts/production-secrets-validator.py
./scripts/test-deployment.sh
./scripts/deploy-production.sh
```

### Local Development Switch

```bash
./scripts/switch-to-development.sh
./scripts/setup-api-keys.sh
```

### Production Environment Switch

```bash
./scripts/switch-to-production.sh
python3 scripts/setup-production-secrets.py
```

## Environment Variables

Most scripts respect the following environment variables:

- `GOOGLE_CLOUD_PROJECT` - GCP project ID (e.g., careercopilot-468811)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `NODE_ENV` - Environment (development, staging, production)
- `ENABLE_GENKIT_FLOWS` - Enable Genkit AI flows (true/false)

## Troubleshooting

### Script not found

Ensure you're running scripts from the repository root:

```bash
cd /Applications/careercopilot
./scripts/script-name.sh
```

### Permission denied

Make scripts executable:

```bash
chmod +x scripts/*.sh
```

### Python script errors

Ensure Python 3 is available:

```bash
python3 --version
source venv/bin/activate
```

## Contributing

When adding new scripts:

1. Use clear, descriptive names (e.g., `setup-feature-name.sh`)
2. Add error handling (`set -e` for bash, proper exception handling for Python)
3. Include documentation comments at the top of the script
4. Update this README with the new script
5. Test thoroughly before committing

When archiving scripts:

1. Move to `_archived/` directory
2. Update `_archived/README.md`
3. Update this README if referenced
4. Keep git history intact

---

**Last Updated:** 2025-11-11
**Total Active Scripts:** 46
**Archived Scripts:** 26 (see \_archived/ directory)
