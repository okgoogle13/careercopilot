# Agent Handover — Detailed Task Payloads
**Generated**: 2026-02-27 | **Prepared by**: sprint-coordinator
**Context branch**: claude/design-migration-status-Tj6t4
**Work branch**: restoration-KR-Rage-Figma-v2.0

> These payloads are ready for delegation via task-router-mcp. All tasks below are sequenced by dependency. Agents must complete predecessors before starting dependents.

---

## CRITICAL PATH (Blocks Production Deploy)

---

### T1 — Fix Yarn Environment & Verify Build
```json
{
  "task_id": "T1",
  "assigned_to": "devops-specialist",
  "priority": "critical",
  "inputs": {
    "description": "Enable Corepack, activate Yarn 4.10.3, then verify the frontend build passes. The TypeScript fix was already committed in 71f3c52 but cannot be confirmed passing.",
    "steps": [
      "Run: corepack enable",
      "cd frontend && corepack prepare yarn@4.10.3 --activate",
      "Run: yarn install",
      "Run: yarn build",
      "If build fails, check frontend/src/features/ksc-generator/KSCGenerator.tsx for remaining TS errors",
      "Check frontend/src/services/api.ts for getKSCDraft/saveKSCDraft/clearKSCDraft methods"
    ],
    "files_affected": [
      "frontend/src/features/ksc-generator/KSCGenerator.tsx",
      "frontend/src/services/api.ts"
    ],
    "known_error_types": [
      "Property 'getKSCDraft' does not exist on type",
      "Property 'saveKSCDraft' does not exist on type",
      "Property 'clearKSCDraft' does not exist on type",
      "Type 'Transition' is not assignable to type 'Variants' (Framer Motion)",
      "Cannot find name 'supabase'"
    ],
    "acceptance_criteria": [
      "corepack enable runs without error",
      "yarn build completes with exit code 0",
      "No TypeScript compilation errors",
      "Build output present in frontend/dist/"
    ],
    "verification": "cd frontend && yarn build 2>&1 | tail -5"
  },
  "next_task": "T2",
  "next_assigned_to": "test-runner"
}
```

---

### T2 — Run Full Test Suite + Coverage Baseline
```json
{
  "task_id": "T2",
  "assigned_to": "test-runner",
  "priority": "critical",
  "inputs": {
    "description": "After build passes, run all frontend and backend tests to establish coverage baseline. Test coverage is currently 'unknown' — this blocks the readiness score.",
    "dependencies": ["T1"],
    "steps": [
      "cd frontend && yarn test --coverage --watchAll=false",
      "cd backend && source venv/bin/activate && pytest -v --cov=app --cov-report=json",
      "Document coverage % from both outputs"
    ],
    "acceptance_criteria": [
      "All Jest tests pass (0 failures)",
      "All pytest tests pass (0 failures)",
      "Frontend coverage report generated",
      "Backend coverage report generated",
      "Coverage >= 70% minimum (target 90%)"
    ],
    "known_issues": [
      "Yarn 4.10.3 required — must complete T1 first",
      "Backend venv must be activated"
    ],
    "verification": "yarn test --coverage 2>&1 | grep -E 'Tests:|Coverage'"
  },
  "next_task": "T3",
  "next_assigned_to": "devops-specialist"
}
```

---

