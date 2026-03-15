#!/bin/bash

# Configuration
BASE_DIR="$(pwd)"
AGENT_DIR="$BASE_DIR/.claude/agents"
DESIGN_SKILL_DIR="$BASE_DIR/.claude/skills/design-skills"
DOC_SKILL_DIR="$BASE_DIR/.claude/skills/document-skills"
SCRIPT_DIR="$BASE_DIR/scripts"
TOKEN_DIR="$BASE_DIR/design-tokens"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create directory if it doesn't exist
create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo -e "${GREEN}CREATED:${NC} $1"
  else
    echo -e "${YELLOW}EXISTS:${NC} $1"
  fi
}

# Create file with content if it doesn't exist
create_file() {
  local dir="$1"
  local file="$2"
  local content="$3"

  mkdir -p "$dir"
  if [ ! -f "$dir/$file" ]; then
    echo -e "$content" > "$dir/$file"
    echo -e "${GREEN}CREATED:${NC} $dir/$file"
  else
    echo -e "${YELLOW}EXISTS:${NC} $dir/$file (not modified)"
  fi
}

# Create directories
echo -e "\n${CYAN}--- Creating Directories ---${NC}"
create_dir "$AGENT_DIR"
create_dir "$DESIGN_SKILL_DIR"
create_dir "$DOC_SKILL_DIR"
create_dir "$SCRIPT_DIR"
create_dir "$TOKEN_DIR"

# Create agent files
echo -e "\n${CYAN}--- Creating Agent Files ---${NC}"
create_file "$AGENT_DIR" "visual-design-director.md" "# Visual Design Director\n\n## Role\nOversees the visual design language and aesthetic direction.\n\n## Responsibilities\n- Define visual design principles\n- Create mood boards and style tiles\n- Ensure visual consistency across all components"

create_file "$AGENT_DIR" "design-systems-architect.md" "# Design Systems Architect\n\n## Role\nDesigns and maintains the design token system and component architecture.\n\n## Responsibilities\n- Define token structure and naming conventions\n- Manage design system versioning\n- Ensure token integration with components"

create_file "$AGENT_DIR" "ux-accessibility-lead.md" "# UX & Accessibility Lead\n\n## Role\nEnsures all designs meet accessibility standards and provide optimal user experience.\n\n## Responsibilities\n- Conduct accessibility audits\n- Define UX best practices\n- Ensure WCAG compliance"

# Create design skills
echo -e "\n${CYAN}--- Creating Design Skills ---${NC}"
create_file "$DESIGN_SKILL_DIR" "design-critique-vision.md" "# Design Critique Vision\n\n## Description\nProvides structured feedback on visual design concepts.\n\n## Input\n- Design mockups or screenshots\n- Design requirements\n\n## Output\n- Structured feedback report\n- Suggested improvements"

create_file "$DESIGN_SKILL_DIR" "design-token-generator.md" "# Design Token Generator\n\n## Description\nGenerates design tokens from design specifications.\n\n## Input\n- Design specifications\n- Brand guidelines\n\n## Output\n- tokens.json file\n- Documentation"

# Create document skills
echo -e "\n${CYAN}--- Creating Document Skills ---${NC}"
create_file "$DOC_SKILL_DIR/pdf" "SKILL.md" "# PDF Text Extractor\n\n## Description\nExtracts text and data from PDF documents.\n\n## Input\n- PDF file\n- Extraction parameters\n\n## Output\n- Extracted text\n- Structured data"

# Create scripts
echo -e "\n${CYAN}--- Creating Scripts ---${NC}"
create_file "$SCRIPT_DIR" "validate-design-tokens.py" '#!/usr/bin/env python3\n\nimport json\nimport sys\n\ndef validate_tokens(tokens_file):\n    try:\n        with open(tokens_file, "r") as f:\n            json.load(f)\n        print(f"✅ Valid JSON: {tokens_file}")\n        return True\n    except json.JSONDecodeError as e:\n        print(f"❌ Invalid JSON: {e}")\n        return False\n\nif __name__ == "__main__":\n    if len(sys.argv) != 2:\n        print("Usage: validate-design-tokens.py <tokens.json>")\n        sys.exit(1)\n    if not validate_tokens(sys.argv[1]):\n        sys.exit(1)'

# Make scripts executable
chmod +x "$SCRIPT_DIR/validate-design-tokens.py"

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo "All agents, skills, and scripts have been created or updated."
