# FML Career Copilot Design System Guidelines

## Design Token System

### Overview

Our design system uses a comprehensive design token architecture that bridges Figma designs with CSS implementation. All visual properties should be defined using our design token system for consistency and maintainability.

### Token Categories

#### Color Tokens (Enhanced Palette)

- **Primary Colors**: `--color-primary` (#60a5fa), `--color-primary-light`, `--color-primary-dark`
- **Background Colors**: `--color-background-gradient` (enhanced gradient), `--color-background-section`, `--color-background-card`, `--color-background-elevated`
- **Foreground Colors**: `--color-foreground` (#ffffff), `--color-foreground-secondary` (#e2e8f0), `--color-foreground-muted`
- **Accent Colors**: `--color-accent-blue` (#60a5fa), `--color-accent-purple` (#a78bfa), `--color-accent-green`, `--color-accent-yellow`, `--color-accent-red`
- **Border Colors**: `--color-border-primary`, `--color-border-subtle`
- **Glass Morphism**: `--glass-bg`, `--glass-bg-hover`, `--glass-border`, `--glass-border-hover`, `--glass-blur` (15px)

#### Typography Tokens

- **Font Sizes**: `--font-size-xs` through `--font-size-4xl`
- **Font Weights**: `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`
- **Line Heights**: `--line-height-tight`, `--line-height-base`, `--line-height-relaxed`

#### Spacing Tokens

- **Spacing Scale**: `--spacing-xs` through `--spacing-3xl` (8px to 96px)

#### Enhanced Token Categories

- **Border Radius**: `--radius-sm` through `--radius-xl`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow-primary`, `--shadow-glow-purple`, `--shadow-glass`, `--shadow-glass-hover`
- **Animations**: `--animation-duration-fast` (150ms), `--animation-duration-normal` (300ms), `--animation-duration-slow` (500ms), `--animation-ease`
- **Glass Effects**: `--glass-bg`, `--glass-blur` (15px), `--glass-border`
- **Breakpoints**: `--breakpoint-mobile` (768px), `--breakpoint-tablet` (1024px), `--breakpoint-desktop` (1440px)

### Usage Guidelines

#### In CSS

```css
/* Use CSS custom properties */
.my-component {
  background-color: var(--color-background-card);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

#### In React Components

```tsx
// Import the hook
import { useDesignTokens } from "../hooks/useDesignTokens";

function MyComponent() {
  const { tokens, styles } = useDesignTokens();

  return <div style={styles.card}>{/* Content */}</div>;
}
```

#### With Token Mapper

```tsx
import { careerCopilotTokenMapper } from "../mappings/design-tokens.mapper";

// Maps Figma tokens to CSS variables
const bgColor = careerCopilotTokenMapper("background-card");
```

### Rules

1. **Always use design tokens** instead of hardcoded values
2. **Prefer utility classes** that use tokens (`.text-lg`, `.space-md`)
3. **Use the token mapper** when implementing designs from Figma
4. **Leverage pre-built styles** from `useDesignTokens` for common patterns
5. **Maintain token consistency** across all components

## Component Guidelines

### General Rules

- Only use absolute positioning when necessary. Opt for responsive layouts using flexbox and grid
- Refactor code to keep components clean and focused
- Keep file sizes small, extract helper functions and reusable components
- Use TypeScript for all new components with proper type definitions

### Enhanced Brand Guidelines

- **Primary Color**: Enhanced Blue (#60a5fa) for primary actions and brand elements
- **Secondary Color**: Accent Purple (#a78bfa) for secondary actions and highlights
- **Accent Colors**: Use enhanced brand colors (green, yellow, red) for status and feedback
- **Background**: Gradient background with glass morphism overlays
- **Typography**: Google Sans for headings, system fonts for body text
- **Glass Morphism**: 15px blur effects with semi-transparent overlays
- **Animations**: 300ms smooth transitions with cubic-bezier easing
- **Accessibility**: High contrast ratios, focus indicators, reduced motion support
- **Branding**: "FML Career Copilot" with skull logo, edgy professional aesthetic

### Button Component

#### Usage

Buttons trigger actions and provide clear user affordances. They should have action-oriented labels and appropriate visual hierarchy.

#### Variants

- **Primary Button**: Main actions, uses `btn-gradient` class or primary color tokens
- **Secondary Button**: Alternative actions, outlined style with `border-brand-blue`
- **Ghost Button**: Subtle actions, minimal styling
- **Destructive Button**: Dangerous actions, uses `--color-accent-red`

#### Design Token Usage

```tsx
// Use pre-built button styles
const { styles } = useDesignTokens();
<button style={styles.buttonPrimary}>Action</button>

// Or use CSS classes with tokens
<Button className="bg-brand-blue text-foreground">Action</Button>
```

### Card Component

#### Purpose

Cards contain related information and actions in a unified container.

#### Token-Based Styling

- Background: `var(--color-background-card)`
- Border: `1px solid var(--color-border-subtle)`
- Border Radius: `var(--radius-lg)`
- Shadow: `var(--shadow-sm)` for base, `var(--shadow-md)` for elevated

#### Hover States

- Transform: `translateY(-2px)`
- Shadow: `var(--shadow-md)`
- Border: `var(--color-primary)`

### Typography

#### Hierarchy

- **H1**: `var(--font-size-2xl)`, `var(--font-weight-semibold)`
- **H2**: `var(--font-size-xl)`, `var(--font-weight-semibold)`
- **Body**: `var(--font-size-base)`, `var(--font-weight-regular)`
- **Caption**: `var(--font-size-sm)`, `var(--font-weight-regular)`

#### Color Usage

- Primary text: `var(--color-foreground)`
- Secondary text: `var(--color-foreground-secondary)`
- Muted text: `var(--color-foreground-muted)`

### Spacing System

#### Consistent Spacing

- **Small gaps**: `var(--spacing-xs)` to `var(--spacing-sm)`
- **Component padding**: `var(--spacing-md)` to `var(--spacing-lg)`
- **Section spacing**: `var(--spacing-xl)` to `var(--spacing-2xl)`
- **Page margins**: `var(--spacing-2xl)` to `var(--spacing-3xl)`

### Enhanced Animation Guidelines

#### Micro-interactions

- Use `transition-normal` (300ms) for smooth state changes
- Hover transforms: `translateY(-2px)` to `translateY(-4px)` with glass effects
- Button press: `scale(0.95)` with gradient shadows
- Glass morphism hover: Enhanced blur and border glow

#### Advanced Effects

- **Shimmer Effects**: Use `.shimmer` class for loading states and progress bars
- **Pulse Badges**: `.pulse-ai` and `.pulse-new` for dynamic notifications
- **Glow Hover**: `.glow-hover` for interactive elements
- **Glass Transitions**: Smooth backdrop-filter and opacity changes

#### Accessibility Support

- **Reduced Motion**: Automatic animation disable for `prefers-reduced-motion`
- **Focus States**: Enhanced focus indicators with glow effects
- **High Contrast**: Optional high contrast mode support

## Implementation Standards

### File Organization

- Components in `/components` directory
- UI primitives in `/components/ui`
- Design tokens in `/mappings`
- Hooks in `/hooks`
- Examples in `/components/examples`

### Code Quality

- Use React.forwardRef for components that need ref forwarding
- Implement proper TypeScript types
- Follow consistent naming conventions
- Add displayName to all components for debugging

### Accessibility

- Ensure proper focus management
- Use semantic HTML elements
- Provide appropriate ARIA labels
- Maintain sufficient color contrast

**Important**: Some of the base components may have styling (gap/typography) baked in as defaults. Make sure you explicitly set any styling information from these guidelines in the generated React to override the defaults.
