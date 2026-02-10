# Wireframe: JobSearchFlow (Screen)

<layout>
```text
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
```
</layout>

<tokens>
- **Container**: `surface-charcoal`, `shadow-viscous`
- **HeroTitle**: `Hero-144px`, `Solidarity-800`, `Waratah-Red`
- **Body**: `Body-16px`, `Direct-Action-450`, `On-Surface-Ash`
- **PrimaryAction**: `Baru-Gold-Surface`, `shadow-hover-rise`
</tokens>

<assets>
- Hero motif: `Elephant-Motif`, 1x, top-right, 20% opacity.
- Background texture: `Torn-Edge-Texture`, full-width, bottom.
- Icon set: `Solidarity-Icon-Pack` (filter, sort, bookmark).
</assets>

<components>
- ManifestoCard (card)
  - Used: hero manifesto section.
  - Assets: background motif (elephant), torn edge.
- SkillBreakdownCard (card)
  - Used: data visualization section.
  - Assets: botanical-motif.
</components>

<notes>
- Flow: primary path is “Read manifesto → Search jobs → Apply”.
- Edge cases: empty job list state, offline banner.
</notes>
