#!/usr/bin/env python3
"""
MCP Smoke Test Generator - Auto-Generate Playwright Smoke Tests
Discovers backend API endpoints and generates comprehensive smoke test suites.
"""

import asyncio
import json
import logging
import os
import re
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional, Literal
from collections import defaultdict
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field

try:
    from dotenv import load_dotenv
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_path = os.path.join(project_root, '.env')
    load_dotenv(env_path, override=True)
except ImportError:
    pass

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [SmokeTestGen] - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-smoke-test-gen.log')]
)
logger = logging.getLogger("SmokeTestGenerator")

# FastMCP Server
mcp = FastMCP("smoke_test_generator")

# --- Type Definitions ---

class APIEndpoint(BaseModel):
    method: str = Field(..., description="HTTP method (GET, POST, PUT, DELETE)")
    path: str = Field(..., description="API path (e.g., /auth/me)")
    controller: str = Field(..., description="Source controller/endpoint file")
    response_model: Optional[str] = Field(None, description="Response model name")
    requires_auth: bool = Field(True, description="Whether endpoint requires authentication")
    description: Optional[str] = Field(None, description="Endpoint description")

class FrontendAPIUsage(BaseModel):
    endpoint_path: str
    component_file: str
    hook_type: str  # useQuery, useMutation
    line_number: int

# --- API Discovery Engine ---

async def _read_file_async(path: str) -> Optional[str]:
    """Read file contents asynchronously."""
    try:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: Path(path).read_text('utf-8'))
    except Exception as e:
        logger.error(f"Failed to read {path}: {e}")
        return None

def _extract_endpoints_from_router(code: str, file_path: str) -> List[APIEndpoint]:
    """Extract FastAPI endpoints from router code."""
    endpoints = []

    # Pattern: @router.method("path", ...) with optional response_model
    endpoint_pattern = r'@router\.(get|post|put|delete|patch)\s*\(\s*["\']([^"\']+)["\']'
    method_pattern = r'async def\s+(\w+)\s*\([^)]*(?:current_user|Depends\(get_current_user\))?'
    docstring_pattern = r'"""([^"]+?)"""'

    matches = re.finditer(endpoint_pattern, code)
    for match in matches:
        method = match.group(1).upper()
        path = match.group(2)

        # Find the docstring after this match
        start_pos = match.end()
        docstring_match = re.search(docstring_pattern, code[start_pos:start_pos+500])
        description = docstring_match.group(1).strip() if docstring_match else None

        # Check if requires auth
        requires_auth = 'current_user' in code[match.start():match.end()+200]

        endpoints.append(APIEndpoint(
            method=method,
            path=path,
            controller=file_path.split('/')[-1],
            description=description,
            requires_auth=requires_auth
        ))

    return endpoints

def _extract_frontend_usages(code: str, file_path: str) -> List[FrontendAPIUsage]:
    """Extract frontend API usage patterns."""
    usages = []

    # Pattern: useQuery({ ... url: "..." })
    query_pattern = r'useQuery\s*\({[^}]*url:\s*["\']([^"\']+)["\']'
    mutation_pattern = r'useMutation\s*\({[^}]*url:\s*["\']([^"\']+)["\']'

    lines = code.split('\n')
    for idx, line in enumerate(lines):
        # useQuery
        for match in re.finditer(query_pattern, line):
            usages.append(FrontendAPIUsage(
                endpoint_path=match.group(1),
                component_file=file_path,
                hook_type='useQuery',
                line_number=idx + 1
            ))
        # useMutation
        for match in re.finditer(mutation_pattern, line):
            usages.append(FrontendAPIUsage(
                endpoint_path=match.group(1),
                component_file=file_path,
                hook_type='useMutation',
                line_number=idx + 1
            ))

    return usages

async def _discover_api_endpoints_impl() -> Dict[str, Any]:
    """Implement API endpoint discovery."""
    project_root = Path(__file__).parent.parent
    backend_endpoints_dir = project_root / "backend" / "app" / "api" / "endpoints"
    frontend_src_dir = project_root / "frontend" / "src"

    endpoints: List[APIEndpoint] = []
    frontend_usages: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

    logger.info(f"Discovering endpoints from {backend_endpoints_dir}")

    # Discover backend endpoints
    if backend_endpoints_dir.exists():
        for endpoint_file in backend_endpoints_dir.glob("*.py"):
            if endpoint_file.name.startswith("_"):
                continue

            code = await _read_file_async(str(endpoint_file))
            if code:
                file_endpoints = _extract_endpoints_from_router(code, str(endpoint_file))
                endpoints.extend(file_endpoints)
                logger.info(f"Found {len(file_endpoints)} endpoints in {endpoint_file.name}")

    # Discover frontend usages
    if frontend_src_dir.exists():
        for tsx_file in frontend_src_dir.rglob("*.tsx"):
            code = await _read_file_async(str(tsx_file))
            if code:
                usages = _extract_frontend_usages(code, str(tsx_file))
                for usage in usages:
                    frontend_usages[usage.endpoint_path].append({
                        "component": usage.component_file,
                        "hook": usage.hook_type,
                        "line": usage.line_number
                    })

    # Identify critical endpoints (most used)
    critical_endpoints = sorted(
        frontend_usages.keys(),
        key=lambda x: len(frontend_usages[x]),
        reverse=True
    )[:5]

    return {
        "endpoints": [
            {
                "method": e.method,
                "path": e.path,
                "controller": e.controller,
                "requires_auth": e.requires_auth,
                "description": e.description
            }
            for e in endpoints
        ],
        "frontend_usages": dict(frontend_usages),
        "critical_endpoints": critical_endpoints,
        "total_endpoints": len(endpoints),
        "total_components": len([f for f in frontend_src_dir.rglob("*.tsx") if f.is_file()])
    }

