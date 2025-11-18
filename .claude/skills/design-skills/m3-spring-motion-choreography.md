# M3 Spring Motion Choreography

**Purpose:** Create physics-based, "alive" animations with spring easing and choreographed page-load sequences.

**Input:** Component file path + motion preferences + choreography config
**Output:** Spring-physics animations with staggered reveals and orchestrated sequences

---

## Overview

This skill implements M3 Expressive motion principles:

1. **Spring-Based Physics** - Natural, bouncy animations (not predefined curves)
2. **Choreographed Page Loads** - Orchestrated sequences with staggered reveals
3. **High-Impact Moments** - Focus on one well-orchestrated entrance over scattered micro-interactions
4. **"Alive" Interactions** - Elements react to gestures with physics (bounce, spring, overshoot)
5. **Accessibility** - Respect `prefers-reduced-motion` for inclusive design

---

## M3 Expressive Motion Principles

### 1. Spring Physics (Not Linear Curves)

**Anti-Pattern (Boring, Mechanical):**
```css
/* ❌ Predefined curve - feels robotic */
.element {
  transition: transform 300ms ease-in-out;
}
```

**M3 Expressive (Spring Physics):**
```css
/* ✅ Spring physics - feels alive */
.element {
  transition: transform 400ms var(--sys-motion-easing-expressive-spring);
  /* cubic-bezier(0.175, 0.885, 0.32, 1.275) - subtle overshoot */
}

.element-bouncy {
  transition: transform 500ms var(--sys-motion-easing-expressive-bounce);
  /* cubic-bezier(0.68, -0.55, 0.265, 1.55) - pronounced bounce */
}
```

**Spring Easing Curves:**

| Curve | Bezier | Overshoot | Use Case |
|-------|--------|-----------|----------|
| `expressive-spring` | (0.175, 0.885, 0.32, 1.275) | 12.75% | Subtle bounce (buttons, cards) |
| `expressive-bounce` | (0.68, -0.55, 0.265, 1.55) | 55% | Playful bounce (notifications, badges) |
| `emphasized-decelerate` | (0.05, 0.7, 0.1, 1) | 0% | Smooth deceleration (page enters) |
| `emphasized-accelerate` | (0.3, 0, 0.8, 0.15) | 0% | Confident acceleration (page exits) |

---

### 2. Choreographed Page Loads (Staggered Reveals)

**Anti-Pattern (All-At-Once Load):**
```tsx
// ❌ Everything appears instantly - no delight
<div className="page-content">
  <Header />
  <Hero />
  <Features />
  <Footer />
</div>
```

**M3 Expressive (Orchestrated Sequence):**
```tsx
// ✅ Staggered entrance with animation-delay
<div className="page-content">
  <Header className="animate-enter" style={{ animationDelay: '0ms' }} />
  <Hero className="animate-enter" style={{ animationDelay: '100ms' }} />
  <Features className="animate-enter" style={{ animationDelay: '200ms' }} />
  <Footer className="animate-enter" style={{ animationDelay: '300ms' }} />
</div>
```

**CSS Animation:**
```css
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(24px); /* Rise from below */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-enter {
  animation: enter 600ms var(--sys-motion-easing-emphasized-decelerate) both;
  /* 'both' applies styles from 0% and 100% */
}

/* Accessibility: Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .animate-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**Stagger Delay Formula:**
```javascript
function calculateStaggerDelay(index, baseDelay = 100, maxDelay = 500) {
  // Limit total stagger to avoid long waits
  const delay = Math.min(index * baseDelay, maxDelay);
  return `${delay}ms`;
}

// Example: 5 items with 100ms stagger
[0, 100, 200, 300, 400] // Total: 400ms
```

---

### 3. High-Impact Moments (Focus on Page Load)

**Principle:** One well-orchestrated page load creates more delight than scattered micro-interactions.

**Page Load Choreography Example (Dashboard):**

```tsx
const DashboardPage = () => {
  return (
    <div className="dashboard">
      {/* Act 1: Header slides in from top (100ms) */}
      <Header
        className="choreograph-slide-down"
        style={{ animationDelay: '0ms' }}
      />

      {/* Act 2: Hero fades up with spring (300ms) */}
      <HeroStats
        className="choreograph-fade-up-spring"
        style={{ animationDelay: '100ms' }}
      />

      {/* Act 3: Cards cascade in (staggered by 80ms each) */}
      <div className="card-grid">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            className="choreograph-scale-in"
            style={{ animationDelay: `${200 + index * 80}ms` }}
          >
            {card.content}
          </Card>
        ))}
      </div>

      {/* Act 4: Footer fades in after all content (800ms) */}
      <Footer
        className="choreograph-fade-in"
        style={{ animationDelay: '800ms' }}
      />
    </div>
  );
};
```

**CSS Choreography Keyframes:**
```css
/* Act 1: Slide down */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.choreograph-slide-down {
  animation: slide-down 400ms var(--sys-motion-easing-emphasized-decelerate) both;
}

