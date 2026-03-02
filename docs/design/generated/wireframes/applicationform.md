# Wireframe: ApplicationForm

<layout>
"DEPOSIT HISTORY" (Display, 72px, Ink Gold)
+-----------------------------------------------------------+
|                                                           |
|      +-------------------------------------------+        |
|      |                                           |        |
|      |         DROP PDF HERE FOR ANALYSIS        |        |
|      |           (JetBrains Mono, 12px)          |        |
|      |                                           |        |
|      |           [ CHOOSE FILE ]                 |        |
|      |                                           |        |
|      +-------------------------------------------+        |
|                                                           |
|   "History Verified. Integrity confirmed." (Inter, 24px)   |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `w-full`, `max-w-3xl`
- **DropZone**: `bg-charcoal`, `border-dashed`, `border-blueprint-grey`, `radius-slab`
- **SuccessText**: `text-ink-gold`, `font-solidarity-500`
- **Watermark**: `{kr-asset-blueprint-layout}` at 6% opacity.
</tokens>

<accessibility>
- **Role**: `form`, `region` (drag-and-drop)
- **ARIA Label**: `Document Deposition`
- **Focus Order**: DropZone -> Choose File Button -> Submit (if present)
</accessibility>

<states>
- **Loading**: Blueprint watermark opacity fades 6% -> 12% in-flight.
- **Empty**: Initial state shows drop instructions.
- **Error**: Border shifts to Solidarity Red; shake animation.
</states>

<assets>
- **Stamp**: `{kr-asset-verification-stamp}` appears on success.
- **Substrate**: `{kr-asset-charcoal-paper}` at Z-0.
</assets>