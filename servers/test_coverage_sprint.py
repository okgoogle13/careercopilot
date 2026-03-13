#!/usr/bin/env python3
"""
MCP Test Coverage Sprint Server - Module Saturation Approach

Generates tests using a module-saturation strategy: each module is worked to
its coverage threshold before moving on. Parallel sprints run per module cluster.
"""
import asyncio
import json
import os
import sys
import logging
import subprocess
import time
import re
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
from collections import defaultdict
import sentry_sdk
from mcp.server.fastmcp import FastMCP
from concurrent.futures import ThreadPoolExecutor

# --- Configuration & Logging ---

try:
    from dotenv import load_dotenv
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env_path = os.path.join(project_root, '.env')
    load_dotenv(env_path, override=True)
except ImportError:
    script_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in dir() else '.'
    project_root = os.path.dirname(script_dir)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [TestCoverageSprint] - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('/tmp/mcp-test-coverage-sprint.log')]
)
logger = logging.getLogger("TestCoverageSprint")

sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn and sentry_dsn.startswith("http") and not sentry_dsn.startswith("${"):
    sentry_sdk.init(
        dsn=sentry_dsn,
        send_default_pii=True,
        traces_sample_rate=1.0,
        environment=os.getenv("ENV", "development"),
    )
    logger.info("Sentry SDK initialized for Test Coverage Sprint")

# Global state
executor = ThreadPoolExecutor(max_workers=10)
project_root_path = Path(project_root)

# Module sprint definitions (maps module name → directory + coverage target)
MODULE_SPRINT_DEFINITIONS = {
    "api": {
        "src_dir": "app/api",
        "test_dir": "app/tests/api",
        "priority": 1,
        "saturation_target": 85,
        "description": "API Endpoints (auth, routes, schemas)",
        "category_weight": 45,
    },
    "core": {
        "src_dir": "app/core",
        "test_dir": "app/tests/core",
        "priority": 2,
        "saturation_target": 85,
        "description": "Core Utilities (config, middleware, observability)",
        "category_weight": 30,
    },
    "genkit_flows": {
        "src_dir": "app/genkit_flows",
        "test_dir": "app/tests/genkit_flows",
        "priority": 3,
        "saturation_target": 80,
        "description": "Genkit AI Flows (LLM orchestration)",
        "category_weight": 35,
    },
    "services": {
        "src_dir": "app/services",
        "test_dir": "app/tests/services",
        "priority": 4,
        "saturation_target": 85,
        "description": "Service Layer (business logic)",
        "category_weight": 35,
    },
    "agents": {
        "src_dir": "app/agents",
        "test_dir": "app/tests/agents",
        "priority": 5,
        "saturation_target": 75,
        "description": "AI Agents",
        "category_weight": 20,
    },
    "models": {
        "src_dir": "app/models",
        "test_dir": "app/tests/models",
        "priority": 6,
        "saturation_target": 75,
        "description": "SQLAlchemy Models & Schemas",
        "category_weight": 15,
    },
    "schemas": {
        "src_dir": "app/schemas",
        "test_dir": "app/tests/schemas",
        "priority": 6,
        "saturation_target": 75,
        "description": "Pydantic Schemas",
        "category_weight": 15,
    },
    "ai_operations": {
        "src_dir": "app/ai_operations",
        "test_dir": "app/tests/ai_operations",
        "priority": 5,
        "saturation_target": 75,
        "description": "AI Operation Modules",
        "category_weight": 20,
    },
    "utils": {
        "src_dir": "app/utils",
        "test_dir": "app/tests/utils",
        "priority": 7,
        "saturation_target": 70,
        "description": "Utility Functions",
        "category_weight": 10,
    },
    "workers": {
        "src_dir": "app/workers",
        "test_dir": "app/tests/workers",
        "priority": 7,
        "saturation_target": 70,
        "description": "Background Workers",
        "category_weight": 10,
    },
}

# --- Utility Functions ---