/* Act 2: Fade up with spring */
@keyframes fade-up-spring {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.choreograph-fade-up-spring {
  animation: fade-up-spring 600ms var(--sys-motion-easing-expressive-spring) both;
}

/* Act 3: Scale in with bounce */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.choreograph-scale-in {
  animation: scale-in 500ms var(--sys-motion-easing-expressive-bounce) both;
}

/* Act 4: Simple fade */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.choreograph-fade-in {
  animation: fade-in 400ms var(--sys-motion-easing-standard) both;
}
```

---

### 4. "Alive" Interactions (Physics-Based Reactions)

**Button Press (Spring Reaction):**
```css
.button-expressive {
  transition:
    transform 200ms var(--sys-motion-easing-expressive-spring),
    box-shadow 200ms var(--sys-motion-easing-expressive-spring);
}

.button-expressive:hover {
  transform: translateY(-2px) scale(1.02); /* Slight lift and grow */
  box-shadow: var(--sys-elevation-level3); /* Elevated shadow */
}

.button-expressive:active {
  transform: translateY(0) scale(0.98); /* Spring back down */
  box-shadow: var(--sys-elevation-level1); /* Pressed shadow */
  transition-duration: 100ms; /* Faster response to press */
}
```

**Notification Bounce (Dismiss Gesture):**
```tsx
const NotificationToast = () => {
  const [isDismissing, setIsDismissing] = useState(false);

  return (
    <div
      className={`notification ${isDismissing ? 'dismissing' : ''}`}
      onClick={() => setIsDismissing(true)}
    >
      <p>New message received!</p>
    </div>
  );
};
```

```css
.notification {
  animation: bounce-in 600ms var(--sys-motion-easing-expressive-bounce) both;
}

.notification.dismissing {
  animation: bounce-out 400ms var(--sys-motion-easing-expressive-spring) both;
}

@keyframes bounce-in {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes bounce-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
}
```

**Card Hover (Magnetic Effect):**
```css
.card-magnetic {
  transition:
    transform 300ms var(--sys-motion-easing-expressive),
    box-shadow 300ms var(--sys-motion-easing-expressive);
}

.card-magnetic:hover {
  transform: translateY(-8px) rotate(-1deg); /* Slight tilt for personality */
  box-shadow: var(--sys-elevation-level4);
}
```

---

### 5. Accessibility (prefers-reduced-motion)

**Always respect user preferences:**

```css
/* Default: Full animations */
.element {
  animation: bounce-in 600ms var(--sys-motion-easing-expressive-bounce);
}

/* Reduced motion: Instant or subtle fade */
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: fade-in 200ms ease; /* Simple fade instead of bounce */
  }
}

