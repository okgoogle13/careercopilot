# Experimental Integrations: Harvest Support Spec (v2.1)

## Core Directive: Support-Only Harvest
`prototype_v2.0` is a **reference input only**. Canonical runtime truth resides in `/frontend/src/` (reachable from `App.tsx`) and `route-matrix.md`. Tools must inventory patterns and map them to canonical owners, not promote raw TSX.

## 1. Token-Efficient Tool Design (AGENTS.md Compliance)
To maximize token efficiency, all tools must delegate bulk scanning to **Flash Sidekick** when files > 3 or lines > 500.

| Tool | Core Responsibility | Delegation Strategy |
| :--- | :--- | :--- |
| **Harvest Audit** | Deterministic QA gates (no drift, no leaks) | `flash-sidekick.batch_file_analysis` |
| **Owner Mapper** | Map prototype paths to `route-matrix.md` | `flash-sidekick.quick_summarize` |
| **Readiness Wrapper** | Orchestrate `test-deployment.sh` + `.env.local` | Local execution (low overhead) |
| **KR Design Audit** | Scan for hex values/Zero-Flora tokens | `design-system-sidekick` + `flash` |
| **Visual Diff** | Compare Canonical vs. Wireframe (Design Truth) | `vision-scorer-mcp` |

## 2. Integration Catalog

### 2.1 Prototype Harvest Audit
- **Type**: Pre-commit Hook / Gate
- **Scope**: Flag destructive ops, dependency drift, and secret leakage.
- **Rule**: Block any mutation of `frontend/src/App.tsx` navigation architecture.

### 2.2 Canonical-Owner Mapper
- **Type**: Audit Utility
- **Output**: JSON classification (`harvest_now`, `support_only`, `blocked`).
- **Seams**: Detects routing, state, and React-version compatibility gaps.

### 2.3 Readiness Wrapper
- **Type**: CLI Orchestrator
- **Checks**: `test-deployment.sh`, `typecheck`, `.env.local` validation.
- **Authority**: Verifies Firebase exports strictly via `frontend/src/config/firebase.ts`.

### 2.4 KR Harvest Audit (Audit-First)
- **Mode**: Lint JSX for hardcoded styles and discouraged tokens.
- **Compliance**: Enforces Zero-Flora and KR Solidarity v6.0 archetypes.
- **Action**: Optional `--apply` codemod mode behind explicit flag.

### 2.5 Visual Drift "Diff-Auditor"
- **Priority**: (1) Canonical vs. Wireframe, (2) Canonical vs. KR Tokens.
- **Reference**: Prototype visuals are secondary support only.

### 2.6 Genkit Playground
- **Surface**: `backend/app/api/endpoints/genkit.py`.
- **Constraint**: No invented runtimes; use `AGENTS.md` documented flows and `pytest`.

## 3. Standards & Sequence
- **Portability**: Auto-detect root via `git rev-parse`. No absolute paths.
- **I/O**: Machine-readable JSON + Concise Markdown.
- **Sequence**:
  1. `harvest-audit` (Gates)
  2. `owner-mapper` (Map)
  3. `readiness-wrapper` (Verify)
  4. `kr-audit` (Styles)

## 4. Non-Goals
- No direct prototype-to-runtime automation.
- No auto-wiring of `App.tsx` routes.
- No unreviewed/bulk rewriting of canonical surfaces.
- No replacement of `route-matrix.md` authority.
