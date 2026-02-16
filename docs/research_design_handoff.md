# Research: Design-to-Dev Handoff & AI Workflows

## 1. Annotated Wireframes & Design-to-Dev Handoff

### Recommendation 1: Adopt a "Living Spec" Approach
Create annotated wireframes that serve as the *single source of truth* for behaviors and interactions, not just visuals.

- **Role**: You are a Lead UX Architect specializing in developer communication.
- **Task**: Create an annotated wireframe spec for the `ApplicationDashboard` component.
- **Context**: The `ApplicationDashboard` uses the Kerala Rage design system. The goal is to maximize developer clarity on accessibility, responsive behavior (Tailwind classes), and token usage.
- **Constraints**: 
    - Include specific Kerala Rage semantic tokens (e.g., `--sys-color-kr-ink-gold`) for key elements.
    - Define responsive breakpoints: `sm`, `md`, `lg`, `xl`.
    - Specify interaction states: Hover, Formatting, Focus.
    - Detail accessibility roles (ARIA) and keyboard navigation paths.

**Pros:**
- **Clarity:** Reduces ambiguity about dynamic behaviors that static mockups miss.
- **Accessibility-First:** Forces consideration of ARIA roles and keyboard nav early.
- **Developer-Centric:** Uses language developers understand (tokens, breakpoints).
**Cons:**
- **Maintenance:** Requires updates if the design changes significantly.

---

## 2. Design Tokens, Variables & System Alignment

### Recommendation 2: Automate Token Sync (Figma -> Style Dictionary -> Tailwind)
Establish a pipeline where Figma variables are the source of truth, automatically transforming into Tailwind configuration.

- **Role**: You are a Design Systems Engineer.
- **Task**: Configure a Style Dictionary pipeline to transform Figma Variables JSON into a `tailwind.config.js` theme extension.
- **Context**: We use tokens for color, typography, and spacing.
- **Constraints**:
    - Input: `tokens.json` export from Figma.
    - Output: `tailwind.config.ts` using `extend`.
    - Ensure semantic tokens map correctly (e.g., `sys.color.primary` -> `colors.primary`).

**Tooling:**
- **Figma Plugins**: Tokens Studio for Figma (best in class), or native Variables export.
- **Transformation**: Style Dictionary (Amazon) is the standard.
- **Integration**: Tailwind CSS `theme.extend`.

**Pros:**
- **Consistency:** 100% match between design and code.
- **Efficiency:** Updates in Figma propagate to code automatically (via CI/CD).
**Cons:**
- **Setup Complexity:** Requires initial engineering effort to set up the pipeline.

---

## 3. AI-Assisted Design-to-Code (React + Tailwind + Kerala Rage)

### Recommendation 3: Use "Token-Aware" Generation Prompts
When using AI to generate code, *force* it to use your specific design tokens and component structures, preventing generic output.

- **Role**: You are a Senior React Developer expert in the Kerala Rage Design System.
- **Task**: Generate a `HeroSection` component using React, TypeScript, and Tailwind CSS.
- **Context**: adhering strictly to Kerala Rage aesthetics (Neo-Brutalist, high contrast).
- **Constraints**:
    - Use *only* semantic color tokens: `bg-kr-ink-gold`, `text-asphalt-black`.
    - Use specific typography tokens: `font-fraunces`, `text-display-large`.
    - Avoid rounded corners (`rounded-none`) and generic shadows.
    - Use `grid` layouts for brutalist alignment.

**Best Models:**
- **Claude 3.5 Sonnet / 3.7**: Excellent at following complex, strict token constraints and logical architectural instructions.
- **GPT-4o**: Good for general code structure, but may drift towards generic UI without strict prompting.

---

## 4. Evaluation of Original 3 Options

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **1. `ui-design-evaluator` → HTML** | Fast, token-accurate, accessible by default. | Not a "design tool" artifact for stakeholder sign-off. | **Best for Dev-Led Prototyping** |
| **2. Figma Code Connect / MCP** | Single source of truth in Figma. Familiar to designers. | High setup overhead. Risk of "drift" if components aren't perfectly synced. | **Best for Large Teams / Robust Design Systems** |
| **3. Manual Figma** | Maximum creative control. "Kerala Rage" aesthetic preserved. | Slowest. Prone to inconsistencies. | **Best for Exploratory / Hero Design** |

