# TypeScript Fix Roadmap
## Completing the Remaining 62 Errors

---

## Current Status
- **Total Errors**: 62
- **Automated Fixes Completed**: ~70% (200+ → 62 errors)
- **Build Status**: ❌ Failing
- **Goal**: ✅ Zero TypeScript errors, successful build

---

## Phase 1: Quick Wins (Est. 15 minutes)
**Impact**: Fix 11 errors (18% of remaining)
**Difficulty**: Low
**Priority**: HIGH

### 1.1 Fix Dialog/Popover Children Props (5 errors, 5 minutes)
**Files**:
- `frontend/src/components/features/Documents/DocumentPreview.tsx` (3 errors)
- `frontend/src/components/features/opportunities/CareerGrowthHub.tsx` (1 error)
- `frontend/src/components/features/profile/ProfileEditor.tsx` (2 errors)

**Issue**: MUI v7 Dialog expects single child but multiple provided

**Solution**: Wrap multiple children in React.Fragment
```tsx
// Before
<DialogContent>
  <Box>...</Box>
  <Box>...</Box>
</DialogContent>

// After
<DialogContent>
  <>
    <Box>...</Box>
    <Box>...</Box>
  </>
</DialogContent>
```

**Script to create**:
```bash
# Create: scripts/fix-dialog-children.sh
# Use sed to add fragment wrappers around multiple Dialog children
```

---

### 1.2 Fix Missing Required Props (2 errors, 3 minutes)
**Files**:
- `frontend/src/components/library/InteractiveComponentsSection.tsx` (Dialog 'open' prop)
- `frontend/src/components/library/ProfileVariationCard.tsx` (DropdownMenu 'open' prop)

**Issue**: Controlled components missing required 'open' prop

**Solution**: Add state management
```tsx
// Before
<Dialog>
  <DialogTrigger>...</DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>

// After
const [open, setOpen] = useState(false);
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>...</DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>
```

---

### 1.3 Fix DocumentTypeSelector Category Type (1 error, 2 minutes)
**File**: `frontend/src/components/features/Documents/DocumentTypeSelector.tsx:509`

**Issue**: Type '"favorites"' not assignable to DocumentCategory

**Solution**: Extend type definition
```tsx
// In types file or at top of component
type DocumentCategoryExtended = DocumentCategory | "favorites";
const [selectedCategory, setSelectedCategory] = useState<DocumentCategoryExtended>("all");
```

---

### 1.4 Fix Typo: mes_age → message (1 error, 1 minute)
**File**: `frontend/src/components/features/demo/MUITest.tsx:215`

**Issue**: Object literal has 'mes_age' instead of 'message'

**Solution**: Simple find/replace
```bash
sed -i 's/mes_age/message/g' frontend/src/components/features/demo/MUITest.tsx
```

---

### 1.5 Fix Card variant in MUITest (1 error, 2 minutes)
**File**: `frontend/src/components/features/demo/MUITest.tsx:121`

**Issue**: variant="outline" should be variant="outlined" for MUI Card

**Solution**:
```bash
sed -i 's/variant="outline"/variant="outlined"/g' frontend/src/components/features/demo/MUITest.tsx
```

---

### 1.6 Fix Alert Import Path (1 error, 1 minute)
**File**: `frontend/src/components/library/DisplayComponentsSection.tsx:5`

**Issue**: Cannot find module '../ui/alert'

**Solution**: Fix import casing
```tsx
// Before
import { Alert } from '../ui/alert';

// After
import { Alert } from '../ui/Alert';
```

---

## Phase 2: Storybook Integration (Est. 10 minutes)
**Impact**: Fix 4 errors (6% of remaining)
**Difficulty**: Low-Medium
**Priority**: HIGH

### 2.1 Fix Storybook Type Imports (4 errors)
**Files**:
- `frontend/src/components/documents/__stories__/DocumentBrowser.stories.tsx`
- `frontend/src/components/layout/AppLayout.stories.tsx`
- `frontend/src/components/layout/PageHeader.stories.tsx`
- `frontend/src/components/ui/Button/Button.stories.tsx`

