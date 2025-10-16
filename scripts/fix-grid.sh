#!/bin/bash

# Find all TSX files with Grid component imports
echo "🔍 Searching for files with Grid components..."
FILES=$(grep -rl "from.*@mui/material/Grid" frontend/src/)
COUNT=$(echo "$FILES" | wc -l | xargs)

echo "Found $COUNT files with Grid components"
FIXED=0

# Process each file
for FILE in $FILES; do
  echo "\n🔧 Processing $FILE"
  
  # Create a backup
  cp "$FILE" "${FILE}.bak"
  
  # Process the file
  awk '
  # Function to print indentation
  function indent(level) {
    for (i = 0; i < level; i++) printf "  ";
  }
  
  {
    # Check if line contains <Grid item without a container parent
    if ($0 ~ /<Grid[^>]*item[^>]*>/ && !container) {
      # Get the indentation
      match($0, /^ */);
      spaces = substr($0, 1, RLENGTH);
      
      # Print container Grid
      print spaces "<Grid container>";
      print;
      container = 1;
      level++;
    } 
    # Check for closing Grid tag
    else if ($0 ~ /<\/Grid>/) {
      if (container && level > 0) {
        level--;
        if (level == 0) {
          # Print the line and close the container
          print;
          print spaces "</Grid>";
          container = 0;
          FIXED++;
        } else {
          print;
        }
      } else {
        print;
      }
    }
    # Other lines
    else {
      print;
    }
  }
  ' "$FILE" > "${FILE}.tmp"
  
  # Check if the file was modified
  if ! diff -q "$FILE" "${FILE}.tmp" > /dev/null; then
    mv "${FILE}.tmp" "$FILE"
    echo "✅ Fixed Grid components in $FILE"
    FIXED=$((FIXED + 1))
  else
    rm "${FILE}.tmp"
    echo "ℹ️  No changes needed for $FILE"
  fi
  
  # Remove backup if no changes were made
  if diff -q "$FILE" "${FILE}.bak" > /dev/null; then
    rm "${FILE}.bak"
  fi
done

echo "\n✨ Fix complete!"
echo "✅ Fixed $FIXED of $COUNT files"
echo "💡 Please review the changes before committing."
