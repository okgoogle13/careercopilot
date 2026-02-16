<!-- 
NOTE: This spec sheet consolidates `wireframe-index.md`, `06-wireframes.md`, `06b-asset-placement.md`, and `06c-content-guide.md`.
It is intended to be pasted into Figma or fed into Figma AI / Figma Make as a page-by-page spec.
-->

# Kerala Rage — Solidarity Mode Specification

## Global Design Standards (Hi-Fi Tokens)

**Typography (Federation Stack):**
- **Hero Title:** `Libre Bodoni` (Proclamation). Bold, Condensed. **240px** (Desktop).
- **Secondary Hero/Headline:** `Fraunces Energetic` (SOFT=100, WONK=1, wght=900). **72px-144px**.
- **Section Headers:** `Fraunces Restrained` (SOFT=20, WONK=0). **32px-64px**.
- **Body:** `Work Sans` (Field Note). **16px-24px**.
- **Micro/Label:** `JetBrains Mono` (Annotation). Uppercase, tracking-widest. **11px-14px**.
- **Accent:** `Caveat` (Curator). Cursive, weight 700.
- **Color Accent:** `Nabla` (Hero Accent). Color Font. Use for high-impact single words in Hero segments.

**Motion ("Viscous Breeze"):**
- **Curve:** `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Stagger:** **0.1s delay** between items.
- **Spring:** Stiffness: 320, Damping: 26.
- **Reduced Motion:** Fallback to simple opacity fade (0.3s).

**Color & Shape:**
- **Substrate:** `bg-asphalt-black` (#1A1A1A).
- **Text:** `solidarityRed` (#F14714) for Hero, `inkGold` (#DAF674) for Accents, `paperWhite` (#DAF6B3 - Worker Ash).
- **Card Shape:** Asymmetric: `Stone` (16px 4px 12px 24px) or `Leaf` (24px 8px 20px 4px).
- **Button Shape:** `Pebble` (20px 6px 16px 28px).

## /landing — Landing Page ("The Solidarity Manifesto")

**Purpose:** Primary entry point and brand manifesto. Establish "Solidarity Mode" ethos immediately.
**Asset Treatment:** **Editorial Hero (High Impact)**. Requires Resistance Anchor (e.g., Bhagat Singh).
**Backend:** No (Static marketing page).
**Client-side:** Yes.

**Data entities:**
- Static Content (Manifesto text)
- Auth State (Redirect if already logged in)

**Sections (top to bottom):**
1. **Background Layer (Z-0):** Substrate `{KR-SOLID-033}` (Melbourne Laneway) @ 25% opacity + Gradient Overlay.
2. **Atmosphere Layer (Z-2/3):** `{KR-UI-001}` Wheat Paste Tear (top-right), `{KR-UI-003}` Grit Particles (floating), `{KR-UI-002}` Halo Disk (bottom-left, `inkGold`).
3. **Hero Section:**
   - Headline: "THE SOLIDARITY MANIFESTO" (Fraunces Energetic 144px, SOFT=100, WONK=1, wght=900, `text-solidarityRed`).
   - Subhead: "Your professional history, re-documented for the **collective** future." (**Nabla** 48px for "collective", Caveat 48px for rest, `text-inkGold`).
4. **Feature Grid:** 3 Stone Cards ("Build Your Story", "Archive Evidence", "Resist Slop").
5. **Navigation:** Primary CTA "BUILD YOUR STORY" (Pebble button), Secondary "View the Collective".
6. **Footer:** "Built with solidarity..." attribution.

**Key actions:**
- Click "BUILD YOUR STORY" → Go to /auth/register
- Click "View the Collective" → Go to /dashboard-overview (public view?) or login

**Connects to:**
- /auth (Login/Register)
- /dashboard-overview

**Emotional tone:** Defiance (High drama, maximum asset density).
**Symbolic Anchor:** Allowed (Resistance figures: Bhagat Singh/Tipu Sultan).

---

## /auth — Authentication ("The Verification")

**Purpose:** Secure gateway to the archive. Focus on trust and identity verification.
**Asset Treatment:** **Functional (Atmospheric Only)**. Use Abstract assets only.
**Backend:** Yes (Supabase Auth).
**Client-side:** Form validation.

**Data entities:**
- UserCredentials { email, password }
- SocialAuth { provider: 'google' }
- AuthError { message, code }

**Sections (top to bottom):**
1. **Background:** Substrate `{KR-SOLID-033}` @ 15% opacity (darker).
2. **Container:** Stone Card (480px width, centered).
   - Header: "VERIFY IDENTITY" (Fraunces Energetic 72px, `font-weight: 800`).
   - Helper: "Enter the Solidarity Archive."
   - Social: "Verify with Google" (Pebble button, `border-blueprint-grey/20`, icon: Google G).
   - Divider: "OR" (`JetBrains Mono` 10px, centered with lines).
   - Inputs: Email, Password (Label: `JetBrains Mono` 12px uppercase).
   - Actions: "Enter Archive" (Primary `bg-ink-gold`), "Create Collective ID" (Secondary).
3. **Decoration:** `{KR-UI-002}` Halo Disk (60% opacity) + `{KR-SOLID-033}` Laneway texture.
   - **Motion:** Container enters `y: 40` → `0` (Heavy Spring). Halo Pulse loop (8s).
4. **Error Display:** `solidarityRed` messages for invalid credentials.

**Key actions:**
- Submit Login form
- Navigate to Registration
- Initiate Password Reset

**Connects to:**
- /onboarding (New users)
- /dashboard-overview (Returning users)

**Emotional tone:** Trust (Minimal decoration, security focus).
**Symbolic Anchor:** Forbidden.

---

## /onboarding — Onboarding ("The Collective Choice")

**Purpose:** User self-selection of professional context (Industry/Path).
**Asset Treatment:** **Functional (Atmospheric Only)**.
**Backend:** Yes (Update User Profile).
**Client-side:** Selection state.

**Data entities:**
- UserProfile { industry_path: 'TECH' | 'CARE' | 'CREATIVE' }

**Sections (top to bottom):**
1. **Background:** `{KR-UI-005}` Charcoal Paper + `{KR-UI-004}` Blueprint Grid (8% opacity).
2. **Page Header:** "CHOOSE YOUR SOLIDARITY PATH" (Fraunces Energetic 72px).
3. **Selection Grid:** 3 Stone Cards (`Fraunces Restrained` 32px Title).
   - Active state: Border highlight `inkGold`, Shadow `ink-glow`.
   - **Motion:** Stagger entry (0.1s). Hover lift (`y: -8`).
4. **Action Bar:** "Continue to Deposit" (Primary CTA).

**Key actions:**
- Select Industry Card (Single select)
- Click Continue → Save profile & Navigate

**Connects to:**
- /ingestion (Next step)

**Emotional tone:** Possibility (Structural grid, clear choices).
**Symbolic Anchor:** Forbidden.

---

## /ingestion — Ingestion ("The Deposition")

**Purpose:** Upload and parse resume/CV documents.
**Asset Treatment:** **Functional (Low Density)**. Focus on drop zone.
**Backend:** Yes (File Upload + Parsing Service).
**Client-side:** Drag-and-drop handling, file validation.

**Data entities:**
- Document { file_blob, size, type, status: 'UPLOADING' | 'ANALYZING' | 'PARSED' | 'ERROR' }

**Sections (top to bottom):**
1. **Background:** `{KR-UI-005}` Charcoal Paper + `{KR-UI-006}` Blueprint Layout Watermark (centered).
2. **Header:** "DEPOSIT HISTORY" (Fraunces Energetic 72px).
3. **Drop Zone:** Slab Container (`bg-asphalt-black/40`, `border-dashed`, `border-ink-gold/30`).
   - Empty: "DROP PDF HERE FOR ANALYSIS" (`Work Sans` 18px).
   - Active: Border shifts `solidarityRed`, Shadow `ink-glow`.
   - Success: "{KR-UI-007} Screenprint Stamp" animation (Slam effect).
   - **Motion:** Dropzone "Breathing" pulse (20% → 40% opacity).
4. **Status Text:** "Analyzing... {percentage}%" (Viscous spring progress).
5. **Action:** "View Analysis" (appears on success).

**Key actions:**
- Drag & Drop PDF
- File Input Click
- Navigate to Analysis (post-success)

**Connects to:**
- /analysis (View results)

**Emotional tone:** Gravity (Tactical, evidence-based).
**Symbolic Anchor:** Forbidden.

---

## /analysis — Analysis Dashboard ("The Audit Microscope")

**Purpose:** Detailed review of parsed skills and gaps against market data.
**Asset Treatment:** **Functional (Data Density)**.
**Backend:** Yes (Fetch Analysis Results).
**Client-side:** Data visualization rendering.

**Data entities:**
- AnalysisResult { match_score (0-100), skills_found[], gap_analysis[] }

**Sections (top to bottom):**
1. **Background:** `{KR-UI-005}` + `{KR-UI-004}` Blueprint Grid (Full viewport).
2. **Header:** "THE AUDIT" (Fraunces Energetic 48px) + Score Gauge `{KR-UI-002}`.
3. **Skill Grid:** 2x3 Grid of Stone Cards (`Fraunces Restrained` 20px Title, `JetBrains Mono` 12px Mastery).
   - "Verified Skills" list.
   - "Missing Evidence" / Gaps.
   - **Motion:** Tile stagger reveal (`scale: 0.95` → `1.0`). Hover elevation (`y: -6`).
4. **Primary Action:** "Browse Opportunities" (Bottom).

**Key actions:**
- Review detected skills
- Manually add/edit skills (if supported)
- Navigate to Feed

**Connects to:**
- /feed (Next logical step)

**Emotional tone:** Revelation (High clarity, functional).
**Symbolic Anchor:** Allowed (Devotional: Shiva/Elephant - functional context).

---

## /feed — Opportunity Feed ("The Lookout")

**Purpose:** Browse and filter matched job opportunities.
**Asset Treatment:** **Functional (List View)**.
**Backend:** Yes (Search/Filter API).
**Client-side:** List virtualization, filter state.

**Data entities:**
- Opportunity { id, title, company, match_score, status }
- FilterState { role_type, min_match_score }

**Sections (horizontal layout):**
1. **Sidebar (Left, 240px):**
   - Header: "The Lookout".
   - Filters: Pebble Toggles (Role, Score).
2. **Feed Area (Right):**
   - Header: "Opportunities matched to your evidence." (Fraunces Energetic 48px).
   - Cards: Stone Containers (`bg-asphalt-black/50`, `border-white/5`).
     - Priority Badge: `JetBrains Mono` 12px (`font-weight: 700`).
     - `{KR-UI-003}` Grit particles in sidebar.
     - **Motion:** Stream Entry (spring opacity+y). Priority Pulse (border-color).
   - Top-right decoration: `{KR-UI-001}` Wheat Paste Tear.
3. **Empty State:** "No opportunities match..."

**Key actions:**
- Filter/Sort list
- Click Card → View Details (Kanban creation flow)
- Save Opportunity

**Connects to:**
- /kanban (When applying)

**Emotional tone:** Discovery (Moderate asset density).
**Symbolic Anchor:** Forbidden.

---

## /kanban — Kanban Board ("The Command Center")

**Purpose:** Manage active applications through lifecycle stages.
**Asset Treatment:** **Functional (Board View)**.
**Backend:** Yes (CRUD Applications).
**Client-side:** Drag-and-drop (dnd-kit).

**Data entities:**
- Application { id, job_title, company, status, date_applied }
- Statuses: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER'

**Sections (top to bottom):**
1. **Header:** "THE COMMAND CENTER" (Recursive 72px).
2. **Board Area:** 4 Columns (Stone backgrounds).
   - Headers: "Applied", "Screening", "Interview", "Offer" (`Fraunces Restrained` 24px, uppercase).
   - Decoration: `{KR-UI-001}` Wheat paste tears on column headers.
   - Cards: Draggable Stone cards.
3. **"Offer" Column:** Increased `{KR-UI-003}` Grit density (culmination).

**Key actions:**
- Drag card between columns
- Click card to open Detail Drawer
- Add new application manually

**Connects to:**
- /editor (Draft cover letter for card)
- /documents (Attach file)

**Emotional tone:** Control (Structural, organized).
**Symbolic Anchor:** Forbidden.

---

## /editor — Split-Screen Editor ("The Writing Workbench")

**Purpose:** Draft cover letters/responses while referencing evidence.
**Asset Treatment:** **Functional (Minimalist)**. Focus on writing.
**Backend:** Yes (Save Drafts, Fetch Evidence).
**Client-side:** Rich text editing, split-pane layout.

**Data entities:**
- ContentDraft { id, body_text, last_saved }
- EvidenceSnippet { id, text, source_doc }

**Sections (Split Layout):**
1. **Left Panel (30% - Evidence):**
   - Header: "Evidence".
   - Cards: Stone cards with extracted skills/projects.
   - Action: "Insert" button per card.
2. **Right Panel (70% - Editor):**
   - Background: `{KR-UI-004}` Blueprint Grid (5% opacity - ruled paper feel).
   - Header: "Cover Letter" / "THE WORKBENCH" (Fraunces Energetic).
   - Editor Area: Slab Container (`JetBrains Mono` 14px, `leading-tight`).
     - Divider: `bg-ink-gold` (2px tactile line).
     - **Motion:** Preview Refresh (`blur-sm` → `opacity` fade).
   - Footer: "Finalize Application" button.

**Key actions:**
- Write/Edit text
- Insert evidence snippet (Copy to editor)
- Save Draft
- Click Finalize → Go to Studio

**Connects to:**
- /studio (Finalize PDF)

**Emotional tone:** Craft (Minimal distraction, tool-focused).
**Symbolic Anchor:** Forbidden.

---

## /studio — Studio Designer ("The Manifesto Finalization")

**Purpose:** Final review and PDF generation.
**Asset Treatment:** **Functional (Tooling)**.
**Backend:** Yes (PDF Generation Service).
**Client-side:** Live preview toggle.

**Data entities:**
- DocumentFinal { preview_url, export_url }
- ViewMode: 'BOT' | 'HUMAN'

**Sections (Split Layout):**
1. **Left Panel (25% - Controls):**
   - Header: "Format Controls" + `{KR-UI-002}` Halo Disk (40%).
   - Toggles: "Bot View" vs "Human View".
   - Actions: "Export PDF" (Primary), "Save Draft".
2. **Right Panel (75% - Preview):**
   - Container: Stone Container (`bg-asphalt-black`, `border-white/5`, `shadow-viscous`).
   - Overlay: `{KR-UI-004}` Blueprint Grid (`border-ink-gold/10` grid lines).
   - Success: `{KR-UI-007}` Screenprint Stamp animation on Export.
   - **Motion:** Motif Drag (Ghost @ 50% opacity). Snapping (High-stiffness spring).

**Key actions:**
- Toggle View Mode
- Export PDF (Triggers download + stamp)

**Connects to:**
- /kanban (Return to board)

**Emotional tone:** Refinement (Precision, archival).
**Symbolic Anchor:** Forbidden.

---

## /settings — Settings ("The Archive Vault")

**Purpose:** User configuration and data management.
**Asset Treatment:** **Functional (Form Heavy)**.
**Backend:** Yes (User Preferences, Data Export).
**Client-side:** Form state.

**Data entities:**
- UserSettings { profile, privacy, notifications }

**Sections (top to bottom):**
1. **Background:** `{KR-UI-005}` + Large `{KR-UI-006}` Blueprint Layout (800px width).
2. **Header:** "ARCHIVE CONFIGURATION" (Fraunces Energetic 48px).
3. **Grid:** 2x2 Grid of Stone Containers (`Fraunces Restrained` 24px Category).
   - Profile Settings (Toggle: `bg-ink-gold` On).
   - Privacy Controls.
   - Data Management.
   - Export Options.
   - **Motion:** Group stagger (0.05s). Toggle Flip (High-tension spring).
   - *Note:* `{KR-UI-004}` Grid behind each card.

**Key actions:**
- Update Profile
- Download Personal Data Archive
- Delete Account (Destructive)

**Connects to:**
- /auth (Logout)

**Emotional tone:** Storage (Institutional, secure).
**Symbolic Anchor:** Forbidden.

---

## /dashboard-overview — Dashboard Overview ("The Collective")

**Purpose:** High-level status of the user's career ecosystem.
**Asset Treatment:** **Editorial Hero (High Impact)**. Requires Cultural Anchor (e.g. Elephant/Shiva).
**Backend:** Yes (Aggregated Stats).
**Client-side:** Dashboard widgets.

**Data entities:**
- DashboardStats { active_count, skills_count, velocity }
- ActivityFeed { recent_events[] }

**Sections (top to bottom):**
1. **Background:** Substrate `{KR-SOLID-033}` @ 25% + `{KR-UI-001}` Wheat Paste Tear (Top-left, dramatic).
2. **Hero:** "THE COLLECTIVE IS THRIVING" (Recursive 72px).
3. **Stats Row:** 3 Metric Cards (Stone).
   - Active Applications / Skills Tracked / Progress (Label: JetBrains Mono `tracking-widest` 12px).
   - Values: Fraunces Restrained 48px (`text-paperWhite`).
4. **Decoration:** `{KR-UI-002}` Halo Disk (Bottom-right, `inkGold`).
5. **Atmosphere:** `{KR-UI-003}` Grit Particles (Ambient, 5% opacity).

**Key actions:**
- View detailed reports (Click cards)
- Quick navigations to Kanban/Feed

**Connects to:**
- All main features

**Emotional tone:** Altitude (High drama, "The Collective").
**Symbolic Anchor:** Allowed (Resistance figures / First Nations placards + solidarity text).

---

## /styleguide — Living Style Guide ("The Codex")

**Purpose:** Living documentation of all design tokens, components, and asset placeholders.
**Asset Treatment:** **Functional (Reference)**. No assets required.
**Backend:** No.
**Client-side:** Yes (Storybook equivalent).

**Sections:**
1. **Typography Scale:**
   - Hero: `Fraunces Energetic` (Check SOFT/WONK variations).
   - Body: `Work Sans`.
   - Mono: `JetBrains Mono`.
   - Accent: `Caveat`.
2. **Color Palette:** Swatches for `solidarityRed`, `inkGold`, `asphalt-black`, `charcoal-paper`.
3. **Component Library:**
   - **Buttons:** Wattle shape variants (Primary, Secondary, Ghost).
   - **Cards:** Stone shape variants (Slab, Pebble).
   - **Inputs:** Text fields with `inkGold` focus states.
4. **Asset Manifest:** Placeholder frames for every asset listed in the Asset Library below.

---

## Asset Library

### Atmospheric & Substrate (Backgrounds/Overlays)
| ID | Name | Role | Aspect | Usage Rules |
| :--- | :--- | :--- | :--- | :--- |
| KR-SOLID-034 | Melbourne Laneway | Substrate (Base) | 1:1 | Hero Background / Global Overlay. **Never** overlay with other substrates. |
| KR-SOLID-001 | Abstract Solidarity Chatgpt | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-002 | Abstract Dalle 2026 | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-003 | Abstract Gemini | Atmospheric | 3:4 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-004 | Kerala Rage Bee | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-005 | Kerala Rage Bra | Atmospheric | 11:6 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-006 | Kerala Rage Fly | Atmospheric | 11:6 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-007 | Kerala Rage Fri | Atmospheric | 16:9 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-008 | Kerala Rage Gri | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-009 | Kerala Rage Kr | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-010 | Kerala Rage Nav | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-011 | Kerala Rage Rad | Atmospheric | 11:6 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-012 | Kerala Rage Sea | Atmospheric | 11:6 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-013 | Kerala Rage Sen | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-014 | Kerala Rage Wat | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-015 | Kr Solid 013 | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-016 | Kr Solid 014 | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-017 | Moodboard 12 Ti | Atmospheric | 2:3 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-018 | Abstract Solidarity | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |
| KR-SOLID-019 | Paint Splash V1 | Atmospheric | 1:1 | Hero/Section. Overlay on Substrate. |

### Resistance & Cultural Anchors (Foreground)
| ID | Name | Role | Aspect | Usage Rules |
| :--- | :--- | :--- | :--- | :--- |
| KR-SOLID-020 | Devotional Cultural Anchor | Mythic Anchor | 1:1 | **CRITICAL**. Hero Only. Dominant foreground. |
| KR-SOLID-021 | Shiva Statue V1 | Mythic Anchor | 1:1 | **CRITICAL**. Hero Only. Dominant foreground. |
| KR-SOLID-022 | Shiva Statue Street V1 | Mythic Anchor | 16:9 | **CRITICAL**. Hero Only. Dominant foreground. |
| KR-SOLID-023 | Shiva Urban Protest V1 | Mythic Anchor | 16:9 | **CRITICAL**. Hero Only. Dominant foreground. |
| KR-SOLID-024 | Resistance Portrait | Heroic | 1:1 | Hero/Feature. Foreground. |
| KR-SOLID-025 | Bhagat Singh V1 | Heroic | 3:4 | **CRITICAL**. Hero/Feature. Foreground. |
| KR-SOLID-026 | Tipu Sultan V1 | Heroic | 1:1 | **CRITICAL**. Hero/Feature. Foreground. |
| KR-SOLID-027 | Turbaned Man V1 | Heroic | 3:2 | **CRITICAL**. Hero/Feature. Foreground. |
| KR-SOLID-028 | Resistance History Portrait | Heroic | 1:1 | **CRITICAL**. Hero/Feature. Foreground. |
| KR-SOLID-029 | First Nations Placard V1 | Heroic | 29:36 | Hero/Feature. Foreground. |
| KR-SOLID-030 | Treaty Now Poster V1 | Heroic | 1:1 | Hero/Feature. Foreground. |
| KR-SOLID-031 | Resistance History Activist | Heroic | 24:43 | Hero/Feature. Foreground. |
| KR-SOLID-032 | Kerala Elephant V1 | Iconic Anchor | 1:1 | Hero/Section/Card. Mid-layer suitable. |
| KR-SOLID-033 | Kerala Landscape V1 | Iconic Anchor | 16:9 | Hero/Section/Card. Mid-layer suitable. |

### UI Kit (Functional Elements)
| ID | Name | Role | Usage Rules |
| :--- | :--- | :--- | :--- |
| KR-UI-001 | Wheat Paste Tear | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-002 | Halo Disk | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-003 | Grit Particles | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-004 | Blueprint Grid | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-005 | Charcoal Paper | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-006 | Blueprint Layout Watermark | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-007 | Screenprint Stamp | UI Element | Icon/Component. Safe for small UI. |
| KR-UI-008 | Elite Mastery Motif | Overlay | Component/Overlay. |
| KR-UI-009 | Mastery Chart Patterns | Pattern Fill | Component/Chart. |
| KR-UI-010 | Success Screen Motif | Overlay | Component/Background. |
| KR-UI-011 | Historical Record Texture | Pattern Fill | Component/Background. |
| KR-UI-012 | Metric graphical motifs | Motif Glyph | Component/Icon. |
| KR-UI-013 | Scanning Holographic Motif | Overlay | Component/Overlay. |
| KR-UI-014 | Resolved Card Motif | Corner Motif | Component/Frame. |
| KR-UI-015 | Priority Indicator Halo | Motif Glyph | Component/Icon. |
| KR-UI-016 | Status Icons Set | Icon Set | Component/Icon. |
| KR-UI-017 | Skill Achievement Badge | Badge Set | Component/Icon. |
| KR-UI-018 | Grid Line Corner Motifs | Corner Motif | Component/Frame. |
| KR-UI-019 | Motif Reservoir Items | Reservoir | Component/Icon. |

