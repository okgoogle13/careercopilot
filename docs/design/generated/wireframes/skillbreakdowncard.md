# Wireframe: SkillBreakdownCard

<layout>
"THE AUDIT MICROSCOPE" (Subhead, 24px)
+-----------------------------------------------------------+
|                                                           |
|     (HALO DISK)           "88% SOLIDARITY SCORE"          |
|     [Score Gauge]         (Display Large, Ink Gold)      |
|                                                           |
|     +-----------------------------------------------+     |
|     |  TECH PROFICIENCY: 92% (Mono, 12px)           |     |
|     |  [==============-----------------]            |     |
|     +-----------------------------------------------+     |
|                                                           |
|     +-----------------------------------------------+     |
|     |  CULTURAL LITERACY: 84%                       |     |
|     +-----------------------------------------------+     |
|                                                           |
|  [ ACTION: STRENGTHEN ] [ ACTION: ARCHIVE ]               |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `radius-stone`, `p-8`
- **Gauge**: `accent-ink-gold`, `shadow-glow-ink`
- **Text**: `text-paper-white`, `font-jetbrains-mono` for data.
- **Grid**: `{kr-asset-blueprint-grid}` at 8% opacity.
</tokens>

<accessibility>
- **Role**: `region`
- **ARIA Label**: `Skill Breakdown Analysis`
- **Focus Order**: Main Score -> Category 1 -> Category 2 -> Actions
</accessibility>

<states>
- **Loading**: Gauge spinning/looping with Ink Gold trail.
- **Empty**: Skeleton grid with "AWAITING INGESTION" label.
- **Error**: "Audit Integrity Failure" in Solidarity Red with shake.
</states>

<assets>
- **Blueprint**: `{kr-asset-blueprint-grid}` (Z-1) full container width.
- **Halo**: `{kr-asset-halo-disk}` (Z-2) behind the main score.
</assets>