#!/bin/bash
# Fix Task Poller - Enable Real Test Generation
# Applies all necessary fixes to make the poller actually generate test files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POLLER_SCRIPT="$SCRIPT_DIR/servers/antigravity_task_poller.py"
GENERATOR_SCRIPT="$SCRIPT_DIR/servers/gemini_test_generator.py"
BACKUP_DIR="$SCRIPT_DIR/.backups/poller-$(date +%Y%m%d-%H%M%S)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ============================================================================
# STEP 1: Backup existing files
# ============================================================================

print_header "Step 1: Backup Existing Files"

mkdir -p "$BACKUP_DIR"

if [ -f "$POLLER_SCRIPT" ]; then
    cp "$POLLER_SCRIPT" "$BACKUP_DIR/antigravity_task_poller.py"
    print_success "Backed up poller to $BACKUP_DIR"
else
    print_error "Poller script not found: $POLLER_SCRIPT"
    exit 1
fi

# ============================================================================
# STEP 2: Verify generator script exists
# ============================================================================

print_header "Step 2: Verify Generator Script"

if [ ! -f "$GENERATOR_SCRIPT" ]; then
    print_error "Generator script not found: $GENERATOR_SCRIPT"
    print_info "Please ensure gemini_test_generator.py exists in servers/"
    exit 1
fi

chmod +x "$GENERATOR_SCRIPT"
print_success "Generator script verified and made executable"

# ============================================================================
# STEP 3: Install dependencies
# ============================================================================

print_header "Step 3: Install Dependencies"

print_info "Installing google-generativeai..."

# Try to use venv if available, otherwise use system Python
BACKEND_DIR="$SCRIPT_DIR/backend"
if [ -f "$BACKEND_DIR/venv/bin/activate" ]; then
    print_info "Using virtual environment..."
    cd "$BACKEND_DIR"
    source venv/bin/activate
    pip install -q google-generativeai
elif [ -f "$BACKEND_DIR/venv/bin/python3" ]; then
    print_info "Using venv Python directly..."
    "$BACKEND_DIR/venv/bin/python3" -m pip install -q google-generativeai
else
    print_warning "No venv found, using system Python..."
    python3 -m pip install --user google-generativeai
fi

print_success "Dependencies installed"

# ============================================================================
# STEP 4: Check API key
# ============================================================================

print_header "Step 4: Verify API Key"

if [ -z "$GEMINI_API_KEY" ] && [ -z "$GENKIT_GOOGLE_API_KEY" ]; then
    print_warning "No Gemini API key found in environment"
    print_info "Please set GEMINI_API_KEY or GENKIT_GOOGLE_API_KEY"

    read -p "Would you like to set it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Gemini API key: " api_key
        export GEMINI_API_KEY="$api_key"

        # Add to shell config
        if [ -f "$HOME/.zshrc" ]; then
            echo "export GEMINI_API_KEY=\"$api_key\"" >> "$HOME/.zshrc"
            print_success "Added GEMINI_API_KEY to ~/.zshrc"
        elif [ -f "$HOME/.bashrc" ]; then
            echo "export GEMINI_API_KEY=\"$api_key\"" >> "$HOME/.bashrc"
            print_success "Added GEMINI_API_KEY to ~/.bashrc"
        fi
    fi
else
    print_success "API key found in environment"
fi

# ============================================================================
# STEP 5: Apply fix to poller
# ============================================================================

print_header "Step 5: Apply Poller Fix"

# Create Python script to patch the poller
cat > /tmp/patch_poller.py << 'PYTHON_SCRIPT'
#!/usr/bin/env python3
import sys
from pathlib import Path

poller_file = Path(sys.argv[1])
content = poller_file.read_text()

# Find and replace _execute_test_generation method
old_method = '''    async def _execute_test_generation(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute test generation task."""
        logger.info("🧪 Executing test generation...")

        inputs = task.get('inputs', {})
        expected_outputs = inputs.get('expected_output', [])

        # In a real environment, this would call the actual test generator logic.
        # For now, we simulate the output as completed.

        return {
            "status": "completed",
            "files_generated": expected_outputs,
            "test_count": inputs.get('estimated_tests', 0),
            "timestamp": datetime.now().isoformat()
        }'''

