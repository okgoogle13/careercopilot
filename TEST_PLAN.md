# CareerCopilot AI Cost Optimization - Test Plan

This comprehensive test plan validates the AI cost optimization features, Redis caching functionality, and overall system performance after integrating the new services.

## 🎯 Testing Objectives

1. **Functional Testing** - Ensure all core user workflows continue to work correctly
2. **Cache Validation** - Verify Redis caching provides cost savings and performance improvements
3. **Cost Validation** - Confirm AI model selection reduces expensive API calls
4. **Performance Testing** - Validate system performance and reliability
5. **Integration Testing** - Ensure seamless integration with existing features

## 📋 Pre-Test Setup Requirements

### Infrastructure Requirements
- [ ] Redis Memorystore instance provisioned and accessible
- [ ] Environment variables configured (`REDIS_URL`)
- [ ] Secrets configured in Google Secret Manager
- [ ] Application deployed with new AI services

### Test Environment Setup
```bash
# Verify Redis connectivity
redis-cli -h REDIS_HOST -p REDIS_PORT ping

# Check environment variables
echo $REDIS_URL

# Verify application health
curl https://your-app-url/health
```

### Monitoring Setup
- [ ] Google Cloud Console access configured
- [ ] Vertex AI API usage monitoring enabled
- [ ] Application logs accessible
- [ ] Redis monitoring dashboard available

---

## 🧪 Functional Testing

### Test Suite 1: Core User Workflows

#### Test 1.1: Resume Upload and Parsing
**Objective:** Verify resume parsing works with optimized AI models

**Steps:**
1. Navigate to resume upload page
2. Upload a sample PDF resume
3. Verify parsing completes successfully
4. Check extracted information is accurate

**Expected Results:**
- ✅ Resume parsed successfully
- ✅ Keywords extracted correctly
- ✅ Skills and experience identified
- ✅ No degradation in parsing quality

**Success Criteria:**
- Parsing accuracy ≥ 95% compared to baseline
- Response time ≤ 5 seconds
- Logs show appropriate model selection (`resume_parsing` → `gemini-1.5-flash`)

#### Test 1.2: Job Matching and Recommendations
**Objective:** Ensure job matching algorithm works with new AI services

**Steps:**
1. Complete user profile setup
2. Browse available job listings
3. Request job match recommendations
4. Review match scores and explanations

**Expected Results:**
- ✅ Job matches generated successfully
- ✅ Match scores are relevant and accurate
- ✅ Explanations are coherent and helpful
- ✅ Performance is acceptable

**Success Criteria:**
- Match relevance score ≥ 80%
- Response time ≤ 3 seconds
- Cost per request reduced by ≥ 50%

#### Test 1.3: Cover Letter Generation
**Objective:** Validate cover letter quality with optimized models

**Steps:**
1. Select a job posting
2. Initiate cover letter generation
3. Review generated content for quality
4. Test customization options

**Expected Results:**
- ✅ Cover letter generated successfully
- ✅ Content is relevant and professional
- ✅ Customization options work correctly
- ✅ No quality degradation

**Success Criteria:**
- Content quality rated ≥ 4/5 by reviewers
- Includes relevant job-specific keywords
- Response time ≤ 8 seconds
- Model selection: `cover_letter_generation` → `gemini-1.5-pro`

#### Test 1.4: Resume Optimization
**Objective:** Confirm resume optimization maintains quality standards

**Steps:**
1. Upload existing resume
2. Select target job posting
3. Run resume optimization
4. Compare original vs optimized versions

**Expected Results:**
- ✅ Optimization suggestions are relevant
- ✅ Updated resume maintains professional format
- ✅ Keywords appropriately integrated
- ✅ Original content preserved where appropriate

**Success Criteria:**
- ATS compatibility score improved by ≥ 20%
- Keyword match score increased
- Professional formatting maintained

#### Test 1.5: Key Selection Criteria (KSC) Response Generation
**Objective:** Verify KSC responses are generated correctly

**Steps:**
1. Input job description with specific criteria
2. Generate KSC responses
3. Review response relevance and quality
4. Test multiple criteria types

**Expected Results:**
- ✅ All criteria addressed individually
- ✅ Responses are specific and relevant
- ✅ Examples and evidence included
- ✅ Professional tone maintained

**Success Criteria:**
- Response completeness ≥ 95%
- Relevance score ≥ 4/5
- Response time ≤ 10 seconds

#### Test 1.6: Career Advice and Recommendations
**Objective:** Ensure career advice functionality works correctly

**Steps:**
1. Complete comprehensive profile
2. Request career progression advice
3. Review recommendations and action items
4. Test different career paths

**Expected Results:**
- ✅ Advice is personalized and relevant
- ✅ Action items are specific and achievable
- ✅ Multiple career paths presented
- ✅ Industry insights included