### T3 — Commit All Batched Artifacts + Merge to Main
```json
{
  "task_id": "T3",
  "assigned_to": "devops-specialist",
  "priority": "critical",
  "inputs": {
    "description": "Commit all uncommitted classification artifacts, then merge restoration-KR-Rage-Figma-v2.0 to master. This was T3+T4 in the DA-P2-REV sprint and was never completed.",
    "dependencies": ["T2"],
    "branch_to_merge": "restoration-KR-Rage-Figma-v2.0",
    "target_branch": "master",
    "files_to_stage": [
      ".claude/tasks/batch-1-classification.json",
      ".claude/tasks/batch-2-classification.json",
      ".claude/tasks/batch-3-classification.json",
      ".claude/tasks/batch-4-classification.json",
      ".claude/tasks/batch-5-classification.json",
      ".claude/tasks/migration-plan.json",
      ".claude/tasks/migration-report.json",
      ".claude/tasks/TASK_COMPLETION_SUMMARY.md",
      ".claude/tasks/asset-path-validation-report.json",
      ".claude/tasks/DESIGN_MIGRATION_STATUS_REPORT.md",
      ".claude/tasks/AGENT_HANDOVER_TODOS.md"
    ],
    "commit_message": "docs: add asset classification artifacts, migration report, and sprint handover\n\n- 5 batch classification JSONs (49 assets, 98% compliance)\n- Migration plan and execution report\n- Weekly validation baseline (28/28 paths valid)\n- Design migration status report (DA-P2-REV post-sprint)\n- Agent handover todo payloads for next sprint",
    "steps": [
      "git status to confirm clean state",
      "git add [files listed above]",
      "git commit -m [commit_message]",
      "git checkout master && git pull origin master",
      "git merge restoration-KR-Rage-Figma-v2.0 --no-ff",
      "git push origin master"
    ],
    "acceptance_criteria": [
      "All artifacts committed",
      "Merge completed with no conflicts",
      "CI/CD pipeline passes on master",
      "All checks green on master"
    ],
    "risk": "Merge conflicts possible — rebase branch first if master has diverged"
  },
  "next_task": "T4",
  "next_assigned_to": "ux-accessibility-lead"
}
```

---

## HIGH PRIORITY (Quality Gates)

---

### T4 — WCAG AA Accessibility Audit + Fix (Gap: 23%)
```json
{
  "task_id": "T4",
  "assigned_to": "ux-accessibility-lead",
  "priority": "high",
  "inputs": {
    "description": "WCAG AA compliance is at 77%. Need to identify and fix the remaining 23% gap across all feature components. Focus on contrast ratios, keyboard navigation, ARIA labels, and focus states.",
    "dependencies": ["T3"],
    "current_compliance": 77,
    "target_compliance": 100,
    "scope": [
      "frontend/src/features/auth/ (Login, Register)",
      "frontend/src/features/dashboard/",
      "frontend/src/features/applications/",
      "frontend/src/features/jobs/",
      "frontend/src/features/analysis/",
      "frontend/src/features/documents/",
      "frontend/src/features/ksc-generator/",
      "frontend/src/features/onboarding/",
      "frontend/src/features/opportunities/",
      "frontend/src/features/profile/",
      "frontend/src/features/settings/"
    ],
    "known_wcag_failure_patterns": [
      "bg-slate-50 with text-slate-900 — may fail 4.5:1 ratio",
      "bg-blue-50 text overlays — check contrast",
      "Icon-only buttons without aria-label",
      "Modal dialogs missing focus trap",
      "Form inputs missing associated labels"
    ],
    "steps": [
      "Run axe DevTools or playwright accessibility scan on all 21 feature routes",
      "Generate violation report grouped by WCAG criterion",
      "Fix Level A violations first, then AA",
      "Re-run scan to verify 100% pass rate",
      "Update --sys-color-* tokens for any color contrast fixes"
    ],
    "tools_available": [
      "Playwright e2e tests (yarn test:e2e)",
      "axe-core via @axe-core/playwright",
      "ux-accessibility-lead agent skill"
    ],
    "acceptance_criteria": [
      "Zero Level A WCAG violations",
      "Zero Level AA WCAG violations",
      "All interactive elements keyboard-navigable",
      "All images have alt text",
      "All form controls have associated labels",
      "Color contrast >= 4.5:1 for normal text, 3:1 for large text"
    ],
    "verification": "yarn test:e2e:headed -- --grep accessibility"
  },
  "next_task": "T5",
  "next_assigned_to": "component-transformer"
}
```

---

