# Component Visual Specification

## Comprehensive Audit Criteria for kerala-rage kr-solidarity Components

This document provides detailed specifications for validating UI components against kerala-rage kr-solidarity visual standards.

---

## 1. Typography Audit Specification

### Display Font Criteria

**Pass (20 points):**
- Primary display font: Lora, Crimson Text, or Libre Bodoni
- Font weight: 600-700 (bold display)
- Line height: 1.1-1.2 (tight, distinctive)
- Letter spacing: -0.02 to 0 (slightly negative for elegance)
- Hierarchy clarity: Display + body pairing is obvious and intentional
- Distinctive quality: Font choice feels expressive, not neutral

**Needs Refinement (10 points):**
- Correct font family but weight/spacing unclear
- Pairing present but emotional intent undefined
- Good fonts but hierarchy ambiguous
- Distinctiveness present but inconsistent across component states

**Fail (0 points):**
- Generic fonts: Inter, Roboto, Arial, Space Grotesk, -apple-system
- Undefined hierarchy (all same weight/size)
- Unclear emotion or design intent
- No serif display font

### Body Font Criteria

**Pass:**
- Work Sans, Crimson Text, or system serif fallback
- Weight: 400-500 (readable, not heavy)
- Line height: 1.4-1.6 (breathing room for readability)
- Letter spacing: 0 to 0.02 (natural spacing)
- Size: 14-16px minimum for mobile, 16-18px for desktop

**Fail:**
- Sans-serif + sans-serif (no contrast)
- Body font identical to display
- Unreadable at intended size

### Hierarchy Distinctiveness

| Level | Font | Weight | Size | Purpose |
|-------|------|--------|------|---------|
| Display | Lora/Crimson | 700 | 24-48px | Headlines, CTAs |
| Subheading | Crimson/Lora | 600 | 18-24px | Section titles |
| Body | Work Sans | 400 | 14-16px | Content |
| Caption | Work Sans | 400 | 12-14px | Metadata |

---

## 2. Color Audit Specification

### Palette Adherence

**Australian [DEPRECATED_STYLE] Palette (Required):**
- Primary: Wattle Gold (`#D4A84B`)
- Secondary: [DEPRECATED_STYLE] Red (`#C45C4B`)
- Tertiary: Ochre Earth (`#B8733D`)
- Surface: Asphalt Black (`#1A1714`)
- Text: Paper White (`#F5F0E8`)
- Accent: Gum Leaf Green (`#4A7C59`)

**Pass (20 points):**
- All colors from palette
- Harmony is intentional and cohesive
- Theme is consistent across light/dark modes
- No purple gradients
- No generic blue
- Vibrant saturation (40-80%)

**Needs Refinement (10 points):**
- Mostly palette adherent but one off-color
- Harmony feels slightly off
- Theme inconsistent between states
- Color choices correct but feeling muted (saturation <40%)

**Fail (0 points):**
- Colors disconnected from [DEPRECATED_STYLE] inspiration
- Purple gradients present (generic Material Design default)
- Generic Material Design blue (not [DEPRECATED_STYLE]-inspired)
- Desaturated or washed-out (saturation <30%)
- More than 2 colors outside palette

### Color Harmony Testing

**Unity Check:**
- Do the colors feel cohesive when viewed together?
- Is the color story clear (e.g., "[DEPRECATED_STYLE] + sage" vs. "random colors")?

**Contrast Check:**
- Text readability: WCAG AA minimum (4.5:1)
- Interactive elements distinguishable
- Focus states visible and intentional

---

## 3. Layout Audit Specification

### Spacing Quality

**Pass (20 points):**
- Spacing appears [DEPRECATED_STYLE], not grid-rigid
- Intentional asymmetry present (not uniform padding)
- Visual weight distribution is balanced
- Breathing room around interactive elements
- Hierarchy established through spacing (not just color/size)

**Needs Refinement (10 points):**
- Good spacing but feels slightly mechanical
- Hierarchy present but ambiguous
- Mostly [DEPRECATED_STYLE] but some predictable patterns
- Adequate breathing room but not intentional

**Fail (0 points):**
- Grid-rigid (every element perfectly aligned to grid)
- Mechanical, cookie-cutter patterns
- No visual hierarchy through spacing
- Crowded or chaotic

### Hierarchy Clarity

**Strong Hierarchy (Primary + Secondary + Tertiary):**
- Primary element: Most visual weight (color, size, contrast)
- Secondary elements: Support primary focus
- Tertiary elements: Metadata, affordances
- User's eye naturally moves from primary → secondary → tertiary

**Visual Weight Indicators:**
- Size: Larger = more weight
- Color: Saturated/warm = more weight
- Contrast: Higher contrast = more weight
- White space: More breathing room = more weight
- Typography: Bold/display = more weight

