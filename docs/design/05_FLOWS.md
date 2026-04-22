# KR Solidarity: Flow Architecture (v6.1)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** User journey architecture, screen states, and transition logic.

---

## 1. Product Screen Matrix (Target Alignment)

The application is structured into 11 core functional views, mapped to the canonical [Route Matrix](../project/active/frontend-source-of-truth-migration/control/route-matrix.md).

| ID | View | Canonical Route | Emotional Register | Density | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Landing | `/` | **Possibility** | High Drama | 100% |
| **02** | Auth | `/login`, `/register` | **Reflection** | Minimal | 95% |
| **03** | Onboarding | `/onboarding` | **Possibility** | Standard | 90% |
| **04** | Ingestion | `/career/ingest` | **Direct Action** | High Clarity | 100% |
| **05** | Analysis | `/analysis` | **Revelation** | High Clarity | 95% |
| **06** | Lookout | `/opportunities` | **Possibility** | Standard | 85% |
| **07** | Tracker | `/tracker` | **Direct Action** | Standard | 80% |
| **08** | Workbench | `/documents` | **Craft** | Minimal | 70% |
| **09** | Finalization | `/apply/quick` | **Direct Action** | Structural | 65% |
| **10** | Profile / Settings | `/profile`, `/settings` | **Reflection** | Structural | 60% |
| **11** | Dashboard | `/dashboard` | **Possibility** | High Drama | 90% |

---

## 2. Interaction Playbook

| Interaction | Trigger | M3 Motion Name | Visual Effect |
| :--- | :--- | :--- | :--- |
| **Slam** | Load, Success | `overshoot` | 2.0 → 1.0 Scale, Physical Bounce. |
| **Bloom** | Hover, Focus | `standard` | Typography weight shift +0.2em widening. |
| **Drift** | Ambient | `standard-ambient` | Subtle parallax shift on symbolic anchors (Z-2). |
| **Settle** | Drag Drop | `viscous-breeze` | Delayed settling with heavy friction. |

---

### Register Rules

- **Possibility**: strongest headline energy, optimistic CTA framing, assertive display typography allowed
- **Direct Action**: shorter commands, compact labels, moderate expressive typography only
- **Revelation**: explanatory summaries, diagnostic callouts, expressive emphasis only around insight hierarchy
- **Craft**: editorial sectioning, instructional helper text, moderate typography with strong readability
- **Reflection**: calm copy, sparse formatting, restrained typography

**Archive Artifact:** `docs/design/Archive/wireframe-status.md` (reference only)

---

## 3. Primitive & Shape Flow Map

Key surfaces annotated with dominant public UI primitives and their internal archetype mappings.

| Surface / Flow | Dominant UI Primitives | Primary Flow Transition |
| :--- | :--- | :--- |
| **Landing / Onboarding** | Surface (`Substrate`) + Button (`Strike`) | Substrate `blob02` drift → Button `block03` slam on tap |
| **Lookout / Search** | Input (`Scaffold`) + Select (`March`) | Input remains static → Select morph on open |
| **Job Discovery Card** | Card (`Placard`) + Button (`Strike`) | Card `placardBase01` → Button `block03` on card CTA |
| **Finalization Flow** | Button (`Strike`) → Dialog (`Megaphone`) | Button `block03` → loading `pill01` → Dialog slam |
| **Workbench / Builder** | Input (`Scaffold`) + Card (`Placard`) | Input remains immutable; Card active morph to `block02` |
| **Analysis Results** | Card (`Placard`) + Button (`Strike`) | Card swaps to `block02` on selected state |
| **Profile Management** | Input (`Scaffold`) + Button (`Strike`) | Input never morphs; Button confirms with `typeSpringSlam` |

**Shape morphing flow annotations:**
- **Progress (async):** Button (`Strike`) morphs `block03` → `pill01` (loading) → `block02` (success). Shape morph is the loading indicator.
- **Ambient (backgrounds):** Surface (`Substrate`) blob drifts slowly via `waterRipple` (3000ms). Never blocks UI.
- **Environmental change:** Dialog (`Megaphone`) entrance — Card (`Placard`) zooms via `typeSpringSlam` 600ms. Background surface ambient dims.
- **Structural invariance:** Inputs, textareas, and form panels (`Scaffold`) NEVER change shape. Users depend on structural stability for data entry.

---

**Last Updated:** 2026-03-22
**Design System Version:** v6.1 (Shape System)
