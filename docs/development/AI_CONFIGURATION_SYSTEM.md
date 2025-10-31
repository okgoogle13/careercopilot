# AI Configuration System

## Overview

The AI Configuration System provides centralized management for all AI service configurations, model parameters, provider credentials, and operational settings. It enables dynamic configuration, intelligent routing, cost management, and comprehensive monitoring across multiple AI providers.

## Key Features

- **🔧 Unified Configuration**: Single source of truth for all AI settings
- **🔄 Multi-Provider Support**: OpenAI, Google AI, Anthropic, Azure OpenAI, AWS Bedrock
- **💰 Cost Management**: Budget tracking, usage monitoring, and cost optimization
- **🛡️ Secure Credentials**: Environment-based credential management
- **📊 Intelligent Routing**: Automatic fallback models and load balancing
- **⚡ Dynamic Reconfiguration**: Hot-reload configuration without restarts
- **🔍 Comprehensive Monitoring**: Performance, costs, and service health tracking

## Architecture

### Core Components

1. **AI Configuration Manager** (`ai_config.py`)
   - Model configurations and parameters
   - Service definitions and routing rules
   - Provider credential management
   - Validation and health checks

2. **AI Client Manager** (`ai_client.py`)
   - Unified interface for all AI providers
   - Automatic fallback and retry logic
   - Request/response standardization
   - Performance monitoring and caching integration

3. **AI Services API** (`ai_services.py`)
   - Configuration management endpoints
   - Usage analytics and cost analysis
   - Health monitoring and testing
   - Admin configuration tools

## Configuration Structure

### Models Configuration

Each AI model is defined with comprehensive parameters:

```json
{
  "gpt-4o-mini": {
    "name": "gpt-4o-mini",
    "provider": "openai",
    "model_type": "text_generation",
    "model_id": "gpt-4o-mini",
    "max_tokens": 4096,
    "temperature": 0.7,
    "cost_per_1k_tokens": {
      "input": 0.00015,
      "output": 0.0006
    },
    "rate_limit": {
      "requests_per_minute": 120,
      "tokens_per_minute": 20000
    },
    "context_window": 128000,
    "supports_streaming": true,
    "supports_function_calling": true
  }
}
```

### Services Configuration

AI services define business operations with routing and cost controls:

```json
{
  "resume_analysis": {
    "service_name": "resume_analysis",
    "description": "Analyze resumes for skills, experience, and recommendations",
    "primary_model": "gpt-4o-mini",
    "fallback_models": ["gemini-1.5-flash"],
    "enabled": true,
    "cache_enabled": true,
    "cache_ttl_seconds": 3600,
    "rate_limit_per_user": 50,
    "cost_budget_daily": 50.0,
    "custom_settings": {
      "max_document_length": 50000,
      "include_recommendations": true,
      "skill_extraction": true
    }
  }
}
```

### Provider Credentials

Credentials are managed securely through environment variables:

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...

# Google AI
GOOGLE_AI_API_KEY=AI...
GOOGLE_CLOUD_PROJECT=project-id

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Azure OpenAI
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://....openai.azure.com/
AZURE_OPENAI_REGION=eastus

# AWS Bedrock
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=us-east-1
```

## Service Definitions

### Pre-configured Services

| Service                   | Primary Model          | Purpose                                 | Cache TTL | Daily Budget |
| ------------------------- | ---------------------- | --------------------------------------- | --------- | ------------ |
| `resume_analysis`         | gpt-4o-mini            | Resume skills and experience analysis   | 1h        | $50          |
| `job_analysis`            | gpt-4o-mini            | Job description requirement extraction  | 2h        | $25          |
| `ats_scoring`             | gpt-4o                 | Resume-job compatibility scoring        | 30min     | $75          |
| `cover_letter_generation` | gpt-4o                 | Personalized cover letter creation      | 15min     | $60          |
| `voice_profile`           | gpt-4o                 | User writing style analysis             | 24h       | $30          |
| `ksc_generation`          | gpt-4o-mini            | Knowledge/Skills/Competencies responses | 1h        | $40          |
| `document_extraction`     | gpt-4o-mini            | Structured data extraction              | 2h        | $35          |
| `text_embedding`          | text-embedding-3-small | Semantic search embeddings              | 24h       | $10          |

## Usage Examples

### Basic AI Request

```python
from app.core.ai_client import get_ai_client, AIRequest

