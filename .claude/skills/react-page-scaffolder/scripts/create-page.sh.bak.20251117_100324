#!/bin/bash

PAGE_NAME=$1
DIR_NAME=$(echo "$PAGE_NAME" | tr '[:upper:]' '[:lower:]')
PAGE_DIR="src/pages/$DIR_NAME"

if [ -z "$PAGE_NAME" ]; then
  echo "Error: Page name not provided."
  exit 1
fi

if [ -d "$PAGE_DIR" ]; then
  echo "Error: Directory $PAGE_DIR already exists."
  exit 1
fi

mkdir -p "$PAGE_DIR"

cat << EOF > "$PAGE_DIR/$PAGE_NAME.tsx"
import React from 'react';
import styles from './$PAGE_NAME.module.css';

export const $PAGE_NAME: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>$PAGE_NAME Page</h1>
    </div>
  );
};
EOF

cat << EOF > "$PAGE_DIR/$PAGE_NAME.module.css"
.container {
  padding: 1rem;
}
EOF

cat << EOF > "$PAGE_DIR/index.tsx"
export * from './$PAGE_NAME';
EOF

echo "Successfully created new page at $PAGE_DIR"
echo "Files created:"
echo "- $PAGE_DIR/$PAGE_NAME.tsx"
echo "- $PAGE_DIR/$PAGE_NAME.module.css"
echo "- $PAGE_DIR/index.tsx"
