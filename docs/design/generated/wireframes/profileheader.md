# Wireframe: ProfileHeader

<layout>
+-----------------------------------------------------------+
|                                                           |
|    [ PORTRAIT / AVATAR ]      "USER NAME"                 |
|    (Radius-Stone, Overlay)    (Display Large, Ink Gold)  |
|                                                           |
|    "MIGRANT | WORKER | STORYTELLER"                       |
|    (Subhead, signalGreen)                                 |
|                                                           |
|    [ TAG: TECH ] [ TAG: ACTIVIST ] [ TAG: KERALA ]        |
|                                                           |
|    "Land Acknowledgment: Wurundjeri Country" (Small)      |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `p-12`, `border-b`, `border-blueprint-grey`
- **Name**: `text-display-lg`, `font-solidarity-900`, `text-ink-gold`
- **Bio**: `text-subhead`, `text-signal-green`, `italic`
- **Portrait**: `radius-stone`, `grayscale`, `opacity-90`
</tokens>

<accessibility>
- **Role**: `header`
- **ARIA Label**: `User Profile Identity`
- **Focus Order**: Avatar -> User Name -> Bio -> Identity Tags
</accessibility>

<states>
- **Loading**: User name as a skeleton Ink pulse.
- **Empty**: Default stencil avatar with "IDENTITY UNVERIFIED".
- **Error**: "Identity Fragmentation detected" in Solidarity Red.
</states>

<assets>
- **Texture**: `{kr-asset-screenprint-grit}` at 20% opacity over the avatar.
- **Solidarity**: "Wurundjeri Woi-wurrung Country" in the corner (wght 300, 12px).
</assets>
