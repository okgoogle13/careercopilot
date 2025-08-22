# Careercopilot Technical Requirements Specification

## 1. Functional Requirements

### 1.1 User Authentication & Profile Management
- **REQ-1.1.1**: System shall authenticate users via Firebase Authentication using email/password
- **REQ-1.1.2**: System shall create user profiles with personal information, skills, and experience
- **REQ-1.1.3**: System shall allow users to upload and parse existing resume documents (PDF, DOCX)
- **REQ-1.1.4**: System shall store multiple profile variations for different role types
- **REQ-1.1.5**: System shall maintain version history of profile changes

### 1.2 Document Generation
- **REQ-1.2.1**: System shall generate tailored resumes based on job descriptions and user profiles
- **REQ-1.2.2**: System shall generate personalized cover letters matching user's voice and style
- **REQ-1.2.3**: System shall create Key Selection Criteria (KSC) responses using STAR methodology
- **REQ-1.2.4**: System shall apply consistent branding themes across all generated documents
- **REQ-1.2.5**: System shall export all documents as professionally formatted PDFs

### 1.3 ATS Analysis & Optimization  
- **REQ-1.3.1**: System shall score resumes against job descriptions using ATS algorithms
- **REQ-1.3.2**: System shall provide keyword analysis with matched/missing terms
- **REQ-1.3.3**: System shall generate actionable recommendations for document improvement
- **REQ-1.3.4**: System shall track ATS score improvements over document iterations

### 1.4 Proactive Job Management
- **REQ-1.4.1**: System shall monitor user's Gmail for job opportunity emails
- **REQ-1.4.2**: System shall create Google Calendar reminders for application deadlines
- **REQ-1.4.3**: System shall extract job details from email content automatically
- **REQ-1.4.4**: System shall notify users of new opportunities via email/push notifications

### 1.5 Theme & Branding Management
- **REQ-1.5.1**: System shall provide 8-10 professional document themes
- **REQ-1.5.2**: System shall apply selected theme consistently across all documents
- **REQ-1.5.3**: System shall maintain theme preferences per user
- **REQ-1.5.4**: System shall preserve theme formatting in PDF exports

## 2. Non-Functional Requirements

### 2.1 Performance Requirements
- **REQ-2.1.1**: Document generation shall complete within 30 seconds for standard documents
- **REQ-2.1.2**: ATS analysis shall return results within 10 seconds
- **REQ-2.1.3**: API responses shall have mean response time < 2 seconds
- **REQ-2.1.4**: PDF generation shall complete within 15 seconds
- **REQ-2.1.5**: System shall support concurrent users up to 100 during peak hours

### 2.2 Scalability Requirements
- **REQ-2.2.1**: Backend services shall auto-scale based on demand
- **REQ-2.2.2**: Database shall handle up to 10,000 user profiles
- **REQ-2.2.3**: File storage shall accommodate 1TB of user documents
- **REQ-2.2.4**: System shall maintain performance with 50% user growth annually

### 2.3 Reliability Requirements  
- **REQ-2.3.1**: System uptime shall be minimum 99.5%
- **REQ-2.3.2**: Data backup shall occur automatically every 24 hours
- **REQ-2.3.3**: Service recovery shall complete within 15 minutes of failure
- **REQ-2.3.4**: All user data shall have redundancy across multiple regions

### 2.4 Security Requirements
- **REQ-2.4.1**: All data transmission shall use HTTPS encryption
- **REQ-2.4.2**: User data shall be encrypted at rest using AES-256
- **REQ-2.4.3**: API access shall require valid JWT authentication tokens
- **REQ-2.4.4**: System shall comply with Australian Privacy Principles
- **REQ-2.4.5**: Temporary files shall be automatically deleted after 24 hours

### 2.5 Usability Requirements
- **REQ-2.5.1**: Web application shall be responsive for mobile and desktop
- **REQ-2.5.2**: Document generation shall provide progress indicators
- **REQ-2.5.3**: Error messages shall be user-friendly and actionable
- **REQ-2.5.4**: System shall provide contextual help and tooltips

## 3. Technical Stack Requirements

### 3.1 Frontend Technology
- **React 18+** with TypeScript for type safety
- **Vite** for build tooling and development server
- **Firebase SDK v9+** for authentication and client services
- **Material-UI or Tailwind CSS** for consistent UI components
- **React Query/TanStack Query** for API state management

### 3.2 Backend Technology
- **Python 3.11+** with FastAPI framework
- **Firebase Admin SDK** for server-side Firebase integration
- **Pydantic** for request/response validation
- **Uvicorn** as ASGI server
- **Google Cloud Client Libraries** for GCP services

