# Kerala Rage Create: The Asset Generation Manifest

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## 1. Asset Strategy: Screenprint & Solidarity

Our asset system reflects a collision of high-fidelity screenprinting aesthetics with raw street art urgency. We move away from botanical catalogs into a living expression of diaspora identity and Australian endemic geometry.

### Core Visual Constraints:

- **Style**: Screenprint, Wheat-paste, Stencil, Halftone, Grit.
- **Colors**:
  - `charcoalBackground` (#1A1A1A) - The substrate.
  - `baruGold` (#DAF674) - The light of discovery.
  - `waratahRed` (#F14714) - The heat of action.
  - `parrotGreen` (#48F0E5) - The vibration of life.
- **Banned Elements**: No perfect circles, no bureaucratic forms (passports, stamps), no light mode, no generic blue.

---

## 2. The Generation Manifest (To-Do List)

These are the **8 core assets** required to build the Solidarity Mode interface. All assets must be generated as PNGs and converted to WebP.

| Asset ID | Filename                              | Description                | Prompt Keywords                                                                       |
| :------- | :------------------------------------ | :------------------------- | :------------------------------------------------------------------------------------ |
| **01**   | `kr-asset-charcoal-paper.webp`        | Base substrate texture     | Matte charcoal paper texture, heavy grain, seamless, dark grey #1A1A1A                |
| **02**   | `kr-asset-screenprint-substrate.webp` | Overlay texture with noise | Screenprint ink texture, noise, dust, subtle scratches, 20% opacity look              |
| **03**   | `kr-asset-wheat-paste-tear.webp`      | Torn paper edge            | Torn poster edge, wheat-paste texture, ragged paper, white/grey fibers                |
| **04**   | `kr-asset-halo-disk.webp`             | Gold radiance circle       | Circular gold halo, screenprint texture, imperfect edge, varying opacity, #DAF674     |
| **05**   | `kr-asset-screenprint-grit.webp`      | Particle noise             | Speckled grit, ink splatter, dust particles, floating debris, white/grey              |
| **06**   | `kr-asset-blueprint-grid.webp`        | Technical grid overlay     | Technical drawing grid, dashed lines, white on transparent, blueprint aesthetic       |
| **07**   | `kr-asset-blueprint-layout.webp`      | Complex layout watermark   | Abstract architectural layout, dashed lines, geometric shapes, watermark style        |
| **08**   | `kr-asset-screenprint-stamp.webp`     | "Verified" ink stamp       | Circular ink stamp, "VERIFIED" text, grunge texture, uneven ink distribution, #DAF674 |

---

## 3. Asset Categories

### Solidarity Mascots & Motifs

Dynamic, high-contrast stencils of Australian endemic species and cultural symbols. These carry the "Solidarity" message.

- _Examples_: `{kr-asset-halo-disk}`, `{kr-asset-screenprint-stamp}`

### Atmospheric Substrates

Textural backgrounds that provide depth and a tactile feel.

- _Examples_: `{kr-asset-charcoal-paper}`, `{kr-asset-screenprint-substrate}`, `{kr-asset-wheat-paste-tear}`

### Interaction Overlays

Grit, noise, and blueprint lines that appear during state changes or as subtle framing.

- _Examples_: `{kr-asset-screenprint-grit}`, `{kr-asset-blueprint-grid}`, `{kr-asset-blueprint-layout}`

### Symbolic Anchors (Cultural Motifs)

**Definition**: Low-frequency, high-meaning visual elements that carry cultural, devotional, or resistance narratives. These are NOT decorative assets—they are narrative anchors that ground the interface in its Kerala diaspora and Australian solidarity context.

#### Canonical Visual References

| Asset Filename                  | Description                                       | Cultural Context                             | Usage Constraint                |
| :------------------------------ | :------------------------------------------------ | :------------------------------------------- | :------------------------------ |
| `shiva-statue-reference.png`    | Shiva Nataraja statue (cosmic dance)              | Devotional anchor, Kerala Hindu identity     | Max 1 per screen, never as icon |
| `kerala-elephant-reference.png` | Decorated temple elephant                         | Kerala cultural symbol, festival context     | Background element only         |
| `tipu-sultan-reference.png`     | Tipu Sultan portrait (green turban, tiger motifs) | Anti-colonial resistance lineage             | Hero sections only, min 96px    |
| `bhagat-singh-reference.png`    | Bhagat Singh portrait with martyr halo            | Anti-colonial resistance lineage             | Hero sections only, min 96px    |
| `treaty-now-laneway.png`        | "TREATY NOW" street art / laneway poster          | First Nations solidarity, Australian context | In-situ placard use only        |
| `first-nations-placard.png`     | First Nations solidarity placard imagery          | First Nations solidarity, Australian context | In-situ placard use only        |

#### Symbolic Anchor Usage Rules

1. **Frequency**: Maximum ONE Symbolic Anchor per screen.
2. **Placement**: Never overlap with form fields, primary reading zones, or interactive elements.
3. **Size**: Minimum 96px in smallest dimension. These are not icons.
4. **Context**: Must align with page emotional register (e.g., devotional anchors on reflective pages, resistance figures on defiant pages).
5. **Cultural Safety**:
   - **Devotional (Shiva)**: Never mix with protest language in the same visual frame.
   - **Resistance Figures (Tipu, Bhagat Singh)**: Use with "INQUILAB ZINDABAD" or similar anti-colonial text only.
   - **First Nations**: Only appear in-situ on placards/posters. Never as general UI decoration.
6. **Responsive Behavior**:
   - **Desktop**: Full presence at specified opacity.
   - **Tablet**: Reduce opacity by 50%.
   - **Mobile**: Remove entirely.

#### Forbidden Uses

- ❌ Using Shiva imagery as a logo or icon
- ❌ Using First Nations imagery outside of placard/poster context
- ❌ Mixing devotional and protest symbols in the same composition
- ❌ Using resistance figures at small sizes (<96px)
- ❌ Multiple Symbolic Anchors on the same screen

---

## 4. Usage Rules

- **Contrast**: High contrast between foreground motifs and background substrates.
- **Density**: Controlled through the "Atmosphere" system (Pages use specific density levels).
- **Format**: SVG for vector stencils; WebP with grain preservation for textures.

---

**Last Updated**: February 9, 2026
**Next Review**: Post-generation quality check