ai_client = get_ai_client()

request = AIRequest(
    prompt="Analyze this resume for key skills and experience",
    service_name="resume_analysis",
    user_id="user_123",
    model_name=None,  # Will use service's primary model
    max_tokens=2000,
    temperature=0.7
)

response = await ai_client.generate_text(request)

print(f"Content: {response.content}")
print(f"Model used: {response.model_used}")
print(f"Tokens: {response.tokens_used}")
print(f"Cost: ${response.cost_estimate}")
```

### Service Configuration Access

```python
from app.core.ai_config import get_ai_config

config = get_ai_config()

# Get service configuration
service_config = config.get_service_config("resume_analysis")
print(f"Primary model: {service_config.primary_model}")
print(f"Rate limit: {service_config.rate_limit_per_user}/hour")
print(f"Daily budget: ${service_config.cost_budget_daily}")

# Get model details
model_config = config.get_model_config("gpt-4o-mini")
print(f"Provider: {model_config.provider}")
print(f"Context window: {model_config.context_window}")
print(f"Cost per 1K tokens: {model_config.cost_per_1k_tokens}")
```

### Configuration Validation

```python
config = get_ai_config()
validation = config.validate_configuration()

if validation['errors']:
    print("Configuration errors:")
    for error in validation['errors']:
        print(f"  - {error}")

if validation['warnings']:
    print("Configuration warnings:")
    for warning in validation['warnings']:
        print(f"  - {warning}")
```

## API Endpoints

### Public Endpoints

| Endpoint                   | Method | Description                     |
| -------------------------- | ------ | ------------------------------- |
| `/api/v1/ai/status`        | GET    | Overall AI services status      |
| `/api/v1/ai/models`        | GET    | Available models with filtering |
| `/api/v1/ai/services`      | GET    | AI services configuration       |
| `/api/v1/ai/providers`     | GET    | Provider status and health      |
| `/api/v1/ai/usage-metrics` | GET    | Usage analytics and costs       |

### Admin Endpoints (Authentication Required)

| Endpoint                                  | Method | Description                     |
| ----------------------------------------- | ------ | ------------------------------- |
| `/api/v1/ai/admin/configuration`          | GET    | Complete configuration details  |
| `/api/v1/ai/admin/reload-config`          | POST   | Reload configuration from files |
| `/api/v1/ai/admin/validate-config`        | POST   | Validate current configuration  |
| `/api/v1/ai/admin/service/{name}/enable`  | PUT    | Enable AI service               |
| `/api/v1/ai/admin/service/{name}/disable` | PUT    | Disable AI service              |
| `/api/v1/ai/admin/cost-analysis`          | GET    | Detailed cost breakdown         |

### Testing Endpoints

```bash
# Test a service
curl -X POST "/api/v1/ai/test/resume_analysis" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"test_prompt": "Test resume analysis with sample text"}'

# Get service status
curl "/api/v1/ai/status"

# Get usage metrics
curl "/api/v1/ai/usage-metrics?time_window_hours=24"
```

## Environment Configuration

### Development Setup

```bash
# Basic AI provider setup
export OPENAI_API_KEY="sk-..."
export GOOGLE_AI_API_KEY="AI..."
export ANTHROPIC_API_KEY="sk-ant-..."

# Configuration file path (optional)
export AI_CONFIG_FILE="config/ai_config.json"

