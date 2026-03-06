# Kerala Rage Content Guide: Solidarity Mode Copy

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)
> Companion to [06-wireframes.md](06-wireframes.md) and [06b-asset-placement.md](06b-asset-placement.md)

---

## Document Control

| Field                | Value                         |
| -------------------- | ----------------------------- |
| **Document ID**      | CONTENT-002-SOLIDARITY        |
| **Version**          | 1.0                           |
| **Status**           | Implementation Ready          |
| **Last Updated**     | February 9, 2026              |
| **Parent Documents** | 06-wireframes.md, 04-voice.md |

---

## Purpose

This document provides the **actual copy, microcopy, and content specifications** for each wireframe page. It translates the Solidarity Mode voice into concrete UI text, ensuring every label, headline, and error message aligns with the "grounded, sharp, and quietly defiant" tone.

---

## Global Content Directives

### Voice Principles (from `04-voice.md`)

1. **Functional Clarity**: Direct, unambiguous, peer-to-peer.
2. **Contextual Personality**: Tactical metaphors (archive, manifesto, collective) without slogan wallpaper.
3. **Character Depth**: Defiant optimism—acknowledging systemic barriers while providing tools for resistance.

### Forbidden Language

- ❌ "Optimize", "Leverage", "Synergy", "Empower"
- ❌ "AI-powered", "Smart", "Intelligent" (unless technically accurate)
- ❌ "Journey", "Transform", "Unlock your potential"
- ❌ Bureaucratic jargon: "Submit", "Process", "Validate"

### Preferred Language

- ✅ "Build", "Archive", "Document", "Verify"
- ✅ "Collective", "Solidarity", "Resistance", "Evidence"
- ✅ "Deposit", "Analyze", "Craft", "Finalize"

---

## Page-by-Page Content Specifications

### PAGE 1: Landing ("The Solidarity Manifesto")

**Emotional Register:** Defiance | **Density:** High Drama

#### Primary Copy

| Element            | Content                                                                                                                                 | Typography Token                                                 | Color Token                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **Hero Headline**  | "THE SOLIDARITY<br>MANIFESTO"                                                                                                           | Display Hero (Recursive Variable, 144px, 900 wght)               | `inkGold`                                  |
| **Subhead**        | "Your professional history, re-documented for the collective future."                                                                   | Headline (Sora Variable, 48px, 700 wght)                         | `worker-ash` (80% opacity)                |
| **Feature Card 1** | **Title:** "Build Your Story"<br>**Body:** "Deposit your work history. We'll analyze it for evidence of skill, not corporate keywords." | **Title:** Subhead (Inter, 24px)<br>**Body:** Body (Inter, 16px) | Title: `inkGold`<br>Body: `worker-ash`   |
| **Feature Card 2** | **Title:** "Archive Evidence"<br>**Body:** "Every project, every skill, every proof point—catalogued with precision, not AI slop."      | Same as Card 1                                                   | Same as Card 1                              |
| **Feature Card 3** | **Title:** "Resist Slop"<br>**Body:** "Generate applications that pass ATS filters without sounding like a bot wrote them."             | Same as Card 1                                                   | Same as Card 1                              |
| **Primary CTA**    | "BUILD YOUR STORY"                                                                                                                      | Subhead (Inter, 24px, 700 wght)                                  | `charcoalBackground` (on `inkGold` button) |
| **Secondary CTA**  | "View the Collective"                                                                                                                   | Body (Inter, 16px, 400 wght)                                     | `worker-ash`                              |

#### Microcopy

- **Footer Attribution**: "Built with solidarity. No venture capital, no data mining, no bullshit."

---

### PAGE 2: Authentication ("The Verification")

**Emotional Register:** Trust | **Density:** Minimal

#### Primary Copy

| Element             | Content                         | Typography Token                          | Color Token                                 |
| ------------------- | ------------------------------- | ----------------------------------------- | ------------------------------------------- |
| **Card Header**     | "VERIFY IDENTITY"               | Display Large (Recursive, 72px, 800 wght) | `inkGold`                                  |
| **Helper Text**     | "Enter the Solidarity Archive." | Subhead (Inter, 24px, 500 wght, italic)   | `worker-ash` (70% opacity)                |
| **Email Label**     | "Email"                         | Metadata (JetBrains Mono, 12px)           | `worker-ash`                              |
| **Password Label**  | "Password"                      | Metadata (JetBrains Mono, 12px)           | `worker-ash`                              |
| **Primary CTA**     | "Enter Archive"                 | Subhead (Inter, 24px, 700 wght)           | `charcoalBackground` (on `inkGold` button) |
| **Secondary CTA**   | "Create Collective ID"          | Body (Inter, 16px, 400 wght)              | `worker-ash`                              |
| **Forgot Password** | "Reset access"                  | Body (Inter, 16px, 400 wght)              | `signalGreen`                               |

