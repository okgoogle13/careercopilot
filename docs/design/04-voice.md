Here’s a contemporary, migrant‑centred rewrite for your voice doc.

---

# Voice & Microcopy

> Part of [Northcote Design System – Contemporary Australian](00-overview.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

---

## The Voice Principle

**Core Identity**: A grounded, sharp, quietly funny guide who knows Australian systems are messy – speaking peer‑to‑peer with someone navigating them. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)

| Characteristic           | Example                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ |
| Curious, not corporate   | “Let’s inspect this role” vs “View Details”                                    |
| Honest, not hypey        | “This might be a stretch—but here’s why it’s worth a look” vs “Perfect match!” |
| Plain, not jargon‑heavy  | “No roles match yet” vs “No results returned”                                  |
| Inviting, not commanding | “Ready to try this next?” vs “Click here to start”                             |

> **Clarity first, flavor second.** If someone is tired, stressed, or on mobile on a tram, they should still instantly know what happens when they tap. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

---

## Voice Tier System

### Tier 1: Functional Clarity (Primary UI)

**Where**: Navigation, buttons, form labels, core error messages
**Voice**: Clear, simple, unambiguous. No metaphors.

| Generic       | Northcote           |
| ------------- | ------------------- |
| Upload resume | Upload resume       |
| Save changes  | Save                |
| Apply now     | Apply for this role |

Keep verbs short and consistent across the app. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

---

### Tier 2: Contextual Personality (Celebrations & States)

**Where**: Success messages, empty states, onboarding, non‑critical hints
**Voice**: Warm, wry, and aware of how annoying job search can be.

| Context          | Northcote example                                       |
| ---------------- | ------------------------------------------------------- |
| Success          | “Saved. One less thing to juggle.”                      |
| Loading          | “Reading your history, not rewriting it…”               |
| No results found | “Nothing matches yet. Let’s widen the search a little.” |
| Guided step      | “We’ll take this one question at a time.”               |

Personality is welcome here, but never at the cost of understanding what just happened. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

### Tier 2/3 Boundary Examples

**When to use T2 vs T3:**

| Context                          | Tier | Example                                                  |
|----------------------------------|------|----------------------------------------------------------|
| Quick success toast              | T2   | "Saved. One less thing to juggle."                      |
| Success with next step guidance  | T3   | "Saved. You can reuse this for similar roles next time."|
| Empty state (first visit)        | T2   | "We don't know your story yet. Let's start."             |
| Empty state with context         | T3   | "Government forms don't leave room for community work. We do." |

---

### Tier 3: Character Depth (Opt‑in / Detail)

**Where**: Explanations, tips, tooltips, “Why this?” panels, email digests
**Voice**: More reflective and contextual – acknowledges Centrelink, selection criteria, unpaid care, migration, and community work without being heavy‑handed.

Examples:

- “Government forms don’t leave much room for community work. We do.”
- “This role leans on the kind of emotional labour you’ve probably been doing for years.”
- “You’ve done this work before – just not under this job title.” [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/292c4d9b-acbb-4641-979a-a36a37b4a7b7/07-wireframe-content-draft.md)

---

## Contextual Voice Shifts

We don’t use Gallery/Lab modes anymore, but we still shift tone with context:

| Context               | Tone & Verbs                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| Landing / marketing   | Warm, invitational, short phrases. “Find your way through this system.” |
| Day‑to‑day workflow   | Calm, straightforward. “Add experience”, “Review matches”.              |
| Review / analysis     | Clear and specific. “We found 9 skills that match this ad.”             |
| Error / stress states | Grounding, practical. “Upload failed. Try PDF under 5MB.”               |

If in doubt: **short, clear, then kind.** [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

---

## Error Messages (Tier 1 — Clarity First)

> Error states are stressful. They should feel like a steady hand, not a joke. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

```text
❌ Too themed: “The system couldn’t digest this artifact.”
✅ Northcote: “Upload failed. Use PDF or DOCX format, under 5MB.”
```

Patterns:

- Say what went wrong in plain language.
- Say what to do next.
- Don’t blame the user (“you did X wrong”); describe the constraint instead. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

---

## Empty States

Use empties to reduce shame and show the next step.

| Context     | Copy                                                            |
| ----------- | --------------------------------------------------------------- |
| First visit | “We don’t know your story yet. Let’s start with one role.”      |
| Empty feed  | “Nothing tracked yet. Save a job and it will show up here.”     |
| No skills   | “No skills added. We’ll suggest some based on your experience.” |

Each empty state should answer:

1. What’s missing? 2) Why that’s okay. 3) What to do next. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/efa04425-d50c-4611-bc01-ab05d271c694/annotated-wireframes.md)

---

## Forbidden Phrases

Avoid generic SaaS marketing and AI hype:

- “Click here”
- “Unlock your potential”
- “Powered by AI”
- “Seamless experience”
- “Next‑generation platform”
- “Crush your goals”
- “10x your career”

Instead, speak like a thoughtful colleague who knows how exhausting applications can be:

- "Make this easier to reuse."
- "Keep a copy of this for next time."
- "This will save you time on the next application." [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

---

## When Humor is Inappropriate

Never use personality or humor in:

1. **System failures** — "Upload failed. Try PDF under 5MB." (not "Oops, that didn't work!")
2. **Data loss warnings** — "You have unsaved changes. Save before leaving?" (not "Don't lose your work!")
3. **Security/privacy** — "Your data is encrypted." (not "Your secrets are safe with us!")
4. **Payment/billing** — "Payment method required." (not "Time to pay up!")

**Rule**: If stakes are high (data loss, money, privacy), use T1 (Functional) voice only.

---

Northcote's voice is **grounded, specific, and on the user's side**, not selling a fantasy.