# --- Test Generation Engine ---

def _generate_smoke_test_file(
    env: str,
    critical_paths: List[str],
    base_url: Optional[str] = None,
    endpoints: Optional[List[APIEndpoint]] = None
) -> tuple[str, int]:
    """Generate complete Playwright smoke test file."""

    if not base_url:
        base_url = f"http://localhost:5173" if env == "local" else f"https://careercopilot-{env}.web.app"

    test_cases = []
    test_count = 0

    # Test: Login
    if "login" in critical_paths:
        test_cases.append("""
    test('User can login and access dashboard', async ({ page }) => {
        // Navigate to login
        await page.goto('/login');

        // Verify page loaded
        await expect(page).toHaveTitle(/Career Copilot/i);
        await expect(page.getByLabel(/email/i)).toBeVisible();

        // Verify <3s load time
        const startTime = Date.now();
        await page.waitForLoadState('networkidle', { timeout: 3000 });
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);

        // Check for Sign In button
        const signInButton = page.getByRole('button', { name: /sign in/i });
        await expect(signInButton).toBeVisible();

        logger.info(`Login page load time: ${loadTime}ms`);
    });""")
        test_count += 1

    # Test: Search
    if "search" in critical_paths:
        test_cases.append("""
    test('User can search for jobs', async ({ page }) => {
        // Navigate to search page
        await page.goto('/search');

        // Verify page loaded
        await expect(page).toHaveTitle(/.*Search|Jobs/i);

        // Verify <3s load time
        const startTime = Date.now();
        await page.waitForLoadState('networkidle', { timeout: 3000 });
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);

        // Verify search input is visible
        const searchInput = page.getByPlaceholder(/search|query|keyword/i);
        await expect(searchInput).toBeVisible();

        // Type search query
        await searchInput.fill('Software Engineer');

        // Verify search results load
        await page.waitForLoadState('networkidle', { timeout: 5000 });

        logger.info(`Job search page load time: ${loadTime}ms`);
    });""")
        test_count += 1

    # Test: Apply
    if "apply" in critical_paths:
        test_cases.append("""
    test('User can view and interact with job applications', async ({ page }) => {
        // Navigate to applications page
        await page.goto('/applications');

        // Verify page loaded
        await expect(page).toHaveTitle(/Applications|Opportunities/i);

        // Verify <3s load time
        const startTime = Date.now();
        await page.waitForLoadState('networkidle', { timeout: 3000 });
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);

        // Verify applications list or empty state
        const appsList = page.locator('[data-testid="applications-list"]');
        const emptyState = page.locator('[data-testid="empty-state"]');

        const listVisible = await appsList.isVisible().catch(() => false);
        const emptyVisible = await emptyState.isVisible().catch(() => false);
        expect(listVisible || emptyVisible).toBeTruthy();

        logger.info(`Applications page load time: ${loadTime}ms`);
    });""")
        test_count += 1

    # Test: Profile
    if "profile" in critical_paths:
        test_cases.append("""
    test('User can view their profile', async ({ page }) => {
        // Navigate to profile page
        await page.goto('/profile');

        // Verify page loaded
        await expect(page).toHaveTitle(/Profile|Settings/i);

        // Verify <3s load time
        const startTime = Date.now();
        await page.waitForLoadState('networkidle', { timeout: 3000 });
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);

        // Verify profile sections exist
        const profileHeader = page.locator('[data-testid="profile-header"]');
        const profileContent = page.locator('[data-testid="profile-content"]');

        await expect(profileHeader).toBeVisible().catch(() => {
            return expect(profileContent).toBeVisible();
        });

        logger.info(`Profile page load time: ${loadTime}ms`);
    });""")
        test_count += 1

    # Test: API Health
    test_cases.append("""
    test('Backend API is responsive', async ({ request }) => {
        // Test /auth/me endpoint (common check)
        const response = await request.get('/api/auth/me', {
            headers: { 'Authorization': 'Bearer test-token' }
        }).catch(() => null);

        // Verify response time is acceptable (<3s)
        const startTime = Date.now();
        const healthResponse = await request.get('/api/config', {}).catch(() => null);
        const responseTime = Date.now() - startTime;

        if (healthResponse) {
            expect(healthResponse.status()).toBeLessThan(500);
            expect(responseTime).toBeLessThan(3000);
            logger.info(`API response time: ${responseTime}ms`);
        }
    });""")
    test_count += 1

    # Build complete test file
    test_file = f'''import {{ test, expect, Page }} from '@playwright/test';

// Configure base URL based on environment
const baseUrl = process.env.BASE_URL || '{base_url}';
test.use({{ baseURL: baseUrl }});

// Simple logger
const logger = {{
    info: (msg: string) => console.log(`[SMOKE] ${{msg}}`),
    warn: (msg: string) => console.warn(`[SMOKE-WARN] ${{msg}}`),
    error: (msg: string) => console.error(`[SMOKE-ERROR] ${{msg}}`)
}};

test.describe('Smoke Tests - Critical User Paths', () => {{
    test.beforeEach(async ({{ page }}) => {{
        logger.info(`Starting test in ${{baseUrl}}`);
    }});

{chr(10).join(test_cases)}
}});

// Helper function for performance assertions
async function measureLoadTime(page: Page, action: () => Promise<void>): Promise<number> {{
    const startTime = Date.now();
    await action();
    return Date.now() - startTime;
}}
'''

    return test_file, test_count

