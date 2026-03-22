# COMET CONSOLIDATED MANIFEST: AI STUDIO PROMPTING & HARVEST STRATEGY (v2.2)

> [!IMPORTANT]
> **SINGLE SOURCE OF TRUTH**: This manifest consolidates the Strategy Report, Execution Backlog, and Harvest Blueprint. This is the **most recent** and canonical documentation for AI Studio / Comet operations.

---

## 1. THE STRATEGY: SUPPORT-REFERENCE MODE (v2.2)

The framing for AI Studio / Comet operations is **Support-Reference Mode**. We modify the **existing** prototype (`prototype_v2.0`) in-place to build out feature internals, which are then harvested into the canonical repository.

### Core Guardrails (Non-Negotiable)
1. **In-Place Modification**: Do not resynthesize the shell or regenerate the project structure.
2. **Quarantined Shell**: The top-level shell (`App.tsx`) is support-only. Do not promote its navigation architecture.
3. **No Routing Drift**: No `react-router-dom`, no URL-based routes. Maintain `activeTab` local state only.
4. **Dependency Lockdown**: No new npm packages in `package.json` unless explicitly batch-authorized.
5. **React 18 Compatibility**: Ensure all patterns work in the canonical React 18 environment.
6. **Local Stub Logic**: Mock handlers and stub data only. No real backend connections.

### Design & Portability Layers
Every prompt must enforce:
- **Archive Inputs**: Treat previous docs and legacy prompt packs as archive/reference inputs only, never as execution truth.
- **UX Copy**: Copy must follow the route's emotional register, not generic "calm/directive" language.
- **Text Format Style**: Heading treatment, label density, helper-text depth, and CTA wording must follow the route's emotional register.
- **Emotional Register**: Use the route-family default register to control tone, formatting, and expressive intensity.
- **M3 Expressive**: High hierarchy and state contrast (no flat/generic visuals).
- **KR Token Alignment**: Symbolic constants/variables to ensure easy mapping to KR Solidarity tokens.
- **Plain UI Naming**: Describe work as `Button`, `Card`, `Dialog`, `Input`, `Select`, and `Surface` first; mention KR archetypes only as internal mappings where needed.

### Route-Family Emotional Registers

- **Possibility**: `/dashboard`, `/opportunities`, onboarding and landing-adjacent discovery surfaces
- **Direct Action**: `/tracker`, `/career/ingest`, `/apply/quick`
- **Revelation**: `/analysis` and ATS/diagnostic surfaces
- **Craft**: `/documents`, templates, generators, and document-workbench flows
- **Reflection**: `/profile`, `/settings`, auth/trust-heavy account surfaces

Typography intensity by register:
- `Possibility` → assertive headline typography
- `Direct Action` → moderate expressive typography
- `Revelation` → moderate expressive typography focused on summaries and scores
- `Craft` → moderate expressive typography with editorial structure
- `Reflection` → restrained typography

---

## 2. THE BACKLOG: 19-BATCH EXECUTION SCRIPT

### 2.0 INITIALIZATION (PREAMBLE)
> You are a senior React 18 + TypeScript frontend engineer working on an **existing** CareerCopilot prototype app. This is an in-place modification workflow, not a fresh scaffold. Modify only the requested files and sections for each instruction. The app currently uses a tab-based navigation pattern in `App.tsx` (activeTab state) and does not use react-router-dom.
>
> Structure note:
> - The prototype uses a hybrid root + `src/` layout.
> - `App.tsx`, `index.tsx`, `constants.ts`, and `types.ts` live at project root.
> - Additional pages, hooks, and layout internals may live under `src/**`.
> - Root-level `components/`, `hooks/`, and `services/` also exist.
> - Do not create duplicate shadow structure or move files unless the prompt explicitly requires it.
>
> Locked user-facing nav:
> - `Dashboard`
> - `Jobs`
> - `ATS Check`
> - `Applications`
> - `Submitted Docs`
> - `Profile`
> - `Settings` is utility-only from the profile/avatar area.
>
> **CRITICAL RULES:** [Included by reference to AGENTS.md / Manifest Section 1]

