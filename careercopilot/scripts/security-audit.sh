#!/bin/bash
set -e

# =============================================================================
# Security Audit Script
# Comprehensive security check for the CareerCopilot project
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

banner() {
    echo -e "${PURPLE}$1${NC}"
}

# Security score tracking
SECURITY_SCORE=0
MAX_SCORE=0
ISSUES_FOUND=()

# Function to add score
add_score() {
    local points=$1
    local description="$2"
    SECURITY_SCORE=$((SECURITY_SCORE + points))
    MAX_SCORE=$((MAX_SCORE + points))
    success "$description (+$points points)"
}

# Function to deduct score
deduct_score() {
    local points=$1
    local description="$2"
    MAX_SCORE=$((MAX_SCORE + points))
    ISSUES_FOUND+=("$description")
    error "$description (-$points points)"
}

# Function to check file permissions
check_file_permissions() {
    local file="$1"
    local expected_perms="$2"
    
    if [ -f "$file" ]; then
        local perms=$(stat -f "%Lp" "$file" 2>/dev/null || stat -c "%a" "$file" 2>/dev/null)
        if [ "$perms" = "$expected_perms" ]; then
            add_score 5 "File $file has correct permissions ($perms)"
        else
            deduct_score 5 "File $file has incorrect permissions ($perms, expected $expected_perms)"
        fi
    fi
}

# Banner
clear
banner "
╔══════════════════════════════════════════════════════════════════════════════╗
║                           🛡️  SECURITY AUDIT                                ║
║                      CareerCopilot Security Assessment                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

