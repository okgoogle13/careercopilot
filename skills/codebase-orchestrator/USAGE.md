# Codebase Orchestrator Skill - Usage Guide

## Overview

This skill enables you to act as a deployment orchestrator in Claude Desktop, coordinating multiple MCP servers to review comprehensive codebase status and delegate tasks to IDE agents without token bloat.

## Quick Start

### 1. Set Up MCP Servers

Before using this skill, ensure you have MCP servers configured in Claude Desktop:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/your/repo"]
    },
    "git": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-git", "/path/to/your/repo"]
    },
    "testing": {
      "command": "npx",
      "args": ["custom-testing-mcp-server"]
    }
  }
}
```

### 2. Import the Skill

Add the `codebase-orchestrator.skill` file to your Claude Desktop skills directory, or load it via:

```
Tell Claude: "Load the codebase-orchestrator skill"
```

### 3. Use It in Claude Desktop

#### Scenario A: Review Codebase Status Before Deployment

```
You: "Review deployment readiness for v2.5.0. Use MCP servers to check build status, test coverage, code quality, deployment prerequisites, and component migration progress. Then tell me: are we ready to deploy?"

Claude (using this skill):
1. Queries Filesystem MCP: Check build artifacts, configs, migrations
2. Queries Git MCP: Check branch divergence, recent commits, deployment tags
3. Queries Testing MCP: Check coverage by component, test failures
4. Synthesizes findings: Builds readiness assessment
5. Responds: "Status: READY FOR DEPLOYMENT with 1 CAUTION item (see details)"
6. Generates next steps: Creates task definitions for any follow-up work
```

#### Scenario B: Delegate Next Steps to IDE Agents

```
You: "Status confirmed READY FOR DEPLOYMENT. Now generate task definitions for: 1) improving APIGateway test coverage, 2) completing UserService migration. Hand these to Codex CLI and Gemini for execution."

Claude (using this skill):
1. Generates structured task definitions using references/task-definition-template.md
2. Tailors for target agent (Codex CLI vs. Gemini)
3. Returns JSON task definitions
4. You copy these directly into your IDE or send to agents
```

#### Scenario C: Document Deployment Decision

```
You: "Document the status review we just completed. Create a project planning entry with decision rationale, delegated tasks, and next checkpoint."

Claude (using this skill):
1. Synthesizes review findings
2. Uses assets/status-planning-template.md as structure
3. Generates markdown entry ready to paste into your project docs
4. Includes decision gates, blockers, delegated tasks, timelines
```

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Claude Desktop (Orchestrator)                               │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─────────────────────────────────────────────────────┐
           │ ASSESS Phase                                        │
           │                                                     │
           ├─→ Query Filesystem MCP                              │
           │   (file structure, configs, build artifacts)        │
           │                                                     │
           ├─→ Query Git MCP                                     │
           │   (commits, branches, tags, diffs)                  │
           │                                                     │
           ├─→ Query Testing MCP                                 │
           │   (coverage, test results, performance)             │
           │                                                     │
           └─→ Synthesize into Status Assessment                 │
               (BUILD | TESTS | QUALITY | DEPLOYMENT | MIGRATION)
                        │
                        ▼
           ┌─────────────────────────────────────────────────────┐
           │ REVIEW Phase                                        │
           │ Match findings against readiness criteria            │
           │ Identify blockers, warnings, escalations            │
           └─────────────────────────────────────────────────────┘
                        │
                        ▼
           ┌─────────────────────────────────────────────────────┐
           │ GATE Phase                                          │
           │ Decision: READY | CAUTION | BLOCKED                │
           │ Generate decision rationale                         │
           └─────────────────────────────────────────────────────┘
                        │
           ┌────────────┴─────────────┐
           │                          │
           ▼                          ▼
    PROCEED                    DO NOT PROCEED
    │                         │
    ├─→ DELEGATE              └─→ Escalate to manual review
    │   Generate task              Document blockers
    │   definitions                Request remediation
    │
    ├─→ TRACK
    │   Update project planning
    │   Document decisions
    │
    └─→ NEXT CHECKPOINT
        Schedule follow-up review
```

## Key Files & When to Use Them

### SKILL.md (Main Reference)
- **When**: Read first for overall workflow and MCP coordination patterns
- **Contains**: Core workflow, decision gates, delegation format, integration points

