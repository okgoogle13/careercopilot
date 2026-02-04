# Asset System

> Part of [Northcote Curio Design System](00-overview.md)

---

## Transformation Philosophy

Asset preparation is **Victorian specimen preparation**. We exaggerate radial symmetry, structural order, and material contrast to create "Anatomical Extremes."

1. **The Void**: Backgrounds are pure matte charcoal-black (#1A1714).
2. **The Lens**: Geometric Naturalism (Haeckelian spirals and symmetry).
3. **The Light**: Surgical Chiaroscuro (Single source, high contrast).

---

## Canonical Source of Truth

The **Primary Asset Registry** for all production tools and agents is:
👉 [northcote-curio-manifest.json](file:///Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json)

For detailed prompting logic and aesthetic compliance, refer to:
👉 [Asset Generation Prompting Strategy.md](file:///Users/okgoogle13/Desktop/careercopilot/Asset%20Generation%20Prompting%20Strategy.md)

---

## Master Asset Registry

### Phase 1: Foundation Assets

| Asset                                 | Category  | Mode    | Role       | Status     |
| :------------------------------------ | :-------- | :------ | :--------- | :--------- |
| **Asset 1: The Curio Wallpaper**      | `plate`   | Gallery | Background | ✅ Refined |
| **Asset 2: The Sentry Kookaburra**    | `fauna`   | Gallery | Mascot     | ✅ Refined |
| **Asset 3: Nocturnal Canopy Pattern** | `texture` | Gallery | Secondary  | ✅ Refined |

### Phase 2: Specimen Series (Anatomical Extremes)

| Asset                              | Category   | Mode    | Scale   | Status     |
| :--------------------------------- | :--------- | :------ | :------ | :--------- |
| **Asset 4: Wattle & Jewel Beetle** | `specimen` | Gallery | Medium  | ✅ Refined |
| **Asset 5: Eucalyptus & Echidna**  | `specimen` | Both    | Primary | ✅ Refined |
| **Asset 6: Deep Time Still Life**  | `plate`    | Gallery | Large   | ✅ Refined |
| **Asset 18: Banksia Pod**          | `specimen` | Gallery | Medium  | ✅ Refined |

### Phase 2b: Wunderkammer Attributes (New)

| Asset                          | Category   | Mode    | Subject         | Status     |
| :----------------------------- | :--------- | :------ | :-------------- | :--------- |
| **Asset 20: Grinding Stone**   | `specimen` | Gallery | Lithic Artifact | ✅ Refined |
| **Asset 21: Radiolaria Cage**  | `specimen` | Gallery | Micro-geometry  | ✅ Refined |
| **Asset 22: Starfish Fungus**  | `specimen` | Gallery | Aseroe Specimen | ✅ Refined |
| **Asset 23: Flying Fox Wing**  | `specimen` | Gallery | Anatomical Wing | ✅ Refined |
| **Asset 24: Brain Coral**      | `specimen` | Gallery | Platygyra       | ✅ Refined |
| **Asset 25: Sea Urchin Crown** | `specimen` | Gallery | Coelopleurus    | ✅ Refined |

### Phase 3: UI & Atmospheric (Pending)

| Asset                            | Category   | Priority | Status     | Specification                           |
| :------------------------------- | :--------- | :------- | :--------- | :-------------------------------------- |
| **Asset 7: Firefly Sprite**      | `ui`       | Medium   | 📝 Defined | `float-pulse` animation, 4s loop        |
| **Asset 8: Verification Mark**   | `ui`       | Medium   | 📝 Defined | Bounce ease, scale/rotate on success    |
| **Asset 9: Waratah Hero**        | `plate`    | High     | 📝 Defined | `luminosity` blend, macro detail        |
| **Asset 10: Banksia Spinner**    | `ui`       | Medium   | 🕒 Pending | _Requires definition_                   |
| **Asset 11: Lab Parchment**      | `texture`  | Critical | ✅ Refined | Tileable, matte paper structure         |
| **Asset 12: Lab Grid Major**     | `texture`  | Critical | 📝 Defined | SVG Pattern, 100px spacing              |
| **Asset 13: Lab Grid Minor**     | `texture`  | Medium   | 📝 Defined | SVG Pattern, 20px spacing               |
| **Asset 14: Skeleton Etching**   | `specimen` | Critical | 📝 Defined | Osteological accuracy, `multiply` blend |
| **Asset 15: Compass Rose**       | `ui`       | Critical | 📝 Defined | Rotation on focus/+15deg                |
| **Asset 16: Wattle Hanging**     | `specimen` | High     | 📝 Defined | Parallax 0.15x, sway                    |
| **Asset 17: Eucalyptus Ceiling** | `specimen` | Critical | 📝 Defined | Fixed top, 25vh, foreground blur        |
| **Asset 19: Eucalyptus Column**  | `specimen` | Critical | 📝 Defined | Vertical structural separator           |
