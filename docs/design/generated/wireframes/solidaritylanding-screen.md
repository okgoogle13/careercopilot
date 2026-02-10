# Screen: SolidarityLanding

<layout>
+------------------------------------------+
| [ Header / Nav ]                         |
+------------------------------------------+
|                                          |
|  [ Hero / Manifesto ]                    |
|                                          |
+------------------------------------------+
|                                          |
|  [ Content / Cards ]                     |
|                                          |
+------------------------------------------+
| [ Footer ]                               |
+------------------------------------------+
</layout>

<tokens>
- header: surface-container-low
- hero: tertiary-fixed-dim
- cards: surface-container
</tokens>

<assets>
- hero-motif: elephant-dots-kookaburra
- background: rough-concrete-texture
</assets>

<components>
- ManifestoCard (Role: Hero Content, needs: icon-dots)
- SkillBreakdownCard (Role: Data Viz, needs: botanical-motif)
</components>
