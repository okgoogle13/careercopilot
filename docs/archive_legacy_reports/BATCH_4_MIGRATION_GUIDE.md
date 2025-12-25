# BATCH 4: PAGE MIGRATION GUIDE

## Electric Alchemist Design System v4.2

**Branch:** `claude/init-design-system-v4-018o16mLSmEzMiMkJ71kxtns`
**Prerequisites:** BATCH 1, 2, 3 complete (29 components available)

---

## MIGRATION STRATEGY

### **Phase 1: Import Replacement**

Replace Material-UI imports with Electric components

### **Phase 2: Component Replacement**

1-to-1 replacement of M3 components with Electric equivalents

### **Phase 3: Typography Application**

Apply Poly-Body typography classes

### **Phase 4: Testing**

Verify Tactile Press physics and responsive behavior

---

## COMPONENT MAPPING TABLE

### Forms & Inputs

| Material-UI             | Electric Alchemist     | Notes                 |
| ----------------------- | ---------------------- | --------------------- |
| `<TextField>`           | `<ElectricInput>`      | AI tier typography    |
| `<TextField multiline>` | `<ElectricTextarea>`   | Human tier typography |
| `<Checkbox>`            | `<ElectricCheckbox>`   | Tactile Press physics |
| `<Switch>`              | `<ElectricSwitch>`     | Spring animation      |
| `<RadioGroup>`          | `<ElectricRadioGroup>` | Pass array of options |
| `<Select>`              | `<ElectricSelect>`     | Native select         |
| `<Slider>`              | `<ElectricSlider>`     | Tactile Press thumb   |
| `<DatePicker>`          | `<ElectricDatePicker>` | Native date input     |

### Buttons

| Material-UI                    | Electric Alchemist                   | Notes                      |
| ------------------------------ | ------------------------------------ | -------------------------- |
| `<Button variant="contained">` | `<ElectricButton variant="default">` | Primary button             |
| `<Button variant="outlined">`  | `<ElectricButton variant="outline">` | Outline variant            |
| `<Button variant="text">`      | `<ElectricButton variant="ghost">`   | Ghost variant              |
| `<IconButton>`                 | `<ElectricButton>`                   | Use button with icon child |

### Layout

| Material-UI        | Electric Alchemist                      | Notes                                 |
| ------------------ | --------------------------------------- | ------------------------------------- |
| `<Container>`      | `<ElectricContainer>`                   | Size prop (sm, md, lg, xl, 2xl, full) |
| `<Grid container>` | `<ElectricGrid>`                        | Cols prop (1, 2, 3, 4, 6, 12)         |
| `<Stack>`          | `<div className="flex flex-col gap-4">` | Use Tailwind flex                     |
| `<Box>`            | `<div>`                                 | Use semantic HTML + Tailwind          |
| `<Divider>`        | `<ElectricDivider>`                     | Horizontal/vertical                   |

### Cards & Surfaces

| Material-UI     | Electric Alchemist                 | Notes                                |
| --------------- | ---------------------------------- | ------------------------------------ |
| `<Card>`        | `<ElectricCard>`                   | 3 variants (default, hero, tertiary) |
| `<Paper>`       | `<ElectricCard variant="default">` | Or use div with bg classes           |
| `<CardContent>` | `<ElectricCard>`                   | No separate content wrapper needed   |

### Feedback

| Material-UI          | Electric Alchemist                    | Notes                                               |
| -------------------- | ------------------------------------- | --------------------------------------------------- |
| `<Alert>`            | `<ElectricAlert>`                     | 5 variants (default, info, success, warning, error) |
| `<Chip>`             | `<ElectricBadge>`                     | 4 variants, Data tier                               |
| `<LinearProgress>`   | `<ElectricProgress>`                  | Linear variant                                      |
| `<Skeleton>`         | `<ElectricSkeleton>`                  | 5 variants                                          |
| `<CircularProgress>` | `<ElectricSkeleton variant="circle">` | Use skeleton circle                                 |

