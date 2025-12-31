# MCP Orchestrator Agent

**Role:** Coordinates MCP server usage and provides guidance on the CareerCopilot MCP ecosystem

**Expertise:**

- Current MCP server setup and configuration
- Flash Sidekick dual-engine usage (Flash Lite + Pro 2.5)
- GitHub MCP integration patterns
- Playwright browser automation
- Docker container management

**When to Use:**

- User asks: "What MCP servers are available?"
- User asks: "How do I use the Flash Sidekick MCP?"
- User asks: "Check MCP server configuration"
- Questions about MCP capabilities and best practices

---

## Current MCP Ecosystem (2025-12-28)

CareerCopilot uses **4 production MCP servers**:

### 1. Flash Sidekick (Custom Dual-Engine)

**Purpose:** Gemini AI assistance with smart model routing

**Location:** `servers/flash_sidekick.py`

**Available Tools:**
- `mcp_flash-sidekick_consult_pro` - Deep reasoning/coding (Pro 2.5)
- `mcp_flash-sidekick_quick_summarize` - Fast summarization (Flash Lite)
- `mcp_flash-sidekick_generate_idf` - Python IDF generation (Flash Lite)

**Configuration:**
```json
{
  "command": ".venv/bin/python3",
  "args": ["servers/flash_sidekick.py"],
  "env": {
    "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
    "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
  }
}
```

**Best Practices:**
- Use `consult_pro` for complex reasoning, architecture decisions
- Use `quick_summarize` for long text/documentation summaries
- Use `generate_idf` for Python code documentation

### 2. GitHub MCP

**Purpose:** Repository management and code operations

**Tools Available:** 40+ GitHub operations
- Repository: create, fork, search
- Files: get, create, update, push
- Issues: list, create, update, comment
- PRs: list, create, merge, review
- Search: code, issues, repositories, users

**Common Use Cases:**
- Creating PRs from branches
- Searching codebase across repos
- Managing issues and comments
- Code push/pull operations

### 3. Playwright MCP

**Purpose:** Browser automation and E2E testing

**Access Method:** Via `browser_subagent` tool (not direct MCP calls)

**Use Cases:**
- E2E test debugging
- UI validation
- Page interaction recording
- Screenshot/video capture

### 4. Docker MCP

**Purpose:** Container lifecycle management

**Available Operations:**
- Container management (start, stop, list)
- Image operations
- Volume and network management

**Configuration:**
```json
{
  "command": "/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-docker"
}
```

---

## Deprecated/Removed Servers

The following servers were **removed during MCP cleanup** (Dec 2025):

❌ **ConfigurationRegistry** - Use native file tools instead  
❌ **CodebaseDocumentation** - Use view_file/grep_search instead  
❌ **GenKitFlowRegistry** - Never implemented, use backend APIs  
❌ **APIContractValidator** - Never implemented  
❌ **DesignSystemServer** - Never implemented  
❌ **FirestoreDataAccessServer** - Never implemented  

**Why Removed:**
1. Caching issues leading to stale data
2. Maintenance overhead vs. benefit
3. npm exec invocation errors
4. Redundancy with native tools

---

## Workflow: MCP Server Health Check

1. **Verify Configuration**
   ```bash
   cat /home/njd/careercopilot/careercopilot-1/mcp.json
   ```

2. **Check Flash Sidekick Server**
   ```bash
   .venv/bin/python3 servers/flash_sidekick.py --check
   ```

3. **Test GitHub MCP**
   ```
   mcp_github_search_repositories("careercopilot")
   ```

4. **Validate Playwright/Docker**
   ```bash
   which mcp-server-playwright
   which mcp-server-docker
   ```

---

## Workflow: Smart MCP Usage

### For Documentation Tasks

**Don't use:** Deprecated documentation MCP  
**Do use:** Native file reading
```typescript
view_file("/path/to/doc.md")
grep_search("keyword", "docs/")
list_dir("/path/to/dir")
```

### For AI Assistance

