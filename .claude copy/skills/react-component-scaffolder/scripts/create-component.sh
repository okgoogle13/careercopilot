#!/bin/bash

PARENT_DIR=$1
COMPONENT_NAME=$2
COMPONENT_DIR="$PARENT_DIR/$COMPONENT_NAME"

if [ -z "$PARENT_DIR" ] || [ -z "$COMPONENT_NAME" ]; then
  echo "Error: Parent directory or component name not provided."
  echo "Usage: $0 <ParentDirectory> <ComponentName>"
  exit 1
fi

if [ -d "$COMPONENT_DIR" ]; then
  echo "Error: Directory $COMPONENT_DIR already exists."
  exit 1
fi

mkdir -p "$COMPONENT_DIR"

# Create ComponentName.tsx
cat << EOF > "$COMPONENT_DIR/$COMPONENT_NAME.tsx"
import React from 'react';
import styles from './$COMPONENT_NAME.module.css';

export interface ${COMPONENT_NAME}Props {
  // TODO: Add props
}

export const $COMPONENT_NAME: React.FC<${COMPONENT_NAME}Props> = (props) => {
  return (
    <div className={styles.wrapper}>
      {/* TODO: Implement component */}
      <h1>$COMPONENT_NAME</h1>
    </div>
  );
};
EOF

# Create ComponentName.module.css
cat << EOF > "$COMPONENT_DIR/$COMPONENT_NAME.module.css"
.wrapper {
  /* TODO: Add styles */
}
EOF

# Create index.tsx
cat << EOF > "$COMPONENT_DIR/index.tsx"
export * from './$COMPONENT_NAME';
EOF

echo "Successfully created new component at $COMPONENT_DIR"
echo "Files created:"
echo "- $COMPONENT_DIR/$COMPONENT_NAME.tsx"
echo "- $COMPONENT_DIR/$COMPONENT_NAME.module.css"
echo "- $COMPONENT_DIR/index.tsx"
