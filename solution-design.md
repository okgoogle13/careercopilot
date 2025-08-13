# Careercopilot Solution Design Document

## Executive Summary

Careercopilot is an AI-powered career application assistant designed for job seekers transitioning into community services roles. The system provides intelligent document generation, ATS optimization, and proactive application management through a secure, scalable architecture built on Firebase and Google Cloud Platform.

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Web     │    │   FastAPI        │    │   Firebase      │
│   Frontend      │◄──►│   Backend        │◄──►│   Services      │
│                 │    │   (Cloud Run)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │              ┌────────┴────────┐
         │                        │              │                 │
         │                        │         Firestore        Cloud Storage
         │                        │              │                 │
         │                        │              │            ┌────┴────┐
         │                        │              │            │         │
         │              ┌─────────┴──────────┐   │        User Docs  Templates
         │              │                    │   │                     │
         │              │   Genkit AI        │   │                     │
         │              │   Workflows        │   │                     │
         │              │                    │   │                     │
         │              └────────────────────┘   │                     │
         │                        │              │                     │
         │                        │              │                     │
    ┌────┴────┐          ┌────────┴──────────────┴──────┐              │
    │         │          │                              │              │
Gmail API  Calendar API  │        AI Services          │              │
    │         │          │                              │              │
    │         │          │  Gemini │ Langextract │ RAG  │              │
    └─────────┘          └─────────────────────────────┘              │
                                   │                                   │
                              Vector Store                              │
                            (Firestore/JSON)                           │
                                                                       │
                         ┌─────────────────────────────────────────────┘
                         │
                    PDF Generation
                     Service
