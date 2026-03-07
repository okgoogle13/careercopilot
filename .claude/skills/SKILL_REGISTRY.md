# KR Solidarity: Skills Registry (v6.1)

_Last updated: 2026-03-06_

## Summary
- Active skills: **69** (added test-coverage-sprint, test-automation-specialist)
- Manifest v6.0.0 — 87 assets (PNG + SVG), all validated via KR Solidarity Canon ✅
- Backend Coverage: **Module-Saturation Approach** — 10 modules (95% target), 53+ test specs ready
- Design Docs: **Streamlined to 5 Core Docs** for faster iteration and AI-driven implementation
  - [01_CANON](../../docs/design/01_CANON.md) — Identity, Manifesto, Cultural Safety
  - [02_SYSTEM](../../docs/design/02_SYSTEM.md) — Palette v3.2, Typography v4.0, Shapes v5.1, Motion
  - [03_COMPONENTS](../../docs/design/03_COMPONENTS.md) — Component catalog & archetypes
  - [04_ASSETS](../../docs/design/04_ASSETS.md) — Asset IDs, manifest, naming convention
  - [05_FLOWS](../../docs/design/05_FLOWS.md) — Page-level UX flows & screen placement
- Key System Updates:
  - **Strict Zero-Flora Lockdown** applied across all generation and audit skills
  - **Test Coverage MCP Server** deployed for parallel test generation (Gemini + Codex + Claude)
  - **Design Doc Validation** via `token-orchestrator` and `m3-expressive-ui-evaluator`

## Design Doc Validation Workflow (Streamlined)
1. **Source of Truth**: `docs/design/{01..05}_*.md` (DTCG + M3 Expressive + Zero-Flora rules)
2. **Token Validation** → `token-orchestrator`: DTCG compliance + semantic color rules
3. **UI Audit** → `m3-expressive-ui-evaluator`: Typography, contrast, motion, component archetypes
4. **Asset Compliance** → `auto-validator`: Vision-based scoring (≥90 gate)
5. **Manifest Reconciliation** → `manifest-reconciler`: No orphans, broken refs, hero coverage
6. **Delivery** → `asset-packager`: Production bundle (assets + context.md + hero-registry.json)

## Asset Audit Workflow (>=90)
1. Validate tokens and semantic variable usage (`--sys-color-*`, `--sys-type-*`).
2. Reconcile manifest and hero registries (no gaps/broken refs).
3. Check wireframe-aligned placement and z-layer intent from [05_FLOWS.md](../../docs/design/05_FLOWS.md).
4. Run vision scoring and require score >= 90 before package/deploy.

## Test Coverage Workflow (Module Saturation)
1. **Baseline Measurement**: Run `pytest --cov=app/<module>` for each module
2. **Identify Gaps**: Use `test-coverage-sprint` MCP to find untested files per module
3. **Parallel Generation**: Delegate to Gemini (heavy services), Codex (APIs + Genkit), Claude (schemas/utils)
4. **Verify**: Run per-module saturation gate `pytest --cov=app/<module> --cov-fail-under=<target>`
5. **Final Gate**: Run global gate `pytest --cov=app --cov-fail-under=95`

**Module Targets**:
| Module | Target | Priority | Assigned Engine |
|---|---|---|---|
| `api` | 85% | 1 | Codex |
| `core` | 85% | 2 | Gemini |
| `genkit_flows` | 80% | 3 | Codex |
| `services` | 85% | 4 | Gemini |
| `agents` | 75% | 5 | Gemini |
| `models` / `schemas` | 75% | 6 | Claude |
| `utils` / `workers` | 70% | 7 | Claude |

## Best Skills to Package (Priority Order)

### Tier 0 — Test Coverage & Quality Gates (Package First — New)
These skills enable CI/CD-ready test automation and coverage validation.

| Priority | Skill | Role in Pipeline |
|---|---|---|
| ⭐ 0a | **test-coverage-sprint** | Module-saturation testing with parallel agent delegation. MCP server for coverage analysis. |
| ⭐ 0b | **test-automation-specialist** | Autonomous test generation agent (pytest, Jest, Playwright). |
| ⭐ 0c | **pytest-test-scaffolder** | Scaffolds unit tests for FastAPI endpoints and Python functions. |
| ⭐ 0d | **jest-test-scaffolder** | Scaffolds Jest tests for React components. |

### Tier 1 — Core Asset Pipeline (Package with Tier 0)
These skills form the mandatory production packaging sequence.

