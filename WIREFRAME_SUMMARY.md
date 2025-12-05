# CareerCopilot Web Application - Wireframe Summary

**Design System:** Electric Alchemist v4.4 (Expressive Cyber-Pop)  
**Layout Framework:** AppShell with fixed sidebar (desktop) / responsive mobile  
**Date:** Generated from codebase analysis

---

## 📐 Application Layout Structure

### Global Layout (AppShell)
- **Sidebar (Desktop):**
  - Fixed left sidebar (280px width)
  - Asymmetric border radius: `0 28px 28px 0`
  - Background: `bg-surface-container`
  - Hidden on mobile, visible on `lg:` breakpoint (1024px+)
  - Contains navigation menu with main navigation items

- **Main Content Area:**
  - Full-width on mobile
  - Left margin on desktop: `lg:ml-[280px]` (280px offset for sidebar)
  - Background: `bg-surface`
  - Padding: `p-8`
  - Scrollable content area

- **Navigation Structure:**
  - Main Navigation: Home, Documents, Career Tools, Career Growth
  - User Navigation: Profile, Settings, Subscription, Help & Support, Sign Out
  - Nested navigation items with icons (lucide-react)

---

## 🔐 Public Pages (Unauthenticated)

### 1. Login Page (`/login`)
**Layout:** Centered card on full-screen background

**Components:**
- **Container:** `Container` component (size: `sm`, max-width constrained)
- **Card:** Single centered card (`Card` variant: `default`)
- **Header:**
  - H1: "Career Copilot" (text-hero)
  - Subtitle: "Sign in to your account" (text-ai, text-outline)
- **Form Fields:**
  - Email input (`Input` component)
  - Password input (`Input` component)
  - Field-level error messages
- **Actions:**
  - Submit button (`Button` variant: `default`, size: `lg`, full-width)
  - Loading state with skeleton spinner
  - Link to Register page
- **Error Handling:**
  - Alert component for general errors (`Alert` variant: `error`)
  - Inline field validation errors

**Layout Pattern:**
```
┌─────────────────────────────┐
│                             │
│      [Centered Card]        │
│   ┌───────────────────┐     │
│   │ Career Copilot   │     │
│   │ Sign in...       │     │
│   │                  │     │
│   │ Email: [____]    │     │
│   │ Password: [___]  │     │
│   │                  │     │
│   │ [Sign In Button] │     │
│   │                  │     │
│   │ Sign up link     │     │
│   └───────────────────┘     │
│                             │
└─────────────────────────────┘
```

---

### 2. Register Page (`/register`)
**Layout:** Centered card on full-screen background (similar to Login)

**Components:**
- **Container:** `Container` component (size: `sm`)
- **Card:** Single centered card (`Card` variant: `default`)
- **Header:**
  - H1: "Career Copilot" (text-hero)
  - Subtitle: "Create your account" (text-ai, text-outline)
- **Form Fields:**
  - Display Name input
  - Email input
  - Password input
  - Confirm Password input
  - Field-level error messages
- **Actions:**
  - Submit button (`Button` variant: `default`, size: `lg`, full-width)
  - Loading state with skeleton spinner
  - Link to Login page
- **Error Handling:**
  - Alert component for general errors
  - Inline field validation errors

**Layout Pattern:** Same as Login page with additional form fields

---

## 🏠 Protected Pages (Authenticated)

### 3. Dashboard Page (`/dashboard`)
**Layout:** Full-width container with vertical sections

**Components:**
- **Container:** `Container` component (size: `2xl`)
- **Welcome Banner Card:**
  - Personalized greeting: "Welcome back, {userName}!"
  - Subtitle text
  - Action buttons: "Create New Document", "View Analytics"
  - Decorative icon (Sparkles)
- **Quick Actions Section:**
  - Section header: "Quick Actions"
  - 3-column grid (`Grid` cols={3}):
    - **Create New Document Card:**
      - Icon (FileText)
      - Title: "Create New Document"
      - Description text
      - "Start Creating" button
    - **Find Job Opportunities Card:**
      - Icon (Target)
      - Title: "Find Job Opportunities"
      - Description text
      - "Browse Jobs" button
    - **Track Applications Card:**
      - Icon (TrendingUp)
      - Title: "Track Applications"
      - Description text
      - "View Tracker" button
