# CareerCopilot AI Cost Optimization - Monitoring Dashboard Blueprint

This document provides detailed specifications for creating a comprehensive Google Cloud Monitoring Dashboard to track the performance, costs, and health of the AI cost optimization system.

## 🎯 Dashboard Overview

**Dashboard Name:** CareerCopilot AI Cost Optimization
**Purpose:** Monitor AI service performance, cost efficiency, and system health
**Target Audience:** DevOps engineers, technical leads, product managers
**Update Frequency:** Real-time with 1-minute granularity

---

## 📊 Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Cost Efficiency Metrics                   │
├──────────────────────┬──────────────────────┬──────────────────┤
│   Widget 1: API      │   Widget 2: Cost    │   Widget 3: Model│
│   Call Distribution  │   Trend Analysis     │   Selection Dist │
└──────────────────────┴──────────────────────┴──────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                    Cache Performance Metrics                    │
├──────────────────────┬──────────────────────┬──────────────────┤
│   Widget 4: Cache    │   Widget 5: Redis   │   Widget 6: Cache│
│   Hit/Miss Ratio     │   CPU & Memory       │   Response Time  │
└──────────────────────┴──────────────────────┴──────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                   Application Health Metrics                    │
├──────────────────────┬──────────────────────┬──────────────────┤
│   Widget 7: Request  │   Widget 8: Error   │   Widget 9: Latency│
│   Count & Codes      │   Rate Trends        │   Distribution   │
└──────────────────────┴──────────────────────┴──────────────────┘
```

---

## 🔧 Widget Specifications

### Widget 1: AI Cost Efficiency - API Call Distribution

**Type:** Line Chart
**Purpose:** Visualize the shift from expensive to cheap models over time
**Goal:** Confirm cost optimization is working as expected

#### Configuration
```yaml
Widget Type: Line Chart
Display Name: "AI Model Usage Distribution"
Width: 4 units
Height: 3 units
Time Range: Last 7 days
Refresh Rate: 1 minute
```

#### Metrics Configuration
```yaml
Metric: cloudmonitoring.googleapis.com/vertex_ai/api_request_count
Resource Type: vertex_ai_endpoint
Filters:
  - resource.label.project_id = "careercopilot-468811"
  - metric.label.model_name != ""

Group By:
  - metric.label.model_name

Aggregation:
  - Alignment Period: 1 hour
  - Per Series Aligner: ALIGN_RATE
  - Cross Series Reducer: REDUCE_SUM
  - Group By Fields: [model_name]

Display Options:
  - Y-Axis Label: "API Calls per Hour"
  - X-Axis Label: "Time"
  - Legend Position: Right
  - Line Colors:
    - gemini-1.5-flash-8b: Green (cheapest)
    - gemini-1.5-flash: Blue (low cost)
    - gemini-1.5-pro: Orange (medium cost)
    - gemini-1.5-pro-002: Red (expensive)
```

#### Success Indicators
- ✅ Green and blue lines trending upward (cheap models)
- ✅ Orange and red lines trending downward (expensive models)
- ✅ Overall shift toward cost-effective model usage

---

### Widget 2: AI Cost Efficiency - Cost Trend Analysis

**Type:** Area Chart
**Purpose:** Track cumulative AI costs and savings over time
**Goal:** Visualize cost reduction impact

#### Configuration
```yaml
Widget Type: Area Chart
Display Name: "AI Service Costs Over Time"
Width: 4 units
Height: 3 units
Time Range: Last 30 days
Refresh Rate: 5 minutes
```

#### Metrics Configuration
```yaml
Metric: billing.googleapis.com/billing/billed_cost
Resource Type: billing_account
Filters:
  - resource.label.project_id = "careercopilot-468811"
  - metric.label.service = "Vertex AI API"

Group By:
  - metric.label.service
  - metric.label.sku

Aggregation:
  - Alignment Period: 1 day
  - Per Series Aligner: ALIGN_DELTA
  - Cross Series Reducer: REDUCE_SUM

Display Options:
  - Y-Axis Label: "Cost (USD)"
  - X-Axis Label: "Date"
  - Stack Type: Stacked
  - Area Colors: Gradient blue to green
```

#### Success Indicators
- ✅ Downward trending cost curve after optimization deployment
- ✅ Daily cost reduction ≥50% compared to pre-optimization baseline
- ✅ Sustained cost efficiency over time

---

### Widget 3: AI Cost Efficiency - Model Selection Distribution

**Type:** Pie Chart
**Purpose:** Show current distribution of model usage
**Goal:** Validate smart model selection is working

#### Configuration
```yaml
Widget Type: Pie Chart
Display Name: "Current Model Usage Distribution"
Width: 4 units
Height: 3 units
Time Range: Last 24 hours
Refresh Rate: 5 minutes
```

#### Metrics Configuration
```yaml
Metric: cloudmonitoring.googleapis.com/vertex_ai/api_request_count
Resource Type: vertex_ai_endpoint
Filters:
  - resource.label.project_id = "careercopilot-468811"

