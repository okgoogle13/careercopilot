# KR Solidarity: Flow Architecture (v6.1)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** User journey architecture, screen states, and transition logic.

---

## 1. Product Screen Matrix

The application is structured into 11 core functional views, categorized by emotional depth and data density.

| ID | View | Emotional Register | Density | Status |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Landing | **Defiance** | High Drama | 100% |
| **02** | Auth | **Trust** | Minimal | 95% |
| **03** | Onboarding | **Possibility** | Standard | 90% |
| **04** | Ingestion | **Gravity** | High Clarity | 100% |
| **05** | Analysis | **Revelation** | High Clarity | 95% |
| **06** | Lookout | **Discovery** | Standard | 85% |
| **07** | Kanban | **Control** | Standard | 80% |
| **08** | Workbench | **Craft** | Minimal | 70% |
| **09** | Finalization | **Refinement** | Structural | 65% |
| **10** | Settings | **Archive Vault** | Structural | 60% |
| **11** | Dashboard | **Altitude** | High Drama | 90% |

---

## 3. Interaction Playbook

| Interaction | Trigger | M3 Motion Name | Visual Effect |
| :--- | :--- | :--- | :--- |
| **Slam** | Load, Success | `overshoot` | 2.0 → 1.0 Scale, Physical Bounce. |
| **Bloom** | Hover, Focus | `standard` | Typography weight shift +0.2em widening. |
| **Drift** | Ambient | `standard-ambient` | Subtle parallax shift on symbolic anchors (Z-2). |
| **Settle** | Drag Drop | `viscous-breeze` | Delayed settling with heavy friction. |

---

**Wireframe Artifact:** `docs/design/Archive/wireframe-status.md` (Legacy Source)
---

## 5. Archetype & Shape Flow Map

Key screens annotated with dominant archetype and shape transitions as users move through the application.

| Screen | Dominant Archetypes | Primary Flow Transition |
| :--- | :--- | :--- |
| **Landing / Onboarding** | Substrate (bg) + Strike (CTA) | Substrate `blob02` drift → Strike `block03` slam on tap |
| **Job Search** | Scaffold (input) + March (filter) | ScaffoldInput static → March morph on open |
| **Opportunity Feed** | Placard (cards) + Strike (apply) | Placard `placardBase01` → Strike `block03` on card CTA |
| **Job Apply Flow** | Strike (submit) → Megaphone (confirm) | Strike `block03` → loading `pill01` → Megaphone slam |
| **Resume Builder** | Scaffold (inputs) + Placard (sections) | All Scaffold immutable; Placard active morph to `block02` |
| **Analysis Results** | Placard (tiles) + Strike (actions) | Placard swaps to `block02` on selected state |
| **Profile Edit** | Scaffold (fields) + Strike (save) | Scaffold never morphs; Strike confirms with `typeSpringSlam` |

**Shape morphing flow annotations:**
- **Progress (async):** Strike morphs `block03` → `pill01` (loading) → `block02` (success). Shape morph is the loading indicator.
- **Ambient (backgrounds):** Substrate blob drifts slowly via `waterRipple` (3000ms). Never blocks UI.
- **Environmental change:** Megaphone entrance — Placard zooms via `typeSpringSlam` 600ms. Background Substrate ambient dims.
- **Scaffold invariance:** Text inputs and form panels NEVER change shape. Users depend on structural stability for data entry.

---

**Last Updated:** 2026-03-07
**Design System Version:** v6.1 (Shape System)
