# HiFi Mockup: Application Form Flow Screen

**Design System**: kerala-rage kr-solidarity V3.1
**Mode**: kr-dark (Functional, Guided)
**Target Score**: ≥360/400 (90% — Excellent)
**Generated**: 2026-02-16

---

## Layout Specification

```
┌─────────────────────────────────────────────────────────────┐
│  Engagement Header                                           │
│  - Branding (Left)                                          │
│  - "Application Portal" (Center)                            │
│  Height: 80px · bg: --sys-color-charcoalBackground-base     │
│  Z-0: Abstract solidarity ink atmosphere (overlay)          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Form Stage (Centered Container)                             │
│  Width: 640px (max-w-2xl)                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Step Indicator (Top)                                  │ │
│  │  [1] ─── [2] ─── [3] ─── [4]                           │ │
│  │  Active: inkGold · Inactive: workerAsh                 │ │
│  │                                                         │ │
│  │  FORM HEADLINE (Dynamic)                               │ │
│  │  "Your Experience"                                     │ │
│  │  Font: Fraunces (Energetic, 48px, wght=800)            │ │
│  │                                                         │ │
│  │  [Input Group: Stone Container]                        │ │
│  │  Label: "CURRENT ROLE" (JetBrains Mono 14px)           │ │
│  │  Input: "Senior Product Designer"                      │ │
│  │  Border: --sys-color-white-steps-5                     │ │
│  │                                                         │ │
│  │  [Input Group: Stone Container]                        │ │
│  │  Label: "YEARS OF EXPERIENCE"                          │ │
│  │  Input: "5+"                                           │ │
│  │                                                         │ │
│  │  Navigation Footer                                     │ │
│  │  [Back (Ghost)]            [Continue (Primary Gold)]   │ │
│  └────────────────────────────────────────────────────────┘ │
│  Padding: 48px                                              │
│  Background: --sys-color-surface-charcoal                  │
│  Effects: shadow-viscous · border-white/5                  │
│  Z-1: Halo disk motif (behind container)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Background Layer                                            │
│  - Melbourne Laneway texture (opacity 0.2)                  │
│  - bg-asphalt-black base                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Typography Hierarchy

| Element | Font Stack | Size/Weight | Color | Letter-Spacing |
|---------|-----------|-------------|-------|----------------|
| **Form Headline** | Fraunces | 48px / 800 | `--sys-color-paperWhite` | -1px (Energetic) |
| **Step Label** | JetBrains Mono | 14px / 700 | `--sys-color-inkGold-base` | 1px (Uppercase) |
| **Input Label** | Work Sans | 14px / 500 | `--sys-color-paperWhite` (60%) | 0.5px |
| **Input Value** | Work Sans | 16px / 400 | `--sys-color-paperWhite` | 0 |
| **Button Text** | Work Sans | 16px / 600 | `--sys-color-asphaltBlack` | 0 |
| **Success Title** | Fraunces | 64px / 800 | `--sys-color-solidarityRed-base` | -2px |

---

## Color Palette (Semantic Tokens)

| Usage | Token | Hex |
|-------|-------|-----|
| **Background (Global)** | `--sys-color-charcoalBackground-base` | `#1A1714` |
| **Form Surface** | `--sys-color-surface-charcoal` | `#2A2420` |
| **Primary Accent** | `--sys-color-inkGold-base` | `#D4A84B` |
| **Text High** | `--sys-color-paperWhite` | `#F5F0E8` |
| **Text Muted** | `--sys-color-worker-ash-steps-6` | `#A39B8F` |
| **Border Subtle** | `--sys-color-white-steps-5` | `rgba(255,255,255,0.05)` |
| **Error State** | `--sys-color-solidarityRed-base` | `#C45C4B` |
| **Focus Glow** | `--sys-color-inkGold-steps-20` | `rgba(212,168,75,0.2)` |

---

## Component Specifications

### FormContainer (Stone Archetype)

**Props:**
```typescript
interface FormContainerProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}
```

**Styles:**
```css
.form-container {
  background: var(--sys-color-surface-charcoal);
  border: 1px solid var(--sys-color-white-steps-5);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4); /* shadow-viscous */
  border-radius: 24px 8px 20px 12px; /* Stone shape */
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.form-container::before {
  /* Inner texture overlay if needed */
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/textures/noise-grain.png');
  opacity: 0.05;
  pointer-events: none;
}
```

### StepIndicator

**Structure:**
```tsx
<div className="step-indicator">
  {steps.map((step, index) => (
    <div key={index} className={`step-dot ${index <= current ? 'active' : ''}`}>
      <span className="sr-only">Step {index + 1}</span>
    </div>
  ))}
</div>
```

**Styles:**
```css
.step-indicator {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.step-dot {
  height: 4px;
  flex: 1;
  background: var(--sys-color-worker-ash-steps-6);
  opacity: 0.3;
  border-radius: 2px;
  transition: all 300ms ease-out;
}

.step-dot.active {
  background: var(--sys-color-inkGold-base);
  opacity: 1;
}
```

---

## Motion & Interaction

### Transitions
- **Step Change**:
  - Exit: `x: -20px`, `opacity: 0` (Duration: 0.2s)
  - Enter: `x: 20px` -> `0px`, `opacity: 0` -> `1` (Duration: 0.3s, Delay: 0.1s)
  - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Spring-like)

### Micro-interactions
- **Input Focus**:
  - Border color transitions to `--sys-color-inkGold-base`
  - Subtle box-shadow glow (`0 0 0 4px rgba(212,168,75,0.1)`)
  - Label text color brightens to 100% opacity

- **Success Reveal**:
  - Full-screen blur overlay (`backdrop-filter: blur(12px)`)
  - Headline explodes in with scale (`0.8` -> `1.0`) and elasticity

---

## Motif Slots

### 1. Halo Disk (Background)
- **Asset**: `{KR-UI-002}`
- **Position**: Centered behind the FormContainer
- **Behavior**: Slow rotation (120s per revolution), 15% opacity
- **Blend Mode**: Screen/Lighten

### 2. Abstract Solidarity (Header)
- **Asset**: `{KR-SOLID-011}`
- **Position**: Top edge/Header background
- **Behavior**: Static, low opacity (10%) texture overlay

### 3. Melbourne Laneway (Global Substrate)
- **Asset**: `{KR-SOLID-033}`
- **Position**: Fixed background covering viewport
- **Opacity**: 20%
- **Effect**: Gritty, realistic texture grounding the digital form

---

## Accessibility (WCAG 2.2 AA)

### Checklist
- [x] **Focus Management**: Focus moves to the first input of the new step automatically.
- [x] **Error Identification**: Errors are described in text and linked via `aria-describedby`.
- [x] **Contrast**: Input text (PaperWhite on Charcoal) passes AAA.
- [x] **Keyboard Nav**: Enter key submits form; Escape key does not clear unless explicitly set.

### ARIA Roles
```html
<form aria-label="Job Application - Step 2 of 4">
  <div role="group" aria-labelledby="step-title">
    <h2 id="step-title">Your Experience</h2>
    <!-- inputs -->
  </div>
  <div class="sr-only" role="status" aria-live="polite">
    <!-- Dynamic validation announcements -->
  </div>
</form>
```
