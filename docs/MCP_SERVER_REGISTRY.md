# MCP Server Registry

**Last Updated:** 2026-03-03
**Source of Truth Config:** `.vscode/mcp.json`

---

## Active Servers

### 1. `flash-sidekick`

| Field | Value |
|---|---|
| **Purpose** | Token-efficient batch processing, code analysis, test & doc generation |
| **Implementation** | `servers/flash_sidekick.py` (FastMCP) |
| **Engine** | Gemini Flash (primary) → Gemini Pro → GitHub Models (fallback) |
| **Required env** | `GEMINI_API_KEY`, `GITHUB_TOKEN` (fallback) |
| **Log file** | `/tmp/mcp-flash-sidekick.log` |
| **Status** | ✅ Active |

**Tools:**

| Tool | Description |
|---|---|
| `quick_summarize` | Bulk text summarisation |
| `generate_idf` | Code signature / interface extraction |
| `consult_pro` | Deep analysis via Gemini Pro |
| `batch_file_analysis` | Concurrent multi-file analysis |
| `web_research_synthesis` | Google Search Grounding synthesis |
| `analyze_code_quality` | Quality analysis (returns JSON) |
| `generate_docstrings` | Docstring generation (Google/NumPy/reST) |
| `generate_unit_tests` | Unit test scaffolding |
| `suggest_refactoring` | Architectural improvement suggestions |
| `create_readme` | README generation from code |
| `extract_dependencies` | Import / dependency extraction |
| `generate_api_docs` | API documentation generation |
| `generate_integration_tests` | Integration test scaffolding |

---

### 2. `design-system-sidekick`

| Field | Value |
|---|---|
| **Purpose** | Kerala Rage kr-solidarity design compliance validation and asset packaging |
| **Implementation** | `servers/design_system_sidekick.py` (custom stdio protocol) |
| **Engine** | Gemini Pro Vision (primary) → GitHub Models gpt-4o-mini (fallback) |
| **Required env** | `GEMINI_API_KEY`, `GITHUB_TOKEN` (fallback) |
| **Log file** | `/tmp/mcp-design-system-sidekick.log` |
| **Status** | ✅ Active |

**Tools:**

| Tool | Description |
|---|---|
| `validate_asset_compliance` | Validate asset against Kerala Rage scorecard |
| `generate_implementation_package` | Create context.md, tokens.json, usage.md for an asset |

---

### 3. `vision-scorer-mcp`

| Field | Value |
|---|---|
| **Purpose** | M3 Expressive visual design scoring |
| **Implementation** | `servers/vision_scorer_mcp.py` |
| **Engine** | Gemini Vision |
| **Required env** | `GEMINI_API_KEY`, `GITHUB_TOKEN` (fallback) |
| **Status** | ✅ Active |

**Tools:**

| Tool | Description |
|---|---|
| `score_visual_design` | M3 Expressive compliance score |
| `validate_m3_compliance` | Detailed M3 validation with feedback |

---

### 4. `perplexity`

| Field | Value |
|---|---|
| **Purpose** | Real-time web research and citation-backed summaries |
| **Implementation** | `servers/perplexity_server.py` (FastMCP) |
| **Engine** | Perplexity AI API (sonar, sonar-pro, sonar-reasoning-pro) |
| **Required env** | `PERPLEXITY_API_KEY` |
| **Status** | ✅ Active (4 tools) |

**Tools:**

| Tool | Description |
|---|---|
| `perplexity_chat` | General chat with optional model and system-prompt override |
| `perplexity_search_web` | Focused web search with configurable source filter |
| `perplexity_deep_research` | Comprehensive analysis via sonar-reasoning-pro |
| `perplexity_summarize_with_citations` | Concise summary with numbered source citations |

> **Note:** Previously only 3 tools were registered, causing the "3 of 4 tools disappear"
> symptom. The 4th tool (`perplexity_summarize_with_citations`) was added to resolve this.

---

### 5. `task-router`

| Field | Value |
|---|---|
| **Purpose** | JSON-file-backed task queue for multi-agent delegation |
| **Implementation** | `servers/task_router_mcp.py` (FastMCP) |
| **Engine** | None (pure file I/O) |
| **Required env** | None |
| **Queue file** | `/tmp/kerala-rage-task-queue.json` |
| **Status** | ✅ Active |

**Tools:**

| Tool | Description |
|---|---|
| `create_task` | Add a new task to the queue |
| `claim_task` | Claim a pending task for processing |
| `complete_task` | Mark a task complete with outputs |
| `list_tasks` | List tasks filtered by status or assignee |
| `rollback_task` | Revert a task to pending state |

---

### 6. `filesystem`

| Field | Value |
|---|---|
| **Purpose** | Read/write access to the project directory |
| **Implementation** | `servers/filesystem_mcp.py` (FastMCP, workspace-scoped) |
| **Optional npm** | `@modelcontextprotocol/server-filesystem@0.6.2` (pinned) |
| **Required env** | None |
| **Status** | ✅ Active |

> If npm-based servers are available in your environment, prefer the pinned npm server
> for maximum compatibility; see the commented block in `.vscode/mcp.json`.

---

### 7. `git`

| Field | Value |
|---|---|
| **Purpose** | Git repository operations (log, diff, blame, etc.) |
| **Implementation** | `servers/git_mcp.py` (FastMCP; subprocess `git`) |
| **Optional npm** | `@modelcontextprotocol/server-git@0.6.2` (pinned) |
| **Required env** | None |
| **Status** | ✅ Active |

---

### 8. `github`

| Field | Value |
|---|---|
| **Purpose** | GitHub API — issues, PRs, releases, search |
| **Implementation** | `servers/github_mcp.py` (FastMCP; REST + GraphQL) |
| **Optional npm** | `@modelcontextprotocol/server-github@0.6.2` (pinned) |
| **Required env** | `GITHUB_TOKEN` |
| **Status** | ✅ Active |

---

## Disabled Servers

| Server | Implementation | Reason disabled |
|---|---|---|
| `playwright` | `@playwright/mcp` npm package | Enable only for E2E debugging sessions |
| `cloud-ops` | `servers/cloud_ops.py` | Enable only for GCP infrastructure work |
| `docker` | `servers/docker_mcp.py` | Enable only for local container management |

To enable: uncomment the relevant block in `.vscode/mcp.json` and `tools/config/mcp.json`.
