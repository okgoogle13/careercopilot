# CareerCopilot Frontend-Backend Integration Implementation Plan

**Version:** 1.0
**Target:** Full-stack integration of all backend APIs with frontend
**Execution Environment:** Claude Code (VS Code)
**Token Optimization:** Details in this doc, succinct prompts for execution

---

## 🎯 Overview

This plan connects the CareerCopilot frontend (currently mock data) to the fully-functional backend. Organized into 6 phases for efficient token usage.

**Total Estimated Tasks:** 87 items across 6 phases

---

## Phase 1: Backend & Endpoint Fixes (3 tasks)

### 1.1 Fix Email Scanner Syntax Error

- **File:** `backend/app/genkit_flows/email_scanner.py`
- **Issue:** Syntax error causing function to return `None`
- **Fix:** Debug and repair `scan_inbox_for_opportunities` function
- **Validation:** Run backend tests, ensure function returns expected data structure

### 1.2 Create Cover Letter Generator Endpoint

- **File:** `backend/app/api/routers/` (new file or existing)
- **Create:** `POST /api/v1/documents/generate-cover-letter`
- **Integration:** Connect to existing `cover_letter_generator.py` Genkit flow
- **Request Schema:** `{ jobDescription: string, tone: string, userProfileId?: string }`
- **Response Schema:** `{ coverLetter: string, metadata: {...} }`
- **Validation:** Test endpoint with curl/Postman

### 1.3 Fix KSC Generator Endpoint

- **File:** `backend/app/api/routers/` (check existing KSC router)
- **Fix:** `POST /api/v1/ksc/generate` endpoint (currently stub/broken)
- **Integration:** Properly connect to `ksc_generator.py` Genkit flow
- **Add:** User profile context support
- **Add:** STAR methodology formatting
- **Validation:** Test with frontend integration

---

## Phase 2: Frontend API Service Layer (15 services)

**Location:** `frontend/src/api/`

### 2.1 Authentication Service

**File:** `authService.ts`

```typescript
Functions to implement:
- login(email: string, password: string): Promise<AuthResponse>
- register(userData: RegisterRequest): Promise<AuthResponse>
- logout(): Promise<void>
- refreshToken(): Promise<TokenResponse>
- getCurrentUser(): Promise<User>
- updateUserProfile(data: ProfileUpdate): Promise<User>
- createVoiceProfile(sample: File): Promise<VoiceProfile>
```

### 2.2 Smart Ingestion Service

**File:** `smartIngestionService.ts`

```typescript
Functions to implement:
- uploadAndTag(file: File): Promise<UploadAndTagResponse>
- extractAndSave(request: ExtractAndSaveRequest): Promise<AssetDocument>
- getAssetLibrary(userId: string): Promise<AssetDocument[]>
- getAssetById(assetId: string): Promise<AssetDocument>
- deleteAsset(assetId: string): Promise<void>
```

### 2.3 Analysis Service

**File:** `analysisService.ts`

```typescript
Functions to implement:
- getATSScore(documentId: string, jobDescription: string): Promise<ATSScoreResponse>
- analyzeDocument(documentId: string): Promise<DocumentAnalysis>
- getContentOptimization(content: string, jobDescription: string): Promise<OptimizationSuggestions>
- getResumeIntelligence(resumeId: string): Promise<IntelligenceReport>
```

### 2.4 Job Listing Service

**File:** `jobService.ts`

```typescript
Functions to implement:
- extractJobFromUrl(url: string): Promise<JobListing>
- extractJobFromText(text: string): Promise<JobListing>
- advancedJobAnalysis(jobId: string): Promise<JobAnalysis>
- getJobMatching(jobId: string, profileId: string): Promise<MatchingResult>
- listJobs(filters?: JobFilters): Promise<JobListing[]>
```

### 2.5 Profile Service

**File:** `profileService.ts`

```typescript
Functions to implement:
- createProfile(data: ProfileCreate): Promise<Profile>
- getProfiles(userId: string): Promise<Profile[]>
- getProfileById(profileId: string): Promise<Profile>
- updateProfile(profileId: string, data: ProfileUpdate): Promise<Profile>
- deleteProfile(profileId: string): Promise<void>
```

