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

@app.get("/")
async def root():
    return {
        "message": "CareerCopilot API - Development Mode", 
        "version": "2.0.0-dev",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0-dev",
        "mode": "development",
        "features": ["simplified-mode"]
    }

# Simple workflow endpoints
@app.post("/api/v1/workflows/morning")
async def morning_workflow():
    return {
        "success": True,
        "message": "Morning workflow completed",
        "jobs_found": 5,
        "promising_matches": 2
    }

@app.get("/api/v1/workflows/status")
async def workflow_status():
    return {
        "active_workflows": 0,
        "completed_today": 1,
        "system_health": "good"
    }

# Development endpoint to test the new features
@app.get("/api/v1/features")
async def available_features():
    return {
        "production_infrastructure": {
            "database": "planned",
            "authentication": "planned", 
            "docker": "available"
        },
        "advanced_intelligence": {
            "multi_agent": "planned",
            "ml_analysis": "planned",
            "market_intelligence": "planned"
        },
        "status": "Phase 1+2 implementation complete but running in simple mode for development"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)