/* No motion: Instant display */
@media (prefers-reduced-motion: reduce) {
  .skip-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**React Hook for Motion Preference:**
```tsx
import { useEffect, useState } from 'react';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Usage
const MyComponent = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={reducedMotion ? 'no-animation' : 'animate-bounce'}
    >
      Content
    </div>
  );
};
```

---

## Choreography Patterns

### Pattern 1: List Items (Cascade In)

```tsx
const FeatureList = ({ features }) => (
  <ul className="feature-list">
    {features.map((feature, index) => (
      <li
        key={feature.id}
        className="feature-item choreograph-cascade"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {feature.title}
      </li>
    ))}
  </ul>
);
```

```css
@keyframes cascade {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.choreograph-cascade {
  animation: cascade 400ms var(--sys-motion-easing-emphasized-decelerate) both;
}
```

### Pattern 2: Hero Section (Layered Reveals)

```tsx
const Hero = () => (
  <section className="hero">
    {/* Layer 1: Background fades in (0ms) */}
    <div
      className="hero-background choreograph-fade"
      style={{ animationDelay: '0ms' }}
    />

    {/* Layer 2: Heading slides up (200ms) */}
    <h1
      className="hero-heading choreograph-slide-up"
      style={{ animationDelay: '200ms' }}
    >
      Welcome to CareerCopilot
    </h1>

    {/* Layer 3: Subheading fades in (400ms) */}
    <p
      className="hero-subheading choreograph-fade"
      style={{ animationDelay: '400ms' }}
    >
      Your AI-powered career assistant
    </p>

    {/* Layer 4: CTA button bounces in (600ms) */}
    <button
      className="hero-cta choreograph-bounce"
      style={{ animationDelay: '600ms' }}
    >
      Get Started
    </button>
  </section>
);
```

### Pattern 3: Modal/Dialog (Spring Open)

```css
@keyframes modal-open {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-enter {
  animation: modal-open 400ms var(--sys-motion-easing-expressive-spring) both;
}

/* Backdrop fades in separately */
@keyframes backdrop-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-backdrop {
  animation: backdrop-fade 300ms ease both;
}
```

### Pattern 4: Tab Switching (Slide Transition)

```tsx
const TabPanel = ({ activeTab, children }) => (
  <div
    className={`tab-panel tab-panel-${activeTab}`}
    key={activeTab} // Re-trigger animation on tab change
  >
    {children}
  </div>
);
```

```css
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tab-panel {
  animation: slide-in-right 300ms var(--sys-motion-easing-emphasized-decelerate) both;
}
```

---

## Motion Token Schema

```json
{
  "motion": {
    "choreography": {
      "stagger": {
        "base": "100ms",
        "fast": "60ms",
        "slow": "150ms",
        "maxTotal": "800ms"
      },
      "pageLoad": {
        "header": "0ms",
        "hero": "100ms",
        "content": "200ms",
        "footer": "800ms"
      }
    },
    "springPhysics": {
      "subtle": {
        "easing": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "overshoot": "12.75%",
        "duration": "400ms"
      },
      "bouncy": {
        "easing": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "overshoot": "55%",
        "duration": "500ms"
      }
    },
    "interactions": {
      "buttonPress": {
        "hover": {
          "transform": "translateY(-2px) scale(1.02)",
          "duration": "200ms",
          "easing": "var(--sys-motion-easing-expressive-spring)"
        },
        "active": {
          "transform": "translateY(0) scale(0.98)",
          "duration": "100ms"
        }
      },
      "cardHover": {
        "transform": "translateY(-8px) rotate(-1deg)",
        "duration": "300ms",
        "easing": "var(--sys-motion-easing-expressive)"
      }
    },
    "accessibility": {
      "respectPrefersReducedMotion": true,
      "fallbackDuration": "200ms",
      "fallbackEasing": "ease"
    }
  }
}
```

---

## Usage

**Standalone Skill:**
```bash
# Apply spring motion choreography to component
m3-spring-motion-choreography \
  --file frontend/src/pages/Dashboard.tsx \
  --choreography "page-load-staggered" \
  --physics "bouncy"
```

**Within M3 Migration Architect (Step 8):**
```javascript
const motionChoreographed = await runSkill('m3-spring-motion-choreography', {
  code: elevationRefactoredCode,
  motionPattern: 'spring-physics',
  choreographyType: 'staggered-cascade'
});
```

---

## Validation Checklist

- [ ] Spring physics easing (not linear/ease-in-out) for key interactions
- [ ] Page load uses staggered reveals with animation-delay
- [ ] animation-delay increments reasonable (60-150ms, max 800ms total)
- [ ] `prefers-reduced-motion` media query included for all animations
- [ ] High-impact moments (page load, modal open) use spring/bounce easing
- [ ] Scattered micro-interactions minimized (focus on orchestrated sequences)
- [ ] `animation-fill-mode: both` applied to prevent FOUC (flash of unstyled content)
- [ ] Transform/opacity used (GPU-accelerated) instead of layout properties

---

**Created:** 2025-01-18
**Version:** 1.0.0
**Status:** Production Ready
**Aligned with:** M3 Expressive Motion Principles (spring physics, choreographed, alive, playful)
