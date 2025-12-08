import os
import json
import subprocess
import time
import sys

# Ensure the virtual environment python is used
VENV_PYTHON = os.path.expanduser('~/careercopilot/careercopilot-1/.venv/bin/python3')
SERVER_SCRIPT = os.path.expanduser('~/careercopilot/careercopilot-1/servers/flash_sidekick.py')

def start_server():
    """Start the flash_sidekick server as a subprocess with the required env vars.
    Returns the Popen object.
    """
    env = os.environ.copy()
    # The GEMINI_API_KEY should already be in the user's environment (from .bashrc)
    if 'GEMINI_API_KEY' not in env:
        raise RuntimeError('GEMINI_API_KEY not set in environment – cannot test quick_summarize')
    # Start the server; use pipes for stdin/stdout
    proc = subprocess.Popen([VENV_PYTHON, SERVER_SCRIPT],
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            env=env,
                            text=True)
    # Give the server a moment to initialise
    time.sleep(1)
    return proc

def send_rpc(proc, method, params=None, request_id=1):
    """Send a JSON‑RPC request to the running server and return the parsed response."""
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "id": request_id,
    }
    if params is not None:
        payload["params"] = params
    line = json.dumps(payload) + "\n"
    proc.stdin.write(line)
    proc.stdin.flush()
    # Read a single line of response
    response_line = proc.stdout.readline()
    return json.loads(response_line)

def test_quick_summarize():
    """Integration test for the `quick_summarize` tool.
    It verifies that the server returns a non‑error text when a valid API key is present.
    """
    proc = start_server()
    try:
        resp = send_rpc(proc, "tools/call", {
            "name": "quick_summarize",
            "arguments": {"text": "Antigravity makes AI coding effortless."}
        }, request_id=2)
        # The response format is {"result": {"content": [{"type": "text", "text": "..."}]}}
        assert "result" in resp, f"Missing result in response: {resp}"
        content = resp["result"].get("content")
        assert isinstance(content, list) and len(content) > 0, "Empty content returned"
        text = content[0].get("text", "")
        # The API should return a summary, not the error message.
        assert "Error" not in text, f"Server returned an error: {text}"
        # Basic sanity check – the summary should contain at least one of the key words.
        assert any(word in text.lower() for word in ["antigravity", "ai", "coding"]), "Summary does not mention expected keywords"
    finally:
        # Clean up the server process.
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
