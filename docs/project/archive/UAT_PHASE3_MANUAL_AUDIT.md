# UAT Phase 3: Visual & UX Audit
**Generated:** January 4, 2026, 2:25 PM AEST  
**Status:** Manual Testing Required  
**Method:** Guided Visual Inspection Checklist

---

## ⚠️ **BROWSER AUTOMATION UNAVAILABLE**

Due to technical limitations with the Antigravity Browser Extension, Phase 3 requires **manual user testing**. This document provides a comprehensive checklist for visual and UX auditing.

---

## 📋 **MANUAL TESTING CHECKLIST**

### **PREREQUISITES**
- [ ] Frontend running: `http://localhost:5173` ✅ (Confirmed running)
- [ ] Backend running: Docker container `careercopilot-backend-1` ✅ (Confirmed healthy)
- [ ] Browser: Chrome/Edge (for best DevTools support)
 [ ] Screen sizes tested: Mobile (375px), Tablet (768px), Desktop (1920px)

---

## 🎨 **PHASE 3A: M3 VISUAL INTEGRITY AUDIT**

### **Test 1: Landing Page (`/`) - M3 Compliance**

#### Visual Elements to Verify:
- [ ] **Gradient Blobs:** 4 animated background blobs visible
- [ ] **Plant Assets:** 4 plant images positioned correctly (monstera, snake plant, fiddle leaf, pilea)
- [ ] **Typography:** Hero title uses Plus Jakarta Sans (not Arial/Helvetica)
- [ ] **Buttons:** 3 visible - "Sign In" (filled), "Register" (outlined), "Explore as Guest" (outlined, slightly transparent)
- [ ] **Colors:** Vibrant, not generic (check for "Electric Alchemist" palette)
- [ ] **Elevation:** Hero card has visible shadow (depth effect)
- [ ] **M3 Star:** ✦ decoration visible

#### Specific Tests:
1. **Hover "Sign In" button:** Should show scale animation and subtle glow
2. **Hover "Explore as Guest":** Should show same hover effect
3. **Resize to mobile (375px):** Layout should stack vertically, blobs remain subtle
4. **Check typography:** Open DevTools > Font should show "Plus Jakarta Sans, sans-serif"

#### Known Issues from Code:
- ✅ "Explore as Guest" button recently added (verify it renders)

#### Screenshot Checklist:
- [ ] Full landing page (desktop view)
- [ ] Mobile view (if layout breaks)

---

### **Test 2: Dashboard (`/dashboard?demo=true`) - M3 Compliance**

#### Critical Path:
1. Click "Explore as Guest" from landing page
2. Should navigate to `/dashboard?demo=true`
3. Should load without login prompt

#### Visual Elements to Verify:
- [ ] **4 StatCards render:**
  - Active Applications (metric display)
  - Interviews Scheduled
  - Offers Received
  - Response Rate
- [ ] **StatCard Shapes:** Organic rounded corners (not perfect rectangles)
- [ ] **Plant Banner:** `plant-banner.png` visible in background
- [ ] **Staggered Animation:** Cards should appear one by one (not all at once)
- [ ] **Profile Cards:** 3 mock profile cards displayed
- [ ] **Quick Action Buttons:** Plus, FileText, TrendingUp, Plug icons

#### Specific Tests:
1. **Animation Timing:** First card appears immediately, subsequent cards stagger by ~100-150ms
2. **Hover StatCard:** Should show subtle elevation change
3. **Responsive Test:** Switch to tablet view (768px) - should show 2-column grid

#### M3 Design Tokens to Verify:
- Background: `bg-[#141218]` (dark purple-gray)
- Text: `text-[#E6E1E5]` (off-white)
- Cards: Organic shapes, not sharp corners

#### Screenshot Checklist:
- [ ] Full dashboard (desktop)
- [ ] Animation sequence (screen recording if possible)

---

### **Test 3: Job Queue (`/job-queue`) - M3 Component Audit**

