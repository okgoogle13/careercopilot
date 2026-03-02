# Skills Registry

_Last updated: 2026-02-28_

## Summary
- Active skills: **67**
- Legacy/placeholder cleanup applied: **yes**
- Manifest v6.0.0 — 71 assets (32 PNG + 39 SVG), all validated ✅
- Recommended asset audit combo: **vision-scorer-mcp + asset-placement-strategy + batch-processor**

## Asset Audit Workflow (>=90)
1. Validate tokens and semantic variable usage (--sys-color-*, --sys-type-*).
2. Reconcile manifest and hero registries (no gaps/broken refs).
3. Check wireframe-aligned placement and z-layer intent.
4. Run vision scoring and require score >= 90 before package/deploy.

## Best Skills to Package (Priority Order)

### Tier 1 — Core Asset Pipeline (Package First)
These skills form the mandatory production packaging sequence. Ship as a cohesive bundle:

| Priority | Skill | Role in Pipeline |
|---|---|---|
| ⭐ 1 | **manifest-reconciler** | Gate-keeper: validate no orphans/gaps before any packaging |
| ⭐ 2 | **auto-validator** | Pre-manifest quality gate — score ≥90 to proceed |
| ⭐ 3 | **asset-packager** | Convert validated PNG + IDF JSON → production bundle |
| ⭐ 4 | **vision-scorer-mcp** | Post-manifest deterministic compliance scoring (100-point rubric) |
| ⭐ 5 | **batch-processor** | Orchestrate parallel asset-audit pipeline with aggregated gates |

### Tier 2 — Design System Integrity (Package with Tier 1)
| Priority | Skill | Role |
|---|---|---|
| 6 | **kerala-rage-asset-cataloger** | Triage uncategorized assets → MANIFEST_MATCH / NEW_CANDIDATE / DISCARD |
| 7 | **asset-placement-strategy** | Wireframe slot → manifest asset matching with z-layer validation |
| 8 | **asset-token-replacer** | Replace `TODO[asset]` placeholders with canonical KR-SOLID tokens |
| 9 | **asset-path-validator** | Deep-scan all src/url attributes for broken asset references |
| 10 | **hero-composition-injector** | Inject new hero compositions into hero-registry.json |

### Tier 3 — Token & Component Compliance (Package for Full Design System Release)
| Priority | Skill | Role |
|---|---|---|
| 11 | **token-orchestrator** | DTCG compliance + Kerala Rage palette rules + Tailwind integration |
| 12 | **asset-metadata-enricher** | Semantic metadata (alt-text, political significance) via Gemini |
| 13 | **component-builder** | M3 Expressive production components with 100% token compliance |
| 14 | **wireframe-annotator** | Annotated ASCII wireframes with `<layout>`, `<tokens>`, `<accessibility>` |
| 15 | **kr-svg** | Generate KR-SOLID SVG primitives (strict tokens, organic asymmetry) |

### Tier 4 — Validation & Audit Support (Package for QA Releases)
| Priority | Skill | Role |
|---|---|---|
| 16 | **compliance-dashboard** | Real-time migration % and visual audit pass rates |
| 17 | **m3-expressive-ui-evaluator** | 400-point M3 Expressive scoring (typography, spring physics, vibrant tokens) |
| 18 | **hifi-blueprint-linter** | Validate hi-fi wireframe content against KR design specs |
| 19 | **component-visual-audit** | Screenshot audit against kr-solidarity standards |
| 20 | **design-token-validator** | DTCG compliance + circular reference detection + WCAG contrast |

## Asset Generator Scripts (Frontend)
Run these in order to regenerate manifests from filesystem:
```bash
cd frontend
node scripts/kr/generate-manifest.mjs      # → public/assets/kerala-rage-kr-solidarity-manifest.json
node scripts/kr/validate-manifest.mjs      # Must pass: 0 errors
node scripts/kr/generate-hero-registry.mjs # → public/assets/kr-solidarity-hero-registry.json
```

## KR Asset Naming Convention (Canonical)
```
kr-solidarity__{layer}__{descriptor}--{detail}--{version}.png
kr-solidarity__ui-kit__{ID}__v{n}.svg
```
- `{layer}`: atmospheric | spiritual | resistance | cultural | substrate
- `{descriptor}`: category-name (portrait, texture, abstract, hero, symbol, landmark, devotional)
- `{ID}`: KR-UI-001 through KR-UI-038 (current max)
- Never use: ChatGPT-generated filenames, spaces in names, missing layer segment

## Active Skills

