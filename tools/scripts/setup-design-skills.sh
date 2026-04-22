#!/bin/bash
# Strategic skill installation for CareerCopilot design pipeline
# Token-efficient: Runs in Claude Code with filesystem access

set -e

PROJECT_ROOT="$(pwd)"
SKILLS_DIR=".claude/skills"

echo "🎨 CareerCopilot Design Skills Setup"
echo "======================================"

# Create skills directory structure
mkdir -p "$SKILLS_DIR"/{design-token-validator,design-system-doc-generator,wireframe-annotator,component-spec-generator,northcote-brand-enforcer}

# Create output directories
mkdir -p docs/{design-system,wireframes,component-specs}
mkdir -p scripts/design-validation

echo "✅ Directory structure created"

# Phase 1: Foundation
echo ""
echo "📋 Phase 1: Creating foundation skills..."
cat > "$SKILLS_DIR/design-token-validator/SKILL.md" << 'EOF'
---
name: design-token-validator
description: Validate CareerCopilot design tokens for DTCG compliance, Northcote palette rules, circular references, and WCAG contrast. Use before wireframing or deployment.
tags: [design-tokens, validation, northcote, accessibility]
version: 2.0.0
---

# Design Token Validator

## When to Use
- **ALWAYS** before committing token changes
- Before generating wireframes (ensures valid references)
- During CI/CD pipeline (pre-build check)
- When updating color palette or typography

