# Kerala Rage — Design System Canon

> **Status:** Canonical, merged source of truth
> **Scope:** Visual identity, symbolic system, AI generation playbook, asset usage, and product integration
> **Audience:** Designers, developers, collaborators, AI operators

---

## 0. Canon Principles (Non‑Negotiable)

- **Dark-only. One mode.** No light UI, no alternates.
- **English-only.** Cultural identity is expressed visually and typographically, not via multilingual UI text.
- **No bureaucracy.** No visas, passports, forms, borders, counters, or administrative aesthetics.
- **No crowns / monarchy.** Colonial defeat is implicit, never iconographic.
- **Not propaganda.** This system is declarative, mythic, archival — never instructional or recruitment‑style.
- **Cultural safety over novelty.** Reject cleverness that weakens meaning.

---

## 1. Visual Moodboard — Authoritative Reference

The Kerala Rage system draws from **screenprint poster culture**, **wheat‑paste street surfaces**, **devotional statuary**, and **archival resistance imagery**. Assets should feel *found on a wall at night*, not designed in a studio.

### Global Visual DNA
- Screenprint illustration (primary)
- Wheat‑paste / street poster texture (secondary)
- Matte charcoal background
- 3–5 ink colours per asset
- Flat fills, rough edges, visible grain
- Slight misregistration allowed
- ❌ No gradients, ❌ no photorealism

### Cultural & Safety Locks
- English-only text
- ❌ No corporate or stock-photo aesthetics

**First Nations (Australia)**
- Aboriginal flag colours **only in situ** on placards or posters
- Allowed text only: **“ALWAYS WAS ALWAYS WILL BE”**
- ❌ No Aboriginal art styles or decorative abstraction

**Devotional (Hindu)**
- Shiva imagery must be **reverent, statue-inspired, grounded**
- ❌ No irony, ❌ no slogans, ❌ no fantasy glow

---

## 2. Canonical Visual References (`/visuals`)

These images are **authoritative style anchors**. They define texture, contrast, ink behaviour, and symbolic restraint. New assets must be visually checked against them.

### `/visuals` Index (Repo‑Ready)
```
/visuals/
  moodboard-12-tile-v1.png
  shiva-statue-reference.png
  trishula-damru-icon.png
  kerala-elephant-reference.png
  kerala-landscape-reference.png
  tipu-sultan-reference.png
  bhagat-singh-reference.png
  treaty-now-laneway.png
  first-nations-placard.png
  anti-colonial-graffiti.png
  paint-splash-field.png
  typography-pressure.png
  melbourne-laneway-texture.png
```

### Reference Descriptions
- **moodboard-12-tile-v1.png** — Full system snapshot; use for overall taste alignment only.
- **shiva-statue-reference.png** — Devotional anchor; calm, monumental, halo disk.
- **trishula-damru-icon.png** — Icon-scale symbol; small-size legibility.
- **kerala-elephant-reference.png** — Cultural power; ornamented, haloed, palm framing.
- **kerala-landscape-reference.png** — Memory and continuity; no people.
- **tipu-sultan-reference.png** — Resistance lineage; green turban, subtle tiger energy.
- **bhagat-singh-reference.png** — Martyr lineage; profile + halo, restrained text.
- **treaty-now-laneway.png** — Australian context; “TREATY NOW”, in situ only.
- **first-nations-placard.png** — Solidarity; placard context only.
- **anti-colonial-graffiti.png** — Street interruption; raw, legible.
- **paint-splash-field.png** — Emotional pressure without language.
- **typography-pressure.png** — Extreme thin/bold contrast, abstract only.
- **melbourne-laneway-texture.png** — Atmospheric substrate.

**Rule:** These visuals are **style references only**. Do not copy composition or merge symbols.

---

## 3. Symbolic Anchor System (Product Integration)

### Definition
**Symbolic Anchors** are low‑frequency, high‑meaning assets. They carry cultural, devotional, or resistance weight.

They are:
- Not decoration
- Not backgrounds
- Not icons

### Usage Rules
- Max **one** symbolic anchor per screen
- Never repeated within a single scroll viewport
- Minimum visual size: **96px**
- Z‑layer: behind content (Z‑1 / Z‑2)