### Navigation

| Material-UI     | Electric Alchemist     | Notes                  |
| --------------- | ---------------------- | ---------------------- |
| `<Tabs>`        | `<ElectricTabs>`       | Sliding pill animation |
| `<Breadcrumbs>` | `<ElectricBreadcrumb>` | Data tier typography   |
| `<Pagination>`  | `<ElectricPagination>` | Tactile Press buttons  |

### Overlays

| Material-UI | Electric Alchemist  | Notes                             |
| ----------- | ------------------- | --------------------------------- |
| `<Dialog>`  | `<ElectricDialog>`  | Spring animation, backdrop        |
| `<Drawer>`  | `<ElectricDrawer>`  | Asymmetric radius (0 28px 28px 0) |
| `<Popover>` | `<ElectricPopover>` | Click-triggered                   |
| `<Tooltip>` | `<ElectricTooltip>` | Hover tooltip                     |
| `<Menu>`    | `<ElectricPopover>` | Use Popover with list             |

### Typography

| Material-UI                      | Electric Alchemist                        | Notes              |
| -------------------------------- | ----------------------------------------- | ------------------ |
| `<Typography variant="h1">`      | `<h1 className="text-hero">`              | Hero tier          |
| `<Typography variant="h2">`      | `<h2 className="text-hero text-hero-sm">` | Hero tier, smaller |
| `<Typography variant="body1">`   | `<p className="text-human">`              | Human tier         |
| `<Typography variant="body2">`   | `<p className="text-ai">`                 | AI tier            |
| `<Typography variant="caption">` | `<span className="text-data">`            | Data tier          |

### Data Display

| Material-UI  | Electric Alchemist                         | Notes                                |
| ------------ | ------------------------------------------ | ------------------------------------ |
| `<Table>`    | `<ElectricTable>`                          | Table, Header, Body, Row, Head, Cell |
| `<Avatar>`   | `<ElectricAvatar>`                         | 4 sizes, fallback initials           |
| `<List>`     | `<ul className="flex flex-col gap-2">`     | Use semantic HTML                    |
| `<ListItem>` | `<li className="flex items-center gap-2">` | Use flex                             |

---

## TYPOGRAPHY TIER MAPPING

### Rule of Thumb:

- **Page Titles** → `.text-hero` (Roboto Flex, wdth: 150, wght: 800)
- **User Content** → `.text-human` (Roboto Serif, readable)
- **UI Labels/Buttons** → `.text-ai` (Roboto Flex, wdth: 92, efficient)
- **Metadata/Tags** → `.text-data` (Roboto Flex, opsz: 8, uppercase)

### Examples:

```tsx
// Before (Material-UI)
<Typography variant="h4">Dashboard</Typography>
<Typography variant="body1">Welcome back!</Typography>
<Typography variant="caption">Last updated: 2 hours ago</Typography>

// After (Electric Alchemist)
<h1 className="text-hero text-hero-sm">Dashboard</h1>
<p className="text-human">Welcome back!</p>
<span className="text-data">Last updated: 2 hours ago</span>
```

---

## MIGRATION WORKFLOW (Per Page)

### **Step 1: Update Imports**

```tsx
// Before
import { Button, Card, TextField, Typography } from "@mui/material";

// After
import { ElectricButton, ElectricCard, ElectricInput } from "@/components/electric";
```

### **Step 2: Replace Components**

```tsx
// Before
<Card>
  <CardContent>
    <Typography variant="h5">Title</Typography>
    <TextField label="Email" />
    <Button variant="contained">Submit</Button>
  </CardContent>
</Card>

// After
<ElectricCard variant="default">
  <h3 className="text-hero text-hero-sm mb-4">Title</h3>
  <ElectricInput placeholder="Email" type="email" className="mb-4" />
  <ElectricButton variant="default">Submit</ElectricButton>
</ElectricCard>
```