```

## User Story Implementation Mapping

### Epic 1: Profile & Master Resume Management

#### Story 1.1: Professional Profile Creation
**Implementation:**
- **Firebase Function:** `createUserProfile`
- **Genkit Flow:** `profileStructure.flow.js`
- **API Endpoints:** 
  - `POST /api/profiles` - Create new profile
  - `PUT /api/profiles/{id}` - Update profile
  - `GET /api/profiles` - List user profiles

**Workflow:**
1. User completes profile form in React frontend
2. Frontend validates and sends data to FastAPI backend
3. Backend authenticates user via Firebase Auth
4. Profile data stored in Firestore under `/users/{uid}/profiles/{profileId}`
5. AI processes profile to extract key skills and competencies

#### Story 1.2: Document Upload and Parsing  
**Implementation:**
- **Firebase Function:** `parseUploadedDocument`
- **Genkit Flow:** `documentParser.flow.js`
- **API Endpoints:**
  - `POST /api/documents/upload` - Upload document
  - `POST /api/documents/parse` - Parse existing document

**Workflow:**
1. User uploads PDF/DOCX via frontend
2. File stored in Cloud Storage
3. Langextract flow processes document to extract:
   - Skills and competencies
   - Work experience details
   - Education and qualifications
   - Contact information
4. Parsed data merged into user profile
5. Original document archived with metadata

#### Story 1.3: Resume Variations
**Implementation:**
- **Firebase Function:** `generateResumeVariation`
- **Genkit Flow:** `resumeVariations.flow.js`
- **API Endpoints:**
  - `GET /api/resume-templates` - List available templates
  - `POST /api/resumes/generate-variation` - Create variation

**Workflow:**
1. User selects template type (peer worker, housing worker, etc.)
2. System retrieves relevant skills/experience from master profile
3. AI generates tailored content for selected role type
4. Formatted resume created and stored
5. User can preview and download PDF

### Epic 2: Application Document Generation

#### Story 2.1: Tailored Resume Generation
**Implementation:**
- **Genkit Flow:** `tailoredResume.flow.js`
- **API Endpoint:** `POST /api/resumes/tailored`

**Workflow:**
1. User inputs job description and selects base profile
2. Langextract analyzes job requirements
3. AI matches user skills to job requirements
4. Resume content generated with:
   - Prioritized relevant experience
   - Keyword optimization for ATS
   - Role-specific language and terminology
5. Formatted PDF generated with selected theme

#### Story 2.2: Tailored Cover Letter Generation  
**Implementation:**
- **Genkit Flow:** `coverLetter.flow.js`
- **API Endpoint:** `POST /api/cover-letters/generate`

**Workflow:**
1. System analyzes job posting for company culture and requirements
2. AI generates personalized cover letter incorporating:
   - User's authentic voice (learned from previous documents)
   - Specific job requirements
   - Company-specific research
3. Letter reviewed for authenticity and tone matching
4. PDF generated with consistent branding

#### Story 2.3: Key Selection Criteria (KSC) Response
**Implementation:**
- **Genkit Flow:** `kscResponse.flow.js` 
- **API Endpoint:** `POST /api/ksc/generate`

**Workflow:**
1. System extracts individual criteria from job posting
2. For each criterion, AI:
   - Matches relevant experience from user profile
   - Applies STAR (Situation, Task, Action, Result) methodology
   - Generates comprehensive, specific responses
3. All responses compiled into formatted document
4. Cross-checked for consistency and authenticity

#### Story 2.4: Authentic Voice Generation
**Implementation:**
- **Genkit Flow:** `voiceProfile.flow.js`
- **Background Process:** Continuous learning from user's documents

**Workflow:**
1. System analyzes user's existing documents for writing patterns
2. AI creates voice profile capturing:
   - Tone and style preferences
   - Common phrases and expressions
   - Professional vocabulary usage
3. All generated content filtered through voice profile
4. User feedback incorporated to refine authenticity

### Epic 3: Resume Analysis & Scoring

#### Story 3.1: ATS Scoring
**Implementation:**
- **Genkit Flow:** `atsScoring.flow.js`
- **API Endpoint:** `POST /api/analysis/ats-score`

**Workflow:**
1. User uploads resume and job description
2. System performs multi-factor analysis:
   - Keyword density and matching (45% weight)
   - Semantic similarity using embeddings (35% weight)  
   - Formatting and structure (20% weight)
3. Composite score calculated with pass/fail threshold
4. Detailed breakdown provided to user

#### Story 3.2: Keyword Analysis
**Implementation:**
- **Genkit Flow:** `keywordAnalysis.flow.js`
- **API Endpoint:** `POST /api/analysis/keywords`

**Workflow:**
1. Langextract identifies key terms from job description
2. Resume analyzed for presence/absence of critical keywords
3. System generates:
   - Matched keywords list
   - Missing critical terms
   - Suggested keyword placement locations
4. Visual analysis provided via frontend dashboard

#### Story 3.3: AI Recommendations
**Implementation:**
- **Genkit Flow:** `improvementRecommendations.flow.js`
- **API Endpoint:** `GET /api/analysis/recommendations`

**Workflow:**
1. System analyzes scoring results and keyword gaps
2. AI generates specific, actionable recommendations:
   - Content additions/modifications
   - Formatting improvements
   - Skill emphasis suggestions
3. Recommendations prioritized by impact on ATS score
4. User can apply suggestions with one-click editing

### Epic 4: Branding & Theming

#### Story 4.1 & 4.2: Professional Themes and Consistency
**Implementation:**
- **Firebase Function:** `applyDocumentTheme`
- **Template Engine:** Custom PDF generation service
- **API Endpoints:**
  - `GET /api/themes` - Available themes
  - `POST /api/user/theme` - Set user theme preference

**Workflow:**
1. User selects from 8-10 predefined professional themes
2. Theme preference stored in user profile
3. All document generation applies consistent:
   - Color schemes and typography
   - Layout and formatting rules
   - Header/footer branding elements
4. Theme applied automatically to all generated documents

#### Story 4.3: PDF Generation
**Implementation:**
- **Service:** Dedicated PDF generation microservice
- **Templates:** HTML/CSS templates with dynamic content injection

**Workflow:**
1. Generated content combined with selected theme template
2. HTML rendered with dynamic data injection
3. PDF created preserving all formatting and styling
4. Document stored in Cloud Storage with access controls
5. Temporary download link provided to user

### Epic 5: Proactive Job Application Management

#### Story 5.1: Gmail Monitoring and Calendar Integration
**Implementation:**
- **Firebase Function:** `monitorJobEmails` (triggered via Cloud Scheduler)
- **Genkit Flow:** `jobOpportunityDetection.flow.js`
- **API Endpoints:**
  - `POST /api/jobs/monitor` - Setup monitoring
  - `GET /api/jobs/opportunities` - List detected jobs

**Workflow:**
1. Scheduled function checks user's Gmail for job-related emails
2. AI analyzes email content to identify legitimate opportunities
3. For each opportunity:
   - Extract job details (title, company, deadline)
   - Create application reminder in Google Calendar
   - Generate preliminary application assessment
   - Send notification to user
4. User can quick-apply using pre-generated documents

## Firebase Functions Architecture

### Core Functions

1. **Authentication & User Management**
   - `createUserOnSignup` - Initialize user profile
   - `validateUserSession` - Session validation

2. **Profile Management**  
   - `createUserProfile` - Profile creation
   - `updateUserProfile` - Profile updates
   - `parseUploadedDocument` - Document processing

3. **Document Generation**
   - `generateTailoredResume` - Resume creation
   - `generateCoverLetter` - Cover letter creation
   - `generateKSCResponse` - KSC response creation
   - `applyDocumentTheme` - Theme application

4. **Analysis & Scoring**
   - `performATSAnalysis` - ATS scoring
   - `analyzeKeywords` - Keyword analysis
   - `generateRecommendations` - Improvement suggestions

5. **Integration Functions**
   - `monitorJobEmails` - Gmail monitoring
   - `createCalendarReminders` - Calendar integration
   - `processJobOpportunity` - Opportunity processing

### Genkit Flows

1. **Content Processing Flows**
   - `documentParser.flow.js` - Document parsing with Langextract
   - `voiceProfile.flow.js` - User voice profiling
   - `keywordAnalysis.flow.js` - Keyword extraction and matching

2. **Generation Flows**
   - `tailoredResume.flow.js` - Resume generation
   - `coverLetter.flow.js` - Cover letter generation  
   - `kscResponse.flow.js` - KSC response generation
   - `resumeVariations.flow.js` - Template variations

3. **Analysis Flows**
   - `atsScoring.flow.js` - ATS analysis
   - `improvementRecommendations.flow.js` - Recommendations
   - `jobOpportunityDetection.flow.js` - Job detection

4. **RAG Flows**
   - `embedDocuments.flow.js` - Document embedding
   - `queryExperience.flow.js` - Experience retrieval
   - `contextualGeneration.flow.js` - Context-aware generation

## Data Models

### User Profile
```javascript
{
  uid: string,
  email: string,
  personalInfo: {
    name: string,
    phone: string,
    location: string,
    linkedIn: string
  },
  masterProfile: {
    summary: string,
    skills: string[],
    experience: ExperienceItem[],
    education: EducationItem[],
    certifications: string[]
  },
  preferences: {
    themeId: string,
    targetRoles: string[],
    voiceProfile: VoiceProfile
  },
  created: timestamp,
  updated: timestamp
}
```

### Generated Document
```javascript
{
  id: string,
  userId: string,
  type: 'resume' | 'cover_letter' | 'ksc',
  jobTitle: string,
  company: string,
  content: DocumentContent,
  atsScore: number,
  theme: string,
  status: 'draft' | 'final',
  downloadUrl: string,
  created: timestamp
}
```

### Job Opportunity
```javascript
{
  id: string,
  userId: string,
  source: 'gmail' | 'manual',
  title: string,
  company: string,
  description: string,
  deadline: timestamp,
  applicationStatus: 'detected' | 'in_progress' | 'applied',
  documents: DocumentReference[],
  calendarEventId: string,
  created: timestamp
}
```

## Security & Privacy

### Authentication
- Firebase Authentication with email/password
- JWT token validation on all API endpoints
- Session management with automatic refresh

### Data Protection  
- All user data encrypted at rest in Firestore
- Temporary files in Cloud Storage automatically deleted after 24 hours
- API access restricted to authenticated users only
- No client-side Firestore access (API-only architecture)

### Privacy Controls
- Users can delete all data at any time
- Document processing happens in secure, isolated environments
- No user data used for model training without explicit consent
- Compliance with Australian Privacy Principles

## Scalability & Performance

### Architecture Decisions
- API-centric design allows independent scaling of frontend and backend
- Stateless backend enables horizontal scaling
- Document generation processed asynchronously
- Caching implemented for frequently accessed templates and themes

### Performance Targets
- Document generation: < 30 seconds for standard resume/cover letter
- ATS scoring: < 10 seconds for analysis
- API response times: < 2 seconds for most endpoints
- PDF generation: < 15 seconds for formatted documents

### Monitoring
- Cloud Monitoring for function performance and errors
- Custom metrics for user engagement and satisfaction
- Automated alerts for system health and performance degradation