#### Visual Elements to Verify:
- [ ] **M3Card:** Pebble variant (32px rounded corners)
- [ ] **StatusBadge:** 3 variants visible:
  - "Pending Analysis" (neutral, with dot indicator)
  - "Ready to Apply" (secondary)
  - "Applied" (primary)
- [ ] **M3Button States:**
  - Filled primary: "Analyze with JobScout"
  - Filled secondary: "Draft Application"
  - Outlined: "View Job"
- [ ] **Typography:** M3 scale (text-title-large, text-body-large, etc.)
- [ ] **Elevation:** Cards have `shadow-elevation-1`, hover shows `shadow-elevation-2`

#### Specific Tests:
1. **StatusBadge Color Contrast:**
   - Use browser DevTools > Lighthouse > Accessibility
   - All badges should meet WCAG AA contrast ratio (4.5:1 minimum)

2. **Button Hover Effects:**
   - Hover "Analyze with JobScout": Should scale slightly, show ripple
   - Disabled state: Cursor should be `not-allowed`, button grayed out

3. **Loading State:**
   - If a job is in "Pending Analysis", click "Analyze"
   - Button should show spinner and text "Analyzing..."
   - Button remains disabled during loading

4. **Cover Letter Modal:**
   - If a job is "Ready to Apply", click "Draft Application"
   - Modal should appear with:
     * M3Card tech variant
     * Elevated shadow (`shadow-elevation-4`)
     * "Copy to Clipboard" button
     * Close button (X icon)
   - Click "Copy": Button text changes to "Copied!" for 2 seconds
   - Press Esc or click backdrop: Modal should close

#### Text Clipping Check:
- [ ] **Long Job Titles:** If any job title is >50 characters, verify it doesn't clip inside the pebble corners
- [ ] **Company Names:** Check for similar clipping
- [ ] **Notes Field:** If present, ensure text wraps correctly within `bg-surface-container-high` container

#### Screenshot Checklist:
- [ ] Empty state (if no jobs)
- [ ] Job cards with all 3 status variants
- [ ] Cover letter modal open
- [ ] Button loading state
- [ ] Badge contrast (Lighthouse report)

---

### **Test 4: Opportunities (`/opportunities`) - Form & Results UX**

#### Visual Elements to Verify:
- [ ] **PageHeader:** "Job Scout" title with "Opportunities" highlighted
- [ ] **Form Container:** Rounded-tech shape, border-outline-variant, shadow-elevation-1
- [ ] **Input Fields:** 2 visible:
  - Role/Keyword (with Briefcase icon)
  - Location (with MapPin icon)
- [ ] **Start Scout Button:** Rounded-full, primary background, uppercase text
- [ ] **Noise Texture:** Subtle noise overlay on form container (barely visible)

#### Specific Tests:
1. **Form Interaction:**
   - Click into "Role / Keyword" input
   - Should show focus ring (2px primary color)
   - Type "Software Engineer"
   - Verify text is readable (good contrast)

2. **Scout Button States:**
   - **Default:** `bg-primary text-on-primary`
   - **Hover:** Should scale to 105%, shadow increases
   - **Click:** Click "Start Scout"
   - **Loading:** Button text changes to "Scouting...", Sparkles icon spins
   - **Disabled:** Background changes to `bg-surface-disabled`

3. **Results Display:**
   - If search succeeds, job match cards appear
   - Each card should have:
     * M3 rounded-pebble shape
     * `border-outline-variant`
     * Hover effect: border changes to `border-primary/50`, left accent border appears
     * Title: "Job Match #1, #2, etc."
     * External link with link icon
     * 2 labels: "Detected via Search", "Analysis Pending"

4. **Empty State:**
   - Before searching, should show:
     * Sparkles icon (large, centered, opacity 50%)
     * "Ready to find your next role." text

5. **Error Handling:**
   - If backend is down, should show error message:
     * "Failed to scout jobs. Ensure backend is running."
     * Message should be visible but not alarming (not red error box)