---

## 5. Three New High-Fidelity Mockup Options (Avoid Generic SaaS-UI)

### Option 4: The "Living Spec" (Storybook-First Prototyping)
Skip static mockups. Build the "mockup" directly as a Storybook story using your existing *coded* components. Use AI to compose the story.

- **Workflow**: 
    1.  Define the layout/content in a markdown spec.
    2.  Use AI (Claude/Cursor) to write a Storybook story (`Page.stories.tsx`) that composes `Leaf`, `Stone`, `Pebble` components into the full page layout.
    3.  Review in browser.
- **Pros**: 
    - **Zero Translation Error:** What you see IS the code.
    - **Interactive:** Real hover states, inputs, accessibility.
    - **Kerala Rage Guaranteed:** Uses your actual components.
- **Cons**: Requires existing component library.

### Option 5: Generative Design Tokens (AI Layout + Token Injection)
Use AI to generate the *layout structure* (wireframe HTML) but force it to use specific "Kerala Rage" tokens for *styling*.

- **Workflow**:
    1.  Prompt AI: "Create a 3-column brutalist grid layout for a dashboard. Use `bg-surface-standard` and `gap-6`."
    2.  Pass the output through a "Token Injector" script that aggressively replaces generic colors/fonts with Kerala Rage semantic tokens (e.g., `#000` -> `var(--sys-color-kr-ink-black)`) based on a mapping ruleset.
- **Pros**: 
    - **Speed:** Fast generation of layouts.
    - **Consistency:** Enforces system colors/fonts programmatically.
- **Cons**: Can result in "frankstein" designs if the mapping logic is flawed.

### Option 6: Hybrid Sketch-to-Component (Vision-Assisted)
Capture the "chaotic/human" energy of Kerala Rage by sketching on paper/iPad, then using Vision AI to convert to code.

- **Workflow**:
    1.  Sketch the layout (rough boxes, arrows, labels like "Hero Text here").
    2.  Upload image to Claude/GPT-4o Vision.
    3.  **Prompt**: "Convert this sketch to React/Tailwind. Use `Leaf` component for text `Pebble` for buttons. Match the 'chaotic' alignment shown in the sketch using `transform: rotate` or offset margins."
- **Pros**: 
    - **Creative Freedom:** Breaks the rigid "SaaS grid".
    - **Rapid Iteration:** Faster than pixel-pushing in Figma.
- **Cons**: Variable code quality options.

---

## 6. AI Tooling Recommendations & Minimal-Viable-Workflow

**Recommended Stack:**
- **Code Generation**: **Claude 3.5 Sonnet** (via Cursor or key-bound script). Best reasoning for following strict design system constraints.
- **IDE Integration**: **Cursor** (with `@tokens.json` context) or **VS Code + Cody/Codeium** (with context awareness).
- **Visual Validation**: **v0 (Vercel)** *ONLY IF* seeded with your component library context, otherwise stick to IDE-based generation.

**Minimal-Viable-Workflow (The "Spec-to-Story" Loop):**

1.  **AI Action 1 (Spec Check):** 
    -   *Input:* User spec/brief.
    -   *Task:* Analyze brief against `tokens.json`. Identify missing components or tokens.
    -   *Output:* "Ready to build" or "Need definition for X".
2.  **Decision Gate:**
    -   *Is it a standard page?* -> **Go to Step 3 (Storybook Composition).**
    -   *Is it a chaotic/hero section?* -> **Go to Step 4 (Sketch/Vision Workflow).**
3.  **AI Action 2 (Storybook Composition):**
    -   *Task:* Generate `src/stories/NewPage.stories.tsx` importing `Leaf`, `Stone`, etc.
    -   *Constraint:* "Use only existing components. Apply `grid` layouts for structure."
4.  **AI Action 3 (Sketch/Vision Workflow):**
    -   *Task:* "Take this sketch image. Output raw HTML/Tailwind using `style={{ transform: ... }}` for the chaotic look, mapped to `kr-solidarity` colors."

This workflow prioritizes **code-as-design-source-of-truth** (Storybook) while allowing **creative chaos** (Sketch-to-Code) for specific Kerala Rage moments, avoiding the "Generic SaaS" trap of standard Figma kits.