### **Step 3: Apply Layout Classes**

```tsx
// Before
<Container maxWidth="lg">
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>...</Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>...</Card>
    </Grid>
  </Grid>
</Container>

// After
<ElectricContainer size="lg">
  <ElectricGrid cols={2} gap="md">
    <ElectricCard>...</ElectricCard>
    <ElectricCard>...</ElectricCard>
  </ElectricGrid>
</ElectricContainer>
```

### **Step 4: Test Interactions**

- Verify Tactile Press on buttons (hover: scale 0.98, tap: scale 0.95)
- Check form inputs focus states (tertiary ring)
- Test responsive behavior (breakpoints)

---

## PAGE-SPECIFIC NOTES

### **1. DashboardPage**

**Complexity:** High
**Components to Replace:**

- `<Card>` → `<ElectricCard>` (profile cards)
- `<Button>` → `<ElectricButton>` (actions)
- `<Chip>` → `<ElectricBadge>` (status badges)
- `<LinearProgress>` → `<ElectricProgress>` (ATS score)
- `<Avatar>` → `<ElectricAvatar>` (user avatars)
- `<Menu>` → `<ElectricPopover>` (action menus)
- `<Typography>` → Poly-Body classes

**Key Changes:**

1. Replace GridCompat with `<ElectricGrid cols={3}>`
2. Profile cards: `<ElectricCard interactive>` with Tactile Press
3. Status badges: `<ElectricBadge variant="primary">` for active
4. ATS scores: `<ElectricProgress value={85} max={100} />`

### **2. KscGeneratorPage**

**Complexity:** High
**Components to Replace:**

- All form inputs → Electric form components
- `<TextField multiline>` → `<ElectricTextarea>`
- Form buttons → `<ElectricButton>`
- Loading states → `<ElectricSkeleton>`

**Key Changes:**

1. Form layout: Use `flex flex-col gap-4`
2. Submit button: `<ElectricButton variant="tertiary" size="lg">`
3. Character counter: `.text-data` typography

### **3. DocumentsPage**

**Complexity:** Medium
**Components to Replace:**

- Document cards → `<ElectricCard>`
- Upload button → `<ElectricButton variant="tertiary">`
- Empty state → `<ElectricEmptyState>`
- Search bar → `<ElectricSearchInput>`

### **4. AnalysisPage**

**Complexity:** High (data tables)
**Components to Replace:**

- `<Table>` → `<ElectricTable>` with all subcomponents
- Score cards → `<ElectricCard variant="hero">`
- Charts: Keep existing, wrap in `<ElectricCard>`

### **5. OpportunitiesPage**

**Complexity:** Medium
**Components to Replace:**

- Job cards → `<ElectricCard interactive>`
- Filters → `<ElectricSelect>`, `<ElectricCheckbox>`
- Search → `<ElectricSearchInput>`
- Apply button → `<ElectricButton variant="tertiary">`

### **6. AssetLibraryPage**

**Complexity:** Medium
**Components to Replace:**

- Asset cards → `<ElectricCard>` in grid
- Search → `<ElectricSearchInput>`
- Filters → `<ElectricTabs>`

### **7. SettingsPage**

**Complexity:** Medium
**Components to Replace:**

- Settings form → All Electric form components
- `<Switch>` → `<ElectricSwitch label="...">"`
- Save button → `<ElectricButton variant="default">`

### **8. LoginPage**

**Complexity:** Low
**Components to Replace:**

- Login form → `<ElectricInput type="email">`, `<ElectricInput type="password">`
- Submit button → `<ElectricButton variant="default" size="lg">`
- Keep minimal styling (centered card)

### **9. RegisterPage**

**Complexity:** Low
**Components to Replace:**

- Similar to LoginPage
- Additional fields → `<ElectricInput>`, `<ElectricCheckbox>`
- Terms checkbox → `<ElectricCheckbox label="I agree to terms">`

