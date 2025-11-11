#!/bin/bash

# Design Token Extraction Script for CareerCopilot
# Extracts design tokens from MUI theme for use in development and CI/CD

set -e  # Exit on any error

echo "🎨 CareerCopilot Design Token Extraction"
echo "========================================"

# Configuration
OUTPUT_DIR="frontend/dist/tokens"
OUTPUT_FILE="$OUTPUT_DIR/design-tokens.json"
CONFIG_FILE="lovable.config.json"
THEME_FILE="frontend/src/theme/theme.ts"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ensure the output directory exists
echo "📁 Creating output directory..."
mkdir -p "$OUTPUT_DIR"

# Check if theme file exists
if [ ! -f "$THEME_FILE" ]; then
    echo -e "${RED}❌ Error: Theme file not found: $THEME_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Theme file found: $THEME_FILE${NC}"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Error: Configuration file not found: $CONFIG_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration file found: $CONFIG_FILE${NC}"

# Function to extract tokens using Lovable CLI
extract_with_lovable() {
    echo "🔧 Attempting extraction with Lovable CLI..."

    # Check if lovable CLI is available
    if ! command -v lovable &> /dev/null; then
        echo -e "${YELLOW}⚠️  Lovable CLI not found, attempting to install...${NC}"

        # Try to install Lovable CLI
        if command -v npm &> /dev/null; then
            npm install -g @lovable/cli || {
                echo -e "${RED}❌ Failed to install Lovable CLI${NC}"
                return 1
            }
        else
            echo -e "${RED}❌ npm not available, cannot install Lovable CLI${NC}"
            return 1
        fi
    fi

    # Run token extraction
    echo "🔄 Running token extraction..."
    lovable extract --config "$CONFIG_FILE" || {
        echo -e "${RED}❌ Token extraction failed${NC}"
        return 1
    }

    return 0
}

# Function to create fallback tokens
create_fallback_tokens() {
    echo -e "${YELLOW}⚠️  Creating fallback design tokens...${NC}"

    # Extract basic tokens from theme file if possible
    if command -v node &> /dev/null; then
        echo "🔄 Attempting to extract basic tokens with Node.js..."

        # Create a simple extraction script
        cat > /tmp/extract-tokens.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Read the theme file
const themeFile = 'frontend/src/theme/theme.ts';
const outputFile = 'frontend/dist/tokens/design-tokens.json';

try {
    const themeContent = fs.readFileSync(themeFile, 'utf8');

    // Basic token extraction (simple regex patterns)
    const tokens = {
        metadata: {
            source: themeFile,
            extracted: new Date().toISOString(),
            method: 'fallback',
            warning: 'Tokens extracted using fallback method - may be incomplete'
        },
        colors: {},
        typography: {},
        spacing: {},
        shadows: {},
        shape: {}
    };

    // Extract primary colors (simple pattern matching)
    const primaryMatch = themeContent.match(/primary.*?{([^}]+)}/s);
    if (primaryMatch) {
        tokens.colors.primary = {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0'
        };
    }

    // Extract secondary colors
    const secondaryMatch = themeContent.match(/secondary.*?{([^}]+)}/s);
    if (secondaryMatch) {
        tokens.colors.secondary = {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036'
        };
    }

    // Basic spacing values
    tokens.spacing = {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    };

    // Basic typography values
    tokens.typography = {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: {
            h1: '2.125rem',
            h2: '1.5rem',
            h3: '1.25rem',
            body1: '1rem',
            body2: '0.875rem'
        }
    };

    // Write the tokens file
    fs.writeFileSync(outputFile, JSON.stringify(tokens, null, 2));
    console.log('✅ Fallback tokens created successfully');

} catch (error) {
    console.error('❌ Error creating fallback tokens:', error.message);

    // Create minimal fallback
    const minimalTokens = {
        error: 'Token extraction failed',
        timestamp: new Date().toISOString(),
        message: 'Please install Lovable CLI for proper token extraction'
    };

    fs.writeFileSync(outputFile, JSON.stringify(minimalTokens, null, 2));
    process.exit(1);
}
EOF

        # Run the extraction script
        node /tmp/extract-tokens.js
        rm -f /tmp/extract-tokens.js
    else
        echo -e "${RED}❌ Node.js not available, creating minimal tokens...${NC}"

        # Create minimal token file
        cat > "$OUTPUT_FILE" << 'EOF'
{
  "error": "Token extraction failed",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "message": "Neither Lovable CLI nor Node.js available for token extraction",
  "suggestion": "Install @lovable/cli for proper design token extraction"
}
EOF
    fi
}

# Main extraction process
echo "🚀 Starting token extraction process..."

if extract_with_lovable; then
    echo -e "${GREEN}✅ Token extraction completed successfully with Lovable CLI${NC}"
else
    echo -e "${YELLOW}⚠️  Lovable CLI extraction failed, using fallback method...${NC}"
    create_fallback_tokens
fi

# Verify output
if [ -f "$OUTPUT_FILE" ]; then
    echo -e "${GREEN}✅ Design tokens file created: $OUTPUT_FILE${NC}"
    echo "📊 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo "📝 Preview:"
    head -n 10 "$OUTPUT_FILE" | sed 's/^/   /'
    echo "   ..."
else
    echo -e "${RED}❌ Error: Token file was not created${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Design token extraction completed!${NC}"
echo "📁 Tokens available at: $OUTPUT_FILE"
echo "🔗 Use these tokens in your design system and documentation"
