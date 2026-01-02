#!/usr/bin/env python3
"""
tools/doctor.py
---------------
Pre-flight environment checker for CareerCopilot v1.0

Verifies all required files and dependencies are in place before launch.
Returns exit code 0 if all critical checks pass, non-zero otherwise.
"""
import os
import sys
from pathlib import Path

# ANSI color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def check_file(path, is_critical=True, check_content=False, min_size=0):
    """
    Check if a file exists and optionally validate its content.
    
    Args:
        path: Path to file
        is_critical: If True, missing file is an error. If False, it's a warning.
        check_content: If True, verify file has non-empty content
        min_size: Minimum file size in bytes
        
    Returns:
        tuple: (status, message) where status is '✅', '⚠️', or '❌'
    """
    if not os.path.exists(path):
        symbol = '❌' if is_critical else '⚠️'
        return (symbol, f"Missing: {path}")
    
    # Check file size
    size = os.path.getsize(path)
    if size < min_size:
        symbol = '❌' if is_critical else '⚠️'
        return (symbol, f"Empty or too small: {path} ({size} bytes)")
    
    # Check content if requested
    if check_content:
        try:
            with open(path, 'r') as f:
                content = f.read().strip()
                if not content or len(content) < 10:
                    symbol = '❌' if is_critical else '⚠️'
                    return (symbol, f"File appears empty: {path}")
        except Exception as e:
            symbol = '❌' if is_critical else '⚠️'
            return (symbol, f"Cannot read: {path} ({e})")
    
    return ('✅', f"Found: {path}")

def check_directory(path, is_critical=True):
    """Check if a directory exists."""
    if not os.path.isdir(path):
        symbol = '❌' if is_critical else '⚠️'
        return (symbol, f"Missing directory: {path}")
    
    # Count files in directory
    try:
        file_count = len([f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))])
        return ('✅', f"Found: {path} ({file_count} files)")
    except Exception as e:
        return ('⚠️', f"Cannot access: {path} ({e})")

def print_header(text):
    """Print a formatted section header."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_check(symbol, message, details=None):
    """Print a check result with color coding."""
    if symbol == '✅':
        color = Colors.GREEN
    elif symbol == '⚠️':
        color = Colors.YELLOW
    else:
        color = Colors.RED
    
    print(f"{color}{symbol} {message}{Colors.END}")
    if details:
        print(f"   {colors.BLUE}→ {details}{Colors.END}")

def main():
    """Run all environment checks."""
    print(f"\n{Colors.BOLD}🔍 CareerCopilot v1.0 - Environment Check{Colors.END}\n")
    
    critical_errors = []
    warnings = []
    
    # ============================================================
    # CRITICAL CHECKS - Must pass for system to work
    # ============================================================
    print_header("CRITICAL DEPENDENCIES")
    
    # 1. Resume file
    resume_path = "user_profile/resume.md"
    status, msg = check_file(resume_path, is_critical=True, check_content=True, min_size=100)
    print_check(status, msg)
    if status == '❌':
        critical_errors.append("Resume file missing or empty")
        print(f"   {Colors.YELLOW}→ Add your resume to: {resume_path}{Colors.END}")
        print(f"   {Colors.YELLOW}→ See: user_profile/README.md for instructions{Colors.END}")
    
    # 2. Frontend node_modules
    node_modules = "frontend/node_modules"
    status, msg = check_directory(node_modules, is_critical=True)
    print_check(status, msg)
    if status == '❌':
        critical_errors.append("Frontend dependencies not installed")
        print(f"   {Colors.YELLOW}→ Run: cd frontend && npm install{Colors.END}")
    
    # 3. Backend virtual environment
    venv_path = ".venv/bin/python"
    if os.name == 'nt':  # Windows
        venv_path = ".venv/Scripts/python.exe"
    status, msg = check_file(venv_path, is_critical=True)
    print_check(status, msg)
    if status == '❌':
        critical_errors.append("Python virtual environment not found")
        print(f"   {Colors.YELLOW}→ Run: python -m venv .venv{Colors.END}")
        print(f"   {Colors.YELLOW}→ Then: source .venv/bin/activate && pip install -r backend/requirements.txt{Colors.END}")
    
    # ============================================================
    # OPTIONAL CHECKS - Warnings only
    # ============================================================
    print_header("OPTIONAL FEATURES")
    
    # 4. Google Workspace credentials
    google_creds = "credentials.json"
    status, msg = check_file(google_creds, is_critical=False, min_size=50)
    print_check(status, msg)
    if status == '⚠️':
        warnings.append("Google Workspace disabled (Calendar/Tasks/Docs)")
        print(f"   {Colors.BLUE}→ Calendar and Task integration disabled{Colors.END}")
        print(f"   {Colors.BLUE}→ To enable: Add credentials.json (see docs/FIREBASE_CREDENTIALS_SETUP.md){Colors.END}")
    
    # 5. Firebase credentials (Firestore)
    firebase_creds = "firebase_credentials.json"
    status, msg = check_file(firebase_creds, is_critical=False, min_size=50)
    print_check(status, msg)
    if status == '⚠️':
        warnings.append("Firestore disabled (data will not persist)")
        print(f"   {Colors.BLUE}→ Data will be lost on server restart{Colors.END}")
        print(f"   {Colors.BLUE}→ To enable: Add firebase_credentials.json (see docs/FIREBASE_CREDENTIALS_SETUP.md){Colors.END}")
    
    # ============================================================
    # CONFIGURATION FILES
    # ============================================================
    print_header("CONFIGURATION")
    
    # 6. Backend configuration
    backend_main = "backend/app/main.py"
    status, msg = check_file(backend_main, is_critical=True)
    print_check(status, msg)
    if status == '❌':
        critical_errors.append("Backend application files missing")
    
    # 7. Frontend entry point
    frontend_entry = "frontend/src/main.tsx"
    status, msg = check_file(frontend_entry, is_critical=True)
    print_check(status, msg)
    if status == '❌':
        critical_errors.append("Frontend application files missing")
    
    # ============================================================
    # SUMMARY
    # ============================================================
    print_header("SUMMARY")
    
    if critical_errors:
        print(f"{Colors.RED}{Colors.BOLD}❌ CRITICAL ERRORS ({len(critical_errors)}):{Colors.END}")
        for error in critical_errors:
            print(f"   {Colors.RED}• {error}{Colors.END}")
    else:
        print(f"{Colors.GREEN}{Colors.BOLD}✅ All critical checks passed!{Colors.END}")
    
    if warnings:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠️  WARNINGS ({len(warnings)}):{Colors.END}")
        for warning in warnings:
            print(f"   {Colors.YELLOW}• {warning}{Colors.END}")
    
    # Final verdict
    print("\n" + "="*60)
    if critical_errors:
        print(f"{Colors.RED}{Colors.BOLD}STATUS: NOT READY{Colors.END}")
        print(f"{Colors.RED}Please fix the critical errors above before launching.{Colors.END}")
        print("="*60 + "\n")
        return 1  # Exit with error code
    else:
        print(f"{Colors.GREEN}{Colors.BOLD}STATUS: READY TO LAUNCH ✨{Colors.END}")
        if warnings:
            print(f"{Colors.YELLOW}⚠️  Some features will be disabled (see warnings above){Colors.END}")
        else:
            print(f"{Colors.GREEN}All features enabled!{Colors.END}")
        print("="*60 + "\n")
        return 0  # Success

if __name__ == "__main__":
    sys.exit(main())
