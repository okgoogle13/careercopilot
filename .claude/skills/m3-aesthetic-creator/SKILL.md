---
name: m3-aesthetic-creator
description: Create comprehensive design aesthetic systems using Material 3 Expressive
  Design principles, including color palettes, typography hierarchies, shape language,
  depth strategies, and motion principles. Use this skill when users request design
  systems, visual aesthetics, brand design directions, M3-based design specifications,
  or need to establish a cohesive visual language for a product. Trigger phrases include
  "create a design aesthetic", "build a design system", "develop visual language",
  "design direction using M3", or "expressive design aesthetic".
metadata:
  legacy_frontmatter:
    version: 2.0.0
    tags:
    - design-system
    - m3-expressive
    - aesthetic
    - generation
    - visual-design
---

# M3 Aesthetic Creator

This skill creates comprehensive design aesthetic systems using **Material 3 Expressive Design** principles. You develop complete visual languages that are emotionally resonant, visually cohesive, and expressively bold—avoiding generic "AI slop" aesthetics.

## Core Principles

### Emotional Resonance First

Every design decision should evoke a specific emotional response. Design should tell a story or express a concept through a **central visual metaphor** (e.g., "Worker Solidarity", "Viscous Struggle").

### Anti-Slop Protection (Critical)

Before creating any aesthetic, **review `references/anti-slop-guide.md`** to understand forbidden patterns. Key prohibitions:

- ❌ Generic fonts (Inter, Roboto static, system fonts)
- ❌ Purple gradients on white backgrounds
- ❌ Generic Material Blue (--sys-color-accent-primary)
- ❌ Timid, evenly-distributed color palettes
- ❌ Solid backgrounds with no depth
- ❌ Uniform spacing and centered layouts only

Always create distinctive, memorable designs with intentional contrast and personality.

## The Creation Process

Follow this systematic workflow:

### Step 1: Discovery & Conceptualization

**Understand the context:**

- What is the product/project?
- Who is the target audience?
- What emotions should the design evoke?
- Are there brand constraints or existing elements to respect?

**Define the visual metaphor:**
Choose a central concept that will unify all aesthetic decisions. This metaphor informs colors, typography, shapes, and motion.

### Step 2: Color Palette Development

Create a comprehensive M3 color system. **Read `references/m3-color-roles.md` for complete specifications.**

**Essential color roles to define:**

- **Surface colors**: surface, surface-variant, surface-container (lowest to highest), surface-dim/bright
- **Key colors**: primary, secondary, tertiary (with containers)
- **Semantic colors**: error, outline, scrim, shadow
- **On-colors**: on-surface, on-primary, on-secondary (text/icons on backgrounds)

**Requirements:**

- Average saturation ≥ 30% (vibrant, not timid)
- Define a dominant color strategy (1-2 primary, 1-2 accents)
- Use distinctive hues aligned with visual metaphor
- Ensure WCAG AA accessibility minimum
- Provide rationale explaining emotional intent

### Step 3: Typography System

**Read `references/typography-guidelines.md` for detailed specifications.**

Define a complete type system:

- **Display font**: For hero moments, large headlines (MUST be distinctive)
- **Body font**: For readable text
- **Optional monospace**: For code/data if needed

**Key requirements:**

- Specify variable font axes to leverage (wdth, slnt, GRAD, etc.)
- Create dramatic hierarchies with extreme contrast (weight ≥ 3x, size ≥ 3x)
- Define type scale with clear roles (display, headline, title, body, label, caption)
- Ensure high-contrast pairing (display ≠ body font family)

### Step 4: Shape Language

Define geometric principles:

- Corner radius strategy (subtle vs. friendly vs. playful)
- Aspect ratios for cards/containers
- [DEPRECATED_STYLE] vs. structural balance
- Component-specific shapes (buttons, cards, inputs, modals)

**Requirements:**

- Include asymmetric or playful elements (rotation, negative margins)
- Define intentional corner radius strategy (not generic 8px everywhere)

### Step 5: Depth & Texture Strategy

Create visual richness:

- **Elevation system**: Shadow values for different levels (0-5)
- **kr-screenprint**: Backdrop blur, transparency levels
- **Layering principles**: Background, content, floating, decorative layers
- **Textures**: Subtle gradients, patterns for depth

**Requirements:**

- Must have layered backgrounds (not solid colors only)
- Define elevation system with shadows or transparency
- Specify varied spacing rhythm (8px, 16px, 24px, 40px, 64px)

### Step 6: Motion Principles

Define animation language:

- **Easing curves**: Spring physics parameters or custom cubic-bezier
- **Duration scale**: Micro (100-200ms), short (200-300ms), medium (300-500ms), long (500ms+)
- **Interaction patterns**: Hover, active, focus states with micro-interactions

**Requirements:**

- Specify spring physics or custom easing (not linear ease-in-out)
- Define hover states for all interactive elements

## Output Format

Provide a complete design aesthetic specification:

1. **Aesthetic Overview**
   - Name and core visual metaphor
   - Emotional intent (2-3 adjectives)
   - Target audience/use case

2. **Color System**
   - All M3 color roles with hex/HSL/oklch values
   - Tonal palettes (0-100 scale)
   - Rationale for emotional intent

3. **Typography System**
   - Font families with variable axes
   - Complete type scale with sizes, weights, line heights
   - Parametric usage rules

4. **Shape Language**
   - Core geometric principles
   - Component-specific shapes

5. **Depth & Texture**
   - Elevation/shadow system
   - kr-screenprint specifications
   - Layering strategy

6. **Motion Language**
   - Easing curves
   - Duration scale
   - Interaction patterns

7. **Implementation Notes**
   - CSS custom properties structure
   - Key design tokens
   - Integration recommendations

8. **Anti-Slop Validation**
   - Verify against checklist in `references/anti-slop-guide.md`

## Implementation Approach

1. **Discover**: Understand project context and requirements
2. **Conceptualize**: Define visual metaphor and emotional intent
3. **Design**: Systematically develop each aesthetic aspect
4. **Document**: Provide comprehensive specifications
5. **Validate**: Check against anti-slop requirements

Remember: You're crafting an **emotional experience** and building a **cohesive visual language** that defines the product's personality—not just picking colors and fonts.
