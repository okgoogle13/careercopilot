#!/bin/bash

# ==============================================================================
# SCRIPT 2: SAFE UPGRADE OF EXISTING AGENTS & SKILLS
# ==============================================================================
# This script upgrades existing agents/skills to be V2-aware.
# SAFETY MECHANISM:
# - Creates a timestamped backup (.bak.TIMESTAMP) of any file before modifying it.
# - Updates the active file to V2 standards so the new system works immediately.
# ==============================================================================

set -e

# --- Configuration ---
AGENT_DIR=".claude/agents"
SKILL_BASE_DIR=".claude/skills"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Specific Skill Dirs
REACT_COMP_SCAFFOLDER_DIR="$SKILL_BASE_DIR/react-component-scaffolder"
REACT_PAGE_SCAFFOLDER_DIR="$SKILL_BASE_DIR/react-page-scaffolder"
STORYBOOK_SCAFFOLDER_DIR="$SKILL_BASE_DIR/storybook-scaffolder"
FIGMA_SCAFFOLDER_DIR="$SKILL_BASE_DIR/figma-to-component"
FULLSTACK_MAPPER_DIR="$SKILL_BASE_DIR/fullstack-flow-mapper"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# --- Helper Function: Safe Update ---
safe_update_file() {
  local DIR="$1"
  local FILENAME="$2"
  local CONTENT="$3"
  local FILE_PATH="$DIR/$FILENAME"
  local BACKUP_PATH="$FILE_PATH.bak.$TIMESTAMP"

  mkdir -p "$DIR"

  if [ -f "$FILE_PATH" ]; then
    cp "$FILE_PATH" "$BACKUP_PATH"
    echo -e "${YELLOW}BACKUP CREATED:${NC} $BACKUP_PATH"
    echo -e "$CONTENT" > "$FILE_PATH"
    echo -e "${CYAN}UPDATED:${NC} $FILE_PATH (Active)"
  else
    echo -e "$CONTENT" > "$FILE_PATH"
    echo -e "${GREEN}CREATED:${NC} $FILE_PATH (New)"
  fi
}

echo -e "\n🚀 Starting SAFE Upgrade of CareerCopilot Agents..."
echo -e "${BLUE}Info: Backups will be created with suffix .bak.$TIMESTAMP${NC}"

# ==============================================================================
# 1. AGENTS
# ==============================================================================
echo -e "\n=== 1. Upgrading Agents ==="

# Frontend Specialist: Needs to know about Component Builder & M3 Tokens
safe_update_file "$AGENT_DIR" "frontend-specialist.md" "$(cat << 'EOF'
---
name: frontend-specialist
description: A React/TypeScript architect who plans and builds M3-compliant UI.
system_prompt: |
  You are a Frontend Specialist, a senior React/TypeScript architect.

  **Workflow:**
  1.  **Plan UI:** Break down requests into a component plan.
  2.  **Scaffold:** Use `react-component-scaffolder` to create file skeletons.
  3.  **Build Code:** Use the `component-builder` skill to write the React code, strictly using M3 tokens (`var(--sys-...)`).
  4.  **Test:** Use `storybook-scaffolder` and `jest-test-scaffolder`.
EOF
)"

# Code Reviewer: Needs to enforce M3 Token usage
safe_update_file "$AGENT_DIR" "code-reviewer.md" "$(cat << 'EOF'
---
name: code-reviewer
description: Code quality and M3 Design System policy enforcer.
system_prompt: |
  You are a senior code reviewer and the guardian of the M3 Design System.

  **M3 Rejection Criteria (Immediate Fail):**
  1.  **Hard-coded Colors:** Any `#...`, `rgb(...)`, or names like `'red'`. **MUST** use `var(--sys-color-...)`.
  2.  **Hard-coded Spacing/Sizing:** Any `px`, `rem`, or numeric spacing like `p={2}`. **MUST** use `var(--sys-space-...)`.
  3.  **Hard-coded Radii/Shadows:** Any non-token `borderRadius` or `boxShadow`. **MUST** use `var(--sys-shape-...)` or `var(--sys-elevation-...)`.

  **Standard Checklist:**
  - Readability, No Duplication, Error Handling, Test Coverage.
EOF
)"

# ==============================================================================
# 2. SKILLS
# ==============================================================================
echo -e "\n=== 2. Upgrading Skills ==="

