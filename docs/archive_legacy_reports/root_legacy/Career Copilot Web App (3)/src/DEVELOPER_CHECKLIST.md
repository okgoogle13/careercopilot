# ✅ Developer Checklist - Global Refactor

Use this checklist when working with the refactored codebase.

---

## 🚀 Getting Started

### First Time Setup

- [ ] Read `/README_REFACTOR.md` for overview
- [ ] Review `/COMPONENT_API.md` for component props
- [ ] Study `/components/Analysis.tsx` as a reference implementation
- [ ] Review `/MIGRATION_GUIDE.md` for patterns

---

## 📦 When Creating a New Page

### 1. Import Shared Components

```tsx
import { PageHeader, MetricCard, StatCard, ChartPane } from "./shared";
```

- [ ] Import components from `/components/shared/` directory
- [ ] Use barrel export (`from './shared'`) for convenience
- [ ] Don't recreate components - always use shared versions

### 2. Use PageHeader for Consistency

```tsx
<PageHeader title="My Page Title" highlightedWord="Title" description="Page description" />
```

- [ ] Every page should start with `<PageHeader>`
- [ ] Use `highlightedWord` to make one word italic purple
- [ ] Keep descriptions concise (1-2 sentences)

### 3. Layout with Responsive Grids

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Cards go here */}</div>
```

- [ ] Use responsive grid classes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- [ ] Apply consistent gap spacing (`gap-6` for most layouts)
- [ ] Ensure mobile-first approach (start with `grid-cols-1`)

---

## 🎨 Styling Rules

### ❌ NEVER DO THIS

```tsx
// DON'T: Inline styles for font/color/spacing
<h1 style={{
  fontSize: '4.5rem',
  fontWeight: '800',
  color: '#E6E1E5'
}}>
```

### ✅ ALWAYS DO THIS

```tsx
// DO: Use Tailwind utility classes
<h1 className="text-[4.5rem] font-[800] text-[#E6E1E5] uppercase tracking-tight">
```

**Checklist:**

- [ ] No `style={{}}` props (except for complex CSS masks)
- [ ] Use Tailwind utility classes or design tokens
- [ ] Use arbitrary values for custom sizes: `text-[4.5rem]`
- [ ] Use standard classes when available: `uppercase`, `font-mono`

---

## 🧩 Component Usage

### MetricCard

```tsx
<MetricCard icon={Award} label="App ATS Score" value="87%" iconColor="text-[#D0BCFF]" variant="outlined" />
```

**Checklist:**

- [ ] Icon is from `lucide-react`
- [ ] Label is uppercase-friendly (component handles it)
- [ ] Value can be string or number
- [ ] IconColor uses Tailwind color class
- [ ] Variant is either `outlined` or `filled`

### StatCard

```tsx
<StatCard icon={FileText} value="8" label="Active Applications" iconColor="text-[#D0BCFF]" />
```

**Checklist:**

- [ ] Used in 3-column grids for dashboard stats
- [ ] Value is large and prominent (text-7xl)
- [ ] Label is descriptive and concise
- [ ] Includes bio-glass hover effect automatically

### ChartPane

```tsx
<ChartPane title="Chart Title">
  <ResponsiveContainer width="100%" height={280}>
    {/* Chart component */}
  </ResponsiveContainer>
</ChartPane>
```

**Checklist:**

- [ ] Wraps all Recharts components
- [ ] Provides consistent dotted grid background
- [ ] Title describes the chart data
- [ ] ResponsiveContainer always uses `width="100%"`

### ApplicationCard

```tsx
<ApplicationCard title={app.title} company={app.company} location={app.location} appliedDate={app.appliedDate} currentStep={app.currentStep} steps={app.steps} onUpdateStatus={() => {}} />
```

**Checklist:**

- [ ] All required props provided
- [ ] `currentStep` is 0-indexed
- [ ] `steps` array matches your workflow
- [ ] `onUpdateStatus` callback handles state updates

---

## 🎯 Button Standards

### Glass Button (Secondary Actions)

```tsx
<button className="bg-black/50 backdrop-blur-[10px] border border-white/5 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] py-4 px-8 rounded-full hover:bg-black/60 transition-all">View Analytics</button>
```

**Checklist:**

- [ ] Uses `bg-black/50` with backdrop blur
- [ ] Includes subtle inset shadow
- [ ] Rounded full (`rounded-full`)
- [ ] Hover state defined

### M3 Filled Tonal (Primary Actions)

```tsx
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[var(--surface-container-high)] text-[var(--primary-sage)] py-4 px-8 rounded-full hover:bg-[var(--surface-bright)] transition-colors">
  CONNECT
