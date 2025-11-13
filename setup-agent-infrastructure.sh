#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directory setup
BASE_DIR="$(pwd)"
AGENT_DIR="$BASE_DIR/.claude/agents"
DESIGN_SKILL_DIR="$BASE_DIR/.claude/skills/design-skills"
DOC_SKILL_DIR="$BASE_DIR/.claude/skills/document-skills"
THEME_SKILL_DIR="$BASE_DIR/.claude/skills/theme-factory"
SCRIPT_DIR="$BASE_DIR/scripts"
TOKEN_DIR="$BASE_DIR/design-tokens"

# Create directories if they don't exist
mkdir -p "$AGENT_DIR"
mkdir -p "$DESIGN_SKILL_DIR"
mkdir -p "$DOC_SKILL_DIR"
mkdir -p "$THEME_SKILL_DIR"
mkdir -p "$SCRIPT_DIR"
mkdir -p "$TOKEN_DIR"

# Function to create file if it doesn't exist
create_file_if_not_exists() {
    local dir=$1
    local filename=$2
    local content=$3
    
    if [ ! -f "$dir/$filename" ]; then
        echo -e "${GREEN}CREATED:${NC} $dir/$filename"
        echo -e "$content" > "$dir/$filename"
    else
        echo -e "${YELLOW}SKIPPED (exists):${NC} $dir/$filename"
    fi
}

# Function to update file if it exists
update_file() {
    local dir=$1
    local filename=$2
    local content=$3
    
    if [ -f "$dir/$filename" ]; then
        echo -e "${CYAN}UPDATED:${NC} $dir/$filename"
        echo -e "$content" > "$dir/$filename"
    else
        echo -e "${YELLOW}SKIPPED (not found):${NC} $dir/$filename"
    fi
}

# Agent content templates
AGENT_VDD_CONTENT="# Visual Design Director\n\n## Role\nOversees the visual design language and aesthetic direction.\n\n## Responsibilities\n- Define visual design principles\n- Create mood boards and style tiles\n- Ensure visual consistency across all components"

AGENT_DSA_CONTENT="# Design Systems Architect\n\n## Role\nDesigns and maintains the design token system and component architecture.\n\n## Responsibilities\n- Define token structure and naming conventions\n- Manage design system versioning\n- Ensure token integration with components"

AGENT_UXL_CONTENT="# UX & Accessibility Lead\n\n## Role\nEnsures all designs meet accessibility standards and provide optimal user experience.\n\n## Responsibilities\n- Conduct accessibility audits\n- Define UX best practices\n- Ensure WCAG compliance"

AGENT_DPM_CONTENT="# Design Project Manager\n\n## Role\nOrchestrates the design process and ensures smooth collaboration between design team members.\n\n## Responsibilities\n- Manage design backlog\n- Coordinate between design and development\n- Track design system updates"

AGENT_FS_CONTENT="# Frontend Specialist\n\n## Role\nImplements the design system in code.\n\n## Responsibilities\n- Convert design tokens to CSS/JS\n- Implement accessible UI components\n- Maintain design system documentation"

# Skill content templates
SKILL_DCV_CONTENT="# Design Critique Vision\n\n## Description\nProvides structured feedback on visual design concepts.\n\n## Input\n- Design mockups or screenshots\n- Design requirements\n\n## Output\n- Structured feedback report\n- Suggested improvements"

SKILL_DTG_CONTENT="# Design Token Generator\n\n## Description\nGenerates design tokens from design specifications.\n\n## Input\n- Design specifications\n- Brand guidelines\n\n## Output\n- tokens.json file\n- Documentation"

SKILL_WCC_CONTENT="# WCAG Contrast Checker\n\n## Description\nVerifies color contrast meets WCAG standards.\n\n## Input\n- Color pairs\n- Text size\n\n## Output\n- Pass/Fail status\n- Contrast ratio\n- Compliance level"

SKILL_UXA_CONTENT="# UX Heuristic Audit\n\n## Description\nEvaluates interfaces against established UX heuristics.\n\n## Input\n- Application URL or screenshots\n- User flows\n\n## Output\n- Heuristic evaluation report\n- Severity ratings\n- Recommendations"

SKILL_PDF_CONTENT="# PDF Text Extractor\n\n## Description\nExtracts text and data from PDF documents.\n\n## Input\n- PDF file\n- Extraction parameters\n\n## Output\n- Extracted text\n- Structured data"

SKILL_PDF_FORMS_CONTENT="# PDF Forms Reference\n\n## Description\nReference for working with PDF forms.\n\n## Fields\n- Form field types\n- Validation rules\n- Data extraction methods"

SKILL_PDF_REFERENCE_CONTENT="# PDF Processing Reference\n\n## Description\nTechnical reference for PDF processing.\n\n## Topics\n- Text extraction\n- Metadata handling\n- Performance optimization"

SKILL_THEME_CONTENT="# Theme Factory\n\n## Description\nGenerates complete theme configurations.\n\n## Input\n- Theme name\n- Base colors\n\n## Output\n- Complete theme configuration\n- Preview assets"

# Script content templates
SCRIPT_VALIDATE_PY_CONTENT='#!/usr/bin/env python3

import json
import sys

def validate_tokens(tokens_file):
    try:
        with open(tokens_file, "r") as f:
            tokens = json.load(f)
        print(f"✅ Valid JSON: {tokens_file}")
        return True
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: validate-design-tokens.py <tokens.json>")
        sys.exit(1)
    
    if not validate_tokens(sys.argv[1]):
        sys.exit(1)'

SCRIPT_BUILD_PY_CONTENT='#!/usr/bin/env python3

import json
import os

