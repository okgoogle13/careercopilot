# Figma Inspect Panel Guide

When generating code, expect the user to paste CSS properties.
Pay close attention to:

- `width`, `height`
- `padding`, `margin`
- `background-color`, `color`
- `font-family`, `font-size`, `font-weight`
- `border`, `border-radius`
- `display: flex`, `flex-direction`, `align-items`, `justify-content`

Translate these CSS properties into a `.module.css` file and create corresponding JSX structure.
Translate Figma component properties/variants into React props in the `interface ...Props`.