#### Error States

| Scenario                | Message                                                                                          | Color Token      |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------- |
| **Invalid Credentials** | "Credentials not recognized. Double-check your email and password."                              | `solidarityRed`     |
| **Network Error**       | "Connection failed. Check your network and try again."                                           | `solidarityRed`     |
| **Account Locked**      | "Too many attempts. Your account is temporarily locked. Reset your password or wait 15 minutes." | `kr-charcoalRed` |

---

### PAGE 3: Onboarding ("The Collective Choice")

**Emotional Register:** Possibility | **Density:** Standard

#### Primary Copy

| Element             | Content                                                                                | Typography Token                                                 | Color Token                                 |
| ------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **Headline**        | "CHOOSE YOUR SOLIDARITY PATH"                                                          | Display Large (Recursive, 72px, 800 wght)                        | `inkGold`                                  |
| **Subhead**         | "Select your primary work context. You can refine this later."                         | Headline (Sora, 48px, 700 wght)                                  | `worker-ash` (80% opacity)                |
| **Industry Card 1** | **Title:** "Tech Worker"<br>**Body:** "Software, data, infrastructure, product."       | **Title:** Subhead (Inter, 24px)<br>**Body:** Body (Inter, 16px) | Title: `inkGold`<br>Body: `worker-ash`   |
| **Industry Card 2** | **Title:** "Care Worker"<br>**Body:** "Health, education, social services, community." | Same as Card 1                                                   | Same as Card 1                              |
| **Industry Card 3** | **Title:** "Creative Worker"<br>**Body:** "Design, media, arts, communications."       | Same as Card 1                                                   | Same as Card 1                              |
| **Primary CTA**     | "Continue to Deposit"                                                                  | Subhead (Inter, 24px, 700 wght)                                  | `charcoalBackground` (on `inkGold` button) |

---

### PAGE 4: Ingestion ("The Deposition")

**Emotional Register:** Gravity | **Density:** High Clarity

#### Primary Copy

| Element               | Content                                                 | Typography Token                           | Color Token                                 |
| --------------------- | ------------------------------------------------------- | ------------------------------------------ | ------------------------------------------- |
| **Headline**          | "DEPOSIT HISTORY"                                       | Display Large (Recursive, 72px, 800 wght)  | `inkGold`                                  |
| **Subhead**           | "Upload your resume or CV. We'll extract the evidence." | Headline (Sora, 48px, 700 wght)            | `worker-ash` (80% opacity)                |
| **Drop Zone Label**   | "DROP PDF HERE<br>FOR ANALYSIS"                         | Metadata (JetBrains Mono, 12px, uppercase) | `worker-ash` (60% opacity)                |
| **File Requirements** | "PDF only. Max 5MB."                                    | Metadata (JetBrains Mono, 10px)            | `worker-ash` (50% opacity)                |
| **Upload Progress**   | "Analyzing... {percentage}%"                            | Metadata (JetBrains Mono, 12px)            | `inkGold`                                  |
| **Success Message**   | "History Verified. Integrity confirmed."                | Subhead (Inter, 24px, 500 wght)            | `inkGold`                                  |
| **Primary CTA**       | "View Analysis"                                         | Subhead (Inter, 24px, 700 wght)            | `charcoalBackground` (on `inkGold` button) |

#### Error States

| Scenario            | Message                                                | Color Token      |
| ------------------- | ------------------------------------------------------ | ---------------- |
| **Wrong File Type** | "PDF files only. Convert your document and try again." | `solidarityRed`     |
| **File Too Large**  | "File exceeds 5MB. Compress or split your document."   | `solidarityRed`     |
| **Corrupted File**  | "File appears corrupted. Re-export and try again."     | `kr-charcoalRed` |
| **Analysis Failed** | "Analysis failed. Contact support if this persists."   | `kr-charcoalRed` |

---

### PAGE 5: Analysis Dashboard ("The Audit Microscope")

**Emotional Register:** Revelation | **Density:** High Clarity

#### Primary Copy