### 2.6 Workflow Service

**File:** `workflowService.ts`

```typescript
Functions to implement:
- generateApplicationPackage(request: ApplicationPackageRequest): Promise<ApplicationPackage>
- getWorkflowStatus(workflowId: string): Promise<WorkflowStatus>
- listWorkflows(userId: string): Promise<Workflow[]>
```

### 2.7 Document Generation Service

**File:** `documentService.ts`

```typescript
Functions to implement:
- generateCoverLetter(jobDescription: string, tone: string, profileId?: string): Promise<CoverLetter>
- generateTailoredResume(jobDescription: string, profileId: string): Promise<Resume>
- optimizeContent(content: string, context: OptimizationContext): Promise<OptimizedContent>
```

### 2.8 Email Service

**File:** `emailService.ts`

```typescript
Functions to implement:
- connectGmail(authCode: string): Promise<EmailConnection>
- scanInbox(userId: string): Promise<OpportunityEmail[]>
- getOpportunities(userId: string): Promise<JobOpportunity[]>
- disconnectEmail(userId: string): Promise<void>
```

### 2.9 Template Service

**File:** `templateService.ts`

```typescript
Functions to implement:
- listTemplates(type?: TemplateType): Promise<Template[]>
- getTemplate(templateId: string): Promise<Template>
- selectTemplate(templateId: string, userId: string): Promise<void>
```

### 2.10 Notification Service

**File:** `notificationService.ts`

```typescript
Functions to implement:
- getNotifications(userId: string): Promise<Notification[]>
- markAsRead(notificationId: string): Promise<void>
- getPreferences(userId: string): Promise<NotificationPreferences>
- updatePreferences(userId: string, prefs: NotificationPreferences): Promise<void>
```

### 2.11 Settings Service

**File:** `settingsService.ts`

```typescript
Functions to implement:
- getSettings(userId: string): Promise<UserSettings>
- updateSettings(userId: string, settings: SettingsUpdate): Promise<UserSettings>
```

### 2.12 Analytics Service

**File:** `analyticsService.ts`

```typescript
Functions to implement:
- getPerformanceTrends(userId: string, timeRange: TimeRange): Promise<TrendData>
- getCompetitiveAnalysis(userId: string): Promise<CompetitiveData>
- getDashboardStats(userId: string): Promise<DashboardStats>
```

### 2.13 Calendar Service

**File:** `calendarService.ts`

```typescript
Functions to implement:
- createEvent(event: CalendarEvent): Promise<CalendarEvent>
- listEvents(userId: string, filters?: EventFilters): Promise<CalendarEvent[]>
- syncDeadlines(userId: string): Promise<void>
- updateEvent(eventId: string, updates: EventUpdate): Promise<CalendarEvent>
- deleteEvent(eventId: string): Promise<void>
```

### 2.14 Document CRUD Service

**File:** `documentCRUDService.ts` (separate from documentService)

```typescript
Functions to implement:
- uploadDocument(file: File, metadata: DocumentMetadata): Promise<Document>
- getDocument(documentId: string): Promise<Document>
- listDocuments(userId: string, filters?: DocumentFilters): Promise<Document[]>
- updateDocument(documentId: string, updates: DocumentUpdate): Promise<Document>
- deleteDocument(documentId: string): Promise<void>
```

### 2.15 Application Service

**File:** `applicationService.ts`

```typescript
Functions to implement:
- createApplication(data: ApplicationCreate): Promise<Application>
- listApplications(userId: string): Promise<Application[]>
- getApplication(applicationId: string): Promise<Application>
- updateApplication(applicationId: string, updates: ApplicationUpdate): Promise<Application>
- deleteApplication(applicationId: string): Promise<void>
- bulkUpdate(applicationIds: string[], updates: BulkUpdate): Promise<void>
```

**Implementation Notes:**

- All services use axios for HTTP requests
- Base URL from environment config
- Error handling with try/catch
- Token refresh on 401 errors
- TypeScript types for all requests/responses

---

## Phase 3: Frontend Integration & Logic (34 tasks)