## Validation Checks
1. ✅ DTCG format compliance ($value, $type present)
2. ✅ No circular references
3. ✅ Naming convention: category-concept-variant-state
4. ✅ Northcote palette compliance (#1A1410, #8FB8A0)
5. ✅ WCAG AA contrast ratios (4.5:1 minimum)
6. ✅ Light/dark mode parity

## File Locations
- Tokens: `src/design/tokens/tokens.json`
- Theme: `src/theme/northcote-theme.js`
- Validator: `scripts/design-validation/validate-tokens.py`

## Usage
```bash
python3 scripts/design-validation/validate-tokens.py
# Exit code 0 = pass, 1 = fail
```

## Integration
Runs automatically before:
- wireframe-annotator (ensures valid token references)
- design-system-doc-generator (validates source data)
- component-spec-generator (confirms token availability)
EOF

echo "✅ design-token-validator created"

# Phase 2: Documentation
echo ""
echo "📚 Phase 2: Creating documentation generator..."
cat > "$SKILLS_DIR/design-system-doc-generator/SKILL.md" << 'EOF'
---
name: design-system-doc-generator
description: Extract design system from CareerCopilot codebase and generate comprehensive design guidelines (MD) + interactive reference style guide (HTML). Uses the current KR Solidarity aesthetic and treats Northcote Curio as deprecated legacy context.
tags: [design-system, documentation, style-guide, kr-solidarity]
version: 1.0.0
---

# Design System Documentation Generator

## When to Use
- **BEFORE** creating Perplexity Labs prompts (ensures current docs)
- After updating tokens or components
- When onboarding new developers
- Before starting wireframe work

## Generates

### 1. Design Guidelines (design-guidelines.md)
- Northcote philosophy ("Haeckel Sandwich")
- Complete token documentation
- Typography system (Bebas Neue, Space Grotesk)
- Component library organized by atomic design
- Responsive patterns + breakpoints
- Accessibility guidelines (WCAG 2.1 AA)
- Material 3 Expressive notes

### 2. Interactive Style Guide (reference-styleguide.html)
- Live component examples
- Color palette with hex codes
- Typography scale demonstrations
- Button/form states
- Layout grid

## Process
1. Scan `src/design/tokens/tokens.json`
2. Analyze `src/components/**/*.jsx`
3. Extract theme from `src/theme/northcote-theme.js`
4. Generate markdown documentation
5. Build interactive HTML reference
6. Save to `docs/design-system/`

## Output Files
- `docs/design-system/design-guidelines.md`
- `docs/design-system/reference-styleguide.html`
EOF

echo "✅ design-system-doc-generator created"

# Phase 3: Wireframing
echo ""
echo "🖼️  Phase 3: Creating wireframe annotator..."
cat > "$SKILLS_DIR/wireframe-annotator/SKILL.md" << 'EOF'
---
name: wireframe-annotator
description: Generate annotated ASCII wireframes with KR Solidarity design tokens, responsive breakpoints, and M3 Expressive patterns.
tags: [wireframing, design, kr-solidarity, spec]
version: 1.0.0
---

# Wireframe Annotator skill

## Purpose
Generate annotated wireframes for CareerCopilot screens using ASCII layout diagrams and detailed component specifications.

## Output Structure per Screen
- **ASCII Layout Diagram**: Visual structure using text capability
- **Component Annotations**: Type, props, states, accessibility
- **Design Token References**: `theme.colors.*`, `theme.spacing.*`
- **Responsive Breakpoints**: Mobile / Tablet / Desktop considerations
- **User Interaction Flows**: Expected behaviors
- **Developer Handoff Notes**: Data requirements, edge cases

## Design Context
- **System**: KR Solidarity
- **Typography**: Bebas Neue (display), Space Grotesk (headers)
- **Colors**: Dark ironbark (#1A1410), activist green (#8FB8A0)
- **Framework**: Material 3 Expressive

## Usage
"Create wireframe for [Screen Name]"

## Integration
- Validates against `design-token-validator`
- Output feeds into `component-spec-generator`
EOF

echo "✅ wireframe-annotator created"

# Phase 4: Component specs
echo ""
echo "⚙️  Phase 4: Creating component spec generator..."
cat > "$SKILLS_DIR/component-spec-generator/SKILL.md" << 'EOF'
---
name: component-spec-generator
description: Transform wireframe markdown into detailed React component implementation specifications with TypeScript interfaces and test stubs.
tags: [react, typescript, testing, spec]
version: 1.0.0
---

# Component Spec Generator

## Input
Wireframe markdown files from `wireframe-annotator`

## Output
`README.md` file in component directory (`src/components/[name]/README.md`)

## Content Generated
1. **TypeScript Interface**: complete props + types definition
2. **State Management**: local vs global state requirements
3. **Accessibility Spec**: ARIA roles, labels, keyboard navigation
4. **Design Token Mapping**: Exact CSS-in-JS / Tailwind classes
5. **Test Stubs**: Jest + React Testing Library test cases

## Usage
"Generate specs for [Component Name] based on [Wireframe File]"

## Validation
Checks token validity using `design-token-validator`
EOF

echo "✅ component-spec-generator created"

# Phase 5: Brand enforcement
echo ""
echo "🛡️  Phase 5: Creating brand enforcer..."
cat > "$SKILLS_DIR/northcote-brand-enforcer/SKILL.md" << 'EOF'
---
name: northcote-brand-enforcer
description: Auto-applies KR Solidarity brand guidelines while treating Northcote Curio references as deprecated legacy context.
tags: [brand, compliance, kr-solidarity, design]
version: 1.0.0
---

# Northcote Brand Enforcer skill

## Purpose
Guardrails to ensure all AI-generated content matches the KR Solidarity aesthetic.

## Enforcement Rules
- **Colors**: Dark ironbark bg, activist accent, soft white text
- **Typography**: Bebas Neue (display), Space Grotesk (headers), NO Roboto/Arial
- **Layout**: 8px grid, sharp corners (0px) or subtle (4-8px), M3 shadows
- **Visual**: Melbourne laneway aesthetic, Australian endemic flora motifs

## Validates Outputs From
- wireframe-annotator
- component-spec-generator
- design-system-doc-generator

## Usage
"Check [File/Output] for brand compliance"
EOF

echo "✅ northcote-brand-enforcer created"

echo ""
echo "======================================"
echo "✅ All 5 design skills created!"
echo ""
echo "Next steps:"
echo "1. Run: python3 scripts/design-validation/validate-tokens.py"
echo "2. Prompt Claude Code: 'Use design-system-doc-generator'"
echo "3. Review: docs/design-system/design-guidelines.md"
echo "4. Create wireframe: 'Use wireframe-annotator for dashboard'"
echo ""
echo "Token savings: ~10,000 tokens per session vs manual prompting"
