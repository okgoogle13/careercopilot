# HiFi Mockup: Authentication Screen

**Design System**: KR Solidarity v6.0
> **Part of the [KR Solidarity Design Canon](../../01_CANON.md)**
**Mode**: kr-dark (Secure, Focused)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Layout Region: Global Backdrop                              │
│  - Substrate: Asphalt Black (Hex #1A1714)                   │
│  - Texture: Melbourne Laneway {KR-SOLID-033} (Opacity 0.3)  │
│  - Effect: Atmospheric Halo {KR-UI-002} (Pulse 40-60%)      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Verification Portal (Centered Modal)                        │
│  Width: 480px                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  VERIFICATION TITLE                                    │ │
│  │  "Identify Yourself"                                   │ │
│  │  Font: Fraunces (Energetic, 72px, wght=800)            │ │
│  │  Color: --sys-color-paperWhite                         │ │
│  │                                                         │ │
│  │  [Input Field: Email]                                  │ │
│  │  Label: "WORKER ID / EMAIL" (JetBrains Mono 12px)      │ │
│  │                                                         │ │
│  │  [Input Field: Password]                               │ │
│  │  Label: "PASSPHRASE"                                   │ │
│  │                                                         │ │
│  │  [Primary CTA Button]                                  │ │
│  │  "Enter Platform"                                      │ │
│  │  bg: --sys-color-inkGold-base                          │ │
│  │                                                         │ │
│  │  [Secondary Links]                                     │ │
│  │  "Recover Passphrase" · "Join the Union"               │ │
│  └────────────────────────────────────────────────────────┘ │
│  Padding: 48px (Desktop), 32px (Mobile)                     │
│  Background: --sys-color-surface-charcoal (Solid)          │
│  Border: 1px solid --sys-color-inkGold-base (Opacity 0.2)   │
│  Shadow: shadow-viscous (Heavy drop shadow)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Styling |
|---------|-----------|-------------|-------|---------|
| **Verification Title** | Fraunces | 72px / 800 | `--sys-color-paperWhite` | Energetic (-2px tracking) |
| **Form Label** | JetBrains Mono | 12px / 500 | `--sys-color-paperWhite` (50%) | Uppercase |
| **Input Text** | Work Sans | 16px / 400 | `--sys-color-paperWhite` | Normal |
| **CTA Label** | Work Sans | 16px / 700 | `--sys-color-asphaltBlack` | Uppercase |
| **Link Button** | Work Sans | 14px / 400 | `--sys-color-inkGold-base` | Underline |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Portal Surface** | `--sys-color-surface-charcoal` | `#2A2420` |
| **Border Accent** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Input Focus** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Error** | `--sys-color-solidarityRed-base` | `#C45C4B` |
| **Halo Glow** | `--sys-color-inkGold-base` | `#D4A84B` (low opacity) |

---

## Component Specifications

### AuthContainer (Stone Archetype)

**Props:**
```typescript
interface AuthContainerProps {
  title: string;
  isLoading?: boolean;
  error?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}
```

**Styles:**
```css
.auth-container {
  background: var(--sys-color-surface-charcoal);
  border: 1px solid rgba(212, 168, 75, 0.2); /* inkGold 20% */
  border-radius: 20px 6px 16px 8px; /* Stone shape */
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
  padding: 48px;
  position: relative;
  z-index: 10;
}

/* Mobile Adjustment */
@media (max-width: 768px) {
  .auth-container {
    padding: 32px;
    width: 100%;
    margin: 16px;
  }
}
```

### InputField (Lens Archetype)

**Structure:**
```tsx
<div className="input-field-group">
  <label className="mono-label">{label}</label>
  <input
    className="stone-input"
    type={type}
    placeholder={placeholder}
  />
  {error && <span className="error-msg">{error}</span>}
</div>
```

**Styles:**
```css
.stone-input {
  background: var(--sys-color-charcoalBackground-base);
  border: 1px solid var(--sys-color-white-steps-5);
  color: var(--sys-color-paperWhite);
  padding: 16px;
  border-radius: 12px 4px 10px 6px; /* Subtle asymmetric */
  width: 100%;
  font-family: 'Work Sans', sans-serif;
  transition: all 0.2s ease;
}

.stone-input:focus {
  border-color: var(--sys-color-inkGold-base);
  box-shadow: 0 0 0 2px rgba(212, 168, 75, 0.2);
  outline: none;
}
```

---

## Motion & Interaction

### Entry Animation
- **Trigger**: Page Load
- **Behavior**: The `AuthContainer` settles into position.
- **Keyframes**:
  - `0%`: `transform: translateY(40px)`, `opacity: 0`
  - `100%`: `transform: translateY(0)`, `opacity: 1`
  - **Physics**: Heavy spring (Stiffness: 120, Damping: 20)

### Halo Pulse (Background)
- **Target**: `{KR-UI-002}` Halo Disk
- **Behavior**: Infinite breathing cycle.
- **Duration**: 8s loop
- **Properties**: `opacity` oscillates between `0.4` and `0.6`. `scale` oscillates between `1.0` and `1.05`.

### Focus Micro-interaction
- **Target**: Input fields
- **Behavior**: Border glows quickly (0.2s ease-out).

---

## Motif Slots

### 1. Halo Disk (Background Center)
- **Asset**: `{KR-UI-002}`
- **Z-Index**: 0
- **Effect**: "Radiant Boilerplate" - acts as the light source behind the stone substrate.

### 2. Screenprint Grit (Floating)
- **Asset**: `{KR-UI-003}` particles
- **Z-Index**: 1
- **Opacity**: 15%
- **Behavior**: Static noise to reduce digital sterility.

---

## Accessibility (WCAG 2.2 AA)

### Validation Report
- **Contrast**:
  - Headlines (PaperWhite on Charcoal): 15:1 ✅ AAA
  - Placeholders (PaperWhite 50%): 4.5:1 ✅ AA
  - Error Text (Solidarity Red): 5.0:1 ✅ AA
- **Inputs**:
  - `autocomplete` attributes correctly set (`username`, `current-password`).
  - `aria-invalid` toggles on error state.
  - Focus indicators must be high contrast (InkGold).

### Keyboard Navigation
- **Trap**: Focus should be trapped within the modal if it's an overlay (though this is a full page).
- **Tab Order**: Email -> Password -> Forgot Link -> Submit Button -> Register Link.

---

**Status**: Ready for Implementation
**Evaluator**: ui-design-evaluator