**Issue**: Module '@storybook/react' has no exported member 'Meta'/'StoryObj'

**Root Cause**: Storybook version mismatch or incorrect import syntax

**Investigation Steps**:
```bash
# Check Storybook version
cd frontend && yarn list @storybook/react

# Check if types are installed
ls node_modules/@storybook/react/dist/types.d.ts
```

**Solution Options**:

**Option A**: Use correct import for Storybook 8.x
```tsx
import type { Meta, StoryObj } from '@storybook/react';
```

**Option B**: Use alternative import syntax
```tsx
import type { Meta, StoryFn } from '@storybook/react';
type Story = StoryFn<typeof Component>;
```

**Option C**: Install missing types
```bash
yarn add -D @storybook/types
```

**Option D**: Use any as temporary workaround (not recommended)
```tsx
const meta: any = { ... };
export default meta;
```

---

## Phase 3: Component Props Alignment (Est. 20 minutes)
**Impact**: Fix 6 errors (10% of remaining)
**Difficulty**: Medium
**Priority**: HIGH

### 3.1 Fix TemplateSelector Props (1 error)
**File**: `frontend/src/App.tsx:549`

**Issue**: Property 'onSelect' does not exist on TemplateSelectorProps

**Steps**:
1. Open `frontend/src/components/features/Documents/TemplateSelector.tsx`
2. Check the actual props interface
3. Add missing prop to interface or fix caller

```tsx
// In TemplateSelector.tsx
interface TemplateSelectorProps {
  documentType: 'resume' | 'cover-letter';
  onSelect: (templateId: string, type: 'resume' | 'cover-letter') => void; // Add this
  onBack: () => void;
}
```

---

### 3.2 Fix ResumeBuilder Props (1 error)
**File**: `frontend/src/App.tsx:558`

**Issue**: Property 'onComplete' does not exist on ResumeBuilderProps

**Steps**:
1. Open `frontend/src/components/features/Documents/ResumeBuilder.tsx`
2. Check the props interface
3. Add missing prop

```tsx
// In ResumeBuilder.tsx
interface ResumeBuilderProps {
  template: { id: string; name: string; type: 'resume' | 'cover-letter' };
  onComplete: () => void; // Add this
  onBack: () => void;
  editingProfile: Profile | null;
}
```

---

### 3.3 Fix AnimatedComponents Props (2 errors)
**File**: `frontend/src/components/features/demo/AnimatedComponents.tsx:75,79`

**Issue**: Complex prop structure with onSelect

**Steps**:
1. Review component structure - appears to be a functional component with complex signature
2. Refactor to standard component interface

```tsx
// Before (problematic)
function AnimatedDropdown(_onSelect: any) {
  // ...
}
AnimatedDropdown.onSelect = function onSelect(value: string) { };

// After (fixed)
interface AnimatedDropdownProps {
  trigger: ReactNode;
  items: { label: string; value: string; icon?: ReactNode }[];
  onSelect: (value: string) => void;
}

function AnimatedDropdown({ trigger, items, onSelect }: AnimatedDropdownProps) {
  // ...
}
```

---

### 3.4 Fix AnimatedShowcase Props (2 errors)
**File**: `frontend/src/components/features/demo/AnimatedShowcase.tsx:259`

**Issue**: onSelect prop doesn't match AnimatedComponents interface

**Steps**:
1. Fix after AnimatedComponents is refactored
2. Update usage to match new interface

```tsx
<AnimatedDropdown
  trigger={<Button>Select</Button>}
  items={items}
  onSelect={(value: string) => console.log(value)} // Add type
/>
```

---

## Phase 4: UI Component Ref Forwarding (Est. 20 minutes)
**Impact**: Fix 10 errors (16% of remaining)
**Difficulty**: Medium-High
**Priority**: MEDIUM

### 4.1 Fix alert-dialog.tsx Ref (2 errors)
**File**: `frontend/src/components/ui/alert-dialog.tsx:44,48`

