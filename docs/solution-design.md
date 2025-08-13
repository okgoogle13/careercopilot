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
...