| Element               | Content                                 | Typography Token                          | Color Token                                 |
| --------------------- | --------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| **Headline**          | "THE AUDIT"                             | Display Large (Recursive, 72px, 800 wght) | `inkGold`                                  |
| **Subhead**           | "Your professional evidence, analyzed." | Headline (Sora, 48px, 700 wght)           | `worker-ash` (80% opacity)                |
| **Match Score Label** | "Match Score"                           | Metadata (JetBrains Mono, 12px)           | `worker-ash`                              |
| **Score Value**       | "{score}/100"                           | Display Large (Recursive, 72px, 900 wght) | `inkGold`                                  |
| **Skill Card Header** | "Verified Skills"                       | Subhead (Inter, 24px, 700 wght)           | `inkGold`                                  |
| **Skill Item**        | "{Skill Name}: {count} instances"       | Body (Inter, 16px, 400 wght)              | `worker-ash`                              |
| **Primary CTA**       | "Browse Opportunities"                  | Subhead (Inter, 24px, 700 wght)           | `charcoalBackground` (on `inkGold` button) |

#### Empty States

| Scenario            | Message                                                                       | Color Token                  |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| **No Skills Found** | "No skills detected. Upload a more detailed resume or add skills manually."   | `worker-ash` (60% opacity) |
| **Low Match Score** | "Match score is low. Refine your profile or explore different opportunities." | `worker-ash` (60% opacity) |

---

### PAGE 6: Opportunity Feed ("The Lookout")

**Emotional Register:** Discovery | **Density:** Standard

#### Primary Copy

| Element             | Content                                   | Typography Token                          | Color Token                  |
| ------------------- | ----------------------------------------- | ----------------------------------------- | ---------------------------- |
| **Headline**        | "THE LOOKOUT"                             | Display Large (Recursive, 72px, 800 wght) | `inkGold`                   |
| **Subhead**         | "Opportunities matched to your evidence." | Headline (Sora, 48px, 700 wght)           | `worker-ash` (80% opacity) |
| **Filter Label**    | "Filters"                                 | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Sort Label**      | "Sort by"                                 | Metadata (JetBrains Mono, 12px)           | `worker-ash`               |
| **Card: Job Title** | "{Job Title}"                             | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Card: Company**   | "{Company Name}"                          | Body (Inter, 16px, 400 wght)              | `worker-ash`               |
| **Card: Match**     | "Match: {score}%"                         | Metadata (JetBrains Mono, 12px)           | `signalGreen`                |
| **Card CTA**        | "View Details"                            | Body (Inter, 16px, 500 wght)              | `inkGold`                   |

#### Empty States

| Scenario             | Message                                                                                  | Color Token                  |
| -------------------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| **No Opportunities** | "No opportunities match your current filters. Adjust your criteria or check back later." | `worker-ash` (60% opacity) |

---

### PAGE 7: Kanban Board ("The Command Center")

**Emotional Register:** Control | **Density:** Standard

#### Primary Copy

| Element             | Content                                         | Typography Token                          | Color Token                  |
| ------------------- | ----------------------------------------------- | ----------------------------------------- | ---------------------------- |
| **Headline**        | "THE COMMAND CENTER"                            | Display Large (Recursive, 72px, 800 wght) | `inkGold`                   |
| **Subhead**         | "Track your applications through the pipeline." | Headline (Sora, 48px, 700 wght)           | `worker-ash` (80% opacity) |
| **Column 1 Header** | "Applied"                                       | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Column 2 Header** | "Screening"                                     | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Column 3 Header** | "Interview"                                     | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Column 4 Header** | "Offer"                                         | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Card: Job Title** | "{Job Title}"                                   | Subhead (Inter, 20px, 700 wght)           | `worker-ash`               |
| **Card: Company**   | "{Company Name}"                                | Body (Inter, 14px, 400 wght)              | `worker-ash` (70% opacity) |
| **Card: Date**      | "Applied {date}"                                | Metadata (JetBrains Mono, 10px)           | `worker-ash` (50% opacity) |

#### Empty States

| Scenario            | Message                                                                       | Color Token                  |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| **No Applications** | "No applications yet. Browse opportunities and start building your pipeline." | `worker-ash` (60% opacity) |

---

### PAGE 8: Split-Screen Editor ("The Writing Workbench")

**Emotional Register:** Craft | **Density:** Minimal

#### Primary Copy

| Element            | Content                                 | Typography Token                          | Color Token                                 |
| ------------------ | --------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| **Headline**       | "THE WORKBENCH"                         | Display Large (Recursive, 72px, 800 wght) | `inkGold`                                  |
| **Subhead**        | "Craft your application with evidence." | Headline (Sora, 48px, 700 wght)           | `worker-ash` (80% opacity)                |
| **Evidence Panel** | "Evidence"                              | Subhead (Inter, 24px, 700 wght)           | `inkGold`                                  |
| **Editor Panel**   | "Cover Letter"                          | Subhead (Inter, 24px, 700 wght)           | `inkGold`                                  |
| **Evidence Card**  | "{Skill/Project Name}"                  | Body (Inter, 16px, 500 wght)              | `worker-ash`                              |
| **Insert Button**  | "Insert"                                | Metadata (JetBrains Mono, 12px)           | `signalGreen`                               |
| **Primary CTA**    | "Finalize Application"                  | Subhead (Inter, 24px, 700 wght)           | `charcoalBackground` (on `inkGold` button) |

