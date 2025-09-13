# Claude.md - CareerCopilot AI Integration

## Overview
CareerCopilot is an AI-powered career application assistant built with Firebase, React, and Google Cloud Platform. This document outlines how to effectively use Claude AI within the system architecture and provides guidance for contributors working with AI components.

## AI Architecture

### Core AI Stack
- **Primary AI**: Google Genkit AI framework
- **Models**: Gemini 1.5 Flash (fast tasks) and Gemini 1.5 Pro (complex analysis)
- **Document Processing**: Langextract for resume parsing
- **Vector Storage**: Firestore/JSON for RAG implementation
- **External AI**: Claude integration for enhanced analysis and feedback

### AI Agent System
All AI agents are implemented as Genkit workflows in `/src/backend/agents/`:

#### Primary Agents
- **Document Generation Agent** (`document_generator.py`) - Creates tailored resumes and cover letters
- **ATS Optimization Agent** (`ats_optimizer.py`) - Optimizes documents for ATS compatibility
- **Resume Parsing Agent** (`resume_parser.py`) - Extracts structured data from uploaded documents
- **Job Matching Agent** (`job_matcher.py`) - Uses RAG for profile-job matching
- **Company Research Agent** - Multi-source intelligence gathering (planned)

## Working with Claude AI

### When to Use Claude vs Gemini

#### Use Claude for:
- **Complex reasoning tasks** requiring multi-step analysis
- **Creative writing** for cover letters and personal statements
- **Code review and debugging** of AI workflows
- **Strategic planning** and architecture decisions
- **User feedback analysis** and product improvement suggestions

#### Use Gemini for:
- **Document generation** at scale
- **ATS optimization** and keyword matching
- **Resume parsing** and data extraction
- **Real-time interactions** requiring low latency
- **Cost-sensitive operations** with high volume

### Claude Integration Patterns

#### 1. Analysis and Feedback
```python
# Use Claude for complex analysis tasks
async def analyze_application_strategy(user_profile, job_market_data):
    """Use Claude for strategic career advice"""
    
    analysis_prompt = f"""
    Analyze this career transition strategy:
    
    User Profile: {user_profile}
    Market Data: {job_market_data}
    
    Provide:
    • Strengths and gaps analysis
    • Recommended skill development priorities
    • Application strategy recommendations
    • Timeline for career transition
    
    Focus on actionable insights for social work/community services sector.
    """
    
    # Send to Claude API
    response = await claude_completion(analysis_prompt)
    return response
```

#### 2. Quality Assurance
```python
# Use Claude to review AI-generated content
async def review_generated_document(document_content, job_description):
    """Quality check using Claude's reasoning capabilities"""
    
    review_prompt = f"""
    Review this AI-generated resume for quality and relevance:
    
    Resume: {document_content}
    Job Description: {job_description}
    
    Evaluate:
    • Relevance to job requirements
    • Professional tone and clarity
    • ATS compatibility concerns
    • Suggestions for improvement
    
    Provide specific, actionable feedback.
    """
    
    return await claude_completion(review_prompt)
```

#### 3. Complex Research Synthesis
```python
# Use Claude for multi-source research analysis
async def synthesize_company_research(raw_research_data):
    """Synthesize complex research using Claude's reasoning"""
    
    synthesis_prompt = f"""
    Synthesize this company research into actionable insights:
    
    Data Sources: {raw_research_data}
    
    Create:
    • Executive summary of key findings
    • Application strategy recommendations
    • Interview preparation insights
    • Potential red flags or concerns
    • Cultural fit assessment
    
    Prioritize insights most relevant to job seekers.
    """
    
    return await claude_completion(synthesis_prompt)
```

## Development Guidelines

### AI Task Distribution
- **Gemini**: High-frequency, structured tasks (document generation, parsing)
- **Claude**: Low-frequency, high-complexity analysis (strategy, research synthesis)
- **Hybrid**: Use both for validation and quality assurance

### Error Handling for AI Services
```python
async def robust_ai_completion(prompt, preferred_model="gemini", fallback_to_claude=True):
    """Robust AI completion with fallback logic"""
    try:
        if preferred_model == "gemini":
            return await gemini_completion(prompt)
        else:
            return await claude_completion(prompt)
    except Exception as e:
        if fallback_to_claude and preferred_model == "gemini":
            print(f"Gemini failed, falling back to Claude: {e}")
            return await claude_completion(prompt)
        raise e
```