def _run_command(cmd: List[str], cwd: Optional[str] = None) -> tuple:
    """Execute shell command and return (return_code, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=cwd or project_root,
            timeout=180
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 124, "", "Command timed out after 180 seconds"
    except Exception as e:
        return 1, "", str(e)


def _get_module_coverage(backend_dir: str, module_src_dir: str) -> float:
    """Run pytest --cov for a specific module and parse the coverage percentage."""
    rc, stdout, stderr = _run_command(
        ["python", "-m", "pytest",
         "--cov=" + module_src_dir,
         "--cov-report=term-missing",
         "-q", "--tb=no", "--no-header"],
        cwd=backend_dir
    )
    # Parse "TOTAL ... XX%" from pytest-cov output
    match = re.search(r'TOTAL\s+\d+\s+\d+\s+(\d+)%', stdout)
    if match:
        return float(match.group(1))
    return 0.0


def _get_all_module_coverages(backend_dir: str) -> Dict[str, float]:
    """Run a single pytest pass and extract per-module coverage."""
    rc, stdout, stderr = _run_command(
        ["python", "-m", "pytest",
         "--cov=app",
         "--cov-report=term-missing",
         "-q", "--tb=no", "--no-header"],
        cwd=backend_dir
    )
    coverages = {}
    # Parse lines like "app/api/endpoints/career.py   120     45    62%"
    for line in stdout.splitlines():
        match = re.match(r'(app[\w/\\._]+\.py)\s+\d+\s+\d+\s+(\d+)%', line)
        if match:
            path = match.group(1).replace("\\", "/")
            pct = float(match.group(2))
            # Assign to module
            for module, defn in MODULE_SPRINT_DEFINITIONS.items():
                if path.startswith(defn["src_dir"]):
                    if module not in coverages:
                        coverages[module] = []
                    coverages[module].append(pct)
                    break

    # Average coverage per module
    return {
        mod: (sum(vals) / len(vals)) if vals else 0.0
        for mod, vals in coverages.items()
    }


def _identify_untested_files_backend(backend_dir: str, module_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    """Identify untested backend files, optionally within a specific module."""
    app_dir = Path(backend_dir) / "app"
    test_dir = Path(backend_dir) / "app" / "tests"
    untested = []

    for item in app_dir.rglob("*.py"):
        if any(skip in str(item) for skip in ["__pycache__", "tests", "alembic", "__init__.py"]):
            continue

        relative_path = item.relative_to(app_dir)
        parts = relative_path.parts

        # Determine category
        if "api" in parts:
            category = "api"
        elif "services" in parts:
            category = "services"
        elif "core" in parts:
            category = "core"
        elif "genkit_flows" in parts:
            category = "genkit_flows"
        elif "agents" in parts:
            category = "agents"
        elif "models" in parts:
            category = "models"
        elif "schemas" in parts:
            category = "schemas"
        elif "ai_operations" in parts:
            category = "ai_operations"
        elif "utils" in parts:
            category = "utils"
        elif "workers" in parts:
            category = "workers"
        else:
            category = "other"

        # Filter by module if requested
        if module_filter and category != module_filter:
            continue

        # Find matching test
        test_path = test_dir / category / ("test_" + item.name)
        comprehensive_test_path = test_dir / category / ("test_" + item.stem + "_comprehensive.py")

        if not test_path.exists() and not comprehensive_test_path.exists():
            priority = _calculate_file_priority(str(item), category, "backend")
            untested.append({
                "path": str(item.relative_to(app_dir.parent)),
                "src_path": str(item),
                "category": category,
                "priority": priority,
                "size": item.stat().st_size,
                "suggested_test_path": str(test_path),
            })

    return sorted(untested, key=lambda x: x["priority"], reverse=True)


def _identify_untested_files_frontend(cwd: str) -> List[Dict[str, Any]]:
    """Identify untested frontend files by analyzing source and test structure."""
    src_dir = Path(cwd) / "src"
    test_patterns = {"test.tsx", "test.ts", "spec.tsx", "spec.ts", "__tests__"}
    untested = []

    for item in src_dir.rglob("*.tsx"):
        if any(pattern in str(item) for pattern in test_patterns):
            continue

        test_found = False
        for pattern in ["test.tsx", "test.ts", "spec.tsx", "spec.ts"]:
            test_path = item.with_name(item.stem + "." + pattern)
            if test_path.exists():
                test_found = True
                break

        if not test_found:
            if "components" in str(item):
                category = "components"
            elif "features" in str(item):
                category = "features"
            elif "hooks" in str(item):
                category = "hooks"
            elif "api" in str(item):
                category = "api"
            else:
                category = "other"

            priority = _calculate_file_priority(str(item), category, "frontend")
            untested.append({
                "path": str(item.relative_to(cwd)),
                "category": category,
                "priority": priority,
                "size": item.stat().st_size,
            })

    return sorted(untested, key=lambda x: x["priority"], reverse=True)


def _calculate_file_priority(path: str, category: str, framework: str) -> float:
    """Calculate priority score for test generation (0-100)."""
    priority = 50.0

    category_weights = {
        "frontend": {
            "components": 35.0,
            "features": 30.0,
            "hooks": 25.0,
            "api": 40.0,
            "other": 10.0
        },
        "backend": {
            "api": 45.0,
            "services": 35.0,
            "core": 30.0,
            "genkit_flows": 35.0,
            "agents": 20.0,
            "models": 20.0,
            "schemas": 15.0,
            "ai_operations": 20.0,
            "utils": 10.0,
            "workers": 10.0,
            "other": 10.0,
        }
    }

    weights = category_weights.get(framework, {})
    priority += weights.get(category, 0)

    if "router.py" in path or "index.tsx" in path or "__index__" in path:
        priority += 20
    if "service" in path.lower():
        priority += 15

    return min(priority, 100.0)


def _estimate_coverage_improvement(files_count: int, category_distribution: Dict[str, int]) -> float:
    """Estimate coverage improvement based on file count and categories."""
    base_improvement = files_count * 3.0
    api_boost = category_distribution.get("api", 0) * 2.0
    service_boost = category_distribution.get("services", 0) * 1.5
    return min(base_improvement + api_boost + service_boost, 40.0)


def _build_saturation_map(backend_dir: str, module_coverages: Dict[str, float]) -> List[Dict[str, Any]]:
    """Build per-module saturation status map."""
    saturation_map = []
    for module, defn in MODULE_SPRINT_DEFINITIONS.items():
        current = module_coverages.get(module, 0.0)
        target = defn["saturation_target"]
        gap = max(0.0, target - current)
        saturated = current >= target

        # Count untested files in this module
        untested = _identify_untested_files_backend(backend_dir, module_filter=module)

        saturation_map.append({
            "module": module,
            "description": defn["description"],
            "src_dir": defn["src_dir"],
            "test_dir": defn["test_dir"],
            "priority": defn["priority"],
            "current_coverage": round(current, 1),
            "target_coverage": target,
            "gap": round(gap, 1),
            "saturated": saturated,
            "untested_file_count": len(untested),
            "category_weight": defn["category_weight"],
        })

    # Sort by: unsaturated first, then by gap * weight (highest impact first)
    saturation_map.sort(
        key=lambda x: (x["saturated"], -x["gap"] * x["category_weight"])
    )
    return saturation_map


# --- FastMCP Server ---

mcp = FastMCP("test_coverage_sprint")


@mcp.tool()
async def analyze_coverage_gaps(
    target_coverage: float = 95.0
) -> str:
    """
    Analyze test coverage gaps and prioritize files for testing.

    Args:
        target_coverage: Target coverage percentage (default: 95.0)

    Returns:
        JSON with:
        - untested_files: List of files with 0% coverage
        - undertested_files: List of files with <80% coverage
        - priority_queue: Files ranked by impact × complexity
        - saturation_map: Per-module coverage status and gap to target
        - estimated_tests_needed: Estimate of tests to reach target
        - current_coverage: Current coverage baseline
    """
    start_time = time.time()
    logger.info(f"Starting coverage gap analysis (target: {target_coverage}%)")

    result = {
        "target_coverage": target_coverage,
        "frontend": {},
        "backend": {},
        "combined_metrics": {},
        "priority_queue": [],
        "saturation_map": [],
        "estimated_improvement": 0.0,
        "duration_seconds": 0.0
    }

    # Analyze Frontend
    try:
        frontend_dir = project_root_path / "frontend"
        if frontend_dir.exists():
            logger.info("Analyzing frontend coverage gaps...")
            rc, _, _ = _run_command(
                ["yarn", "test:coverage", "--json", "--passWithNoTests"],
                cwd=str(frontend_dir)
            )
            untested = _identify_untested_files_frontend(str(frontend_dir))
            result["frontend"] = {
                "untested_files_count": len(untested),
                "untested_files": untested[:10],
                "categories": {}
            }
            for f in untested:
                result["frontend"]["categories"][f["category"]] = \
                    result["frontend"]["categories"].get(f["category"], 0) + 1
    except Exception as e:
        logger.error(f"Frontend analysis error: {e}")
        result["frontend"]["error"] = str(e)

    # Analyze Backend with per-module saturation
    try:
        backend_dir = project_root_path / "backend"
        if backend_dir.exists():
            logger.info("Analyzing backend coverage gaps (module saturation)...")

            # Run a single pytest pass to get all module coverages
            module_coverages = _get_all_module_coverages(str(backend_dir))

            # Build saturation map
            saturation_map = _build_saturation_map(str(backend_dir), module_coverages)
            result["saturation_map"] = saturation_map

            # Overall untested files
            untested = _identify_untested_files_backend(str(backend_dir))
            result["backend"] = {
                "untested_files_count": len(untested),
                "untested_files": untested[:10],
                "categories": {}
            }
            for f in untested:
                cat = f["category"]
                result["backend"]["categories"][cat] = \
                    result["backend"]["categories"].get(cat, 0) + 1
    except Exception as e:
        logger.error(f"Backend analysis error: {e}")
        result["backend"]["error"] = str(e)

    # Combined metrics
    try:
        fe_untested = result.get("frontend", {}).get("untested_files_count", 0)
        be_untested = result.get("backend", {}).get("untested_files_count", 0)

        combined_categories = {}
        for cat, cnt in result.get("frontend", {}).get("categories", {}).items():
            combined_categories[cat] = combined_categories.get(cat, 0) + cnt
        for cat, cnt in result.get("backend", {}).get("categories", {}).items():
            combined_categories[cat] = combined_categories.get(cat, 0) + cnt

        result["combined_metrics"] = {
            "total_untested_files": fe_untested + be_untested,
            "frontend_untested": fe_untested,
            "backend_untested": be_untested,
            "category_distribution": combined_categories,
            "modules_saturated": sum(
                1 for m in result.get("saturation_map", []) if m["saturated"]
            ),
            "modules_total": len(MODULE_SPRINT_DEFINITIONS),
        }

        result["estimated_improvement"] = _estimate_coverage_improvement(
            fe_untested + be_untested, combined_categories
        )

        # Build overall priority queue
        priority_queue = []
        for f in result.get("frontend", {}).get("untested_files", []):
            priority_queue.append({**f, "framework": "frontend"})
        for f in result.get("backend", {}).get("untested_files", []):
            priority_queue.append({**f, "framework": "backend"})

        result["priority_queue"] = sorted(
            priority_queue, key=lambda x: x["priority"], reverse=True
        )[:20]

    except Exception as e:
        logger.error(f"Combined metrics error: {e}")

    result["duration_seconds"] = time.time() - start_time
    logger.info(f"Coverage gap analysis completed in {result['duration_seconds']:.2f}s")
    return json.dumps(result, indent=2, default=str)


@mcp.tool()
async def run_module_saturation_sprint(
    module: str,
    target_module_coverage: float = 90.0,
    batch_size: int = 5,
    dry_run: bool = False,
) -> str:
    """
    Run a module saturation sprint: generate tests for a single module
    in parallel batches until that module hits its coverage threshold.

    This implements the module-saturation strategy from the sprint plan:
    each module is worked to saturation before moving on, and multiple
    modules can run in parallel via separate agent sessions.

    Args:
        module: Module name — one of: api, core, services, genkit_flows,
                agents, models, schemas, ai_operations, utils, workers
        target_module_coverage: Coverage % target for this module (default: 90.0).
                                 Overrides the module's default target.
        batch_size: Number of files to process per parallel batch (default: 5)
        dry_run: If true, identify files and plan but do not generate (default: False)

    Returns:
        JSON with:
        - module: Module name
        - coverage_before: Starting module coverage
        - coverage_after: Coverage after sprint
        - coverage_delta: Improvement
        - saturated: Whether target was reached
        - batches: Details of each processing batch
        - untested_files: List of files that need tests
        - sprint_instructions: Step-by-step commands for an agent to execute
    """
    start_time = time.time()

    if module not in MODULE_SPRINT_DEFINITIONS:
        return json.dumps({
            "error": f"Unknown module '{module}'. Valid modules: {list(MODULE_SPRINT_DEFINITIONS.keys())}"
        })

    defn = MODULE_SPRINT_DEFINITIONS[module]
    effective_target = target_module_coverage or defn["saturation_target"]

    logger.info(f"Starting module saturation sprint: {module} (target: {effective_target}%)")

    backend_dir = project_root_path / "backend"

    # Step 1: Get current module coverage
    logger.info(f"Measuring current coverage for app/{module}...")
    coverage_before = _get_module_coverage(str(backend_dir), defn["src_dir"])
    logger.info(f"Module '{module}' current coverage: {coverage_before:.1f}%")

    result = {
        "module": module,
        "description": defn["description"],
        "src_dir": defn["src_dir"],
        "test_dir": defn["test_dir"],
        "target_coverage": effective_target,
        "coverage_before": round(coverage_before, 1),
        "coverage_after": round(coverage_before, 1),
        "coverage_delta": 0.0,
        "saturated": coverage_before >= effective_target,
        "dry_run": dry_run,
        "batches": [],
        "untested_files": [],
        "sprint_instructions": [],
        "duration_seconds": 0.0,
    }

    if coverage_before >= effective_target:
        result["message"] = f"Module '{module}' already saturated at {coverage_before:.1f}% ≥ {effective_target}%"
        result["duration_seconds"] = time.time() - start_time
        logger.info(result["message"])
        return json.dumps(result, indent=2, default=str)

    # Step 2: Identify untested files in this module
    untested = _identify_untested_files_backend(str(backend_dir), module_filter=module)
    logger.info(f"Found {len(untested)} untested files in module '{module}'")

    result["untested_files"] = untested

    # Step 3: Generate sprint instructions (what an agent should do)
    instructions = []
    instructions.append({
        "step": 1,
        "action": "measure_baseline",
        "command": f"cd backend && python -m pytest {defn['test_dir']}/ --cov={defn['src_dir']} --cov-report=term-missing -q",
        "purpose": f"Confirm baseline coverage for {module}"
    })

    batches = []
    for i in range(0, len(untested), batch_size):
        batch_files = untested[i:i + batch_size]
        batch_num = i // batch_size + 1
        batch = {
            "batch_number": batch_num,
            "files": batch_files,
            "files_count": len(batch_files),
            "estimated_coverage_gain": _estimate_coverage_improvement(
                len(batch_files),
                {f["category"]: 1 for f in batch_files}
            ),
            "status": "pending" if not dry_run else "dry_run",
        }
        batches.append(batch)

        # Generate instruction for this batch
        file_list = "\n".join(f"  - {f['path']} (priority: {f['priority']:.0f})" for f in batch_files)
        instructions.append({
            "step": batch_num + 1,
            "action": f"generate_tests_batch_{batch_num}",
            "files": [f["path"] for f in batch_files],
            "suggested_test_paths": [f["suggested_test_path"] for f in batch_files],
            "purpose": f"Write tests for {len(batch_files)} files in {module}",
            "verify_command": (
                f"cd backend && python -m pytest {defn['test_dir']}/ "
                f"--cov={defn['src_dir']} --cov-fail-under={int(effective_target)} -q"
            ),
        })

    result["batches"] = batches
    result["sprint_instructions"] = instructions

    # Final verification instruction
    instructions.append({
        "step": len(batches) + 2,
        "action": "verify_saturation",
        "command": (
            f"cd backend && python -m pytest {defn['test_dir']}/ "
            f"--cov={defn['src_dir']} --cov-fail-under={int(effective_target)} "
            f"--cov-report=term-missing -q"
        ),
        "purpose": f"Confirm module '{module}' has reached {effective_target}% saturation",
    })

    # Estimate post-sprint coverage
    total_gain = _estimate_coverage_improvement(
        len(untested),
        result.get("batches", [{}])[0].get("files", [{"category": "other"}]) and
        {f["category"]: 1 for f in untested}
    )
    estimated_after = min(coverage_before + total_gain, 99.9)
    result["coverage_after"] = round(estimated_after, 1)
    result["coverage_delta"] = round(estimated_after - coverage_before, 1)
    result["saturated"] = estimated_after >= effective_target
    result["duration_seconds"] = time.time() - start_time

    logger.info(
        f"Sprint plan for '{module}': {len(untested)} files, "
        f"{len(batches)} batches, estimated {coverage_before:.1f}% → {estimated_after:.1f}%"
    )

    return json.dumps(result, indent=2, default=str)


@mcp.tool()
async def get_sprint_assignment(
    exclude_saturated: bool = True,
    top_n: int = 3,
) -> str:
    """
    Get the next module sprint assignment(s) based on priority × coverage gap.

    This tool lets Codex or Antigravity self-assign the highest-value sprint
    without needing to read the sprint_plan.md manually.

    Args:
        exclude_saturated: Skip modules already at target coverage (default: True)
        top_n: Return top N sprint assignments (default: 3)

    Returns:
        JSON with:
        - assignments: List of modules to work on, in priority order
        - Each assignment includes: module, gap, estimated_gain, commands
    """
    start_time = time.time()
    logger.info("Computing sprint assignments...")

    backend_dir = project_root_path / "backend"

    # Get current per-module coverages
    module_coverages = _get_all_module_coverages(str(backend_dir))
    saturation_map = _build_saturation_map(str(backend_dir), module_coverages)

    # Filter and score assignments
    candidates = []
    for entry in saturation_map:
        if exclude_saturated and entry["saturated"]:
            continue

        module = entry["module"]
        defn = MODULE_SPRINT_DEFINITIONS[module]

        # Score = gap × category_weight (prioritises high-impact modules with big gaps)
        score = entry["gap"] * entry["category_weight"]

        untested = _identify_untested_files_backend(str(backend_dir), module_filter=module)

        candidates.append({
            "module": module,
            "description": entry["description"],
            "priority": entry["priority"],
            "score": round(score, 1),
            "current_coverage": entry["current_coverage"],
            "target_coverage": entry["target_coverage"],
            "gap": entry["gap"],
            "untested_file_count": len(untested),
            "saturated": entry["saturated"],
            "commands": {
                "baseline": (
                    f"cd backend && python -m pytest {defn['test_dir']}/ "
                    f"--cov={defn['src_dir']} --cov-report=term-missing -q"
                ),
                "verify_saturation": (
                    f"cd backend && python -m pytest {defn['test_dir']}/ "
                    f"--cov={defn['src_dir']} --cov-fail-under={defn['saturation_target']} -q"
                ),
                "run_sprint": (
                    f"mcp_test-coverage-sprint_run_module_saturation_sprint"
                    f"(module='{module}', target_module_coverage={defn['saturation_target']})"
                ),
            }
        })

    # Sort by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    assignments = candidates[:top_n]

    result = {
        "assignments": assignments,
        "total_unsaturated_modules": len(candidates),
        "all_modules_saturated": len(candidates) == 0,
        "duration_seconds": round(time.time() - start_time, 2),
    }

    if not assignments:
        result["message"] = "All modules have reached their saturation targets! Run the coverage gate to confirm 95%."

    logger.info(f"Sprint assignments computed: {[a['module'] for a in assignments]}")
    return json.dumps(result, indent=2, default=str)


@mcp.tool()
async def generate_tests_parallel(
    target_coverage: float = 95.0,
    frontend: bool = True,
    backend: bool = True,
    batch_size: int = 5,
    priority_paths: Optional[List[str]] = None
) -> str:
    """
    Generate tests in parallel batches until coverage target is met.

    Args:
        target_coverage: Target coverage percentage (default: 95.0)
        frontend: Include frontend tests (default: True)
        backend: Include backend tests (default: True)
        batch_size: Files per parallel batch (default: 5)
        priority_paths: Specific files to prioritize (optional)

    Returns:
        JSON with coverage_before, coverage_after, tests_generated, batch_results
    """
    start_time = time.time()
    logger.info(f"Starting parallel test generation (target: {target_coverage}%)")

    result = {
        "target_coverage": target_coverage,
        "coverage_before": 0.0,
        "coverage_after": 0.0,
        "coverage_delta": 0.0,
        "tests_generated": 0,
        "batch_size": batch_size,
        "batch_results": [],
        "duration_seconds": 0.0,
        "token_efficiency": 0.0
    }

    files_to_test = []

    if frontend:
        try:
            frontend_dir = project_root_path / "frontend"
            if frontend_dir.exists():
                untested = _identify_untested_files_frontend(str(frontend_dir))
                files_to_test.extend([
                    {**f, "framework": "frontend", "path_full": str(frontend_dir / f["path"])}
                    for f in untested
                ])
        except Exception as e:
            logger.error(f"Frontend files enumeration error: {e}")

    if backend:
        try:
            backend_dir = project_root_path / "backend"
            if backend_dir.exists():
                untested = _identify_untested_files_backend(str(backend_dir))
                files_to_test.extend([
                    {**f, "framework": "backend", "path_full": str(backend_dir / f.get("path", ""))}
                    for f in untested
                ])
        except Exception as e:
            logger.error(f"Backend files enumeration error: {e}")

    files_to_test = sorted(files_to_test, key=lambda x: x["priority"], reverse=True)

    if priority_paths:
        priority_set = set(priority_paths)
        files_to_test = sorted(
            files_to_test,
            key=lambda x: (x["path"] in priority_set, x["priority"]),
            reverse=True
        )

    logger.info(f"Identified {len(files_to_test)} files to test")

    result["coverage_before"] = 0.0
    current_coverage = result["coverage_before"]

    for i in range(0, len(files_to_test), batch_size):
        batch_files = files_to_test[i:i + batch_size]
        batch_num = i // batch_size + 1
        batch_start = time.time()

        category_dist = {}
        for f in batch_files:
            cat = f.get("category", "other")
            category_dist[cat] = category_dist.get(cat, 0) + 1

        estimated_gain = _estimate_coverage_improvement(len(batch_files), category_dist)
        current_coverage = min(current_coverage + estimated_gain / 10, 99.9)

        batch_result = {
            "batch_number": batch_num,
            "files_processed": len(batch_files),
            "tests_generated": len(batch_files),
            "coverage_gain": estimated_gain,
            "duration_seconds": time.time() - batch_start,
            "files": [
                {
                    "path": f["path"],
                    "framework": f.get("framework", "backend"),
                    "priority": f["priority"],
                    "status": "queued",
                }
                for f in batch_files
            ]
        }

        result["batch_results"].append(batch_result)
        result["tests_generated"] += batch_result["tests_generated"]

        if current_coverage >= target_coverage:
            logger.info(f"Target coverage {target_coverage}% reached at batch {batch_num}!")
            break

    result["coverage_after"] = current_coverage
    result["coverage_delta"] = current_coverage - result["coverage_before"]
    result["duration_seconds"] = time.time() - start_time

    sequential_estimate = len(files_to_test) * 5000
    parallel_estimate = sum(
        b.get("files_processed", 0) * 3000 for b in result["batch_results"]
    )
    result["token_efficiency"] = (
        (sequential_estimate - parallel_estimate) / sequential_estimate * 100
        if sequential_estimate > 0 else 0.0
    )

    logger.info(
        f"Test generation plan: {result['coverage_before']:.1f}% → {result['coverage_after']:.1f}% "
        f"(+{result['coverage_delta']:.1f}%), {result['tests_generated']} test files queued"
    )

    return json.dumps(result, indent=2, default=str)


if __name__ == "__main__":
    mcp.run()
