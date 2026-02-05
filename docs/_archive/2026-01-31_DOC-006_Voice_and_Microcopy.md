# DOC-006: Voice & Micro-copy ("The Naturalist's Marginalia")

**Document ID:** DOC-006-VOICE
**Version:** 3.0 (Northcote Curio Edition - Tiered Voice Strategy)
**Status:** ACTIVE
**Context:** Operationalizing the "eccentric, curious naturalist" personality with a tiered approach—functional clarity for core actions, personality for celebrations and empty states.

---

## 1.5 Voice Tier System

> [!IMPORTANT]
> **Clarity first, flavor second.** The metaphor must never obscure the action.

### Tier 1: Functional Clarity (Primary UI)

**Where:** Navigation, buttons, form labels, error feedback
**Voice:** Clear, conventional, immediately understood
**Example:** "Upload Resume" (not "Catalog Specimen")

### Tier 2: Contextual Personality (Celebrations & States)

**Where:** Success messages, empty states, onboarding
**Voice:** Playful Victorian naturalist with clear intent
**Example:** "Discovery Recorded" (celebration after successful action)

### Tier 3: Character Depth (Premium/Lab Mode)

**Where:** Laboratory mode analysis, tooltips, easter eggs
**Voice:** Full Victorian naturalist immersion
**Example:** "Your specimen has been catalogued. The Naturalist has identified..."

---

## 1. The Voice Principle

**Core Identity:** A playful Victorian naturalist with strong opinions, speaking to a fellow explorer.

**Characteristics:**

- **Curious, not corporate** — "Analyze Specimen" vs "View Details"
- **Opinionated, not neutral** — "Discovery Recorded" vs "Success"
- **Poetic, not technical** — "No Specimens Found" vs "No Results"
- **Inviting, not commanding** — "Shall we begin?" vs "Click here to start"

**Critical Balance:** The metaphor must never obscure the action. **Clarity first, flavor second.**

---

## 2. Micro-copy Translation Table

### Actions & Buttons (Tier 1 — Functional Labels)

| **Generic SaaS** | **Northcote Curio** | **Voice Tier**  | **Context**         |
| :--------------- | :------------------ | :-------------- | :------------------ |
| Upload resume    | Upload Resume       | T1 (Functional) | File upload CTA     |
| Save changes     | Save                | T1 (Functional) | Save button         |
| Delete           | Delete              | T1 (Functional) | Delete confirmation |
| Submit           | Submit              | T1 (Functional) | Form submission     |
| Cancel           | Cancel              | T1 (Functional) | Cancel action       |
| Apply now        | Apply               | T1 (Functional) | Job application CTA |
| Download         | Download            | T1 (Functional) | Export/download     |
| Edit             | Edit                | T1 (Functional) | Edit mode           |

### Status & Feedback

| **Generic SaaS**   | **Northcote Curio**   | **Context**          |
| :----------------- | :-------------------- | :------------------- |
| Loading...         | Analyzing Specimen... | Loading state        |
| Processing...      | Processing Data...    | Background process   |
| Success!           | Discovery Recorded.   | Success message      |
| Error              | Analysis Failed.      | Error state          |
| No results found   | No Specimens Found.   | Empty search results |
| Saved successfully | Notes Preserved.      | Save confirmation    |
| Upload failed      | Upload Failed.        | Upload error         |

### Navigation & Sections (Tier 1 — Functional with Subtitles)

| **Generic SaaS** | **Primary Label** | **Subtitle (Optional)** | **Context**          |
| :--------------- | :---------------- | :---------------------- | :------------------- |
| Dashboard        | Dashboard         | Your Field Station      | Main dashboard       |
| Profile          | Profile           | Career Log              | User profile         |
| Settings         | Settings          | The Archive Vault       | Settings page        |
| History          | History           | The Archive             | Historical records   |
| Notifications    | Notifications     | Field Notes             | Notification center  |
| Search           | Search            | —                       | Search functionality |
| Recent activity  | Recent Activity   | Fresh Observations      | Activity feed        |

### Empty States

| **Generic SaaS**  | **Northcote Curio**     | **Context**       |
| :---------------- | :---------------------- | :---------------- |
| No items yet      | Collection is empty.    | Empty list        |
| Get started       | Begin Expedition.       | Onboarding prompt |
| Nothing here      | The shelves stand bare. | Empty state       |
| No data available | Ledger is blank.        | No data           |

### Guidance & Help

| **Generic SaaS** | **Northcote Curio**  | **Context**        |
| :--------------- | :------------------- | :----------------- |
| Need help?       | Consult Field Guide? | Help prompt        |
| Learn more       | Deepen Study         | Documentation link |
| Tips & tricks    | Naturalist's Notes   | Tips section       |
| FAQ              | Common Inquiries     | FAQ section        |

---

## 3. Contextual Voice Shifts

### Gallery Mode (Wonder & Discovery)

- **Tone:** Poetic, inviting, warm
- **Language:** "Discover," "Explore," "Observe"
- **Example:** "Your career unfolds like a pressed flower—each layer revealing new depth."

### Laboratory Mode (Rigor & Analysis)