# Create Component Script: Needs to STOP creating CSS files (we use inline Tokens now)
safe_update_file "$REACT_COMP_SCAFFOLDER_DIR/scripts" "create-component.sh" "$(cat << 'EOF'
#!/bin/bash
# V2 UPDATE: Creates .tsx and index.ts. No longer creates a .css file.
PARENT_DIR=$1
COMPONENT_NAME=$2
COMPONENT_DIR="$PARENT_DIR/$COMPONENT_NAME"
mkdir -p "$COMPONENT_DIR"
# Create ComponentName.tsx
cat << EOT > "$COMPONENT_DIR/$COMPONENT_NAME.tsx"
import React from 'react';
import { Box } from '@mui/material';
export interface ${COMPONENT_NAME}Props {}
export const ${COMPONENT_NAME}: React.FC<${COMPONENT_NAME}Props> = (props) => {
  return (
    <Box sx={{ p: 'var(--sys-space-4)', color: 'var(--sys-color-on-surface)' }}>
      <h1>${COMPONENT_NAME}</h1>
    </Box>
  );
};
EOT
# Create index.ts
echo "export * from './${COMPONENT_NAME}';" > "$COMPONENT_DIR/index.ts"
echo "Successfully created M3-ready component at $COMPONENT_DIR (No .module.css file)."
EOF
)"
chmod +x "$REACT_COMP_SCAFFOLDER_DIR/scripts/create-component.sh"

# Create Page Script: Same update (M3 layout, no CSS file)
safe_update_file "$REACT_PAGE_SCAFFOLDER_DIR/scripts" "create-page.sh" "$(cat << 'EOF'
#!/bin/bash
# V2 UPDATE: Creates page .tsx with M3 canonical layout. No .css file.
PAGE_NAME=$1
DIR_NAME=$(echo "$PAGE_NAME" | tr '[:upper:]' '[:lower:]')
PAGE_DIR="src/pages/$DIR_NAME"
mkdir -p "$PAGE_DIR"
cat << EOT > "$PAGE_DIR/$PAGE_NAME.tsx"
import React from 'react';
import { Box, Typography } from '@mui/material';
export const ${PAGE_NAME}: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '840px', mx: 'auto', p: 'var(--sys-space-5)' }}>
      <Typography variant="headline-medium" component="h1">
        ${PAGE_NAME}
      </Typography>
    </Box>
  );
};
EOT
echo "export * from './${PAGE_NAME}';" > "$PAGE_DIR/index.ts"
echo "Successfully created M3-ready page at $PAGE_DIR (No .module.css file)."
EOF
)"
chmod +x "$REACT_PAGE_SCAFFOLDER_DIR/scripts/create-page.sh"

# Storybook: Needs to import the global Design Tokens CSS
safe_update_file "$STORYBOOK_SCAFFOLDER_DIR" "SKILL.md" "$(cat << 'EOF'
---
name: storybook-scaffolder
description: "Scaffolds a new, M3-token-aware Storybook file (*.stories.tsx)."
version: 2.0.0
---
# Storybook Scaffolder Workflow (v2)
1. Get component path.
2. Generate `.stories.tsx` file from template.
3. **Prepend this line to the top of the generated file:** `import 'src/styles/design-tokens.css';`
4. Report success.
EOF
)"

# Figma-to-Component: Needs to be rerouted to Vision/ComponentBuilder
safe_update_file "$FIGMA_SCAFFOLDER_DIR" "SKILL.md" "$(cat << 'EOF'
---
name: figma-to-component
description: "DEPRECATED: This is now a vision-based workflow."
version: 2.0.0
---
# Figma-to-Component Workflow (v2)
This skill now orchestrates other skills.
1.  **Analyze Image:** Use `design-critique-vision` to analyze the screenshot.
2.  **Build Component:** Pass the analysis to the `component-builder` skill.
3.  **Return Code:** Return the React code generated by `component-builder`.
EOF
)"

# Fullstack Mapper: Needs to know about the Design System Flow
safe_update_file "$FULLSTACK_MAPPER_DIR" "SKILL.md" "$(cat << 'EOF'
---
name: fullstack-flow-mapper
description: "Maps data flows from UI components to the database, including the Design Token system."
version: 2.0.0
---
# Fullstack Flow Mapper (v2)
1. Scans all layers, now including `design-system/tokens.json` and its build process.
2. Adds a "Design Token Flow" section to its report with a Mermaid diagram.
3. Identifies components *not* using the M3 token system.
EOF
)"

echo -e "\n${GREEN}✅ SAFE UPGRADE COMPLETE.${NC}"
echo -e "Original files have been preserved with extension ${YELLOW}.bak.$TIMESTAMP${NC}"