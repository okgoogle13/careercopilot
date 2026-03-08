#!/bin/bash
set -euo pipefail

# Default values
ENTRY_FILE=""
COMPONENT_FILE=""
OUTPUT_FILE="dist/artifact.html"
TEMP_DIR=".temp_artifact_build"
TEMP_HTML=""

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

if [[ -n "$ENTRY_FILE" && -n "$COMPONENT_FILE" ]]; then
  echo "Error: Provide only one of --entry or --component."
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is required but not found."
  exit 1
fi

mkdir -p "$TEMP_DIR"
trap 'rm -rf "$TEMP_DIR"' EXIT

# If component provided, create a wrapper entry point
if [[ -n "$COMPONENT_FILE" ]]; then
  if [[ ! -f "$COMPONENT_FILE" ]]; then
    echo "Error: Component file not found: $COMPONENT_FILE"
    exit 1
  fi

  COMPONENT_NAME=$(basename "$COMPONENT_FILE")
  COMPONENT_NAME="${COMPONENT_NAME%.*}"

  # Calculate relative path using python for cross-platform compatibility
  IMPORT_PATH=$(python3 -c "import os.path; print(os.path.relpath('${COMPONENT_FILE}', '${TEMP_DIR}'))")
  # Remove extension from import path if present
  IMPORT_PATH="${IMPORT_PATH%.tsx}"
  IMPORT_PATH="${IMPORT_PATH%.ts}"
  IMPORT_PATH="${IMPORT_PATH%.jsx}"
  IMPORT_PATH="${IMPORT_PATH%.js}"

  SCAFFOLD_ENTRY_FILE="$TEMP_DIR/index.tsx"

  cat > "$SCAFFOLD_ENTRY_FILE" <<EOF_TSX
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as ComponentModule from '${IMPORT_PATH}';
import '@/design/styles/kerala-rage.css';

const BundledComponent =
  ComponentModule.default ??
  ComponentModule.${COMPONENT_NAME};

if (!BundledComponent) {
  throw new Error(
    'Unable to resolve component export. Use default export or named export "${COMPONENT_NAME}".'
  );
}

const App = () => (
  <div className="min-h-screen bg-charcoalBackground text-whitewash p-8 flex items-center justify-center">
    <BundledComponent />
  </div>
);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Expected #root container in scaffolded HTML.');
}
const root = createRoot(container);
root.render(<App />);
EOF_TSX

  # Create HTML entry
  cat > "$TEMP_DIR/index.html" <<EOF_HTML
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
EOF_HTML

  TEMP_HTML="$TEMP_DIR/index.html"
fi

if [[ -n "$ENTRY_FILE" ]]; then
  if [[ ! -f "$ENTRY_FILE" ]]; then
    echo "Error: Entry file not found: $ENTRY_FILE"
    exit 1
  fi

  ENTRY_EXT="${ENTRY_FILE##*.}"
  if [[ "$ENTRY_EXT" == "html" ]]; then
    TEMP_HTML="$ENTRY_FILE"
  else
    IMPORT_ENTRY_PATH=$(python3 -c "import os.path; print(os.path.relpath('${ENTRY_FILE}', '${TEMP_DIR}'))")

    cat > "$TEMP_DIR/index.html" <<EOF_HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Artifact Bundle</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${IMPORT_ENTRY_PATH}"></script>
</body>
</html>
EOF_HTML

    TEMP_HTML="$TEMP_DIR/index.html"
  fi
fi

if [[ -z "$TEMP_HTML" ]]; then
  echo "Error: Unable to resolve HTML build entry."
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_FILE")"

echo "Building artifact..."
npx parcel build "$TEMP_HTML" --dist-dir "$TEMP_DIR/dist" --no-source-maps --no-content-hash

echo "Inlining assets..."
npx html-inline -i "$TEMP_DIR/dist/index.html" -o "$OUTPUT_FILE"

echo "Artifact created at $OUTPUT_FILE"
