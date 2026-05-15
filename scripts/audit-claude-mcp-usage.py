#!/usr/bin/env python3
"""
Audit Claude MCP usage for token-efficiency red flags.

Reports:
- per-server method counts
- filesystem vs flash-sidekick offload ratios
- duplicate server families (e.g. Filesystem + filesystem)
- initialization/list churn versus actual tool calls
"""

from __future__ import annotations

import argparse
import collections
import json
import pathlib
import re
import sys
from typing import Optional


DEFAULT_LOG = pathlib.Path.home() / "Library" / "Logs" / "Claude" / "mcp.log"
CLIENT_RE = re.compile(r"\[([^\]]+)\] Message from client: (.+)$")
METHOD_RE = re.compile(r'"method":"([^"]+)"')
TIMESTAMP_RE = re.compile(r"^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)\s")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit Claude MCP usage patterns")
    parser.add_argument("--log", default=str(DEFAULT_LOG), help="Path to Claude MCP log")
    parser.add_argument(
        "--since",
        help="Only include log lines at or after this ISO-8601 UTC timestamp, e.g. 2026-04-05T07:54:41.000Z",
    )
    parser.add_argument(
        "--until",
        help="Only include log lines at or before this ISO-8601 UTC timestamp, e.g. 2026-04-05T09:58:39.953Z",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=12,
        help="Number of top servers/methods to show",
    )
    return parser.parse_args()


def line_in_window(line: str, since: Optional[str], until: Optional[str]) -> bool:
    if not since and not until:
        return True

    timestamp_match = TIMESTAMP_RE.match(line)
    if not timestamp_match:
        return False

    timestamp = timestamp_match.group(1)
    if since and timestamp < since:
        return False
    if until and timestamp > until:
        return False
    return True


def load_counts(
    log_path: pathlib.Path,
    since: Optional[str],
    until: Optional[str],
) -> tuple[collections.Counter, collections.Counter]:
    server_counts: collections.Counter[str] = collections.Counter()
    method_counts: collections.Counter[tuple[str, str]] = collections.Counter()

    for line in log_path.read_text(errors="ignore").splitlines():
        if not line_in_window(line, since, until):
            continue
        match = CLIENT_RE.search(line)
        if not match:
            continue
        server, payload = match.groups()
        server_counts[server] += 1
        method_match = METHOD_RE.search(payload)
        if method_match:
            method_counts[(server, method_match.group(1))] += 1

    return server_counts, method_counts


def family(name: str) -> str:
    normalized = name.strip().lower()
    aliases = {
        "flashsidekick": "flash-sidekick",
        "flash_sidekick_mcp": "flash-sidekick",
        "design_system_sidekick_mcp": "design-system-sidekick",
        "filesystem": "filesystem",
        "github": "github",
        "playwright": "playwright",
        "perplexity": "perplexity",
        "perplexity-ask": "perplexity",
    }
    return aliases.get(normalized, normalized)


def total_for(method_counts: collections.Counter, fam: str, method: str) -> int:
    return sum(
        count
        for (server, method_name), count in method_counts.items()
        if family(server) == fam and method_name == method
    )


def summarize(server_counts: collections.Counter, method_counts: collections.Counter, top_n: int) -> dict:
    family_variants: dict[str, set[str]] = collections.defaultdict(set)
    for server in server_counts:
        family_variants[family(server)].add(server)

    filesystem_calls = total_for(method_counts, "filesystem", "tools/call")
    flash_calls = total_for(method_counts, "flash-sidekick", "tools/call")
    github_calls = total_for(method_counts, "github", "tools/call")
    playwright_calls = total_for(method_counts, "playwright", "tools/call")

    init_calls = sum(
        count for (_, method), count in method_counts.items() if method in {"initialize", "notifications/initialized", "tools/list", "prompts/list", "resources/list"}
    )
    actual_tool_calls = sum(count for (_, method), count in method_counts.items() if method == "tools/call")

    findings: list[str] = []
    if len(family_variants["filesystem"]) > 1:
        findings.append(
            f"Duplicate filesystem families active: {sorted(family_variants['filesystem'])}"
        )
    if flash_calls == 0 and filesystem_calls > 0:
        findings.append("Filesystem tools are being used without any flash-sidekick offload.")
    elif flash_calls > 0 and filesystem_calls / flash_calls > 2:
        findings.append(
            f"Filesystem offload ratio is high: filesystem={filesystem_calls}, flash-sidekick={flash_calls}."
        )
    if init_calls > actual_tool_calls * 5:
        findings.append(
            f"Initialization/list churn is high relative to actual tool use: init/list={init_calls}, tools/call={actual_tool_calls}."
        )

    return {
        "top_servers": server_counts.most_common(top_n),
        "top_methods": method_counts.most_common(top_n * 3),
        "family_variants": {k: sorted(v) for k, v in family_variants.items() if len(v) > 1},
        "summary": {
            "filesystem_tools_call": filesystem_calls,
            "flash_sidekick_tools_call": flash_calls,
            "github_tools_call": github_calls,
            "playwright_tools_call": playwright_calls,
            "init_or_list_events": init_calls,
            "actual_tools_call_events": actual_tool_calls,
        },
        "findings": findings,
    }


def print_report(
    report: dict,
    top_n: int,
    log_path: pathlib.Path,
    since: Optional[str],
    until: Optional[str],
) -> None:
    print("Claude MCP Usage Audit")
    print("======================")
    print(f"log: {log_path}")
    if since or until:
        print(
            f"window: {since or '-infinity'} -> {until or '+infinity'}"
        )
    print("")

    print("Summary")
    print(json.dumps(report["summary"], indent=2))
    print("")

    if report["family_variants"]:
        print("Duplicate Families")
        for fam, variants in sorted(report["family_variants"].items()):
            print(f"- {fam}: {', '.join(variants)}")
        print("")

    print(f"Top Servers ({top_n})")
    for name, count in report["top_servers"]:
        print(f"- {name}: {count}")
    print("")

    print(f"Top Methods ({min(len(report['top_methods']), top_n * 3)})")
    for (server, method), count in report["top_methods"][: top_n * 3]:
        print(f"- {server} :: {method}: {count}")
    print("")

    print("Findings")
    if report["findings"]:
        for finding in report["findings"]:
            print(f"- {finding}")
    else:
        print("- No obvious MCP usage red flags detected in the current log sample.")


def main() -> int:
    args = parse_args()
    log_path = pathlib.Path(args.log).expanduser()
    if not log_path.exists():
        print(f"Log not found: {log_path}", file=sys.stderr)
        return 1

    server_counts, method_counts = load_counts(log_path, args.since, args.until)
    report = summarize(server_counts, method_counts, args.top)
    print_report(report, args.top, log_path, args.since, args.until)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
