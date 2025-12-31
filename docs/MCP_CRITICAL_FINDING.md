# CRITICAL FINDING: Antigravity Does Not Support Standard MCP

**Date:** 2025-12-29 22:13
**Status:** ROOT CAUSE IDENTIFIED

## The Problem

Antigravity (Google's VS Code fork) **DOES NOT** have native MCP (Model Context Protocol) support like Claude Desktop or standard VS Code with MCP extensions.

## Evidence

1. **No MCP extension logs**: Searching all Antigravity logs shows NO MCP initialization messages
2. **No MCP UI**: The IDE has no visible MCP interface or server list
3. **Servers running but not connected**: MCP servers are running as processes but Antigravity is not connecting to them
4. **Log shows terminal commands only**: All "mcp" mentions in logs are just terminal command outputs from our troubleshooting

## Current Server Status

**Running Processes:**
```
flash-sidekick (PID 2732)  - Running since 18:39
mcp-server-github (PID 2807) - Running since 18:39
```

**NOT Running:**
- mcp-server-playwright
- mcp-server-docker

## Why the Confusion

The configuration files are **technically correct for standard MCP**, but Antigravity:
- Doesn't read `mcp.json` files automatically
- Doesn't have built-in MCP protocol support
- The servers we have running were likely started manually or by a previous custom script, NOT by Antigravity

## What You Actually Have

Based on the running processes, someone (or some script) started:
1. `flash-sidekick` - Manually invoked Python script
2. `mcp-server-github` - Started via `npx` in a shell

But these are **orphaned processes** - Antigravity is not managing them.

## Solutions

### Option 1: Use Claude Desktop (Recommended)
Claude Desktop has native MCP support. Your current `mcp.json` files would work immediately there.

### Option 2: Manual Server Invocation
Continue starting servers manually via terminal, then use them through direct API calls or custom extensions.

### Option 3: Install VS Code MCP Extension
If you switch to VS Code proper (not Antigravity), install an MCP client extension.

### Option 4: Custom Antigravity Extension
Build a custom extension for Antigravity to add MCP support (significant effort).

## Immediate Action Required

**YOU NEED TO DECIDE:**
1. **Switch to Claude Desktop** for native MCP support?
2. **Switch to VS Code** with MCP extension?
3. **Accept that Antigravity doesn't support MCP** and use a different approach?

## Why This Wasn't Discovered Earlier

The presence of:
- Working `mcp.json` files
- Running MCP processes
- Antigravity being a VS Code fork

...created the false impression that MCP integration was supposed to work. In reality, Antigravity is a **Google-internal tool** that doesn't include the community MCP protocol support.

## Current Configuration Status

Your configurations are **100% correct** for:
- ✅ Claude Desktop
- ✅ VS Code with MCP extension
- ✅ Any standard MCP client

But **NOT compatible** with:
- ❌ Antigravity (no MCP support)

I apologize for not catching this fundamental incompatibility earlier. The issue is not with your configuration - **it's that you're using an editor that doesn't support MCP**.
