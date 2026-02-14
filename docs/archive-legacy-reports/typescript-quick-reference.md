# TypeScript Fix Quick Reference

## Current Status

- **Errors**: 62 remaining (from 200+)
- **Build**: ❌ Failing
- **Automated Fixes**: ✅ 70% complete

---

## Quick Start - Run These Commands

### Re-run All Autofixes

```bash
cd /workspaces/careercopilot

# Pass 1-4: Initial fixes
./scripts/autofix-typescript-errors.sh

# Pass 5-7: Additional fixes
./scripts/autofix-remaining-errors.sh

# Pass 8: Critical fixes
./scripts/autofix-critical-errors.sh
```

### Check Progress

```bash
# Count errors
cd frontend && npx tsc --noEmit 2>&1 | grep -c "error TS"

# View errors by file
cd frontend && npx tsc --noEmit 2>&1 | grep "error TS" | cut -d'(' -f1 | sort | uniq -c | sort -rn
```

### Test Build

```bash
yarn build:frontend
```

---

## Error Categories & Quick Fixes

### 1. Dialog Children (5 errors) - 5 min ⚡

**Files**: DocumentPreview.tsx, CareerGrowthHub.tsx, ProfileEditor.tsx

**Fix**: Wrap in fragment

```tsx
<DialogContent>
  <>
    <Box>...</Box>
    <Box>...</Box>
  </>
</DialogContent>
```

---

### 2. Missing 'open' Props (2 errors) - 3 min ⚡

**Files**: InteractiveComponentsSection.tsx, ProfileVariationCard.tsx

**Fix**: Add state

```tsx
const [open, setOpen] = useState(false);
<Dialog open={open} onOpenChange={setOpen}>
```

---

### 3. Storybook Imports (4 errors) - 10 min 📚

**Files**: All \*.stories.tsx files

**Fix**: Check Storybook version

```bash
cd frontend && yarn list @storybook/react
```

**Then use**:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
```

---

### 4. Component Props (6 errors) - 20 min 🔧

**Files**: App.tsx, AnimatedComponents.tsx, AnimatedShowcase.tsx

**Fix**: Align prop interfaces

- TemplateSelector: Add `onSelect` prop
- ResumeBuilder: Add `onComplete` prop
- AnimatedComponents: Refactor to standard component

---

### 5. UI Ref Forwarding (10 errors) - 20 min 🔴

**Files**: alert-dialog.tsx, dropdown-menu.tsx, popover.tsx, tabs.tsx, tooltip.tsx

**Fix**: Use proper MUI ref types

```tsx
const Component = React.forwardRef<React.ElementRef<typeof MUIComponent>, React.ComponentPropsWithoutRef<typeof MUIComponent>>(({ ...props }, ref) => <MUIComponent {...props} />);
```

---

### 6. Button Variants (15 errors) - 10 min 🎨

**Multiple files**

**Decision Tree**:

```
Is Button from '@mui/material'?
├─ Yes → variant="outlined"
└─ No  → variant="outline"
```

---

### 7. Icon fontSize (3 errors) - 5 min ⚡

**Files**: AppLayout.tsx, PageHeader.tsx

**Fix**: Use sx prop

```tsx
// Before: <SettingsIcon fontSize="small" />
// After:  <SettingsIcon sx={{ fontSize: 20 }} />
```

---

### 8. Form Component Props (3 errors) - 5 min ⚡

**File**: FormComponentsSection.tsx

**Fix**: Rename props

```tsx
// onCheckedChange → onChange (Checkbox)
// onValueChange → onChange (RadioGroup, Slider)
```

---

## Execution Plan

### **Option 1: Quick Session (1 hour)**

```
✅ Phase 1: Quick Wins (15 min) → 11 errors fixed
✅ Phase 2: Storybook (10 min) → 4 errors fixed
✅ Phase 3: Component Props (20 min) → 6 errors fixed
⏸️  Phase 4-5: Defer remaining 41 errors
```

**Result**: 41 errors remaining, but build might work with suppressions

---

### **Option 2: Complete Fix (2-3 hours)**

```
✅ Phase 1: Quick Wins (15 min)
✅ Phase 2: Storybook (10 min)
✅ Phase 3: Component Props (20 min)
✅ Phase 4: UI Refs (20 min)
✅ Phase 5: MUI API (15 min)
✅ Phase 6: Verification (5 min)
```

**Result**: 0 errors, clean build ✅

---

### **Option 3: Pragmatic (45 min)**

```
✅ Phase 1: Quick Wins (15 min) → 11 errors fixed
✅ Phase 2: Storybook (10 min) → 4 errors fixed
✅ Phase 5.1-5.4: Critical API fixes (20 min) → ~20 errors fixed
```

**Result**: ~27 errors remaining, potentially buildable with --skipLibCheck

---

## Emergency Build Workaround

### If you need build NOW (not recommended for production):

```json
// frontend/tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "noEmit": false // Allow build even with errors
  }
}
```

### Or use TypeScript suppression:

```tsx
// @ts-expect-error - TODO: Fix in Phase 4
<Component ref={ref} />
```

---

## Files by Priority

### 🔥 **Critical** (Blocking build)

1. UI component refs (5 files)
2. Dialog children (3 files)
3. Component props (3 files)

### ⚠️ **High** (Breaking functionality)

4. Button variants (8 files)
5. Form components (1 file)
6. Storybook (4 files)

### ℹ️ **Medium** (Quality of life)

7. Icon props (2 files)
8. Type definitions (various)

---

## Helper Commands

### Find all Button imports

```bash
grep -r "import.*Button" frontend/src --include="*.tsx" | grep "@mui/material"
```

### Find Dialog usage

```bash
grep -r "<Dialog" frontend/src --include="*.tsx" -A 5
```

### Count errors by category

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "error TS" | cut -d':' -f3 | cut -d' ' -f2 | sort | uniq -c | sort -rn
```

### Most problematic files

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "error TS" | cut -d'(' -f1 | sort | uniq -c | sort -rn | head -10
```

---

## Documentation

- **Full Roadmap**: [TYPESCRIPT_FIX_ROADMAP.md](TYPESCRIPT_FIX_ROADMAP.md)
- **Autofix Summary**: [TYPESCRIPT_AUTOFIX_SUMMARY.md](TYPESCRIPT_AUTOFIX_SUMMARY.md)
- **Project Status**: [HANDOVER.md](HANDOVER.md)

---

## Common Issues & Solutions

### Issue: "Property X does not exist on type"

**Solution**: Add prop to interface or fix prop name

### Issue: "Type X is not assignable to type Y"

**Solution**: Check if using correct component variant (MUI vs custom)

### Issue: "Cannot find module"

**Solution**: Check import path casing (Alert vs alert)

### Issue: "JSX tag expects single child"

**Solution**: Wrap multiple children in `<>...</>`

### Issue: "No overload matches this call"

**Solution**: Usually variant or ref type mismatch

---

## Progress Tracking

Track your progress:

```bash
echo "$(date): Started - 62 errors" >> typescript-progress.log
# After each phase
echo "$(date): Phase 1 complete - XX errors remaining" >> typescript-progress.log
```

---

## Need Help?

1. Check the specific phase in [TYPESCRIPT_FIX_ROADMAP.md](TYPESCRIPT_FIX_ROADMAP.md)
2. Search for similar patterns in already-fixed files
3. Check MUI v7 migration guide: https://mui.com/material-ui/migration/migration-v6/
4. Review TypeScript handbook: https://www.typescriptlang.org/docs/handbook/

---

**Ready to start?** → Begin with Phase 1.1 in the roadmap (5 minutes, 5 errors fixed)