**Success Criteria:**
- Advice relevance rated ≥ 4/5
- Recommendations are actionable
- Industry data is current and accurate

#### Test 1.7: Interview Preparation
**Objective:** Validate interview preparation features

**Steps:**
1. Select job position type
2. Generate practice interview questions
3. Test answer evaluation and feedback
4. Review preparation materials

**Expected Results:**
- ✅ Questions are relevant to position
- ✅ Feedback is constructive and helpful
- ✅ Preparation materials are comprehensive
- ✅ Difficulty levels are appropriate

**Success Criteria:**
- Question relevance ≥ 90%
- Feedback quality rated ≥ 4/5
- Response time ≤ 5 seconds

---

## 🔄 Cache Validation

### Test Suite 2: Redis Caching Performance

#### Test 2.1: Cache Miss → Cache Hit Validation
**Objective:** Verify caching reduces costs and improves performance

**Test Procedure:**
1. **Start backend with visible logs:**
   ```bash
   # Enable debug logging
   export LOG_LEVEL=DEBUG
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
   ```

2. **Make initial API request (Cache MISS):**
   ```bash
   curl -X POST "https://your-app-url/api/v1/ai/extract-keywords" \
     -H "Content-Type: application/json" \
     -d '{
       "job_description": "Senior Software Engineer with Python and AWS experience"
     }'
   ```

3. **Observe logs for "Cache MISS":**
   ```
   [INFO] Cache MISS - calling LLM API cache_key=llm:a1b2c3d4 model=gemini-1.5-flash-8b
   ```

4. **Record response time and cost:**
   - Response time: _____ ms
   - Cost: $_____ USD

5. **Immediately repeat exact same request (Cache HIT):**
   ```bash
   # Same request as above
   curl -X POST "https://your-app-url/api/v1/ai/extract-keywords" \
     -H "Content-Type: application/json" \
     -d '{
       "job_description": "Senior Software Engineer with Python and AWS experience"
     }'
   ```

6. **Observe logs for "Cache HIT":**
   ```
   [INFO] Cache HIT cache_key=llm:a1b2c3d4 prompt_length=67
   ```

7. **Record improved metrics:**
   - Response time: _____ ms (should be 80-95% faster)
   - Cost: $0.000000 USD (should be $0 for cached responses)

**Success Criteria:**
- ✅ First request shows "Cache MISS" in logs
- ✅ Second request shows "Cache HIT" in logs
- ✅ Response time improvement ≥ 80%
- ✅ Cost savings = 100% for cached requests
- ✅ Response content is identical

#### Test 2.2: Cache Key Uniqueness
**Objective:** Verify different requests generate different cache keys

**Steps:**
1. Make request with prompt A
2. Make request with prompt B (different content)
3. Make request with prompt A again
4. Verify cache behavior

**Expected Results:**
- Prompt A (first time): Cache MISS
- Prompt B: Cache MISS (different cache key)
- Prompt A (second time): Cache HIT (same cache key)

#### Test 2.3: Cache TTL (Time-To-Live)
**Objective:** Verify cache entries expire correctly

**Steps:**
1. Make initial request (Cache MISS)
2. Verify cache entry exists in Redis
3. Wait for TTL expiration (default: 1 hour)
4. Make same request again
5. Verify it's treated as Cache MISS

**Redis Verification Commands:**
```bash
# Check cache entry exists
redis-cli -h REDIS_HOST -p REDIS_PORT --scan --pattern "llm:*"

# Check TTL
redis-cli -h REDIS_HOST -p REDIS_PORT TTL "llm:cache_key_here"

# Manually expire for testing
redis-cli -h REDIS_HOST -p REDIS_PORT EXPIRE "llm:cache_key_here" 1
```

#### Test 2.4: Cache Failure Graceful Degradation
**Objective:** Verify application works when Redis is unavailable

**Steps:**
1. Stop Redis instance or block network access
2. Make AI service requests
3. Verify requests complete successfully (slower, but functional)
4. Check logs for graceful fallback behavior

**Expected Behavior:**
```
[WARNING] Redis cache unavailable, falling back to no caching error=Connection refused
[INFO] Cache MISS - calling LLM API (Redis unavailable)
```

---

## 💰 Cost Validation

### Test Suite 3: Model Selection and Cost Optimization

#### Test 3.1: Task-Based Model Selection
**Objective:** Verify appropriate models are selected for different task types

**Test Matrix:**

| Task Type | Expected Model | Test Prompt | Expected Cost |
|-----------|---------------|-------------|---------------|
| `keyword_extraction` | `gemini-1.5-flash-8b` | "Extract skills from: DevOps Engineer..." | Very Low |
| `resume_parsing` | `gemini-1.5-flash` | "Parse resume content: John Doe..." | Low |
| `cover_letter_generation` | `gemini-1.5-pro` | "Generate cover letter for..." | Medium |
| `complex_reasoning` | `gemini-1.5-pro-002` | "Analyze career trajectory..." | High |

