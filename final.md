Role: DevOps & QA Asset Generation AI.
Objective: Generate the necessary configurations, test plans, and documentation to fully integrate, deploy, and monitor the cost-optimization code created in the clean-start branch.
Phase 4: Integration & Infrastructure Plan
1. Generate Pull Request Template:
Create a Markdown template for a Pull Request to merge clean-start into main. The description must include a summary of changes and a checklist for the reviewer.
2. Generate Infrastructure as Code (IaC):
Produce a Terraform (.tf) file to provision a Google Cloud Memorystore for Redis instance. The configuration should be production-ready but minimal.
Resource: google_redis_instance
Tier: BASIC
Memory: 1 GB
Region: us-central1
Outputs: The host and port of the Redis instance.
3. Generate Secret Management Commands:
Produce a shell script using gcloud CLI to create secrets in Google Secret Manager for the Redis host and port, ready for the application to consume.
4. Generate Code Integration Guide:
Create a Markdown file (REFACTORING_GUIDE.md) that provides clear instructions for a developer on how to integrate the new services. It must include:
A "Find & Replace" section showing how to locate old direct LLM calls.
A code snippet demonstrating the "new" way to call the dispatch_llm_call function.
Instructions on how to correctly initialize the redis_client using environment variables.
Phase 5: Testing & Validation Plan
1. Generate Test Plan Document:
Create a comprehensive TEST_PLAN.md document with the following sections:
Functional Testing: A checklist of 5-7 key user stories to validate (e.g., "User successfully parses a resume and sees correct keyword extraction," "User receives relevant job matches").
Cache Validation: A step-by-step procedure to confirm the Redis cache is working.
Start the backend with logs visible.
Make an API request for a complex task.
Observe the "Cache MISS" log.
Immediately repeat the exact same request.
Assert that a "Cache HIT" log is observed and the response is faster.
Cost Validation: Instructions on where in the Google Cloud Console to monitor API usage (Vertex AI -> Dashboard) to confirm a reduction in calls to expensive models.
Phase 6: Deployment & Monitoring Plan
1. Generate Deployment Checklist:
Create a DEPLOYMENT_CHECKLIST.md for a production release. It must include:

clean-start branch has been merged into main.

Production Memorystore for Redis instance is provisioned and healthy.

Production secrets (e.g., REDIS_HOST, REDIS_PORT) are populated in Secret Manager.

All tests in TEST_PLAN.md have passed in the staging environment.

Final cost analysis of staging environment shows expected savings.
2. Generate Monitoring Dashboard Blueprint:
Create a Markdown section describing the widgets to add to a Google Cloud Monitoring Dashboard for this service.
Widget 1: AI Cost Efficiency
Type: Chart
Metric: Vertex AI API Call Count, grouped by model_name.
Goal: Visualize the shift from expensive to cheap models.
Widget 2: Cache Performance
Type: Chart
Metric: Memorystore - CPU Utilization.
Goal: Monitor the health and load of the Redis cache.
Widget 3: Application Health
Type: Chart
Metric: Cloud Run - Request Count, grouped by response_code (especially 5xx errors).
Goal: Ensure application stability has not been compromised.