- **Tone:** Precise, clinical, measured
- **Language:** "Examine," "Measure," "Classify"
- **Example:** "Structural analysis reveals 12 transferable competencies."

---

## 4. Specimen Labels & Annotations

### Skill Tags

Format skill badges with naturalist notation:

```
┌─ Fig. 14 ─┐
│   REACT   │
└───────────┘
```

**Implementation:**

```html
<div class="badge-seed">
  <span class="annotation">Fig. 14</span>
  <span class="label">REACT</span>
</div>
```

### Job Status Indicators

| **Status** | **Northcote Label** | **Color**       |
| :--------- | :------------------ | :-------------- |
| Applied    | Application Sent    | Wattle Gold     |
| Interview  | Under Review        | Wattle Glow     |
| Rejected   | Returned            | Concrete Grey  |
| Offer      | Offer Received      | Waratah Red |

---

## 5. Animated Empty State Copy

### The Kookaburra Sentry (First Visit)

**Visual:** Kookaburra illustration with subtle head-tilt animation
**Copy:** "The Sentry awaits your first specimen."
**Sub-copy:** "Begin by cataloging your resume into the collection."

### Empty Opportunities Feed

**Visual:** Empty specimen net illustration
**Copy:** "The bushland is quiet today."
**Sub-copy:** "New opportunities will appear as they're discovered."

### Empty Skills Analysis

**Visual:** Brass calipers, closed
**Copy:** "No measurements yet recorded."
**Sub-copy:** "Upload a resume to begin the analysis."

---

## 6. Error Messages (Tier 1 — Clarity First)

> [!CAUTION]
> Error states are stressful. Prioritize clarity and actionable guidance over personality.

### Upload Errors

```
❌ Too vague: "File upload failed. Please try again."
❌ Too themed: "The specimen could not be deposited in the collection."
✅ Northcote: "Upload failed. Please use PDF or DOCX format, under 5MB."
```

### Network Errors

```
❌ Too vague: "Connection lost."
❌ Too themed: "The telegraph line has faltered."
✅ Northcote: "Connection lost. Reconnecting..."
```

### Validation Errors

```
❌ Too themed: "Address Malformed."
✅ Northcote: "Please enter a valid email address."
```

---

## 7. Onboarding & First-Time User Experience

### Welcome Message

```
"Welcome to the Northcote Curio Field Station.

You've entered a cabinet of curiosities dedicated to your career—
a place where resumes are specimens, skills are catalogued flora,
and opportunities are rare finds waiting to be discovered.

Shall we begin?"
```

### First Upload Prompt

```
"Catalog Your First Specimen

Your resume is the foundation of your collection.
Upload it here, and the Naturalist will begin the examination."
```

---

## 8. Confirmation Dialogs

### Delete Confirmation

```
Title: "Discard Specimen?"
Body: "This item will be removed from the collection permanently. This action cannot be undone."
Buttons: ["Discard Specimen", "Keep in Collection"]
```

### Discard Changes

```
Title: "Discard Notes?"
Body: "You have unsaved changes to this entry. Closing now will lose these refinements."
Buttons: ["Discard Notes", "Continue Editing"]
```

---

## 9. Success Celebrations

### Resume Parsed Successfully

```
🌸 "Discovery Recorded"
"Your specimen has been catalogued. The Naturalist has identified [X] skills and [Y] experiences."
```

### Job Application Submitted

```
🎯 "Application Sent"
"Your request has been submitted to [Company Name]. The waiting begins."
```

### Profile Completed

```
✨ "Collection Complete"
"Your career log is now fully catalogued and ready for discovery."
```

---

## 10. Implementation Guidelines

### For Developers

1. **Never hardcode generic text.** Always reference this document or create a `copy.ts` constants file.
2. **Use the Translation Table** as your primary reference for button labels and status messages.
3. **Context matters:** Gallery Mode = poetic; Laboratory Mode = precise.
4. **Maintain consistency:** If you call it "specimen" in one place, don't call it "document" elsewhere.

### For Designers

1. **Pair micro-copy with appropriate typography:**
   - Gallery Mode proclamations → Libre Bodoni (The Proclamation)
   - Laboratory Mode labels → JetBrains Mono (The Annotation)
2. **Leave space for longer text.** "Catalog Resume" is longer than "Upload."
3. **Illustrate empty states** with botanical or naturalist imagery, not generic icons.

---

## 11. Voice Checklist

Before shipping any UI text, ask:

- [ ] Does this sound like a Victorian naturalist would say it?
- [ ] Is the action **obvious** to the user? (e.g. Can they tell it saves the file?)
- [ ] Does it match the mode context (Gallery = poetic, Laboratory = precise)?
- [ ] Would a user smile or feel curious reading this?
- [ ] Is it helpful, not just whimsical?

**If you answered "no" to any of these, revise the copy.**

---

## Appendix: Forbidden Phrases

**Never use these generic SaaS phrases:**

- "Click here"
- "Get started now"
- "Unlock your potential"
- "Boost your career"
- "Optimize your resume"
- "Powered by AI"
- "Seamless experience"
- "Next-generation platform"

**These are slop. Northcote Curio speaks with personality, not marketing jargon.**
