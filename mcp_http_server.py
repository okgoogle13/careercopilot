#!/usr/bin/env python3
"""
MCP HTTP Server - REST API wrapper for MCP servers
Usage: python3 mcp_http_server.py
Then: curl http://localhost:8080/analyze -d '{"code": "...", "language": "python"}'
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import os

class MCPHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        
        try:
            params = json.loads(body)
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON"}, 400)
            return
        
        # Route based on path
        if self.path == '/analyze':
            result = self._call_gemini("analyze_code", params)
        elif self.path == '/explain':
            result = self._call_gemini("explain", params)
        elif self.path == '/summarize':
            result = self._call_gemini("summarize", params)
        elif self.path == '/refactor':
            result = self._call_gemini("refactoring_suggestions", params)
        elif self.path == '/debug':
            result = self._call_gemini("error_diagnosis", params)
        else:
            self._send_json({"error": "Unknown endpoint"}, 404)
            return
        
        self._send_json(result)
    
    def do_GET(self):
        if self.path == '/health':
            self._send_json({"status": "ok", "service": "MCP HTTP Server"})
        else:
            self._send_json({"error": "Not found"}, 404)
    
    def _call_gemini(self, method, params):
        request = {"method": method, "params": params}
        
        process = subprocess.Popen(
            ["python3", "servers/mcp-gemini-wrapper/mcp_gemini_wrapper.py"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=json.dumps(request))
        
        try:
            return json.loads(stdout)
        except json.JSONDecodeError:
            return {"error": "Invalid response from MCP server", "stderr": stderr}

def run(port=8080):
    server = HTTPServer(('0.0.0.0', port), MCPHandler)
    print(f"🚀 MCP HTTP Server running on http://localhost:{port}")
    print(f"   Endpoints: /analyze, /explain, /summarize, /refactor, /debug")
    print(f"   Health: http://localhost:{port}/health")
    server.serve_forever()

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run(port)
