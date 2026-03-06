# KR Solidarity: The User Journey (v6.0)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Documentation of the page matrix, wireframe annotations, and content guide.

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

## 2. Core Screen Annotations

Each screen follows the **Solidarity Layering Rules** (Substrate → Atmospheric → Cultural → Content → UI).

### Page 01: Landing ("The Manifesto")
- **Hero Title:** "THE SOLIDARITY MANIFESTO" (`Fraunces 900`).
- **Subtext:** "Your professional history, re-documented for the collective future."
- **Symbolic Anchor:** `KR-SOLID-023` (Bhagat Singh) - Absolute center-right at Z-2, opacity 100%, high contrast.
- **Texture:** `KR-SOLID-009` (Grit) at 5%, `KR-SOLID-038` (Laneway) substrate.

### Page 04: Ingestion ("The Deposit")
- **Hero Title:** "DEPOSIT HISTORY" (`Libre Bodoni`).
- **Surface:** Recycled industrial paper texture with `concrete-grey` borders.
- **Microcopy:** "Upload your journey. We'll extract the evidence."
- **Verification:** Success triggers the `VerificationStamp` (`onSuccess` slam).

### Page 05: Analysis ("The Audit")
- **Hero Title:** "THE AUDIT" (`Fraunces`).
- **Metric Anchor:** Match Score (0/100) inside a `radius-stone` halo container (`inkGold`).
- **Symbolic Anchor:** `KR-SOLID-012` (Shiva) - Right-side reflection at Z-2, opacity 35%.
- **Technical Detail:** `blueprint-grid` (Z-1) major/minor lines shown.

---

## 3. Global Content Directives

### Tone & Voice Principle
Our voice is **Peered, Grounded, and Defiant**. We reject corporate "care-washing" and enthusiastic marketing language.

- **Forbidden Phrases:** "Empowering your career," "Unlock your potential," "Optimize," "AI-Powered."
- **Preferred Phrases:** "Build your story," "Archive evidence," "Deposit history," "Verify integrity."

### Language Guardrails (Symbolic Sync)
- **Devotional Screens:** Use reflective, analytical, and technical copy (e.g., Analysis, Profile). NO protest slogans.
- **Resistance Screens:** Use action-oriented, defiant, and collective copy (e.g., Landing, Dashboard). NO sacred/devotional language.

---

## 4. Interaction Playbook

| Interaction | Trigger | M3 Motion Name | Visual Effect |
| :--- | :--- | :--- | :--- |
| **Slam** | Load, Success | `overshoot` | 2.0 → 1.0 Scale, Physical Bounce. |
| **Bloom** | Hover, Focus | `standard` | Typography weight shift +0.2em widening. |
| **Drift** | Ambient | `standard-ambient` | Subtle parallax shift on symbolic anchors (Z-2). |
| **Settle** | Drag Drop | `viscous-breeze` | Delayed settling with heavy friction. |

---

**Wireframe Artifact:** `docs/design/Archive/wireframe-status.md` (Legacy Source)
**Last Updated:** 2026-03-06
