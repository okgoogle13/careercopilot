# SolidarityCard Hi-Fi Checklist & Notes

This document tracks the transition of `SolidarityCard` from a functional Lo-Fi component to a polished Kerala Rage asset.

## 🏗️ Technical Specification

### Typography
- **Headings:** Use **Fraunces Energetic** for high-impact titles within the card.
- **Body:** Use **Work Sans (Field Note)** with a slightly tracked-out letter spacing (`tracking-tight` for large blocks, `tracking-wide` for labels).
- **Meta/Data:** **JetBrains Mono (Annotation)** at 10-12px for technical metadata.

### Color Mapping (Tones)
| Tone | Background | Border | Accent |
| :--- | :--- | :--- | :--- |
| `neutral` | `asphalt-black` | `white/5` | `ink-gold` (focus) |
| `success` | `asphalt-black` | `solidarity-green/20` | `solidarity-green` |
| `danger` | `asphalt-black` | `solidarity-red/20` | `solidarity-red` |

### Motion
- Ensure hover Lift does not conflict with surrounding elements in high-density grids.
- If used in a `KanbanBoard`, set `layout` prop to `true` to ensure smooth reordering transitions.

### 🎨 Motif & Texture
- **Texture:** The `screenprint-grit` asset should be applied as an absolute overlay at `opacity-15` (Solidarity Mode).
- **Interaction:** On hover, the grit texture opacity can subtly increase (`+5%`) to mimic physical interaction with the page.

## 🚀 Assembly Checklist
- [ ] Verify `tong` prop maps correctly to semantic color families.
- [ ] Verify `density` scale scales padding and internal gap systems.
- [ ] Audit contrast ratio for all variant/tone combinations (Target: WCAG AA).
- [ ] Test layout reordering animations in parent containers.
