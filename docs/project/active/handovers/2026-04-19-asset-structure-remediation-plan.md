# Asset & Frontend Structure — Claude Code Handover
**Date:** 2026-04-19  
**Prepared by:** Antigravity  
**For:** Claude Code  
**Plan ref:** See implementation_plan.md in Antigravity brain for full analysis

---

## Context

Five structural issues were identified in the CareerCopilot asset and frontend layout:

1. **Split `src/` silo** — live components (`HeroArt`, `hero.layers.json`) stranded outside `frontend/src/`
2. **Dead placeholder components** — `OldButton`, `TestComponentA`, `TestComponentB` with zero imports
3. **Naming convention chaos** — SCREAMING-KEBAB, snake_case, and verbose names coexist in `frontend/public/assets/`
4. **Zero-padding discontinuity** — `asset-packages/KR-SOLID-0100` through `0105` should be `100`–`105`
5. **Registry/filesystem mismatch** — `KR-SOLID-096` hero entry points to `uncategorized/`; `templates/` is an undocumented empty placeholder

---

## Claude Code Prompt (copy verbatim)

```text
You are remediating the CareerCopilot frontend asset structure.
Full analysis is in the plan document. Execute the 5 workstreams below in order.
Do NOT proceed to the next workstream until the current one is verified.
Commit after each workstream: "fix(assets): WS{N} — {short description}".

HARD CONSTRAINTS:
- Do NOT touch: node_modules/, dist/, .worktrees/, venv/, .venv/
- Do NOT modify: frontend/src/features/OpportunitiesDiscovery.tsx
- Use git mv for ALL renames (never raw mv)
- After any rename, grep for all references and update atomically in the same commit
- Zero import results = archive to docs/_archive/components/, never silent delete

---

WORKSTREAM 1 — Migrate root src/ to frontend/src/

1. grep -r "HeroArt" . --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
2. git mv src/components/HeroArt.tsx frontend/src/components/HeroArt.tsx
3. git mv src/components/HeroArt.css frontend/src/components/HeroArt.css
4. mkdir -p frontend/src/hero && git mv src/hero/hero.layers.json frontend/src/hero/hero.layers.json
5. Update all import paths found in step 1
6. Verify 0 remaining references to old paths
Commit: "fix(assets): WS1 — migrate HeroArt and hero.layers.json to frontend/src/"

---

WORKSTREAM 2 — Purge dead placeholder components

For OldButton, TestComponentA, TestComponentB:
  - grep for each in frontend/src/; if 0 hits → git rm -r src/components/{Name}/
For EditorSplitPane, KanbanBoard, UnifiedColumn:
  - grep for each in frontend/src/; if 0 hits → git mv to docs/_archive/components/{Name}/; if >0 hits → STOP and report
For ManifestoCard:
  - Diff vs any existing frontend/src/ version; document divergences; archive root version
Commit: "fix(assets): WS2 — purge placeholder components, archive orphans"

---

WORKSTREAM 3 — Standardise file naming (frontend/public/assets/)

For each pair: git mv old new, then grep and patch all references before the next rename.

  asset-report.json                       → asset-report.json
  visual-report.json                      → visual-report.json
  asset-catalog.json                      → asset-catalog.json
  kr-solidarity-hero-batch-4c.json                       → kr-solidarity-hero-batch-4c.json
  kr-solidarity-manifest.json → kr-solidarity-manifest.json

Final verify: grep -r "ASSET-REPORT|VISUAL-REPORT|asset_catalog|batch4c-hero|kerala-rage" . --exclude-dir=node_modules → 0 results
Commit: "fix(assets): WS3 — standardise file naming in public/assets/"

---

WORKSTREAM 4 — Fix asset-packages zero-padding

For each pair:
  a. git mv asset-packages/{OLD} asset-packages/{NEW}
  b. In {NEW}/metadata.json and PACKAGING_MANIFEST.json: sed replace OLD_ID with NEW_ID
  c. grep -r "{OLD}" . --exclude-dir=node_modules → patch all remaining hits

  KR-SOLID-0100 → KR-SOLID-100
  KR-SOLID-0101 → KR-SOLID-101
  KR-SOLID-0102 → KR-SOLID-102
  KR-SOLID-0103 → KR-SOLID-103
  KR-SOLID-0104 → KR-SOLID-104
  KR-SOLID-0105 → KR-SOLID-105

Verify: ls asset-packages/ | grep "SOLID-0[0-9][0-9][0-9]" → empty
Commit: "fix(assets): WS4 — normalise asset-packages IDs KR-SOLID-100 to 105"

---

WORKSTREAM 5 — Triage uncategorized/ and templates/

1. git mv \
   "frontend/public/assets/uncategorized/kr-solidarity__uncategorized__uncategorized--textless-protest-tram--v1.png" \
   "frontend/public/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png"

2. In frontend/public/assets/kr-solidarity-hero-registry.json:
   Find asset_id "KR-SOLID-096", update its path to the new canonical location above.

3. If frontend/public/assets/templates/ contains only .gitkeep:
   - git rm frontend/public/assets/templates/.gitkeep
   - Create frontend/public/assets/templates/README.md:
     "# Templates\nReserved for future UI template assets. Do not commit assets here without updating kr-solidarity-manifest.json and ASSET_GOVERNANCE.md."

Commit: "fix(assets): WS5 — triage uncategorized protest-tram, document templates/"

---

POST-EXECUTION:
1. Run: cd frontend && npm run build — confirm 0 errors
2. Run: grep -r "from '../../src/\|from '../../../src/" frontend/src/ --include="*.ts" --include="*.tsx" → 0 results
3. Update docs/development/ASSET_GOVERNANCE.md:
   - Remove deprecated root-level assets/ reference
   - Add frontend/src/hero/ as governed hero config location
   - Update canonical manifest name to kr-solidarity-manifest.json
4. Report all files moved, renamed, or deleted with before/after paths.
```
