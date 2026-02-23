# Legacy Skills Archive

This directory contains deprecated custom skills that have been archived.

## Archived Date: 2025-12-29

---

## Archived Skills

### 1. mcp-configuration-skill
- **Reason:** References ConfigurationRegistry MCP server that doesn't exist
- **Server Referenced:** `configuration-server.py` (moved to `_legacy_archive/`)
- **Replacement:** Use native file tools (`find_by_name`, `grep_search`, `list_dir`)
- **Related Conversation:** `0b3a6c3f-6c7e-4743-bc7c-a34b3bbe08e3` (MCP cleanup)

### 2. mcp-documentation-skill
- **Reason:** References CodebaseDocumentation MCP server that doesn't exist
- **Server Referenced:** `documentation-server.py` (moved to `_legacy_archive/`)
- **Replacement:** Use native file tools (`view_file`, `grep_search`, `list_dir`)
- **Related Conversation:** `0b3a6c3f-6c7e-4743-bc7c-a34b3bbe08e3` (MCP cleanup)

### 3. mcp-genkit-flows-skill
- **Reason:** References GenKit FlowRegistry MCP server that was never built
- **Server Referenced:** `genkit-server.py` (never created)
- **Replacement:** Use backend API endpoints directly or frontend service wrappers
- **Note:** The MCP caching layer described in this skill was never implemented

### 4. mcp-routing-specialist
- **Reason:** References ALL deprecated MCP servers (gemini-wrapper, documentation, configuration, genkit)
- **Servers Referenced:** All non-existent custom servers
- **Replacement:** Use current MCP ecosystem (flash-sidekick, github, playwright, docker)
- **Note:** The "routing specialist" concept was built on non-existent infrastructure

### 5. component-builder
- **Reason:** Upgraded to native Antigravity Workflow
- **Replacement:** `.agent/workflows/component_builder.md`
- **Benefit:** Direct execution, tool awareness, strict M3 token enforcement

### 6. fastapi-endpoint-scaffolder
- **Reason:** Upgraded to native Antigravity Workflow
- **Replacement:** `.agent/workflows/fastapi_endpoint_scaffolder.md`
- **Benefit:** Direct execution of schema/endpoint/test creation steps

### 7. api-integration-test-scaffolder
- **Reason:** Upgraded to native Antigravity Workflow
- **Replacement:** `.agent/workflows/api_integration_test_scaffolder.md`
- **Benefit:** Specialized E2E testing workflow with proper mocking patterns

---

## Why These Were Archived

### Batch 2: Workflow Upgrades (Dec 29, 2025)
Several high-value skills were converted from "Claude Chat Skills" to "Antigravity Workflows". This allows the AI agent to:
1. Execute steps directly (write files, reading tokens) rather than just "chatting" about them.
2. Enforce strict coding standards programmatically.
3. Be invoked via explicit slash commands (e.g., `/component_builder`).

### Batch 1: MCP Cleanup (Dec 29, 2025)
During the MCP cleanup, we simplified the MCP architecture from 6 planned custom servers to 4 production servers:

**Current MCP Ecosystem:**
1. `flash-sidekick` - Dual-engine Gemini (Flash Lite + Pro 2.5)
2. `github` - Repository operations
3. `playwright` - Browser automation
4 `docker` - Container management

**Removed/Never Built:**
1. ❌ ConfigurationRegistry - Caching issues, npm exec errors
2. ❌ CodebaseDocumentation - Stale cache problems  
3. ❌ GenKitFlowRegistry - Never implemented
4. ❌ APIContractValidator - Never implemented
5. ❌ DesignSystemServer - Never implemented
6. ❌ FirestoreDataAccessServer - Never implemented

The custom documentation/configuration caching servers caused more problems than they solved:
- Cache invalidation issues (stale content)
- Added unnecessary complexity
- npm exec invocation errors in CI/CD
- Native file tools are simpler and more reliable

---

## Migration Guide

### Instead of mcp-configuration-skill:

```typescript
// OLD: mcp_configuration_list_scripts()
// NEW:
find_by_name("*.sh", "scripts/")
grep_search("deployment", "scripts/")
```

### Instead of mcp-documentation-skill:

```typescript
// OLD: mcp_documentation_search_docs("deployment")
// NEW:
grep_search("deployment", ".claude/docs/", ["*.md"])
view_file(".claude/agents/devops-specialist.md")
```

### Instead of mcp-genkit-flows-skill:

```typescript
// OLD (never existed): mcp_genkit_execute_flow("generate_ksc", inputs)
// NEW:
// Use backend API directly
POST http://localhost:8000/api/genkit/generate-ksc
// Or frontend service wrapper
generateKscResponses(jobDescription)
```

### Instead of mcp-routing-specialist:

Use the actual MCP tools:
- `mcp_flash-sidekick_consult_pro` for deep reasoning
- `mcp_flash-sidekick_quick_summarize` for fast summaries
- `mcp_github_*` tools for repository operations
- Native file tools for documentation/configuration

---

## Documentation References

- **Audit Report:** `.claude/docs/MCP_SKILLS_AUDIT_2025-12-28.md`
- **Comprehensive Audit:** `.claude/docs/SKILLS_COMPREHENSIVE_AUDIT_2025-12-29.md`
- **MCP Orchestrator (Updated):** `.claude/agents/mcp-orchestrator.md`
- **Current MCP Config:** `mcp.json`

---

## Restoration

If you need to restore any of these skills:

```bash
# Restore a specific skill
mv .claude/skills/_legacy_archive/SKILL_NAME .claude/skills/

# But be aware: The MCP servers they reference still don't exist
```

**Recommendation:** Don't restore. These skills describe infrastructure that was either removed or never built.

---

**Archive Maintainer:** Antigravity  
**Archive Date:** 2025-12-29T11:30:00+10:00  
**Skills Archived:** 4 (all MCP-related)  
**Impact:** Removed confusion about non-existent infrastructure
