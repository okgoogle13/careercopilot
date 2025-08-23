"""
Base Agent Class for PersonalCareerCopilot
Provides common functionality with PersonalCache integration
"""

import asyncio
import hashlib
import json
import logging
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

from app.core.ai_client import get_ai_client
from app.core.personal_cache import get_personal_cache

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all CareerCopilot agents with caching support"""
    
    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.ai_client = get_ai_client()
        self.cache = get_personal_cache()
        self.logger = logging.getLogger(f"agents.{agent_name}")
        
        # Default cache TTLs
        self.ai_response_ttl = timedelta(hours=72)  # 72 hours for AI responses
        self.user_profile_ttl = timedelta(days=7)   # 7 days for user profiles
        self.company_research_ttl = timedelta(days=7)  # 7 days for company research
        
        self.logger.info(f"BaseAgent {agent_name} initialized with caching")
    
    def _generate_prompt_hash(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate hash for prompt and context for caching"""
        prompt_data = {
            "prompt": prompt,
            "context": context or {},
            "agent": self.agent_name
        }
        prompt_str = json.dumps(prompt_data, sort_keys=True, default=str)
        return hashlib.sha256(prompt_str.encode()).hexdigest()[:16]
    
    async def execute_with_monitoring(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent task with monitoring, caching, and error handling"""
        
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
            # Check cache first
            cache_key = self._generate_task_cache_key(task_data)
            cached_result = await self.cache.get(cache_key, "ai_responses")
            
            if cached_result and self._is_cache_suitable(cached_result, task_data):
                self.logger.info(f"Returning cached result for {correlation_id}")
                return self._format_success_response(cached_result["data"])
            
            # Execute the actual agent logic
            result = await self._execute_core_logic(task_data)
            
            # Cache result for future use
            cache_data = {
                "data": result,
                "agent": self.agent_name,
                "task_data_hash": self._generate_prompt_hash(str(task_data)),
                "execution_time": (datetime.now() - start_time).total_seconds()
            }
            
            await self.cache.cache_ai_response(cache_key, cache_data, self.ai_response_ttl)
            
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
    
    def _generate_task_cache_key(self, task_data: Dict[str, Any]) -> str:
        """Generate cache key for task data"""
        # Create a stable hash of relevant task data
        relevant_data = {
            "agent": self.agent_name,
            "task_type": task_data.get("task_type"),
            # Include key fields that affect output
            "user_profile_hash": self._hash_dict(task_data.get("user_profile", {})),
            "job_description_hash": self._hash_dict({"desc": task_data.get("job_description", "")}),
            "document_type": task_data.get("document_type"),
            "template_id": task_data.get("template_id")
        }
        return self._generate_prompt_hash(json.dumps(relevant_data, sort_keys=True))
    
    def _hash_dict(self, data: Dict[str, Any]) -> str:
        """Create hash of dictionary data"""
        return hashlib.md5(json.dumps(data, sort_keys=True, default=str).encode()).hexdigest()[:8]
    
    def _is_cache_suitable(self, cached_result: Dict[str, Any], current_task_data: Dict[str, Any]) -> bool:
        """Check if cached result is suitable for current task"""
        # For now, simple TTL check is done in cache layer
        # Could add more sophisticated logic here
        return True
    
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
    
    async def generate_ai_response_with_cache(self, prompt: str, context: Optional[Dict] = None,
                                            model: str = "default", temperature: float = 0.7) -> str:
        """Generate AI response with caching support"""
        
        # Generate cache key
        prompt_hash = self._generate_prompt_hash(prompt, context)
        
        # Check cache first
        cached_response = await self.cache.get_ai_response(prompt_hash)
        if cached_response:
            self.logger.debug(f"Using cached AI response for prompt hash: {prompt_hash}")
            return cached_response.get("response", "")
        
        try:
            # Generate new response (simplified - in real implementation would use AI client)
            response = f"AI response to: {prompt[:100]}..." + (f" with context: {str(context)[:50]}..." if context else "")
            
            # Cache the response
            cache_data = {
                "response": response,
                "prompt": prompt[:200],  # Store truncated prompt for debugging
                "context": context,
                "model": model,
                "temperature": temperature,
                "generated_at": datetime.now().isoformat()
            }
            
            await self.cache.cache_ai_response(prompt_hash, cache_data, self.ai_response_ttl)
            
            self.logger.debug(f"Generated and cached AI response for prompt hash: {prompt_hash}")
            return response
            
        except Exception as e:
            self.logger.error(f"AI response generation failed: {e}")
            return f"Error generating AI response: {str(e)}"
    
    async def generate_structured_ai_response_with_cache(self, prompt: str, schema: Dict[str, Any],
                                                       context: Optional[Dict] = None) -> Dict[str, Any]:
        """Generate structured AI response with JSON output and caching"""
        
        # Create structured prompt
        structured_prompt = f"""
        {prompt}
        
        Context: {json.dumps(context, default=str) if context else 'None'}
        
        Please respond with valid JSON that matches this schema:
        {json.dumps(schema, indent=2)}
        """
        
        response = await self.generate_ai_response_with_cache(structured_prompt, context)
        
        try:
            # Try to parse as JSON (simplified implementation)
            # In real implementation would use AI client with structured output
            mock_structured_response = {
                "content": response,
                "structured": True,
                "schema_matched": True,
                "generated_at": datetime.now().isoformat()
            }
            return mock_structured_response
            
        except Exception as e:
            self.logger.error(f"Failed to parse structured response: {e}")
            return {"error": f"Could not parse structured response: {str(e)}"}
    
    def add_personal_context_to_prompt(self, base_prompt: str, user_profile: Dict[str, Any]) -> str:
        """Add personal context to any prompt"""
        
        career_info = user_profile.get("career_transition", {})
        personal_info = user_profile.get("personal_info", {})
        
        context_prompt = f"""
        Personal Background:
        - Name: {personal_info.get('name', 'User')}
        - Career Transition: {career_info.get('from', 'Unknown')} → {career_info.get('to', 'Unknown')}
        - Location: {personal_info.get('location', 'Not specified')}
        - Motivation: {career_info.get('motivation', 'Career growth')}
        
        Current Task:
        {base_prompt}
        
        Please tailor your response specifically to this person's career transition journey
        and highlight how their background adds unique value to their target field.
        """
        
        return context_prompt

class PersonalizedAgent(BaseAgent):
    """Enhanced base class with additional personal optimizations"""
    
    def __init__(self, agent_name: str):
        super().__init__(agent_name)
        self.success_patterns_cache_ttl = timedelta(days=30)
        
    async def learn_from_success(self, task_type: str, successful_result: Dict[str, Any],
                               user_profile: Dict[str, Any]) -> None:
        """Learn from successful applications for future improvements"""
        
        try:
            # Get existing success patterns
            patterns_key = f"success_patterns_{task_type}"
            existing_patterns = await self.cache.get(patterns_key, "profiles") or []
            
            # Add new success pattern
            new_pattern = {
                "result": successful_result,
                "timestamp": datetime.now().isoformat(),
                "user_profile_hash": self._hash_dict(user_profile),
                "agent": self.agent_name
            }
            
            existing_patterns.append(new_pattern)
            
            # Keep only the last 10 successful patterns
            existing_patterns = existing_patterns[-10:]
            
            # Save back to cache
            await self.cache.set(patterns_key, existing_patterns, 
                               self.success_patterns_cache_ttl, "profiles")
            
            self.logger.info(f"Learned from success pattern for {task_type}")
            
        except Exception as e:
            self.logger.error(f"Error learning from success: {e}")
    
    async def get_success_patterns(self, task_type: str) -> List[Dict[str, Any]]:
        """Get successful patterns for task type"""
        
        try:
            patterns_key = f"success_patterns_{task_type}"
            patterns = await self.cache.get(patterns_key, "profiles")
            return patterns or []
            
        except Exception as e:
            self.logger.error(f"Error getting success patterns: {e}")
            return []
    
    async def generate_with_success_context(self, prompt: str, task_type: str,
                                          user_profile: Dict[str, Any]) -> str:
        """Generate AI response using successful patterns as context"""
        
        success_patterns = await self.get_success_patterns(task_type)
        
        if success_patterns:
            # Extract key insights from recent successful patterns
            recent_patterns = success_patterns[-3:]  # Last 3 successes
            success_context = "\n".join([
                f"Successful approach {i+1}: {pattern['result'].get('summary', 'Success achieved')}"
                for i, pattern in enumerate(recent_patterns)
            ])
            
            enhanced_prompt = f"""
            Previous Successful Approaches for {task_type}:
            {success_context}
            
            Current Task:
            {prompt}
            
            Based on the successful patterns above, generate a response that follows
            similar effective approaches while being tailored to the current task.
            """
        else:
            enhanced_prompt = prompt
        
        return await self.generate_ai_response_with_cache(
            enhanced_prompt, 
            {"user_profile": user_profile, "task_type": task_type}
        )