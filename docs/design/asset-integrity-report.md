# Asset Integrity Status Report

**Date:** 2026-02-12  
**Reconciler Skill Version:** 1.0.0  
**Scope:** `/public/assets/kr-solidarity/`

## 1. Summary of Integrity Status
| Component | Status | Score | Findings |
|-----------|--------|-------|----------|
| **Manifest Sync** | ⚠️ At Risk | 72% | 1 orphan, 0 broken refs, but missing UI primitives. |
| **Hero Registry** | ❌ FAILED | 30% | References non-existent `KR-UI` assets. |
| **Logic Alignment** | ❌ FAILED | 40% | Type mismatches between Registry and Manifest (Composition Engine will fail). |

---

## 2. Critical Conflicts

### 🔴 Broken Registry References (Runtime Crash)
The following Asset IDs are used in `kr-solidarity.hero-registry.json` but do not exist in the manifest or on disk:
- `KR-UI-002` (UI Kit)
- `KR-UI-003` (UI Kit)
- `KR-UI-004` (UI Kit)

### 🔴 Type/Layer Mismatches (Logic Failure)
The `heroComposer.ts` validation logic will fail because the Manifest and Registry disagree on asset roles:
- `KR-SOLID-001`: Registry calls it `spiritual`. Manifest calls it `atmospheric` (Abstract).
- `KR-SOLID-013`: Registry calls it `resistance`. Manifest calls it `atmospheric` (Abstract).
- `KR-SOLID-009`: Registry calls it `spiritual`. Manifest calls it `atmospheric` (Abstract).
- *...and 5 other instances.*

### 🟡 Orphaned Assets (Fossilization)
The following file exists on disk but is not tracked in the manifest:
- `/assets/kr-solidarity/heroes/kr-solidarity__hero__resistance-portrait__v1.png`

---

## 3. Reconciliation Plan (Auto-Correction)

### Phase A: Fix Manifest Infrastructure
1.  **Register `KR-UI` Primitives**: Create placeholder entries or generate/locate the missing `ui-kit` PNGs.
2.  **Add `heroes` Category**: Add the mapping for the orphaned hero to the manifest.

### Phase B: Align Functional Roles
1.  **Manifest Re-classification**: Update the `category` and `layer` of assets in the manifest to match their intended functional roles (Spiritual, Resistance, Cultural) as defined in the Hero Registry.
2.  **Manifest Expansion**: The current "Abstract" category is too broad; split it to allow `heroComposer.ts` to perform accurate safety checks.

### Phase C: Registry Update
1.  **Default Selectors**: Update the Registry to use `asset_id: "auto"` only for layers that have verified candidates in the manifest.

---

## 4. Next Steps
- [ ] Implement `Phase A` to resolve 404/Missing Asset errors in current builds.
- [ ] Run `manifest-reconciler` again after updates to verify 100% sync.
