#!/bin/bash
# V2 UPDATE: Creates page .tsx with M3 canonical layout. No .css file.
PAGE_NAME=$1
DIR_NAME=$(echo "$PAGE_NAME" | tr '[:upper:]' '[:lower:]')
PAGE_DIR="src/pages/$DIR_NAME"
mkdir -p "$PAGE_DIR"
cat << EOT > "$PAGE_DIR/$PAGE_NAME.tsx"
import React from 'react';
import { Box, Typography } from '@mui/material';
export const ${PAGE_NAME}: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '840px', mx: 'auto', p: 'var(--sys-space-5)' }}>
      <Typography variant="headline-medium" component="h1">
        ${PAGE_NAME}
      </Typography>
    </Box>
  );
};
EOT
echo "export * from './${PAGE_NAME}';" > "$PAGE_DIR/index.ts"
echo "Successfully created M3-ready page at $PAGE_DIR (No .module.css file)."
