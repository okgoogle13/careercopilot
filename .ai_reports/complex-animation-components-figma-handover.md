# Complex Animation Components - Figma AI Handover Prompts

**Date:** 2025-11-18
**Project:** CareerCopilot
**Purpose:** Identify design-intensive animation components suitable for Figma AI prototyping

---

## Executive Summary

This report identifies **7 major component categories** containing **35+ individual animated elements** in the CareerCopilot frontend that would benefit from Figma AI-assisted design. These components feature complex motion patterns, multi-state transitions, and sophisticated visual effects that are challenging to prototype without visual design tools.

**Total Components Analyzed:** 128
**Animation-Heavy Components Identified:** 35+
**Recommended for Figma AI:** 7 categories
**Complexity Level:** High (framer-motion integration, spring animations, staggered effects)

---

## 1. AnimatedComponents Library (Priority: CRITICAL)

**Location:** `frontend/src/components/features/demo/AnimatedComponents.tsx`
**Lines of Code:** 673
**Animation Framework:** framer-motion (motion/react)
**Complexity:** Very High

### Components Included:
1. **AnimatedModal** - Spring-based modal with backdrop and scale animations
2. **AnimatedDropdown** - Staggered item entrance with opacity/scale transitions
3. **AnimatedTabs** - Sliding indicator with layoutId animation
4. **AnimatedProgress** - Spring-animated progress bar with percentage
5. **AnimatedNotification** - Toast notifications with slide-in/slide-out
6. **AnimatedCard** - Hover lift and tap feedback
7. **AnimatedButton** - 4 animation styles (scale, lift, glow, shimmer)
8. **ExpandableCard** - Height animation with rotate chevron
9. **StaggeredList** - Sequential item entrance with delays
10. **LoadingAnimations** - 5 loader variants (spinner, pulse, bounce, gradient, morph)
11. **AnimatedStatsCard** - Sequential value reveals with delays

### Figma AI Handover Prompt:

```
TASK: Design a comprehensive animated component library for a career management SaaS platform

CONTEXT:
- Modern professional aesthetic with purple (#a855f7) primary color
- Material Design 3 Expressive design system
- Target: Desktop-first responsive web application
- Animation style: Smooth, spring-based, natural motion (200-500ms duration)

COMPONENTS TO DESIGN:

1. ANIMATED MODAL
   - Backdrop: Blur effect with 0-1 opacity fade (300ms)
   - Content: Scale 0.95→1 + Y offset 20px→0 + opacity 0→1
   - Spring physics: damping=25, stiffness=300
   - Size: 600px wide, auto height, 24px border-radius
   - Include: Header with title, content area, footer with Cancel/Confirm buttons
   - Shadow: Elevated (0 20px 40px rgba(0,0,0,0.15))

2. ANIMATED DROPDOWN
   - Trigger: Button with chevron icon
   - Panel: Scale 0.95→1 + Y offset -10px→0 (200ms)
   - Items: Staggered entrance, 50ms delay per item, X offset -10px→0
   - Width: 200px, 8px border-radius
   - Hover state: Background color shift on items
   - Icons: 20px Material Icons, 8px gap from text

3. ANIMATED TABS
   - Layout: Horizontal tab bar with sliding active indicator
   - Indicator: Smooth slide animation using shared layout transition (spring damping=30, stiffness=300)
   - Active state: Bold text, purple background, shadow
   - Inactive state: Regular text, transparent background
   - Content: Cross-fade between tab panels (opacity 0→1, Y offset 10px→0, 200ms)
   - Gap: 8px between tabs

4. ANIMATED PROGRESS BAR
   - Container: Full width, 12px height, rounded full (pill shape), gray background
   - Fill: Purple gradient, animates width 0%→target% with spring physics (damping=30, stiffness=100)
   - Label: Percentage text above bar, right-aligned
   - Variants: Success (green), warning (orange), error (red)

5. ANIMATED NOTIFICATION (TOAST)
   - Entrance: Slide from right (X=300px→0) + scale 0.9→1 (spring damping=25, stiffness=300)
   - Exit: Reverse animation
   - Layout: Icon (24px) + Message + Close button, 16px gaps
   - Width: 300px fixed, 8px border-radius
   - Types: Success (green), Error (red), Info (blue), Warning (yellow)
   - Auto-dismiss: 4 second timer with progress bar at bottom

6. ANIMATED CARD HOVER
   - Default state: Subtle border, no shadow
   - Hover: Lift -4px (translateY) + shadow increase (0 10px 25px rgba(0,0,0,0.1))
   - Tap: Scale to 0.98
   - Transition: Spring physics (stiffness=300, damping=30)
   - Border-radius: 12px

7. ANIMATED BUTTONS (4 VARIANTS)
   a) Scale: Hover scale 1.05, tap scale 0.95
   b) Lift: Hover translateY -2px
   c) Glow: Hover adds 8px purple glow (0 0 0 8px rgba(168,85,247,0.1))
   d) Shimmer: Gradient overlay slides left-to-right on hover (600ms)

8. EXPANDABLE CARD
   - Header: Always visible, click to toggle
   - Chevron: Rotates 0°→90° (200ms) when expanded
   - Content: Height animation 0→auto + opacity 0→1 (300ms)
   - Border: 1px gray, 8px border-radius
   - Hover: Background lightens slightly

9. STAGGERED LIST
   - Items: Fade in (opacity 0→1) + slide right (X=-20px→0)
   - Stagger: 100ms delay per item
   - Use case: Task lists, search results
   - Animation triggers on mount/visibility

10. LOADING ANIMATIONS (5 TYPES)
    a) Spinning loader: Rotate 360° infinite (1s linear)
    b) Pulsing dot: Scale 1→1.2→1 infinite (1s)
    c) Bouncing dots: 3 dots, Y offset 0→-10px→0, 200ms stagger (600ms total)
    d) Gradient spinner: Circular border with gradient, rotate 360° infinite (2s)
    e) Morphing loader: Border-radius 50%→25%→50% + scale 1→0.8→1 (1.5s infinite)

11. ANIMATED STATS CARD
    - Sequential reveals: Icon (rotate -45°→0°, 400ms delay) → Title (opacity/Y, 100ms delay) → Value (opacity/scale, 200ms delay) → Change indicator (opacity/X, 300ms delay)
    - Hover: Entire card lifts with shadow
    - Layout: Icon (48px, purple background circle) + Text stack + Trend arrow
    - Size: 280px × 200px

DESIGN REQUIREMENTS:
- Export all states (default, hover, active, loading, error)
- Include interaction prototypes for each animation
- Use auto-layout for responsive behavior
- Token-based colors (--sys-color-primary, --sys-color-on-primary, etc.)
- Accessibility: Respect prefers-reduced-motion
- 60fps performance target

DELIVERABLES:
1. Figma component library with all 11 components
2. Interactive prototype demonstrating all animations
3. Animation specifications (duration, easing, delay)
4. Component documentation with usage guidelines
5. Export-ready assets for development handoff
```

