# Context Setup & Task Brief for Claude Desktop

## Project Overview
You are working on **Career Copilot**, a full-stack application for career management and job applications. The project is located at `/Users/okgoogle13/Desktop/careercopilot`.

## Step 1: Required Reading (Use `read_text_file` tool)

Before proceeding, read these files to understand project standards and current state:

### Core Documentation
1. **`/Users/okgoogle13/Desktop/careercopilot/docs/AI_RULES.md`**
   - Mandatory rules for AI agents
   - Folder structure, naming conventions, component architecture
   - File placement guidelines

2. **`/Users/okgoogle13/Desktop/careercopilot/docs/CONTRIBUTING.md`**
   - Developer guidelines and best practices
   - Code style and testing procedures

3. **`/Users/okgoogle13/Desktop/careercopilot/docs/CURRENT_STATUS.md`**
   - Current phase and progress metrics
   - Recent changes and blockers
   - Next priorities

4. **`/Users/okgoogle13/Desktop/careercopilot/docs/project/active/MASTER_MIGRATION_PLAN_v2.md`**
   - Overall project roadmap
   - Phase breakdown and milestones

5. **`/Users/okgoogle13/Desktop/careercopilot/docs/project/active/DEPLOYMENT_READY.md`**
   - Pre-launch checklist
   - Production readiness criteria

### Current Inventory & Tokens
6. **`/Users/okgoogle13/Desktop/careercopilot/frontend/component-inventory.json`**
   - **CRITICAL**: This is the source of truth for component migration status
   - Contains: migrationSummary, kr-solidarityAdoption, component details
   - Schema: migrated/mixed/not_migrated/unknown + usageCount + design token adoption

7. **`/Users/okgoogle13/Desktop/careercopilot/frontend/src/theme/tokens.json`**
   - Canonical kerala-rage kr-solidarity design tokens

8. **`/Users/okgoogle13/Desktop/careercopilot/frontend/src/theme/kerala-rage.css`**
   - kerala-rage kr-solidarity CSS variables and mode system

## Step 2: Acknowledge Context

After reading all files above, provide:
1. **Acknowledgment** that you've read and understood the project rules
2. **Brief summary** of current project state (2-3 sentences)
3. **Confirmation** of folder structure rules (`docs/`, `src/features/`, `src/components/ui/`)
4. **Key insight** from the component inventory (e.g., "X% migrated, Y mixed components")

---

## Step 3: Your Task - Update Planning/Orchestrator Skill

### Goal
Update the custom "planning/orchestrator" skill to derive migration plans from the **current component inventory report** (`frontend/component-inventory.json`), NOT older M3 Expressive docs. Align everything to **kerala-rage kr-solidarity** (kr-dark/kr-dark) and the new inventory schema.

### Repository Context
- **Inventory script**: `frontend/scripts/component-inventory.ts`
- **Inventory output**: `frontend/component-inventory.json` (source of truth)
- **Canonical tokens**: `frontend/src/theme/tokens.json` + `frontend/src/theme/kerala-rage.css`
- **Status doc**: `docs/CURRENT_STATUS.md`
- **Rule**: Avoid root markdown per `docs/AI_RULES.md`

### Required Changes to the Skill

#### 1. Add Inventory Check Step
When planning (or if report is stale):
- From `frontend/` directory, run:
  ```bash
  node --loader ts-node/esm scripts/component-inventory.ts
  ```
- **If the command fails**: Surface the error and ask the user to run it manually. **Do not proceed with stale data.**

#### 2. Update Schema Parsing Logic
Parse the new `component-inventory.json` schema:

**Migration Summary Fields:**
- `migrationSummary`: `migrated`, `mixed`, `not_migrated`, `unknown`
- `kr-solidarityAdoption`: `withkr-solidarityTokens`, `withModeSystem`, `legacyMUI`, `legacyM3`, `fullykr-solidarity`

**Component Entry Fields:**
- `usageCount` - Number of times component is imported
- `category` - Component classification
- `migrationStatus` - Current migration state
- `usesDesignTokens` - Boolean for token adoption
- `usesModeSystem` - Boolean for mode system usage
- `usesLegacyM3` - Boolean for legacy M3 usage

#### 3. Update Planning Logic
**Prioritization Order:**
1. **Mixed components first** (kr-solidarity + legacy coexisting)
2. **Not migrated** (legacy-only components)
3. **Unknown** (classify: unused → archive; used → migrate)

**Within each group, prioritize by:**
- `usageCount` (higher = more critical)
- Critical flows: auth, onboarding, kr-dark/lab shells, applications, documents

#### 4. Update Terminology
- Replace all references to **"M3 Expressive"** with **"kerala-rage kr-solidarity"**
- Remove dependencies on:
  - `frontend/reports/summary.json`
  - `frontend/reports/migration-breakdown.json`
  - Any other older M3 reports

#### 5. Output Expectations
The orchestrator should produce:

1. **Migration Progress Summary**
   - Component counts by status (migrated, mixed, not_migrated, unknown)
   - Percentage completion

2. **Ranked Next-Batch List**
   - Top 10 components to migrate next
   - Include: name, usageCount, current status, reason for priority

3. **Proposed 3-Phase Plan**
   - **Phase 1**: Mixed components (kr-solidarity + legacy)
   - **Phase 2**: Legacy-only components
   - **Phase 3**: Unknown components (classify & migrate)

4. **Status Update** (if user explicitly requests)
   - Update `docs/CURRENT_STATUS.md` with latest progress

---

## MCP Tools Available

1. **filesystem** - Read/write files in `/Users/okgoogle13/Desktop/careercopilot`
2. **flashsidekick** - AI analysis (auto-loads `AI_RULES.md`)
3. **github** - Repository operations
4. **playwright** - Browser automation
5. **docker** - Container management

---

## Important Notes

- All new AI-generated reports → `docs/inbox/` first
- Feature-specific components → `src/features/<feature-name>/components/`
- Generic UI components → `src/components/ui/`
- Naming: PascalCase (components), camelCase (hooks/utils), kebab-case (directories)
- Always run `npm run type-check` after TypeScript changes

---

**Ready? Start with Step 1 (read all required files), then acknowledge context (Step 2), then proceed with the task (Step 3).**