Group By:
  - metric.label.model_name

Aggregation:
  - Alignment Period: 24 hours
  - Per Series Aligner: ALIGN_SUM
  - Cross Series Reducer: REDUCE_SUM

Display Options:
  - Show Percentages: True
  - Show Values: True
  - Slice Colors:
    - gemini-1.5-flash-8b: "#4CAF50" (green)
    - gemini-1.5-flash: "#2196F3" (blue)
    - gemini-1.5-pro: "#FF9800" (orange)
    - gemini-1.5-pro-002: "#F44336" (red)
```

#### Success Indicators
- ✅ Green + Blue slices ≥70% (cheap models dominating)
- ✅ Red slice ≤10% (expensive model usage minimized)
- ✅ Distribution aligns with task complexity expectations

---

### Widget 4: Cache Performance - Hit/Miss Ratio

**Type:** Stacked Bar Chart
**Purpose:** Monitor Redis cache effectiveness
**Goal:** Track cache performance and cost savings

#### Configuration
```yaml
Widget Type: Stacked Bar Chart
Display Name: "Redis Cache Hit/Miss Ratio"
Width: 4 units
Height: 3 units
Time Range: Last 24 hours
Refresh Rate: 1 minute
```

#### Metrics Configuration (Custom Metrics)
```yaml
# Note: These are custom metrics logged by the application
Metrics:
  - ai_cache_hits_total
  - ai_cache_misses_total

Resource Type: cloud_run_revision
Filters:
  - resource.label.service_name = "careercopilot-backend"
  - resource.label.project_id = "careercopilot-468811"

Aggregation:
  - Alignment Period: 1 hour
  - Per Series Aligner: ALIGN_RATE
  - Cross Series Reducer: REDUCE_SUM

Display Options:
  - Y-Axis Label: "Cache Operations per Hour"
  - Stack Type: Stacked
  - Bar Colors:
    - Cache Hits: "#4CAF50" (green)
    - Cache Misses: "#FF9800" (orange)
```

#### Success Indicators
- ✅ Cache hit ratio ≥60% after initial warm-up period
- ✅ Increasing hit ratio over time as cache builds
- ✅ Green (hits) should be larger than orange (misses)

---

### Widget 5: Cache Performance - Redis CPU & Memory Utilization

**Type:** Multi-Line Chart
**Purpose:** Monitor Redis instance health and performance
**Goal:** Ensure cache infrastructure is performing optimally

#### Configuration
```yaml
Widget Type: Line Chart
Display Name: "Redis Instance Performance"
Width: 4 units
Height: 3 units
Time Range: Last 12 hours
Refresh Rate: 1 minute
```

#### Metrics Configuration
```yaml
Metrics:
  1. CPU Utilization:
     Metric: redis.googleapis.com/stats/cpu_utilization
     Resource Type: redis_instance
     Filters:
       - resource.label.instance_id = "careercopilot-cache-production"
       - resource.label.project_id = "careercopilot-468811"

  2. Memory Utilization:
     Metric: redis.googleapis.com/stats/memory_utilization
     Resource Type: redis_instance
     Filters: [same as above]

Aggregation:
  - Alignment Period: 5 minutes
  - Per Series Aligner: ALIGN_MEAN

Display Options:
  - Y-Axis Label: "Utilization (%)"
  - Y-Axis Range: 0-100%
  - Line Colors:
    - CPU: "#2196F3" (blue)
    - Memory: "#FF9800" (orange)
  - Thresholds:
    - Warning: 70% (yellow line)
    - Critical: 85% (red line)
```

#### Success Indicators
- ✅ CPU utilization <70% during normal operations
- ✅ Memory utilization <85% (allows for cache growth)
- ✅ No sustained high utilization periods

---

### Widget 6: Cache Performance - Cache Response Time Impact

**Type:** Histogram
**Purpose:** Show response time improvements from caching
**Goal:** Demonstrate performance benefits of cache hits

#### Configuration
```yaml
Widget Type: Histogram
Display Name: "AI Service Response Times (Cache Hit vs Miss)"
Width: 4 units
Height: 3 units
Time Range: Last 6 hours
Refresh Rate: 2 minutes
```

#### Metrics Configuration (Custom Metrics)
```yaml
Metrics:
  1. Cache Hit Response Times:
     Metric: ai_service_response_time_cache_hit
     Resource Type: cloud_run_revision

  2. Cache Miss Response Times:
     Metric: ai_service_response_time_cache_miss
     Resource Type: cloud_run_revision

Filters:
  - resource.label.service_name = "careercopilot-backend"

