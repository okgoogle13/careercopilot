# Supplement: Organic Shape System

## Philosophy

Nature hates straight lines. The Kerala Rage system rejects the colonial "perfect grid" in favor of organic, asymmetric, and "torn" shapes that imply history, wear, and resistance.

## Core Shapes

### 1. Organic Card (The Stone)

- **Token:** `shape-organic-card`
- **Border-Radius:** `28px 24px 32px 20px` (Base), `32px 20px 24px 28px` (Variant)
- **Usage:** All main content containers. NEVER a perfect rectangle.

### 2. Organic Button (The Pebble)

- **Token:** `shape-organic-button`
- **Border-Radius:** `16px 8px 12px 20px`
- **Usage:** Primary interactions.

### 3. The Torn Edge (Protest)

- **Token:** `clip-path-torn-top` / `clip-path-torn-bottom`
- **Value:** `polygon(0% 10px, 5% 0px, 10% 8px, 15% 2px, 20% 6px, 25% 0px, 30% 8px, 35% 2px, 40% 6px, 45% 0px, 50% 8px, 55% 2px, 60% 6px, 65% 0px, 70% 8px, 75% 2px, 80% 6px, 85% 0px, 90% 8px, 95% 2px, 100% 6px, 100% 100%, 0% 100%)`
- **Usage:** Separators between sections, "wheat-paste" poster aesthetics.

### 4. The Sentry (Avatar)

- **Token:** `shape-sentry`
- **Value:** `98%` (Imperfect Circle)
- **Usage:** User profile pictures.

## Implementation Notes

- Use `CSS Masking` or `clip-path` for Torn Edges.
- Avoid repeating the exact same organic shape adjacent to each other; use `nth-child` to alternate radius values.
