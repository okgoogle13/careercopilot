# DESIGN GUIDELINES: KERALA RAGE — SOLIDARITY MODE (v7.0)

> **System:** CAREER_COPILOT
> **Design System:** Kerala Rage v7.0 (Gold Standard — 2.5D Motion & Shape)
> **Mode:** Solidarity (Dark-only)
> **Strict Mode:** ENABLED — Anti-Slop Protocol active
> **Last Updated:** 2026-04-01

---

## ✊ 1. DESIGN PHILOSOPHY: THE MANIFESTO

This is not a dashboard. This is a **living manifesto** — a digital protest wall built for migrants, POC, and career-changers navigating systems not designed for them.

- **Substrate First**: Everything is ink on charcoal (#1A1714). Texture is background-only; UI is high-contrast legibility.
- **2.5D Physicality**: Elements have weight. They don't "fade in"; they "Slam" or "Settle."
- **Screenprint Logic**: Visual elements behave like ink layers — high contrast, deliberate registration errors, and "wet ink" expansion.

---

## 🧱 2. ARCHETYPES & 2.5D MORPHS

All UI components must be categorized into one of these internal archetypes. Each archetype defines a **Shape Palette** and **Motion Coupling**.

### STRIKE (Primary Action)
*The decisive blow. High tension, high impact.*
- **Base Shape**: `--kr-archetypes-strike-shape-base` (Asymmetric 32px/4px)
- **Active Morph**: Transitions to a sharper, more focused geometry on interaction.
- **Motion (The Slam)**: `typeSpringSlam` (600ms). Elements overshoot from Z-3 to Z-2 on impact.

### PLACARD (Information Container)
*The wheat-pasted poster. Heavy, textured, structural.*
- **Base Shape**: `--kr-archetypes-placard-shape-base` (Organic torn-edge radii)
- **Motion (The Drag Settle)**: `dragSettle` (800ms). Heavy, viscous settling physics.

### MARCH (Selection & Flow)
*The collective movement. Expanding and contracting.*
- **Base Shape**: `--kr-archetypes-march-shape-base` (Pill-like with asymmetric anchor)
- **Motion**: Fluid, sequential transitions.

### MEGAPHONE (Announcement & Critical Alert)
*The voice of the collective. Asymmetric and urgent.*
- **Base Shape**: `--kr-archetypes-megaphone-shape-base` (Deeply asymmetric / blobby)
- **Motion**: Immediate, high-priority "The Slam" entrance.

---

## 🎞️ 3. MOTION STRATEGY: THE SOLIDARITY SPRING

All motion must use the **M3 Expressive Overshoot Curve**: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

- **The Slam**: Headlines and critical UI impact the surface with a physical bounce.
- **The Ink Bloom**: Interaction triggers typographic weight expansion (400 → 700) while scaling the element down (`scale(0.98)`).
- **The Water Ripple**: Ambient background motifs use a slow (3000ms) reflective oscillation.

---

## ✍️ 4. EMOTIONAL TYPOGRAPHY AXES

Typography communicates the **emotional state** of the worker through variable axes.

- **Solidarity Slam**: `wght: 900, wdth: 125, tracking: -0.02em`. (Heroic, unyielding)
- **Labor Pressure**: `wght: 800, wdth: 75, tight tracking`. (Condensed, urgent)
- **Melancholy Breath**: `wght: 475, wdth: 98, loose tracking`. (Reflective, airy)

---

## 🚫 5. THE ANTI-SLOP PROTOCOL (HARD LOCKDOWN)

UI that violates these rules is classified as **Institutional Slop** and must be rejected.

1. **Zero Bare Hex**: Every color must map to a `--kr-color-*` token.
2. **The #FFFFFF Ban**: Pure white is prohibited. Use `--kr-color-paper-white-base` (`#F5F0E8`).
3. **The 8px Radii Ban**: Generic uniform radii (the "Institutional Squelch") are prohibited.
4. **Selective Flora/Fauna Guardrail**: Absolutely no Australian native flora (wattle, eucalyptus) or endemic-fauna mascots. Canonical diaspora flora and elephants are allowed when used intentionally.
5. **No Corporate Blue**: Any blue must be `--kr-color-protest-metal-blue-base`.
