# Electric Alchemist v5.0 - Complete Design System Specification
## Material Design 3 Expressive Implementation

**Status:** Production Implementation  
**Version:** 5.0  
**Framework:** Tailwind CSS + M3 Design Tokens  
**Last Updated:** December 25, 2025

---

## 🎨 **Design Philosophy**

Electric Alchemist is a **premium, expressive design system** that combines:
- Material Design 3 foundations
- Biomimetic shape language
- Electric violet + sage green color harmony
- Spring-based motion choreography
- Anti-slop validation framework

**Core Principle:** Every visual element must serve both **function** and **delight**.

---

## 🔷 **The 4 Shape Archetypes**

### **1. The Leaf** (`rounded-leaf`)
```css
border-radius: 24px 64px 24px 8px;
```
**Purpose:** Signature shape, hero elements, content cards  
**Psychology:** [DEPRECATED_STYLE] growth, premium feel  
**Usage:** Landing page hero, major feature cards, analysis sections

**Examples:**
- Analysis trigger card
- KSC Generator main container
- Document cards on hover

---

### **2. The Pebble** (`rounded-pebble`)
```css
border-radius: 16px;
```
**Purpose:** Interactive elements, buttons, tags  
**Psychology:** Approachable, tactile, friendly  
**Usage:** Primary/secondary buttons, badges, chips

**Examples:**
- "Analyze with AI" button
- "Export PDF" button
- Keyword tags
- Type badges (NUMBER, PERCENTAGE, etc.)

---

### **3. The Tech-Edge** (`rounded-tech`)
```css
border-radius: 12px;
```
**Purpose:** Inputs, data containers, technical elements  
**Psychology:** Precision, digital, modern  
**Usage:** Text inputs, code blocks, impact enhancements

**Examples:**
- Resume/JD textarea inputs
- Impact enhancement cards
- Quantifier suggestions containers

---

### **4. The Gem** (`rounded-gem`)
```css
border-radius: 40px 8px 40px 8px;
```
**Purpose:** Unique, attention-worthy elements (deprecated in favor of Leaf)  
**Psychology:** Precious, rare, special  
**Usage:** Reserved for truly unique UI moments

**Note:** In v5.0, "The Leaf" has become the primary signature shape.

---

## 🎨 **Color System - The Electric Palette**

### **Primary Colors (Electric Violet)**
```css
--primary: #D0BCFF;           /* primary-80 - Default */
--primary-container: #4F378B;  /* primary-30 */
--on-primary: #381E72;        /* primary-20 */
--on-primary-container: #EADDFF; /* primary-90 */
```

**Semantic Use:**
- Hero highlighting (highest quadrant score)
- Primary action buttons
- Focus states
- Premium indicators

---

### **Secondary Colors (Sage Green)**
```css
--secondary: #8A9A5B;         /* Custom sage green */
--secondary-container: #C8E6C9;
--on-secondary: #1A1C18;
--on-secondary-container: #0E4C00;
```

**Semantic Use:**
- Success states
- Impact enhancement suggestions
- Growth/improvement indicators
- Secondary actions

---

### **Tertiary Colors (Electric Pink)**
```css
--tertiary: #FFB4AB;          /* error-80 */
--tertiary-container: #FF6F00;
--on-tertiary: #690005;
--on-tertiary-container: #FFDAD6;
```

**Semantic Use:**
- Contextual highlights
- "Why this works" callouts
- Accent elements
- Tertiary buttons

---

### **Surface Colors (Dark Theme)**
```css
--surface: #1C1B1F;                    /* surface-container */
--surface-dim: #1A1714;                /* surface-dim */
--surface-container-low: #1C1B1F;
--surface-container: #211F26;
--surface-container-high: #2B2930;
--surface-container-highest: #36343B;
```

**Semantic Use:**
- Background layers
- Card surfaces
- Depth hierarchy
- Elevated components

---

### **Neutral/Outline**
```css
--outline: #938F99;           /* neutral-variant-60 */
--outline-variant: #49454F;   /* neutral-variant-30 */
--on-surface: #E6E1E5;        /* neutral-90 */
--on-surface-variant: #CAC4D0; /* neutral-variant-80 */
```

