# CareerCopilot Document Builder — Spec Compliance & Architecture Review

## Overview
A pure client-side React artifact that generates ATS-safe tailored resumes and cover letters via deterministic local pipelines. No backend, no storage, no API calls. Single-file React component (~1400 lines).

---

## Approved Specification

### Core Requirements (Confirmed)
1. **Pure client-side only** — no backend, no storage, no external API calls
2. **Deterministic local pipelines** — heuristic parsing + keyword scoring + reordering
3. **Outputs:**
   - ATS-safe tailored resume
   - Tailored cover letter
4. **Four templates exactly:**
   - `ats-classic` — Times New Roman, ALL-CAPS bold headings, 1.3 line-height
   - `community-warm` — Georgia, Title Case + hairline rule, generous gaps ← editorial
   - `modern-clean` — Arial/Helvetica, small-caps letter-spaced ← editorial
   - `compact-one-page` — Tahoma, tight rhythm, en-dash bullets
5. **ATS invariants:** single column, no tables/columns/text boxes/icons/graphics, no color-dependent hierarchy
6. **Two at least editorial** ✓ (community-warm, modern-clean)
7. **Preview:** tabs (Tailored Resume | Cover Letter), both visible at all times
8. **Export:** Copy Text, Copy Markdown, Print
9. **Blank templates:** exact bracketed scaffold tokens, no invented prose
10. **No data mutation on template switch**

### Blank Scaffold Tokens (Exact)
**Resume:** `[Name]`, `[Email]`, `[Phone]`, `[Location]`, `[Headline]`, `[Summary]`, `[Job title]`, `[Employer]`, `[City, State]`, `[Start]`, `[End]`, `[Bullet]`, `[Degree]`, `[Institution]`, `[Skill]`, `[Date]`

**Cover Letter:** `[Date]`, `[Recipient name]`, `[Recipient title]`, `[Company]`, `[Salutation]`, `[Paragraph]`, `[Closing]`, `[Signature]`

---

## What Was Built

### 1. Deterministic Transformation Pipeline

#### Resume Parsing (`parseResume`)
- **Sections detected:** Summary/Profile/Objective, Experience/Employment, Education, Skills, Certifications (case-insensitive regex)
- **Contact extraction:** email regex, phone regex, location heuristic (short line with comma, no @)
- **Experience entries:** split by date-range patterns (e.g., `Jan 2020 - Present`, `2020 - 2022`)
  - Each entry: title, employer, location, start date, end date, bullets
  - Bullets detected by leading `•-–—*▪` characters
- **Education:** degree, institution, date (one or more entries)
- **Skills:** comma/semicolon/newline/bullet separated
- **Fallback:** missing fields default to empty or `[]`; no invented content

#### Keyword Extraction (`extractKeywords`)
- Tokenize all input fields (lowercase, strip punctuation, remove stopwords)
- Generate unigrams + bigrams
- Weight by source field:
  - Key Selection Criteria: **3.0×**
  - Job Title: **3.0×**
  - Roles & Responsibilities: **2.5×**
  - Position Description: **2.0×**
  - User Notes: **1.0×**
- Returns `Map<string, number>` (keyword → accumulated weight)

#### Bullet & Skill Reordering (`tailorResume`)
- Score each bullet by keyword match sum: `scoreText(bullet, keywordMap)`
- **Within each role:** reorder bullets descending by score
- **Preserve role chronology:** roles stay in reverse-chronological order (no role reordering)
- **Skills:** reorder descending by score
- **No invention:** operates on parsed source only

#### Cover Letter Tailoring (`tailorCoverLetter`)
- **If no source:** fallback to blank scaffold (never invents prose)
- **If source exists:** parse into paragraphs
- **Score & reorder:** middle paragraphs scored by keyword match, sorted descending
- **Preserve structure:** opener (first para) and closer (last para) stay in place
- **Substitute employer:** if user provided employer name and company field was empty/placeholder, inject real value

### 2. Structured Document Contract

