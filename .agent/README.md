# Antigravity Agent Configuration

This directory contains configuration and procedures for **Antigravity**, your AI coding agent.

## Folder Structure

### 📂 `workflows/` (Agentic Procedures)
*   **Path:** `.agent/workflows/*.md`
*   **Purpose:** Defines executable procedures (slash commands) for the AI agent to perform within your IDE.
*   **Format:** Markdown files with YAML frontmatter.
*   **Trigger:** Slash commands like `/component_builder` or `/fastapi_endpoint_scaffolder`.
*   **Example Usage:** Scaffolding code, running complex migrations, executing multi-step tests.

### 📄 `PLANS.md` (Codex ExecPlan Capability)

*   **Path:** `.agent/PLANS.md`
*   **Purpose:** Defines the repository's long-session ExecPlan format for Codex and other coding agents.
*   **Active Plan Location:** Store active implementation plans in `docs/project/active/plans/`, following the override in `AGENTS.md`.
*   **Use When:** A task is complex, spans multiple sessions, crosses subsystems, or needs a resumable plan with progress, decisions, validation, and recovery notes.

### ❓ FAQ: vs. GitHub Workflows

**Q: How is this different from `.github/workflows/`?**

| Feature | `.github/workflows/` | `.agent/workflows/` |
| :--- | :--- | :--- |
| **Executor** | GitHub Actions Runner (Cloud) | Antigravity Agent (Local IDE) |
| **File Type** | YAML (`.yml`) | Markdown (`.md`) |
| **Trigger** | Git Push, PR, Schedule | Slash Command (`/cmd`) |
| **Goal** | CI/CD (Build, Test, Deploy) | Interactive Development Tasks |

*   **GitHub Workflows** are for **automation** after you commit.
*   **Agent Workflows** are for **assistance** while you code.
