#!/usr/bin/env python3
"""
MCP Server Diagnostic & Validation Script
==========================================
Tests all MCP servers defined in .vscode/mcp.json and reports status.

Usage:
    python3 scripts/validate-mcp.py            # Full validation
    python3 scripts/validate-mcp.py --quick    # Env-var check only (no process spawn)
    python3 scripts/validate-mcp.py --server flash-sidekick  # Single server

Exit codes:
    0  All checks passed
    1  One or more servers failed
    2  Configuration error (bad JSON, missing file)
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

# ── ANSI colors (disabled on Windows and non-TTY) ────────────────────────────
_USE_COLOR = sys.stdout.isatty() and os.name != "nt"


def _colorize(code: str, text: str) -> str:
    return f"\033[{code}m{text}\033[0m" if _USE_COLOR else text


OK   = _colorize("32", "✓")
FAIL = _colorize("31", "✗")
WARN = _colorize("33", "⚠")
INFO = _colorize("36", "ℹ")

# ── Required environment variables per server ─────────────────────────────────
REQUIRED_ENV: dict[str, list[str]] = {
    "flash-sidekick":         ["GEMINI_API_KEY"],
    "design-system-sidekick": ["GEMINI_API_KEY"],
    "vision-scorer-mcp":      ["GEMINI_API_KEY"],
    "perplexity":             ["PERPLEXITY_API_KEY"],
    "github":                 ["GITHUB_TOKEN"],
    "task-router":            [],
    "filesystem":             [],
    "git":                    [],
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def _project_root() -> Path:
    """Return the repository root (parent of scripts/)."""
    return Path(__file__).resolve().parent.parent


def _strip_jsonc_comments(text: str) -> str:
    """Remove single-line // comments from JSONC, preserving // inside strings."""
    # Match either a JSON string (keep) or a // comment (remove).
    return re.sub(
        r'"(?:[^"\\]|\\.)*"|(//.*)' ,
        lambda m: m.group(0) if m.group(1) is None else "",
        text,
    )


def _load_config(config_path: Path) -> dict:
    """Load and return the mcpServers dict from a JSONC or JSON file."""
    raw = config_path.read_text(encoding="utf-8")
    stripped = _strip_jsonc_comments(raw)
    data = json.loads(stripped)
    return data.get("mcpServers", data.get("servers", {}))


def check_env_vars(server_name: str) -> list[str]:
    """Return a list of missing required environment variables."""
    required = REQUIRED_ENV.get(server_name, [])
    return [var for var in required if not os.environ.get(var)]