### references/mcp-patterns.md
- **When**: You need to query an MCP server and don't know how
- **Contains**: Concrete examples for Filesystem, Git, Testing MCP queries
- **Use Case**: "How do I check test coverage by component?" → Find example pattern

### references/readiness-checklist.md
- **When**: Evaluating a specific component's readiness
- **Contains**: 5-dimension checklist, component-specific additions, automation tips
- **Use Case**: "Is this component ready to deploy?" → Work through the checklist

### references/task-definition-template.md
- **When**: Generating tasks to delegate to IDE agents
- **Contains**: Full template with field descriptions, 3 concrete examples
- **Use Case**: "Create a migration task" → Use the template and examples

### assets/status-planning-template.md
- **When**: Documenting the orchestration decision in project planning
- **Contains**: Full status entry template, minimal update format, escalation template
- **Use Case**: "Record this deployment decision" → Paste the template, fill in details

### scripts/orchestrator-helpers.py
- **When**: Need structured output for decision gates or task generation
- **Usage**: `python3 orchestrator-helpers.py --command generate-task --component ComponentName`
- **Output**: JSON task definitions, gate check results

## Real-World Example Walkthroughs

### Walkthrough 1: Pre-Deployment Review

**Goal**: Determine if v2.5.0 is ready for production deployment

**Step-by-Step**:

1. **Initiate Review**
   ```
   You: "Act as deployment orchestrator. Review v2.5.0 readiness for production. 
   Use MCP servers to check all dimensions (build, tests, quality, deployment, migration).
   Tell me: proceed, hold, or escalate?"
   ```

2. **Claude Reviews** (using skill)
   - Queries Filesystem: Latest build artifact, deployment configs, migration markers
   - Queries Git: Commits since v2.4.2, branch status, recent deployment tags
   - Queries Testing: Coverage by component, failed test details, performance trends
   - Synthesizes: Maps findings to readiness checklist

3. **Claude Decides**
   ```
   "Status: READY FOR DEPLOYMENT
   
   ✅ Build: Latest artifact valid, 0 errors
   ✅ Tests: 94% coverage, 0 critical failures
   ✅ Quality: All metrics pass
   ✅ Deployment: Configs current, migrations reversible
   ✅ Migration: 8/10 components complete
   
   Decision: PROCEED with monitoring"
   ```

4. **Generate Next Steps**
   ```
   You: "Good. Now generate task definitions for:
   - Improve APIGateway coverage (78% → 85%)
   - Complete UserService migration
   
   Make these ready for Codex CLI execution."
   
   Claude generates two task JSON objects using task-definition-template.md
   ```

5. **Document Decision**
   ```
   You: "Document this deployment review in project planning."
   
   Claude generates status entry using status-planning-template.md,
   ready to paste into your docs
   ```

### Walkthrough 2: Component Migration Readiness

**Goal**: Is AuthenticationProvider ready to migrate from session tokens to OAuth2?

**Process**:

1. **Gather Component Status**
   ```
   You: "Check AuthenticationProvider readiness against migration criteria.
   Use the readiness checklist and check: build status, test coverage,
   code quality, whether migration marker exists, and recent commit activity."
   ```

2. **Claude Reviews**
   - Checks build: `npm run type-check` on auth component
   - Checks tests: Coverage for auth tests, any failing tests
   - Checks quality: Linting, complexity scores for auth functions
   - Checks migration: Does MIGRATED marker exist? When was it added?
   - Checks commits: Recent changes to authentication code

3. **Claude Reports**
   ```
   "AuthenticationProvider Migration Readiness:
   
   ✅ Build: TypeScript checks pass
   ✅ Tests: 92% coverage, 0 failures
   ✅ Quality: Complexity within bounds
   ⚠️ Migration: Partially migrated (legacy fallback still active)
   ⚠️ Commits: 3 commits in last 5 days (active development)
   
   Recommendation: READY WITH CAUTION
   - Monitor for regressions during active development
   - Remove legacy fallback in next sprint"
   ```

### Walkthrough 3: Handling a Blocker

**Goal**: Address a failing test before deployment

**Process**:

1. **Detection**
   ```
   Claude (during readiness review):
   "⚠️ BLOCKER: DatabasePool integration tests failing (3/10 runs)
   This is a flaky test but blocks deployment per your policy."
   ```

2. **Investigation**
   ```
   You: "Generate a task definition for investigating this flakiness."
   
   Claude uses task-definition-template.md to create:
   {
     "task_id": "investigate-db-pool-flakiness",
     "type": "investigation",
     "component": "DatabaseLayer",
     "priority": "high",
     "objective": "Root cause the race condition in DatabasePool tests",
     ...
   }
   ```

