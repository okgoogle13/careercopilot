# Prototype Consolidation Safety Audit (`prototype_v2.0`)

## Executive Summary
**Consolidation Status: NOT RECOMMENDED (ARCHITECTURAL DRIFT)**

Direct consolidation (merging) of the `prototype_v2.0` repository into the main `careercopilot` project is currently blocked by **architectural authority drift**. While React 19 and dependency differences add porting risk, they do not prevent harvesting. The critical blocker is the prototype's reliance on local shell state navigation, which fundamentally conflicts with the canonical route ownership and navigation architecture of the main repository.

---

## Technical Risk Assessment

### 1. Architectural Authority Drift (Primary Blocker)
The primary blocker is how the prototype manages its shell and navigation.
- **Prototype**: Uses local state (`activeTab`) in `App.tsx` and `AppShell.tsx` to manage view transitions.
- **Main Repo**: Relies on `react-router-dom` for URL-driven navigation, route guards, and nested layouts.
- **Impact**: Porting the shell or navigation would conflict with the product's established routing system. Harvesting should focus on **patterns and seams**, not shell ownership.

### 2. Framework & Dependency Posture
| Feature | Prototype (`v2.0`) | Main Repo (`careercopilot`) | Risk Level |
| :--- | :--- | :--- | :--- |
| **React** | **v19.2.0** | **v18** | **Medium** (Porting risk; not a harvest blocker) |
| **Tailwind** | v4.2.1 | v4.1.x | **Low** |
| **Routing** | Local State (`activeTab`) | `react-router-dom` | **Critical** (Architectural drift) |
| **State** | Zustand | Zustand | **None** (Alignment achieved) |

### 3. React 19 & Harvest Strategy
React 19 in the prototype is a "porting risk" rather than an absolute blocker for harvest.
- **Guideline**: Write React 18-compatible component patterns unless explicitly targeted for prototype enhancement.
- **Separation**: Treat any future React 19 upgrade in the main repo as a separate migration, not part of the harvest prep.

---

## Harvest Strategy (Nuanced)

> [!TIP]
> **Keep rich prototype workflow logic where it helps discovery and composition.**
> Harvest the feature patterns and data logic, but preserve the prototype shell as a standalone support-reference build.

### Recommended Action Plan
1. **Maintain Isolation**: Keep `prototype_v2.0` as a support-reference build. Do not add `react-router-dom` or new navigation to it.
2. **Standardized Harvest**: Port features manually to the `features/` directory in the main repo, refactoring them to React 18 standards.
3. **Preserve Prototype Integrity**: Do not introduce or expand routing systems or mutate navigation architecture in the prototype unless explicitly requested.