- **Your Profiles Section:**
  - Section header: "Your Profiles" with "New Profile" button
  - 3-column grid of profile cards (`ProfileCard` components)
  - Each profile card shows:
    - Name and role
    - ATS Score
    - Active applications count
    - Last updated timestamp
    - Edit/Delete actions
  - "Create Profile" card (`CreateProfileCard`)
- **Job Search Intelligence Card:**
  - Large card with border highlight
  - Header with icon (Brain) and title
  - 4-column stats grid:
    - Applications stat card
    - Interviews stat card
    - Response Rate stat card
    - Avg ATS Score stat card

**Empty State:**
- Centered card with icon (Brain)
- Title: "Ready to Launch Your Career?"
- Description text
- "Create Your First Document" button

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ [Welcome Banner Card]                   │
│ ┌─────────────────────────────────────┐ │
│ │ Welcome back, {userName}!           │ │
│ │ [Create] [View Analytics]           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Quick Actions                           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Create   │ │ Find     │ │ Track    │ │
│ │ Document │ │ Jobs     │ │ Apps     │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ Your Profiles          [+ New Profile]  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Profile  │ │ Profile  │ │ [+ New]  │ │
│ │ Card     │ │ Card     │ │          │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ [Job Search Intelligence Card]         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │ Apps │ │ Int. │ │ Resp │ │ ATS  │   │
│ └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────┘
```

---

### 4. Documents Page (`/documents`)
**Layout:** Full-width container with tabs

**Components:**
- **Container:** `Container` component (size: `lg`)
- **Header:**
  - H1: "Documents" (text-hero, text-3xl)
  - Action button: "New Document" (with Plus icon)
- **Search & Filter Bar:**
  - Search input (full-width, flex-1)
  - Filter button (with Filter icon)
- **Tabs Component:**
  - Tab 1: "All" - 3-column grid of document cards
  - Tab 2: "Resumes" - 3-column grid of resume cards
  - Tab 3: "Cover Letters" - 3-column grid of cover letter cards
  - Tab 4: "KSC" - 3-column grid of KSC document cards
- **Document Cards:**
  - Icon (FileText, 12x12)
  - Document name (text-hero, text-lg)
  - Last modified timestamp (text-data, text-xs)

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ Documents              [+ New Document]  │
│                                         │
│ [Search...] [Filters]                   │
│                                         │
│ [All] [Resumes] [Cover Letters] [KSC]  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Doc 1   │ │ Doc 2    │ │ Doc 3    │ │
│ │ 📄      │ │ 📄       │ │ 📄       │ │
│ │ Last: 2d│ │ Last: 1d │ │ Last: 3d │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Doc 4    │ │ Doc 5    │ │ Doc 6    │ │
│ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
```

---

### 5. Analysis Page (`/analysis`)
**Layout:** Full-width container with summary cards and tabs

**Components:**
- **Container:** `Container` component (size: `xl`)
- **Header:**
  - H1: "Document Analysis" (text-hero, text-3xl)
  - Action button: "Run New Analysis" (with Assessment icon, loading state)
  - Subtitle text
- **Summary Cards Grid (4 columns):**
  - Average ATS Score card (with Speed icon)
  - Score Improvement card (with TrendingUp icon)
  - Documents Analyzed card (with Timeline icon)
  - Optimized Documents card (with CheckCircle icon)
- **Tabs Component:**
  - **Tab 1: "Recent Analysis"**
    - List of analysis report cards
    - Each card shows:
      - Document type icon
      - Document name with badge
      - Keywords and skills count
      - ATS Score progress bar
      - Status icon
      - "View Report" button
  - **Tab 2: "Performance Trends"**
    - 2-column grid:
      - Score Trends card (with BarChart placeholder)
      - Document Types card (with PieChart placeholder)
  - **Tab 3: "Insights"**
    - 3-column grid (2 cols + 1 col):
      - Large card with 3 alert components (Strong Performance, Areas for Improvement, Trending Keywords)
      - Quick Actions card with buttons (Re-analyze, Export, Share)