---

## 2. AnimatedShowcase Page (Priority: HIGH)

**Location:** `frontend/src/components/features/demo/AnimatedShowcase.tsx`
**Lines of Code:** 710
**Complexity:** Very High

### Features:
- Full-page showcase with 8 sections demonstrating all animated components
- Interactive controls (play/pause, reset, demo triggers)
- Live animation previews with configurable parameters
- State management for progress simulations
- Notification system demonstration

### Figma AI Handover Prompt:

```
TASK: Design a comprehensive animation showcase/documentation page

CONTEXT:
- Internal component library documentation
- Educational/demonstration purpose
- Shows all animation patterns in action
- Interactive controls for testing

PAGE STRUCTURE:

1. HEADER
   - Back button (< Back to Component Library)
   - Title: "Animated Components Showcase" with sparkles icon
   - Subtitle: Description of showcase purpose
   - Control buttons: "Reset All" (outlined) + "Demo All" (filled with play icon)

2. STATISTICS CARDS SECTION
   - Grid: 4 columns on desktop, 2 on tablet, 1 on mobile
   - Each card: Icon (background circle) + Label + Value + Change indicator + Trend arrow
   - Staggered entrance animation on page load

3. INTERACTIVE OVERLAYS SECTION
   - 2-column grid
   - Modal demo card: Button to trigger modal
   - Dropdown demo card: Shows animated dropdown with 4 menu items

4. TABS DEMO SECTION
   - Full-width card
   - 3 tabs: Overview, Details, Settings (with icons)
   - Content area shows different content per tab
   - Sliding indicator animation

5. PROGRESS & LOADING SECTION
   - 2-column grid
   - Left: Animated progress bar with Start/Reset controls
   - Right: 5 loading spinner variants displayed horizontally

6. BUTTON ANIMATIONS SECTION
   - 4-column grid showing each button animation type
   - Labels above each button describing the effect
   - Each button demonstrates hover/tap interactions

7. EXPANDABLE CONTENT SECTION
   - Vertical stack of 2 expandable cards
   - "Project Management" with progress metrics inside
   - "Performance Metrics" with statistics inside
   - Click to expand/collapse

8. STAGGERED LIST SECTION
   - Full-width card
   - 5 list items with title + description
   - Sequential entrance animation on page load
   - Gray background on items

9. NOTIFICATIONS DEMO SECTION
   - Full-width card
   - 4 buttons to trigger different toast types
   - Fixed position notification container (top-right)

10. BEST PRACTICES SECTION
    - 2-column grid (Do's vs Don'ts)
    - Green checkmarks for best practices
    - Red X marks for common pitfalls
    - Bullet-point lists

DESIGN REQUIREMENTS:
- Consistent 24px spacing between sections
- Section headers: H2 with 16px bottom margin
- Cards: 12px border-radius, subtle shadow
- Primary color: Purple (#a855f7)
- Background: Light gray (#f9fafb)
- All animations should be demonstrated in the prototype

DELIVERABLES:
1. Full page design with all sections
2. Interactive prototype showing all animations
3. Responsive layouts (desktop, tablet, mobile)
4. Component specifications for development
```

