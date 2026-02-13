# 9LMNTS Studio

Professional automation platform for lead generation, qualification, and conversion. Built with React, Python, n8n, and cloud integrations.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/9lmnts-studio.git
cd 9lmnts-studio

# Setup frontend
npm install
npm run dev              # http://localhost:5173

# Setup backend (in another terminal)
pip install -r requirements.txt
python automation/main.py server
```

## 📋 Features

✅ **Lead Capture** - Beautiful form with qualification
✅ **AI Qualification** - Automatic lead scoring (0-100)
✅ **Email Automation** - Confirmation & follow-up emails
✅ **Calendar Integration** - Automatic meeting scheduling
✅ **Payment Links** - Smart pricing & PayPal integration
✅ **Notion Sync** - Real-time database updates
✅ **Analytics Dashboard** - Lead tracking & metrics
✅ **n8n Workflows** - Advanced automation flows

## 📁 Project Structure

```
9lmnts-studio/
├── src/              # React frontend
├── automation/       # Python automation system
├── ai-agents/        # AI integrations
├── netlify/          # Serverless functions
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

👉 See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for detailed breakdown

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind
- **Backend**: Python + Flask + SQLite
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI + Google Gemini
- **Automation**: n8n + Google Workspace
- **Hosting**: Vercel + Netlify
- **CI/CD**: GitHub Actions

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - How to set up locally
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to Vercel/Netlify
- [Architecture](docs/ARCHITECTURE.md) - System design & data flow
- [Project Structure](PROJECT-STRUCTURE.md) - Directory layout

## 🚀 Deployment

### GitHub to Vercel (One Click)

1. Connect GitHub repository to Vercel
2. Set environment variables
3. Push to main branch
4. Auto-deployed! ✅

### GitHub to Netlify (One Click)

1. Connect GitHub repository to Netlify
2. Set environment variables
3. Push to main branch
4. Auto-deployed! ✅

See [Deployment Guide](docs/DEPLOYMENT.md) for details.

## 🔑 Environment Variables

Required (copy `.env.example` to `.env`):

```
OPENAI_API_KEY=your_key
N8N_WEBHOOK_URL=your_webhook
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

Optional:
```
GOOGLE_CALENDAR_ID=your_calendar
SMTP_SERVER=smtp.gmail.com
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

## 📊 Revenue Model

- **AI Brand Voice**: $2,000
- **Web Design**: $1,500
- **EventOS**: $1,000
- **AI Business Automation**: $3,000

**Potential**: $15K-$25K/month with 5-10 leads/week

## 🧪 Testing

```bash
# Test automation system
python automation/main.py test

# Export leads
python automation/main.py export-csv

# View logs
tail -f logs/automation.log
```

## 🔐 Security

- ✅ Environment variables (no credentials in code)
- ✅ HTTPS only
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Rate limiting
- ✅ Webhook verification

## 📞 Support

- Email: hello@9lmntsstudio.com
- Documentation: See `/docs` folder
- Issues: GitHub Issues

## 📄 License

Proprietary - 9LMNTS Studio 2026

## 🎯 Roadmap

- [ ] Stripe payment integration
- [ ] Advanced analytics
- [ ] Client portal
- [ ] Team collaboration
- [ ] Mobile app
- [ ] API for partners

---

**Status**: ✅ Production Ready
**Last Updated**: February 2026
**Version**: 1.0