---

## 📏 **Typography System**

### **Font Families**
```css
/* Display & Headings */
font-family: 'Roboto Flex', sans-serif;

/* Body Text */
font-family: 'Roboto', sans-serif;

/* Accent/Serif */
font-family: 'Roboto Serif', serif;

/* Monospace (timestamps, data) */
font-family: 'Roboto Mono', monospace;
```

---

### **Type Scale (M3 Tokens)**

#### **Display**
```css
.text-display-large {
  font-size: 57px;
  line-height: 64px;
  font-weight: 400;
  font-family: 'Roboto Flex', sans-serif;
}

.text-display-medium {
  font-size: 45px;
  line-height: 52px;
}

.text-display-small {
  font-size: 36px;
  line-height: 44px;
}
```

#### **Headlines**
```css
.text-headline-large {
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
}

.text-headline-medium {
  font-size: 28px;
  line-height: 36px;
}

.text-headline-small {
  font-size: 24px;
  line-height: 32px;
}
```

#### **Title**
```css
.text-title-large {
  font-size: 22px;
  line-height: 28px;
  font-weight: 400;
}

.text-title-medium {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.text-title-small {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
```

#### **Body**
```css
.text-body-large {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.text-body-medium {
  font-size: 14px;
  line-height: 20px;
}

.text-body-small {
  font-size: 12px;
  line-height: 16px;
}
```

#### **Label**
```css
.text-label-large {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.text-label-medium {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}

.text-label-small {
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
}
```

---

## 🎭 **Motion System - Spring Choreography**

### **Duration Tokens**
```css
--duration-short-1: 50ms;     /* Micro-interactions */
--duration-short-2: 100ms;    /* Hover states */
--duration-short-3: 150ms;    /* Button presses */
--duration-short-4: 200ms;    /* Small reveals */
--duration-medium-1: 250ms;   /* Panel slides */
--duration-medium-2: 300ms;   /* Page transitions */
--duration-medium-3: 350ms;   /* Complex animations */
--duration-medium-4: 400ms;   /* Heavy content */
--duration-long-1: 450ms;     /* Full page load */
--duration-long-2: 500ms;     /* Elaborate reveals */
```

### **Easing Functions**
```css
/* Spring-based (primary) */
--ease-spring: cubic-bezier(0.36, 0.66, 0.04, 1);

/* Standard M3 */
--ease-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
--ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1.0);
```

### **Animation Classes**
```css
.animate-in {
  animation: fadeIn var(--duration-medium-2) var(--ease-spring);
}

.fade-in {
  animation: fadeIn var(--duration-medium-1) var(--ease-standard);
}

.slide-in-from-right-8 {
  animation: slideInFromRight var(--duration-medium-2) var(--ease-spring);
}

.zoom-in-95 {
  animation: zoomIn var(--duration-medium-2) var(--ease-spring);
}
```

---

## 🌟 **Elevation & Shadow System**

```css
.shadow-elevation-1 {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
              0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}

.shadow-elevation-2 {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
              0px 2px 6px 2px rgba(0, 0, 0, 0.15);
}

.shadow-elevation-3 {
  box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15),
              0px 1px 3px rgba(0, 0, 0, 0.3);
}
```

**Usage:**
- Level 1: Cards, buttons
- Level 2: Floating elements, tooltips
- Level 3: Modals, dropdowns

---

## 🎯 **Component Patterns**

### **Metric Cards**
```tsx
<MetricCard
  icon={Award}
  label="Hard Skills Match"
  value="85%"
  iconColor="text-primary"
  variant="outlined" // or "filled"
/>
```

**Variants:**
- `outlined` - Default state
- `filled` - Hero state (highest score)