### 3.1 Routing Configuration

**File:** `frontend/src/routes/AppRouter.tsx` (or wherever routes are defined)

**Add Routes:**

```typescript
- /login → LoginPage (public)
- /register → RegisterPage (public)
- /opportunities → OpportunitiesPage (protected)
- /analysis → AnalysisPage (protected)
- /documents → DocumentsPage (protected)
- /asset-library → AssetLibraryPage (protected)
- /profile → ProfilePage (protected)
- /settings → SettingsPage (protected)
- /workflows → WorkflowsPage (protected)
- /application-generator → ApplicationGeneratorPage (protected)
```

### 3.2 Authentication System

**Create Components:**

- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/auth/RegisterForm.tsx`
- `frontend/src/components/auth/ProtectedRoute.tsx`
- `frontend/src/contexts/AuthContext.tsx`

**LoginForm:**

- Email/password inputs with validation
- Error handling
- Loading state
- Session management (store JWT)

**RegisterForm:**

- User registration fields
- Voice profile upload (optional)
- Email verification flow
- Error handling

**ProtectedRoute:**

- Check auth status from AuthContext
- Redirect to /login if unauthenticated
- Render children if authenticated

**AuthContext:**

- Global auth state (user, token, isAuthenticated)
- Login/logout functions
- Token refresh logic
- useAuth() hook

### 3.3 Page Integration - AnalysisPage

**File:** `frontend/src/pages/AnalysisPage.tsx`

**Changes:**

- Remove all hardcoded mock data
- Import `analysisService`
- Add state: `const [analysisData, setAnalysisData] = useState(null)`
- Add useEffect to fetch real data on mount
- Connect ATS score display to `analysisService.getATSScore()`
- Add loading state (use LoadingState component)
- Add error state (use ErrorState component)

### 3.4 Page Integration - OpportunitiesPage

**File:** `frontend/src/pages/OpportunitiesPage.tsx`

**Changes:**

- Remove hardcoded job listings
- Import `jobService`
- Add "Add Job" button → opens JobExtractorModal
- Create `JobExtractorModal` component:
  - Tabs: "From URL" | "From Text"
  - URL input + Extract button
  - Text area + Extract button
  - Call `jobService.extractJobFromUrl()` or `extractJobFromText()`
- Display extracted jobs from state
- Add job matching integration
- Show compatibility scores from `jobService.getJobMatching()`

### 3.5 Page Integration - DashboardPage

**File:** `frontend/src/pages/DashboardPage.tsx`

**Changes:**

- Remove hardcoded profiles/stats
- Import `profileService`, `analyticsService`, `documentService`
- Load user profiles: `profileService.getProfiles(userId)`
- Load dashboard stats: `analyticsService.getDashboardStats(userId)`
- Load recent documents: `documentService.listDocuments(userId, { limit: 5 })`
- Display real activity feed
- Add loading states for all data

### 3.6 Page Integration - DocumentsPage

**File:** `frontend/src/pages/DocumentsPage.tsx`

**Changes:**

- Remove hardcoded documents array
- Import `smartIngestionService`, `documentCRUDService`
- Replace upload dialog with `SmartUploadModal`
- Fetch documents on mount: `documentCRUDService.listDocuments(userId)`
- Integrate ATS scores from `analysisService`
- Add delete functionality: `documentCRUDService.deleteDocument(id)`

### 3.7 ProfileEditor Integration

**File:** `frontend/src/components/features/profile/ProfileEditor.tsx`

**Changes:**

- Import `profileService`
- Load profile data on mount: `profileService.getProfileById(profileId)`
- On save: Call `profileService.updateProfile(profileId, formData)`
- Add success/error notifications
- Add loading state during save

### 3.8 Smart Ingestion - SmartUploadModal Component

**Create:** `frontend/src/components/documents/SmartUploadModal.tsx`

**Structure:**

- Two-step wizard: Upload → Confirm Tags → Extract
- Step 1: File upload (use DocumentUploadDropzone)
  - On upload: Call `smartIngestionService.uploadAndTag(file)`
  - Receive AI-suggested tags (roleType, subsectors, confidence)
- Step 2: Confirm tags
  - Display suggested tags with confidence score
  - Allow editing tags
  - Document type selector (resume/ksc/voice)
  - Confirm button: Call `smartIngestionService.extractAndSave()`
- Show progress indicator
- Handle success/error states

### 3.9 Asset Library Page

**Create:** `frontend/src/pages/AssetLibraryPage.tsx`

**Features:**

- Display all ingested assets from `smartIngestionService.getAssetLibrary()`
- Show MasterCareerProfile data
- Show KSC examples
- Show VoiceProfile characteristics
- Search/filter by document type and tags
- Delete assets

### 3.10 KSC Generator Integration

**File:** `frontend/src/pages/KscGeneratorPage.tsx`

**Changes:**

- Import updated `aiServices` (with fixed KSC endpoint)
- Load user KSC examples from Asset Library
- Implement STAR methodology display
- Add user profile context to generation
- Save generated responses

### 3.11 One-Click Application Generator

**Create:** `frontend/src/components/workflows/ApplicationGeneratorModal.tsx`

**Features:**

- Job selection dropdown
- Profile selection dropdown
- Generate button → `workflowService.generateApplicationPackage()`
- Display workflow status (progress indicator)
- Download package button (resume + cover letter + KSC)

### 3.12 Notification Center

**Create:** `frontend/src/components/notifications/NotificationCenter.tsx`

**Features:**

- Replace TODO in Navbar.tsx line 350
- Fetch notifications: `notificationService.getNotifications(userId)`
- Display list with mark as read
- Filter by type
- Real-time updates (polling or websocket)

### 3.13 Application Management Modals

**Create Components:**

- `frontend/src/components/applications/ApplicationDetailsModal.tsx`
  - Timeline view
  - Contacts section
  - Interview tracking
  - Document versioning
  - Notes editor

- `frontend/src/components/applications/AddApplicationModal.tsx`
  - URL input with parsing
  - Company/role extraction
  - Document association
  - Deadline picker
  - Status dropdown

### 3.14 Bulk Operations Implementation

**File:** `frontend/src/pages/DocumentsPage.tsx` (and other list pages)

**Features:**

- Multi-select checkboxes (already in UI)
- Bulk actions toolbar (visible when items selected)
- Batch archive: `applicationService.bulkUpdate(ids, { status: 'archived' })`
- Batch delete with confirmation
- Export selected items (CSV/JSON download)

### 3.15 Settings Page Integration

**File:** `frontend/src/pages/SettingsPage.tsx`

**Features:**

- Load settings: `settingsService.getSettings(userId)`
- Form for all settings (API keys, integrations, notifications, privacy)
- Save button: `settingsService.updateSettings(userId, formData)`
- Success/error notifications

### 3.16 Advanced Table Features

**Files:** All pages with tables (AnalysisPage, ApplicationTracker, etc.)

**Implement:**

- **Sorting:** Click column headers to sort
  - State: `sortBy`, `sortDirection`
  - Apply sort to data array
- **Filtering:** Column-specific filters
  - Filter chips UI
  - Apply filters to data
- **Row Selection:** Checkbox column
  - State: `selectedRows` array
  - Select all checkbox in header
- **Sticky Headers:** CSS position: sticky on table header
- **Pagination:** Pagination component at bottom
  - State: `page`, `itemsPerPage`
  - Slice data array based on page

### 3.17 List Virtualization

**Install:** `react-virtual` or `react-window`
**Apply to:** Long lists (AssetLibrary, ApplicationTracker, JobListings)

**Implementation:**

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";
// Configure virtualizer with parent ref and item count
// Render only visible items
```