#### Screenshot Checklist:
- [ ] Form controls (desktop)
- [ ] Button hover state
- [ ] Results cards (if data available)
- [ ] Empty state
- [ ] Error state (if backend stopped)

---

### **Test 5: Application Tracker (`/tracker`) - Decorative Assets**

#### Visual Elements to Verify:
- [ ] **PageHeader:** "Application Tracker" with "Tracker" highlighted
- [ ] **Hanging Plant:** Top-right corner decoration
  - Image: `hanging-plant.jpg`
  - Opacity: 60%
  - Mix-blend-mode: screen
  - Should have gradient mask (fades from top to bottom)
- [ ] **ApplicationCard Components:** 4 mock applications visible
- [ ] **Progress Tracker:** Each card shows 5-step pipeline
- [ ] **"+ Add New Application" Button:** Full-width, dashed border, hover effect

#### Specific Tests:
1. **Hanging Plant Positioning:**
   - Should NOT cover PageHeader text
   - Should frame the page artistically
   - Gradient mask should make bottom invisible

2. **ApplicationCard Shapes:**
   - Cards should use `rounded-pebble` (organic corners)
   - Spacing between cards: consistent rhythm

3. **Progress Tracker Visual:**
   - 5 steps labeled: Applied → Screening → Interview → Offer → Accepted
   - Current step should be highlighted
   - Completed steps should be checked or filled

4. **Hover "+ Add New Application":**
   - Border color changes to `border-primary/50`
   - Background lightens to `bg-surface-container`

#### Screenshot Checklist:
- [ ] Full page with hanging plant visible
- [ ] ApplicationCard detail
- [ ] Hover on "Add New" button

---

### **Test 6: Settings (`/settings`) - Tabbed Interface**

#### Visual Elements to Verify:
- [ ] **Tabs:** TabsList with multiple TabsTriggers
- [ ] **Tab Styling:** M3-compliant (not default Shadcn gray)
- [ ] **Form Inputs:** Inside TabsContent:
  - Input fields
  - Textarea
  - Switch toggles
  - Save/Update buttons

#### Specific Tests:
1. **Tab Navigation:**
   - Click each tab
   - Active tab should be visually distinct (underlined or highlighted)
   - Content area should change

2. **Form Styling:**
   - Inputs should use M3 tokens:
     * `bg-surface-container-high`
     * `border-outline`
     * Focus: `ring-2 ring-primary`

3. **Switch Component:**
   - Toggle should be smooth
   - On state: Primary color
   - Off state: Outline color

#### Screenshot Checklist:
- [ ] Settings page with all tabs visible
- [ ] Active tab highlighted
- [ ] Form inputs in focus state

---

## 🎭 **PHASE 3B: UX FLOW AUDIT**

### **Test 7: Guest User Journey**

#### Complete User Story:
"As a new visitor, I want to explore the app without signing up."

1. **Entry Point:**
   - [ ] Land on `/`
   - [ ] See "Explore as Guest" button clearly
   - [ ] Understand it's a no-signup option

2. **Dashboard Access:**
   - [ ] Click "Explore as Guest"
   - [ ] Navigate to `/dashboard?demo=true` (URL check)
   - [ ] Dashboard loads without login prompt

3. **Feature Exploration:**
   - [ ] Click sidebar items (all should work)
   - [ ] No permission errors or auth redirects

4. **Data Visibility:**
   - [ ] Dashboard shows mock stats
   - [ ] Application Tracker shows mock applications
   - [ ] Job Queue shows clipped jobs (if browser extension used) or empty state

5. **Friction Points:**
   - [ ] Is it clear this is demo data?
   - [ ] Is there a CTA to "Sign up for real account"?
   - [ ] Are any features broken in demo mode?

#### UX Rating Criteria:
| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| **Discoverability** | | Is "Explore as Guest" obvious? |
| **Friction** | | How many clicks to reach features? |
| **Clarity** | | Is demo mode obvious? |
| **Value** | | Does demo showcase app well? |
| **CTA** | | Is there a path to sign up after demo? |