---

### PAGE 9: Studio Designer ("The Manifesto Finalization")

**Emotional Register:** Refinement | **Density:** Structural

#### Primary Copy

| Element                | Content                               | Typography Token                          | Color Token                                 |
| ---------------------- | ------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| **Headline**           | "THE FINALIZATION"                    | Display Large (Recursive, 72px, 800 wght) | `inkGold`                                  |
| **Subhead**            | "Review and export your application." | Headline (Sora, 48px, 700 wght)           | `worker-ash` (80% opacity)                |
| **Control Panel**      | "Format Controls"                     | Subhead (Inter, 24px, 700 wght)           | `inkGold`                                  |
| **Toggle: Bot View**   | "Bot View"                            | Body (Inter, 16px, 400 wght)              | `worker-ash`                              |
| **Toggle: Human View** | "Human View"                          | Body (Inter, 16px, 400 wght)              | `worker-ash`                              |
| **Primary CTA**        | "Export PDF"                          | Subhead (Inter, 24px, 700 wght)           | `charcoalBackground` (on `inkGold` button) |
| **Secondary CTA**      | "Save Draft"                          | Body (Inter, 16px, 500 wght)              | `signalGreen`                               |

#### Success States

| Scenario           | Message                                     | Color Token |
| ------------------ | ------------------------------------------- | ----------- |
| **Export Success** | "Application exported. Integrity verified." | `inkGold`  |

---

### PAGE 10: Settings ("The Archive Vault")

**Emotional Register:** Storage | **Density:** Structural

#### Primary Copy

| Element       | Content                            | Typography Token                          | Color Token                  |
| ------------- | ---------------------------------- | ----------------------------------------- | ---------------------------- |
| **Headline**  | "ARCHIVE CONFIGURATION"            | Display Large (Recursive, 72px, 800 wght) | `inkGold`                   |
| **Subhead**   | "Manage your collective identity." | Headline (Sora, 48px, 700 wght)           | `worker-ash` (80% opacity) |
| **Section 1** | "Profile Settings"                 | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Section 2** | "Privacy Controls"                 | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Section 3** | "Data Management"                  | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |
| **Section 4** | "Export Options"                   | Subhead (Inter, 24px, 700 wght)           | `inkGold`                   |

---

### PAGE 11: Dashboard Overview ("The Collective")

**Emotional Register:** Altitude | **Density:** High Drama

#### Primary Copy

| Element           | Content                                                         | Typography Token                                                                         | Color Token                                |
| ----------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Hero Greeting** | "THE COLLECTIVE IS THRIVING"                                    | Display Large (Recursive, 72px, 800 wght)                                                | `inkGold`                                 |
| **Subhead**       | "Your solidarity ecosystem at a glance."                        | Headline (Sora, 48px, 700 wght)                                                          | `worker-ash` (80% opacity)               |
| **Metric Card 1** | **Label:** "Active Applications"<br>**Value:** "{count}"        | **Label:** Metadata (JetBrains Mono, 12px)<br>**Value:** Display Large (Recursive, 48px) | Label: `worker-ash`<br>Value: `inkGold` |
| **Metric Card 2** | **Label:** "Skills Tracked"<br>**Value:** "{count}"             | Same as Card 1                                                                           | Same as Card 1                             |
| **Metric Card 3** | **Label:** "Progress This Week"<br>**Value:** "{count} actions" | Same as Card 1                                                                           | Same as Card 1                             |

---

## Cultural Text & Image Constraints

When Symbolic Anchors (devotional, resistance, or First Nations imagery) are present on a page, the following content rules apply to prevent cultural appropriation, misrepresentation, or inappropriate mixing of sacred and political contexts.

### 1. Devotional Imagery (Shiva, Kerala Elephant)

**When Present:**
- ❌ **Forbidden**: Protest language ("INQUILAB ZINDABAD", "TREATY NOW", "SOVEREIGNTY NEVER CEDED")
- ❌ **Forbidden**: Anti-colonial resistance text in the same visual frame
- ✅ **Allowed**: Reflective, analytical, or contemplative language
- ✅ **Allowed**: Technical labels, data annotations, neutral UI text

