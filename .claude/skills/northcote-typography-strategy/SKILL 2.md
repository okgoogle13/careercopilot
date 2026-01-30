---
description: Apply Northcote Curio typography emotion dimensions (primary tone, secondary
  refine, tertiary accent) to component library decisions. Validates fonts against
  Northcote spec, audits for generic choices (Inter, Roboto, Arial), and recommends
  distinctive display+body pairings that signal intentional design.
name: northcote-typography-strategy
---

# Northcote Typography Strategy Skill

## Overview

Establishes typography as the primary communicative voice for Northcote Curio aesthetic. Transforms typography from aesthetic decoration into **meaning-making device** that signals intentional design, Victorian craftsmanship, and intellectual rigor.

Typography is the loudest statement your design makes before users read a word. This skill ensures that statement is unmistakably Northcote.

## When to Use This Skill

Use this skill when you need to:

- **Choose fonts for a component** with confidence rooted in philosophy
- **Validate typography decisions** against Northcote principles
- **Establish font pairings** that create visual dialogue
- **Audit existing components** for generic font choices (Inter, Arial, Roboto, Space Grotesk)
- **Understand typography emotion** (which font for which context?)
- **Bridge Victorian aesthetics** with contemporary accessibility
- **Make typography decisions** defensible and repeatable

## The Northcote Typography Philosophy

Typography embodies these dimensions:

### **Primary Tone**: Scholarly Rigor
"Every typeface choice declares: I paid attention. I chose this deliberately."

Display fonts (Lora, Fraunces) evoke hand-lettered precision—the typography of Victorian field journals where observation was intellectual act.

### **Secondary Refine**: Readable Warmth
Body typography must deliver contemporary clarity without coldness.

Crimson Text bridges formality (serif, refined) with approachability (warm undertones, generous spacing).

### **Tertiary Accent**: Personality
Optional accent typography adds character when appropriate—thinking Monospace choices with personality, not system fonts.

## Core Typography Specifications

### Display Fonts (Primary Communication)

| Font | Emotion | Use When | Avoid When |
|---|---|---|---|
| **Lora** | Hand-lettered precision, historical warmth | Headers demanding authority + personality | Cold, technical contexts |
| **Fraunces** | Victorian personality, decorative weight | Warm, welcoming expressions | Dense information needs clarity |
| **Crimson Text** | Refined formality, intellectual | When display needs tradition | Need maximum personality |

**Philosophy**: Display fonts should whisper "I was designed for Victorian naturalists, now I serve contemporary ambition."

### Body Fonts (Clarity & Accessibility)

| Font | Characteristic | Use Case | Line Length |
|---|---|---|---|
| **Crimson Text** | Refined serif, warm undertones | Primary body text | 45-75 characters |
| **Source Serif Pro** | Academic formality, high readability | Alternative for maximum clarity | 45-75 characters |
| **Lora** | Works as body in generous sizes | Less formal contexts | 50-80 characters |

**Philosophy**: Body typography should deliver clarity without disappearing. It supports without dominating.

### Monospace Fonts (Code & Data)

| Font | Character | Use When |
|---|---|---|
| **Inconsolata** | Personality with clarity | Code that should feel intentional |
| **Courier Prime** | Typewriter warmth | When personality matters |
| **IBM Plex Mono** | Professional + personality | Enterprise contexts |

**Never use**: System monospace fonts (they signal algorithmic, not intentional)

## Typography Emotion Dimensions

Use this framework to decide typography for specific contexts:

### **High Formality, High Warmth**
Display: Fraunces  
Body: Crimson Text  
Example: Career achievement celebrations, inspirational content

### **High Formality, High Clarity**
Display: Lora (smaller weight)  
Body: Source Serif Pro  
Example: Information-dense job listings, application forms

### **High Personality, High Accessibility**
Display: Fraunces (decorative weight)  
Body: Crimson Text or Lora  
Example: Landing pages, benefit statements, career pathway visualizations

### **Restrained, High Clarity**
Display: Lora (light weight)  
Body: Source Serif Pro  
Example: Data-heavy dashboards, analytics, structured information

## The Typography Decision Framework

**Step 1: Identify Context**
Is this information-heavy or emotionally communicative?

