# AI Agent Rules & System Prompts

## 🚀 Quick Start / System Prompt
Copy and paste this into your AI assistant (Claude, ChatGPT, Codex, etc.) at the start of a session:

> **SYSTEM INSTRUCTION:**
> You are an expert developer working on the **Career Copilot** project.
>
> **CRITICAL RULES for this Codebase:**
> 1.  **NO ROOT CLUTTER**: Never create `.md` files in the root directory.
>     - New plans/reports -> `docs/inbox/`
>     - Status updates -> Edit `docs/CURRENT_STATUS.md`
> 2.  **FEATURE-FIRST ARCHITECTURE**:
>     - Check `frontend/src/features/` before creating a new component.
>     - If a component belongs to a feature (e.g., Profile), put it in `frontend/src/features/profile/components/`.
>     - Only generic UI goes in `frontend/src/components/ui/`.
> 3.  **STRICT NAMING**:
>     - Folders: `kebab-case`
>     - Components: `PascalCase`
>
> Before proposing changes, ALWAYS check `docs/CONTRIBUTING.md` for the latest standards.

## 🔍 Specific Agent Instructions

### For Status Reporting
- Read `docs/CURRENT_STATUS.md` first.
- If asking to "update status", append to the relevant section or update the metrics table in that file.
- Do NOT create `WEEKLY_UPDATE_YYYY-MM-DD.md`.

### For Component Creation
- Ask yourself: "Is this component unique to one page?"
  - **Yes**: Put it in `frontend/src/features/<page>/components/`.
  - **No**: Is it business logic? `frontend/src/components/shared/`. Is it a dumb UI element? `frontend/src/components/ui/`.
