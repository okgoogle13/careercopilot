"""
Simplified main.py for development - focuses on core functionality
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI app
app = FastAPI(title="CareerCopilot API - Development", version="2.0.0-dev")

# Add CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# AUTH ENDPOINTS (Mock for Development)
# ============================================================================

@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    """Mock login endpoint for development"""
    email = credentials.get("email", "")
    password = credentials.get("password", "")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    # Mock successful login for any credentials
    return {
        "user": {
            "id": "user-123",
            "email": email,
            "name": email.split("@")[0].title(),
            "role": "user"
        },
        "token": f"mock-token-{email}",
        "accessToken": f"mock-token-{email}"
    }


@app.post("/api/v1/auth/register")
async def register(user_data: dict):
    """Mock registration endpoint for development"""
    email = user_data.get("email", "")
    password = user_data.get("password", "")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    # Mock successful registration
    return {
        "user": {
            "id": "user-new-123",
            "email": email,
            "name": email.split("@")[0].title(),
            "role": "user"
        },
        "token": f"mock-token-{email}",
        "accessToken": f"mock-token-{email}"
    }


@app.post("/api/v1/auth/logout")
async def logout():
    """Mock logout endpoint for development"""
    return {"message": "Logged out successfully"}


@app.get("/api/v1/auth/me")
async def get_current_user():
    """Mock get current user endpoint for development"""
    return {
        "id": "user-123",
        "email": "demo@careercopilot.com",
        "name": "Demo User",
        "role": "user"
    }


@app.get("/")
async def root():
    return {
        "message": "CareerCopilot API - Development Mode",
        "version": "2.0.0-dev",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0-dev",
        "mode": "development",
        "features": ["simplified-mode"],
    }


# Simple workflow endpoints
@app.post("/api/v1/workflows/morning")
async def morning_workflow():
    return {
        "success": True,
        "message": "Morning workflow completed",
        "jobs_found": 5,
        "promising_matches": 2,
    }


@app.get("/api/v1/workflows/status")
async def workflow_status():
    return {"active_workflows": 0, "completed_today": 1, "system_health": "good"}


# Profile endpoints
@app.get("/api/v1/profile/variations")
async def get_profile_variations():
    return [
        {
            "id": "demo-1",
            "name": "Software Engineer",
            "keywords": ["Python", "React", "FastAPI"],
            "skills": ["Backend Development", "Frontend Development", "API Design"],
        },
        {
            "id": "demo-2",
            "name": "Full Stack Developer",
            "keywords": ["JavaScript", "Node.js", "MongoDB"],
            "skills": ["Full Stack Development", "Database Design", "DevOps"],
        },
    ]


@app.post("/api/v1/profile/variations")
async def create_profile_variation():
    return {"id": "new-demo", "name": "New Profile", "keywords": [], "skills": []}


@app.put("/api/v1/profile/variations/{profile_id}")
async def update_profile_variation(profile_id: str):
    return {"id": profile_id, "name": "Updated Profile", "keywords": [], "skills": []}


@app.delete("/api/v1/profile/variations/{profile_id}")
async def delete_profile_variation(profile_id: str):
    return {"message": "Profile variation deleted"}


# User settings endpoints
@app.get("/api/v1/user/settings")
async def get_user_settings():
    return {
        "integrations": {"google_gmail": {"connected": False}},
        "voice_profile": None,
    }


# Integration endpoints
@app.get("/api/v1/integrations/google/authorize")
async def google_authorize():
    # Return an error to trigger the frontend's error handling
    from fastapi import HTTPException

    raise HTTPException(
        status_code=503,
        detail="Google integration not available in development mode. This is a mock backend - integration features are disabled.",
    )


@app.post("/api/v1/integrations/google/disconnect")
async def google_disconnect():
    return {"message": "Successfully disconnected (mock)"}


@app.post("/api/v1/integrations/google/scan-emails")
async def scan_emails():
    return {"message": "Email scan completed (mock) - found 3 opportunities"}


# Settings endpoints
@app.put("/api/v1/settings/theme")
async def update_theme():
    return {"message": "Theme updated successfully"}


# Template endpoints
@app.post("/api/v1/templates/select")
async def select_template(template_data: dict):
    """Handle template selection and initiate document generation"""
    template_id = template_data.get("templateId")
    template_data.get("userData", {})
    job_description = template_data.get("jobDescription", "")

    return {
        "success": True,
        "message": f"Template '{template_id}' selected successfully",
        "templateId": template_id,
        "generationId": f"gen-{template_id}-12345",
        "status": "processing",
        "estimatedTime": "30 seconds",
        "previewUrl": f"/api/v1/documents/preview/{template_id}",
        "jobDescription": job_description,
    }


@app.get("/api/v1/documents/preview/{template_id}")
async def get_document_preview(template_id: str):
    """Get document preview for a template"""
    return {
        "templateId": template_id,
        "previewHtml": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                John Doe
            </h2>
            <p style="color: #666; margin-bottom: 20px;">Software Engineer | {template_id.replace('-', ' ').title()}</p>

            <h3 style="color: #1e40af; margin-top: 30px;">Experience</h3>
            <div style="margin-bottom: 15px;">
                <strong>Senior Developer</strong> - Tech Corp (2020-2024)
                <ul style="margin-top: 5px; color: #333;">
                    <li>Led development of scalable web applications</li>
                    <li>Managed team of 5 developers</li>
                    <li>Improved system performance by 40%</li>
                </ul>
            </div>

            <h3 style="color: #1e40af; margin-top: 30px;">Skills</h3>
            <p style="color: #333;">JavaScript, React, Node.js, Python, AWS, Docker, Git</p>

            <div style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-left: 4px solid #1e40af;">
                <p style="margin: 0; color: #1e40af; font-weight: bold;">Template: {template_id.replace('-', ' ').title()}</p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Generated with CareerCopilot AI</p>
            </div>
        </div>
        """,
        "generatedAt": "2024-08-26T19:30:00Z",
    }