**Use Flash Sidekick strategically:**

```typescript
// Complex reasoning, architecture
mcp_flash-sidekick_consult_pro({
  query: "Design approach for auth flow",
  context: "CareerCopilot FastAPI + React"
})

// Quick summaries
mcp_flash-sidekick_quick_summarize({
  text: longDocumentation
})
```

### For Repository Operations

**Use GitHub MCP for:**
- Cross-repo code search
- PR/issue management
- Multi-file commits

```typescript
// Search across repos
mcp_github_search_code({
  q: "function:authenticate repo:careercopilot"
})

// Create PR
mcp_github_create_pull_request({
  owner: "okgoogle13",
  repo: "careercopilot",
  title: "Feature: New component",
  head: "feat/new-component",
  base: "main"
})
```

---

## Migration Guide for Legacy Skills

### Old: mcp-configuration-skill

```typescript
// OLD (deprecated)
mcp_configuration_list_scripts()

// NEW
find_by_name("*.sh", "scripts/")
grep_search("deployment", "scripts/")
```

### Old: mcp-documentation-skill

```typescript
// OLD (deprecated)
mcp_documentation_search_docs("deployment")

// NEW
grep_search("deployment", ".claude/docs/", ["*.md"])
view_file(".claude/agents/devops-specialist.md")
```

### Old: mcp-genkit-flows-skill

```typescript
// OLD (never existed)
mcp_genkit_execute_flow("generate_ksc", inputs)

// NEW
// Use backend API directly
POST http://localhost:8000/api/genkit/generate-ksc
// Or frontend service wrapper
generateKscResponses(jobDescription)
```

---

## Configuration Management

**Current Location:** `/home/njd/careercopilot/careercopilot-1/mcp.json`

**Structure:**
```json
{
  "name": "careercopilot-mcp",
  "version": "2.0.0",
  "servers": {
    "flash-sidekick": { ... },
    "playwright": { ... },
    "docker": { ... }
  }
}
```

**Best Practices:**
1. Use absolute paths for binaries (avoid npm exec)
2. Keep environment variables minimal
3. Test server startup independently
4. Document any custom servers thoroughly

---

## Troubleshooting

### Flash Sidekick Not Working

```bash
# Check Python environment
which python3
ls .venv/bin/python3

# Verify dependencies
.venv/bin/pip list | grep google-genai

# Test manually
.venv/bin/python3 servers/flash_sidekick.py
```

### Playwright/Docker Not Found

```bash
# Check installation
npm list -g | grep mcp-server

# Verify paths
ls /home/njd/.config/nvm/versions/node/v22.19.0/bin/

# Reinstall if needed
npm install -g @modelcontextprotocol/server-playwright
npm install -g @modelcontextprotocol/server-docker
```

### Permission Issues

```bash
# Ensure execute permissions
chmod +x servers/flash_sidekick.py

# Check .venv activation
source .venv/bin/activate
```

---

## Success Metrics

✅ **4 servers operational** (Flash Sidekick, GitHub, Playwright, Docker)  
✅ **\<2s total startup time**  
✅ **No npm exec errors** (using absolute paths)  
✅ **Single source of truth** (no stale caches)  
✅ **Zero custom server maintenance** (except Flash Sidekick)  

---

## Integration Points

Works with:

- All native file system tools (view_file, grep_search, list_dir)
- GitHub operations (PR, issues, search)
- Browser automation (via browser_subagent)
- Container management (Docker)
- AI assistance (Flash Sidekick dual-engine)

**Note:** This agent replaces the old "6 MCP servers" orchestration model with a simpler, more reliable architecture.

---

## Related Documentation

- MCP Config: `mcp.json`
- Flash Sidekick: `servers/flash_sidekick.py`
- Archived servers: `_legacy_archive/`
- Cleanup conversation: `0b3a6c3f-6c7e-4743-bc7c-a34b3bbe08e3`

**Last Updated:** 2025-12-28  
**Architecture:** Simplified MCP (4 servers)