def probe_server(server_name: str, server_def: dict, timeout: int = 8) -> tuple[bool, str]:
    """
    Spawn the MCP server process, send an MCP 'initialize' request, and check
    whether it responds with a valid result.

    The process is terminated after reading one response line; MCP servers are
    long-running daemons and would otherwise block communicate() indefinitely.

    Returns (success: bool, detail: str).
    """
    command = server_def.get("command", "")
    args    = server_def.get("args", [])
    env_overrides = server_def.get("env", {})

    if not command:
        return False, "No command specified"

    # Resolve ${workspaceFolder} tokens in command/args
    root = _project_root()
    command = command.replace("${workspaceFolder}", str(root))
    resolved_args = [a.replace("${workspaceFolder}", str(root)) for a in args]

    # Build environment: inherit current env, apply overrides
    env = os.environ.copy()
    for key, val in env_overrides.items():
        resolved = re.sub(r"\$\{(\w+)\}", lambda m: os.environ.get(m.group(1), ""), val)
        if resolved:
            env[key] = resolved

    # npx-based servers often take longer on first run (package download / cache warmup).
    cmd_name = Path(command).name
    effective_timeout = timeout
    if cmd_name == "npx":
        effective_timeout = max(timeout, 30)

    # MCP initialize request
    init_msg = (
        '{"jsonrpc":"2.0","id":1,"method":"initialize",'
        '"params":{"protocolVersion":"2024-11-05",'
        '"capabilities":{},"clientInfo":{"name":"validate-mcp","version":"1.0"}}}\n'
    )

    try:
        proc = subprocess.Popen(
            [command] + resolved_args,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            text=True,
            cwd=root,
        )
        try:
            # Write the request and close stdin so the server knows input is done,
            # then read exactly one response line within the timeout window.
            proc.stdin.write(init_msg)
            proc.stdin.close()

            import threading
            result_lines: list[str] = []
            read_error: list[str] = []

            def _read_line() -> None:
                try:
                    line = proc.stdout.readline()
                    if line:
                        result_lines.append(line)
                except Exception as exc:
                    read_error.append(str(exc))

            reader = threading.Thread(target=_read_line, daemon=True)
            reader.start()
            reader.join(timeout=effective_timeout)
        finally:
            proc.kill()
            proc.wait()

        if read_error:
            return False, f"Error reading server output: {read_error[0]}"

        if not result_lines:
            stderr_hint = ""
            try:
                stderr_data = proc.stderr.read(512)
                if stderr_data:
                    stderr_hint = stderr_data.strip().splitlines()[-1]
            except Exception:
                pass
            hint = stderr_hint or "no output before timeout"
            return False, f"No response from server. Last stderr: {hint}"

        first_line = result_lines[0].strip()
        resp = json.loads(first_line)
        if "result" in resp and "serverInfo" in resp.get("result", {}):
            server_info = resp["result"]["serverInfo"]
            name = server_info.get("name", "?")
            version = server_info.get("version", "?")
            return True, f"Responded as '{name}' v{version}"
        elif "result" in resp:
            return True, "Responded with valid MCP result"
        elif "error" in resp:
            return False, f"Server returned error: {resp['error']}"
        else:
            return False, f"Unexpected response shape: {first_line[:120]}"

    except FileNotFoundError:
        return False, f"Command not found: {command!r}"
    except json.JSONDecodeError as exc:
        return False, f"Non-JSON response: {exc}"
    except Exception as exc:
        return False, f"Unexpected error: {exc}"


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(description="Validate MCP server configuration")
    parser.add_argument("--quick", action="store_true",
                        help="Only check env vars; do not spawn processes")
    parser.add_argument("--server", metavar="NAME",
                        help="Validate a single server by name")
    parser.add_argument("--config", metavar="PATH",
                        help="Path to mcp.json (default: .vscode/mcp.json)")
    args = parser.parse_args()

    root = _project_root()
    config_path = Path(args.config) if args.config else root / ".vscode" / "mcp.json"

    if not config_path.exists():
        print(f"{FAIL} Config not found: {config_path}")
        return 2

    try:
        servers = _load_config(config_path)
    except (json.JSONDecodeError, ValueError) as exc:
        print(f"{FAIL} Failed to parse {config_path}: {exc}")
        return 2

    if args.server:
        if args.server not in servers:
            print(f"{FAIL} Server '{args.server}' not found in config.")
            print(f"   Available: {', '.join(servers)}")
            return 2
        servers = {args.server: servers[args.server]}

    try:
        config_display: Path = config_path.relative_to(root)
    except ValueError:
        config_display = config_path.resolve()

    print(f"\n{INFO} Validating {len(servers)} MCP server(s) from {config_display}")
    print(f"   Mode: {'quick (env check only)' if args.quick else 'full (process probe)'}\n")

    failures = 0

    for name, server_def in servers.items():
        print(f"{'─'*60}")
        print(f"  Server: {_colorize('1', name)}")

        # 1. Environment variable check
        missing = check_env_vars(name)
        if missing:
            print(f"  {WARN} Missing env vars: {', '.join(missing)}")
            print(f"     Set these in your shell or .env file before use.")
        else:
            required = REQUIRED_ENV.get(name, [])
            if required:
                print(f"  {OK} Env vars present: {', '.join(required)}")
            else:
                print(f"  {OK} No env vars required")

        if args.quick:
            if missing:
                failures += 1
            continue

        # 2. Process probe
        print(f"  {INFO} Probing server...", end="", flush=True)
        t0 = time.monotonic()
        ok, detail = probe_server(name, server_def)
        elapsed = time.monotonic() - t0

        if ok:
            print(f"\r  {OK} Alive  ({elapsed:.1f}s) — {detail}")
        else:
            print(f"\r  {FAIL} FAILED ({elapsed:.1f}s) — {detail}")
            failures += 1

    print(f"{'─'*60}")
    if failures == 0:
        print(f"\n{OK} All {len(servers)} server(s) passed.\n")
        return 0
    else:
        print(f"\n{FAIL} {failures}/{len(servers)} server(s) failed.\n")
        print("  Troubleshooting: docs/guides/MCP_TROUBLESHOOTING.md\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
