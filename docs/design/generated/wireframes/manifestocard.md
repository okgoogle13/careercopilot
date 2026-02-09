# Wireframe: ManifestoCard

<layout>
```text
+---------------------------------------+
|                                       |
|  [ ELEPHANT MOTIF ASYMMETRIC BG ]     |
|                                       |
|  MANIFESTO TITLE IN DISPLAY BLACK     |
|  ----------------------------------   |
|                                       |
|  "Our land, our labor, our future.    |
|   The backwaters of Kerala meet the   |
|   concrete of Naarm in defiance."     |
|                                       |
|  +---------------------------------+  |
|  |     [ TAKE ACTION BUTTON ]      |  |
|  +---------------------------------+  |
|                                       |
+---------------------------------------+
```
</layout>

<tokens>
- **Container**: `surface-charcoal`, `shadow-viscous`, `clip-path-tear`.
- **Title**: `Hero-144px`, `Solidarity-800`, `Waratah-Red`.
- **Body**: `Body-16px`, `Direct-Action-450`, `On-Surface-Ash`.
- **Button**: `Baru-Gold-Surface`, `On-Gold-Charcoal`, `shadow-hover-rise`.
- **Background Motif**: `Elephant-Icon`, `Desaturated-Gold`, `10% opacity`.
</tokens>

<accessibility>
- **Focus Order**: 
    1. Title (ARIA-heading)
    2. Body Text (ARIA-article)
    3. Take Action Button (Focusable)
- **Landmarks**: `section`, `article`.
- **ARIA Labels**: 
    - Container: `aria-label="Manifesto Declaration"`
    - Button: `aria-label="Commit to Solidarity"`
</accessibility>

<states>
- **Loading**: Title text pulses with `Wattle-Gold` glow.
- **Success**: Card background flashes `Baru-Gold`, button displays "STRENGTH RISING".
- **Error**: Card shakes horizontally, border becomes `Waratah-Red` stroke.
</states>

<assets>
- **Kerala Elephant**: Bottom-right aligned, 15% overlap with border, Z-index: 1 (behind text).
- **Torn Edge Polygon**: Irregular 42-point clip-path applied to container.
</assets>