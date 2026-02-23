#!/bin/bash
# MCP Server Health Check Script
# Checks status of all configured MCP servers

echo "🔍 MCP SERVER HEALTH CHECK"
echo "================================"
echo ""

# Check running MCP processes
echo "📊 Currently Running MCP Servers:"
echo "---"
ps aux | grep -E "(mcp|python.*servers)" | grep -v grep | while read line; do
    echo "  ✓ $line"
done
echo ""

# Workspace Configuration
echo "📁 Workspace Configuration (/home/njd/careercopilot/careercopilot-1/mcp.json):"
if [ -f "/home/njd/careercopilot/careercopilot-1/mcp.json" ]; then
    cat /home/njd/careercopilot/careercopilot-1/mcp.json | grep -A 2 '"command"'
    echo "  ✅ Workspace config exists"
else
    echo "  ❌ Workspace config missing"
fi
echo ""

# Global Configuration  
echo "🌐 Global Configuration (~/.config/Code/User/mcp.json):"
if [ -f "$HOME/.config/Code/User/mcp.json" ]; then
    echo "  ✅ Global config exists"
    cat ~/.config/Code/User/mcp.json | grep -c '"type"' | xargs echo "  📈 Server count:"
else
    echo "  ❌ Global config missing"
fi
echo ""

# Binary Availability
echo "🔧 MCP Binary Availability:"
which mcp-server-playwright >/dev/null 2>&1 && echo "  ✅ mcp-server-playwright: $(mcp-server-playwright --version 2>&1 | head -1)" || echo "  ❌ mcp-server-playwright: NOT FOUND"
which mcp-server-docker >/dev/null 2>&1 && echo "  ✅ mcp-server-docker: Available" || echo "  ❌ mcp-server-docker: NOT FOUND"
which mcp-server-github >/dev/null 2>&1 && echo "  ✅ mcp-server-github: Available" || echo "  ℹ️  mcp-server-github: Not installed (uses HTTP)"
ls /home/njd/careercopilot/careercopilot-1/.venv/bin/python3 >/dev/null 2>&1 && echo "  ✅ flash-sidekick: Python available" || echo "  ❌ flash-sidekick: Python missing"
echo ""

# Recent Error Logs
echo "🚨 Recent Error Logs:"
if [ -d "$HOME/.npm/_logs" ]; then
    latest_log=$(ls -t ~/.npm/_logs/*.log 2>/dev/null | head -1)
    if [ -n "$latest_log" ]; then
        echo "  ⚠️  Latest: $latest_log"
        grep -E "(404|E404|error)" "$latest_log" | head -3 | sed 's/^/    /'
    else
        echo "  ✅ No recent npm errors"
    fi
else
    echo "  ✅ No npm logs directory"
fi
echo ""

# Summary
echo "================================"
echo "📋 SUMMARY:"
expected_running=3  # flash-sidekick + github (sh) + github (node)
actual_running=$(ps aux | grep -E "(mcp|python.*servers)" | grep -v grep | wc -l)
echo "  Expected Running: $expected_running servers minimum (flash-sidekick, github)"
echo "  Actually Running: $actual_running processes"

if [ $actual_running -ge $expected_running ]; then
    echo "  ✅ STATUS: HEALTHY"
else
    echo "  ⚠️  STATUS: DEGRADED (some servers may not be running)"
fi
