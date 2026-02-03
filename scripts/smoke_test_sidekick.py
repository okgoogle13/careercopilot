
import os
import json
import subprocess
import time
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

VENV_PYTHON = os.path.join(os.path.dirname(__file__), '..', '.venv', 'bin', 'python3')
SERVER_SCRIPT = os.path.join(os.path.dirname(__file__), '..', 'servers', 'flash_sidekick.py')

def start_server():
    env = os.environ.copy()
    if 'GEMINI_API_KEY' not in env:
        print("WARNING: GEMINI_API_KEY not set!")
    
    proc = subprocess.Popen([VENV_PYTHON, SERVER_SCRIPT],
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            env=env,
                            text=True)
    time.sleep(1)
    return proc

def send_rpc(proc, method, params=None, request_id=1):
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
    return json.loads(proc.stdout.readline())

def main():
    print("🚀 Starting Dual-Engine Smoke Test...")
    proc = start_server()
    
    try:
        # 1. List Tools
        print("\n[INIT] Listing Tools...")
        tools = send_rpc(proc, "tools/list", request_id=1)
        print(f"Tools Available: {[t['name'] for t in tools['result']['tools']]}")

        # 2. Flash-Lite Test (Speed/Summary)
        print("\n[FAST ENGINE] Testing Flash-Lite (quick_summarize)...")
        start_time = time.time()
        summary_res = send_rpc(proc, "tools/call", {
            "name": "quick_summarize", 
            "arguments": {"text": "Google Gemini 2.5 Flash-Lite is optimized for high-volume, cost-effective tasks requiring low latency. It excels at summarization and extraction."}
        }, request_id=2)
        duration = time.time() - start_time
        content = summary_res['result']['content'][0]['text']
        print(f"⏱️ Duration: {duration:.4f}s")
        print(f"📝 Output: {content.strip()}")

        # 3. Pro Test (Reasoning/Review)
        print("\n[SMART ENGINE] Testing Pro 2.5 (consult_pro)...")
        code_snippet = "def add(a,b): return a+b"
        start_time = time.time()
        review_res = send_rpc(proc, "tools/call", {
            "name": "consult_pro",
            "arguments": {
                "query": "Review this python function for type safety and potential improvements.",
                "context": code_snippet
            }
        }, request_id=3)
        duration = time.time() - start_time
        content = review_res['result']['content'][0]['text']
        print(f"⏱️ Duration: {duration:.4f}s")
        print(f"🧠 Output: {content.strip()[:200]}...") # Truncate for display

    finally:
        proc.terminate()
        print("\n✅ Smoke Test Complete.")

if __name__ == "__main__":
    main()
