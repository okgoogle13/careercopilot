Prompt 1: /analysis — "The Analysis" Reconstruction
/analysis — CareerCopilot Analysis Workbench: Kerala-Rage Reconstruction v6.1
System Role: Senior React Architect, KR Solidarity v6.1. You are building a Forensic Intelligence Workspace. This is where the AI reconstructs a worker's professional history from evidence. Aesthetic: Forensic Inking · Evidence Board · Collective Memory Retrieval.


0. Critical Naming Sync (Do This First)
The current page is named "The Audit" everywhere — this must be renamed to "The Analysis" throughout:
Page <title> and top bar breadcrumb: THE ANALYSIS // PERFORMANCE INTELLIGENCE
Sidebar nav label: The Analysis, sublabel: PERFORMANCE
Component file: rename to Analysis.tsx
Route remains /analysis — do not change


1. Visual Reference (What You Are Preserving)
The existing page is strong — preserve its structure and data, inject soul:
Full-bleed dark canvas, sidebar layout (same as /kanban)
Hero heading "YOUR PERFORMANCE" in --sys-color-inkGold-base, condensed display typeface, large
Top bar subline: "ATS scores, keyword matching, application pipeline — the data that drives your next move."
4 stat cards in a row: 87% ATS AVERAGE (+12%), 79% MATCH RATE (+8%), 25 APPLICATIONS (+6), 24% INTERVIEW RATE (-3%)
ATS Score Trend: line chart, 6-month trajectory (Aug → Feb), range 60–100, upward trend ending ~95
Pipeline donut: Applied 12 · Screening 5 · Interview 3 · Offered 1 · Rejected 4
Keyword Match Rates: horizontal bar chart — Case Mgmt, Risk Assess, Trauma Care, Report Writing, Stakeholder, NDIS
Matched Skills tag cloud: CASE MANAGEMENT, RISK ASSESSMENT, TRAUMA-INFORMED CARE, CRISIS INTERVENTION, REPORT WRITING, STAKEHOLDER ENGAGEMENT, CULTURAL SAFETY
Skill Gaps tag cloud: PROGRAM EVALUATION, DATA ANALYSIS, GRANT WRITING, RESEARCH METHODS (styled in --sys-color-solidarityRed-base to signal urgency)
Footer caption: "the gaps are where the growth lives" — italic, right-aligned, muted


2. Soul Injection (What Changes)
The page currently reads as clean dashboard. Inject Forensic Inking:
Investigation Frame: Wrap the stat cards in a section labeled EVIDENCE // ATS INTELLIGENCE in mono small caps, muted. The 4 cards should feel like evidence items being logged.
Deep Recall Motion: On mount, each stat card fades in with a 2px registration offset that resolves: @keyframes recall { from { opacity: 0; transform: translate(2px, -2px); } to { opacity: 1; transform: translate(0, 0); } }. Stagger by 80ms per card. No shimmer — flat opacity transition only.
Ink Gold for critical scores: ATS AVERAGE and MATCH RATE values use --sys-color-inkGold-base. Application count and Interview Rate use --sys-color-worker-ash-high.
Solidarity Crimson for gaps: Skill Gaps tags use border: 1px solid --sys-color-solidarityRed-base with --sys-color-solidarityRed-base text — these are missing credentials, not neutral data.
Chart integrity: The ATS trend line uses --sys-color-inkGold-base stroke. Data points are square (2px × 2px), not circular. No curve smoothing — sharp angular poly-line. This is a record, not a story.
Asymmetric stat cards: border-radius: 0 8px 8px 0, border-left: 3px solid --sys-color-inkGold-base for positive delta cards, border-left: 3px solid --sys-color-solidarityRed-base for negative delta (Interview Rate at -3%).


3. Design Tokens (Non-Negotiable)
Source: frontend/src/design/styles/design-tokens.css. Zero hardcoded hex.
--sys-color-inkGold-base — hero heading, positive stat values, trend line
--sys-color-solidarityRed-base — negative delta indicator, Skill Gaps tags, section accent bars
--sys-color-worker-ash-high — secondary stat values, chart labels
--sys-color-surface-elevated — stat card backgrounds
--sys-color-surface-base — canvas


4. Schema
ts
interface StrategyResult {
  ats_score: number;           // 87
  match_rate: number;          // 79
  application_count: number;   // 25
  interview_rate: number;      // 24
  score_trend: { month: string; score: number }[];  // Aug–Feb
  pipeline: { status: string; count: number }[];
  keyword_match_rates: { skill: string; rate: number }[];
  matched_skills: string[];
  skill_gaps: string[];        // ← Solidarity Crimson treatment
}

Mock useAnalysis(): { data: StrategyResult, isLoading: boolean } with the seeded values above.
Loading state: 4 flat --sys-color-surface-elevated rectangles (no shimmer), chart areas as empty dark panels with LOADING EVIDENCE... in mono xs.


5. Success Criteria
All "Audit" references renamed to "Analysis" — nav label, breadcrumb, component name
Skill Gaps tags render in --sys-color-solidarityRed-base
Stat cards use Deep Recall stagger animation on mount
ATS trend line uses square data points, no curve smoothing
Zero hardcoded hex — yarn grep-tokens clean
Footer caption: "the gaps are where the growth lives"



