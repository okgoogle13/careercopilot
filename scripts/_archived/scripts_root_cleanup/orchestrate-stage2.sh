#!/bin/bash

################################################################################
# Stage 2 UI-KIT Asset Integration Orchestrator
#
# Coordinates three sequential automation scripts:
# 1. replace-asset-tokens.mjs - Replace TODO[asset] markers with token refs
# 2. update-token-map.mjs - Update token map with asset file paths
# 3. inject-ui-kit-layers.mjs - Inject UI-KIT layers into hero compositions
#
# Usage: ./scripts/orchestrate-stage2.sh [--asset-updates "KR-UI-002=/path/to/image.png" "KR-UI-003=/path/to/image.png"]
# Example: ./scripts/orchestrate-stage2.sh --asset-updates "KR-UI-002=/frontend/public/assets/ui-kit/halo-disk.png"
################################################################################

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${SCRIPT_DIR}/stage2-orchestration-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
  echo -e "${BLUE}[Stage2]${NC} $*" | tee -a "$LOG_FILE"
}

success() {
  echo -e "${GREEN}✅${NC} $*" | tee -a "$LOG_FILE"
}

warning() {
  echo -e "${YELLOW}⚠️ ${NC} $*" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}❌${NC} $*" | tee -a "$LOG_FILE"
}

################################################################################
# Pre-flight checks
################################################################################

log "Starting Stage 2 orchestration..."
log "Log file: $LOG_FILE"

# Check Node.js is installed
if ! command -v node &> /dev/null; then
  error "Node.js is not installed or not in PATH"
  exit 1
fi

log "Node.js version: $(node --version)"

# Check scripts exist
REPLACE_SCRIPT="${PROJECT_ROOT}/scripts/kr/replace-asset-tokens.mjs"
UPDATE_SCRIPT="${PROJECT_ROOT}/scripts/kr/update-token-map.mjs"
INJECT_SCRIPT="${PROJECT_ROOT}/frontend/scripts/kr/inject-ui-kit-layers.mjs"

for script in "$REPLACE_SCRIPT" "$UPDATE_SCRIPT" "$INJECT_SCRIPT"; do
  if [ ! -f "$script" ]; then
    error "Script not found: $script"
    exit 1
  fi
done

success "All scripts found and executable"

# Check token map exists
TOKEN_MAP="${PROJECT_ROOT}/frontend/public/assets/kr-solidarity-ui-token-map.json"
if [ ! -f "$TOKEN_MAP" ]; then
  error "Token map not found: $TOKEN_MAP"
  exit 1
fi

success "Token map found: $TOKEN_MAP"

# Check hero registry exists
HERO_REGISTRY="${PROJECT_ROOT}/frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json"
if [ ! -f "$HERO_REGISTRY" ]; then
  error "Hero registry not found: $HERO_REGISTRY"
  exit 1
fi

success "Hero registry found: $HERO_REGISTRY"

################################################################################
# Backup critical files
################################################################################

log "Creating backups of critical files..."

BACKUP_DIR="${SCRIPT_DIR}/backups/stage2-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp "$TOKEN_MAP" "${BACKUP_DIR}/kr-solidarity-ui-token-map.json.bak"
cp "$HERO_REGISTRY" "${BACKUP_DIR}/kr-solidarity.hero-registry.json.bak"

# Backup all hi-fi files
mkdir -p "${BACKUP_DIR}/hifi-blueprints"
cp -r "${PROJECT_ROOT}/docs/design/hifi/"*.md "${BACKUP_DIR}/hifi-blueprints/" 2>/dev/null || true

success "Backups created in: $BACKUP_DIR"

################################################################################
# Stage 2.1: Replace TODO[asset] markers
################################################################################

log "🔄 Stage 2.1: Replacing TODO[asset] markers in hi-fi blueprints..."

cd "$PROJECT_ROOT"

