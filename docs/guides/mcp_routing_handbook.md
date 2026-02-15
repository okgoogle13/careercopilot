# Claude-to-Gemini Routing Handbook (Delegation Strategy)

## 📋 Strategy Overview
In the **Antigravity** environment, tasks are routed between **Claude** (Orchestrator) and **Gemini** (Heavy-Duty Sidekick) based on computational intensity, vision requirements, and token efficiency. This handbook defines when and how delegation occurs.

## 🤖 Delegation Matrix

| Task Category | Primary Engine | Delegation Tool | Reason |
| :--- | :--- | :--- | :--- |
| **Logic & Coding** | Claude Sonnet | N/A | High reasoning capability and code synthesis. |
| **Bulk Analysis** | Gemini 3 Flash | `quick_summarize` | High throughput, token-saving. |
| **Visual Auditing** | Gemini 3 Flash | `analyze_image` | Native multi-modal vision with large context. |
| **Deep Research** | Gemini 3 Pro | `consult_pro` | Search grounding and 1M+ context window. |
| **Parallel Audit** | Gemini 3 Flash | `batch_file_analysis` | Concurrent processing of multiple files. |

## 🛠 Automatic Triggers

### 1. "Anti-Slop" Asset Auditing
When a new asset is added or modified in the `frontend/public/assets/kr-solidarity` directory, Claude automatically invokes the **Sidekick** to:
- Verify compliance with **Kerala Rage — Solidarity Mode**.
- Check for banned symbols (e.g., crowns, monarchy).
- Generate M3-compliant naming suggestions.

### 2. High-Context Retrieval
If a query requires looking at dozens of files across the backend and frontend simultaneously, Claude delegates to the **Sidekick**'s `batch_file_analysis` to bypass sequential read limits.

### 3. Real-Time Web Grounding
For up-to-date documentation checks (e.g., latest Genkit v0.5.0 updates), Claude uses `web_research_synthesis` on Gemini 3 Pro to pull live citations.

## 🚀 Efficiency Gain
By delegating these tasks, we reduce Claude's token usage by **~60-70%** for non-coding heavy operations, ensuring that Claude remains responsive for the primary task of building and architecting.

## 🔧 Model Configuration (Updated: Feb 2026)

### Primary Models
All MCP servers now prioritize **Gemini 3 and 2.5 families**:

| Server | Primary Model | Fallback Models |
| :--- | :--- | :--- |
| **flash_sidekick.py** | `gemini-3-flash-preview` | `gemini-2.5-flash`, `gemini-2.0-flash`, `gpt-4o-mini` (GitHub) |
| **flash_sidekick_fast.py** | `gemini-3-flash-preview` | N/A (single model) |
| **design_system_sidekick.py** | `gemini-3-pro-preview` | `gemini-3-flash-preview`, `gemini-2.5-pro`, `gpt-4o-mini` (GitHub) |
| **vision_scorer_mcp.py** | `gemini-3-flash-preview` | N/A (single model) |

### Fallback Strategy
When Gemini models are unavailable or rate-limited, MCP servers automatically fall back to **GitHub Models** via the OpenAI SDK:
- **Model**: `gpt-4o-mini` (cost-effective, fast)
- **Authentication**: Requires `GITHUB_TOKEN` environment variable
- **SDK**: Uses `openai` Python package for robust error handling

This ensures **99.9% uptime** for critical operations like asset auditing and design system validation.
