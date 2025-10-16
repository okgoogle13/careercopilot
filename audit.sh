#!/bin/bash
# Project Config Audit Script for careercopilot-468811
# ----------------------------------------------------
# This script prints out the key configuration details for your GCP + Firebase project
# Requires: gcloud CLI, firebase CLI installed & authenticated

PROJECT_ID="careercopilot-468811"
SERVICE_ACCOUNT="careercopilot-functions@${PROJECT_ID}.iam.gserviceaccount.com"

echo "===================================="
echo " GCP + Firebase Project Audit Report"
echo " Project: $PROJECT_ID"
echo "===================================="
echo

# 1. Active GCP Project
echo "[1] Active gcloud project:"
gcloud config list --format 'value(core.project)'
echo

# 2. Project metadata
echo "[2] Project meta"
gcloud projects describe "$PROJECT_ID" --format json | jq '{projectId: .projectId, name: .name, createTime: .createTime, lifecycleState: .lifecycleState}'
echo

# 3. Firestore database location
echo "[3] Firestore database info:"
gcloud firestore databases describe --project "$PROJECT_ID" --format='yaml(name,locationId,type,state)'
echo

# 4. All service accounts
echo "[4] Service accounts in project:"
gcloud iam service-accounts list --project "$PROJECT_ID"
echo

# 5. Roles for the specific deployment service account
echo "[5] IAM roles for $SERVICE_ACCOUNT:"
gcloud projects get-iam-policy "$PROJECT_ID" \
  --flatten="bindings[].members" \
  --format='table(bindings.role)' \
  --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT"
echo

# 6. Enabled APIs
echo "[6] Enabled APIs in the project:"
gcloud services list --enabled --project "$PROJECT_ID"
echo

# 7. Firebase Hosting sites
echo "[7] Firebase Hosting sites:"
firebase hosting:sites:list --project "$PROJECT_ID"
echo

# 8. Default Firebase storage bucket(s):
echo "[8] Default Firebase Storage bucket(s):"
gcloud storage buckets list --project "$PROJECT_ID" \
  --filter="name~firebase" \
  --format='value(name)'
echo

# 9. Firebase Auth users
echo "[9] Firebase Auth users & UIDs:"
TMP_FILE=$(mktemp)
firebase auth:export "$TMP_FILE" --project "$PROJECT_ID" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  cat "$TMP_FILE"
else
  echo "⚠️  Could not export auth users — check Firebase CLI version and permissions."
fi
rm -f "$TMP_FILE"
echo

echo "✅ Audit Complete"
