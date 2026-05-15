#!/usr/bin/env python3
"""
Synchronize home MCP configs from the repo's canonical .vscode/mcp.json.

Antigravity gets a pure-JSON mirror suitable for symlinking.
Claude Desktop gets a leaner generated config that preserves preferences and
omits redundant servers that Claude already provides natively.
Claude Code (~/.claude.json) gets project-specific patches for env vars and context.
"""

from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CANONICAL_JSONC = ROOT / ".vscode" / "mcp.json"
DOT_ENV_MCP = ROOT / ".env.mcp"

HOME = Path.home()
AI_DIR = HOME / ".ai" / "mcp"
ANTIGRAVITY_CANONICAL = AI_DIR / "mcp_config.json"
ANTIGRAVITY_LINK = HOME / ".gemini" / "antigravity" / "mcp_config.json"
CLAUDE_CONFIG = HOME / "Library" / "Application Support" / "Claude" / "claude_desktop_config.json"
CLAUDE_INTERNAL_CONFIG = HOME / ".claude.json"

# Claude already exposes native Filesystem tooling, and sequential-thinking is
# better kept off the default Claude Desktop profile to limit catalog churn.
CLAUDE_EXCLUDE_SERVERS = {"filesystem", "task-router", "sequential-thinking"}

# Context-heavy servers to disable for the CareerCopilot project to save tokens.
CLAUDE_HEAVY_SERVERS = {"notion", "canva", "figma", "gcalendar", "claude_ai_Google_Calendar"}

# Plugins that are failing to load from the official marketplace.
CLAUDE_FAILED_PLUGINS = {
    "frontend-design", "code-review", "code-simplifier", "playwright",
    "feature-dev", "claude-code-setup", "figma", "context7",
    "skill-creator", "superpowers", "vercel", "sentry", "firebase",
    "commit-commands"
}

SERVER_ENV_DEFAULTS = {
    "flash-sidekick": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GEMINI_MODEL": "models/gemini-3-flash-preview",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro",
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "SENTRY_DSN": "${SENTRY_DSN}",
    },
    "design-system-sidekick": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GEMINI_PERFORMANCE_MODEL": "models/gemini-3-flash-preview",
        "GEMINI_LTS_MODEL": "models/gemini-2.5-pro",
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "SENTRY_DSN": "${SENTRY_DSN}",
    },
    "vision-scorer-mcp": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
    },
    "perplexity": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}",
    },
    "github": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
    },
    "filesystem": {
        "MCP_WORKSPACE_ROOT": str(ROOT),
    },
}


def load_env(env_path: Path) -> dict[str, str]:
    """Simple parser for .env files."""
    env = {}
    if not env_path.exists():
        return env
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            key, value = line.split("=", 1)
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def strip_jsonc_comments(text: str) -> str:
    return re.sub(
        r'"(?:[^"\\]|\\.)*"|(//.*)',
        lambda match: match.group(0) if match.group(1) is None else "",
        text,
    )


def load_jsonc(path: Path) -> dict:
    return json.loads(strip_jsonc_comments(path.read_text(encoding="utf-8")))


def resolve_value(value: str, env_vars: dict[str, str], *, resolve_env_placeholders: bool = True) -> str:
    value = value.replace("${workspaceFolder}", str(ROOT))

    # Resolve ${VAR} from env_vars
    if resolve_env_placeholders:
        placeholders = re.findall(r"\${([^}]+)}", value)
        for ph in placeholders:
            if ph in env_vars:
                value = value.replace(f"${{{ph}}}", env_vars[ph])
            elif ph == "workspaceFolder":  # Already handled but for safety
                pass

    if value == "venv/bin/python":
        # Prefer the repo-local venv with current server dependencies.
        return str((ROOT / ".venv" / "bin" / "python").resolve())
    return value


def normalize_server(server: dict, env_vars: dict[str, str]) -> dict:
    normalized = deepcopy(server)
    if "command" in normalized and isinstance(normalized["command"], str):
        normalized["command"] = resolve_value(normalized["command"], env_vars)
    if "args" in normalized:
        normalized["args"] = [resolve_value(arg, env_vars) if isinstance(arg, str) else arg for arg in normalized["args"]]
    return normalized


def apply_server_defaults(name: str, server: dict, env_vars: dict[str, str]) -> dict:
    normalized = normalize_server(server, env_vars)
    env = dict(normalized.get("env", {}))
    # Merge defaults from the script
    env.update(SERVER_ENV_DEFAULTS.get(name, {}))
    # Preserve env placeholders in generated configs so secrets stay out of
    # the generated JSON. Only resolve workspace-relative command paths.
    if env:
        resolved_env = {}
        for k, v in env.items():
            resolved_env[k] = (
                resolve_value(v, env_vars, resolve_env_placeholders=False)
                if isinstance(v, str)
                else v
            )
        normalized["env"] = resolved_env
    return normalized


