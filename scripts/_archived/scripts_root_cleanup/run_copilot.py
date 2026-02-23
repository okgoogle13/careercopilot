#!/usr/bin/env python3
"""
run_copilot.py
--------------
One-click launcher for CareerCopilot v1.0

This script:
1. Runs environment checks (doctor.py)
2. Starts backend API server
3. Starts frontend dev server
4. Opens browser to application
5. Handles graceful shutdown on Ctrl+C
"""
import subprocess
import time
import webbrowser
import os
import sys
import signal
from pathlib import Path

# ANSI color codes
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

# Global process handles
backend = None
frontend = None

def print_banner():
    """Print the CareerCopilot startup banner."""
    banner = f"""
{Colors.BLUE}{Colors.BOLD}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🚀  CareerCopilot v1.0 - Launch Sequence  🚀       ║
║                                                           ║
║     Your AI-Powered Job Application Assistant            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
{Colors.END}
"""
    print(banner)

def cleanup(signum=None, frame=None):
    """Gracefully shut down all processes."""
    global backend, frontend
    
    print(f"\n\n{Colors.YELLOW}🛑 Shutting down CareerCopilot...{Colors.END}")
    
    if backend:
        print(f"{Colors.BLUE}   → Stopping backend server{Colors.END}")
        backend.terminate()
        try:
            backend.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend.kill()
    
    if frontend:
        print(f"{Colors.BLUE}   → Stopping frontend server{Colors.END}")
        frontend.terminate()
        try:
            frontend.wait(timeout=5)
        except subprocess.TimeoutExpired:
            frontend.kill()
    
    print(f"{Colors.GREEN}✅ Shutdown complete. Goodbye!{Colors.END}\n")
    sys.exit(0)

def run_doctor():
    """Run environment checks."""
    print(f"{Colors.BOLD}🔍 Running pre-flight checks...{Colors.END}\n")
    
    doctor_path = Path("tools") / "doctor.py"
    
    if not doctor_path.exists():
        print(f"{Colors.YELLOW}⚠️  Doctor script not found at {doctor_path}{Colors.END}")
        print(f"{Colors.YELLOW}   Skipping environment checks (not recommended){Colors.END}\n")
        return True
    
    try:
        # Run doctor script and capture output
        result = subprocess.run(
            [sys.executable, str(doctor_path)],
            capture_output=False,  # Show output directly
            text=True
        )
        
        if result.returncode != 0:
            print(f"\n{Colors.RED}{Colors.BOLD}❌ Pre-flight check failed!{Colors.END}")
            print(f"{Colors.RED}Please fix the critical errors listed above.{Colors.END}\n")
            return False
        
        print(f"{Colors.GREEN}✅ Pre-flight checks passed!{Colors.END}\n")
        return True
        
    except Exception as e:
        print(f"{Colors.RED}❌ Error running doctor script: {e}{Colors.END}\n")
        return False