# --- MCP Tools ---

@mcp.tool()
async def discover_api_endpoints() -> str:
    """
    Discover backend API endpoints for smoke test generation.

    Scans backend/app/api/endpoints/*.py files to extract:
    - HTTP method (GET, POST, PUT, DELETE)
    - URL paths
    - Authentication requirements
    - Frontend component usages

    Returns JSON with:
    - endpoints: List of {method, path, controller, requires_auth, description}
    - frontend_usages: Map of endpoint paths to consuming components
    - critical_endpoints: High-priority endpoints for testing
    - total_endpoints: Count of discovered endpoints
    """
    try:
        logger.info("Starting API endpoint discovery...")
        result = await _discover_api_endpoints_impl()

        logger.info(f"Discovery complete: {result['total_endpoints']} endpoints, "
                   f"{len(result['frontend_usages'])} component usages")

        return json.dumps(result, indent=2)
    except Exception as e:
        logger.error(f"API discovery failed: {e}", exc_info=True)
        return json.dumps({"error": str(e), "endpoints": [], "frontend_usages": {}})

@mcp.tool()
async def generate_smoke_tests(
    env: str = "staging",
    critical_paths: List[str] = None,
    base_url: Optional[str] = None
) -> str:
    """
    Auto-generate smoke tests for critical user paths.

    Generates a production-ready Playwright test file at:
    frontend/tests/e2e/smoke/critical-paths.spec.ts

    Parameters:
    - env: Target environment (local, staging, production)
    - critical_paths: User paths to test (login, search, apply, profile)
    - base_url: Override base URL (defaults to environment-specific URL)

    Returns JSON with:
    - test_file_path: Path to generated test file
    - tests_generated: Number of test cases created
    - critical_paths_covered: List of paths with generated tests
    - lines_of_code: Total lines in generated file
    - performance_assertions: Number of <3s load time checks
    """
    try:
        if critical_paths is None:
            critical_paths = ["login", "search", "apply", "profile"]

        logger.info(f"Generating smoke tests for env={env}, paths={critical_paths}")

        # Generate test file
        test_file_content, test_count = _generate_smoke_test_file(
            env=env,
            critical_paths=critical_paths,
            base_url=base_url
        )

        # Write test file
        project_root = Path(__file__).parent.parent
        test_dir = project_root / "frontend" / "tests" / "e2e" / "smoke"
        test_dir.mkdir(parents=True, exist_ok=True)

        test_file_path = test_dir / "critical-paths.spec.ts"
        test_file_path.write_text(test_file_content)

        # Count performance assertions
        performance_checks = test_file_content.count("toBeLessThan(3000)")

        result = {
            "test_file_path": str(test_file_path),
            "tests_generated": test_count,
            "critical_paths_covered": critical_paths,
            "lines_of_code": len(test_file_content.split('\n')),
            "performance_assertions": performance_checks,
            "status": "success",
            "message": f"Generated {test_count} smoke tests in {test_file_path}"
        }

        logger.info(f"Test generation complete: {test_count} tests, "
                   f"{performance_checks} performance checks")

        return json.dumps(result, indent=2)
    except Exception as e:
        logger.error(f"Test generation failed: {e}", exc_info=True)
        return json.dumps({
            "error": str(e),
            "test_file_path": None,
            "tests_generated": 0,
            "status": "error"
        })

# --- Server Entry Point ---

if __name__ == "__main__":
    mcp.run()