def build_antigravity_config(base: dict, env_vars: dict[str, str]) -> dict:
    servers = {
        name: apply_server_defaults(name, server, env_vars)
        for name, server in base.get("mcpServers", {}).items()
    }
    return {
        "_comment": [
            "Generated from /Users/okgoogle13/Projects/careercopilot/.vscode/mcp.json.",
            "Do not edit this file directly; run scripts/sync-mcp-configs.py instead.",
        ],
        "mcpServers": servers,
    }


def build_claude_config(base: dict, existing: dict | None, env_vars: dict[str, str]) -> dict:
    servers = {}
    for name, server in base.get("mcpServers", {}).items():
        if name in CLAUDE_EXCLUDE_SERVERS:
            continue
        servers[name] = apply_server_defaults(name, server, env_vars)

    # Claude-specific adjustments for lower overhead and compatibility.
    servers.pop("figma-dev-mode-mcp-server", None)

    preferences = {}
    if existing:
        preferences = existing.get("preferences", {})

    return {
        "mcpServers": servers,
        "preferences": preferences,
    }


def patch_internal_claude_config(env_vars: dict[str, str]) -> None:
    """Patch the internal ~/.claude.json for the project context."""
    if not CLAUDE_INTERNAL_CONFIG.exists():
        return

    try:
        config = json.loads(CLAUDE_INTERNAL_CONFIG.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print(f"Warning: Could not parse {CLAUDE_INTERNAL_CONFIG}")
        return

    # 1. Purge failed plugins from global lists
    if "cachedGrowthBookFeatures" in config:
        features = config["cachedGrowthBookFeatures"]
        if "tengu_harbor_ledger" in features:
            features["tengu_harbor_ledger"] = [
                p for p in features["tengu_harbor_ledger"]
                if p.get("plugin") not in CLAUDE_FAILED_PLUGINS
            ]
        if "tengu_amber_lattice" in features:
            lattice = features["tengu_amber_lattice"]
            if "plugins" in lattice:
                lattice["plugins"] = [
                    p for p in lattice["plugins"]
                    if p not in CLAUDE_FAILED_PLUGINS
                ]

    # 2. Patch CareerCopilot project entry
    projects = config.get("projects", {})
    # Find active project by path
    project_path = str(ROOT)
    if project_path in projects:
        project = projects[project_path]

        # Resolve server envs
        if "mcpServers" in project:
            for name, server in project["mcpServers"].items():
                if "env" in server:
                    for k, v in server["env"].items():
                        if isinstance(v, str):
                            server["env"][k] = resolve_value(
                                v,
                                env_vars,
                                resolve_env_placeholders=False,
                            )

        # Disable heavy servers to save context
        disabled = set(project.get("disabledMcpServers", []))
        for heavy in CLAUDE_HEAVY_SERVERS:
            # Force add to disabled list to recover context from global servers
            disabled.add(heavy)
        project["disabledMcpServers"] = list(disabled)

    write_json(CLAUDE_INTERNAL_CONFIG, config)
    print(f"Patched {CLAUDE_INTERNAL_CONFIG}")


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def ensure_symlink(link_path: Path, target_path: Path) -> None:
    link_path.parent.mkdir(parents=True, exist_ok=True)
    if link_path.is_symlink() or link_path.exists():
        link_path.unlink()
    link_path.symlink_to(target_path)


def main() -> int:
    base = load_jsonc(CANONICAL_JSONC)
    env_vars = load_env(DOT_ENV_MCP)

    existing_claude = None
    if CLAUDE_CONFIG.exists():
        existing_claude = json.loads(CLAUDE_CONFIG.read_text(encoding="utf-8"))

    antigravity_payload = build_antigravity_config(base, env_vars)
    claude_payload = build_claude_config(base, existing_claude, env_vars)

    write_json(ANTIGRAVITY_CANONICAL, antigravity_payload)
    write_json(CLAUDE_CONFIG, claude_payload)
    ensure_symlink(ANTIGRAVITY_LINK, ANTIGRAVITY_CANONICAL)

    patch_internal_claude_config(env_vars)

    print(f"Wrote {ANTIGRAVITY_CANONICAL}")
    print(f"Symlinked {ANTIGRAVITY_LINK} -> {ANTIGRAVITY_CANONICAL}")
    print(f"Wrote {CLAUDE_CONFIG}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
