# Claude Code: MCP Sidekick & Token Guardian Activation Prompt

Use this document to register the Gemini-powered Sidekicks in your preferred Claude environment (CLI, Desktop, or IDE) and then "activate" them with the followup prompt.

---

## Setup & Registration (Choose Your Environment)

MCP servers do not automatically sync between different Claude interfaces. You must ensure they are registered in the specific tool you are using.

### 1. Claude Code (CLI / Terminal)

Run these commands once to register the local Python servers:

```bash
claude mcp add flash-sidekick -- python3 /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py
claude mcp add design-system-sidekick -- python3 /Users/okgoogle13/Projects/careercopilot/servers/design_system_sidekick.py
claude mcp add vision-scorer-mcp -- python3 /Users/okgoogle13/Projects/careercopilot/servers/vision_scorer_mcp.py
```

### 2. Claude Desktop

Add the server definitions to your global config:

- **Location**: `/Users/okgoogle13/.gemini/antigravity/mcp_config.json`
- **Action**: Ensure the `mcpServers` block matches the definitions in `.vscode/mcp.json`.

### 3. IDE / VS Code (Claude Dev / Cline / Antigravity)

- **Authority**: `.vscode/mcp.json` (already present in the repo)
- **Action**: If tools do not appear in the IDE, ensure your IDE has access to your `GEMINI_API_KEY` environment variable. You may need to restart the IDE after setting it in your `.zshrc` or `.env`.

> [!IMPORTANT]
> **Restart your session** (CLI, Desktop, or IDE) after any configuration change. Tools will typically appear with an `mcp__` or `mcp-` prefix.

---

## The Followup Prompt

Copy and paste the text below into your Claude session to activate the rules:

```text
Followup: Activate MCP Sidekick Protocols (Token Guardian & Gemini Sidekicks)

Strategic Optimization Roles:
1. Token Guardian (flash-sidekick): You are now required to act with extreme token efficiency.
   - RULE: If a task requires reading >3 files or any file >500 lines, you MUST call 'mcp__flash_sidekick__batch_file_analysis' or 'mcp__flash_sidekick__quick_summarize' first.
   - RULE: Do not ingest raw codebase logs if 'mcp__flash_sidekick__web_research_synthesis' can provide a grounding summary first.

2. Gemini Sidekicks (design-system-sidekick & vision-scorer-mcp):
   - RULE: For every harvested component or UI change, you MUST run 'mcp__design_system_sidekick__validate_asset_compliance' or 'mcp__vision_scorer_mcp__score_asset_compliance'.
   - RULE: If a harvested asset lacks a KR Solidarity token mapping, use 'mcp__design_system_sidekick__extract_tokens_from_visual' to reconcile it.

Thinking Protocol:
Before every significant action, include a 'sidekick_routing' step in your thinking:
- "Should I delegate this read to flash-sidekick?"
- "Do I need a visual score from vision-scorer-mcp for this UI change?"

Action: Confirm you have these tools in your current context and apply these delegation rules to all subsequent tasks in this harvest.
```

---

## Usage Guide

1. **When to use**: Immediately after starting a Claude session or after providing the initial 'Harvest Execution Prompt'.
2. **Impact**: Reduces your Claude token consumption by ~90% for bulk file reads and ensures 100% compliance with KR Solidarity v6.1 design guardrails.
3. **Hierarchy**: This prompt overrides 'worker' behavior with 'orchestrator' behavior, forcing Claude to use the sidekicks as specialized experts.
