---
description: Monitor CI/CD pipelines and auto-diagnose failures
---

# CI/CD Monitor and Auto-Fix Workflow

This workflow monitors GitHub Actions, diagnoses failures, and provides actionable fixes.

## Step 1: Check GitHub Actions Status

// turbo
```bash
gh run list --limit 10 --json conclusion,name,createdAt,headBranch,event,workflowName,databaseId --jq '.[] | "[\(.conclusion // "running")] \(.workflowName) (\(.createdAt | split("T")[0]))"'
```

**Expected Output**: List of recent workflows with their status (success, failure, running, etc.)

## Step 2: Identify Failed Workflows

If any workflow shows `[failure]`, get detailed information:

```bash
# Replace WORKFLOW_RUN_ID with the actual ID from Step 1
gh run view WORKFLOW_RUN_ID --log-failed
```

**Common Failure Patterns**:
- **Playwright E2E failures**: Connection refused, timeout, element not found
- **Unit test failures**: Import errors, assertion failures
- **Docker build failures**: Resource limits, build context issues
- **Security scan failures**: Known vulnerabilities in dependencies

## Step 3: Root Cause Analysis - Playwright E2E Failures

If the "Automated UAT - Career Ingestion" workflow fails:

### 3a. Download Playwright Artifacts

```bash
# Get the run ID of the failed UAT workflow
FAILED_RUN_ID=$(gh run list --workflow="Automated UAT - Career Ingestion" --limit 1 --json databaseId,conclusion --jq '.[] | select(.conclusion=="failure") | .databaseId')

# Download the Playwright HTML report
gh run download $FAILED_RUN_ID --name playwright-report --dir /tmp/playwright-analysis
```

### 3b. Analyze Failure Logs

```bash
# Extract failure reasons from logs
gh run view $FAILED_RUN_ID --log-failed | grep -A 10 "Error:"
```

**Common Issues**:
1. **Connection Refused (ERR_CONNECTION_REFUSED)**
   - **Root Cause**: Backend/frontend not ready when tests start
   - **Fix**: Increase wait time in `.github/workflows/automated-uat.yml` (line 70)

2. **Element Not Found / Timeout**
   - **Root Cause**: Flaky selectors or slow rendering
   - **Fix**: Use `page.waitForLoadState('networkidle')` or increase timeout

3. **Authentication Failures**
   - **Root Cause**: Missing/invalid auth state
   - **Fix**: Verify `tests/auth/user.json` is correctly generated

### 3c. Visual Inspection via Browser (Development)

If you need to reproduce the failure locally:

// turbo
```bash
# Start services with the E2E docker compose
docker compose -f docker-compose.e2e.yml up -d --build
```

Wait for services to be healthy (30 seconds), then:

```bash
# Run Playwright in headed mode to see what's happening
cd frontend && npx playwright test tests/e2e/ingestion-flow.spec.ts --headed --project=chromium
```