---

## 3. TestimonialCarousel (Priority: MEDIUM)

**Location:** `frontend/src/components/main/TestimonialCarousel.tsx`
**Lines of Code:** 183
**Animation:** Slide transitions between testimonials

### Figma AI Handover Prompt:

```
TASK: Design an animated testimonial carousel for landing page

CONTEXT:
- Displays user success stories
- Professional, trustworthy aesthetic
- Automatic rotation with manual controls

COMPONENT DESIGN:

LAYOUT:
- Container: Max-width 1200px, centered, padding 48px vertical
- Card: Elevated white card, 32px padding, 16px border-radius
- Content: Centered text alignment

ELEMENTS:
1. Section Title: "What Our Users Say" (H3, bold, centered, 48px margin-bottom)

2. Testimonial Card:
   - Quote icon: 48px FormatQuote icon, purple, centered, 24px margin-bottom
   - Quote text: Large (H5/H6), italic, 500 font-weight, 24px margin-bottom
   - Rating: 5-star rating component, centered, small size, 16px margin-bottom
   - Author name: H6, bold, centered
   - Role + Company: Body2, gray, centered

3. Navigation Controls (32px margin-top):
   - Previous button: Circular, outlined, left chevron icon
   - Dot indicators: 8px circles, 8px gap, active dot is filled
   - Next button: Circular, outlined, right chevron icon
   - Horizontal layout, centered, 16px gaps

ANIMATIONS:
- Slide transition: Cross-fade between testimonials (500ms ease-in-out)
- Previous/Next: Slide animation (left/right) when button clicked
- Dots: Click any dot to jump to that testimonial with fade
- Auto-rotate: 5-second timer, pauses on hover

DATA:
- 4 testimonials provided
- Each has: quote (text), author (name), role, company, rating (1-5)

STATES:
- Default: Shows current testimonial
- Hover on buttons: Slight background color change
- Active dot: Filled purple circle
- Inactive dots: Outlined gray circles

RESPONSIVE:
- Desktop: Full layout as described
- Tablet: Reduce padding, smaller text
- Mobile: Stack vertically, smaller quote icon

DELIVERABLES:
1. Testimonial card design with all states
2. Navigation controls (buttons + dots)
3. Transition animations prototype
4. Responsive breakpoints
5. Data structure documentation
```

---

## 4. TimelineView (Priority: MEDIUM)

**Location:** `frontend/src/components/career/TimelineView.tsx`
**Lines of Code:** 419
**Animation:** Vertical timeline with progressive reveal

### Figma AI Handover Prompt:

```
TASK: Design an animated vertical timeline for application tracking

CONTEXT:
- Job application progress tracking
- Shows events chronologically (applied, interview, response, offer, etc.)
- Professional career management interface

COMPONENT DESIGN:

HEADER:
- Title: "Application Timeline" (H4, bold)
- Subtitle: "{jobTitle} at {companyName}" (H6, gray)
- 24px margin-bottom

TIMELINE STRUCTURE:
- Vertical line: 2px wide, gray (#e5e7eb), runs full height on left
- Timeline dots: 16px circles, positioned on the line
- Event cards: Offset to the right of timeline (64px left margin)

EVENT CARD LAYOUT:
1. Card container: White background, 16px border-radius, subtle shadow, 16px margin-bottom

2. Card header (horizontal layout):
   - Left: Event icon in colored circle (40px avatar)
   - Middle: Event title (H6 bold) + Description (Body2 gray) + Date with clock icon
   - Right: Status chip (outlined) + Edit icon button

3. Card content (if metadata exists):
   - Interviewer name (if interview event)
   - Interview type chip (if interview event)
   - Documents: List of clickable document buttons with external link icon
   - Notes: Gray background box with italic text
   - Next steps: Blue text with highlighted importance

4. Card footer:
   - "Add Note" button (outlined, small)

EVENT TYPES & COLORS:
- Application: Blue (file icon)
- Interview: Purple (calendar icon)
- Response: Green (message icon)
- Follow-up: Orange (clock icon)
- Offer: Green (checkmark icon)
- Rejection: Red (alert icon)

STATUS TYPES:
- Completed: Green chip
- Upcoming: Blue chip
- Pending: Orange chip
- Cancelled: Red chip

TIMELINE DOTS:
- Completed events: Filled colored circle matching event type
- Current event: Pulsing animation (scale 1→1.1→1, 2s infinite)
- Future events: Outlined gray circle

BOTTOM SECTION:
- "Add more events" placeholder card (dashed border, centered text, "+ Add Event" button)

SUMMARY CARD (below timeline):
- 3 statistics in grid: Completed Events | Upcoming Events | Days Since Applied
- Large numbers (H4 bold, colored) + Labels (Caption gray)
- Gray background card

ANIMATIONS:
1. On load: Sequential reveal of timeline events (stagger 100ms per event)
2. Event entrance: Fade in + slide from left (opacity 0→1, X=-20px→0)
3. Timeline dot: Grows from center (scale 0→1)
4. Current event: Pulsing dot animation
5. Hover on card: Subtle lift (2px) + shadow increase
6. Expand metadata: Height animation 0→auto

RESPONSIVE:
- Desktop: Timeline on left, cards on right
- Mobile: Timeline line moves to center, cards stack below

DELIVERABLES:
1. Complete timeline layout with all event types
2. Event card component with all metadata variations
3. Timeline animations prototype (sequential reveal)
4. Status and event type color system
5. Responsive layouts
6. Summary statistics card design
```

---

## 5. LoadingStates Gallery (Priority: HIGH)

**Location:** `frontend/src/components/common/LoadingStates.tsx`
**Lines of Code:** 461
**Animation:** 8 different loading patterns

### Figma AI Handover Prompt:

```
TASK: Design a comprehensive loading states pattern library

CONTEXT:
- Demonstrates all loading UI patterns used in the application
- Ensures consistency across data-loading scenarios
- Educational resource for developers

LOADING PATTERNS TO DESIGN:

1. PROFILE CARD LOADING (Skeleton)
   - Avatar: 48px circle skeleton (gray shimmer animation)
   - Name: 120px × 16px bar skeleton
   - Subtitle: 80px × 14px bar skeleton
   - Metadata: 3 rows of 2-column layout (label + value skeletons)
   - Action buttons: 2 full-width button skeletons

2. DOCUMENT ANALYSIS LOADING (Multi-step)
   - Header: Spinning icon (24px) + "Analyzing your resume..." text
   - Subtitle: "This may take a few moments" (gray, smaller)
   - Step list: 4 steps with icons
     * Completed: Green checkmark icon
     * Current: Spinning icon (animated)
     * Pending: Gray outlined circle
   - Steps: "Parsing document", "Extracting keywords", "Running ATS analysis", "Generating recommendations"
   - Vertical spacing: 16px between steps

3. FILE UPLOAD LOADING (Progress bar)
   - Container: Dashed border box (2px dashed gray), 24px padding, 8px border-radius
   - Upload icon: 32px, centered, 8px margin-bottom
   - Status text: "Uploading resume.pdf..." (gray)
   - Progress bar: Full-width, 8px height, rounded, purple fill
   - Percentage: "65% completed" (caption text below bar)

4. TEMPLATE GENERATION LOADING (Branded)
   - CareerCopilot logo: 48px, centered, in colored circle (purple gradient)
   - Status: "Generating your resume" (bold)
   - Substatus: "Applying Modern Minimal template..." (gray)
   - Progress bar: Animated progress (spring physics)
   - Footer text: "Processing content and formatting"

5. DASHBOARD LOADING (Multiple cards)
   - 3 skeleton cards in vertical stack
   - Each card: Avatar skeleton + 2 text lines + 2 metadata rows
   - Cards have subtle borders and padding
   - Shimmer animation across all skeletons

6. LOADING SPINNERS (5 variants):
   a) Default spinner: Single rotating circle (360° infinite, 1s)
   b) Border spinner: Thick border, partial arc rotates (360° infinite, 1s)
   c) Dot animation: 3 dots bouncing (Y offset, 150ms stagger)
   d) Double ring: Nested circles rotating in opposite directions
   e) Each with label below

7. FULL PAGE LOADING OVERLAY
   - Semi-transparent backdrop (rgba(255,255,255,0.9))
   - Centered content: Logo + "Loading Career Copilot..." text
   - Spinner below text

8. PROGRESS TRACKING
   - Linear progress bar: 0%→100% animated
   - Circular progress: Ring fills clockwise
   - Both with percentage labels

ANIMATION SPECIFICATIONS:
- Shimmer: Gradient overlay slides left-to-right (2s infinite, linear)
- Spinner: Rotate 360° (1s infinite, linear)
- Bounce: Y offset 0→-10px→0 (600ms infinite, ease-in-out)
- Progress fill: Smooth width increase (spring physics)
- Multi-step: Current step icon rotates, completed steps are static

SHIMMER GRADIENT:
- Direction: Left to right (90deg)
- Colors: rgba(255,255,255,0.1) → rgba(255,255,255,0.2) → rgba(255,255,255,0.1)
- Animation: Background-position -1000px → 1000px (2s infinite)

COLOR PALETTE:
- Skeleton base: #e5e7eb (gray-200)
- Shimmer highlight: #f3f4f6 (gray-100)
- Progress bar: #a855f7 (purple-500)
- Success: #10b981 (green-500)
- Container borders: #d1d5db (gray-300)

DELIVERABLES:
1. All 8 loading pattern designs
2. Animated prototypes for each pattern
3. Skeleton component specifications
4. Shimmer animation implementation guide
5. Progress animation curves
6. Responsive variations
```

