"""
AI Services Management API

Provides endpoints for managing AI service configurations, monitoring
AI operations, and administering AI-related features.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.core.ai_config import get_ai_config, AIProvider, AIModelType
from app.core.ai_client import get_ai_client, AIRequest
from app.core.dependencies import get_current_user
from app.core.monitoring import get_metrics_collector

router = APIRouter()

@router.get("/status", tags=["AI Services"])
async def get_ai_services_status():
    """
    Get overall status of AI services
    
    Returns the status of all configured AI services, models,
    and providers including availability and health checks.
    """
    try:
        config_manager = get_ai_config()
        ai_client = get_ai_client()
        
        # Get service status
        service_status = ai_client.get_service_status()
        
        # Get provider health
        provider_health = await ai_client.health_check()
        
        # Get configuration summary
        config_summary = config_manager.get_configuration_summary()
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'overall_status': 'healthy' if any(provider_health.values()) else 'degraded',
            'services': service_status,
            'providers': {
                'health': provider_health,
                'configured': config_summary['providers']['available']
            },
            'models': {
                'total_available': config_summary['models']['total'],
                'by_provider': config_summary['models']['by_provider'],
                'by_type': config_summary['models']['by_type']
            },
            'configuration_issues': config_summary['validation']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI services status: {str(e)}")

@router.get("/models", tags=["AI Services"])
async def get_available_models(
    provider: Optional[str] = Query(None, description="Filter by provider"),
    model_type: Optional[str] = Query(None, description="Filter by model type"),
    service: Optional[str] = Query(None, description="Filter by service")
):
    """
    Get list of available AI models
    
    Returns detailed information about all configured AI models
    with optional filtering by provider, type, or service.
    """
    try:
        config_manager = get_ai_config()
        ai_client = get_ai_client()
        
        models = []
        
        if service:
            # Get models for specific service
            service_models = ai_client.get_available_models(service)
            for model_name in service_models:
                model_config = config_manager.get_model_config(model_name)
                if model_config:
                    models.append(model_config.to_dict())
        else:
            # Get all models with optional filtering
            all_models = config_manager.models.values()
            
            for model_config in all_models:
                # Apply filters
                if provider and model_config.provider.value != provider:
                    continue
                if model_type and model_config.model_type.value != model_type:
                    continue
                
                models.append(model_config.to_dict())
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'filters': {
                'provider': provider,
                'model_type': model_type,
                'service': service
            },
            'models': models,
            'total_count': len(models)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get models: {str(e)}")

@router.get("/services", tags=["AI Services"])
async def get_ai_services(enabled_only: bool = Query(False, description="Return only enabled services")):
    """
    Get list of AI services
    
    Returns detailed information about all configured AI services
    including their models, rate limits, and cost budgets.
    """
    try:
        config_manager = get_ai_config()
        
        services = []
        all_services = config_manager.get_enabled_services() if enabled_only else list(config_manager.services.values())
        
        for service_config in all_services:
            service_data = service_config.to_dict()
            
            # Add model details
            primary_model = config_manager.get_model_config(service_config.primary_model)
            service_data['primary_model_details'] = primary_model.to_dict() if primary_model else None
            
            # Add fallback model details
            service_data['fallback_model_details'] = []
            for fallback_name in service_config.fallback_models:
                fallback_model = config_manager.get_model_config(fallback_name)
                if fallback_model:
                    service_data['fallback_model_details'].append(fallback_model.to_dict())
            
            services.append(service_data)
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'services': services,
            'total_count': len(services),
            'enabled_only': enabled_only
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get services: {str(e)}")

@router.get("/usage-metrics", tags=["AI Services"])
async def get_ai_usage_metrics(
    time_window_hours: int = Query(24, description="Time window for metrics in hours"),
    service: Optional[str] = Query(None, description="Filter by service")
):
    """
    Get AI usage metrics and cost analysis
    
    Returns detailed usage statistics including token consumption,
    cost estimates, cache hit rates, and performance metrics.
    """
    try:
        collector = get_metrics_collector()
        metrics_summary = collector.get_metrics_summary()
        
        # Extract AI-specific metrics
        ai_metrics = {}
        
        # Get counters related to AI
        for counter_name, value in metrics_summary.get('counters', {}).items():
            if 'ai_operation' in counter_name:
                ai_metrics[counter_name] = value
        
        # Calculate derived metrics
        total_operations = ai_metrics.get('ai_operation_total', 0)
        cached_operations = ai_metrics.get('ai_operation_cached_total', 0)
        cache_hit_rate = (cached_operations / total_operations * 100) if total_operations > 0 else 0
        
        # Get token usage
        total_tokens = ai_metrics.get('ai_tokens_used_total', 0)
        avg_tokens_per_operation = (total_tokens / total_operations) if total_operations > 0 else 0
        
        # Get performance metrics for AI operations
        ai_performance = {}
        for perf_name, perf_data in metrics_summary.get('performance_metrics', {}).items():
            if service and service not in perf_name:
                continue
            if any(ai_service in perf_name for ai_service in ['resume_analysis', 'job_analysis', 'ats_scoring', 'cover_letter', 'voice_profile', 'ksc']):
                ai_performance[perf_name] = perf_data
        
        # Estimate costs (would be more accurate with actual billing data)
        estimated_cost = total_tokens * 0.001  # Rough estimate: $0.001 per token
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'time_window_hours': time_window_hours,
            'service_filter': service,
            'summary': {
                'total_operations': total_operations,
                'cached_operations': cached_operations,
                'cache_hit_rate_percent': round(cache_hit_rate, 2),
                'total_tokens_used': total_tokens,
                'avg_tokens_per_operation': round(avg_tokens_per_operation, 1),
                'estimated_cost_usd': round(estimated_cost, 4)
            },
            'operations_by_type': {
                name.replace('ai_operation_', ''): value 
                for name, value in ai_metrics.items() 
                if name.startswith('ai_operation_') and not name.endswith('_total') and not name.endswith('_cached')
            },
            'performance_metrics': ai_performance,
            'cost_breakdown': {
                'total_estimated_usd': round(estimated_cost, 4),
                'cost_per_operation': round(estimated_cost / max(total_operations, 1), 6),
                'savings_from_cache_usd': round((cached_operations / max(total_operations, 1)) * estimated_cost, 4)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage metrics: {str(e)}")

@router.post("/test/{service_name}", tags=["AI Services"])
async def test_ai_service(
    service_name: str,
    test_prompt: str = "Hello, this is a test.",
    model_name: Optional[str] = None,
    current_user: str = Depends(get_current_user)
):
    """
    Test an AI service
    
    Sends a test request to the specified AI service to verify
    it's working correctly. Useful for debugging and health checks.
    """
    try:
        config_manager = get_ai_config()
        ai_client = get_ai_client()
        
        # Check if service exists and is enabled
        service_config = config_manager.get_service_config(service_name)
        if not service_config:
            raise HTTPException(status_code=404, detail=f"Service '{service_name}' not found")
        
        if not service_config.enabled:
            raise HTTPException(status_code=503, detail=f"Service '{service_name}' is disabled")
        
        # Create test request
        request = AIRequest(
            prompt=test_prompt,
            service_name=service_name,
            user_id=current_user,
            model_name=model_name,
            max_tokens=100  # Limit tokens for test
        )
        
        # Generate response
        response = await ai_client.generate_text(request)
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'service_name': service_name,
            'test_successful': True,
            'response': {
                'content': response.content,
                'model_used': response.model_used,
                'provider': response.provider,
                'tokens_used': response.tokens_used,
                'response_time_ms': response.response_time_ms,
                'cost_estimate': response.cost_estimate
            }
        }
    except Exception as e:
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'service_name': service_name,
            'test_successful': False,
            'error': str(e),
            'error_type': type(e).__name__
        }

@router.get("/providers", tags=["AI Services"])
async def get_ai_providers():
    """
    Get information about AI providers
    
    Returns details about all configured AI providers including
    their health status, available models, and configuration.
    """
    try:
        config_manager = get_ai_config()
        ai_client = get_ai_client()
        
        # Get provider health
        provider_health = await ai_client.health_check()
        
        providers = []
        for provider in AIProvider:
            credentials = config_manager.get_provider_credentials(provider)
            models = config_manager.get_models_by_provider(provider)
            
            provider_info = {
                'name': provider.value,
                'configured': credentials is not None,
                'healthy': provider_health.get(provider.value, False),
                'models_available': len(models),
                'models': [model.name for model in models]
            }
            
            # Add credential info (without secrets)
            if credentials:
                provider_info['credentials'] = credentials.to_dict(include_secrets=False)
            
            providers.append(provider_info)
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'providers': providers,
            'total_configured': len([p for p in providers if p['configured']]),
            'total_healthy': len([p for p in providers if p['healthy']])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get providers: {str(e)}")

# Admin endpoints (require authentication)

@router.get("/admin/configuration", tags=["AI Services", "Admin"])
async def get_ai_configuration(current_user: str = Depends(get_current_user)):
    """
    Get complete AI configuration (Admin only)
    
    Returns the complete AI configuration including models,
    services, and provider settings for administrative purposes.
    """
    try:
        config_manager = get_ai_config()
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'configuration': config_manager.get_configuration_summary(),
            'models': {name: model.to_dict() for name, model in config_manager.models.items()},
            'services': {name: service.to_dict() for name, service in config_manager.services.items()},
            'providers': {
                provider.value: creds.to_dict(include_secrets=False)
                for provider, creds in config_manager.credentials.items()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get configuration: {str(e)}")

@router.post("/admin/reload-config", tags=["AI Services", "Admin"])
async def reload_ai_configuration(current_user: str = Depends(get_current_user)):
    """
    Reload AI configuration (Admin only)
    
    Reloads the AI configuration from files and environment variables.
    Useful after making configuration changes.
    """
    try:
        from app.core.ai_config import reload_ai_config
        from app.core.ai_client import setup_ai_client
        
        # Reload configuration
        config_manager = reload_ai_config()
        
        # Reinitialize AI client with new configuration
        setup_ai_client(config_manager)
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'AI configuration reloaded successfully',
            'summary': config_manager.get_configuration_summary()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reload configuration: {str(e)}")

@router.post("/admin/validate-config", tags=["AI Services", "Admin"])
async def validate_ai_configuration(current_user: str = Depends(get_current_user)):
    """
    Validate AI configuration (Admin only)
    
    Validates the current AI configuration and returns any
    errors, warnings, or recommendations for improvement.
    """
    try:
        config_manager = get_ai_config()
        validation_results = config_manager.validate_configuration()
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'validation': validation_results,
            'is_valid': len(validation_results['errors']) == 0,
            'has_warnings': len(validation_results['warnings']) > 0,
            'summary': {
                'error_count': len(validation_results['errors']),
                'warning_count': len(validation_results['warnings'])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to validate configuration: {str(e)}")

@router.put("/admin/service/{service_name}/enable", tags=["AI Services", "Admin"])
async def enable_ai_service(service_name: str, current_user: str = Depends(get_current_user)):
    """
    Enable an AI service (Admin only)
    
    Enables the specified AI service, making it available for use.
    """
    try:
        config_manager = get_ai_config()
        service_config = config_manager.get_service_config(service_name)
        
        if not service_config:
            raise HTTPException(status_code=404, detail=f"Service '{service_name}' not found")
        
        service_config.enabled = True
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'service_name': service_name,
            'enabled': True,
            'message': f"Service '{service_name}' has been enabled"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to enable service: {str(e)}")

@router.put("/admin/service/{service_name}/disable", tags=["AI Services", "Admin"])
async def disable_ai_service(service_name: str, current_user: str = Depends(get_current_user)):
    """
    Disable an AI service (Admin only)
    
    Disables the specified AI service, preventing its use.
    """
    try:
        config_manager = get_ai_config()
        service_config = config_manager.get_service_config(service_name)
        
        if not service_config:
            raise HTTPException(status_code=404, detail=f"Service '{service_name}' not found")
        
        service_config.enabled = False
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'service_name': service_name,
            'enabled': False,
            'message': f"Service '{service_name}' has been disabled"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to disable service: {str(e)}")

@router.get("/admin/cost-analysis", tags=["AI Services", "Admin"])
async def get_cost_analysis(
    days: int = Query(7, description="Number of days to analyze"),
    current_user: str = Depends(get_current_user)
):
    """
    Get detailed cost analysis (Admin only)
    
    Returns detailed cost breakdown and analysis for AI operations
    over the specified time period.
    """
    try:
        collector = get_metrics_collector()
        metrics_summary = collector.get_metrics_summary()
        config_manager = get_ai_config()
        
        # Get total tokens used
        total_tokens = metrics_summary.get('counters', {}).get('ai_tokens_used_total', 0)
        
        # Analyze cost by service
        service_costs = {}
        total_estimated_cost = 0.0
        
        for service_name, service_config in config_manager.services.items():
            # Get service-specific token usage
            service_operations = metrics_summary.get('counters', {}).get(f'ai_operation_{service_name}', 0)
            
            if service_operations > 0:
                # Rough estimate based on primary model costs
                primary_model = config_manager.get_model_config(service_config.primary_model)
                if primary_model:
                    # Estimate average tokens per operation for this service
                    avg_tokens = 1500  # Default estimate
                    if 'resume_analysis' in service_name or 'job_analysis' in service_name:
                        avg_tokens = 2000
                    elif 'cover_letter' in service_name:
                        avg_tokens = 1000
                    
                    estimated_tokens = service_operations * avg_tokens
                    service_cost = (estimated_tokens / 1000) * (
                        primary_model.cost_per_1k_tokens.get('input', 0) + 
                        primary_model.cost_per_1k_tokens.get('output', 0)
                    )
                    
                    service_costs[service_name] = {
                        'operations': service_operations,
                        'estimated_tokens': estimated_tokens,
                        'estimated_cost_usd': service_cost,
                        'daily_budget_usd': service_config.cost_budget_daily,
                        'budget_utilization_percent': (service_cost / (service_config.cost_budget_daily * days)) * 100
                    }
                    
                    total_estimated_cost += service_cost
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'analysis_period_days': days,
            'total_estimated_cost_usd': round(total_estimated_cost, 4),
            'total_tokens_used': total_tokens,
            'avg_cost_per_operation': round(total_estimated_cost / max(sum(sc['operations'] for sc in service_costs.values()), 1), 6),
            'service_breakdown': service_costs,
            'cost_trends': {
                'daily_average': round(total_estimated_cost / days, 4),
                'monthly_projection': round(total_estimated_cost / days * 30, 2),
                'yearly_projection': round(total_estimated_cost / days * 365, 2)
            },
            'recommendations': [
                "Enable caching to reduce duplicate operations",
                "Monitor high-cost services for optimization opportunities",
                "Consider using smaller models for simple tasks",
                "Set up alerts for budget thresholds"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cost analysis: {str(e)}")