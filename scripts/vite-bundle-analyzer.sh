#!/bin/bash

# Vite Bundle Analysis Script
# Comprehensive bundle analysis and optimization for Vite/React applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
FRONTEND_DIR="frontend"
OUTPUT_DIR=""
ANALYZE_ONLY=false
GENERATE_REPORT=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --analyze-only)
            ANALYZE_ONLY=true
            shift
            ;;
        --no-report)
            GENERATE_REPORT=false
            shift
            ;;
        --output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -h|--help)
            echo "Vite Bundle Analysis Script"
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --analyze-only   Only analyze existing build, don't rebuild"
            echo "  --no-report      Don't generate HTML report"
            echo "  --output-dir     Specify custom output directory"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info "Starting Vite bundle analysis..."

# Ensure we're in the project root
if [[ ! -d "$FRONTEND_DIR" ]]; then
    log_error "Frontend directory not found. Make sure you're in the project root."
    exit 1
fi

cd "$FRONTEND_DIR"

# Set output directory
if [[ -z "$OUTPUT_DIR" ]]; then
    OUTPUT_DIR="dist"
fi

# Install bundle analyzer if not available
log_info "Checking for bundle analysis tools..."

# Check if rollup-plugin-analyzer is available
if ! yarn list --pattern rollup-plugin-analyzer | grep -q "rollup-plugin-analyzer"; then
    log_info "Installing bundle analysis dependencies..."
    yarn add -D rollup-plugin-analyzer vite-bundle-analyzer
fi

# Build with analysis (unless analyze-only is specified)
if [[ "$ANALYZE_ONLY" == false ]]; then
    log_info "Building with bundle analysis enabled..."

    # Clean previous build
    yarn clean 2>/dev/null || rm -rf "$OUTPUT_DIR"

    # Create a temporary vite config for analysis
    cat > vite.config.analyze.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { analyzer } from 'rollup-plugin-analyzer'

