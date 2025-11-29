# 🤖 AI AGENTS, SKILLS, AND MCP INFRASTRUCTURE

## Model Context Protocol (MCP)
The system uses the MCP to route expensive tasks to external, specialized servers (Gemini, Perplexity, etc.) to save Claude tokens.

## Primary Agents (Orchestrators)
| Agent Name | Role | Location |
| :--- | :--- | :--- |
| **mcp-orchestrator** | Routes tasks, manages caching and token saving. | `servers/mcp-claude-orchestrator/` |
| **m3-migration-architect** | Orchestrates 12-step M3 migration protocol. | `.claude/agents/m3-migration-architect.md` |
| **gemini-wrapper** | Executes specialized analysis and summarization via Gemini. | `.claude/interfaces/gemini-wrapper-interface.py` |

## Key Skill Sets
* **Scaffolding:** `fastapi-endpoint-scaffolder`, `pydantic-model-scaffolder` 
* **Testing:** `jest-test-scaffolder`, `api-integration-test-scaffolder` 
* **M3 Expressive:** `m3-spring-motion-choreography`, `m3-anti-slop-validator` (design/aesthetic focus).

## Skill Index
* **Complete Skill List:** `docs/architecture/SKILL_AGENT_MATRIX.md`
