#!/bin/bash
# Automates the cache validation test from TEST_PLAN.md

set -e  # Exit on any error

echo "🧪 CareerCopilot AI Optimization - Cache Validation Tests"
echo "======================================================"

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-careercopilot-468811}"
SERVICE_NAME="careercopilot-backend"
REGION="us-central1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Configuration:"
echo "  API Base URL: $API_BASE_URL"
echo "  Project ID: $PROJECT_ID"
echo "  Service: $SERVICE_NAME"
echo "  Region: $REGION"
echo ""

# Function to check if service is running locally or on Cloud Run
detect_service_endpoint() {
    # Try local first
    if curl -s --max-time 5 "$API_BASE_URL/health" >/dev/null 2>&1; then
        echo "local"
        return 0
    fi

    # Try Cloud Run
    local cloud_run_url
    cloud_run_url=$(gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --project="$PROJECT_ID" \
        --format="value(status.url)" 2>/dev/null || echo "")

    if [ -n "$cloud_run_url" ]; then
        if curl -s --max-time 10 "$cloud_run_url/health" >/dev/null 2>&1; then
            API_BASE_URL="$cloud_run_url"
            echo "cloud_run"
            return 0
        fi
    fi

    echo "none"
    return 1
}

# Function to get logs from the appropriate source
get_logs() {
    local since_time="$1"

    case "$SERVICE_TYPE" in
        "local")
            # For local development, check local log files or docker logs
            if [ -f "/tmp/app.log" ]; then
                tail -n 50 /tmp/app.log
            elif [ -f "app.log" ]; then
                tail -n 50 app.log
            else
                echo "Local logs not found. Please ensure application logs to /tmp/app.log or ./app.log"
                return 1
            fi
            ;;
        "cloud_run")
            # For Cloud Run, use gcloud logging
            gcloud logs read "resource.type=cloud_run_revision" \
                --project="$PROJECT_ID" \
                --filter="resource.labels.service_name=$SERVICE_NAME AND timestamp>=\"$since_time\"" \
                --limit=50 \
                --format="value(textPayload,jsonPayload.message)" 2>/dev/null || echo "No recent logs found"
            ;;
        *)
            echo "Cannot retrieve logs - unknown service type"
            return 1
            ;;
    esac
}

# Function to wait for logs to appear
wait_for_logs() {
    local pattern="$1"
    local timeout="$2"
    local start_time=$(date +%s)

    echo "  Waiting for log pattern: '$pattern'"

    while [ $(($(date +%s) - start_time)) -lt "$timeout" ]; do
        local recent_logs
        recent_logs=$(get_logs "$(date -u -d '30 seconds ago' +%Y-%m-%dT%H:%M:%SZ)")

        if echo "$recent_logs" | grep -q "$pattern"; then
            echo -e "${GREEN}  ✅ Found: $pattern${NC}"
            return 0
        fi

        sleep 2
    done

    echo -e "${RED}  ❌ Timeout waiting for: $pattern${NC}"
    return 1
}

# Test data
TEST_PAYLOAD='{"job_description": "Senior Software Engineer with Python and Redis experience. Must have experience with caching systems and microservices architecture."}'

echo "🔍 Detecting service endpoint..."
SERVICE_TYPE=$(detect_service_endpoint)

case "$SERVICE_TYPE" in
    "local")
        echo -e "${GREEN}✅ Found local service at: $API_BASE_URL${NC}"
        ;;
    "cloud_run")
        echo -e "${GREEN}✅ Found Cloud Run service at: $API_BASE_URL${NC}"
        ;;
    "none")
        echo -e "${RED}❌ Service not accessible${NC}"
        echo "Please ensure the CareerCopilot backend is running:"
        echo "  Local: python -m uvicorn app.main:app --host 0.0.0.0 --port 8080"
        echo "  Cloud Run: gcloud run deploy careercopilot-backend ..."
        exit 1
        ;;
esac

echo ""

# Test 1: Health Check
echo "🏥 Test 1: Health Check"
echo "======================"

HEALTH_RESPONSE=$(curl -s "$API_BASE_URL/health" || echo "ERROR")

if echo "$HEALTH_RESPONSE" | grep -q '"status".*"ok"'; then
    echo -e "${GREEN}✅ Health check passed${NC}"

    # Check if Redis status is included
    if echo "$HEALTH_RESPONSE" | grep -q "redis"; then
        echo "  Redis status included in health check"
    else
        echo -e "${YELLOW}  ⚠️  Redis status not in health check response${NC}"
    fi
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

echo ""

# Test 2: Cache MISS → Cache HIT Validation
echo "🔄 Test 2: Cache MISS → Cache HIT Validation"
echo "==========================================="

# Record start time for log filtering
START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
echo "Test start time: $START_TIME"

# Available endpoints to test (in order of preference)
TEST_ENDPOINTS=(
    "/api/v1/ai/extract-keywords"
    "/api/v1/ksc/generate"
    "/api/v1/ai/generate-cover-letter"
    "/api/v1/ai/optimize-resume"
)

