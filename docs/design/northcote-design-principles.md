# Northcote Curio Design Principles

## Core Philosophy: Victorian Anatomical Extremism

Northcote Curio is built on the collision of **Australian Endemic Specimens** and **Geometric Precision**. We reject the generic, the "cute," and the sepia-toned paths of traditional vintage design.

### 1. The Void (Atmosphere)

- **Primary Background**: `#1A1714` (Specimen Night).
- **Rule**: Backgrounds must feel like a theatrical void or a deep museum cabinet. Never use pure white, beige, or flat digital black (#000000) except for specific UI technical layers.
- **Translucency**: Assets should leverage alpha transparency to melt into "The Void," preserving detailed edges (watercolor bleeds, hair, spines).

### 2. The Specimen (Subject)

- **Authenticity**: All fauna and flora must be **geographically authentic to Australia**. (e.g., Banksia, Eucalyptus, Echidna, Kookaburra).
- **Anatomical Extremism**: Capture the intense, sometimes alien details of nature — skeletal structures, microscopic lattices, and sharp textures.
- **Motif Split**:
  - **Anatomical**: Skeletal, structural, biological (e.g., bone cages, wing articulations).
  - **Geometric**: Nature's mathematics (e.g., Fibonacci spirals in ferns/banksia, hexagonal lattices in radiolaria).

### 3. The Lens (Haeckelian Geometry)

- **Natural Math**: Every asset must demonstrate underlying order (radial symmetry, spiral growth patterns, hexagonal arrays).
- **Projection**: Prefer orthographic or precise isometric views over casual perspective.

### 4. Technical Specifications (Path B Standards)

#### Translucency Bands (Light Transmission)

Assets must implement true light transmission, not just glow effects.

- **Opaque (0% Transmission)**: Core specimen focus, cartilage ribs, midribs.
- **Translucent (40-60%)**: Frill-neck membranes, Eucalyptus leaves (reveals internal venation).
- **Diaphanous (60-80%)**: Huntsman spider molts (amber chitin showing internal shadows).

#### Scale Hierarchy (Focal Tiers)

To prevent visual flatness, maintain clear size ratios:

- **Primary (12-20cm)**: Hero elements (e.g., Waratah, Frill-neck display).
- **Secondary (8-12cm)**: Supporting geometry (e.g., Banksia cones, Echidna spine clusters).
- **Tertiary (2-8cm)**: Textural detail (e.g., Wattle spheres, Gum nuts, Fossils).

#### Density Zones (UI Safe Areas)

- **Zone 1 Central**: 60-80% density (The Wunderkammer core).
- **Zone 2 Upper-Left**: <20% density (UI Profile/Nav safe area).
- **Zone 3 Lower-Right**: <30% density (Widget/Action safe area).

#### Annotation Typography

- **Font**: Crimson Text Regular (Serif).
- **Size**: 10-12pt (proportional to 1792px width).
- **Color**: #F5F0E8 (Parchment) @ 85% opacity.
- **Format**: "Fig. [X]. [Scientific Name] ([Common Name])"
