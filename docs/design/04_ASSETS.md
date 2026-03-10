# KR Solidarity: Asset Strategy (v6.1)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Definition, placement and governance rules for visual assets.

---

## 1. Symbolic Anchors (High-Meaning Objects)

Symbolic Anchors are low-frequency, high-meaning assets. They are never decoration; they are the "Guardian Motifs" of the interface.

| Asset ID | Name | Category | Emotional Register | Primary Screen |
| :--- | :--- | :--- | :--- | :--- |
| `KR-SOLID-023` | Bhagat Singh | Resistance | Defiance | Landing |
| `KR-SOLID-024` | Tipu Sultan | Resistance | Defiance | Landing / Editorial |
| `KR-SOLID-012` | Shiva Statue | Spiritual | Reflection | Analysis Dashboard |
| `KR-SOLID-033` | Kerala Elephant | Cultural | Authority | Opportunity Lookout |
| `KR-SOLID-031` | Treaty Now Poster | Street | Solidarity | Dashboard Overview |
| `KR-SOLID-030` | First Nations Placard | Street | Solidarity | Dashboard Overview |

### Usage Restrictions
- **Max One per Viewport:** Never place two symbolic anchors in the same scroll frame.
- **Mobile Protocol:** Remove all symbolic anchors on mobile (viewport < 768px) to maintain functional clarity.
- **Desktop Z-Layer:** Always positioned at `Z-2` (behind content, in front of substrate).

---

## 2. Atmospheric Overlays (Texture & Depth)

To avoid "Flat Black" syndrome, backgrounds must use layered textures.

| Motif | ID | Usage |
| :--- | :--- | :--- |
| **Grit Particles** | `KR-SOLID-009` | Global overlay at 5% opacity. Mimics screenprint dust. |
| **Paint Splash** | `KR-SOLID-010` | Section transitions. 15% opacity, `multiply` blend. |
| **Wheat-Paste Noise** | `KR-SOLID-038` | Dashboard surfaces. Subhead background depth. |
| **Blueprint Grid** | `KR-UI-004` | Analysis states. Major grid lines in `blueprint-grey`. |

---

## 3. The Zero-Flora Lockdown

As per the **Migrant Rage** update, the following motifs are **STRICTLY BANNED** and must be purged from all AI prompts and UI iterations:
- ❌ No Kangaroo, Koala, or endemic fauna as icons/mascots.
- ❌ No Eucalyptus, Gum leaves, Wattle, or generic "forest" aesthetics.
- ❌ No "Greenhouse" or "Ecosystem" biological metaphors in copy.
- ❌ No Lilies, Lotus, or floral devotional décor.

**Replacement Strategy:**
- Use **Concrete, Brick, Asphalt, and Paper** for substrate.
- Use **Halos, Stencils, and Ink Blooms** for biological/growth metaphors.

---

## 4. Placement & Integration Logic

### The "Slam" Anchor (UI Positioning)
Symbolic anchors should be positioned with "Extreme Offset" to create asymmetric tension.
- **Rule:** Left-aligned headers must be balanced by a Right-aligned anchor offset by -10% viewport width.

### The "Halo" Disk
When a symbolic anchor (e.g., Shiva or Elephant) is used, it must be accompanied by a `sys-color-solidarity-gold` radial gradient "Halo" at Z-3.
- **Size:** 150% of asset width.
- **Blur:** 80px.
- **Opacity:** 10%.

---

**Registry Reference:** `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`
---

## 5. Decorative Shape Assets

Shape tokens used as decorative visual elements (not structural UI). All belong to **Substrate** archetype tier.

| Shape Token | CSS Variable | Use Case | Archetype Tier |
| :--- | :--- | :--- | :--- |
| `shape.blob01` | `--sys-shape-blob01` | Hero frame backgrounds, ambient animation masks | Substrate |
| `shape.blob02` | `--sys-shape-blob02` | Avatar mask frames, atmospheric background shapes | Substrate |
| `shape.megaphoneBase01` | `--sys-shape-megaphoneBase01` | Large hero canvas shapes, Megaphone backing frame | Core UI |
| `sentryAvatar` | `--sys-shape-sentryAvatar` | All user avatars (98%, never 50%) | Utility |
| `tornEdgeClipPath` | `--sys-shape-tornEdge` | Wheat-paste section breaks, poster bleeds | Decorative |

**Blob governance:**
- `shape.blob*` tokens are restricted to Substrate archetype and explicitly whitelisted contexts (avatar mask frames, hero canvases).
- Any Placard, Strike, Scaffold, or March component using `shape.blob*` is a compliance violation.

---

**Last Updated:** 2026-03-07
**Design System Version:** v6.1 (Shape System)
