#!/bin/bash
# Fix missing MUI icon imports across the codebase

set -e

cd /Applications/careercopilot/frontend

echo "🔧 Fixing MUI icon imports..."

# Function to add icon to imports in a file
add_icon_import() {
  local file=$1
  local icon=$2

  # Check if file already imports from @mui/icons-material
  if grep -q "from '@mui/icons-material'" "$file"; then
    # Check if icon is already imported
    if ! grep -q "$icon" "$file"; then
      # Add to existing import
      sed -i '' "/from '@mui\/icons-material'/s/} from/,\n  $icon\n} from/" "$file"
      echo "  ✅ Added $icon to $file"
    fi
  else
    # Create new import line after React import
    sed -i '' "/^import.*from 'react'/a\\
import { $icon } from '@mui/icons-material';
" "$file"
    echo "  ✅ Created new import for $icon in $file"
  fi
}

# Fix common icon usage errors
fix_file() {
  local file=$1
  echo "Processing: $file"

  # Check what icons are used but not imported
  if grep -q "AutoAwesome" "$file" && ! grep -q "import.*AutoAwesome" "$file"; then
    add_icon_import "$file" "AutoAwesome"
  fi

  if grep -q "ChatBubble" "$file" && ! grep -q "import.*ChatBubble" "$file"; then
    add_icon_import "$file" "ChatBubble"
  fi

  if grep -q "OpenInNew" "$file" && ! grep -q "import.*OpenInNew" "$file"; then
    add_icon_import "$file" "OpenInNew"
  fi

  if grep -q "EmojiEvents" "$file" && ! grep -q "import.*EmojiEvents" "$file"; then
    add_icon_import "$file" "EmojiEvents"
  fi

  if grep -q "Schedule" "$file" && ! grep -q "import.*Schedule" "$file"; then
    add_icon_import "$file" "Schedule"
  fi

  # Replace UserPlus with PersonAdd
  if grep -q "UserPlus" "$file"; then
    sed -i '' 's/UserPlus/PersonAdd/g' "$file"
    if ! grep -q "import.*PersonAdd" "$file"; then
      add_icon_import "$file" "PersonAdd"
    fi
    echo "  ✅ Replaced UserPlus with PersonAdd in $file"
  fi
}

# Get all files with icon errors
FILES=$(yarn type-check 2>&1 | grep "Cannot find name" | grep -E "(AutoAwesome|ChatBubble|OpenInNew|EmojiEvents|Schedule|UserPlus)" | cut -d'(' -f1 | sort -u)

for file in $FILES; do
  if [ -f "$file" ]; then
    fix_file "$file"
  fi
done

echo ""
echo "✅ Icon import fixes complete!"
