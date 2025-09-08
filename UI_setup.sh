#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Color Definitions for Logging ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

# --- Helper Functions ---
log_info() {
    echo -e "${CYAN}${1}${RESET}"
}

log_success() {
    echo -e "  ${GREEN}✓ ${1}${RESET}"
}

log_warning() {
    echo -e "  ${YELLOW}⚠ ${1}${RESET}"
}

log_error() {
    echo -e "  ${RED}✗ ${1}${RESET}"
}

# --- Main Script ---
log_info "--- Starting Career Copilot Project Consolidation ---"
echo -e "${YELLOW}WARNING: This script will modify and delete files.\nPlease ensure you have a backup or have committed your changes to git.${RESET}\n"
sleep 2

# --- Step 1: Consolidate CSS Styling ---
log_info "[Step 1/4] Consolidating CSS..."

if [ -f "frontend/src/index.css" ]; then
    rm frontend/src/index.css
    log_success "Deleted redundant stylesheet: frontend/src/index.css"
else
    log_warning "Skipping: frontend/src/index.css already deleted."
fi

# Check if main.tsx exists before trying to modify it
if [ -f "frontend/src/main.tsx" ]; then
    sed -i.bak 's|import "./index.css";|import "./styles/globals.css";|' frontend/src/main.tsx && rm frontend/src/main.tsx.bak
    log_success "Updated CSS import in: frontend/src/main.tsx"
else
    log_error "frontend/src/main.tsx not found. Skipping CSS import update."
fi
echo ""

# --- Step 2: Consolidate Logo Components ---
log_info "[Step 2/4] Consolidating Logo Components..."

if [ -f "frontend/src/components/FOMOLogo.tsx" ]; then
    rm frontend/src/components/FOMOLogo.tsx
    log_success "Deleted redundant component: frontend/src/components/FOMOLogo.tsx"
else
    log_warning "Skipping: frontend/src/components/FOMOLogo.tsx already deleted."
fi

if [ -f "frontend/src/components/CareerCopilotLogo.tsx" ]; then
    mv frontend/src/components/CareerCopilotLogo.tsx frontend/src/components/Logo.tsx
    log_success "Renamed CareerCopilotLogo.tsx to Logo.tsx"

    # Create the Logo component with improved structure
    cat <<'EOF' > frontend/src/components/Logo.tsx
import logoImage from 'figma:asset/cb6eaf84aec85fc7699f0c2f9000a1cb19725dc5.png';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 28, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoImage} 
        alt="Career Copilot Logo"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && (
         <span className="font-bold text-sidebar-foreground">FML Career Copilot</span>
      )}
    </div>
  );
}
EOF
    log_success "Updated frontend/src/components/Logo.tsx with reusable logic"
    log_success "Logo component setup complete"
else
    log_warning "frontend/src/components/CareerCopilotLogo.tsx not found. Skipping Logo component setup."
fi
echo ""