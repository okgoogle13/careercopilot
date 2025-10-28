"""
Model Optimization Script for CareerCopilot

This script loads and deploys optimized versions of AI models.
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, List, Optional

# Add the parent directory to the Python path
import sys

sys.path.append(str(Path(__file__).parent.parent))

from app.core.ai_config import AIConfigManager, ModelConfig, get_ai_config
from app.ai.model_optimizer import (
    ModelOptimizer,
    OptimizationConfig,
    OptimizationLevel,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_optimized_models_config(
    config_path: Optional[str] = None,
) -> List[Dict[str, any]]:
    """Load optimized models configuration from JSON file."""
    if config_path is None:
        config_path = (
            Path(__file__).parent.parent / "config" / "optimized_models.json"
        )

    try:
        with open(config_path, "r") as f:
            config = json.load(f)
            return config.get("optimized_models", [])
    except FileNotFoundError:
        logger.warning(f"Optimized models config not found at {config_path}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing optimized models config: {e}")
        return []


def create_optimized_models() -> None:
    """Create and deploy optimized models based on configuration."""
    # Initialize config manager
    config_manager = get_ai_config()
    
    # Load optimized models configuration
    optimized_models = load_optimized_models_config()
    
    if not optimized_models:
        logger.warning("No optimized models configured")
        return

    # Initialize model optimizer
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    location = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    
    if not project_id:
        logger.error("GOOGLE_CLOUD_PROJECT environment variable not set")
        return

    optimizer = ModelOptimizer(project_id=project_id, location=location)

    # Process each optimized model
    for model_config in optimized_models:
        try:
            model_name = model_config["name"]
            base_model_id = model_config["model_id"]
            optimization_config = OptimizationConfig(
                level=OptimizationLevel(model_config["optimization_config"]["level"]),
                target_device=model_config["optimization_config"]["target_device"],
                enable_quantization=model_config["optimization_config"]["enable_quantization"],
                enable_pruning=model_config["optimization_config"]["enable_pruning"],
                model_framework=model_config["optimization_config"]["model_framework"],
            )

            logger.info(f"Optimizing model {base_model_id} as {model_name}...")
            
            # Optimize and deploy the model
            endpoint = optimizer.optimize_model(
                model_id=base_model_id,
                optimization_config=optimization_config,
                display_name=model_name,
                description=model_config.get("description", ""),
            )

            logger.info(
                f"Successfully deployed optimized model {model_name} to {endpoint.resource_name}"
            )

            # Update the model configuration
            model_config = ModelConfig(
                name=model_name,
                provider="google_ai",
                model_type="text_generation",
                model_id=base_model_id,
                optimization_config=optimization_config,
                optimization_enabled=True,
                cost_per_1k_tokens=model_config.get(
                    "cost_per_1k_tokens", {"input": 0.1, "output": 0.3}
                ),
                custom_parameters={
                    "optimized_endpoint": endpoint.resource_name,
                    "base_model": base_model_id,
                },
            )

            # Add or update the model in the configuration
            config_manager.models[model_name] = model_config
            logger.info(f"Added optimized model {model_name} to configuration")

        except Exception as e:
            logger.error(f"Error optimizing model {model_config.get('name', 'unknown')}: {e}")

    # Save the updated configuration
    try:
        config_manager.save_configuration()
        logger.info("Configuration updated with optimized models")
    except Exception as e:
        logger.error(f"Error saving configuration: {e}")


def list_optimized_models() -> None:
    """List all optimized models in the configuration."""
    config_manager = get_ai_config()
    
    print("\nOptimized Models:")
    print("-" * 80)
    
    for name, model in config_manager.models.items():
        if getattr(model, "optimization_enabled", False):
            print(f"Name: {name}")
            print(f"  Base Model: {model.model_id}")
            print(f"  Provider: {model.provider}")
            print(f"  Type: {model.model_type}")
            if hasattr(model, "optimization_config"):
                print(f"  Optimization Level: {model.optimization_config.level}")
            print("-" * 80)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Manage optimized AI models")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Create command
    create_parser = subparsers.add_parser("create", help="Create optimized models")
    create_parser.add_argument(
        "--config",
        type=str,
        help="Path to optimized models configuration file",
    )

    # List command
    list_parser = subparsers.add_parser("list", help="List optimized models")

    args = parser.parse_args()

    if args.command == "create":
        create_optimized_models()
    elif args.command == "list":
        list_optimized_models()
    else:
        parser.print_help()
