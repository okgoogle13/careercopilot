#!/bin/bash
# Validate Claude Code Skills for Compliance

SKILLS_DIR=".claude/skills"
TOTAL_SKILLS=0
COMPLIANT_SKILLS=0
FAILED_SKILLS=()

echo "🔍 Validating Claude Code Skills in $SKILLS_DIR..."
echo "===================================================="

# Find all directories that should contain a SKILL.md
# We exclude the _legacy_archive and hidden dirs
for skill_dir in $(find "$SKILLS_DIR" -maxdepth 2 -type d -not -path "$SKILLS_DIR/_legacy_archive*" -not -path "$SKILLS_DIR" -not -path "*/.*" -not -name "templates" -not -name "references" -not -name "scripts"); do
    TOTAL_SKILLS=$((TOTAL_SKILLS + 1))
    skill_name=$(basename "$skill_dir")
    skill_md="$skill_dir/SKILL.md"

    echo -n "Checking $skill_name... "

    if [ ! -f "$skill_md" ]; then
        echo "❌ MISSING SKILL.md"
        FAILED_SKILLS+=("$skill_name (Missing SKILL.md)")
        continue
    fi

    # Check Frontmatter
    has_version=$(grep "version:" "$skill_md")
    has_tags=$(grep "tags:" "$skill_md")

    # Check Sections
    has_purpose=$(grep "## Purpose" "$skill_md")
    has_process=$(grep "## Process" "$skill_md")
    has_when_to_use=$(grep "## When to Use" "$skill_md")

    # Check for Placeholder Content (generic descriptions)
    is_placeholder=$(grep -i "Generic collection description\|Generic reference description\|Generic migration guide" "$skill_md")

    if [ -z "$has_version" ]; then
        echo "❌ MISSING version"
        FAILED_SKILLS+=("$skill_name (Missing version)")
    elif [ -z "$has_tags" ]; then
        echo "❌ MISSING tags"
        FAILED_SKILLS+=("$skill_name (Missing tags)")
    elif [ -z "$has_purpose" ]; then
        echo "❌ MISSING ## Purpose"
        FAILED_SKILLS+=("$skill_name (Missing ## Purpose)")
    elif [ -z "$has_process" ]; then
        echo "❌ MISSING ## Process"
        FAILED_SKILLS+=("$skill_name (Missing ## Process)")
    elif [ -z "$has_when_to_use" ]; then
        echo "❌ MISSING ## When to Use"
        FAILED_SKILLS+=("$skill_name (Missing ## When to Use)")
    elif [ -n "$is_placeholder" ]; then
        echo "❌ PLACEHOLDER CONTENT FOUND"
        FAILED_SKILLS+=("$skill_name (Placeholder content)")
    else
        echo "✅ OK"
        COMPLIANT_SKILLS=$((COMPLIANT_SKILLS + 1))
    fi
done

echo "===================================================="
echo "Summary: $COMPLIANT_SKILLS / $TOTAL_SKILLS skills compliant."

if [ ${#FAILED_SKILLS[@]} -ne 0 ]; then
    echo "❌ Failures:"
    for failure in "${FAILED_SKILLS[@]}"; do
        echo "  - $failure"
    done
    exit 1
else
    echo "🎉 100% Compliance Achieved!"
    exit 0
fi