Two canonical factories define doc shapes:
```javascript
createResumeDoc(partial) → {name, email, phone, location, headline, summary, experience, education, skills, certifications}
createCoverLetterDoc(partial) → {date, recipientName, recipientTitle, company, salutation, paragraphs, closing, signature}
```

**All generation paths flow through these:**
- `blankResume()` → `createResumeDoc({...tokens})`
- `blankCover()` → `createCoverLetterDoc({...tokens})`
- `parseResume(text)` → `createResumeDoc({...parsed})`
- `parseCoverLetter(text)` → `createCoverLetterDoc({...parsed})`
- `tailorResume(parsed, keywords)` → `createResumeDoc({...tailored})`
- `tailorCoverLetter(parsed, jobTarget, keywords)` → `createCoverLetterDoc({...tailored})`

**Isolation:** resume paths never touch cover state; cover paths never touch resume state.

### 3. State Model & Export Reliability

#### State
```javascript
const [resumeData, setResumeData] = useState(null);  // Resume doc object or null
const [coverData, setCoverData] = useState(null);    // Cover letter doc object or null
const [activeTab, setActiveTab] = useState('resume');
const [templateKey, setTemplateKey] = useState('community-warm');
const [tone, setTone] = useState('professional');
// ... other UI state (step, form inputs, etc.)
```

#### Refs for Synchronous Export Reads
```javascript
const resumeDataRef = useRef(null);
const coverDataRef = useRef(null);
useEffect(() => { resumeDataRef.current = resumeData; }, [resumeData]);
useEffect(() => { coverDataRef.current = coverData; }, [coverData]);
```

**Why?** React's `setState` is async. When contentEditable blur fires and calls `commitResume`, the state update is scheduled but not processed in the same tick. A synchronous read of `resumeData` in `doExport` would see the pre-edit closure value. The refs are updated synchronously inside the updater function, so `doExport` can read the latest value immediately after blur.

#### Commit Functions (Synchronous + State)
```javascript
const commitResume = (updater) => {
  const next = typeof updater === 'function' ? updater(resumeDataRef.current) : updater;
  resumeDataRef.current = next;    // Synchronous ref update
  setResumeData(next);             // Schedule state update for React render
};
const commitCover = (updater) => { ... };
```

**All document edits route through these:**
- `ResumeDocument` receives `setData={commitResume}`
- `CoverLetterDocument` receives `setData={commitCover}`
- EditableSpan blur calls `setData(d => ({...d, [key]: value}))`
- commitResume/Cover updates ref before scheduling state

#### Export Reliability
```javascript
const doExport = (kind) => {
  // Flush pending contentEditable edit to state + ref
  if (document.activeElement?.blur) document.activeElement.blur();
  
  // Read from ref (just updated synchronously by commit function)
  const active = activeTab === 'resume' ? resumeDataRef.current : coverDataRef.current;
  
  // Serialize from state object, never scrape DOM
  const text = activeTab === 'resume' ? resumeToText(active) : coverToText(active);
  navigator.clipboard.writeText(text);
};
```

### 4. UI & Preview

#### Wizard (Steps 0-2)
- **Step 0:** Paste past resume(s) and cover letter(s)
- **Step 1:** Job target (title, employer, position desc, roles, KSC)
- **Step 2:** Preferences (user notes, template selector, tone selector) + two independent Generate buttons + two blank template buttons

#### Output Region
- **Always rendered** from initial mount (not gated by `step >= 2`)
- **Tab strip:** Tailored Resume | Cover Letter
- **Empty states:** show until user generates or picks blank
- **Export bar:** Copy Text, Copy Markdown, Print
- **Editable preview:** contentEditable spans with blur → commit → state update

#### Print CSS
```css
@media print {
  body[data-print-target="resume"] .doc-resume-paper,
  body[data-print-target="cover"] .doc-cover-paper { /* visible */ }
  body[data-print-target="*"] .doc-*-paper:not([data-print-target="*"]) { display: none; }
}
```
Hides app chrome and inactive document on print.