Aggregation:
  - Alignment Period: 10 minutes
  - Per Series Aligner: ALIGN_DELTA
  - Cross Series Reducer: REDUCE_PERCENTILE_95

Display Options:
  - Y-Axis Label: "Response Time (ms)"
  - Bucket Size: 100ms
  - Colors:
    - Cache Hit: "#4CAF50" (green)
    - Cache Miss: "#2196F3" (blue)
```

#### Success Indicators
- ✅ Cache hit response times ≤200ms (fast)
- ✅ Clear performance difference between hit/miss
- ✅ Cache hits ≥80% faster than cache misses

---

### Widget 7: Application Health - Request Count & Response Codes

**Type:** Stacked Area Chart
**Purpose:** Monitor overall application health and traffic patterns
**Goal:** Ensure application stability hasn't been compromised

#### Configuration
```yaml
Widget Type: Stacked Area Chart
Display Name: "Application Request Volume & Status Codes"
Width: 4 units
Height: 3 units
Time Range: Last 6 hours
Refresh Rate: 1 minute
```

#### Metrics Configuration
```yaml
Metric: run.googleapis.com/request_count
Resource Type: cloud_run_revision
Filters:
  - resource.label.service_name = "careercopilot-backend"
  - resource.label.project_id = "careercopilot-468811"

Group By:
  - metric.label.response_code_class

Aggregation:
  - Alignment Period: 5 minutes
  - Per Series Aligner: ALIGN_RATE
  - Cross Series Reducer: REDUCE_SUM

Display Options:
  - Y-Axis Label: "Requests per Minute"
  - Stack Type: Stacked
  - Area Colors:
    - 2xx: "#4CAF50" (green)
    - 3xx: "#2196F3" (blue)
    - 4xx: "#FF9800" (orange)
    - 5xx: "#F44336" (red)
```

#### Success Indicators
- ✅ 2xx responses ≥95% of total traffic
- ✅ 5xx responses ≤1% of total traffic
- ✅ No significant change in error patterns after deployment

---

### Widget 8: Application Health - Error Rate Trends

**Type:** Line Chart with Alert Zones
**Purpose:** Track error rates and detect anomalies
**Goal:** Early detection of issues caused by optimization changes

#### Configuration
```yaml
Widget Type: Line Chart
Display Name: "Error Rate Monitoring"
Width: 4 units
Height: 3 units
Time Range: Last 24 hours
Refresh Rate: 1 minute
```

#### Metrics Configuration
```yaml
Metrics:
  1. Overall Error Rate:
     Metric: run.googleapis.com/request_count
     Resource Type: cloud_run_revision
     Filters:
       - resource.label.service_name = "careercopilot-backend"
       - metric.label.response_code >= "400"

  2. Critical Error Rate (5xx):
     Metric: run.googleapis.com/request_count
     Resource Type: cloud_run_revision
     Filters:
       - resource.label.service_name = "careercopilot-backend"
       - metric.label.response_code >= "500"

Aggregation:
  - Alignment Period: 5 minutes
  - Per Series Aligner: ALIGN_RATE
  - Cross Series Reducer: REDUCE_SUM

Display Options:
  - Y-Axis Label: "Error Rate (%)"
  - Line Colors:
    - Overall Errors: "#FF9800" (orange)
    - Critical Errors: "#F44336" (red)
  - Alert Zones:
    - Warning: >5% error rate (yellow background)
    - Critical: >10% error rate (red background)
```

#### Success Indicators
- ✅ Error rate ≤5% consistently
- ✅ Critical error rate ≤1%
- ✅ No error spikes after optimization deployment

---

### Widget 9: Application Health - Latency Distribution

**Type:** Heatmap
**Purpose:** Monitor request latency patterns and percentiles
**Goal:** Ensure optimization doesn't negatively impact user experience

#### Configuration
```yaml
Widget Type: Heatmap
Display Name: "Request Latency Distribution"
Width: 4 units
Height: 3 units
Time Range: Last 12 hours
Refresh Rate: 2 minutes
```

#### Metrics Configuration
```yaml
Metric: run.googleapis.com/request_latencies
Resource Type: cloud_run_revision
Filters:
  - resource.label.service_name = "careercopilot-backend"

Aggregation:
  - Alignment Period: 10 minutes
  - Per Series Aligner: ALIGN_DELTA
  - Cross Series Reducer: REDUCE_PERCENTILE_99

Display Options:
  - Y-Axis Label: "Latency (ms)"
  - Color Scheme: Green (fast) to Red (slow)
  - Percentile Lines:
    - P50: Solid line
    - P95: Dashed line
    - P99: Dotted line