---

### **Test 8: Job Analysis Workflow**

#### Complete User Story:
"As a job seeker, I want to analyze a job posting with AI."

1. **Starting Point:**
   - [ ] Navigate to `/job-queue`
   - [ ] See job cards (if data exists) or empty state

2. **Trigger Analysis:**
   - [ ] Find job with status "Pending Analysis"
   - [ ] Click "Analyze with JobScout" button
   - [ ] Button shows loading spinner

3. **Wait for Result:**
   - [ ] Analysis completes (Watch network tab for API call)
   - [ ] Status badge changes to "Ready to Apply"
   - [ ] Success feedback shown (toast notification expected)

4. **Review Results:**
   - [ ] Can user see what was analyzed?
   - [ ] Are keywords or match scores displayed?

5. **Friction Points:**
   - [ ] How long does analysis take?
   - [ ] Is progress communicated?
   - [ ] What if it fails? Retry option?

#### UX Rating Criteria:
| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| **Speed** | | Time from click to result |
| **Feedback** | | Is user informed of progress? |
| **Value** | | Is result useful/actionable? |
| **Error Handling** | | What happens on failure? |

---

### **Test 9: Cover Letter Generation Workflow**

#### Complete User Story:
"As a job seeker, I want to generate a custom cover letter."

1. **Prerequisites:**
   - [ ] Job status must be "Ready to Apply"
   - [ ] "Draft Application" button visible

2. **Trigger Generation:**
   - [ ] Click "Draft Application"
   - [ ] Button shows loading spinner ("Drafting...")

3. **Review Cover Letter:**
   - [ ] Modal dialog opens
   - [ ] Cover letter text is visible and readable
   - [ ] Modal shows job title and company name

4. **Copy to Clipboard:**
   - [ ] Click "Copy to Clipboard" button
   - [ ] Button text changes to "Copied!" (2-second confirmation)
   - [ ] Paste in external text editor - verify content copied correctly

5. **Close Dialog:**
   - [ ] Click "Close" button - dialog dismisses
   - [ ] Click X icon - dialog dismisses
   - [ ] Click backdrop (outside modal) - dialog dismisses
   - [ ] Press Esc key - dialog dismisses

6. **Friction Points:**
   - [ ] Can user edit the cover letter before copying?
   - [ ] Can user save it for later?
   - [ ] What if generation fails?

#### UX Rating Criteria:
| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| **Speed** | | Time to generate |
| **Quality** | | Is content relevant/useful? |
| **Flexibility** | | Can user edit/save? |
| **Ease of Use** | | Intuitive controls? |

---

### **Test 10: JobScout Search Workflow**

#### Complete User Story:
"As a job seeker, I want to find jobs autonomously."

1. **Enter Search Criteria:**
   - [ ] Navigate to `/opportunities`
   - [ ] Input: "Software Engineer" (role)
   - [ ] Input: "Melbourne" (location)

2. **Run Search:**
   - [ ] Click "Start Scout"
   - [ ] Button shows "Scouting..." with spinner

3. **Review Results:**
   - [ ] Results appear as job match cards
   - [ ] Each result shows: URL, title, labels
   - [ ] External link opens in new tab

4. **Test Edge Cases:**
   - [ ] Leave role empty - what happens?
   - [ ] Enter very long role (200 chars) - does it break?
   - [ ] Enter special characters - handled gracefully?

5. **Friction Points:**
   - [ ] How long does search take?
   - [ ] Are results useful/relevant?
   - [ ] Can user refine search?
   - [ ] What if no results found?

#### UX Rating Criteria:
| Criteria | Score (1-5) | Notes |
|----------|-------------|-------|
| **Speed** | | Time to results |
| **Relevance** | | Quality of found jobs |
| **Ease** | | Intuitive search form? |
| **Error Handling** | | What if search fails? |

---

## 📐 **PHASE 3C: RESPONSIVE DESIGN AUDIT**