### **10. ATSAnalysisPage**

**Complexity:** High
**Components to Replace:**

- Analysis cards → `<ElectricCard variant="hero">`
- Data tables → `<ElectricTable>`
- Score indicators → `<ElectricProgress>`
- Recommendations list → Use semantic HTML with `.text-human`

---

## COMMON PATTERNS

### Empty States

```tsx
// Before
<Box textAlign="center" py={8}>
  <Typography variant="h6">No documents yet</Typography>
  <Typography variant="body2">Create your first document</Typography>
  <Button variant="contained" startIcon={<Add />}>
    Create Document
  </Button>
</Box>

// After
<ElectricEmptyState
  icon={<Add className="h-16 w-16" />}
  title="No documents yet"
  description="Create your first document to get started"
  action={{
    label: "Create Document",
    onClick: onCreateDocument
  }}
/>
```

### Loading States

```tsx
// Before
<CircularProgress />

// After
<ElectricSkeleton variant="circle" />
// Or for full page:
<div className="flex flex-col gap-4">
  <ElectricSkeleton variant="title" />
  <ElectricSkeleton variant="text" />
  <ElectricSkeleton variant="rect" />
</div>
```

### Action Menus

```tsx
// Before
<IconButton onClick={handleMenuOpen}>
  <MoreVert />
</IconButton>
<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
  <MenuItem onClick={handleEdit}>Edit</MenuItem>
  <MenuItem onClick={handleDelete}>Delete</MenuItem>
</Menu>

// After
<ElectricPopover
  trigger={<ElectricButton variant="ghost"><MoreVert /></ElectricButton>}
  content={
    <div className="flex flex-col gap-2">
      <button onClick={handleEdit} className="text-ai hover:text-primary">Edit</button>
      <button onClick={handleDelete} className="text-ai hover:text-primary">Delete</button>
    </div>
  }
/>
```

---

## TESTING CHECKLIST (Per Page)

- [ ] All Material-UI imports removed
- [ ] All components replaced with Electric equivalents
- [ ] Typography classes applied (hero, human, ai, data)
- [ ] Tactile Press physics working on interactive elements
- [ ] Focus states visible (tertiary ring)
- [ ] Responsive layout working (mobile, tablet, desktop)
- [ ] Empty states using `<ElectricEmptyState>`
- [ ] Loading states using `<ElectricSkeleton>`
- [ ] Forms validation working
- [ ] Keyboard navigation functional

---

## ESTIMATED EFFORT

| Page              | Complexity | Est. Time | Priority |
| ----------------- | ---------- | --------- | -------- |
| LoginPage         | Low        | 30 min    | High     |
| RegisterPage      | Low        | 30 min    | High     |
| DashboardPage     | High       | 2-3 hours | Critical |
| KscGeneratorPage  | High       | 2-3 hours | Critical |
| DocumentsPage     | Medium     | 1-2 hours | High     |
| SettingsPage      | Medium     | 1-2 hours | Medium   |
| OpportunitiesPage | Medium     | 1-2 hours | Medium   |
| AssetLibraryPage  | Medium     | 1-2 hours | Medium   |
| AnalysisPage      | High       | 2-3 hours | Medium   |
| ATSAnalysisPage   | High       | 2-3 hours | Low      |

**Total:** 15-20 hours for all 10 pages

---

## SUCCESS CRITERIA

- [ ] All 10 pages migrated
- [ ] 0 Material-UI component imports remaining in pages
- [ ] 100% Electric Alchemist component usage
- [ ] Poly-Body typography applied throughout
- [ ] Deep Violet Void aesthetic consistent
- [ ] Tactile Press physics on all interactions
- [ ] All pages responsive and accessible

---

**READY FOR EXECUTION**
**Proceed page-by-page starting with LoginPage (easiest) or DashboardPage (highest impact)**
