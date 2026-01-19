# DOC-006: Voice & Micro-copy ("The Naturalist's Marginalia")

**Document ID:** DOC-006-VOICE
**Version:** 2.1 (Northcote Curio Edition - Clarity Revision)
**Status:** ACTIVE
**Context:** Operationalizing the "eccentric, curious naturalist" personality throughout the application. Balancing world-building with usability.

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

### Actions & Buttons

| **Generic SaaS** | **Northcote Curio** | **Context** |
|:---|:---|:---|
| Upload resume | Catalog Resume | File upload CTA |
| Save changes | Preserve Notes | Save button |
| Delete | Discard Specimen | Delete confirmation |
| Submit | Submit Record | Form submission |
| Cancel | Close Log | Cancel action |
| Apply now | Send Application | Job application CTA |
| Download | Export Findings | Export/download |
| Edit | Edit Observations | Edit mode |

### Status & Feedback

| **Generic SaaS** | **Northcote Curio** | **Context** |
|:---|:---|:---|
| Loading... | Analyzing Specimen... | Loading state |
| Processing... | Processing Data... | Background process |
| Success! | Discovery Recorded. | Success message |
| Error | Analysis Failed. | Error state |
| No results found | No Specimens Found. | Empty search results |
| Saved successfully | Notes Preserved. | Save confirmation |
| Upload failed | Upload Failed. | Upload error |

### Navigation & Sections

| **Generic SaaS** | **Northcote Curio** | **Context** |
|:---|:---|:---|
| Dashboard | Field Station | Main dashboard |
| Profile | Career Log | User profile |
| Settings | Curator's Desk | Settings page |
| History | The Archive | Historical records |
| Notifications | Field Notes | Notification center |
| Search | Search Collection | Search functionality |
| Recent activity | Fresh Observations | Activity feed |

### Empty States

| **Generic SaaS** | **Northcote Curio** | **Context** |
|:---|:---|:---|
| No items yet | Collection is empty. | Empty list |
| Get started | Begin Expedition. | Onboarding prompt |
| Nothing here | The shelves stand bare. | Empty state |
| No data available | Ledger is blank. | No data |

### Guidance & Help

| **Generic SaaS** | **Northcote Curio** | **Context** |
|:---|:---|:---|
| Need help? | Consult Field Guide? | Help prompt |
| Learn more | Deepen Study | Documentation link |
| Tips & tricks | Naturalist's Notes | Tips section |
| FAQ | Common Inquiries | FAQ section |

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

| **Status** | **Northcote Label** | **Color** |
|:---|:---|:---|
| Applied | Application Sent | Wattle Gold |
| Interview | Under Review | Wattle Glow |
| Rejected | Returned | Flannel Flower |
| Offer | Offer Received | Waratah Crimson |

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

## 6. Error Messages (Graceful Failures)

### Upload Errors
```
❌ Generic: "File upload failed. Please try again."
✅ Northcote: "Upload Failed. Ensure it's a PDF or DOCX format, no larger than 5MB."
```

### Network Errors
```
❌ Generic: "Connection lost. Reconnecting..."
✅ Northcote: "Connection Faltered. Attempting to restore the line..."
```

### Validation Errors
```
❌ Generic: "Invalid email address."
✅ Northcote: "Address Malformed. Please verify usage of standard email format."
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