### **Test 11: Breakpoint Testing**

| Screen Size | Width (px) | Expected Behavior | Visual Check |
|-------------|------------|-------------------|--------------|
| **Mobile** | 375 | Single column layout | [ ] |
| **Mobile (landscape)** | 667 | Adjusted spacing | [ ] |
| **Tablet** | 768 | 2-column grid | [ ] |
| **Desktop** | 1920 | 3-column grid (where applicable) | [ ] |
| **4K** | 2560 | Max-width container, centered | [ ] |

#### Specific Tests per Breakpoint:

**Mobile (375px):**
- [ ] Sidebar collapses to hamburger menu
- [ ] Cards stack vertically (no horizontal scroll)
- [ ] Buttons are touch-friendly (min 44px height)
- [ ] Text remains readable (no tiny fonts)
- [ ] Plant assets don't overlap critical content

**Tablet (768px):**
- [ ] Job Queue shows 2 columns (md:grid-cols-2)
- [ ] Opportunities form stacks vertically
- [ ] Navigation visible or easily accessible

**Desktop (1920px):**
- [ ] Job Queue shows 3 columns (lg:grid-cols-3)
- [ ] Max-width: 7xl (1280px) with horizontal centering
- [ ] No excessive white space

---

## ♿ **PHASE 3D: ACCESSIBILITY AUDIT**

### **Test 12: Keyboard Navigation**

| Action | Key | Expected Behavior | Result |
|--------|-----|-------------------|--------|
| **Navigate to button** | Tab | Focus visible (ring-2 ring-primary) | [ ] |
| **Activate button** | Enter/Space | Button action triggers | [ ] |
| **Close modal** | Esc | Cover letter dialog dismisses | [ ] |
| **Navigate form fields** | Tab | Sequential focus order | [ ] |
| **Submit form** | Enter (in input) | Form submits | [ ] |

#### Specific Tests:
1. **Tab Order:**
   - [ ] Logical sequence (left-to-right, top-to-bottom)
   - [ ] No focus trapped in modal

2. **Focus Indicators:
   - [ ] All interactive elements show visible focus ring
   - [ ] Focus ring color: Primary (good contrast vs background)

3. **Skip Links:**
   - [ ] "Skip to main content" link available?
   - [ ] Works correctly?

---

### **Test 13: Screen Reader Compatibility**

**Tools:** NVDA (Windows) or VoiceOver (Mac)

| Element | Expected Announcement | Result |
|---------|----------------------|--------|
| **M3Button** | "Button, [text]" | [ ] |
| **StatusBadge** | "[label] status" | [ ] |
| **M3Card** | Readable card content | [ ] |
| **Modal Dialog** | "Dialog, Cover Letter" | [ ] |
| **Form Input** | "Edit text, [label]" | [ ] |

#### Specific Tests:
- [ ] All images have `alt` text (or `alt=""` if decorative)
- [ ] Form inputs have associated labels
- [ ] Error messages announced by screen reader
- [ ] Loading states announced (aria-live="polite")

---

### **Test 14: Color Contrast (Lighthouse)**

1. Open Chrome DevTools > Lighthouse
2. Select "Accessibility" category
3. Run audit on each page:
   - [ ] `/` (Landing)
   - [ ] `/dashboard?demo=true`
   - [ ] `/job-queue`
   - [ ] `/opportunities`
   - [ ] `/tracker`
   - [ ] `/settings`

**Target:** > 90 score on all pages

**Common Failures to Check:**
- StatusBadge neutral variant (light gray on light background)
- Secondary button text color
- Disabled button text

---

## 🌟 **PHASE 3E: M3 DESIGN COMPLIANCE SCORING**

### **M3 Anti-Slop Validator Checklist**

Based on the M3 design system principles from conversation history:

| Principle | Compliance Check | Pass/Fail | Notes |
|-----------|------------------|-----------|-------|
| **No Forbidden Fonts** | No Arial, Helvetica, Roboto, sans-serif | [ ] | Should use Plus Jakarta Sans |
| **No Solid Backgrounds** | Gradients, patterns, or textures on all containers | [ ] | Check gradient blobs on landing |
| **Elevation Depth** | Shadows create layered 3D effect | [ ] | Cards should have shadow-elevation |
| **Spring Physics** | Animations use spring easing, not linear | [ ] | Check button hovers |
| **Size Contrast** | Min 2:1 ratio between heading and body text | [ ] | Verify typography scale |
| **Weight Contrast** | Min 1.5:1 ratio (e.g., 800 vs 400) | [ ] | Hero title should be bold |
| **Organic Shapes** | 32px corners, not standard radius | [ ] | M3Card pebble variant |
| **Color Uniqueness** | Not generic blue/gray SaaS palette | [ ] | "Electric Alchemist" verification |
| **Interactive Motion** | Hover states are animated, not instant | [ ] | All buttons should scale/glow |
| **Varied Spacing** | Not uniform gaps, has rhythm | [ ] | Check margin/padding patterns |

**Scoring:**
- **10/10:** 🏆 M3 Expressive Mastery
- **8-9/10:** ✅ Production-ready M3
- **6-7/10:** ⚠️ Needs refinement
- **<6/10:** ❌ Not M3-compliant

---

## 📊 **PHASE 3F: OVERALL POLISH ASSESSMENT**

### **Visual Polish Scorecard**

| Category | Weight | Score (1-10) | Weighted | Notes |
|----------|--------|--------------|----------|-------|
| **M3 Compliance** | 30% | | | Based on checklist above |
| **Visual Consistency** | 20% | | | Same styles across pages? |
| **Animation Quality** | 15% | | | Smooth, intentional, not janky? |
| **Responsive Design** | 15% | | | Works on all screen sizes? |
| **Accessibility** | 10% | | | Keyboard + screen reader? |
| **Asset Quality** | 10% | | | Plant images crisp, positioned well? |

**Total Weighted Score:** ___/10

**Thresholds:**
- **9-10:** 🚀 Ship it! Deploy-ready.
- **7-8:** ✅ Ship with minor polish
- **5-6:** ⚠️ Hold - address critical issues first
- **< 5:** ❌ Needs major rework

---

## 🎬 **PHASE 3 COMPLETION REQUIREMENTS**

To mark Phase 3 as complete, provide the following:

1. **Completed Checklists:** All [ ] boxes checked with notes
2. **Screenshots:** Minimum 10 screenshots covering:
   - Landing page
   - Dashboard
   - Job Queue (with modal)
   - Opportunities (form + results)
   - Application Tracker
   - At least 1 mobile view
   - Lighthouse accessibility report

3. **UX Scores:** Fill in all rating tables in Section 3B

4. **Issue Updates:** Add any new visual issues to `UAT_ISSUES_LOG.md` with:
   - Page
   - Component
   - Issue description
   - Severity (High/Medium/Low)
   - Screenshot reference

5. **M3 Compliance Score:** Final percentage (X/10 pass rate)

6. **Overall Polish Score:** Weighted total from scorecard

---

## 🚀 **NEXT STEPS**

After completing this Phase 3 audit:

1. **Update** `UAT_ISSUES_LOG.md` with any new visual/UX issues found
2. **Prioritize** issues by severity (High → Medium → Low)
3. **Proceed to Phase 4:** Autonomous Triage & Fix Loop for High/Medium priority items

---

**Manual Testing Form:** [Print or open in split screen while testing]

**Tester Name:** _______________________  
**Date:** _______________________  
**Browser:** _______________________  
**Screen Size:** _______________________  
**Overall Time Spent:** _______ minutes  

**Final Recommendation:**
- [ ] **SHIP IT** - Ready for deployment
- [ ] **SHIP WITH CAVEATS** - Minor polish needed
- [ ] **HOLD** - Critical issues found

**Signature:** _______________________

---

**End of Phase 3 Manual Audit Guide**
