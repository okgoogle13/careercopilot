# KR Solidarity: Skills Registry (v6.0)

_Last updated: 2026-03-06_

## Summary
- Active skills: **67**
- Manifest v6.0.0 — 87 assets (PNG + SVG), all validated via KR Solidarity Canon ✅
- Key System Update: **Strict Zero-Flora Lockdown** applied across all generation and audit skills.
- Core Docs: [01_CANON](../../docs/design/01_CANON.md), [02_SYSTEM](../../docs/design/02_SYSTEM.md), [03_COMPONENTS](../../docs/design/03_COMPONENTS.md), [04_ASSETS](../../docs/design/04_ASSETS.md), [05_FLOWS](../../docs/design/05_FLOWS.md).

## Asset Audit Workflow (>=90)
1. Validate tokens and semantic variable usage (`--sys-color-*`, `--sys-type-*`).
2. Reconcile manifest and hero registries (no gaps/broken refs).
3. Check wireframe-aligned placement and z-layer intent from [05_FLOWS.md](../../docs/design/05_FLOWS.md).
4. Run vision scoring and require score >= 90 before package/deploy.

## Best Skills to Package (Priority Order)

### Tier 1 — Core Asset Pipeline (Package First)
These skills form the mandatory production packaging sequence.

| Priority | Skill | Role in Pipeline |
|---|---|---|
| ⭐ 1 | **manifest-reconciler** | Gate-keeper: validate no orphans/gaps before any packaging. |
| ⭐ 2 | **auto-validator** | Pre-manifest quality gate — score ≥90 to proceed. |
| ⭐ 3 | **asset-packager** | Convert validated assets into production bundle. |
| ⭐ 4 | **vision-scorer-mcp** | Post-manifest deterministic compliance scoring. |
| ⭐ 5 | **batch-processor** | Orchestrate parallel asset-audit pipeline. |

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

| Skill | Directory | Description |
|---|---|---|
| asset-placement-strategy | .claude/skills/asset-placement-strategy | Wireframe-driven placement for KR Solidarity assets. |
| kerala-rage-brand-enforcer | .claude/skills/kerala-rage-brand-enforcer | Applies KR Solidarity v6.0.0 brand guidelines. |
| vision-scorer-mcp | .claude/skills/vision-scorer-mcp | Visual compliance scoring for KR Solidarity assets. |
| manifest-reconciler | .claude/skills/manifest-reconciler | Reconcile KR asset files against registries. |