### 3.18 Drag-and-Drop Lists

**Install:** `@dnd-kit/core`, `@dnd-kit/sortable`
**Apply to:** Application pipeline view (Kanban board style)

**Implementation:**

- Draggable application cards
- Drop zones for status columns
- Update backend on drop: `applicationService.updateApplication(id, { status })`

---

## Phase 4: Accessibility (A11y) - 22 tasks

### 4.1 ARIA Labels Audit

**Target:** All 100+ component files

**Process:**

- Search for `IconButton` components without `aria-label`
- Add `aria-label` to all icon-only buttons
- Example: `<IconButton aria-label="Delete document">...</IconButton>`

**Priority Files:**

- `DocumentsPage.tsx`
- `OpportunitiesPage.tsx`
- `AnalysisPage.tsx`
- `Navbar.tsx`
- All modals/dialogs

### 4.2 Keyboard Navigation

**Target:** All interactive custom components

**Implement:**

- **Tab order:** Ensure logical tab order (no tabIndex > 0)
- **Focus indicators:** Add visible focus styles
  ```css
  &:focus-visible {
    outline: 2px solid #a855f7;
    outline-offset: 2px;
  }
  ```
- **Escape key:** Close modals on Escape
- **Enter/Space:** Trigger button actions
- **Arrow keys:** Navigate dropdowns/menus