### T5 — Component Token Migration Sweep (44/48 files)
```json
{
  "task_id": "T5",
  "assigned_to": "component-transformer",
  "priority": "high",
  "inputs": {
    "description": "Only 4 of 48 feature .tsx files use --sys-color-* CSS variables. The remaining 44 files use Tailwind generic utilities (bg-slate-*, bg-blue-*, text-slate-900, etc.) which violate the kerala-rage kr-solidarity design system. Migrate all non-compliant files.",
    "dependencies": ["T4"],
    "current_compliance": "8% (4/48 files)",
    "target_compliance": "100% (48/48 files)",
    "critical_violations": {
      "AssetReview/AssetReviewDashboard.tsx": "40+ instances: bg-slate-50, bg-blue-50, bg-green-600, bg-yellow-600, bg-red-600, bg-sky-600, text-slate-900",
      "auth/Login.tsx": "grid background pattern with inline styles",
      "auth/Register.tsx": "grid background pattern with inline styles",
      "dashboard/components/JobCard.tsx": "inline style color props",
      "applications/components/InterviewPrep.tsx": "inline rgba color styles"
    },
    "token_mapping_guide": {
      "bg-slate-50": "--sys-color-surface-container",
      "bg-slate-900": "--sys-color-surface-dim",
      "text-slate-900": "--sys-color-on-surface",
      "bg-blue-50": "--sys-color-secondary-container",
      "bg-green-600": "--sys-color-tertiary",
      "bg-red-600": "--sys-color-error",
      "bg-yellow-600": "--sys-color-primary-40",
      "bg-sky-600": "--sys-color-secondary"
    },
    "deprecated_markers_to_fix": [
      "Cabinet.tsx: [DEPRECATED_STYLE] on lines 23, 33",
      "Jar.tsx: rgba(44, 39, 35, 0.4) inline",
      "Lens.tsx: rgba(44, 39, 35, 0.4) inline",
      "StatusBadge.tsx: rgba(230, 225, 214, 0.1), rgba(212, 168, 75, 0.15)",
      "WorkflowDiagram.tsx: Mermaid hex colors (#D4A84B, #1A1714, etc.)"
    ],
    "migration_pattern": {
      "before": "<div className='bg-slate-50 text-slate-900'>",
      "after": "<div className='bg-[var(--sys-color-surface-container)] text-[var(--sys-color-on-surface)]'>"
    },
    "steps": [
      "Run: grep -r 'bg-slate\\|bg-blue\\|bg-green\\|bg-red\\|bg-sky\\|bg-yellow' frontend/src/features/ --include=*.tsx -l",
      "For each file, replace Tailwind generic utilities with --sys-color-* mappings",
      "Remove all [DEPRECATED_STYLE] comment markers after fixing",
      "Replace rgba() hardcoded values with CSS custom properties",
      "Fix WorkflowDiagram.tsx Mermaid theme config to use token values",
      "Run lint check: yarn lint"
    ],
    "acceptance_criteria": [
      "Zero instances of bg-slate-*, bg-blue-*, text-slate-900 in features/",
      "Zero rgba() hardcoded colors in components/ui/",
      "Zero [DEPRECATED_STYLE] markers",
      "Zero hex colors in feature tsx files",
      "All files using --sys-color-* CSS variables",
      "Lint passes after changes"
    ],
    "verification": "grep -r 'bg-slate\\|bg-blue\\|#[0-9A-Fa-f]\\{6\\}' frontend/src/features/ --include=*.tsx | wc -l  # Should be 0"
  },
  "next_task": "T6",
  "next_assigned_to": "devops-specialist"
}
```

---

## MEDIUM PRIORITY (Stability + Documentation)

---

