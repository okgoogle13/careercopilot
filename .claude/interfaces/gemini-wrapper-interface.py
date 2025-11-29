# Minimal Interface Definition File (IDF) for mcp-gemini-wrapper.
# Use this file for Claude context instead of the full implementation.
from typing import Dict, Any, Optional

class GeminiMCPServerInterface:
    def explain_text(text: str) -> Dict[str, Any]:
        """Explain what given text means (concise, one-sentence version).
        """
        ...
    def analyze_code(code: str, language: str = 'python') -> Dict[str, Any]:
        """Analyze and explain code.
        """
        ...
    def summarize(text: str) -> Dict[str, Any]:
        """Create a concise summary of text.
        """
        ...
    def brainstorm(topic: str, count: int = 5) -> Dict[str, Any]:
        """Generate ideas for a given topic.
        """
        ...
    def architecture_analysis(system_description: str) -> Dict[str, Any]:
        """Analyze system architecture and suggest improvements.
        """
        ...
    def refactoring_suggestions(code: str, language: str = 'python') -> Dict[str, Any]:
        """Generate refactoring suggestions for code.
        """
        ...
    def error_diagnosis(error_message: str, context: str = '') -> Dict[str, Any]:
        """Diagnose errors and suggest fixes.
        """
        ...
    def documentation_insights(doc_content: str, query: str = '') -> Dict[str, Any]:
        """Extract insights and patterns from documentation.
        """
        ...
    def optimization_analysis(performance_data: str) -> Dict[str, Any]:
        """Analyze performance data and suggest optimizations.
        """
        ...
    def health_check() -> Dict[str, Any]:
        """Check server health.
        """
        ...