**Example Violations:**
- Shiva statue visible while headline reads "RESIST THE SYSTEM"
- Kerala elephant background with "INQUILAB ZINDABAD" footer text

**Example Compliant Usage:**
- Shiva statue on Analysis Dashboard with "Your professional evidence, analyzed"
- Kerala elephant on reflective page with "Skills Tracked: 47"

### 2. Resistance Figures (Tipu Sultan, Bhagat Singh)

**When Present:**
- ✅ **Required**: Anti-colonial or solidarity text context ("INQUILAB ZINDABAD", "Built with solidarity")
- ❌ **Forbidden**: Corporate language ("Optimize your career", "Unlock potential")
- ❌ **Forbidden**: Devotional or sacred language in the same composition
- ✅ **Allowed**: Defiant, action-oriented, collective language

**Example Violations:**
- Bhagat Singh portrait with "Optimize Your Profile" headline
- Tipu Sultan image on a page with Shiva statue

**Example Compliant Usage:**
- Bhagat Singh on Landing with "THE SOLIDARITY MANIFESTO"
- Tipu Sultan on Dashboard with "Built with solidarity. No venture capital, no data mining, no bullshit."

### 3. First Nations Solidarity (Treaty Now, Placards)

**When Present:**
- ✅ **Required**: In-situ placard/poster context only (never as standalone UI decoration)
- ✅ **Required**: Solidarity text must accompany the visual ("Always was, always will be", "Sovereignty never ceded")
- ❌ **Forbidden**: Using First Nations imagery without explicit solidarity text
- ❌ **Forbidden**: Mixing with devotional imagery (Shiva, temple elephants)
- ❌ **Forbidden**: Corporate or optimization language in the same frame

**Example Violations:**
- "TREATY NOW" placard used as a decorative icon without context
- First Nations placard on same page as Shiva statue
- "ALWAYS WAS ALWAYS WILL BE" text on Settings page (not contextually appropriate)

**Example Compliant Usage:**
- "TREATY NOW" laneway poster on Dashboard Overview with footer text: "Built on stolen land. Sovereignty never ceded."
- First Nations placard on Landing page with "The Collective" solidarity language

### 4. No Explanatory Captions

**Critical Rule**: Do NOT add captions or explanatory text that "explain" the cultural significance of Symbolic Anchors.

❌ **Forbidden Examples:**
- "Shiva represents cosmic dance and destruction"
- "Bhagat Singh was an Indian revolutionary"
- "This is a First Nations solidarity message"

✅ **Correct Approach:**
- Let the imagery speak for itself
- Provide context through page emotional register, not didactic text
- Assume the user understands the cultural references or will research independently

### 5. Language Mixing Rules

| Devotional Context | Resistance Context | First Nations Context | Allowed Together? |
| :--- | :--- | :--- | :--- |
| ✅ Present | ❌ Absent | ❌ Absent | ✅ Yes |
| ❌ Absent | ✅ Present | ❌ Absent | ✅ Yes |
| ❌ Absent | ❌ Absent | ✅ Present | ✅ Yes |
| ✅ Present | ✅ Present | ❌ Absent | ❌ **FORBIDDEN** |
| ✅ Present | ❌ Absent | ✅ Present | ❌ **FORBIDDEN** |
| ❌ Absent | ✅ Present | ✅ Present | ⚠️ **Conditional** (only if both are in solidarity context) |

**Rationale**: Devotional imagery (sacred) must never mix with protest imagery (political) to avoid trivializing either context. First Nations solidarity can coexist with anti-colonial resistance (both political), but never with devotional imagery (sacred/political separation).

---

## Implementation Directives

### 1. Ink Overlap

When assets like `{kr-asset-halo-disk}` overlap with text, ensure text remains legible through high-contrast `inkGold` or `worker-ash` color selection. Minimum contrast ratio: 4.5:1.

### 2. Tactile Response

Every "Verified" action (Page 4, Page 9) should trigger a visceral `{kr-asset-screenprint-stamp}` animation with a physical "slam" motion (see `06b-asset-placement.md` for animation specs).

### 3. Substrate Depth

Backgrounds must never be flat. Use `{kr-asset-charcoal-paper}` or grit patterns to maintain the feeling of a physical manifesto.

### 4. Microcopy Consistency

All button labels use **Title Case** ("Build Your Story"), while body text uses **Sentence case** ("Your professional history, re-documented...").

### 5. Error Message Tone

Errors are direct and tactical, never apologetic or corporate. Avoid "Oops!" or "Something went wrong." Use "Connection failed" or "File appears corrupted."

---

**Last Updated**: February 9, 2026
**Next Review**: UI implementation phase