### Allowed Pages
- Landing
- Dashboard Overview
- Analysis Overview
- Editorial / About

### Forbidden Pages
- Authentication
- Ingestion
- Editor
- Settings

### Responsive
- Tablet: reduce opacity by 30%
- Mobile: remove entirely

---

## 4. Asset Categories & Small‑UI Safety

| Motif | Category | Small UI Safe (24–48px) | Notes |
|------|----------|------------------------|------|
| Shiva statue | Devotional | ❌ | Hero / anchor only |
| Trishula + damru | Symbol | ✅ | Primary icon candidate |
| Kerala elephant | Symbol | ⚠️ | Cards, dividers |
| Kerala landscape | Symbol | ❌ | Background panels |
| Tipu Sultan | Portrait | ❌ | Editorial only |
| Bhagat Singh | Portrait | ❌ | Editorial only |
| Treaty Now graffiti | Street | ⚠️ | Context tiles |
| First Nations placard | Street | ❌ | Solidarity context |
| Anti‑colonial graffiti | Street | ⚠️ | Interruption tiles |
| Paint splash | Abstract | ✅ | Transitions |
| Typography pressure | Abstract | ✅ | Motion backplates |
| Laneway texture | Texture | ✅ | Substrate |

---

## 5. AI Generation Playbook

### Tooling
- **Primary:** Gemini Nano / Banana Pro
- **Optional:** DALL·E (1–2 hero portraits only, heavy curation)

### Generation Order
1. Shiva
2. Kerala symbols
3. System abstracts
4. Australian context
5. Resistance portraits

### Quality Gate (Reject if any fail)
- Banned symbols appear
- Extra or altered text
- Painterly / photoreal look
- Propaganda or instructional tone

---

## 6. Prompt Library (Gemini‑Optimised)

> **IMPORTANT:** For the strict, execution-ready generation batches, naming conventions, and export rules, refer to **`docs/design/05-assets.md`**. That file is the tactical source of truth for asset generation.

**Global assumption:** Screenprint or wheat‑paste aesthetic, dark charcoal base, 3–5 ink colours, flat fills, English‑only text, no bureaucracy.

### Shiva (DEV‑01)
Screenprint image of a Shiva statue, stone‑like and monumental. Calm, reverent presence. Centered, icon‑scale composition. Muted gold halo disk. Dark charcoal background. No text.

### Trishula + Damru (SYM‑01)
Bold screenprint icon of a trishula with damru. Thick line weight, simplified silhouette, recognisable at small sizes. No text.

### Kerala Elephant (SYM‑02)
Screenprint illustration of a Kerala elephant with simplified temple ornaments, palm framing, halo disk. No text.

### Kerala Landscape (SYM‑03)
Screenprint landscape of backwaters and coconut palms. No people. No text.

### Tipu Sultan (POR‑01)
Screenprint portrait of Tipu Sultan. Green turban. Subtle tiger motifs. No text.

### Bhagat Singh (POR‑02)
Screenprint portrait of Bhagat Singh in profile with hat and halo. Text: **INQUILAB ZINDABAD**.

### Treaty Now (STR‑01)
Wheat‑paste mural in Melbourne laneway. Text: **TREATY NOW**. Aboriginal colours in situ only.

### First Nations Placard (STR‑02)
Protest placard in context. Text: **ALWAYS WAS ALWAYS WILL BE**.

### Anti‑Colonial Graffiti (STR‑03)
Raw graffiti on brick wall. Text: **NO PRIDE IN GENOCIDE**.

### Paint Splash (ABS‑01)
Abstract paint splashes and ink drips. No text.

### Typography Pressure (ABS‑02)
Abstract fragmented letterforms. Extreme thin/bold contrast. No readable words.

### Laneway Texture (TEX‑01)
Wheat‑paste residue on brick or concrete wall. No text.

---

## 7. Final Acceptance Test

Ask:
1. Does this feel *found*, not designed?
2. Would it belong on a wall at night?
3. Is the power symbolic, not explanatory?

If yes → accept. If no → regenerate.

---

**End of Design System Canon**
