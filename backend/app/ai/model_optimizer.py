"""
Model Optimizer for Google Vertex AI Models

Provides functionality to optimize models for better performance and cost efficiency.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Optional, Union

from google.cloud import aiplatform
from google.cloud.aiplatform import Model
from google.cloud.aiplatform_v1.types import (
    ModelDeploymentMonitoringObjectiveConfig,
    ModelMonitoringAlertConfig,
)

from app.core.logging_config import get_logger

logger = get_logger(__name__)


class OptimizationLevel(str, Enum):
    """Optimization levels for model optimization"""
    NONE = "none"
    LIGHT = "light"  # Minimal optimization, best quality
    MEDIUM = "medium"  # Balanced optimization
    AGGRESSIVE = "aggressive"  # Maximum optimization, may affect quality


@dataclass
class OptimizationConfig:
    """Configuration for model optimization"""
    level: OptimizationLevel = OptimizationLevel.MEDIUM
    target_device: str = "cpu"  # 'cpu' or 'gpu'
    enable_quantization: bool = True
    enable_pruning: bool = True
    model_framework: str = "pytorch"  # or 'tensorflow'


class ModelOptimizer:
    """Handles optimization of AI models for deployment"""

    def __init__(self, project_id: str, location: str):
        """Initialize the model optimizer
        
        Args:
            project_id: GCP project ID
            location: GCP location/region
        """
        self.project_id = project_id
        self.location = location
        aiplatform.init(project=project_id, location=location)

    def optimize_model(
        self,
        model_id: str,
        optimization_config: Optional[OptimizationConfig] = None,
        display_name: Optional[str] = None,
        description: str = "Optimized with CareerCopilot Model Optimizer",
    ) -> Model:
        """Optimize a model for deployment
        
        Args:
            model_id: ID of the model to optimize (e.g., 'gemini-2.5-flash')
            optimization_config: Configuration for optimization
            display_name: Display name for the optimized model
            description: Description for the optimized model
            
        Returns:
            The optimized model
        """
        if optimization_config is None:
            optimization_config = OptimizationConfig()

        display_name = display_name or f"optimized-{model_id}-{optimization_config.level}"
        
        # Get the base model
        base_model = Model(
            model_name=model_id,
            project=self.project_id,
            location=self.location,
        )

        # Configure optimization parameters based on the optimization level
        optimization_params = self._get_optimization_params(optimization_config)
        
        # Deploy the optimized model
        endpoint = base_model.deploy(
            deployed_model_display_name=display_name,
            machine_type=self._get_machine_type(optimization_config),
            min_replica_count=1,
            max_replica_count=3,
            sync=True,
            **optimization_params,
        )

        logger.info(
            f"Optimized model deployed to endpoint: {endpoint.resource_name}",
            model_id=model_id,
            optimization_level=optimization_config.level,
            endpoint=endpoint.resource_name,
        )
        
        return endpoint

    def _get_optimization_params(
        self, config: OptimizationConfig
    ) -> Dict[str, Union[bool, str, int, float]]:
        """Get optimization parameters based on the configuration"""
        params = {
            "enable_quantization": config.enable_quantization,
            "enable_pruning": config.enable_pruning,
            "model_framework": config.model_framework,
        }

        # Set optimization level specific parameters
        if config.level == OptimizationLevel.LIGHT:
            params.update(
                {
                    "quantization_bits": 8,  # Light quantization
                    "pruning_ratio": 0.2,  # 20% pruning
                    "enable_attention_optimization": True,
                }
            )
        elif config.level == OptimizationLevel.MEDIUM:
            params.update(
                {
                    "quantization_bits": 4,  # Medium quantization
                    "pruning_ratio": 0.4,  # 40% pruning
                    "enable_attention_optimization": True,
                    "enable_fusion": True,
                }
            )
        elif config.level == OptimizationLevel.AGGRESSIVE:
            params.update(
                {
                    "quantization_bits": 2,  # Aggressive quantization
                    "pruning_ratio": 0.6,  # 60% pruning
                    "enable_attention_optimization": True,
                    "enable_fusion": True,
                    "enable_layer_fusion": True,
                    "optimize_for_latency": True,
                }
            )

        return params

    def _get_machine_type(self, config: OptimizationConfig) -> str:
        """Get the appropriate machine type based on optimization settings"""
        if config.target_device.lower() == "gpu":
            return "n1-standard-4"  # With GPU
        return "n1-standard-2"  # CPU optimized

    def get_optimization_impact(
        self, model_id: str, optimization_level: OptimizationLevel
    ) -> Dict[str, float]:
        """Estimate the impact of optimization on model performance
        
        Returns:
            Dictionary with estimated improvements:
            - latency_reduction: Estimated reduction in latency (0-1)
            - size_reduction: Estimated reduction in model size (0-1)
            - cost_reduction: Estimated reduction in inference cost (0-1)
        """
        # These are rough estimates based on Google's documentation
        estimates = {
            OptimizationLevel.NONE: {
                "latency_reduction": 0.0,
                "size_reduction": 0.0,
                "cost_reduction": 0.0,
            },
            OptimizationLevel.LIGHT: {
                "latency_reduction": 0.2,  # 20% faster
                "size_reduction": 0.3,  # 30% smaller
                "cost_reduction": 0.25,  # 25% cheaper
            },
            OptimizationLevel.MEDIUM: {
                "latency_reduction": 0.4,  # 40% faster
                "size_reduction": 0.6,  # 60% smaller
                "cost_reduction": 0.5,  # 50% cheaper
            },
            OptimizationLevel.AGGRESSIVE: {
                "latency_reduction": 0.6,  # 60% faster
                "size_reduction": 0.8,  # 80% smaller
                "cost_reduction": 0.7,  # 70% cheaper
            },
        }
        
        return estimates.get(optimization_level, estimates[OptimizationLevel.MEDIUM])
