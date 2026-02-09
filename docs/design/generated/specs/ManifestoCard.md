# Component Spec: ManifestoCard

## 1. Component Description
A high-impact card for displaying revolutionary manifestos and collective declarations. Enforces "Solidarity Mode" aesthetics with M3 Expressive principles.

## 2. TypeScript Interface
```typescript
interface ManifestoCardProps {
  /** The bold declaration title */
  title: string;
  /** The manifesto content text */
  content: string;
  /** Label for the primary action button */
  actionLabel?: string;
  /** Callback triggered on action click */
  onAction?: () => void;
  /** Optional background motif visibility */
  showMotif?: boolean;
}
```

## 3. State Management
- **Local State**:
    - `interactionState`: 'idle' | 'hover' | 'active'
    - `submissionStatus`: 'idle' | 'loading' | 'success' | 'error'

## 4. Design Token Mapping
| Element | Category | CSS/Tailwind Class |
|---------|----------|-------------------|
| Container | Layout/Surface | `bg-charcoal-100 shadow-viscous clip-path-tear` |
| Title | Typography | `text-display-lg font-solidarity-800 text-waratah-red` |
| Body | Typography | `text-body-lg font-direct-action-450 text-paper-white/80` |
| Action Button | Component | `bg-baru-gold text-charcoal shadow-hover-rise rounded-pebble` |
| Background Motif | Asset | `opacity-10 pointer-events-none z-0` |

## 5. Accessibility (ARIA)
- **Role**: `article`
- **Landmarks**: `h2` for title, `button` for action.
- **Labels**: 
    - Card: `aria-label="Manifesto: {title}"`
    - Action: `aria-label="Commit to {actionLabel}"`

## 6. Micro-interactions
- **Entrance**: Framer Motion `initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 12 }}`.
- **Hover**: Scale `1.03`, shadow intensification.
- **Action Click**: `scale: 0.95`, haptic pulse simulation.

## 7. Test Stubs
- [ ] Renders title and content correctly.
- [ ] Triggers `onAction` when clicked.
- [ ] Displays loading pulse when `submissionStatus` is 'loading'.
- [ ] Accessibility: Passes `axe` audit for contrast and roles.