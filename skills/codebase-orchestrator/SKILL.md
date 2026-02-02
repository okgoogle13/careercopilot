---
name: codebase-orchestrator
description: Multi-MCP codebase status orchestration and component migration coordination. Use when acting as deployment orchestrator in Claude Desktop to review comprehensive codebase status across multiple concerns (build, tests, quality, deployment readiness, component migrations), coordinate between filesystem/git/testing MCP servers to avoid token bloat, confirm readiness gates, and delegate task definition to IDE agents (Codex CLI, Gemini) for next-step planning and implementation.
---

# Codebase Orchestrator Skill

Acts as a deployment orchestration coordinator when using Claude Desktop with MCP servers. This skill enables you to systematically review codebase status across multiple dimensions without loading full file contents into context, coordinate decisions across MCP-enabled tools, and hand off concrete next-steps to IDE agents for execution.

## Core Workflow

```
1. ASSESS → Gather status across all dimensions via MCP servers
2. REVIEW → Synthesize findings against readiness criteria
3. GATE → Confirm or escalate blockers
4. DELEGATE → Generate task definitions for IDE agents
5. TRACK → Document decisions in project planning
```

## MCP Server Coordination

### Filesystem MCP Server
Used for codebase structure, file metadata, and configuration discovery **without loading full contents**.

```
Pattern: Query file paths, sizes, modification dates, and existence checks
Example: Check if migration_registry.json exists and when it was last updated
Output: Returns metadata only; triggers full review via other MCP servers or manual inspection
```

### Git MCP Server
Used for change tracking, branch status, deployment history, and component diff analysis.

```
Pattern: Query recent commits, branch divergence, deployment tags, component change patterns
Example: "What files changed in feature-X between staging and production?"
Critical: Use git diffs to understand component boundaries without loading full files
```

### Testing MCP Server
Used for test coverage, test result aggregation, and quality gate status.

```
Pattern: Query test results, coverage by component, failed test details, performance benchmarks
Example: "Which components have coverage below 80%? What's failing?"
Output: Summary metrics; drill into specific failures only when necessary
```

## Status Review Framework

Review status across these dimensions in order:

### 1. Build Status
- **Query**: Recent build logs via filesystem MCP (get latest build artifact metadata)
- **Query**: Git branch health (are there unmerged commits that block builds?)
- **Decision**: Build passes → PROCEED | Build fails → BLOCK, document errors
- **Output**: Build readiness status + blocking issues (if any)

### 2. Test Coverage & Results
- **Query**: Testing MCP for coverage by component
- **Query**: Failed tests by severity (critical/warning/info)
- **Decision**: Coverage meets threshold + no critical failures → PROCEED | Otherwise → FLAG
- **Output**: Coverage report + list of failing tests requiring attention

### 3. Code Quality Metrics
- **Query**: Static analysis results (linting, type checking, complexity) via filesystem MCP
- **Query**: Component quality scores (if tracked)
- **Decision**: Quality meets baseline → PROCEED | Degradation detected → ESCALATE
- **Output**: Quality baseline vs. current + components above/below threshold

### 4. Deployment Readiness
- **Query**: Git tags, deployment branches, environment configs via Git MCP
- **Query**: Secrets, certificates, environment variables (metadata only, via filesystem)
- **Decision**: All prerequisite configs in place → PROCEED | Missing configs → BLOCK
- **Output**: Deployment checklist status + missing prerequisites

### 5. Component Migration Status
- **Query**: Migration registry (what's been migrated, what's pending) via filesystem MCP
- **Query**: Component dependency graph via git diffs (what changed recently)
- **Decision**: Migrated components stable + new components match migration criteria → PROCEED | Inconsistencies detected → INVESTIGATE
- **Output**: Migration progress + component readiness summary

## Decision Gate Pattern

After reviewing all dimensions, use this decision tree:

```
IF all gates (build, tests, quality, deployment, migration) are GREEN:
  → Status: READY FOR DEPLOYMENT
  → Output: Concise summary + proceed to DELEGATE phase

IF some gates are YELLOW (warnings, non-critical issues):
  → Status: READY WITH CAUTION
  → Output: Summary of warnings + escalation criteria
  → Decision: Escalate to human review OR proceed if acceptable

IF any gate is RED (blockers):
  → Status: BLOCKED
  → Output: List of blockers + required actions to unblock
  → Decision: Stop, do not delegate; escalate to IDE for remediation
```

## Delegation: Task Definition for IDE Agents

Once status is confirmed (READY or READY WITH CAUTION), generate structured task definitions. These are handed to IDE agents (Codex CLI, Gemini) to define next steps.

### Task Definition Format

