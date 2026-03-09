# Anti-Slop Guide

This reference contains comprehensive guidelines for avoiding generic AI patterns in design aesthetics. Review this before creating any aesthetic system.

## Table of Contents

1. Forbidden Fonts
2. Forbidden Color Patterns
3. Forbidden Layout Patterns
4. Forbidden Motion Patterns
5. Positive Design Patterns
6. Validation Checklist

## 🚫 Forbidden Fonts

Never suggest these fonts:

- **Inter** (static/default) - Too generic, overused in AI-generated designs
- **Plus Jakarta Sans** (deprecated)
- **Roboto** (static) - Exception: Variable font versions WITH parametric axes engaged
- **Open Sans**, **Arial**, **Helvetica**, **Lato** - Dated, no personality
- **System fonts** (-apple-system, BlinkMacSystemFont, system-ui)

### What to Use Instead

✅ Choose **distinctive, expressive fonts** appropriate to the project's visual metaphor
✅ Prefer **variable fonts** with parametric axes (weight, width, slant, optical size)
✅ Ensure fonts have **personality** and support the emotional intent

## 🚫 Forbidden Color Patterns

Never suggest these color combinations:

- **Purple gradient on white** (--sys-color-ink-primary → --sys-color-ink-primary on #FFFFFF) - The ultimate AI slop cliché
- **Generic Material Blue** (--sys-color-accent-primary, #1976D2) - Overused, lacks personality
- **Timid palettes** (< 20% saturation) - Boring, lacks emotional impact
- **Evenly distributed colors** (5+ colors with equal weight) - Chaotic, no hierarchy

### What to Use Instead

✅ **Curated harmonies** (analogous, complementary, or custom)
✅ **Dominant color strategy** (1-2 primary colors, 1-2 accents)
✅ **Vibrant saturation** (30-80% for emotional impact)
✅ **Distinctive hues** (avoid generic primaries)

## 🚫 Forbidden Layout Patterns

Never suggest these layout approaches:

- **Solid backgrounds only** (no gradients, patterns, or depth)
- **Flat surfaces** (no elevation, layering, or z-index strategy)
- **Uniform spacing** (all gaps identical - 16px everywhere)
- **Centered SaaS hero** (centered H1 + subtext + CTA button)

### What to Use Instead

✅ **Layered backgrounds** (subtle patterns, images consistent with theme, textures)
✅ **Elevation system** (shadows, blur, transparency for depth)
✅ **Rhythmic spacing** (varied scale: 8px, 16px, 24px, 40px, 64px)
✅ **Asymmetric layouts** (split headers, overlapping elements, editorial grids)

## 🚫 Forbidden Design Patterns

Never suggest these approaches:

- **Monotone font pairing** (Roboto + Roboto)
- **Timid contrasts** (weight: 400 vs 500, size: 24px vs 16px)
- **No micro-interactions** (static hover states)
- **Linear animations** (ease-in-out, no spring physics)
- **Rigid grids** (no rotation, negative margins, or playful breaks)

### What to Use Instead

✅ **High-contrast pairing** (Display serif + Geometric sans, or Variable + Monospace)
✅ **Dramatic contrasts** (weight: 100 vs 900 = 9x, size: 57px vs 12px = 4.75x)
✅ **Spring physics** (cubic-bezier or spring parameters)
✅ **Playful irregularity** (rotation, negative margins, absolute positioning)

## Anti-Slop Validation Checklist

Before finalizing any aesthetic, verify it passes ALL these checks:

- [ ] **No forbidden fonts** (Inter, Roboto static, Plus Jakarta Sans, system fonts)
- [ ] **Parametric axes specified** (if using Roboto Flex or other variable fonts)
- [ ] **High-contrast font pairing** (display ≠ body family)
- [ ] **No purple gradients on white** or generic Material Blue
- [ ] **Vibrant saturation** (≥ 30% average)
- [ ] **Dominant color strategy** (not evenly distributed)
- [ ] **Layered backgrounds** (gradients, patterns, or depth effects)
- [ ] **Elevation system defined** (shadows, blur, transparency)
- [ ] **Varied spacing rhythm** (not uniform 16px everywhere)
- [ ] **Asymmetric elements** (rotation, negative margins, or playful breaks)
- [ ] **Spring physics specified** (no linear easing)
- [ ] **Hover states defined** (for all interactive elements)
- [ ] **Dramatic contrasts** (weight ≥ 3x, size ≥ 3x)

If any item is unchecked, revise the aesthetic to meet requirements.

## Why Anti-Slop Matters

Generic AI-generated designs are instantly recognizable and forgettable. They:
- Lack emotional resonance and personality
- Feel sterile and corporate
- Don't differentiate the product
- Signal low effort and generic thinking

Expressive, distinctive designs:
- Create memorable experiences
- Communicate brand personality
- Stand out in crowded markets
- Show intentionality and craft
