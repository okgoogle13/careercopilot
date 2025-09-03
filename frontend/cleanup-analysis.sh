bash << 'END_SCRIPT'
#!/bin/bash

# ==============================================================================
# Career Copilot: Project Cleanup Analysis Script
# ==============================================================================
# This script uses 'knip' to analyze the project and find unused files,
# dependencies, and exports. It provides a report for manual review before
# any files are deleted.
# ==============================================================================

# --- Helper Functions for colored output ---
color_green() {
    echo -e "\033[32m$1\033[0m"
}
color_yellow() {
    echo -e "\033[33m$1\033[0m"
}
color_red() {
    echo -e "\033[31m$1\033[0m"
}

color_green "🚀 Starting Career Copilot Project Cleanup Analysis..."
echo ""

# --- 1. Install knip ---
color_yellow "-> Checking for and installing 'knip'..."
if ! npm list knip &>/dev/null; then
    npm install knip --save-dev
else
    echo "   - 'knip' is already installed."
fi
echo ""

# --- 2. Run the analysis ---
color_yellow "-> Running 'knip' to find unused files and exports..."
echo "   This may take a moment..."
echo "----------------------------------------------------------------------"

npx knip || true

echo "----------------------------------------------------------------------"
echo ""

# --- 3. Provide next steps ---
color_green "✅ Analysis Complete!"
echo ""
color_yellow "Next Steps:"
echo "1. Review the list of $(color_red "'Unused files'") and $(color_red "'Unused exports'") above."
echo "2. $(color_red "CAREFULLY") review each item. Some files like Vite/PostCSS configs might be reported but are necessary."
echo "3. Safely delete the confirmed unused files from your project."
echo "4. After deleting files, run $(color_green "'npm run dev'") to ensure the application still works correctly."
echo ""
echo "For this project, you can likely safely delete:"
echo "   - $(color_yellow "src/components/AnimatedComponents.tsx")"
echo "   - $(color_yellow "src/components/CardShowcase.tsx") (if it still exists)"
echo "   - $(color_yellow "src/components/ComponentUsageGuide.tsx") (if it still exists)"
echo "   - $(color_yellow "src/components/figma/ImageWithFallback.tsx")"
echo "   - $(color_yellow "src/Attributions.md")"
echo "   - $(color_yellow "src/cleanup-notes.md")"
echo "   - $(color_yellow "src/guidelines/Guidelines.md")"

END_SCRIPT
