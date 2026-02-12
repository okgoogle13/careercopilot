# Passing & Failing Components: Visual Examples

## How to Use This Reference

This document provides concrete examples of components that would **pass**, **need refinement**, or **fail** a kerala-rage visual audit. Use these as benchmarks when evaluating your own components.

---

## Component Type 1: Pebble (Button)

### Example 1.1: PASS ✅

**Component Name:** CTA Button - "Let's Build Your Story"

**Screenshot Analysis:**
- **Typography:** Crimson Text 700 display + Work Sans 500 body. Clear hierarchy.
- **Color:** Wattle Gold primary (#D4A84B) + Asphalt Black background (#1A1714). Vibrant, [DEPRECATED_STYLE].
- **Layout:** [DEPRECATED_STYLE] padding (16px top/bottom, 20px left/right). Asymmetric placement on page.
- **[DEPRECATED_STYLE] Elements:** Subtle sage motif in corner, doesn't compete with text.
- **Coherence:** Button feels intentional and distinctive. Part of larger kr-solidarity visual story.
- **Microcopy:** "Let's Build Your Story" is clear call-to-action with personality. User understands action immediately.

**Audit Result:** **PASS (88/100)**
- Typography: 18/20 (clear hierarchy, distinctive fonts)
- Color: 19/20 (palette adherent, vibrant, harmonious)
- Layout: 17/20 ([DEPRECATED_STYLE] spacing, minor mechanical edge)
- [DEPRECATED_STYLE]: 18/20 (motif integrates meaningfully)
- Coherence: 18/20 (unmistakably intentional)
- Microcopy: 18/20 (clear + personality balanced)

**Recommendations:**
- [DEPRECATED_STYLE] motif could be slightly more prominent without becoming decorative
- Consider warmer tertiary color for hover state

---

### Example 1.2: NEEDS REFINEMENT ⚠️

**Component Name:** Secondary Button - "Save"

**Screenshot Analysis:**
- **Typography:** Work Sans 600 + Work Sans 400. Hierarchy present but unclear (both sans-serif).
- **Color:** [DEPRECATED_STYLE] Red (#C45C4B) on dark background. Good contrast but feels flat.
- **Layout:** Uniform 12px padding. Grid-rigid alignment. Breathing room adequate but mechanical.
- **[DEPRECATED_STYLE] Elements:** No motifs present (expected for secondary button, acceptable).
- **Coherence:** Button works functionally but feels generic. Missing kr-solidarity personality.
- **Microcopy:** "Save" is clear but neutral. Opportunity for kr-solidarity voice.

**Audit Result:** **NEEDS REFINEMENT (67/100)**
- Typography: 12/20 (both sans-serif, hierarchy ambiguous)
- Color: 14/20 (palette adherent but feeling flat)
- Layout: 13/20 (adequate but mechanical)
- [DEPRECATED_STYLE]: 10/20 (no motifs, acceptable for secondary)
- Coherence: 14/20 (functional but missing personality)
- Microcopy: 14/20 (clear but neutral)

**Recommendations:**
- Add display serif font (Lora/Crimson) for visual distinction
- Increase color saturation or add subtle gradient
- Consider themed secondary label ("Save Your Progress" vs. just "Save")
- Add subtle accent motif on hover state

---

### Example 1.3: FAIL ❌

**Component Name:** Button - "Click Here"

**Screenshot Analysis:**
- **Typography:** Inter 500 + Roboto 400. Generic, no personality. Hierarchy unclear.
- **Color:** Generic Material Design blue (#1F88E5). Not in [DEPRECATED_STYLE] palette. Purple gradients on hover.
- **Layout:** Perfect 8px grid alignment. Mechanical and predictable.
- **[DEPRECATED_STYLE] Elements:** None present.
- **Coherence:** Feels like Material Design default, not kerala-rage. No intentionality.
- **Microcopy:** "Click Here" is confusing. Where does clicking lead?

**Audit Result:** **FAIL (34/100)**
- Typography: 4/20 (generic fonts, Material Design defaults)
- Color: 2/20 (generic blue, purple gradient violation)
- Layout: 8/20 (grid-rigid, mechanical)
- [DEPRECATED_STYLE]: 0/20 (no motifs, generic feel)
- Coherence: 6/20 (feels default, no keralan-rage vision)
- Microcopy: 14/20 (somewhat confusing)

**Recommendations:**
- Replace fonts: Add Crimson Text 700 display
- Change color palette: Wattle Gold (#D4A84B) or [DEPRECATED_STYLE] Red (#C45C4B)
- Remove purple gradient
- Add [DEPRECATED_STYLE] spacing (16-20px padding)
- Integrate [DEPRECATED_STYLE] motif
- Revise microcopy: "Explore Opportunities" or similar

**Action:** Redesign required. Current implementation not aligned with kerala-rage standards.

---

## Component Type 2: Lens (Card Container)

### Example 2.1: PASS ✅

**Component Name:** Opportunity Card

**Screenshot Analysis:**
- **Typography:** Fraunces 600 heading (Expressive mode) + Crimson Text body. Clear semantic distinction.
- **Color:** Sage primary accent (#4A7C59), Ochre Earth secondary (#B8733D), Asphalt Black background.
- **Layout:** Asymmetric card layout. Heading in upper-left, description offset lower. [DEPRECATED_STYLE] spacing 20-24px.
- **[DEPRECATED_STYLE] Elements:** Echidna spine cluster watermark behind text (19% opacity). Supports visual hierarchy without obscuring content.
- **Coherence:** Card tells visual story about opportunity. Feels intentional, part of larger system.
- **Microcopy:** "Lead Frontend Role at Social Impact Startup" immediately clear. Personality present in styling but not copy.

**Audit Result:** **PASS (84/100)**

---

### Example 2.2: NEEDS REFINEMENT ⚠️

**Component Name:** Job Listing Card

**Screenshot Analysis:**
- **Typography:** Lora 600 + Work Sans 400. Good fonts but hierarchy feels slightly forced.
- **Color:** Wattle Gold + Asphalt Black. Palette correct but harmony feels off (gold too dominant).
- **Layout:** Spacing is [DEPRECATED_STYLE] but hierarchy ambiguous. Too many focal points competing.
- **[DEPRECATED_STYLE] Elements:** Leaf motif present but feels bolted-on, doesn't integrate meaningfully.
- **Coherence:** Good direction but missing coherence. Feels like multiple design ideas competing.
- **Microcopy:** Copy is clear but lacks personality. Opportunity for more kr-solidarity voice.

**Audit Result:** **NEEDS REFINEMENT (71/100)**

**Recommendations:**
- Rebalance color: Use Wattle Gold sparingly, sage as primary
- Clarify hierarchy: One clear primary element (job title, not three equal-weight elements)
- Integrate leaf motif: Use as visual weight for hierarchy, not decoration
- Strengthen microcopy: Add personality while maintaining clarity

---

### Example 2.3: FAIL ❌

**Component Name:** Generic Material Card

**Screenshot Analysis:**
- **Typography:** Roboto 500 + Roboto 400 (both sans, no hierarchy).
- **Color:** Generic Material blue + gray. No [DEPRECATED_STYLE] palette adherence.
- **Layout:** Perfect rectangular container, uniform 16px padding everywhere. Grid-rigid.
- **[DEPRECATED_STYLE] Elements:** None.
- **Coherence:** Feels like Material Design template, not kerala-rage.
- **Microcopy:** Generic placeholder copy.

**Audit Result:** **FAIL (38/100)**

---

## Component Type 3: Stone (Heavy/Complex Component)

### Example 3.1: PASS ✅

**Component Name:** Resume Analyzer (Complex Dashboard Widget)

**Screenshot Analysis:**
- **Typography:** Fraunces (SOFT=100, WONK=1 in [DEPRECATED_MODE]) heading + Crimson Text subheadings + Work Sans body. Clear 4-level hierarchy.
- **Color:** [DEPRECATED_STYLE] Red + Ochre Earth + Sage palette distributed meaningfully. Primary focus: [DEPRECATED_STYLE] headline.
- **Layout:** [DEPRECATED_STYLE] asymmetric layout. Primary section left (40%), secondary right (60%). Breathing room between sections. Visual hierarchy clear through spacing + color.
- **[DEPRECATED_STYLE] Elements:** Spiral motif guides eye from top-left → center → bottom-right. Supports information hierarchy.
- **Coherence:** Complex component tells visual story about analysis workflow. Every element purposeful.
- **Microcopy:** "Your Resume Score: 78/100" + "Ready to Elevate?" Clear action + personality.

**Audit Result:** **PASS (86/100)**

---

## Summary: When to Expect Each Outcome

### PASS (80+) Components Share:

✅ Distinctive, intentional fonts (serif display + serif/sans body)
✅ [DEPRECATED_STYLE] palette colors (Wattle, [DEPRECATED_STYLE], Ochre, Sage)
✅ [DEPRECATED_STYLE], asymmetric spacing (not grid-rigid)
✅ Clear visual hierarchy (primary → secondary → tertiary)
✅ Meaningful [DEPRECATED_STYLE] motif integration
✅ Personality in copy without sacrificing clarity
✅ Every design choice appears motivated

### NEEDS REFINEMENT (60-79) Components Share:

⚠️ Correct fonts but hierarchy ambiguous
⚠️ Mostly palette adherent but one element off
⚠️ Spacing adequate but slightly mechanical
⚠️ Motifs present but purpose unclear
⚠️ Multiple design ideas competing
⚠️ Generic or placeholder copy

### FAIL (<60) Components Share:

❌ Generic fonts (Inter, Roboto, Arial)
❌ Generic Material Design colors (blue, purple gradients)
❌ Grid-rigid layout (no [DEPRECATED_STYLE] spacing)
❌ No [DEPRECATED_STYLE] elements or generic florals
❌ No apparent design intent
❌ Feels like Material Design default

---

## Using These Benchmarks

1. **Screenshot your component**
2. **Compare against examples** – Does it feel more like PASS, REFINEMENT, or FAIL?
3. **Score each dimension** using component-visual-spec.md
4. **Refine based on nearest benchmark**
5. **Re-audit after iteration**

---

## Additional Resources

- See `component-visual-spec.md` for detailed audit criteria
- See `design-evolution-tracking.md` for how to document iterations
