# kerala-rage Forbidden Fonts

These fonts signal algorithmic defaults, not intentional design. Using them is a design-system failure.

## ❌ Forbidden Fonts

| Font | Reason |
|---|---|
| **Inter** | Overused, signals generic SaaS/AI-generated UI |
| **Roboto** | Corporate Material Design default |
| **Arial** | Legacy, no personality |
| **Helvetica** | Bland, overused |
| **Open Sans** | Generic, dated |
| **Lato** | Clichéd |
| **Lora** | Legacy KR v1 — superseded by Fraunces + Libre Bodoni |
| **Crimson Text** | Legacy KR v1 — not part of the Solidarity Stack |
| **Source Serif Pro** | Not in the Solidarity Stack |
| **Inconsolata** | Superseded by JetBrains Mono |
| **Courier Prime** | Not canonical |
| **IBM Plex Mono** | Not canonical |
| **Space Grotesk** | Associated with AI-generated aesthetics |
| **Birthstone Bounce** | Legacy KR v1 — superseded by Caveat |
| **System fonts** | `-apple-system`, `BlinkMacSystemFont`, `system-ui`, `Segoe UI` — all banned |

---

## ✅ Authorized KR Solidarity Stack

These are the **only** authorized fonts. All must be loaded as variable font files (`.woff2`).

### Workhorse (Body & UI)

- ✅ **Work Sans Variable** (`WorkSans[wght].woff2`) — `wght` 100–900

### Display & Expressive

- ✅ **Fraunces Variable** (`Fraunces[SOFT,WONK,opsz,wght].woff2`) — Hero headlines, solidarity voice
- ✅ **Libre Bodoni** — Proclamation and declarative statements (static or variable)

### Technical / Mono

- ✅ **JetBrains Mono** — Code, data, technical annotations

### Accent / Curator

- ✅ **Caveat** — Handwritten curator notes, signatures, aside annotations
- ✅ **Nabla (COLRv1)** — **Icon-scale only.** Decorative color glyphs, hero moments. MUST use `--nabla-solidarity` palette. NEVER as a headline-only font.

---

## Rules

1. **Variable files only** — Never import static weight variants (e.g., `WorkSans-Bold.ttf`).
2. **No system fallbacks as primary** — System fonts may appear in the CSS fallback chain ONLY after Work Sans.
3. **Nabla is restricted** — Icon-scale decorative use only. It must complement the Solidarity Stack, never replace it.
4. **Caveat replaces all legacy script fonts** — Birthstone Bounce, Pacifico, Dancing Script, etc. are all forbidden.

---

**Maintained by:** kerala-rage Typography Strategy
**Used by:** kerala-rage-typography-strategy, kerala-rage-brand-enforcer, component-visual-audit, design-token-validator
**Version:** 2.0.0
**Updated:** 2026-03-06
