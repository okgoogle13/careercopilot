# Wireframe: LoginCard

<layout>
+-----------------------------------------------------------+
|                                                           |
|             "VERIFY IDENTITY"                             |
|             (Display Large, Recursive)                    |
|                                                           |
|      [ EMAIL ADDRESS (JetBrains Mono) ]                   |
|      |                                |                   |
|      +--------------------------------+                   |
|                                                           |
|      [ PASSWORD (JetBrains Mono)      ]                   |
|      |                                |                   |
|      +--------------------------------+                   |
|                                                           |
|              [ ENTER ARCHIVE ]                            |
|              (Subhead, Inter 24px)                        |
|                                                           |
|          "Create Collective ID" (Inter 16px)              |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `radius-stone`, `w-[480px]`
- **Title**: `text-display-lg`, `font-recursive-800`
- **Inputs**: `bg-charcoal`, `border-blueprint-grey`, `radius-slab`
- **Button**: `bg-baru-gold`, `text-charcoal`, `radius-pebble`
</tokens>

<accessibility>
- **Role**: `form`
- **ARIA Label**: `Verification Gateway`
- **Focus Order**: Email Input -> Password Input -> Submit Button -> Register Link
</accessibility>

<states>
- **Loading**: Wattle Gold glow pulse behind the card.
- **Empty**: Fields highlighted with Smoke Green hint.
- **Error**: Waratah Red border shake; voice: "LET'S TRY AGAIN".
</states>

<assets>
- **Backwash**: `{kr-asset-halo-disk}` at 60% opacity, Z-1.
- **Substrate**: `{kr-asset-screenprint-substrate}` at 15% opacity, Z-0.
</assets>
