# 🚀 Deployment Workflow: Project Release Guide

This document contains the complete, step-by-step process for building, testing, and deploying the application to Staging and Production environments.

**Reference:** This workflow is the authoritative source for the CLAUDE.md Deployment Index.

## 1. ⚙️ Pre-Deployment Checklist

Before initiating any deployment, the following must be validated to ensure system stability and security.

- **Type Safety:** `yarn build` must pass TypeScript compilation with no errors.
- **Linting:** `yarn lint` must pass (or `yarn lint:fix` must be run).
- **Testing:** All tests MUST pass.
  - Frontend: `yarn test` (Jest)
  - Backend: `pytest backend/app/tests/`
  - E2E: `yarn test:e2e` (Playwright)
- **Secrets:** Production secrets must be validated: `python3 scripts/production-secrets-validator.py`

## 2. 🗂️ Core Deployment Script & Targets

All deployments are orchestrated through the primary shell script: `./scripts/deploy.sh`.

### A. Available Targets and Commands
The script requires a target environment or component as an argument:

| Target | Command | Action | Safety Constraints |
|--------|---------|--------|-------------------|
| Staging | `./scripts/deploy.sh staging` | Deploys all components to the staging environment. | No safety prompt required. |
| Production | `./scripts/deploy.sh production` | Deploys all components to the production environment. | **CRITICAL:** Requires a safety prompt confirmation. |
| All | `./scripts/deploy.sh all` | Deploys everything (Frontend + Functions + Backend). | Environment target must still be specified. |
| Frontend | `./scripts/deploy.sh frontend` | Deploys only the web application (Frontend). | |
| Functions | `./scripts/deploy.sh functions` | Deploys only Firebase Cloud Functions. | |

### B. Deployment Options
The following flags can be passed to the main script (use judiciously):
- `--skip-tests`: Bypasses running all test suites (use only for hotfixes).
- `--skip-lint`: Bypasses linting checks.

### C. Build Commands (Underlying Tools)
The core build process relies on these commands, typically called by `./scripts/deploy.sh`:
- **Build All:** `yarn build`
- **Build Frontend:** `yarn build:frontend` (from root)
- **Build Functions:** `yarn build:functions` (from root)

## 3. 🛡️ Production Deployment Protocol

To deploy to production, the `./scripts/deploy.sh production` command executes a multi-step, verified workflow. **DO NOT bypass this procedure unless explicitly authorized.**

### Step 1: Run Deployment Readiness Check
First, run the dedicated test script to validate all configurations and dependencies without deploying:
```bash
./scripts/test-deployment.sh
```
If this script fails, deployment is aborted. Fix the issue and restart.

### Step 2: Full Build and Security Validation
The deployment script executes the following internal checks:
- `./scripts/frontend-deployment-readiness.sh` (Runs TS, build, tests, linting, security).
- `./scripts/vite-bundle-analyzer.sh` (Ensures bundle size is optimized).

### Step 3: Deployment Execution (Production)
1. Execute the main script: `./scripts/deploy.sh production`
2. **Safety Prompt:** The script will pause and require a manual `yes` confirmation before proceeding.
3. Deploy services to the **Primary Region:** `us-central1`.

### Step 4: Post-Deployment Verification
After the script completes, verify application health:
- **URL:** Check the production environment: https://careercopilot-468811.web.app
- **Health Check:** Verify Genkit and NLP services are active.
  ```bash
  curl http://PRODUCTION_URL/nlp/health
  ```
- Check Genkit health monitoring in the Firebase console.

## 4. 🔗 Environment URLs

| Environment | URL |
|-------------|-----|
| Production | https://careercopilot-468811.web.app |
| Staging | https://careercopilot-staging.web.app |
| Docker Registry | us-central1-docker.pkg.dev/PROJECT_ID/careercopilot |
| Primary Region | us-central1 |
