# CareerCopilot Web Application - Wireframe Summary

**Design System:** Electric Alchemist v5.0 (Fixed-Fluid Architecture)
**Frontend Framework:** React + Tailwind CSS v4 + Vite
**Layout Model:** Fixed Sidebar + Fluid Content Area
**Date:** Updated Dec 22, 2025

---

## 📐 Application Layout Structure

### Global Layout (ProtectedLayout)

The application uses a **Fixed-Fluid Architecture** to ensure stable navigation and responsive content scaling.

- **Sidebar (Fixed):**
  - **Width:** `280px` (Desktop), `0px` (Mobile/Hidden)
  - **Position:** Fixed (`fixed left-0 top-0 h-screen`)
  - **Z-Index:** `z-40`
  - **Theme:** Dark Muted Background (`bg-muted / #1E1E1E`) with Border (`border-border`)
  - **Behavior:**
    - Desktop: Always visible
    - Mobile: Hidden by default, toggled via Hamburger menu (Slide-over drawer)

- **Main Content Area (Fluid):**
  - **Offset:** `lg:ml-[280px]` (Desktop), `md:ml-[72px]` (Tablet), `ml-0` (Mobile)
  - **Container:** `w-full max-w-[1600px]` (standardized max-width)
  - **Padding:** Fluid padding `p-6 md:p-10 lg:p-12`
  - **Alignment:** Left-aligned (no `mx-auto` centering issues)
  - **Background:** `bg-[#121212]` (Surface Dim) with Texture Overlay

---

## 🎨 Visual Design System (Electric Alchemist)

### Color Palette (Tailwind v4 Theme)

- **Backgrounds:**
  - `bg-background` -> `#121212` (Deep Void)
  - `bg-surface-container` -> `#2C2C2C` (Cards)
  - `bg-muted` -> `#1E1E1E` (Sidebar/Panels)
- **Accents:**
  - `text-primary` -> `#8A9A5B` (Sage Green) - _Growth/Success_
  - `text-destructive` -> `#E2725B` (Terracotta) - _Urgent/Action_
  - `text-hologram` -> `#D0BCFF` (Electric Violet) - _AI/Magic_
- **Typography:**
  - **Headings:** `Plus Jakarta Sans` (ExtraBold 800)
  - **Body:** `Plus Jakarta Sans` (Regular 400)
  - **Data/Code:** `JetBrains Mono` (Monospace)

---

## 🔐 Authentication Components

### 1. Login / Register (`/login`, `/register`)

**Layout:** Centered Floating Card

- **Background:** `bg-background` with large animated blur orbs (`primary/20`)
- **Container:** `max-w-md` centered vertically and horizontally
- **Card:** Glassmorphism effect (`backdrop-blur-md`, `bg-surface-container/50`)
- **Content:**
  - **Header:** "Welcome Back" / "Create Account" with Logo
  - **Form:** Email, Password, (Name for Register)
  - **Actions:** Primary Submit Button + Google OAuth Button
  - **Footer:** Toggle link between Sign In and Sign Up

---

## 🏠 Key Page Wireframes

### 2. Dashboard (`/dashboard`)

**Layout:** Grid-based Dashboard

- **Header:** "Welcome back" with quick action buttons
- **Metrics Grid:** 4-card row displaying:
  - Total Applications
  - Interviews Scheduled
  - Profile Views
  - Response Rate
- **Recent Activity:** Feed of recent document edits and job saves
- **Smart Suggestions:** AI-driven next steps card

### 3. Documents (`/documents`)

**Layout:** Filterable Grid

- **Header:** Electric Alchemist Typography (`Your Documents`)
- **Controls:** Search Bar + Filter Tabs (Resumes, Cover Letters, KSC) + "New Document" Button
- **Content:** Responsive Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`)
- **Card:** `DocumentCard` with thumbnail preview, status badge, and action menu.

### 4. Analysis (`/analysis`)

**Layout:** Dashboard View

- **Header:** "Performance Analysis" with Upload Action
- **ATS Scorecard:** Central gauge showing overall match score
- **Breakdown:** 4-quadrant grid showing:
  - Keyword Matching
  - Formatting Check
  - Experience Impact
  - Skills Gap
- **Recommendations:** List of AI-generated improvement tips.

### 5. Application Tracker (`/tracker`)

**Layout:** Kanban / List Hybrid

- **Header:** "Application Tracker"
- **View Toggle:** Kanban Board vs List View buttons
- **Filters:** Search applications by company, role, or status
- **Kanban Columns:**
  - Wishlist
  - Applied
  - Interviewing
  - Offer
  - Rejected
- **Card:** `ApplicationCard` with company logo, drag handle, and "Last Updated" tag.

### 6. KSC Generator (`/ksc-generator`)

**Layout:** Multi-step Wizard

- **Step 1:** Paste selection criteria from job ad.
- **Step 2:** Input STAR method notes (Situation, Task, Action, Result).
- **Step 3:** AI Generation & Review (Copy to clipboard).
- **UI:** Progress stepper, large text areas, split-screen preview.

### 7. Opportunities (`/opportunities`)

**Layout:** Feed / List

- **Header:** "Job Opportunities"
- **Search:** "Search opportunities..." input with filters
- **List:** Vertical stack of `JobMatchCard` components
- **Match Score:** AI-calculated compatibility percentage prominence.

### 8. Settings (`/settings`)

**Layout:** Tabbed Configuration

- **Header:** "Settings"
- **Sections (Stacked Cards):**
  - **Profile Information:** Name, Email, Bio inputs with "Save" action.
  - **Preferences:** Dark Mode toggle, Language selector.
  - **Notifications:** Email / Marketing toggle switches.
  - **Danger Zone:** Delete Account with destructive styling (`bg-destructive/10`).

---

## 🚧 Planned / Missing Pages (Gap Analysis)

### 9. Asset Library (`/asset-library`)

**Status:** ⭕ Linked in Sidebar but Missing in Router
**Layout:** Grid Gallery

- **Header:** "Asset Library" (Upload Button)
- **Content:** Grid of uploaded files (PDFs, Images, Certifications)
- **Card:** Preview thumbnail with file type icon and "Copy Link" action.

### 10. Landing Page (`/`)

**Status:** ⭕ Currently redirects to Login
**Layout:** Marketing Hero

- **Sections:** Hero Value Prop, Features Grid, Testimonials, Pricing, Footer.

### 11. Profile View (`/profile`)

**Status:** ⭕ Missing (Edit only in Settings)
**Layout:** Public Profile Layout

- **Header:** Banner, Avatar, Name, Title.
- **Body:** Timeline of Experience, Skills Tags, Badge Showcase.

### 12. 404 Not Found

**Status:** ⭕ Redirects to Dashboard (Improvement needed)
**Layout:** Central Hero Illustration

- **Content:** "Lost in Space" illustration, "Return Home" button.

---

**Status:**

- ✅ **Layout Engine:** Fixed (Tailwind v4 / Fixed-Fluid)
- ✅ **Theme:** Active (Electric Alchemist Dark Mode)
- ✅ **Core Pages:** Implemented (Dashboard, Documents, Tracker, KSC, Analysis, Settings)
- ✅ **Auth:** Implemented (Login/Register flow)
- ⚠️ **Assets:** Placeholder images in use
- ⚠️ **Gaps:** Asset Library, Public Landing, 404 Page