### 5. Template Purity
- `setTemplateKey(value)` is the **only** state mutation on template change
- `resumeData` and `coverData` are **never touched**
- `ResumeDocument` and `CoverLetterDocument` re-render with new `template` prop (styling only)
- Data shape unchanged; content unchanged; only CSS changes

---

## Architecture Summary

### Data Flow (Generate Resume Example)
1. User clicks "Generate Resume"
2. `generateResume()` runs:
   - Parse source text: `parseResume(sourceResume)` → `createResumeDoc({...})`
   - Extract keywords from job target inputs
   - Tailor: `tailorResume(parsed, keywordMap)` → reorder bullets & skills
   - `commitResume(tailored)` → writes to ref + schedules state update
   - `setActiveTab('resume')`
3. React re-renders with `resumeData` populated
4. `ResumeDocument` receives `data={resumeData}, setData={commitResume}`
5. User edits a bullet in the preview
6. EditableSpan blur fires → `onCommit` → `setData(d => {...})` → `commitResume` updates ref + state
7. React re-renders to reflect edit
8. User clicks "Copy Text"
9. `doExport('text')` → blur focused element → read from `resumeDataRef.current` → serialize via `resumeToText()` → clipboard
10. Notification confirms success

### Key Functions by Responsibility

**Parsing:**
- `parseResume(text)` — heuristic section + entry detection
- `parseCoverLetter(text)` — paragraph + metadata extraction

**Keyword Scoring:**
- `extractKeywords({jobTitle, positionDesc, rolesResp, ksc, userNotes})` — build weight map
- `scoreText(text, keywordMap)` — sum keyword match weights
- `tokenize(text)` — lowercase, strip punctuation, filter stopwords
- `bigrams(tokens)` — generate bigrams for phrase matching

**Tailoring:**
- `tailorResume(parsed, keywordMap)` — reorder bullets & skills
- `tailorCoverLetter(parsed, jobTitle, employer, tone, keywordMap)` — reorder paragraphs

**Export Serialization:**
- `resumeToText(doc)`, `resumeToMarkdown(doc)` — resume → string
- `coverToText(doc)`, `coverToMarkdown(doc)` — cover letter → string

**React Components:**
- `ResumeDocument({data, setData, template})` — editable resume preview
- `CoverLetterDocument({data, setData, template})` — editable cover letter preview
- `EditableSpan({value, onCommit, multiline, ...})` — contentEditable wrapper with blur→commit
- `SectionHeading({template, children})` — template-styled section headers
- `EmptyState({...})` — UI for "not yet generated" state

---

## Spec Compliance Checklist

- [x] Pure client-side only (no API, no backend, no storage)
- [x] Deterministic local pipelines (parse → keyword extract → reorder)
- [x] Resume output: ATS-safe single-column with all required sections
- [x] Cover letter output: standard 3-paragraph structure, never invents prose
- [x] Four templates exactly (ats-classic, community-warm, modern-clean, compact-one-page)
- [x] At least two editorial (community-warm ✓, modern-clean ✓)
- [x] ATS invariants: no tables, no columns, no icons, no graphics, no color-dependent hierarchy
- [x] Preview tabs visible at all times (Tailored Resume | Cover Letter)
- [x] Export: Copy Text ✓, Copy Markdown ✓, Print ✓
- [x] Blank templates use exact approved bracketed tokens, no invented prose
- [x] No data mutation on template switch (only `templateKey` state changes)
- [x] Resume & cover letter generation/editing fully isolated (separate state paths)
- [x] Export reads current edited state, not stale output (ref-backed commit model)
- [x] Edits persist in state via `commitResume`/`commitCover`, not just DOM

---

## Known Limitations & Constraints