def build_tokens(tokens_file, output_dir):
    try:
        with open(tokens_file, "r") as f:
            tokens = json.load(f)
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Example: Generate CSS variables
        css_vars = [":root {"]
        for category, values in tokens.items():
            for token, value in values.items():
                css_vars.append(f"  --{category}-{token}: {value};")
        css_vars.append("}")
        
        # Write CSS file
        css_file = os.path.join(output_dir, "tokens.css")
        with open(css_file, "w") as f:
            f.write("\n".join(css_vars))
        
        print(f"✅ Generated {css_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: build-design-tokens.py <tokens.json> <output_dir>")
        sys.exit(1)
    
    if not build_tokens(sys.argv[1], sys.argv[2]):
        sys.exit(1)'

SCRIPT_UPDATE_SH_CONTENT='#!/bin/bash

# Colors
GREEN=\'\033[0;32m\'
RED=\'\033[0;31m\'
NC=\'\033[0m\' # No Color

# Configuration
TOKENS_FILE=\'./design-tokens/tokens.json\'
OUTPUT_DIR=\'./src/styles/tokens\'

echo -e "${GREEN}\u2705 Starting Design System Update${NC}"

# Validate tokens
echo -e "\n\u231A Validating tokens..."
python3 ./scripts/validate-design-tokens.py "$TOKENS_FILE" || {
    echo -e "${RED}\u2718 Token validation failed${NC}"
    exit 1
}

# Build tokens
echo -e "\n\u2318 Building design tokens..."
python3 ./scripts/build-design-tokens.py "$TOKENS_FILE" "$OUTPUT_DIR" || {
    echo -e "${RED}\u2718 Failed to build design tokens${NC}"
    exit 1
}

echo -e "\n${GREEN}\u2705 Design system update completed successfully!${NC}"
echo "Token files have been generated in: $OUTPUT_DIR"'

# Main execution
main() {
    echo "Setting up the full Agent & Skill Infrastructure..."

    # Create Agents
    echo -e "\n${GREEN}--- Creating New Agents ---${NC}"
    create_file_if_not_exists "$AGENT_DIR" "visual-design-director.md" "$AGENT_VDD_CONTENT"
    create_file_if_not_exists "$AGENT_DIR" "design-systems-architect.md" "$AGENT_DSA_CONTENT"
    create_file_if_not_exists "$AGENT_DIR" "ux-accessibility-lead.md" "$AGENT_UXL_CONTENT"
    create_file_if_not_exists "$AGENT_DIR" "design-project-manager.md" "$AGENT_DPM_CONTENT"

    # Update Existing Agent
    echo -e "\n${CYAN}--- Updating Existing Agents ---${NC}"
    update_file "$AGENT_DIR" "frontend-specialist.md" "$AGENT_FS_CONTENT"

    # Create Design Skills
    echo -e "\n${GREEN}--- Creating New Design Skills (in $DESIGN_SKILL_DIR) ---${NC}"
    create_file_if_not_exists "$DESIGN_SKILL_DIR" "design-critique-vision.md" "$SKILL_DCV_CONTENT"
    create_file_if_not_exists "$DESIGN_SKILL_DIR" "design-token-generator.md" "$SKILL_DTG_CONTENT"
    create_file_if_not_exists "$DESIGN_SKILL_DIR" "wcag-contrast-checker.md" "$SKILL_WCC_CONTENT"
    create_file_if_not_exists "$DESIGN_SKILL_DIR" "ux-heuristic-audit.md" "$SKILL_UXA_CONTENT"

    # Create Document Skills
    echo -e "\n${MAGENTA}--- Creating New Document Skills (in $DOC_SKILL_DIR) ---${NC}"
    mkdir -p "$DOC_SKILL_DIR/pdf"
    create_file_if_not_exists "$DOC_SKILL_DIR/pdf" "SKILL.md" "$SKILL_PDF_CONTENT"
    create_file_if_not_exists "$DOC_SKILL_DIR/pdf" "forms.md" "$SKILL_PDF_FORMS_CONTENT"
    create_file_if_not_exists "$DOC_SKILL_DIR/pdf" "reference.md" "$SKILL_PDF_REFERENCE_CONTENT"

    # Create Theme Factory Skill
    echo -e "\n${BLUE}--- Creating New Theme Skill (in $THEME_SKILL_DIR) ---${NC}"
    create_file_if_not_exists "$THEME_SKILL_DIR" "SKILL.md" "$SKILL_THEME_CONTENT"

    # Create Automation Scripts
    echo -e "\n${GREEN}--- Creating Automation Scripts (in $SCRIPT_DIR) ---${NC}"
    create_file_if_not_exists "$SCRIPT_DIR" "validate-design-tokens.py" "$SCRIPT_VALIDATE_PY_CONTENT"
    create_file_if_not_exists "$SCRIPT_DIR" "build-design-tokens.py" "$SCRIPT_BUILD_PY_CONTENT"
    create_file_if_not_exists "$SCRIPT_DIR" "update-design-system.sh" "$SCRIPT_UPDATE_SH_CONTENT"

    # Make the .sh script executable
    chmod +x "$SCRIPT_DIR/update-design-system.sh"
    chmod +x "$SCRIPT_DIR/validate-design-tokens.py"
    chmod +x "$SCRIPT_DIR/build-design-tokens.py"

    # Create directory for tokens
    mkdir -p "$TOKEN_DIR"
    echo -e "${GREEN}CREATED:${NC} $TOKEN_DIR/ directory (for tokens.json)"
    
    echo -e "\n${GREEN}✅ Setup complete!${NC}"
    echo "All agents, skills, and scripts have been created or updated."
    echo -e "You can now add the new scripts to your \`claude.md\` and run the \`${YELLOW}./scripts/update-design-system.sh${NC}\` script after generating your \`${TOKEN_DIR}/tokens.json\`."
}

# Run the script
main