# Check if running from correct directory
if [ ! -d "scripts" ] && [ ! -f "firestore.rules" ] && [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    error "Please run this script from the project root directory"
    exit 1
fi

log "Starting comprehensive security audit..."

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              1. ENVIRONMENT SECURITY"
banner "════════════════════════════════════════════════════════════════════════════════"

# Check .env file security
log "Auditing environment file security..."

if [ -f "frontend/.env" ]; then
    check_file_permissions "frontend/.env" "600"
    
    # Check for sensitive data patterns (case-insensitive)
    if grep -qiE "(password|secret|key)" frontend/.env; then
        add_score 10 "Environment file contains API keys (properly configured)"
    else
        deduct_score 10 "Environment file may be missing required API keys"
    fi
    
    # Check for placeholder values
    if grep -qE "(your-|placeholder|example|changeme)" frontend/.env; then
        deduct_score 15 "Environment file contains placeholder values"
    else
        add_score 15 "No placeholder values found in environment file"
    fi
else
    deduct_score 20 "Frontend environment file missing"
fi

if [ -f "backend/.env" ]; then
    check_file_permissions "backend/.env" "600"
    add_score 5 "Backend environment file exists"
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                             2. GIT REPOSITORY SECURITY"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Auditing git repository security..."

# Check .gitignore
if [ -f ".gitignore" ]; then
    add_score 5 ".gitignore file exists"
    
    # Check for .env patterns
    if grep -qE "^\.env$|^frontend/\.env|^backend/\.env" .gitignore; then
        add_score 15 "Environment files properly excluded in .gitignore"
    else
        deduct_score 15 "Environment files not properly excluded in .gitignore"
    fi
    
    # Check for common sensitive patterns
    SENSITIVE_PATTERNS=("node_modules" "*.log" "dist/" "build/" ".DS_Store")
    for pattern in "${SENSITIVE_PATTERNS[@]}"; do
        if grep -q "$pattern" .gitignore; then
            add_score 2 "Pattern '$pattern' excluded in .gitignore"
        fi
    done
else
    deduct_score 10 ".gitignore file missing"
fi

# Check if sensitive files are tracked
if [ -d ".git" ]; then
    if git ls-files | grep -qE "\.env$|\.key$|\.pem$|\.p12$"; then
        deduct_score 25 "Sensitive files are tracked in git"
    else
        add_score 25 "No sensitive files tracked in git"
    fi
    
    # Check for large files that might contain secrets
    if git ls-files | xargs ls -la 2>/dev/null | awk '$5 > 1048576 {print $9}' | head -5 | grep -q .; then
        warning "Large files detected in repository (may contain sensitive data)"
    fi
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                            3. DEPENDENCY SECURITY"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Auditing dependency security..."

# Check for package.json (look in current dir and parent dirs)
if [ -f "package.json" ] || [ -f "frontend/package.json" ] || [ -f "../package.json" ] || [ -f "../frontend/package.json" ]; then
    add_score 5 "Package.json found"
    
    # Check for security-related packages
    for pkg_file in "frontend/package.json" "../frontend/package.json"; do
        if [ -f "$pkg_file" ]; then
            if grep -q "helmet\|cors\|rate-limit" "$pkg_file"; then
                add_score 10 "Security-related packages detected"
            fi
            break
        fi
    done
    
    # Check for package-lock.json (dependency locking)
    if [ -f "package-lock.json" ] || [ -f "frontend/package-lock.json" ] || [ -f "../package-lock.json" ] || [ -f "../frontend/package-lock.json" ]; then
        add_score 10 "Package lock file present (dependency locking)"
    else
        deduct_score 10 "Package lock file missing (potential dependency issues)"
    fi
else
    deduct_score 5 "No package.json found"
fi

# Check Python dependencies if present
if [ -f "backend/requirements.txt" ]; then
    add_score 5 "Python requirements file found"
    
    # Check for security packages
    if grep -qE "cryptography|pyjwt|passlib|bcrypt" backend/requirements.txt; then
        add_score 10 "Security-related Python packages detected"
    fi
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                             4. FIREBASE SECURITY"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Auditing Firebase security configuration..."

# Check Firebase configuration
if [ -f "firebase.json" ] || [ -f "../firebase.json" ]; then
    add_score 5 "Firebase configuration file exists"
else
    warning "Firebase configuration file not found"
fi

# Check Firestore rules
if [ -f "firestore.rules" ]; then
    add_score 10 "Firestore security rules file exists"
    
    # Check for proper authentication
    if grep -q "request.auth != null" firestore.rules; then
        add_score 15 "Firestore rules require authentication"
    else
        deduct_score 15 "Firestore rules may allow unauthenticated access"
    fi
    
    # Check for overly permissive rules
    if grep -q "allow read, write: if true" firestore.rules; then
        deduct_score 20 "Firestore rules are overly permissive"
    else
        add_score 10 "Firestore rules appear properly restrictive"
    fi
else
    deduct_score 15 "Firestore security rules file missing"
fi

# Check Firebase hosting configuration
firebase_config=""
if [ -f "firebase.json" ]; then
    firebase_config="firebase.json"
elif [ -f "../firebase.json" ]; then
    firebase_config="../firebase.json"
fi

if [ -n "$firebase_config" ] && grep -q "hosting" "$firebase_config"; then
    add_score 5 "Firebase hosting configured"
    
    # Check for security headers
    if grep -qE "headers|csp|hsts" "$firebase_config"; then
        add_score 10 "Security headers configured in Firebase hosting"
    else
        warning "Consider adding security headers to Firebase hosting"
    fi
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                             5. API SECURITY"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Auditing API security..."

# Check for API documentation
if [ -f "backend/app/main.py" ]; then
    add_score 5 "Backend API application found"
    
    # Check for CORS configuration
    if grep -q "CORS\|cors" backend/app/main.py; then
        add_score 10 "CORS configuration detected"
    else
        warning "CORS configuration not found in main API file"
    fi
    
    # Check for rate limiting
    if grep -qE "rate.limit|limiter|throttle" backend/app/main.py; then
        add_score 15 "Rate limiting implementation detected"
    else
        deduct_score 10 "Rate limiting not detected"
    fi
    
    # Check for authentication middleware
    if grep -qE "auth|jwt|token|security" backend/app/main.py; then
        add_score 15 "Authentication middleware detected"
    else
        deduct_score 15 "Authentication middleware not detected"
    fi
fi

# Check for environment variable usage
if [ -f "frontend/.env" ]; then
    # Check that API keys are not hardcoded
    if find . -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "AIzaSy\|sk-\|pplx-" 2>/dev/null | grep -v ".env"; then
        deduct_score 25 "Hardcoded API keys detected in source code"
    else
        add_score 25 "No hardcoded API keys found in source code"
    fi
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                            6. PRODUCTION READINESS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Auditing production readiness..."

# Check for Docker security
if [ -f "Dockerfile" ] || [ -f "backend/Dockerfile" ]; then
    add_score 5 "Dockerfile found"
    
    dockerfile_path="Dockerfile"
    [ -f "backend/Dockerfile" ] && dockerfile_path="backend/Dockerfile"
    
    # Check for non-root user
    if grep -q "USER " "$dockerfile_path"; then
        add_score 10 "Docker container runs as non-root user"
    else
        deduct_score 10 "Docker container may run as root (security risk)"
    fi
    
    # Check for security best practices
    if grep -q "COPY --chown" "$dockerfile_path"; then
        add_score 5 "Docker uses proper file ownership"
    fi
fi

# Check for CI/CD security
if [ -d ".github/workflows" ]; then
    add_score 5 "GitHub Actions workflows found"
    
    # Check for secret usage
    if grep -r "secrets\." .github/workflows/ 2>/dev/null; then
        add_score 10 "GitHub Actions uses secrets properly"
    fi
    
    # Check for dangerous practices
    if grep -rE "sudo|shell.*\$" .github/workflows/ 2>/dev/null; then
        warning "Potentially dangerous practices in CI/CD workflows"
    fi
fi

# Check for monitoring and logging
if grep -rE "logging|logger|log\." . --include="*.py" --include="*.js" --include="*.ts" 2>/dev/null | head -1 >/dev/null; then
    add_score 10 "Logging implementation detected"
else
    deduct_score 5 "No logging implementation detected"
fi

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                              SECURITY RECOMMENDATIONS"
banner "════════════════════════════════════════════════════════════════════════════════"

log "Security improvement recommendations:"

echo ""
echo "🔒 HIGH PRIORITY:"
echo "  • Enable 2FA on all service accounts (GitHub, Firebase, API providers)"
echo "  • Set up API usage monitoring and alerts"
echo "  • Implement proper error handling (don't expose internal details)"
echo "  • Regular security updates for all dependencies"

echo ""
echo "🔧 MEDIUM PRIORITY:"
echo "  • Implement Content Security Policy (CSP)"
echo "  • Add security headers (HSTS, X-Frame-Options, etc.)"
echo "  • Set up automated dependency vulnerability scanning"
echo "  • Implement proper session management"

echo ""
echo "📊 LOW PRIORITY:"
echo "  • Add security audit logging"
echo "  • Implement request signing for API calls"
echo "  • Set up intrusion detection"
echo "  • Regular penetration testing"

echo ""
banner "════════════════════════════════════════════════════════════════════════════════"
banner "                                SECURITY SCORE"
banner "════════════════════════════════════════════════════════════════════════════════"

# Calculate security percentage
SECURITY_PERCENTAGE=$((SECURITY_SCORE * 100 / MAX_SCORE))

echo ""
if [ $SECURITY_PERCENTAGE -ge 80 ]; then
    echo -e "${GREEN}🎉 EXCELLENT SECURITY! 🎉${NC}"
    echo -e "${GREEN}Score: $SECURITY_SCORE/$MAX_SCORE ($SECURITY_PERCENTAGE%)${NC}"
elif [ $SECURITY_PERCENTAGE -ge 60 ]; then
    echo -e "${YELLOW}😊 GOOD SECURITY 😊${NC}"
    echo -e "${YELLOW}Score: $SECURITY_SCORE/$MAX_SCORE ($SECURITY_PERCENTAGE%)${NC}"
elif [ $SECURITY_PERCENTAGE -ge 40 ]; then
    echo -e "${YELLOW}⚠️  NEEDS IMPROVEMENT ⚠️${NC}"
    echo -e "${YELLOW}Score: $SECURITY_SCORE/$MAX_SCORE ($SECURITY_PERCENTAGE%)${NC}"
else
    echo -e "${RED}🚨 CRITICAL SECURITY ISSUES 🚨${NC}"
    echo -e "${RED}Score: $SECURITY_SCORE/$MAX_SCORE ($SECURITY_PERCENTAGE%)${NC}"
fi

echo ""
if [ ${#ISSUES_FOUND[@]} -gt 0 ]; then
    echo -e "${RED}Issues that need attention:${NC}"
    for issue in "${ISSUES_FOUND[@]}"; do
        echo "  • $issue"
    done
fi

echo ""
log "Security audit completed. Save this report and address any issues found."

# Create a security report
REPORT_FILE="security-audit-$(date +%Y%m%d_%H%M%S).txt"
{
    echo "CareerCopilot Security Audit Report"
    echo "Generated: $(date)"
    echo "Score: $SECURITY_SCORE/$MAX_SCORE ($SECURITY_PERCENTAGE%)"
    echo ""
    echo "Issues Found:"
    for issue in "${ISSUES_FOUND[@]}"; do
        echo "  • $issue"
    done
} > "$REPORT_FILE"

info "Security report saved to: $REPORT_FILE"

exit 0