def start_backend():
    """Start the backend API server."""
    global backend
    
    print(f"{Colors.BOLD}🔌 Starting Backend API...{Colors.END}")
    
    # Determine Python executable (use the same one running this script)
    python_exe = sys.executable
    
    # Check if we're in a virtual environment
    venv_python = Path(".venv") / "bin" / "python"
    if os.name == 'nt':  # Windows
        venv_python = Path(".venv") / "Scripts" / "python.exe"
    
    if venv_python.exists():
        python_exe = str(venv_python)
        print(f"   {Colors.BLUE}→ Using virtual environment: {python_exe}{Colors.END}")
    
    try:
        backend = subprocess.Popen(
            [python_exe, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
            cwd="backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Give it a moment to start
        time.sleep(2)
        
        # Check if it's still running
        if backend.poll() is not None:
            # Process died, get error output
            _, stderr = backend.communicate()
            print(f"{Colors.RED}❌ Backend failed to start!{Colors.END}")
            print(f"{Colors.RED}Error: {stderr[:500]}{Colors.END}")
            return False
        
        print(f"{Colors.GREEN}   ✅ Backend running on http://localhost:8000{Colors.END}")
        return True
        
    except Exception as e:
        print(f"{Colors.RED}❌ Failed to start backend: {e}{Colors.END}")
        return False

def start_frontend():
    """Start the frontend development server."""
    global frontend
    
    print(f"{Colors.BOLD}🎨 Starting Frontend UI...{Colors.END}")
    
    # Check if node_modules exists
    if not (Path("frontend") / "node_modules").exists():
        print(f"{Colors.RED}❌ Frontend dependencies not installed!{Colors.END}")
        print(f"{Colors.YELLOW}   Run: cd frontend && yarn install{Colors.END}")
        return False
    
    try:
        frontend = subprocess.Popen(
            ["yarn", "dev"],
            cwd="frontend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=(os.name == 'nt')  # Windows compatibility
        )
        
        # Give it more time to start (Vite can be slow)
        print(f"   {Colors.BLUE}→ Waiting for Vite to start...{Colors.END}")
        time.sleep(4)
        
        # Check if it's still running
        if frontend.poll() is not None:
            _, stderr = frontend.communicate()
            print(f"{Colors.RED}❌ Frontend failed to start!{Colors.END}")
            print(f"{Colors.RED}Error: {stderr[:500]}{Colors.END}")
            return False
        
        print(f"{Colors.GREEN}   ✅ Frontend running on http://localhost:5173{Colors.END}")
        return True
        
    except FileNotFoundError:
        print(f"{Colors.RED}❌ yarn not found! Please install Node.js and Yarn{Colors.END}")
        return False
    except Exception as e:
        print(f"{Colors.RED}❌ Failed to start frontend: {e}{Colors.END}")
        return False

def open_browser():
    """Open the application in the default browser."""
    print(f"\n{Colors.BOLD}🌐 Opening browser...{Colors.END}")
    
    url = "http://localhost:5173/job-queue"
    
    try:
        webbrowser.open(url)
        print(f"{Colors.GREEN}   ✅ Browser opened to {url}{Colors.END}")
    except Exception as e:
        print(f"{Colors.YELLOW}⚠️  Could not open browser automatically: {e}{Colors.END}")
        print(f"{Colors.YELLOW}   Please open manually: {url}{Colors.END}")

def print_ready_message():
    """Print the ready message with all URLs."""
    print(f"\n{Colors.GREEN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.GREEN}{Colors.BOLD}✨  CareerCopilot is ONLINE!  ✨{Colors.END}")
    print(f"{Colors.GREEN}{Colors.BOLD}{'='*60}{Colors.END}\n")
    
    print(f"{Colors.BOLD}📍 Access Points:{Colors.END}")
    print(f"   {Colors.BLUE}→ Job Queue (Home): http://localhost:5173/job-queue{Colors.END}")
    print(f"   {Colors.BLUE}→ API Docs: http://localhost:8000/docs{Colors.END}")
    print(f"   {Colors.BLUE}→ Health Check: http://localhost:8000/health{Colors.END}")
    
    print(f"\n{Colors.BOLD}⌨️  Commands:{Colors.END}")
    print(f"   {Colors.BLUE}→ Press Ctrl+C to shutdown{Colors.END}")
    print(f"   {Colors.BLUE}→ Logs are streaming in the background{Colors.END}")
    
    print(f"\n{Colors.BOLD}📚 Quick Start:{Colors.END}")
    print(f"   {Colors.BLUE}1. Clip a job URL using the browser extension{Colors.END}")
    print(f"   {Colors.BLUE}2. Click 'Analyze with JobScout' to extract details{Colors.END}")
    print(f"   {Colors.BLUE}3. Click 'Draft Application' to generate cover letter{Colors.END}")
    print(f"   {Colors.BLUE}4. Copy and customize for your application{Colors.END}")
    
    print(f"\n{Colors.GREEN}{'='*60}{Colors.END}\n")

def main():
    """Main launch sequence."""
    global backend, frontend
    
    # Register signal handler for Ctrl+C
    signal.signal(signal.SIGINT, cleanup)
    if hasattr(signal, 'SIGTERM'):
        signal.signal(signal.SIGTERM, cleanup)
    
    # Print banner
    print_banner()
    
    # Check we're in the right directory
    if not Path("backend").exists() or not Path("frontend").exists():
        print(f"{Colors.RED}❌ Error: Must run from project root directory!{Colors.END}")
        print(f"{Colors.YELLOW}   Current directory: {os.getcwd()}{Colors.END}")
        print(f"{Colors.YELLOW}   Expected: careercopilot-1/{Colors.END}")
        sys.exit(1)
    
    # Step 1: Run doctor
    if not run_doctor():
        print(f"{Colors.RED}Aborting launch due to critical errors.{Colors.END}\n")
        sys.exit(1)
    
    # Give user a moment to read doctor output
    time.sleep(1)
    
    # Step 2: Start backend
    if not start_backend():
        print(f"\n{Colors.RED}Failed to start backend. Check logs above.{Colors.END}\n")
        cleanup()
        sys.exit(1)
    
    # Step 3: Start frontend
    if not start_frontend():
        print(f"\n{Colors.RED}Failed to start frontend. Check logs above.{Colors.END}\n")
        cleanup()
        sys.exit(1)
    
    # Step 4: Open browser
    time.sleep(2)  # Give frontend a bit more time
    open_browser()
    
    # Step 5: Print ready message
    print_ready_message()
    
    # Keep alive and monitor processes
    try:
        while True:
            # Check if processes are still running
            if backend.poll() is not None:
                print(f"\n{Colors.RED}❌ Backend process died unexpectedly{Colors.END}")
                cleanup()
                sys.exit(1)
            
            if frontend.poll() is not None:
                print(f"\n{Colors.RED}❌ Frontend process died unexpectedly{Colors.END}")
                cleanup()
                sys.exit(1)
            
            # Sleep to avoid busy-waiting
            time.sleep(1)
            
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
