#!/bin/bash
set -e

# Default values
ENTRY_FILE=""
COMPONENT_FILE=""
OUTPUT_FILE="dist/artifact.html"
TEMP_DIR=".temp_artifact_build"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --entry) ENTRY_FILE="$2"; shift ;;
        --component) COMPONENT_FILE="$2"; shift ;;
        --output) OUTPUT_FILE="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Validate inputs
if [[ -z "$ENTRY_FILE" && -z "$COMPONENT_FILE" ]]; then
    echo "Error: You must provide either --entry or --component."
    exit 1
fi

mkdir -p "$TEMP_DIR"

# If component provided, create a wrapper entry point
if [[ -n "$COMPONENT_FILE" ]]; then
    COMPONENT_NAME=$(basename "$COMPONENT_FILE" .tsx)
    # Calculate relative path using python for cross-platform compatibility
    IMPORT_PATH=$(python3 -c "import os.path; print(os.path.relpath('${COMPONENT_FILE}', '${TEMP_DIR}'))")
    # Remove extension from import path if present
    IMPORT_PATH="${IMPORT_PATH%.tsx}"

    ENTRY_FILE="$TEMP_DIR/index.tsx"
    
    cat > "$ENTRY_FILE" <<EOF
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ${COMPONENT_NAME} } from '${IMPORT_PATH}';
import '@/design/styles/kerala-rage.css'; // Import global styles

const App = () => (
    <div className="min-h-screen bg-charcoalBackground text-whitewash p-8 flex items-center justify-center">
        <${COMPONENT_NAME} />
    </div>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
EOF

    # Create HTML entry
    cat > "$TEMP_DIR/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${COMPONENT_NAME} Artifact</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
</body>
</html>
EOF
fi

# Build with Parcel
echo "Building artifact..."
npx parcel build "$TEMP_DIR/index.html" --dist-dir "$TEMP_DIR/dist" --no-source-maps --no-content-hash

# Inline assets
echo "Inlining assets..."
npx html-inline -i "$TEMP_DIR/dist/index.html" -o "$OUTPUT_FILE"

# Cleanup
rm -rf "$TEMP_DIR"

echo "Artifact created at $OUTPUT_FILE"