```

#### Success Indicators
- ✅ P95 latency ≤2000ms for cache misses
- ✅ P95 latency ≤500ms for cache hits
- ✅ Consistent latency patterns without degradation

---

## 🚨 Alerting Configuration

### Critical Alerts

#### Alert 1: High Error Rate
```yaml
Alert Name: "CareerCopilot - High Error Rate"
Condition: Error rate >10% for 5 minutes
Severity: Critical
Notification: Slack + Email + SMS
```

#### Alert 2: Redis Cache Down
```yaml
Alert Name: "CareerCopilot - Redis Cache Unavailable"
Condition: Redis CPU = 0 for 2 minutes
Severity: Warning
Notification: Slack + Email
```

#### Alert 3: Cost Anomaly
```yaml
Alert Name: "CareerCopilot - Unexpected Cost Increase"
Condition: Daily AI costs >150% of 7-day average
Severity: Warning
Notification: Email
```

### Performance Alerts

#### Alert 4: Cache Hit Rate Low
```yaml
Alert Name: "CareerCopilot - Low Cache Performance"
Condition: Cache hit rate <30% for 30 minutes
Severity: Warning
Notification: Slack
```

#### Alert 5: High Latency
```yaml
Alert Name: "CareerCopilot - High Response Latency"
Condition: P95 latency >5000ms for 10 minutes
Severity: Warning
Notification: Slack + Email
```

---

## 📋 Dashboard Setup Instructions

### Step 1: Create Dashboard
```bash
# Navigate to Google Cloud Console
# → Monitoring → Dashboards → Create Dashboard
# Name: "CareerCopilot AI Cost Optimization"
```

### Step 2: Configure Widgets
```bash
# For each widget above:
# 1. Click "+ Add Widget"
# 2. Select widget type (Line Chart, Pie Chart, etc.)
# 3. Configure metrics as specified
# 4. Set display options
# 5. Position in dashboard layout
```

### Step 3: Set Up Custom Metrics (if needed)
```python
# Add to your application code:
from google.cloud import monitoring_v3

def record_cache_metrics(cache_hit: bool, response_time: float):
    client = monitoring_v3.MetricServiceClient()

    if cache_hit:
        # Record cache hit
        series = monitoring_v3.TimeSeries()
        series.metric.type = "custom.googleapis.com/ai_cache_hits_total"
        # ... configure and send
    else:
        # Record cache miss
        series = monitoring_v3.TimeSeries()
        series.metric.type = "custom.googleapis.com/ai_cache_misses_total"
        # ... configure and send
```

### Step 4: Configure Alerts
```bash
# Navigate to Monitoring → Alerting → Create Policy
# Configure each alert as specified above
# Set notification channels (Slack, email, SMS)
```

### Step 5: Share Dashboard
```bash
# Dashboard → Share → Add Members
# Grant view access to relevant team members
# Create public link for status page (optional)
```

---

## 📊 Dashboard Usage Guide

### Daily Monitoring Routine

#### Morning Check (5 minutes)
1. **Cost Efficiency Section**
   - Verify model distribution is optimal
   - Check for any cost anomalies overnight
   - Confirm savings targets are being met

2. **Cache Performance Section**
   - Review cache hit rates
   - Check Redis instance health
   - Validate response time improvements

3. **Application Health Section**
   - Verify error rates are normal
   - Check for any latency issues
   - Confirm overall system stability

#### Weekly Analysis (15 minutes)
1. **Cost Trend Analysis**
   - Calculate weekly savings achieved
   - Compare with baseline metrics
   - Identify optimization opportunities

2. **Performance Review**
   - Analyze cache efficiency trends
   - Review response time patterns
   - Assess user experience metrics

3. **Capacity Planning**
   - Review Redis memory usage trends
   - Plan for cache scaling if needed
   - Assess model usage patterns

### Alert Response Procedures

#### Critical Alerts
- **High Error Rate**: Immediate investigation, consider rollback
- **Redis Down**: Check infrastructure, enable cache bypass
- **Cost Anomaly**: Investigate usage patterns, validate model selection

#### Warning Alerts
- **Low Cache Performance**: Analyze cache patterns, optimize TTL
- **High Latency**: Check Redis performance, review model selection

---

## 🎯 Success Metrics Summary

### Dashboard KPIs

**Cost Optimization KPIs:**
- Overall AI cost reduction: Target ≥60%
- Cheap model usage percentage: Target ≥70%
- Daily cost trend: Target = downward

**Performance KPIs:**
- Cache hit rate: Target ≥60%
- Cache hit response time: Target ≤200ms
- Overall error rate: Target ≤5%

**Infrastructure KPIs:**
- Redis CPU utilization: Target <70%
- Redis memory utilization: Target <85%
- Service availability: Target ≥99.9%

---

🎉 **Monitoring Dashboard Ready!** This comprehensive dashboard provides complete visibility into your AI cost optimization system performance, cost savings, and overall health.