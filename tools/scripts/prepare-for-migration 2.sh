#!/bin/bash
# Master Migration Preparation Script
#
# Orchestrates all preparation steps for M3 migration automation
# Run this script to prepare your codebase in the correct order

set -e

echo "🚀 CareerCopilot M3 Migration Preparation"
echo "=========================================="
echo ""
echo "Updated 2025-11-28 - Uses Consolidated M3 Skills"
echo ""
echo "This script will prepare your frontend codebase for"
echo "automated Material Design 3 migration using:"
echo "  • m3-layout-tokens"
echo "  • m3-visual-tokens"
echo "  • m3-typography-tokens"
echo "  • m3-interaction-tokens"
echo "  • batch-migration-orchestrator"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SKIP_BACKUP=false
AUTO_COMMIT=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --auto-commit)
            AUTO_COMMIT=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-backup    Skip creating backups (not recommended)"
            echo "  --auto-commit    Automatically commit changes after each phase"
            echo "  --help           Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Function to prompt user
prompt_continue() {
    local message=$1
    echo ""
    echo -e "${YELLOW}$message${NC}"
    # Check if stdin is a TTY, if not skip prompt
    if [ -t 0 ]; then
        read -p "Continue? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborted by user"
            exit 0
        fi
    else
        echo "Running in non-interactive mode, continuing..."
    fi
}

# Function to create git commit
create_commit() {
    local message=$1

    if [ "$AUTO_COMMIT" = true ]; then
        echo "📝 Creating commit: $message"
        git add -A
        git commit -m "$message" || echo "Nothing to commit"
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 0: Pre-flight Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/src/components" ]; then
    echo -e "${RED}❌ Error: frontend/src/components not found${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

# Check git status
if ! git diff --quiet 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Uncommitted changes detected${NC}"
    prompt_continue "It's recommended to commit or stash changes before proceeding."
fi

# Check if scripts exist
REQUIRED_SCRIPTS=(
    "scripts/audit-component-structure.sh"
    "scripts/consolidate-duplicate-dirs.sh"
    "scripts/standardize-component-structure.sh"
    "scripts/generate-component-manifest.ts"
    "scripts/pre-migration-validation.sh"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ ! -f "$script" ]; then
        echo -e "${RED}❌ Error: Required script not found: $script${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
prompt_continue "Ready to begin migration preparation."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 1: Initial Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Running component structure audit..."
chmod +x ./scripts/audit-component-structure.sh
./scripts/audit-component-structure.sh

prompt_continue "Review the audit results above."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 2: Consolidate Duplicate Directories"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "This will:"
echo "  - Merge Ksc/KSC directories into lowercase 'ksc'"
echo "  - Rename Analysis -> analysis"
echo "  - Rename Documents -> documents"
echo "  - Update all imports automatically"

prompt_continue "This step will modify your codebase."

chmod +x ./scripts/consolidate-duplicate-dirs.sh
./scripts/consolidate-duplicate-dirs.sh

create_commit "chore: consolidate duplicate directories and standardize naming"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 3: Standardize Component Structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "This will:"
echo "  - Move loose component files into their own directories"
echo "  - Create index.ts barrel exports for all components"
echo "  - Maintain existing tests and stories"

prompt_continue "This step will restructure your components."

# First, run in dry-run mode to show what will happen
echo "Preview of changes:"
chmod +x ./scripts/standardize-component-structure.sh
./scripts/standardize-component-structure.sh --dry-run

prompt_continue "Apply these changes?"

./scripts/standardize-component-structure.sh

create_commit "chore: standardize component directory structure"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 4: Generate Component Manifest"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Generating component manifest for automation tools..."
node scripts/generate-component-manifest.ts

if [ -f "component-manifest.json" ]; then
    echo -e "${GREEN}✅ Component manifest generated${NC}"
    echo ""
    echo "Summary available at: component-manifest-summary.md"
else
    echo -e "${RED}❌ Error: Manifest generation failed${NC}"
    exit 1
fi

create_commit "chore: add component manifest for migration automation"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 5: Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Running pre-migration validation..."
chmod +x ./scripts/pre-migration-validation.sh

if ./scripts/pre-migration-validation.sh; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ SUCCESS: Codebase is ready for migration!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review all changes: git diff"
    echo "  2. Run tests: yarn test"
    echo "  3. Commit if not auto-committed:"
    echo "     git add -A && git commit -m 'chore: prepare for M3 migration'"
    echo ""
    echo "  🔧 Begin M3 Migration (Using Consolidated Skills):"
    echo "  4. Start with foundation:"
    echo "     Ask Claude: 'Generate M3 design system with m3-design-system-generator'"
    echo ""
    echo "  5. Migrate components in batches:"
    echo "     ./scripts/batch-migrate-m3.sh components-to-migrate.txt"
    echo ""
    echo "  6. Use Claude to execute migrations:"
    echo "     Ask Claude: 'Migrate Button, Input, Select to M3 Expressive'"
    echo "     Claude uses batch-migration-orchestrator (4-step protocol)"
    echo ""
    echo "  📚 Resources:"
    echo "     • M3 Migration Plan: .claude/docs/M3_MIGRATION_PLAN.md"
    echo "     • Migration Template: .claude/docs/M3_MIGRATION_TEMPLATE.md"
    echo "     • Token Reference: .claude/docs/M3_DESIGN_TOKENS_REFERENCE.md"
    echo ""
else
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  Validation incomplete - see issues above${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Additional work needed:"
    echo "  - Address failing validation checks"
    echo "  - Generate missing tests (use jest-test-scaffolder skill)"
    echo "  - Generate Storybook stories (use storybook-scaffolder skill)"
    echo "  - Re-run: ./scripts/pre-migration-validation.sh"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Preparation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$SKIP_BACKUP" = false ]; then
    echo "Backups created in: ./backups/"
fi

echo ""
echo "Generated files:"
echo "  - component-manifest.json"
echo "  - component-manifest-summary.md"
echo "  - docs/MIGRATION_READINESS.md"
echo ""
