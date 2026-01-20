# Curer Copilot - Contribution Guidelines

Welcome to the team! To keep our codebase clean and scalable, please adhere to the following rules.

## 📂 Directory Structure
We use a **strict** hierarchy to prevent root clutter and "component soup".

- **`src/features/<feature-name>`**: self-contained modules.
  - If a component is *only* used for the "Profile" page, it belongs in `src/features/profile/components`.
  - Do NOT put feature-specific code in the global `src/components` folder.
- **`src/components/ui`**: Dumb, atomic UI elements (Buttons, Inputs, Cards). 
  - These should have NO business logic or domain knowledge.
- **`src/components/shared`**: Domain-aware components used across multiple features (e.g., `UserAvatar`).
- **`docs/project/`**: All project management files.
  - `active/`: Current timelines, plans, and trackers.
  - `archive/`: Old audits, logs, and completed plans.
  - `inbox/`: **Drop location for all AI-generated reports.**

## 📝 Naming Conventions
- **Directories**: `kebab-case` (e.g., `user-profile`, `job-queue`)
- **React Components**: `PascalCase` (e.g., `UserProfile.tsx`)
- **Hooks/Utils**: `camelCase` (e.g., `useAuth.ts`, `formatDate.ts`)
- **Tests**: `*.test.tsx` or `*.spec.ts` inside a `__tests__` directory or alongside the file.

## 🤖 AI Interaction Rules
- **Do not create files in the root.** Always place new "Plans" or "Audits" in `docs/inbox/`.
- **Status Updates**: Do not create new weekly tracker files. Update `docs/CURRENT_STATUS.md`.