# Global settings
export AI_CACHE_ENABLED=true
export AI_MONITORING_ENABLED=true
export AI_RETRY_ATTEMPTS=3
export AI_TIMEOUT_SECONDS=30
export AI_COST_BUDGET_DAILY=100.0
```

### Production Setup

```bash
# Provider credentials from secrets management
export OPENAI_API_KEY="${OPENAI_API_KEY}"
export OPENAI_ORG_ID="${OPENAI_ORG_ID}"

export GOOGLE_AI_API_KEY="${GOOGLE_AI_API_KEY}"
export GOOGLE_CLOUD_PROJECT="${GOOGLE_CLOUD_PROJECT}"

export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"

# Azure OpenAI (if using)
export AZURE_OPENAI_API_KEY="${AZURE_OPENAI_API_KEY}"
export AZURE_OPENAI_ENDPOINT="${AZURE_OPENAI_ENDPOINT}"

# Configuration
export AI_CONFIG_FILE="/app/config/ai_config.json"
export ENV=production
```

## Cost Management

### Budget Controls

Each service has configurable daily budgets:

```json
{
  "resume_analysis": {
    "cost_budget_daily": 50.0,
    "rate_limit_per_user": 50
  }
}
```

### Cost Tracking

The system tracks costs in real-time:

```python
# Get cost analysis
response = requests.get("/api/v1/ai/admin/cost-analysis?days=7")
cost_data = response.json()

print(f"Total cost: ${cost_data['total_estimated_cost_usd']}")
print(f"Daily average: ${cost_data['cost_trends']['daily_average']}")

# Service breakdown
for service, costs in cost_data['service_breakdown'].items():
    print(f"{service}: ${costs['estimated_cost_usd']} ({costs['operations']} ops)")
```

### Budget Alerts

Configure budget alerts by setting thresholds:

```bash
# Alert when daily costs exceed 80% of budget
export AI_BUDGET_ALERT_THRESHOLD=0.8

# Alert when service fails multiple times
export AI_ERROR_ALERT_THRESHOLD=5
```

## Model Selection Strategy

### Automatic Fallbacks

Services are configured with intelligent fallback strategies:

1. **Primary Model**: Preferred model for the service
2. **Fallback Models**: Alternative models if primary fails
3. **Cost Optimization**: Cheaper models for simple tasks
4. **Provider Diversity**: Distribute load across providers

```python
# Example fallback configuration
{
  "ats_scoring": {
    "primary_model": "gpt-4o",           # High-quality primary
    "fallback_models": [
      "gpt-4o-mini",                      # Cost-effective fallback
      "claude-3-5-sonnet"                 # Different provider
    ]
  }
}
```

### Dynamic Model Selection

The system automatically selects models based on:

- **Service Requirements**: Quality thresholds and complexity
- **Cost Constraints**: Budget availability and optimization
- **Provider Health**: Real-time availability and performance
- **Rate Limits**: Available capacity and request quotas

## Performance Optimization

### Caching Integration

AI responses are automatically cached using the caching system:

```python
# Cache configuration per service
{
  "resume_analysis": {
    "cache_enabled": true,
    "cache_ttl_seconds": 3600  # 1 hour cache
  }
}
```

### Request Optimization

- **Prompt Engineering**: Optimized prompts for each service
- **Token Management**: Automatic token counting and limits
- **Batch Processing**: Efficient handling of multiple requests
- **Streaming Support**: Real-time response streaming where supported

## Monitoring and Alerting

### Health Checks

```python
# Provider health monitoring
health_status = await ai_client.health_check()
for provider, is_healthy in health_status.items():
    print(f"{provider}: {'✓' if is_healthy else '✗'}")
