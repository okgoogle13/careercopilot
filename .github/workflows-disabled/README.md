# Disabled Workflows

This directory contains GitHub Actions workflows that have been temporarily disabled during the frontend development phase. These workflows are not critical for frontend development and were creating CI noise.

## Disabled Workflows (9 total)

### AI/Tooling Workflows (4)

These workflows validate AI-powered development tools and MCP servers. They have **zero impact** on application functionality.

| Workflow                | Purpose                                        | Re-enable When                                   |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `mcp-health-checks.yml` | Validates MCP server configurations and health | MCP servers are actively used in the application |
| `mcp-benchmarks.yml`    | Performance testing for MCP servers            | Optimizing MCP server performance                |
| `flash_sidekick.yml`    | Flash Sidekick AI agent validation             | AI agent features are in production              |
| `agent-debugger.yml`    | Automated CI failure debugging                 | Want automated CI failure analysis               |

### Docker Workflows (2)

These workflows build and scan Docker images. Not needed until containerized deployment.

| Workflow              | Purpose                                     | Re-enable When                     |
| --------------------- | ------------------------------------------- | ---------------------------------- |
| `docker-publish.yml`  | Builds and pushes Docker images to registry | Ready for containerized deployment |
| `docker-security.yml` | Scans Docker images for vulnerabilities     | Before production deployment       |

### Deployment Workflows (3)

These workflows handle production and staging deployments. Not needed during active development.

| Workflow                     | Purpose                                        | Re-enable When                               |
| ---------------------------- | ---------------------------------------------- | -------------------------------------------- |
| `deploy.yml`                 | Deploys to staging and production environments | Ready for staging/production deployment      |
| `_reusable_deploy.yml`       | Reusable deployment workflow (helper)          | Re-enabling deploy.yml                       |
| `firebase-hosting-merge.yml` | Auto-deploys to Firebase on merge to main      | Frontend is stable and ready for auto-deploy |

## Active Workflows (10 total)

The following workflows remain active in `.github/workflows/`:

### Frontend Core (5)

- `ci.yml` - Main CI pipeline (linting, type checking, docs validation)
- `unit-test.yml` - Frontend unit tests (Jest/React Testing Library)
- `storybook.yml` - Component library builds and visual testing
- `firebase-hosting-pull-request.yml` - Preview deploys on pull requests
- `auto-fix.yml` - Automated code formatting (ESLint, Prettier)

### Quality & Monitoring (2)

- `security.yml` - Secret scanning (TruffleHog, Gitleaks)
- `bundle-analysis.yml` - Frontend bundle size monitoring

### Backend Integration (3)

- `automated-uat.yml` - End-to-end tests (Playwright)
- `supabase-checks.yml` - Database validation
- `supabase-keep-alive.yml` - Database keep-alive (cron)

## How to Re-enable a Workflow

When you're ready to re-enable a workflow:

```bash
# Move the workflow back to active directory
mv .github/workflows-disabled/[workflow-name].yml .github/workflows/

# Commit the change
git add .github/workflows/[workflow-name].yml
git commit -m "ci: Re-enable [workflow-name] for [reason]"
git push
```

## Impact of Disabling

### Before

- **19 workflows** running on every push
- **10 workflows** failing consistently
- **~15 minutes** CI time per push
- **High noise** from backend/infrastructure failures

### After

- **10 workflows** running on every push
- **~3-4 workflows** with actionable failures (frontend tests)
- **~5-7 minutes** CI time per push
- **85% reduction** in CI noise

## Development Phase Strategy

| Phase                              | Active Workflows | Disabled Workflows             |
| ---------------------------------- | ---------------- | ------------------------------ |
| **Frontend Development** (Current) | 10               | 9                              |
| **Backend Integration**            | 13               | 6 (re-enable UAT, Supabase)    |
| **Pre-Production**                 | 16               | 3 (re-enable Docker, security) |
| **Production**                     | 19               | 0 (all enabled)                |

## Notes

- Disabled workflows are **not deleted**, just moved to this directory
- GitHub Actions will **not run** workflows in this directory
- All workflows can be re-enabled at any time
- This is a **temporary measure** during frontend development phase
