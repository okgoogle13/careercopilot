# Kerala Rage Palette

## Primary (The Revolution)

- **Charcoal (Background)**: `#1A1714` (The Void, The Night, The Coal) -> `--sys-color-charcoalBackground-base`
- **Solidarity Red (Primary/Action)**: `--sys-color-solidarity-red` (Urgency, Blood, Heat, Agit-Prop) -> `--sys-color-solidarityRed-base`
- **Ink Gold (Accent/Highlight)**: `--sys-color-ink-gold` (Temple Radiance, Hope, Wealth, Solidarity) -> `--sys-color-inkGold-base`

## Semantic Roles

### Backgrounds

- **Global Background**: `#1A1714` (Calculated for OLED/High Contrast).
- **Surface/Card**: `#242120` (Slightly lighter charcoal).
- **Overlay**: `#1A1714` with 90% opacity.

### Typography

- **Primary Text**: `#FFFFFF` (Pure White - Maximum Contrast on Charcoal).
- **Secondary Text**: `--sys-color-worker-ash` (Worker Ash - Readable linework).
- **Accent Text**: `--sys-color-ink-gold` (Ink Gold - Links/Highlights).
- **Destructive/Urgent Text**: `--sys-color-kr-charcoal-red` (KR Charcoal Red).

### UI Elements

- **Primary Button**: `--sys-color-solidarity-red` (Background) + `#FFFFFF` (Text).
- **Secondary Button**: Transparent + `--sys-color-ink-gold` (Border/Text).
- **Focus Ring**: `--sys-color-ink-gold` (Glow).

## Gradients (Viscous Fluidity)

- **The Heat**: `linear-gradient(180deg, rgba(241, 71, 20, 0) 0%, rgba(241, 71, 20, 0.2) 100%)`
- **The Gold**: `linear-gradient(90deg, --sys-color-ink-gold 0%, --sys-color-solidarity-red 100%)` (Solidarity Gradient)

## Forbidden Colors

- **Blue**: No "Tech Blue" or "Corporate Blue".
- **Green**: No "Nature Green" (unless strictly kr-leafus-smoke `#4A5D55` for distinct secondary).
- **Purple**: No "SaaS Purple".