---

## 6. ATSScoreCircle (Priority: MEDIUM)

**Location:** `frontend/src/components/library/ATSScoreCircle.tsx`
**Lines of Code:** 135
**Animation:** SVG circular progress with glow effects

### Figma AI Handover Prompt:

```
TASK: Design an animated circular progress indicator for ATS scores

CONTEXT:
- ATS (Applicant Tracking System) Score visualization
- Score range: 0-100
- Color changes based on score threshold
- Used in profile cards and analytics dashboards

COMPONENT SPECIFICATIONS:

SIZE VARIANTS:
1. Small: 80px diameter, 6px stroke width, text-lg score font
2. Medium: 120px diameter, 8px stroke width, text-2xl score font
3. Large: 192px diameter, 12px stroke width, text-5xl score font

CIRCLE DESIGN:
- Background circle: Gray (#d1d5db), 20% opacity, full circumference
- Progress circle: Colored based on score, partial circumference
- Stroke linecap: Round (rounded ends)
- Center text: Score percentage (e.g., "92%")
- Optional label below: "ATS Score" (small sizes only)

COLOR THRESHOLDS:
- Score ≥ 80: Green (#10b981) - Excellent
- Score 60-79: Yellow/Orange (#f59e0b) - Good
- Score < 60: Red (#ef4444) - Needs improvement

GLOW EFFECTS (Large size only):
- Primary circle: Standard stroke
- Glow layer: Same circle, +2px stroke width, 30% opacity, 4px blur
- Drop shadow: 0 0 8px {scoreColor}40 (40% opacity of score color)

ANIMATION:
- Stroke-dashoffset animation: Animates from 0 to target percentage
- Duration: 1000ms (1 second)
- Easing: Cubic-bezier(0.4, 0, 0.2, 1) or spring physics
- Animation triggers on component mount or score change

CALCULATION:
- Circumference = radius × 2 × π
- Stroke-dasharray = circumference (full circle)
- Stroke-dashoffset = circumference - (score / 100 × circumference)

SVG STRUCTURE:
```svg
<svg width="120" height="120">
  <!-- Background circle -->
  <circle cx="60" cy="60" r="52" stroke="gray" stroke-width="8" fill="transparent" opacity="0.2" />

  <!-- Progress circle -->
  <circle cx="60" cy="60" r="52" stroke="{scoreColor}" stroke-width="8" fill="transparent"
          stroke-dasharray="{circumference}" stroke-dashoffset="{offset}"
          stroke-linecap="round" transform="rotate(-90 60 60)" />

  <!-- Glow effect (large only) -->
  <circle cx="60" cy="60" r="52" stroke="{scoreColor}" stroke-width="10" fill="transparent"
          stroke-dasharray="{circumference}" stroke-dashoffset="{offset}"
          stroke-linecap="round" transform="rotate(-90 60 60)" opacity="0.3" filter="blur(4px)" />
