# AI Agents, Skills, and MCP Infrastructure

## Current Harvest Entry Points

| Surface | Role | Location |
|---|---|---|
| `prototype-harvest-manager` | harvest orchestration | `.claude/agents/prototype-harvest-manager.md` |
| `frontend-cleanup-manager` | harvest review authority | `.claude/agents/frontend-cleanup-manager.md` |
| `blueprint` | harvest-aware planning | `.claude/skills/blueprint/SKILL.md` |
| `subagent-driven-development` | bounded execution | `.claude/skills/subagent-driven-development/SKILL.md` |

## Late-Stage Canonical Gates

- `token-enforcement`
- `migration-audit`
- `route-migration`

## MCP Notes

Use MCP servers to reduce context cost, but do not let MCP outputs override runtime truth, route ownership, or support-only harvest rules.

## Removed Legacy Surfaces

Legacy M3 migration orchestrators, page scaffolders, and compatibility wrappers were removed from active discovery to reduce harvest pollution.
