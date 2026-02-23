#!/bin/bash
# Finds and replaces direct LLM calls with the new dispatcher service.

set -e  # Exit on any error

echo "🔄 CareerCopilot AI Optimization - Code Refactoring"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backup directory
BACKUP_DIR="refactor_backup_$(date +%Y%m%d_%H%M%S)"

echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

echo ""
echo "🔍 Searching for direct LLM calls to refactor..."

# More comprehensive patterns to find and replace
declare -A REFACTOR_PATTERNS=(
    # Genkit direct calls
    ["genkit\.generate\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "
    ["genkit\.call\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "

    # Vertex AI direct calls
    ["vertex_ai\.generate\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "
    ["vertexai\.generate\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "

    # Gemini direct calls
    ["gemini\.generate\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "
    ["vendor\.gemini\.call\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "

    # Generic AI service calls
    ["ai_service\.call\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "
    ["llm_client\.generate\("]="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "
)

# Function to suggest task type based on context
suggest_task_type() {
    local file="$1"
    local line="$2"

    # Convert to lowercase for matching
    local context=$(echo "$line" | tr '[:upper:]' '[:lower:]')

    # Suggest task types based on context clues
    if [[ $context == *"keyword"* ]] || [[ $context == *"extract"* ]] || [[ $context == *"skill"* ]]; then
        echo "keyword_extraction"
    elif [[ $context == *"resume"* ]] && [[ $context == *"parse"* ]]; then
        echo "resume_parsing"
    elif [[ $context == *"cover"* ]] && [[ $context == *"letter"* ]]; then
        echo "cover_letter_generation"
    elif [[ $context == *"resume"* ]] && [[ $context == *"optim"* ]]; then
        echo "resume_optimization"
    elif [[ $context == *"job"* ]] && [[ $context == *"match"* ]]; then
        echo "simple_classification"
    elif [[ $context == *"interview"* ]]; then
        echo "interview_preparation"
    elif [[ $context == *"career"* ]] && [[ $context == *"advice"* ]]; then
        echo "career_advice"
    elif [[ $context == *"complex"* ]] || [[ $context == *"reasoning"* ]]; then
        echo "complex_reasoning"
    elif [[ $context == *"code"* ]] && [[ $context == *"generat"* ]]; then
        echo "code_generation"
    else
        echo "resume_optimization"  # Default to balanced model
    fi
}

# Function to process a file
process_file() {
    local file="$1"
    local pattern="$2"
    local replacement="$3"

    echo -e "${BLUE}🔧 Processing: $file${NC}"

    # Create backup
    cp "$file" "$BACKUP_DIR/$(basename "$file").backup"

    # Find lines with the pattern and process them
    local changes_made=0

    while IFS= read -r line_num; do
        if [ -n "$line_num" ]; then
            # Get the actual line content
            local line_content=$(sed -n "${line_num}p" "$file")

            # Suggest task type based on context
            local suggested_task_type=$(suggest_task_type "$file" "$line_content")

            # Replace the placeholder with suggested task type
            local smart_replacement=$(echo "$replacement" | sed "s/<REPLACE_WITH_TASK_TYPE>/$suggested_task_type/g")

            echo "  Line $line_num: Replacing with task_type='$suggested_task_type'"
            echo "    Old: $(echo "$line_content" | xargs)"

            # Perform the replacement
            sed -i.tmp "s|$pattern|$smart_replacement|g" "$file"
            rm -f "$file.tmp"

            changes_made=$((changes_made + 1))
        fi
    done < <(grep -n "$pattern" "$file" | cut -d: -f1)

    if [ $changes_made -gt 0 ]; then
        echo -e "${GREEN}  ✅ Made $changes_made changes${NC}"
        return 0
    else
        echo "  ℹ️  No changes needed"
        return 1
    fi
}

# Add required imports to files that need them
add_imports() {
    local file="$1"

    # Check if file already has the import
    if grep -q "from app.ai import dispatch_llm_call" "$file"; then
        return 0
    fi

    # Check if file has any AI-related imports or uses dispatch_llm_call
    if grep -q "dispatch_llm_call" "$file"; then
        echo -e "${BLUE}📦 Adding import to: $file${NC}"

        # Find the best place to add the import (after existing imports)
        local import_line=$(grep -n "^from\|^import" "$file" | tail -1 | cut -d: -f1)

        if [ -n "$import_line" ]; then
            # Add after the last import
            sed -i.tmp "${import_line}a\\
from app.ai import dispatch_llm_call, estimate_cost" "$file"
            rm -f "$file.tmp"
            echo -e "${GREEN}  ✅ Import added${NC}"
        else
            # Add at the top of the file
            sed -i.tmp '1i\\
from app.ai import dispatch_llm_call, estimate_cost\
' "$file"
            rm -f "$file.tmp"
            echo -e "${GREEN}  ✅ Import added at top${NC}"
        fi
    fi
}

# Main refactoring process
echo ""
echo "🔍 Scanning Python files for LLM calls..."

total_files_processed=0
total_changes_made=0

# Find Python files in backend that might contain LLM calls
while IFS= read -r -d '' file; do
    # Skip __pycache__ and other non-source files
    if [[ $file == *"__pycache__"* ]] || [[ $file == *".pyc" ]]; then
        continue
    fi

    file_changed=0

    # Check each pattern
    for pattern in "${!REFACTOR_PATTERNS[@]}"; do
        replacement="${REFACTOR_PATTERNS[$pattern]}"

        # Check if file contains this pattern
        if grep -q "$pattern" "$file"; then
            if process_file "$file" "$pattern" "$replacement"; then
                file_changed=1
            fi
        fi
    done

    # Add imports if file was changed
    if [ $file_changed -eq 1 ]; then
        add_imports "$file"
        total_files_processed=$((total_files_processed + 1))
    fi

done < <(find backend -name "*.py" -type f -print0)

echo ""
echo "📋 Refactoring Summary:"
echo "  Files processed: $total_files_processed"
echo "  Backup location: $BACKUP_DIR"

if [ $total_files_processed -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  MANUAL REVIEW REQUIRED${NC}"
    echo ""
    echo "🔍 Please review the following:"
    echo "1. Verify task_type assignments are appropriate for each use case"
    echo "2. Update any hardcoded model names to use the dispatcher"
    echo "3. Test the refactored code functionality"
    echo ""
    echo "📝 Task Type Reference:"
    echo "  - keyword_extraction: For extracting skills, keywords from text"
    echo "  - resume_parsing: For parsing resume content"
    echo "  - simple_classification: For job categorization, simple matching"
    echo "  - cover_letter_generation: For generating cover letters"
    echo "  - resume_optimization: For optimizing resume content"
    echo "  - career_advice: For providing career guidance"
    echo "  - interview_preparation: For interview questions and prep"
    echo "  - complex_reasoning: For complex analysis and reasoning"
    echo "  - code_generation: For generating code"
    echo ""
    echo "🔧 Additional Manual Steps:"
    echo "1. Review files in: $BACKUP_DIR"
    echo "2. Search for remaining '<REPLACE_WITH_TASK_TYPE>' placeholders:"
    echo "   grep -r '<REPLACE_WITH_TASK_TYPE>' backend/"
    echo "3. Update any prompt formatting to work with new dispatcher"
    echo "4. Test AI service endpoints to ensure functionality"
    echo ""
    echo "🎯 Example manual fix:"
    echo "  # Before (in refactored code):"
    echo "  result = dispatch_llm_call(task_type=\"resume_optimization\", prompt=user_prompt)"
    echo "  # After (add temperature, etc. if needed):"
    echo "  result = dispatch_llm_call(task_type=\"resume_optimization\", prompt=user_prompt, temperature=0.7)"

else
    echo -e "${GREEN}✅ No LLM calls found that need refactoring${NC}"
    echo "Your codebase may already be optimized or use different patterns"
fi

echo ""
echo "🔍 Checking for remaining patterns that might need attention..."

# Check for other patterns that might need manual review
echo ""
echo "📋 Manual Review Checklist:"

# Look for model names that should be removed
model_patterns=("gemini-1.5-pro" "gemini-1.5-flash" "text-bison" "code-bison")
for model in "${model_patterns[@]}"; do
    if grep -r "$model" backend/ --include="*.py" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Found hardcoded model '$model' - consider removing${NC}"
        echo "   Files: $(grep -l "$model" backend/**/*.py | head -3 | xargs)"
    fi
done

# Look for temperature and other parameters that might need updating
if grep -r "temperature.*=" backend/ --include="*.py" >/dev/null 2>&1; then
    echo "ℹ️  Found temperature parameters - ensure they're passed to dispatch_llm_call"
fi

if grep -r "max_tokens.*=" backend/ --include="*.py" >/dev/null 2>&1; then
    echo "ℹ️  Found max_tokens parameters - ensure they're passed to dispatch_llm_call"
fi

echo ""
echo "🎉 REFACTORING COMPLETE!"
echo "======================="
echo ""
echo "📋 Next Steps:"
echo "1. Review and test refactored code"
echo "2. Run validation tests: ./scripts/run-validation-tests.sh"
echo "3. Deploy updated application to staging/production"
echo ""
echo "💡 Tips:"
echo "- Use 'git diff' to review all changes"
echo "- Test each AI endpoint individually"
echo "- Monitor logs for 'dispatch_llm_call' usage"
echo "- Verify cost optimization is working as expected"
