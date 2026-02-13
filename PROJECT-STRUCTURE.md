# 🚀 PROJECT STRUCTURE - 9LMNTS Studio

## Directory Overview

```
9lmnts-studio/
│
├── 📁 src/                           ← FRONTEND (React/TypeScript)
│   ├── components/                   React components
│   ├── pages/                        Page components
│   ├── types/                        TypeScript interfaces
│   ├── utils/                        Utility functions
│   ├── styles/                       CSS stylesheets
│   ├── App.tsx                       Main app component
│   └── main.tsx                      Entry point
│
├── 📁 automation/                    ← BACKEND (Python Automation)
│   ├── config.py                     Configuration management
│   ├── main.py                       Entry point (run this!)
│   ├── handlers/                     Processing modules
│   │   ├── lead_processor.py         Lead qualification
│   │   ├── api_manager.py            API integrations
│   │   └── notifications.py          Email notifications
│   ├── workflows/                    n8n workflows
│   │   └── n8n-complete.json         Main automation flow
│   └── __init__.py
│
├── 📁 ai-agents/                     ← AI INTEGRATIONS
│   ├── base_agent.py                 Abstract agent class
│   ├── openai_agent.py               OpenAI integration
│   ├── gemini_agent.py               Google Gemini
│   ├── figma_agent.py                Figma design automation
│   ├── notion_agent.py               Notion database sync
│   ├── calendar_integration.py       Google Calendar
│   ├── alternative_agents.py         Alternative agents
│   └── requirements.txt              Python dependencies
│
├── 📁 loa-core/                      ← LOA API INTEGRATION
│   ├── loa_api.py                    LOA API wrapper
│   ├── lead_qualifier.py             Lead qualification
│   └── requirements.txt              Dependencies
│
├── 📁 netlify/                       ← SERVERLESS (Netlify Functions)
│   ├── functions/
│   │   ├── n8n-webhook.js            Webhook handler
│   │   └── submit-lead.js            Lead submission
│   ├── netlify.toml                  Netlify config
│   └── redirects.toml                URL redirects
│
├── 📁 supabase/                      ← DATABASE CONFIG
│   └── schema.sql                    Database schema
│
├── 📁 .github/                       ← CI/CD (GitHub Actions)
│   └── workflows/
│       ├── deploy-vercel.yml         Vercel deployment
│       ├── deploy-netlify.yml        Netlify deployment
│       └── tests.yml                 Testing workflow
│
├── 📁 docs/                          ← DOCUMENTATION
│   ├── SETUP.md                      Setup instructions
│   ├── DEPLOYMENT.md                 Deployment guide
│   ├── ARCHITECTURE.md               System architecture
│   └── API.md                        API documentation
│
├── 📁 public/                        ← STATIC ASSETS
│   └── images/                       Public images
│
├── 📁 build/                         ← BUILD OUTPUT (Generated)
│
├── 📁 node_modules/                  ← DEPENDENCIES (Generated)
│
├── 📁 logs/                          ← LOG FILES (Generated)
│
# Configuration Files
├── package.json                      npm dependencies
├── package-lock.json                 npm lock file
├── tsconfig.json                     TypeScript config
├── vite.config.ts                    Vite build config
├── tailwind.config.js                Tailwind CSS config
├── .env.example                      Environment template
├── .env                              Environment (IGNORED)
├── .gitignore                        Git ignore rules
│
# Documentation
├── README.md                         Main documentation
└── PROJECT_STRUCTURE.md              This file
```

## Key Files Explained

### Frontend (`src/`)
- **components/**: Reusable React components
  - `UnifiedStartProjectPage.tsx` - Project form modal
  - `AnalyticsDashboard.tsx` - Lead analytics
  - `UpsellSystem.tsx` - Upsell logic

- **types/**: TypeScript type definitions
  - `services.ts` - Service interfaces
  - `forms.ts` - Form data types
  - `api.ts` - API response types

- **utils/**: Helper functions
  - `serviceMapping.ts` - Service ID mapping
  - `api.ts` - API client
  - `validation.ts` - Form validation

### Backend (`automation/`)
- **config.py** - Centralized configuration for all systems
- **main.py** - Entry point (run with: `python automation/main.py`)
- **handlers/** - Modular processing logic
  - `lead_processor.py` - Qualification & scoring
  - `notifications.py` - Email sending
  - `api_manager.py` - External API calls

### AI Agents (`ai-agents/`)
- Integrations with OpenAI, Google, Figma, Notion, etc.
- Alternative agents for fallback/offline functionality
- Each agent handles a specific service

### Deployment (`netlify/` & `.github/`)
- Netlify Functions as serverless backend
- GitHub Actions for CI/CD automation
- Auto-deploy on push to main branch

### Documentation (`docs/`)
- `SETUP.md` - How to set up locally
- `DEPLOYMENT.md` - How to deploy to production
- `ARCHITECTURE.md` - System design & data flow
- `API.md` - API endpoints documentation

## Running the Project

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
```

### Backend
```bash
pip install -r requirements.txt        # Install dependencies
python automation/main.py test         # Run test
python automation/main.py server 5000  # Start server
python automation/main.py export-csv   # Export leads
```

## File Types

### Source Code
- `.tsx` - React components (TypeScript + JSX)
- `.ts` - TypeScript files
- `.py` - Python files
- `.json` - Configuration files

### Ignored Files (Not in Git)
- `.env` - Environment variables
- `node_modules/` - npm packages
- `build/` - Build output
- `logs/` - Log files
- `*.pyc` - Python compiled files
- `__pycache__/` - Python cache

## Build Outputs

### Frontend Build
- **Input**: `src/`
- **Output**: `build/` directory
- **Size**: ~300-500KB (gzipped)
- **Includes**: minified JS, CSS, optimized images

### Backend
- No separate build needed
- Runs directly with Python
- Production uses: automation/main.py

## Deployment Targets

### Frontend
- **Vercel** - Recommended (auto-deploy on push)
- **Netlify** - Auto-deploy on push
- **AWS S3 + CloudFront** - Manual deployment
- **GitHub Pages** - Static site hosting

### Backend
- **Railway** - Recommended (Python-friendly)
- **Heroku** - Python support
- **AWS Lambda** - Serverless
- **Self-hosted** - VPS or local server

## Dependencies Overview

### Frontend (`package.json`)
- react, react-dom - UI framework
- typescript - Type safety
- vite - Build tool
- tailwind - CSS framework
- @radix-ui - UI components
- react-hook-form - Form handling

### Backend (`requirements.txt`)
- requests - HTTP client
- openai - OpenAI API
- google-cloud-* - Google services
- notion-client - Notion integration
- python-dotenv - Environment config
- flask - Web framework (optional)

## Next Steps

1. **Local Development**: Follow docs/SETUP.md
2. **Make Changes**: Edit src/ and automation/ folders
3. **Test**: Run `npm run dev` and `python automation/main.py test`
4. **Deploy**: Push to GitHub → auto-deploy via Actions
5. **Monitor**: Check deployment platform dashboard

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Ready for Production