</svg>
```

USAGE CONTEXTS:
- Profile cards: Medium size, no label
- Dashboard statistics: Small size, with label
- Score detail page: Large size, no label (text positioned absolutely over center)

ACCESSIBILITY:
- ARIA label: "ATS Score: {score} out of 100"
- Semantic score interpretation in screenreader text

STATES:
- Default: Shows score as provided
- Loading: Indeterminate spinner (full circle rotating)
- Error: Gray circle with "--" text instead of score

DELIVERABLES:
1. All 3 size variants designed
2. Color threshold variations (green, yellow, red)
3. Glow effect specifications for large size
4. Animation prototype showing fill animation
5. SVG code with proper transformations
6. Loading and error states
```

---

## 7. Collapsible Sidebar (Priority: MEDIUM)

**Location:** `frontend/src/components/ui/sidebar.tsx`
**Lines of Code:** 275
**Animation:** Width transition with icon/text fade

### Figma AI Handover Prompt:

```
TASK: Design an animated collapsible sidebar navigation

CONTEXT:
- Primary application navigation
- Toggles between expanded (280px) and collapsed (64px) states
- Material-UI Drawer component with custom styling

COMPONENT SPECIFICATIONS:

DIMENSIONS:
- Expanded width: 280px
- Collapsed width: 64px
- Height: Full viewport (100vh)
- Transition: Width 300ms cubic-bezier(0.4, 0, 0.2, 1) (sharp easing)

STRUCTURE:

1. SIDEBAR HEADER (top section)
   - Height: 64px (matches app header height)
   - Border-bottom: 1px solid divider color
   - Content: Logo + App name (expanded) or just logo icon (collapsed)
   - Padding: 16px

2. SIDEBAR CONTENT (scrollable middle section)
   - Overflow-y: Auto
   - Overflow-x: Hidden (prevents horizontal scroll during animation)
   - List of navigation items

3. SIDEBAR FOOTER (bottom section)
   - Height: Auto
   - Border-top: 1px solid divider color
   - Content: User profile or settings
   - Padding: 16px

NAVIGATION ITEMS:

Expanded state:
- Layout: Icon (24px) + Text label + Optional badge
- Icon margin-right: 24px
- Min-height: 48px
- Padding: 10px 20px
- Hover: Background color lightens
- Active: Background colored, bold text
- Tooltip: None (text visible)

Collapsed state:
- Layout: Icon only (24px), centered
- Icon margin-right: Auto (centered)
- Min-height: 48px
- Padding: 10px 20px
- Text opacity: 0 (hidden but maintains DOM for animation)
- Hover: Background color lightens + Tooltip appears on right
- Active: Background colored
- Tooltip: Shows text label on hover (placement: right, offset: 8px)

TOGGLE BUTTON:
- Location: Can be in header or as floating button
- Icon: Menu icon (hamburger)
- Action: Toggles sidebar.open state

ANIMATIONS:

1. Width transition (both directions):
   - Duration: 300ms
   - Easing: cubic-bezier(0.4, 0, 0.2, 1) - sharp easing
   - Affected: Entire drawer width

2. Text fade (collapse):
   - Text opacity: 1 → 0
   - Duration: 150ms (first half of width transition)
   - Prevents text from being visible during collapse

3. Text fade (expand):
   - Text opacity: 0 → 1
   - Duration: 150ms (second half of width transition)
   - Delay: 150ms (waits for width to expand first)

4. Icon position (both directions):
   - Margin-right: 24px ↔ auto
   - Transition: 300ms with width
   - Centers icon when collapsed

5. Tooltip (collapsed only):
   - Appears on hover: Fade in (100ms)
   - Disappears: Fade out (100ms)
   - Positioned 8px to the right of sidebar

VISUAL STYLE:
- Background: Paper color (white or light gray)
- Border-right: 1px solid divider color
- Icons: Current text color (inherits)
- Active item: Primary color background (10% opacity) + primary color text
- Hover: Background color +5% brightness

RESPONSIVE BEHAVIOR:
- Desktop: Persistent drawer (always visible, toggles width)
- Tablet: Temporary drawer (overlays content, full width when open)
- Mobile: Temporary drawer (overlays content, full width when open)

ACCESSIBILITY:
- ARIA label: "Navigation sidebar"
- Toggle button ARIA label: "Toggle navigation sidebar"
- Collapsed state ARIA: "Sidebar collapsed, hover for labels"
- Keyboard navigation: Tab through items, Enter/Space to activate

INTEGRATION POINTS:
- SidebarProvider: React Context managing open/close state
- SidebarTrigger: Toggle button component (can be in app header)
- SidebarInset: Main content area that shifts when sidebar toggles

STATES:
- Open: Full width, text visible, no tooltips
- Closed: Narrow width, icons only, tooltips on hover
- Transitioning: Smooth width animation, text fading

DELIVERABLES:
1. Sidebar design in both expanded and collapsed states
2. Navigation item component with all states (default, hover, active)
3. Tooltip design for collapsed state
4. Toggle button component
5. Width transition animation prototype
6. Text fade-in/fade-out animation specifications
7. Responsive drawer variants (persistent, temporary)
8. Integration with main content layout
```

