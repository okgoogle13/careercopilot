# 📘 Component API Reference

Quick reference for all shared components in `/components/shared/`

---

## 📦 MetricCard

**Purpose:** Display key performance metrics with icon, label, and value

**Import:**

```tsx
import { MetricCard } from "./shared/MetricCard";
```

**Props:**

```typescript
interface MetricCardProps {
  icon: LucideIcon; // Icon component from lucide-react
  label: string; // Metric label (e.g., "App ATS Score")
  value: string | number; // Metric value (e.g., "87%", 90)
  iconColor?: string; // Tailwind color class (default: "text-[#D0BCFF]")
  variant?: "outlined" | "filled"; // Card style (default: "outlined")
  className?: string; // Additional Tailwind classes
}
```

**Example:**

```tsx
<MetricCard icon={Award} label="App ATS Score" value="87%" iconColor="text-[#D0BCFF]" variant="outlined" />
```

**Visual:**

```
┌─────────────────────────┐
│ [Icon] LABEL           │  ← Icon + Label in mono font
│                        │
│ 87%                    │  ← Large value (text-5xl)
└─────────────────────────┘
```

---

## 📊 StatCard

**Purpose:** Display animated statistics with bio-glass effect

**Import:**

```tsx
import { StatCard } from "./shared/StatCard";
```

**Props:**

```typescript
interface StatCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  value: string | number; // Stat value (e.g., "8", "45")
  label: string; // Stat label (e.g., "Active Applications")
  iconColor?: string; // Tailwind color class (default: "text-[#D0BCFF]")
  className?: string; // Additional Tailwind classes
}
```

**Example:**

```tsx
<StatCard icon={FileText} value="8" label="Active Applications" iconColor="text-[#D0BCFF]" />
```

**Features:**

- ✨ Hover animation (lifts up on hover)
- 🎨 Noise texture overlay
- 💎 Bio-glass shadow effects

**Visual:**

```
┌─────────────────────────┐
│                        │
│       [Icon]           │  ← Large icon (w-12 h-12)
│                        │
│         8              │  ← Huge value (text-7xl)
│                        │
│  ACTIVE APPLICATIONS   │  ← Uppercase mono label
│                        │
└─────────────────────────┘
```

---

## 🔵 IconBadge

**Purpose:** Circular icon container with customizable size and colors

**Import:**

```tsx
import { IconBadge } from "./shared/IconBadge";
```

**Props:**

```typescript
interface IconBadgeProps {
  icon: LucideIcon;
  color?: string; // Icon color (default: "text-[#D0BCFF]")
  size?: "sm" | "md" | "lg"; // Badge size (default: "md")
  background?: string; // Background color (default: "bg-[#36343B]")
  className?: string;
}
```

**Example:**

```tsx
<IconBadge icon={Award} color="text-[#D0BCFF]" size="md" background="bg-[#36343B]" />
```

**Size Reference:**
| Size | Container | Icon |
|------|-----------|------|
| `sm` | 32×32px | 16×16px |
| `md` | 40×40px | 20×20px |
| `lg` | 48×48px | 24×24px |

---

## 🏷️ KeywordTag

**Purpose:** Styled keyword pills for matched/missing keywords

**Import:**

```tsx
import { KeywordTag } from "./shared/KeywordTag";
```

**Props:**

```typescript
interface KeywordTagProps {
  keyword: string;
  variant?: "matched" | "missing"; // Tag style (default: "matched")
  className?: string;
}
```

**Example:**

```tsx
<KeywordTag keyword="React.js" variant="matched" />
<KeywordTag keyword="Python" variant="missing" />
```

**Variants:**
| Variant | Background | Text Color | Border |
|---------|-----------|-----------|--------|
| `matched` | `bg-[#A8C5A3]/20` | `text-[#A8C5A3]` | `border-[#A8C5A3]/30` |
| `missing` | `bg-[#E07A5F]/10` | `text-[#E07A5F]/60` | `border-[#E07A5F]/20` |

---

## 📄 PageHeader

**Purpose:** Consistent page headers with title and optional description

**Import:**

```tsx
import { PageHeader } from "./shared/PageHeader";
```

**Props:**

```typescript
interface PageHeaderProps {
  title: string; // Main title
  highlightedWord?: string; // Word to highlight in italic purple
  description?: string; // Optional subtitle
  className?: string;
}
```