**Issue**: Ref forwarding incompatible with MUI Button

**Solution**: Proper forwardRef implementation
```tsx
// Before
const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button ref={ref} {...props} />
));

// After
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button {...props} />
));
```

---

### 4.2 Fix dropdown-menu.tsx Ref (1 error)
**File**: `frontend/src/components/ui/dropdown-menu.tsx:27`

**Issue**: Ref doesn't exist on type

**Solution**: Similar to alert-dialog, use proper MUI ref types

---

### 4.3 Fix popover.tsx Ref (1 error)
**File**: `frontend/src/components/ui/popover.tsx:37`

**Issue**: Ref forwarding issue

**Solution**: Use MUI Popover ref type

---

### 4.4 Fix tabs.tsx Ref (4 errors)
**File**: `frontend/src/components/ui/tabs.tsx:29,35,73`

**Issue**: Multiple ref forwarding and component prop issues

**Solution**:
1. Fix TabsTrigger to extend MUI Tab props correctly
2. Remove or fix 'component' prop usage
3. Ensure ref type matches MUI Tab component

```tsx
// Before
interface TabsTriggerProps extends Omit<TabProps, 'component'> {
  children: ReactNode;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <Tab ref={ref} component="div" {...props} />
  )
);

// After
interface TabsTriggerProps extends Omit<TabProps, 'component' | 'children'> {
  children?: ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Tab>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <Tab {...props} />
));
```

---

### 4.5 Fix tooltip.tsx Ref (1 error)
**File**: `frontend/src/components/ui/tooltip.tsx:25`

**Issue**: Ref forwarding issue

**Solution**: Use MUI Tooltip ref types

---

## Phase 5: MUI v7 Advanced API (Est. 15 minutes)
**Impact**: Fix 31 errors (50% of remaining)
**Difficulty**: Medium
**Priority**: MEDIUM

### 5.1 Fix Icon fontSize Props (3 errors)
**Files**:
- `frontend/src/components/layout/AppLayout.tsx:227`
- `frontend/src/components/layout/PageHeader.tsx:273,337,367`

**Issue**: fontSize prop doesn't exist, should use sx

**Solution**: Already partially fixed, complete remaining instances
```tsx
// Before
<SettingsIcon fontSize="small" />

// After
<SettingsIcon sx={{ fontSize: 20 }} />
```

**Script**:
```bash
# Create: scripts/fix-icon-fontsize.sh
perl -i -pe 's/<(\w+Icon)([^>]*)\s+fontSize="small"([^>]*)>/<$1$2 sx={{ fontSize: 20 }}$3>/g' file.tsx
perl -i -pe 's/<(\w+Icon)([^>]*)\s+fontSize="medium"([^>]*)>/<$1$2 sx={{ fontSize: 24 }}$3>/g' file.tsx
perl -i -pe 's/<(\w+Icon)([^>]*)\s+fontSize="large"([^>]*)>/<$1$2 sx={{ fontSize: 35 }}$3>/g' file.tsx
```

---

### 5.2 Fix Remaining Button Variants (15 errors)
**Files**:
- `frontend/src/components/features/Documents/ResumeBuilder.tsx` (5 errors)
- `frontend/src/components/features/Documents/DocumentTypeSelector.tsx` (4 errors)
- `frontend/src/components/features/opportunities/InterviewPrep.tsx` (2 errors)
- Others (4 errors)

**Issue**: Mixing MUI Button with custom Button - variant mismatch

**Root Cause Analysis**:
```bash
# Check which Button component is imported
grep "import.*Button" frontend/src/components/features/Documents/ResumeBuilder.tsx
```

**Solution Strategy**:
- If using MUI Button: `variant="outlined"`
- If using custom Button: `variant="outline"`

**Decision Tree**:
```
Is Button from '@mui/material'?
├─ Yes → Use variant="outlined" | "contained" | "text"
└─ No → Use variant="outline" | "default" | "destructive" | "secondary"
```

---

### 5.3 Fix Tab Component Issues (2 errors)
**File**: `frontend/src/components/ui/tabs.tsx:73`

