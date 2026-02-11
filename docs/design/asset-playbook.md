# Kerala Rage — Asset Playbook

> **Status:** Canonical, merged source of truth ✅
> **Scope:** Visual identity, symbolic system, AI generation playbook, asset usage, and product integration.
> **Audience:** Designers, developers, collaborators, AI operators.

---

## 0. Canon Principles (Non‑Negotiable)

- **Dark-only. One mode.** No light UI, no alternates.
- **English-only.** Cultural identity is expressed visually and typographically, not via multilingual UI text.
- **No bureaucracy.** No visas, passports, forms, stickers, or administrative aesthetics.
- **No institutional state symbols.** Fading aesthetics are implicit, never iconographic.
- **Not propaganda.** This system is declarative, mythic, archival — never instructional or recruitment‑style.
- **Cultural safety over novelty.** Reject cleverness that weakens meaning.

---

## 1. Visual Moodboard & DNA

The Kerala Rage system draws from **screenprint poster culture**, **wheat‑paste street surfaces**, **devotional statuary**, and **archival resistance imagery**. Assets should feel *found on a wall at night*, not designed in a studio.

### Global Visual DNA
- **Screenprint illustration** (Primary technique)
- **Wheat‑paste / street poster texture** (Secondary technique)
- **Matte charcoal background** (The substrate)
- **Limited ink palette** (3–5 colours per asset)
- **Flat fills, rough edges, visible grain**
- **Slight misregistration allowed**
- ❌ **No gradients, ❌ no photorealism**

### Cultural & Safety Locks
- **English-only text.**
- ❌ **No corporate or stock-photo aesthetics.**

**First Nations (Australia)**
- Aboriginal flag colours **only in situ** on placards or graffiti.
- Allowed text only: **“ALWAYS WAS ALWAYS WILL BE”** or **“TREATY NOW”**.
- ❌ No Aboriginal art styles or decorative abstraction.

**Devotional (Hindu)**
- Shiva imagery must be **reverent, statue-inspired, grounded**.
- ❌ No irony, ❌ no slogans, ❌ no fantasy glow.

---

## 2. Symbolic Anchor System (Usage Rules)

**Symbolic Anchors** are low‑frequency, high‑meaning assets (e.g., Shiva Statue, Kerala Elephant, Resistance Portraits). They are not decoration.

### Usage Rules
- **Max one** symbolic anchor per screen.
- **Z-layer:** Always behind content (`Z-layer-1` or `Z-layer-2`).
- **Allowed Pages:** Landing, Dashboard Overview, Analysis Overview, Editorial.
- **Forbidden Pages:** Authentication, Ingestion, Editor, Settings.
- **Responsive:** Tablet reduces opacity by 30%; Mobile removes the anchor entirely.

---

## 3. Small‑UI Safety Matrix

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
| Liberatory graffiti | Street | ⚠️ | Interruption tiles |
| Paint splash | Abstract | ✅ | Transitions |
| Typography pressure | Abstract | ✅ | Motion backplates |
| Laneway texture | Texture | ✅ | Substrate |

---

## 4. AI Generation Playbook

### Tooling
- **Primary:** Gemini Nano / Banana Pro
- **Optional:** DALL·E (1–2 hero composite portraits only, heavy curation)

### Generation Order
1. Shiva (Anchors)
2. Kerala Symbols
3. System Abstracts & Textures
4. Australian Context & Solidarity
5. Resistance Portraits

---

## 5. Master Prompt Library (DHS Enabled)

### GLOBAL PREFIX (Prepend to EVERY prompt)
```
You are generating assets for a dark-only, screenprint-illustration design system.
All visuals must express layered diasporic identity (Indian + Australian lived reality + First Nations grounding) in a single frame.
No segregation of identities. No state symbols. No bureaucracy. No decorative Aboriginal art.
English-only text if present. Charcoal background. Limited ink palette (3–5 colours).
Heavy screenprint grain and wheat-paste texture.
```

---

### GROUP 1: Composite & Hero Assets

#### 1️⃣ LANDING HERO — LAYERED MYTHIC COMPOSITE
```
Generate a cinematic landing hero illustration. A central Shiva statue–inspired figure rendered as a solid, sculptural silhouette, integrated into contemporary Australian urban textures (brick laneways, protest residue), with Aboriginal flag colours subtly embedded in the ground, roots, or horizon glow. All identities must coexist in one image.
```
- **Filename:** `hero_layered_shiva_landing_16x9_v1.png`
- **Output Path:** `/public/assets/hero/`
- **Specs:** 16:9 | 3840 × 2160 px | 72 DPI