Prompt 2: /ingestion — "Feed The Engine" Reconstruction
/ingestion — CareerCopilot Ingestion Engine: Kerala-Rage Reconstruction v6.1
System Role: Senior React Architect, KR Solidarity v6.1. You are building a Tactical Onboarding Flow. Uploading a resume is not a convenience feature — it is the first act of a worker asserting their professional history into a system built to fight for them. Aesthetic: Labor of Documentation · The Drop-Zone Slam · Wet Ink Processing.


0. Critical Context: Route & Layout
Route: /ingestion (already exists — this is a public full-bleed route with NO sidebar)
Component: Ingestion.tsx
No ProtectedLayout wrapper — full viewport canvas
The draft prompt referenced /career/ingest — this route does not exist, use /ingestion


1. Visual Reference (What You Are Preserving)
The existing page has strong bones — preserve layout, inject soul:
Header: INGESTION ENGINE // AWAITING UPLOAD in mono small caps, muted
Hero: "FEED THE ENGINE" — "FEED THE" in --sys-color-worker-ash-high, "ENGINE" in --sys-color-solidarityRed-base, condensed display typeface
Subtitle: "Upload your resume and we'll extract skills, experience, and certifications to power your ATS matching."
Two mode toggles: UPLOAD FILE (active) / PASTE TEXT — flat tab style, active state uses --sys-color-inkGold-base border-bottom: 2px
Drop zone: large dashed-border panel, upload icon, "DROP YOUR RESUME HERE", "PDF, DOCX, or TXT — Max 10MB", OR BROWSE FILES Strike button
Footer tagline: "your experience is the ammunition" — italic, centered, muted


2. Soul Injection: The Drop-Zone Slam
The existing drop zone is correct in structure but generic in physics. Inject the following states:
State 1 — IDLE (default):
Drop zone uses border: 2px dashed --sys-color-outline-variant. Upload icon in --sys-color-worker-ash-high. Label "DROP YOUR RESUME HERE" in mono caps.
State 2 — DRAG OVER:
When a file is dragged over: border-color transitions to --sys-color-solidarityRed-base. The drop zone undergoes a physical displacement: transform: scale(1.02) translateY(-4px). Label changes to "RELEASE TO LOAD" in --sys-color-solidarityRed-base. Transition: 150ms cubic-bezier(0.34, 1.56, 0.64, 1) — slight overshoot on scale.
State 3 — DROP SLAM:
On drop, the overshoot resolves with damping: transform: scale(0.98) translateY(2px) → scale(1.0) translateY(0) over 300ms. This is the Slam — the UI absorbs the weight of the document. border instantly fills solid: border: 2px solid --sys-color-inkGold-base.
State 4 — WET INK PROCESSING:
Replace the drop zone content with a Wet Ink expansion: a horizontal bar that expands from left to right using --sys-color-inkGold-base fill, width: 0% → 100%, transition: width 2000ms linear. Above it: the filename in mono caps. Below: processing stage label in small mono — cycle through "PARSING DOCUMENT" → "EXTRACTING SKILLS" → "MAPPING EXPERIENCE" → "CALIBRATING ATS". No spinner. No circular animation. No shimmer. This is ink drying, not a loading wheel.
State 5 — COMPLETE:
Transition to Placard document preview: a card using border-radius: 2px 8px 8px 2px, border-left: 3px solid --sys-color-inkGold-base, showing filename, detected file type badge, page count, and a Strike CTA: PROCEED TO ANALYSIS → which routes to /analysis.


3. Paste Text Mode
When PASTE TEXT tab is active:
Drop zone replaced with a full-width <textarea> — background: --sys-color-surface-elevated, border: 1px solid --sys-color-outline-variant, border-radius: 0, mono font, font-size: 13px, line-height: 1.6
Placeholder: "PASTE YOUR RESUME TEXT HERE. PLAIN TEXT ONLY. NO FORMATTING."
Character counter bottom-right: 0 / 8000 in mono xs, --sys-color-worker-ash-low
Strike CTA: PROCESS TEXT →


4. Design Tokens (Non-Negotiable)
Source: frontend/src/design/styles/design-tokens.css. Zero hardcoded hex.
--sys-color-solidarityRed-base — "ENGINE" hero word, drag-over border, active drag label
--sys-color-inkGold-base — post-drop border, processing bar fill, completion Placard accent
--sys-color-worker-ash-high — "FEED THE" hero words, idle upload icon, metadata text
--sys-color-surface-elevated — drop zone background, Placard card background
--sys-color-outline-variant — idle dashed border, textarea border


5. Schema & Async
ts
interface IngestionResult {
  filename: string;
  file_type: 'PDF' | 'DOCX' | 'TXT';
  page_count: number;
  extracted_skills: string[];
  raw_text: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
}

type ProcessingStage = 'PARSING DOCUMENT' | 'EXTRACTING SKILLS' | 'MAPPING EXPERIENCE' | 'CALIBRATING ATS';

Mock useIngestion(): { submit: (file: File | string) => Promise<IngestionResult>, stage: ProcessingStage, status: IngestionResult['status'] }.
On complete, store result and redirect to /analysis with extracted data in context.


6. Success Criteria
Route is /ingestion — not /career/ingest or /archive
No sidebar rendered — public full-bleed layout
Drop-Zone Slam physics: overshoot on drag-over, damped rebound on drop
Wet Ink processing bar — no spinner, no shimmer, horizontal ink expansion only
Placard document preview renders on complete with Strike CTA routing to /analysis
Paste Text mode renders functional textarea with character counter
Zero hardcoded hex — yarn grep-tokens clean
Footer tagline: "your experience is the ammunition"