3. **Delegation**
   ```
   You: "Send this to Gemini for investigation."
   
   You hand the task to Gemini or paste into your IDE
   ```

4. **Resolution & Re-check**
   ```
   Once fixed:
   
   You: "Re-run readiness check for DatabaseLayer"
   
   Claude:
   "✅ DatabasePool tests: Now passing consistently (10/10)
   Status: READY FOR DEPLOYMENT"
   ```

## Common Queries & Patterns

### Query 1: "Are we ready to deploy?"
**Skill Action**: Full 5-dimension assessment using all MCP servers
**Output**: Overall status (READY | CAUTION | BLOCKED) + summary

### Query 2: "What changed since last deployment?"
**Skill Action**: Git MCP to show commits, diffs, affected components
**Output**: Change summary + potential impact areas

### Query 3: "Generate a migration task for Component X"
**Skill Action**: Use task-definition-template.md to create structured task
**Output**: JSON task definition ready for IDE agents

### Query 4: "Document this status review"
**Skill Action**: Use status-planning-template.md to create entry
**Output**: Markdown entry ready to paste into project docs

### Query 5: "Which components are at risk?"
**Skill Action**: Query testing MCP for low coverage, git for recent changes
**Output**: Risk matrix showing unstable components

## Tips for Effective Orchestration

### Tip 1: Batch MCP Queries
Instead of:
```
"Check build status" (1 query)
"Check test coverage" (1 query)
"Check recent commits" (1 query)
```

Use:
```
"Check deployment readiness: build status, test coverage, recent commits for component X"
(1 combined query with multiple pieces of information)
```

### Tip 2: Reference the Right Document
- Need MCP query examples? → `mcp-patterns.md`
- Need to understand readiness? → `readiness-checklist.md`
- Need to create a task? → `task-definition-template.md`
- Need to document? → `status-planning-template.md`

### Tip 3: Escalate Early
Don't try to unblock everything yourself. If a component has critical test failures or security issues, escalate immediately:
```
"This component has critical blockers. Escalate to manual review and generate remediation tasks."
```

### Tip 4: Track Decisions
Always document WHY you proceeded or blocked, not just that you did:
```
✅ "READY FOR DEPLOYMENT because:
- Build passes
- Coverage 94% (above 80% threshold)
- No critical test failures
- Deployment configs verified"
```

### Tip 5: Automate When Possible
Use `scripts/orchestrator-helpers.py` for deterministic tasks:
```bash
python3 orchestrator-helpers.py --command check-gates --output deployment-gates.json
```

## Troubleshooting

### Issue: "MCP server not responding"
**Solution**: Verify MCP server is configured and running
```json
// Check ~/.config/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "filesystem": { ... }  // Ensure all servers are here
  }
}
```

### Issue: "Query returns too much data"
**Solution**: Use more specific queries from `mcp-patterns.md`
- Instead of: "Show all files" → Use: "List files matching pattern X"
- Instead of: "Show all commits" → Use: "Show commits in last 7 days to component X"

### Issue: "Can't generate task definitions"
**Solution**: Use `references/task-definition-template.md` for guidance
- Ensure all required fields are filled
- Use the concrete examples as templates

### Issue: "Don't know if we're ready to deploy"
**Solution**: Work through the decision gate framework in SKILL.md
1. Review each of 5 dimensions
2. Identify blockers (RED gates)
3. Identify cautions (YELLOW gates)
4. Apply decision tree: all green → READY, some yellow → CAUTION, any red → BLOCKED

## Next Steps After Using This Skill

Once you've reviewed status and confirmed readiness:

1. **Execute Delegated Tasks**: Use task definitions with your IDE agents
2. **Deploy**: Follow your deployment procedure (runbooks in project planning docs)
3. **Monitor**: Track post-deployment metrics
4. **Schedule Checkpoint**: Plan next review (per task completion timeline)
5. **Document Outcome**: Update project planning with deployment results

---

**Questions or Improvements?**

This skill is designed to be tailored to your specific project. Feel free to:
- Modify readiness criteria in `readiness-checklist.md`
- Add MCP query patterns to `mcp-patterns.md`
- Customize task definition fields in `task-definition-template.md`
- Extend the Python helpers script for your workflow

Happy orchestrating! 🚀
