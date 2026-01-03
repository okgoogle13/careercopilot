# M3 Design System - Quick Reference

**Last Updated**: 2026-01-03  
**Overall Compliance**: 74%

---

## 📊 Compliance Dashboard

```
╔══════════════════════════════════════════════════════════════╗
║                   M3 COMPLIANCE SCORECARD                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Shape System:       ████████████████░░░░░░   71%           ║
║  Color System:       ████████████████████░░   86% ⭐ BEST   ║
║  Elevation:          ██████████░░░░░░░░░░░░   50% ⚠️        ║
║  Motion:             ███████████████░░░░░░░   75%           ║
║  Typography:         ████████████████░░░░░░   80%           ║
║                                                              ║
║  OVERALL:            ███████████████░░░░░░░   74%           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## ✅ Component Status Matrix

| Component | Shape | Color | Elevation | Motion | Typography | Status |
|-----------|-------|-------|-----------|--------|------------|---------|
| **ApplicationCard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **100%** |
| **KeywordTag** | ✅ | ✅ | N/A | N/A | ✅ | ✅ **100%** |
| **MetricCard** | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ **95%** |
| **StatCard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **95%** |
| **PageHeader** | N/A | ✅ | N/A | N/A | ✅ | ✅ **100%** |
| **StatusBadge** | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ **85%** |
| **StatusChip** | ❌ | ✅ | ❌ | ❌ | ⚠️ | ⚠️ **85%** |
| **JobQueue** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ **40%** |

**Legend**:
- ✅ Fully compliant
- ⚠️ Partial compliance  
- ❌ Non-compliant
- N/A Not applicable

---

## 🎨 M3 Electric Alchemist Tokens

### Color Palette
```css
Primary (Indigo):    #6200EA → #D1C4E9   Electric, Digital, Magic
Secondary (Teal):    #03DAC6 → #C7FFF4   Energy, Zap
Tertiary (Pink):     #F50057 → #FFD9E8   Accent, Spark
Error (Red):         #B32 61E → #F2B8B5   [NEW] Critical alerts
Warning (Amber):     #F59E0B → #FEF3C7   [NEW] Caution states
Surface (Void):      #121212 → #E6E1E5   Atmospheric base
```

### Shape Tokens (Organic Contradiction)
```css
.rounded-pebble   →  20px 20px 32px 32px   (Friendly organic)
.rounded-tech     →  24px  4px 24px 20px   (Precision)
.rounded-leaf     →  32px 12px 32px 12px   (Growth motif)
.rounded-gem      →  40px  8px 40px  8px   (Highlight)
.rounded-flow-l   →  32px 12px 12px 12px   (Motion left)
.rounded-flow-r   →  12px 32px 12px 12px   (Motion right)
```

### Elevation Levels
```css
.shadow-elevation-1   →  Resting state (subtle depth)
.shadow-elevation-2   →  Hover state (raised)
.shadow-elevation-3   →  Active state (emphasized)
.shadow-elevation-4   →  Dialog/Modal (prominent)
.shadow-elevation-5   →  Maximum depth
```

### Motion Tokens
```css
.duration-short-1     →  50ms
.duration-short-2     →  100ms
.duration-medium-1    →  250ms  (Most common)
.duration-medium-2    →  400ms
.duration-long-1      →  500ms

.ease-spring          →  cubic-bezier(0.175, 0.885, 0.32, 1.275)
.ease-bounce          →  cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Typography Scale
```css
.text-display-large   →  57px / 64lh    (Hero)
.text-display-medium  →  45px / 52lh
.text-display-small   →  36px / 44lh
.text-headline-large  →  32px / 40lh    (Page titles)
.text-title-large     →  22px / 28lh    (Card titles)
.text-body-large      →  16px / 24lh    (Body text)
.text-label-medium    →  12px / 16lh    (Buttons, labels)
```

---

## 🔧 Quick Fix Cheat Sheet

### ❌ DON'T:
```tsx
// Hard-coded colors
<div style={{ backgroundColor: '#6200EA' }}>

// Generic radius
<div className="rounded-xl">

// MUI defaults without theming
<Card /> <Button variant="contained" />

// Ad-hoc spacing
<div style={{ padding: '32px' }}>
```

### ✅ DO:
```tsx
// Semantic color tokens
<div className="bg-primary-container text-on-primary-container">

// M3 organic shapes
<div className="rounded-pebble">

// Custom M3 components
<M3Card /> <M3Button variant="filled" />

// M3 spacing tokens
<div className="p-space-xl">
```

---

## 🚀 Quick Win Fixes (< 30 min each)

1. **Replace hard-coded colors** → Search for `#[0-9a-f]{6}` in components
2. **Add elevation to cards** → Add `shadow-elevation-1 hover:shadow-elevation-2`
3. **Fix symmetric radii** → Replace `rounded-xl` with `rounded-pebble`
4. **Use M3 motion** → Add `transition-all duration-medium-1 ease-spring`
5. **Apply typography scale** → Use `text-headline-large` instead of custom sizes

---

## 📋 Week 1 Priorities (Next Session)

**Goal**: Boost compliance from 74% → 85%

### High Impact, Low Effort:
1. ✅ ~~Fix StatusChip colors~~ **DONE**
2. Configure MUI theme (2 hours) → **+15% compliance**
3. Create M3Card component (30 min) → **+5% compliance**
4. Create M3Button component (1 hour) → **+5% compliance**

### Medium Impact, Medium Effort:
5. Refactor JobQueue (2-3 hours) → **+10% compliance**

**Expected Result**: 85-90% overall compliance by end of week

---

## 📚 Documentation Structure

```
docs/
├── M3_FRONTEND_AUDIT.md              ⭐ Master audit document
├── M3_APPLICATIONCARD_AUDIT.md       ✅ Complete (100%)
├── M3_AUDIT_SESSION_2026-01-03.md    📝 Today's work
└── WIREFRAME_SUMMARY.md              📖 Design documentation

frontend/src/theme/
├── design-tokens.css                 🎨 All M3 tokens (error/warning added)
└── mui-theme.ts                      🔜 TO CREATE (Week 1)

frontend/src/components/
├── shared/
│   ├── ApplicationCard.tsx           ✅ 100% M3 compliant
│   ├── KeywordTag.tsx                ✅ 100% M3 compliant
│   ├── MetricCard.tsx                ✅ 95% M3 compliant
│   ├── StatCard.tsx                  ✅ 95% M3 compliant
│   ├── StatusChip.tsx                ✅ 85% M3 compliant (colors fixed)
│   └── PageHeader.tsx                ✅ 100% M3 compliant
└── ui/
    ├── StatusBadge/                  ⚠️ 85% M3 compliant (MUI)
    ├── M3Card.tsx                    🔜 TO CREATE
    └── M3Button.tsx                  🔜 TO CREATE
```

---

## 🎯 Success Criteria

- [x] ApplicationCard 100% compliant
- [x] Complete frontend audit documented
- [x] Error/warning color tokens added
- [x] StatusChip hard-coded colors fixed
- [ ] MUI theme configured
- [ ] M3Card component created
- [ ] M3Button component created
- [ ] JobQueue refactored
- [ ] 90%+ overall compliance

**Current Progress**: 4/9 (44%)  
**Target Date**: 2026-01-10

---

**Quick Links**:
- [Full Audit Report](./M3_FRONTEND_AUDIT.md)
- [ApplicationCard Audit](./M3_APPLICATIONCARD_AUDIT.md)
- [Session Summary](./M3_AUDIT_SESSION_2026-01-03.md)
- [Design Tokens](../frontend/src/theme/design-tokens.css)
