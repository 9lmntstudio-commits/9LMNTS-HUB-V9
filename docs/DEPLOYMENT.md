# 📦 Deployment Guide - 9LMNTS Studio

## Deployment Platforms

9LMNTS Studio can be deployed to:
- **Vercel** (Recommended for Next.js)
- **Netlify** (Recommended for static sites)
- **AWS** (For advanced users)

## Vercel Deployment

### Option 1: Automatic (GitHub)

1. Create Vercel account at https://vercel.com
2. Install Vercel GitHub integration
3. Grant access to repository
4. Set environment variables in Vercel dashboard:
   - `VITE_API_KEY`
   - `VITE_WEBHOOK_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Commit to main branch
6. Vercel automatically builds and deploys

### Option 2: Manual CLI

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
npm run build
vercel --prod
```

## Netlify Deployment

### Option 1: Automatic (GitHub)

1. Create Netlify account at https://netlify.com
2. Connect GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Set environment variables in Netlify dashboard
5. Deploy triggers automatically on push

### Option 2: Manual CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run build
netlify deploy --prod --dir=build
```

## Environment Variables

Set these in your deployment platform:

```
VITE_API_KEY=your_openai_key
VITE_WEBHOOK_URL=https://your-n8n-instance/webhook
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
DATABASE_PATH=/var/data/analytics.db
```

## Backend Automation

### Python Automation Server

Deploy automation server separately:

**Heroku:**
```bash
# Create Procfile
echo "web: python automation/main.py server 0.0.0.0:$PORT" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**AWS Lambda:**
```bash
# Package automation
pip install -r requirements.txt -t package

# Create function in AWS Lambda
# Upload package as zip
# Set handler: automation.main.handler
```

## CI/CD Pipeline

GitHub Actions automatically:
1. Tests on all commits
2. Builds on main branch
3. Deploys to Vercel on main branch
4. Deploys to Netlify on main branch

View status in `.github/workflows/`

## Pre-deployment Checklist

- [ ] All environment variables set
- [ ] `.env` file not committed
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Automation test passes: `python automation/main.py test`
- [ ] Database migrations applied
- [ ] API keys rotated
- [ ] SSL certificate valid
- [ ] CDN configured
- [ ] Analytics tracking added

## Post-deployment

1. Test production environment
2. Monitor error logs
3. Set up uptime monitoring
4. Configure alerting
5. Document any issues

## Rollback

To revert to previous deployment:

**Vercel:**
- Go to Deployments
- Click on previous build
- Click "Promote to Production"

**Netlify:**
- Go to Deploys
- Select previous deploy
- Click "Publish deploy"

## Performance Optimization

### Frontend
- Enable compression in build
- Optimize images
- Code splitting enabled by default
- Tree-shaking enabled

### Backend
- Database connection pooling
- Caching for API calls
- Async/await for concurrent requests

## Monitoring

Monitor these metrics:
- Page load time
- API response time
- Error rate
- Database query time
- Webhook delivery rate

## Support

For deployment issues:
1. Check deployment logs
2. Verify environment variables
3. Check GitHub Actions workflows
4. Review platform status pages