#### 2️⃣ EDITORIAL BACKGROUND — LAYERED ABSTRACT FIELD
```
Generate an abstract editorial background for long-scroll content. Kerala greens and reds bleeding into Australian urban textures, paint splashes, torn poster edges, screenprint grain, Aboriginal flag colours faintly layered beneath the surface like soil strata. No figures. No text.
```
- **Filename:** `bg_editorial_layeredfield_9x16_v1.png`
- **Output Path:** `/public/assets/backgrounds/`
- **Specs:** 9:16 | 2160 × 3840 px | 72 DPI

---

### GROUP 2: Symbolic Anchors

#### 3️⃣ SHIVA DEVOTIONAL ANCHOR — SCULPTURAL OBJECT
```
Screenprint image of a Shiva statue, stone-like and monumental. Calm, reverent, statue-inspired, grounded. The figure should feel embedded in lived space, not fantasy imagery. Centered composition. Muted gold halo disk. No text.
```
- **Filename:** `motif_shiva_sculptural_anchor_1x1_v1.png`
- **Output Path:** `/public/assets/motifs/`
- **Specs:** 1:1 | 2048 × 2048 px

#### 4️⃣ TRISHULA + DAMRU — ICONIC SYMBOL
```
Bold screenprint icon of a trishula with damru. Thick line weight, simplified silhouette, high stasis. Recognizable at small scales. 3-5 ink colors. No text.
```
- **Filename:** `symbol_trishula_damru_1x1_v1.png`
- **Output Path:** `/public/assets/symbols/`
- **Specs:** 1:1 | 1024 × 1024 px

#### 5️⃣ KERALA ELEPHANT — CULTURAL SYMBOL
```
Screenprint illustration of a Kerala elephant with simplified temple ornaments (Nettipattam), palm framing, and a subtle halo disk. Celebration and cultural richness. No text.
```
- **Filename:** `symbol_kerala_elephant_1x1_v1.png`
- **Output Path:** `/public/assets/symbols/`
- **Specs:** 1:1 | 2048 × 2048 px

---

### GROUP 3: Portraits

#### 6️⃣ REVOLUTIONARY PORTRAIT — BHAGAT SINGH
```
Agitprop stencil screenprint portrait of Bhagat Singh. Profile with hat. Distinct thin gold "Martyr's Halo" ring behind head. Text included: "INQUILAB ZINDABAD". Heavy grain, limited palette.
```
- **Filename:** `portrait_bhagatsingh_editorial_3x4_v1.png`
- **Output Path:** `/public/assets/portraits/`
- **Specs:** 3:4 | 2400 × 3200 px

#### 7️⃣ RESISTANCE PORTRAIT — TIPU SULTAN
```
Screenprint portrait of Tipu Sultan. Green turban. Subtle tiger motifs integrated into shading. Defiant, intellectual expression. No historical realism. No text.
```
- **Filename:** `portrait_tipu_sultan_editorial_3x4_v1.png`
- **Output Path:** `/public/assets/portraits/`
- **Specs:** 3:4 | 2400 × 3200 px

---

### GROUP 4: Street & Solidarity

#### 8️⃣ MELBOURNE STREET TEXTURE — SUBSTRATE
```
Melbourne street texture asset. Brick walls, wheat-paste residue, graffiti remains. Screenprint texture, material-first. No readable text.
```
- **Filename:** `texture_melbourne_street_1x1_v1.png`
- **Output Path:** `/public/assets/textures/`
- **Specs:** 1:1 | 2048 × 2048 px

#### 9️⃣ FIRST NATIONS SOLIDARITY — PROTEST PLACARD
```
Protest placard reading "ALWAYS WAS ALWAYS WILL BE". Raw paint strokes, urgent lettering, embedded in an atmospheric street context.
```
- **Filename:** `solidarity_firstnations_placard_4x5_v1.png`
- **Output Path:** `/public/assets/solidarity/`
- **Specs:** 4:5 | 2160 × 2700 px

---

## 6. Final Acceptance Test
1. Does this feel **found**, not designed?
2. Would it belong on a wall at night?
3. Is it **dark-only** and **English-only**?
4. Does it match its **Filename and Export Path** exactly?

If yes → **Accept**. If no → **Regenerate**.