**Components to Update:**

- All custom dropdowns
- All modals (DialogClose on Escape)
- Tabs component (arrow key navigation)
- Autocomplete components

### 4.3 Screen Reader Support

**Tasks:**

- Add `aria-live="polite"` to loading states
- Add `aria-describedby` to form inputs (connect to error messages)
- Add `role="status"` to status indicators
- Hide decorative icons: `aria-hidden="true"`
- Add screen reader-only text for icon buttons

**Example:**

```tsx
<span className="sr-only">Delete document</span>
<TrashIcon aria-hidden="true" />
```

### 4.4 Form Accessibility

**All Forms:**

- Connect labels to inputs with `htmlFor` and `id`
- Add `aria-describedby` pointing to error message IDs
- Add `aria-invalid="true"` on error state
- Add `aria-required="true"` for required fields

### 4.5 Modal Accessibility

**All Modals:**

- Add `aria-modal="true"`
- Add `aria-labelledby` pointing to modal title ID
- Add `aria-describedby` pointing to modal description
- Trap focus inside modal when open
- Return focus to trigger element on close

### 4.6 Color Contrast Audit

**Tool:** Use WCAG contrast checker
**Verify:** All text colors meet WCAG AA (4.5:1 for normal, 3:1 for large)

**Check:**

- #FFFFFF on #0F0F0F ✓
- #B3B3B3 on #0F0F0F (verify)
- #A855F7 on #0F0F0F (verify)
- All status colors on dark backgrounds

### 4.7 Semantic HTML

**Audit:**

- Replace `<div>` buttons with `<button>`
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<article>`, `<section>` appropriately
- Use proper heading hierarchy (h1 → h2 → h3)

---

## Phase 5: Refactoring & Polish - 18 tasks

### 5.1 Design Token Migration

**Target:** ~100 files with `sx={{}}` props

**Strategy:**

1. Create styled components in `frontend/src/components/styled/`
2. Replace inline `sx={{}}` with styled components
3. Use theme tokens: `theme.spacing()`, `theme.palette`

**Example Before:**

```tsx
<Box sx={{ p: 3, mb: 4, borderRadius: 2 }}>
```

**Example After:**

```tsx
const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));
```

**Priority Files:**

- All page components
- Card components
- Button components

### 5.2 Standardize Spacing

**Search:** Hardcoded padding/margin values
**Replace:** With `theme.spacing()`

**Examples:**

- `p: 6` → `padding: theme.spacing(6)`
- `mb: 4` → `marginBottom: theme.spacing(4)`

### 5.3 Standardize Border Radius

**Search:** Hardcoded `borderRadius` values
**Replace:** With theme tokens or 12px standard

**Examples:**

- `borderRadius: 20` → `borderRadius: '12px'`
- `borderRadius: 2` → `borderRadius: theme.shape.borderRadius`

### 5.4 Page Transition Animations

**Install:** `framer-motion`
**Apply:** To route changes

**Implementation:**

```tsx
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0 },
};

<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
  {children}
</motion.div>;
```

### 5.5 Card Hover Animations

**Already Defined:** `translateY(-4px)` on hover
**Ensure:** All interactive cards have this effect
**Add:** Smooth transitions (0.3s ease)

### 5.6 Button Micro-Interactions

**Implement:**

- Ripple effect on click (MUI default, ensure enabled)
- Loading spinner transition (fade in/out)
- Press effect: `transform: scale(0.98)` on active state

### 5.7 Input Focus Animations

**Add to All Inputs:**

```css
transition:
  border-color 0.3s ease,
  box-shadow 0.3s ease;

&:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}
```

### 5.8 Toast/Snackbar Animations

**Component:** Toast (to be created in design system)
**Animations:**

- Slide in from top/bottom (0.3s ease)
- Fade out on dismiss (0.3s ease)

### 5.9 Dialog Animations

**All Dialogs:**

- Enter: Fade + scale from 0.95 to 1 (0.3s ease)
- Exit: Fade + scale to 0.95 (0.2s ease)
- Backdrop: Fade in/out (0.3s ease)

### 5.10 Skeleton Loading Shimmer

**Component:** Skeleton (already exists)
**Add:** Shimmer animation

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
background-size: 1000px 100%;
animation: shimmer 2s infinite;
```

### 5.11 List Add/Remove Animations

**Install:** `framer-motion` AutoAnimate or CSSTransitionGroup
**Apply:** To all dynamic lists

**Implementation:**

```tsx
import { AnimatePresence, motion } from "framer-motion";

<AnimatePresence>
  {items.map((item) => (
    <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>;
```

### 5.12 Responsive Breakpoints

**Target:** All components/pages
**Apply:** Theme breakpoints

**Example:**

```tsx
sx={{
  fontSize: { xs: '14px', sm: '16px', md: '18px' },
  padding: { xs: 2, sm: 3, md: 4 },
}}
```

**Or with styled-components:**

```tsx
const ResponsiveBox = styled(Box)(({ theme }) => ({
  fontSize: "14px",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "18px",
    padding: theme.spacing(4),
  },
}));
```

### 5.13 Mobile Navigation Drawer

**Component:** Navigation (existing Sidebar)
**Add:** Mobile-specific behavior

**Implementation:**

- Drawer slides from left on mobile (<768px)
- Hamburger menu in Navbar toggles drawer
- Backdrop overlay when open
- Close on route change

### 5.14 Touch-Friendly Tap Targets

**Audit:** All interactive elements
**Ensure:** Minimum 44px × 44px hit area

**Fix IconButtons:**

```tsx
<IconButton size="large"> {/* Increases to 48px */}
```

### 5.15 Bottom Sheet for Mobile Modals

**Install:** `react-spring-bottom-sheet` or build custom
**Apply:** To modals on mobile devices

**Implementation:**

- Detect mobile viewport
- Render BottomSheet instead of Dialog
- Swipe to dismiss

### 5.16 Responsive Tables

**All Tables:**

- Desktop: Full table display
- Tablet: Hide less important columns
- Mobile: Card view (each row becomes a card)

**Implementation:**

```tsx
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

{
  isMobile ? <CardView data={data} /> : <TableView data={data} />;
}
```

### 5.17 Image Lazy Loading

**All Images:**

- Add `loading="lazy"` attribute
- Add placeholder while loading

### 5.18 Code Splitting

**Apply:** To route-level components

**Implementation:**

```tsx
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"));

<Suspense fallback={<LoadingState />}>
  <Routes>
    <Route path="/opportunities" element={<OpportunitiesPage />} />
  </Routes>
</Suspense>;
```

---

## Phase 6: Documentation - 7 tasks

### 6.1 Storybook Stories - UI Components (29 components)

**Location:** `frontend/src/components/ui/**/*.stories.tsx`

**Create Stories For:**

- All 29 UI components (input, button, card, dialog, etc.)

**Each Story Should Include:**

- Default variant
- All prop variations
- Interactive controls (Storybook args)
- Usage example code
- Accessibility notes

