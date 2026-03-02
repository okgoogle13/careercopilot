"""
Unified AI Client Interface

Provides a unified interface for interacting with different AI providers
while using centralized configuration, monitoring, and error handling.
"""

import logging
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
<<<<<<< HEAD
from typing import Any, Dict, List, Optional
=======
from typing import Any
>>>>>>> restoration-KR-Rage-Figma-v2.0

from .ai_config import AIConfigManager, AIModelType, AIProvider, ModelConfig
from .monitoring import monitor_performance, track_ai_usage, track_error

# Remove OpenAI provider from supported providers
SUPPORTED_PROVIDERS = [AIProvider.GOOGLE_AI, AIProvider.ANTHROPIC]

logger = logging.getLogger(__name__)


@dataclass
class AIRequest:
    """Standardized AI request structure"""

    prompt: str
    service_name: str
    user_id: str
<<<<<<< HEAD
    model_name: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    stream: bool = False
    functions: Optional[List[Dict[str, Any]]] = None
    system_prompt: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
=======
    model_name: str | None = None
    max_tokens: int | None = None
    temperature: float | None = None
    stream: bool = False
    functions: list[dict[str, Any]] | None = None
    system_prompt: str | None = None
    context: dict[str, Any] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


@dataclass
class AIResponse:
    """Standardized AI response structure"""

    content: str
    model_used: str
    provider: str
<<<<<<< HEAD
    tokens_used: Dict[str, int]  # {'input': x, 'output': y}
    response_time_ms: float
    cached: bool
    cost_estimate: float
    metadata: Dict[str, Any]
=======
    tokens_used: dict[str, int]  # {'input': x, 'output': y}
    response_time_ms: float
    cached: bool
    cost_estimate: float
    metadata: dict[str, Any]
>>>>>>> restoration-KR-Rage-Figma-v2.0
    request_id: str


class AIProviderClient(ABC):
    """Abstract base class for AI provider clients"""

    def __init__(self, provider: AIProvider, config_manager: AIConfigManager):
        self.provider = provider
        self.config_manager = config_manager
        self.credentials = config_manager.get_provider_credentials(provider)

        if not self.credentials:
            raise ValueError(f"No credentials configured for provider: {provider.value}")

    @abstractmethod
    async def generate_text(self, request: AIRequest, model_config: ModelConfig) -> AIResponse:
        """Generate text using the provider's API"""

    @abstractmethod
    async def generate_embeddings(
<<<<<<< HEAD
        self, texts: List[str], model_config: ModelConfig
    ) -> List[List[float]]:
=======
        self, texts: list[str], model_config: ModelConfig
    ) -> list[list[float]]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Generate embeddings for texts"""

    @abstractmethod
    async def health_check(self) -> bool:
        """Check if the provider is available"""


# OpenAI client implementation removed - using Google's Gemini models instead


class GoogleAIClient(AIProviderClient):
    """Google AI (Gemini) client implementation"""

    def __init__(self, config_manager: AIConfigManager):
        super().__init__(AIProvider.GOOGLE_AI, config_manager)
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"

    async def generate_text(self, request: AIRequest, model_config: ModelConfig) -> AIResponse:
        """Generate text using Google AI API with optional model optimization"""
        import httpx

        start_time = time.time()
        request_id = f"google_{int(start_time)}"

        # Prepare request payload for Gemini
        payload = {
            "contents": [{"parts": [{"text": request.prompt}]}],
            "generationConfig": {
                "maxOutputTokens": request.max_tokens or model_config.max_tokens,
                "temperature": request.temperature or model_config.temperature,
                "topP": model_config.top_p,
            },
        }

        if request.system_prompt:
            payload["systemInstruction"] = {"parts": [{"text": request.system_prompt}]}

        try:
            if not self.credentials:
                raise ValueError("Google AI credentials not configured")

            # Use standard Google AI API endpoint
            url = f"{self.base_url}/models/{model_config.model_id}:generateContent?key={self.credentials.api_key if self.credentials else ''}"

            async with httpx.AsyncClient(timeout=model_config.timeout_seconds) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()

                result = response.json()
                response_time_ms = (time.time() - start_time) * 1000

                # Extract response content from standard API response
                content = result["candidates"][0]["content"]["parts"][0]["text"]
                tokens_used = {
                    "input": int(len(request.prompt.split()) * 1.3),
                    "output": int(len(content.split()) * 1.3),
                }

                cost_estimate = self._calculate_cost(tokens_used, model_config)

                return AIResponse(
                    content=content,
                    model_used=model_config.name,
                    provider=self.provider.value,
                    tokens_used=tokens_used,
                    response_time_ms=response_time_ms,
                    cached=False,
                    cost_estimate=cost_estimate,
                    metadata={
                        "finish_reason": result["candidates"][0].get("finishReason"),
                        "safety_ratings": result["candidates"][0].get("safetyRatings", []),
                    },
                    request_id=request_id,
                )

        except Exception as e:
            logger.error(f"Google AI API error: {e}")
            track_error("google_ai_api_error", "ai_client", str(e), request.user_id)
            raise

    async def generate_embeddings(
<<<<<<< HEAD
        self, texts: List[str], model_config: ModelConfig
    ) -> List[List[float]]:
=======
        self, texts: list[str], model_config: ModelConfig
    ) -> list[list[float]]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Generate embeddings using Google AI API"""
        # Placeholder - would implement embedding API call
        raise NotImplementedError("Google AI embeddings not yet implemented")

    async def health_check(self) -> bool:
        """Check Google AI API health"""
        try:
            import httpx

            if not self.credentials:
                return False

            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(
                    f"{self.base_url}/models?key={self.credentials.api_key if self.credentials else ''}"
                )
                return response.status_code == 200
        except Exception:
            return False