### 3.3 AI/ML Technology  
- **Firebase Genkit** for AI workflow orchestration
- **Google Gemini API** for content generation
- **Google LangExtract** for structured information extraction
- **Google Text Embedding API** for semantic analysis
- **OpenAI API** as fallback/alternative model
- **Anthropic Claude** for complex reasoning tasks

### 3.4 Infrastructure Technology
- **Google Cloud Platform** as primary cloud provider
- **Firebase Hosting** for web application deployment
- **Cloud Run** for containerized backend deployment  
- **Cloud Firestore** as primary database
- **Cloud Storage** for file storage
- **Cloud Scheduler** for automated tasks
- **Cloud Build** for CI/CD pipeline

## 4. API Specification

### 4.1 Authentication Endpoints
```
POST /auth/verify-token
  Headers: Authorization: Bearer {firebase_token}
  Response: { "uid": string, "email": string }

GET /auth/user-profile
  Headers: Authorization: Bearer {firebase_token}
  Response: UserProfile
```

### 4.2 Profile Management Endpoints
```
GET /api/profiles
  Response: { "profiles": ProfileSummary[] }

POST /api/profiles
  Body: CreateProfileRequest
  Response: Profile

PUT /api/profiles/{profileId}
  Body: UpdateProfileRequest  
  Response: Profile

POST /api/documents/upload
  Body: multipart/form-data (file)
  Response: { "documentId": string, "parsed": ParsedContent }
```

### 4.3 Document Generation Endpoints
```
POST /api/resumes/generate
  Body: {
    "profileId": string,
    "jobDescription": string,
    "templateType": string
  }
  Response: { "documentId": string, "downloadUrl": string }

POST /api/cover-letters/generate
  Body: {
    "profileId": string,
    "jobDescription": string,
    "companyName": string
  }
  Response: { "documentId": string, "downloadUrl": string }

POST /api/ksc/generate
  Body: {
    "profileId": string,
    "criteria": SelectionCriteria[]
  }
  Response: { "documentId": string, "downloadUrl": string }
```

### 4.4 Analysis Endpoints
```
POST /api/analysis/ats-score
  Body: {
    "resumeText": string,
    "jobDescription": string
  }
  Response: {
    "score": number,
    "breakdown": ScoreBreakdown,
    "recommendations": string[]
  }

POST /api/analysis/keywords
  Body: {
    "documentText": string,
    "jobDescription": string
  }
  Response: {
    "matched": string[],
    "missing": string[],
    "suggestions": KeywordSuggestion[]
  }
```

### 4.5 Job Management Endpoints
```
GET /api/jobs/opportunities
  Response: { "opportunities": JobOpportunity[] }

POST /api/jobs/monitor/setup
  Body: { "emailFilters": string[], "keywords": string[] }
  Response: { "monitoringId": string }

POST /api/jobs/apply
  Body: {
    "jobId": string,
    "documents": string[],
    "message": string
  }
  Response: { "applicationId": string }
```

## 5. Database Schema

### 5.1 Firestore Collections

#### Users Collection: `/users/{uid}`
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  personalInfo: {
    fullName: string,
    phone: string,
    address: string,
    linkedIn?: string,
    portfolio?: string
  },
  preferences: {
    themeId: string,
    defaultLocation: string,
    targetIndustries: string[]
  },
  voiceProfile: {
    tone: 'professional' | 'conversational' | 'formal',
    commonPhrases: string[],
    writingStyle: 'concise' | 'detailed' | 'balanced'
  },
  metadata: {
    created: timestamp,
    lastLogin: timestamp,
    version: string
  }
}
```

#### Profiles Subcollection: `/users/{uid}/profiles/{profileId}`
```javascript
{
  id: string,
  name: string, // "AOD Worker", "Housing Support", etc.
  type: 'master' | 'specialized',
  summary: string,
  skills: {
    technical: string[],
    soft: string[],
    certifications: string[]
  },
  experience: [{
    title: string,
    company: string,
    startDate: timestamp,
    endDate?: timestamp,
    description: string,
    achievements: string[],
    skills: string[]
  }],
  education: [{
    degree: string,
    institution: string,
    graduationDate: timestamp,
    gpa?: number
  }],
  metadata: {
    created: timestamp,
    updated: timestamp,
    version: number
  }
}
```

#### Documents Subcollection: `/users/{uid}/documents/{documentId}`
```javascript
{
  id: string,
  type: 'resume' | 'cover_letter' | 'ksc' | 'template',
  name: string,
  profileId: string,
  jobTitle?: string,
  companyName?: string,
  content: {
    sections: DocumentSection[],
    formatting: FormattingOptions,
    theme: string
  },
  analysis: {
    atsScore?: number,
    keywords: string[],
    recommendations: string[]
  },
  files: {
    pdfUrl?: string,
    docxUrl?: string
  },
  metadata: {
    created: timestamp,
    updated: timestamp,
    status: 'draft' | 'final' | 'archived'
  }
}
```

#### Applications Subcollection: `/users/{uid}/applications/{applicationId}`
```javascript
{
  id: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  source: 'gmail' | 'manual' | 'job_board',
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'accepted',
  documents: {
    resumeId: string,
    coverLetterId?: string,
    kscId?: string
  },
  deadlines: {
    applicationDeadline?: timestamp,
    interviewDate?: timestamp
  },
  integrations: {
    calendarEventId?: string,
    emailThreadId?: string
  },
  metadata: {
    created: timestamp,
    updated: timestamp,
    appliedDate?: timestamp
  }
}
```

### 5.2 Cloud Storage Structure
```
/users/{uid}/
  ├── uploads/
  │   ├── resumes/
  │   ├── cover_letters/
  │   └── certificates/
  ├── generated/
  │   ├── resumes/{documentId}.pdf
  │   ├── cover_letters/{documentId}.pdf
  │   └── ksc/{documentId}.pdf
  └── templates/
      └── custom_themes/