**Template:**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["contained", "outlined", "text"] },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "contained",
    children: "Primary Button",
  },
};
```

### 6.2 Storybook Stories - Library Components (15 components)

**Location:** `frontend/src/components/library/**/*.stories.tsx`

**Create Stories For:**

- ProfileVariationCard, TemplateCard, KeywordTag, ATSScoreCircle, etc.

### 6.3 Storybook Stories - Feature Components

**Location:** `frontend/src/components/features/**/*.stories.tsx`

**Select Key Components:**

- JobCard, ApplicationCard, DocumentCard
- Smart Upload Modal
- Application Generator Modal

### 6.4 Design Token Documentation

**Create:** `docs/design-system/tokens.md`

**Content:**

- Color palette showcase (with hex values)
- Typography scale (sizes, weights)
- Spacing system (8px, 16px, 24px, etc.)
- Shadow/elevation guide (with CSS values)
- Border radius tokens

### 6.5 Component Usage Guidelines

**Create:** `docs/design-system/component-guidelines.md`

**Sections:**

- When to use Button vs IconButton
- Card vs Paper usage
- Modal vs Drawer guidelines
- Form layout patterns
- Error handling patterns
- Navigation patterns

### 6.6 Accessibility Guidelines

**Create:** `docs/design-system/accessibility.md`

**Content:**

- WCAG compliance checklist
- Keyboard navigation guide (what keys do what)
- Screen reader testing procedures
- Color contrast requirements
- ARIA attribute guide
- Common accessibility mistakes to avoid

### 6.7 Design Principles Documentation

**Create:** `docs/design-system/principles.md`

**Content:**

- Design philosophy (dark theme, Material 3 expressive)
- Component naming conventions
- Composition patterns
- Theme customization guide
- File organization standards
- Best practices

---

## 📊 Execution Strategy (Token-Efficient)

### Sequential Phases

Execute in order: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

### Within Each Phase

Group related tasks:

- Backend fixes (all 3 at once)
- Services (create 3-5 at a time)
- Pages (integrate 1-2 at a time)
- Components (batch similar components)

### Validation Checkpoints

After each phase:

1. Run linter: `yarn lint`
2. Run type check: `yarn tsc --noEmit`
3. Run tests: `yarn test`
4. Manual smoke test in browser

### Parallel Work (If Multiple Sessions)

- Backend fixes (Phase 1) - Independent
- Service layer (Phase 2) - Independent
- Integration (Phase 3) - Depends on Phase 2
- Accessibility (Phase 4) - Can start after Phase 3 partial completion
- Polish (Phase 5) - Can start after Phase 3 partial completion
- Documentation (Phase 6) - Can start anytime, finalize at end

---

## 🎯 Success Criteria

### Phase 1 Complete

- ✅ Email scanner returns valid data
- ✅ Cover letter endpoint returns generated letter
- ✅ KSC endpoint returns structured responses
- ✅ All backend tests pass

### Phase 2 Complete

- ✅ 15 service files created
- ✅ All functions have TypeScript types
- ✅ Error handling implemented
- ✅ Token refresh logic in place

### Phase 3 Complete

- ✅ All routes accessible
- ✅ Authentication working (login/logout/protected routes)
- ✅ All pages show real data (no mock data)
- ✅ All workflows functional
- ✅ All modals/forms working

### Phase 4 Complete

- ✅ All interactive elements have ARIA labels
- ✅ Keyboard navigation works on all components
- ✅ Screen reader announces state changes
- ✅ All text meets WCAG AA contrast

### Phase 5 Complete

- ✅ No inline `sx={{}}` props (migrated to styled-components)
- ✅ All animations smooth (0.3s ease)
- ✅ Mobile responsive on all pages
- ✅ No hardcoded spacing/colors
- ✅ Code splitting implemented

### Phase 6 Complete

- ✅ Storybook has 50+ stories
- ✅ All guidelines documented
- ✅ Accessibility checklist available
- ✅ Design principles published

---

## 📝 Notes

- **TypeScript Types:** Create shared types in `frontend/src/types/` for all request/response schemas
- **Environment Variables:** Backend API URL in `.env` (e.g., `VITE_API_URL=http://localhost:8080`)
- **Error Handling:** Standardize error responses (show toast notifications)
- **Loading States:** Use `LoadingState` component consistently
- **Empty States:** Use `EmptyState` component consistently
- **Commit Strategy:** Commit after each phase completion
- **Branch Strategy:** Create feature branch per phase or per major task

---

**END OF IMPLEMENTATION PLAN**
