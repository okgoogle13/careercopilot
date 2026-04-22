"""
MCP Client Library - Use MCP servers from Python code
"""
import json
import subprocess
from typing import Dict, Any, Optional

class MCPClient:
    """Client for interacting with MCP servers"""

    def __init__(self, gemini_wrapper_path="servers/mcp-gemini-wrapper/mcp_gemini_wrapper.py"):
        self.gemini_wrapper_path = gemini_wrapper_path

    def _call_server(self, server_path: str, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Call an MCP server with method and params"""
        request = {"method": method, "params": params}

        process = subprocess.Popen(
            ["python3", server_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        stdout, stderr = process.communicate(input=json.dumps(request))

        if process.returncode != 0:
            raise Exception(f"Server error: {stderr}")

        return json.loads(stdout)

    def analyze_code(self, code: str, language: str = "python") -> str:
        """Analyze code and return insights"""
        result = self._call_server(
            self.gemini_wrapper_path,
            "analyze_code",
            {"code": code, "language": language}
        )

        if result.get("status") == "success":
            return result["response"]
        else:
            raise Exception(result.get("message", "Unknown error"))

    def explain(self, text: str) -> str:
        """Get explanation of text"""
        result = self._call_server(
            self.gemini_wrapper_path,
            "explain",
            {"text": text}
        )

        if result.get("status") == "success":
            return result["response"]
        else:
            raise Exception(result.get("message", "Unknown error"))

    def summarize(self, text: str) -> str:
        """Summarize text"""
        result = self._call_server(
            self.gemini_wrapper_path,
            "summarize",
            {"text": text}
        )

        if result.get("status") == "success":
            return result["response"]
        else:
            raise Exception(result.get("message", "Unknown error"))

    def refactor(self, code: str, language: str = "python") -> str:
        """Get refactoring suggestions"""
        result = self._call_server(
            self.gemini_wrapper_path,
            "refactoring_suggestions",
            {"code": code, "language": language}
        )

        if result.get("status") == "success":
            return result["response"]
        else:
            raise Exception(result.get("message", "Unknown error"))

    def debug(self, error_message: str, context: str = "") -> str:
        """Diagnose errors"""
        result = self._call_server(
            self.gemini_wrapper_path,
            "error_diagnosis",
            {"error_message": error_message, "context": context}
        )

        if result.get("status") == "success":
            return result["response"]
        else:
            raise Exception(result.get("message", "Unknown error"))


# Example usage
if __name__ == "__main__":
    client = MCPClient()

    # Analyze some code
    code = """
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
    """

    print("Analyzing code...")
    analysis = client.analyze_code(code, "python")
    print(analysis)

    print("\nGetting explanation...")
    explanation = client.explain("What is the Model Context Protocol?")
    print(explanation)