### Prompt Engineering Best Practices

#### For Document Generation
- Use specific formatting instructions
- Include ATS optimization requirements
- Provide clear output format specifications
- Include industry-specific context

#### For Analysis Tasks
- Structure requests with clear bullet points
- Specify confidence levels needed
- Request specific evidence for recommendations
- Include relevant background context

#### For Research Synthesis
- Provide clear data source attribution
- Request prioritized insights
- Specify target audience (job seekers)
- Include actionable next steps

### Performance Optimization

#### Cost Management
```python
# Cost-conscious AI usage
AI_USAGE_STRATEGY = {
    'document_generation': 'gemini_flash',  # High volume, low cost
    'ats_optimization': 'gemini_flash',     # Standard processing
    'complex_analysis': 'claude',           # High value, low frequency
    'research_synthesis': 'gemini_pro',     # Balanced performance/cost
    'quality_review': 'claude'              # Critical quality tasks
}
```

#### Response Caching
- Cache common AI responses (template generations, standard optimizations)
- Implement smart cache invalidation based on user profile changes
- Use vector similarity for cached response matching

## Testing AI Components

### Unit Testing AI Agents
```python
# Test AI agent outputs
async def test_document_generation():
    test_profile = {...}
    test_job = {...}
    
    result = await generate_document(test_profile, test_job)
    
    assert result['ats_score'] >= 80
    assert len(result['keywords_matched']) >= 5
    assert 'error' not in result
```

### Integration Testing
```python
# Test full AI workflow
async def test_application_workflow():
    user_data = load_test_user()
    job_data = load_test_job()
    
    # Test complete pipeline
    parsed_profile = await parse_resume(user_data['resume_url'])
    generated_doc = await generate_document(parsed_profile, job_data)
    optimized_doc = await optimize_for_ats(generated_doc, job_data)
    
    assert optimized_doc['ats_score'] > generated_doc['ats_score']
```

## Monitoring and Analytics

### AI Performance Metrics
- **Document Generation**: Success rate, ATS score improvement, user satisfaction
- **Job Matching**: Match accuracy, user engagement with suggestions
- **Research Quality**: User feedback on research utility, decision confidence improvement

### Usage Tracking
```python
# Track AI service usage and performance
AI_METRICS = {
    'gemini_requests': 0,
    'claude_requests': 0,
    'average_response_time': {},
    'user_satisfaction_scores': {},
    'cost_per_user_interaction': {}
}
```

## Future AI Enhancements

### Planned Features
- **Interview Preparation Agent**: AI-powered interview coaching using Claude's reasoning
- **Salary Negotiation Agent**: Market analysis and strategy using Claude's analytical capabilities
- **Network Expansion Agent**: LinkedIn integration with AI-powered networking recommendations

### Research Areas
- **Multimodal AI**: Integration of document visual analysis
- **Personalization**: Advanced user behavior modeling for better recommendations
- **Real-time Learning**: System improvement based on user feedback and outcomes

## Contributing to AI Components

### Adding New AI Agents
1. Create agent in `/src/backend/agents/`
2. Implement standardized input/output formats
3. Add comprehensive error handling
4. Include performance monitoring
5. Write unit and integration tests
6. Update this documentation

### Prompt Engineering Guidelines
- Test prompts with multiple scenarios
- Include edge case handling
- Optimize for both quality and cost
- Document prompt versioning and changes
- A/B test significant prompt modifications

### Code Review Checklist for AI Features
- [ ] Appropriate model selection (cost vs performance)
- [ ] Proper error handling and fallbacks
- [ ] Input validation and sanitization
- [ ] Output format consistency
- [ ] Performance monitoring instrumentation
- [ ] Test coverage for edge cases
- [ ] Documentation updates

## Getting Help

### AI-Related Issues
- **Model Performance**: Check model selection and prompt engineering
- **Cost Optimization**: Review usage patterns and caching strategies
- **Quality Issues**: Implement additional validation layers
- **Rate Limiting**: Add retry logic with exponential backoff

### Resources
- [Google Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [Firebase AI Extensions](https://firebase.google.com/products/extensions)

---

**Note**: This document should be updated as AI capabilities evolve and new agents are implemented. Always test AI components thoroughly before deployment, especially those handling user data or generating user-facing content.