</motion.button>
```

**Checklist:**

- [ ] Uses design tokens (`var(--surface-container-high)`)
- [ ] Simple scale animation only
- [ ] Text is uppercase and bold
- [ ] No gradients or inner shadows

### Outlined Button (Tertiary Actions)

```tsx
<button className="bg-transparent border-2 border-[#CAC4D0]/30 py-4 px-8 rounded-full hover:border-[#D0BCFF]/50 transition-all">+ Add New</button>
```

**Checklist:**

- [ ] Transparent background
- [ ] Dashed or solid border
- [ ] Hover changes border color
- [ ] Used for add/create actions

---

## 🎨 Design Token Usage

### Surface System

```tsx
bg-[var(--surface-container-low)]     // Sidebar
bg-[var(--surface-container)]         // Cards
bg-[var(--surface-container-high)]    // Buttons, modals
bg-[var(--surface-bright)]            // Hover states
```

**Checklist:**

- [ ] Use `var(--token-name)` syntax
- [ ] Don't hardcode surface colors
- [ ] Follow elevation hierarchy

### Color Palette

```tsx
text-[var(--primary-sage)]            // #8A9A5B - Success, active
text-[var(--action-terracotta)]       // #E2725B - CTAs, warnings
text-[var(--on-surface)]              // #E3E3E3 - Primary text
text-[var(--on-surface-variant)]      // #C4C7C5 - Secondary text
```

**Checklist:**

- [ ] Use semantic color names
- [ ] Follow contrast requirements
- [ ] Consistent icon colors

---

## 📐 Typography System

### TIER 1 & 2: HERO (The "Wide" Voice)

```tsx
className = "text-[4.5rem] leading-[1.1] font-[800] uppercase tracking-tight";
```

**Usage:**

- [ ] Page titles
- [ ] Hero headings
- [ ] Always uppercase
- [ ] Extra bold (800 weight)

### TIER 3: HUMAN (The "Reading" Voice)

```tsx
className = "text-base font-medium";
```

**Usage:**

- [ ] Body copy
- [ ] Descriptions
- [ ] User-facing content
- [ ] Mixed case

### TIER 4: DATA & AI (The "Glitch" Voice)

```tsx
className = "text-xs uppercase tracking-widest font-mono";
```

**Usage:**

- [ ] Metric labels
- [ ] Data points
- [ ] Timestamps
- [ ] Technical info

---

## 📱 Responsive Design

### Mobile First Approach

```tsx
// Start mobile, add breakpoints up
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Checklist:**

- [ ] Default classes are for mobile (< 768px)
- [ ] Add `md:` prefix for tablet (768px+)
- [ ] Add `lg:` prefix for desktop (1024px+)
- [ ] Test at all breakpoints

### Breakpoint Reference

| Prefix | Min Width | Device        |
| ------ | --------- | ------------- |
| (none) | 0px       | Mobile        |
| `md:`  | 768px     | Tablet        |
| `lg:`  | 1024px    | Desktop       |
| `xl:`  | 1280px    | Large Desktop |

---

## 🧪 Testing Checklist

### Before Committing

- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors in browser
- [ ] Tested at mobile (375px)
- [ ] Tested at tablet (768px)
- [ ] Tested at desktop (1024px)
- [ ] All links/buttons functional
- [ ] Sidebar responsive behavior works
- [ ] No inline styles (except masks)
- [ ] All imports resolve correctly

### Code Quality

- [ ] Components imported from `/shared` when applicable
- [ ] No duplicate code patterns
- [ ] Consistent naming conventions
- [ ] Props properly typed with TypeScript
- [ ] className prop supported for extension

---

## 🔍 Code Review Checklist

When reviewing code, ensure:

### Layout

- [ ] No fixed positioning or hardcoded margins for main layout
- [ ] Uses flex or grid for responsive layouts
- [ ] Sidebar remains responsive flex child

### Styling

- [ ] Maximum 4 inline styles (only for CSS masks)
- [ ] All typography uses Tailwind classes
- [ ] Design tokens used for colors/surfaces
- [ ] Consistent spacing (gap-6, p-8, mb-8)

### Components

- [ ] Repeated patterns use shared components
- [ ] No copy-pasted card structures
- [ ] All components accept className prop
- [ ] Props are properly typed

### Buttons

- [ ] No glossy gradients or complex shadows
- [ ] Follows M3 flat/tonal standards
- [ ] Simple animations only (scale/color transitions)
- [ ] Proper semantic variants (primary/secondary/tertiary)

---

## 📚 Quick Reference

### Common Patterns

**Page Structure:**

```tsx
<div className="p-6 md:p-12 max-w-7xl">
  <PageHeader title="..." highlightedWord="..." description="..." />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <MetricCard ... />
    <MetricCard ... />
    <MetricCard ... />
  </div>

  <ChartPane title="...">
    {/* Chart */}
  </ChartPane>
</div>
```

**Import Statement:**

```tsx
import { PageHeader, MetricCard, StatCard, ChartPane, KeywordTag, ApplicationCard } from "./shared";
```

**Grid Layouts:**

```tsx
// 3 columns on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 2 columns on desktop, 1 on mobile
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

---

## 🎓 Learning Resources

1. **Component API** - `/COMPONENT_API.md`
   - Complete prop reference for all components
2. **Migration Guide** - `/MIGRATION_GUIDE.md`
   - Before/after patterns
   - Step-by-step refactor process
3. **Reference Implementation** - `/components/Analysis.tsx`
   - Real-world usage of all components
   - Best practices demonstrated

4. **Global Refactor Report** - `/GLOBAL_REFACTOR_COMPLETE.md`
   - Detailed technical documentation
   - Metrics and results

---

## ✅ Final Checklist

Before marking your work complete:

- [ ] All components from `/shared` used appropriately
- [ ] No inline styles (except complex CSS masks)
- [ ] Responsive at all breakpoints (mobile/tablet/desktop)
- [ ] Sidebar responsive behavior preserved
- [ ] TypeScript types all pass
- [ ] No console errors
- [ ] Code follows Guidelines.md rules
- [ ] Design tokens used consistently
- [ ] Typography system followed (TIER 1/2/3/4)
- [ ] Buttons follow M3 standards
- [ ] Documentation updated if needed

---

**Last Updated:** December 2025  
**Version:** 1.0.0
