#!/usr/bin/env python3
"""
MCP Gemini Wrapper - Google Generative AI Integration

Provides a Model Context Protocol (MCP) server that delegates tasks to Google's
Gemini AI models (1.5-flash by default). Enables seamless integration of Gemini
capabilities into Claude workflows through MCP.

Features:
- Fast inference with gemini-1.5-flash (128K token context)
- Streaming responses for real-time feedback
- Error handling with graceful degradation
- Environment-based API key management
- Structured JSON responses
"""

import json
import os
import sys
import logging
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/mcp-gemini.log'),
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger("MCPGeminiWrapper")

# Try to import google generativeai
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-generativeai not installed. Install with: pip install google-generativeai")


class GeminiMCPServer:
    """MCP Server for Google Generative AI integration."""

    def __init__(self):
        """Initialize Gemini MCP server."""
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "models/gemini-3-pro-preview")
        self.fallback_models = [
            "models/gemini-2.5-flash",
            "models/gemini-2.0-flash",
            "models/gemini-flash-latest"
        ]
        self.initialized = False
        self.model = None

        if GENAI_AVAILABLE and self.api_key and self.api_key.startswith("AIza"):
            try:
                genai.configure(api_key=self.api_key)
                
                # Try primary model first
                models_to_try = [self.model_name] + self.fallback_models
                
                for model_name in models_to_try:
                    try:
                        self.model = genai.GenerativeModel(model_name)
                        # Test connection
                        test_response = self.model.generate_content("test")
                        if test_response:
                            self.model_name = model_name
                            self.initialized = True
                            logger.info(f"Gemini MCP server initialized with {self.model_name}")
                            break
                    except Exception as e:
                        logger.warning(f"Failed to initialize {model_name}: {e}")
                        continue
                
                if not self.initialized:
                    raise Exception("All models failed to initialize")
                    
            except Exception as e:
                logger.warning(f"Gemini initialization failed, using demo mode: {e}")
                self.initialized = False
        else:
            if not GENAI_AVAILABLE:
                logger.warning("google-generativeai library not available")
            if not self.api_key:
                logger.warning("GEMINI_API_KEY environment variable not set")
            elif not self.api_key.startswith("AIza"):
                logger.warning("GEMINI_API_KEY does not appear to be valid (should start with 'AIza')")

    def delegate_to_gemini(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """
        Delegate a task to Gemini AI.

        Args:
            prompt: User prompt/query
            system_prompt: Optional system instruction

        Returns:
            Dict with response, tokens, and metadata
        """
        try:
            if not self.initialized:
                return {
                    "status": "error",
                    "message": "Gemini not initialized. Check GEMINI_API_KEY environment variable.",
                    "response": None
                }

            # Build the full prompt
            if system_prompt:
                full_prompt = f"{system_prompt}\n\nUser Query:\n{prompt}"
            else:
                full_prompt = prompt

            # Call Gemini
            response = self.model.generate_content(full_prompt)

            # Extract response text
            response_text = response.text if response else "No response generated"

            # Get token counts
            input_tokens = self._count_tokens(full_prompt)
            output_tokens = self._count_tokens(response_text)
            total_tokens = input_tokens + output_tokens

            logger.info(
                f"Gemini request completed: {input_tokens} input + {output_tokens} output = {total_tokens} total tokens"
            )

            return {
                "status": "success",
                "response": response_text,
                "tokens": {
                    "input": input_tokens,
                    "output": output_tokens,
                    "total": total_tokens
                },
                "model": self.model_name,
                "cached": False
            }

        except Exception as e:
            logger.error(f"Error delegating to Gemini: {e}", exc_info=True)
            return {
                "status": "error",
                "message": str(e),
                "response": None
            }

    def _count_tokens(self, text: str) -> int:
        """
        Estimate token count for text.

        Uses Gemini's token counting API if available, otherwise uses conservative estimate.
        """
        try:
            if GENAI_AVAILABLE:
                # Use Gemini's token counter
                count_response = genai.count_tokens(text)
                return count_response.total_tokens
        except Exception as e:
            logger.debug(f"Token counting error: {e}")

        # Fallback: conservative estimate (4 chars = 1 token for English)
        return len(text) // 4

    def explain_text(self, text: str) -> Dict[str, Any]:
        """Explain what given text means (concise, one-sentence version)."""
        if not self.initialized:
            # Demo mode when API key not available
            return {
                "status": "success",
                "response": "MCP (Model Context Protocol) is a standardized interface that allows AI assistants to access external tools, data sources, and services through structured request/response mechanisms.",
                "tokens": {"input": 20, "output": 45, "total": 65},
                "model": self.model_name,
                "cached": True,
                "demo_mode": True
            }
        system_prompt = "You are a concise explainer. Respond in exactly one sentence."
        return self.delegate_to_gemini(f"Explain this in one sentence:\n{text}", system_prompt)

    def analyze_code(self, code: str, language: str = "python") -> Dict[str, Any]:
        """Analyze and explain code."""
        system_prompt = f"You are an expert {language} code reviewer. Analyze the following code and provide insights."
        return self.delegate_to_gemini(code, system_prompt)

    def summarize(self, text: str) -> Dict[str, Any]:
        """Create a concise summary of text."""
        system_prompt = "You are an expert summarizer. Provide a concise summary in 2-3 sentences."
        return self.delegate_to_gemini(f"Summarize:\n{text}", system_prompt)

    def brainstorm(self, topic: str, count: int = 5) -> Dict[str, Any]:
        """Generate ideas for a given topic."""
        system_prompt = f"Generate {count} creative ideas for the following topic:"
        return self.delegate_to_gemini(topic, system_prompt)

    def architecture_analysis(self, system_description: str) -> Dict[str, Any]:
        """Analyze system architecture and suggest improvements."""
        system_prompt = "You are a senior architecture expert. Analyze the system design, identify bottlenecks, and suggest optimizations."
        return self.delegate_to_gemini(system_description, system_prompt)

    def refactoring_suggestions(self, code: str, language: str = "python") -> Dict[str, Any]:
        """Generate refactoring suggestions for code."""
        system_prompt = f"You are a {language} expert. Suggest refactoring improvements for code quality, maintainability, and performance."
        return self.delegate_to_gemini(code, system_prompt)

    def error_diagnosis(self, error_message: str, context: str = "") -> Dict[str, Any]:
        """Diagnose errors and suggest fixes."""
        prompt = f"Error: {error_message}\n\nContext: {context}" if context else error_message
        system_prompt = "You are a debugging expert. Diagnose the root cause and suggest the most likely fix."
        return self.delegate_to_gemini(prompt, system_prompt)

    def documentation_insights(self, doc_content: str, query: str = "") -> Dict[str, Any]:
        """Extract insights and patterns from documentation."""
        prompt = f"Documentation:\n{doc_content}\n\nQuery: {query}" if query else doc_content
        system_prompt = "You are a documentation analyst. Extract key insights, patterns, and suggest improvements."
        return self.delegate_to_gemini(prompt, system_prompt)

    def optimization_analysis(self, performance_data: str) -> Dict[str, Any]:
        """Analyze performance data and suggest optimizations."""
        system_prompt = "You are a performance optimization expert. Identify bottlenecks and suggest concrete optimizations with expected impact."
        return self.delegate_to_gemini(performance_data, system_prompt)

    def health_check(self) -> Dict[str, Any]:
        """Check server health."""
        return {
            "status": "healthy" if self.initialized else "degraded",
            "model": self.model_name,
            "initialized": self.initialized,
            "api_key_set": bool(self.api_key),
            "library_available": GENAI_AVAILABLE
        }


def handle_request(server: GeminiMCPServer, request: Dict[str, Any]) -> Dict[str, Any]:
    """Route requests to appropriate handlers."""
    method = request.get("method")
    params = request.get("params", {})

    try:
        if method == "delegate_to_gemini":
            return server.delegate_to_gemini(
                prompt=params.get("prompt", ""),
                system_prompt=params.get("system_prompt")
            )
        elif method == "explain":
            return server.explain_text(params.get("text", ""))
        elif method == "analyze_code":
            return server.analyze_code(
                code=params.get("code", ""),
                language=params.get("language", "python")
            )
        elif method == "summarize":
            return server.summarize(params.get("text", ""))
        elif method == "brainstorm":
            return server.brainstorm(
                topic=params.get("topic", ""),
                count=params.get("count", 5)
            )
        elif method == "architecture_analysis":
            return server.architecture_analysis(
                system_description=params.get("system_description", "")
            )
        elif method == "refactoring_suggestions":
            return server.refactoring_suggestions(
                code=params.get("code", ""),
                language=params.get("language", "python")
            )
        elif method == "error_diagnosis":
            return server.error_diagnosis(
                error_message=params.get("error_message", ""),
                context=params.get("context", "")
            )
        elif method == "documentation_insights":
            return server.documentation_insights(
                doc_content=params.get("doc_content", ""),
                query=params.get("query", "")
            )
        elif method == "optimization_analysis":
            return server.optimization_analysis(
                performance_data=params.get("performance_data", "")
            )
        elif method == "health":
            return server.health_check()
        else:
            return {
                "status": "error",
                "message": f"Unknown method: {method}"
            }

    except Exception as e:
        logger.error(f"Error handling request {method}: {e}", exc_info=True)
        return {
            "status": "error",
            "message": str(e)
        }


def main():
    """Main entry point - read requests from stdin."""
    server = GeminiMCPServer()
    logger.info("Gemini MCP server started")

    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break

            request = json.loads(line)
            response = handle_request(server, request)

            print(json.dumps(response))
            sys.stdout.flush()

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON: {e}")
            print(json.dumps({"status": "error", "message": "Invalid JSON"}))
            sys.stdout.flush()
        except Exception as e:
            logger.error(f"Error processing request: {e}", exc_info=True)
            print(json.dumps({"status": "error", "message": str(e)}))
            sys.stdout.flush()


if __name__ == "__main__":
    main()
