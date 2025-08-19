# AGENTS.md - Careercopilot AI Agents

This document describes the AI agents and tools in the Careercopilot system. Each agent is implemented using Google's Genkit AI framework and serves specific career application automation functions.

## Agent Architecture Overview

All agents are implemented as Genkit workflows in the FastAPI backend (`/src/backend/agents/`) and orchestrated through the main application flow. They use Firebase Firestore for state management and Google Cloud Storage for document handling.

## Agents

### 1. Document Generation Agent
**Location**: `src/backend/agents/document_generator.py`
**Purpose**: Creates tailored resumes and cover letters from user profiles and job descriptions

#### Input Format
```python
{
    "user_profile": {
        "personal_info": dict,
        "experience": list,
        "skills": list,
        "education": list
    },
    "job_description": str,
    "document_type": "resume" | "cover_letter",
    "template_id": str
}
```

#### Output Format
```python
{
    "document_content": str,  # Formatted content
    "ats_score": int,        # 0-100 ATS compatibility score
    "suggestions": list,     # Optimization recommendations
    "keywords_matched": list # Job keywords successfully incorporated
}
```

#### Usage
```python
from agents.document_generator import generate_document

result = await generate_document(
    user_profile=user_data,
    job_description=job_text,
    document_type="resume"
)
```

### 2. ATS Optimization Agent
**Location**: `src/backend/agents/ats_optimizer.py`
**Purpose**: Analyzes and optimizes documents for Applicant Tracking System compatibility

#### Input Format
```python
{
    "document_content": str,
    "job_description": str,
    "optimization_level": "basic" | "standard" | "aggressive"
}
```

#### Output Format
```python
{
    "optimized_content": str,
    "ats_score": int,
    "improvements": [
        {
            "category": str,
            "suggestion": str,
            "impact": "high" | "medium" | "low"
        }
    ],
    "keyword_density": dict
}
```

### 3. Resume Parsing Agent
**Location**: `src/backend/agents/resume_parser.py`
**Purpose**: Extracts structured data from uploaded resume documents using Langextract

#### Input Format
```python
{
    "document_url": str,     # Cloud Storage URL
    "document_type": "pdf" | "docx",
    "extraction_mode": "comprehensive" | "quick"
}
```

#### Output Format
```python
{
    "personal_info": {
        "name": str,
        "email": str,
        "phone": str,
        "location": str
    },
    "experience": [
        {
            "company": str,
            "position": str,
            "start_date": str,
            "end_date": str,
            "description": str,
            "achievements": list
        }
    ],
    "skills": list,
    "education": list,
    "confidence_score": float
}
```

### 4. Job Matching Agent
**Location**: `src/backend/agents/job_matcher.py`
**Purpose**: Uses RAG to match user profiles with job opportunities and suggest improvements

#### Input Format
```python
{
    "user_profile": dict,
    "job_descriptions": list,
    "matching_criteria": {
        "min_salary": int,
        "location_preference": str,
        "remote_ok": bool,
        "experience_level": str
    }
}
```

#### Output Format
```python
{
    "matches": [
        {
            "job_id": str,
            "match_score": float,
            "missing_skills": list,
            "strong_matches": list,
            "recommendation": str
        }
    ],
    "profile_gaps": list,
    "skill_recommendations": list
}
```

### 5. Application Tracking Agent
**Location**: `src/backend/agents/application_tracker.py`
**Purpose**: Monitors application status and manages follow-up communications

#### Input Format
```python
{
    "application_id": str,
    "gmail_integration": bool,
    "calendar_integration": bool,
    "tracking_preferences": dict
}
```

#### Output Format
```python
{
    "status_updates": list,
    "follow_up_actions": [
        {
            "type": "email" | "calendar" | "reminder",
            "due_date": str,
            "content": str,
            "priority": int
        }
    ],
    "email_threads": list,
    "interview_schedules": list
}
```

### 6. Email Integration Agent
**Location**: `src/backend/agents/email_agent.py`
**Purpose**: Manages Gmail integration for application communications

#### Input Format
```python
{
    "action": "send" | "search" | "parse",
    "recipient": str,          # For send action
    "subject": str,           # For send action
    "body": str,              # For send action
    "search_query": str,      # For search action
    "thread_id": str          # For parse action
}
```

#### Output Format
```python
{
    "success": bool,
    "message_id": str,        # For send action
    "search_results": list,   # For search action
    "parsed_content": dict,   # For parse action
    "error": str             # If success is false
}
```

## Configuration

### Environment Variables
```bash
# AI Service Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GENKIT_ENV=prod
GEMINI_API_KEY=your-gemini-key

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project
FIRESTORE_DATABASE=your-database

# External API Keys
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
```

### Agent Initialization
```python
# Initialize all agents in main.py
from genkit import genkit
from agents import *

genkit.configure(
    plugins=[
        'genkit-plugins/firebase',
        'genkit-plugins/google_ai'
    ]
)
```

## Testing Agents

### Unit Tests
```bash
# Run agent-specific tests
pytest tests/agents/test_document_generator.py
pytest tests/agents/test_ats_optimizer.py
```

### Integration Tests
```bash
# Test full agent workflows
pytest tests/integration/test_agent_flows.py
```

### Manual Testing
Use the provided test scripts in `scripts/test_agents/`:
```bash
python scripts/test_agents/test_document_generation.py
python scripts/test_agents/test_job_matching.py
```

## Error Handling

All agents implement standardized error handling:
```python
{
    "success": bool,
    "error_code": str,      # If success is false
    "error_message": str,   # If success is false
    "retry_after": int      # Seconds to wait before retry
}
```

## Performance Considerations

- **Document Generation**: ~2-5 seconds per document
- **ATS Optimization**: ~1-3 seconds per document
- **Resume Parsing**: ~3-10 seconds depending on complexity
- **Job Matching**: ~5-15 seconds for batch processing
- **Email Operations**: ~1-2 seconds per action

## Development Guidelines

1. **Agent State**: Use Firestore for persistent state management
2. **Error Handling**: Implement exponential backoff for API calls
3. **Logging**: Use structured logging with correlation IDs
4. **Testing**: Write comprehensive unit tests for each agent function
5. **Documentation**: Update this file when adding new agents or modifying existing ones

## Future Agents

Planned agents for future releases:
- **Interview Preparation Agent**: AI-powered interview coaching
- **Salary Negotiation Agent**: Market analysis and negotiation strategies
- **Network Expansion Agent**: LinkedIn integration and networking recommendations
