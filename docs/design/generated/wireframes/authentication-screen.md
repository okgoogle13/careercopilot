# Wireframe: Authentication (Screen)

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

<annotations>
1 | hero_title        | Content: max-chars: 80; Style: display-heading; State: default.
2 | btn_primary_cta   | Action: onClick → POST /api/apply, then nav → /application/success; State: default, loading, error.
3 | job_search_input  | Input: type=text; max-chars: 60; Validation: non-empty; State: default, focused, error.
4 | job_list_item     | Data: bound to jobs[]; Layout: 1-line title, 1-line org/location; Truncate: ellipsis on overflow.
5 | toast_error       | State: visible when form submit fails; Content: "Something went wrong"; Auto-hide: 6s; Role: status.
6 | layout_grid       | Breakpoints: mobile=1col, tablet=2col, desktop=3col; Gutter: 16px.
7 | form_apply        | System: onSubmit → POST /api/applications; Retry: 3x on 5xx.
</annotations>

<notes>
- Flow: primary path is “Read manifesto → Search jobs → Apply”.
- Edge cases: empty job list state, offline banner.
</notes>
