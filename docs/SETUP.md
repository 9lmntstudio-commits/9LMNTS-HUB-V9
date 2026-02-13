# 🚀 9LMNTS Studio - Setup Guide

## Prerequisites

- Node.js 18+ (https://nodejs.org/)
- Python 3.8+ (https://python.org/)
- Git (https://git-scm.com/)

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/9lmnts-studio.git
cd 9lmnts-studio
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
pip install -r requirements.txt
```

### 3. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with:
- OpenAI API key
- Supabase credentials
- n8n webhook URL
- Email settings

### 4. Start Development

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
python automation/main.py server
```

Visit http://localhost:5173

### 5. Test Automation

```bash
python automation/main.py test
```

## Project Structure

```
9lmnts-studio/
├── src/                 # React frontend
├── automation/          # Python automation
│   ├── config.py       # Configuration
│   ├── main.py         # Entry point
│   ├── handlers/       # Processing modules
│   └── workflows/      # n8n workflows
├── ai-agents/          # AI integrations
├── loa-core/           # LOA API
├── netlify/            # Serverless functions
├── .github/workflows/  # CI/CD
└── docs/               # Documentation
```

## Commands

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview build
```

### Backend
```bash
python automation/main.py test              # Run tests
python automation/main.py server [port]     # Start webhook server
python automation/main.py export-csv        # Export leads
python automation/main.py export-json       # Export leads
```

## Deployment

### GitHub Setup
1. Push code to GitHub
2. Set up repository secrets (VERCEL_TOKEN, NETLIFY_AUTH_TOKEN, etc.)
3. Workflows automatically deploy on push

### Manual Deploy

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod
```

## Environment Variables

Required variables in `.env`:
- `OPENAI_API_KEY` - OpenAI API key
- `N8N_WEBHOOK_URL` - n8n webhook endpoint
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anonymous key

Optional:
- `SMTP_SERVER` - Email server (for notifications)
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email password
- `GOOGLE_CALENDAR_ID` - Google Calendar for scheduling
- `GOOGLE_DRIVE_FOLDER_ID` - Google Drive for client files

## Troubleshooting

### Port already in use
```bash
# Find process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Node modules not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Python import errors
```bash
pip install -r requirements.txt --upgrade
```

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review GitHub Issues
3. Contact team@9lmntsstudio.com

## License

Proprietary - 9LMNTS Studio 2026
