# Kerala Rage — Master Asset Playbook

> **Status:** Canonical Master Source of Truth (Kr-Solidarity V3.1) ✅  
> **Scope:** Brand identity, symbolic anchors, specific asset briefs, and AI generation orchestration.  
> **Related SOPs:** Operational guides for batch processing and feedback loops are located in `docs/design/assets/`.

---

## 0. Canon Principles (Non‑Negotiable)

- **Dark-only.** One mode. No light UI, no alternates. No white backgrounds.
- **English-only.** Cultural identity is expressed visually and typographically, not via multilingual text.
- **No bureaucracy.** No visas, passports, forms, stickers, or administrative aesthetics.
- **No institutional state symbols.** Resistance equals the people, not the state.
- **Not propaganda.** Mythic, archival, and declarative. Never instructional.
- **Matte Charcoal Substrate.** All assets live on a #1A1714 substrate.

---

## 1. STRATEGIC DESIGN DNA

The Kerala Rage system is a synthesis of **Keralan revolutionary history** and **Australian urban street culture**. 

### Visual Identity
- **Screenprint / Woodblock Illustration**: Primary technique for figures and symbols.
- **Materiality**: Ink spread, misregistration, and heavy paper grain.
- **Atmosphere**: "The Night Manifesto." Found on a wall at 2 AM.
- **Colors**: Asphalt Black (#1A1714), Solidarity Red (#C84032), Ink Gold (#D4A84B), Worker Ash / Concrete Grey (#7A7570).

### Cultural Locks
- **First Nations (Australia)**: Aboriginal colors only in-situ (placards/graffiti). No decorative art appropriation. Explicit text allowed: "ALWAYS WAS ALWAYS WILL BE," "TREATY NOW."
- **Devotional (Hindu)**: Shiva imagery must be reverent and statue-grounded. No irony. No fantasy glows. Focus on monumental stone textures.

---

## 2. SYMBOLIC ANCHOR SYSTEM

Anchors are high-meaning, low-frequency assets (Shiva, Elephant, Resistance Portraits).

- **Max One** symbolic anchor per screen.
- **Z-Layer**: Always behind content (`Z-layer: 10-40`).
- **Placement**: Landing, Dashboard, Analysis, Editorial. 
- **Exclusion**: Never use anchors on utility pages (Settings, Ingestion, Auth).
- **Negative Space**: Preserve **35–45% in the Upper-Left** for UI typography.

---

## 3. SMALL-UI SAFETY MATRIX

| Motif | Category | Small UI Safe (24px) | Role |
|------|----------|------------------------|------|
| Shiva Statue | Devotional | ❌ | Hero Anchor |
| Kerala Elephant | Symbol | ⚠️ | Card/Divider |
| Trishula/Damru | Symbol | ✅ | Status Icons |
| Bhagat Singh | Portrait | ❌ | Editorial |
| Laneway Texture | Texture | ✅ | Global Substrate |
| Typography Pressure| Abstract | ✅ | Motion Backplates |
| Paint Splash | Abstract | ✅ | Transitions |

---

## 4. GLOBAL ASSET CATALOG & BRIEFS

### Batch 1: The Identity Anchors
| Asset ID | Name | Role | Prompt Logic |
|----------|------|------|--------------|
| `KR-SOLID-001` | Shiva Statue | Mythic Hero | "Stone-like, monumental, temple light, granite texture. No text." |
| `KR-SOLID-005` | Bhagat Singh | Resistance Hero | "Agitprop stencil, high contrast, gold martyr halo. Text: INQUILAB ZINDABAD." |
| `KR-SOLID-006` | Tipu Sultan | Historical Noble | "Editorial screenprint, green turban, subtle tiger motifs. No text." |
| `KR-SOLID-009` | Kerala Elephant | Cultural Symbol | "Temple elephant, gold Nettipattam, palm vignettes. Opacity: 15%." |

### Batch 2: Street & Textural Substrates
| Asset ID | Name | Role | Prompt Logic |
|----------|------|------|--------------|
| `KR-SOLID-033` | Melbourne Laneway | Global Substrate | "Brick mortar, wheat-paste residue, urban grime. Seamless tileable." |
| `KR-SOLID-031` | Treaty Placard | Solidarity | "Hand-painted sign, Raw paint strokes. Text: ALWAYS WAS ALWAYS WILL BE." |
| `KR-SOLID-015` | Paint Splash | Transition | "Kinetic ink energy, [DEPRECATED_STYLE] splatters. Monochrome." |

---

## 5. HERO COMPOSITION ENGINE (Gemini Prompting)

To generate new heroes using the `gemini-hero-generator.ts`, compositions must follow these rules:

### Composition Layers (Bottom to Top)
1. **Substrate** (MANDATORY): Charcoal Paper or Laneway Texture.
2. **Atmospheric**: Paint Splashes or Abstract Solidarity.
3. **Mid-Layer (Optional)**: Kerala Landscapes or Elephant.
4. **Foreground Anchor**: Shiva Statue or Resistance Portraits.

### The "Hero Engine" Prompt Template
```text
PROJECT: Kerala Rage – kr-solidarity (v6.0)
OBJECTIVE: Generate a layered hero composition as a single flattened PNG.
STYLE: Screenprint illustration, Melbourne street grit, anti-colonial aesthetic.
CONSTRAINTS: Dark-only, English-only. NO gradients. NO monarchy symbols.
COMPOSITION: 
- Foreground: [ANCHOR_ID]
- Substrate: [TEXTURE_ID]
- Negative Space: 40% reserved in Upper-Left corner.
- Palette: #1A1714 (Base), #C84032 (Red), #D4A84B (Gold).
```

---

## 6. EXECUTION & VALIDATION PLAN

### Tool Selection
- **Imagen 3**: Optimized for substrates, material authenticity, and expressive textures.
- **DALL-E**: Optimized for geometric UI elements, clean transparent backgrounds, and specific symbols.

### Validation Checklist (Post-Generation)
- [ ] **Technical**: 2560x1440 resolution, <100KB (WebP) or Transparent PNG.
- [ ] **Aesthetic**: Does it feel "found" (street-paste), not clean/digital?
- [ ] **Canon**: No bureaucracy? English-only? Charcoal background confirmed?
- [ ] **Space**: Is the 40% upper-left negative space actually preserved?
- [ ] **Manifest**: Asset ID assigned and integrated into global manifest.

---

**Folder Note:** Technical Operating Procedures for the batch pipeline (e.g., how to run the python reconcilers) are maintained in the `docs/design/assets/` folder to separate strategy from execution.
