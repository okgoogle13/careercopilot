Phase 1: Finalize Git Merge
Action: Generate the git commands to merge the feature branch into main, push the result, and remove the local and remote feature branch.
code
Bash
#!/bin/bash
# Merges the clean-start branch and cleans up.

git checkout main
git pull origin main
git merge --ff-only clean-start
git push origin main
git branch -d clean-start
git push origin --delete clean-start

echo ">>> 'clean-start' branch successfully merged and cleaned up."
Phase 2: Execute Infrastructure & Secrets Provisioning
Action: Generate a single shell script execute_infra_setup.sh that applies the Terraform configuration and runs the secret setup script in the correct sequence.
code
Bash
#!/bin/bash
# Provisions Redis via Terraform and configures secrets.

echo ">>> Provisioning Infrastructure..."
cd ./infrastructure/terraform/
terraform init
terraform apply -auto-approve

echo ">>> Configuring Secrets..."
cd ../../scripts/
./setup-redis-secrets.sh

echo ">>> Infrastructure and secrets are live."
Phase 3: Automate Codebase Refactoring
Action: Generate a shell script run_code_refactor.sh that uses sed to find all instances of the old, direct LLM calls and replace them with the new dispatch_llm_call function, based on the REFACTORING_GUIDE.md.
code
Bash
#!/bin/bash
# Finds and replaces direct LLM calls with the new dispatcher service.

# This is a simplified pattern. A real implementation might need more complex regex.
OLD_CALL_PATTERN="vendor.gemini.call("
NEW_CALL_PATTERN="dispatch_llm_call(task_type=\"<REPLACE_WITH_TASK_TYPE>\", "

echo ">>> Starting code refactoring..."

# Use git grep to find files and sed to replace in-place
git grep -l "$OLD_CALL_PATTERN" | while read -r file
do
  echo "Refactoring file: $file"
  # Create a backup before modifying
  sed -i.bak "s/$OLD_CALL_PATTERN/$NEW_CALL_PATTERN/g" "$file"
done

echo ">>> Refactoring complete. Manual review required to set 'task_type' and remove .bak files."
Phase 4: Generate Validation Test Script
Action: Generate a shell script run_validation_tests.sh that automates the cache validation steps from TEST_PLAN.md. It should make an API call, check logs for a "Cache MISS", make the same call again, and assert a "Cache HIT".
code
Bash
#!/bin/bash
# Simulates the cache validation test.

API_ENDPOINT="http://localhost:8080/api/v1/generate-cover-letter"
LOG_FILE="/var/log/app.log"
PAYLOAD='{"job_id": "123", "user_id": "456"}'

echo ">>> Running Cache Validation Test..."

# Clear logs or start monitoring
echo "--- Test Run Start ---" >> $LOG_FILE

# 1. First call (should be a MISS)
echo "Making first request..."
curl -X POST -H "Content-Type: application/json" -d "$PAYLOAD" $API_ENDPOINT
sleep 2 # Allow time for log flush

# 2. Verify the MISS
if ! grep -q "Cache MISS" "$LOG_FILE"; then
  echo "FAIL: 'Cache MISS' not found in logs on first call."
  exit 1
fi

# 3. Second call (should be a HIT)
echo "Making second request..."
curl -X POST -H "Content-Type: application/json" -d "$PAYLOAD" $API_ENDPOINT
sleep 2

# 4. Verify the HIT
if ! grep -q "Cache HIT" "$LOG_FILE"; then
  echo "FAIL: 'Cache HIT' not found in logs on second call."
  exit 1
fi

echo "SUCCESS: Cache validation test passed."
Phase 5: Generate Deployment & Monitoring Assets
1. Action: Generate the final production deployment command.
code
Bash
# Deploys the application to Google Cloud Run
gcloud run deploy careercopilot-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="REDIS_HOST=REDIS_HOST:latest,REDIS_PORT=REDIS_PORT:latest"
2. Action: Generate the dashboard.json file for a Google Cloud Monitoring dashboard based on the MONITORING_DASHBOARD.md blueprint.
code
JSON
{
  "displayName": "CareerCopilot - AI Cost & Performance",
  "gridLayout": {
    "columns": "2",
    "widgets": [
      {
        "title": "AI API Calls by Model (Cost Proxy)",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "metric.type=\\"serviceruntime.googleapis.com/api/request_count\\" resource.type=\\"consumed_api\\" resource.label.service=\\"vertexai.googleapis.com\\"",
                "aggregation": { "alignmentPeriod": "3600s", "perSeriesAligner": "ALIGN_RATE" }
              }
            },
            "plotType": "STACKED_BAR"
          }],
          "chartOptions": { "mode": "COLOR" }
        }
      },
      {
        "title": "Redis Cache - CPU Utilization",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": { "timeSeriesFilter": { "filter": "metric.type=\\"redis.googleapis.com/instance/cpu/utilization\\" resource.type=\\"redis_instance\\"" }}
          }]
        }
      },
      {
        "title": "Application Health - Server Errors (5xx)",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": { "timeSeriesFilter": { "filter": "metric.type=\\"run.googleapis.com/request_count\\" resource.type=\\"cloud_run_revision\\" metric.label.response_code_class=\\"5xx\\"" }}
          }]
        }
      }
    ]
  }
}
Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.
Start typing a prompt