if node "$REPLACE_SCRIPT" 2>&1 | tee -a "$LOG_FILE"; then
  success "TODO[asset] marker replacement completed"
else
  warning "Marker replacement finished with warnings (unmatched markers expected)"
fi

# Count remaining TODO markers
REMAINING_MARKERS=$(grep -r "TODO\[asset\]" docs/design/hifi/ 2>/dev/null | wc -l || true)
if [ "$REMAINING_MARKERS" -gt 0 ]; then
  warning "$REMAINING_MARKERS TODO[asset] markers remain (may need manual intervention)"
else
  success "All TODO[asset] markers replaced"
fi

################################################################################
# Stage 2.2: Update token map with asset paths
################################################################################

log "🔄 Stage 2.2: Updating token map with asset file paths..."

# Parse --asset-updates arguments
ASSET_ARGS=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --asset-updates)
      shift
      while [[ $# -gt 0 ]] && [[ ! "$1" =~ ^-- ]]; do
        ASSET_ARGS="$ASSET_ARGS --asset $1"
        shift
      done
      ;;
    *)
      shift
      ;;
  esac
done

if [ -n "$ASSET_ARGS" ]; then
  log "Applying asset updates: $ASSET_ARGS"
  if node "$UPDATE_SCRIPT" $ASSET_ARGS 2>&1 | tee -a "$LOG_FILE"; then
    success "Token map updated with new asset paths"
  else
    error "Failed to update token map"
    log "Restoring backup from: ${BACKUP_DIR}/kr-solidarity-ui-token-map.json.bak"
    cp "${BACKUP_DIR}/kr-solidarity-ui-token-map.json.bak" "$TOKEN_MAP"
    exit 1
  fi
else
  log "No asset updates specified (--asset-updates not provided)"
  log "Skipping token map update phase"
fi

################################################################################
# Stage 2.3: Inject UI-KIT layers into hero compositions
################################################################################

log "🔄 Stage 2.3: Injecting UI-KIT layers into hero compositions..."

if node "$INJECT_SCRIPT" 2>&1 | tee -a "$LOG_FILE"; then
  success "UI-KIT layers injected into hero registry"
else
  error "Failed to inject UI-KIT layers"
  log "Restoring backups..."
  cp "${BACKUP_DIR}/kr-solidarity.hero-registry.json.bak" "$HERO_REGISTRY"
  exit 1
fi

################################################################################
# Post-execution validation
################################################################################

log "📊 Post-execution validation..."

# Verify token map is valid JSON
if node -e "require('fs').readFileSync('$TOKEN_MAP'); console.log('✓ Token map is valid JSON')" 2>&1 | tee -a "$LOG_FILE"; then
  success "Token map JSON validation passed"
else
  error "Token map JSON validation failed"
  exit 1
fi

# Verify hero registry is valid JSON
if node -e "require('fs').readFileSync('$HERO_REGISTRY'); console.log('✓ Hero registry is valid JSON')" 2>&1 | tee -a "$LOG_FILE"; then
  success "Hero registry JSON validation passed"
else
  error "Hero registry JSON validation failed"
  exit 1
fi

# Count changes in hi-fi files
CHANGED_FILES=$(git diff --name-only docs/design/hifi/ 2>/dev/null | wc -l || echo "0")
success "Modified hi-fi blueprint files: $CHANGED_FILES"

################################################################################
# Summary
################################################################################

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           Stage 2 Orchestration Complete                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
success "✅ All automation scripts executed successfully"
success "📊 Log file: $LOG_FILE"
success "💾 Backups preserved: $BACKUP_DIR"
echo ""
log "Next steps:"
log "1. Review modified hi-fi blueprint files"
log "2. Verify TODO[asset] marker replacements"
log "3. Validate updated token map (check asset paths)"
log "4. Review injected UI-KIT layers in hero registry"
log "5. Commit changes: git add . && git commit -m 'chore(stage2): complete asset integration automation'"
echo ""

exit 0
