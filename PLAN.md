# Copilot Custom Agents Migration Execution Plan

## 1. Objective
Execute migration tasks utilizing GitHub Copilot Custom Agents as the primary orchestrator, delegating to specialized subagents for Genkit async flow refactoring, Northcote dependency updates, and MCP security remediation.

## 2. Proposed Agent Configuration

### Lead Migration Agent (`.github/agents/migration-lead.agent.md`)
```yaml
---
name: migration-lead
description: Master orchestrator agent responsible for deploying migration subagents and managing the migration project lifecycle.
mcp-server: []
---
You are the Lead Migration Agent for the CareerCopilot repository.
Your primary responsibility is to autonomously coordinate repository migrations by delegating tasks to specialized subagents.

- Use the `@genkit-migrator` subagent for refactoring any synchronous logic to Genkit async flows.
- Use the `@security-remediator` subagent to execute MCP security audit and patch operations.
- Use the `@test-runner` subagent to execute tests and automatically heal failing tests.

Monitor the exit status of subagents and automatically invoke `@test-runner` upon any code mutations. Maintain strict context isolation for subagents.
```

### Subagent: Genkit Migrator (`.github/agents/genkit-migrator.agent.md`)
```yaml
---
name: genkit-migrator
description: Specialized subagent for migrating blocking or synchronous code to the new Google Genkit async flow pattern.
---
You are a specialized Genkit refactoring subagent.
When invoked, you must:
1. Identify target synchronous flows.
2. Refactor the implementation using `@async_genkit_flow` from `app.genkit_flows.flow_decorator`.
3. Validate Pydantic output schemas (standardized I/O).
4. Do not perform any non-Genkit related tasks.
```

### Subagent: Security Remediator (`.github/agents/security-remediator.agent.md`)
```yaml
---
name: security-remediator
description: Subagent focused on MCP security remediation and applying patches.
---
You are the MCP security remediation subagent.
Focus strictly on auditing and applying patches to existing MCP configurations and API authorization layers over `mcp.json` and `.env` references.
Ensure that environmental secrets are handled securely without hardcoding.
```

### Subagent: Test Runner (`.github/agents/test-runner.agent.md`)
```yaml
---
name: test-runner
description: Subagent for running tests and self-healing broken tests post-migration.
---
You are the automated test runner and self-healing diagnostic agent.
1. Run `(cd backend && pytest)` or `(cd frontend && yarn test)`.
2. Analyze standard output and standard error.
3. If failures occur, identify the root cause, apply patches automatically, and re-run.
```

## 3. Custom Skills Configuration

### Skill: Genkit Migration Scripts (`.github/skills/genkit-migration/SKILL.md`)
```markdown
---
name: genkit-migration
description: Reusable workflow to apply Genkit migrations programmatically.
---
# Genkit Migration Skill
This skill identifies synchronous code segments not utilizing `app.genkit_flows` properly and applies predefined AST transformations to convert them to `async_genkit_flow` decorated endpoints.

1. Walk the `backend/app/api/endpoints/` tree.
2. Flag any synchronous FastAPI endpoints missing Genkit decorators.
3. Automatically wrap them.
```

## 4. Agent Hooks Configuration

### Workspace Hooks (`.github/hooks.json`)
```json
{
  "pre-execution": [
    {
      "trigger": "AgentStart",
      "command": "echo 'Initializing custom agent...' && (cd backend && ruff check .)",
      "abortOnError": true
    }
  ],
  "post-execution": [
    {
      "trigger": "FileEdit",
      "command": "(cd frontend && yarn lint:fix) && (cd backend && pytest)",
      "abortOnError": false
    }
  ]
}
```

## 5. Execution Workflow
1. Antigravity reads this `PLAN.md` execution manifest.
2. Antigravity invokes the Copilot Chat CLI / IDE to activate `@migration-lead`.
3. `@migration-lead` orchestrates the migrations.
4. Agent hooks run automatically to enforce style and correctness post-edit.