**Hero Highlighting:**
- Background: `bg-primary-container`
- Text: `text-on-primary-container`
- Icon: Electric Violet (#D0BCFF)

---

### **Impact Enhancements**
```tsx
<ImpactEnhancements suggestions={quantifiers} />
```

**Visual Structure:**
1. Original text (strikethrough, muted)
2. Arrow indicator
3. Enhanced text (Sage Green)
4. Contextual "Why" (tertiary container)
5. Type badge

---

### **Toast Notifications**
```tsx
<Toaster 
  position="top-right"
  theme="dark"
  richColors
  expand
/>

toast.promise(asyncFunction(), {
  loading: 'Applying APS ILS Standards...',
  success: 'Generated successfully!',
  error: 'Failed. Please try again.'
});
```

---

## 🛡️ **Anti-Slop Validation Framework**

### **Banned Patterns:**
❌ `rounded-full` on non-circular elements  
❌ Hardcoded hex colors (`#FFFFFF`, etc.)  
❌ Inline `style={{...}}` objects  
❌ Generic class names (`card`, `button`)  
❌ `figma:asset` placeholders  

### **Required Patterns:**
✅ M3 shape tokens (`rounded-leaf`, `rounded-pebble`, `rounded-tech`)  
✅ Semantic color tokens (`text-primary`, `bg-surface-container`)  
✅ M3 typography tokens (`text-title-large`, `text-body-medium`)  
✅ Spring easing (`ease-spring`)  
✅ M3 elevation (`shadow-elevation-1`)  

---

## 🎨 **Visual Noise & Texture**

### **CSS-Only Grain Filter (Chromebook-Safe)**
```css
.noise-filter {
  background-image: url('../assets/images/texture-pattern.png');
  background-repeat: repeat;
  mix-blend-mode: overlay;
  opacity: 0.3;
}
```

**Performance Note:** No `filter: noise()` - uses static texture for Chromebook compatibility.

---

## 📐 **Spacing System**

```css
/* M3 Spacing Scale */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

**Usage in Tailwind:**
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `p-6` = 24px padding
- `mb-8` = 32px margin-bottom

---

## 🎯 **Accessibility Standards**

- **WCAG 2.1 AA** compliance minimum
- **4.5:1** contrast ratio for body text
- **3:1** for large text and UI components
- Keyboard navigation support
- Screen reader optimization
- Focus indicators on all interactive elements

---

## 📱 **Responsive Breakpoints**

```css
/* Tailwind defaults */
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large desktops
```

**Mobile-First Approach:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

---

## ✅ **Design Review Checklist**

Before committing any UI component:

- [ ] Uses M3 shape token (no generic `rounded-*`)
- [ ] Uses semantic color tokens (no hardcoded hex)
- [ ] Uses M3 typography scale
- [ ] Applies spring easing to animations
- [ ] Maintains 4.5:1 contrast ratio minimum
- [ ] Supports keyboard navigation
- [ ] Responsive on mobile, tablet, desktop
- [ ] No inline styles
- [ ] Performance optimized (CSS-only effects)
- [ ] Passes Anti-Slop validation

---

## 🎓 **Design System Resources**

**Internal:**
- `/frontend/src/index.css` - Token definitions
- `/frontend/src/features/style-guide/StyleGuide.tsx` - Live examples
- `/docs/ELECTRIC_ALCHEMIST_V5.md` - This document

**External:**
- [Material Design 3](https://m3.material.io/)
- [M3 Color System](https://m3.material.io/styles/color/system/overview)
- [M3 Typography](https://m3.material.io/styles/typography/overview)
- [M3 Motion](https://m3.material.io/styles/motion/overview)

---

## 🚀 **Implementation Examples**

### **Button Component**
```tsx
<button className="
  bg-primary-container 
  text-on-primary-container 
  hover:bg-primary 
  hover:text-on-primary 
  rounded-pebble 
  px-8 
  h-12 
  font-bold 
  text-label-large
  transition-all 
  duration-short-2 
  ease-spring
  shadow-elevation-1
">
  Primary Action
</button>
```

### **Card Component**
```tsx
<div className="
  bg-surface-container-low 
  border 
  border-outline-variant 
  rounded-leaf 
  p-6 
  hover:bg-surface-container 
  hover:border-primary 
  hover:scale-[1.02] 
  hover:shadow-elevation-2 
  transition-all 
  duration-medium-1 
  ease-spring
">
  Card content
</div>
```

---

**Maintained by:** Antigravity AI Assistant  
**Design Lead:** Material Design 3 Guidelines  
**Version:** Electric Alchemist v5.0  
**Status:** Production-Ready ✅
