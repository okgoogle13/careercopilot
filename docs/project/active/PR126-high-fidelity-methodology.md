# High-Fidelity Auditing Methodology Refinement (Phase 0+)

This document outlines the refined methodology for auditing the CareerCopilot frontend, optimized for maximum data quality and reliability. This refinement follows a deep-research evaluation of Phase 0 methods using Perplexity-grounded best practices.

## Refined Core Methodology: The "Quad-Layer Validation"

We will expand the "Tri-Layered Truths" to include a formal **Integrity Layer** that validates the consistency between the other three.

1.  **Runtime Truth (The Router):** AST-scan `App.tsx` and `route-registry.ts` to map all mounted paths and their canonical features.
2.  **Design Truth (The Blueprint):** Map `screens/**/*.wireframe.xml` to their implementation counterparts.
3.  **Capability Truth (The API):** Scan all `features/**` for endpoint usage and match against `backend/app/api/endpoints/`.
4.  **Integrity Layer (The Compliance):** **[NEW]** Programmatically audit every component for strict KR Solidarity token usage and identify orphaned logic using `ts-morph` AST crawling.

---

## Proposed Methodological Enhancements

### 1. AST-First Orphan Detection (Dynamic Import Safety)
Standard file-based orphan detection can fail on dynamic imports.
- **Action:** Update `detect-orphans.ts` to use `ts-morph` to identify both static `import` and dynamic `import()` calls.
- **Goal:** Eliminate false positives and ensure 100% data reliability in the `orphans.json` report.

### 2. DTCG/Token Compliance Scanner
Manual verification of "Gold Standard" tokens is error-prone.
- **Action:** Create a targeted audit script (`audit-token-compliance.ts`) that reads `tokens.json` and scans `src/**/*.css` and `src/**/*.tsx` for:
    - Hardcoded hex values that match (or nearly match) token values.
    - Magic number spacing (e.g., `8px`, `12px`) not mapped to `--kr-spacing-*`.
- **Goal:** Ensure 100% adherence to the new kebab-case token namespace and eliminate styling drift.

### 3. Circular Dependency & Architectural Audit
Drift often occurs when features import from each other in circular loops.
- **Action:** Use a `ts-morph` dependency graph to identify cross-feature pollution.
- **Goal:** Enforce clean "Tri-Layered Truth" boundaries (e.g., features should not depend on other feature internals).

### 4. Consolidated Audit Health Dashboard
Instead of disparate JSON manifests, we will generate a single `AUDIT_HEALTH_REPORT.md` snapshot.
- **Metrics to Track:**
    - **Route Coverage %**: (Mounted Routes / Total Feature Views)
    - **Token Compliance %**: (Components with 0 Hardcoded Values / Total Components)
    - **Confirmed Dead Code Count**: Verified absolute orphans for Phase 3 deletion.
    - **Architectural Violation Count**: Circular references.

---

## User Review Required

> [!IMPORTANT]
> **Data Quality Level:** The use of `ts-morph` for full-tree crawling is high-fidelity but execution-heavy. Are you okay with the agent performing these intensive scans as part of every "Final Evaluation Snapshot" (Phase 5)?

> [!TIP]
> **Prevention vs Detection:** Would you like me to also draft a pre-commit hook configuration that enforces these "Integrity Layer" rules automatically in the future?