**Issue**: Property 'component' doesn't exist on Tab

**Solution**: Remove component prop or use proper override
```tsx
// Option A: Remove component prop
<Tab {...props} /> // Remove component="div"

// Option B: Use proper typing
<Tab component="div" {...props} />
```

---

### 5.4 Fix JobInput Tabs onChange (1 error)
**File**: `frontend/src/components/features/opportunities/JobInput.tsx:76`

**Issue**: Dispatch<SetStateAction<string>> not assignable to MUI Tabs onChange

**Solution**: Use proper onChange handler
```tsx
// Before
<Tabs value={jobSource} onChange={setJobSource}>

// After
<Tabs value={jobSource} onChange={(_, value) => setJobSource(value as string)}>
```

---

### 5.5 Fix FormComponentsSection Props (3 errors)
**File**: `frontend/src/components/library/FormComponentsSection.tsx:68,81,100`

**Issue**: onCheckedChange, onValueChange not valid MUI props

**Solution**: Use onChange instead
```tsx
// Checkbox: onCheckedChange → onChange
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// RadioGroup: onValueChange → onChange
<RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>

// Slider: onValueChange → onChange
<Slider value={value} onChange={(e, newValue) => setValue(newValue)} />
```

---

### 5.6 Fix InteractiveComponentsSection Dialog (2 errors)
**File**: `frontend/src/components/library/InteractiveComponentsSection.tsx:35,36,56`

**Issue**: Dialog missing 'open' prop, DialogTrigger has invalid 'asChild' prop

**Solution**:
```tsx
// Before
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
</Dialog>

// After
const [open, setOpen] = useState(false);
<Dialog open={open} onClose={() => setOpen(false)}>
  <Button onClick={() => setOpen(true)}>Open</Button>
  <DialogContent>...</DialogContent>
</Dialog>
```

---

### 5.7 Fix ProfileVariationCard DropdownMenu (2 errors)
**File**: `frontend/src/components/library/ProfileVariationCard.tsx:89,102`

**Issue**: DropdownMenu missing 'open' prop, invalid 'align' prop

**Solution**:
```tsx
// Use MUI Menu instead of custom DropdownMenu
import { Menu, MenuItem } from '@mui/material';

const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <MenuItem>...</MenuItem>
</Menu>
```

---

### 5.8 Fix DisplayComponentsSection Badge Variants (2 errors)
**File**: `frontend/src/components/library/DisplayComponentsSection.tsx:18,20,21`

**Issue**: "elevation" and "outlined" not valid Badge variants

**Solution**: Use custom Badge or MUI Badge correctly
```tsx
// If using MUI Badge - remove variant prop
<Badge badgeContent={4} color="primary">

// If using custom Badge - use correct variants
<Badge variant="default">
```

---

## Phase 6: Final Cleanup (Est. 5 minutes)
**Impact**: Verify all fixes, ensure build passes
**Difficulty**: Low
**Priority**: HIGH

### 6.1 Run Full TypeScript Check
```bash
cd frontend && npx tsc --noEmit --pretty > ../typescript-final-check.log 2>&1
```

### 6.2 Run Build Test
```bash
yarn build:frontend
```

### 6.3 Run Tests (if applicable)
```bash
yarn test:frontend
```

### 6.4 ESLint Cleanup
```bash
cd frontend && yarn lint:fix
```

---

## Execution Order & Prioritization

### **Week 1 Sprint** (Complete Fix)
```
Day 1 (2 hours):
├─ Phase 1: Quick Wins (15 min)
├─ Phase 2: Storybook (10 min)
├─ Phase 3: Component Props (20 min)
└─ Phase 4: UI Refs (20 min)
    Total: 65 minutes

Day 2 (1.5 hours):
├─ Phase 5: MUI v7 API (15 min)
└─ Phase 6: Final Cleanup (5 min)
    Total: 20 minutes

Buffer: 45 minutes for unexpected issues
```

