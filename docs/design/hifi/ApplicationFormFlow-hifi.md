# ApplicationFormFlow Hi-Fi Blueprint

## Layout Regions
- **Engagement Header**: Persistent title for the application process.
- **Form Stage**: A high-fidelity `FormContainer` (Stone) that adapts based on the current step.
- **Step Navigation**: A tactile footer with `StepIndicator` and primary/secondary navigation buttons.

## Typography
- **Form Headline**: `Fraunces Energetic`, 48px (mobile: 32px), `font-weight: 800`.
- **Step Label**: `JetBrains Mono`, 14px, `uppercase`, `text-ink-gold`.
- **Input Labels**: `Work Sans`, 14px, `font-weight: 500`, `text-paper-white/60`.
- **Success Title**: `Fraunces Energetic`, 64px, `font-weight: 800`, `text-solidarity-red`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Form Card**: `bg-asphalt-black`, `border-white/5`, `shadow-viscous`.
- **Active Indicator**: `bg-ink-gold`.
- **Error State**: `text-solidarity-red`, `border-solidarity-red/50`.

## Spacing
- **Form Padding**: `p-12` (Desktop), `p-6` (Mobile).
- **Field Gap**: `space-y-6`.
- **Navigation Footer**: `mt-10`, `pt-6`, `border-t`, `border-white/5`.

## Motion
- **Step Transition**: Current step slides out (`x: -20`, `opacity: 0`) and next step slides in (`x: 20`, `opacity: 1`) using a synchronized spring.
- **Success Reveal**: Successful submission triggers a full-screen `blur-md` overlay with a high-impact `solidarity-red` energetic headline.
- **Micro-interaction**: Inputs lift and glow on focus.

## Motif Slots
- `// TODO[asset]: Halo Disk Motif pulsing behind Submit button (Z-1)`.
- `// TODO[asset]: Botanical Motif overlay for Success Screen (Z-0)`.
- `// TODO[asset]: Screenprint Substrate overlay (global)`.
