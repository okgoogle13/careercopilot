#!/usr/bin/env python3
"""
MCP CLI - Command-line interface for MCP servers
Usage: python3 mcp_cli.py <command> [args]
"""
import sys
import json
import subprocess
import os

def call_gemini(method, params):
    """Call Gemini wrapper with method and params"""
    request = {"method": method, "params": params}

    process = subprocess.Popen(
        ["python3", "servers/mcp-gemini-wrapper/mcp_gemini_wrapper.py"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = process.communicate(input=json.dumps(request))

    if stderr:
        print(f"Stderr: {stderr}", file=sys.stderr)

    return json.loads(stdout)

def analyze_code(file_path, language="typescript"):
    """Analyze code from a file"""
    with open(file_path, 'r') as f:
        code = f.read()

    result = call_gemini("analyze_code", {"code": code, "language": language})

    if result.get("status") == "success":
        print(f"\n✅ Analysis ({result['tokens']['total']} tokens):\n")
        print(result["response"])
    else:
        print(f"❌ Error: {result.get('message')}")

def explain(text):
    """Get explanation of text"""
    result = call_gemini("explain", {"text": text})

    if result.get("status") == "success":
        print(f"\n✅ Explanation ({result['tokens']['total']} tokens):\n")
        print(result["response"])
    else:
        print(f"❌ Error: {result.get('message')}")

def summarize(text):
    """Summarize text"""
    result = call_gemini("summarize", {"text": text})

    if result.get("status") == "success":
        print(f"\n✅ Summary ({result['tokens']['total']} tokens):\n")
        print(result["response"])
    else:
        print(f"❌ Error: {result.get('message')}")

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 mcp_cli.py analyze <file> [language]")
        print("  python3 mcp_cli.py explain <text>")
        print("  python3 mcp_cli.py summarize <text>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "analyze":
        if len(sys.argv) < 3:
            print("Error: Please provide a file path")
            sys.exit(1)
        file_path = sys.argv[2]
        language = sys.argv[3] if len(sys.argv) > 3 else "typescript"
        analyze_code(file_path, language)

    elif command == "explain":
        if len(sys.argv) < 3:
            print("Error: Please provide text to explain")
            sys.exit(1)
        text = " ".join(sys.argv[2:])
        explain(text)

    elif command == "summarize":
        if len(sys.argv) < 3:
            print("Error: Please provide text to summarize")
            sys.exit(1)
        text = " ".join(sys.argv[2:])
        summarize(text)

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
