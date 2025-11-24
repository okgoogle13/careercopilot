# Token Saving Strategy with MCP

This guide explains how to configure and use the Model Context Protocol (MCP) servers to significantly reduce your dependency on Claude's token usage (and costs) by offloading tasks to Google's Gemini (Flash model) and local caching.

## The Strategy

The core of this strategy is the **Claude Orchestrator** (`servers/mcp-claude-orchestrator/mcp_claude_orchestrator.py`).

Instead of asking Claude to "read this file and explain it" (which uses Claude's context and output tokens), the Orchestrator:
1.  **Routes** analysis, brainstorming, and explanation tasks to **Gemini 1.5 Flash** (which is much cheaper/free).
2.  **Caches** results locally. If you ask the same question twice, it costs **0 tokens**.
3.  **Searches** documentation locally using the `documentation-server` instead of uploading files to Claude.

## Setup Instructions

### 1. Prerequisites
You must have a working Python environment with `pip`.
*Note: Your current environment seems to be missing `pip`. You may need to install Python 3 full version or use a virtual environment.*

### 2. Install Dependencies
Install the required packages for the Gemini wrapper:

```bash
pip install -r servers/mcp-gemini-wrapper/requirements.txt
# Also install the contrast checker for design system validation
pip install wcag-contrast-ratio
```

### 3. Get a Gemini API Key
1.  Go to [Google AI Studio](https://makersuite.google.com/app/apikey).
2.  Create a free API key.
3.  Add it to your `claude_desktop_config.json` (already configured in the previous step, just replace `your-api-key-here`).

### 4. Configuration
Ensure your `claude_desktop_config.json` includes the orchestrator and gemini servers. This has already been set up for you in the previous task.

## How to Use (Prompting Strategy)

To maximize savings, explicitly ask Claude to use the **Orchestrator** or **Gemini** for heavy lifting.

**Expensive Prompt (Avoid):**
> "Read `src/components/Button.tsx` and explain how it works. Then write a test for it."
*(Claude reads file, thinks, generates explanation, generates test = High Cost)*

**Cheaper Prompt (Recommended):**
> "Use the **orchestrator** to analyze `src/components/Button.tsx` and explain it. Then use the **orchestrator** to suggest a test plan."
*(Claude calls `orchestrator.execute_batch`, Gemini analyzes and explains. Claude just presents the result = Low Cost)*

## Capabilities Map

| Task Type | Handled By | Cost |
|-----------|------------|------|
| Code Explanation | `gemini-wrapper` | Low/Free |
| Refactoring Ideas | `gemini-wrapper` | Low/Free |
| Error Diagnosis | `gemini-wrapper` | Low/Free |
| Documentation Search | `documentation-server` | **Zero** (Local) |
| Architecture Analysis | `gemini-wrapper` | Low/Free |
| Complex Reasoning | **Claude** | High |
| Final Code Generation | **Claude** | High |

## Verification
You can check if it's working by asking Claude:
> "Check the stats of the MCP orchestrator."

It should return a JSON showing `tokens_saved` and `cache_entries`.
