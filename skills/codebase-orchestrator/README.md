# Codebase Orchestrator Skill - Summary

## What This Skill Does

This is a **deployment orchestration skill** designed for Claude Desktop when acting as the orchestrator and decision-maker for your codebase.

It enables you to:

1. **Coordinate Multiple MCP Servers** - Query filesystem, git, and testing MCP servers without loading full file contents into context
2. **Review Codebase Status Holistically** - Assess 5 dimensions (build, tests, quality, deployment, migration) simultaneously
3. **Confirm Readiness Gates** - Apply decision logic to determine if deployment/migration is safe
4. **Generate Task Definitions** - Create structured, actionable tasks for IDE agents (Codex CLI, Gemini)
5. **Document Orchestration Decisions** - Maintain project planning docs with status snapshots and decision rationale

## Architecture

```
├── SKILL.md (Main workflow & orchestration framework)
├── USAGE.md (Usage guide with walkthroughs)
├── references/ (Detailed reference materials)
│   ├── mcp-patterns.md (How to query each MCP server)
│   ├── readiness-checklist.md (Component readiness criteria)
│   └── task-definition-template.md (Task definition format + examples)
├── assets/ (Templates ready to use)
│   └── status-planning-template.md (Document status reviews)
└── scripts/ (Helper scripts)
    └── orchestrator-helpers.py (Generate tasks, check gates)
```

## Quick Facts

- **Size**: ~15KB of markdown + ~4KB of Python
- **Dependencies**: None (uses standard Python 3)
- **MCP Requirements**: Filesystem, Git, Testing MCP servers (you configure these)
- **Language**: English (prompts and documentation)
- **Compatibility**: Claude Desktop with MCP support, Claude 3.5+

## Use Case Scenarios

### Scenario 1: Pre-Deployment Review
You're about to deploy v2.5.0 to production. You ask Claude:
```
"Review deployment readiness using MCP servers. Are we ready?"
```
Claude uses this skill to:
- Check build status via Filesystem MCP
- Review recent changes via Git MCP
- Assess test coverage via Testing MCP
- Synthesize findings → "Status: READY FOR DEPLOYMENT"

### Scenario 2: Component Migration Tracking
You're migrating components to a new architecture. You ask:
```
"Which components are ready to migrate? Generate next steps for incomplete ones."
```
Claude:
- Checks each component's readiness across all 5 dimensions
- Generates task definitions for incomplete components
- Hands tasks to Codex CLI for automated migration

### Scenario 3: Deployment Blocker Resolution
A critical test is failing. You ask:
```
"Generate an investigation task for the failing test. Who should handle it?"
```
Claude:
- Creates structured task definition with all context
- Suggests appropriate agent (Gemini for investigation, Codex for fix)
- You delegate directly from the task definition

## Key Concepts

### 5 Dimensions of Readiness

1. **Build**: Does the code compile? Are there lint errors?
2. **Tests**: What's the coverage? Are there test failures?
3. **Quality**: Complexity, security, dead code?
4. **Deployment**: Configs ready? Migrations reversible? Monitoring in place?
5. **Migration**: Have components been refactored to new pattern?

### Decision Gates

After reviewing all dimensions:
- **RED (Blocker)**: Any critical issue → CANNOT PROCEED
- **YELLOW (Caution)**: Warnings/non-critical issues → PROCEED WITH CAUTION
- **GREEN**: All clear → READY FOR DEPLOYMENT

### Task Delegation

Once readiness is confirmed, Claude generates task definitions that flow directly to your IDE agents:

```json
{
  "task_id": "migrate-auth-provider-oauth2",
  "type": "component-migration",
  "objective": "Migrate AuthenticationProvider from session tokens to OAuth2",
  "execution_environment": "codex_cli",
  "acceptance_criteria": [
    "OAuth2 flow passes all tests",
    "Zero regressions"
  ],
  "next_steps": [
    "Step 1: Create feature branch",
    "Step 2: ...",
  ]
}
```

## What Makes This Different

### vs. Traditional Code Review
- **MCP-First**: Queries metadata instead of loading full files → lower token usage
- **Systematic**: Reviews across ALL 5 dimensions, not just code quality
- **Decision-Focused**: Answers "are we ready?" not "is the code good?"

### vs. Deployment Scripts
- **Intelligent**: Claude understands context, trade-offs, escalation criteria
- **Flexible**: Adapts to your specific architecture and constraints
- **Document-Generating**: Maintains project planning docs automatically

### vs. Manual Status Checks
- **Fast**: Coordinates multiple checks in parallel, synthesizes instantly
- **Complete**: Never misses a dimension (build, tests, quality, deployment, migration)
- **Consistent**: Uses same checklist every time, no human bias

## Integration Points

### With Claude Desktop
- Loads as a skill in your Claude Desktop environment
- Coordinates with your existing MCP servers
- Runs as a system prompt, no special setup needed

### With Your IDE
- Generated tasks flow directly to Codex CLI or Gemini
- Task definitions are self-contained JSON (no additional context needed)
- Codex/Gemini can execute tasks independently

### With Your Project Planning
- Status reviews generate markdown entries
- Entries are copy-paste ready into your docs
- Maintains decision history and outcomes

### With Your Git Workflow
- Queries Git MCP for change tracking
- References commits, branches, deployment tags
- Tracks which components changed recently

## Getting Started

### 1. Prerequisites
- Claude Desktop installed
- MCP servers configured (filesystem, git, testing)
- Project planning docs (Google Docs, Notion, or markdown)

### 2. Installation
- Extract `codebase-orchestrator-skill` to your skills directory
- Or load via Claude Desktop interface

### 3. First Use
```
You: "I want to deploy v2.5.0. Act as orchestrator and review 
readiness using MCP servers. Tell me: ready, caution, or blocked?"
```

Claude uses this skill automatically to coordinate the review.

## Key Files to Know

| File | Purpose | When to Use |
|------|---------|------------|
| SKILL.md | Core workflow | First time setup; understand framework |
| USAGE.md | Step-by-step guide | Before each use case (deploy, migrate, etc.) |
| mcp-patterns.md | MCP query examples | When you need to query a specific dimension |
| readiness-checklist.md | Assessment criteria | When evaluating a component |
| task-definition-template.md | Task format | When creating tasks for IDE agents |
| status-planning-template.md | Documentation template | When recording decisions |
| orchestrator-helpers.py | Helper script | For programmatic task/gate generation |

## Customization

This skill is designed to be customized for your project:

1. **Modify readiness criteria** in `readiness-checklist.md` (e.g., change coverage threshold from 80% to 85%)
2. **Add component-specific checks** (e.g., API components need OpenAPI spec check)
3. **Adjust task definitions** in `task-definition-template.md`
4. **Extend Python helpers** for your specific workflows

## Support & Improvement

If you need help:
1. Check USAGE.md for your scenario
2. Review the reference documents for specific questions
3. Modify the templates to fit your workflow
4. Let Claude Desktop suggest improvements (use thumbs-down feedback)

## Next Steps

1. **Configure MCP servers** if you haven't already
2. **Read USAGE.md** for your first use case (deploy, migrate, or review)
3. **Try a simple query**: "Review readiness for component X"
4. **Iterate**: Customize templates and criteria as needed

---

**Version**: 1.0  
**Created**: January 2026  
**For**: NJD (Senior Solutions Architect, Automation Lead)  
**Use Case**: Orchestrate AI-powered career tool codebase with Antigravity IDE, Codex CLI, and Gemini