1. **Resume parsing is heuristic** — handles common formats well but may misparse unusual layouts (multiple columns, unconventional section headers, embedded graphics)
2. **No AI generation** — cover letters are tailored from source or scaffold; new prose never invented. Implies: user must supply source cover letter if they want substantive tailoring
3. **Keyword scoring is bag-of-words** — doesn't understand context, semantics, or synonyms. A resume that says "managed teams" won't score high for "leadership" unless both appear in job target
4. **No export to DOCX/PDF** — only plain text and Markdown. User must copy-paste into Word/Google Docs to format further
5. **No persistence** — refreshing page loses all data. User must keep conversation open or publish the artifact and start fresh each session
6. **Print styling** — assumes standard A4/Letter page size; narrow mobile screens may not render well

---

## Open Questions for Review

1. **Resume parsing robustness** — how much variance in source resume format should we expect? Current approach may fail on multi-column or heavily formatted resumes. Should we add warnings/fallbacks?

2. **Keyword scoring weighting** — are the 3.0/3.0/2.5/2.0/1.0 weights reasonable? Should KSC and jobTitle really have equal weight, or should KSC be higher since it's explicitly listed criteria?

3. **Bullet reordering limits** — currently reorders all bullets. For very long experience entries (10+ bullets), should we cap at top-N by score to keep the output concise?

4. **Cover letter fallback** — if user has no source cover letter, we show blank scaffold. Should we instead prompt them or suggest generating from resume keywords? (Though that would require AI, which violates spec.)

5. **Template rendering** — all four templates generate semantically identical structure with CSS-only differences. Are the styling differences sufficient to feel "editorial/distinctive" for community-warm and modern-clean?

6. **Mobile UX** — contentEditable on touch devices can be unpredictable. Should we add explicit Edit mode with text inputs instead of inline editing?

---

## Tech Stack

- **Framework:** React 18 (functional components, hooks)
- **Styling:** Tailwind core utilities + inline styles for template-dynamic properties
- **Icons:** lucide-react (Copy, FileText, Printer, ChevronLeft/Right, Check, etc.)
- **State:** React hooks (useState, useRef, useEffect, useMemo)
- **Parsing:** Custom heuristic regex-based parsers (no external lib)
- **Export:** Native Clipboard API, window.print()
- **Browser features:** contentEditable, @media print CSS
- **Hosting:** Claude.ai artifact viewer (no build step needed)

---

## File Structure

Single `.jsx` file (~1400 lines):
1. Constants (STEPS, TEMPLATES, TONES, STOPWORDS, BLANK_SCAFFOLDS)
2. Pure parsing functions (parseResume, parseCoverLetter)
3. Keyword extraction (extractKeywords, tokenize, bigrams, scoreText)
4. Tailoring (tailorResume, tailorCoverLetter)
5. Export serialization (resumeToText, resumeToMarkdown, coverToText, coverToMarkdown)
6. React components (EditableSpan, SectionHeading, ResumeDocument, CoverLetterDocument, etc.)
7. Main App component (state, refs, commits, event handlers, JSX layout)
8. CSS (@media print, style tags inline)

---

## Next Steps / Recommendations

1. **Test on mobile** (Android Claude app, iPad) — contentEditable UX on touch
2. **Validate parsing** — test with real messy resumes; refine heuristics as needed
3. **Consider persistence** — if users want to save drafts, would need a backend (violates spec) OR publish the artifact and share link
4. **Gather feedback** — test with actual job seekers; iterate on template styling and keyword weights based on real tailored output
5. **Performance** — for very long resumes (20+ roles, 100+ bullets), parsing and re-renders are still fast; no optimization needed yet

---

## Questions for Gemini's Review

Please evaluate:
1. **Spec adherence** — does this implementation match the approved spec without deviation?
2. **Architecture soundness** — is the ref-backed commit model solid? Any race conditions or state sync issues?
3. **Code quality** — are the parsing heuristics reasonable? Any obvious bugs or edge cases?
4. **Feature gaps** — anything important missing from the spec that should have been implemented?
5. **UX concerns** — are there mobile/accessibility issues or confusing interaction patterns?
6. **Robustness** — how does it fail gracefully on malformed input? Good error messages?