### **Aggressive Timeline** (Same Day)
```
Session 1 (Morning - 1 hour):
├─ Phase 1: Quick Wins
├─ Phase 2: Storybook
└─ Phase 3: Component Props

Session 2 (Afternoon - 45 minutes):
├─ Phase 4: UI Refs
└─ Phase 5: MUI v7 API

Session 3 (Final - 15 minutes):
└─ Phase 6: Cleanup & Verification
```

---

## Helper Scripts to Create

### 1. `scripts/fix-dialog-children.sh`
Automated Dialog children wrapping

### 2. `scripts/fix-missing-props.sh`
Add required 'open' props with state management

### 3. `scripts/fix-button-variants.sh`
Intelligently fix variant based on import source

### 4. `scripts/fix-icon-fontsize.sh`
Convert all fontSize props to sx prop

### 5. `scripts/fix-form-components.sh`
Convert onValueChange/onCheckedChange to onChange

### 6. `scripts/verify-all-fixes.sh`
Run full verification suite

---

## Risk Assessment

### Low Risk (Can automate)
- ✅ Quick wins (Phase 1)
- ✅ Icon fontSize fixes
- ✅ Form component prop names

### Medium Risk (Semi-automated)
- ⚠️ Button variant fixes (need import detection)
- ⚠️ Component prop alignment (need interface checking)

### High Risk (Manual required)
- 🔴 UI component ref forwarding (complex TypeScript)
- 🔴 Storybook type resolution (dependency issue)
- 🔴 AnimatedComponents refactor (architectural change)

---

## Success Criteria

### Phase Completion
- [ ] Phase 1: 11 errors fixed → 51 remaining
- [ ] Phase 2: 4 errors fixed → 47 remaining
- [ ] Phase 3: 6 errors fixed → 41 remaining
- [ ] Phase 4: 10 errors fixed → 31 remaining
- [ ] Phase 5: 31 errors fixed → 0 remaining
- [ ] Phase 6: Build passes ✅

### Final Goals
- [ ] Zero TypeScript errors
- [ ] Build completes successfully
- [ ] All tests pass
- [ ] ESLint warnings < 10
- [ ] No console errors in dev server

---

## Rollback Strategy

### If Issues Arise
```bash
# Revert all changes
git checkout frontend/src

# Re-run only successful autofixes
./scripts/autofix-typescript-errors.sh
./scripts/autofix-remaining-errors.sh
./scripts/autofix-critical-errors.sh

# Apply phases incrementally
```

### Git Strategy
```bash
# Create commits after each phase
git add -A
git commit -m "fix(typescript): Phase 1 - Quick wins (11 errors fixed)"
git commit -m "fix(typescript): Phase 2 - Storybook integration (4 errors fixed)"
# etc.
```

---

## Progress Tracking

### Use TODO Comments
```tsx
// TODO: [Phase 4] Fix forwardRef typing - see TYPESCRIPT_FIX_ROADMAP.md
```

### Create Progress Log
```bash
echo "$(date): Phase 1 complete - 11 errors fixed" >> typescript-fix-progress.log
```

---

## Documentation Updates Needed

After completion:
1. Update `TYPESCRIPT_AUTOFIX_SUMMARY.md` with final stats
2. Document any architectural decisions made
3. Create `MUI_V7_MIGRATION.md` with lessons learned
4. Update `HANDOVER.md` with TypeScript status

---

## Contact Points for Help

### If Stuck On:
- **Storybook Types**: Check Storybook docs for version 8.x
- **MUI v7 API**: Refer to MUI migration guide v6→v7
- **forwardRef**: TypeScript handbook on generic ref forwarding
- **Complex Props**: Consider using `React.ComponentProps<typeof Component>`

---

## Estimated Total Time
- **Optimistic**: 1.5 hours
- **Realistic**: 2-3 hours
- **Pessimistic**: 4 hours (including debugging)

---

## Next Immediate Action

**Start with Phase 1.1** - Fix Dialog children (5 errors, 5 minutes)
```bash
# Create and run the first helper script
./scripts/fix-dialog-children.sh
```

This will give immediate visible progress and build momentum for the remaining phases.
