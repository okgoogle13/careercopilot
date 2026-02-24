#!/bin/bash
# MCP Configuration Deployment Verification Script

echo "======================================================"
echo "MCP Configuration Deployment Verification"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Antigravity/Cline Config
echo "1. Checking Antigravity (Cline) Config..."
if grep -q "flash-sidekick" ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json 2>/dev/null; then
    echo -e "${GREEN}✅ flash-sidekick configured in Antigravity${NC}"
else
    echo -e "${RED}❌ flash-sidekick NOT found in Antigravity${NC}"
fi
echo ""

# Check 2: Claude Code Config
echo "2. Checking Claude Code Config..."
if grep -q "flash-sidekick" ~/Library/Application\ Support/Code/User/mcp.json 2>/dev/null; then
    echo -e "${GREEN}✅ flash-sidekick configured in Claude Code${NC}"
else
    echo -e "${RED}❌ flash-sidekick NOT found in Claude Code${NC}"
fi
echo ""

# Check 3: Claude Desktop Config
echo "3. Checking Claude Desktop Config..."
if grep -q "flashsidekick\|flash-sidekick" ~/Library/Application\ Support/Claude/claude_desktop_config.json 2>/dev/null; then
    echo -e "${GREEN}✅ flash-sidekick configured in Claude Desktop${NC}"
else
    echo -e "${RED}❌ flash-sidekick NOT found in Claude Desktop${NC}"
fi
echo ""

# Check 4: Python Virtual Environment
echo "4. Checking Python Virtual Environment..."
if [ -f "/Users/okgoogle13/Projects/careercopilot/venv/bin/python" ]; then
    echo -e "${GREEN}✅ Python venv exists${NC}"
    /Users/okgoogle13/Projects/careercopilot/venv/bin/python --version
else
    echo -e "${RED}❌ Python venv NOT found${NC}"
fi
echo ""

# Check 5: Flash Sidekick Server File
echo "5. Checking Flash Sidekick Server..."
if [ -f "/Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py" ]; then
    echo -e "${GREEN}✅ flash_sidekick.py exists${NC}"
    ls -lh /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py
else
    echo -e "${RED}❌ flash_sidekick.py NOT found${NC}"
fi
echo ""

# Check 6: GEMINI_API_KEY
echo "6. Checking GEMINI_API_KEY..."
if [ -f "/Users/okgoogle13/Projects/careercopilot/.env" ]; then
    if grep -q "GEMINI_API_KEY" /Users/okgoogle13/Projects/careercopilot/.env; then
        echo -e "${GREEN}✅ GEMINI_API_KEY configured in .env${NC}"
    else
        echo -e "${YELLOW}⚠️  GEMINI_API_KEY not found in .env${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
fi
echo ""

# Summary
echo "======================================================"
echo "NEXT STEPS:"
echo "======================================================"
echo "1. Restart VS Code to reload MCP configs"
echo "2. Restart Claude Desktop app"
echo "3. Test flash-sidekick with: 'Use quick_summarize to summarize: hello world'"
echo ""
echo "Logs location: /tmp/mcp-flash-sidekick.log"
echo "======================================================"