**Empty State:**
- Centered card with Analytics icon
- Title: "No Analysis Available"
- Description text
- "Run First Analysis" button
- Badge list showing what gets analyzed

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ Document Analysis    [Run New Analysis] │
│                                         │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│ │85% │ │+12%│ │15  │ │ 8  │            │
│ └────┘ └────┘ └────┘ └────┘            │
│                                         │
│ [Recent] [Trends] [Insights]          │
│ ┌─────────────────────────────────────┐ │
│ │ 📄 Senior Dev Resume               │ │
│ │ 12 keywords • 8 skills             │ │
│ │ [Progress: 85%]                    │ │
│ │ [View Report]                       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 6. Opportunities Page (`/opportunities`)
**Layout:** Full-width container with job listing

**Components:**
- **Container:** `Container` component (size: `lg`)
- **Header:**
  - H1: "Job Opportunities" (text-hero, text-3xl)
  - Action button: "Filter Jobs"
- **Search Bar:**
  - Search input (full-width)
- **Job Cards Grid:**
  - Single column grid (`Grid` cols={1})
  - `JobCard` components (from `@/features/jobs/JobCard`)
  - Each job card shows:
    - Job title
    - Company name
    - Location
    - Job type
    - Skills tags
    - Description preview

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ Job Opportunities      [Filter Jobs]     │
│                                         │
│ [Search jobs...]                        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Senior Software Engineer             │ │
│ │ Tech Corp • San Francisco, CA        │ │
│ │ Full-time • Remote                    │ │
│ │ Skills: React, TypeScript, Node.js   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 7. KSC Generator Page (`/ksc-generator`)
**Layout:** Centered container with form

**Components:**
- **Container:** `Container` component (size: `lg`)
- **Header:**
  - H1: "KSC Generator" (text-hero, text-3xl)
- **Card:**
  - Single card (`Card` variant: `default`)
  - Textarea component:
    - Label: "Selection Criteria"
    - Placeholder text
    - 10 rows
  - Button: "Generate Response" (variant: `default`)

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ KSC Generator                           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Selection Criteria:                  │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │                                 │ │ │
│ │ │ [Enter selection criteria...]   │ │ │
│ │ │                                 │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │                                       │ │
│ │ [Generate Response]                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 8. Asset Library Page (`/asset-library`)
**Layout:** Full-width container with grid

**Components:**
- **Container:** `Container` component (size: `lg`)
- **Header:**
  - H1: "Asset Library" (text-hero, text-3xl)
  - Action button: "Upload Asset"
- **Asset Grid:**
  - 4-column grid (`Grid` cols={4})
  - Asset cards (`Card` variant: `interactive`)
  - Each card shows:
    - Icon (FileText, 12x12)
    - Asset name (text-hero, text-lg)
    - Upload timestamp (text-data, text-xs)

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ Asset Library          [Upload Asset]   │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │Asset1│ │Asset2│ │Asset3│ │Asset4│   │
│ │📄    │ │📄    │ │📄    │ │📄    │   │
│ │1d ago│ │2d ago│ │3d ago│ │4d ago│   │
│ └──────┘ └──────┘ └──────┘ └──────┘   │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │Asset5│ │Asset6│ │Asset7│ │Asset8│   │
│ └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────┘
```

---

### 9. Settings Page (`/settings`)
**Layout:** Full-width container with tabs

**Components:**
- **Container:** `Container` component (size: `lg`)
- **Header:**
  - H1: "Settings" (text-hero, text-3xl)
- **Tabs Component:**
  - **Tab 1: "Profile"**
    - Card with form fields:
      - First Name input
      - Last Name input
      - Email input
      - Bio textarea
      - "Save Changes" button
  - **Tab 2: "Preferences"**
    - Card with toggle switches:
      - Dark Mode switch
      - Email Notifications switch
  - **Tab 3: "Notifications"**
    - Card with toggle switches:
      - Application Updates switch
      - Job Matches switch
  - **Tab 4: "Security"**
    - Card with form fields:
      - Current Password input
      - New Password input
      - Confirm New Password input
      - "Update Password" button

**Layout Pattern:**
```
┌─────────────────────────────────────────┐
│ Settings                                │
│                                         │
│ [Profile] [Preferences] [Notifications] │
│          [Security]                     │
│ ┌─────────────────────────────────────┐ │
│ │ Profile Settings                    │ │
│ │                                     │ │
│ │ First Name: [____]                  │ │
│ │ Last Name: [____]                   │ │
│ │ Email: [____]                       │ │
│ │ Bio: [____]                         │ │
│ │                                     │ │
│ │ [Save Changes]                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🧪 Development/Test Pages