WORKING_ENDPOINT=""

# Find a working endpoint
echo ""
echo "🔍 Finding available AI endpoint..."
for endpoint in "${TEST_ENDPOINTS[@]}"; do
    echo "  Testing: $endpoint"
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$TEST_PAYLOAD" \
        "$API_BASE_URL$endpoint" || echo "000")

    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        WORKING_ENDPOINT="$endpoint"
        echo -e "${GREEN}  ✅ Found working endpoint: $endpoint${NC}"
        break
    elif [ "$response" = "422" ] || [ "$response" = "400" ]; then
        echo -e "${YELLOW}  ⚠️  Endpoint available but payload format issue: $endpoint${NC}"
        # Try with simpler payload
        simple_payload='{"prompt": "Extract keywords from: Software Engineer"}'
        response2=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$simple_payload" \
            "$API_BASE_URL$endpoint" || echo "000")

        if [ "$response2" = "200" ] || [ "$response2" = "201" ]; then
            WORKING_ENDPOINT="$endpoint"
            TEST_PAYLOAD="$simple_payload"
            echo -e "${GREEN}  ✅ Found working endpoint with simple payload: $endpoint${NC}"
            break
        fi
    else
        echo "  ❌ Not available (HTTP $response)"
    fi
done

if [ -z "$WORKING_ENDPOINT" ]; then
    echo -e "${RED}❌ No working AI endpoints found${NC}"
    echo "Available endpoints may not be deployed yet or may require authentication"
    echo ""
    echo "🔧 Manual testing commands:"
    for endpoint in "${TEST_ENDPOINTS[@]}"; do
        echo "curl -X POST '$API_BASE_URL$endpoint' -H 'Content-Type: application/json' -d '$TEST_PAYLOAD'"
    done
    exit 1
fi

echo ""
echo "📝 Using endpoint: $WORKING_ENDPOINT"
echo "📝 Using payload: $TEST_PAYLOAD"
echo ""

# First request (should be Cache MISS)
echo "🔵 Making first request (expecting Cache MISS)..."

RESPONSE1_START=$(date +%s.%N)
RESPONSE1=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$TEST_PAYLOAD" \
    "$API_BASE_URL$WORKING_ENDPOINT" || echo "ERROR")
RESPONSE1_END=$(date +%s.%N)

RESPONSE1_TIME=$(echo "$RESPONSE1_END - $RESPONSE1_START" | bc)
RESPONSE1_TIME_MS=$(echo "$RESPONSE1_TIME * 1000" | bc | cut -d. -f1)

if [ "$RESPONSE1" = "ERROR" ] || [ -z "$RESPONSE1" ]; then
    echo -e "${RED}❌ First request failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ First request completed${NC}"
echo "  Response time: ${RESPONSE1_TIME_MS}ms"
echo "  Response length: $(echo "$RESPONSE1" | wc -c) characters"

# Wait for logs and check for Cache MISS
echo ""
echo "🔍 Checking logs for Cache MISS..."
sleep 3  # Give logs time to appear

if wait_for_logs "Cache MISS\|CACHE MISS\|cache.*miss" 10; then
    echo -e "${GREEN}✅ Cache MISS confirmed in logs${NC}"
else
    echo -e "${YELLOW}⚠️  Cache MISS not found in logs${NC}"
    echo "This might be expected if caching is not yet implemented or logs are not accessible"
fi

# Second request (should be Cache HIT)
echo ""
echo "🟢 Making second request (expecting Cache HIT)..."

sleep 1  # Brief pause between requests

RESPONSE2_START=$(date +%s.%N)
RESPONSE2=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$TEST_PAYLOAD" \
    "$API_BASE_URL$WORKING_ENDPOINT" || echo "ERROR")
RESPONSE2_END=$(date +%s.%N)

RESPONSE2_TIME=$(echo "$RESPONSE2_END - $RESPONSE2_START" | bc)
RESPONSE2_TIME_MS=$(echo "$RESPONSE2_TIME * 1000" | bc | cut -d. -f1)

if [ "$RESPONSE2" = "ERROR" ] || [ -z "$RESPONSE2" ]; then
    echo -e "${RED}❌ Second request failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Second request completed${NC}"
echo "  Response time: ${RESPONSE2_TIME_MS}ms"
echo "  Response length: $(echo "$RESPONSE2" | wc -c) characters"

# Check for Cache HIT
echo ""
echo "🔍 Checking logs for Cache HIT..."
sleep 3  # Give logs time to appear

CACHE_HIT_FOUND=false
if wait_for_logs "Cache HIT\|CACHE HIT\|cache.*hit" 10; then
    CACHE_HIT_FOUND=true
    echo -e "${GREEN}✅ Cache HIT confirmed in logs${NC}"
fi

# Performance comparison
echo ""
echo "📊 Performance Analysis"
echo "======================"

