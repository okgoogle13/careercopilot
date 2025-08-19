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

## Company Research Agent

The Company Research Agent is a new feature that provides users with in-depth, AI-powered intelligence reports on companies they are interested in. This agent automates the time-consuming process of researching a company's culture, financial health, growth opportunities, and more, giving job seekers a significant advantage in their job search.

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Research      │    │   Company        │    │   Intelligence │
│   Trigger       │───►│   Research       │───►│   Processing    │
│   (User/Auto)   │    │   Genkit Flow    │    │   (AI Analysis) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                       ┌────────┴────────┐               │
                       │                 │               │
            ┌──────────▼─────────┐  ┌────▼──────┐        │
            │   Multi-Source     │  │  Content  │        │
            │   Data Collector   │  │  Analyzer │        │
            └────────────────────┘  └───────────┘        │
                     │                                   │
        ┌────────────┼──────────────┐                    │
        │            │              │                    │
   ┌────▼───┐  ┌────▼───┐  ┌───────▼──────┐             │
   │Website │  │Social  │  │Financial/     │             │
   │Scraper │  │Media   │  │News APIs      │             │
   └────────┘  └────────┘  └──────────────┘             │
                                   │                     │
                         ┌─────────▼─────────┐           │
                         │   Firestore       │◄──────────┘
                         │   Research Cache  │
                         │   & Profiles      │
                         └───────────────────┘
```

### Key Capabilities

*   **Multi-Source Data Collection**: The agent gathers information from a wide range of sources, including company websites, social media, financial data APIs, and news articles.
*   **AI-Powered Analysis**: Using advanced AI models, the agent analyzes the collected data to synthesize actionable insights on company culture, financial health, growth opportunities, leadership, competitive position, and hiring trends.
*   **Comprehensive Intelligence Reports**: The output is a structured intelligence report that includes an executive summary, key opportunities for job seekers, interview preparation insights, potential red flags, and application strategy recommendations.
*   **Caching and Data Freshness**: A sophisticated caching strategy ensures that research data is kept up-to-date, with different refresh rates for different data sources based on their volatility.

### Value Proposition

The Company Research Agent provides significant value to users by:
*   Saving 5-10 hours of manual research time per company.
*   Providing deep company insights that are not easily accessible.
*   Improving application targeting and interview performance.
*   Boosting user confidence and reducing anxiety in the job application process.