### T6 — Rebuild CSS Variables from tokens.json (43 → 200+ lines)
```json
{
  "task_id": "T6",
  "assigned_to": "design-systems-architect",
  "priority": "medium",
  "inputs": {
    "description": "The CSS variables file (frontend/src/styles/design-tokens.css) only has 43 lines but should have 200+ lines covering all tonal palettes, semantic roles, motion, typography, and shape tokens from tokens.json.",
    "dependencies": ["T5"],
    "current_state": "43 lines — only base color variables",
    "expected_state": "200+ lines — full tonal palettes, semantic roles, motion, typography, shapes",
    "token_source": "frontend/src/design/tokens/tokens.json",
    "css_output": "frontend/src/styles/design-tokens.css",
    "steps": [
      "Run: cd frontend && python3 ../scripts/build-m3-tokens.py (if exists)",
      "OR run: npm run tokens:build",
      "OR run: npm run kr:validate",
      "Verify output has full tonal steps (0-100) for primary, secondary, tertiary, error, neutral",
      "Verify motion easing variables present",
      "Verify typography font variables present",
      "Verify shape/border-radius variables present"
    ],
    "acceptance_criteria": [
      "design-tokens.css has 200+ lines",
      "All --sys-color-primary-{0..100} steps present",
      "All --sys-color-secondary-{0..100} steps present",
      "Motion easing variables (--sys-motion-*) present",
      "Typography variables present",
      "Shape/radius variables present",
      "Build still passes after CSS update"
    ],
    "fallback": "If build script is broken, manually expand design-tokens.css by extracting tonal values from tokens.json DTCG format",
    "verification": "wc -l frontend/src/styles/design-tokens.css  # Should be 200+"
  },
  "next_task": "T7",
  "next_assigned_to": "design-systems-architect"
}
```

---

### T7 — Update Design System Documentation
```json
{
  "task_id": "T7",
  "assigned_to": "design-systems-architect",
  "priority": "medium",
  "inputs": {
    "description": "Document the final asset system state, migration patterns, and maintenance procedures. Three documents need creation/update.",
    "dependencies": ["T6"],
    "files_to_create_or_update": [
      {
        "path": ".claude/docs/ASSET_MANAGEMENT.md",
        "status": "CREATE NEW",
        "content_topics": [
          "Asset naming convention: kr-solidarity__{category}__{descriptor}__v1.{ext}",
          "Category definitions with examples (abstract, texture, motif, landscape, portrait, devotional, specimen)",
          "Manifest structure and sync process",
          "Weekly validation script usage (.claude/tasks/run-weekly-validation.sh)",
          "How to add new assets to the kr-solidarity library"
        ]
      },
      {
        "path": "frontend/src/design/README.md",
        "status": "UPDATE",
        "content_topics": [
          "Updated component archetype usage guide",
          "Token-to-class mapping table",
          "Migration patterns from Tailwind → --sys-color-*",
          "CSS variable rebuild instructions"
        ]
      },
      {
        "path": "CLAUDE.md",
        "status": "UPDATE (asset section only)",
        "content_topics": [
          "Asset library stats: 267 assets, 98% compliance",
          "Weekly validation automation note",
          "Updated token rebuild command"
        ]
      }
    ],
    "acceptance_criteria": [
      "ASSET_MANAGEMENT.md created with all 5 topic sections",
      "frontend/src/design/README.md updated",
      "CLAUDE.md asset stats current",
      "All documentation reviewed for accuracy"
    ],
    "verification": "Read each file and confirm coverage"
  },
  "next_task": "T8",
  "next_assigned_to": "test-automation-specialist"
}
```

---

