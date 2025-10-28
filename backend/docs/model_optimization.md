# Model Optimization for CareerCopilot

This document describes how to use the model optimization feature to reduce costs and improve performance when using Google's Gemini models.

## Overview

The model optimization feature allows you to create optimized versions of AI models that are smaller, faster, and cheaper to run, with minimal impact on quality. This is particularly useful for high-volume or cost-sensitive applications.

## Supported Models

- Gemini 2.5 Flash (Recommended for most use cases)
- Gemini 2.5 Pro (For higher quality, more complex tasks)

## Optimization Levels

| Level | Speedup | Size Reduction | Quality Impact | Best For |
|-------|---------|----------------|----------------|-----------|
| Light | 1.2-1.5x | 20-30% | Minimal | High-quality generation with some cost savings |
| Medium | 1.5-2x | 40-60% | Small | Balanced quality and cost |
| Aggressive | 2-4x | 60-80% | Moderate | Cost-sensitive applications where some quality loss is acceptable |

## Getting Started

### Prerequisites

1. Google Cloud Project with Vertex AI API enabled
2. Application Default Credentials configured with appropriate permissions
3. Required Python packages installed:
   ```bash
   pip install google-cloud-aiplatform
   ```

### Configuration

1. Edit the optimized models configuration file at `config/optimized_models.json`
2. Configure the optimization settings for each model as needed
3. Set environment variables:
   ```bash
   export GOOGLE_CLOUD_PROJECT=your-project-id
   export GOOGLE_CLOUD_REGION=us-central1  # or your preferred region
   ```

### Creating Optimized Models

To create and deploy optimized models:

```bash
# From the backend directory
python -m scripts.optimize_models create
```

This will:
1. Load the optimization configuration
2. Create optimized versions of the specified models
3. Deploy them to Vertex AI
4. Update the application configuration

### Listing Optimized Models

To list all optimized models:

```bash
python -m scripts.optimize_models list
```

## Using Optimized Models in Your Code

### Basic Usage

```python
from app.core.ai_client import get_ai_client

# Get the AI client
ai_client = get_ai_client()

# Use an optimized model
response = await ai_client.generate_text(
    prompt="Your prompt here",
    model_name="gemini-2.5-flash-optimized"
)
```

### Comparing Models

```python
import asyncio
from app.core.ai_client import get_ai_client

async def compare_models(prompt: str):
    ai_client = get_ai_client()
    
    models = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-optimized",
        "gemini-2.5-pro",
        "gemini-2.5-pro-optimized"
    ]
    
    for model in models:
        start_time = time.time()
        response = await ai_client.generate_text(
            prompt=prompt,
            model_name=model
        )
        duration = time.time() - start_time
        
        print(f"\n--- {model} ---")
        print(f"Response time: {duration:.2f}s")
        print(f"Cost: ${response.cost_estimate:.6f}")
        print(f"Tokens: {response.tokens_used['input']} in, {response.tokens_used['output']} out")
        print("-" * 50)
        print(response.content[:500] + "..." if len(response.content) > 500 else response.content)

# Run the comparison
asyncio.run(compare_models("Explain how model optimization works"))
```

## Monitoring and Management

### Viewing Deployments

You can view and manage your optimized models in the Google Cloud Console:
1. Go to [Vertex AI > Models](https://console.cloud.google.com/vertex-ai/models)
2. Look for models with names starting with "optimized-"

### Monitoring Performance

Monitor the performance of your optimized models:
1. Go to [Vertex AI > Endpoints](https://console.cloud.google.com/vertex-ai/endpoints)
2. Select an optimized model endpoint
3. View metrics like latency, throughput, and error rates

## Best Practices

1. **Start with Light Optimization**: Begin with light optimization and only increase if needed
2. **Monitor Quality**: Always evaluate the quality impact on your specific use case
3. **A/B Test**: Compare optimized and non-optimized models with real user traffic
4. **Consider Workload**: Use more aggressive optimization for high-volume, low-latency applications
5. **Regular Updates**: Re-optimize models periodically as new optimization techniques become available

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure your service account has the `aiplatform.models.create` permission
2. **Quota Limits**: Check your Vertex AI quotas in the Google Cloud Console
3. **Model Deployment Failures**: Check the logs in Cloud Logging for detailed error messages

### Getting Help

For additional assistance, please refer to:
- [Vertex AI Model Optimization Documentation](https://cloud.google.com/vertex-ai/docs/model-optimization/overview)
- [Google Cloud Support](https://cloud.google.com/support)