<<<<<<< HEAD
    def _calculate_cost(self, tokens_used: Dict[str, int], model_config: ModelConfig) -> float:
=======
    def _calculate_cost(self, tokens_used: dict[str, int], model_config: ModelConfig) -> float:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Calculate cost based on token usage"""
        input_cost = (tokens_used["input"] / 1000) * model_config.cost_per_1k_tokens["input"]
        output_cost = (tokens_used["output"] / 1000) * model_config.cost_per_1k_tokens["output"]
        return input_cost + output_cost


class AnthropicClient(AIProviderClient):
    """Anthropic Claude client implementation"""

    def __init__(self, config_manager: AIConfigManager):
        super().__init__(AIProvider.ANTHROPIC, config_manager)
        self.base_url = "https://api.anthropic.com/v1"
        self.headers = {}
        if self.credentials and self.credentials.api_key:
            self.headers = {
                "x-api-key": self.credentials.api_key,
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
            }

    async def generate_text(self, request: AIRequest, model_config: ModelConfig) -> AIResponse:
        """Generate text using Anthropic API"""
        import httpx

        start_time = time.time()
        request_id = f"anthropic_{int(start_time)}"

        # Prepare request payload
        payload = {
            "model": model_config.model_id,
            "max_tokens": request.max_tokens or model_config.max_tokens,
            "temperature": request.temperature or model_config.temperature,
            "messages": [{"role": "user", "content": request.prompt}],
        }

        if request.system_prompt:
            payload["system"] = request.system_prompt

        try:
            async with httpx.AsyncClient(timeout=model_config.timeout_seconds) as client:
                response = await client.post(
                    f"{self.base_url}/messages", headers=self.headers, json=payload
                )
                response.raise_for_status()

                result = response.json()
                response_time_ms = (time.time() - start_time) * 1000

                # Extract response content
                content = result["content"][0]["text"]
                tokens_used = {
                    "input": result["usage"]["input_tokens"],
                    "output": result["usage"]["output_tokens"],
                }

                cost_estimate = self._calculate_cost(tokens_used, model_config)

                return AIResponse(
                    content=content,
                    model_used=model_config.name,
                    provider=self.provider.value,
                    tokens_used=tokens_used,
                    response_time_ms=response_time_ms,
                    cached=False,
                    cost_estimate=cost_estimate,
                    metadata={
                        "stop_reason": result.get("stop_reason"),
                        "stop_sequence": result.get("stop_sequence"),
                    },
                    request_id=request_id,
                )

        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            track_error("anthropic_api_error", "ai_client", str(e), request.user_id)
            raise

    async def generate_embeddings(
<<<<<<< HEAD
        self, texts: List[str], model_config: ModelConfig
    ) -> List[List[float]]:
=======
        self, texts: list[str], model_config: ModelConfig
    ) -> list[list[float]]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Generate embeddings - Anthropic doesn't provide embedding models"""
        raise NotImplementedError("Anthropic does not provide embedding models")

    async def health_check(self) -> bool:
        """Check Anthropic API health"""
        try:
            import httpx

            # Simple test message
            payload = {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 10,
                "messages": [{"role": "user", "content": "Hello"}],
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(
                    f"{self.base_url}/messages", headers=self.headers, json=payload
                )
                return response.status_code == 200
        except Exception:
            return False

<<<<<<< HEAD
    def _calculate_cost(self, tokens_used: Dict[str, int], model_config: ModelConfig) -> float:
=======
    def _calculate_cost(self, tokens_used: dict[str, int], model_config: ModelConfig) -> float:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Calculate cost based on token usage"""
        input_cost = (tokens_used["input"] / 1000) * model_config.cost_per_1k_tokens["input"]
        output_cost = (tokens_used["output"] / 1000) * model_config.cost_per_1k_tokens["output"]
        return input_cost + output_cost


class AIClientManager:
    """Manages AI provider clients and routing"""

<<<<<<< HEAD
    def __init__(self, config_manager: Optional[AIConfigManager] = None):
        from .ai_config import get_ai_config

        self.config_manager = config_manager or get_ai_config()
        self.clients: Dict[AIProvider, AIProviderClient] = {}
=======
    def __init__(self, config_manager: AIConfigManager | None = None):
        from .ai_config import get_ai_config

        self.config_manager = config_manager or get_ai_config()
        self.clients: dict[AIProvider, AIProviderClient] = {}
>>>>>>> restoration-KR-Rage-Figma-v2.0
        self._initialize_clients()

    def _initialize_clients(self):
        """Initialize available AI provider clients"""
        # Only initialize Google AI client as it's our primary provider
        if self.config_manager.get_provider_credentials(AIProvider.GOOGLE_AI):
            self.clients[AIProvider.GOOGLE_AI] = GoogleAIClient(self.config_manager)

        # Fallback to Anthropic if configured (optional)
        if self.config_manager.get_provider_credentials(AIProvider.ANTHROPIC):
            self.clients[AIProvider.ANTHROPIC] = AnthropicClient(self.config_manager)

        if not self.clients:
                raise ValueError("No AI provider credentials found in configuration")

    @monitor_performance("ai_text_generation")
    async def generate_text(self, request: AIRequest) -> AIResponse:
        """Generate text using the appropriate model and provider"""
<<<<<<< HEAD
        
        # 1. Try Genkit awareness if enabled
        from app.core.genkit_init import get_model, is_genkit_enabled
=======

        # 1. Try Genkit awareness if enabled
        from app.core.genkit import get_model, is_genkit_enabled
>>>>>>> restoration-KR-Rage-Figma-v2.0
        if is_genkit_enabled():
            model = get_model()
            if model:
                try:
                    start_time = time.time()
                    logger.info(f"Using Genkit for service: {request.service_name}")
<<<<<<< HEAD
                    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
                    # Simple prompt merge for general requests
                    full_prompt = request.prompt
                    if request.system_prompt:
                        full_prompt = f"{request.system_prompt}\n\n{request.prompt}"

<<<<<<< HEAD
                    # Note: Using generic model.generate here. 
                    # Specific flows should be called directly where possible.
                    response = await model.generate(prompt=full_prompt)
                    duration = (time.time() - start_time) * 1000
                    
=======
                    # Note: Using generic model.generate here.
                    # Specific flows should be called directly where possible.
                    response = await model.generate(prompt=full_prompt)
                    duration = (time.time() - start_time) * 1000

>>>>>>> restoration-KR-Rage-Figma-v2.0
                    # Standardized response
                    return AIResponse(
                        content=response.text,
                        model_used="genkit-primary",
                        provider="googleai",
                        tokens_used={"input": 0, "output": 0},
                        response_time_ms=duration,
                        cached=False,
                        cost_estimate=0.0,
                        metadata={"genkit": True},
                        request_id=f"genkit_{int(start_time)}"
                    )
                except Exception as e:
                    logger.warning(f"Genkit managed generation failed: {e}. Falling back to legacy provider logic.")

        # Get service configuration
        service_config = self.config_manager.get_service_config(request.service_name)
        if not service_config or not service_config.enabled:
            raise ValueError(f"Service '{request.service_name}' is not available")

        # Determine which model to use
        model_name = request.model_name or service_config.primary_model
        model_config = self.config_manager.get_model_config(model_name)

        if not model_config:
            raise ValueError(f"Model '{model_name}' not found in configuration")

        # Try primary model first, then fallbacks
        models_to_try = [model_name] + [
            m for m in service_config.fallback_models if m != model_name
        ]

        last_error = None

        for attempt_model in models_to_try:
            try:
                model_config = self.config_manager.get_model_config(attempt_model)
                if not model_config:
                    continue

                client = self.clients.get(model_config.provider)
                if not client:
                    logger.warning(
                        f"No client available for provider: {model_config.provider.value}"
                    )
                    continue

                # Generate response
                response = await client.generate_text(request, model_config)

                # Track usage
                track_ai_usage(
                    operation_type=request.service_name,
                    user_id=request.user_id,
                    tokens_used=response.tokens_used["input"] + response.tokens_used["output"],
                    cached=response.cached,
                )

                logger.info(
                    f"Generated text using {model_config.name}",
                    extra={
                        "user_id": request.user_id,
                        "service": request.service_name,
                        "model": model_config.name,
                        "tokens": response.tokens_used,
                        "cost": response.cost_estimate,
                        "response_time_ms": response.response_time_ms,
                    },
                )

                return response

            except Exception as e:
                last_error = e
                logger.warning(f"Failed to use model {attempt_model}: {e}")
                continue

        # All models failed
        track_error(
            error_type="all_models_failed",
            component="ai_client_manager",
            error_message=f"All models failed for service {request.service_name}",
            user_id=request.user_id,
        )

        raise Exception(
            f"All models failed for service {request.service_name}. Last error: {last_error}"
        )

    async def generate_embeddings(
<<<<<<< HEAD
        self, texts: List[str], model_name: Optional[str] = None
    ) -> List[List[float]]:
=======
        self, texts: list[str], model_name: str | None = None
    ) -> list[list[float]]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Generate embeddings for texts"""

        # Use default embedding model if none specified
        if not model_name:
            embedding_models = self.config_manager.get_models_by_type(AIModelType.TEXT_EMBEDDING)
            if not embedding_models:
                raise ValueError("No embedding models configured")
            model_name = embedding_models[0].name

        model_config = self.config_manager.get_model_config(model_name)
        if not model_config:
            raise ValueError(f"Embedding model '{model_name}' not found")

        client = self.clients.get(model_config.provider)
        if not client:
            raise ValueError(f"No client available for provider: {model_config.provider.value}")

        return await client.generate_embeddings(texts, model_config)

<<<<<<< HEAD
    async def health_check(self) -> Dict[str, bool]:
=======
    async def health_check(self) -> dict[str, bool]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Check health of all configured AI providers"""
        health_status = {}

        for provider, client in self.clients.items():
            try:
                health_status[provider.value] = await client.health_check()
            except Exception as e:
                logger.error(f"Health check failed for {provider.value}: {e}")
                health_status[provider.value] = False

        return health_status

<<<<<<< HEAD
    def get_available_models(self, service_name: Optional[str] = None) -> List[str]:
=======
    def get_available_models(self, service_name: str | None = None) -> list[str]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Get list of available models, optionally filtered by service"""
        if service_name:
            service_config = self.config_manager.get_service_config(service_name)
            if service_config:
                return [service_config.primary_model] + service_config.fallback_models

        return list(self.config_manager.models.keys())

<<<<<<< HEAD
    def get_service_status(self) -> Dict[str, Dict[str, Any]]:
=======
    def get_service_status(self) -> dict[str, dict[str, Any]]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Get status of all AI services"""
        status = {}

        for service_name, service_config in self.config_manager.services.items():
            model_config = self.config_manager.get_model_config(service_config.primary_model)
            provider_available = model_config.provider in self.clients if model_config else False

            status[service_name] = {
                "enabled": service_config.enabled,
                "primary_model": service_config.primary_model,
                "fallback_models": service_config.fallback_models,
                "provider_available": provider_available,
                "cache_enabled": service_config.cache_enabled,
                "daily_budget": service_config.cost_budget_daily,
                "rate_limit_per_user": service_config.rate_limit_per_user,
            }

        return status


# Global AI client manager instance
<<<<<<< HEAD
_ai_client_manager: Optional[AIClientManager] = None
=======
_ai_client_manager: AIClientManager | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


def get_ai_client() -> AIClientManager:
    """Get the global AI client manager instance"""
    global _ai_client_manager
    if _ai_client_manager is None:
        _ai_client_manager = AIClientManager()
    return _ai_client_manager


def setup_ai_client(
<<<<<<< HEAD
    config_manager: Optional[AIConfigManager] = None,
=======
    config_manager: AIConfigManager | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
) -> AIClientManager:
    """Setup the global AI client manager"""
    global _ai_client_manager
    _ai_client_manager = AIClientManager(config_manager)
    return _ai_client_manager