**Agent Action**: Use the browser_subagent tool to:
- Navigate to the deployment URL (http://localhost:5173)
- Open browser console to check for JavaScript errors
- Verify the failing element is visible and interactable
- Take screenshots of the failure state

## Step 4: Root Cause Analysis - Frontend Unit Test Failures

If "Frontend Unit Tests" workflow fails:

```bash
# Get detailed logs
FAILED_RUN_ID=$(gh run list --workflow="Frontend Unit Tests" --limit 1 --json databaseId,conclusion --jq '.[] | select(.conclusion=="failure") | .databaseId')
gh run view $FAILED_RUN_ID --log-failed
```

**Common Issues**:
1. **Import/Module Resolution Errors**
   - **Root Cause**: Missing dependencies or incorrect import paths
   - **Fix**: Check `package.json` and `tsconfig.json`

2. **React Component Rendering Failures**
   - **Root Cause**: Missing context providers or props
   - **Fix**: Update test setup in `frontend/src/test/setup.ts`

3. **Coverage Threshold Failures**
   - **Root Cause**: New code not covered by tests
   - **Fix**: Add unit tests for uncovered components

**Local Verification**:

// turbo
```bash
cd frontend && npm run test -- --coverage
```

## Step 5: Root Cause Analysis - Backend Test Failures

If "CI - Build and Test" workflow fails on backend tests:

```bash
FAILED_RUN_ID=$(gh run list --workflow="CI - Build and Test" --limit 1 --json databaseId,conclusion --jq '.[] | select(.conclusion=="failure") | .databaseId')
gh run view $FAILED_RUN_ID --log-failed | grep -A 20 "FAILED backend"
```

**Common Issues**:
1. **Database Connection Failures**
   - **Root Cause**: PostgreSQL not ready or wrong credentials
   - **Fix**: Verify Docker Compose health checks

2. **Mock/Fixture Issues**
   - **Root Cause**: Firebase/Genkit mocks not properly configured
   - **Fix**: Update `backend/tests/conftest.py`

3. **Async/Await Issues**
   - **Root Cause**: Missing `await` or improper async context
   - **Fix**: Ensure all async functions use `@pytest.mark.asyncio`

**Local Verification**:

```bash
cd backend && pytest -v --cov=app --cov-report=term-missing
```

## Step 6: Root Cause Analysis - Docker Build Failures

If "Docker Build & Push" workflow fails:

```bash
FAILED_RUN_ID=$(gh run list --workflow="Docker Build & Push" --limit 1 --json databaseId,conclusion --jq '.[] | select(.conclusion=="failure") | .databaseId')
gh run view $FAILED_RUN_ID --log-failed | grep -A 30 "ERROR"
```

**Common Issues**:
1. **Build Context Too Large**
   - **Root Cause**: `.dockerignore` not excluding large files
   - **Fix**: Add `node_modules/`, `.git/`, `**/*.log` to `.dockerignore`

2. **Multi-stage Build Failures**
   - **Root Cause**: Missing dependencies in intermediate stages
   - **Fix**: Verify each `FROM` stage has necessary deps

3. **Resource Limits**
   - **Root Cause**: OOM during npm/pip install
   - **Fix**: Use `--max-old-space-size` for Node or split pip installs

**Local Verification**:

```bash
docker build --no-cache -f Dockerfile -t careercopilot-test .
```

## Step 7: Generate Fix Recommendations

Based on the root cause identified, generate specific fix recommendations:

### For Playwright Flaky Tests:
```typescript
// Example fix: Add explicit waits
await page.waitForSelector('[data-testid="career-form"]', { 
  state: 'visible',
  timeout: 10000 
});

// Use waitForLoadState for better reliability
await page.waitForLoadState('networkidle');

// Retry flaky actions
await expect(async () => {
  await page.click('[data-testid="submit-button"]');
}).toPass({ timeout: 15000 });
```

### For Service Startup Race Conditions:
```yaml
# In .github/workflows/automated-uat.yml
- name: Wait for Services
  run: |
    echo "Waiting for backend..."
    timeout 60 bash -c 'until curl -f http://localhost:8000/health; do sleep 2; done'
    echo "Waiting for frontend..."
    timeout 60 bash -c 'until curl -f http://localhost:5173; do sleep 2; done'
```

### For Authentication Issues:
```bash
# Generate fresh auth state before tests
cd frontend && npx playwright test tests/auth/setup.spec.ts --project=chromium
```

## Step 8: Apply Fixes and Verify

After implementing fixes:

1. **Commit and push changes**:
```bash
git add .
git commit -m "fix(ci): resolve Playwright E2E flaky test issues"
git push origin develop
```

2. **Monitor the new run**:
```bash
# Wait for the new workflow to trigger
sleep 30
gh run watch
```

3. **Verify success**:
```bash
gh run list --limit 1 --json conclusion,workflowName --jq '.[] | "\(.workflowName): \(.conclusion)"'
```

## Step 9: Cross-Surface Debugging (Advanced)

If the issue involves frontend-backend data flow:

1. **Open browser and check the console**:
   - Use browser_subagent to navigate to the failing page
   - Open DevTools Console tab
   - Check for network errors (failed API calls)

2. **Check backend logs simultaneously**:
```bash
docker compose -f docker-compose.e2e.yml logs -f backend | grep ERROR
```

3. **Trace data flow**:
   - Frontend: Check network tab for API request/response
   - Backend: Add logging in endpoint to verify data received
   - Database: Query directly to verify data persistence

## Success Criteria

✅ All GitHub Actions workflows show `[success]` status
✅ Playwright HTML report shows 100% pass rate
✅ Unit test coverage meets threshold (>80%)
✅ No security vulnerabilities detected
✅ Docker images build successfully

## Maintenance Notes

- Run this workflow before every production deployment
- Add new failure patterns to Step 3-6 as you encounter them
- Update timeout values based on actual service startup times
- Keep Playwright selectors using `data-testid` for stability