**Test Procedure:**
```python
from app.ai import dispatch_llm_call

test_cases = [
    ("keyword_extraction", "Extract skills from: DevOps Engineer with Kubernetes"),
    ("resume_parsing", "Parse this resume content..."),
    ("cover_letter_generation", "Generate a cover letter for..."),
    ("complex_reasoning", "Analyze career progression strategy...")
]

for task_type, prompt in test_cases:
    result = dispatch_llm_call(task_type, prompt[:100])  # Limit prompt length
    print(f"Task: {task_type}")
    print(f"Model: {result['model_selection']['selected_model']}")
    print(f"Cost: ${result['cost_info']['total_cost_usd']:.6f}")
    print("---")
```

**Success Criteria:**
- ✅ Correct model selected for each task type
- ✅ Cost progression: Ultra-fast < Fast < Balanced < Premium
- ✅ No unexpected model selections

#### Test 3.2: Cost Estimation Accuracy
**Objective:** Verify cost calculations are accurate

**Steps:**
1. Make requests with known token counts
2. Compare estimated costs with actual API billing
3. Validate cost calculation formulas

**Validation Data:**
```python
# Test with standardized prompt
test_prompt = "Extract keywords from this job description: " + "Software Engineer " * 50
result = dispatch_llm_call("keyword_extraction", test_prompt)

# Verify cost components
cost_info = result['cost_info']
assert cost_info['input_tokens'] > 0
assert cost_info['output_tokens'] > 0
assert cost_info['total_cost_usd'] > 0
```

#### Test 3.3: Google Cloud Console Cost Monitoring
**Objective:** Confirm cost reduction in Google Cloud Console

**Monitoring Steps:**

1. **Access Vertex AI Dashboard:**
   - Navigate to: Google Cloud Console → Vertex AI → Dashboard
   - Time range: Last 7 days

2. **Monitor API Call Distribution:**
   - Look for: "API Calls by Model"
   - Verify: Increased usage of cheaper models (`gemini-1.5-flash`, `gemini-1.5-flash-8b`)
   - Verify: Decreased usage of expensive models (`gemini-1.5-pro-002`)

3. **Check Cost Trends:**
   - Navigate to: Billing → Reports
   - Filter: Vertex AI services
   - Compare: Before/after optimization deployment

4. **Validate Cache Impact:**
   - Monitor: Total API call count
   - Expected: Reduction in total calls due to caching
   - Track: Cost per successful user request

**Expected Results:**
- ✅ 60-75% reduction in expensive model usage
- ✅ Overall cost reduction ≥ 50%
- ✅ Maintained or improved user satisfaction
- ✅ Stable error rates

---

## 🚀 Performance Testing

### Test Suite 4: System Performance and Load

#### Test 4.1: Response Time Benchmarks

**Before Optimization (Baseline):**
- Record response times for typical operations
- Measure 95th percentile response times
- Document peak load performance

**After Optimization (Target):**
- Cache HIT responses: ≤ 200ms
- Cache MISS responses: ≤ 2x baseline
- Overall 95th percentile: ≤ 1.5x baseline

#### Test 4.2: Concurrent User Load
**Objective:** Verify system handles concurrent requests efficiently

**Test Configuration:**
- Concurrent users: 50
- Test duration: 10 minutes
- Request types: Mixed (cached and non-cached)

**Success Criteria:**
- ✅ No increase in error rates
- ✅ Cache provides performance benefits under load
- ✅ Redis connection pool handles concurrent access

#### Test 4.3: Memory and Resource Usage
**Objective:** Ensure optimization doesn't increase resource consumption

**Monitoring Points:**
- Cloud Run memory usage
- Redis memory utilization
- CPU usage patterns
- Network bandwidth

---

## 🔧 Integration Testing

### Test Suite 5: End-to-End Integration

#### Test 5.1: Multi-Service Workflow
**Objective:** Test complete user journey with multiple AI services

**Scenario:** Job Application Workflow
1. Upload resume (resume parsing)
2. Search for jobs (job matching)
3. Generate cover letter (content generation)
4. Optimize resume for specific job (resume optimization)
5. Prepare for interview (interview preparation)

**Validation:**
- ✅ All services use optimized AI calls
- ✅ Cache benefits accumulate across services
- ✅ Cost savings compound throughout workflow
- ✅ User experience remains smooth

#### Test 5.2: Error Handling and Fallbacks
**Objective:** Verify robust error handling