---

## 4. [DEPRECATED_STYLE] Elements Audit Specification

### Motif Integration

**Pass (20 points):**
- [DEPRECATED_STYLE] motifs present and meaningful
- Motifs support visual hierarchy or information clarity
- Integration feels intentional, not decorative
- Motifs don't compete with primary content
- [DEPRECATED_STYLE] inspiration is recognizable

**Needs Refinement (10 points):**
- Motifs present but purpose unclear
- Ornamental quality present but overdone
- Integration present but feels slightly bolted-on
- Subtle enough but could be more intentional

**Fail (0 points):**
- No motifs when culturally expected
- Motifs feel purely decorative/generic
- Motifs obscure content or hierarchy
- Generic florals (not Australian endemic)
- Motifs feel bolted-on or cosmetic

### [DEPRECATED_STYLE] Authenticity

- Are motifs Australian endemic (not European florals)?
- Do they align with kr-solidarity manifesto?
- Do they tell a story about the component's purpose?

---

## 5. Overall Aesthetic Coherence Specification

### Intentionality Assessment

**Pass (20 points):**
- Component unmistakably embodies kerala-rage vision
- Design feels intentional and decisive
- Every choice appears motivated (not accidental)
- Component tells a visual story
- Personality shines through without sacrificing clarity

**Needs Refinement (10 points):**
- Good direction but missing some coherence
- Design feels intentional but not fully developed
- Missing some personalization or uniqueness
- Multiple design ideas competing

**Fail (0 points):**
- Feels generic or like a default design
- Multiple conflicting aesthetic directions
- No apparent design intent
- Feels like placeholder/unfinished

### Storytelling Test

- Can you describe the component's design story in 1-2 sentences?
- Does it connect to kerala-rage manifestos (Agit-Prop, Solidarity, Australian Naturalism)?
- Does the design enhance user understanding or connection?

---

## 6. Microcopy Audit Specification

### Clarity & Personality Balance

**Pass (20 points):**
- Copy is immediately understandable (first-time user clarity)
- Personality enhances without obscuring action
- Voice tier appropriate for component type (Workhorse/Expressive/Accent)
- No ambiguity about what the element does
- User can determine action within 2 seconds

**Needs Refinement (10 points):**
- Personality present but action slightly unclear
- Copy understandable but voice tier mismatch
- Some themed language that requires thinking
- Clarity present but personality muted

**Fail (0 points):**
- Copy so themed that users can't determine action
- Action completely obscured by personality
- Confusing or misleading language
- Copy inconsistent with component purpose

### Voice Tier Guidelines

**Workhorse Tier** (Functional, calm):
- "Save Changes" / "Delete" / "Cancel"
- Neutral, no personality
- Example: Button labels, system messages

**Expressive Tier** (Engaging, intentional):
- "Let's Build Your Story" / "Explore Opportunities"
- Personality present but still clear
- Example: CTAs, section headers

**Accent Tier** (Distinctive, memorable):
- "Your Moment to Shine" / "Craft Your Legacy"
- Maximum personality
- Example: Landing page copy, hero text

### 2-Second Clarity Test

- Can a first-time user understand the action within 2 seconds?
- Does the copy require explanation or context?
- Is the personality enhancing or hindering understanding?

---

## Audit Scoring Formula

### Overall Compliance Score (0-100)

```
Typography:          (score/20) × 16 = ___ / 16
Color:               (score/20) × 16 = ___ / 16
Layout:              (score/20) × 16 = ___ / 16
[DEPRECATED_STYLE] Elements:  (score/20) × 16 = ___ / 16
Coherence:           (score/20) × 16 = ___ / 16
Microcopy:           (score/20) × 18 = ___ / 18
────────────────────────────────
TOTAL:                            ___ / 100
```

### Pass/Needs Refinement/Fail Decision

- **Pass (≥80):** Component meets kerala-rage standards. Deploy with confidence.
- **Needs Refinement (60-79):** Component is good direction but needs iteration. Specific recommendations provided.
- **Fail (<60):** Component requires major revision. Not aligned with design system.

---

## Validation Checklist

Before marking an audit complete:

- [ ] All six dimensions scored consistently (no major jumps)
- [ ] Audit findings match visual inspection
- [ ] Recommendations are specific and actionable
- [ ] Assessment would be repeatable (another auditor would reach similar conclusions)
- [ ] Score justifies the pass/refinement/fail decision
- [ ] Narrative feedback is clear and professional

---

## References

See:
- `passing-components.md` - Real examples of pass/fail components
- `design-evolution-tracking.md` - How to document component maturity progression
