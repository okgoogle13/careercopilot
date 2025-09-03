"""
Base Agent Class for PersonalCareerCopilot
Provides common functionality for all agents
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, Any, Optional
import json

from genkit import ai
from config.personal_config import get_personal_config
from src.backend.utils.cache import PersonalCache
from src.backend.utils.firebase_client import FirebaseClient

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all CareerCopilot agents"""

    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.config = get_personal_config()
        self.cache = PersonalCache()
        self.firebase = FirebaseClient()
        self.logger = logging.getLogger(f"agents.{agent_name}")

        # Personal optimizations
        self.user_context = self._load_user_context()

    def _load_user_context(self) -> Dict[str, Any]:
        """Load personal context for AI prompts"""
        return {
            "name": self.config.name,
            "career_transition": f"{self.config.career_transition_from} to {self.config.career_transition_to}",
            "location": self.config.location,
            "target_roles": self.config.target_roles,
            "personal_story": self.config.personal_story,
            "transferable_skills": self.config.transferable_skills[:5],  # Top 5 skills
            "organization_values": self.config.organization_values[:3]   # Top 3 values
        }

    async def execute_with_monitoring(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent task with monitoring and error handling"""

        start_time = datetime.now()
        correlation_id = f"{self.agent_name}_{start_time.strftime('%Y%m%d_%H%M%S')}"

        self.logger.info(
            f"Agent execution started",
            extra={
                "agent": self.agent_name,
                "correlation_id": correlation_id,
                "task_type": task_data.get("task_type", "unknown")
            }
        )

        try:
            # Check cache first (personal optimization)
            cache_key = self._generate_cache_key(task_data)
            cached_result = await self.cache.get(cache_key)

            if cached_result and self._is_cache_valid(cached_result):
                self.logger.info(f"Returning cached result for {correlation_id}")
                return cached_result["data"]

            # Execute the actual agent logic
            result = await self._execute_core_logic(task_data)

            # Cache result for future use
            await self.cache.set(cache_key, {
                "data": result,
                "timestamp": datetime.now().isoformat(),
                "agent": self.agent_name
            })

            execution_time = (datetime.now() - start_time).total_seconds()

            self.logger.info(
                f"Agent execution completed successfully",
                extra={
                    "agent": self.agent_name,
                    "correlation_id": correlation_id,
                    "execution_time": execution_time
                }
            )

            return self._format_success_response(result)

        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()

            self.logger.error(
                f"Agent execution failed",
                extra={
                    "agent": self.agent_name,
                    "correlation_id": correlation_id,
                    "error": str(e),
                    "execution_time": execution_time
                }
            )

            return self._format_error_response(str(e))

    @abstractmethod
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core agent logic to be implemented by subclasses"""
        pass

    def _generate_cache_key(self, task_data: Dict[str, Any]) -> str:
        """Generate cache key for task data"""
        # Create a hash of relevant task data for caching
        import hashlib
        task_str = json.dumps(task_data, sort_keys=True)
        return f"{self.agent_name}_{hashlib.md5(task_str.encode()).hexdigest()[:10]}"

    def _is_cache_valid(self, cached_result: Dict[str, Any], ttl_hours: int = 24) -> bool:
        """Check if cached result is still valid"""
        from dateutil.parser import parse
        cached_time = parse(cached_result["timestamp"])
        now = datetime.now()

        return (now - cached_time.replace(tzinfo=None)).total_seconds() < (ttl_hours * 3600)

    def _format_success_response(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Format successful response with metadata"""
        return {
            "success": True,
            "agent": self.agent_name,
            "timestamp": datetime.now().isoformat(),
            "data": result
        }

    def _format_error_response(self, error_message: str) -> Dict[str, Any]:
        """Format error response with metadata"""
        return {
            "success": False,
            "agent": self.agent_name,
            "timestamp": datetime.now().isoformat(),
            "error": error_message,
            "retry_after": 300  # 5 minutes
        }

    async def generate_ai_response(self, prompt: str, model: str = "gemini-1.5-pro",
                                 temperature: float = 0.7) -> str:
        """Generate AI response with personal context"""

        # Add personal context to prompt
        enhanced_prompt = f"""
        Personal Context:
        - Name: {self.user_context['name']}
        - Career Transition: {self.user_context['career_transition']}
        - Location: {self.user_context['location']}
        - Key Skills: {', '.join(self.user_context['transferable_skills'])}
        - Values: {', '.join(self.user_context['organization_values'])}
        - Personal Story: {self.user_context['personal_story']['background']}

        Task: {prompt}

        Please provide a response that's personalized to this individual's career transition journey
        and incorporates their unique background and skills.
        """

        try:
            response = await ai.generate(
                model=model,
                prompt=enhanced_prompt,
                config={
                    "temperature": temperature,
                    "maxOutputTokens": 4096
                }
            )

            return response.text()

        except Exception as e:
            self.logger.error(f"AI generation failed: {e}")
            raise

    async def generate_structured_ai_response(self, prompt: str, schema: Dict[str, Any],
                                            model: str = "gemini-1.5-pro") -> Dict[str, Any]:
        """Generate structured AI response with JSON output"""

        structured_prompt = f"""
        {prompt}

        Please respond with valid JSON that matches this schema:
        {json.dumps(schema, indent=2)}

        Ensure the response is valid JSON and follows the schema exactly.
        """

        response = await self.generate_ai_response(structured_prompt, model)

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            else:
                raise ValueError("Could not parse JSON response from AI model")

    def add_personal_context_to_prompt(self, base_prompt: str) -> str:
        """Add personal context to any prompt"""
        return f"""
        Personal Background:
        - Career Changer: {self.config.career_transition_from} → {self.config.career_transition_to}
        - Location: {self.config.location}
        - Motivation: {self.config.career_motivation}
        - Unique Value: Finance background + lived experience as person of colour

        Current Task:
        {base_prompt}

        Please tailor your response specifically to this person's career transition journey
        and highlight how their finance background adds unique value to social work.
        """

class PersonalizedAgent(BaseAgent):
    """Enhanced base class with additional personal optimizations"""

    def __init__(self, agent_name: str):
        super().__init__(agent_name)
        self.personal_templates = {}
        self.success_patterns = {}

    async def learn_from_success(self, task_type: str, successful_result: Dict[str, Any]) -> None:
        """Learn from successful applications for future improvements"""

        if task_type not in self.success_patterns:
            self.success_patterns[task_type] = []

        self.success_patterns[task_type].append({
            "result": successful_result,
            "timestamp": datetime.now().isoformat(),
            "context": self.user_context
        })

        # Keep only the last 10 successful patterns
        self.success_patterns[task_type] = self.success_patterns[task_type][-10:]

        # Save to Firebase for persistence
        await self.firebase.save_learning_data(
            self.config.user_id,
            self.agent_name,
            self.success_patterns
        )

    async def get_success_patterns(self, task_type: str) -> List[Dict[str, Any]]:
        """Get successful patterns for task type"""

        if task_type not in self.success_patterns:
            # Load from Firebase
            saved_patterns = await self.firebase.get_learning_data(
                self.config.user_id,
                self.agent_name
            )
            self.success_patterns = saved_patterns or {}

        return self.success_patterns.get(task_type, [])

    async def generate_with_success_context(self, prompt: str, task_type: str) -> str:
        """Generate AI response using successful patterns as context"""

        success_patterns = await self.get_success_patterns(task_type)

        if success_patterns:
            success_context = "\n".join([
                f"Successful example {i+1}: {pattern['result'].get('summary', '')}"
                for i, pattern in enumerate(success_patterns[-3:])  # Last 3 successes
            ])

            enhanced_prompt = f"""
            Previous Successful Approaches:
            {success_context}

            Current Task:
            {prompt}

            Based on the successful patterns above, generate a response that follows
            similar effective approaches while being tailored to the current task.
            """
        else:
            enhanced_prompt = prompt

        return await self.generate_ai_response(enhanced_prompt)