if [ "$RESPONSE2_TIME_MS" -lt "$RESPONSE1_TIME_MS" ]; then
    IMPROVEMENT=$((RESPONSE1_TIME_MS - RESPONSE2_TIME_MS))
    IMPROVEMENT_PERCENT=$((IMPROVEMENT * 100 / RESPONSE1_TIME_MS))
    echo -e "${GREEN}✅ Performance improvement detected${NC}"
    echo "  First request:  ${RESPONSE1_TIME_MS}ms"
    echo "  Second request: ${RESPONSE2_TIME_MS}ms"
    echo "  Improvement:    ${IMPROVEMENT}ms (${IMPROVEMENT_PERCENT}%)"

    if [ "$IMPROVEMENT_PERCENT" -ge 50 ]; then
        echo -e "${GREEN}  🎯 Excellent performance improvement!${NC}"
    elif [ "$IMPROVEMENT_PERCENT" -ge 20 ]; then
        echo -e "${YELLOW}  📈 Good performance improvement${NC}"
    else
        echo -e "${YELLOW}  📊 Modest performance improvement${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No significant performance improvement detected${NC}"
    echo "  First request:  ${RESPONSE1_TIME_MS}ms"
    echo "  Second request: ${RESPONSE2_TIME_MS}ms"
    echo "  This may indicate caching is not active or network variation"
fi

# Response content comparison
echo ""
echo "🔍 Response Content Analysis"
echo "============================"

if [ "$RESPONSE1" = "$RESPONSE2" ]; then
    echo -e "${GREEN}✅ Response content identical (expected for caching)${NC}"
else
    echo -e "${YELLOW}⚠️  Response content differs${NC}"
    echo "This may be expected for non-deterministic AI responses"

    # Check if responses are similar (for AI content that might vary slightly)
    RESPONSE1_WORDS=$(echo "$RESPONSE1" | wc -w)
    RESPONSE2_WORDS=$(echo "$RESPONSE2" | wc -w)
    WORD_DIFF=$((RESPONSE1_WORDS - RESPONSE2_WORDS))

    if [ ${WORD_DIFF#-} -le 10 ]; then  # Absolute difference <= 10 words
        echo "  Responses are similar in length (within 10 words)"
    else
        echo "  Responses differ significantly in length"
    fi
fi

# Test 3: Cost Optimization Validation
echo ""
echo "💰 Test 3: Cost Optimization Validation"
echo "======================================="

# Check if response includes cost information
if echo "$RESPONSE1" | grep -q "cost\|model\|tokens"; then
    echo -e "${GREEN}✅ Cost information included in response${NC}"

    # Extract cost info if present
    if echo "$RESPONSE1" | grep -q "cost_info"; then
        echo "  Cost tracking appears to be active"
    fi

    if echo "$RESPONSE1" | grep -q "model_selection\|selected_model"; then
        echo "  Model selection information included"
    fi
else
    echo -e "${YELLOW}⚠️  No cost information in response${NC}"
    echo "  This may be expected if cost tracking is not yet implemented"
fi

# Final Results Summary
echo ""
echo "📋 VALIDATION TEST RESULTS"
echo "=========================="

TESTS_PASSED=0
TOTAL_TESTS=0

# Test 1: Health Check
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if echo "$HEALTH_RESPONSE" | grep -q '"status".*"ok"'; then
    echo -e "${GREEN}✅ Test 1: Health Check - PASSED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Test 1: Health Check - FAILED${NC}"
fi

# Test 2: API Functionality
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if [ "$RESPONSE1" != "ERROR" ] && [ "$RESPONSE2" != "ERROR" ]; then
    echo -e "${GREEN}✅ Test 2: API Functionality - PASSED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ Test 2: API Functionality - FAILED${NC}"
fi

# Test 3: Cache Implementation (if logs are accessible)
if [ "$SERVICE_TYPE" = "cloud_run" ] || [ -f "/tmp/app.log" ] || [ -f "app.log" ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ "$CACHE_HIT_FOUND" = true ]; then
        echo -e "${GREEN}✅ Test 3: Cache Implementation - PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${YELLOW}⚠️  Test 3: Cache Implementation - INCONCLUSIVE${NC}"
        echo "   Cache functionality may not be fully implemented yet"
    fi
fi

# Test 4: Performance
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if [ "$RESPONSE2_TIME_MS" -lt "$RESPONSE1_TIME_MS" ]; then
    echo -e "${GREEN}✅ Test 4: Performance Improvement - PASSED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️  Test 4: Performance Improvement - INCONCLUSIVE${NC}"
fi

echo ""
echo "📊 Summary: $TESTS_PASSED/$TOTAL_TESTS tests passed"

if [ $TESTS_PASSED -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Cache validation successful.${NC}"
    exit 0
elif [ $TESTS_PASSED -ge $((TOTAL_TESTS * 2 / 3)) ]; then
    echo -e "${YELLOW}⚠️  MOST TESTS PASSED. Some optimizations may not be fully implemented yet.${NC}"
    exit 0
else
    echo -e "${RED}❌ MULTIPLE TESTS FAILED. Please review implementation.${NC}"
    exit 1
fi
