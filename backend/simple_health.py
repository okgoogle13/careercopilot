#!/usr/bin/env python3
"""
Simple health check server for troubleshooting
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Simple Health Check")


@app.get("/health")
async def health_check():
    return JSONResponse(
        {"status": "healthy", "message": "Basic backend is running", "version": "minimal"}
    )


@app.get("/")
async def root():
    return {"message": "CareerCopilot Backend - Minimal Mode"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
