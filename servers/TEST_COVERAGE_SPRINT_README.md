# Test Coverage Sprint MCP Server

A high-performance MCP server for parallel test generation using a **module saturation** approach. Each module cluster (api, core, services, etc.) is worked to its coverage threshold independently, enabling parallel sprint execution across multiple agent sessions.

## Core Strategy: Module Saturation

Rather than a file-by-file approach, this server organizes work into **module sprints**. Each sprint targets a self-contained module cluster and runs until that module reaches its saturation threshold. Multiple sprints can run concurrently with no merge conflicts.

```
Module Saturation Approach:
  Sprint 1 (api) ──────────────────┐
  Sprint 2 (core) ─────────────────┤── Parallel Execution
  Sprint 3 (genkit_flows) ─────────┤   (separate agent sessions)
  Sprint 4 (services) ─────────────┘
                    │
                    └── Coverage Gate (95%)
```

## Tools

### 1. `get_sprint_assignment` — Self-Assignment for Codex/Agents

Returns the highest-priority module sprint(s) for an agent to claim. Use this first to determine what to work on.

```python
get_sprint_assignment(
    exclude_saturated=True,  # Skip already-done modules
    top_n=3                   # Return top 3 assignments
)
```

**Returns:** Ranked list of modules with current coverage, gap, and exact commands.

---

### 2. `run_module_saturation_sprint` — Execute a Sprint

Runs a complete saturation sprint for one module: measures baseline, identifies untested files, organizes them into parallel batches, and generates step-by-step instructions for the agent to execute.

```python
run_module_saturation_sprint(
    module="services",               # Module to saturate
    target_module_coverage=90.0,     # Override default target
    batch_size=5,                    # Files per batch
    dry_run=False                    # Set True to plan only
)
```

**Returns:**
- `coverage_before` / `coverage_after` (estimated)
- `batches` — files organized into parallel processing groups
- `sprint_instructions` — ordered steps with exact pytest commands
- `saturated` — whether target was reached

**Supported modules:**

| Module | Default Target | Priority |
|--------|---------------|----------|
| `api` | 85% | 1 (Critical) |
| `core` | 85% | 2 (High) |
| `genkit_flows` | 80% | 3 (High) |
| `services` | 85% | 4 (Medium) |
| `agents` | 75% | 5 (Medium) |
| `ai_operations` | 75% | 5 (Medium) |
| `models` | 75% | 6 (Medium) |
| `schemas` | 75% | 6 (Medium) |
| `utils` | 70% | 7 (Low) |
| `workers` | 70% | 7 (Low) |

---

### 3. `analyze_coverage_gaps` — Full Gap Analysis

Runs a comprehensive coverage analysis across frontend and backend, now including a `saturation_map` showing per-module status.

```python
analyze_coverage_gaps(target_coverage=95.0)
```

**Key addition — `saturation_map`:**
```json
"saturation_map": [
  {
    "module": "api",
    "current_coverage": 42.0,
    "target_coverage": 85,
    "gap": 43.0,
    "saturated": false,
    "untested_file_count": 8
  },
  ...
]
```

---

### 4. `generate_tests_parallel` — Legacy Batch Mode

Original batch-based test generation (file-level, not module-level). Still available for targeted use.

---

## Workflow for Parallel Sprints

### Step 1: Check assignments
```
get_sprint_assignment(top_n=5)
```

### Step 2: Claim a module sprint (each agent takes one)
```
run_module_saturation_sprint(module="api", target_module_coverage=85)
```

### Step 3: Execute sprint instructions
Follow the `sprint_instructions` returned — each step has an exact command and a verify command.

### Step 4: Verify saturation
```bash
cd backend && python -m pytest app/tests/api/ --cov=app/api --cov-fail-under=85 -q
```

### Step 5: Final coverage gate (after all sprints)
```bash
cd backend && python -m pytest app/tests/ --cov=app --cov-fail-under=95 -q
```

---

## Priority Scoring Algorithm

Each file receives a priority score (0–100):

- **Base**: 50 points
- **Category weight**: 10–45 points (API=45, Services=35, Core=30, etc.)
- **Router bonus**: +20 (router.py, index.tsx)
- **Service bonus**: +15 (files with "service" in name)

Score is clamped to 100.

---

## Architecture

### Coverage Analysis Pipeline

```
┌─ Backend Module Analysis
│  ├─ Run pytest --cov=app (single pass)
│  ├─ Parse per-module coverage from term output
│  ├─ Build saturation_map (current vs target)
│  └─ Identify untested files per module
│
├─ Frontend Analysis
│  ├─ Scan src/ for .tsx without matching .test.tsx
│  └─ Categorize by components/features/hooks/api
│
└─ Priority Queue + Sprint Assignments
   ├─ Score = gap × category_weight
   └─ Return top N unsaturated modules
```

### Module Saturation Pipeline

```
run_module_saturation_sprint(module="services")
│
├── 1. Measure baseline (pytest --cov=app/services)
├── 2. Find untested files in services/
├── 3. Divide into batches of N
├── 4. Generate step-by-step instructions per batch
│   ├── Batch 1 (files 1-5): write tests → verify
│   ├── Batch 2 (files 6-10): write tests → verify
│   └── ...
└── 5. Final: verify saturation threshold met
```

---

## Environment Setup

```bash
# Install dependencies
pip install mcp google-generativeai sentry-sdk python-dotenv

# Start MCP server
python3 servers/test_coverage_sprint.py
```

## Logging

Server logs to `/tmp/mcp-test-coverage-sprint.log`:

```bash
tail -f /tmp/mcp-test-coverage-sprint.log
```

## Known Limitations

1. **Test file detection**: Relies on naming conventions (`test_*.py`, `*.test.tsx`)
2. **Coverage measurement**: Module-level coverage via pytest-cov regex parsing — requires tests to be runnable
3. **Actual test writing**: This skill plans and coordinates; the agent executes the writing
4. **Frontend coverage**: Jest coverage requires `yarn test:coverage` to have run first

## References

- **Sprint Plan**: [sprint_plan.md](../.gemini/antigravity/brain/58937d05-f539-458b-853e-a8f81773e072/sprint_plan.md)
- **Pytest Coverage**: https://pytest-cov.readthedocs.io/
- **MCP Specification**: https://spec.modelcontextprotocol.io/