### T8 — E2E Tests for New Features (Document Pipeline + RKL)
```json
{
  "task_id": "T8",
  "assigned_to": "test-automation-specialist",
  "priority": "medium",
  "inputs": {
    "description": "The document generation pipeline and Resume Knowledge Library (RKL) were added this sprint without corresponding e2e tests. Scaffold and implement Playwright tests for both.",
    "dependencies": ["T7"],
    "features_needing_tests": [
      {
        "feature": "Document Generation Pipeline",
        "backend_endpoint": "backend/app/api/endpoints/document_export.py",
        "test_scenarios": [
          "Generate resume document from user profile",
          "Export to PDF format",
          "Export to DOCX format",
          "Handle invalid template gracefully"
        ]
      },
      {
        "feature": "Resume Knowledge Library (RKL)",
        "backend_endpoint": "via genkit flows",
        "test_scenarios": [
          "Upload resume and extract knowledge",
          "Query resume library for job match",
          "Update resume entry",
          "Delete resume from library"
        ]
      }
    ],
    "test_location": "frontend/tests/",
    "test_pattern": "*.spec.ts (Playwright)",
    "skill_to_use": "webapp-testing",
    "acceptance_criteria": [
      "Playwright spec files created for document-pipeline and RKL",
      "All happy path scenarios covered",
      "Error scenarios covered",
      "Tests pass in yarn test:e2e"
    ],
    "verification": "yarn test:e2e 2>&1 | grep -E 'passed|failed'"
  },
  "next_task": "T9",
  "next_assigned_to": "devops-specialist"
}
```

---

## LOW PRIORITY (Post-Deploy)

---

### T9 — Sprint DA-P2-REV Retrospective
```json
{
  "task_id": "T9",
  "assigned_to": "design-systems-architect",
  "priority": "low",
  "inputs": {
    "description": "Write the retrospective for the Design Automation Phase 2 sprint. This was deferred from T7 in the original sprint plan.",
    "dependencies": ["T8"],
    "template": ".claude/skills/sprint-coordinator/examples/sprint-retrospective.md",
    "output_path": ".claude/retrospectives/DA-P2-REV-retrospective.md",
    "topics_to_cover": [
      "What went well: asset automation, agent workflows, 98% compliance achievement",
      "What didn't work: Yarn version mismatch, scope expansion mid-sprint",
      "Lessons learned: validate current state before planning, lock Yarn version in CI",
      "Improvements for next sprint: Define scope freeze point, add build env validation"
    ],
    "metrics_to_include": {
      "asset_compliance": "62% → 98%",
      "broken_paths": "5 → 0",
      "manifest_sync": "96% → 100%",
      "uncategorized_assets": "73 → 0",
      "new_features_added_post_sprint": 7,
      "readiness_score": "85/100 → estimated 90+"
    },
    "acceptance_criteria": [
      "Retrospective document created",
      "All 4 topic areas covered",
      "Metrics table included",
      "Recommendations for next sprint listed"
    ]
  },
  "next_task": null,
  "next_assigned_to": null
}
```

---

## Task Dependency Graph

```
T1 (devops) ──→ T2 (test-runner) ──→ T3 (devops) ──→ T4 (ux-accessibility-lead)
                                                               │
                                                               ↓
                                                       T5 (component-transformer)
                                                               │
                                                               ↓
                                                       T6 (design-systems-architect)
                                                               │
                                                               ↓
                                                       T7 (design-systems-architect)
                                                               │
                                                               ↓
                                                       T8 (test-automation-specialist)
                                                               │
                                                               ↓
                                                       T9 (design-systems-architect)
```

---

## Deployment Readiness After Completion

| Criterion | Current | After All Tasks | Weight |
|-----------|---------|-----------------|--------|
| Build status | ⚠️ Unverified | ✅ Passing | 15 |
| Test coverage | ❌ Unknown | ✅ ≥90% | 10 |
| WCAG AA | ⚠️ 77% | ✅ 100% | 10 |
| Token compliance | ✅ 100% | ✅ 100% | 10 |
| Asset compliance | ✅ 98% | ✅ 98% | 20 |
| Broken paths | ✅ 0 | ✅ 0 | 15 |
| Security | ✅ 0 | ✅ 0 | 5 |
| Component migration | ❌ 8% | ✅ 100% | 15 |
| **Total** | **~83** | **~100** | |

**Target recommendation after T1-T8**: `GO` (≥95/100)

---

*Handover prepared by sprint-coordinator | 2026-02-27 | Branch: claude/design-migration-status-Tj6t4*