**Example:**

```tsx
<PageHeader title="Performance Analysis" highlightedWord="Analysis" description="Track your job search performance and get insights" />
```

**Output:**

```
PERFORMANCE Analysis
Track your job search performance and get insights
```

_(Where "Analysis" is italic purple)_

---

## 📈 ChartPane

**Purpose:** Wrapper for charts with dotted grid background

**Import:**

```tsx
import { ChartPane } from "./shared/ChartPane";
```

**Props:**

```typescript
interface ChartPaneProps {
  title: string;
  children: ReactNode; // Chart component goes here
  className?: string;
}
```

**Example:**

```tsx
<ChartPane title="ATS Score Over Time">
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data}>{/* Chart config */}</LineChart>
  </ResponsiveContainer>
</ChartPane>
```

**Features:**

- 🎨 Dotted grid background pattern
- 📦 Rounded corners (28px)
- 🎯 Consistent padding and styling

---

## 📋 ApplicationCard

**Purpose:** Complete application tracking card with stepper

**Import:**

```tsx
import { ApplicationCard } from "./shared/ApplicationCard";
```

**Props:**

```typescript
interface ApplicationCardProps {
  title: string; // Job title
  company: string; // Company name
  location: string; // Job location
  appliedDate: string; // When applied (e.g., "2 days ago")
  currentStep: number; // Current step index (0-based)
  steps: string[]; // Array of step labels
  onUpdateStatus?: () => void; // Optional callback
  className?: string;
}
```

**Example:**

```tsx
<ApplicationCard title="Senior Software Engineer" company="TechCorp" location="San Francisco, CA" appliedDate="2 days ago" currentStep={3} steps={["Applied", "Screening", "Interview", "Offer", "Accepted"]} onUpdateStatus={() => console.log("Update clicked")} />
```

**Stepper Colors:**

- **Current Step:** Purple (`bg-[#D0BCFF]`, `text-[#381E72]`)
- **Completed:** Green (`bg-[#A8C5A3]`, `text-[#141218]`)
- **Pending:** Gray (`bg-[#2B2930]`, `text-[#CAC4D0]`)

---

## 🎨 Color Reference

**Common IconColors:**

```tsx
iconColor = "text-[#D0BCFF]"; // Purple (Primary)
iconColor = "text-[#A8C5A3]"; // Sage Green (Success)
iconColor = "text-[#E07A5F]"; // Terracotta (Warning)
iconColor = "text-[#F4D06F]"; // Yellow (Accent)
```

**Surface Tokens:**

```tsx
bg-[var(--surface-container-low)]    // Sidebar
bg-[var(--surface-container)]        // Cards
bg-[var(--surface-container-high)]   // Buttons
bg-[var(--surface-bright)]           // Hover states
```

---

## 🔗 Barrel Export

All components can be imported from the index:

```tsx
// Single import statement
import { MetricCard, StatCard, IconBadge, KeywordTag, PageHeader, ChartPane, ApplicationCard } from "./shared";
```

---

## 🎯 Best Practices

### 1. Always Use Components for Repeated Patterns

❌ **Don't:**

```tsx
<div className="bg-[#25232A] rounded-[28px] p-8">
  <div className="flex items-center gap-3 mb-3">
    <div className="w-10 h-10 bg-[#36343B] rounded-full flex items-center justify-center">
      <Award className="w-5 h-5 text-[#D0BCFF]" />
    </div>
    <span>Score</span>
  </div>
  <p className="text-5xl">87%</p>
</div>
```

✅ **Do:**

```tsx
<MetricCard icon={Award} label="Score" value="87%" />
```

### 2. Use className for Customization

```tsx
<MetricCard
  icon={Award}
  label="Score"
  value="87%"
  className="border-2 border-[#D0BCFF]" // Add custom border
/>
```

### 3. Leverage TypeScript Autocomplete

Type `<MetricCard ` and press `Ctrl+Space` to see all available props with descriptions.

### 4. Grid Layouts

```tsx
// Responsive grid for cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <MetricCard {...props1} />
  <MetricCard {...props2} />
  <MetricCard {...props3} />
</div>
```

---

**Last Updated:** December 2025
**Version:** 1.0.0
