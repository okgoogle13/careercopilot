# M3 Component Usage Guide

**Last Updated**: 2026-01-03  
**M3 Compliance**: 95-97%  
**Component Count**: 14 production-ready components

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Layout Components](#layout-components)
3. [Form Components](#form-components)
4. [Feedback Components](#feedback-components)
5. [Data Display Components](#data-display-components)
6. [Common Patterns](#common-patterns)
7. [Migration from MUI](#migration-from-mui)

---

## Quick Start

### Installation

Components are already set up in your project. Simply import from the barrel export:

```tsx
import { M3Card, M3Button, M3TextField } from '@/components/ui';
```

### Basic Example

```tsx
import { M3Card, M3CardHeader, M3CardContent, M3CardActions, M3Button } from '@/components/ui';

function MyComponent() {
  return (
    <M3Card variant="pebble" elevation={1} padding="lg">
      <M3CardHeader title="Welcome" subtitle="Get started with M3 components" />
      <M3CardContent>
        <p>This is a fully M3-compliant card with organic shapes!</p>
      </M3CardContent>
      <M3CardActions align="right">
        <M3Button variant="outlined">Cancel</M3Button>
        <M3Button variant="filled" color="primary">Confirm</M3Button>
      </M3CardActions>
    </M3Card>
  );
}
```

---

## Layout Components

### M3Card

**Purpose**: Container for related content with elevation and organic shapes.

**Variants**: `pebble` (friendly), `tech` (precision), `leaf` (growth), `gem` (highlight)

#### Basic Card
```tsx
<M3Card variant="pebble" elevation={1} padding="lg">
  <h3 className="text-headline-large">Card Title</h3>
  <p className="text-body-large">Card content goes here</p>
</M3Card>
```

#### Interactive Card
```tsx
<M3Card
  variant="tech"
  elevation={1}
  hoverable
  onClick={() => navigate('/details')}
>
  <p>Click me!</p>
</M3Card>
```

#### Card with All Sub-components
```tsx
<M3Card variant="pebble" elevation={2} padding="xl">
  <M3CardHeader
    title="Project Dashboard"
    subtitle="Last updated 2 hours ago"
    icon={<DashboardIcon className="w-6 h-6" />}
    action={<M3IconButton icon={<MoreIcon />} ariaLabel="More options" />}
  />
  
  <M3CardContent>
    <div className="grid grid-cols-2 gap-4">
      <MetricCard icon={FileIcon} label="Documents" value="24" />
      <MetricCard icon={UserIcon} label="Team Members" value="8" />
    </div>
  </M3CardContent>
  
  <M3CardActions align="between">
    <M3Button variant="text">View All</M3Button>
    <M3Button variant="filled">Add New</M3Button>
  </M3CardActions>
</M3Card>
```

**Props**:
- `variant`: Shape (pebble, tech, leaf, gem)
- `elevation`: 0-5 shadow depth
- `hoverable`: Enable hover elevation increase
- `padding`: none, sm, md, lg, xl
- `onClick`: Click handler (makes card interactive)

---

### M3Button

**Purpose**: Action triggers with semantic colors and variants.

**Variants**: `filled` (high emphasis), `elevated` (extra shadow), `outlined` (medium), `tonal` (subtle), `text` (low)

**Colors**: `primary`, `secondary`, `tertiary`, `error`, `warning`

#### All Variants
```tsx
{/* High emphasis - Primary actions */}
<M3Button variant="filled" color="primary">
  Get Started
</M3Button>

{/* Extra emphasis - Featured actions */}
<M3Button variant="elevated" color="secondary">
  Featured Action
</M3Button>

{/* Medium emphasis - Secondary actions */}
<M3Button variant="outlined" color="primary">
  Learn More
</M3Button>

{/* Subtle emphasis - Alternative actions */}
<M3Button variant="tonal" color="tertiary">
  Customize
</M3Button>

{/* Low emphasis - Tertiary actions */}
<M3Button variant="text" color="primary">
  Cancel
</M3Button>
```

#### With Icons
```tsx
<M3Button
  variant="filled"
  color="primary"
  startIcon={<Download className="w-4 h-4" />}
>
  Download Report
</M3Button>

<M3Button
  variant="outlined"
  endIcon={<ArrowRight className="w-4 h-4" />}
>
  Next Step
</M3Button>
```

#### Loading State
```tsx
<M3Button variant="filled" loading>
  Processing...
</M3Button>
```

#### As Link
```tsx
<M3Button
  variant="text"
  href="https://docs.example.com"
  target="_blank"
>
  View Documentation
</M3Button>
```

#### Icon Button
```tsx
<M3IconButton
  icon={<Close className="w-5 h-5" />}
  ariaLabel="Close dialog"
  size="medium"
  onClick={handleClose}
/>
```

---

## Form Components

### M3TextField

**Purpose**: Single-line text input with validation and adornments.

#### Basic Input
```tsx
<M3TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  fullWidth
/>
```

#### With Helper Text
```tsx
<M3TextField
  label="Username"
  helperText="Username must be 3-20 characters"
  fullWidth
/>
```

#### Error State
```tsx
<M3TextField
  label="Password"
  type="password"
  error
  errorMessage="Password must be at least 8 characters"
  fullWidth
/>
```

#### With Adornments
```tsx
<M3TextField
  label="Search"
  startAdornment={<Search className="w-5 h-5" />}
  placeholder="Search jobs..."
  fullWidth
/>

<M3TextField
  label="Amount"
  type="number"
  startAdornment={<span>$</span>}
  endAdornment={<span>USD</span>}
/>
```

#### Character Counter
```tsx
<M3TextField
  label="Bio"
  maxLength={160}
  showCounter
  fullWidth
/>
```

#### Required Field
```tsx
<M3TextField
  label="Full Name"
  required
  fullWidth
/>
```

---

### M3TextArea

**Purpose**: Multi-line text input.

```tsx
<M3TextArea
  label="Message"
  rows={5}
  maxLength={500}
  showCounter
  placeholder="Write your message here..."
  helperText="We'll respond within 24 hours"
  fullWidth
/>
```

---

### M3Select

**Purpose**: Dropdown selection with custom styling.

#### Basic Select
```tsx
<M3Select
  label="Country"
  options={[
    { value: 'au', label: 'Australia' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  value={country}
  onChange={setCountry}
  fullWidth
/>
```

#### With Disabled Options
```tsx
<M3Select
  label="Plan"
  options={[
    { value: 'free', label: 'Free Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise Plan', disabled: true },
  ]}
  placeholder="Choose your plan"
  fullWidth
/>
```

#### Error State
```tsx
<M3Select
  label="Category"
  options={categories}
  error
  errorMessage="Please select a category"
  required
  fullWidth
/>
```

---

### M3Checkbox

**Purpose**: Boolean selection with optional indeterminate state.

#### Basic Checkbox
```tsx
<M3Checkbox
  label="I agree to the terms and conditions"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

#### Indeterminate (Select All)
```tsx
<M3Checkbox
  label="Select All"
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={handleSelectAll}
/>
```

#### Error State
```tsx
<M3Checkbox
  label="Confirm deletion"
  error
  required
/>
```

---

### M3Radio

**Purpose**: Single selection from a group.

```tsx
const [plan, setPlan] = useState('free');

<div className="flex flex-col gap-3">
  <M3Radio
    name="plan"
    value="free"
    label="Free Plan ($0/month)"
    checked={plan === 'free'}
    onChange={(e) => setPlan(e.target.value)}
  />
  
  <M3Radio
    name="plan"
    value="pro"
    label="Pro Plan ($29/month)"
    checked={plan === 'pro'}
    onChange={(e) => setPlan(e.target.value)}
  />
  
  <M3Radio
    name="plan"
    value="enterprise"
    label="Enterprise Plan ($99/month)"
    checked={plan === 'enterprise'}
    onChange={(e) => setPlan(e.target.value)}
  />
</div>
```

---

## Feedback Components

### M3Alert

**Purpose**: Display important messages with semantic colors.

**Severities**: `success` (teal), `info` (indigo), `warning` (amber), `error` (red)

**Variants**: `filled` (high emphasis), `tonal` (medium), `outlined` (low)

#### Success Message
```tsx
<M3Alert severity="success">
  Your profile has been updated successfully!
</M3Alert>
```

#### Error with Title
```tsx
<M3Alert
  severity="error"
  title="Upload Failed"
  variant="tonal"
>
  The file size exceeds the 10MB limit. Please choose a smaller file.
</M3Alert>
```

#### Dismissible Alert
```tsx
<M3Alert
  severity="warning"
  onClose={() => setShowWarning(false)}
>
  This action cannot be undone. Please proceed with caution.
</M3Alert>
```

#### Outlined Variant
```tsx
<M3Alert severity="info" variant="outlined">
  <M3AlertTitle>Pro Tip</M3AlertTitle>
  <M3AlertDescription>
    You can use keyboard shortcuts to navigate faster.
    Press <kbd>Ctrl+K</kbd> to open the command palette.
  </M3AlertDescription>
</M3Alert>
```

---

## Data Display Components

### MetricCard

**Purpose**: Display key metrics with icons and values.

```tsx
<MetricCard
  icon={FileTextIcon}
  label="Applications"
  value="42"
  variant="outlined"
/>

<MetricCard
  icon={TrendingUpIcon}
  label="Success Rate"
  value="68%"
  iconColor="text-secondary"
  variant="filled"
  hoverable
/>
```

### StatCard

**Purpose**: Large statistics with motion effects.

```tsx
<StatCard
  icon={UserIcon}
  value="1,234"
  label="Total Users"
  iconColor="text-primary"
/>
```

### ApplicationCard

**Purpose**: Job application tracking with multi-step progress.

```tsx
<ApplicationCard
  title="Senior Developer"
  company="Tech Corp"
  location="Sydney, AU"
  appliedDate="2 days ago"
  currentStep={1}
  steps={['Applied', 'Screening', 'Interview', 'Offer']}
  onUpdateStatus={handleUpdate}
/>
```

---

## Common Patterns

### Complete Form
```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    subscribe: false,
  });

  return (
    <M3Card variant="pebble" padding="lg">
      <M3CardHeader
        title="Contact Us"
        subtitle="We'll get back to you within 24 hours"
      />
      
      <M3CardContent>
        <div className="flex flex-col gap-4">
          <M3TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
          />

          <M3TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
          />

          <M3Select
            label="Subject"
            options={[
              { value: 'support', label: 'Technical Support' },
              { value: 'sales', label: 'Sales Inquiry' },
              { value: 'feedback', label: 'Feedback' },
            ]}
            value={formData.subject}
            onChange={(value) => setFormData({ ...formData, subject: value })}
            required
            fullWidth
          />

          <M3TextArea
            label="Message"
            rows={5}
            maxLength={500}
            showCounter
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            fullWidth
          />

          <M3Checkbox
            label="Subscribe to newsletter"
            checked={formData.subscribe}
            onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
          />
        </div>
      </M3CardContent>

      <M3CardActions align="right">
        <M3Button variant="outlined">Cancel</M3Button>
        <M3Button variant="filled" color="primary">
          Send Message
        </M3Button>
      </M3CardActions>
    </M3Card>
  );
}
```

### Settings Panel
```tsx
function SettingsPanel() {
  return (
    <div className="flex flex-col gap-6">
      <M3Card variant="pebble" padding="lg">
        <M3CardHeader title="Notification Preferences" />
        <M3CardContent>
          <div className="flex flex-col gap-3">
            <M3Checkbox label="Email notifications" />
            <M3Checkbox label="Push notifications" />
            <M3Checkbox label="SMS notifications" />
          </div>
        </M3CardContent>
      </M3Card>

      <M3Card variant="pebble" padding="lg">
        <M3CardHeader title="Display Theme" />
        <M3CardContent>
          <div className="flex flex-col gap-3">
            <M3Radio name="theme" value="light" label="Light Mode" />
            <M3Radio name="theme" value="dark" label="Dark Mode" checked />
            <M3Radio name="theme" value="auto" label="Auto (System)" />
          </div>
        </M3CardContent>
      </M3Card>
    </div>
  );
}
```

### Dashboard Grid
```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard icon={FileIcon} label="Documents" value="24" hoverable />
      <MetricCard icon={UserIcon} label="Users" value="1.2k" hoverable />
      <MetricCard icon={TrendingUpIcon} label="Growth" value="+23%" hoverable />
      <MetricCard icon={DollarIcon} label="Revenue" value="$45k" hoverable />
    </div>
  );
}
```

---

## Migration from MUI

### Card Migration
```tsx
// BEFORE (MUI)
<Card sx={{ borderRadius: 2, p: 3 }}>
  <CardContent>
    <Typography variant="h6">Title</Typography>
    <Typography>Content</Typography>
  </CardContent>
  <CardActions>
    <Button variant="contained">Action</Button>
  </CardActions>
</Card>

// AFTER (M3)
<M3Card variant="pebble" padding="lg">
  <h3 className="text-title-large">Title</h3>
  <p className="text-body-large">Content</p>
  <M3CardActions>
    <M3Button variant="filled">Action</M3Button>
  </M3CardActions>
</M3Card>
```

### Button Migration
```tsx
// BEFORE (MUI)
<Button variant="contained" color="primary" startIcon={<PlayIcon />}>
  Start
</Button>

// AFTER (M3)
<M3Button variant="filled" color="primary" startIcon={<PlayIcon />}>
  Start
</M3Button>
```

### TextField Migration
```tsx
// BEFORE (MUI)
<TextField
  label="Email"
  type="email"
  error
  helperText="Invalid email"
  fullWidth
/>

// AFTER (M3)
<M3TextField
  label="Email"
  type="email"
  error
  errorMessage="Invalid email"
  fullWidth
/>
```

---

## Best Practices

### Shape Selection
- **Pebble**: General cards, friendly feel (most common)
- **Tech**: Data displays, precision elements
- **Leaf**: Progress indicators, growth themes
- **Gem**: Featured content, highlights

### Button Hierarchy
1. **Filled**: Primary CTA (1 per view)
2. **Elevated**: Featured action (special emphasis)
3. **Outlined**: Secondary action
4. **Tonal**: Alternative action
5. **Text**: Tertiary action (cancel, more info)

### Color Semantics
- **Primary** (Indigo): Main brand actions
- **Secondary** (Teal): Success, validated states
- **Tertiary** (Pink): Highlights, celebrations
- **Error** (Red): Destructive actions
- **Warning** (Amber): Caution, needs attention

### Accessibility
- Always provide `ariaLabel` for icon buttons
- Use `required` prop for required fields
- Provide meaningful `helperText` for complex inputs
- Use semantic HTML (`<form>`, `<label>`, etc.)
- Test keyboard navigation

---

## Quick Reference

| Component | Import | Primary Use |
|-----------|--------|-------------|
| M3Card | `M3Card` | Container with elevation |
| M3Button | `M3Button` | Actions & CTAs |
| M3TextField | `M3TextField` | Single-line input |
| M3TextArea | `M3TextArea` | Multi-line input |
| M3Select | `M3Select` | Dropdown selection |
| M3Checkbox | `M3Checkbox` | Boolean choice |
| M3Radio | `M3Radio` | Single selection |
| M3Alert | `M3Alert` | Messages & feedback |

---

**For more details**, check component source files - all have extensive JSDoc comments with examples!