```json
{
  "task_id": "component-migration-phase-X",
  "priority": "high|medium|low",
  "type": "component-migration|deployment-prep|refactor|testing",
  "component": "ComponentName",
  "objective": "Clear, single-sentence goal",
  "context": {
    "current_state": "What exists today",
    "target_state": "What should exist after completion",
    "dependencies": ["Task ID", "Component"],
    "blockers": ["Known issues that may arise"]
  },
  "acceptance_criteria": [
    "Criterion 1 (measurable)",
    "Criterion 2 (testable)"
  ],
  "execution_environment": "codex_cli|gemini|manual",
  "estimated_duration": "Time in hours or minutes",
  "next_steps": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "rollback_plan": "How to revert if something goes wrong"
}
```

### Example: Component Migration Task

```json
{
  "task_id": "migrate-auth-provider-to-oauth2",
  "priority": "high",
  "type": "component-migration",
  "component": "AuthenticationProvider",
  "objective": "Migrate AuthenticationProvider from legacy session tokens to OAuth2 flow",
  "context": {
    "current_state": "AuthenticationProvider uses custom session token system; 3 consumers (API, Web, Mobile)",
    "target_state": "AuthenticationProvider implements OAuth2; consumers use standardized auth tokens",
    "dependencies": ["oauth2-library-update", "token-registry-migration"],
    "blockers": ["Legacy tokens still used by deprecated Dashboard component"]
  },
  "acceptance_criteria": [
    "OAuth2 flow passes all auth tests (coverage > 95%)",
    "All 3 consumers successfully authenticate with new flow",
    "No regressions in login/logout performance"
  ],
  "execution_environment": "codex_cli",
  "estimated_duration": "4 hours",
  "next_steps": [
    "Step 1: Create OAuth2 implementation branch",
    "Step 2: Add OAuth2 provider to AuthenticationProvider",
    "Step 3: Update API consumer tests",
    "Step 4: Update Web consumer tests",
    "Step 5: Update Mobile consumer tests",
    "Step 6: Run integration tests",
    "Step 7: Commit and create PR"
  ],
  "rollback_plan": "Revert branch to main; session tokens remain functional as fallback"
}
```

## Project Planning Documentation Update

After delegating tasks, update your project planning docs with:

- **Status snapshot**: Date, time, reviewer (Claude Desktop), high-level status
- **Dimension summary**: Build ✓ | Tests ⚠ | Quality ✓ | Deployment ✓ | Migration ✓
- **Blocker list** (if any): What's preventing progress
- **Delegated tasks**: Task IDs, assigned agents, target completion dates
- **Next review checkpoint**: When to re-run status assessment

**Example doc entry:**

```markdown
## Status Review - 2026-01-19 14:32 UTC

Reviewer: Claude Desktop (Orchestrator)
Status: READY FOR DEPLOYMENT

| Dimension | Status | Notes |
|-----------|--------|-------|
| Build | ✓ | Latest: 2026-01-19 14:15, 0 errors |
| Tests | ✓ | Coverage 94%, all critical tests pass |
| Quality | ✓ | No regressions, complexity within bounds |
| Deployment | ✓ | Staging env ready, secrets configured |
| Migration | ✓ | 8/10 components migrated, 2 pending review |

### Delegated Tasks
- Task ID: `migrate-logging-to-datadog` → Codex CLI
- Task ID: `refactor-db-layer-v2` → Gemini + manual review
- Task ID: `performance-optimization-cache` → Codex CLI

### Next Checkpoint
Review status again after tasks complete (estimated 2026-01-20 10:00 UTC)
```

## Integration Points

### When to Use This Skill

Use this skill when:
- Acting as deployment orchestrator in Claude Desktop
- Coordinating multiple MCP servers to avoid context bloat
- Confirming readiness gates before delegating work
- Defining next-step tasks for IDE agents (Codex, Gemini)
- Documenting orchestration decisions in project planning

### When NOT to Use This Skill

Don't use this skill for:
- Deep code review of individual files (use specialized review agents)
- Implementing changes directly (delegate to IDE agents)
- General coding questions (use regular Claude)

## Key Principles

1. **MCP-First**: Always query MCP servers for data; avoid loading full file contents into context
2. **Decision Gates**: Review systematically across all dimensions before confirming status
3. **Clear Delegation**: Task definitions are concrete, measurable, and actionable
4. **Track Decisions**: Document status snapshots and delegations in project planning
5. **Escalate Blockers**: Don't proceed with unclear issues; escalate to human review or IDE agents

## References

- See `references/mcp-patterns.md` for detailed MCP query examples by use case
- See `references/readiness-checklist.md` for component-specific readiness criteria
- See `references/task-definition-template.md` for expanding the task definition format