```

## 6. Integration Requirements

### 6.1 Google Services Integration
- **Gmail API**: Read access for job opportunity detection
- **Google Calendar API**: Create and manage application reminders  
- **Google Drive API**: Optional backup of generated documents
- **Google Cloud Translation API**: Multi-language support (future)

### 6.2 AI Service Integration
- **Firebase Genkit**: Primary AI workflow orchestration
- **Google Gemini API**: Content generation and analysis
- **Google LangExtract**: Document parsing and entity extraction
- **Google Embeddings API**: Semantic similarity analysis
- **OpenAI API**: Fallback content generation
- **Anthropic Claude API**: Complex reasoning and analysis

### 6.3 Third-Party Integrations
- **PDF Generation Service**: HTML to PDF conversion
- **Email Service**: SendGrid or similar for notifications
- **Monitoring Service**: DataDog or Google Cloud Monitoring
- **Error Tracking**: Sentry for error monitoring

## 7. Deployment Requirements

### 7.1 Environment Configuration
- **Development**: Local Firebase emulators + Cloud Run local
- **Staging**: Dedicated GCP project with limited resources
- **Production**: Full GCP project with auto-scaling enabled

### 7.2 CI/CD Pipeline Requirements
- **Source Control**: Git with GitHub/GitLab
- **Build Pipeline**: Cloud Build triggered on main branch
- **Testing**: Automated unit and integration tests
- **Deployment**: Blue-green deployment strategy
- **Rollback**: Automatic rollback on health check failures

### 7.3 Infrastructure as Code
- **Terraform**: Infrastructure provisioning and management
- **Cloud Build**: Build and deployment automation
- **Docker**: Containerization for consistent deployments
- **Kubernetes/Cloud Run**: Container orchestration

### 7.4 Monitoring & Observability
- **Cloud Monitoring**: System metrics and alerts
- **Cloud Logging**: Centralized log aggregation
- **Error Reporting**: Automatic error detection and alerting
- **Cloud Trace**: Distributed tracing for performance analysis

## 8. Compliance & Legal Requirements

### 8.1 Data Privacy
- **GDPR Compliance**: Right to access, correct, and delete data
- **Australian Privacy Act**: Compliance with Privacy Principles
- **Data Retention**: Configurable retention policies
- **Data Portability**: Export user data in standard formats

### 8.2 Security Compliance
- **SOC 2 Type II**: Security and availability controls
- **ISO 27001**: Information security management
- **Regular Security Audits**: Third-party security assessments
- **Vulnerability Scanning**: Automated security scanning

### 8.3 Accessibility Requirements
- **WCAG 2.1 AA**: Web accessibility compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Compatible with assistive technologies
- **Color Contrast**: Minimum 4.5:1 contrast ratio

## 9. Success Criteria

### 9.1 Technical Success Metrics
- **System Uptime**: ≥ 99.5% availability
- **Response Time**: < 2 seconds for 95% of API calls
- **Document Generation**: < 30 seconds completion time
- **Error Rate**: < 0.1% of all requests

### 9.2 User Experience Metrics
- **Document Quality**: ATS score improvement ≥ 20% on average
- **User Satisfaction**: ≥ 4.5/5 rating
- **Task Completion**: ≥ 90% successful document generation
- **User Retention**: ≥ 80% monthly active users after 3 months

### 9.3 Business Metrics
- **User Adoption**: 500+ registered users within 6 months
- **Document Generation**: 10,000+ documents generated annually
- **Cost Efficiency**: Cloud costs < $10 per active user per month
- **Support Load**: < 2% of users require support intervention