### 2.1 Batch Groups (B1–B4): Shell & Discovery
- **B1: Global Shell & Locked Navigation**: Define primary nav as Dashboard, Jobs, ATS Check, Applications, Submitted Docs, and Profile. Keep `activeTab`; keep Settings as utility-only.
- **B2: Core Navigation Labels**: Apply the locked user-facing nav labels and utility Settings placement consistently.
- **B3: Onboarding "Choose Your Path"**: First-time user flow for profile vs quick application.
- **B4: Dashboard Checklist**: dismissible "Getting Started" card.

### 2.2 Batch Groups (B5–B8): Discovery & ATS Check
- **B5: Jobs List & Empty State**: Stub job card list + rich empty state ("Run search", "Paste URL").
- **B6: Dashboard "Paste Job URL"**: Quick action leading to ATS Check.
- **B7: ATS Check 4-Quadrant Layout**: Map scores/insights to "Hard Skills", "Soft Skills", "Impact", "Readability".
- **B8: Submitted Docs Context & Government CTA**: Metadata provenance + KSC trigger banner into Submitted Docs.

### 2.3 Batch Groups (B9–B13): Submitted Docs Hub
- **B9: Submitted Docs Hub & Stepper**: Document-history and templates hub with Tailor, Templates, and Review sections.
- **B10: Inline Bullet Suggestions**: "Original" vs "Suggested" text with Apply/Discard controls.
- **B11: Context Badge & Style Cycle**: Show doc-count provenance + "Formal/Conversational" variants.
- **B12: KSC Tab & STAR Tooltip**: Dedicated KSC logic and government-role explanations.
- **B13: Voice Profile CTA**: Transition from Submitted Docs successes to Profile → Voice Profile.

### 2.4 Batch Groups (B14–B19): Extended Features
- **B14: Cover Letter Metrics**: Keyword, Narrative, Personalization, Tone gauges.
- **B15: Image Studio Shell**: Prompt input + preview grid (stub only).
- **B16: Applications Board & Application Detail**: Status columns + overlay workspace for individual apps.
- **B17: Dashboard ATS Trend**: SVG sparkline of recent scores.
- **B18: Profile Settings Integrations**: Gmail Scan / Job Scout connection placeholders in the utility settings surface.
- **B19: Mobile Bottom Nav**: responsive-only bar using locked labels for Jobs, ATS Check, Applications, and Submitted Docs.

---

## 3. THE HARVEST: ONE-WAY PROMOTIONAL BLUEPRINT

### 3.1 Track A — Backend Logic
- Map prototype heuristic logic (`Deep STAR`, `ATS Scan`) to `backend/app/genkit_flows/`.
- Consolidate "Vague Language Audit" and "Quantification Gap" into `ingestion_flow.py`.

### 3.2 Track B — UI Feature Adoption
- **B1 Pattern**: `ATSScoreCard.tsx` (Preserve motion, cleanse styles).
- **B2 Pattern**: `AuditDisplay.tsx` (Preserve "10-Second Recruiter Scan" UX).
- **B3 Pattern**: `WorkbenchStepper.tsx` (Adopt for generation flows).

### 3.3 Track C — Canonical Feature Wiring
- Update `AnalysisPage.tsx` using `Card`, `Button`, and `Select` primitives mapped onto internal `Placard`, `Strike`, and `March` design semantics.
- Wire harvested components using TanStack Query `useMutation`.

---

## 4. VERIFICATION GATES

1. **Token Gate**: `grep` for hardcoded Tailwind colors.
2. **Type Gate**: `tsc --noEmit` validation.
3. **Compliance Gate**: `vision-scorer-mcp` audit against KR Solidarity v6.1 standards.