---

## 8. Additional Animation Utilities

**Location:** `frontend/src/utils/animations.ts`
**Lines of Code:** 360
**Purpose:** Centralized animation presets and keyframes

### Animation Patterns Defined:

1. **Keyframe Animations** (11 types):
   - fadeIn, slideInUp/Down/Left/Right, scaleIn, pulse, shimmer, bounce, rotate

2. **Transition Presets**:
   - Fast (150ms), Normal (300ms), Slow (500ms)
   - Specialized: fade, transform, color, shadow

3. **Hover Effects** (5 types):
   - Lift (translateY + shadow)
   - Scale (scale 1.02)
   - Color shift (background color)
   - Glow (box-shadow)
   - Gradient shift (background-position)

4. **Focus Effects** (3 types):
   - Outline (2px solid primary)
   - Ring (layered box-shadows)
   - Underline (border-bottom)

5. **Page Transitions**:
   - Enter (fade in)
   - Enter from left/right (slide in)

6. **Modal Transitions**:
   - Scale in (scale 0.95 → 1)
   - Fade in

7. **Button Interactions**:
   - Default (translateY -2px on hover)
   - With shadow (shadow increase + lift)
   - With glow (purple glow effect)

8. **Input Interactions**:
   - Base (color transition)
   - With focus (ring shadow)

### Figma AI Handover Prompt:

```
TASK: Create a comprehensive animation design system

CONTEXT:
- Centralized animation tokens for consistent motion across application
- Based on Material Design 3 motion principles
- Supports reduced-motion accessibility preference

ANIMATION TOKENS TO DEFINE:

1. DURATION TOKENS:
   - duration-instant: 0ms (no animation)
   - duration-fast: 150ms (micro-interactions)
   - duration-normal: 300ms (standard transitions)
   - duration-slow: 500ms (prominent transitions)
   - duration-slower: 1000ms (page transitions)

2. EASING CURVES:
   - ease-standard: cubic-bezier(0.4, 0, 0.2, 1) - Material standard
   - ease-decelerate: cubic-bezier(0, 0, 0.2, 1) - Enter screen
   - ease-accelerate: cubic-bezier(0.4, 0, 1, 1) - Exit screen
   - ease-sharp: cubic-bezier(0.4, 0, 0.6, 1) - Quick and decisive
   - ease-bounce: spring physics (damping 25, stiffness 300)

3. KEYFRAME ANIMATIONS:
   Create animated prototypes for:
   - Fade in/out (opacity 0 ↔ 1)
   - Slide up/down/left/right (opacity + transform)
   - Scale in/out (opacity + scale)
   - Pulse (opacity 1 ↔ 0.5 infinite)
   - Shimmer (background-position slide)
   - Bounce (translateY with bounce curve)
   - Rotate (rotate 360° continuous)

4. INTERACTION EFFECTS:
   Design hover/focus states for:
   - Cards: Lift (-4px) + shadow increase
   - Buttons: Multiple variants (scale, lift, glow, shimmer)
   - Links: Underline expand
   - Inputs: Ring shadow + border color
   - Icons: Rotate or scale subtle

5. TRANSITION SPECIFICATIONS:
   - Fade: opacity 300ms ease-standard
   - Transform: transform 300ms ease-standard
   - Color: background-color 300ms ease-standard, color 300ms
   - Shadow: box-shadow 300ms ease-standard
   - All: all 300ms ease-standard (use sparingly)

6. PAGE TRANSITIONS:
   - Enter: Fade in 300ms
   - Exit: Fade out 200ms
   - Enter from left: Slide right + fade (400ms)
   - Enter from right: Slide left + fade (400ms)

7. MODAL/DIALOG TRANSITIONS:
   - Backdrop: Fade in/out (300ms)
   - Content: Scale 0.95→1 + fade (300ms cubic-bezier(0.4, 0, 0.2, 1))
   - Exit: Reverse animations

8. LOADING STATES:
   - Shimmer: 2s linear infinite gradient slide
   - Spinner: 1s linear infinite rotate
   - Pulse: 2s ease-in-out infinite scale

9. ACCESSIBILITY:
   - Reduced motion variants: Replace animations with instant state changes or simple fades
   - Prefers-reduced-motion: @media query handling

DESIGN DELIVERABLES:
1. Animation token documentation (durations, easings)
2. Interactive prototype showing all keyframe animations
3. Hover effect examples on cards, buttons, links
4. Focus effect examples on interactive elements
5. Page transition prototypes
6. Loading state animations
7. Reduced-motion alternatives
8. Motion design principles guide

IMPLEMENTATION NOTES:
- All animations should respect prefers-reduced-motion CSS media query
- Use CSS custom properties for animation tokens
- Spring physics for natural feel (framer-motion)
- 60fps performance target (use transform and opacity only)
- Avoid animating width, height, left, top (causes reflow)
```