### 10. Electric Alchemist Test Kitchen (`/electric-alchemist`)
**Layout:** Full-width showcase page

**Components:**
- **Header Section:**
  - H1: "Electric Alchemist" (text-hologram)
  - Subtitle: "Design System v4.2" (text-hero)
  - Description text (text-ai)
- **Typography Showcase:**
  - 4-tier typography matrix (Hologram, Hero, Human, Data)
  - Cards demonstrating each tier
- **Button Showcase:**
  - All 5 button variants
  - Tactile press physics demonstrations
- **Card Showcase:**
  - Bento layout examples
  - Pop-Out graphics
  - Interactive variants
- **Component Library:**
  - Comprehensive visual audit of all design system components

**Purpose:** Design system documentation and visual testing

---

### 11. M3 Integration Test Page (`/m3-integration-test`)
**Layout:** Full-width test page

**Components:**
- **M3 Component Showcase:**
  - Buttons, Inputs, Selects
  - Cards, Modals, Dialogs
  - Menus, Tabbars, Breadcrumbs
  - Steppers, Pagination
  - Tables, Lists
  - Badges, Chips
  - Progress, Alerts, Snackbars
  - Tooltips, Loaders, Spinners
  - Skeletons, Date/Time pickers
  - Sliders, Autocomplete, Multiselect
- **Interactive States:**
  - Modal open/close
  - Dialog open/close
  - Snackbar notifications
  - Tab switching
  - Pagination
  - Form inputs

**Purpose:** Integration testing and visual verification of M3 components

---

## 🎨 Design System Components Used

### Core Components
- **Container:** Responsive container with size variants (`sm`, `lg`, `xl`, `2xl`)
- **Card:** Multiple variants (`default`, `interactive`, `hero`, `pop-out`)
- **Button:** 5 variants (`default`, `outline`, `ghost`, `tonal`, `text`) with sizes (`sm`, `md`, `lg`)
- **Input:** Text inputs with validation states
- **Textarea:** Multi-line text inputs
- **Grid:** Responsive grid system with column and gap controls
- **Tabs:** Tab navigation component
- **Badge:** Status indicators
- **Alert:** Notification messages
- **Progress:** Progress bars
- **Skeleton:** Loading placeholders

### Layout Components
- **AppShell:** Main application layout with sidebar
- **Navigation:** Sidebar navigation menu
- **ProtectedRoute:** Authentication guard wrapper

### Feature Components
- **ProfileCard:** Profile display card with actions
- **CreateProfileCard:** Empty state card for creating profiles
- **JobCard:** Job listing card component

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Fixed sidebar visible (280px width)
- Main content offset by sidebar width
- Multi-column grids (2-4 columns)
- Full navigation menu visible

### Mobile (<1024px)
- Sidebar hidden
- Main content full-width
- Single column layouts
- Collapsible navigation (if implemented)
- Stacked form elements

---

## 🎯 Navigation Structure

### Main Navigation (Sidebar)
1. **Home** → `/dashboard`
2. **Documents** → `/documents`
   - Upload New
   - My Resumes
   - Cover Letters
   - Recent
3. **Career Tools** → `/career-tools`
   - Resume Builder
   - ATS Analysis
   - Job Matching
   - Interview Prep
