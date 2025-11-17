#!/bin/bash
# V2 UPDATE: Creates .tsx and index.ts. No longer creates a .css file.
PARENT_DIR=$1
COMPONENT_NAME=$2
COMPONENT_DIR="$PARENT_DIR/$COMPONENT_NAME"
mkdir -p "$COMPONENT_DIR"
# Create ComponentName.tsx
cat << EOT > "$COMPONENT_DIR/$COMPONENT_NAME.tsx"
import React from 'react';
import { Box } from '@mui/material';
export interface ${COMPONENT_NAME}Props {}
export const ${COMPONENT_NAME}: React.FC<${COMPONENT_NAME}Props> = (props) => {
  return (
    <Box sx={{ p: 'var(--sys-space-4)', color: 'var(--sys-color-on-surface)' }}>
      <h1>${COMPONENT_NAME}</h1>
    </Box>
  );
};
EOT
# Create index.ts
echo "export * from './${COMPONENT_NAME}';" > "$COMPONENT_DIR/index.ts"
echo "Successfully created M3-ready component at $COMPONENT_DIR (No .module.css file)."