| Skill | Directory | Description |
|---|---|---|
| api-contract-validator | .claude/skills/api-contract-validator | Validates type contracts between TypeScript interfaces and Pydantic |
| artifact-bundler | .claude/skills/artifact-bundler | Bundles a React component or mini-app into a single, self-contained HTML |
| asset-metadata-enricher | .claude/skills/asset-metadata-enricher | Attempts to extract and append semantic metadata (alt-text, political |
| asset-packager | .claude/skills/asset-packager | Automated asset packaging\u2014converts validated PNG + IDF JSON into\ |
| asset-path-validator | .claude/skills/asset-path-validator | Deep-scan validator for all asset paths in the codebase. Ensures all |
| asset-placement-strategy | .claude/skills/asset-placement-strategy | Wireframe-driven placement strategy for Kerala Rage assets with strict semantic token usage and deterministic placement scoring. |
| asset-token-replacer | .claude/skills/asset-token-replacer | Automated replacement of generic asset placeholders with canonical KR-SOLID |
| audit-agent | .claude/skills/audit-agent | Comprehensive security and code quality audit. Use for thorough security, |
| auto-validator | .claude/skills/auto-validator | Programmatic asset compliance validation using vision analysis and Kerala Rage\ |
| batch-processor | .claude/skills/batch-processor | Parallel batch orchestration for component workflows and asset-audit workflows with aggregated validation gates. |
| brand-brief-optimizer | .claude/skills/brand-brief-optimizer | Evaluate and strengthen design system briefs by identifying vague language, |
| careercopilot-agent-scaffolder | .claude/skills/careercopilot-agent-scaffolder | Scaffolds a new Python agent for autonomous AI tasks in 'src/agents/'. |
| careercopilot-tool-creator | .claude/skills/careercopilot-tool-creator | Scaffolds a new Python tool utility in 'src/tools/' for agents to call. |
| codebase-orchestrator | .claude/skills/codebase-orchestrator | Multi-MCP deployment tool for Claude Desktop that coordinates filesystem, |
| compliance-dashboard | .claude/skills/compliance-dashboard | Real-time compliance tracking for kerala-rage kr-solidarity design system. |
| component-builder | .claude/skills/component-builder | Production-grade UI component creator for Kerala Rage design system with |
| component-spec-generator | .claude/skills/component-spec-generator | Transform wireframe markdown into detailed React component implementation |
| component-spec-scaffolder | .claude/skills/component-spec-scaffolder | Generates boilerplate markdown specs for new Kerala Rage components based |
| component-transformer | .claude/skills/component-transformer | Orchestrates the migration of legacy MUI or generic components to the |
| component-visual-audit | .claude/skills/component-visual-audit | Analyze UI component screenshots against kerala-rage kr-solidarity standards. |
| deployment-manager | .claude/skills/deployment-manager | Deploys the project to staging or production using this project's scripts. |
| design-skills | .claude/skills/design-skills | Collection of design-focused skills for visual validation, asset generation, |
| design-system-doc-generator | .claude/skills/design-system-doc-generator | Framework for generating machine-readable design documentation that enables |
| design-token-validator | .claude/skills/design-token-validator | Validate CareerCopilot design tokens for DTCG compliance, kerala-rage |
| example-skill | .claude/skills/example-skill | Example skill demonstrating YAML best practices. Use when learning skill |
| expressive-typography-manipulation | .claude/skills/expressive-typography-manipulation | Technical implementation guide for Material Design 3 Expressive Typography. |
| figma-to-page | .claude/skills/figma-to-page | Generates React code for a full page based on pasted Figma 'Inspect |
| figma-token-sync | .claude/skills/figma-token-sync | Bi-directional token synchronization between DTCG tokens.json and Figma |
| frontend-backend-mapper | .claude/skills/frontend-backend-mapper | Analyzes and maps frontend API calls to backend endpoints. Detects missing |
| git-commit-batcher | .claude/skills/git-commit-batcher | Groups design system changes into logical, conventional commit batches. |
| hero-composition-injector | .claude/skills/hero-composition-injector | Automates the insertion of new Gemini-generated hero compositions into |
| hifi-blueprint-linter | .claude/skills/hifi-blueprint-linter | Validates high-fidelity wireframe content against the Kerala Rage design |
| jest-test-scaffolder | .claude/skills/jest-test-scaffolder | Scaffolds Jest unit tests for React components and hooks. Use when creating |
| json-schema-updater | .claude/skills/json-schema-updater | Synchronizes design token maps and asset manifests with the latest design |
| kerala-rage-asset-cataloger | .claude/skills/kerala-rage-asset-cataloger | Visual triage analyst for kerala-rage kr-solidarity design system. Analyzes |
| kerala-rage-brand-enforcer | .claude/skills/kerala-rage-brand-enforcer | Auto-applies kerala-rage brand guidelines (Melbourne laneway aesthetic, |
| kerala-rage-typography-strategy | .claude/skills/kerala-rage-typography-strategy | Apply "Maximum Expressive Playful" kerala-rage kr-solidarity typography |
| kr-svg | .claude/skills/kr-svg | Generate Kerala Rage kr-solidarity UI primitive SVGs (strict tokens, |
| m3-aesthetic-creator | .claude/skills/m3-aesthetic-creator | Create comprehensive design aesthetic systems using Material 3 Expressive |
| m3-expressive-compliance-dashboard | .claude/skills/m3-expressive-compliance-dashboard | Track Material Design 3 Expressive adoption metrics across components. |
| m3-expressive-token-orchestrator | .claude/skills/m3-expressive-token-orchestrator | Validate Material Design 3 Expressive design tokens for DTCG compliance, |
| m3-expressive-ui-evaluator | .claude/skills/m3-expressive-ui-evaluator | Evaluate UI designs and mockups against Material Design 3 Expressive |
| m3-visual-audit | .claude/skills/m3-visual-audit | Analyze component screenshots against Material Design 3 Expressive standards. |
| manifest-reconciler | .claude/skills/manifest-reconciler | Reconcile KR asset files against manifest and hero registries; report gaps, orphans, and hero coverage metrics. |
| pattern-learner | .claude/skills/pattern-learner | Self-improving pattern database. Analyzes successful assets (\u2265\ |
| pdf-text-extractor | .claude/skills/pdf-text-extractor | Extracts text content from one or more PDF documents. |
| project-health-checker | .claude/skills/project-health-checker | Quick diagnostic tool (30s) running validation and health checks. Use |
| prompt-composer | .claude/skills/prompt-composer | Automated prompt generation from pattern library. Input asset specifications\ |
| pydantic-model-scaffolder | .claude/skills/pydantic-model-scaffolder | Scaffolds Pydantic models for request/response validation with advanced |
| pytest-test-scaffolder | .claude/skills/pytest-test-scaffolder | Scaffolds pytest unit tests for Python backend functions and classes. |
| react-page-scaffolder | .claude/skills/react-page-scaffolder | Creates a complete React page directory (page.tsx, index.ts, styles.css) |
| registry-version-bumper | .claude/skills/registry-version-bumper | Automates semantic versioning and timestamp updates for JSON registries. |
| repo-bloat-deadcode-health-check | .claude/skills/repo-bloat-deadcode-health-check | Detect GitHub repository bloat, surface dead code candidates, and run fast health checks with safe cleanup sequencing. Use when asked to slim a codebase, remove unused files or dependencies, find stale/duplicate artifacts, or produce a pre-PR/pre-release health report with prioritized cleanup actions. |
| shared-references | .claude/skills/shared-references | Common reference materials, templates, and utilities shared across multiple |
| skill-reviewer | .claude/skills/skill-reviewer | Evaluates skill effectiveness, suggests improvements to instructions, |
| sprint-coordinator | .claude/skills/sprint-coordinator | Sprint-level orchestration skill for final deployment push. Generates sprint plans, daily standups, deployment readiness dashboards, and MCP task delegation payloads using existing infrastructure skills. |
| storybook-scaffolder | .claude/skills/storybook-scaffolder | Generates a Storybook story file (*.stories.tsx) with M3 design token |
| task-delegator | .claude/skills/task-delegator | Delegate tasks to specialized agents and coordinate multi-agent workflows |
| task-router-mcp | .claude/skills/task-router-mcp | Multi-agent task orchestration MCP server. Queue-based workflow where\ |
| token-injector | .claude/skills/token-injector | Automated CSS variable injection from tokens.json. Parses design tokens\ |
| token-orchestrator | .claude/skills/token-orchestrator | Validates design tokens for DTCG compliance, Kerala Rage palette rules, |
| ui-design-evaluator | .claude/skills/ui-design-evaluator | Evaluate design assets, analyze annotated wireframes, and create high-fidelity |
| vision-scorer-mcp | .claude/skills/vision-scorer-mcp | Deterministic MCP-based visual compliance scoring for Kerala Rage assets with hard gates for token usage, wireframe alignment, manifest integrity, and hero composition quality. |
| webapp-testing | .claude/skills/webapp-testing | Runs or writes Playwright tests for the 'careercopilot' webapp. Use when |
| wireframe-annotator | .claude/skills/wireframe-annotator | Generate annotated ASCII wireframes based on the "Annotated Wireframe |