# Documents endpoints
@app.get("/api/v1/documents")
async def get_documents():
    return [
        {
            "id": "demo-doc-1",
            "originalFilename": "resume_v1.pdf",
            "createdAt": {"_seconds": 1640995200},
        }
    ]


# Opportunities endpoints
@app.get("/api/v1/opportunities")
async def get_opportunities():
    return [
        {
            "id": "opp-1",
            "title": "Senior Software Engineer",
            "company": "Tech Corp",
            "deadline": "2024-03-15",
            "source_url": "https://example.com/job/1",
            "calendarEventId": "cal-123",
        },
        {
            "id": "opp-2",
            "title": "Full Stack Developer",
            "company": "Startup Inc",
            "deadline": "2024-03-20",
            "source_url": "https://example.com/job/2",
        },
        {
            "id": "opp-3",
            "title": "Frontend Developer",
            "company": "Design Co",
            "deadline": "2024-03-25",
            "source_url": "https://example.com/job/3",
        },
    ]


# Voice Profile endpoints
@app.post("/api/v1/profile/generate-voice-profile")
async def generate_voice_profile():
    # Simulate processing time
    import asyncio

    await asyncio.sleep(1)

    return {
        "tone": ["professional", "confident", "detail-oriented"],
        "common_phrases": [
            "results-driven",
            "collaborative approach",
            "innovative solutions",
            "strategic thinking",
        ],
        "skill_keywords": [
            "leadership",
            "problem-solving",
            "technical expertise",
            "project management",
        ],
    }


# KSC Generation endpoints
@app.post("/api/v1/ksc/generate")
async def generate_ksc():
    # Simulate processing time
    import asyncio

    await asyncio.sleep(2)

    return {
        "message": "KSC statements generated successfully!",
        "generated_statements": [
            "Demonstrated strong leadership skills by managing cross-functional teams of 5-8 members",
            "Applied advanced problem-solving techniques to reduce system downtime by 40%",
            "Implemented scalable software solutions using modern frameworks and best practices",
        ],
    }


# Analysis endpoints
@app.post("/api/v1/analysis/ats-score")
async def analyze_ats_score():
    # Simulate processing time
    import asyncio

    await asyncio.sleep(3)

    return {
        "overallScore": 85,
        "breakdown": {"keywordScore": 78, "semanticScore": 92, "formattingScore": 85},
        "matchedKeywords": [
            "Python",
            "React",
            "FastAPI",
            "leadership",
            "problem-solving",
        ],
        "missingKeywords": ["Docker", "Kubernetes", "microservices", "agile"],
        "recommendations": [
            "Add more technical keywords related to containerization",
            "Include specific project management methodologies",
            "Mention specific technologies used in recent projects",
        ],
        "keyword_placement_suggestions": [
            {
                "keyword": "Docker",
                "suggested_location": "Technical Skills section",
                "example_sentence": "Utilized Docker for containerization and deployment",
            },
            {
                "keyword": "agile",
                "suggested_location": "Professional Experience",
                "example_sentence": "Led development teams using agile methodologies",
            },
        ],
    }


# Document download endpoints
@app.get("/api/v1/documents/{document_id}/download-pdf")
async def download_document_pdf(document_id: str):
    from fastapi import Response

    # Return a mock PDF response
    pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Mock PDF Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000100 00000 n \n0000000178 00000 n \n trailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n268\n%%EOF"

    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=document_{document_id}.pdf"},
    )


# Development endpoint to test the new features
@app.get("/api/v1/features")
async def available_features():
    return {
        "production_infrastructure": {
            "database": "planned",
            "authentication": "planned",
            "docker": "available",
        },
        "advanced_intelligence": {
            "multi_agent": "planned",
            "ml_analysis": "planned",
            "market_intelligence": "planned",
        },
        "status": "Phase 1+2 implementation complete but running in simple mode for development",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
