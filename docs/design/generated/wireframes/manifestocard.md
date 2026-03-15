# Wireframe: ManifestoCard

<layout>
+-----------------------------------------------------------+
|                                  [ Red Flag Accent ]      |
|                                                           |
|             "MANIFESTO TITLE"                             |
|             (Display Large, Solidarity Red)                  |
|                                                           |
|    "Body content text goes here. It should feel           |
|     like a declaration, not instructions."                |
|     (Body Large, Paper White 80%)                         |
|                                                           |
|       [ ACTION BUTTON (Pebble) ]                          |
|                                                           |
|                                                           |
|                                [ KERALA ELEPHANT ]        |
|                                [ ASYMMETRIC MOTIF ]       |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `radius-stone`, `shadow-viscous`
- **Title**: `text-display-lg`, `font-solidarity-800`, `text-solidarity-red`
- **Content**: `text-body-lg`, `font-direct-action-450`, `text-paper-white/80`
- **Button**: `bg-ink-gold`, `text-charcoal`, `radius-pebble`, `shadow-hover-rise`
</tokens>

<accessibility>
- **Role**: `article`
- **ARIA Label**: `Manifesto: {title}`
- **Focus Order**: Title -> Content -> Action Button
</accessibility>

<states>
- **Loading**: Pulse throb on the Ink Gold glow.
- **Empty**: Not applicable (manifesto must have content).
- **Error**: Solidarity Red border shake on invalid configuration.
</states>

<assets>
- **Accent**: `top-8 right-8`, 4px width, 48px height.
- **Motif**: `bottom-[-20%] right-[-10%]`, 192px size, `opacity-10`.
</assets>