export default defineConfig({
  plugins: [
    react(),
    analyzer({
      summaryOnly: true,
      limit: 20
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          router: ['react-router-dom'],
          toast: ['react-hot-toast'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
EOF

    # Build with analysis config
    if npx vite build --config vite.config.analyze.ts; then
        log_success "Build with analysis completed"

        # Clean up temporary config
        rm -f vite.config.analyze.ts
    else
        log_error "Build failed"
        rm -f vite.config.analyze.ts
        exit 1
    fi
else
    log_info "Analyzing existing build..."

    if [[ ! -d "$OUTPUT_DIR" ]]; then
        log_error "Build directory '$OUTPUT_DIR' not found. Run without --analyze-only first."
        exit 1
    fi
fi

# Analyze bundle structure
log_info "Analyzing bundle structure..."

# Check if dist directory exists
if [[ ! -d "$OUTPUT_DIR" ]]; then
    log_error "Build output directory '$OUTPUT_DIR' not found"
    exit 1
fi

# Get total bundle size
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
log_info "Total bundle size: $TOTAL_SIZE"

# Analyze individual files
log_info "=== Bundle Analysis Report ==="

# Find and analyze JavaScript chunks
JS_FILES=$(find "$OUTPUT_DIR" -name "*.js" -type f | sort -V)
if [[ -n "$JS_FILES" ]]; then
    echo ""
    log_info "📦 JavaScript Bundles:"
    while IFS= read -r file; do
        size=$(du -h "$file" | cut -f1)
        gzipped_size=$(gzip -c "$file" | wc -c | numfmt --to=iec)
        filename=$(basename "$file")

        # Color code based on size
        if [[ ${size//[^0-9]/} -gt 500 ]] && [[ ${size} == *"K"* ]]; then
            echo -e "  ${RED}●${NC} $filename: $size (${gzipped_size} gzipped)"
        elif [[ ${size//[^0-9]/} -gt 100 ]] && [[ ${size} == *"K"* ]]; then
            echo -e "  ${YELLOW}●${NC} $filename: $size (${gzipped_size} gzipped)"
        else
            echo -e "  ${GREEN}●${NC} $filename: $size (${gzipped_size} gzipped)"
        fi
    done <<< "$JS_FILES"
fi

# Find and analyze CSS files
CSS_FILES=$(find "$OUTPUT_DIR" -name "*.css" -type f | sort -V)
if [[ -n "$CSS_FILES" ]]; then
    echo ""
    log_info "🎨 CSS Files:"
    while IFS= read -r file; do
        size=$(du -h "$file" | cut -f1)
        filename=$(basename "$file")
        echo "  • $filename: $size"
    done <<< "$CSS_FILES"
fi

# Find and analyze asset files
ASSET_FILES=$(find "$OUTPUT_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.ico" \) | sort)
if [[ -n "$ASSET_FILES" ]]; then
    echo ""
    log_info "🖼️  Assets:"
    TOTAL_ASSET_SIZE=0
    while IFS= read -r file; do
        size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        size_human=$(du -h "$file" | cut -f1)
        filename=$(basename "$file")

        # Warn about large assets
        if [[ $size_bytes -gt 1048576 ]]; then # > 1MB
            echo -e "  ${RED}●${NC} $filename: $size_human (consider optimization)"
        elif [[ $size_bytes -gt 512000 ]]; then # > 500KB
            echo -e "  ${YELLOW}●${NC} $filename: $size_human"
        else
            echo -e "  ${GREEN}●${NC} $filename: $size_human"
        fi

        TOTAL_ASSET_SIZE=$((TOTAL_ASSET_SIZE + size_bytes))
    done <<< "$ASSET_FILES"

    TOTAL_ASSET_SIZE_HUMAN=$(echo $TOTAL_ASSET_SIZE | numfmt --to=iec)
    log_info "Total assets size: $TOTAL_ASSET_SIZE_HUMAN"
fi

# Check for common optimization opportunities
echo ""
log_info "🔍 Optimization Analysis:"

# Check for large vendor chunks
LARGE_CHUNKS=$(find "$OUTPUT_DIR" -name "*.js" -size +500k -type f)
if [[ -n "$LARGE_CHUNKS" ]]; then
    log_warning "Large JavaScript chunks detected (>500KB):"
    echo "$LARGE_CHUNKS" | while read -r file; do
        size=$(du -h "$file" | cut -f1)
        echo "  - $(basename "$file"): $size"
    done
    echo "  💡 Consider code splitting or lazy loading"
else
    log_success "All JavaScript chunks are reasonably sized"
fi

# Check for duplicate dependencies (basic analysis)
if [[ -f "package-lock.json" ]] || [[ -f "yarn.lock" ]]; then
    log_info "Checking for potential duplicate dependencies..."

    # This is a basic check - in a real scenario you might use npm ls or yarn why
    COMMON_DUPLICATES=("react" "lodash" "moment" "axios")
    for dep in "${COMMON_DUPLICATES[@]}"; do
        if grep -q "\"$dep\"" package.json && find "$OUTPUT_DIR" -name "*.js" -exec grep -l "$dep" {} \; | wc -l | awk '{if ($1 > 2) print "Potential duplicate: '$dep'"}'; then
            :  # Already handled in the find command
        fi
    done
fi

# Check for source maps
SOURCE_MAPS=$(find "$OUTPUT_DIR" -name "*.map" -type f)
if [[ -n "$SOURCE_MAPS" ]]; then
    SOURCE_MAP_COUNT=$(echo "$SOURCE_MAPS" | wc -l)
    SOURCE_MAP_SIZE=$(du -sh "$OUTPUT_DIR"/*.map 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
    log_info "Found $SOURCE_MAP_COUNT source maps"
    log_warning "Source maps add to bundle size - consider removing for production"
else
    log_success "No source maps in production build"
fi

# Performance recommendations
echo ""
log_info "📊 Performance Recommendations:"

# Bundle size recommendations
MAIN_JS=$(find "$OUTPUT_DIR" -name "index-*.js" -o -name "main-*.js" | head -1)
if [[ -n "$MAIN_JS" ]]; then
    MAIN_SIZE_KB=$(du -k "$MAIN_JS" | cut -f1)
    if [[ $MAIN_SIZE_KB -gt 244 ]]; then # 244KB is ~250KB
        log_warning "Main bundle is large (${MAIN_SIZE_KB}KB). Consider:"
        echo "  • Lazy loading routes"
        echo "  • Code splitting"
        echo "  • Tree shaking unused code"
        echo "  • Using dynamic imports"
    else
        log_success "Main bundle size is optimal (${MAIN_SIZE_KB}KB)"
    fi
fi

# Check for modern/legacy build patterns
if find "$OUTPUT_DIR" -name "*legacy*" | grep -q .; then
    log_info "Legacy build detected - good for browser compatibility"
fi

# Generate detailed HTML report if requested
if [[ "$GENERATE_REPORT" == true ]]; then
    REPORT_FILE="bundle-analysis-report.html"

    log_info "Generating detailed HTML report..."

    cat > "$REPORT_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 2rem; }
        .header { border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
        .section { margin: 2rem 0; }
        .file-list { background: #f8f9fa; padding: 1rem; border-radius: 8px; }
        .large { color: #d73a49; }
        .medium { color: #f66a0a; }
        .small { color: #28a745; }
        .stat { display: inline-block; background: #e3f2fd; padding: 0.5rem 1rem; margin: 0.25rem; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bundle Analysis Report</h1>
        <p>Generated on: $(date)</p>
    </div>
EOF

    # Add bundle statistics to HTML
    echo "    <div class=\"section\">" >> "$REPORT_FILE"
    echo "        <h2>Bundle Statistics</h2>" >> "$REPORT_FILE"
    echo "        <div class=\"stat\">Total Size: $TOTAL_SIZE</div>" >> "$REPORT_FILE"

    JS_COUNT=$(echo "$JS_FILES" | wc -l)
    CSS_COUNT=$(echo "$CSS_FILES" | wc -l)
    ASSET_COUNT=$(echo "$ASSET_FILES" | wc -l)

    echo "        <div class=\"stat\">JavaScript Files: $JS_COUNT</div>" >> "$REPORT_FILE"
    echo "        <div class=\"stat\">CSS Files: $CSS_COUNT</div>" >> "$REPORT_FILE"
    echo "        <div class=\"stat\">Assets: $ASSET_COUNT</div>" >> "$REPORT_FILE"
    echo "    </div>" >> "$REPORT_FILE"

    # Close HTML
    echo "</body></html>" >> "$REPORT_FILE"

    log_success "HTML report generated: $REPORT_FILE"
fi

# Final summary
echo ""
log_success "=== Bundle Analysis Complete ==="
log_info "Total bundle size: $TOTAL_SIZE"

# Provide quick optimization tips
echo ""
log_info "💡 Quick Tips:"
echo "  • Use 'yarn build -- --mode=analyze' for detailed Rollup analysis"
echo "  • Consider implementing route-based code splitting"
echo "  • Optimize images with tools like squoosh or imagemin"
echo "  • Use 'yarn bundle-analysis' for custom analysis scripts"
echo "  • Enable gzip compression on your server"

log_success "Bundle analysis completed! 📊"