| Priority | Skill | Role in Pipeline |
|---|---|---|
| ⭐ 1 | **token-orchestrator** | Validate design tokens for DTCG compliance + KR Solidarity rules. |
| ⭐ 2 | **manifest-reconciler** | Gate-keeper: validate no orphans/gaps before any packaging. |
| ⭐ 3 | **auto-validator** | Pre-manifest quality gate — score ≥90 to proceed. |
| ⭐ 4 | **asset-packager** | Convert validated assets into production bundle. |
| ⭐ 5 | **vision-scorer-mcp** | Post-manifest deterministic compliance scoring. |
| ⭐ 6 | **batch-processor** | Orchestrate parallel asset-audit + test-generation pipelines. |

### Tier 2 — Design System Integrity (Package with Tier 1)
| Priority | Skill | Role |
|---|---|---|
| 6 | **kerala-rage-asset-cataloger** | Triage assets via Solidarity Canon. |
| 7 | **asset-placement-strategy** | Wireframe slot → manifest asset matching with z-layer validation. |
| 8 | **asset-token-replacer** | Replace placeholders with canonical KR-SOLID tokens. |
| 9 | **asset-path-validator** | Deep-scan all src/url attributes for broken asset references. |
| 10 | **hero-composition-injector** | Inject new hero compositions into hero-registry.json. |

### Tier 3 — Token & Component Compliance (Package for Full Release)
| Priority | Skill | Role |
|---|---|---|
| 11 | **token-orchestrator** | DTCG compliance + KR Solidarity palette rules. |
| 12 | **asset-metadata-enricher** | Semantic metadata (alt-text, political significance). |
| 13 | **component-builder** | M3 Expressive components with 100% token compliance. |
| 14 | **wireframe-annotator** | Annotated wireframes based on [05_FLOWS.md](../../docs/design/05_FLOWS.md). |
| 15 | **kr-svg** | Generate KR-SOLID SVG primitives (strict tokens, organic asymmetry). |

---

## KR Asset Naming Convention (v6.0)
```
kr-solidarity__{layer}__{descriptor}--{detail}--{version}.png
kr-solidarity__ui-kit__{ID}__v{n}.svg
```
- `{layer}`: atmospheric | spiritual | resistance | cultural | substrate.
- `{descriptor}`: category-name (portrait, texture, abstract, hero, symbol, landmark, devotional).

## Generation Scripts
```bash
cd frontend
node scripts/kr/generate-manifest.mjs      # → public/assets/...manifest.json
node scripts/kr/validate-manifest.mjs      # Must pass: 0 errors
node scripts/kr/generate-hero-registry.mjs # → public/assets/...hero-registry.json
```

---

## Active Skills (Selection)

### Test Coverage & QA Skills (New)
| Skill | Directory | Description |
|---|---|---|
| test-coverage-sprint | servers/test_coverage_sprint.py | Module-saturation test coverage analysis. MCP server for parallel test generation. |
| test-automation-specialist | backend/app/agents/ | Autonomous agent for test generation (pytest, Jest, Playwright). |
| pytest-test-scaffolder | .claude/skills/pytest-test-scaffolder | Scaffolds pytest tests for FastAPI endpoints. |
| jest-test-scaffolder | .claude/skills/jest-test-scaffolder | Scaffolds Jest tests for React components. |

### Design System & Asset Skills
| Skill | Directory | Description |
|---|---|---|
| kr-shapes | .claude/skills/kr-shapes | KR Solidarity v6.1 shape system - M3 Expressive morphing tokens, archetype palettes, asymmetric-only geometry. |
| token-orchestrator | .claude/skills/token-orchestrator | DTCG compliance + KR Solidarity palette validation. |
| asset-placement-strategy | .claude/skills/asset-placement-strategy | Wireframe-driven placement for KR Solidarity assets. |
| kerala-rage-brand-enforcer | .claude/skills/kerala-rage-brand-enforcer | Applies KR Solidarity v6.0.0 brand guidelines. |
| vision-scorer-mcp | .claude/skills/vision-scorer-mcp | Visual compliance scoring for KR Solidarity assets. |
| manifest-reconciler | .claude/skills/manifest-reconciler | Reconcile KR asset files against registries. |
| m3-expressive-ui-evaluator | .claude/skills/m3-expressive-ui-evaluator | UI audit against Material Design 3 Expressive standards. |