---

## Priority Ranking for Figma AI Development

### CRITICAL Priority (Start Here):
1. **AnimatedComponents Library** - Core reusable components used throughout app
2. **LoadingStates Gallery** - Essential for user experience consistency

### HIGH Priority:
3. **AnimatedShowcase Page** - Documentation and demonstration
4. **Animation Utilities System** - Foundation for all animations

### MEDIUM Priority:
5. **TimelineView** - Complex but isolated feature
6. **TestimonialCarousel** - Marketing/landing page component
7. **ATSScoreCircle** - Analytics visualization
8. **Collapsible Sidebar** - Navigation component

---

## Technical Implementation Notes

### Animation Framework:
- **Primary:** framer-motion (motion/react) - v11.x
- **Fallback:** CSS animations (@emotion/react keyframes)
- **Theme:** Material-UI v5.18 with M3 Expressive tokens

### Performance Considerations:
- All animations target 60fps
- Use `transform` and `opacity` properties (GPU-accelerated)
- Avoid animating `width`, `height`, `left`, `top` (causes layout reflow)
- Implement `prefers-reduced-motion` for accessibility
- Use `will-change` sparingly for complex animations only

### Design Tokens Integration:
- Durations: `--sys-duration-fast`, `--sys-duration-normal`, `--sys-duration-slow`
- Easings: `--sys-easing-standard`, `--sys-easing-decelerate`
- Colors: `--sys-color-primary`, `--sys-color-on-primary`, etc.
- Spacing: `--sys-spacing-*` (8px base grid)

### Component Export Requirements:
Each Figma component should export:
1. **Default state** - At rest appearance
2. **Hover state** - Mouse-over appearance
3. **Active/Selected state** - Pressed or selected appearance
4. **Loading state** - During data fetching
5. **Error state** - Error feedback (if applicable)
6. **Disabled state** - Non-interactive appearance (if applicable)

### Animation Specifications Format:
For each animation, document:
```
- Property: {transform, opacity, etc.}
- From value: {initial state}
- To value: {final state}
- Duration: {milliseconds}
- Easing: {cubic-bezier or spring physics values}
- Delay: {milliseconds, if staggered}
```

---

## Recommended Figma Plugins

1. **Figmotion** - Advanced animation timeline editor
2. **Anima** - Export animations to code
3. **LottieFiles** - Create exportable Lottie animations
4. **Protopie Connect** - Advanced micro-interactions
5. **Motion** - Animation presets library
6. **Easings** - Easing curve visualizer and editor

---

## Success Metrics

After Figma AI design completion, measure:
1. **Design-to-code accuracy**: 90%+ visual match
2. **Animation smoothness**: Consistent 60fps performance
3. **Development time savings**: 50% reduction vs. coding from scratch
4. **Consistency score**: All animations follow M3 motion principles
5. **Accessibility compliance**: 100% prefers-reduced-motion support

---

## Next Steps

1. **Review this document** with design team for completeness
2. **Prioritize components** based on current sprint goals
3. **Create Figma project** structure with component library setup
4. **Assign Figma AI tasks** using the handover prompts above
5. **Establish design review cadence** (weekly sync recommended)
6. **Set up design-to-code handoff process** (Zeplin, Figma Inspect, or Storybook)
7. **Create animation testing checklist** for QA validation

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Author:** Claude (AI Code Assistant)
**Status:** Ready for Design Team Review
**Estimated Design Effort:** 80-120 hours (2-3 weeks for experienced designer)