```

### Performance Metrics

- **Response Times**: P50, P95, P99 response time tracking
- **Error Rates**: Provider and model-specific error tracking
- **Token Usage**: Real-time token consumption monitoring
- **Cost Tracking**: Per-service and per-user cost analysis

### Alert Conditions

- **High Error Rate**: >5% errors trigger warning, >10% critical
- **Slow Response**: >2s average response time
- **Budget Exceeded**: Daily budget >80% utilized
- **Provider Unavailable**: Any configured provider fails health check

## Security Considerations

### Credential Management

- **Environment Variables**: All secrets stored in environment
- **No Secrets in Config**: Configuration files contain no credentials
- **Rotation Support**: Easy credential rotation without downtime
- **Access Control**: Admin endpoints require authentication

### Data Protection

- **Request Sanitization**: Input validation and sanitization
- **Response Filtering**: PII detection and removal
- **Audit Logging**: All AI requests logged with user context
- **Privacy Controls**: User data handling compliance

## Troubleshooting

### Common Issues

1. **"Service not available"**

   ```bash
   # Check service configuration
   curl "/api/v1/ai/services" | jq '.services[] | select(.service_name=="resume_analysis")'

   # Validate configuration
   curl -X POST "/api/v1/ai/admin/validate-config"
   ```

2. **"No models available"**

   ```bash
   # Check provider health
   curl "/api/v1/ai/providers"

   # Verify credentials
   echo $OPENAI_API_KEY | head -c 10
   ```

3. **"Rate limit exceeded"**

   ```bash
   # Check usage metrics
   curl "/api/v1/ai/usage-metrics?time_window_hours=1"
   ```

4. **"Configuration errors"**
   ```bash
   # Reload configuration
   curl -X POST "/api/v1/ai/admin/reload-config"
   ```

### Debug Mode

Enable detailed logging for troubleshooting:

```python
import logging
logging.getLogger('app.core.ai_config').setLevel(logging.DEBUG)
logging.getLogger('app.core.ai_client').setLevel(logging.DEBUG)
```

## Configuration Migration

### From Old System

```python
# Migration script example
from app.core.ai_config import AIConfigManager, ModelConfig, AIServiceConfig

config = AIConfigManager()

# Add legacy models
legacy_model = ModelConfig(
    name="old-model",
    provider=AIProvider.OPENAI,
    model_type=AIModelType.TEXT_GENERATION,
    model_id="gpt-3.5-turbo",
    # ... other parameters
)

config.models["old-model"] = legacy_model
config.save_configuration()
```

### Backup and Restore

```bash
# Backup current configuration
cp config/ai_config.json config/ai_config.backup.json

# Restore from backup
cp config/ai_config.backup.json config/ai_config.json

# Reload configuration
curl -X POST "/api/v1/ai/admin/reload-config"
```

## Best Practices

### Configuration Management

1. **Version Control**: Store configuration files in git
2. **Environment Separation**: Separate configs for dev/staging/prod
3. **Regular Validation**: Automated config validation in CI/CD
4. **Change Management**: Review process for configuration changes

### Cost Optimization

1. **Right-size Models**: Use smallest model that meets quality requirements
2. **Enable Caching**: Maximize cache hit rates for repeated queries
3. **Monitor Usage**: Regular review of usage patterns and costs
4. **Budget Alerts**: Set up proactive budget monitoring

### Reliability

1. **Multiple Providers**: Configure fallbacks across different providers
2. **Health Monitoring**: Regular health checks and alerting
3. **Graceful Degradation**: Handle failures gracefully with fallbacks
4. **Rate Limit Management**: Respect provider rate limits

## Future Enhancements

### Planned Features

- **Dynamic Pricing**: Real-time cost optimization based on provider pricing
- **A/B Testing**: Compare model performance across different configurations
- **Auto-scaling**: Automatic model selection based on load
- **Custom Models**: Support for fine-tuned and custom models
- **Multi-modal Support**: Image and audio processing capabilities

### Integration Roadmap

- **Workflow Engine**: Visual workflow builder for AI operations
- **Quality Assurance**: Automated quality scoring and improvement
- **Analytics Dashboard**: Real-time usage and performance dashboards
- **API Gateway**: Advanced routing and load balancing

## Conclusion

The AI Configuration System provides a robust, scalable foundation for managing AI operations in CareerCopilot. It enables cost-effective, reliable AI services with comprehensive monitoring and flexible configuration management, supporting the application's growth and evolving AI needs.
