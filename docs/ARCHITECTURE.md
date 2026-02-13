# 🏗️ Project Architecture - 9LMNTS Studio

## Overview

9LMNTS Studio is a full-stack automation platform with:
- **Frontend**: React + TypeScript (Vite)
- **Backend**: Python automation system
- **Database**: Supabase (PostgreSQL)
- **Integrations**: n8n, Google Workspace, OpenAI, Notion

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              9LMNTS Studio Website                       │
│  React + TypeScript @ localhost:5173                     │
└────────────┬────────────────────────────────────────────┘
             │
             ├─────────► /api/leads (Form Submission)
             │
┌────────────▼────────────────────────────────────────────┐
│               NETLIFY FUNCTIONS                          │
│            n8n-webhook.js (Serverless)                   │
└────────────┬────────────────────────────────────────────┘
             │
             ├─────────► N8N WORKFLOW
             │     ┌─────────────────────┐
             │     │ Lead Qualification  │
             │     │ Email Notification  │
             │     │ Google Calendar     │
             │     │ Notion Database     │
             │     │ PayPal Links        │
             │     └─────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│         PYTHON AUTOMATION SYSTEM                         │
│        automation/main.py (Backend Server)               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Config        ► automation/config.py              │  │
│  │  Handlers      ► automation/handlers/              │  │
│  │  Integrations  ► ai-agents/                        │  │
│  │  API Clients   ► loa-core/                         │  │
│  └────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────┘
             │
             ├─────────► SUPABASE (PostgreSQL)
             ├─────────► OPENAI API
             ├─────────► GOOGLE WORKSPACE
             └─────────► NOTION API
```

## Frontend Architecture

```
src/
├── components/              # React Components
│   ├── UnifiedStartProjectPage.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── UpsellSystem.tsx
│   └── shared/
│
├── pages/                   # Page Components
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── Pricing.tsx
│   └── Contact.tsx
│
├── types/                   # TypeScript Types
│   ├── services.ts
│   ├── forms.ts
│   └── api.ts
│
├── utils/                   # Utilities
│   ├── serviceMapping.ts
│   ├── api.ts
│   └── validation.ts
│
└── styles/                  # Stylesheets
    └── index.css
```

## Backend Architecture

```
automation/
├── config.py                # Centralized configuration
│
├── main.py                  # Entry point & CLI
│
├── handlers/                # Processing modules
│   ├── lead_processor.py    # Lead qualification
│   ├── api_manager.py       # API integrations
│   └── notifications.py     # Email & alerts
│
└── workflows/               # n8n workflows
    └── n8n-complete.json    # Lead automation workflow

ai-agents/                   # AI Integrations
├── base_agent.py
├── openai_agent.py
├── gemini_agent.py
├── figma_agent.py
├── notion_agent.py
└── calendar_integration.py

loa-core/                    # LOA API Integration
├── loa_api.py
└── lead_qualifier.py
```

## Data Flow

### Lead Processing Flow

```
1. Website Form Submission
   ↓
2. Netlify Function (n8n-webhook.js)
   └─► Validates & forwards to n8n
   ↓
3. n8n Workflow
   └─► Qualification
   └─► Email notification
   └─► Calendar scheduling
   └─► Notion database
   ↓
4. Python Automation System
   └─► Lead processor analyzes
   └─► Generates payment link
   └─► Stores in database
   └─► Sends follow-up emails
   ↓
5. Dashboard Update
   └─► Real-time analytics
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI
- **State**: React Hooks
- **Forms**: React Hook Form

### Backend
- **Language**: Python 3.8+
- **Web Framework**: Flask
- **Database**: SQLite (local), Supabase (production)
- **API Integration**: requests, aiohttp
- **Email**: smtplib
- **Scheduling**: APScheduler

### Cloud Services
- **Frontend Hosting**: Vercel or Netlify
- **Serverless**: Netlify Functions, AWS Lambda
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI, Google Gemini
- **Automation**: n8n
- **File Storage**: Google Drive
- **Calendar**: Google Calendar
- **Notes**: Notion

## Deployment Architecture

```
GitHub Repository
    ↓
    ├─► GitHub Actions (Tests & Build)
    │
    ├─► Vercel (Frontend)
    │   └─► Production: https://9lmnts.studio
    │
    ├─► Netlify (Frontend + Functions)
    │   └─► Production: https://9lmnts-studio.netlify.app
    │
    └─► Python Backend (Railway/Heroku)
        └─► https://api.9lmnts.studio
```

## Security Architecture

### Environment Variables
- API keys in `.env` (not committed)
- Secrets in GitHub Actions
- Encrypted in deployment platforms

### Database Security
- Supabase Row Level Security (RLS)
- API key authentication
- HTTPS only

### API Security
- Webhook validation
- Rate limiting
- Input validation
- Error handling

## Scalability

### Frontend
- Static site generation
- CDN distribution
- Image optimization
- Code splitting

### Backend
- Async processing
- Database connection pooling
- Caching layer
- Load balancing

### Database
- Automated backups
- Read replicas
- Query optimization
- Connection pooling

## Monitoring

### Frontend
- Vercel/Netlify analytics
- Sentry error tracking
- Google Analytics

### Backend
- Python logging
- Exception tracking
- Performance metrics
- API monitoring

### Database
- Query logs
- Connection monitoring
- Backup verification
- Performance alerts