4. **Career Growth** → `/career-growth`
   - Career Hub
   - Skills
   - Industry Insights
   - Salary Data

### User Navigation (Sidebar)
- Profile → `/profile`
- Settings → `/settings`
- Subscription → `/subscription`
- Help & Support → `/help`
- Sign Out → `/logout`

### Direct Routes
- `/login` - Login page
- `/register` - Registration page
- `/analysis` - Analysis page
- `/opportunities` - Opportunities page
- `/ksc-generator` - KSC Generator page
- `/asset-library` - Asset Library page
- `/electric-alchemist` - Test Kitchen (public)
- `/m3-integration-test` - M3 Test Page (public)

---

## 🎨 Visual Design Patterns

### Color System
- **Primary:** Deep Violet tones
- **Secondary:** Accent colors
- **Tertiary:** Highlight colors
- **Surface:** Background layers (surface, surface-container, surface-container-high)
- **On-Surface:** Text colors (on-surface, on-surface-variant, outline)

### Typography Hierarchy
- **Hologram:** Display text (Nabla Color Font)
- **Hero:** Headings (Roboto Flex, Ultra-Wide)
- **Human:** Body text (Roboto Serif)
- **Data:** Labels, metadata (Roboto Flex, condensed)

### Shape System
- **Asymmetric Radii:** `0 28px 28px 0` for sidebar
- **Card Radius:** Standard rounded corners
- **Interactive Elements:** Hover states with elevation

### Motion System
- **Tactile Press:** Button interactions
- **Transitions:** Standard easing curves
- **Animations:** Loading states, transitions

---

## 📊 Page Summary Table

| Page | Route | Auth Required | Main Purpose | Key Components |
|------|-------|---------------|--------------|----------------|
| Login | `/login` | No | User authentication | Form, Input, Button, Alert |
| Register | `/register` | No | User registration | Form, Input, Button, Alert |
| Dashboard | `/dashboard` | Yes | Overview & quick actions | Cards, Grid, ProfileCards, Stats |
| Documents | `/documents` | Yes | Document management | Tabs, Grid, Cards, Search |
| Analysis | `/analysis` | Yes | ATS analysis & insights | Tabs, Cards, Progress, Charts |
| Opportunities | `/opportunities` | Yes | Job listings | JobCards, Search, Filter |
| KSC Generator | `/ksc-generator` | Yes | KSC response generation | Textarea, Button, Card |
| Asset Library | `/asset-library` | Yes | Asset management | Grid, Cards, Upload |
| Settings | `/settings` | Yes | User preferences | Tabs, Forms, Switches |
| Test Kitchen | `/electric-alchemist` | No | Design system showcase | All components |
| M3 Test | `/m3-integration-test` | No | Component integration test | M3 components |

---

## 🔄 User Flow Patterns

### Authentication Flow
1. User lands on `/` → Redirects to `/login` or `/dashboard` based on auth state
2. Login/Register → Form submission → Redirect to `/dashboard`
3. Protected routes check authentication via `ProtectedRoute` wrapper

### Main Application Flow
1. **Dashboard** → Overview and quick actions
2. **Documents** → Create/manage resumes, cover letters, KSC responses
3. **Analysis** → Run ATS analysis on documents
4. **Opportunities** → Browse and apply to jobs
5. **Settings** → Configure preferences and profile

### Document Workflow
1. Create document (Dashboard or Documents page)
2. Edit document content
3. Run analysis (Analysis page)
4. View recommendations and optimize
5. Export or share document

---

## 📝 Notes

- All pages use the Electric Alchemist Design System v4.4
- Components are built with TypeScript and React
- Responsive design with mobile-first approach
- Accessibility features: ARIA labels, keyboard navigation, screen reader support
- Loading states and error handling implemented throughout
- Empty states provided for better UX when no data is available

---

**Document Version:** 1.0  
**Last Updated:** Generated from codebase analysis  
**Design System:** Electric Alchemist v4.4 (Expressive Cyber-Pop)



