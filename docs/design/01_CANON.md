# KR Solidarity: Design Canon (v6.0)

> **Status:** Canonical Source of Truth
> **Theme:** Migrant Rage / Kerala Solidarity
> **Aesthetic:** Screenprint Manifesto / Urban Resistance
> **Audience:** Designers, Developers, AI Agents

---

## 1. Identity & Manifesto

We are not building a dashboard. We are building a living manifesto for migrants, POC, and career-changers moving through systems not built for them.

**KR Solidarity** is a tactical digital workspace where a user’s professional journey is treated as a collective history of resilience. The visual language is rooted in the collision of Kerala’s vibrant diaspora identity and Melbourne’s (Naarm) urban street-art grit.

### Core Directives (Non-Negotiable)

1.  **Dark-Only Territory:** Every interface uses `#1A1714` (Solidarity Charcoal) as the foundational substrate. No white backgrounds. No light modes.
2.  **Anti-Bureaucracy Protocol:** Explicitly ban all motifs of borders, passports, visas, government forms, or official state documentation. We speak peer-to-peer, not authority-to-subject.
3.  **Zero-Flora Rule:** Absolutely NO flora (gum leaves, eucalyptus, etc.) or Australian endemic fauna (non-human species as mascots). The environment is strictly Urban/Human/Cultural.
4.  **No Monarchy/Colonialism:** No crowns, no scepters, no bureaucratic seals. Colonial defeat is implicit and final.
5.  **Screenprint Logic:** Visual elements behave like ink layers on paper—high contrast, visible grain, deliberate registration errors, and "wet ink" expansion.

---

## 2. Design Principles

### A. The Street-Truth Substrate
Backgrounds are never a "void"; they are the urban substrate. Surfaces must feel like matte charcoal paper, weathered brick, or asphalt. Texture is background-only; foreground UI retains maximum legibility.

### B. Defensive Geometries (The Hand-Cut Edge)
Rejection of perfect geometry. We use asymmetric radii drawn from the base `radius.*` scale and the `shape.*` library. No uniform corner radius. No `border-radius: 50%`. The classic named geometries remain:
- **March Open** — `shape.marchSurge01` — `radius.xl radius.md radius.lg radius.xxl` — Active buttons, pill tags, nav chips.
- **Megaphone Base** — `shape.megaphoneCut01` — `42% 58% 45% 55% / 48% 62% 38% 52%` — Expressive cards, hero anchors.
- **Placard Base** — `shape.placardTorn01` — `48% 52% 58% 42% / 55% 45% 60% 40%` — Large sections, foundational blocks.

### C. Shape & Protest Geometry

Shape is not decoration. It is **stance**. A sharp corner is a refusal. A softened edge is a concession. Shape morphing is labour in motion — the container changes as conditions change.

#### The Four Laws of KR Shape

1. **Asymmetric Radii Are the Default.** No identical values on all four corners. Uniform geometry is the aesthetic of bureaucracy. We reject the "Institutional Squelch" (uniform `8px` everywhere).
2. **Shape Morphs with State.** Interaction, progress, and environmental change are visible in the shape. A button that is loading looks different from one that is idle — not only in colour, but in geometry. Shape is motion.
3. **Tension Through Contrast.** Juxtapose sharp corners with deeply rounded ones. A `radius.xxxl` element beside a `radius.xs` one creates the same expressive pressure as ultra-black type beside hairline weight. Two shapes of identical roundness are two voices at the same volume.
4. **Shape is Versatile, Not Sacred.** No single shape "means" one thing. A `shape.megaphoneCut01` can anchor a hero card or a protest quote. The archetype (Strike, March, Megaphone, Placard, Scaffold, Substrate) defines the role and tone; the shape token defines the geometry. Archetypes use shape palettes, not single sacred shapes.

#### Shape is Versatile, Not Sacred

Each archetype uses a **shape palette** — a set of approved shapes for default, active, and ambient states — not a single locked shape. A `shape.blockRiot03` can appear on a Strike button and on a Placard heading. What changes is the interaction behaviour and motion coupling, not the exclusive ownership of a shape.

- Archetypes define tone and interaction; shapes define geometry.
- Shapes may appear in multiple archetype contexts if they pass validator rules.
- `shape.substrateTile*` shapes are restricted to **Substrate** (decorative backgrounds) and explicitly whitelisted avatar/hero frame contexts.

#### Semantic Action Archetypes (KR v6.0)

Six archetypes define the emotional and political role of UI elements:

| Archetype | Role | Emotional Register | Shape Palette |
| :--- | :--- | :--- | :--- |
| **Strike** | Primary action, decisive CTA | Defiance, finality | `shape.blockRiot03` → `shape.blockRiot02` (active) |
| **March** | Sequential progress, flow elements | Collective momentum | `shape.blockRiot01` → `shape.marchSurge01` (active) |
| **Megaphone** | Announcement, focal emphasis | Urgency, voice | `shape.megaphoneCut01` → `shape.substrateTile01` (ambient) |
| **Placard** | Content container, framing | Solidarity structure | `shape.placardTorn01` → `shape.blockRiot02` (active) |
| **Scaffold** | Layout structure, navigation | Neutral, load-bearing | `shape.blockRiot01` (immutable — no morph) |
| **Substrate** | Decorative background, atmospheric | Organic, environmental | `shape.substrateTile02` → `shape.substrateTile01` (ambient) |

### D. Extreme Variable Contrast
Typography behaves as pressure and relief. We enforce a **9× weight ratio** (Hairline 100 vs Ultra-Black 900) and **6× size ratio** (12px metadata vs 72px+ display) to create expressive tension.

### E. M3 Expressive Motion (The Solidarity Spring)
All motion uses the M3 Expressive overshoot curve: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **The Slam:** Headers hit the surface with a dramatic overshoot, suggesting a physical printing press.
- **The Bloom:** Interaction triggers typographic weight expansion, suggesting "wet ink" absorbing into paper.

---

## 3. Cultural Safety & Accountability

### First Nations Solidarity
Aboriginal flag colors (Red, Yellow, Black) are used **ONLY in situ** on placards or posters depicted within the UI. They are never used as decorative brand colors or abstracted UI tokens.
- **Required Text:** "ALWAYS WAS ALWAYS WILL BE" or "TREATY NOW" must accompany First Nations placards.

### Devotional Integrity (Shiva)
Shiva imagery (Nataraja presence, Trishula icons) must be **reverent, statue-inspired, and grounded**.
- **The Separation:** Devotional imagery (sacred) must never mix with protest slogans (political) on the same screen. Use on reflective/analytical pages only.

### No Slop Protocol
- No generic `border-radius: 8px` (the Institutional Squelch).
- No corporate blue.
- No AI-hype jargon ("Powered by AI", "Unlock Potential").
- No stock-photo aesthetics.
- No `border-radius: 50%` — ever. Use `radius.full` or `sentryAvatar` (`98%`) instead.
- All radii in code must reference `radius.*` or `shape.*` tokens. No hardcoded pixel values.
- `shape.substrateTile*` tokens are restricted to **Substrate archetype** and whitelisted decorative contexts (avatar masks, hero frames). All other usage is a violation.

---

**Last Updated:** 2026-03-07
**Next Review:** Post-MVP Visual Audit