new_method = '''    async def _execute_test_generation(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute test generation by calling external Gemini script."""
        logger.info("🧪 Executing test generation via Gemini API...")

        inputs = task.get('inputs', {})

        # Create temporary files for input/output
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as task_file:
            json.dump(inputs, task_file)
            task_file_path = task_file.name

        with tempfile.NamedTemporaryFile(mode='r', suffix='.json', delete=False) as output_file:
            output_file_path = output_file.name

        try:
            # Path to the Gemini test generator script
            generator_script = Path(__file__).parent / 'gemini_test_generator.py'

            if not generator_script.exists():
                logger.error(f"❌ Test generator script not found: {generator_script}")
                return {
                    "status": "failed",
                    "error": "gemini_test_generator.py not found",
                    "files_generated": [],
                    "timestamp": datetime.now().isoformat()
                }

            # Call the generator script
            logger.info(f"🚀 Calling Gemini test generator...")
            result = subprocess.run(
                [
                    'python3',
                    str(generator_script),
                    '--task-file', task_file_path,
                    '--output-file', output_file_path,
                    '--project-root', str(Path(__file__).parent.parent)
                ],
                capture_output=True,
                text=True,
                timeout=600  # 10 minute timeout
            )

            # Log output
            if result.stdout:
                logger.info(f"Generator output: {result.stdout}")
            if result.stderr:
                logger.warning(f"Generator stderr: {result.stderr}")

            # Read results
            if result.returncode == 0:
                with open(output_file_path, 'r') as f:
                    output_data = json.load(f)
                logger.info(f"✅ Test generation completed: {output_data.get('test_count', 0)} tests")
                return output_data
            else:
                logger.error(f"❌ Generator script failed with code {result.returncode}")
                return {
                    "status": "failed",
                    "error": f"Generator exited with code {result.returncode}",
                    "stderr": result.stderr,
                    "files_generated": [],
                    "timestamp": datetime.now().isoformat()
                }

        except subprocess.TimeoutExpired:
            logger.error("❌ Test generation timed out")
            return {
                "status": "failed",
                "error": "Generation timeout (600s)",
                "files_generated": [],
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"❌ Test generation error: {e}")
            return {
                "status": "failed",
                "error": str(e),
                "files_generated": [],
                "timestamp": datetime.now().isoformat()
            }

        finally:
            # Cleanup temp files
            try:
                Path(task_file_path).unlink()
                Path(output_file_path).unlink()
            except:
                pass'''

# Replace the method
if old_method in content:
    content = content.replace(old_method, new_method)
    print("✓ Replaced _execute_test_generation method")
else:
    print("✗ Could not find old method to replace")
    sys.exit(1)

# Add imports if missing
if 'import tempfile' not in content:
    # Add after other imports
    import_section = content.find('import logging')
    if import_section != -1:
        content = content[:import_section] + 'import tempfile\n' + content[import_section:]
        print("✓ Added tempfile import")

if 'import subprocess' not in content:
    import_section = content.find('import logging')
    if import_section != -1:
        content = content[:import_section] + 'import subprocess\n' + content[import_section:]
        print("✓ Added subprocess import")

# Write back
poller_file.write_text(content)
print("✓ Poller file updated successfully")
PYTHON_SCRIPT

python3 /tmp/patch_poller.py "$POLLER_SCRIPT"

if [ $? -eq 0 ]; then
    print_success "Poller patched successfully"
else
    print_error "Failed to patch poller"
    print_info "Restoring backup..."
    cp "$BACKUP_DIR/antigravity_task_poller.py" "$POLLER_SCRIPT"
    exit 1
fi

# ============================================================================
# STEP 6: Restart poller
# ============================================================================

print_header "Step 6: Restart Poller"

if [ -f "$SCRIPT_DIR/scripts/task-poller-control.sh" ]; then
    print_info "Stopping poller..."
    "$SCRIPT_DIR/scripts/task-poller-control.sh" stop || true

    sleep 2

    print_info "Starting poller..."
    "$SCRIPT_DIR/scripts/task-poller-control.sh" daemon

    sleep 3

    print_success "Poller restarted"
else
    print_warning "Poller control script not found, please restart manually"
fi

# ============================================================================
# STEP 7: Verification
# ============================================================================

print_header "Step 7: Verification"

print_info "Testing generator script..."
if python3 "$GENERATOR_SCRIPT" --help >/dev/null 2>&1; then
    print_success "Generator script is executable"
else
    print_error "Generator script has errors"
    python3 "$GENERATOR_SCRIPT" --help
fi

print_info "Checking poller status..."
if "$SCRIPT_DIR/scripts/task-poller-control.sh" status; then
    print_success "Poller is running"
else
    print_warning "Poller may not be running properly"
fi

# ============================================================================
# Summary
# ============================================================================

print_header "Fix Applied Successfully!"

cat << EOF
${GREEN}✅ Task Poller Fix Complete${NC}

What was changed:
- Backed up original poller to: $BACKUP_DIR
- Installed google-generativeai dependency
- Applied real test generation implementation
- Poller now calls Gemini API for actual code generation

Next steps:
1. Verify API key is set: echo \$GEMINI_API_KEY
2. Check poller logs: ./scripts/task-poller-control.sh logs
3. Add a test task to /tmp/kerala-rage-task-queue.json
4. Watch for "Calling Gemini test generator" in logs

To test immediately:
  # Add a test task and watch execution
  ./scripts/task-poller-control.sh logs

To revert changes:
  cp $BACKUP_DIR/antigravity_task_poller.py $POLLER_SCRIPT
  ./scripts/task-poller-control.sh restart

EOF

print_info "Backup location: $BACKUP_DIR"