**Step 2: Commit to Tone**
Am I going maximalist (generous, personality-forward) or refined (restrained, clarity-focused)?

**Step 3: Select Display**
Based on tone, which display font creates the right impression?

**Step 4: Pair Body Font**
Choose body that complements display while prioritizing readability.

**Step 5: Validate Against Anti-Patterns**
Does this choice avoid generic defaults? Does it signal intentionality?

## The Anti-Patterns: What Breaks Northcote Typography

❌ **Inter, Arial, Roboto as primary fonts**: These are algorithmic defaults, not intentional choices

❌ **Space Grotesk**: Once distinctive, now overused in AI-generated design (signals generic, not Northcote)

❌ **System fonts**: Computer-generated, not crafted

❌ **Undefined hierarchy**: Display and body have no visual dialogue

❌ **Mismatched emotion**: Formal display + playful body (or vice versa) confuses message

❌ **Overuse of decorative fonts**: Fraunces should accent, not dominate body text

## Usage Examples

### Example 1: Career Pathway Component
"I'm building a component showing career progression in Australian NFP sector. What typography should I use?"

Claude will:
1. Establish context (emotional + informational)
2. Recommend tone (probably refined warmth)
3. Suggest pairing (likely Lora display + Crimson Text body)
4. Explain why (Lora signals scholarly attention, Crimson delivers warmth without coldness)
5. Warn against (Inter, Arial, generic defaults)

### Example 2: Validate Existing Typography
"Audit this component's typography. Does it follow Northcote principles?"

Claude will:
1. Identify fonts used
2. Assess against Northcote spec
3. Check for anti-patterns
4. Rate coherence (pass/fail)
5. Suggest refinements if needed

### Example 3: Font Pairing Decision
"Should I use Fraunces or Lora for this heading, paired with Crimson Text body?"

Claude will:
1. Consider context
2. Explain Fraunces (more personality, Victorian warmth)
3. Explain Lora (slightly more restrained, historical precision)
4. Recommend based on your context
5. Show how pairing creates visual dialogue

## Integration with Other Skills

### With Northcote-Visual-Audit
Typography decisions are validated through visual audit—are the chosen fonts actually rendering as intended?

### With Frontend-Design
Ensure typography commitment aligns with overall aesthetic direction (maximalist vs. refined).

### With Brand-Brief-Optimizer
Typography strategy feeds into brief language that guides team decisions.

## Technical Implementation

### CSS Variables (Tailwind)
```css
--font-display: 'Lora', serif; /* Primary display */
--font-display-warm: 'Fraunces', serif; /* Warm accent display */
--font-body: 'Crimson Text', serif; /* Primary body */
--font-mono: 'Inconsolata', monospace; /* Code */
```

### Font Loading
Import fonts from quality sources:
- Google Fonts (free, reliable)
- Fontshare (high-quality open fonts)
- Adobe Fonts (premium, if budget allows)

**Never default to system fonts.**

## Validation Questions

Before implementing typography, ask:

1. **Is this font distinctive?** (Not Inter, Arial, Roboto)
2. **Does it signal intentionality?** (Looks designed, not defaulted)
3. **Does it fit the context?** (Formality level matches need)
4. **Does it pair coherently?** (Display + body create dialogue)
5. **Is it accessible?** (Sufficient contrast, readable size)

All yes? You're aligned with Northcote.

## Related References

See `references/typography-emotion-dimensions.md` for expanded emotion mapping.  
See `references/font-psychology.md` for deeper understanding of what fonts communicate.  
See `references/northcote-typography-spec.md` for complete technical specifications.

## Limitations

This skill guides typography strategy and decision-making. It does not:

- Render fonts (use actual tools for that)
- Measure exact pixel sizes (provide general sizing guidance)
- Handle all edge cases (unusual contexts require judgment)
- Replace visual testing (always validate rendered output)

## Key Principle

Typography is not decoration—it's declaration. Every font choice says something about your intentionality, your attention, your values.

Northcote typography says: *"Someone thought about this. Someone chose these fonts because they mean something."*

That's the bar. Hit it consistently.

---

*Typography is your design system's loudest whisper. Make sure it's saying the right thing.*
