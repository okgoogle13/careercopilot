# Supplement: Shadow & Elevation System

## Philosophy

Shadows are not just depth; they are atmosphere. In the Kerala Rage system, shadows are heavy, colored, and behave like thick liquid ("Viscous Breeze").

## Semantic Elevations

### 1. The Surface (Background)

- **Token:** `elevation-0`
- **Value:** `none`
- **Usage:** The dark charcoal canvas itself.

### 2. The Pebble (Button/Badge)

- **Token:** `elevation-1` / `shadow-subtle`
- **Value:** `0 2px 4px rgba(0, 0, 0, 0.25)`
- **Usage:** Small interactive elements.

### 3. The Stone (Card/Panel)

- **Token:** `elevation-2` / `shadow-standard`
- **Value:** `0 4px 8px rgba(0, 0, 0, 0.35)`
- **Usage:** Default container state.

### 4. The Lift (Hover State)

- **Token:** `elevation-3` / `shadow-hover`
- **Value:** `0 8px 16px rgba(0, 0, 0, 0.45)`
- **Usage:** Interactable cards on hover.

### 5. The Float (Modal/Popout)

- **Token:** `elevation-4` / `shadow-maximum`
- **Value:** `0 16px 32px rgba(0, 0, 0, 0.55)`
- **Usage:** Dialogs, menus, critical alerts.

## Colored Shadow Signatures

### Wattle Offset (Optimism)

- **Token:** `shadow-wattle-offset`
- **Value:** `2px 2px 0px var(--color-baru-gold-primary)`
- **Usage:** Primary buttons, "Call to Action" cards.
- **Effect:** Hard edge, retro-optimistic.

### Waratah Bleed (Rage/Danger)

- **Token:** `shadow-waratah-bleed`
- **Value:** `0 0 12px var(--color-waratah-primary)`
- **Usage:** Error inputs, destructive buttons, "Revolution" text.
- **Effect:** Glowing, radioactive intensity.

### Viscous Breeze (Interactive Physics)

- **Token:** `transition-viscous`
- **Value:** `box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Usage:** All elevation changes. Shadows don't just fade; they _ooze_ into place.
