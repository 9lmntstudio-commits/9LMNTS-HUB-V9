# 🚀 GitHub & Deployment Setup Guide

## ✅ Prerequisites Complete

Your project is now **clean, organized, and ready for professional deployment**:
- ✅ Single unified automation system (`automation/main.py`)
- ✅ Centralized configuration (`automation/config.py`)
- ✅ GitHub Actions workflows for auto-deployment
- ✅ Professional documentation in `/docs/`
- ✅ Comprehensive `.gitignore` with security rules
- ✅ All credentials removed (no temp_env.txt or temp_keys.txt)

---

## 📋 Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in settings:
   - **Repository name**: `9lmnts-studio`
   - **Description**: Professional platform for AI Brand Voice, Web Design, and Event Management automation
   - **Public** or **Private**: Your choice
   - **Initialize with**: None (we have our own)
   - **Add .gitignore**: No (we have it)
   - **Add license**: MIT (recommended)

3. Click **Create repository**

---

## 🔑 Step 2: Configure GitHub Secrets

GitHub Actions workflows need API keys and tokens. These should NEVER be committed to the repository.

### Navigate to GitHub Secrets:
```
Settings → Secrets and variables → Actions → New repository secret
```

### Add these secrets:

#### **😊 Vercel Deployment**
If deploying to Vercel: [https://vercel.com](https://vercel.com)

Get these from Vercel account:
```
VERCEL_TOKEN           = Your Vercel API token
VERCEL_ORG_ID          = Your Vercel organization ID
VERCEL_PROJECT_ID      = Your Vercel project ID
```

**How to get them:**
1. Vercel Dashboard → Settings → Tokens → Create
2. Copy the token → Add as `VERCEL_TOKEN`
3. Vercel Dashboard → Find your org ID in URL
4. Create a project first, get ID from project settings

#### **🚢 Netlify Deployment**
If deploying to Netlify: [https://netlify.com](https://netlify.com)

```
NETLIFY_AUTH_TOKEN     = Your Netlify personal access token
NETLIFY_SITE_ID        = Your site ID
```

**How to get them:**
1. Netlify → Settings → Applications → Personal access tokens → New token
2. Copy token → Add as `NETLIFY_AUTH_TOKEN`
3. Site settings → General → Site ID (use this)

#### **🔌 API Services (Used by automation)**
```
OPENAI_API_KEY              (ai-agents/openai_agent.py)
GOOGLE_GEMINI_API_KEY       (ai-agents/gemini_agent.py)
NOTION_API_KEY              (ai-agents/notion_agent.py)
SUPABASE_URL                (backend database)
SUPABASE_ANON_KEY           (backend auth)
SMTP_SERVER                 (email notifications)
SMTP_USER                   (email user)
SMTP_PASSWORD               (email password)
N8N_WEBHOOK_URL             (webhook integration)
```

**Environment Variables Format:**
Use these in your `.env` file (NOT committed):
```
# .env (not in repo - create locally)
OPENAI_API_KEY=sk-...
GOOGLE_GEMINI_API_KEY=...
NOTION_API_KEY=...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SMTP_SERVER=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
N8N_WEBHOOK_URL=https://...
```

---

## 💻 Step 3: Push Code to GitHub

In your terminal (Windows PowerShell):

```powershell
cd C:\Users\me\V9

# Check git status (should show green files ready to commit)
git status

# Initialize if not already done
git init

# Add all files
git add .

# Commit
git commit -m "feat: professional 9lmnts studio - consolidated automation, clean structure, ready for production"

# Rename branch to main (GitHub default)
git branch -M main

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/9lmnts-studio.git

# Push to GitHub
git push -u origin main
```

### ✅ Verify Push
Go to your GitHub repo URL. You should see:
- ✅ All source files pushed
- ✅ `.github/workflows/` with 3 action files
- ✅ `automation/` with clean structure
- ✅ `docs/` with 4 documentation files
- ✅ Clean README.md (from README-CLEAN.md)

---

## ⚙️ Step 4: Configure Continuous Integration

Your GitHub Actions workflows are now active. They will:

### On Every Push:
1. **Run Tests** (`.github/workflows/tests.yml`):
   - Build frontend (npm run build)
   - Test automation system
   - Verify TypeScript compilation

2. **Deploy to Vercel** (`.github/workflows/deploy-vercel.yml`):
   - Builds production version
   - Deploys to Vercel automatically
   - Creates preview URLs for PRs

3. **Deploy to Netlify** (`.github/workflows/deploy-netlify.yml`):
   - Builds production version
   - Deploys to Netlify automatically
   - Includes serverless functions

### Verify Workflows Running:
1. Go to your repo
2. Click **Actions** tab
3. You should see:
   - ✅ Test workflow (green checkmark)
   - ✅ Vercel deployment (if connected)
   - ✅ Netlify deployment (if connected)

---

## 🌐 Step 5: Connect Deployment Platforms

### **Option A: Vercel (Recommended for React/Next.js)**

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Framework: **Vite** (or your build tool)
5. Root Directory: **./** (root)
6. Build Command: `npm run build`
7. Output Directory: `dist/`
8. Add Environment Variables from your `.env`
9. Click **Deploy**

**Vercel provides:**
- ✅ Automatic deploys on push to main
- ✅ Preview URLs on every PR
- ✅ Global CDN
- ✅ Analytics
- ✅ Serverless functions support

### **Option B: Netlify (Good alternative)**

1. Go to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect GitHub → Select your repository
4. Framework: **Custom**
5. Build command: `npm run build`
6. Publish directory: `dist/`
7. Deploy function directory: `netlify/functions`
8. Add Environment Variables from your `.env`
9. Click **Deploy**

**Netlify provides:**
- ✅ Automatic deploys on push to main
- ✅ Forms & Serverless functions
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Branch deployments

### **Option C: Both (Maximum Reliability)**

Deploy to both platforms for redundancy. If one goes down, the other is live.

---

## 🧪 Step 6: Test Your Automation System

Your automation system can be tested locally before committing:

```powershell
# Test the lead processing pipeline
cd C:\Users\me\V9
python automation/main.py test

# Start the webhook server (for local testing)
python automation/main.py server

# Export processed leads to CSV
python automation/main.py export-csv

# Export processed leads to JSON
python automation/main.py export-json
```

For production on deployed site:
- Webhook URL: `https://your-vercel-site.vercel.app/webhook/leads`
- Or: `https://your-netlify-site.netlify.app/webhook/leads`
- This processes leads submitted through your forms

---

## 📊 Step 7: Set Up Monitoring

### GitHub Actions Status
View at: `https://github.com/YOUR_USERNAME/9lmnts-studio/actions`

### Deployment Status
**Vercel**: `https://vercel.com/dashboard`
**Netlify**: `https://app.netlify.com`

Monitor:
- ✅ Build status (green = success)
- ✅ Deployment history
- ✅ Performance metrics
- ✅ Error logs

---

## 🎯 Step 8: Make Your First Update

To verify everything works:

1. Edit a file (e.g., update README.md)
2. Commit and push:
   ```powershell
   git add .
   git commit -m "docs: update readme with v1.0 release notes"
   git push
   ```
3. Watch GitHub Actions run (Actions tab)
4. Verify deployment succeeds
5. Visit your live site to see changes

---

## 🔒 Security Checklist

- ✅ **No credentials in repository**
  - `.env` files in `.gitignore`
  - `temp_env.txt` and `temp_keys.txt` deleted
  - Secrets stored in GitHub only

- ✅ **Protected main branch** (Optional but recommended)
  - Settings → Branches → Add rule for `main`
  - Require PR reviews before merge
  - Require status checks to pass

- ✅ **Rotate API keys periodically**
  - Every 90 days: generate new API keys
  - Update GitHub Secrets
  - Old keys remain in `.gitignore`

---

## 📱 Environment Variables Needed

### For Frontend (React)
```
VITE_API_ENDPOINT=https://api.9lmnts.com
VITE_WEBHOOK_URL=https://your-site/webhook/leads
```

### For Backend (Python Automation)
```
OPENAI_API_KEY
GOOGLE_GEMINI_API_KEY
NOTION_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SMTP_SERVER
SMTP_USER
SMTP_PASSWORD
N8N_WEBHOOK_URL
STRIPE_API_KEY (if using payments)
PAYPAL_CLIENT_ID (if using PayPal)
```

---

## 🎯 Final Verification Checklist

Before considering deployment complete:

- [ ] GitHub repository created and code pushed
- [ ] GitHub Actions workflows showing green checkmarks
- [ ] Vercel deployed successfully
- [ ] Netlify deployed successfully
- [ ] Environment secrets configured in GitHub
- [ ] Site is live and accessible
- [ ] Webhook endpoints responding
- [ ] Forms submitting and processing leads
- [ ] Email notifications working
- [ ] CSV/JSON exports functioning
- [ ] No errors in GitHub Actions logs

---

## 🚀 You're Live!

Your site is now:
- ✅ Live on Vercel: `https://your-vercel-site.vercel.app`
- ✅ Live on Netlify: `https://your-netlify-site.netlify.app`
- ✅ Auto-deploying on every push to main
- ✅ Running tests on every commit
- ✅ Processing leads automatically
- ✅ Professionally structured
- ✅ Easy to maintain and scale

---

## 📞 Troubleshooting

### GitHub Actions Failing?
- Check **Actions** tab for error logs
- Verify GitHub Secrets are set correctly
- Check environment variables are spelled correctly
- Verify `.gitignore` doesn't exclude necessary files

### Deployment Not Updating?
- Clear browser cache (Ctrl+Shift+Delete)
- Check Vercel/Netlify dashboard for build status
- Verify GitHub Actions completed successfully
- Check for TypeScript compilation errors

### Webhook Not Working?
- Verify URL is correct in form submissions
- Check automation/main.py logs
- Verify SMTP credentials if using email
- Check N8N webhook is accessible

### Need Help?
- Check `docs/DEPLOYMENT.md` for detailed procedures
- Review `GitHub Actions` workflows in `.github/workflows/`
- Check `automation/main.py` for webhook implementation

---

## 📚 Documentation

- **Getting Started**: `docs/SETUP.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **System Architecture**: `docs/ARCHITECTURE.md`
- **Project Structure**: `PROJECT-STRUCTURE.md`
- **How to Run**: `HOW-TO-RUN.md`

---

**Status**: 🟢 Ready for Production Deployment

**Next Command**:
```
git push origin main
```

And your site will be live! 🎉