**Test Scenarios:**
1. Redis connection failure
2. AI service timeout
3. Invalid task type
4. Malformed requests

**Expected Behavior:**
- Graceful degradation
- Informative error messages
- No data loss
- Service continues functioning

---

## 📊 Test Results Documentation

### Test Execution Checklist

#### Functional Testing Results
- [ ] Test 1.1: Resume Parsing - ✅ Pass / ❌ Fail
- [ ] Test 1.2: Job Matching - ✅ Pass / ❌ Fail
- [ ] Test 1.3: Cover Letter Generation - ✅ Pass / ❌ Fail
- [ ] Test 1.4: Resume Optimization - ✅ Pass / ❌ Fail
- [ ] Test 1.5: KSC Generation - ✅ Pass / ❌ Fail
- [ ] Test 1.6: Career Advice - ✅ Pass / ❌ Fail
- [ ] Test 1.7: Interview Preparation - ✅ Pass / ❌ Fail

#### Cache Validation Results
- [ ] Test 2.1: Cache Miss → Hit - ✅ Pass / ❌ Fail
- [ ] Test 2.2: Cache Key Uniqueness - ✅ Pass / ❌ Fail
- [ ] Test 2.3: Cache TTL - ✅ Pass / ❌ Fail
- [ ] Test 2.4: Cache Failure Fallback - ✅ Pass / ❌ Fail

#### Cost Validation Results
- [ ] Test 3.1: Model Selection - ✅ Pass / ❌ Fail
- [ ] Test 3.2: Cost Estimation - ✅ Pass / ❌ Fail
- [ ] Test 3.3: Console Monitoring - ✅ Pass / ❌ Fail

#### Performance Testing Results
- [ ] Test 4.1: Response Time Benchmarks - ✅ Pass / ❌ Fail
- [ ] Test 4.2: Concurrent Load - ✅ Pass / ❌ Fail
- [ ] Test 4.3: Resource Usage - ✅ Pass / ❌ Fail

#### Integration Testing Results
- [ ] Test 5.1: Multi-Service Workflow - ✅ Pass / ❌ Fail
- [ ] Test 5.2: Error Handling - ✅ Pass / ❌ Fail

### Performance Metrics Summary

| Metric | Before Optimization | After Optimization | Improvement |
|--------|-------------------|-------------------|-------------|
| Average Response Time | _____ ms | _____ ms | ____% |
| Cache Hit Rate | 0% | ____% | N/A |
| Cost per Request | $______ | $______ | ____% |
| Error Rate | ____% | ____% | ____% |
| 95th Percentile Response | _____ ms | _____ ms | ____% |

### Cost Analysis Summary

| Service | Old Cost/Month | New Cost/Month | Savings |
|---------|---------------|----------------|---------|
| Resume Parsing | $______ | $______ | ____% |
| Job Matching | $______ | $______ | ____% |
| Cover Letter Gen | $______ | $______ | ____% |
| Career Advice | $______ | $______ | ____% |
| **Total** | **$______** | **$______** | **____%** |

---

## 🏁 Test Completion Criteria

### Go/No-Go Decision Points

**✅ GO Criteria (Deploy to Production):**
- All functional tests pass (≥ 95% success rate)
- Cache validation demonstrates cost savings
- Cost reduction ≥ 50% confirmed in Google Cloud Console
- Performance maintains or improves user experience
- Error rates remain stable or improve
- Integration tests show system stability

**❌ NO-GO Criteria (Hold Deployment):**
- Any critical functional test failures
- Cache system unreliable or causing errors
- Performance degradation > 20%
- Cost increase or minimal savings (<30%)
- Increased error rates
- Integration issues affecting user workflows

### Sign-off Requirements

- [ ] **Technical Lead:** All tests pass, system performs as expected
- [ ] **Product Owner:** User experience maintained or improved
- [ ] **DevOps Engineer:** Infrastructure ready and monitoring configured
- [ ] **QA Engineer:** Test coverage adequate and results satisfactory

---

## 📞 Test Support and Troubleshooting

### Common Issues and Solutions

**Cache not working:**
- Verify `REDIS_URL` environment variable
- Check Redis connectivity with `redis-cli ping`
- Review application logs for connection errors

**Unexpected model selection:**
- Verify task type mapping in `model_dispatcher.py`
- Check for typos in task type strings
- Review model selection logs

**Higher than expected costs:**
- Verify cache hit rates
- Check if requests are being properly cached
- Review model selection for expensive tasks

### Contact Information

For test execution support:
- **Technical Issues:** Check application logs and Redis connectivity
- **Performance Issues:** Monitor Google Cloud Console metrics
- **Cost Analysis:** Review Vertex AI billing dashboard

---

🎯 **Test Plan Complete!** Follow this comprehensive plan to validate your AI cost optimization implementation before production deployment.